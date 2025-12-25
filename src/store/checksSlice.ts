import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { locationsData } from "@/data/locationsData";

export type CheckStatus = "none" | "all" | "some";

export interface ChecksState {
  checks: Record<string, CheckStatus>;
}

const initialState: ChecksState = {
  checks: Object.keys(locationsData).reduce((acc, loc) => {
    acc[loc] = "none";
    return acc;
  }, {} as Record<string, CheckStatus>),
};

export const checksSlice = createSlice({
  name: "checks",
  initialState,
  reducers: {
    setLocationChecked: (state, action: PayloadAction<{ location: string; checked: CheckStatus }>) => {
      const { location, checked } = action.payload;
      state.checks[location] = checked;
    },
    setLocationsChecked: (state, action: PayloadAction<{ locations: string[]; checked: CheckStatus }>) => {
      const { locations, checked } = action.payload;
      locations.forEach((location) => {
        state.checks[location] = checked;
      });
    },
    updateMultipleLocations: (state, action: PayloadAction<Record<string, CheckStatus>>) => {
      Object.entries(action.payload).forEach(([location, status]) => {
        state.checks[location] = status;
      });
    },
  },
});

export const { setLocationChecked, setLocationsChecked, updateMultipleLocations } = checksSlice.actions;
export default checksSlice.reducer;
