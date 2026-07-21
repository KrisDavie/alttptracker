import { describe, it, expect } from "vitest";
import { REMEMBER_REHYDRATED } from "redux-remember";
import reducer from "@/store/itemsSlice";

/**
 * Regression tests for item-state hydration of pre-existing sessions.
 *
 * `bombcapacity` was added after some sessions were already persisted. Those
 * sessions' saved `items` object does not contain a `bombcapacity` entry, so
 * rehydration must fall back to the initial value (10) rather than leaving it
 * unset (which would read as 0 and wrongly gate bomb logic).
 */
describe("itemsSlice hydration", () => {
  it("defaults bombcapacity to 10 for a session saved before bombcapacity existed", () => {
    const oldSessionItems = {
      bomb: { amount: 0, manuallyChanged: false },
      sword: { amount: 1, manuallyChanged: false },
      moonpearl: { amount: 1, manuallyChanged: false },
    };

    const state = reducer(undefined, { type: REMEMBER_REHYDRATED, payload: { items: oldSessionItems } });

    expect(state.bombcapacity).toBeDefined();
    expect(state.bombcapacity.amount).toBe(10);
    // Persisted items are still applied over the defaults.
    expect(state.sword.amount).toBe(1);
    expect(state.moonpearl.amount).toBe(1);
  });

  it("respects an explicitly persisted bombcapacity value", () => {
    const sessionItems = { bombcapacity: { amount: 0, manuallyChanged: true } };
    const state = reducer(undefined, { type: REMEMBER_REHYDRATED, payload: { items: sessionItems } });
    expect(state.bombcapacity.amount).toBe(0);
  });

  it("uses initial state (bombcapacity 10) when nothing is persisted", () => {
    const state = reducer(undefined, { type: REMEMBER_REHYDRATED, payload: {} });
    expect(state.bombcapacity.amount).toBe(10);
  });
});
