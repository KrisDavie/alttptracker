import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DungeonsData } from "@/data/dungeonData";

export interface DungeonState {
  collectedCount: number;
  bossDefeated: boolean;
  boss: "unknown" | "armos" | "lanmolas" | "moldorm" | "helmasaurking" | "arrghus" | "mothula" | "blind" | "kholdstare" | "vitreous" | "trinexx" | "agahnim" | "agahnim2" | "bnc";
  prize: "unknown" | "crystal" | "pendant" | "redCrystal" | "greenPendant" | "map";
  prizeCollected: boolean;
  smallKeys: number;
  bigKey: boolean;
  map: boolean;
  compass: boolean;
  manuallyChanged: {
    smallKeys: boolean;
    bossDefeated: boolean;
    prize: boolean;
    prizeCollected: boolean;
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
    smallKeys: false,
    bossDefeated: false,
    prize: false,
    prizeCollected: false,
  },
};

const PRIZES: NonNullable<DungeonState["prize"]>[] = ["unknown", "greenPendant", "pendant", "crystal", "redCrystal"];

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
    setSmallKeyCount: (state, action: PayloadAction<{ dungeon: string; count: number }>) => {
      const { dungeon, count } = action.payload;
      state[dungeon].smallKeys = count;
      if (state[dungeon].manuallyChanged) {
        state[dungeon].manuallyChanged.smallKeys = true;
      }
    },
    incrementSmallKeyCount: (state, action: PayloadAction<{ dungeon: string; maxCount: number; decrement: boolean }>) => {
      const { dungeon, maxCount, decrement } = action.payload;
      const currentCount = state[dungeon].smallKeys;
      
      if (decrement) {
        state[dungeon].smallKeys = (currentCount - 1 + (maxCount + 1)) % (maxCount + 1);
      } else {
        state[dungeon].smallKeys = (currentCount + 1) % (maxCount + 1);
      }
      if (state[dungeon].manuallyChanged) {
        state[dungeon].manuallyChanged.smallKeys = true;
      }
    },
    setBigKey: (state, action: PayloadAction<{ dungeon: string; hasBigKey: boolean }>) => {
      const { dungeon, hasBigKey } = action.payload;
      state[dungeon].bigKey = hasBigKey;
    },
    togglePrizeCollected: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      state[dungeon].prizeCollected = !state[dungeon].prizeCollected;
      state[dungeon].manuallyChanged.prizeCollected = true;
    },
    incrementPrizeCount: (state, action: PayloadAction<{ dungeon: string; decrement: boolean }>) => {
      const { dungeon, decrement } = action.payload;
      const current = state[dungeon].prize ?? "unknown";
      const currentIndex = PRIZES.indexOf(current);
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
      
      // Never overwrite manually changed values
      const filteredState = { ...newState };
      if (current.manuallyChanged.smallKeys) delete filteredState.smallKeys;
      if (current.manuallyChanged.bossDefeated) delete filteredState.bossDefeated;
      if (current.manuallyChanged.prize) delete filteredState.prize;
      if (current.manuallyChanged.prizeCollected) delete filteredState.prizeCollected;

      if (filteredState.map && (!current.manuallyChanged.prize || current.prize === "unknown")) {
        filteredState.prize = "map"
      }

      Object.assign(current, filteredState);
    },
  },
});

export const { setDungeonCollectedCount, toggleDungeonBoss, setSmallKeyCount, incrementSmallKeyCount, setBigKey, incrementPrizeCount, togglePrizeCollected, updateDungeonState } = dungeonsSlice.actions;
export default dungeonsSlice.reducer;
