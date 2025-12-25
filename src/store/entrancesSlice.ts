import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { entranceData } from "@/data/entranceData";

export interface EntranceData {
  checked: boolean;
  connector: boolean;
  connectorGroup: string | null;
  oneway: boolean;
  medallion?: "unknown" | "bombos" | "ether" | "quake";
}

const MEDALLIONS: NonNullable<EntranceData["medallion"]>[] = ["unknown", "bombos", "ether", "quake"];

const entranceInitialState: EntranceData = {
  checked: false,
  connector: false,
  connectorGroup: null,
  oneway: false,
};

export interface EntrancesState {
  entrances: Record<string, EntranceData>;
}

const initialState: EntrancesState = {
  entrances: Object.keys(entranceData).reduce((acc, entrance) => {
    acc[entrance] = { ...entranceInitialState };
    return acc;
  }, {} as Record<string, EntranceData>),
};

initialState.entrances["Misery Mire"].medallion = "unknown";
initialState.entrances["Turtle Rock"].medallion = "unknown";

export const entrancesSlice = createSlice({
  name: "trackerEntrances",
  initialState,
  reducers: {
    cycleMedallion: (state, action: PayloadAction<{ entrance: string }>) => {
      const { entrance } = action.payload;
      const current = state.entrances[entrance].medallion ?? "unknown";
      const nextIndex = (MEDALLIONS.indexOf(current) + 1) % MEDALLIONS.length;
      state.entrances[entrance].medallion = MEDALLIONS[nextIndex];
    },
    reverseCycleMedallion: (state, action: PayloadAction<{ entrance: string }>) => {
      const { entrance } = action.payload;
      const current = state.entrances[entrance].medallion ?? "unknown";
      const nextIndex = (MEDALLIONS.indexOf(current) - 1 + MEDALLIONS.length) % MEDALLIONS.length;
      state.entrances[entrance].medallion = MEDALLIONS[nextIndex];
    },
  },
});

export const { cycleMedallion, reverseCycleMedallion } = entrancesSlice.actions;
export default entrancesSlice.reducer;