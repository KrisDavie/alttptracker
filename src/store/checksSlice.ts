import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { locationsData } from "@/data/locationsData";
import { entranceData } from "@/data/entranceData";

export type Status = "none" | "all" | "some";
export type Logic = "unavailable" | "available" | "possible" | "information" | "mixed";

export interface CheckStatus {
  status: Status;
  manuallyChecked: boolean;
  scoutedItems: string[];
}

export interface ChecksState {
  locationsChecks: Record<string, CheckStatus>;
  entranceChecks: Record<string, CheckStatus>;
}

const initialState: ChecksState = {
  locationsChecks: Object.keys(locationsData).reduce((acc, loc) => {
    acc[loc] = { status: "none", manuallyChecked: false, scoutedItems: [] };
    return acc;
  }, {} as Record<string, CheckStatus>),
  entranceChecks: Object.keys(entranceData).reduce((acc, loc) => {
    acc[loc] = { status: "none", manuallyChecked: false, scoutedItems: [] };
    return acc;
  }, {} as Record<string, CheckStatus>)
};

export const checksSlice = createSlice({
  name: "checks",
  initialState,
  reducers: {
    setLocationChecked: (state, action: PayloadAction<{ location: string; status: Status; manual?: boolean }>) => {
      const { location, status, manual = true } = action.payload;
      state.locationsChecks[location] = {
        ...state.locationsChecks[location],
        status,
        manuallyChecked: manual,
      };
    },
    updateMultipleLocations: (state, action: PayloadAction<Record<string, CheckStatus>>) => {
      Object.entries(action.payload).forEach(([location, checkStatus]) => {
        state.locationsChecks[location] = checkStatus;
      });
    },
    setEntranceChecked: (state, action: PayloadAction<{ entrance: string; status: Status; manual?: boolean }>) => {
      const { entrance, status, manual = true } = action.payload;
      state.entranceChecks[entrance] = {
        ...state.entranceChecks[entrance],
        status,
        manuallyChecked: manual
      };
    }
  },
});

export const { setLocationChecked, setEntranceChecked, updateMultipleLocations } = checksSlice.actions;
export default checksSlice.reducer;
