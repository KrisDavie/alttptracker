import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { entranceData } from "@/data/entranceData";

export interface EntranceData {
  checked: boolean;
  connector: boolean;
  connectorGroup: string | null;
  oneway: boolean;
  medallion?: "unknown" | "bombos" | "ether" | "quake";
  manuallyChanged?: {
    medallion?: boolean;
  };
}

const MEDALLIONS: NonNullable<EntranceData["medallion"]>[] = ["unknown", "bombos", "ether", "quake"];

const entranceInitialState: EntranceData = {
  checked: false,
  connector: false,
  connectorGroup: null,
  oneway: false,
  manuallyChanged: {
    medallion: false,
  },
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
    incrementMedallionCount: (state, action: PayloadAction<{ entrance: string; decrement: boolean }>) => {
      const { entrance, decrement } = action.payload;
      const current = state.entrances[entrance].medallion ?? "unknown";
      const currentIndex = MEDALLIONS.indexOf(current);
      const maxCount = MEDALLIONS.length - 1;

      if (decrement) {
        state.entrances[entrance].medallion = MEDALLIONS[(currentIndex - 1 + (maxCount + 1)) % (maxCount + 1)];
      } else {
        state.entrances[entrance].medallion = MEDALLIONS[(currentIndex + 1) % (maxCount + 1)];
      }
      if (state.entrances[entrance].manuallyChanged) {
        state.entrances[entrance].manuallyChanged.medallion = true;
      }
    },
  },
});

export const { incrementMedallionCount } = entrancesSlice.actions;
export default entrancesSlice.reducer;