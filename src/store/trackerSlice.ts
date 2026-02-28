import { createSlice } from "@reduxjs/toolkit";

export interface TrackerState {
   currentMode: "none" | "scout" | "connect" | "entrance_select" | "follower";
   modalOpen: "none" | "mystery" | "entrance" 
   selectedLocation: string | null;
   selectedEntrance: string | null;
}

const initialState: TrackerState = {
    currentMode: "none",
    modalOpen: "entrance",
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
      state.modalOpen = "entrance";
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setCurrentMode: (state, action) => {
      state.currentMode = action.payload;
    }
  },
});

export const { setModalOpen, setModalClose, setSelectedEntrance, setSelectedLocation, setCurrentMode } = trackerSlice.actions;
export default trackerSlice.reducer;