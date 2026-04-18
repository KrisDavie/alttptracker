import { createSlice } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";
import { getSessionInstanceId } from "@/lib/sessionHelper";

export interface TrackerState {
   currentMode: "none" | "scout" | "connect" | "entrance_select" | "follower";
   modalOpen: "none" | "mystery" | "entrance" 
   selectedLocation: string | null;
   selectedEntrance: string | null;
   hoveredDungeon: string | null;
   instanceId: string;
   rehydrated: boolean;
}

const initialState: TrackerState = {
    currentMode: "none",
    modalOpen: "entrance",
    selectedLocation: null,
    selectedEntrance: null,
    hoveredDungeon: null,
    instanceId: getSessionInstanceId(),
    rehydrated: false,
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
    setSelectedEntrance: (state, action: { payload: [string | null, boolean] }) => {
      const [entrance, openModal] = action.payload;
      state.selectedEntrance = entrance;
      state.modalOpen = openModal ? "entrance" : "none";
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setCurrentMode: (state, action) => {
      state.currentMode = action.payload;
    },
    setHoveredDungeon: (state, action) => {
      state.hoveredDungeon = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(REMEMBER_REHYDRATED, (state) => {
      state.rehydrated = true;
    });
  },
});

export const { setModalOpen, setModalClose, setSelectedEntrance, setSelectedLocation, setCurrentMode, setHoveredDungeon } = trackerSlice.actions;
export default trackerSlice.reducer;