import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
  logicMode: "noglitches" | "overworldglitches" | "hybridglitches" | "nologic";
  worldState: "open" | "standard" | "inverted";
  wildSmallKeys: "inDungeon" | "wild" | "universal";
  wildBigKeys: boolean;
  wildMaps: boolean;
  wildCompasses: boolean;
  keyDrop: boolean;
  entranceMode: "none" | "dungeonssimple" | "dungeonsfull" | "lite" | "lean" | "simple" | "restricted" | "full" | "district" | "swapped" | "crossed" | "insanity";
  bossShuffle: "none" | "simple" | "full" | "random";
  enemyShuffle: "none" | "shuffled" | "random";
  goal: "ganon" | "fast_ganon" | "dungeons" | "pedestal" | "triforce_hunt";
  swords: "randomized" | "assured" | "vanilla" | "swordless";
  itemPool: "normal" | "hard" | "expert";
  activatedFlute: boolean;
  bonkShuffle: boolean;
  autotracking: boolean;
}

const initialState: SettingsState = {
  logicMode: "noglitches",
  worldState: "open",
  wildSmallKeys: "inDungeon",
  wildBigKeys: false,
  wildMaps: false,
  wildCompasses: false,
  keyDrop: false,
  entranceMode: "none",
  bossShuffle: "none",
  enemyShuffle: "none",
  goal: "fast_ganon",
  swords: "randomized",
  itemPool: "normal",
  activatedFlute: false,
  bonkShuffle: false,
  autotracking: false,
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
  },
});

export const { setSettings, setWildSmallKeys, toggleWildBigKeys } = settingsSlice.actions;
export default settingsSlice.reducer;
