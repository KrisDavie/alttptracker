import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import LogicProvider from "@/components/LogicProvider";
import MapItemLocation from "@/components/tracker/MapItemLocation";
import { locationsData } from "@/data/locationsData";
import { createTestStore } from "@/components/tracker/__tests__/renderWithStore";
import { setItemCount, updateMultipleItems } from "@/store/itemsSlice";
import { setSequenceBreaks, setSettings } from "@/store/settingsSlice";
import { updateDungeonState } from "@/store/dungeonsSlice";

type TestStore = ReturnType<typeof createTestStore>;

/**
 * Renders the MapItemLocation for a given location name, wrapped in
 * LogicProvider so the full logic engine runs end-to-end via Redux.
 */
function renderLocationWithLogic(locationName: string, store?: TestStore) {
  const testStore = store ?? createTestStore();
  const location = locationsData[locationName];
  if (!location) throw new Error(`Unknown location: ${locationName}`);

  const result = render(
    <Provider store={testStore}>
      <LogicProvider>
        <MapItemLocation name={locationName} location={location} type="item" className="h-4 w-4" tooltip={true} />
      </LogicProvider>
    </Provider>,
  );

  return { store: testStore, ...result };
}

describe("E2E: Default settings", () => {
  it("Link's House map square should be available with default settings", async () => {
    renderLocationWithLogic("Link's House");

    // LogicProvider runs the logic engine in a useEffect, so we need to wait
    // for the Redux dispatch cycle to complete and the component to re-render.
    await waitFor(() => {
      const el = document.querySelector(".absolute") as HTMLElement;
      expect(el).toBeTruthy();
      expect(el.className).toContain("bg-status-available");
    });
  });

  it("Link's House tooltip should display 'available' status", async () => {
    renderLocationWithLogic("Link's House");

    await waitFor(() => {
      // The tooltip renders the status text for a single-check location
      const statusText = screen.getByText("available");
      expect(statusText).toBeTruthy();
    });
  });

  it("Mini Moldorm Cave should show all 5 locations as available when player has bombs", async () => {
    const store = createTestStore();
    store.dispatch(setItemCount({ itemName: "bomb", count: 1 }));
    renderLocationWithLogic("Mini Moldorm Cave", store);

    await waitFor(() => {
      const el = document.querySelector(".absolute") as HTMLElement;
      expect(el).toBeTruthy();
      expect(el.className).toContain("bg-status-available");
    });

    // The tooltip should show all 5 chest locations as available
    const statusTexts = screen.getAllByText("available");
    expect(statusTexts).toHaveLength(5);

    // Verify each location name appears in the tooltip
    for (const name of ["Far Left", "Left", "Right", "Far Right", "Generous Guy"]) {
      expect(screen.getByText(name)).toBeTruthy();
    }
  });

  it("Kakariko Well without bombs: Top should be unavailable, others available", async () => {
    renderLocationWithLogic("Kakariko Well");

    await waitFor(() => {
      const el = document.querySelector(".absolute") as HTMLElement;
      expect(el).toBeTruthy();
      // Not all locations are available, so the square should reflect the best status
      expect(el.className).toContain("bg-status-available");
    });

    // The 4 chests in the top section (no bombs needed) should be available
    const availableTexts = screen.getAllByText("available");
    expect(availableTexts).toHaveLength(4);

    // The back section "Top" chest requires bombs, so it should be unavailable
    const unavailableTexts = screen.getAllByText("unavailable");
    expect(unavailableTexts).toHaveLength(1);

    // Verify all 5 location names appear
    expect(screen.getByText("Top")).toBeTruthy();
    expect(screen.getByText("Left")).toBeTruthy();
    expect(screen.getByText("Middle")).toBeTruthy();
    expect(screen.getByText("Right")).toBeTruthy();
    expect(screen.getByText("Bottom")).toBeTruthy();
  });
});

describe("E2E: Keysanity with ool checks", () => {
  it("Hera with no lamp, but with FR", async () => {
    const store = createTestStore();

    // Mountain climbable
    store.dispatch(setSequenceBreaks({ canNavigateDarkRooms: true }));
    store.dispatch(
      updateMultipleItems({
        glove: 1,
        firerod: 1,
        mirror: 1,
        sword: 1,
      }),
    );

    renderLocationWithLogic("Tower of Hera", store);

    await waitFor(() => {
      const el = document.querySelector(".absolute") as HTMLElement;
      expect(el).toBeTruthy();
      // Not all locations are available, so the square should reflect the best status
      expect(el.className).toContain("bg-status-ool");
    });

    const availableTexts = screen.getAllByText("ool");
    expect(availableTexts).toHaveLength(6);
  });

  it("Hera with no lamp, but with FR, keysanity", async () => {
    const store = createTestStore();

    // Mountain climbable
    store.dispatch(setSequenceBreaks({ canNavigateDarkRooms: true }));
    store.dispatch(setSettings({ wildSmallKeys: "wild", wildBigKeys: true }));
    store.dispatch(
      updateMultipleItems({
        glove: 1,
        firerod: 1,
        mirror: 1,
        sword: 1,
      }),
    );
    store.dispatch(
      updateDungeonState({
        dungeon: "toh",
        newState: {
          smallKeys: 1,
          bigKey: true,
        },
      }),
    );

    renderLocationWithLogic("Tower of Hera", store);

    await waitFor(() => {
      const el = document.querySelector(".absolute") as HTMLElement;
      expect(el).toBeTruthy();
      // Not all locations are available, so the square should reflect the best status
      expect(el.className).toContain("bg-status-ool");
    });

    const availableTexts = screen.getAllByText("ool");
    expect(availableTexts).toHaveLength(6);
  });
});
