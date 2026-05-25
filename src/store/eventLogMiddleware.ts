import type { Middleware } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";
import ItemsData, { DungeonItemNames, PrizeImages, PrizeNames } from "@/data/itemData";
import { BossImages, BossNames, DungeonsData } from "@/data/dungeonData";
import type { DungeonsState } from "@/store/dungeonsSlice";
import { incrementItemCount, setItemCount, type ItemsState } from "@/store/itemsSlice";
import { addEvent, resetEventLog, type EventLogEntry } from "@/store/eventLogSlice";

type TrackerAction = {
  type?: string;
  payload?: unknown;
  meta?: {
    fromBroadcast?: boolean;
    skipEventLog?: boolean;
  };
};

interface EventLogTrackedState {
  items: ItemsState;
  dungeons: DungeonsState;
  settings: {
    bossShuffle?: string;
    eventLogMode?: string;
  };
}

type EventLogPayload = Omit<EventLogEntry, "id" | "timestamp">;
type ItemEventPayload = { itemKey: string; event?: EventLogPayload };

const ignoredActionTypes = new Set<string>([
  REMEMBER_REHYDRATED,
  addEvent.type,
  resetEventLog.type,
]);

const ITEM_EVENT_DEBOUNCE_MS = 1000;

function createItemEvent(itemKey: string, nextAmount: number): EventLogPayload {
  const isBottle = itemKey.startsWith("bottle");
  const itemData = ItemsData[(isBottle ? "bottle" : itemKey) as keyof typeof ItemsData];
  const name = itemData?.name ?? itemKey;

  let title = itemData?.levelNames?.[nextAmount - 1] ?? name;
  if (title === name && !isBottle && itemData && itemData.maxCount > 1 && nextAmount > 1) {
    title = `${name} (${nextAmount}/${itemData.maxCount})`;
  }

  // heartpiece hits 4 before wrapping back to 0
  const imageIndex = itemKey === "heartpiece" ? nextAmount : nextAmount - 1;
  const image = itemData && itemData.images[Math.min(imageIndex, itemData.images.length - 1)];

  return {
    title,
    detail: isBottle ? `Bottle ${itemKey.replace("bottle", "")}` : undefined,
    image,
  };
}

function collectItemEvents(previous: EventLogTrackedState, nextState: EventLogTrackedState, debounceManualChanges: boolean) {
  const events: ItemEventPayload[] = [];

  for (const [itemKey, nextItem] of Object.entries(nextState.items)) {
    const previousAmount = previous.items[itemKey]?.amount ?? 0;
    const nextAmount = nextItem.amount ?? 0;
    if (nextAmount === previousAmount) continue;

    const isBottle = itemKey.startsWith("bottle");

    if (debounceManualChanges) {
      events.push({
        itemKey,
        event: nextAmount > 0 ? createItemEvent(itemKey, nextAmount) : undefined,
      });
      continue;
    }

    const pickedUpBottle = previousAmount === 0 && nextAmount > 0;
    const filledEmptyBottle = previousAmount === 1 && nextAmount > 1;
    const shouldLog = isBottle
      ? pickedUpBottle || filledEmptyBottle
      : nextAmount > previousAmount;

    if (shouldLog) events.push({ itemKey, event: createItemEvent(itemKey, nextAmount) });
  }

  return events;
}

const DUNGEON_FLAG_ITEMS = [
  { key: "bigKey", title: DungeonItemNames.bigKey, image: "/dungeons/bigkey.png" },
  { key: "map", title: DungeonItemNames.map, image: "/dungeons/map.png" },
  { key: "compass", title: DungeonItemNames.compass, image: "/dungeons/compass.png" },
] as const;

function getLoggedBoss(dungeon: string, boss: string, bossShuffle?: string) {
  const isBossShuffled = Boolean(bossShuffle && bossShuffle !== "none");
  if (isBossShuffled && (boss === "unknown" || boss === "compass")) return "unknown";

  const fallbackBoss = DungeonsData[dungeon]?.boss ?? "unknown";
  return boss === "unknown" || boss === "compass" ? fallbackBoss : boss;
}

function collectDungeonEvents(previous: EventLogTrackedState, nextState: EventLogTrackedState) {
  const events: EventLogPayload[] = [];

  for (const [dungeon, nextDungeon] of Object.entries(nextState.dungeons)) {
    const previousDungeon = previous.dungeons[dungeon];
    const detail = DungeonsData[dungeon]?.name ?? dungeon;
    const previousSmallKeys = Math.max(0, (previousDungeon?.smallKeys ?? 0) + (previousDungeon?.manuallyChanged.smallKeys ?? 0));
    const nextSmallKeys = Math.max(0, nextDungeon.smallKeys + nextDungeon.manuallyChanged.smallKeys);
    const smallKeyDelta = nextSmallKeys - previousSmallKeys;

    if (smallKeyDelta > 0) {
      events.push({
        title: smallKeyDelta === 1 ? DungeonItemNames.smallKey : `${smallKeyDelta} ${DungeonItemNames.smallKey}s`,
        detail,
        image: "/dungeons/smallkey.png",
      });
    }

    for (const { key, title, image } of DUNGEON_FLAG_ITEMS) {
      if (!previousDungeon?.[key] && nextDungeon[key]) {
        events.push({ title, detail, image });
      }
    }

    if (!previousDungeon?.bossDefeated && nextDungeon.bossDefeated) {
      const boss = getLoggedBoss(dungeon, nextDungeon.boss, nextState.settings.bossShuffle);
      events.push({
        title: BossNames[boss] ?? BossNames.unknown,
        detail,
        image: BossImages[boss] ?? BossImages.unknown,
      });
    }

    if (!previousDungeon?.prizeCollected && nextDungeon.prizeCollected) {
      events.push({
        title: PrizeNames[nextDungeon.prize] ?? "Dungeon Prize",
        detail,
        image: PrizeImages[nextDungeon.prize],
      });
    }
  }

  return events;
}

export const createEventLogMiddleware = (): Middleware<object, unknown> => {
  const pendingItemEvents = new Map<string, ReturnType<typeof setTimeout>>();

  function clearPendingItemEvent(itemKey: string) {
    const pending = pendingItemEvents.get(itemKey);
    if (pending) clearTimeout(pending);
    pendingItemEvents.delete(itemKey);
  }

  function clearAllPendingItemEvents() {
    for (const pending of pendingItemEvents.values()) {
      clearTimeout(pending);
    }
    pendingItemEvents.clear();
  }

  function queueItemEvent(itemKey: string, event: EventLogPayload | undefined, dispatch: (action: ReturnType<typeof addEvent>) => void) {
    clearPendingItemEvent(itemKey);
    if (!event) return;

    const timeout = setTimeout(() => {
      pendingItemEvents.delete(itemKey);
      dispatch(addEvent(event));
    }, ITEM_EVENT_DEBOUNCE_MS);
    pendingItemEvents.set(itemKey, timeout);
  }

  return (store) => (next) => (action) => {
    const trackerAction = action as TrackerAction;
    if (trackerAction.type === resetEventLog.type) {
      clearAllPendingItemEvents();
    }

    const shouldInspect = Boolean(
      trackerAction.type
      && !trackerAction.meta?.fromBroadcast
      && !trackerAction.meta?.skipEventLog
      && !ignoredActionTypes.has(trackerAction.type),
    );
    const previous = shouldInspect ? (store.getState() as EventLogTrackedState) : undefined;
    const result = next(action);

    if (!previous) return result;

    const nextState = store.getState() as EventLogTrackedState;
    if (nextState.settings.eventLogMode === "off") {
      clearAllPendingItemEvents();
      return result;
    }

    const debounceManualItemChanges = trackerAction.type === incrementItemCount.type || trackerAction.type === setItemCount.type;
    const itemEvents = collectItemEvents(previous, nextState, debounceManualItemChanges);

    for (const { itemKey, event } of itemEvents) {
      if (debounceManualItemChanges) {
        queueItemEvent(itemKey, event, store.dispatch);
      } else if (event) {
        clearPendingItemEvent(itemKey);
        store.dispatch(addEvent(event));
      }
    }

    for (const event of collectDungeonEvents(previous, nextState)) {
      store.dispatch(addEvent(event));
    }

    return result;
  };
};
