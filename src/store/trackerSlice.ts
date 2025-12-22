import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ALL_SRAM_LOCATIONS_MAP } from "@/data/sramLocations";

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
  checks: Record<string, boolean>;
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
  checks: Object.keys(ALL_SRAM_LOCATIONS_MAP).reduce((acc, loc) => {
    acc[loc] = false;
    return acc;
  }, {} as Record<string, boolean>),
  settings: { ...initialSettingsState },
};

export const trackerSlice = createSlice({
  name: "tracker",
  initialState,
  reducers: {
    setDungeonCollectedCount: (state, action: PayloadAction<{ dungeon: string; count: number }>) => {
      const { dungeon, count } = action.payload;
      if (!state.dungeons[dungeon]) {
        state.dungeons[dungeon] = { ...dungeonInitialState };
      }
      state.dungeons[dungeon].collectedCount = count;
    },
    toggleDungeonBoss: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      if (!state.dungeons[dungeon]) {
        state.dungeons[dungeon] = { ...dungeonInitialState };
      }
      state.dungeons[dungeon].bossDefeated = !state.dungeons[dungeon].bossDefeated;
    },
    setItemCount: (state, action: PayloadAction<{ itemName: string; count: number }>) => {
      const { itemName, count } = action.payload;
      if (!state.items[itemName]) {
        state.items[itemName] = { amount: 0 };
      }
      state.items[itemName].amount = count;
    },
    setSmallKeyCount: (state, action: PayloadAction<{ dungeon: string; count: number }>) => {
      const { dungeon, count } = action.payload;
      if (!state.dungeons[dungeon]) {
        state.dungeons[dungeon] = { ...dungeonInitialState };
      }
      state.dungeons[dungeon].smallKeys = count;
    },
    setBigKey: (state, action: PayloadAction<{ dungeon: string; hasBigKey: boolean }>) => {
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
    setLocationChecked: (state, action: PayloadAction<{ location: string; checked: boolean }>) => {
      const { location, checked } = action.payload;
      state.checks[location] = checked;
    },
    setLocationsChecked: (state, action: PayloadAction<{ locations: string[]; checked: boolean }>) => {
      const { locations, checked } = action.payload;
      locations.forEach((location) => {
        state.checks[location] = checked;
      });
    },
  },
});

export const { setDungeonCollectedCount, toggleDungeonBoss, setItemCount, setSmallKeyCount, setBigKey, toggleWildSmallKeys, toggleWildBigKeys, setLocationChecked, setLocationsChecked } = trackerSlice.actions;
export default trackerSlice.reducer;
