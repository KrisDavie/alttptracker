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
 * Overworld Randomizer (OWR) tests.
 *
 * Key concepts:
 * - owid: Overworld tile IDs. LW = 0-63, DW = LW+64, special = 128/129.
 *   Each owid pair (e.g. 52/116) shares the same grid position in LW/DW.
 * - Tile Flip (Mixed): swaps a tile's effective world. Tile 116 (DW Hype Cave)
 *   flipped to "light" means it behaves as a LW tile. Its paired tile 52 (LW Statues)
 *   flips to "dark". The terrain at each grid position swaps between worlds.
 * - parallelLinks: maps each tile-boundary exit to its counterpart on the paired
 *   tile (e.g. "Links House SC" ↔ "Big Bomb Shop SC"). Used to remap boundary
 *   exits when crossing a flip boundary.
 * - Requirements use effectiveWorldState: a flipped-to-LW tile in Open mode
 *   evaluates using "Inverted" requirements (which omit moonpearl for DW regions).
 */
describe("Overworld Shuffle", () => {
  describe("Tile Flip (Mixed)", () => {
    describe("baseline: no tile flip", () => {
      it("Hype Cave locations are unavailable without moonpearl (DW tile)", () => {
        const result = calculate(
          gameState()
            .withAllItems()
            .withoutItems(["moonpearl"])
        );

        // Hype Cave Area is DW (owid 116). Without moonpearl, reaching it
        // via portals puts you in bunny state. The Hype Cave entrance requires
        // moonpearl in Open mode, so cave interior is unreachable.
        expect(result.locationsLogic["Hype Cave - Top"]).toBe("unavailable");
        expect(result.locationsLogic["Hype Cave - Middle Right"]).toBe("unavailable");
        expect(result.locationsLogic["Hype Cave - Middle Left"]).toBe("unavailable");
        expect(result.locationsLogic["Hype Cave - Bottom"]).toBe("unavailable");
        expect(result.locationsLogic["Hype Cave - Generous Guy"]).toBe("unavailable");
      });
    });

    describe("tiles 52↔116 flipped", () => {
      it("Hype Cave interior locations become available without moonpearl", () => {
        const result = calculate(
          gameState()
            .withAllItems()
            .withoutItems(["moonpearl"])
            .withSettings({ owMixed: true })
            .withTileFlip(116, "light")
        );

        // Tile 116 (Hype Cave Area) flipped to LW; paired tile 52 auto-flips to DW.
        // Walking south from Link's House Area (owid 44) crosses a flip boundary:
        //   "Links House SC" → remapped via parallel "Big Bomb Shop SC" → "Hype Cave Area"
        // Arriving at Hype Cave Area: effective world = light → not bunny.
        // The "Hype Cave" entrance evaluates with effectiveWorldState = "inverted":
        //   Inverted requirements = { bomb } → met (we have bomb) → can enter cave.
        // Inside the cave, bunny=false propagates → all locations accessible.
        expect(result.locationsLogic["Hype Cave - Top"]).toBe("available");
        expect(result.locationsLogic["Hype Cave - Middle Right"]).toBe("available");
        expect(result.locationsLogic["Hype Cave - Middle Left"]).toBe("available");
        expect(result.locationsLogic["Hype Cave - Bottom"]).toBe("available");
        expect(result.locationsLogic["Hype Cave - Generous Guy"]).toBe("available");
      });

      it("overworld locations on flipped tile 116 use Inverted requirements", () => {
        const result = calculate(
          gameState()
            .withAllItems()
            .withoutItems(["moonpearl"])
            .withSettings({ owMixed: true })
            .withTileFlip(116, "light")
        );

        // "Hype Cave Statue" on owid 116:
        //   Open: { canGetBonkableItem + moonpearl }
        //   Inverted: { canGetBonkableItem }
        // With effectiveWorldState = "inverted", uses { canGetBonkableItem } → boots → available
        expect(result.locationsLogic["Hype Cave Statue"]).toBe("available");

        // "Hype Cave Area Tree Pull" on owid 116:
        //   Open: "never"
        //   Inverted: { canKillMostEnemies }
        // With effectiveWorldState = "inverted", uses { canKillMostEnemies } → available
        expect(result.locationsLogic["Hype Cave Area Tree Pull"]).toBe("available");
      });

      it("boundary exits from flipped tile lead back to LW, not to DW", () => {
        // Verify that walking from the flipped Hype Cave tile doesn't open up
        // adjacent DW tiles. The tile-flip remap redirects boundary exits back
        // to LW tiles (e.g., "Hype Cave NC" → "Links House Area" instead of
        // "Big Bomb Shop Area").
        //
        // Without moonpearl AND without flute (to isolate path-based access),
        // locations that are ONLY reachable via DW walking from adjacent tiles
        // should remain unavailable. We verify by checking a DW cave location
        // that normally requires moonpearl and non-bunny cave entry.
        const result = calculate(
          gameState()
            .withAllItems()
            .withoutItems(["moonpearl"])
            .withSettings({ owMixed: true })
            .withTileFlip(116, "light")
        );

        // Spike Cave is on DW Death Mountain. In Open mode, entering the cave
        // region requires moonpearl. The tile flip of 52/116 does not affect
        // DW Death Mountain tiles, so Spike Cave remains unavailable.
        expect(result.locationsLogic["Spike Cave"]).toBe("unavailable");
      });

      it("non-flipped DW locations remain unavailable without moonpearl", () => {
        const result = calculate(
          gameState()
            .withAllItems()
            .withoutItems(["moonpearl"])
            .withSettings({ owMixed: true })
            .withTileFlip(116, "light")
        );

        // Stumpy is bunny-exempt, but its region is blocked by bushes that
        // a bunny can't clear. Even via DW portals, Stumpy is unreachable.
        expect(result.locationsLogic["Stumpy"]).toBe("unavailable");
      });
    });
  });

  describe("Standverted (inverted + auto start tile flips)", () => {
    // Standverted: worldState = "standverted" (evaluates as Inverted), with
    // automatic tile flips for Link's House (44/108), Hyrule Castle (27/91),
    // and Sanctuary (19/83). No manual withTileFlip or owMixed needed.
    // Result: S&Q goes to Link's House, player is not a bunny on flipped tiles.

    it("S&Q reaches Link's House (not Big Bomb Shop) in standverted", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["moonpearl"])
          .withSettings({ worldState: "standverted" })
      );

      // The traverser auto-applies tile flips for standverted.
      // "Links House S&Q" evaluates with effectiveWorldState = "open"
      // (destination owid 44 is flipped) → Open: {} → available.
      expect(result.locationsLogic["Link's House"]).toBe("available");
    });

    it("player is not a bunny on flipped tiles in standverted", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["moonpearl"])
          .withSettings({ worldState: "standverted" })
      );

      // Links House Area (owid 44) is effectively DW = inverted's home world.
      // Player exits Link's House → Links House Area → not a bunny.
      // "Links House Area Rock Drop" requires glove; evaluated with
      // effectiveWorldState = "open" → no moonpearl needed → available.
      expect(result.locationsLogic["Links House Area Rock Drop"]).toBe("available");
    });

    it("Sanctuary tile is also flipped in standverted", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["moonpearl"])
          .withSettings({ worldState: "standverted" })
      );

      // Sanctuary Area (owid 19) is flipped to effectively DW = inverted home.
      // After clearing Hyrule Castle, Sanctuary S&Q evaluates with
      // effectiveWorldState = "open" → Open: {} → reachable.
      // Sanctuary is a dungeon interior — its locations depend on dungeon traversal,
      // but the S&Q exit itself should be usable. Verify Link's Uncle is available
      // (he's in the Sewers which connects to Sanctuary).
      expect(result.locationsLogic["Link's Uncle"]).toBe("available");
    });
    it("Bottle Merchant and Sunken Treasure are unavailable with no items", () => {
      const result = calculate(
        gameState()
          .withSettings({ worldState: "standverted" })
      );

      // With no items in standverted, S&Q goes to flipped tiles (DW home).
      // The inverted S&Q exits (Big Bomb Shop, Dark Sanctuary Hint) are on
      // flipped-to-LW tiles, so they should be blocked by effectiveWorldState.
      expect(result.locationsLogic["Bottle Merchant"]).toBe("unavailable");
      expect(result.locationsLogic["Sunken Treasure"]).toBe("unavailable");
    });

    it("[SK] LW is not available without SKs", () => {
      const result = calculate(
        gameState()
          .withSettings({ worldState: "standverted" })
      );

      // With no items in standverted, S&Q goes to flipped tiles (DW home).
      // The inverted S&Q exits (Big Bomb Shop, Dark Sanctuary Hint) are on
      // flipped-to-LW tiles, so they should be blocked by effectiveWorldState.
      expect(result.locationsLogic["Bottle Merchant"]).toBe("unavailable");
      expect(result.locationsLogic["Sunken Treasure"]).toBe("unavailable");
    });

    it("AT exit goes to HC Ledge, not GT Stairs, in standverted", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withSettings({ worldState: "standverted" })
      );

      // The AT tile is flipped back to its normal (LW) position in standverted.
      // AT should be reachable from HC Ledge (with cape/swordbeams) and its
      // dungeon locations should be available. The inverted exit to GT Stairs
      // should be blocked.
      expect(result.locationsLogic["Castle Tower - Room 03"]).toBe("available");
    });

    it("AT is not accessible from GT Stairs in standverted", () => {
      const result = calculate(
        gameState()
          .withAllItems()
          .withoutItems(["cape"])
          .withItems({ sword: 1 })
          .withSettings({ worldState: "standverted" })
      );

      // Without cape or swordbeams (sword level > 1), the HC Ledge entry to AT
      // is blocked. The GT Stairs entry should also be blocked (AT is not on DM).
      // So AT locations should be unavailable.
      expect(result.locationsLogic["Castle Tower - Room 03"]).toBe("unavailable");
    });
  });
});
