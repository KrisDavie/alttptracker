import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";
import { getAllPossibleLocationNames } from "@/lib/logic/locationMapper";
import { entranceLocations } from "@/data/locationsData";
import type { LogicStatus } from "@/data/logic/logicTypes";

export interface CheckStatus {
  checked: boolean;
  logic: LogicStatus;
  manuallyChecked: boolean;
  scoutedItems: string[];
  /** Sequence-break keys that caused this location to be "ool". Only populated when logic === "ool". */
  oolReasons?: string[];
}

// We have to keep entrances and locations separate because some locations and entrances may share names
export interface ChecksState {
  locationsChecks: Record<string, CheckStatus>;
  entranceChecks: Record<string, CheckStatus>;
}

const initialCheckStatus: CheckStatus = {
  checked: false,
  logic: "unavailable",
  manuallyChecked: false,
  scoutedItems: [],
};

const initialState: ChecksState = {
  // Initialize with ALL possible locations (including pots, enemies, key drops, etc.)
  // so that autotracking and logic can reference any location regardless of settings.
  locationsChecks: getAllPossibleLocationNames().reduce((acc, location) => {
    acc[location] = { ...initialCheckStatus };
    return acc;
  }, {} as Record<string, CheckStatus>),
  entranceChecks: Object.keys(entranceLocations).reduce((acc, loc) => {
    acc[loc] = { ...initialCheckStatus };
    return acc;
  }, {} as Record<string, CheckStatus>),
};

export const checksSlice = createSlice({
  name: "checks",
  initialState,
  reducers: {
    resetChecks: (_state, action: PayloadAction<Partial<ChecksState> | undefined>) => {
      const presetState = action.payload;
      if (!presetState) return initialState;
      const merged: ChecksState = {
        locationsChecks: { ...initialState.locationsChecks, ...presetState.locationsChecks },
        entranceChecks: { ...initialState.entranceChecks, ...presetState.entranceChecks },
      };
      return merged;
    },
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
    updateLogicStatuses: (state, action: PayloadAction<{ locationsLogic: Record<string, LogicStatus>; locationReasons?: Record<string, string[]>; entrancesLogic: Record<string, LogicStatus>; entranceReasons?: Record<string, string[]> }>) => {
      const { locationsLogic, locationReasons, entrancesLogic, entranceReasons } = action.payload;
      Object.entries(locationsLogic).forEach(([location, logicStatus]) => {
        if (state.locationsChecks[location]) {
          state.locationsChecks[location].logic = logicStatus;
          const newReasons = logicStatus === "ool" ? (locationReasons?.[location] ?? undefined) : undefined;
          const oldReasons = state.locationsChecks[location].oolReasons;
          // Only update if changed to avoid Redux referential equality causing infinite loops.
          const reasonsChanged =
            newReasons === undefined
              ? oldReasons !== undefined
              : !oldReasons || newReasons.length !== oldReasons.length || newReasons.some((r, i) => r !== oldReasons[i]);
          if (reasonsChanged) {
            state.locationsChecks[location].oolReasons = newReasons;
          }
        }
      });
      Object.entries(entrancesLogic).forEach(([entrance, logicStatus]) => {
        if (state.entranceChecks[entrance]) {
          state.entranceChecks[entrance].logic = logicStatus;
          const newReasons = logicStatus === "ool" ? (entranceReasons?.[entrance] ?? undefined) : undefined;
          const oldReasons = state.entranceChecks[entrance].oolReasons;
          // Only update if changed to avoid Redux referential equality causing infinite loops.
          const reasonsChanged =
            newReasons === undefined
              ? oldReasons !== undefined
              : !oldReasons || newReasons.length !== oldReasons.length || newReasons.some((r, i) => r !== oldReasons[i]);
          if (reasonsChanged) {
            state.entranceChecks[entrance].oolReasons = newReasons;
          }
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REMEMBER_REHYDRATED, (_state, action) => {
      const rehydrated = (action as unknown as { payload: Record<string, unknown> }).payload.checks as ChecksState | undefined;
      if (!rehydrated) return initialState;
      // Start from current initial state (has any new locations/entrances)
      const merged: ChecksState = {
        locationsChecks: { ...initialState.locationsChecks },
        entranceChecks: { ...initialState.entranceChecks },
      };
      // Overlay persisted location checks (preserves checked/scouted state)
      for (const [key, value] of Object.entries(rehydrated.locationsChecks ?? {})) {
        merged.locationsChecks[key] = { ...initialCheckStatus, ...value };
      }
      for (const [key, value] of Object.entries(rehydrated.entranceChecks ?? {})) {
        merged.entranceChecks[key] = { ...initialCheckStatus, ...value };
      }
      return merged;
    });
  },
});

export const { setLocationChecked, setEntranceChecked, updateMultipleLocations, updateLogicStatuses, resetChecks } = checksSlice.actions;
export default checksSlice.reducer;
