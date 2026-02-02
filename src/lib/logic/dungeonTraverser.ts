import { type CrystalSwitchState, type ExitLogic, type GameState, type LogicState, type LogicStatus, type RegionLogic } from "@/data/logic/logicTypes";
import type { LogicSet } from "./logicMapper";
import { RequirementEvaluator, type EvaluationContext } from "./requirementEvaluator";
import { getLogicStateForWorld } from "./logicHelpers";
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
  private protection: "partial" | "dangerous";
  private canReachOverworldRegion?: (regionName: string) => LogicStatus;

  constructor(state: GameState, logicSet: LogicSet, dungeonId: string, protection: "partial" | "dangerous" = "partial") {
    this.state = state;
    this.regions = logicSet.regions as Record<string, RegionLogic>;
    this.dungeonId = dungeonId;
    this.protection = protection;

    this.requirementEvaluator = new RequirementEvaluator(state);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  private debugLog(..._args: any[]) {
    if (this.dungeonId === "gt" || this.dungeonId === "dp") {
      // console.log(`[DungeonTraverser - ${this.dungeonId}]`, ..._args);
    }
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
    const ctx = this.initializeDungeonContext(entryRegions, inventoryKeys, entryKeyCost);

    // Store the callback for use in finalBFS
    this.canReachOverworldRegion = canReachOverworldRegion;

    // Use actual inventory for ALL calculations to ensure consistency
    // Key counts should reflect paths that are actually traversable with current inventory
    this.requirementEvaluator = new RequirementEvaluator(this.state);

    if (this.state.settings.wildSmallKeys === "wild") {
      // Min keys per region using Dijkstra
      this.dijkstraMinKeys(ctx, entryRegions, entryKeyCost);
      
      this.debugLog(`Pending key doors for ${this.dungeonId}:`, ctx.pendingKeyDoors);
      
      // Run BFS to find max keys per region
      this.bfsMaxKeys(ctx, entryRegions, entryKeyCost);
      
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
    this.finalBFS(ctx, entryRegions, entryStatus, inventoryKeys);

    // Prepare results
    const externalExits = new Map<string, { to: string; status: LogicStatus; bunnyState: boolean; keysUsedToReach: number }>();
    for (const [regionName, regionState] of ctx.reachable) {
      const regionLogic = this.regions[regionName];
      const minKeysForRegion = ctx.regionMinKeysUsed.get(regionName) ?? 0;
      if (regionLogic && regionLogic.exits) {
        for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
          if (exit.to && ["LightWorld", "DarkWorld"].includes(this.regions[exit.to]?.type || "")) {
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

  private dijkstraMinKeys(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>, entryKeyCost: Map<string, number>) {
    // Run dijkstra with weight of 1 for small key doors to find minimum keys needed to reach each region - assume infinite keys
    // We run in a loop because canReach requirements may depend on regions discovered in the same pass
    let previousRegionCount = 0;
    let iterations = 0;
    const maxIterations = 10; // Safety limit
    
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
          if (!exit.to || ["LightWorld", "DarkWorld"].includes(targetType)) {
            this.debugLog(`  Exit ${exitName} skipped: to=${exit.to}, type=${targetType}`);
            continue;
          }

          const isSKDoor = this.requiresSmallKey(exit);
          // Check if this small key door is paired with a big key door on the other side
          // If so, it opens automatically when the big key door opens and shouldn't count
          const isPairedWithBigKey = isSKDoor && this.isSmallKeyDoorPairedWithBigKey(region, exit.to);
          const countsAsKeyDoor = isSKDoor && !isPairedWithBigKey;
          
          // Keep track of key doors for BFS in next pass (only real key-consuming doors)
          if (countsAsKeyDoor && !ctx.pendingKeyDoors.includes(exitName)) {
            ctx.pendingKeyDoors.push(exitName);
          }
          
          // Track the maximum minKeys from any canReach requirement
          // This is needed because canReach|X means you need to have reached X first
          let canReachKeyCost = 0;
          
          // Evaluate exit requirements, but assume small keys and big keys are available
          // so we can see all key doors in the dungeon for key counting
          const status = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, {
            regionName: region,
            dungeonId: this.dungeonId,
            crystalStates: new Set([crystalState]),
            isBunny: regionState?.bunnyState ?? false,
            assumeSmallKey: isSKDoor,
            assumeBigKey: true, // Ignore big key doors for key counting
            canReachRegion: (targetRegion: string) => {
              // For Dijkstra key counting, check if the target region has been discovered
              // We use ctx.regionMinKeysUsed which persists across iterations
              const targetRegionLogic = this.regions[targetRegion];
              if (targetRegionLogic?.type === "Dungeon") {
                // Check if we've discovered this region in any iteration
                const targetMinKeys = ctx.regionMinKeysUsed.get(targetRegion);
                if (targetMinKeys !== undefined) {
                  // Track the key cost to reach this canReach target
                  canReachKeyCost = Math.max(canReachKeyCost, targetMinKeys);
                  return "available";
                }
                // Also check if it's been visited in THIS iteration
                const visitedOrange = visited.has(`${targetRegion}|orange`);
                const visitedBlue = visited.has(`${targetRegion}|blue`);
                if (visitedOrange || visitedBlue) {
                  return "available";
                }
                // Not discovered yet - can't use in canReach requirements
                return "unavailable";
              }
              // For overworld regions, assume reachable (handled by overworld traverser)
              return "available";
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

  private bfsMaxKeys(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>, entryKeyCost: Map<string, number>) {
    // Run bfs with each key door at end of queue to find maximum keys needed to reach each region
    // We do not need to consider partial vs dangerous here since we are counting max keys
    // Start from entry regions
    this.debugLog(`BFS starting with ${ctx.pendingKeyDoors.length} pending key doors:`, ctx.pendingKeyDoors);
    for (const pendingKeyDoor of ctx.pendingKeyDoors) {
      // PriorityQueue stores exits. 
      // We explicitly include 'isKeyDoor' to handle counting upon dequeue/processing.
      interface ExitQueueItem {
        from: string;
        exitName: string;
        to: string;
        crystalState: CrystalSwitchState;
        priority: number;
        isKeyDoor: boolean;
        baseKeyCost: number;
      }
      
      const exitQueue = new PriorityQueue<ExitQueueItem>((a, b) => a.priority - b.priority);
      
      // For maxKeysUsed calculation, only start from primary entry portals (keyCost=0)
      // Secondary portals (keyCost > 0) are reached via dungeon exits, and their key cost
      // is already accounted for in the paths from primary portals
      for (const [regionName] of entryRegions) {
        const startKeyCost = entryKeyCost.get(regionName) ?? 0;
        if (startKeyCost > 0) continue; // Skip secondary portals for maxKeysUsed
        exitQueue.enqueue({ 
            from: "entry", 
            exitName: "entry", 
            to: regionName, 
            crystalState: "orange", 
            priority: startKeyCost, 
            isKeyDoor: false,
            baseKeyCost: startKeyCost
        });
      }
      // this.debugLog(`Processing door: ${pendingKeyDoor}`);

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
              if (!exit.to || ["LightWorld", "DarkWorld"].includes(this.regions[exit.to]?.type || "")) continue;
              const isSKDoor = this.requiresSmallKey(exit);
              // Check if this small key door is paired with a big key door
              const isPairedWithBigKey = isSKDoor && this.isSmallKeyDoorPairedWithBigKey(region, exit.to);
              const countsAsKeyDoor = isSKDoor && !isPairedWithBigKey;
              
              // Evaluate exit requirements with canReachRegion function
              // Assume big keys are available so we can see all key doors
              const status = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, {
                regionName: region,
                dungeonId: this.dungeonId,
                crystalStates: new Set([crystalState]),
                isBunny: regionState?.bunnyState ?? false,
                assumeSmallKey: isSKDoor,
                assumeBigKey: true, // Ignore big key doors for key counting
                canReachRegion: (targetRegion: string) => {
                  // For BFS, check if the target region has been visited in THIS iteration
                  // This ensures canReach requirements properly track door dependencies
                  const targetRegionLogic = this.regions[targetRegion];
                  if (targetRegionLogic?.type === "Dungeon") {
                    // Check if we've visited this region in THIS BFS iteration
                    const visitedOrange = visited.has(`${targetRegion}|orange`);
                    const visitedBlue = visited.has(`${targetRegion}|blue`);
                    if (visitedOrange || visitedBlue) {
                      return "available";
                    }
                    return "unavailable";
                  }
                  // For overworld regions, assume reachable
                  return "available";
                },
              });

              if (status !== "unavailable") {
                // Determine priority - put key doors at back by adding a cost
                const priority = countsAsKeyDoor ? keysUsed + 100 : keysUsed;
                exitQueue.enqueue({ from: region, exitName: nextExitName, to: exit.to, crystalState, priority, isKeyDoor: countsAsKeyDoor, baseKeyCost: 0 });
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
              exitQueue.enqueue({ from: region, exitName: "crystal_switch", to: region, crystalState: this.toggleCrystalState(crystalState), priority: keysUsed, isKeyDoor: false, baseKeyCost: 0 });
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
          
          this.debugLog(`  🚪 Will defer door ${pendingKeyDoor} in ${deferredExit.to} to end of queue, keysUsed=${keysUsed}, regionsBeforeDoor=${regionsReachableWithoutDeferredDoor.size}`);
          
          // Clear visited for target so we can process it again
          visited.delete(`${deferredExit.to}|blue`);
          visited.delete(`${deferredExit.to}|orange`);
          
          exitQueue.enqueue(deferredExit);
        }
      }
    }
  }

  private finalBFS(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>, entryStatus: Map<string, LogicStatus>, inventoryKeys: number) {
    // Three-phase approach:
    // Phase 1: BFS to discover all traversable regions (ignoring key counts but respecting other requirements)
    // Phase 2: Fixed-point iteration to count accessible keys
    // Phase 3: Compute final status based on total keys available

    // === PHASE 1: Discovery of traversable regions ===
    const visited = new Set<string>();
    const queue: Array<{ region: string; crystalState: CrystalSwitchState }> = [];

    for (const [regionName, { bunnyState }] of entryRegions) {
      queue.push({ region: regionName, crystalState: "orange" });
      ctx.reachable.set(regionName, {
        status: "available", // Placeholder, will be updated in Phase 3
        bunnyState,
        crystalStates: new Set(["orange"]),
      });
    }

    // Phase 1: Explore all traversable regions (assuming unlimited keys for traversal)
    while (queue.length > 0) {
      const { region, crystalState } = queue.shift()!;
      const visitKey = `${region}|${crystalState}`;
      if (visited.has(visitKey)) continue;
      visited.add(visitKey);
      
      this.debugLogVerbose(`Visiting region: ${region}, crystalState: ${crystalState}`);

      const regionState = ctx.reachable.get(region);
      const regionLogic = this.regions[region];
      if (!regionLogic) {
        this.debugLogVerbose(`  No region logic for ${region}`);
        continue;
      }

      if (regionLogic.exits) {
        for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
          if (!exit.to || ["LightWorld", "DarkWorld"].includes(this.regions[exit.to]?.type || "")) continue;

          const isSKDoor = this.requiresSmallKey(exit);

          // Evaluate requirement-based status for this exit (ignore small key requirement for key doors)
          // Provide canReachRegion for overworld dependencies (e.g., canReach|Dam)
          const requirementStatus = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, {
            regionName: region,
            dungeonId: this.dungeonId,
            crystalStates: new Set([crystalState]),
            isBunny: regionState?.bunnyState ?? false,
            assumeSmallKey: isSKDoor,
            canReachRegion: (targetRegion: string) => {
              // For dungeon regions we're exploring, assume reachable
              const targetRegionLogic = this.regions[targetRegion];
              if (targetRegionLogic?.type === "Dungeon") {
                return "available";
              }
              // For overworld regions, use the callback from overworld traverser
              if (this.canReachOverworldRegion) {
                return this.canReachOverworldRegion(targetRegion);
              }
              // If no callback, assume reachable (backwards compatibility)
              return "available";
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
            queue.push({ region: exit.to, crystalState });
          } else {
            // Update crystal states if we've reached from a different crystal state
            const existing = ctx.reachable.get(exit.to)!;
            if (!existing.crystalStates.has(crystalState)) {
              existing.crystalStates.add(crystalState);
              queue.push({ region: exit.to, crystalState });
            }
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
          queue.push({ region, crystalState: newCrystalState });
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
          
          // Calculate keys available BEFORE reaching this region
          // We count ALL dungeon keys EXCEPT those that are:
          // 1. DOWNSTREAM of this region (only reachable after passing through this region)
          // 2. On a different branch (gated by a region at the same threshold that's not on the path to target)
          let keysAvailableBeforeRegion = inventoryKeys;
          for (const [threshold, keys] of keysByThreshold) {
            for (const keyLoc of keys) {
              const keyRegion = keyToRegion.get(keyLoc);
              if (keyRegion) {
                const isDownstream = this.isKeyDownstreamOf(keyRegion, regionName, ctx);
                const isOnDifferentBranch = !isDownstream && this.isKeyOnDifferentBranch(keyRegion, regionName, ctx);
                
                if ((regionName.startsWith("GT ") && maxKeysUsed && maxKeysUsed >= 7) || regionName === "Desert Compass Room" || regionName.includes("Firesnake")) {
                  this.debugLog(`  🔐 Key ${keyLoc} in region ${keyRegion} (threshold ${threshold}): isDownstream=${isDownstream}, isOnDifferentBranch=${isOnDifferentBranch}`);
                }
                
                if (!isDownstream && !isOnDifferentBranch) {
                  keysAvailableBeforeRegion++;
                }
              }
            }
          }
          
          // First check: do we have enough keys to reach this region at all?
          if (ctx.totalKeysAvailable < minKeysUsed) {
            keyStatus = "unavailable";
          } else if (maxKeysUsed !== undefined && maxKeysUsed > 0) {
            // For maxKeysUsed comparison, use keys available BEFORE reaching this region
            // This correctly handles keys that are behind the target region
            if ((regionName.startsWith("GT ") && maxKeysUsed >= 7) || regionName === "Desert Compass Room") {
              this.debugLog(`  📊 ${regionName}: minKeys=${minKeysUsed}, maxKeys=${maxKeysUsed}, keysAvailableBefore=${keysAvailableBeforeRegion}, result=${keysAvailableBeforeRegion >= maxKeysUsed ? "available" : "possible"}`);
            }
            if (keysAvailableBeforeRegion >= maxKeysUsed) {
              keyStatus = "available";
            } else {
              keyStatus = "possible";
            }
          }
          // If no maxKeysUsed but we have enough min keys, it's available
        }
      }
      // When not in wild mode, keyStatus remains "available" as keys are assumed available
      
      if (regionName === "GT Compass Room") {
        this.debugLog(`  🏁 Final keyStatus for GT Compass Room: ${keyStatus}`);
      }

      // Get entry status if this is an entry region
      const entryRegionStatus = entryStatus.get(regionName);
      const baseStatus = entryRegionStatus ?? "available";

      // Final status is the combination of entry status and key status
      regionState.status = this.combineStatuses(baseStatus, keyStatus);
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
   * This is used to determine if a key at the same minKeysUsed level as a target region
   * is actually gated by that target region (and thus can't be used to reach it).
   * 
   * Uses a simple BFS from entry regions, excluding gateRegion, to see if keyRegion is reachable.
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
   * Check if keyRegion is reachable starting FROM targetRegion without going
   * back through lower-threshold regions. This determines if the key is
   * "downstream" of the target region.
   * 
   * A key is downstream if you can reach it after reaching the target region,
   * meaning it's on the same path (not a parallel branch).
   */
  private isKeyDownstreamOf(keyRegion: string, targetRegion: string, ctx: DungeonContext): boolean {
    // If they're the same region, it's downstream
    if (keyRegion === targetRegion) return true;
    
    const targetMinKeys = ctx.regionMinKeysUsed.get(targetRegion) ?? 0;
    
    // BFS from targetRegion, only following exits that don't go to lower-threshold regions
    const visited = new Set<string>();
    const queue: string[] = [targetRegion];
    visited.add(targetRegion);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current === keyRegion) return true;
      
      const regionLogic = this.regions[current];
      if (!regionLogic?.exits) continue;
      
      for (const exit of Object.values(regionLogic.exits)) {
        if (!exit.to) continue;
        if (visited.has(exit.to)) continue;
        if (!ctx.reachable.has(exit.to)) continue;
        
        // Only follow exits to regions at the same or higher threshold
        // This prevents going "back" to lower-threshold regions
        const exitMinKeys = ctx.regionMinKeysUsed.get(exit.to) ?? 0;
        if (exitMinKeys >= targetMinKeys) {
          visited.add(exit.to);
          queue.push(exit.to);
        }
      }
    }
    
    return false;
  }

  /**
   * Check if the key is on a different threshold-level branch from the target region.
   * This catches keys that are ONLY reachable via a specific region at threshold >= 1,
   * where that gating region is NOT on the path to the target.
   * 
   * For example, Conveyor Star Pits key is ONLY reachable via Compass Room (the warp).
   * If target is Firesnake Room, and Compass Room is not reachable from Firesnake Room
   * without going to lower thresholds, then the key is on a different branch.
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
   * Check if we can get from keyRegion back to an entry region (threshold 0)
   * without using additional keys beyond what's needed to reach keyRegion.
   * This detects if the key is on a one-way path (like a warp with no return).
   */
  private canReachEntryFromRegion(keyRegion: string, ctx: DungeonContext): boolean {
    const keyMinKeys = ctx.regionMinKeysUsed.get(keyRegion) ?? 0;
    
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
    // Propagate maxKeysUsed through canReach dependencies ONLY
    // If exit A->B requires canReach|C, and C has elevated maxKeysUsed (maxKeys > minKeys),
    // then B's maxKeysUsed should be at least C's maxKeysUsed
    //
    // We also need to propagate to direct children of regions with elevated maxKeysUsed
    // if those children also have elevated maxKeysUsed (meaning they were found by BFS)
    
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
          
          // Only propagate if child's minKeys >= parent's minKeys
          // This suggests child is not reachable via an earlier path
          if (childMinKeys !== undefined && regionMinKeys !== undefined && childMinKeys >= regionMinKeys) {
            if (childMaxKeys === undefined || regionMaxKeys > childMaxKeys) {
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
   * In ALTTP, some doors have a big key lock on one side and small key lock on the other.
   * When the big key door opens, the paired small key door opens automatically.
   * 
   * @param fromRegion The region the small key door is in
   * @param toRegion The region the small key door leads to
   * @returns true if the opposite side of this door requires a big key
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

  private isNever(req: LogicState | string | undefined): boolean {
    // "always": {
    //         "allOf": [
    //             "never"
    //         ]
    //     }
    // },
    if (!req) return false;
    if (req === "never") return true;
    if (typeof req === "object" && req !== null) {
      const r = req as Record<string, unknown>;
      if (r.always && this.isNever(r.always)) return true;
      if (r.allOf && Array.isArray(r.allOf)) return r.allOf.every((x) => this.isNever(x));
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
}
