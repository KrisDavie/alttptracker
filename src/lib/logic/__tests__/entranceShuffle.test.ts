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
          .withSettings({ entranceMode: "crossed" })
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
          .withSettings({ entranceMode: "crossed", shuffleLinks: true })
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
          .withSettings({ entranceMode: "crossed" })
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
          .withSettings({ entranceMode: "crossed" })
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
          .withSettings({ entranceMode: "crossed", shuffleLinks: true })
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
          .withSettings({ entranceMode: "crossed" })
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

     it("crossworld connectors make entrances in the other world available 2 - pyramid fairy", () => {
      const result = calculate(
        gameState()
        .withItems({ bomb: 1 })
        .withSettings({ entranceMode: "crossed", shuffleLinks: true })
        .withEntranceLink("Links House", "Links House")
        .withEntranceLink("Dam", "Elder House (East)")
        .withEntranceLink("Pyramid Fairy", "Elder House (West)")
      );

      // Expect east DW entrances to be available due to Dam → Pyramid Fairy connector
      expect(result.entrancesLogic["Dark Lake Hylia Fairy"]).toBe("available");
      expect(result.entrancesLogic["Bonk Fairy (Dark)"]).toBe("unavailable");

    });
   
  });

  describe("LW / DW isolation", () => {
    it("DW entrance is not reachable without items to reach DW portals", () => {
      // With minimal items (no glove to reach portals, no flute), DW is inaccessible
      const result = calculate(
        gameState()
          .withItems({ moonpearl: 1, lantern: 1, sword: 1 })
          .withSettings({ entranceMode: "crossed" })
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
          .withSettings({ entranceMode: "crossed" })
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
          .withSettings({ entranceMode: "crossed" })
      );

      // Flute spots give direct OW access
      expect(result.entrancesLogic["Dam"]).toBe("available");
      expect(result.entrancesLogic["Links House"]).toBe("available");
    });

    it("flute-reachable entrance with no link: entrance reachable, interior not", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed" })
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
          .withSettings({ entranceMode: "crossed" })
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

  describe("Partial logic should account for accessibility to all entrances", () => {

    it("[SK Pottery KeyDrop] should mark front of swamp as available with 2 wild small keys and full inventory except hammer", () => {
      const state = gameState()
      .withAllItems()
      .withoutItems(["hammer"])
      .withSettings({ entranceMode: "crossed", wildSmallKeys: "wild", pottery: "keys", enemyDrop: "keys" })
      .withDungeon("sp", { smallKeys: 2, bigKey: true })
      .withEntranceLink("Dam", "Dam")
      .withEntranceLink("Lake Hylia Fortune Teller", "Swamp Palace")
      .build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // This should be identical to the non entrance shuffle logic, as the player has access to Dam and SP entrances and has keys to reach these locations
      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Pot Row Pot Key"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Trench 1 Pot Key"]).toBe("available");
    });
    it("DP boss should be possible without the small key even if desert main is not placed", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed", wildBigKeys: true, wildSmallKeys: "wild" })
          .withDungeon("dp", { smallKeys: 0, bigKey: true })
          .withEntranceLink("Dam", "Desert Palace Entrance (North)")
      );

      // The LOGIC still assumes the player can reach the main DP area and waste a key even if not placed
      // Partial logic should assume that the player has access to all regions for minimum key logic
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("possible")
    });

   it("DP boss should be available with the small key even if desert main is not placed", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed", wildBigKeys: true, wildSmallKeys: "wild" })
          .withDungeon("dp", { smallKeys: 1, bigKey: true })
          .withEntranceLink("Dam", "Desert Palace Entrance (North)")
      );

      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("available")
    });

    it("DP right side should be unavailable without the small key if desert north is not placed", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed", wildBigKeys: true, wildSmallKeys: "wild" })
          .withDungeon("dp", { smallKeys: 0, bigKey: true })
          .withEntranceLink("Dam", "Desert Palace Entrance (East)")
      );

      // The player has no access to a key at all because they have not found the desert north entrance, and cannot find a pot key
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("unavailable")
    });

    it("DP right side should be unavailable without the small key if desert north is not placed", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed", wildBigKeys: true, wildSmallKeys: "wild" })
          .withDungeon("dp", { smallKeys: 0, bigKey: true })
          .withEntranceLink("Dam", "Desert Palace Entrance (East)")
      );

      // The player has no access to a key at all because they have not found the desert north entrance, and cannot find a pot key
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("unavailable")
    });

    it("DP right side should be available with the small key if desert north is not placed", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed", wildBigKeys: true, wildSmallKeys: "wild" })
          .withDungeon("dp", { smallKeys: 1, bigKey: true })
          .withEntranceLink("Dam", "Desert Palace Entrance (East)")
      );

      // The player has a small key and can reach the right side of DP. Accessing DP north gives as many keys as small key doors, 
      // so this location is available even though the desert north entrance is not placed and those keys are unreachable
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("available")
    });

        it("DP right side should be available with the small key if desert north is placed", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed", wildBigKeys: true, wildSmallKeys: "wild" })
          .withDungeon("dp", { smallKeys: 1, bigKey: true })
          .withEntranceLink("Dam", "Desert Palace Entrance (East)")
          .withEntranceLink("Library", "Desert Palace Entrance (North)")
      );

      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("available")
    });


    it("DP right side should be unavailable without the small key if desert north is not placed", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed", wildBigKeys: true, wildSmallKeys: "wild", pottery: "keys" })
          .withDungeon("dp", { smallKeys: 3, bigKey: true })
          .withEntranceLink("Dam", "Desert Palace Entrance (East)")
      );

      // The player has three of four keys, but even though they have not found the desert north entrance the key 
      // logic still accounts for them having access to it for door key logic purposes and therefore they could potentially
      // spend all three on the key doors in the back, this means that this location is possible even though there is only one key door
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("possible")
    });

    it("HC Key rat should be possible with the small key even if HC front is not placed", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed", wildBigKeys: true, wildSmallKeys: "wild", enemyDrop: "keys" })
          .withDungeon("hc", { smallKeys: 1, bigKey: false })
          .withEntranceLink("Hyrule Castle Secret Entrance Drop", "Sanctuary Grave")
          .withEntranceLink("Hyrule Castle Secret Entrance Stairs", "Sanctuary")
      );

      // The player has one of four keys, but even though they have not found the hc front entrances, the key
      // logic still accounts for them having access to them for door key logic purposes and therefore they could potentially
      // spend the key on any of the key doors in the fron, this means that this location is possible even though there is only one key door
      expect(result.locationsLogic["Hyrule Castle - Key Rat Key Drop"]).toBe("possible")
    });
  });

  describe("Unlinked dungeon accessibility", () => {
    it("TT dungeon locations should be unavailable when TT entrance is not linked", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed" })
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
          .withSettings({ entranceMode: "crossed" })
          .withEntranceLink("Thieves Town", "Thieves Town")
      );

      expect(result.locationsLogic["Thieves' Town - Attic"]).toBe("available");
      expect(result.locationsLogic["Thieves' Town - Map Chest"]).toBe("available");
    });

    it("TT dungeon locations become available when another entrance is linked to TT", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ entranceMode: "crossed" })
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
          .withSettings({ entranceMode: "crossed" })
          .withEntrance("Eastern Palace", { to: "Generic Connector 1", connectorGroup: 1 })
          .withEntrance("Dam", { to: "Generic Connector 1", connectorGroup: 1 })
      );

      // Dam is in South Hyrule — reachable via connector from Eastern Palace area
      expect(result.entrancesLogic["Dam"]).toBe("available");
      // Eastern Palace entrance should also be available
      expect(result.entrancesLogic["Eastern Palace"]).toBe("available");
    });

    it("Dam in mire area should make swamp available", () => {
      // Middle-clicking Eastern Palace and then Dam creates a generic connector.
      // The exit type for Eastern Palace is "Dungeon" in the graph, but should
      // be overridden to "Cave" so the traverser doesn't misroute it.
      const result = calculate(
        gameState()
          .withItems({"moonpearl": 1, "sword": 1, "flippers": 1 })
          .withSettings({ entranceMode: "crossed", shuffleLinks: false })
          // Mire area available via desert connector
          .withEntrance("Elder House (East)", { to: "Desert Palace Entrance (South)" })
          .withEntrance("Mire Fairy", { to: "Desert Palace Entrance (East)" })
          // Dam available to drain swamp
          .withEntrance("Mire Hint", { to: "Dam" })
          // Swamp Palace available in kak
          .withEntrance("Snitch Lady (East)", { to: "Swamp Palace" })
      );

      // Can reach Dam and use it to drain swamp, which should make Swamp Palace entrance chest available
      expect(result.entrancesLogic["Mire Hint"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("available");
    });   
    
    
    it("cannot open chests in swamp palace in entrance modes without moonpearl", () => {
      const state = gameState()
        .withItems({ bomb: 1, flippers: 1})
        .withDungeon("sp", { smallKeys: 1 })
        .withSequenceBreaks({ canSuperBunny: true })
        .withSettings({ entranceMode: "crossed", wildMaps: true, wildCompasses: true, wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", enemyDrop: "keys" })
        .withEntranceLink("Links House", "Links House")
        .withEntranceLink("Tavern (Front)", "Desert Palace Entrance (East)")
        .withEntranceLink("Pyramid Fairy", "Desert Palace Entrance (West)")
        .withEntranceLink("Dark Lake Hylia Fairy", "Swamp Palace")
        .withEntranceLink("Lake Hylia Fortune Teller", "Dam")
        .build();

      const logicSet = getLogicSet("noglitches");
      const { regions, metadata } = buildEffectiveRegions(logicSet.regions as Record<string, RegionLogic>, state);
      const traverser = new OverworldTraverser(state, { ...logicSet, regions }, metadata);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("unavailable");
      expect(result.locationsLogic["Pyramid"]).toBe("available");
    }); 

    
    it("can reach crystaroller with both mid-TR entrances places", () => {
      const state = gameState()
        .withItems({ bomb: 1, sword: 1 })
        .withDungeon("tr", { bigKey: true })
        .withSettings({ entranceMode: "crossed", wildMaps: true, wildCompasses: true, wildSmallKeys: "wild", wildBigKeys: true })
        .withEntranceLink("Links House", "Links House")
        .withEntranceLink("Lake Hylia Fortune Teller", "Dark Death Mountain Ledge (East)")
        .withEntranceLink("Lake Hylia Shop", "Dark Death Mountain Ledge (West)")
        .build();

      const logicSet = getLogicSet("noglitches");
      const { regions, metadata } = buildEffectiveRegions(logicSet.regions as Record<string, RegionLogic>, state);
      const traverser = new OverworldTraverser(state, { ...logicSet, regions }, metadata);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Turtle Rock - Crystaroller Room"]).toBe("available");
    }); 

  });
});
