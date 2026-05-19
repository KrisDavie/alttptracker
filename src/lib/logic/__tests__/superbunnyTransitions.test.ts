import { afterEach, describe, expect, it } from "vitest";
import type { RegionLogic } from "@/data/logic/logicTypes";
import { OverworldTraverser } from "../overworldTraverser";
import { getLogicSet } from "../logicMapper";
import { buildEffectiveRegions } from "../regionsProvider";
import { SUPERBUNNY_BLOCKED_EXITS } from "../dungeonConstants";
import { gameState } from "./testHelpers";

/**
 * Tests for the bunny → superbunny transition in OverworldTraverser.
 *
 * Rule: When the player is currently a bunny and has the Mirror, taking a
 * non-overworld exit (cave/dungeon entrance) flips them to "superbunny"
 * inside that destination region. Gated by:
 *   - logicMode: in-logic for overworldglitches/hybridglitches,
 *     sequence break only in noglitches (via sequenceBreaks.canSuperBunny).
 *   - SUPERBUNNY_BLOCKED_EXITS: exit-by-name opt-out list.
 *
 * Superbunny never persists through an overworld return: those transitions
 * always recompute link/bunny from the destination world.
 *
 * Test fixture: West Dark Death Mountain (Bottom) is reachable as a bunny
 * with all-items-minus-moonpearl in Open mode. Its "Spike Cave" exit is a
 * cave with no item requirements and only one entrance — a clean place to
 * observe the flip without transitive cave-to-cave routes interfering.
 */

const CAVE_REGION = "Spike Cave";
const SOURCE_REGION = "West Dark Death Mountain (Bottom)";
const EXIT_NAME = "Spike Cave";

describe("superbunny transitions", () => {
  it("flips bunny → superbunny on cave entry when overworldglitches and player has the Mirror", () => {
    const state = gameState()
      .withAllItems()
      .withoutItems(["moonpearl"])
      .withSettings({ logicMode: "overworldglitches" })
      .build();
    const logicSet = getLogicSet("overworldglitches");
    const traverser = new OverworldTraverser(state, logicSet);
    const reachable = traverser.traverse();

    expect(reachable.get(SOURCE_REGION)?.linkState).toBe("bunny");
    expect(reachable.get(CAVE_REGION)?.linkState).toBe("superbunny");
  });

  it("does NOT flip to superbunny in noglitches without canSuperBunny enabled", () => {
    const state = gameState()
      .withAllItems()
      .withoutItems(["moonpearl"])
      .withSettings({ logicMode: "noglitches" })
      .build();
    const logicSet = getLogicSet("noglitches");
    const traverser = new OverworldTraverser(state, logicSet);
    const reachable = traverser.traverse();

    expect(reachable.get(SOURCE_REGION)?.linkState).toBe("bunny");
    expect(reachable.get(CAVE_REGION)?.linkState).toBe("bunny");
  });

  it("flips bunny → superbunny in noglitches when canSuperBunny sequence break is enabled", () => {
    const state = gameState()
      .withAllItems()
      .withoutItems(["moonpearl"])
      .withSettings({ logicMode: "noglitches" })
      .withSequenceBreaks({ canSuperBunny: true })
      .build();
    const logicSet = getLogicSet("noglitches");
    const traverser = new OverworldTraverser(state, logicSet);
    const reachable = traverser.traverse();

    expect(reachable.get(CAVE_REGION)?.linkState).toBe("superbunny");
  });

  it("does NOT flip to superbunny without the Mirror", () => {
    const state = gameState()
      .withAllItems()
      .withoutItems(["moonpearl", "mirror"])
      .withSettings({ logicMode: "overworldglitches" })
      .build();
    const logicSet = getLogicSet("overworldglitches");
    const traverser = new OverworldTraverser(state, logicSet);
    const reachable = traverser.traverse();

    expect(reachable.get(SOURCE_REGION)?.linkState).toBe("bunny");
    expect(reachable.get(CAVE_REGION)?.linkState).toBe("bunny");
  });

  it("stays link when player has Moon Pearl (never a bunny in the first place)", () => {
    const state = gameState()
      .withAllItems()
      .withSettings({ logicMode: "overworldglitches" })
      .build();
    const logicSet = getLogicSet("overworldglitches");
    const traverser = new OverworldTraverser(state, logicSet);
    const reachable = traverser.traverse();

    expect(reachable.get(SOURCE_REGION)?.linkState).toBe("link");
    expect(reachable.get(CAVE_REGION)?.linkState).toBe("link");
  });

  it("[OWG] can open chests in superbunnyable entrances", () => {
    const state = gameState()
      .withAllItems()
      .withoutItems(["moonpearl"])
      .withSettings({ logicMode: "overworldglitches", entranceMode: "crossed" })
      .withEntranceLink("Elder House (East)", "Elder House (East)")
      .withEntranceLink("Chest Game", "Elder House (West)")
      .withEntranceLink("C-Shaped House", "Brewery")
      .build();
    const logicSet = getLogicSet("overworldglitches");
    const { regions, metadata } = buildEffectiveRegions(logicSet.regions as Record<string, RegionLogic>, state);
    const traverser = new OverworldTraverser(state, { ...logicSet, regions }, metadata);
    const result = traverser.calculateAll();

    expect(result.locationsLogic["Link's House"]).toBe("available");
    expect(result.locationsLogic["Brewery"]).toBe("available");
  }); 

  it("[OWG] cannot use bombs with superbunny", () => {
    const state = gameState()
      .withAllItems()
      .withoutItems(["moonpearl"])
      .withSettings({ logicMode: "overworldglitches", entranceMode: "crossed" })
      .withEntranceLink("Elder House (East)", "Elder House (East)")
      .withEntranceLink("Chest Game", "Elder House (West)")
      .withEntranceLink("C-Shaped House", "Graveyard Cave")
      .build();
    const logicSet = getLogicSet("overworldglitches");
    const { regions, metadata } = buildEffectiveRegions(logicSet.regions as Record<string, RegionLogic>, state);
    const traverser = new OverworldTraverser(state, { ...logicSet, regions }, metadata);
    const result = traverser.calculateAll();

    expect(result.locationsLogic["Link's House"]).toBe("available");
    expect(result.locationsLogic["Graveyard Cave"]).toBe("unavailable");
  }); 

  it("[OWG] can bonk open walls with superbunny", () => {
    const state = gameState()
      .withAllItems()
      .withoutItems(["moonpearl"])
      .withSettings({ logicMode: "overworldglitches", entranceMode: "crossed" })
      .withEntranceLink("Elder House (East)", "Elder House (East)")
      .withEntranceLink("Chest Game", "Elder House (West)")
      .withEntranceLink("C-Shaped House", "Sahasrahlas Hut")
      .build();
    const logicSet = getLogicSet("overworldglitches");
    const { regions, metadata } = buildEffectiveRegions(logicSet.regions as Record<string, RegionLogic>, state);
    const traverser = new OverworldTraverser(state, { ...logicSet, regions }, metadata);
    const result = traverser.calculateAll();

    expect(result.locationsLogic["Link's House"]).toBe("available");
    expect(result.locationsLogic["Sahasrahla's Hut - Left"]).toBe("available");
  }); 

  it("[NMG] can open chests ool in superbunnyable entrances", () => {
    const state = gameState()
      .withAllItems()
      .withoutItems(["moonpearl"])
      .withSequenceBreaks({ canSuperBunny: true })
      .withSettings({ logicMode: "noglitches", entranceMode: "crossed" })
      .withEntranceLink("Elder House (East)", "Elder House (East)")
      .withEntranceLink("Chest Game", "Elder House (West)")
      .withEntranceLink("C-Shaped House", "Brewery")
      .build();
    const logicSet = getLogicSet("noglitches");
    const { regions, metadata } = buildEffectiveRegions(logicSet.regions as Record<string, RegionLogic>, state);
    const traverser = new OverworldTraverser(state, { ...logicSet, regions }, metadata);
    const result = traverser.calculateAll();

    expect(result.locationsLogic["Link's House"]).toBe("available");
    expect(result.locationsLogic["Brewery"]).toBe("ool");
  }); 

  describe("SUPERBUNNY_BLOCKED_EXITS", () => {
    afterEach(() => {
      SUPERBUNNY_BLOCKED_EXITS.delete(EXIT_NAME);
    });

    it("respects SUPERBUNNY_BLOCKED_EXITS opt-out list", () => {
      SUPERBUNNY_BLOCKED_EXITS.add(EXIT_NAME);

      const state = gameState()
        .withAllItems()
        .withoutItems(["moonpearl"])
        .withSettings({ logicMode: "overworldglitches" })
        .build();
      const logicSet = getLogicSet("overworldglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const reachable = traverser.traverse();

      // Source still bunny; blocked exit prevents the superbunny upgrade.
      expect(reachable.get(SOURCE_REGION)?.linkState).toBe("bunny");
      expect(reachable.get(CAVE_REGION)?.linkState).toBe("bunny");
    });
  });
});
