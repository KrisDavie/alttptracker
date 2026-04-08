import type { GameState, LogicRequirement, LogicState, LogicStatus, WorldLogic } from "@/data/logic/logicTypes";

/** Status ordering from worst to best. Numeric lookup for O(1) comparisons. */
const STATUS_RANK: Record<string, number> = { unavailable: 0, information: 1, possible: 2, ool: 3, available: 4 };

/** Returns true if newStatus is better (more available) than oldStatus */
export function isBetterStatus(newStatus: LogicStatus, oldStatus: LogicStatus): boolean {
  return STATUS_RANK[newStatus] > STATUS_RANK[oldStatus];
}

/** Returns the better (more available) of two statuses */
export function combineStatuses(status1: LogicStatus, status2: LogicStatus): LogicStatus {
  const r1 = STATUS_RANK[status1], r2 = STATUS_RANK[status2];
  return r1 >= r2 ? status1 : status2;
}

/** Returns the worse (less available) of the given statuses */
export function minimumStatus(...statuses: LogicStatus[]): LogicStatus {
  let worst: LogicStatus = statuses[0];
  let worstRank = STATUS_RANK[worst];
  for (let i = 1; i < statuses.length; i++) {
    const rank = STATUS_RANK[statuses[i]];
    if (rank < worstRank) { worst = statuses[i]; worstRank = rank; }
  }
  return worst;
}

/** Returns the best (most available) status from an array */
export function maximumStatus(...statuses: LogicStatus[]): LogicStatus {
  let best: LogicStatus = statuses[0];
  let bestRank = STATUS_RANK[best];
  for (let i = 1; i < statuses.length; i++) {
    const rank = STATUS_RANK[statuses[i]];
    if (rank > bestRank) { best = statuses[i]; bestRank = rank; }
  }
  return best;
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

export function getLogicStateForWorld(state: GameState, worldLogic: WorldLogic, effectiveWorldState?: string) {
  const ws = effectiveWorldState ?? state.settings.worldState;
  let mode: "Open" | "Inverted" | "Inverted_1" | "Standard";
  switch (ws) {
    case "open":
    case "standard":
      mode = "Open";
      break;

    case "standverted":
    case "inverted":
      mode = "Inverted";
      break;
    case "inverted_1":
      mode = "Inverted_1";
      break;
    default:
      mode = "Open";
  }
  // Fallback to Inverted logic if Inverted_1 logic is not defined
  if (ws === "inverted_1" && !worldLogic.Inverted_1) {
    mode = "Inverted";
  }
  const requirements = worldLogic[mode] || {};

  // Handle case where requirements is a direct LogicRequirement instead of LogicState
  if (
    typeof requirements === "string" ||
    (typeof requirements === "object" && ("allOf" in requirements || "anyOf" in requirements))
  ) {
    return { always: requirements as LogicRequirement };
  }

  return requirements as LogicState;
}