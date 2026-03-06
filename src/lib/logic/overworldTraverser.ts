/**
 * OverworldTraverser - Computes reachability for overworld regions and coordinates dungeon traversal.
 *
 * OVERVIEW:
 * The traverser determines which overworld regions are reachable given the player's current
 * inventory and settings. It orchestrates dungeon traversal by collecting portal entries and
 * processing dungeon exits that return to the overworld.
 *
 * TRAVERSAL APPROACH:
 *
 * 1. PORTAL DISCOVERY (partial mode): Before main traversal, discovers all dungeon portals
 *    reachable with full inventory. This ensures key contention logic applies even to regions
 *    the player can't currently reach. Portals discovered this way start with "unavailable" status.
 *
 * 2. BFS TRAVERSAL: Starting from the initial region (Link's House or inverted equivalent),
 *    explores all reachable overworld regions via exits. Each exit is evaluated against
 *    the player's inventory to determine its status.
 *
 * 3. DUNGEON COORDINATION: When a dungeon portal is found, it's collected into pendingDungeons.
 *    After overworld BFS stabilizes, DungeonTraverser is called for each dungeon with all
 *    discovered portals. Dungeon exits back to overworld update reachability and re-trigger BFS.
 *
 * 4. FIXED-POINT ITERATION: The process repeats until no new regions are discovered.
 *    Dungeons may unlock overworld regions that unlock new dungeon portals.
 *
 * KEY CONCEPTS:
 * - RegionReachability: Tracks status and bunnyState for each region
 * - Portal discovery: In partial mode, finds all potential portals before main traversal
 * - Entry status propagation: Portals inherit status from how they were reached (available/unavailable)
 * - Bunny state: Tracks whether player is a bunny (in Dark World without Moon Pearl)
 * - blockedExits: Exits that failed evaluation are re-checked when new items/regions unlock
 * - overworldKeyCost: Tracks keys used to reach overworld regions via dungeon exits
 *
 * PROTECTION MODES:
 * - partial: Assumes all items for key counting/discovery, uses actual inventory for final status
 * - dangerous: Uses actual inventory throughout (may miss key contention in unreachable areas)
 */

import { type RegionReachability, type ExitLogic, type GameState, type RegionLogic, type LogicStatus } from "@/data/logic/logicTypes";
import type { LogicSet } from "./logicMapper";
import { RequirementEvaluator, type EvaluationContext } from "./requirementEvaluator";
import { DungeonTraverser } from "./dungeonTraverser";
import { createAllItemsState, isBetterStatus, combineStatuses, minimumStatus } from "./logicHelpers";
import { DungeonsData } from "@/data/dungeonData";
import { entranceLocations } from "@/data/locationsData";
import { buildRegionMetadata, applyStandvertedState, type RegionMetadata } from "./regionsProvider";

interface OverworldTraverserContext {
  reachable: Map<string, RegionReachability>;
  queue: string[];
  blockedExits: { exitName: string; exit: ExitLogic[string]; from: string }[];
  pendingDungeons: Map<string, Map<string, { bunnyState: boolean; status: LogicStatus; keyCost: number }>>;
  // Track ALL discovered portals for each dungeon across all iterations
  // keyCost tracks how many keys were used to reach this portal (if reached via dungeon exit)
  allDiscoveredPortals: Map<string, Map<string, { bunnyState: boolean; status: LogicStatus; keyCost: number }>>;
  // Track key cost for overworld regions reached via dungeon exits
  // This maps overworld region name -> minimum keys used to reach it via any dungeon exit
  overworldKeyCost: Map<string, number>;
}

const doorPrefixToDungeon: Record<string, string> = {
  Sewers: "hc",
  Castle: "hc",
  Eastern: "ep",
  Desert: "dp",
  Hera: "toh",
  Tower: "ct",
  PoD: "pod",
  Swamp: "sp",
  Skull: "sw",
  Thieves: "tt",
  Ice: "ip",
  Mire: "mm",
  TR: "tr",
  GT: "gt",
};

const portalToDungeon: Record<string, string> = {
  Sanctuary: "hc",
  "Hyrule Castle": "hc",
  Sewer: "hc",
  "Agahnims Tower": "ct",
  Eastern: "ep",
  Desert: "dp",
  Hera: "toh",
  "Palace of Darkness": "pod",
  Swamp: "sp",
  Skull: "sw",
  "Thieves Town": "tt",
  Ice: "ip",
  Mire: "mm",
  "Turtle Rock": "tr",
  "Ganons Tower": "gt",
};

export class OverworldTraverser {
  private state: GameState;
  private logicSet: LogicSet;
  private regions: Record<string, RegionLogic>;
  private requirementEvaluator: RequirementEvaluator;
  private protection: "partial" | "dangerous";
  // For partial mode, we also need an all-items evaluator for discovery
  private allItemsEvaluator?: RequirementEvaluator;
  // Per-dungeon set of regions that are only reachable via big key doors
  private dungeonBigKeyGatedRegions: Map<string, Set<string>> = new Map();
  // Per-dungeon set of regions that are only reachable via small key doors
  private dungeonSmallKeyGatedRegions: Map<string, Set<string>> = new Map();

  // Whether the world state counts as "inverted" (player starts in DW)
  private readonly isInverted: boolean;
  // Whether any OWR setting is non-vanilla
  private isOwrActive: boolean = false;
  // Pre-computed metadata from the regions graph (shared with regionsProvider)
  private metadata: RegionMetadata;

  constructor(state: GameState, logicSet: LogicSet, metadataOrProtection?: RegionMetadata | "partial" | "dangerous", protection?: "partial" | "dangerous") {
    // Support legacy signature: (state, logicSet, protection?)
    let metadata: RegionMetadata | undefined;
    let resolvedProtection: "partial" | "dangerous" = "partial";
    if (typeof metadataOrProtection === "string") {
      resolvedProtection = metadataOrProtection;
    } else {
      metadata = metadataOrProtection;
      resolvedProtection = protection ?? "partial";
    }

    // Apply standverted state adjustments (tile flips for home area)
    this.state = applyStandvertedState(state);
    this.logicSet = logicSet;
    this.regions = logicSet.regions as Record<string, RegionLogic>;
    this.requirementEvaluator = new RequirementEvaluator(this.state);
    this.protection = resolvedProtection;
    this.isInverted = ["inverted", "inverted_1", "standverted"].includes(this.state.settings.worldState);

    // Build or use provided metadata
    this.metadata = metadata ?? buildRegionMetadata(this.regions);

    // In partial mode, create an all-items evaluator for discovering regions
    if (resolvedProtection === "partial") {
      const allItemsState = createAllItemsState(this.state);
      this.allItemsEvaluator = new RequirementEvaluator(allItemsState);
    }

    // OWR active flag
    this.isOwrActive = this.state.settings.owMixed ||
      this.state.settings.owLayout !== "vanilla" ||
      this.state.settings.owCrossed !== "none" ||
      this.state.settings.owWhirlpool ||
      this.state.settings.owFluteShuffle !== "vanilla";
  }

  // --- OWR helper methods ---

  /**
   * Get the effective world of an overworld tile, accounting for tile flips.
   * Vanilla: owid < 64 or owid >= 128 → "light", 64-127 → "dark".
   * Tile flip overrides come from state.overworld.tileWorlds.
   */
  private getEffectiveWorld(owid: number): "light" | "dark" {
    const override = this.state.overworld.tileWorlds[owid];
    if (override) return override;
    return (owid < 64 || owid >= 128) ? "light" : "dark";
  }

  /**
   * Get the vanilla world of an overworld tile (ignoring flips).
   */
  private getVanillaWorld(owid: number): "light" | "dark" {
    return (owid < 64 || owid >= 128) ? "light" : "dark";
  }

  /**
   * Determine if a tile-boundary edge crosses worlds.
   * - Unrestricted: reads from state.overworld.crossedEdges
   * - Grouped/Polar: computed from effective world mismatch between source and dest tiles
   */
  private isEdgeCrossed(exitName: string, sourceOwid?: number, destOwid?: number): boolean {
    const crossed = this.state.settings.owCrossed;
    if (crossed === "none") return false;

    if (crossed === "unrestricted") {
      return !!this.state.overworld.crossedEdges[exitName];
    }

    // Grouped and Polar: edge is crossed if source and dest tiles are in
    // different effective worlds (tile flip causes world-crossing at boundaries)
    if ((crossed === "grouped" || crossed === "polar") && sourceOwid != null && destOwid != null) {
      return this.getEffectiveWorld(sourceOwid) !== this.getEffectiveWorld(destOwid);
    }

    return false;
  }

  /**
   * Get the effective world state string for requirement evaluation on a region.
   * When a tile is flipped (OWR Mixed), exits from that tile should be evaluated
   * using the opposite world state (e.g., mirror becomes available on flipped-to-DW tiles).
   * Returns undefined when no override is needed.
   */
  private getEffectiveWorldState(regionName: string, destRegionName?: string): string | undefined {
    if (!this.isOwrActive || !this.state.settings.owMixed) return undefined;

    let owid = this.metadata.regionToOwid.get(regionName);

    // For regions without an owid (e.g. Menu), fall back to the destination's
    // overworld tile. This lets S&Q exits evaluate with the correct world state
    // when the destination tile is flipped (e.g. standverted).
    if (owid == null && destRegionName) {
      owid = this.metadata.interiorToOwid.get(destRegionName) ?? this.metadata.regionToOwid.get(destRegionName);
    }

    if (owid == null) return undefined;

    const effectiveWorld = this.getEffectiveWorld(owid);
    const vanillaWorld = this.getVanillaWorld(owid);

    if (effectiveWorld !== vanillaWorld) {
      // Tile is flipped — use opposite world state for requirements
      const ws = this.state.settings.worldState;
      if (ws === "open" || ws === "standard") return "inverted";
      if (ws === "inverted" || ws === "standverted") return "open";
      if (ws === "inverted_1") return "open";
    }
    return undefined;
  }

  public calculateAll() {
    const reachableRegions = this.traverse();
    const locationsLogic = this.evaluateLocations(reachableRegions);
    const entrancesLogic = this.evaluateEntrances(reachableRegions);
    return { locationsLogic, entrancesLogic };
  }

  private bunnyExemptLocations: Set<string> = new Set([
    "Link's Uncle",
    "Sahasrahla",
    "Sick Kid",
    "Lost Woods Hideout",
    "Lumberjack Tree",
    "Checkerboard Cave",
    "Potion Shop",
    "Spectacle Rock Cave",
    "Pyramid",
    "Old Man",
    "Hype Cave - Generous Guy",
    "Peg Cave",
    "Bumper Cave Ledge",
    "Dark Blacksmith Ruins",
    "Spectacle Rock",
    "Bombos Tablet",
    "Ether Tablet",
    "Purple Chest",
    "Blacksmith",
    "Master Sword Pedestal",
    "Bottle Merchant",
    "Sunken Treasure", // TODO - Only if dam can be pulled
    "Desert Ledge",
    "Stumpy",
    "Murahdahla",
    "Kakariko Shop - Left",
    "Kakariko Shop - Middle",
    "Kakariko Shop - Right",
    "Lake Hylia Shop - Left",
    "Lake Hylia Shop - Middle",
    "Lake Hylia Shop - Right",
    "Potion Shop - Left",
    "Potion Shop - Middle",
    "Potion Shop - Right",
    "Capacity Upgrade - Left",
    "Capacity Upgrade - Right",
    "Village of Outcasts Shop - Left",
    "Village of Outcasts Shop - Middle",
    "Village of Outcasts Shop - Right",
    "Dark Lake Hylia Shop - Left",
    "Dark Lake Hylia Shop - Middle",
    "Dark Lake Hylia Shop - Right",
    "Dark Death Mountain Shop - Left",
    "Dark Death Mountain Shop - Middle",
    "Dark Death Mountain Shop - Right",
    "Dark Lumberjack Shop - Left",
    "Dark Lumberjack Shop - Middle",
    "Dark Lumberjack Shop - Right",
    "Dark Potion Shop - Left",
    "Dark Potion Shop - Middle",
    "Dark Potion Shop - Right",
    "Red Shield Shop - Left",
    "Red Shield Shop - Middle",
    "Red Shield Shop - Right",
    "Old Man Sword Cave Item 1",
    "Take - Any  # 1 Item 1",
    "Take - Any  # 1 Item 2",
    "Take - Any  # 2 Item 1",
    "Take - Any  # 2 Item 2",
    "Take - Any  # 3 Item 1",
    "Take - Any  # 3 Item 2",
    "Take - Any  # 4 Item 1",
    "Take - Any  # 4 Item 2",
  ]);

  private getDungeonIdFromRegion(regionName: string): string | undefined {
    const dungeonPrefixes = Object.keys(doorPrefixToDungeon);
    for (const prefix of dungeonPrefixes) {
      if (regionName.startsWith(prefix)) {
        return doorPrefixToDungeon[prefix];
      }
    }
    return undefined;
  }

  private getDungeonIdFromPortal(portalName: string): string | undefined {
    for (const [prefix, dungeonId] of Object.entries(portalToDungeon)) {
      if (portalName.startsWith(prefix)) {
        return dungeonId;
      }
    }
    return undefined;
  }

  private initStartRegions(): OverworldTraverserContext {
    const startRegions = ["Menu", "Flute Sky"];
    const reachable = new Map<string, RegionReachability>();

    for (const regionName of startRegions) {
      reachable.set(regionName, {
        status: "available",
        bunnyState: false, // This might need tweaking if entrance shuffle and start in non-home world
      });
    }

    return {
      reachable,
      queue: [...startRegions],
      blockedExits: [],
      pendingDungeons: new Map<string, Map<string, { bunnyState: boolean; status: LogicStatus; keyCost: number }>>(),
      allDiscoveredPortals: new Map<string, Map<string, { bunnyState: boolean; status: LogicStatus; keyCost: number }>>(),
      overworldKeyCost: new Map<string, number>(),
    };
  }

  private computeBunnyStateForExit(
    currentBunnyState: boolean,
    exitType: string,
    exitName?: string,
    destRegionName?: string,
  ): boolean {
    if (this.state.items.moonpearl.amount > 0) return false; //Never a bunny if we have moon pearl

    const isInverted = this.isInverted;

    // OWR: determine bunny state from effective world of destination tile
    if (this.isOwrActive && destRegionName) {
      const destOwid = this.metadata.regionToOwid.get(destRegionName);
      if (destOwid != null) {
        let effectiveWorld = this.getEffectiveWorld(destOwid);

        // Crossed: edge crossing flips the effective world
        if (this.state.settings.owCrossed !== "none" && exitName && this.metadata.tileBoundaryExits.has(exitName)) {
          // Find source owid from the exit's source region
          const sourceRegion = this.metadata.exitToSourceRegion.get(exitName);
          const sourceOwid = sourceRegion ? this.metadata.regionToOwid.get(sourceRegion) : undefined;
          if (this.isEdgeCrossed(exitName, sourceOwid, destOwid)) {
            effectiveWorld = effectiveWorld === "light" ? "dark" : "light";
          }
        }

        if (effectiveWorld === "dark") return !isInverted;
        if (effectiveWorld === "light") return isInverted;
      }
    }

    // Vanilla logic: bunny state determined by exit type
    if (exitType === "LightWorld") return isInverted;
    if (exitType === "DarkWorld") return !isInverted;

    return currentBunnyState;
  }

  private updateIfBetter(regionName: string, newStatus: LogicStatus, newBunnyState: boolean, ctx: OverworldTraverserContext): void {
    const current = ctx.reachable.get(regionName);
    if (!current) return; // Can't update non-existent region, shouldn't happen though

    if (current.bunnyState && !newBunnyState) {
      ctx.reachable.set(regionName, {
        status: combineStatuses(current.status, newStatus),
        bunnyState: newBunnyState,
      });
    } else {
      const combinedStatus = combineStatuses(current.status, newStatus);
      if (combinedStatus !== current.status) {
        ctx.reachable.set(regionName, {
          status: combinedStatus,
          bunnyState: current.bunnyState,
        });
      }
    }
  }

  /**
   * Evaluate exit requirements. When `forDiscovery` is true, uses the all-items
   * evaluator (partial mode) to discover portals reachable with full inventory.
   */
  private evaluateExitRequirements(exit: ExitLogic[string], fromRegion: string, ctx: OverworldTraverserContext, forDiscovery = false): LogicStatus {
    const evalCtx: EvaluationContext = {
      regionName: fromRegion,
      canReachRegion: (name: string) => ctx.reachable.get(name)?.status ?? "unavailable",
      effectiveWorldState: this.getEffectiveWorldState(fromRegion, exit.to),
    };

    const evaluator = forDiscovery ? (this.allItemsEvaluator ?? this.requirementEvaluator) : this.requirementEvaluator;
    return evaluator.evaluateWorldLogic(exit.requirements, evalCtx);
  }

  private processExit(exitName: string, exit: ExitLogic[string], fromRegion: string, fromRegionReachability: RegionReachability, ctx: OverworldTraverserContext): void {
    if (!exit?.to) return;

    // OWR: Block flute exits to tiles whose effective world prevents flute usage.
    // In Open mode, can only flute to effectively-LW tiles.
    // In Inverted mode, can only flute to effectively-DW tiles.
    if (this.isOwrActive && this.metadata.fluteSpotExits.has(exitName)) {
      const destOwid = this.metadata.regionToOwid.get(exit.to);
      if (destOwid != null) {
        const effectiveWorld = this.getEffectiveWorld(destOwid);
        if ((!this.isInverted && effectiveWorld === "dark") || (this.isInverted && effectiveWorld === "light")) {
          return; // Can't flute to this tile — wrong effective world
        }
      }
    }

    const currentReachability = ctx.reachable.get(exit.to);

    // For dungeon exits in partial mode, use all-items evaluator to discover portals
    // that would be reachable with full inventory
    const exitStatus = this.evaluateExitRequirements(exit, fromRegion, ctx, exit.type === "Dungeon" && !!this.allItemsEvaluator);

    if (exitStatus === "unavailable") {
      ctx.blockedExits.push({ exitName, exit, from: fromRegion });
      return;
    }

    if (exit.type === "Dungeon") {
      const dungeonId = this.getDungeonIdFromPortal(exit.to);
      if (dungeonId) {
        const newBunnyState = this.computeBunnyStateForExit(fromRegionReachability.bunnyState, exit.type, exitName, exit.to);
        // For dungeon portals in partial mode, compute actual status with real
        // inventory (the exitStatus came from the all-items evaluator for discovery).
        const actualExitStatus = this.allItemsEvaluator ? this.evaluateExitRequirements(exit, fromRegion, ctx, false) : exitStatus;
        const newStatus = minimumStatus(fromRegionReachability.status, actualExitStatus === "unavailable" ? "unavailable" : actualExitStatus);

        // Get the key cost to reach this overworld region (if it was reached via a dungeon exit)
        const regionKeyCost = ctx.overworldKeyCost.get(fromRegion) ?? 0;

        // Add to pending dungeons for this iteration
        if (!ctx.pendingDungeons.has(dungeonId)) {
          ctx.pendingDungeons.set(dungeonId, new Map());
        }

        // Also track in allDiscoveredPortals for persistence across iterations
        if (!ctx.allDiscoveredPortals.has(dungeonId)) {
          ctx.allDiscoveredPortals.set(dungeonId, new Map());
        }

        // Add or update portal status (main traversal may find a better status)
        const existingPortal = ctx.allDiscoveredPortals.get(dungeonId)!.get(exit.to);
        if (!existingPortal) {
          ctx.pendingDungeons.get(dungeonId)!.set(exit.to, { bunnyState: newBunnyState, status: newStatus, keyCost: regionKeyCost });
          ctx.allDiscoveredPortals.get(dungeonId)!.set(exit.to, { bunnyState: newBunnyState, status: newStatus, keyCost: regionKeyCost });
        } else if (isBetterStatus(newStatus, existingPortal.status)) {
          // Update to better status
          existingPortal.status = newStatus;
          existingPortal.bunnyState = newBunnyState && existingPortal.bunnyState;
          existingPortal.keyCost = Math.min(existingPortal.keyCost, regionKeyCost);
          ctx.pendingDungeons.get(dungeonId)!.set(exit.to, existingPortal);
        }
      }
      return; // We process dungeon entrances separately
    }

    const newBunnyState = this.computeBunnyStateForExit(fromRegionReachability.bunnyState, exit.type, exitName, exit.to);
    const newStatus = minimumStatus(fromRegionReachability.status, exitStatus);

    if (!currentReachability) {
      ctx.reachable.set(exit.to, {
        status: newStatus,
        bunnyState: newBunnyState,
      });
      ctx.queue.push(exit.to);
    } else {
      this.updateIfBetter(exit.to, newStatus, newBunnyState, ctx);
    }
  }

  private processPendingDungeons(ctx: OverworldTraverserContext): boolean {
    let madeProgress = false;

    for (const dungeonId of ctx.pendingDungeons.keys()) {
      // Use ALL discovered portals (not just new ones) for correct multi-entry status.
      const allPortals = ctx.allDiscoveredPortals.get(dungeonId);
      if (!allPortals || allPortals.size === 0) continue;

      const entryMap = new Map<string, { bunnyState: boolean }>();
      const entryStatus = new Map<string, LogicStatus>();
      const entryKeyCost = new Map<string, number>();

      // Use ALL discovered portals for this dungeon
      for (const [portalName, portalData] of allPortals) {
        entryMap.set(portalName, {
          bunnyState: portalData.bunnyState,
        });
        entryStatus.set(portalName, portalData.status);
        entryKeyCost.set(portalName, portalData.keyCost);
      }

      // Get dungeon keys and big key status
      const inventoryKeys = this.state.dungeons[dungeonId]?.smallKeys ?? 0;

      // Traverse the dungeon with a canReach callback for overworld regions.
      const dungeonTraverser = new DungeonTraverser(this.state, this.logicSet, dungeonId, "partial");
      const canReachOverworldRegion = (regionName: string): LogicStatus => {
        const regionReach = ctx.reachable.get(regionName);
        if (!regionReach) return "unavailable";

        // If the player is a bunny at this region, they can't interact
        // Return unavailable for bunny regions since canReach implies interaction
        if (regionReach.bunnyState) {
          return "unavailable";
        }

        return regionReach.status;
      };

      const result = dungeonTraverser.traverse(entryMap, entryStatus, inventoryKeys, entryKeyCost, canReachOverworldRegion);

      // Store key-gated regions from first traversal only (most conservative set).
      if (result.bigKeyGatedRegions && !this.dungeonBigKeyGatedRegions.has(dungeonId)) {
        this.dungeonBigKeyGatedRegions.set(dungeonId, result.bigKeyGatedRegions);
      }
      if (result.smallKeyGatedRegions && !this.dungeonSmallKeyGatedRegions.has(dungeonId)) {
        this.dungeonSmallKeyGatedRegions.set(dungeonId, result.smallKeyGatedRegions);
      }

      // Incorporate dungeon region statuses (always use latest traversal).
      for (const [regionName, regionState] of result.regionStatuses) {
        const existing = ctx.reachable.get(regionName);
        if (!existing) {
          ctx.reachable.set(regionName, {
            status: regionState.status,
            bunnyState: regionState.bunnyState,
            crystalStates: regionState.crystalStates,
          });
          madeProgress = true;
        } else if (existing.status !== regionState.status) {
          ctx.reachable.set(regionName, {
            status: regionState.status,
            bunnyState: existing.bunnyState && regionState.bunnyState,
            crystalStates: regionState.crystalStates,
          });
          madeProgress = true;
        }
      }

      // Process external exits (dungeon -> overworld)
      // In the pre-mutated graph, dungeon return exits already point to the correct
      // overworld region (entrance shuffle reverse remaps are baked into the graph).
      for (const [exitName, exitInfo] of result.externalExits) {
        if (exitInfo.status === "unavailable") continue;

        const resolvedTo = exitInfo.to;
        const resolvedType = this.regions[exitInfo.to]?.type ?? "LightWorld";

        // Track the key cost for this overworld region
        // Use the minimum key cost if we've seen it before
        const existingKeyCost = ctx.overworldKeyCost.get(resolvedTo);
        if (existingKeyCost === undefined || exitInfo.keysUsedToReach < existingKeyCost) {
          ctx.overworldKeyCost.set(resolvedTo, exitInfo.keysUsedToReach);
        }

        if (!ctx.reachable.has(resolvedTo)) {
          const newBunny = this.computeBunnyStateForExit(exitInfo.bunnyState, resolvedType, exitName, resolvedTo);
          ctx.reachable.set(resolvedTo, {
            status: exitInfo.status,
            bunnyState: newBunny,
          });
          ctx.queue.push(resolvedTo);
          madeProgress = true;
        }
      }
    }

    // Clear processed dungeons
    ctx.pendingDungeons.clear();

    return madeProgress;
  }

  public evaluateLocations(reachable: Map<string, RegionReachability>): Record<string, LogicStatus> {
    const locationStatuses: Record<string, LogicStatus> = {};

    if (this.state.settings.logicMode === "nologic") {
      // Return all locations as available
      for (const regionLogic of Object.values(this.regions)) {
        if (!regionLogic.locations) continue;
        for (const locationName of Object.keys(regionLogic.locations)) {
          locationStatuses[locationName] = "available";
        }
      }
      return locationStatuses;
    }

    for (const [regionName, regionLogic] of Object.entries(this.regions)) {
      if (!regionLogic.locations) {
        continue;
      }
      const regionReachability = reachable.get(regionName);

      for (const [locationName, locationLogic] of Object.entries(regionLogic.locations)) {
        if (!regionReachability) {
          locationStatuses[locationName] = "unavailable";
          continue;
        }

        // TODO: Refactor this to generically determine bunny availability
        if (regionReachability?.bunnyState && !this.bunnyExemptLocations.has(locationName)) {
          locationStatuses[locationName] = "unavailable";
          continue;
        }

        // Big Chests require the big key to open (when wildBigKeys is enabled)
        if (locationName.includes("Big Chest") && this.state.settings.wildBigKeys) {
          const dungeonId = this.getDungeonIdFromRegion(regionName);
          if (dungeonId && !this.state.dungeons[dungeonId]?.bigKey) {
            locationStatuses[locationName] = "unavailable";
            continue;
          }
        }

        const evalCtx: EvaluationContext = {
          regionName: regionName,
          dungeonId: this.getDungeonIdFromRegion(regionName),
          crystalStates: regionReachability.crystalStates,
          isBunny: regionReachability.bunnyState,
          canReachRegion: (name: string) => reachable.get(name)?.status ?? "unavailable",
          effectiveWorldState: this.getEffectiveWorldState(regionName),
        };

        const locationStatus = this.requirementEvaluator.evaluateWorldLogic(locationLogic.requirements, evalCtx);
        locationStatuses[locationName] = minimumStatus(regionReachability.status, locationStatus);
      }
    }

    // Post-process: Apply big key inference for non-wild big keys
    // When BK is NOT in the world pool, infer whether BK-locked locations are accessible
    // based on whether the player can reach all potential BK locations in the dungeon
    if (!this.state.settings.wildBigKeys) {
      const bkAvailability = this.computeDungeonKeyAvailability(locationStatuses, "bigKey");

      for (const [regionName, regionLogic] of Object.entries(this.regions)) {
        if (!regionLogic.locations || regionLogic.type !== "Dungeon") continue;
        const dungeonId = this.getDungeonIdFromRegion(regionName);
        if (!dungeonId) continue;
        const availability = bkAvailability.get(dungeonId);
        if (!availability || availability === "available") continue;

        const bkGated = this.dungeonBigKeyGatedRegions.get(dungeonId);
        for (const locationName of Object.keys(regionLogic.locations)) {
          const isBKLocked = bkGated?.has(regionName) || locationName.includes("Big Chest");
          if (isBKLocked && locationStatuses[locationName] !== undefined) {
            locationStatuses[locationName] = minimumStatus(locationStatuses[locationName], availability);
          }
        }
      }
    }

    // Post-process: Apply small key inference for non-wild small keys
    // When SK is NOT in the world pool (inDungeon), infer whether SK-locked locations are accessible
    // based on whether the player can reach all potential SK locations in the dungeon
    if (this.state.settings.wildSmallKeys === "inDungeon") {
      const skAvailability = this.computeDungeonKeyAvailability(locationStatuses, "smallKey");

      for (const [regionName, regionLogic] of Object.entries(this.regions)) {
        if (!regionLogic.locations || regionLogic.type !== "Dungeon") continue;
        const dungeonId = this.getDungeonIdFromRegion(regionName);
        if (!dungeonId) continue;
        const availability = skAvailability.get(dungeonId);
        if (!availability || availability === "available") continue;

        const skGated = this.dungeonSmallKeyGatedRegions.get(dungeonId);
        for (const locationName of Object.keys(regionLogic.locations)) {
          const isSKLocked = skGated?.has(regionName);
          if (isSKLocked && locationStatuses[locationName] !== undefined) {
            locationStatuses[locationName] = minimumStatus(locationStatuses[locationName], availability);
          }
        }
      }
    }

    return locationStatuses;
  }

  public evaluateEntrances(reachable: Map<string, RegionReachability>): Record<string, LogicStatus> {
    const entranceStatuses: Record<string, LogicStatus> = {};
    for (const entranceName of Object.keys(entranceLocations)) {
      // Find the overworld region containing this entrance
      const parentRegion = this.metadata.entranceToParentRegion.get(entranceName);
      if (!parentRegion) {
        entranceStatuses[entranceName] = "unavailable";
        continue;
      }
      const regionReachability = reachable.get(parentRegion);
      if (!regionReachability) {
        entranceStatuses[entranceName] = "unavailable";
        continue;
      }

      // Evaluate the exit requirements to enter this cave/dungeon.
      // Even though a bunny can walk to the entrance marker, some entrances
      // require interaction (e.g. bonk rocks need boots + moonpearl).
      const parentRegionLogic = this.regions[parentRegion];
      const exitDef = parentRegionLogic?.exits?.[entranceName];
      if (exitDef?.requirements) {
        const evalCtx: EvaluationContext = {
          regionName: parentRegion,
          canReachRegion: (name: string) => reachable.get(name)?.status ?? "unavailable",
          effectiveWorldState: this.getEffectiveWorldState(parentRegion, exitDef.to),
        };
        const exitStatus = this.requirementEvaluator.evaluateWorldLogic(exitDef.requirements, evalCtx);
        entranceStatuses[entranceName] = minimumStatus(regionReachability.status, exitStatus);
      } else {
        // No exit found or no requirements — entrance is freely accessible
        entranceStatuses[entranceName] = regionReachability.status;
      }
    }
    return entranceStatuses;
  }

  /**
   * For each dungeon, determine if a key type (big or small) is accessible.
   * Returns a map of dungeonId -> LogicStatus indicating key availability.
   *
   * "Shuffle pool" locations where a key could end up:
   *   - Regular chest locations (always)
   *   - Big Chest (SK only — BK can't be in the big chest, but a shuffled SK can)
   *   - Key Drop locations (only when settings.keyDrop is enabled)
   *   - Pot Key locations (only when settings.pottery is "keys" or "cavekeys")
   *
   * Logic:
   * 1. (BK only) Player already has the key (autotracked) → "available"
   * 2. (SK only) No keys are shuffled (0 chest keys + pot/drop not enabled) → "available"
   * 3. All non-gated shuffle-pool locations reachable → "available"
   * 4. (BK only) All reachable non-gated locations checked → "unavailable"
   * 5. Not all reachable → "possible"
   */
  private computeDungeonKeyAvailability(locationStatuses: Record<string, LogicStatus>, keyType: "bigKey" | "smallKey"): Map<string, LogicStatus> {
    const result = new Map<string, LogicStatus>();

    const isBigKey = keyType === "bigKey";
    const primaryGatedRegions = isBigKey ? this.dungeonBigKeyGatedRegions : this.dungeonSmallKeyGatedRegions;

    // Collect dungeon IDs from regions
    const dungeonIds = new Set<string>();
    for (const [regionName, regionLogic] of Object.entries(this.regions)) {
      if (regionLogic.type === "Dungeon") {
        const id = this.getDungeonIdFromRegion(regionName);
        if (id) dungeonIds.add(id);
      }
    }

    for (const dungeonId of dungeonIds) {
      // For BK: player already has BK → available
      if (isBigKey && this.state.dungeons[dungeonId]?.bigKey) {
        result.set(dungeonId, "available");
        continue;
      }

      const gatedRegions = primaryGatedRegions.get(dungeonId) ?? new Set<string>();

      // For SK: if no SK-gated regions exist, everything is freely accessible
      if (!isBigKey && gatedRegions.size === 0) {
        result.set(dungeonId, "available");
        continue;
      }

      // For SK: if no keys are shuffled, all keys are in their fixed pot/drop locations
      // Chest keys are always shuffled; pot/drop keys only if their settings are enabled
      if (!isBigKey) {
        const dungeonData = DungeonsData[dungeonId]?.totalLocations;
        const hasChestKeys = (dungeonData?.smallkeys ?? 0) > 0;
        // TODO: Extract keys, cavekeys - use POT_KEY_SHUFFLE_MODES
        const hasPotteryKeys = ["keys", "cavekeys", "lottery", "dungeon"].includes(this.state.settings.pottery) && (dungeonData?.keypots ?? 0) > 0;
        const hasDropKeys = this.state.settings.enemyDrop !== "none" && (dungeonData?.keydrops ?? 0) > 0;
        if (!hasChestKeys && !hasPotteryKeys && !hasDropKeys) {
          result.set(dungeonId, "available");
          continue;
        }
      }

      // Regions to exclude: the primary gated set, plus BK-gated when checking SK
      // (BK-gated regions are handled by BK inference separately)
      const excludedRegions = new Set(gatedRegions);
      if (!isBigKey) {
        const bkGated = this.dungeonBigKeyGatedRegions.get(dungeonId);
        if (bkGated) for (const r of bkGated) excludedRegions.add(r);
      }

      // Scan all non-gated treasure locations in this dungeon
      let allNonGatedReachable = true;
      let allReachableChecked = true; // Only used for BK
      let hasAnyNonGatedLocation = false;

      for (const [regionName, regionLogic] of Object.entries(this.regions)) {
        if (regionLogic.type !== "Dungeon") continue;
        if (this.getDungeonIdFromRegion(regionName) !== dungeonId) continue;
        if (excludedRegions.has(regionName)) continue;
        if (!regionLogic.locations) continue;

        for (const locationName of Object.keys(regionLogic.locations)) {
          // Common exclusions (non-treasure locations)
          if (locationName === "Crystal_Switch") continue;
          if (locationName.endsWith("Boss Kill")) continue;
          if (locationName.endsWith("Prize")) continue;

          // TODO: Update when more pot/drop shuffles are enabled
          if (/Pot #\d+$/.test(locationName)) continue;
          if (/Enemy #\d+$/.test(locationName)) continue;

          if (isBigKey && locationName.includes("Big Chest") && !["sp"].includes(dungeonId)) continue;
          // Key Drop/Pot Key: when their respective settings are off, these locations
          // have fixed keys and aren't part of the shuffle pool (applies to both BK and SK).
          if (locationName.includes("Key Drop") && this.state.settings.enemyDrop === "none") continue;
          if (locationName.endsWith("Pot Key") && !["keys", "cavekeys", "lottery", "dungeon"].includes(this.state.settings.pottery)) continue;

          hasAnyNonGatedLocation = true;
          const status = locationStatuses[locationName];
          if (!status || status === "unavailable") {
            allNonGatedReachable = false;
          } else if (isBigKey) {
            // BK tracks whether all reachable locations were checked
            const checkData = this.state.checks?.[locationName];
            if (!checkData?.checked) {
              allReachableChecked = false;
            }
          }
        }
      }

      if (!hasAnyNonGatedLocation || allNonGatedReachable) {
        result.set(dungeonId, "available");
      } else if (isBigKey && allReachableChecked) {
        // All reachable non-BK locations checked without finding BK → unreachable
        result.set(dungeonId, "unavailable");
      } else {
        result.set(dungeonId, "possible");
      }
    }

    return result;
  }

  private reevaluateBlockedExits(ctx: OverworldTraverserContext): boolean {
    let madeProgress = false;
    const stillBlocked: { exitName: string; exit: ExitLogic[string]; from: string }[] = [];

    for (const { exitName, exit, from } of ctx.blockedExits) {
      if (!exit?.to) continue; // Severed exit, drop it

      if (ctx.reachable.has(exit.to)) continue; // Already reachable

      if (!ctx.reachable.has(from)) {
        console.warn(`Blocked exit from unreachable region: ${from} -> ${exit.to}`);
        stillBlocked.push({ exitName, exit, from });
        continue; // Can't evaluate if the from region isn't reachable
      }

      const fromRegionReachability = ctx.reachable.get(from)!;

      const evalCtx: EvaluationContext = {
        regionName: from,
        crystalStates: fromRegionReachability.crystalStates,
        isBunny: fromRegionReachability.bunnyState,
        canReachRegion: (name: string) => ctx.reachable.get(name)?.status ?? "unavailable",
        effectiveWorldState: this.getEffectiveWorldState(from, exit.to),
      };

      const exitStatus = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, evalCtx);

      if (exitStatus !== "unavailable") {
        const newBunny = this.computeBunnyStateForExit(fromRegionReachability.bunnyState, exit.type, exitName, exit.to);
        const newStatus = minimumStatus(fromRegionReachability.status, exitStatus);

        ctx.reachable.set(exit.to, {
          status: newStatus,
          bunnyState: newBunny,
          crystalStates: fromRegionReachability.crystalStates,
        });
        ctx.queue.push(exit.to);
        madeProgress = true;
      } else {
        stillBlocked.push({ exitName, exit, from });
      }
    }
    ctx.blockedExits = stillBlocked;
    return madeProgress;
  }

  /**
   * In partial mode, discover all dungeon portals reachable with full inventory.
   * Portals found this way have entry status based on actual reachability —
   * "unavailable" if the player can't currently reach them.
   */
  private discoverAllPortals(ctx: OverworldTraverserContext): void {
    if (!this.allItemsEvaluator) return;

    // BFS with actual inventory to find truly reachable overworld regions
    const actuallyReachable = new Map<string, boolean>();
    const actualQueue = ["Menu", "Flute Sky"];
    for (const r of actualQueue) actuallyReachable.set(r, false);

    while (actualQueue.length > 0) {
      const current = actualQueue.shift()!;
      const regionLogic = this.regions[current];
      if (!regionLogic?.exits) continue;

      for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
        if (!exit?.to || exit.type === "Dungeon") continue;

        const evalCtx: EvaluationContext = {
          regionName: current,
          canReachRegion: (name: string) => (actuallyReachable.has(name) ? "available" : "unavailable"),
          effectiveWorldState: this.getEffectiveWorldState(current, exit.to),
        };
        const status = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, evalCtx);

        if (status !== "unavailable" && !actuallyReachable.has(exit.to)) {
          const currentBunny = actuallyReachable.get(current) ?? false;
          const newBunny = this.computeBunnyStateForExit(currentBunny, exit.type ?? "LightWorld", exitName, exit.to);
          actuallyReachable.set(exit.to, newBunny);
          actualQueue.push(exit.to);
        }
      }
    }

    // BFS with all-items to find ALL dungeon portals
    const visited = new Set<string>();
    const queue = ["Menu", "Flute Sky"];

    for (const region of queue) {
      visited.add(region);
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      const regionLogic = this.regions[current];

      if (!regionLogic?.exits) continue;

      for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
        if (!exit?.to) continue; // Severed exit — skip

        // Evaluate with all-items evaluator
        const evalCtx: EvaluationContext = {
          regionName: current,
          canReachRegion: (name: string) => (visited.has(name) ? "available" : "unavailable"),
          effectiveWorldState: this.getEffectiveWorldState(current, exit.to),
        };
        const status = this.allItemsEvaluator.evaluateWorldLogic(exit.requirements, evalCtx);

        if (status === "unavailable") continue;

        // If this is a dungeon portal, register it
        if (exit.type === "Dungeon") {
          const dungeonId = this.getDungeonIdFromPortal(exit.to);
          if (dungeonId) {
            if (!ctx.allDiscoveredPortals.has(dungeonId)) {
              ctx.allDiscoveredPortals.set(dungeonId, new Map());
            }
            if (!ctx.allDiscoveredPortals.get(dungeonId)!.has(exit.to)) {
              // Entry status from actual inventory (captures medallion uncertainty, etc.)
              let entryStatus: LogicStatus = "unavailable";
              if (actuallyReachable.has(current)) {
                const actualEvalCtx: EvaluationContext = {
                  regionName: current,
                  canReachRegion: (name: string) => (actuallyReachable.has(name) ? "available" : "unavailable"),
                  effectiveWorldState: this.getEffectiveWorldState(current, exit.to),
                };
                const actualStatus = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, actualEvalCtx);
                entryStatus = actualStatus === "unavailable" ? "unavailable" : actualStatus;
              }

              // Compute bunny state based on the region leading to the portal
              const portalBunny = actuallyReachable.has(current)
                ? this.computeBunnyStateForExit(actuallyReachable.get(current) ?? false, exit.type ?? "Dungeon", exitName, exit.to)
                : false;

              ctx.allDiscoveredPortals.get(dungeonId)!.set(exit.to, {
                bunnyState: portalBunny,
                status: entryStatus,
                keyCost: 0,
              });
            }
          }
          continue;
        }

        // For overworld regions, add to discovery queue
        if (!visited.has(exit.to)) {
          visited.add(exit.to);
          queue.push(exit.to);
        }
      }
    }
  }

  public traverse(): Map<string, RegionReachability> {
    const ctx = this.initStartRegions();

    // In partial mode, first discover all reachable portals with all-items
    if (this.protection === "partial") {
      this.discoverAllPortals(ctx);
    }

    let madeProgress = true;

    while (madeProgress) {
      madeProgress = false;
      while (ctx.queue.length > 0) {
        const current = ctx.queue.shift()!;
        const regionReachability = ctx.reachable.get(current)!;
        const regionLogic = this.regions[current];

        if (!regionLogic?.exits) continue;

        for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
          if (!exit?.to) continue; // Severed exit — skip
          this.processExit(exitName, exit, current, regionReachability, ctx);
        }
      }

      madeProgress = this.processPendingDungeons(ctx);

      if (this.reevaluateBlockedExits(ctx)) {
        madeProgress = true;
      }
    }
    return ctx.reachable;
  }
}
