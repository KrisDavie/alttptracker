import { describe, it, expect } from "vitest";
import reducer, { setAutotrackingSettings, setConnected, type AutotrackerState } from "@/store/autotrackerSlice";

/**
 * Regression test: setAutotrackingSettings used to reset the connection
 * whenever host/port were merely PRESENT in the payload (e.g. the Mystery
 * modal dispatches a mirror of the whole autotracker state on submit),
 * force-disconnecting the autotracker on every settings change.
 */

function connectedState(): AutotrackerState {
  const base = reducer(undefined, { type: "@@INIT" });
  return reducer(
    { ...base, host: "localhost", port: 8080, connectionType: "qusb2snes" },
    setConnected({ selectedDevice: "SD2SNES COM3", isConnected: true }),
  );
}

describe("autotrackerSlice.setAutotrackingSettings", () => {
  it("keeps the connection when host/port are present but unchanged", () => {
    const state = connectedState();
    const next = reducer(state, setAutotrackingSettings({ ...state }));
    expect(next.isConnected).toBe(true);
    expect(next.selectedDevice).toBe("SD2SNES COM3");
    expect(next.status).toBe(state.status);
  });

  it("resets the connection when the host changes", () => {
    const state = connectedState();
    const next = reducer(state, setAutotrackingSettings({ host: "192.168.1.10" }));
    expect(next.isConnected).toBe(false);
    expect(next.selectedDevice).toBeNull();
    expect(next.status).toBe("disconnected");
    expect(next.host).toBe("192.168.1.10");
  });

  it("resets the connection when the port changes", () => {
    const state = connectedState();
    const next = reducer(state, setAutotrackingSettings({ port: 23074 }));
    expect(next.isConnected).toBe(false);
    expect(next.port).toBe(23074);
  });
});
