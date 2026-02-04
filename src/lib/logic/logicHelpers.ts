import type { GameState, LogicRequirement, LogicState, LogicStatus, WorldLogic } from "@/data/logic/logicTypes";

/** Status ordering from worst to best (for reachability purposes) */
const STATUS_ORDER: LogicStatus[] = ["unavailable", "possible", "ool", "available", "information"];

/** Returns true if newStatus is better (more available) than oldStatus */
export function isBetterStatus(newStatus: LogicStatus, oldStatus: LogicStatus): boolean {
  return STATUS_ORDER.indexOf(newStatus) > STATUS_ORDER.indexOf(oldStatus);
}

/** Returns the better (more available) of two statuses */
export function combineStatuses(status1: LogicStatus, status2: LogicStatus): LogicStatus {
  return STATUS_ORDER[Math.max(STATUS_ORDER.indexOf(status1), STATUS_ORDER.indexOf(status2))];
}

/** Returns the worse (less available) of two statuses */
export function minimumStatus(status1: LogicStatus, status2: LogicStatus): LogicStatus {
  return STATUS_ORDER[Math.min(STATUS_ORDER.indexOf(status1), STATUS_ORDER.indexOf(status2))];
}

/** Creates a GameState with all items set to max values (for partial key logic) */
export function createAllItemsState(baseState: GameState): GameState {
  const allItems = { ...baseState.items };
  // Set all items to max reasonable amounts
  allItems["bow"] = { amount: 4 };
  allItems["boomerang"] = { amount: 3 };
  allItems["hookshot"] = { amount: 1 };
  allItems["bomb"] = { amount: 1 };
  allItems["mushroom"] = { amount: 2 };
  allItems["powder"] = { amount: 1 };
  allItems["firerod"] = { amount: 1 };
  allItems["icerod"] = { amount: 1 };
  allItems["bombos"] = { amount: 1 };
  allItems["ether"] = { amount: 1 };
  allItems["quake"] = { amount: 1 };
  allItems["lantern"] = { amount: 1 };
  allItems["hammer"] = { amount: 1 };
  allItems["shovel"] = { amount: 1 };
  allItems["flute"] = { amount: 2 };
  allItems["net"] = { amount: 1 };
  allItems["book"] = { amount: 1 };
  allItems["bottle1"] = { amount: 1 };
  allItems["bottle2"] = { amount: 1 };
  allItems["bottle3"] = { amount: 1 };
  allItems["bottle4"] = { amount: 1 };
  allItems["somaria"] = { amount: 1 };
  allItems["byrna"] = { amount: 1 };
  allItems["cape"] = { amount: 1 };
  allItems["mirror"] = { amount: 1 };
  allItems["boots"] = { amount: 1 };
  allItems["glove"] = { amount: 2 };
  allItems["flippers"] = { amount: 1 };
  allItems["magic"] = { amount: 1 };
  allItems["moonpearl"] = { amount: 1 };
  allItems["shield"] = { amount: 3 };
  allItems["sword"] = { amount: 4 };
  allItems["mail"] = { amount: 2 };
  
  return {
    ...baseState,
    items: allItems,
  };
}

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