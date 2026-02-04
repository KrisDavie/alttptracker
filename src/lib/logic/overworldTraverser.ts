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

interface OverworldTraverserContext {
  reachable: Map<string, RegionReachability>;
  queue: string[];
  blockedExits: { exit: ExitLogic[string]; from: string }[];
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

  constructor(state: GameState, logicSet: LogicSet, protection: "partial" | "dangerous" = "partial") {
    this.state = state;
    this.logicSet = logicSet;
    this.regions = logicSet.regions as Record<string, RegionLogic>;
    this.requirementEvaluator = new RequirementEvaluator(state);
    this.protection = protection;
    
    // In partial mode, create an all-items evaluator for discovering regions
    if (protection === "partial") {
      const allItemsState = createAllItemsState(this.state);
      this.allItemsEvaluator = new RequirementEvaluator(allItemsState);
    }
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
    "Sunken Treasure",
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

  private computeBunnyStateForExit(currentBunnyState: boolean, exitType: string): boolean {
    if (this.state.items.moonpearl.amount > 0) return false; //Never a bunny if we have moon pearl

    const isInverted = this.state.settings.worldState === "inverted";

    // We only change bunny state if we're transitioning to the overworld
    if (exitType === "LightWorld") return isInverted;
    if (exitType === "DarkWorld") return !isInverted;

    return currentBunnyState;
  }



  private updateIfBetter(regionName: string, newStatus: LogicStatus, newBunnyState: boolean, ctx: OverworldTraverserContext): void {
    const current = ctx.reachable.get(regionName)!;
    if (!current) return; // Can't update non-existant region, shouldn't happen though

    // No bunny is always better
    if (current.bunnyState && !newBunnyState) {
      ctx.reachable.set(regionName, {
        status: combineStatuses(current.status, newStatus),
        bunnyState: newBunnyState,
      });
    } else {
      // Not sure if this is required?
      const combinedStatus = combineStatuses(current.status, newStatus);
      if (combinedStatus !== current.status) {
        ctx.reachable.set(regionName, {
          status: combinedStatus,
          bunnyState: current.bunnyState,
        });
      }
    }
  }

  private evaluateExitRequirements(exit: ExitLogic[string], fromRegion: string, ctx: OverworldTraverserContext): LogicStatus {
    const evalCtx: EvaluationContext = {
      regionName: fromRegion,
      canReachRegion: (name: string) => ctx.reachable.get(name)?.status ?? "unavailable",
    };

    return this.requirementEvaluator.evaluateWorldLogic(exit.requirements, evalCtx);
  }
  
  /** Evaluate exit requirements using all-items evaluator for portal discovery in partial mode */
  private evaluateExitRequirementsForDiscovery(exit: ExitLogic[string], fromRegion: string, ctx: OverworldTraverserContext): LogicStatus {
    const evalCtx: EvaluationContext = {
      regionName: fromRegion,
      canReachRegion: (name: string) => ctx.reachable.get(name)?.status ?? "unavailable",
    };

    // In partial mode, use all-items evaluator to discover more portals
    const evaluator = this.allItemsEvaluator ?? this.requirementEvaluator;
    return evaluator.evaluateWorldLogic(exit.requirements, evalCtx);
  }

  private processExit(exit: ExitLogic[string], fromRegion: string, fromRegionReachability: RegionReachability, ctx: OverworldTraverserContext): void {
    if (!exit?.to) return;

    const currentReachability = ctx.reachable.get(exit.to);

    // For dungeon exits in partial mode, use all-items evaluator to discover portals
    // that would be reachable with full inventory
    const exitStatus = (exit.type === "Dungeon" && this.allItemsEvaluator)
      ? this.evaluateExitRequirementsForDiscovery(exit, fromRegion, ctx)
      : this.evaluateExitRequirements(exit, fromRegion, ctx);

    if (exitStatus === "unavailable") {
      ctx.blockedExits.push({ exit, from: fromRegion });
      return;
    }

    if (exit.type === "Dungeon") {
      const dungeonId = this.getDungeonIdFromPortal(exit.to);
      if (dungeonId) {
        const newBunnyState = this.computeBunnyStateForExit(fromRegionReachability.bunnyState, exit.type);
        const newStatus = combineStatuses(fromRegionReachability.status, exitStatus);

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

        // Add or update portal status - the main traversal may find a better status
        // than the discovery phase (which conservatively uses "unavailable" or "possible")
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

    const newBunnyState = this.computeBunnyStateForExit(fromRegionReachability.bunnyState, exit.type);
    const newStatus = combineStatuses(fromRegionReachability.status, exitStatus);

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
      // When processing a dungeon, use ALL discovered portals for that dungeon,
      // not just the new ones. This ensures correct status calculation when
      // a dungeon is reached from multiple entrances across different iterations.
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

      // Traverse the dungeon, providing a callback to check overworld region reachability
      // Use partial key logic by default (assumes all items for key counting)
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

      // Incorporate dungeon region statuses (for location evaluation later)
      // Update existing regions if we get a better status
      for (const [regionName, regionState] of result.regionStatuses) {
        const existing = ctx.reachable.get(regionName);
        if (!existing) {
          ctx.reachable.set(regionName, {
            status: regionState.status,
            bunnyState: regionState.bunnyState,
            crystalStates: regionState.crystalStates,
          });
          madeProgress = true;
        } else {
          // Use minimum (worse) status - the dungeon traverser's key accessibility
          // analysis is authoritative, so we should not override "possible" with "available"
          const newStatus = minimumStatus(existing.status, regionState.status);
          if (newStatus !== existing.status) {
            ctx.reachable.set(regionName, {
              status: newStatus,
              bunnyState: existing.bunnyState && regionState.bunnyState, // Less bunny is better
              crystalStates: regionState.crystalStates,
            });
            madeProgress = true;
          }
        }
      }

      // Process external exits - these lead back to the overworld
      // Only add reachable exits (not "unavailable") to the queue
      // Also track the key cost to reach these overworld regions
      for (const [, exitInfo] of result.externalExits) {
        if (exitInfo.status === "unavailable") continue;

        // Track the key cost for this overworld region
        // Use the minimum key cost if we've seen it before
        const existingKeyCost = ctx.overworldKeyCost.get(exitInfo.to);
        if (existingKeyCost === undefined || exitInfo.keysUsedToReach < existingKeyCost) {
          ctx.overworldKeyCost.set(exitInfo.to, exitInfo.keysUsedToReach);
        }

        if (!ctx.reachable.has(exitInfo.to)) {
          const newBunny = this.computeBunnyStateForExit(exitInfo.bunnyState, this.regions[exitInfo.to]?.type ?? "LightWorld");
          ctx.reachable.set(exitInfo.to, {
            status: exitInfo.status,
            bunnyState: newBunny,
          });
          ctx.queue.push(exitInfo.to);
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
        };

        const locationStatus = this.requirementEvaluator.evaluateWorldLogic(locationLogic.requirements, evalCtx);
        locationStatuses[locationName] = minimumStatus(regionReachability.status, locationStatus);
      }
    }
    return locationStatuses;
  }

  public evaluateEntrances(reachable: Map<string, RegionReachability>): Record<string, LogicStatus> {
    const entranceStatuses: Record<string, LogicStatus> = {};
    for (const [, regionLogic] of Object.entries(this.regions)) {
      // No entrances
      if (!regionLogic.entrances) {
        continue;
      }
      for (const [entranceName] of Object.entries(regionLogic.entrances)) {
        const regionReachability = reachable.get(entranceName);
        // Entrances are also regions
        if (!regionReachability) {
          entranceStatuses[entranceName] = "unavailable";
          continue;
        }

        entranceStatuses[entranceName] = regionReachability.status;
      }
    }
    return entranceStatuses;
  }

  private reevaluateBlockedExits(ctx: OverworldTraverserContext): boolean {
    let madeProgress = false;
    const stillBlocked: { exit: ExitLogic[string]; from: string }[] = [];

    for (const { exit, from } of ctx.blockedExits) {
      if (ctx.reachable.has(exit.to)) continue; // Already reachable

      if (!ctx.reachable.has(from)) {
        console.warn(`Blocked exit from unreachable region: ${from} -> ${exit.to}`);
        stillBlocked.push({ exit, from });
        continue; // Can't evaluate if the from region isn't reachable
      }

      const fromRegionReachability = ctx.reachable.get(from)!;

      const evalCtx: EvaluationContext = {
        regionName: from,
        crystalStates: fromRegionReachability.crystalStates,
        isBunny: fromRegionReachability.bunnyState,
        canReachRegion: (name: string) => ctx.reachable.get(name)?.status ?? "unavailable",
      };

      const exitStatus = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, evalCtx);

      if (exitStatus !== "unavailable") {
        const newBunny = this.computeBunnyStateForExit(fromRegionReachability.bunnyState, exit.type);
        const newStatus = combineStatuses(fromRegionReachability.status, exitStatus);

        ctx.reachable.set(exit.to, {
          status: newStatus,
          bunnyState: newBunny,
          crystalStates: fromRegionReachability.crystalStates,
        });
        ctx.queue.push(exit.to);
        madeProgress = true;
      } else {
        stillBlocked.push({ exit, from });
      }
    }
    ctx.blockedExits = stillBlocked;
    return madeProgress;
  }

  /**
   * In partial mode, run a discovery-only BFS with all-items evaluator
   * to find all dungeon portals that would be reachable with full inventory.
   * This populates allDiscoveredPortals before the main traversal.
   * 
   * Portals discovered this way are used for KEY COUNTING (Dijkstra/BFS phases)
   * but their entry status is set to "unavailable" since the player can't 
   * actually reach them with current inventory. This allows key contention
   * logic to work while still marking locations behind those portals as unreachable.
   */
  private discoverAllPortals(ctx: OverworldTraverserContext): void {
    if (!this.allItemsEvaluator) return;
    
    // First, do a BFS with actual inventory to find which overworld regions are truly reachable
    const actuallyReachable = new Set<string>();
    const actualQueue = ["Menu", "Flute Sky"];
    for (const r of actualQueue) actuallyReachable.add(r);
    
    while (actualQueue.length > 0) {
      const current = actualQueue.shift()!;
      const regionLogic = this.regions[current];
      if (!regionLogic?.exits) continue;
      
      for (const exit of Object.values(regionLogic.exits)) {
        if (!exit?.to || exit.type === "Dungeon") continue; // Skip dungeon portals for now
        
        const evalCtx: EvaluationContext = {
          regionName: current,
          canReachRegion: (name: string) => actuallyReachable.has(name) ? "available" : "unavailable",
        };
        const status = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, evalCtx);
        
        if (status !== "unavailable" && !actuallyReachable.has(exit.to)) {
          actuallyReachable.add(exit.to);
          actualQueue.push(exit.to);
        }
      }
    }
    
    // Now do a BFS with all-items to find ALL dungeon portals
    const visited = new Set<string>();
    const queue = ["Menu", "Flute Sky"];
    
    for (const region of queue) {
      visited.add(region);
    }
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const regionLogic = this.regions[current];
      
      if (!regionLogic?.exits) continue;
      
      for (const exit of Object.values(regionLogic.exits)) {
        if (!exit?.to) continue;
        
        // Evaluate with all-items evaluator
        const evalCtx: EvaluationContext = {
          regionName: current,
          canReachRegion: (name: string) => visited.has(name) ? "available" : "unavailable",
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
              // Entry status depends on whether the region leading to the portal
              // is actually reachable with current inventory
              // If not reachable, mark as "unavailable" so locations behind are correctly marked
              const entryStatus = actuallyReachable.has(current) ? "possible" : "unavailable";
              
              ctx.allDiscoveredPortals.get(dungeonId)!.set(exit.to, { 
                bunnyState: false, 
                status: entryStatus,
                keyCost: 0
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

        for (const exit of Object.values(regionLogic.exits)) {
          this.processExit(exit, current, regionReachability, ctx);
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
