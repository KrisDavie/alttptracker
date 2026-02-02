import type { GameState, LogicRequirement, LogicState, WorldLogic } from "@/data/logic/logicTypes";

export function getLogicStateForWorld(state: GameState, worldLogic: WorldLogic ) {
  // TODO add Inverted 1.0 logic handling
  const mode = state.settings.worldState === "inverted" ? "Inverted" : "Open"
  const requirements = worldLogic[mode] || worldLogic.Standard || {};

  // Handle case where requirements is a direct LogicRequirement instead of LogicState
  if (
    typeof requirements === "string" ||
    (typeof requirements === "object" && ("allOf" in requirements || "anyOf" in requirements))
  ) {
    return { always: requirements as LogicRequirement };
  }

  return requirements as LogicState;
}