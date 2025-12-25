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
    },
    setBigKey: (state, action: PayloadAction<{ dungeon: string; hasBigKey: boolean }>) => {
      const { dungeon, hasBigKey } = action.payload;
      state.dungeons[dungeon].bigKey = hasBigKey;
    },
    togglePrizeCollected: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      state.dungeons[dungeon].prizeCollected = !state.dungeons[dungeon].prizeCollected;
    },
    cyclePrize: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      const current = state.dungeons[dungeon].prize ?? "unknown";
      const nextIndex = (PRIZES.indexOf(current) + 1) % PRIZES.length;
      state.dungeons[dungeon].prize = PRIZES[nextIndex];
    },
    reverseCyclePrize: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      const current = state.dungeons[dungeon].prize ?? "unknown";
      const nextIndex = (PRIZES.indexOf(current) - 1 + PRIZES.length) % PRIZES.length;
      state.dungeons[dungeon].prize = PRIZES[nextIndex];
    }
  },
});

export const { setDungeonCollectedCount, toggleDungeonBoss, setSmallKeyCount, setBigKey, cyclePrize, reverseCyclePrize, togglePrizeCollected } = dungeonsSlice.actions;
export default dungeonsSlice.reducer;
