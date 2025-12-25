import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
  wildSmallKeys: "inDungeon" | "wild" | "universal";
  wildBigKeys: boolean;
  wildMaps: boolean;
  wildCompasses: boolean;
  autotracking: boolean;
}

const initialState: SettingsState = {
  wildSmallKeys: "inDungeon",
  wildBigKeys: false,
  wildMaps: false,
  wildCompasses: false,
  autotracking: true,
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
