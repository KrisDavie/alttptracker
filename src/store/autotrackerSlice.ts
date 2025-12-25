import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AutotrackerState {
  isConnected: boolean;
  deviceList: string[];
  selectedDevice: string | null;
  status: string;
  connectionType: "sni" | "qusb2snes" | null;
  error: string | null;
  host: string | null;
  port: number | null;
  romName?: string | null;
}

const initialState: AutotrackerState = {
  isConnected: false,
  deviceList: [],
  selectedDevice: null,
  status: "disconnected",
  connectionType: "sni",
  error: null,
  host: "localhost",
  port: 8190,
  romName: null,
};

export const autotrackerSlice = createSlice({
  name: "autotracker",
  initialState,
  reducers: {
    setRomName: (state, action: PayloadAction<string | null>) => {
      state.romName = action.payload 
    },
    setConnectedgRPC: (state, action: PayloadAction<{ selectedDevice: string | null; isConnected: boolean }>) => {
      state.selectedDevice = action.payload.selectedDevice;
      state.isConnected = action.payload.isConnected;
      state.status = `Connected to ${action.payload.selectedDevice || "unknown device"} (SNI gRPC)`;
    },
    setConnectionStatus: (state, action: PayloadAction<AutotrackerState["status"]>) => {
      state.status = action.payload;
      state.isConnected = action.payload === "connected";
    },
    setDeviceList: (state, action: PayloadAction<string[]>) => {
      state.deviceList = action.payload;
    },
    setSelectedDevice: (state, action: PayloadAction<string | null>) => {
      state.selectedDevice = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setRomName, setConnectedgRPC, setConnectionStatus, setDeviceList, setSelectedDevice, setError } = autotrackerSlice.actions;
export default autotrackerSlice.reducer;
