import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
  // Mode Settings
  logicMode: "noglitches" | "overworldglitches" | "hybridglitches" | "nologic";
  worldState: "open" | "standard" | "inverted";
  wildSmallKeys: "inDungeon" | "wild" | "universal";
  wildBigKeys: boolean;
  wildMaps: boolean;
  wildCompasses: boolean;
  keyDrop: boolean;
  pottery: "none" |"keys" |"cave" |"cavekeys" |"reduced" |"clustered" |"nonempty" |"dungeon" |"lottery";
  entranceMode: "none" | "dungeonssimple" | "dungeonsfull" | "lite" | "lean" | "simple" | "restricted" | "full" | "district" | "swapped" | "crossed" | "insanity";
  bossShuffle: "none" | "simple" | "full" | "random";
  enemyShuffle: "none" | "shuffled" | "random";
  goal: "ganon" | "fast_ganon" | "dungeons" | "pedestal" | "triforce_hunt";
  swords: "randomized" | "assured" | "vanilla" | "swordless";
  itemPool: "normal" | "hard" | "expert";
  activatedFlute: boolean;
  bonkShuffle: boolean;

  // UI settings
  autotracking: boolean;
  mapMode: "off" | "normal" | "compact" | "vertical";
  includeDungeonItemsInCounter?: boolean;
}

const initialState: SettingsState = {
  logicMode: "noglitches",
  worldState: "open",
  wildSmallKeys: "inDungeon",
  wildBigKeys: false,
  wildMaps: false,
  wildCompasses: false,
  keyDrop: false,
  pottery: "none",
  entranceMode: "none",
  bossShuffle: "none",
  enemyShuffle: "none",
  goal: "fast_ganon",
  swords: "randomized",
  itemPool: "normal",
  activatedFlute: false,
  bonkShuffle: false,
  autotracking: true,
  includeDungeonItemsInCounter: false,
  mapMode: "normal",
};

export const settingsSlice = createSlice({
  name: "trackerSettings",
  initialState,
  reducers: {
    setSettings: (state, action: { payload: Partial<SettingsState> }) => {
      return { ...state, ...action.payload };
    },
    setWildSmallKeys: (state, action: { payload: "inDungeon" | "wild" | "universal" }) => {
      state.wildSmallKeys = action.payload;
    },
    toggleWildBigKeys: (state) => {
      state.wildBigKeys = !state.wildBigKeys;
    },
    setMapMode: (state, action: { payload: "off" | "normal" | "compact" | "vertical" }) => {
      state.mapMode = action.payload;
    },
  },
});

export const { setSettings, setWildSmallKeys, toggleWildBigKeys } = settingsSlice.actions;
export default settingsSlice.reducer;
