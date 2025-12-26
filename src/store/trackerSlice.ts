import { createSlice } from "@reduxjs/toolkit";

export interface TrackerState {
   currentMode: "none" | "scout" | "connect" | "follower";
   modalOpen: "none" | "mystery" | "entrance" 
   selectedLocation: string | null;
   selectedEntrance: string | null;
}

const initialState: TrackerState = {
    currentMode: "none",
    modalOpen: "none",
    selectedLocation: null,
    selectedEntrance: null,
};

export const trackerSlice = createSlice({
  name: "trackerState",
  initialState,
  reducers: {
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
    setModalClose: (state) => {
      state.modalOpen = "none";
    },
    setSelectedEntrance: (state, action) => {
      state.selectedEntrance = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
  },
});

export const { setModalOpen, setModalClose, setSelectedEntrance, setSelectedLocation } = trackerSlice.actions;
export default trackerSlice.reducer;