import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import ChestCounter from "../ChestCounter";
import { renderWithStore, createTestStore } from "./renderWithStore";
import { setBigKey, incrementSmallKeyCount } from "@/store/dungeonsSlice";

function getCountEl() {
  // The inner div holding the number sits inside the chest sprite container.
  // It's the descendant containing only the numeric text.
  return document.querySelector("div.font-roboto") as HTMLElement;
}

describe("ChestCounter", () => {
  it("right-clicking on a fresh counter marks all chests collected (display = 0)", async () => {
    const user = userEvent.setup();
    renderWithStore(<ChestCounter dungeon="toh" />);
    const el = getCountEl();
    // Initial display equals total locations minus dungeon items (per default settings).
    expect(Number(el.textContent)).toBeGreaterThan(0);

    await user.pointer({ target: el, keys: "[MouseRight]" });

    expect(el.textContent).toBe("0");
  });

  it("right-click does not display 1 when big key tracked but location not checked (Bug 1 regression)", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    // Simulate the player tracking the big key manually without the location
    // being checked. Previously this drove `numChecks` negative and made the
    // chest counter unable to reach 0.
    store.dispatch(setBigKey({ dungeon: "toh", hasBigKey: true }));
    store.dispatch(incrementSmallKeyCount({ dungeon: "toh", decrement: false }));
    renderWithStore(<ChestCounter dungeon="toh" />, { store });
    const el = getCountEl();

    await user.pointer({ target: el, keys: "[MouseRight]" });

    expect(el.textContent).toBe("0");
  });

  it("left-clicking through the counter eventually reaches 0", () => {
    renderWithStore(<ChestCounter dungeon="toh" />);
    const el = getCountEl();
    const start = Number(el.textContent);
    expect(start).toBeGreaterThan(0);

    // userEvent is slow per-click; use fireEvent for the loop.
    for (let i = 0; i < start; i++) {
      fireEvent.click(el);
    }

    expect(el.textContent).toBe("0");
  });

  it("left-clicking past 0 wraps back to the full count", () => {
    renderWithStore(<ChestCounter dungeon="toh" />);
    const el = getCountEl();
    const start = Number(el.textContent);

    for (let i = 0; i < start; i++) fireEvent.click(el);
    expect(el.textContent).toBe("0");

    fireEvent.click(el);
    expect(Number(el.textContent)).toBe(start);
  });

  it("EP shows 3 chests by default (6 chests minus 3 dungeon items, no phantom prize subtraction)", () => {
    // EP totalLocations: chests=6, bigkey=true, map=true, compass=true,
    // prize=true (vanilla). Default settings: wildBigKeys=false, wildMaps=false,
    // wildCompasses=false, prizeShuffle=vanilla. The prize is NOT in
    // dungeonChecks (locationMapper filters it out for vanilla), so we should
    // subtract only big key + map + compass = 3 \u2192 display = 3.
    renderWithStore(<ChestCounter dungeon="ep" />);
    const el = getCountEl();
    expect(Number(el.textContent)).toBe(3);
  });
});

// ─── Enemy drop locations in statusCounts ─────────────────────────────────────

describe("ChestCounter – enemy drop locations in proportionalChestColors", () => {
  const EP_UNDERWORLD_LOCS = getActiveLocations("Eastern Palace", { ...settingsInitialState, enemyDrop: "underworld" });
  const EP_ENEMY_LOCS = EP_UNDERWORLD_LOCS.filter((loc) => loc.includes("Enemy #"));
  const EP_KEYDROP_LOCS = EP_UNDERWORLD_LOCS.filter((loc) => loc.includes("Key Drop"));
  const EP_KEYS_LOCS = getActiveLocations("Eastern Palace", { ...settingsInitialState, enemyDrop: "keys" });

  it("enemy locations appear when enemyDrop is underworld", () => {
    expect(EP_ENEMY_LOCS.length).toBeGreaterThan(0);
  });

  it("key drop locations appear when enemyDrop is underworld", () => {
    expect(EP_KEYDROP_LOCS.length).toBeGreaterThan(0);
  });

  it("key drop locations appear when enemyDrop is keys", () => {
    expect(EP_KEYS_LOCS.filter((loc) => loc.includes("Key Drop")).length).toBeGreaterThan(0);
  });

  it("enemy locations do not appear when enemyDrop is keys", () => {
    expect(EP_KEYS_LOCS.filter((loc) => loc.includes("Enemy #")).length).toBe(0);
  });

  it("enemy and key drop locations contribute to statusCounts when enemyDrop is underworld", () => {
    const store = createTestStore();
    store.dispatch(setSettings({ proportionalChestColors: true, enemyDrop: "underworld" }));
    // Set ALL active locations (chests + enemy + keyDrop) to "available" → single status
    setLocationsToStatus(store, EP_UNDERWORLD_LOCS, "available");

    const { container } = renderChestCounter("ep", store);
    const svg = container.querySelector("svg[viewBox='0 0 100 100']")!;
    // All unchecked locations share one status → single colored rect (not paths)
    expect(svg.querySelector("rect[fill-opacity]")).toBeTruthy();
    expect(svg.querySelectorAll("path")).toHaveLength(0);
  });

  it("enemy locations do not appear in statusCounts when enemyDrop is none", () => {
    const store = createTestStore();
    store.dispatch(setSettings({ proportionalChestColors: true, enemyDrop: "none" }));
    // Even if we set enemy-named locations to available, they shouldn't be active
    setLocationsToStatus(store, EP_ENEMY_LOCS, "available");

    // EP_LOCATIONS (default/none settings) doesn't include enemy locs
    const defaultLocs = getActiveLocations("Eastern Palace", settingsInitialState);
    expect(defaultLocs.filter((loc) => loc.includes("Enemy #")).length).toBe(0);
  });
});
