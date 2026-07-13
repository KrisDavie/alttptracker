import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import LogicProvider from "@/components/LogicProvider";
import MapLocation from "@/components/tracker/MapLocation";
import { locationsData } from "@/data/locationsData";
import { createTestStore } from "@/components/tracker/__tests__/renderWithStore";
import { setItemCount, updateMultipleItems } from "@/store/itemsSlice";
import { setSequenceBreaks, setSettings } from "@/store/settingsSlice";
import { updateDungeonState } from "@/store/dungeonsSlice";

type TestStore = ReturnType<typeof createTestStore>;

/**
 * Renders the MapLocation for a given location name, wrapped in
 * LogicProvider so the full logic engine runs end-to-end via Redux.
 */
function renderLocationWithLogic(locationName: string, store?: TestStore) {
  const testStore = store ?? createTestStore();
  const location = locationsData[locationName];
  if (!location) throw new Error(`Unknown location: ${locationName}`);

  const result = render(
    <Provider store={testStore}>
      <LogicProvider>
        <MapLocation name={locationName} location={location} type="item" className="h-4 w-4" tooltip={true} isEntrance={false} />
      </LogicProvider>
    </Provider>,
  );

  return { store: testStore, ...result };
}

describe("E2E: Default settings", () => {
  it("Links House map square should be available with default settings", async () => {
    renderLocationWithLogic("Links House");

    // LogicProvider runs the logic engine in a useEffect, so we need to wait
    // for the Redux dispatch cycle to complete and the component to re-render.
    await waitFor(() => {
      const el = document.querySelector(".absolute.inset-0") as HTMLElement;
      expect(el).toBeTruthy();
      expect(el.className).toContain("bg-status-available");
    });
  });

  it("Links House tooltip should display 'available' status", async () => {
    renderLocationWithLogic("Links House");

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
      const el = document.querySelector(".absolute.inset-0") as HTMLElement;
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
      const el = document.querySelector(".absolute.inset-0") as HTMLElement;
      expect(el).toBeTruthy();
      // Some but not all locations are available, so the square reflects the mixed state
      expect(el.className).toContain("bg-status-someAvailable");
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

describe("E2E: ool checks", () => {
    it("Dark cross ool reason", async () => {
    const store = createTestStore();

    store.dispatch(setSequenceBreaks({ canNavigateDarkRooms: true }));

    renderLocationWithLogic("Hyrule Castle", store);

    await waitFor(() => {
      const el = document.querySelector(".absolute.inset-0") as HTMLElement;
      expect(el).toBeTruthy();
      // Mixed available + ool locations render as someAvailable
      expect(el.className).toContain("bg-status-someAvailable");
    });

    // Dark cross should be ool, and show why
    const availableTexts = screen.getAllByText("ool ?");
    expect(availableTexts).toHaveLength(1);
    expect(availableTexts[0].title).toContain("Requires: Dark Room Navigation");
  });

  it("Old man ool reason", async () => {
    const store = createTestStore();
    store.dispatch(setSequenceBreaks({ canNavigateDarkRooms: true }));
    store.dispatch(
      updateMultipleItems({
        glove: 1,
      }),
    );

    renderLocationWithLogic("Old Man", store);

    await waitFor(() => {
      const el = document.querySelector(".absolute.inset-0") as HTMLElement;
      expect(el).toBeTruthy();
      expect(el.className).toContain("bg-status-ool");
    });

    // Old man should be ool, and show why
    const availableTexts = screen.getAllByText("ool ?");
    expect(availableTexts).toHaveLength(1);
    expect(availableTexts[0].title).toContain("Requires: Dark Room Navigation");
  });

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
      const el = document.querySelector(".absolute.inset-0") as HTMLElement;
      expect(el).toBeTruthy();
      // Not all locations are available, so the square should reflect the best status
      expect(el.className).toContain("bg-status-ool");
    });

    // Should propagate dark room navigation
    const availableTexts = screen.getAllByText("ool ?");
    expect(availableTexts).toHaveLength(6);
    expect(availableTexts[0].title).toContain("Requires: Dark Room Navigation");


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
      const el = document.querySelector(".absolute.inset-0") as HTMLElement;
      expect(el).toBeTruthy();
      // Not all locations are available, so the square should reflect the best status
      expect(el.className).toContain("bg-status-ool");
    });

    const availableTexts = screen.getAllByText("ool ?");
    expect(availableTexts).toHaveLength(6);
  });
});
