import { describe, it, expect } from "vitest";
import { buildStateSnapshot, snapshotToJsonDocument, parseSnapshotJson, SNAPSHOT_KEYS } from "../stateSnapshot";
import type { RootState } from "@/store/store";

function fakeState(): RootState {
  return {
    items: { sword: { count: 2 } },
    dungeons: { ep: { bossDefeated: true } },
    checks: { locationsChecks: { "Sahasrahla": { checked: true, logic: "available" } }, entranceChecks: {} },
    settings: { worldState: "open", entranceMode: "none" },
    entrances: { Dam: { to: "Elder House (East)", checked: true } },
    overworld: { foo: "bar" },
    scouts: { markers: {} },
    eventLog: { entries: [{ id: "1", timestamp: 123, label: "x" }] },
    // Slices intentionally excluded from snapshots:
    trackerState: { modalOpen: "none" },
    autotracker: { connected: false },
  } as unknown as RootState;
}

describe("stateSnapshot", () => {
  it("captures exactly the remembered slice keys", () => {
    const snapshot = buildStateSnapshot(fakeState());
    expect(Object.keys(snapshot.state).sort()).toEqual([...SNAPSHOT_KEYS].sort());
    expect((snapshot.state as Record<string, unknown>).trackerState).toBeUndefined();
    expect((snapshot.state as Record<string, unknown>).autotracker).toBeUndefined();
  });

  it("round-trips through JSON document/parse preserving state", () => {
    const snapshot = buildStateSnapshot(fakeState(), "test-build");
    const json = snapshotToJsonDocument(snapshot);
    expect(typeof json).toBe("string");

    const parsed = parseSnapshotJson(json);
    expect(parsed.v).toBe(1);
    expect(parsed.version).toBe("test-build");
    expect(parsed.state).toEqual(snapshot.state);
  });

  it("produces a snapshot independent of the live state object", () => {
    const state = fakeState();
    const snapshot = buildStateSnapshot(state);
    (state.items as Record<string, unknown>).sword = { count: 99 };
    expect((snapshot.state.items as unknown as Record<string, { count: number }>).sword.count).toBe(2);
  });

  it("throws on non-JSON input", () => {
    expect(() => parseSnapshotJson("not-json")).toThrow(/not valid JSON/);
  });

  it("throws on JSON missing tracker state", () => {
    expect(() => parseSnapshotJson('{"v":1}')).toThrow(/valid tracker state/);
  });
});
