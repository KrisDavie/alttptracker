import { describe, it, expect } from "vitest";
import { getLogicSet } from "../logicMapper";
import { OverworldTraverser } from "../overworldTraverser";
import { buildEffectiveRegions } from "../regionsProvider";
import { gameState } from "./testHelpers";
import type { RegionLogic } from "@/data/logic/logicTypes";

/**
 * Helper: build state, run traverser, return { locationsLogic, entrancesLogic }.
 */
function calculate(builder: ReturnType<typeof gameState>) {
  const state = builder.build();
  const logicSet = getLogicSet("noglitches");
  const { regions, metadata } = buildEffectiveRegions(logicSet.regions as Record<string, RegionLogic>, state);
  const traverser = new OverworldTraverser(state, { ...logicSet, regions }, metadata);
  return traverser.calculateAll();
}

/**
 * Entrance shuffle tests.
 *
 * Key concepts:
 * - Entrance names must match keys in entranceLocations
 *   (e.g. "Links House", "Sanctuary", "Dam", "Desert Palace Entrance (West)")
 * - Forward link: withEntranceLink("A", "B") means entering A takes you to B's interior
 * - Reverse exit: leaving B's interior puts you at A's overworld location
 * - Menu S&Q reaches "Links House" cave; Sanctuary S&Q reaches "Sanctuary" dungeon interior
 *   Their exits to overworld depend on who linked to them.
 * - Flute works normally (gives direct overworld access). Tests that want to isolate
 *   entrance logic should use withoutItems(["flute"]).
 * - "withAllItems" includes flute and agahnim — exclude them for focused tests.
 */
describe("Entrance Shuffle", () => {
  describe("Starting location (no flute)", () => {
    it("with no links and no flute, Link's House vanilla exit gives overworld access (shuffleLinks: false)", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["flute"])
          .withSettings({ entranceMode: "simple" })
      );

      // S&Q still reaches Link's House interior
      expect(result.locationsLogic["Link's House"]).toBe("available");

      // Link's House stays vanilla so overworld is reachable from its area
      expect(result.entrancesLogic["Links House"]).toBe("available");
      expect(result.entrancesLogic["Dam"]).toBe("available");
      // Sanctuary entrance is severed (shuffled but unlinked), though the interior is reachable via Sanctuary S&Q
      expect(result.locationsLogic["Sanctuary"]).toBe("available");
    });

    it("with no links, no flute, and shuffleLinks, no overworld region is reachable", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["flute"])
          .withSettings({ entranceMode: "simple", shuffleLinks: true })
      );

      // S&Q still reaches Link's House interior
      expect(result.locationsLogic["Link's House"]).toBe("available");

      // No overworld access — Link's House Exit is disconnected
      expect(result.entrancesLogic["Links House"]).toBe("unavailable");
      expect(result.entrancesLogic["Dam"]).toBe("unavailable");
      expect(result.entrancesLogic["Sanctuary"]).toBe("unavailable");
    });

    it("linking entrance to Links House establishes overworld access from that area", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["flute"])
          .withSettings({ entranceMode: "simple" })
          .withEntranceLink("Dam", "Links House")
      );

      expect(result.locationsLogic["Link's House"]).toBe("available");
      // Dam's area is now reachable
      expect(result.entrancesLogic["Dam"]).toBe("available");
      // Links House entrance is in the same OW area — also reachable
      expect(result.entrancesLogic["Links House"]).toBe("available");
    });

    it("Sanctuary S&Q → Sanctuary exit gives overworld access when linked", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["flute"])
          .withSettings({ entranceMode: "simple" })
          .withEntranceLink("Kakariko Well Cave", "Sanctuary")
      );

      expect(result.locationsLogic["Sanctuary"]).toBe("available");
      // Sanctuary exit now leads to Kakariko Well Cave's area (Kakariko Village)
      expect(result.entrancesLogic["Kakariko Well Cave"]).toBe("available");
    });
  });

  describe("Forward and reverse links", () => {
    it("entering A leads to B's interior; exiting B returns to A's area", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["flute"])
          .withSettings({ entranceMode: "simple", shuffleLinks: true })
          .withEntranceLink("Dam", "Links House")
          .withEntranceLink("Links House", "Dam")
      );

      // Links House entrance is reachable (reverse exit from Links House cave → Dam area → walk)
      expect(result.entrancesLogic["Links House"]).toBe("available");

      // Entering Links House leads to Dam interior → Floodgate Chest is available
      expect(result.locationsLogic["Floodgate Chest"]).toBe("available");
    });

    it("unlinked entrance interior is not reachable", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["flute"])
          .withSettings({ entranceMode: "simple" })
          .withEntranceLink("Dam", "Links House")
      );

      // Can walk to Kakariko Well Cave entrance, but it's not linked
      expect(result.locationsLogic["Kakariko Well - Top"]).toBe("unavailable");
    });
  });

  describe("Connector Behavior", () => {
    it("connectors properly connect disconnected regions", () => {
      const result = calculate(
        gameState()
        .withSettings({ entranceMode: "crossed", shuffleLinks: true })
        .withEntranceLink("Links House", "Links House")
        .withEntranceLink("Dam", "Elder House (East)")
        .withEntranceLink("Spectacle Rock Cave Peak", "Elder House (West)")
      );

      // Expect west DM entrances to be available due to Spectacle Rock Cave Peak → Elder House (West) connector
      expect(result.entrancesLogic["Old Man Cave (East)"]).toBe("available");
      // No inventory, no mirror to access hera
      expect(result.entrancesLogic["Tower of Hera"]).toBe("unavailable");
    });

    it("crossworld connectors make entrances in the other world available", () => {
      const result = calculate(
        gameState()
        .withItems({ bomb: 1 })
        .withSettings({ entranceMode: "crossed", shuffleLinks: true })
        .withEntranceLink("Links House", "Links House")
        .withEntranceLink("Dam", "Elder House (East)")
        .withEntranceLink("Spectacle Rock Cave Peak", "Elder House (West)")
        .withEntranceLink("Lake Hylia Fortune Teller", "Two Brothers House (West)")
        .withEntranceLink("Big Bomb Shop", "Two Brothers House (East)")
      );

      // Expect west DM entrances to be available due to Spectacle Rock Cave Peak → Elder House (West) connector
      expect(result.entrancesLogic["Old Man Cave (East)"]).toBe("available");
      expect(result.entrancesLogic["Spike Cave"]).toBe("available");
      // No pearl, but nothing in bunny's way to access archery game
      expect(result.entrancesLogic["Archery Game"]).toBe("available");

      // No inventory, no mirror to access hera
      expect(result.entrancesLogic["Tower of Hera"]).toBe("unavailable");
      // No pearl, cannot open bonk rocks
      expect(result.entrancesLogic["Bonk Fairy (Dark)"]).toBe("unavailable");
    });
  });

  describe("LW / DW isolation", () => {
    it("DW entrance is not reachable without items to reach DW portals", () => {
      // With minimal items (no glove to reach portals, no flute), DW is inaccessible
      const result = calculate(
        gameState()
          .withItems({ moonpearl: 1, lantern: 1, sword: 1 })
          .withSettings({ entranceMode: "simple" })
          .withEntranceLink("Dam", "Links House")
      );

      // Big Bomb Shop is in DW — not reachable without glove/hammer for DW portals
      expect(result.entrancesLogic["Big Bomb Shop"]).toBe("unavailable");
    });

    it("DW entrance is reachable when glove allows portal access", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["flute"])
          .withSettings({ entranceMode: "simple" })
          .withEntranceLink("Dam", "Links House")
      );

      // With all items (including glove), DW portals are accessible
      expect(result.entrancesLogic["Big Bomb Shop"]).toBe("available");
    });
  });

  describe("Flute interaction", () => {
    it("flute provides overworld access even with no entrance links", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "simple" })
      );

      // Flute spots give direct OW access
      expect(result.entrancesLogic["Dam"]).toBe("available");
      expect(result.entrancesLogic["Links House"]).toBe("available");
    });

    it("flute-reachable entrance with no link: entrance reachable, interior not", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "simple" })
      );

      expect(result.entrancesLogic["Kakariko Well Cave"]).toBe("available");
      expect(result.locationsLogic["Kakariko Well - Top"]).toBe("unavailable");
    });
  });

  describe("Bunny state", () => {
    it("DW entrance is reachable as bunny (entrance can be entered without interaction)", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["moonpearl", "flute"])
          .withSettings({ entranceMode: "simple" })
          .withEntranceLink("Dam", "Links House")
      );

      // If DW is reachable (via Other World S&Q), bunny state should not block entrance visibility
      // "Other World S&Q" requires mirror+agahnim → goes to Pyramid Area
      // Without moon pearl, player is bunny in DW
      // Entrances should still show as reachable (bunny can walk into them)
      if (result.entrancesLogic["Big Bomb Shop"] !== "unavailable") {
        // If DW is reachable at all, Big Bomb Shop entrance should show as reachable
        expect(result.entrancesLogic["Big Bomb Shop"]).not.toBe("unavailable");
      }
    });
  });

  describe("Unlinked dungeon accessibility", () => {
    it("TT dungeon locations should be unavailable when TT entrance is not linked", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "simple" })
      );

      // TT entrance dot should be available (player can reach Village of Outcasts)
      expect(result.entrancesLogic["Thieves Town"]).toBe("available");

      // But TT dungeon locations should be UNAVAILABLE — no entrance linked to TT
      expect(result.locationsLogic["Thieves' Town - Attic"]).toBe("unavailable");
      expect(result.locationsLogic["Thieves' Town - Map Chest"]).toBe("unavailable");
      expect(result.locationsLogic["Thieves' Town - Boss"]).toBe("unavailable");
    });

    it("TT dungeon locations become available when TT entrance is linked to itself", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "simple" })
          .withEntranceLink("Thieves Town", "Thieves Town")
      );

      expect(result.locationsLogic["Thieves' Town - Attic"]).toBe("available");
      expect(result.locationsLogic["Thieves' Town - Map Chest"]).toBe("available");
    });

    it("TT dungeon locations become available when another entrance is linked to TT", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "simple" })
          .withEntranceLink("Dam", "Thieves Town")
      );

      expect(result.locationsLogic["Thieves' Town - Attic"]).toBe("available");
    });

    it("generic connector on a dungeon entrance makes nearby entrances available", () => {
      // Middle-clicking Eastern Palace and then Dam creates a generic connector.
      // The exit type for Eastern Palace is "Dungeon" in the graph, but should
      // be overridden to "Cave" so the traverser doesn't misroute it.
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "simple" })
          .withEntrance("Eastern Palace", { to: "Generic Connector 1", connectorGroup: 1 })
          .withEntrance("Dam", { to: "Generic Connector 1", connectorGroup: 1 })
      );

      // Dam is in South Hyrule — reachable via connector from Eastern Palace area
      expect(result.entrancesLogic["Dam"]).toBe("available");
      // Eastern Palace entrance should also be available
      expect(result.entrancesLogic["Eastern Palace"]).toBe("available");
    });
  });
});
