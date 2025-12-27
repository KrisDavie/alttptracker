import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DungeonsData } from "@/data/dungeonData";

export interface DungeonState {
  collectedCount: number;
  bossDefeated: boolean;
  prize: "unknown" | "crystal" | "pendant" | "redCrystal" | "greenPendant" | "map";
  prizeCollected: boolean;
  smallKeys: number;
  bigKey: boolean;
  map: boolean;
  compass: boolean;
  manuallyChanged?: {
    smallKeys?: boolean;
    prize?: boolean;
  };
}

export interface DungeonsState {
  dungeons: Record<string, DungeonState>;
}

const dungeonInitialState: DungeonState = {
  collectedCount: 0,
  bossDefeated: false,
  prize: "unknown",
  prizeCollected: false,
  smallKeys: 0,
  bigKey: false,
  map: false,
  compass: false,
  manuallyChanged: {
    smallKeys: false,
    prize: false,
  },
};

const PRIZES: NonNullable<DungeonState["prize"]>[] = [
  "unknown",
  "greenPendant",
  "pendant",
  "crystal",
  "redCrystal",
];

const initialState: DungeonsState = {
  dungeons: Object.keys(DungeonsData).reduce((acc, dungeon) => {
    acc[dungeon] = { ...dungeonInitialState };
    return acc;
  }, {} as Record<string, DungeonState>),
};

export const dungeonsSlice = createSlice({
  name: "dungeons",
  initialState,
  reducers: {
    setDungeonCollectedCount: (state, action: PayloadAction<{ dungeon: string; count: number }>) => {
      const { dungeon, count } = action.payload;
      state.dungeons[dungeon].collectedCount = count;
    },
    toggleDungeonBoss: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      state.dungeons[dungeon].bossDefeated = !state.dungeons[dungeon].bossDefeated;
    },
    setSmallKeyCount: (state, action: PayloadAction<{ dungeon: string; count: number }>) => {
      const { dungeon, count } = action.payload;
      state.dungeons[dungeon].smallKeys = count;
      if (state.dungeons[dungeon].manuallyChanged) {
        state.dungeons[dungeon].manuallyChanged.smallKeys = true;
      }
    },
    incrementSmallKeyCount: (state, action: PayloadAction<{ dungeon: string; decrement: boolean }>) => {
      const { dungeon, decrement } = action.payload;
      const currentCount = state.dungeons[dungeon].smallKeys;
      const maxCount = DungeonsData[dungeon].totalLocations?.smallkeys || 0;

      if (decrement) {
        state.dungeons[dungeon].smallKeys = (currentCount - 1 + (maxCount + 1)) % (maxCount + 1);
      } else {
        state.dungeons[dungeon].smallKeys = (currentCount + 1) % (maxCount + 1);
      }
      if (state.dungeons[dungeon].manuallyChanged) {
        state.dungeons[dungeon].manuallyChanged.smallKeys = true;
      }
    },
    setBigKey: (state, action: PayloadAction<{ dungeon: string; hasBigKey: boolean }>) => {
      const { dungeon, hasBigKey } = action.payload;
      state.dungeons[dungeon].bigKey = hasBigKey;
    },
    togglePrizeCollected: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      state.dungeons[dungeon].prizeCollected = !state.dungeons[dungeon].prizeCollected;
    },
    incrementPrizeCount: (state, action: PayloadAction<{ dungeon: string; decrement: boolean }>) => {
      const { dungeon, decrement } = action.payload;
      const current = state.dungeons[dungeon].prize ?? "unknown";
      const currentIndex = PRIZES.indexOf(current);
      const maxCount = PRIZES.length - 1;

      if (decrement) {
        state.dungeons[dungeon].prize = PRIZES[(currentIndex - 1 + (maxCount + 1)) % (maxCount + 1)];
      } else {
        state.dungeons[dungeon].prize = PRIZES[(currentIndex + 1) % (maxCount + 1)];
      }
      if (state.dungeons[dungeon].manuallyChanged) {
        state.dungeons[dungeon].manuallyChanged.prize = true;
      }
    },
    updateDungeonState: (state, action: PayloadAction<{ dungeon: string; newState: Partial<DungeonState> }>) => {
      const { dungeon, newState } = action.payload;
      const current = state.dungeons[dungeon];

      Object.assign(current, newState, 
        current.manuallyChanged?.smallKeys ? { smallKeys: current.smallKeys } : {},
        current.manuallyChanged?.prize ? { prize: current.prize } : {}
      );
    }
  },
});

export const { setDungeonCollectedCount, toggleDungeonBoss, setSmallKeyCount, incrementSmallKeyCount, setBigKey, incrementPrizeCount, togglePrizeCollected, updateDungeonState } = dungeonsSlice.actions;
export default dungeonsSlice.reducer;
