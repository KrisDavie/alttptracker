import { describe, expect, it } from "vitest";
import type { RegionLogic, WorldLogic } from "@/data/logic/logicTypes";
import { OverworldTraverser } from "../overworldTraverser";
import { gameState } from "./testHelpers";

const open: WorldLogic = { Open: {}, Inverted: {} };
const needsRouteFromAToB: WorldLogic = {
  Open: { always: "canReachFrom|A|B" },
  Inverted: { always: "canReachFrom|A|B" },
};

function makeRegion(partial: Partial<RegionLogic>): RegionLogic {
  return {
    type: partial.type ?? "LightWorld",
    exits: partial.exits ?? {},
    entrances: partial.entrances ?? [],
    locations: partial.locations ?? {},
    owid: partial.owid,
    tileid: partial.tileid,
  };
}

function calculate(regions: Record<string, RegionLogic>) {
  const state = gameState().build();
  const traverser = new OverworldTraverser(state, { regions });
  return traverser.calculateAll();
}

describe("canReachFrom", () => {
  it("does not count regions that are only reachable from Menu", () => {
    const result = calculate({
      Menu: makeRegion({
        type: "Menu",
        exits: {
          "Start A": { to: "A", type: "LightWorld", requirements: open },
          "Start B": { to: "B", type: "LightWorld", requirements: open },
        },
        tileid: -1,
      }),
      "Flute Sky": makeRegion({ type: "Menu" }),
      A: makeRegion({}),
      B: makeRegion({
        locations: {
          "Needs Route From A": { requirements: needsRouteFromAToB },
        },
      }),
    });

    expect(result.locationsLogic["Needs Route From A"]).toBe("unavailable");
  });

  it("allows a location when the source can walk to the target", () => {
    const result = calculate({
      Menu: makeRegion({
        type: "Menu",
        exits: {
          "Start A": { to: "A", type: "LightWorld", requirements: open },
        },
        tileid: -1,
      }),
      "Flute Sky": makeRegion({ type: "Menu" }),
      A: makeRegion({
        exits: {
          "Walk to B": { to: "B", type: "LightWorld", requirements: open },
        },
      }),
      B: makeRegion({
        locations: {
          "Needs Route From A": { requirements: needsRouteFromAToB },
        },
      }),
    });

    expect(result.locationsLogic["Needs Route From A"]).toBe("available");
  });
});