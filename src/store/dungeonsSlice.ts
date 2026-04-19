import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";
import { DungeonsData } from "@/data/dungeonData";
import type { SettingsState } from "./settingsSlice";

export const BOSSES = ["unknown", "armos", "lanmolas", "moldorm", "helmasaurking", "arrghus", "mothula", "blind", "kholdstare", "vitreous", "trinexx", "agahnim", "agahnim2", "bnc", "compass"] as const;
export const PRIZES: NonNullable<DungeonState["prize"]>[] = ["unknown", "greenPendant", "pendant", "crystal", "redCrystal"];

export interface DungeonState {
  collectedCount: number;
  bossDefeated: boolean;
  boss: typeof BOSSES[number];
  prize: "unknown" | "crystal" | "pendant" | "redCrystal" | "greenPendant" | "map";
  prizeCollected: boolean;
  smallKeys: number;
  bigKey: boolean;
  map: boolean;
  compass: boolean;
  manuallyChanged: {
    smallKeys: number;
    maxSmallKeys: number;
    bossDefeated: boolean;
    boss: boolean;
    prize: boolean;
    prizeCollected: boolean;
    bigKey: boolean;
  };
}

export interface DungeonsState {
  [key: string]: DungeonState;
}

const dungeonInitialState: DungeonState = {
  collectedCount: 0,
  bossDefeated: false,
  boss: "unknown",
  prize: "unknown",
  prizeCollected: false,
  smallKeys: 0,
  bigKey: false,
  map: false,
  compass: false,
  manuallyChanged: {
    smallKeys: 0,
    maxSmallKeys: 0,
    bossDefeated: false,
    boss: false,
    prize: false,
    prizeCollected: false,
    bigKey: false,
  },
};


const initialState: Record<string, DungeonState> = Object.keys(DungeonsData).reduce((acc, dungeon) => {
  // TODO: If boss shuffle is enabled, always set boss to unknown
  acc[dungeon] = { ...dungeonInitialState, boss: DungeonsData[dungeon].boss || "unknown" };
  return acc;
}, {} as Record<string, DungeonState>);

export const dungeonsSlice = createSlice({
  name: "dungeons",
  initialState,
  reducers: {
    setDungeonCollectedCount: (state, action: PayloadAction<{ dungeon: string; count: number }>) => {
      const { dungeon, count } = action.payload;
      state[dungeon].collectedCount = count;
    },
    toggleDungeonBoss: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      state[dungeon].bossDefeated = !state[dungeon].bossDefeated;
      state[dungeon].manuallyChanged.bossDefeated = true;
    },
    incrementSmallKeyCount: (state, action: PayloadAction<{ dungeon: string; decrement: boolean }>) => {
      const { dungeon, decrement } = action.payload;
      state[dungeon].manuallyChanged.smallKeys = state[dungeon].manuallyChanged.smallKeys + (decrement ? -1 : 1);
    },
    setMaxSmallKeys: (state, action: PayloadAction<{ dungeon: string; maxSmallKeys: number }>) => {
      const { dungeon, maxSmallKeys } = action.payload;
      state[dungeon].manuallyChanged.maxSmallKeys = maxSmallKeys;
    },
    setBigKey: (state, action: PayloadAction<{ dungeon: string; hasBigKey: boolean }>) => {
      const { dungeon, hasBigKey } = action.payload;
      state[dungeon].bigKey = hasBigKey;
      state[dungeon].manuallyChanged.bigKey = true;
    },
    togglePrizeCollected: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      state[dungeon].prizeCollected = !state[dungeon].prizeCollected;
      state[dungeon].manuallyChanged.prizeCollected = true;
    },
    resetBossesForShuffle: (state, action: PayloadAction<{ bossShuffle: SettingsState["bossShuffle"] }>) => {
      const { bossShuffle } = action.payload;
      if (bossShuffle === "none") {
        for (const dungeon of Object.keys(state)) {
          state[dungeon].boss = DungeonsData[dungeon].boss || "unknown";
        }
      } else {
        for (const dungeon of Object.keys(state)) {
          state[dungeon].boss = "unknown";
        }
      }
    },
    incrementBoss: (state, action: PayloadAction<{ dungeon: string; decrement: boolean }>) => {
      const { dungeon, decrement } = action.payload;
      const current = state[dungeon].boss;
      // Treat "compass" like "unknown" for cycling (click → armos, right-click → trinexx)
      const currentIndex = current === "compass" ? 0 : BOSSES.indexOf(current);
      const maxIndex = 10; // Exclude aga, bnc, and compass for cycling since they aren't shuffled bosses
      state[dungeon].manuallyChanged.boss = true;

      if (decrement) {
        state[dungeon].boss = currentIndex === -1 ? BOSSES[maxIndex] : BOSSES[(currentIndex - 1 + (maxIndex + 1)) % (maxIndex + 1)];
      } else {
        state[dungeon].boss = currentIndex === -1 ? BOSSES[0] : BOSSES[(currentIndex + 1) % (maxIndex + 1)];
      }
    },
    incrementPrizeCount: (state, action: PayloadAction<{ dungeon: string; decrement: boolean }>) => {
      const { dungeon, decrement } = action.payload;
      const current = state[dungeon].prize ?? "unknown";
      // Treat "map" as equivalent to "unknown" (index 0) for cycling purposes
      const currentIndex = current === "map" ? 0 : PRIZES.indexOf(current);
      const maxCount = PRIZES.length - 1;

      if (decrement) {
        state[dungeon].prize = PRIZES[(currentIndex - 1 + (maxCount + 1)) % (maxCount + 1)];
      } else {
        state[dungeon].prize = PRIZES[(currentIndex + 1) % (maxCount + 1)];
      }
      
      state[dungeon].manuallyChanged.prize = true;
    },
    updateDungeonState: (state, action: PayloadAction<{ dungeon: string; newState: Partial<DungeonState> }>) => {
      const { dungeon, newState } = action.payload;
      const current = state[dungeon];
      
      const filteredState = { ...newState };

      // Check these fields for manual changes
      // If the new state is different from current state but the field has been manually changed, don't update it 
      // (unless the new state is the same as the current state, in which case we can assume the manual change was meant to sync with the new state and we can reset the manually changed flag)
      const fields = ["bossDefeated", "bigKey", "prizeCollected", "prize"] as const;
      fields.forEach((field) => {
        if (newState[field] !== undefined) {
          const isManual = current.manuallyChanged[field as keyof typeof current.manuallyChanged];

          if (newState[field] === current[field]) {
            current.manuallyChanged[field] = false;
          } else if (isManual) {
            delete filteredState[field];
          }
        }
      });

      // Do we know the prize? If not, and the SRAM indicates we have the map, show map icom as long as the prize hasn't been manually changed to something else (other than unknown)
      if (!filteredState.prize && filteredState.map && (!current.manuallyChanged.prize || current.prize === "unknown")) {
        filteredState.prize = "map"
      }

      // If SRAM says the compass was just picked up, and we don't yet know the boss,
      // fall back to showing the compass icon (user can still manually override).
      const incomingCompass = newState.compass ?? current.compass;
      if (
        incomingCompass &&
        (current.boss === "unknown" || current.boss === "compass") &&
        !current.manuallyChanged.boss
      ) {
        filteredState.boss = "compass";
      }

      Object.assign(current, filteredState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REMEMBER_REHYDRATED, (_state, action) => {
      const rehydrated = (action as unknown as { payload: Record<string, unknown> }).payload.dungeons as Record<string, DungeonState> | undefined;
      const settings = (action as unknown as { payload: Record<string, unknown> }).payload.settings as { bossShuffle?: string } | undefined;
      const isBossShuffled = settings?.bossShuffle && settings.bossShuffle !== "none";
  
      if (!rehydrated) return initialState;
      const merged = { ...initialState };
      for (const [key, value] of Object.entries(rehydrated)) {
        if (merged[key]) {
          merged[key] = {
            ...dungeonInitialState,
            ...value,
            manuallyChanged: { ...dungeonInitialState.manuallyChanged, ...value.manuallyChanged },
          };
        }
      }
      if (isBossShuffled ) {
        for (const key of Object.keys(merged)) {
          if (!merged[key].manuallyChanged.boss){
            merged[key].boss = "unknown";
          }
        }
      }
      return merged;
    });
  },
});

export const { setDungeonCollectedCount, toggleDungeonBoss, incrementSmallKeyCount, setBigKey, incrementBoss, resetBossesForShuffle, incrementPrizeCount, togglePrizeCollected, updateDungeonState, setMaxSmallKeys } = dungeonsSlice.actions;
export default dungeonsSlice.reducer;
