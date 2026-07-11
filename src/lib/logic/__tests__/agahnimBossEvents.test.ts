import { describe, expect, it } from "vitest";
import { OverworldTraverser } from "../overworldTraverser";
import { getLogicSet } from "../logicMapper";
import { gameState } from "./testHelpers";

/**
 * The Agahnim 1 (Castle Tower) and Agahnim 2 (Ganon's Tower) boss events drive
 * the CT/GT boss inset squares. They are classified as "event" locations (so
 * they don't pollute dungeon item lists), but the traverser must still report a
 * reachability status for them, and that status must be registered/storable.
 *
 * Regression: with all items in a normal (open) world the boss events were
 * never reported "available".
 */
describe("Agahnim boss event reachability", () => {
  it("marks Agahnim 1 and Agahnim 2 available with all items + prizes (open)", () => {
    const state = gameState()
      .withAllItems()
      .withAllPrizes()
      .withSettings({ worldState: "open" })
      .build();
    const traverser = new OverworldTraverser(state, getLogicSet("noglitches"));
    const result = traverser.calculateAll();

    expect(result.locationsLogic["Agahnim 1"]).toBe("available");
    expect(result.locationsLogic["Agahnim 2"]).toBe("available");
  });
});
