import { describe, it, expect } from "vitest";
import EntranceLinesOverlay from "@/components/tracker/EntranceLinesOverlay";
import OWMap from "@/components/layouts/Map/OWMap";
import { renderWithStore, createTestStore } from "@/components/tracker/__tests__/renderWithStore";
import { setSettings, type MapMode, type SettingsState } from "@/store/settingsSlice";
import { setEntranceLink } from "@/store/entrancesSlice";
import { entranceLocations } from "@/data/locationsData";

/**
 * Regression tests for map layout modes:
 * 1. EntranceLinesOverlay used to treat only mapMode === "vertical" as
 *    vertical, so the vertical POPOUT ("popoutVertical") rendered connector
 *    lines with horizontal-layout math (wrong positions).
 * 2. OWMap's bottom buttons were anchored by world identity (LW → right,
 *    DW → left), so in inverted world states — where the DW map renders
 *    first — they landed at the outer extremes instead of the middle seam.
 */

function renderOverlay(mapMode: MapMode, settingsOverrides: Partial<SettingsState> = {}) {
  const store = createTestStore();
  store.dispatch(
    setSettings({
      mapMode,
      entranceMode: "crossed",
      connectionLinesMode: "all",
      ...settingsOverrides,
    }),
  );
  // Link two entrances of the same connector group ("kakariko_well") so the
  // overlay has one line to draw. Linking A→"Kakariko Well Drop" and
  // B→"Kakariko Well Cave" groups A and B.
  store.dispatch(setEntranceLink({ entrance: "Dam", to: "Kakariko Well Drop" }));
  store.dispatch(setEntranceLink({ entrance: "Links House", to: "Kakariko Well Cave" }));
  return renderWithStore(<EntranceLinesOverlay />, { store });
}

function getLineCoords(container: HTMLElement) {
  const line = container.querySelector("line");
  expect(line).toBeTruthy();
  return {
    x1: line!.getAttribute("x1"),
    y1: line!.getAttribute("y1"),
    x2: line!.getAttribute("x2"),
    y2: line!.getAttribute("y2"),
  };
}

describe("EntranceLinesOverlay layout modes", () => {
  it("popoutVertical uses the same stacked-map coordinates as vertical", () => {
    const vertical = getLineCoords(renderOverlay("vertical").container);
    const popoutVertical = getLineCoords(renderOverlay("popoutVertical").container);
    expect(popoutVertical).toEqual(vertical);
  });

  it("vertical modes place both endpoints of a same-world line at full-width x", () => {
    // Dam and Links House are both LW: in a stacked layout their x must NOT
    // be compressed into the left half. Expected x = loc.x / 512 * 100.
    const { container } = renderOverlay("popoutVertical");
    const coords = getLineCoords(container);
    const expectedX1 = `${(entranceLocations["Dam"].x / 512) * 100}%`;
    const expectedX2 = `${(entranceLocations["Links House"].x / 512) * 100}%`;
    expect(coords.x1).toBe(expectedX1);
    expect(coords.x2).toBe(expectedX2);
    // And y is confined to the top (LW) half: raw y / 2.
    expect(coords.y1).toBe(`${(entranceLocations["Dam"].y / 512) * 100 / 2}%`);
  });

  it("horizontal modes compress x into the world's half instead", () => {
    const { container } = renderOverlay("normal");
    const coords = getLineCoords(container);
    const expectedX1 = `${((entranceLocations["Dam"].x / 512) * 100) / 2}%`;
    expect(coords.x1).toBe(expectedX1);
  });
});

function renderMap(world: "lw" | "dw", settingsOverrides: Partial<SettingsState> = {}) {
  const store = createTestStore();
  store.dispatch(setSettings({ entranceMode: "crossed", mapMode: "normal", ...settingsOverrides }));
  return renderWithStore(<OWMap world={world} />, { store });
}

function getButtonContainer(container: HTMLElement) {
  const el = container.querySelector("div.absolute.bottom-1");
  expect(el).toBeTruthy();
  return el as HTMLElement;
}

describe("OWMap bottom-button placement", () => {
  it("open world state: LW (first map) anchors right, DW (second) anchors left", () => {
    const lw = getButtonContainer(renderMap("lw").container);
    expect(lw.className).toContain("right-1");
    const dw = getButtonContainer(renderMap("dw").container);
    expect(dw.className).toContain("left-1");
  });

  it("inverted world state: DW (first map) anchors right, LW (second) anchors left", () => {
    const dw = getButtonContainer(renderMap("dw", { worldState: "inverted" }).container);
    expect(dw.className).toContain("right-1");
    const lw = getButtonContainer(renderMap("lw", { worldState: "inverted" }).container);
    expect(lw.className).toContain("left-1");
  });

  it("inverted_1 world state also flips button anchoring", () => {
    const dw = getButtonContainer(renderMap("dw", { worldState: "inverted_1" }).container);
    expect(dw.className).toContain("right-1");
    const lw = getButtonContainer(renderMap("lw", { worldState: "inverted_1" }).container);
    expect(lw.className).toContain("left-1");
  });

  it("vertical mode: buttons render only on the first map (DW when inverted)", () => {
    // Open: buttons on LW, none on DW
    const lwOpen = getButtonContainer(renderMap("lw", { mapMode: "vertical" }).container);
    expect(lwOpen.querySelectorAll("button")).toHaveLength(2);
    const dwOpen = getButtonContainer(renderMap("dw", { mapMode: "vertical" }).container);
    expect(dwOpen.querySelectorAll("button")).toHaveLength(0);
    // Inverted: buttons on DW, none on LW
    const dwInv = getButtonContainer(renderMap("dw", { mapMode: "vertical", worldState: "inverted" }).container);
    expect(dwInv.querySelectorAll("button")).toHaveLength(2);
    const lwInv = getButtonContainer(renderMap("lw", { mapMode: "vertical", worldState: "inverted" }).container);
    expect(lwInv.querySelectorAll("button")).toHaveLength(0);
  });
});
