import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DungeonState {
  collectedCount: number;
  bossDefeated: boolean;
}

interface ItemState {
  amount: number;
}

interface TrackerState {
  dungeons: Record<string, DungeonState>;
  items: Record<string, ItemState>;
}

const initialState: TrackerState = {
  dungeons: {},
  items: {},
};

export const trackerSlice = createSlice({
  name: 'tracker',
  initialState,
  reducers: {
    setDungeonCollectedCount: (
      state,
      action: PayloadAction<{ dungeon: string; count: number }>
    ) => {
      const { dungeon, count } = action.payload;
      if (!state.dungeons[dungeon]) {
        state.dungeons[dungeon] = { collectedCount: 0, bossDefeated: false };
      }
      state.dungeons[dungeon].collectedCount = count;
    },
    toggleDungeonBoss: (
      state,
      action: PayloadAction<{ dungeon: string }>
    ) => {
      const { dungeon } = action.payload;
      if (!state.dungeons[dungeon]) {
        state.dungeons[dungeon] = { collectedCount: 0, bossDefeated: false };
      }
      state.dungeons[dungeon].bossDefeated = !state.dungeons[dungeon].bossDefeated;
    },
    setItemCount: (
      state,
      action: PayloadAction<{ itemName: string; count: number }>
    ) => {
      const { itemName, count } = action.payload;
      if (!state.items[itemName]) {
        state.items[itemName] = { amount: 0 };
      }
      state.items[itemName].amount = count;
    },
  },
});

export const { setDungeonCollectedCount, toggleDungeonBoss, setItemCount } = trackerSlice.actions;

export default trackerSlice.reducer;
