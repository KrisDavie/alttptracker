import { describe, it, expect } from "vitest";
import { OverworldTraverser } from "../overworldTraverser";
import { gameState } from "./testHelpers";
import type { RegionLogic } from "@/data/logic/logicTypes";
import type { LogicSet } from "../logicMapper";

/**
 * Regression tests: accessibility must never be downgraded — a region first
 * reached via a worse path (e.g. an out-of-logic sequence break) must be
 * upgraded when a better path is found later, regardless of processing order.
 *
 * Uses a small synthetic region graph so the traversal order that triggered
 * the historical bugs is deterministic:
 * - Flaw A: dungeon external exits never upgraded already-reached regions
 *   (the overworld BFS always ran before dungeons, so an OOL overworld path
 *   permanently masked an in-logic dungeon-connector path).
 * - Flaw B: a blocked exit was permanently discarded once its destination was
 *   reachable at ANY status, so it could never deliver an upgrade when its
 *   canReach requirement later resolved.
 * - Flaw C: exits evaluating "ool" were never re-evaluated at all, so a
 *   logical tier that later became satisfiable never upgraded the destination.
 */

// Requirement shorthands (WorldLogic shapes)
const FREE = { Open: {}, Inverted: {} };
// "required" tier only → evaluates to "ool" when boots are owned
const OOL_WITH_BOOTS = { Open: { required: "boots" }, Inverted: { required: "boots" } };
const logicalCanReach = (target: string) => ({
  Open: { logical: `canReach|${target}` },
  Inverted: { logical: `canReach|${target}` },
});

function makeTraverser(regions: Record<string, unknown>) {
  const state = gameState().withItems({ boots: 1 }).build();
  const logicSet = { regions } as unknown as LogicSet;
  return new OverworldTraverser(state, logicSet, undefined);
}

const MENU_REGION = {
  exits: { "Test S&Q": { to: "Start Area", type: "LightWorld", requirements: FREE } },
  entrances: [],
  type: "Menu",
  locations: {},
};

const TARGET_REGION = {
  exits: {},
  entrances: [],
  type: "LightWorld",
  locations: { "Target Chest": { requirements: FREE } },
  owid: 1,
};

const GATE_REGION = {
  exits: {},
  entrances: [],
  type: "LightWorld",
  locations: {},
  owid: 2,
};

describe("OOL status upgrade propagation", () => {
  it("upgrades a region reached OOL first when a dungeon connector later provides in-logic access (flaw A)", () => {
    // "Sneaky Path" (ool) is processed by the BFS before the dungeon runs,
    // so Target Area is first recorded as "ool". The dungeon's external exit
    // then provides an "available" path and must upgrade it.
    const regions: Record<string, RegionLogic> = {
      Menu: MENU_REGION,
      "Start Area": {
        exits: {
          "Sneaky Path": { to: "Target Area", type: "LightWorld", requirements: OOL_WITH_BOOTS },
          "Hyrule Castle Test Entrance": { to: "Hyrule Castle Portal", type: "Dungeon", requirements: FREE },
        },
        entrances: [],
        type: "LightWorld",
        locations: {},
        owid: 0,
      },
      "Hyrule Castle Portal": {
        exits: {
          "Castle Return Exit": { to: "Target Area", type: "LightWorld", requirements: FREE },
        },
        entrances: [],
        type: "Dungeon",
        locations: {},
      },
      "Target Area": TARGET_REGION,
    } as unknown as Record<string, RegionLogic>;

    const traverser = makeTraverser(regions);
    const reachable = traverser.traverse();

    expect(reachable.get("Target Area")?.status).toBe("available");
    const { locationsLogic } = traverser.calculateAll();
    expect(locationsLogic["Target Chest"]).toBe("available");
  });

  it("re-evaluates a blocked exit and upgrades an already-reached (ool) destination (flaw B)", () => {
    // Exit order matters: "Ool Shortcut" reaches Target Area first (ool),
    // "Guarded Way" is blocked (its canReach target isn't reached yet) and
    // must later upgrade Target Area to available.
    const regions = {
      Menu: MENU_REGION,
      "Start Area": {
        exits: {
          "Ool Shortcut": { to: "Target Area", type: "LightWorld", requirements: OOL_WITH_BOOTS },
          "Guarded Way": { to: "Target Area", type: "LightWorld", requirements: logicalCanReach("Gate Area") },
          "Gate Path": { to: "Gate Area", type: "LightWorld", requirements: FREE },
        },
        entrances: [],
        type: "LightWorld",
        locations: {},
        owid: 0,
      },
      "Gate Area": GATE_REGION,
      "Target Area": TARGET_REGION,
    } as unknown as Record<string, RegionLogic>;

    const traverser = makeTraverser(regions);
    const reachable = traverser.traverse();

    expect(reachable.get("Target Area")?.status).toBe("available");
    const { locationsLogic } = traverser.calculateAll();
    expect(locationsLogic["Target Chest"]).toBe("available");
  });

  it("re-evaluates an exit that initially evaluated ool once its logical tier resolves (flaw C)", () => {
    // "Tricky Way" is the ONLY path to Target Area. It first evaluates "ool"
    // (required tier via boots) because its logical tier needs canReach|Gate
    // Area, which isn't reached yet. Once Gate Area is reachable the logical
    // tier is satisfied and Target Area must upgrade to "available".
    const regions = {
      Menu: MENU_REGION,
      "Start Area": {
        exits: {
          "Tricky Way": {
            to: "Target Area",
            type: "LightWorld",
            requirements: {
              Open: { logical: "canReach|Gate Area", required: "boots" },
              Inverted: { logical: "canReach|Gate Area", required: "boots" },
            },
          },
          "Gate Path": { to: "Gate Area", type: "LightWorld", requirements: FREE },
        },
        entrances: [],
        type: "LightWorld",
        locations: {},
        owid: 0,
      },
      "Gate Area": GATE_REGION,
      "Target Area": TARGET_REGION,
    } as unknown as Record<string, RegionLogic>;

    const traverser = makeTraverser(regions);
    const reachable = traverser.traverse();

    expect(reachable.get("Target Area")?.status).toBe("available");
    const { locationsLogic } = traverser.calculateAll();
    expect(locationsLogic["Target Chest"]).toBe("available");
  });

  it("keeps a genuinely out-of-logic region at ool (no false upgrades)", () => {
    // Only the ool path exists — the status must remain "ool", never be
    // upgraded or downgraded by re-evaluation passes.
    const regions = {
      Menu: MENU_REGION,
      "Start Area": {
        exits: {
          "Sneaky Path": { to: "Target Area", type: "LightWorld", requirements: OOL_WITH_BOOTS },
        },
        entrances: [],
        type: "LightWorld",
        locations: {},
        owid: 0,
      },
      "Target Area": TARGET_REGION,
    } as unknown as Record<string, RegionLogic>;

    const traverser = makeTraverser(regions);
    const reachable = traverser.traverse();

    expect(reachable.get("Target Area")?.status).toBe("ool");
    const { locationsLogic } = traverser.calculateAll();
    expect(locationsLogic["Target Chest"]).toBe("ool");
  });
});
