import { afterEach, describe, expect, it, vi } from "vitest";
import { incrementItemCount, setItemCount, updateMultipleItems } from "@/store/itemsSlice";
import { incrementSmallKeyCount, resetBossesForShuffle, setBigKey, toggleDungeonBoss, updateDungeonState } from "@/store/dungeonsSlice";
import { setSettings } from "@/store/settingsSlice";
import { resetEventLog } from "@/store/eventLogSlice";
import { createTestStore } from "./renderWithStore";

afterEach(() => {
  vi.useRealTimers();
});

function createEventLogStore() {
  const store = createTestStore();
  store.dispatch(setSettings({ eventLogMode: "attached" }));
  return store;
}

describe("event log", () => {
  it("debounces manually cycled tracker items newest first", () => {
    vi.useFakeTimers();
    const store = createEventLogStore();

    store.dispatch(incrementItemCount({ itemName: "hookshot", decrement: false, skipFirstImgOnCollect: false }));
    store.dispatch(incrementItemCount({ itemName: "bow", decrement: false, skipFirstImgOnCollect: false }));

    expect(store.getState().eventLog.entries).toEqual([]);
    vi.advanceTimersByTime(1000);

    const entries = store.getState().eventLog.entries;
    expect(entries[0].title).toBe("Bow");
    expect(entries[1].title).toBe("Hookshot");
  });

  it("logs only the final landed state when an item is cycled quickly", () => {
    vi.useFakeTimers();
    const store = createEventLogStore();

    store.dispatch(incrementItemCount({ itemName: "bow", decrement: false, skipFirstImgOnCollect: false }));
    store.dispatch(incrementItemCount({ itemName: "bow", decrement: false, skipFirstImgOnCollect: false }));
    store.dispatch(incrementItemCount({ itemName: "bow", decrement: false, skipFirstImgOnCollect: false }));

    vi.advanceTimersByTime(999);
    expect(store.getState().eventLog.entries).toEqual([]);
    vi.advanceTimersByTime(1);

    expect(store.getState().eventLog.entries.map((entry) => entry.title)).toEqual(["Bow and Arrows"]);
  });

  it("logs keys and dungeon items when they are collected", () => {
    const store = createEventLogStore();

    store.dispatch(incrementSmallKeyCount({ dungeon: "ep", decrement: false }));
    store.dispatch(setBigKey({ dungeon: "ep", hasBigKey: true }));
    store.dispatch(updateDungeonState({ dungeon: "ep", newState: { map: true, compass: true, prize: "crystal", prizeCollected: true } }));

    const titles = store.getState().eventLog.entries.map((entry) => entry.title);
    expect(titles).toEqual([
      "Crystal",
      "Compass",
      "Map",
      "Big Key",
      "Small Key",
    ]);
  });

  it("logs boss kills separately from dungeon prizes", () => {
    const store = createEventLogStore();

    store.dispatch(updateDungeonState({ dungeon: "ep", newState: { bossDefeated: true, prize: "crystal", prizeCollected: true } }));

    const entries = store.getState().eventLog.entries;
    expect(entries.map((entry) => entry.title)).toEqual(["Crystal", "Armos Knights"]);
    expect(entries.map((entry) => entry.detail)).toEqual(["Eastern Palace", "Eastern Palace"]);
  });

  it("logs selected shuffled boss labels instead of default dungeon bosses", () => {
    const store = createEventLogStore();

    store.dispatch(updateDungeonState({ dungeon: "ep", newState: { boss: "mothula", bossDefeated: true } }));

    expect(store.getState().eventLog.entries[0]).toMatchObject({
      title: "Mothula",
      detail: "Eastern Palace",
      image: "/dungeons/mothula.png",
    });
  });

  it("uses a generic boss label when boss shuffle is enabled and the selected boss is unknown", () => {
    const store = createEventLogStore();

    store.dispatch(setSettings({ bossShuffle: "random" }));
    store.dispatch(resetBossesForShuffle({ bossShuffle: "random" }));
    store.dispatch(updateDungeonState({ dungeon: "ep", newState: { bossDefeated: true } }));

    expect(store.getState().eventLog.entries[0]).toMatchObject({
      title: "Boss Defeated",
      detail: "Eastern Palace",
      image: "/dungeons/unknown.png",
    });
  });

  it("does not log when a boss kill is toggled off", () => {
    const store = createEventLogStore();

    store.dispatch(toggleDungeonBoss({ dungeon: "ep" }));
    store.dispatch(toggleDungeonBoss({ dungeon: "ep" }));

    expect(store.getState().eventLog.entries.map((entry) => entry.title)).toEqual(["Armos Knights"]);
  });

  it("does not log small key decrements", () => {
    const store = createEventLogStore();

    store.dispatch(incrementSmallKeyCount({ dungeon: "ep", decrement: true }));

    expect(store.getState().eventLog.entries).toEqual([]);
  });

  it("does not log when a small key correction returns to zero", () => {
    const store = createEventLogStore();

    store.dispatch(incrementSmallKeyCount({ dungeon: "ep", decrement: true }));
    store.dispatch(incrementSmallKeyCount({ dungeon: "ep", decrement: false }));

    expect(store.getState().eventLog.entries).toEqual([]);
  });

  it("skips events when the action is tagged meta.skipEventLog", () => {
    vi.useFakeTimers();
    const store = createEventLogStore();

    store.dispatch({
      ...incrementItemCount({ itemName: "hookshot", decrement: false, skipFirstImgOnCollect: false }),
      meta: { skipEventLog: true },
    });
    vi.advanceTimersByTime(1000);

    expect(store.getState().eventLog.entries).toEqual([]);
  });

  it("clears pending debounced item events when the event log is reset", () => {
    vi.useFakeTimers();
    const store = createEventLogStore();

    store.dispatch(incrementItemCount({ itemName: "hookshot", decrement: false, skipFirstImgOnCollect: false }));
    store.dispatch(resetEventLog());
    vi.advanceTimersByTime(1000);

    expect(store.getState().eventLog.entries).toEqual([]);
  });

  it("does not collect new entries while the event log is off", () => {
    vi.useFakeTimers();
    const store = createEventLogStore();

    store.dispatch(incrementItemCount({ itemName: "hookshot", decrement: false, skipFirstImgOnCollect: false }));
    store.dispatch(setSettings({ eventLogMode: "off" }));
    vi.advanceTimersByTime(1000);
    store.dispatch(updateDungeonState({ dungeon: "ep", newState: { bossDefeated: true, prize: "crystal", prizeCollected: true } }));

    expect(store.getState().eventLog.entries).toEqual([]);
  });

  it("does not log manual item cycles that land on zero", () => {
    vi.useFakeTimers();
    const store = createEventLogStore();

    store.dispatch(setItemCount({ itemName: "mail", count: 2 }));
    store.dispatch(setItemCount({ itemName: "mail", count: 0 }));
    vi.advanceTimersByTime(1000);

    expect(store.getState().eventLog.entries).toEqual([]);
  });

  it("logs automatic bottle pickups and fills without logging bottle use or filled corrections", () => {
    const store = createEventLogStore();

    store.dispatch(updateMultipleItems({ bottle1: 1 }));
    store.dispatch(updateMultipleItems({ bottle1: 4 }));
    store.dispatch(updateMultipleItems({ bottle1: 1 }));
    store.dispatch(updateMultipleItems({ bottle1: 0 }));
    store.dispatch(updateMultipleItems({ bottle2: 5 }));
    store.dispatch(updateMultipleItems({ bottle2: 6 }));

    const entries = store.getState().eventLog.entries;
    expect(entries.map((entry) => entry.title)).toEqual(["Fairy", "Blue Potion", "Bottle"]);
    expect(entries.map((entry) => entry.detail)).toEqual(["Bottle 2", "Bottle 1", "Bottle 1"]);
  });

  it("debounces manual bottle cycling and logs the landed contents", () => {
    vi.useFakeTimers();
    const store = createEventLogStore();

    store.dispatch(setItemCount({ itemName: "bottle1", count: 1 }));
    store.dispatch(setItemCount({ itemName: "bottle1", count: 4 }));
    store.dispatch(setItemCount({ itemName: "bottle1", count: 1 }));
    store.dispatch(setItemCount({ itemName: "bottle1", count: 0 }));
    store.dispatch(setItemCount({ itemName: "bottle2", count: 5 }));
    store.dispatch(setItemCount({ itemName: "bottle2", count: 6 }));

    vi.advanceTimersByTime(1000);

    const entries = store.getState().eventLog.entries;
    expect(entries.map((entry) => entry.title)).toEqual(["Bee"]);
    expect(entries.map((entry) => entry.detail)).toEqual(["Bottle 2"]);
  });
});
