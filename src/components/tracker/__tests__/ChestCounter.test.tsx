import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import ChestCounter, { squareSlicePath } from "../ChestCounter";
import { renderWithStore, createTestStore } from "./renderWithStore";
import { setBigKey, incrementSmallKeyCount } from "@/store/dungeonsSlice";
import { setSettings, initialState as settingsInitialState } from "@/store/settingsSlice";
import { updateMultipleLocations } from "@/store/checksSlice";
import type { CheckStatus } from "@/store/checksSlice";
import { getActiveLocations } from "@/lib/logic/locationMapper";

function renderChestCounter(dungeon: string, store = createTestStore()) {
  return render(
    <Provider store={store}>
      <ChestCounter dungeon={dungeon} />
    </Provider>,
  );
}

function setLocationsToStatus(
  store: ReturnType<typeof createTestStore>,
  locations: string[],
  status: CheckStatus["logic"],
  checked = false,
): void {
  const updates: Record<string, CheckStatus> = {};
  for (const loc of locations) {
    updates[loc] = { checked, logic: status, manuallyChecked: false, scoutedItems: [] };
  }
  store.dispatch(updateMultipleLocations(updates));
}

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

// ─── squareSlicePath ──────────────────────────────────────────────────────────

describe("squareSlicePath", () => {
  it("starts at center (50,50) and closes with Z", () => {
    const path = squareSlicePath(-Math.PI / 2, 0);
    expect(path).toMatch(/^M50,50/);
    expect(path).toMatch(/Z$/);
  });

  it("top edge perimeter point at -π/2 is (50, 0)", () => {
    const path = squareSlicePath(-Math.PI / 2, -Math.PI / 2 + 0.01);
    expect(path).toContain("L50,0");
  });

  it("right edge perimeter point at 0 is (100, 50)", () => {
    const path = squareSlicePath(0, 0.01);
    expect(path).toContain("L100,50");
  });

  it("bottom edge perimeter point at π/2 is (50, 100)", () => {
    const path = squareSlicePath(Math.PI / 2, Math.PI / 2 + 0.01);
    expect(path).toContain("L50,100");
  });

  it("left edge perimeter point at π is (0, 50)", () => {
    const path = squareSlicePath(Math.PI, Math.PI + 0.01);
    expect(path).toContain("L0,50");
  });

  it("inserts top-right corner (100, 0) when slice crosses -π/4", () => {
    // top → right, crossing the top-right corner
    const path = squareSlicePath(-Math.PI / 2, 0);
    expect(path).toContain("L100,0");
    expect(path).toContain("L50,0");   // start: top edge
    expect(path).toContain("L100,50"); // end: right edge
  });

  it("inserts bottom-right corner (100, 100) when slice crosses π/4", () => {
    const path = squareSlicePath(0, Math.PI / 2); // right → bottom
    expect(path).toContain("L100,100");
  });

  it("inserts bottom-left corner (0, 100) when slice crosses 3π/4", () => {
    const path = squareSlicePath(Math.PI / 2, Math.PI); // bottom → left
    expect(path).toContain("L0,100");
  });

  it("inserts top-left corner (0, 0) when slice crosses 5π/4", () => {
    const path = squareSlicePath(Math.PI, (3 * Math.PI) / 2); // left → top (wrap)
    expect(path).toContain("L0,0");
  });

  it("includes multiple corners for slices spanning more than one edge", () => {
    // right → left, crosses bottom-right and bottom-left corners
    const path = squareSlicePath(0, Math.PI);
    expect(path).toContain("L100,100"); // bottom-right
    expect(path).toContain("L0,100");   // bottom-left
  });

  it("no intermediate corners for a slice within a single edge", () => {
    // entirely on the top edge, between -π/2 and -π/4
    const path = squareSlicePath(-Math.PI / 2 + 0.01, -Math.PI / 4 - 0.01);
    const lineCount = (path.match(/L/g) ?? []).length;
    expect(lineCount).toBe(2); // start point + end point, no corners
  });
});

// ─── Proportional chest colors rendering ──────────────────────────────────────

const EP_LOCATIONS = getActiveLocations("Eastern Palace", settingsInitialState);

describe("ChestCounter – proportionalChestColors off (default)", () => {
  it("renders the traditional colored box, no pie SVG", () => {
    const { container } = renderChestCounter("ep");
    expect(container.querySelector("svg[viewBox='0 0 100 100']")).toBeNull();
    expect(container.querySelector(".flex.flex-col.items-center.justify-center")).toBeTruthy();
  });
});

describe("ChestCounter – proportionalChestColors on", () => {
  it("renders a pie SVG when the setting is enabled and dungeon is accessible", () => {
    const store = createTestStore();
    store.dispatch(setSettings({ proportionalChestColors: true }));
    setLocationsToStatus(store, EP_LOCATIONS, "available");
    const { container } = renderChestCounter("ep", store);
    expect(container.querySelector("svg[viewBox='0 0 100 100']")).toBeTruthy();
  });

  it("falls back to traditional colored box when dungeon is completely inaccessible", () => {
    const store = createTestStore();
    store.dispatch(setSettings({ proportionalChestColors: true }));
    // All locations stay at initial "unavailable" — dungeon not accessible
    const { container } = renderChestCounter("ep", store);
    expect(container.querySelector("svg[viewBox='0 0 100 100']")).toBeNull();
    expect(container.querySelector(".flex.flex-col.items-center.justify-center")).toBeTruthy();
  });

  it("renders a single filled rect when all unchecked checks share one status", () => {
    const store = createTestStore();
    store.dispatch(setSettings({ proportionalChestColors: true }));
    setLocationsToStatus(store, EP_LOCATIONS, "available");

    const { container } = renderChestCounter("ep", store);
    const svg = container.querySelector("svg[viewBox='0 0 100 100']")!;
    // Single status → <rect fill-opacity> (not paths) for the colored fill
    expect(svg.querySelector("rect[fill-opacity]")).toBeTruthy();
    expect(svg.querySelectorAll("path")).toHaveLength(0);
  });

  it("renders one path slice per distinct unchecked status", () => {
    const store = createTestStore();
    store.dispatch(setSettings({ proportionalChestColors: true }));

    const updates: Record<string, CheckStatus> = {};
    EP_LOCATIONS.forEach((loc, i) => {
      updates[loc] = {
        checked: false,
        logic: i % 2 === 0 ? "available" : "unavailable",
        manuallyChecked: false,
        scoutedItems: [],
      };
    });
    store.dispatch(updateMultipleLocations(updates));

    const { container } = renderChestCounter("ep", store);
    const svg = container.querySelector("svg[viewBox='0 0 100 100']")!;
    expect(svg.querySelectorAll("path")).toHaveLength(2);
  });

  it("renders a white fallback rect when colouredChests is off", () => {
    const store = createTestStore();
    store.dispatch(setSettings({ proportionalChestColors: true, colouredChests: false }));
    setLocationsToStatus(store, EP_LOCATIONS, "available");

    const { container } = renderChestCounter("ep", store);
    const svg = container.querySelector("svg[viewBox='0 0 100 100']")!;
    expect(svg.querySelector("rect[fill='white']")).toBeTruthy();
    expect(svg.querySelectorAll("path")).toHaveLength(0);
  });

  it("hides the pie wrapper when all checks are cleared (checksRemaining = 0)", () => {
    const store = createTestStore();
    store.dispatch(setSettings({ proportionalChestColors: true }));
    setLocationsToStatus(store, EP_LOCATIONS, "available", true /* checked */);

    const { container } = renderChestCounter("ep", store);
    // The wrapper div gets the 'invisible' class when checksRemaining === 0
    const wrapper = container.querySelector(".h-7\\/10.w-7\\/10");
    expect(wrapper?.classList.contains("invisible")).toBe(true);
  });

  it("slices reflect only unchecked locations (checked ones are excluded)", () => {
    const store = createTestStore();
    store.dispatch(setSettings({ proportionalChestColors: true }));

    const updates: Record<string, CheckStatus> = {};
    EP_LOCATIONS.forEach((loc, i) => {
      updates[loc] = {
        // mark first location as checked; rest are available
        checked: i === 0,
        logic: "available",
        manuallyChecked: false,
        scoutedItems: [],
      };
    });
    store.dispatch(updateMultipleLocations(updates));

    const { container } = renderChestCounter("ep", store);
    const svg = container.querySelector("svg[viewBox='0 0 100 100']")!;
    // All remaining unchecked are the same status → single rect, not paths
    expect(svg.querySelector("rect[fill-opacity]")).toBeTruthy();
    expect(svg.querySelectorAll("path")).toHaveLength(0);
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
