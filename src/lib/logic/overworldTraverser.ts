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
 *    reachable with full inventory via an all-items BFS. This ensures key contention logic
 *    applies even to regions the player can't currently reach. Discovered portals start with
 *    "unavailable" status and are upgraded by the main BFS when actually reachable.
 *
 * 2. BFS TRAVERSAL: Starting from Menu and Flute Sky, explores all reachable overworld
 *    regions via exits. Each exit is evaluated against the player's inventory to determine
 *    its status. Dungeon exits use the all-items evaluator for discovery (partial mode) but
 *    the real-inventory evaluator for status propagation.
 *
 * 3. DUNGEON COORDINATION: When a dungeon portal is found, it's collected into pendingDungeons.
 *    After overworld BFS stabilizes, DungeonTraverser is called for each dungeon with all
 *    discovered portals. Dungeon exits back to overworld update reachability and re-trigger BFS.
 *
 * 4. FIXED-POINT ITERATION: The process repeats until no new regions are discovered.
 *    Dungeons may unlock overworld regions that unlock new dungeon portals.
 *
 * KEY CONCEPTS:
 * - RegionReachability: Tracks status and linkState (link / bunny / superbunny) for each region
 * - Portal discovery: In partial mode, finds all potential portals before main traversal
 * - Entry status propagation: Portals inherit status from how they were reached
 * - Bunny state: Tracks whether player is a bunny (in Dark World without Moon Pearl)
 * - blockedExits: Exits that failed evaluation are re-checked when new regions unlock
 * - overworldKeyCost: Tracks keys used to reach overworld regions via dungeon exits
 * - Key/BK inference: Post-processing infers key accessibility for non-wild key modes
 *
 * PROTECTION MODES:
 * - partial: Assumes all items for key counting/discovery, uses actual inventory for final status
 * - dangerous: Uses actual inventory throughout (may miss key contention in unreachable areas)
 */

import { type RegionReachability, type ExitLogic, type GameState, type LinkState, type RegionLogic, type LogicStatus } from "@/data/logic/logicTypes";
import type { LogicSet } from "./logicMapper";
import { RequirementEvaluator, type EvaluationContext } from "./requirementEvaluator";
import { DungeonTraverser } from "./dungeonTraverser";
import { combineLinkStates, createAllItemsState, isBetterStatus, combineStatuses, minimumStatus } from "./logicHelpers";
import { DungeonsData } from "@/data/dungeonData";
import { entranceLocations } from "@/data/locationsData";
import { buildRegionMetadata, applyStandvertedState, type RegionMetadata } from "./regionsProvider";
import {
  BUNNY_EXEMPT_LOCATIONS,
  DOOR_PREFIX_TO_DUNGEON,
  PORTAL_TO_DUNGEON,
  SUPERBUNNY_BLOCKED_EXITS,
  isPotteryKeyShuffle,
} from "./dungeonConstants";

interface OverworldTraverserContext {
  reachable: Map<string, RegionReachability>;
  queue: string[];
  // Exits pending re-evaluation, keyed "from|exitName". Contains exits that
  // evaluated "unavailable" AND exits that evaluated below "available" (ool /
  // possible) — both can improve later when a canReach target becomes
  // reachable, and must then be allowed to upgrade an already-reached
  // destination. Accessibility must never be downgraded, only upgraded.
  blockedExits: Map<string, { exitName: string; exit: ExitLogic[string]; from: string }>;
  pendingDungeons: Map<string, Map<string, { linkState: LinkState; status: LogicStatus; keyCost: number; oolReasons?: string[] }>>;
  // Track ALL discovered portals for each dungeon across all iterations
  // keyCost tracks how many keys were used to reach this portal (if reached via dungeon exit)
  allDiscoveredPortals: Map<string, Map<string, { linkState: LinkState; status: LogicStatus; keyCost: number; oolReasons?: string[] }>>;
  // Track key cost for overworld regions reached via dungeon exits
  // This maps overworld region name -> minimum keys used to reach it via any dungeon exit
  overworldKeyCost: Map<string, number>;
}

interface RouteSearchContext {
  reachable: Map<string, RegionReachability>;
  queue: string[];
  blockedExits: { exitName: string; exit: ExitLogic[string]; from: string }[];
}

const doorPrefixToDungeon = DOOR_PREFIX_TO_DUNGEON;
// Hoisted: these are iterated in hot per-location loops.
const DOOR_PREFIXES = Object.keys(DOOR_PREFIX_TO_DUNGEON);
const PORTAL_PREFIX_ENTRIES = Object.entries(PORTAL_TO_DUNGEON);

/** Merge two oolReasons arrays into a deduplicated string array, or undefined if both are empty. */
function mergeOolReasons(a?: string[], b?: string[]): string[] | undefined {
  if (!a?.length && !b?.length) return undefined;
  const set = new Set<string>([...(a ?? []), ...(b ?? [])]);
  return set.size > 0 ? Array.from(set) : undefined;
}

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
  // Cache of DungeonTraverser instances reused across processPendingDungeons iterations.
  // State is immutable for this traverser's lifetime, so exit metadata + key caches
  // computed in the dungeon traverser's constructor can be reused.
  private dungeonTraverserCache: Map<string, DungeonTraverser> = new Map();

  // Whether the world state counts as "inverted" (player starts in DW)
  private readonly isInverted: boolean;
  // Whether any OWR setting is non-vanilla
  private isOwrActive: boolean = false;
  // Pre-computed metadata from the regions graph (shared with regionsProvider)
  private metadata: RegionMetadata;
  private canReachFromInProgress: Set<string> = new Set();
  // Route results cached once traversal has reached its fixed point (the
  // reachable map is frozen from then on, so canReachFrom answers are stable).
  // Never populated during traversal — statuses still evolve there.
  private routeResultCache: Map<string, LogicStatus> = new Map();
  private routeCacheEnabled = false;
  // Identity of the reachable map the cache was built against — a different
  // map (e.g. evaluateLocations called with a custom snapshot) invalidates it.
  private routeCacheForMap?: Map<string, RegionReachability>;

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
    this.requirementEvaluator = new RequirementEvaluator(this.state, this.regions);
    this.protection = resolvedProtection;
    this.isInverted = ["inverted", "inverted_1", "standverted"].includes(this.state.settings.worldState);

    // Build or use provided metadata
    this.metadata = metadata ?? buildRegionMetadata(this.regions);

    // In partial mode, create an all-items evaluator for discovering regions
    if (resolvedProtection === "partial") {
      const allItemsState = createAllItemsState(this.state);
      this.allItemsEvaluator = new RequirementEvaluator(allItemsState, this.regions);
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

  private resolveRouteRegionName(regionOrEntranceName: string): string | undefined {
    if (this.regions[regionOrEntranceName]) return regionOrEntranceName;
    return this.metadata.entranceToParentRegion.get(regionOrEntranceName);
  }

  private isResetRegion(regionName: string): boolean {
    return regionName === "Menu" || regionName === "Flute Sky" || this.regions[regionName]?.type === "Menu";
  }

  private evaluateRouteExitRequirements(exit: ExitLogic[string], fromRegion: string, ctx: RouteSearchContext): LogicStatus {
    const evalCtx: EvaluationContext = {
      regionName: fromRegion,
      canReachRegion: (name: string) => ctx.reachable.get(name)?.status ?? "unavailable",
      canReachFromRegion: (source: string, target: string) => this.canReachFromRegion(source, target, ctx.reachable),
      effectiveWorldState: this.getEffectiveWorldState(fromRegion, exit.to),
    };

    return this.requirementEvaluator.evaluateWorldLogic(exit.requirements, evalCtx);
  }

  private setRouteReachability(ctx: RouteSearchContext, regionName: string, status: LogicStatus, linkState: LinkState): boolean {
    const existing = ctx.reachable.get(regionName);
    if (!existing) {
      ctx.reachable.set(regionName, { status, linkState });
      ctx.queue.push(regionName);
      return true;
    }

    const combinedStatus = combineStatuses(existing.status, status);
    const combinedLinkState = combineLinkStates(existing.linkState, linkState);
    if (combinedStatus !== existing.status || combinedLinkState !== existing.linkState) {
      ctx.reachable.set(regionName, { status: combinedStatus, linkState: combinedLinkState });
      ctx.queue.push(regionName);
      return true;
    }

    return false;
  }

  private processRouteExit(exitName: string, exit: ExitLogic[string], fromRegion: string, fromReachability: RegionReachability, ctx: RouteSearchContext): boolean {
    if (!exit?.to || this.isResetRegion(exit.to)) return false;

    const exitStatus = this.evaluateRouteExitRequirements(exit, fromRegion, ctx);
    if (exitStatus === "unavailable") {
      ctx.blockedExits.push({ exitName, exit, from: fromRegion });
      return false;
    }

    const newLinkState = this.computeLinkStateForExit(fromReachability.linkState, exit.type, exitName, exit.to);
    const newStatus = minimumStatus(fromReachability.status, exitStatus);
    return this.setRouteReachability(ctx, exit.to, newStatus, newLinkState);
  }

  private reevaluateRouteBlockedExits(ctx: RouteSearchContext): boolean {
    let madeProgress = false;
    const stillBlocked: RouteSearchContext["blockedExits"] = [];

    for (const { exitName, exit, from } of ctx.blockedExits) {
      if (!exit?.to || this.isResetRegion(exit.to)) continue;
      const fromReachability = ctx.reachable.get(from);
      if (!fromReachability) {
        stillBlocked.push({ exitName, exit, from });
        continue;
      }

      const exitStatus = this.evaluateRouteExitRequirements(exit, from, ctx);
      if (exitStatus === "unavailable") {
        stillBlocked.push({ exitName, exit, from });
        continue;
      }

      const newLinkState = this.computeLinkStateForExit(fromReachability.linkState, exit.type, exitName, exit.to);
      const newStatus = minimumStatus(fromReachability.status, exitStatus);
      if (this.setRouteReachability(ctx, exit.to, newStatus, newLinkState)) {
        madeProgress = true;
      }
    }

    ctx.blockedExits = stillBlocked;
    return madeProgress;
  }

  private searchRouteFromRegion(sourceRegion: string, targetRegion: string, sourceLinkState: LinkState): LogicStatus {
    const ctx: RouteSearchContext = {
      reachable: new Map([[sourceRegion, { status: "available", linkState: sourceLinkState }]]),
      queue: [sourceRegion],
      blockedExits: [],
    };

    let madeProgress = true;
    while (madeProgress) {
      madeProgress = false;

      while (ctx.queue.length > 0) {
        const current = ctx.queue.shift()!;
        const regionReachability = ctx.reachable.get(current)!;
        const regionLogic = this.regions[current];
        if (!regionLogic?.exits) continue;

        for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
          if (this.processRouteExit(exitName, exit, current, regionReachability, ctx)) {
            madeProgress = true;
          }
        }
      }

      if (this.reevaluateRouteBlockedExits(ctx)) {
        madeProgress = true;
      }
    }

    return ctx.reachable.get(targetRegion)?.status ?? "unavailable";
  }

  private canReachFromRegion(sourceRegionName: string, targetRegionName: string, knownReachable?: Map<string, RegionReachability>): LogicStatus {
    const sourceRegion = this.resolveRouteRegionName(sourceRegionName);
    const targetRegion = this.resolveRouteRegionName(targetRegionName);
    if (!sourceRegion || !targetRegion) return "unavailable";

    const knownSource = knownReachable?.get(sourceRegion);
    if (knownReachable && (!knownSource || knownSource.status === "unavailable")) {
      return "unavailable";
    }

    if (sourceRegion === targetRegion) {
      return knownSource?.status ?? "available";
    }

    const searchKey = `${sourceRegion}\u0000${targetRegion}`;
    if (this.routeCacheEnabled) {
      if (this.routeCacheForMap !== knownReachable) {
        this.routeResultCache.clear();
        this.routeCacheForMap = knownReachable;
      }
      const cached = this.routeResultCache.get(searchKey);
      if (cached !== undefined) return cached;
    }
    if (this.canReachFromInProgress.has(searchKey)) {
      return "unavailable";
    }

    this.canReachFromInProgress.add(searchKey);
    try {
      const sourceStatus = knownSource?.status ?? "available";
      const routeStatus = this.searchRouteFromRegion(sourceRegion, targetRegion, knownSource?.linkState ?? "link");
      const result = minimumStatus(sourceStatus, routeStatus);
      if (this.routeCacheEnabled) {
        this.routeResultCache.set(searchKey, result);
      }
      return result;
    } finally {
      this.canReachFromInProgress.delete(searchKey);
    }
  }

  public calculateAll() {
    const reachableRegions = this.traverse();
    const { locationStatuses: locationsLogic, locationReasons } = this.evaluateLocations(reachableRegions);
    const entrancesLogic = this.evaluateEntrances(reachableRegions);
    return { locationsLogic, locationReasons, entrancesLogic };
  }

  // Memo: region → dungeon id (called per location per evaluation pass).
  private dungeonIdByRegion = new Map<string, string | undefined>();

  private getDungeonIdFromRegion(regionName: string): string | undefined {
    if (this.dungeonIdByRegion.has(regionName)) return this.dungeonIdByRegion.get(regionName);
    let result: string | undefined;
    for (const prefix of DOOR_PREFIXES) {
      if (regionName.startsWith(prefix)) {
        result = doorPrefixToDungeon[prefix];
        break;
      }
    }
    this.dungeonIdByRegion.set(regionName, result);
    return result;
  }

  private getDungeonIdFromPortal(portalName: string): string | undefined {
    for (const [prefix, dungeonId] of PORTAL_PREFIX_ENTRIES) {
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
        linkState: "link", // This might need tweaking if entrance shuffle and start in non-home world
      });
    }

    return {
      reachable,
      queue: [...startRegions],
      blockedExits: new Map(),
      pendingDungeons: new Map<string, Map<string, { linkState: LinkState; status: LogicStatus; keyCost: number; oolReasons?: string[] }>>(),
      allDiscoveredPortals: new Map<string, Map<string, { linkState: LinkState; status: LogicStatus; keyCost: number; oolReasons?: string[] }>>(),
      overworldKeyCost: new Map<string, number>(),
    };
  }

  /**
   * Compute the destination region's LinkState for a given exit transition.
   *
   * - Moon Pearl: always returns "link" regardless of destination.
   * - Overworld destinations (LightWorld/DarkWorld, or OWR-resolved): the
   *   destination's effective world determines link vs bunny. Superbunny
   *   never persists through an overworld return.
   * - Non-overworld destinations (entrance into a cave/dungeon/etc.): the
   *   player's current state is preserved by default. If they are currently
   *   a bunny but have the Mirror, they can mirror-cancel on the frame of
   *   entry to become a superbunny inside the entrance \u2014 gated by
   *   logicMode (in logic for owglitches/hybridglitches, a sequence break
   *   in noglitches) and by the per-exit `SUPERBUNNY_BLOCKED_EXITS` list.
   */
  private computeLinkStateForExit(
    currentLinkState: LinkState,
    exitType: string,
    exitName?: string,
    destRegionName?: string,
  ): LinkState {
    if (this.state.items.moonpearl.amount > 0) return "link"; // Never a bunny if we have moon pearl

    const isInverted = this.isInverted;
    const bunnyIf = (becomesBunny: boolean): LinkState => (becomesBunny ? "bunny" : "link");

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

        if (effectiveWorld === "dark") return bunnyIf(!isInverted);
        if (effectiveWorld === "light") return bunnyIf(isInverted);
      }
    }

    // Vanilla logic: bunny state determined by exit type
    if (exitType === "LightWorld") return bunnyIf(isInverted);
    if (exitType === "DarkWorld") return bunnyIf(!isInverted);

    // Non-overworld destination (cave/dungeon entrance). If currently a bunny
    // with the Mirror, the player can mirror-cancel on the frame of entry to
    // become a superbunny inside the entrance.
    if (
      currentLinkState === "bunny"
      && this.canSuperBunny()
      && this.state.items.mirror?.amount > 0
      && (!exitName || !SUPERBUNNY_BLOCKED_EXITS.has(exitName))
    ) {
      return "superbunny";
    }

    return currentLinkState;
  }

  /**
   * Whether superbunny entry is currently allowed. In logic for
   * overworldglitches/hybridglitches (and nologic), a sequence break in
   * noglitches gated by `settings.sequenceBreaks.canSuperBunny`.
   */
  private canSuperBunny(): boolean {
    const mode = this.state.settings.logicMode;
    if (mode !== "noglitches") return true;
    return !!this.state.settings.sequenceBreaks?.canSuperBunny;
  }

  /** Upgrade a region's reachability if the new values are better. Returns true if anything changed. */
  private updateIfBetter(regionName: string, newStatus: LogicStatus, newLinkState: LinkState, ctx: OverworldTraverserContext, newOolReasons?: string[]): boolean {
    const current = ctx.reachable.get(regionName);
    if (!current) return false; // Can't update non-existent region, shouldn't happen though

    const combinedLinkState = combineLinkStates(current.linkState, newLinkState);
    const combinedStatus = combineStatuses(current.status, newStatus);
    // Nothing improved — leave the region untouched.
    if (combinedLinkState === current.linkState && combinedStatus === current.status) return false;

    ctx.reachable.set(regionName, {
      status: combinedStatus,
      linkState: combinedLinkState,
      crystalStates: current.crystalStates,
      oolReasons: combinedStatus === "ool" ? mergeOolReasons(current.oolReasons, newOolReasons) : undefined,
    });

    // The region's reachability improved (better status and/or link state). Re-queue
    // it so its exits are re-evaluated and the improvement propagates downstream.
    // Without this, a region first reached via an "ool" (or bunny) path and later
    // upgraded to "available" would leave already-processed downstream regions stuck
    // at the worse status. Statuses and link states only ever improve monotonically,
    // so re-queueing is bounded and terminates.
    ctx.queue.push(regionName);
    return true;
  }

  /**
   * Evaluate exit requirements. When `forDiscovery` is true, uses the all-items
   * evaluator (partial mode) to discover portals reachable with full inventory.
   * Pass `reasons` to collect sequence-break keys when the result is "ool".
   */
  private evaluateExitRequirements(exit: ExitLogic[string], fromRegion: string, ctx: OverworldTraverserContext, forDiscovery = false, reasons?: Set<string>): LogicStatus {
    const evalCtx: EvaluationContext = {
      regionName: fromRegion,
      canReachRegion: (name: string) => ctx.reachable.get(name)?.status ?? "unavailable",
      canReachFromRegion: (source: string, target: string) => this.canReachFromRegion(source, target, ctx.reachable),
      effectiveWorldState: this.getEffectiveWorldState(fromRegion, exit.to),
      reasons: forDiscovery ? undefined : reasons,
    };

    const evaluator = forDiscovery ? (this.allItemsEvaluator ?? this.requirementEvaluator) : this.requirementEvaluator;
    return evaluator.evaluateWorldLogic(exit.requirements, evalCtx);
  }

  private processExit(exitName: string, exit: ExitLogic[string], fromRegion: string, fromRegionReachability: RegionReachability, ctx: OverworldTraverserContext): boolean {
    if (!exit?.to) return false;

    // OWR: Block flute exits to tiles whose effective world prevents flute usage.
    // In Open mode, can only flute to effectively-LW tiles.
    // In Inverted mode, can only flute to effectively-DW tiles.
    if (this.isOwrActive && this.metadata.fluteSpotExits.has(exitName)) {
      const destOwid = this.metadata.regionToOwid.get(exit.to);
      if (destOwid != null) {
        const effectiveWorld = this.getEffectiveWorld(destOwid);
        if ((!this.isInverted && effectiveWorld === "dark") || (this.isInverted && effectiveWorld === "light")) {
          return false; // Can't flute to this tile — wrong effective world
        }
      }
    }

    const recheckKey = `${fromRegion}|${exitName}`;
    const currentReachability = ctx.reachable.get(exit.to);

    // For dungeon exits in partial mode, use all-items evaluator to discover portals
    // that would be reachable with full inventory.
    // Collect reasons for non-dungeon exits so oolReasons can be propagated.
    const exitReasons = (exit.type !== "Dungeon") ? new Set<string>() : undefined;
    const exitStatus = this.evaluateExitRequirements(exit, fromRegion, ctx, exit.type === "Dungeon" && !!this.allItemsEvaluator, exitReasons);

    if (exitStatus === "unavailable") {
      ctx.blockedExits.set(recheckKey, { exitName, exit, from: fromRegion });
      return false;
    }

    if (exit.type === "Dungeon") {
      let madeProgress = false;
      const dungeonId = this.getDungeonIdFromPortal(exit.to);
      if (dungeonId) {
        const newLinkState = this.computeLinkStateForExit(fromRegionReachability.linkState, exit.type, exitName, exit.to);
        // For dungeon portals in partial mode, compute actual status with real
        // inventory (the exitStatus came from the all-items evaluator for discovery).
        const portalExitReasons = new Set<string>();
        const actualExitStatus = this.allItemsEvaluator ? this.evaluateExitRequirements(exit, fromRegion, ctx, false, portalExitReasons) : exitStatus;
        const newStatus = minimumStatus(fromRegionReachability.status, actualExitStatus === "unavailable" ? "unavailable" : actualExitStatus);
        const portalOolReasons = newStatus === "ool"
          ? mergeOolReasons(fromRegionReachability.oolReasons, portalExitReasons.size ? Array.from(portalExitReasons) : undefined)
          : undefined;

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
          ctx.pendingDungeons.get(dungeonId)!.set(exit.to, { linkState: newLinkState, status: newStatus, keyCost: regionKeyCost, oolReasons: portalOolReasons });
          ctx.allDiscoveredPortals.get(dungeonId)!.set(exit.to, { linkState: newLinkState, status: newStatus, keyCost: regionKeyCost, oolReasons: portalOolReasons });
          madeProgress = true;
        } else if (isBetterStatus(newStatus, existingPortal.status)) {
          // Update to better status. If the previous status was the partial-mode
          // discovery placeholder ("unavailable"), its link state is a fiction —
          // it defaults to "link" when the source region isn't actually reachable
          // (which happens for portals only reachable through a dungeon connector,
          // since the actual-inventory BFS skips Dungeon exits). Replace it with
          // the real reaching link state instead of combining, so a portal only
          // reachable as a bunny isn't wrongly upgraded to "link".
          const wasPlaceholder = existingPortal.status === "unavailable";
          existingPortal.status = newStatus;
          existingPortal.linkState = wasPlaceholder ? newLinkState : combineLinkStates(newLinkState, existingPortal.linkState);
          existingPortal.keyCost = Math.min(existingPortal.keyCost, regionKeyCost);
          existingPortal.oolReasons = portalOolReasons;
          ctx.pendingDungeons.get(dungeonId)!.set(exit.to, existingPortal);
          madeProgress = true;
        }

        // Keep the exit registered for re-evaluation until the portal reaches
        // "available" — its requirements (or the source region's status) may
        // still improve when other regions become reachable.
        const portalNow = ctx.allDiscoveredPortals.get(dungeonId)!.get(exit.to)!;
        if (portalNow.status === "available") {
          ctx.blockedExits.delete(recheckKey);
        } else {
          ctx.blockedExits.set(recheckKey, { exitName, exit, from: fromRegion });
        }
      }
      return madeProgress; // We process dungeon entrances separately
    }

    const newLinkState = this.computeLinkStateForExit(fromRegionReachability.linkState, exit.type, exitName, exit.to);
    const newStatus = minimumStatus(fromRegionReachability.status, exitStatus);
    const newOolReasons = newStatus === "ool"
      ? mergeOolReasons(fromRegionReachability.oolReasons, exitReasons?.size ? Array.from(exitReasons) : undefined)
      : undefined;

    let madeProgress: boolean;
    if (!currentReachability) {
      ctx.reachable.set(exit.to, {
        status: newStatus,
        linkState: newLinkState,
        oolReasons: newOolReasons,
      });
      ctx.queue.push(exit.to);
      madeProgress = true;
    } else {
      madeProgress = this.updateIfBetter(exit.to, newStatus, newLinkState, ctx, newOolReasons);
    }

    // An exit that didn't evaluate fully "available" (ool / possible) may still
    // improve when a canReach target becomes reachable — keep it registered so
    // re-evaluation can upgrade the destination later. Never downgrade.
    if (exitStatus === "available") {
      ctx.blockedExits.delete(recheckKey);
    } else {
      ctx.blockedExits.set(recheckKey, { exitName, exit, from: fromRegion });
    }

    return madeProgress;
  }

  private processPendingDungeons(ctx: OverworldTraverserContext): boolean {
    let madeProgress = false;

    for (const dungeonId of ctx.pendingDungeons.keys()) {
      // Use ALL discovered portals (not just new ones) for correct multi-entry status.
      const allPortals = ctx.allDiscoveredPortals.get(dungeonId);
      if (!allPortals || allPortals.size === 0) continue;

      const entryMap = new Map<string, { linkState: LinkState }>();
      const entryStatus = new Map<string, LogicStatus>();
      const entryKeyCost = new Map<string, number>();
      const entryOolReasons = new Map<string, string[]>();

      // Use ALL discovered portals for this dungeon
      for (const [portalName, portalData] of allPortals) {
        entryMap.set(portalName, {
          linkState: portalData.linkState,
        });
        entryStatus.set(portalName, portalData.status);
        entryKeyCost.set(portalName, portalData.keyCost);
        if (portalData.oolReasons?.length) {
          entryOolReasons.set(portalName, portalData.oolReasons);
        }
      }

      // Get dungeon keys and big key status
      const inventoryKeys = this.state.dungeons[dungeonId]?.smallKeys ?? 0;

      // Traverse the dungeon with a canReach callback for overworld regions.
      let dungeonTraverser = this.dungeonTraverserCache.get(dungeonId);
      if (!dungeonTraverser) {
        dungeonTraverser = new DungeonTraverser(this.state, this.logicSet, dungeonId, this.protection);
        this.dungeonTraverserCache.set(dungeonId, dungeonTraverser);
      }
      const canReachOverworldRegion = (regionName: string): LogicStatus => {
        const regionReach = ctx.reachable.get(regionName);
        if (!regionReach) return "unavailable";

        // If the player is a bunny (or superbunny) at this region, they can't interact
        // Return unavailable for non-link regions since canReach implies interaction
        if (regionReach.linkState !== "link") {
          return "unavailable";
        }

        return regionReach.status;
      };

      const result = dungeonTraverser.traverse(entryMap, entryStatus, inventoryKeys, entryKeyCost, canReachOverworldRegion, entryOolReasons);

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
        if (!existing || existing.status !== regionState.status) {
          // If the region was previously only "unavailable" (e.g. from an earlier
          // traversal seeded by a placeholder portal entry), its link state is a
          // fiction — adopt the new one rather than combining, so a genuinely
          // bunny-only dungeon region isn't wrongly upgraded to "link".
          const staleUnavailable = !!existing && existing.status === "unavailable";
          ctx.reachable.set(regionName, {
            status: regionState.status,
            // Combine link states when the region was already genuinely known;
            // otherwise adopt the dungeon's.
            linkState: existing && !staleUnavailable ? combineLinkStates(existing.linkState, regionState.linkState) : regionState.linkState,
            crystalStates: regionState.crystalStates,
            oolReasons: regionState.oolReasons,
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

        const newLink = this.computeLinkStateForExit(exitInfo.linkState, resolvedType, exitName, resolvedTo);
        if (!ctx.reachable.has(resolvedTo)) {
          ctx.reachable.set(resolvedTo, {
            status: exitInfo.status,
            linkState: newLink,
          });
          ctx.queue.push(resolvedTo);
          madeProgress = true;
        } else if (this.updateIfBetter(resolvedTo, exitInfo.status, newLink, ctx)) {
          // The region was already reached (possibly via a worse path, e.g. an
          // out-of-logic overworld route processed before dungeons ran). The
          // dungeon exit provides a better status/link state — upgrade it and
          // let updateIfBetter's re-queue propagate the improvement downstream.
          madeProgress = true;
        }
      }
    }

    // Clear processed dungeons
    ctx.pendingDungeons.clear();

    return madeProgress;
  }

  public evaluateLocations(reachable: Map<string, RegionReachability>): { locationStatuses: Record<string, LogicStatus>; locationReasons: Record<string, string[]> } {
    const locationStatuses: Record<string, LogicStatus> = {};
    const locationReasons: Record<string, string[]> = {};

    if (this.state.settings.logicMode === "nologic") {
      // Return all locations as available
      for (const regionLogic of Object.values(this.regions)) {
        if (!regionLogic.locations) continue;
        for (const locationName of Object.keys(regionLogic.locations)) {
          locationStatuses[locationName] = "available";
        }
      }
      return { locationStatuses, locationReasons };
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

        // Bunny: cannot interact with most locations.
        // Superbunny: can interact with locations unless they require swimming
        // (flippers) or damage-boosting (canTakeDamage) — those are blocked
        // inside resolveSimple/canTakeDamage when linkState === "superbunny".
        if (regionReachability?.linkState === "bunny" && !BUNNY_EXEMPT_LOCATIONS.has(locationName)) {
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

        const reasons = new Set<string>();
        const evalCtx: EvaluationContext = {
          regionName: regionName,
          dungeonId: this.getDungeonIdFromRegion(regionName),
          crystalStates: regionReachability.crystalStates,
          linkState: regionReachability.linkState,
          canReachRegion: (name: string) => reachable.get(name)?.status ?? "unavailable",
          canReachFromRegion: (source: string, target: string) => this.canReachFromRegion(source, target, reachable),
          effectiveWorldState: this.getEffectiveWorldState(regionName),
          reasons,
        };

        const locationStatus = this.requirementEvaluator.evaluateWorldLogic(locationLogic.requirements, evalCtx);
        let finalStatus = minimumStatus(regionReachability.status, locationStatus);
        // In noglitches, superbunny is a sequence break — cap all accessible locations at ool.
        if (regionReachability.linkState === "superbunny" && this.state.settings.logicMode === "noglitches") {
          finalStatus = minimumStatus(finalStatus, "ool");
          if (finalStatus === "ool") reasons.add("canMirrorSuperBunny");
        }
        // Merge region-level ool reasons (e.g. from dungeon traversal: die-to-revive, hover)
        if (finalStatus === "ool" && regionReachability.oolReasons) {
          for (const r of regionReachability.oolReasons) reasons.add(r);
        }
        // The Hyrule Castle big key drops from a guard in a fixed, early spot.
        // With vanilla doors and unshuffled enemy drops it is guaranteed to be
        // there, so it must not be downgraded by small-key contention — if the
        // room is reachable at all, the drop is obtainable.
        if (
          locationName === "Hyrule Castle - Big Key Drop" &&
          this.state.settings.enemyDrop === "none" &&
          this.state.settings.doors === "vanilla" &&
          finalStatus !== "unavailable"
        ) {
          finalStatus = "available";
        }
        locationStatuses[locationName] = finalStatus;
        if (finalStatus === "ool" && reasons.size > 0) {
          locationReasons[locationName] = Array.from(reasons);
        }
      }
    }

    // Post-process: Apply key inference for non-wild big/small keys.
    // When a key type is NOT in the world pool, infer whether key-locked
    // locations are accessible based on whether the player can reach all
    // potential key locations in the dungeon.
    type KeyInferencePass = {
      enabled: boolean;
      keyType: "bigKey" | "smallKey";
      gatedRegions: Map<string, Set<string>>;
      isLocked: (locationName: string, regionName: string, gated: Set<string> | undefined) => boolean;
    };
    const passes: KeyInferencePass[] = [
      {
        enabled: !this.state.settings.wildBigKeys,
        keyType: "bigKey",
        gatedRegions: this.dungeonBigKeyGatedRegions,
        isLocked: (locationName, regionName, gated) =>
          (gated?.has(regionName) ?? false) || locationName.includes("Big Chest"),
      },
      {
        enabled: this.state.settings.wildSmallKeys === "inDungeon",
        keyType: "smallKey",
        gatedRegions: this.dungeonSmallKeyGatedRegions,
        isLocked: (_locationName, regionName, gated) => gated?.has(regionName) ?? false,
      },
    ];

    for (const pass of passes) {
      if (!pass.enabled) continue;
      const availabilityMap = this.computeDungeonKeyAvailability(locationStatuses, pass.keyType);

      for (const [regionName, regionLogic] of Object.entries(this.regions)) {
        if (!regionLogic.locations || regionLogic.type !== "Dungeon") continue;
        const dungeonId = this.getDungeonIdFromRegion(regionName);
        if (!dungeonId) continue;
        const availability = availabilityMap.get(dungeonId);
        if (!availability || availability === "available") continue;

        const gated = pass.gatedRegions.get(dungeonId);
        for (const locationName of Object.keys(regionLogic.locations)) {
          if (pass.isLocked(locationName, regionName, gated) && locationStatuses[locationName] !== undefined) {
            locationStatuses[locationName] = minimumStatus(locationStatuses[locationName], availability);
          }
        }
      }
    }

    return { locationStatuses, locationReasons };
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
          linkState: regionReachability.linkState,
          canReachRegion: (name: string) => reachable.get(name)?.status ?? "unavailable",
          canReachFromRegion: (source: string, target: string) => this.canReachFromRegion(source, target, reachable),
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
        const hasPotteryKeys = isPotteryKeyShuffle(this.state.settings.pottery) && (dungeonData?.keypots ?? 0) > 0;
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
          if (locationName.endsWith("Pot Key") && !isPotteryKeyShuffle(this.state.settings.pottery)) continue;

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

  /**
   * Re-evaluate exits registered for re-checking (unavailable / ool / possible
   * results). Routes through processExit so:
   * - already-reached destinations are upgraded (never downgraded) via updateIfBetter,
   * - Dungeon-type exits go through the portal/pendingDungeons path (with the
   *   discovery evaluator) instead of leaking interior regions into the BFS,
   * - exits self-manage their registration (dropped once fully "available").
   */
  private reevaluateBlockedExits(ctx: OverworldTraverserContext): boolean {
    let madeProgress = false;

    // Snapshot: processExit mutates ctx.blockedExits while we iterate.
    for (const { exitName, exit, from } of Array.from(ctx.blockedExits.values())) {
      if (!exit?.to) {
        ctx.blockedExits.delete(`${from}|${exitName}`);
        continue; // Severed exit, drop it
      }

      const fromRegionReachability = ctx.reachable.get(from);
      if (!fromRegionReachability) continue; // Wait until the source region is reached

      if (this.processExit(exitName, exit, from, fromRegionReachability, ctx)) {
        madeProgress = true;
      }
    }
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
    const actuallyReachable = new Map<string, LinkState>();
    const actualQueue = ["Menu", "Flute Sky"];
    for (const r of actualQueue) actuallyReachable.set(r, "link");

    while (actualQueue.length > 0) {
      const current = actualQueue.shift()!;
      const regionLogic = this.regions[current];
      if (!regionLogic?.exits) continue;

      for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
        if (!exit?.to || exit.type === "Dungeon") continue;

        const evalCtx: EvaluationContext = {
          regionName: current,
          canReachRegion: (name: string) => (actuallyReachable.has(name) ? "available" : "unavailable"),
          canReachFromRegion: (source: string, target: string) => this.canReachFromRegion(source, target),
          effectiveWorldState: this.getEffectiveWorldState(current, exit.to),
        };
        const status = this.requirementEvaluator.evaluateWorldLogic(exit.requirements, evalCtx);

        if (status !== "unavailable" && !actuallyReachable.has(exit.to)) {
          const currentLink = actuallyReachable.get(current) ?? "link";
          const newLink = this.computeLinkStateForExit(currentLink, exit.type ?? "LightWorld", exitName, exit.to);
          actuallyReachable.set(exit.to, newLink);
          actualQueue.push(exit.to);
        }
      }
    }

    // BFS with all-items to find ALL dungeon portals.
    const visited = new Set<string>(["Menu", "Flute Sky"]);
    const queue = ["Menu", "Flute Sky"];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const regionLogic = this.regions[current];
      if (!regionLogic?.exits) continue;

      for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
        if (!exit?.to) continue;

        const evalCtx: EvaluationContext = {
          regionName: current,
          canReachRegion: (name: string) => (visited.has(name) ? "available" : "unavailable"),
          canReachFromRegion: (source: string, target: string) => this.canReachFromRegion(source, target),
          effectiveWorldState: this.getEffectiveWorldState(current, exit.to),
        };
        const status = this.allItemsEvaluator.evaluateWorldLogic(exit.requirements, evalCtx);
        if (status === "unavailable") continue;

        if (exit.type === "Dungeon") {
          const dungeonId = this.getDungeonIdFromPortal(exit.to);
          if (!dungeonId) continue;
          if (!ctx.allDiscoveredPortals.has(dungeonId)) {
            ctx.allDiscoveredPortals.set(dungeonId, new Map());
          }
          if (!ctx.allDiscoveredPortals.get(dungeonId)!.has(exit.to)) {
            // Status starts as "unavailable" — main BFS upgrades it. Link
            // state is computed from the actual-reachable source if known.
            const portalLink = actuallyReachable.has(current)
              ? this.computeLinkStateForExit(actuallyReachable.get(current) ?? "link", exit.type ?? "Dungeon", exitName, exit.to)
              : "link";
            ctx.allDiscoveredPortals.get(dungeonId)!.set(exit.to, {
              linkState: portalLink,
              status: "unavailable",
              keyCost: 0,
            });
          }
          continue;
        }

        if (!visited.has(exit.to)) {
          visited.add(exit.to);
          queue.push(exit.to);
        }
      }
    }
  }

  public traverse(): Map<string, RegionReachability> {
    this.routeCacheEnabled = false;
    this.routeResultCache.clear();
    const ctx = this.initStartRegions();

    // In partial mode, first discover all reachable portals with all-items
    if (this.protection === "partial") {
      this.discoverAllPortals(ctx);
    }

    let madeProgress = true;

    while (madeProgress) {
      madeProgress = false;

      const reachableBefore = ctx.reachable.size;

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

      // If new overworld regions were discovered in BFS (e.g. via dungeon
      // external exits from the previous iteration), re-queue all known
      // dungeons so their canReachOverworldRegion callbacks see the updated state.
      if (ctx.reachable.size > reachableBefore && ctx.allDiscoveredPortals.size > 0) {
        for (const [dungeonId, portals] of ctx.allDiscoveredPortals) {
          if (!ctx.pendingDungeons.has(dungeonId)) {
            ctx.pendingDungeons.set(dungeonId, new Map(portals));
          }
        }
      }

      madeProgress = this.processPendingDungeons(ctx);

      if (this.reevaluateBlockedExits(ctx)) {
        madeProgress = true;
      }
    }
    // The reachable map is now at its fixed point — canReachFrom route
    // searches over it are stable and safe to memoize for the (much hotter)
    // location/entrance evaluation passes.
    this.routeCacheEnabled = true;
    return ctx.reachable;
  }
}
