import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DungeonState {
  collectedCount: number;
  bossDefeated: boolean;
  smallKeys: number;
  bigKey: boolean;
  map: boolean;
  compass: boolean;
}

interface ItemState {
  amount: number;
}

interface SettingsState {
  wildSmallKeys: boolean;
  wildBigKeys: boolean;
  wildMaps: boolean;
  wildCompasses: boolean;
}


interface TrackerState {
  dungeons: Record<string, DungeonState>;
  items: Record<string, ItemState>;
  settings: SettingsState;
}

const dungeonInitialState: DungeonState = {
  collectedCount: 0,
  bossDefeated: false,
  smallKeys: 0,
  bigKey: false,
  map: false,
  compass: false,
};

const initialSettingsState: SettingsState = {
  wildSmallKeys: false,
  wildBigKeys: false,
  wildMaps: false,
  wildCompasses: false,
};

const initialState: TrackerState = {
  dungeons: {},
  items: {},
  settings: { ...initialSettingsState },
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
        state.dungeons[dungeon] = { ...dungeonInitialState };
      }
      state.dungeons[dungeon].collectedCount = count;
    },
    toggleDungeonBoss: (
      state,
      action: PayloadAction<{ dungeon: string }>
    ) => {
      const { dungeon } = action.payload;
      if (!state.dungeons[dungeon]) {
        state.dungeons[dungeon] = { ...dungeonInitialState };
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
    setSmallKeyCount: (
      state,
      action: PayloadAction<{ dungeon: string; count: number }>
    ) => {
      const { dungeon, count } = action.payload;
      if (!state.dungeons[dungeon]) {
        state.dungeons[dungeon] = { ...dungeonInitialState };
      }
      state.dungeons[dungeon].smallKeys = count;
    },
    setBigKey: (    
      state,
      action: PayloadAction<{ dungeon: string; hasBigKey: boolean }>
    ) => {
      const { dungeon, hasBigKey } = action.payload;
      if (!state.dungeons[dungeon]) {
        state.dungeons[dungeon] = { ...dungeonInitialState };
      }
      state.dungeons[dungeon].bigKey = hasBigKey;
    },
    toggleWildSmallKeys: (state) => {
      state.settings.wildSmallKeys = !state.settings.wildSmallKeys;
    },
    toggleWildBigKeys: (state) => {
      state.settings.wildBigKeys = !state.settings.wildBigKeys;
    },
  },
});

export const { setDungeonCollectedCount, toggleDungeonBoss, setItemCount, setSmallKeyCount, setBigKey, toggleWildSmallKeys, toggleWildBigKeys } = trackerSlice.actions;
export default trackerSlice.reducer;
