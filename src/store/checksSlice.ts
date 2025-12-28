import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { locationsData } from "@/data/locationsData";
import { entranceData } from "@/data/entranceData";
import type { LogicStatus } from "@/data/logic/logicTypes";

export interface CheckStatus {
  checked: boolean;
  logic: LogicStatus;
  manuallyChecked: boolean;
  scoutedItems: string[];
}

// We have to keep entrances and locations separate because some locations and entrances may share names
export interface ChecksState {
  locationsChecks: Record<string, CheckStatus>;
  entranceChecks: Record<string, CheckStatus>;
}

const initialCheckStatus: CheckStatus = {
  checked: false,
  logic: "available",
  manuallyChecked: false,
  scoutedItems: [],
};

const initialState: ChecksState = {
  locationsChecks: Object.values(locationsData).reduce((acc, loc) => {
    loc.itemLocations.forEach((location) => {
      acc[location] = { ...initialCheckStatus };
    });
    return acc;
  }, {} as Record<string, CheckStatus>),
  entranceChecks: Object.keys(entranceData).reduce((acc, loc) => {
    acc[loc] = { ...initialCheckStatus };
    return acc;
  }, {} as Record<string, CheckStatus>),
};

export const checksSlice = createSlice({
  name: "checks",
  initialState,
  reducers: {
    setLocationChecked: (state, action: PayloadAction<{ location: string; checked: boolean; manual?: boolean }>) => {
      const { location, checked, manual = true } = action.payload;
      state.locationsChecks[location] = {
        ...state.locationsChecks[location],
        checked,
        manuallyChecked: manual,
      };
    },
    updateMultipleLocations: (state, action: PayloadAction<Record<string, CheckStatus>>) => {
      Object.entries(action.payload).forEach(([location, checkStatus]) => {
        state.locationsChecks[location] = checkStatus;
      });
    },
    setEntranceChecked: (state, action: PayloadAction<{ entrance: string; checked: boolean; manual?: boolean }>) => {
      const { entrance, checked, manual = true } = action.payload;
      state.entranceChecks[entrance] = {
        ...state.entranceChecks[entrance],
        checked,
        manuallyChecked: manual,
      };
    },
    updateLogicStatuses: (state, action: PayloadAction<{ locationsLogic: Record<string, LogicStatus>; entrancesLogic: Record<string, LogicStatus> }>) => {
      const { locationsLogic, entrancesLogic } = action.payload;
      Object.entries(locationsLogic).forEach(([location, logicStatus]) => {
        if (state.locationsChecks[location]) {
          state.locationsChecks[location].logic = logicStatus;
        }
      });
      Object.entries(entrancesLogic).forEach(([entrance, logicStatus]) => {
        if (state.entranceChecks[entrance]) {
          state.entranceChecks[entrance].logic = logicStatus;
        }
      });
    },
  },
});

export const { setLocationChecked, setEntranceChecked, updateMultipleLocations, updateLogicStatuses } = checksSlice.actions;
export default checksSlice.reducer;
