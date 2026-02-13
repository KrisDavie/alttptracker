/**
 * DungeonTraverser - Computes reachability and key requirements for dungeon regions.
 *
 * OVERVIEW:
 * Determines which dungeon regions are reachable given the player's inventory (especially
 * small keys) and settings. Handles key doors, crystal switches, big key doors, and
 * inter-dungeon dependencies (canReach requirements).
 *
 * THREE-PHASE APPROACH (for wild small keys mode):
 *
 * 1. DIJKSTRA (minKeysUsed): Finds minimum keys to reach each region.
 *    - Key doors = weight-1 edges; iterates until convergence (canReach dependencies)
 *    - Up to 3 passes:
 *      (a) All-items with big key assumption (door discovery)
 *      (b) All-items without big key (accurate minKeysUsedNoBK, only when player lacks BK)
 *      (c) Actual-items inventory (detects paths through items player doesn't have)
 *    - Bidirectional door pairs tracked: a door opened from one side is free from the other
 *
 * 2. BFS (maxKeysUsed): Finds worst-case key cost per region.
 *    - Pre-computes adjacency graph once, then for each pending key door:
 *      defers that door, explores everything else, opens deferred door last
 *    - Regions found only after opening deferred door get elevated maxKeysUsed
 *    - Uses pre-computed reachability to prevent canReach from bypassing deferred doors
 *    - maxKeysUsed propagated through canReach dependencies and parent-child edges
 *
 * 3. FINAL BFS: Computes accessibility status per region.
 *    - Phase 1 (Discovery): BFS to find all traversable regions, tracking per-crystal-state
 *      entry statuses independently (orange vs blue). Uses keyCountingEvaluator in partial
 *      mode to discover regions even if player lacks items.
 *    - Phase 2 (Key counting): Fixed-point iteration counts accessible keys by threshold.
 *      Uses effectiveMinKeysMap (minKeysUsed or minKeysUsedNoBK based on BK ownership).
 *    - Phase 3 (Status computation): For each region, counts keys available before reaching
 *      it (excluding downstream keys and keys on different branches). Uses cached gating,
 *      backtrack, and branch queries for performance. Pottery mode checks for door contention
 *      in branching dungeons.
 *
 * KEY CONCEPTS:
 * - Protection modes: "partial" assumes full inventory for key counting (randomizer standard),
 *   "dangerous" uses actual player inventory throughout
 * - minKeysUsed: Optimal path cost; maxKeysUsed: Worst-case path cost
 * - Status: "unavailable" if not enough keys, "possible" if minKeysUsed <= keys < maxKeysUsed,
 *   "available" if keys >= maxKeysUsed
 * - Crystal switch state tracked per-region with per-crystal-state entry status in finalBFS
 * - Big key doors paired with small key doors don't consume keys
 * - Door pair tracking: bidirectional key doors canonically keyed as "regionA|regionB" (sorted)
 */

import { type CrystalSwitchState, type ExitLogic, type GameState, type LogicState, type LogicStatus, type RegionLogic } from "@/data/logic/logicTypes";
import type { LogicSet } from "./logicMapper";
import { RequirementEvaluator, type EvaluationContext } from "./requirementEvaluator";
import { getLogicStateForWorld, createAllItemsState, isBetterStatus, minimumStatus } from "./logicHelpers";
import { PriorityQueue } from "@datastructures-js/priority-queue";

export interface DungeonRegionState {
  status: LogicStatus;
  bunnyState: boolean;
  crystalStates: Set<CrystalSwitchState>;
}

export interface DungeonTraversalResult {
  regionStatuses: Map<string, DungeonRegionState>; // Internal region statuses
  externalExits: Map<string, { to: string; status: LogicStatus; bunnyState: boolean; keysUsedToReach: number }>; // Dungeon -> Overworld exits
  bigKeyGatedRegions: Set<string>; // Regions only reachable via big key doors
  smallKeyGatedRegions: Set<string>; // Regions only reachable via small key doors
}

interface DungeonContext {
  reachable: Map<string, DungeonRegionState>;
  queue: Array<{ region: string; crystalState: CrystalSwitchState; keysUsed: number }>;
  pendingKeyDoors: string[]; // Door identifiers
  regionMaxKeysUsed: Map<string, number>; // Region name -> max keys used to reach it
  regionMinKeysUsed: Map<string, number>; // Region name -> min keys used to reach it (assuming big key in partial mode)
  regionMinKeysUsedNoBK: Map<string, number>; // Region name -> min keys WITHOUT big key door paths
  regionMinKeysUsedActual: Map<string, number>; // Region name -> min keys with actual player inventory
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

  public traverse(
    entryRegions: Map<string, { bunnyState: boolean }>,
    entryStatus: Map<string, LogicStatus>,
    inventoryKeys: number,
    entryKeyCost: Map<string, number> = new Map(),
    canReachOverworldRegion?: (regionName: string) => LogicStatus,
  ): DungeonTraversalResult {
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
      // Min keys per region using Dijkstra (assumes big key in partial mode for door discovery)
      this.dijkstraMinKeys(ctx, entryRegions, entryKeyCost, keyCountingEvaluator, true);

      // If player doesn't have big key, run Dijkstra again WITHOUT big key assumption
      // to get accurate minKeysUsed for paths that don't require big key
      const actuallyHasBigKey = !this.state.settings.wildBigKeys || this.state.dungeons[this.dungeonId]?.bigKey;
      if (!actuallyHasBigKey && this.protection === "partial") {
        this.dijkstraMinKeys(ctx, entryRegions, entryKeyCost, keyCountingEvaluator, false);
      } else {
        // Player has big key, so minKeysUsedNoBK = minKeysUsed
        for (const [region, keys] of ctx.regionMinKeysUsed) {
          ctx.regionMinKeysUsedNoBK.set(region, keys);
        }
      }

      // Run BFS to find max keys per region
      this.bfsMaxKeys(ctx, entryRegions, entryKeyCost, keyCountingEvaluator);

      // Propagate maxKeysUsed through canReach dependencies
      // If region A requires canReach|B to reach it, and B has maxKeysUsed > A's minKeysUsed,
      // then A's maxKeysUsed should be at least B's maxKeysUsed
      this.propagateMaxKeysThroughCanReach(ctx);

      // In partial mode, the all-items Dijkstra may find paths through items the
      // player doesn't have (e.g., hookshot shortcut), assigning artificially low
      // minKeysUsed. Run a Dijkstra with actual items to get the real min keys,
      // then Phase 3 uses the max of both to ensure correct key accounting.
      if (this.protection === "partial") {
        const actualBigKey = !this.state.settings.wildBigKeys || this.state.dungeons[this.dungeonId]?.bigKey;
        this.dijkstraMinKeys(ctx, entryRegions, entryKeyCost, this.requirementEvaluator, actualBigKey, ctx.regionMinKeysUsedActual);
      }

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
    // Evaluate exit requirements to filter out exits that aren't traversable
    // (e.g., "Agahnims Tower Exit (Inverted)" is "never" in Open mode)
    const externalExits = new Map<string, { to: string; status: LogicStatus; bunnyState: boolean; keysUsedToReach: number }>();
    for (const [regionName, regionState] of ctx.reachable) {
      const regionLogic = this.regions[regionName];
      const minKeysForRegion = ctx.regionMinKeysUsed.get(regionName) ?? 0;
      if (regionLogic?.exits) {
        for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
          if (exit.to && DungeonTraverser.OVERWORLD_TYPES.has(this.regions[exit.to]?.type || "")) {
            const exitStatus = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, {
              regionName,
              dungeonId: this.dungeonId,
              isBunny: regionState.bunnyState,
              crystalStates: regionState.crystalStates,
              canReachRegion: (target: string) => {
                if (ctx.reachable.has(target)) return ctx.reachable.get(target)!.status;
                return canReachOverworldRegion?.(target) ?? "available";
              },
            });
            if (exitStatus === "unavailable") continue;
            externalExits.set(exitName, {
              to: exit.to,
              status: minimumStatus(regionState.status, exitStatus),
              bunnyState: regionState.bunnyState,
              keysUsedToReach: minKeysForRegion,
            });
          }
        }
      }
    }

    // Compute big-key-gated regions: BFS from entry regions without crossing BK doors
    const bigKeyGatedRegions = this.computeBigKeyGatedRegions(ctx, entryRegions);

    // Compute small-key-gated regions: BFS from entry regions without crossing SK doors
    const smallKeyGatedRegions = this.computeSmallKeyGatedRegions(ctx, entryRegions);

    return {
      regionStatuses: ctx.reachable,
      externalExits,
      bigKeyGatedRegions,
      smallKeyGatedRegions,
    };
  }

  /**
   * BFS from entry regions without crossing big key doors.
   * Returns the set of reachable regions that are ONLY reachable via big key doors.
   */
  private computeBigKeyGatedRegions(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>): Set<string> {
    const reachableWithoutBK = new Set<string>();
    const queue: string[] = [];

    for (const [regionName] of entryRegions) {
      if (ctx.reachable.has(regionName)) {
        reachableWithoutBK.add(regionName);
        queue.push(regionName);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      const regionLogic = this.regions[current];
      if (!regionLogic?.exits) continue;

      for (const [, exit] of Object.entries(regionLogic.exits)) {
        if (!exit.to) continue;
        // Skip overworld exits
        if (DungeonTraverser.OVERWORLD_TYPES.has(this.regions[exit.to]?.type || "")) continue;
        // Skip if not reachable by the main traversal
        if (!ctx.reachable.has(exit.to)) continue;
        // Skip if already visited
        if (reachableWithoutBK.has(exit.to)) continue;
        // Skip exits that require a big key
        if (this.requiresBigKey(exit)) continue;

        reachableWithoutBK.add(exit.to);
        queue.push(exit.to);
      }
    }

    // BK-gated = reachable by main traversal but NOT reachable without BK doors
    const bigKeyGated = new Set<string>();
    for (const regionName of ctx.reachable.keys()) {
      if (!reachableWithoutBK.has(regionName)) {
        bigKeyGated.add(regionName);
      }
    }
    return bigKeyGated;
  }

  /**
   * BFS from entry regions without crossing small key doors.
   * Returns the set of reachable regions that are ONLY reachable via small key doors.
   */
  private computeSmallKeyGatedRegions(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>): Set<string> {
    const reachableWithoutSK = new Set<string>();
    const queue: string[] = [];

    for (const [regionName] of entryRegions) {
      if (ctx.reachable.has(regionName)) {
        reachableWithoutSK.add(regionName);
        queue.push(regionName);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      const regionLogic = this.regions[current];
      if (!regionLogic?.exits) continue;

      for (const [, exit] of Object.entries(regionLogic.exits)) {
        if (!exit.to) continue;
        // Skip overworld exits
        if (DungeonTraverser.OVERWORLD_TYPES.has(this.regions[exit.to]?.type || "")) continue;
        // Skip if not reachable by the main traversal
        if (!ctx.reachable.has(exit.to)) continue;
        // Skip if already visited
        if (reachableWithoutSK.has(exit.to)) continue;
        // Skip exits that require a small key
        if (this.requiresSmallKey(exit)) continue;

        reachableWithoutSK.add(exit.to);
        queue.push(exit.to);
      }
    }

    // SK-gated = reachable by main traversal but NOT reachable without SK doors
    const smallKeyGated = new Set<string>();
    for (const regionName of ctx.reachable.keys()) {
      if (!reachableWithoutSK.has(regionName)) {
        smallKeyGated.add(regionName);
      }
    }
    return smallKeyGated;
  }

  private dijkstraMinKeys(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>, entryKeyCost: Map<string, number>, evaluator: RequirementEvaluator, assumeBigKey: boolean = true, targetMap?: Map<string, number>) {
    // Dijkstra with key doors as weight-1 edges. Iterates until convergence
    // because canReach requirements may depend on regions discovered in the same pass.
    //
    // When assumeBigKey=true: Updates regionMinKeysUsed (used for door discovery)
    // When assumeBigKey=false: Updates regionMinKeysUsedNoBK (actual min keys without BK doors)
    // When targetMap provided: Updates that map instead
    let previousRegionCount = 0;
    let iterations = 0;
    const maxIterations = 10;

    // Decide which map to update based on assumeBigKey (or use provided target map)
    const minKeysMap = targetMap ?? (assumeBigKey ? ctx.regionMinKeysUsed : ctx.regionMinKeysUsedNoBK);

    while (iterations < maxIterations) {
      iterations++;
      const visited = new Set<string>(); // Reset visited each iteration
      // Track which door pairs were actually opened (by spending a key).
      // Key is a canonical pair "regionA|regionB" (sorted). A bidirectional door
      // is only "already opened" if we previously unlocked it from the other side.
      const openedDoorPairs = new Set<string>();
      const pq = new PriorityQueue<{ region: string; crystalState: CrystalSwitchState; keysUsed: number; fromRegion?: string; usedKey?: boolean }>((a, b) => a.keysUsed - b.keysUsed);

      for (const [regionName] of entryRegions) {
        const startKeyCost = entryKeyCost.get(regionName) ?? 0;
        pq.enqueue({ region: regionName, crystalState: "orange", keysUsed: startKeyCost, fromRegion: undefined, usedKey: false });
      }

      while (!pq.isEmpty()) {
        const { region, crystalState, keysUsed, fromRegion, usedKey } = pq.dequeue()!;
        const visitKey = `${region}|${crystalState}`;
        if (visited.has(visitKey)) continue;
        visited.add(visitKey);

        // Record that we opened this door pair (if we spent a key to get here)
        if (usedKey && fromRegion) {
          openedDoorPairs.add(this.getDoorPairKey(fromRegion, region));
        }

        const regionState = ctx.reachable.get(region);
        const regionLogic = this.regions[region];
        if (!regionLogic) continue;

        // Only update minKeysUsed if we found a better path
        const existingMinKeys = minKeysMap.get(region);
        if (existingMinKeys === undefined || keysUsed < existingMinKeys) {
          minKeysMap.set(region, keysUsed);
        }

        if (regionLogic.exits) {
          for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
            const targetType = this.regions[exit.to]?.type || "";
            if (!exit.to || DungeonTraverser.OVERWORLD_TYPES.has(targetType)) continue;

            const isSKDoor = this.requiresSmallKey(exit);
            // Small key doors paired with big key doors open automatically and don't count
            const isPairedWithBigKey = isSKDoor && this.isSmallKeyDoorPairedWithBigKey(region, exit.to);

            // For bidirectional small key doors, check if this exact door pair was
            // already opened from the other side (spending a key). We can't just check
            // if the target region was visited — it may have been reached via a different
            // entrance without opening this door.
            const isBidirectional = isSKDoor && this.isBidirectionalSmallKeyDoor(region, exit.to);
            const doorAlreadyOpened = isBidirectional && openedDoorPairs.has(this.getDoorPairKey(region, exit.to));

            const countsAsKeyDoor = isSKDoor && !isPairedWithBigKey && !doorAlreadyOpened;

            // Keep track of key doors for BFS in next pass (only real key-consuming doors)
            // Only collect pending doors on first pass (assumeBigKey=true)
            if (assumeBigKey && isSKDoor && !isPairedWithBigKey && !ctx.pendingKeyDoors.includes(exitName)) {
              ctx.pendingKeyDoors.push(exitName);
            }

            // Track key cost from canReach requirements (need to reach target first)
            let canReachKeyCost = 0;

            // Evaluate exit requirements, assuming keys available to see all doors
            // For big key: use the assumeBigKey parameter passed to this function
            // - First pass (assumeBigKey=true): assume big key for door discovery
            // - Second pass (assumeBigKey=false): don't assume big key to get accurate minKeysUsedNoBK
            const hasBigKey = assumeBigKey && (this.protection === "partial" || !this.state.settings.wildBigKeys || this.state.dungeons[this.dungeonId]?.bigKey);

            const status = evaluator.evaluateWorldLogic(exit.requirements, {
              regionName: region,
              dungeonId: this.dungeonId,
              crystalStates: new Set([crystalState]),
              isBunny: regionState?.bunnyState ?? false,
              assumeSmallKey: isSKDoor,
              assumeBigKey: hasBigKey,
              canReachRegion: (targetRegion: string) => {
                const targetRegionLogic = this.regions[targetRegion];
                if (targetRegionLogic?.type === "Dungeon") {
                  // Check if discovered in any iteration
                  const targetMinKeys = minKeysMap.get(targetRegion);
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

            if (status !== "unavailable") {
              pq.enqueue({ region: exit.to, crystalState, keysUsed: nextKeys, fromRegion: region, usedKey: countsAsKeyDoor });
            }
          }
        }

        if (this.hasCrystalSwitch(region)) {
          if (
            this.canHitCrystalSwitch(region, {
              regionName: region,
              dungeonId: this.dungeonId,
              crystalStates: new Set([crystalState]),
              isBunny: regionState?.bunnyState ?? false,
            })
          ) {
            pq.enqueue({ region, crystalState: this.toggleCrystalState(crystalState), keysUsed, fromRegion: undefined, usedKey: false });
          }
        }
      }

      const currentRegionCount = minKeysMap.size;
      if (currentRegionCount === previousRegionCount) {
        break;
      }
      previousRegionCount = currentRegionCount;
    }
  }

  private bfsMaxKeys(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>, entryKeyCost: Map<string, number>, evaluator: RequirementEvaluator) {
    // BFS that defers each key door in turn to find worst-case key costs.
    // For each pending door, we explore everything else first, then open that door last.
    // Regions found only after opening the deferred door get maxKeysUsed set.

    // Track ALL regions that were reachable before ANY door was deferred across ALL iterations
    // These regions should have maxKeysUsed = minKeysUsed because they are NOT exclusively behind doors
    const regionsReachableBeforeAnyDoor = new Set<string>();

    // Pre-compute the adjacency graph once for all preComputeReachableWithout calls.
    // This avoids re-evaluating exit requirements for each deferred door iteration.
    const { adj: reachableAdj, entrySet: reachableEntrySet } = this.preComputeReachableWithoutAdj(ctx, entryRegions, entryKeyCost, evaluator);

    for (const pendingKeyDoor of ctx.pendingKeyDoors) {
      // Pre-compute which regions are reachable WITHOUT the deferred door.
      // This prevents circular canReach dependencies from inflating maxKeysUsed:
      // without it, canReach uses Dijkstra data and can bypass the deferred door via
      // canReach shortcuts, opening downstream doors and inflating keysUsed.
      const reachableWithoutDeferred = this.preComputeReachableWithout(pendingKeyDoor, reachableAdj, reachableEntrySet);

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
          isKeyDoor: false,
        });
      }

      const visited = new Set<string>();
      const openedDoorPairs = new Set<string>();
      let deferred = false;
      let doorPassed = false;
      let deferredExit: ExitQueueItem | null = null;
      // Track regions reachable WITHOUT opening the deferred door
      let regionsReachableWithoutDeferredDoor: Set<string> | null = null;
      // Track regions we've already set maxKeysUsed for in THIS iteration
      const regionsSetThisIteration = new Set<string>();

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
        }

        const visitKey = `${region}|${crystalState}`;
        if (!visited.has(visitKey)) {
          visited.add(visitKey);

          const regionState = ctx.reachable.get(region);
          const regionLogic = this.regions[region];
          if (!regionLogic) continue;

          const existingMax = ctx.regionMaxKeysUsed.get(region) ?? -1;
          // Only update maxKeysUsed if we've passed the deferred door, this region
          // is exclusively behind it, and we haven't set it yet in this iteration
          const isExclusivelyBehindDeferredDoor = doorPassed && regionsReachableWithoutDeferredDoor !== null && !regionsReachableWithoutDeferredDoor.has(region);
          if (isExclusivelyBehindDeferredDoor && !regionsSetThisIteration.has(region)) {
            regionsSetThisIteration.add(region);
            // Take maximum across all iterations (different deferred doors)
            if (keysUsed > existingMax) {
              ctx.regionMaxKeysUsed.set(region, keysUsed);
            }
          }

          if (regionLogic.exits) {
            for (const [nextExitName, exit] of Object.entries(regionLogic.exits)) {
              if (!exit.to || DungeonTraverser.OVERWORLD_TYPES.has(this.regions[exit.to]?.type || "")) continue;
              const isSKDoor = this.requiresSmallKey(exit);
              const isPairedWithBigKey = isSKDoor && this.isSmallKeyDoorPairedWithBigKey(region, exit.to);
              const countsAsKeyDoor = isSKDoor && !isPairedWithBigKey;

              let canReachKeyCost = 0;

              const hasBigKey = this.protection === "partial" || !this.state.settings.wildBigKeys || this.state.dungeons[this.dungeonId]?.bigKey;
              const status = evaluator.evaluateWorldLogic(exit.requirements, {
                regionName: region,
                dungeonId: this.dungeonId,
                crystalStates: new Set([crystalState]),
                isBunny: regionState?.bunnyState ?? false,
                assumeSmallKey: isSKDoor,
                assumeBigKey: hasBigKey,
                canReachRegion: (targetRegion: string) => {
                  const targetRegionLogic = this.regions[targetRegion];
                  if (targetRegionLogic?.type === "Dungeon") {
                    const targetMinKeys = ctx.regionMinKeysUsed.get(targetRegion);
                    if (targetMinKeys !== undefined) {
                      // Verify reachable without deferred door to prevent
                      // canReach from bypassing it via Dijkstra shortcuts
                      if (reachableWithoutDeferred.has(targetRegion)) {
                        canReachKeyCost = Math.max(canReachKeyCost, targetMinKeys);
                        return "available";
                      }
                    }
                    // Fall back to visited set for regions discovered after
                    // the deferred door opens
                    if (visited.has(`${targetRegion}|orange`) || visited.has(`${targetRegion}|blue`)) {
                      const visitedMinKeys = ctx.regionMinKeysUsed.get(targetRegion);
                      if (visitedMinKeys !== undefined) {
                        canReachKeyCost = Math.max(canReachKeyCost, visitedMinKeys);
                      }
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

                const priority = countsAsKeyDoor ? effectiveKeyCost + 100 : effectiveKeyCost;
                exitQueue.enqueue({ from: region, exitName: nextExitName, to: exit.to, crystalState, priority, isKeyDoor: countsAsKeyDoor });
              }
            }
          }

          if (this.hasCrystalSwitch(region)) {
            if (
              this.canHitCrystalSwitch(region, {
                regionName: region,
                dungeonId: this.dungeonId,
                crystalStates: new Set([crystalState]),
                isBunny: regionState?.bunnyState ?? false,
              })
            ) {
              exitQueue.enqueue({ from: region, exitName: "crystal_switch", to: region, crystalState: this.toggleCrystalState(crystalState), priority: keysUsed, isKeyDoor: false });
            }
          }
        }

        if (exitQueue.isEmpty() && !deferred && deferredExit) {
          deferred = true;
          doorPassed = true;

          // Save regions reachable before the deferred door was opened
          regionsReachableWithoutDeferredDoor = new Set(Array.from(visited).map((visitKey) => visitKey.split("|")[0]));

          // Only for the FIRST door iteration, track regions reachable with 0 doors
          if (regionsReachableBeforeAnyDoor.size === 0 && keysUsed === 0) {
            for (const region of regionsReachableWithoutDeferredDoor) {
              regionsReachableBeforeAnyDoor.add(region);
            }
          }

          // Clear visited for target so we can re-process it
          visited.delete(`${deferredExit.to}|blue`);
          visited.delete(`${deferredExit.to}|orange`);

          exitQueue.enqueue(deferredExit);
        }
      }
    }

    // Initialize maxKeysUsed = minKeysUsed for regions reachable before any door
    for (const region of regionsReachableBeforeAnyDoor) {
      const minKeys = ctx.regionMinKeysUsed.get(region);
      if (minKeys !== undefined && !ctx.regionMaxKeysUsed.has(region)) {
        ctx.regionMaxKeysUsed.set(region, minKeys);
      }
    }
  }

  private finalBFS(ctx: DungeonContext, entryRegions: Map<string, { bunnyState: boolean }>, entryStatus: Map<string, LogicStatus>, inventoryKeys: number, keyCountingEvaluator: RequirementEvaluator) {
    // Phase 1: Discover all traversable regions (ignoring key counts)
    // Phase 2: Fixed-point iteration to count accessible keys
    // Phase 3: Compute final status based on total keys available
    // In partial mode, use keyCountingEvaluator for discovery (assumes all items)
    // so key contention logic applies even to regions the player can't currently reach.

    const actuallyHasBigKey = !this.state.settings.wildBigKeys || this.state.dungeons[this.dungeonId]?.bigKey;
    const effectiveMinKeysMap = actuallyHasBigKey ? ctx.regionMinKeysUsed : ctx.regionMinKeysUsedNoBK;

    // Pre-compute total keys available using Dijkstra data (before Phase 1)
    // so canReach callbacks can detect key contention on target regions.
    // Uses fixed-point iteration since discovering keys at threshold N may
    // unlock regions at threshold N+1 that contain more keys.
    let prelimTotalKeys = inventoryKeys;
    {
      const prelimDiscovered = new Set<string>();
      let changed = true;
      while (changed) {
        changed = false;
        for (const [regionName, minKeys] of effectiveMinKeysMap) {
          if (minKeys > prelimTotalKeys) continue;
          for (const keyLoc of this.smallKeysInRegion(regionName)) {
            if (prelimDiscovered.has(keyLoc)) continue;
            prelimDiscovered.add(keyLoc);
            prelimTotalKeys++;
            changed = true;
          }
        }
      }
    }

    // === PHASE 1: Discovery ===
    const visited = new Set<string>();
    const queue: Array<{ region: string; crystalState: CrystalSwitchState; fromEntryStatus: LogicStatus }> = [];

    // Track the best entry status that can reach each region, keyed by
    // "region|crystalState" so that blue-state exploration can't borrow
    // an orange-state entry status (or vice versa).
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
      const entryKey = `${regionName}|orange`;
      const currentStatus = regionEntryStatus.get(entryKey);
      if (!currentStatus || isBetterStatus(thisEntryStatus, currentStatus)) {
        regionEntryStatus.set(entryKey, thisEntryStatus);
      }
    }

    // Phase 1: Explore all traversable regions (assuming unlimited keys for traversal)
    while (queue.length > 0) {
      const { region, crystalState, fromEntryStatus: queuedEntryStatus } = queue.shift()!;

      // Use the CURRENT entry status of this region for this crystal state,
      // not the stale one from when it was queued. This ensures we propagate
      // upgrades correctly while keeping crystal states independent.
      const currentRegionEntryStatus = regionEntryStatus.get(`${region}|${crystalState}`) ?? queuedEntryStatus;

      const visitKey = `${region}|${crystalState}|${currentRegionEntryStatus}`;
      if (visited.has(visitKey)) continue;
      visited.add(visitKey);

      const regionState = ctx.reachable.get(region);
      const regionLogic = this.regions[region];
      if (!regionLogic) continue;

      if (regionLogic.exits) {
        for (const [, exit] of Object.entries(regionLogic.exits)) {
          if (!exit.to || DungeonTraverser.OVERWORLD_TYPES.has(this.regions[exit.to]?.type || "")) continue;

          const isSKDoor = this.requiresSmallKey(exit);

          // For big key: assume in partial mode for key counting (to discover all regions)
          const assumeBigKeyForDiscovery = this.protection === "partial" || !this.state.settings.wildBigKeys || this.state.dungeons[this.dungeonId]?.bigKey;
          // For actual traversability: use real inventory
          const actuallyHasBigKey = !this.state.settings.wildBigKeys || this.state.dungeons[this.dungeonId]?.bigKey;

          // Evaluate exit requirements (ignore small key requirement for key doors)
          // Use keyCountingEvaluator with assumeBigKey so in partial mode we discover all regions
          // Track which canReach targets the key counting evaluator uses, so we can
          // detect when the actual evaluator needs additional canReach dependencies
          // (due to missing items like somaria creating alternate paths)
          const keyCountingCanReachTargets = new Set<string>();
          const requirementStatus = keyCountingEvaluator.evaluateWorldLogic(exit.requirements, {
            regionName: region,
            dungeonId: this.dungeonId,
            crystalStates: new Set([crystalState]),
            isBunny: regionState?.bunnyState ?? false,
            assumeSmallKey: isSKDoor,
            assumeBigKey: assumeBigKeyForDiscovery, // Assume big key in partial mode for key counting
            canReachRegion: (targetRegion: string) => {
              const targetRegionLogic = this.regions[targetRegion];
              if (targetRegionLogic?.type === "Dungeon") {
                keyCountingCanReachTargets.add(targetRegion);
                return "available"; // Assume dungeon regions reachable
              }
              // For overworld, use callback or assume reachable
              return this.canReachOverworldRegion?.(targetRegion) ?? "available";
            },
          });

          if (requirementStatus === "unavailable") continue;

          // Evaluate ACTUAL traversability using real inventory (not assumptions)
          // This determines the entry status for regions behind big key doors
          // We still assume small key doors are passable for key contention analysis
          const actualStatus = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, {
            regionName: region,
            dungeonId: this.dungeonId,
            crystalStates: new Set([crystalState]),
            isBunny: regionState?.bunnyState ?? false,
            assumeSmallKey: isSKDoor,
            assumeBigKey: actuallyHasBigKey,
            canReachRegion: (targetRegion: string) => {
              const targetRegionLogic = this.regions[targetRegion];
              if (targetRegionLogic?.type === "Dungeon") {
                // If the key counting evaluator didn't need this canReach
                // (because it had a shortcut like somaria), but the actual evaluator
                // does, the player may need additional key doors for this path.
                // Return "possible" to flag the uncertainty (sets degradedReach).
                if (!keyCountingCanReachTargets.has(targetRegion)) {
                  const targetMinKeys = ctx.regionMinKeysUsed.get(targetRegion);
                  const currentMinKeys = ctx.regionMinKeysUsed.get(region);
                  if (targetMinKeys !== undefined && currentMinKeys !== undefined && targetMinKeys > currentMinKeys) {
                    return "possible";
                  }
                }
                // Check if the target region has key contention (maxKeysUsed > minKeysUsed).
                // If the player doesn't have enough keys for the worst-case path,
                // the target is only "possible" — propagate that through canReach
                // so dependent regions (e.g., boss requiring canReach|attic) are
                // correctly degraded (sets degradedReach in the evaluator).
                const targetMaxKeys = ctx.regionMaxKeysUsed.get(targetRegion);
                const targetMinKeys2 = effectiveMinKeysMap.get(targetRegion);
                if (targetMaxKeys !== undefined && targetMinKeys2 !== undefined && targetMaxKeys > targetMinKeys2) {
                  if (prelimTotalKeys < targetMaxKeys) {
                    return "possible";
                  }
                }
                return "available";
              }
              return this.canReachOverworldRegion?.(targetRegion) ?? "available";
            },
          });

          // The effective entry status for the destination is the combination of:
          // 1. Current region's entry status
          // 2. Whether this exit is actually traversable
          const effectiveEntryStatus = this.combineStatuses(currentRegionEntryStatus, actualStatus);

          // Add to reachable if not already there
          if (!ctx.reachable.has(exit.to)) {
            const bunnyState = regionState?.bunnyState ?? false;
            ctx.reachable.set(exit.to, {
              status: "available", // Placeholder
              bunnyState,
              crystalStates: new Set([crystalState]),
            });
            regionEntryStatus.set(`${exit.to}|${crystalState}`, effectiveEntryStatus);
            queue.push({ region: exit.to, crystalState, fromEntryStatus: effectiveEntryStatus });
          } else {
            // Update crystal states if we've reached from a different crystal state
            const existing = ctx.reachable.get(exit.to)!;
            if (!existing.crystalStates.has(crystalState)) {
              existing.crystalStates.add(crystalState);
              // Set entry status for this new crystal state path
              regionEntryStatus.set(`${exit.to}|${crystalState}`, effectiveEntryStatus);
              queue.push({ region: exit.to, crystalState, fromEntryStatus: effectiveEntryStatus });
            }
          }

          // Always update entry status if we found a better (more available) path
          // for this specific crystal state
          const exitEntryKey = `${exit.to}|${crystalState}`;
          const currentEntryStatus = regionEntryStatus.get(exitEntryKey);
          if (currentEntryStatus && isBetterStatus(effectiveEntryStatus, currentEntryStatus)) {
            regionEntryStatus.set(exitEntryKey, effectiveEntryStatus);
            // Re-add to queue so the upgrade propagates to children
            queue.push({ region: exit.to, crystalState, fromEntryStatus: effectiveEntryStatus });
          }
        }
      }

      // Handle crystal switches
      if (this.hasCrystalSwitch(region)) {
        if (
          this.canHitCrystalSwitch(region, {
            regionName: region,
            dungeonId: this.dungeonId,
            crystalStates: new Set([crystalState]),
            isBunny: regionState?.bunnyState ?? false,
          })
        ) {
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

    // Phase 2 reuses effectiveMinKeysMap computed at the top of finalBFS
    ctx.totalKeysAvailable = inventoryKeys;
    let keysChanged = true;

    while (keysChanged) {
      keysChanged = false;
      for (const [regionName] of ctx.reachable) {
        // Skip regions that Dijkstra couldn't reach (no minKeysUsed entry)
        // These regions have requirements that couldn't be satisfied
        if (!effectiveMinKeysMap.has(regionName)) continue;

        const minKeysUsed = effectiveMinKeysMap.get(regionName)!;

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
            }
          }
        }
      }
    }

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

    // Pre-compute caches for expensive BFS queries used in the inner loop.
    // These are keyed by region name and reused across all (region, key) pairs.
    const gatedByCache = new Map<string, boolean>(); // "keyRegion|gateRegion" -> result
    const backtrackCache = new Map<string, boolean>(); // keyRegion -> canReachEntry
    const differentBranchCache = new Map<string, boolean>(); // "keyRegion|targetRegion" -> result

    // Determine pottery mode dynamically: only applies if this dungeon actually
    // has pot/keydrop keys that are being shuffled (not all dungeons do).
    const isPotteryKeyMode = this.shuffledKeysInDungeon(ctx) > 0;
    const estimatedUniqueDoors = Math.ceil(ctx.pendingKeyDoors.length / 2);

    // Calculate doorsAtThreshold0 once - indicates if dungeon has branching paths from start
    let doorsAtThreshold0 = 0;
    if (isPotteryKeyMode) {
      const seenDoorPairs = new Set<string>();
      for (const doorName of ctx.pendingKeyDoors) {
        const sourceRegion = this.findDoorSourceRegion(doorName);
        if (!sourceRegion) continue;

        const sourceMinKeys = effectiveMinKeysMap.get(sourceRegion);
        // Skip doors whose source region wasn't reached by Dijkstra
        if (sourceMinKeys === undefined) continue;
        if (sourceMinKeys === 0) {
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
        // If Dijkstra couldn't reach this region (using effective map), mark as unavailable
        // This means some requirement couldn't be satisfied
        if (!effectiveMinKeysMap.has(regionName)) {
          keyStatus = "unavailable";
        } else if (ctx.regionMinKeysUsedActual.size > 0 && !ctx.regionMinKeysUsedActual.has(regionName)) {
          // Actual-items Dijkstra ran but couldn't reach this region — the all-items
          // Dijkstra found a path via items the player doesn't have (e.g. hookshot shortcut).
          // This region is unreachable with current inventory.
          keyStatus = "unavailable";
        } else {
          // Use the HIGHER of all-items and actual-items min keys.
          // The all-items Dijkstra may find shortcuts through items the player
          // doesn't have, giving artificially low min keys.
          const allItemsMinKeys = effectiveMinKeysMap.get(regionName)!;
          const actualMinKeys = ctx.regionMinKeysUsedActual.get(regionName);
          const minKeysUsed = actualMinKeys !== undefined ? Math.max(allItemsMinKeys, actualMinKeys) : allItemsMinKeys;
          const maxKeysUsed = ctx.regionMaxKeysUsed.get(regionName);

          // Count keys collectible BEFORE reaching this region (not downstream or on different branch)
          let keysAvailableBeforeRegion = inventoryKeys;
          // effectiveMaxKeys should be at least minKeysUsed (path without BK may require more keys
          // than path with BK)
          const effectiveMaxKeys = Math.max(maxKeysUsed ?? minKeysUsed, minKeysUsed);

          for (const [, keys] of keysByThreshold) {
            if (keysAvailableBeforeRegion >= effectiveMaxKeys) break; // Already have enough keys
            for (const keyLoc of keys) {
              const keyRegion = keyToRegion.get(keyLoc);
              if (keyRegion) {
                const keyMinKeys = effectiveMinKeysMap.get(keyRegion) ?? 0;

                // Downstream: need >= maxKeysUsed to reach key, or gated without backtrack
                const isDownstreamByThreshold = keyMinKeys >= effectiveMaxKeys;
                let isGatedByTarget = false;
                if (!isDownstreamByThreshold) {
                  const gateKey = `${keyRegion}|${regionName}`;
                  if (!gatedByCache.has(gateKey)) {
                    gatedByCache.set(gateKey, this.isRegionGatedBy(keyRegion, regionName, ctx));
                  }
                  if (gatedByCache.get(gateKey)!) {
                    if (!backtrackCache.has(keyRegion)) {
                      backtrackCache.set(keyRegion, this.canReachEntryFromRegion(keyRegion, ctx));
                    }
                    isGatedByTarget = !backtrackCache.get(keyRegion)!;
                  }
                }
                const isDownstream = isDownstreamByThreshold || isGatedByTarget;

                // Different branch: same threshold but requires different door commitment
                let isOnDifferentBranch = false;
                if (!isDownstream) {
                  const branchKey = `${keyRegion}|${regionName}`;
                  if (!differentBranchCache.has(branchKey)) {
                    differentBranchCache.set(branchKey, this.isKeyOnDifferentBranch(keyRegion, regionName, ctx, gatedByCache, backtrackCache));
                  }
                  isOnDifferentBranch = differentBranchCache.get(branchKey)!;
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
          } else if (effectiveMaxKeys > 0) {
            if (keysAvailableBeforeRegion >= effectiveMaxKeys) {
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

      // Get the best entry status across all crystal states for this region
      const orangeEntry = regionEntryStatus.get(`${regionName}|orange`);
      const blueEntry = regionEntryStatus.get(`${regionName}|blue`);
      const entryRegionStatus: LogicStatus = orangeEntry && blueEntry
        ? (isBetterStatus(orangeEntry, blueEntry) ? orangeEntry : blueEntry)
        : orangeEntry ?? blueEntry ?? "available";

      // Final status is the combination of entry status and key status
      regionState.status = this.combineStatuses(entryRegionStatus, keyStatus);
    }
  }

  private initializeDungeonContext(entryRegions: Map<string, { bunnyState: boolean }>, inventoryKeys: number, entryKeyCost: Map<string, number> = new Map()): DungeonContext {
    const ctx: DungeonContext = {
      reachable: new Map<string, DungeonRegionState>(),
      queue: [],
      pendingKeyDoors: [],
      regionMaxKeysUsed: new Map<string, number>(),
      regionMinKeysUsed: new Map<string, number>(),
      regionMinKeysUsedNoBK: new Map<string, number>(),
      regionMinKeysUsedActual: new Map<string, number>(),
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
  private isKeyOnDifferentBranch(
    keyRegion: string,
    targetRegion: string,
    ctx: DungeonContext,
    gatedByCache: Map<string, boolean>,
    backtrackCache: Map<string, boolean>,
  ): boolean {
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
      const gateKeyForKey = `${keyRegion}|${regionName}`;
      if (!gatedByCache.has(gateKeyForKey)) {
        gatedByCache.set(gateKeyForKey, this.isRegionGatedBy(keyRegion, regionName, ctx));
      }
      if (gatedByCache.get(gateKeyForKey)!) {
        // keyRegion is gated by regionName
        // Now check if the target is ALSO gated by this region
        const gateKeyForTarget = `${targetRegion}|${regionName}`;
        if (!gatedByCache.has(gateKeyForTarget)) {
          gatedByCache.set(gateKeyForTarget, this.isRegionGatedBy(targetRegion, regionName, ctx));
        }
        if (!gatedByCache.get(gateKeyForTarget)!) {
          // Target is NOT gated by this region — check backtracking
          if (!backtrackCache.has(keyRegion)) {
            backtrackCache.set(keyRegion, this.canReachEntryFromRegion(keyRegion, ctx));
          }
          if (!backtrackCache.get(keyRegion)!) {
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

  /**
   * Pre-compute which dungeon regions are reachable WITHOUT a specific key door.
   * Uses iterative BFS that opens all key doors except the specified one,
   * with canReach evaluated against the growing reachable set (not Dijkstra data).
   * This prevents circular canReach dependencies from inflating maxKeysUsed.
   */
  // Pre-computed adjacency for preComputeReachableWithout: maps each exit name
  // to its (from, to) pair, only including exits that are passable and internal.
  private preComputeReachableWithoutAdj(
    ctx: DungeonContext,
    entryRegions: Map<string, { bunnyState: boolean }>,
    entryKeyCost: Map<string, number>,
    evaluator: RequirementEvaluator,
  ): { adj: Map<string, { exitName: string; to: string }[]>; entrySet: Set<string> } {
    const entrySet = new Set<string>();
    for (const [regionName] of entryRegions) {
      const startKeyCost = entryKeyCost.get(regionName) ?? 0;
      if (startKeyCost > 0) continue;
      entrySet.add(regionName);
    }

    const hasBigKey = this.protection === "partial" || !this.state.settings.wildBigKeys || this.state.dungeons[this.dungeonId]?.bigKey;

    // First, compute full reachability with all doors to know which exits are passable.
    // Use fixed-point iteration to handle canReach ordering dependencies.
    const fullReachable = new Set<string>(entrySet);
    let changed = true;
    // adj: region -> list of (exitName, to) for passable internal exits
    const adj = new Map<string, { exitName: string; to: string }[]>();

    while (changed) {
      changed = false;
      for (const region of fullReachable) {
        const regionLogic = this.regions[region];
        if (!regionLogic?.exits) continue;
        const regionState = ctx.reachable.get(region);

        if (!adj.has(region)) adj.set(region, []);
        const regionAdj = adj.get(region)!;

        for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
          if (!exit.to) continue;
          if (DungeonTraverser.OVERWORLD_TYPES.has(this.regions[exit.to]?.type || "")) continue;
          // Already recorded this edge
          if (regionAdj.some((e) => e.exitName === exitName)) continue;

          const status = evaluator.evaluateWorldLogic(exit.requirements, {
            regionName: region,
            dungeonId: this.dungeonId,
            crystalStates: new Set<CrystalSwitchState>(["orange", "blue"]),
            isBunny: regionState?.bunnyState ?? false,
            assumeSmallKey: true,
            assumeBigKey: hasBigKey,
            canReachRegion: (targetRegion: string) => {
              if (this.regions[targetRegion]?.type === "Dungeon") {
                return fullReachable.has(targetRegion) ? "available" : "unavailable";
              }
              return "available";
            },
          });

          if (status !== "unavailable") {
            regionAdj.push({ exitName, to: exit.to });
            if (!fullReachable.has(exit.to)) {
              fullReachable.add(exit.to);
              changed = true;
            }
          }
        }
      }
    }

    return { adj, entrySet };
  }

  private preComputeReachableWithout(
    deferredDoor: string,
    adj: Map<string, { exitName: string; to: string }[]>,
    entrySet: Set<string>,
  ): Set<string> {
    // Simple BFS on pre-computed adjacency, skipping the deferred door exit
    const reachable = new Set<string>(entrySet);
    const queue = [...entrySet];

    while (queue.length > 0) {
      const region = queue.shift()!;
      const edges = adj.get(region);
      if (!edges) continue;

      for (const { exitName, to } of edges) {
        if (exitName === deferredDoor) continue;
        if (reachable.has(to)) continue;
        reachable.add(to);
        queue.push(to);
      }
    }

    return reachable;
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
              changed = true;
            }
          }
        }
      }
    }
  }

  private findCanReachTargets(requirements: Record<string, unknown>): string[] {
    // Recursively find all canReach|X targets in the requirements
    const targets: string[] = [];

    const search = (obj: unknown): void => {
      if (typeof obj === "string") {
        if (obj.startsWith("canReach|")) {
          targets.push(obj.slice("canReach|".length));
        }
      } else if (Array.isArray(obj)) {
        for (const item of obj) {
          search(item);
        }
      } else if (typeof obj === "object" && obj !== null) {
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

  /**
   * Check if a small key door is bidirectional (same door from both sides).
   * Returns true if there's a reverse exit that also requires a small key.
   */
  private isBidirectionalSmallKeyDoor(fromRegion: string, toRegion: string): boolean {
    const targetRegionLogic = this.regions[toRegion];
    if (!targetRegionLogic?.exits) return false;

    for (const exit of Object.values(targetRegionLogic.exits)) {
      if (exit.to === fromRegion && this.requiresSmallKey(exit)) {
        return true;
      }
    }
    return false;
  }

  private containsKeyType(req: LogicState | string | undefined, keyType: "smallkey" | "bigkey"): boolean {
    if (!req) return false;
    if (req === keyType) return true;
    if (typeof req === "object" && req !== null) {
      const r = req as Record<string, unknown>;
      if (r.always && this.containsKeyType(r.always, keyType)) return true;
      if (r.logical && this.containsKeyType(r.logical, keyType)) return true;
      if (r.allOf && Array.isArray(r.allOf)) return r.allOf.some((x) => this.containsKeyType(x, keyType));
      if (r.anyOf && Array.isArray(r.anyOf)) return r.anyOf.some((x) => this.containsKeyType(x, keyType));
    }
    return false;
  }

  private containsSmallKey(req: LogicState | string | undefined): boolean {
    return this.containsKeyType(req, "smallkey");
  }

  private containsBigKey(req: LogicState | string | undefined): boolean {
    return this.containsKeyType(req, "bigkey");
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

  /**
   * Count pot/keydrop key locations in this dungeon that are being shuffled
   * (i.e., no longer guaranteed in-place by current settings).
   * This is used to determine if pottery-mode contention applies to this dungeon.
   */
  private shuffledKeysInDungeon(ctx: DungeonContext): number {
    const pottery = this.state.settings.pottery;
    const drops = this.state.settings.keyDrop;
    let count = 0;
    for (const regionName of ctx.reachable.keys()) {
      const region = this.regions[regionName];
      if (!region?.locations) continue;
      for (const locationName of Object.keys(region.locations)) {
        if (locationName.endsWith("Pot Key") || locationName.includes("Hammer Block Key Drop")) {
          if (pottery === "keys" || pottery === "cavekeys") count++;
        } else if (locationName.includes("Key Drop") && !locationName.includes("Hammer Block Key Drop")) {
          if (drops) count++;
        }
      }
    }
    return count;
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
      if (doorName.includes("Interior") && otherDoor.includes("Interior") && doorName.replace(/ [NSEW]+$/, "") === otherDoor.replace(/ [NSEW]+$/, "")) {
        return otherDoor;
      }
    }
    return undefined;
  }
}
