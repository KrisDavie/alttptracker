import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";
import { entranceLocations } from "@/data/locationsData";
import { getDropdownPartner } from "@/lib/dropdowns";

export interface EntranceData {
  checked: boolean;
  connector: boolean;
  connectorGroup: number | null;
  to: string | null;
  oneway: boolean;
  note?: string;
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
  to: null,
  oneway: false,
  note: undefined,
  manuallyChanged: {
    medallion: false,
  },
};

export interface EntrancesState {
  [key: string]: EntranceData;
}

const initialState: Record<string, EntranceData> = Object.keys(entranceLocations).reduce((acc, entrance) => {
  acc[entrance] = { ...entranceInitialState };
  return acc;
}, {} as Record<string, EntranceData>);

initialState["Misery Mire"].medallion = "unknown";
initialState["Turtle Rock"].medallion = "unknown";

export const entrancesSlice = createSlice({
  name: "trackerEntrances",
  initialState,
  reducers: {
    resetEntrances: (_state, action: PayloadAction<Record<string, Partial<EntranceData>> | undefined>) => {
      const presetState = action.payload;
      if (!presetState) return initialState;
      const merged: Record<string, EntranceData> = { ...initialState };
      for (const [key, value] of Object.entries(presetState)) {
        merged[key] = {
          ...entranceInitialState,
          ...value,
          manuallyChanged: { ...entranceInitialState.manuallyChanged, ...value?.manuallyChanged },
        };
      }
      return merged;
    },
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
    setNote: (state, action: PayloadAction<{ entrance: string; note: string }>) => {
      const { entrance, note } = action.payload;
      state[entrance].note = note;
    },
    setEntranceLink: (state, action: PayloadAction<{ entrance: string; to: string | null; zelgaWoods?: boolean; entranceMode?: string }>) => {
      const { entrance, to, zelgaWoods = false, entranceMode } = action.payload;
      state[entrance].to = to;
      state[entrance].checked = to !== null;

      // Forced dropdown pairing: a dropdown (hole) and its associated entrance
      // (door) move together in every mode except insanity. Linking one side
      // implies partner(entrance) → partner(to); unlinking clears the partner.
      if (entranceMode && entranceMode !== "insanity" && entranceMode !== "none") {
        const partner = getDropdownPartner(entrance, zelgaWoods);
        if (partner && state[partner]) {
          if (to === null) {
            state[partner].to = null;
            state[partner].checked = false;
          } else {
            const toPartner = getDropdownPartner(to, zelgaWoods);
            if (toPartner) {
              state[partner].to = toPartner;
              state[partner].checked = true;
            }
          }
        }
      }
    },
    connectGenericConnector: (state, action: { payload: { source: string; destination: string; connectorId: number } }) => {
      const { source, destination, connectorId } = action.payload;
      let connectorGroup
      if (state[source].to) {
        connectorGroup = state[source].connectorGroup ?? connectorId;
      } else if (state[destination].to) {
        connectorGroup = state[destination].connectorGroup ?? connectorId;
      } else {
        connectorGroup = connectorId;
      }
      state[source].to = `Generic Connector ${connectorGroup}`;
      state[destination].to = `Generic Connector ${connectorGroup}`;
      state[source].checked = true;
      state[destination].checked = true;
      state[source].connectorGroup = connectorGroup;
      state[destination].connectorGroup = connectorGroup;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REMEMBER_REHYDRATED, (_state, action) => {
      const rehydrated = (action as unknown as { payload: Record<string, unknown> }).payload.entrances as Record<string, EntranceData> | undefined;
      if (!rehydrated) return initialState;
      const merged = { ...initialState };
      for (const [key, value] of Object.entries(rehydrated)) {
        merged[key] = {
          ...entranceInitialState,
          ...value,
          manuallyChanged: { ...entranceInitialState.manuallyChanged, ...value.manuallyChanged },
        };
      }
      return merged;
    });
  },
});

export const { incrementMedallionCount, setNote, setEntranceLink, connectGenericConnector, resetEntrances } = entrancesSlice.actions;
export default entrancesSlice.reducer;
