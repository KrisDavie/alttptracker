import { describe, it, expect } from "vitest";
import { fireEvent, act } from "@testing-library/react";
import SmallKeyTracker from "../SmallKeyTracker";
import { renderWithStore, createTestStore } from "./renderWithStore";
import DungeonsData from "@/data/dungeonData";
import { setSettings } from "@/store/settingsSlice";

function makeStore() {
  // Disable showKeyTotals so the tracker renders a single numeric div,
  // making DOM assertions unambiguous.
  const store = createTestStore();
  store.dispatch(setSettings({ ...store.getState().settings, showKeyTotals: false }));
  return store;
}

function getRoot() {
  return document.querySelector("div.flex.flex-row") as HTMLElement;
}

function getDisplayedCount() {
  const root = getRoot();
  // Find the leaf div whose textContent is a number.
  const numericLeaf = Array.from(root.querySelectorAll("div")).find((d) => {
    return d.children.length === 0 && /^\d+$/.test(d.textContent ?? "");
  });
  return numericLeaf ? Number(numericLeaf.textContent) : NaN;
}

describe("SmallKeyTracker", () => {
  it("displays 0 by default", () => {
    renderWithStore(<SmallKeyTracker dungeon="toh" />, { store: makeStore() });
    expect(getDisplayedCount()).toBe(0);
  });

  it("left-click increments the displayed count", () => {
    renderWithStore(<SmallKeyTracker dungeon="toh" />, { store: makeStore() });
    fireEvent.click(getRoot());
    expect(getDisplayedCount()).toBe(1);
  });

  it("left-click stops at the dungeon's max small key count (Bug 2 regression)", () => {
    const store = makeStore();
    renderWithStore(<SmallKeyTracker dungeon="toh" />, { store });
    const root = getRoot();
    const max = DungeonsData.toh.totalLocations?.smallkeys ?? 0;
    expect(max).toBe(1);

    for (let i = 0; i < 10; i++) fireEvent.click(root);

    expect(getDisplayedCount()).toBe(max);
    expect(store.getState().dungeons.toh.manuallyChanged.smallKeys).toBe(max);
  });

  it("right-click stops at 0 and does not drift negative", () => {
    const store = makeStore();
    renderWithStore(<SmallKeyTracker dungeon="toh" />, { store });
    const root = getRoot();

    for (let i = 0; i < 5; i++) fireEvent.contextMenu(root);

    expect(getDisplayedCount()).toBe(0);
    expect(store.getState().dungeons.toh.manuallyChanged.smallKeys).toBe(0);
  });

  it("after capping at max, a single right-click decrements display by 1", () => {
    const store = makeStore();
    renderWithStore(<SmallKeyTracker dungeon="toh" />, { store });
    const root = getRoot();
    const max = DungeonsData.toh.totalLocations?.smallkeys ?? 0;

    for (let i = 0; i < 10; i++) fireEvent.click(root);
    expect(getDisplayedCount()).toBe(max);

    fireEvent.contextMenu(root);
    expect(getDisplayedCount()).toBe(max - 1);
  });

  it("reclamps the stored offset when settings reduce maxSmallKeys", () => {
    // Use a dungeon whose max small keys depends on pottery/enemyDrop so we can
    // shrink the max via a settings change. Desert Palace: smallkeys=1 + keypots=3 + keydrops=0.
    // With pottery="keys" and enemyDrop="keys", max = 4. Turning both off, max = 1.
    const store = createTestStore();
    store.dispatch(
      setSettings({
        ...store.getState().settings,
        showKeyTotals: false,
        pottery: "keys",
        enemyDrop: "keys",
      }),
    );
    renderWithStore(<SmallKeyTracker dungeon="dp" />, { store });
    const root = getRoot();

    // Fill to max (4).
    for (let i = 0; i < 4; i++) fireEvent.click(root);
    expect(getDisplayedCount()).toBe(4);
    expect(store.getState().dungeons.dp.manuallyChanged.smallKeys).toBe(4);

    // Reduce max by toggling pottery / enemyDrop off.
    act(() => {
      store.dispatch(
        setSettings({
          ...store.getState().settings,
          pottery: "none",
          enemyDrop: "none",
        }),
      );
    });

    // Displayed count caps at new max (1), and the underlying offset is
    // reclamped so a single right-click brings the display down to 0.
    expect(getDisplayedCount()).toBe(1);
    expect(store.getState().dungeons.dp.manuallyChanged.smallKeys).toBe(1);

    fireEvent.contextMenu(root);
    expect(getDisplayedCount()).toBe(0);
  });
});
