import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadAutotrackPrefs } from "@/lib/launchHelpers";

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

const savedAutotrackPrefs = loadAutotrackPrefs();

const initialState: AutotrackerState = {
  isConnected: false,
  deviceList: [],
  selectedDevice: null,
  status: "disconnected",
  connectionType: savedAutotrackPrefs.protocol,
  error: null,
  host: savedAutotrackPrefs.host,
  port: savedAutotrackPrefs.port,
  romName: null,
};

export const autotrackerSlice = createSlice({
  name: "autotracker",
  initialState,
  reducers: {
    setRomName: (state, action: PayloadAction<string | null>) => {
      state.romName = action.payload 
    },
    setAutotrackingSettings: (state, action: { payload: Partial<AutotrackerState> }) => {
      const newState = { ...state, ...action.payload };
      // Reset connection status only if host or port actually CHANGES.
      // Payloads that mirror the whole state (e.g. from settings modals) must
      // not drop an active connection when host/port are unchanged.
      const hostChanged = action.payload.host !== undefined && action.payload.host !== state.host;
      const portChanged = action.payload.port !== undefined && action.payload.port !== state.port;
      if (hostChanged || portChanged) {
        newState.isConnected = false;
        newState.status = "disconnected";
        newState.selectedDevice = null;
      }
      return newState;
    },
    setConnected: (state, action: PayloadAction<{ selectedDevice: string | null; isConnected: boolean }>) => {
      state.selectedDevice = action.payload.selectedDevice;
      state.isConnected = action.payload.isConnected;
      state.status = `Connected to ${action.payload.selectedDevice || "unknown device"} (${(state.connectionType === "sni" ? "SNI gRPC" : "QUsb2snes")})`;
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

export const { setRomName, setAutotrackingSettings, setConnected, setConnectionStatus, setDeviceList, setSelectedDevice, setError } = autotrackerSlice.actions;
export default autotrackerSlice.reducer;
