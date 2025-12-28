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
  [key: string]: EntranceData;
}

const initialState: Record<string, EntranceData> = Object.keys(entranceData).reduce((acc, entrance) => {
  acc[entrance] = { ...entranceInitialState };
  return acc;
}, {} as Record<string, EntranceData>);

initialState["Misery Mire"].medallion = "unknown";
initialState["Turtle Rock"].medallion = "unknown";

export const entrancesSlice = createSlice({
  name: "trackerEntrances",
  initialState,
  reducers: {
    incrementMedallionCount: (state, action: PayloadAction<{ entrance: string; decrement: boolean }>) => {
      const { entrance, decrement } = action.payload;
      const current = state[entrance].medallion ?? "unknown";
      const currentIndex = MEDALLIONS.indexOf(current);
      const maxCount = MEDALLIONS.length - 1;

      if (decrement) {
        state[entrance].medallion = MEDALLIONS[(currentIndex - 1 + (maxCount + 1)) % (maxCount + 1)];
      } else {
        state[entrance].medallion = MEDALLIONS[(currentIndex + 1) % (maxCount + 1)];
      }
      if (state[entrance].manuallyChanged) {
        state[entrance].manuallyChanged.medallion = true;
      }
    },
  },
});

export const { incrementMedallionCount } = entrancesSlice.actions;
export default entrancesSlice.reducer;
