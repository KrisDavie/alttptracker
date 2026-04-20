import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";

export type ScoutedItemKind = "item" | "smallkey" | "bigkey";

export interface ScoutedItem {
  kind: ScoutedItemKind;
  // For items: the item name / storage key. For keys: the dungeon id.
  id: string;
}

export interface ScoutsState {
  // Marker name (locationsData key) -> list of scouted items for that marker.
  markers: Record<string, ScoutedItem[]>;
}

const initialState: ScoutsState = {
  markers: {},
};

function sameScout(a: ScoutedItem, b: ScoutedItem): boolean {
  return a.kind === b.kind && a.id === b.id;
}

export const scoutsSlice = createSlice({
  name: "scouts",
  initialState,
  reducers: {
    toggleScoutedItem: (
      state,
      action: PayloadAction<{ marker: string; item: ScoutedItem }>
    ) => {
      const { marker, item } = action.payload;
      const current = state.markers[marker] ?? [];
      const idx = current.findIndex((s) => sameScout(s, item));
      if (idx >= 0) {
        const next = current.slice();
        next.splice(idx, 1);
        if (next.length === 0) {
          delete state.markers[marker];
        } else {
          state.markers[marker] = next;
        }
      } else {
        state.markers[marker] = [...current, item];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REMEMBER_REHYDRATED, (_state, action) => {
      const rehydrated = (action as unknown as { payload: Record<string, unknown> }).payload.scouts as ScoutsState | undefined;
      if (!rehydrated) return initialState;
      return {
        markers: { ...(rehydrated.markers ?? {}) },
      };
    });
  },
});

export const { toggleScoutedItem } = scoutsSlice.actions;
export default scoutsSlice.reducer;
