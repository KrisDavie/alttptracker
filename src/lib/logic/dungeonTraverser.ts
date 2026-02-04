/**
 * DungeonTraverser - Computes reachability and key requirements for dungeon regions.
 * 
 * OVERVIEW:
 * The traverser determines which regions within a dungeon are reachable given the player's
 * current inventory (especially small keys) and settings. It handles key doors, crystal
 * switches, and inter-dungeon dependencies (canReach requirements).
 * 
 * THREE-PHASE APPROACH (for wild small keys mode):
 * 
 * 1. DIJKSTRA (minKeysUsed): Finds the minimum keys needed to reach each region.
 *    - Treats key doors as weight-1 edges
 *    - Iterates until no new regions are discovered (handles canReach dependencies)
 *    - Assumes unlimited keys for exploration
 * 
 * 2. BFS (maxKeysUsed): Finds the maximum keys that MIGHT be needed to reach each region.
 *    - For each key door, defers it until all other options are exhausted
 *    - Tracks which regions are exclusively behind that deferred door
 *    - Used to detect key contention scenarios
 * 
 * 3. FINAL BFS: Computes actual accessibility status for each region.
 *    - Uses fixed-point iteration to count accessible keys
 *    - Compares available keys against min/maxKeysUsed to determine status
 *    - Handles pottery/keyDrop mode by checking for door contention in branching dungeons
 * 
 * KEY CONCEPTS:
 * - minKeysUsed: Optimal path key cost (always achievable if you have the keys)
 * - maxKeysUsed: Worst-case path key cost (if you make suboptimal door choices)
 * - A region is "possible" if minKeysUsed <= keys < maxKeysUsed (might get stuck)
 * - A region is "available" if keys >= maxKeysUsed (guaranteed reachable)
 * - Crystal switches toggle between orange/blue states, affecting certain exits
 * - Big key doors paired with small key doors on the reverse side don't consume keys
 */

import { type CrystalSwitchState, type ExitLogic, type GameState, type LogicState, type LogicStatus, type RegionLogic } from "@/data/logic/logicTypes";
import type { LogicSet } from "./logicMapper";
import { RequirementEvaluator, type EvaluationContext } from "./requirementEvaluator";
import { getLogicStateForWorld, createAllItemsState, isBetterStatus } from "./logicHelpers";
import { PriorityQueue } from "@datastructures-js/priority-queue";

export interface DungeonRegionState {
  status: LogicStatus;
  bunnyState: boolean;
  crystalStates: Set<CrystalSwitchState>;
}

export interface DungeonTraversalResult {
  regionStatuses: Map<string, DungeonRegionState>; // Internal region statuses
  externalExits: Map<string, { to: string; status: LogicStatus; bunnyState: boolean; keysUsedToReach: number }>; // Dungeon -> Overworld exits
}

interface DungeonContext {
  reachable: Map<string, DungeonRegionState>;
  queue: Array<{ region: string; crystalState: CrystalSwitchState; keysUsed: number }>;
  pendingKeyDoors: string[]; // Door identifiers
  regionMaxKeysUsed: Map<string, number>; // Region name -> max keys used to reach it
  regionMinKeysUsed: Map<string, number>; // Region name -> min keys used to reach it
  discoveredKeyLocations: Set<string>;
  totalKeysAvailable: number;
}

export class DungeonTraverser {
  private state: GameState;
  private regions: Record<string, RegionLogic>;
  private dungeonId: string;
  private requirementEvaluator: RequirementEvaluator;
  private canReachOverworldRegion?: (regionName: string) => LogicStatus;
  private protection: "partial" | "dangerous";
  
  // Cache for exit name -> source region mapping (built lazily)
  private exitToSourceRegion?: Map<string, string>;
  
  // Set of region types that are overworld (exits to these are skipped during dungeon traversal)
  private static readonly OVERWORLD_TYPES = new Set(["LightWorld", "DarkWorld"]);

  constructor(state: GameState, logicSet: LogicSet, dungeonId: string, protection: "partial" | "dangerous" = "partial") {
    this.state = state;
    this.regions = logicSet.regions as Record<string, RegionLogic>;
    this.dungeonId = dungeonId;
    this.protection = protection;

    this.requirementEvaluator = new RequirementEvaluator(state);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  private debugLog(..._args: any[]) {
    // if (this.dungeonId === "dp") {
    //   console.log(`[DungeonTraverser - ${this.dungeonId}]`, ..._args);
    // }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  private debugLogVerbose(..._args: any[]) {
    // if (this.dungeonId === "ip") {
    //   console.log(`[DT-VERBOSE - ${this.dungeonId}]`, ..._args);
    // }
  }

  public traverse(
    entryRegions: Map<string, { bunnyState: boolean }>, 
    entryStatus: Map<string, LogicStatus>, 
    inventoryKeys: number,
    entryKeyCost: Map<string, number> = new Map(),
    canReachOverworldRegion?: (regionName: string) => LogicStatus
  ): DungeonTraversalResult {
    this.debugLog(`traverse() called with inventoryKeys=${inventoryKeys}`);
    this.debugLog(`  Entry statuses:`, Array.from(entryStatus.entries()));
    const ctx = this.initializeDungeonContext(entryRegions, inventoryKeys, entryKeyCost);

    // Store the callback for use in finalBFS
    this.canReachOverworldRegion = canReachOverworldRegion;

    // For key counting phases (Dijkstra/BFS), use appropriate state based on protection mode:
    // - partial: assumes all items are available (randomizer's assumption)
    // - dangerous: uses actual player inventory
    const keyCountingState = this.protection === "partial" ? createAllItemsState(this.state) : this.state;
    const keyCountingEvaluator = new RequirementEvaluator(keyCountingState);
    
    // For final accessibility, always use actual inventory
    this.requirementEvaluator = new RequirementEvaluator(this.state);

    if (this.state.settings.wildSmallKeys === "wild") {
      // Min keys per region using Dijkstra
      this.dijkstraMinKeys(ctx, entryRegions, entryKeyCost, keyCountingEvaluator);
      
      this.debugLog(`Pending key doors for ${this.dungeonId}:`, ctx.pendingKeyDoors);
      
      // Run BFS to find max keys per region
      this.bfsMaxKeys(ctx, entryRegions, entryKeyCost, keyCountingEvaluator);
      
      // Propagate maxKeysUsed through canReach dependencies
      // If region A requires canReach|B to reach it, and B has maxKeysUsed > A's minKeysUsed,
      // then A's maxKeysUsed should be at least B's maxKeysUsed
      this.propagateMaxKeysThroughCanReach(ctx);
      
      // For any region that has minKeysUsed but no maxKeysUsed, 
      // set maxKeysUsed = minKeysUsed (deterministic path with no key door choices)
      for (const [regionName, minKeys] of ctx.regionMinKeysUsed) {
        if (!ctx.regionMaxKeysUsed.has(regionName)) {
          ctx.regionMaxKeysUsed.set(regionName, minKeys);
        }
      }
    }

    // Compile final reachable regions with statuses
    this.finalBFS(ctx, entryRegions, entryStatus, inventoryKeys, keyCountingEvaluator);

    // Collect external exits (dungeon -> overworld)
    const externalExits = new Map<string, { to: string; status: LogicStatus; bunnyState: boolean; keysUsedToReach: number }>();
    for (const [regionName, regionState] of ctx.reachable) {
      const regionLogic = this.regions[regionName];
      const minKeysForRegion = ctx.regionMinKeysUsed.get(regionName) ?? 0;
      if (regionLogic?.exits) {
        for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
          if (exit.to && DungeonTraverser.OVERWORLD_TYPES.has(this.regions[exit.to]?.type || "")) {
            externalExits.set(exitName, {
              to: exit.to,
              status: regionState.status,
              bunnyState: regionState.bunnyState,
              keysUsedToReach: minKeysForRegion,
            });
          }
        }
      }
    }

    this.debugLog(`Dungeon ${this.dungeonId} traversal complete. Regions reachable: ${ctx.reachable.size}, Keys discovered: ${ctx.discoveredKeyLocations.size}, Total keys available: ${ctx.totalKeysAvailable}`);
    this.debugLog(` Region Min Keys Used:`, ctx.regionMinKeysUsed);
    this.debugLog(` Region Max Keys Used:`, ctx.regionMaxKeysUsed);
    this.debugLog(` Discovered Key Locations:`, Array.from(ctx.discoveredKeyLocations));
    this.debugLog(` External Exits:`, externalExits);
    this.debugLog(` Final Region States:`, ctx.reachable);

    return {
      regionStatuses: ctx.reachable,
      externalExits,
    };


  }

  private dijkstraMinKeys(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>, entryKeyCost: Map<string, number>, evaluator: RequirementEvaluator) {
    // Dijkstra with key doors as weight-1 edges. Iterates until convergence
    // because canReach requirements may depend on regions discovered in the same pass.
    let previousRegionCount = 0;
    let iterations = 0;
    const maxIterations = 10;
    
    while (iterations < maxIterations) {
      iterations++;
      const visited = new Set<string>(); // Reset visited each iteration
      const pq = new PriorityQueue<{ region: string; crystalState: CrystalSwitchState; keysUsed: number }>((a, b) => a.keysUsed - b.keysUsed);

      this.debugLog(`Dijkstra iteration ${iterations}, entry regions:`, Array.from(entryRegions.keys()));
      for (const [regionName] of entryRegions) {
        const startKeyCost = entryKeyCost.get(regionName) ?? 0;
        pq.enqueue({ region: regionName, crystalState: "orange", keysUsed: startKeyCost });
      }

    while (!pq.isEmpty()) {
      const { region, crystalState, keysUsed } = pq.dequeue()!;
      const visitKey = `${region}|${crystalState}`;
      if (visited.has(visitKey)) continue;
      visited.add(visitKey);
      this.debugLog(`Dijkstra visiting: ${region} (crystal: ${crystalState}, keys: ${keysUsed})`);

      const regionState = ctx.reachable.get(region);
      const regionLogic = this.regions[region];
      if (!regionLogic) {
        this.debugLog(`  No region logic found for: ${region}`);
        continue;
      }

      // Only update minKeysUsed if we found a better path
      const existingMinKeys = ctx.regionMinKeysUsed.get(region);
      if (existingMinKeys === undefined || keysUsed < existingMinKeys) {
        ctx.regionMinKeysUsed.set(region, keysUsed);
      }

      if (regionLogic.exits) {
        for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
          const targetType = this.regions[exit.to]?.type || "";
          if (!exit.to || DungeonTraverser.OVERWORLD_TYPES.has(targetType)) {
            this.debugLog(`  Exit ${exitName} skipped: to=${exit.to}, type=${targetType}`);
            continue;
          }

          const isSKDoor = this.requiresSmallKey(exit);
          // Small key doors paired with big key doors open automatically and don't count
          const isPairedWithBigKey = isSKDoor && this.isSmallKeyDoorPairedWithBigKey(region, exit.to);
          const countsAsKeyDoor = isSKDoor && !isPairedWithBigKey;
          
          // Keep track of key doors for BFS in next pass (only real key-consuming doors)
          if (countsAsKeyDoor && !ctx.pendingKeyDoors.includes(exitName)) {
            ctx.pendingKeyDoors.push(exitName);
          }
          
          // Track key cost from canReach requirements (need to reach target first)
          let canReachKeyCost = 0;
          
          // Evaluate exit requirements, assuming keys available to see all doors
          const status = evaluator.evaluateWorldLogic(exit.requirements, {
            regionName: region,
            dungeonId: this.dungeonId,
            crystalStates: new Set([crystalState]),
            isBunny: regionState?.bunnyState ?? false,
            assumeSmallKey: isSKDoor,
            assumeBigKey: true, // Ignore big key doors for key counting
            canReachRegion: (targetRegion: string) => {
              const targetRegionLogic = this.regions[targetRegion];
              if (targetRegionLogic?.type === "Dungeon") {
                // Check if discovered in any iteration
                const targetMinKeys = ctx.regionMinKeysUsed.get(targetRegion);
                if (targetMinKeys !== undefined) {
                  canReachKeyCost = Math.max(canReachKeyCost, targetMinKeys);
                  return "available";
                }
                // Or visited in this iteration
                if (visited.has(`${targetRegion}|orange`) || visited.has(`${targetRegion}|blue`)) {
                  return "available";
                }
                return "unavailable";
              }
              return "available"; // Overworld regions assumed reachable
            },
          });

          // The effective key cost for this exit is the max of:
          // 1. Current keysUsed + key door cost
          // 2. The minimum keys needed to satisfy any canReach requirements
          const baseNextKeys = keysUsed + (countsAsKeyDoor ? 1 : 0);
          const nextKeys = Math.max(baseNextKeys, canReachKeyCost);

          this.debugLog(`  Exit ${exitName} -> ${exit.to}: status=${status}, isSK=${isSKDoor}, canReachCost=${canReachKeyCost}`);
          if (status !== "unavailable") {
            pq.enqueue({ region: exit.to, crystalState, keysUsed: nextKeys });
          }
        }
      }

      if (this.hasCrystalSwitch(region)) {
        if (this.canHitCrystalSwitch(region, { 
            regionName: region, 
            dungeonId: this.dungeonId, 
            crystalStates: new Set([crystalState]), 
            isBunny: regionState?.bunnyState ?? false 
        })) {
          pq.enqueue({ region, crystalState: this.toggleCrystalState(crystalState), keysUsed });
        }
      }
    }
    
      // End of inner while loop - check if we discovered new regions
      const currentRegionCount = ctx.regionMinKeysUsed.size;
      if (currentRegionCount === previousRegionCount) {
        // No new regions discovered, we're done
        this.debugLog(`Dijkstra converged after ${iterations} iterations, ${currentRegionCount} regions`);
        break;
      }
      previousRegionCount = currentRegionCount;
      this.debugLog(`Dijkstra iteration ${iterations} discovered ${currentRegionCount} regions, continuing...`);
    }
  }

  private bfsMaxKeys(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>, entryKeyCost: Map<string, number>, evaluator: RequirementEvaluator) {
    // BFS that defers each key door in turn to find worst-case key costs.
    // For each pending door, we explore everything else first, then open that door last.
    // Regions found only after opening the deferred door get maxKeysUsed set.
    this.debugLog(`BFS starting with ${ctx.pendingKeyDoors.length} pending key doors:`, ctx.pendingKeyDoors);
    
    // Track ALL regions that were reachable before ANY door was deferred across ALL iterations
    // These regions should have maxKeysUsed = minKeysUsed because they are NOT exclusively behind doors
    const regionsReachableBeforeAnyDoor = new Set<string>();
    
    for (const pendingKeyDoor of ctx.pendingKeyDoors) {
      interface ExitQueueItem {
        from: string;
        exitName: string;
        to: string;
        crystalState: CrystalSwitchState;
        priority: number;
        isKeyDoor: boolean;
      }
      
      const exitQueue = new PriorityQueue<ExitQueueItem>((a, b) => a.priority - b.priority);
      
      // Only start from primary entry portals (keyCost=0)
      for (const [regionName] of entryRegions) {
        const startKeyCost = entryKeyCost.get(regionName) ?? 0;
        if (startKeyCost > 0) continue; // Skip secondary portals for maxKeysUsed
        exitQueue.enqueue({ 
            from: "entry", 
            exitName: "entry", 
            to: regionName, 
            crystalState: "orange", 
            priority: startKeyCost, 
            isKeyDoor: false
        });
      }

      const visited = new Set<string>();
      const openedDoorPairs = new Set<string>();
      let deferred = false
      let doorPassed = false;
      let deferredExit: ExitQueueItem | null = null;
      // Track regions reachable WITHOUT opening the deferred door
      let regionsReachableWithoutDeferredDoor: Set<string> | null = null;
      // Track regions we've already set maxKeysUsed for in THIS iteration
      const regionsSetThisIteration = new Set<string>();
      
      // We need to make sure we don't open the last door until the queue is empty
      // Start keysUsed at the minimum entry key cost
      let minEntryKeyCost = Infinity;
      for (const [regionName] of entryRegions) {
        const keyCost = entryKeyCost.get(regionName) ?? 0;
        if (keyCost < minEntryKeyCost) minEntryKeyCost = keyCost;
      }
      let keysUsed = minEntryKeyCost === Infinity ? 0 : minEntryKeyCost;
      while (!exitQueue.isEmpty()) {
        const item = exitQueue.dequeue()!;
        const { from, exitName, to: region, crystalState, isKeyDoor } = item;
        
        const doorKey = this.getDoorPairKey(from, region);

        if (isKeyDoor && pendingKeyDoor === exitName && !deferred && !openedDoorPairs.has(doorKey)) {
            this.debugLog(`  🔒 Deferring key door ${exitName} to ${region} (pendingKeyDoor=${pendingKeyDoor})`);
            deferredExit = item;
            continue;
        }

        if (isKeyDoor && !openedDoorPairs.has(doorKey)) {
            openedDoorPairs.add(doorKey);
            keysUsed++;
            // this.debugLog(`  🔑 Opening key door between ${from} and ${region}, keys used: ${keysUsed}`);
        }

        const visitKey = `${region}|${crystalState}`;
        if (!visited.has(visitKey)) {
          visited.add(visitKey);
          this.debugLog(` - BFS Visiting region: ${region} via ${exitName}, crystal: ${crystalState}, keys used: ${keysUsed}, doorPassed: ${doorPassed}`);

          const regionState = ctx.reachable.get(region);
          const regionLogic = this.regions[region];
          if (!regionLogic) continue;

          const existingMax = ctx.regionMaxKeysUsed.get(region) ?? -1;
          // Only update maxKeysUsed if:
          // 1. We've passed the deferred door (doorPassed is true)
          // 2. This region is EXCLUSIVELY behind the deferred door (wasn't reachable before opening it)
          // 3. We haven't already set maxKeysUsed for this region in THIS iteration
          //    (prevents counting doors opened AFTER reaching the region)
          const isExclusivelyBehindDeferredDoor = doorPassed && 
            regionsReachableWithoutDeferredDoor !== null && 
            !regionsReachableWithoutDeferredDoor.has(region);
          if (isExclusivelyBehindDeferredDoor && !regionsSetThisIteration.has(region)) {
            regionsSetThisIteration.add(region);
            // Take maximum across all iterations (different deferred doors)
            if (keysUsed > existingMax) {
              this.debugLog(`  📊 Setting maxKeysUsed for ${region}: ${keysUsed} (deferred door: ${pendingKeyDoor})`);
              ctx.regionMaxKeysUsed.set(region, keysUsed);
            }
          }

          if (regionLogic.exits) {
            for (const [nextExitName, exit] of Object.entries(regionLogic.exits)) {
              if (!exit.to || DungeonTraverser.OVERWORLD_TYPES.has(this.regions[exit.to]?.type || "")) continue;
              const isSKDoor = this.requiresSmallKey(exit);
              const isPairedWithBigKey = isSKDoor && this.isSmallKeyDoorPairedWithBigKey(region, exit.to);
              const countsAsKeyDoor = isSKDoor && !isPairedWithBigKey;
              
              // Track canReach key cost like Dijkstra does
              let canReachKeyCost = 0;
              
              // Evaluate exit requirements (assume big keys available)
              const status = evaluator.evaluateWorldLogic(exit.requirements, {
                regionName: region,
                dungeonId: this.dungeonId,
                crystalStates: new Set([crystalState]),
                isBunny: regionState?.bunnyState ?? false,
                assumeSmallKey: isSKDoor,
                assumeBigKey: true,
                canReachRegion: (targetRegion: string) => {
                  const targetRegionLogic = this.regions[targetRegion];
                  if (targetRegionLogic?.type === "Dungeon") {
                    const targetMinKeys = ctx.regionMinKeysUsed.get(targetRegion);
                    if (targetMinKeys !== undefined) {
                      canReachKeyCost = Math.max(canReachKeyCost, targetMinKeys);
                      return "available";
                    }
                    return "unavailable";
                  }
                  return "available";
                },
              });

              if (status !== "unavailable") {
                // Calculate effective key cost including canReach requirements
                const baseNextKeys = keysUsed + (countsAsKeyDoor ? 1 : 0);
                const effectiveKeyCost = Math.max(baseNextKeys, canReachKeyCost);
                
                // Determine priority - put key doors at back by adding a cost
                const priority = countsAsKeyDoor ? effectiveKeyCost + 100 : effectiveKeyCost;
                exitQueue.enqueue({ from: region, exitName: nextExitName, to: exit.to, crystalState, priority, isKeyDoor: countsAsKeyDoor });
              }
            }
          }
          
          if (this.hasCrystalSwitch(region)) {
            if (this.canHitCrystalSwitch(region, { 
                regionName: region, 
                dungeonId: this.dungeonId, 
                crystalStates: new Set([crystalState]), 
                isBunny: regionState?.bunnyState ?? false 
            })) {
              exitQueue.enqueue({ from: region, exitName: "crystal_switch", to: region, crystalState: this.toggleCrystalState(crystalState), priority: keysUsed, isKeyDoor: false });
            }
          }
        }

        if (exitQueue.isEmpty() && !deferred && deferredExit) {
          deferred = true;
          doorPassed = true;
          
          // Save which regions were reachable WITHOUT opening the deferred door
          // Extract just region names from visitKey format "region|crystalState"
          regionsReachableWithoutDeferredDoor = new Set(
            Array.from(visited).map(visitKey => visitKey.split('|')[0])
          );
          
          // Only for the FIRST door iteration, track regions reachable with 0 doors
          // These are the only regions that should have maxKeysUsed = minKeysUsed = 0
          if (regionsReachableBeforeAnyDoor.size === 0 && keysUsed === 0) {
            for (const region of regionsReachableWithoutDeferredDoor) {
              regionsReachableBeforeAnyDoor.add(region);
            }
          }
          
          this.debugLog(`  🚪 Will defer door ${pendingKeyDoor} in ${deferredExit.to} to end of queue, keysUsed=${keysUsed}, regionsBeforeDoor=${regionsReachableWithoutDeferredDoor.size}`);
          
          // Clear visited for target so we can process it again
          visited.delete(`${deferredExit.to}|blue`);
          visited.delete(`${deferredExit.to}|orange`);
          
          exitQueue.enqueue(deferredExit);
        }
      }
    }
    
    // After all BFS iterations, initialize maxKeysUsed = minKeysUsed for regions that 
    // were reachable from entry without ANY doors (keysUsed = 0 when first door was deferred).
    // These are the only regions whose maxKeysUsed is guaranteed to equal minKeysUsed.
    this.debugLog(`Regions reachable before any door: ${regionsReachableBeforeAnyDoor.size}`);
    for (const region of regionsReachableBeforeAnyDoor) {
      const minKeys = ctx.regionMinKeysUsed.get(region);
      if (minKeys !== undefined && !ctx.regionMaxKeysUsed.has(region)) {
        ctx.regionMaxKeysUsed.set(region, minKeys);
        this.debugLog(`  📊 Initializing maxKeysUsed for ${region}: ${minKeys} (no doors needed)`);
      }
    }
  }

  private finalBFS(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>, entryStatus: Map<string, LogicStatus>, inventoryKeys: number, keyCountingEvaluator: RequirementEvaluator) {
    // Phase 1: Discover all traversable regions (ignoring key counts)
    // Phase 2: Fixed-point iteration to count accessible keys
    // Phase 3: Compute final status based on total keys available
    // In partial mode, use keyCountingEvaluator for discovery (assumes all items)
    // so key contention logic applies even to regions the player can't currently reach.

    // === PHASE 1: Discovery ===
    const visited = new Set<string>();
    const queue: Array<{ region: string; crystalState: CrystalSwitchState; fromEntryStatus: LogicStatus }> = [];
    
    // Track the best entry status that can reach each region
    // This is used to propagate "unavailable" from unreachable portals
    const regionEntryStatus = new Map<string, LogicStatus>();

    for (const [regionName, { bunnyState }] of entryRegions) {
      const thisEntryStatus = entryStatus.get(regionName) ?? "available";
      queue.push({ region: regionName, crystalState: "orange", fromEntryStatus: thisEntryStatus });
      ctx.reachable.set(regionName, {
        status: "available", // Placeholder, will be updated in Phase 3
        bunnyState,
        crystalStates: new Set(["orange"]),
      });
      // Use the best status if this region is also another entry portal
      const currentStatus = regionEntryStatus.get(regionName);
      if (!currentStatus || isBetterStatus(thisEntryStatus, currentStatus)) {
        regionEntryStatus.set(regionName, thisEntryStatus);
      }
    }

    // Phase 1: Explore all traversable regions (assuming unlimited keys for traversal)
    while (queue.length > 0) {
      const { region, crystalState, fromEntryStatus: queuedEntryStatus } = queue.shift()!;
      
      // Use the CURRENT entry status of this region, not the stale one from when it was queued
      // This ensures we propagate upgrades correctly
      const currentRegionEntryStatus = regionEntryStatus.get(region) ?? queuedEntryStatus;
      
      const visitKey = `${region}|${crystalState}|${currentRegionEntryStatus}`;
      if (visited.has(visitKey)) continue;
      visited.add(visitKey);
      
      this.debugLogVerbose(`Visiting region: ${region}, crystalState: ${crystalState}, entryStatus: ${currentRegionEntryStatus}`);

      const regionState = ctx.reachable.get(region);
      const regionLogic = this.regions[region];
      if (!regionLogic) {
        this.debugLogVerbose(`  No region logic for ${region}`);
        continue;
      }

      if (regionLogic.exits) {
        for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
          if (!exit.to || DungeonTraverser.OVERWORLD_TYPES.has(this.regions[exit.to]?.type || "")) continue;

          const isSKDoor = this.requiresSmallKey(exit);

          // Evaluate exit requirements (ignore small key requirement for key doors)
          // Use keyCountingEvaluator so in partial mode we discover all regions
          const requirementStatus = keyCountingEvaluator.evaluateWorldLogic(exit.requirements, {
            regionName: region,
            dungeonId: this.dungeonId,
            crystalStates: new Set([crystalState]),
            isBunny: regionState?.bunnyState ?? false,
            assumeSmallKey: isSKDoor,
            canReachRegion: (targetRegion: string) => {
              const targetRegionLogic = this.regions[targetRegion];
              if (targetRegionLogic?.type === "Dungeon") {
                return "available"; // Assume dungeon regions reachable
              }
              // For overworld, use callback or assume reachable
              return this.canReachOverworldRegion?.(targetRegion) ?? "available";
            },
          });
          
          this.debugLogVerbose(`  Exit ${exitName} -> ${exit.to}: isSKDoor=${isSKDoor}, status=${requirementStatus}`);

          if (requirementStatus === "unavailable") continue;

          // Add to reachable if not already there
          if (!ctx.reachable.has(exit.to)) {
            const bunnyState = regionState?.bunnyState ?? false;
            ctx.reachable.set(exit.to, {
              status: "available", // Placeholder
              bunnyState,
              crystalStates: new Set([crystalState]),
            });
            regionEntryStatus.set(exit.to, currentRegionEntryStatus);
            queue.push({ region: exit.to, crystalState, fromEntryStatus: currentRegionEntryStatus });
          } else {
            // Update crystal states if we've reached from a different crystal state
            const existing = ctx.reachable.get(exit.to)!;
            if (!existing.crystalStates.has(crystalState)) {
              existing.crystalStates.add(crystalState);
              queue.push({ region: exit.to, crystalState, fromEntryStatus: currentRegionEntryStatus });
            }
          }
          
          // Always update entry status if we found a better (more available) path
          // This is separate from the reachability check above
          const currentEntryStatus = regionEntryStatus.get(exit.to);
          if (currentEntryStatus && isBetterStatus(currentRegionEntryStatus, currentEntryStatus)) {
            this.debugLog(`  UPGRADING ${exit.to} from ${currentEntryStatus} to ${currentRegionEntryStatus}`);
            regionEntryStatus.set(exit.to, currentRegionEntryStatus);
            // Re-add to queue so the upgrade propagates to children
            queue.push({ region: exit.to, crystalState, fromEntryStatus: currentRegionEntryStatus });
          }
        }
      }

      // Handle crystal switches
      if (this.hasCrystalSwitch(region)) {
        if (this.canHitCrystalSwitch(region, { 
            regionName: region, 
            dungeonId: this.dungeonId, 
            crystalStates: new Set([crystalState]), 
            isBunny: regionState?.bunnyState ?? false 
        })) {
          const newCrystalState = this.toggleCrystalState(crystalState);
          queue.push({ region, crystalState: newCrystalState, fromEntryStatus: currentRegionEntryStatus });
        }
      }
    }

    // === PHASE 2: Fixed-point iteration to count accessible keys ===
    // We can only count keys in regions where minKeysUsed <= keysCurrentlyAvailable
    // Track keys by their minKeysUsed threshold so we can determine which keys
    // are available BEFORE reaching a particular region
    const keysByThreshold = new Map<number, Set<string>>();
    
    ctx.totalKeysAvailable = inventoryKeys;
    let keysChanged = true;
    
    while (keysChanged) {
      keysChanged = false;
      for (const [regionName] of ctx.reachable) {
        // Skip regions that Dijkstra couldn't reach (no minKeysUsed entry)
        // These regions have requirements that couldn't be satisfied
        if (!ctx.regionMinKeysUsed.has(regionName)) continue;
        
        const minKeysUsed = ctx.regionMinKeysUsed.get(regionName)!;
        
        // Can we access this region with current keys?
        if (ctx.totalKeysAvailable >= minKeysUsed) {
          // Discover keys in this region
          for (const keyLoc of this.smallKeysInRegion(regionName)) {
            if (!ctx.discoveredKeyLocations.has(keyLoc)) {
              ctx.discoveredKeyLocations.add(keyLoc);
              ctx.totalKeysAvailable++;
              keysChanged = true;
              
              // Track which threshold this key is at
              if (!keysByThreshold.has(minKeysUsed)) {
                keysByThreshold.set(minKeysUsed, new Set());
              }
              keysByThreshold.get(minKeysUsed)!.add(keyLoc);
              
              this.debugLog(`  🔑 Discovered key: ${keyLoc} at minKeysUsed=${minKeysUsed}`);
            }
          }
        }
      }
    }
    
    this.debugLog(`Keys by threshold:`, Array.from(keysByThreshold.entries()).map(([k, v]) => `${k}: ${v.size}`));
    this.debugLog(`Region entry statuses:`, Array.from(regionEntryStatus.entries()));

    // === PHASE 3: Compute final status for each region ===
    // Now we know the total keys available, compute status for each reachable region
    const isWildKeys = this.state.settings.wildSmallKeys === "wild";
    
    // Build a map of key location -> region name for checking gating
    const keyToRegion = new Map<string, string>();
    for (const [regionName] of ctx.reachable) {
      for (const keyLoc of this.smallKeysInRegion(regionName)) {
        keyToRegion.set(keyLoc, regionName);
      }
    }
    
    // Pre-compute pottery mode values once (not per-region)
    const isPotteryKeyMode = this.state.settings.pottery === "keys" && this.state.settings.keyDrop === true;
    const estimatedUniqueDoors = Math.ceil(ctx.pendingKeyDoors.length / 2);
    
    // Calculate doorsAtThreshold0 once - indicates if dungeon has branching paths from start
    let doorsAtThreshold0 = 0;
    if (isPotteryKeyMode) {
      const seenDoorPairs = new Set<string>();
      for (const doorName of ctx.pendingKeyDoors) {
        const sourceRegion = this.findDoorSourceRegion(doorName);
        if (!sourceRegion) continue;
        
        const sourceMinKeys = ctx.regionMinKeysUsed.get(sourceRegion);
        if (sourceMinKeys === 0 || sourceMinKeys === undefined) {
          const reverseDoor = this.findReverseDoor(doorName, ctx.pendingKeyDoors);
          if (reverseDoor && seenDoorPairs.has(reverseDoor)) {
            continue;
          }
          seenDoorPairs.add(doorName);
          doorsAtThreshold0++;
        }
      }
    }
    
    for (const [regionName, regionState] of ctx.reachable) {
      // Calculate key-based status
      let keyStatus: LogicStatus = "available";
      
      // Only apply key-based status logic when wild small keys is enabled
      if (isWildKeys) {
        // If Dijkstra couldn't reach this region, mark as unavailable
        // This means some requirement couldn't be satisfied
        if (!ctx.regionMinKeysUsed.has(regionName)) {
          keyStatus = "unavailable";
        } else {
          const minKeysUsed = ctx.regionMinKeysUsed.get(regionName)!;
          const maxKeysUsed = ctx.regionMaxKeysUsed.get(regionName);
          
          // Count keys collectible BEFORE reaching this region (not downstream or on different branch)
          let keysAvailableBeforeRegion = inventoryKeys;
          const effectiveMaxKeys = maxKeysUsed ?? minKeysUsed;
          
          for (const [threshold, keys] of keysByThreshold) {
            for (const keyLoc of keys) {
              const keyRegion = keyToRegion.get(keyLoc);
              if (keyRegion) {
                const keyMinKeys = ctx.regionMinKeysUsed.get(keyRegion) ?? 0;
                
                // Downstream: need >= maxKeysUsed to reach key, or gated without backtrack
                const isDownstreamByThreshold = keyMinKeys >= effectiveMaxKeys;
                const isGatedByTarget = !isDownstreamByThreshold && 
                                        this.isRegionGatedBy(keyRegion, regionName, ctx) &&
                                        !this.canReachEntryFromRegion(keyRegion, ctx);
                const isDownstream = isDownstreamByThreshold || isGatedByTarget;
                
                // Different branch: same threshold but requires different door commitment
                const isOnDifferentBranch = !isDownstream && this.isKeyOnDifferentBranch(keyRegion, regionName, ctx);
                
                if ((regionName.startsWith("GT ") && maxKeysUsed && maxKeysUsed >= 7) || regionName === "Desert Compass Room" || regionName.includes("Firesnake") || regionName === "Swamp Hub") {
                  this.debugLog(`  🔐 Key ${keyLoc} in region ${keyRegion} (threshold ${threshold}, keyMinKeys=${keyMinKeys}, effectiveMaxKeys=${effectiveMaxKeys}): isDownstreamByThreshold=${isDownstreamByThreshold}, isGatedByTarget=${isGatedByTarget}, isOnDifferentBranch=${isOnDifferentBranch}`);
                }
                
                if (!isDownstream && !isOnDifferentBranch) {
                  keysAvailableBeforeRegion++;
                }
              }
            }
          }
          
          // Check if we have enough keys for worst-case path
          if (ctx.totalKeysAvailable < minKeysUsed) {
            keyStatus = "unavailable";
          } else if (maxKeysUsed !== undefined && maxKeysUsed > 0) {
            // Debug logging for specific regions
            if ((regionName.startsWith("GT ") && maxKeysUsed >= 7) || regionName === "Desert Compass Room" || regionName === "Swamp Hub") {
              this.debugLog(`  📊 ${regionName}: minKeys=${minKeysUsed}, maxKeys=${maxKeysUsed}, keysAvailableBefore=${keysAvailableBeforeRegion}, result=${keysAvailableBeforeRegion >= maxKeysUsed ? "available" : "possible"}`);
            }
            
            if (keysAvailableBeforeRegion >= maxKeysUsed) {
              // Enough keys for worst-case path. In pottery mode with branching dungeons,
              // check if player has enough keys to cover all door choices.
              if (isPotteryKeyMode && doorsAtThreshold0 > 1 && ctx.totalKeysAvailable < estimatedUniqueDoors - 1) {
                keyStatus = "possible";
              } else {
                keyStatus = "available";
              }
            } else {
              keyStatus = "possible";
            }
          }
        }
      }
      
      if (regionName === "GT Compass Room") {
        this.debugLog(`  🏁 Final keyStatus for GT Compass Room: ${keyStatus}`);
      }

      // Get the best entry status for this region (propagated from entry portal)
      const entryRegionStatus = regionEntryStatus.get(regionName) ?? "available";

      // Final status is the combination of entry status and key status
      regionState.status = this.combineStatuses(entryRegionStatus, keyStatus);
    }
  }

  private initializeDungeonContext(
    entryRegions: Map<string, { bunnyState: boolean }>, 
    inventoryKeys: number,
    entryKeyCost: Map<string, number> = new Map()
  ): DungeonContext {
    const ctx: DungeonContext = {
      reachable: new Map<string, DungeonRegionState>(),
      queue: [],
      pendingKeyDoors: [],
      regionMaxKeysUsed: new Map<string, number>(),
      regionMinKeysUsed: new Map<string, number>(),
      discoveredKeyLocations: new Set<string>(),
      totalKeysAvailable: inventoryKeys,
    };

    const initialCrystalState: CrystalSwitchState = "orange";
    for (const [regionName, { bunnyState }] of entryRegions) {
      const initialState: DungeonRegionState = {
        status: "available",
        bunnyState,
        crystalStates: new Set([initialCrystalState]),
      };
      ctx.reachable.set(regionName, initialState);
      // Set the initial minKeysUsed to the key cost of reaching this portal
      // Portals reached via dungeon exits have a key cost > 0
      const keyCost = entryKeyCost.get(regionName) ?? 0;
      ctx.regionMinKeysUsed.set(regionName, keyCost);
      ctx.regionMaxKeysUsed.set(regionName, keyCost);
    }
    return ctx;
  }

  /**
   * Check if keyRegion is only reachable by going through gateRegion.
   * Uses BFS from entry regions (minKeysUsed=0), excluding gateRegion.
   */
  private isRegionGatedBy(keyRegion: string, gateRegion: string, ctx: DungeonContext): boolean {
    // If they're the same region, it's trivially gated
    if (keyRegion === gateRegion) return true;
    
    // BFS from all entry regions (regions with minKeysUsed=0), excluding gateRegion
    const visited = new Set<string>();
    const queue: string[] = [];
    
    // Start from all regions with minKeysUsed=0 (entry-level regions)
    for (const [regionName] of ctx.regionMinKeysUsed) {
      const minKeys = ctx.regionMinKeysUsed.get(regionName);
      if (minKeys === 0 && regionName !== gateRegion) {
        queue.push(regionName);
        visited.add(regionName);
      }
    }
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Found keyRegion without going through gateRegion
      if (current === keyRegion) return false;
      
      const regionLogic = this.regions[current];
      if (!regionLogic?.exits) continue;
      
      for (const exit of Object.values(regionLogic.exits)) {
        if (!exit.to) continue;
        if (exit.to === gateRegion) continue; // Skip the gate region
        if (visited.has(exit.to)) continue;
        if (!ctx.reachable.has(exit.to)) continue; // Only consider reachable regions
        
        visited.add(exit.to);
        queue.push(exit.to);
      }
    }
    
    // Couldn't reach keyRegion without going through gateRegion
    return true;
  }

    /**
   * Check if key is on a branch that requires committing to a different door than the target.
   * For example, a key only reachable via a one-way warp that doesn't lead to the target.
   */
  private isKeyOnDifferentBranch(keyRegion: string, targetRegion: string, ctx: DungeonContext): boolean {
    if (keyRegion === targetRegion) return false;
    
    const targetMinKeys = ctx.regionMinKeysUsed.get(targetRegion) ?? 0;
    const keyMinKeys = ctx.regionMinKeysUsed.get(keyRegion) ?? 0;
    
    // If key is at threshold 0, it's always accessible
    if (keyMinKeys === 0) return false;
    
    // If target is at threshold 0, all keys are accessible (no key commitment yet)
    if (targetMinKeys === 0) return false;
    
    // Find regions that GATE the key (the key is ONLY reachable via that region)
    // We only care about gating regions at threshold >= 1 because those require
    // a key commitment. Threshold 0 regions are always accessible.
    for (const [regionName] of ctx.regionMinKeysUsed) {
      const regionMinKeys = ctx.regionMinKeysUsed.get(regionName) ?? 0;
      
      // Only consider gating regions at threshold >= 1
      // Threshold 0 regions don't create "different branches" because
      // they're always accessible without committing keys
      if (regionMinKeys < 1) continue;
      
      // Only consider gating regions at the SAME threshold as the target.
      // If the target is at a higher threshold, you'd have to use more keys anyway,
      // and you could potentially visit the key's branch on the way.
      if (regionMinKeys !== targetMinKeys) continue;
      
      // Skip if it's the target region itself
      if (regionName === targetRegion) continue;
      
      // Skip if it's the key region itself
      if (regionName === keyRegion) continue;
      
      // Check if keyRegion is ONLY reachable via regionName (i.e., gated by regionName)
      if (this.isRegionGatedBy(keyRegion, regionName, ctx)) {
        // keyRegion is gated by regionName
        // Now check if the target is ALSO gated by this region, or if this region
        // is on our path to the target. If the target is also gated by this region,
        // then we pass through this region to reach the target anyway.
        const isTargetAlsoGated = this.isRegionGatedBy(targetRegion, regionName, ctx);
        if (!isTargetAlsoGated) {
          // Target is NOT gated by this region
          // But before marking as different branch, check if we can get BACK from the key region
          // to entry without using additional keys. If we can, then we can get the key
          // and still have all options available.
          const canBacktrack = this.canReachEntryFromRegion(keyRegion, ctx);
          if (!canBacktrack) {
            // Can't backtrack, so this is a one-way commitment. Key is on different branch.
            this.debugLog(`    🌿 Key in ${keyRegion} is GATED by ${regionName} (threshold ${regionMinKeys}) which is on different branch from ${targetRegion} (no backtrack)`);
            return true;
          }
          // Can backtrack, so even though it's on a different branch, we can get the key and return
        }
      }
    }
    
    return false;
  }

  /**
   * Check if we can return from keyRegion to an entry region (threshold 0)
   * without using additional keys. Regions with no exits can save&quit, so return true.
   */
  private canReachEntryFromRegion(keyRegion: string, ctx: DungeonContext): boolean {
    const keyMinKeys = ctx.regionMinKeysUsed.get(keyRegion) ?? 0;
    
    // If keyRegion has no exits, consider it "can backtrack" (via save&quit)
    const keyRegionLogic = this.regions[keyRegion];
    if (!keyRegionLogic?.exits || Object.keys(keyRegionLogic.exits).length === 0) {
      return true;
    }
    
    // BFS from keyRegion, following exits that don't require additional keys
    const visited = new Set<string>();
    const queue: string[] = [keyRegion];
    visited.add(keyRegion);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentMinKeys = ctx.regionMinKeysUsed.get(current) ?? 0;
      
      // If we reached a threshold 0 region, we can backtrack to entry
      if (currentMinKeys === 0) return true;
      
      const regionLogic = this.regions[current];
      if (!regionLogic?.exits) continue;
      
      for (const exit of Object.values(regionLogic.exits)) {
        if (!exit.to) continue;
        if (visited.has(exit.to)) continue;
        if (!ctx.reachable.has(exit.to)) continue;
        
        const exitMinKeys = ctx.regionMinKeysUsed.get(exit.to) ?? 0;
        
        // Only follow exits that don't require more keys than we already used
        // (i.e., going to regions at same or lower threshold)
        if (exitMinKeys <= keyMinKeys) {
          visited.add(exit.to);
          queue.push(exit.to);
        }
      }
    }
    
    // Couldn't reach an entry region without using more keys
    return false;
  }

  private propagateMaxKeysThroughCanReach(ctx: DungeonContext): void {
    // Propagate elevated maxKeysUsed through canReach dependencies and to children.
    // If region A requires canReach|B, A's maxKeysUsed should be >= B's maxKeysUsed.
    let changed = true;
    let iterations = 0;
    const maxIterations = 20;
    
    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;
      
      // Phase 1: Propagate through canReach dependencies
      for (const [regionName] of ctx.regionMinKeysUsed) {
        const regionLogic = this.regions[regionName];
        if (!regionLogic?.exits) continue;
        
        for (const exit of Object.values(regionLogic.exits)) {
          if (!exit.to || !this.regions[exit.to]) continue;
          if (this.regions[exit.to]?.type !== "Dungeon") continue;
          
          // Find canReach dependencies
          const canReachTargets = this.findCanReachTargets(exit.requirements as unknown as Record<string, unknown>);
          
          for (const target of canReachTargets) {
            const targetMaxKeys = ctx.regionMaxKeysUsed.get(target);
            const targetMinKeys = ctx.regionMinKeysUsed.get(target);
            
            // Only propagate if the target has elevated maxKeysUsed
            if (targetMaxKeys === undefined) continue;
            if (targetMinKeys !== undefined && targetMaxKeys <= targetMinKeys) continue;
            
            // The exit.to region should have maxKeysUsed >= targetMaxKeys
            const currentMaxKeys = ctx.regionMaxKeysUsed.get(exit.to);
            if (currentMaxKeys === undefined || targetMaxKeys > currentMaxKeys) {
              ctx.regionMaxKeysUsed.set(exit.to, targetMaxKeys);
              this.debugLog(`  📊 Propagating maxKeysUsed: ${exit.to} set to ${targetMaxKeys} (from canReach|${target})`);
              changed = true;
            }
          }
        }
      }
      
      // Phase 2: Propagate to children of regions with elevated maxKeysUsed
      // If parent has elevated maxKeysUsed and leads to a child that:
      // 1. Has minKeysUsed >= parent's minKeysUsed (child is not reachable via an earlier path)
      // Then update child's maxKeysUsed
      for (const [regionName] of ctx.regionMinKeysUsed) {
        const regionMaxKeys = ctx.regionMaxKeysUsed.get(regionName);
        const regionMinKeys = ctx.regionMinKeysUsed.get(regionName);
        
        // Only propagate if this region has elevated maxKeysUsed
        if (regionMaxKeys === undefined) continue;
        if (regionMinKeys !== undefined && regionMaxKeys <= regionMinKeys) continue;
        
        const regionLogic = this.regions[regionName];
        if (!regionLogic?.exits) continue;
        
        for (const exit of Object.values(regionLogic.exits)) {
          if (!exit.to || !this.regions[exit.to]) continue;
          if (this.regions[exit.to]?.type !== "Dungeon") continue;
          
          const childMinKeys = ctx.regionMinKeysUsed.get(exit.to);
          const childMaxKeys = ctx.regionMaxKeysUsed.get(exit.to);
          
          // Only propagate if:
          // 1. Child's minKeys >= parent's minKeys (child is not reachable via an earlier path)
          // 2. Child doesn't already have a maxKeysUsed value set by BFS
          //    (if BFS set it, that represents an alternative path we should respect)
          // The BFS-set value represents the minimum of worst-case paths, so don't overwrite it
          if (childMinKeys !== undefined && regionMinKeys !== undefined && childMinKeys >= regionMinKeys) {
            // Only set if child has NO maxKeysUsed yet
            // If BFS already found a path with a certain maxKeys, respect that
            if (childMaxKeys === undefined) {
              ctx.regionMaxKeysUsed.set(exit.to, regionMaxKeys);
              this.debugLog(`  📊 Propagating maxKeysUsed: ${exit.to} set to ${regionMaxKeys} (from parent ${regionName})`);
              changed = true;
            }
          }
        }
      }
    }
    
    if (iterations > 1) {
      this.debugLog(`maxKeysUsed propagation completed in ${iterations} iterations`);
    }
  }

  private findCanReachTargets(requirements: Record<string, unknown>): string[] {
    // Recursively find all canReach|X targets in the requirements
    const targets: string[] = [];
    
    const search = (obj: unknown): void => {
      if (typeof obj === 'string') {
        if (obj.startsWith('canReach|')) {
          targets.push(obj.slice('canReach|'.length));
        }
      } else if (Array.isArray(obj)) {
        for (const item of obj) {
          search(item);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const value of Object.values(obj)) {
          search(value);
        }
      }
    };
    
    search(requirements);
    return targets;
  }

  private getDoorPairKey(from: string, to: string): string {
    return from < to ? `${from}|${to}` : `${to}|${from}`;
  }

  private requiresSmallKey(exit: ExitLogic[string]): boolean {
    const reqs = getLogicStateForWorld(this.state, exit.requirements);
    return this.containsSmallKey(reqs);
  }

  private requiresBigKey(exit: ExitLogic[string]): boolean {
    const reqs = getLogicStateForWorld(this.state, exit.requirements);
    return this.containsBigKey(reqs);
  }

  /**
   * Check if a small key door is paired with a big key door on the opposite side.
   * When the big key opens one side, the small key door opens automatically.
   */
  private isSmallKeyDoorPairedWithBigKey(fromRegion: string, toRegion: string): boolean {
    // Check if there's an exit from toRegion back to fromRegion that requires a big key
    const targetRegionLogic = this.regions[toRegion];
    if (!targetRegionLogic?.exits) return false;
    
    for (const exit of Object.values(targetRegionLogic.exits)) {
      if (exit.to === fromRegion && this.requiresBigKey(exit)) {
        return true;
      }
    }
    return false;
  }

  private containsSmallKey(req: LogicState | string | undefined): boolean {
    if (!req) return false;
    if (req === "smallkey") return true;
    if (typeof req === "object" && req !== null) {
      const r = req as Record<string, unknown>;
      if (r.always && this.containsSmallKey(r.always)) return true;
      if (r.logical && this.containsSmallKey(r.logical)) return true;
      if (r.allOf && Array.isArray(r.allOf)) return r.allOf.some((x) => this.containsSmallKey(x));
      if (r.anyOf && Array.isArray(r.anyOf)) return r.anyOf.some((x) => this.containsSmallKey(x));
    }
    return false;
  }

  private containsBigKey(req: LogicState | string | undefined): boolean {
    if (!req) return false;
    if (req === "bigkey") return true;
    if (typeof req === "object" && req !== null) {
      const r = req as Record<string, unknown>;
      if (r.always && this.containsBigKey(r.always)) return true;
      if (r.logical && this.containsBigKey(r.logical)) return true;
      if (r.allOf && Array.isArray(r.allOf)) return r.allOf.some((x) => this.containsBigKey(x));
      if (r.anyOf && Array.isArray(r.anyOf)) return r.anyOf.some((x) => this.containsBigKey(x));
    }
    return false;
  }

  private smallKeysInRegion(regionName: string): string[] {
    const region = this.regions[regionName];
    if (!region) return [];
    const locationKeys: string[] = [];
    for (const [locationName, location] of Object.entries(region.locations)) {
      if (this.isKeyLocation(locationName)) {
        const status = this.requirementEvaluator.evaluateWorldLogic(location.requirements, {
          regionName,
          dungeonId: this.dungeonId,
          crystalStates: new Set<CrystalSwitchState>(),
          isBunny: false,
        });
        if (status === "available" || status === "possible") {
          locationKeys.push(locationName);
        }
      }
    }
    return locationKeys;
  }

  private isKeyLocation(name: string): boolean {
    const pottery = this.state.settings.pottery;
    const drops = this.state.settings.keyDrop;
    if (name.endsWith("Pot Key") || name.includes("Hammer Block Key Drop")) {
      return !(pottery === "keys" || pottery === "cavekeys");
    }
    if (name.includes("Key Drop") && !name.includes("Hammer Block Key Drop")) {
      return !drops;
    }
    return false;
  }

  private toggleCrystalState(state: CrystalSwitchState): CrystalSwitchState {
    if (state === "orange") return "blue";
    if (state === "blue") return "orange";
    return "unknown";
  }

  private hasCrystalSwitch(regionName: string): boolean {
    const region = this.regions[regionName];
    return region?.locations?.["Crystal_Switch"] !== undefined;
  }

  private canHitCrystalSwitch(regionName: string, ctx: EvaluationContext): boolean {
    const region = this.regions[regionName];
    const switchLoc = region?.locations?.["Crystal_Switch"];
    if (!switchLoc) return false;
    const status = this.requirementEvaluator.evaluateWorldLogic(switchLoc.requirements, ctx);
    return status === "available" || status === "possible";
  }

  private combineStatuses(status1: LogicStatus, status2: LogicStatus): LogicStatus {
    const order: LogicStatus[] = ["information", "unavailable", "possible", "ool", "available"];
    return order[Math.min(order.indexOf(status1), order.indexOf(status2))];
  }

  /** Find the source region of a door exit using cached lookup (built lazily). */
  private findDoorSourceRegion(doorExitName: string): string | undefined {
    // Build cache on first access
    if (!this.exitToSourceRegion) {
      this.exitToSourceRegion = new Map();
      for (const [regionName, regionLogic] of Object.entries(this.regions)) {
        if (regionLogic.exits) {
          for (const exitName of Object.keys(regionLogic.exits)) {
            this.exitToSourceRegion.set(exitName, regionName);
          }
        }
      }
    }
    return this.exitToSourceRegion.get(doorExitName);
  }

  /** Find the reverse direction of a bidirectional key door based on naming patterns. */
  private findReverseDoor(doorName: string, pendingDoors: string[]): string | undefined {
    // Try to find a matching bidirectional door by checking if another door leads to the source region
    // This is a heuristic based on door naming patterns
    for (const otherDoor of pendingDoors) {
      if (otherDoor === doorName) continue;
      // Check if the doors share the same "Interior" or similar naming that indicates bidirectionality
      if (doorName.includes("Interior") && otherDoor.includes("Interior") &&
          doorName.replace(/ [NSEW]+$/, "") === otherDoor.replace(/ [NSEW]+$/, "")) {
        return otherDoor;
      }
    }
    return undefined;
  }
}
