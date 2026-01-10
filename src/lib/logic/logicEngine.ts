import type { ItemsState } from "@/store/itemsSlice";
import type { LogicSet } from "./logicMapper";
import type { LogicRequirement, LogicStatus, WorldLogic, LogicState, OverworldRegionLogic, ExitLogic } from "@/data/logic/logicTypes";
import type { SettingsState } from "@/store/settingsSlice";
import type { DungeonsState } from "@/store/dungeonsSlice";
import type { EntrancesState } from "@/store/entrancesSlice";
import { locationsData } from "@/data/locationsData";

interface GameState {
  items: ItemsState;
  settings: SettingsState;
  dungeons: DungeonsState;
  entrances: EntrancesState;
}

interface EvaluationContext {
  dungeonId?: string;
  regionName?: string;
  /** Whether the player is a bunny in this context (dynamically computed) */
  isBunny?: boolean;
}

/**
 * Debug options for path tracing
 */
export interface DebugOptions {
  enabled: boolean;
  targetLocation?: string;
  verbose?: boolean;
}

/**
 * Represents a step in the path to a location
 */
export interface PathStep {
  type: "region" | "exit" | "key_door" | "key_collect" | "key_use" | "location" | "requirement";
  from?: string;
  to?: string;
  name?: string;
  status?: LogicStatus;
  keysAvailable?: number;
  keysUsed?: number;
  details?: string;
  requirements?: string;
  requirementsMet?: boolean;
}

/**
 * Full path trace result
 */
export interface PathTrace {
  location: string;
  status: LogicStatus;
  reachable: boolean;
  steps: PathStep[];
  summary: string;
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

export class LogicEngine {
  private state: GameState;
  private logicSet: LogicSet;

  // Store evaluated regions to avoid infinite loops and redundant calculations
  private regionStatuses: Map<string, LogicStatus> = new Map();
  private locationStatuses: Map<string, LogicStatus> = new Map();
  private entranceStatuses: Map<string, LogicStatus> = new Map();
  private reachableRegions: Set<string> = new Set();
  private assumingSmallKey = false;

  /**
   * Tracks whether each region can be reached without being a bunny.
   * A region is marked as non-bunny (false) if ANY path to it allows non-bunny access.
   * This handles multi-entrance caves where one entrance is in DW but the cave
   * connects to LW, allowing the player to enter from LW without being a bunny.
   */
  private regionBunnyState: Map<string, boolean> = new Map();

  /**
   * Locations that can be obtained even as a bunny (no interaction required).
   * These locations ignore the moon pearl requirement even if in bunny state.
   */
  private bunnyExemptLocations: Set<string> = new Set();

  // Debug/path tracing support
  private debugOptions: DebugOptions = { enabled: false };
  private regionPaths: Map<string, PathStep[]> = new Map();

  constructor(state: GameState, logicSet: LogicSet, debugOptions?: DebugOptions) {
    this.state = state;
    this.logicSet = logicSet;
    if (debugOptions) {
      this.debugOptions = debugOptions;
    }
  }

  /**
   * Traces the path to a specific location, returning detailed information
   * about how the location is reached including key collection and usage.
   */
  public tracePathToLocation(locationName: string): PathTrace {
    // Enable debug mode for this trace
    this.debugOptions = { enabled: true, targetLocation: locationName, verbose: true };
    this.regionPaths.clear();

    // Run the full calculation to populate all statuses
    this.calculateAll();

    // Find which region contains this location
    const regions = this.logicSet.regions as Record<string, OverworldRegionLogic>;
    let locationRegion: string | undefined;
    let locationData: { requirements: WorldLogic; type?: string } | undefined;

    for (const [regionName, region] of Object.entries(regions)) {
      if (region.locations && region.locations[locationName]) {
        locationRegion = regionName;
        locationData = region.locations[locationName];
        break;
      }
    }

    const status = this.locationStatuses.get(locationName) || "unavailable";
    const reachable = locationRegion ? this.reachableRegions.has(locationRegion) : false;

    // Build the path trace
    const steps: PathStep[] = [];

    if (!locationRegion) {
      steps.push({
        type: "location",
        name: locationName,
        status: "unavailable",
        details: "Location not found in any region"
      });
    } else {
      // Add region path steps
      const regionPath = this.regionPaths.get(locationRegion);
      if (regionPath) {
        steps.push(...regionPath);
      } else if (reachable) {
        steps.push({
          type: "region",
          name: locationRegion,
          status: this.regionStatuses.get(locationRegion) || "unavailable",
          details: `Region ${locationRegion} is reachable`
        });
      } else {
        steps.push({
          type: "region",
          name: locationRegion,
          status: "unavailable",
          details: `Region ${locationRegion} is NOT reachable`
        });
      }

      // Add location requirements evaluation
      if (locationData) {
        const ctx: EvaluationContext = { regionName: locationRegion };
        const reqStatus = this.evaluateWorldLogic(locationData.requirements, ctx);
        const logicState = this.getLogicState(locationData.requirements);
        
        steps.push({
          type: "location",
          name: locationName,
          status: reqStatus,
          requirements: this.formatRequirements(logicState),
          requirementsMet: reqStatus === "available",
          details: `Location requirements: ${reqStatus}`
        });
      }
    }

    // Generate summary
    const summary = this.generatePathSummary(locationName, status, reachable, steps);

    return {
      location: locationName,
      status,
      reachable,
      steps,
      summary
    };
  }

  private formatRequirements(logicState: LogicState): string {
    const parts: string[] = [];
    if (logicState.always) {
      parts.push(`always: ${this.formatRequirement(logicState.always)}`);
    }
    if (logicState.logical) {
      parts.push(`logical: ${this.formatRequirement(logicState.logical)}`);
    }
    if (logicState.required) {
      parts.push(`required: ${this.formatRequirement(logicState.required)}`);
    }
    return parts.join("; ") || "(no requirements)";
  }

  private formatRequirement(req: LogicRequirement): string {
    if (!req) return "none";
    if (typeof req === "string") return req;
    if ("allOf" in req && req.allOf) {
      return `(${req.allOf.map(r => this.formatRequirement(r)).join(" AND ")})`;
    }
    if ("anyOf" in req && req.anyOf) {
      return `(${req.anyOf.map(r => this.formatRequirement(r)).join(" OR ")})`;
    }
    return JSON.stringify(req);
  }

  private generatePathSummary(locationName: string, status: LogicStatus, reachable: boolean, steps: PathStep[]): string {
    const lines: string[] = [];
    lines.push(`=== Path Trace for: ${locationName} ===`);
    lines.push(`Final Status: ${status.toUpperCase()}`);
    lines.push(`Region Reachable: ${reachable ? "YES" : "NO"}`);
    lines.push("");
    lines.push("--- Path Steps ---");
    
    for (const step of steps) {
      switch (step.type) {
        case "region":
          lines.push(`[REGION] ${step.name} - ${step.status}${step.details ? ` (${step.details})` : ""}`);
          break;
        case "exit":
          lines.push(`  → [EXIT] ${step.from} → ${step.to} - ${step.status}`);
          if (step.requirements) {
            lines.push(`      Requirements: ${step.requirements}`);
          }
          break;
        case "key_door":
          lines.push(`  🔑 [KEY DOOR] ${step.from} → ${step.to}`);
          lines.push(`      Keys available: ${step.keysAvailable}, Keys used: ${step.keysUsed}`);
          break;
        case "key_collect":
          lines.push(`  ✓ [KEY COLLECTED] ${step.name} (now have ${step.keysAvailable} keys)`);
          break;
        case "key_use":
          lines.push(`  ✗ [KEY USED] Opening door to ${step.to} (${step.keysAvailable} keys remaining)`);
          break;
        case "location":
          lines.push(`[LOCATION] ${step.name} - ${step.status}`);
          if (step.requirements) {
            lines.push(`  Requirements: ${step.requirements}`);
          }
          lines.push(`  Requirements Met: ${step.requirementsMet ? "YES" : "NO"}`);
          break;
        case "requirement":
          lines.push(`  [REQ] ${step.details} - ${step.requirementsMet ? "MET" : "NOT MET"}`);
          break;
      }
    }

    lines.push("");
    lines.push("=== End Path Trace ===");
    return lines.join("\n");
  }

  private recordRegionPath(regionName: string, steps: PathStep[]): void {
    if (this.debugOptions.enabled && !this.regionPaths.has(regionName)) {
      this.regionPaths.set(regionName, [...steps]);
    }
  }

  /**
   * Builds full paths from start to each reachable region using parent tracking
   */
  private buildRegionPaths(
    regionParent: Map<string, { from: string; via: string; isKeyDoor: boolean }>,
    reachable: Set<string>,
    regions: Record<string, OverworldRegionLogic>
  ): void {
    for (const regionName of reachable) {
      if (this.regionPaths.has(regionName)) continue;

      // Build path by walking back through parents
      const pathToRegion: PathStep[] = [];
      const pathRegions: string[] = [];
      let current: string | undefined = regionName;

      while (current && !this.regionPaths.has(current)) {
        pathRegions.unshift(current);
        const parent = regionParent.get(current);
        current = parent?.from;
      }

      // If we found an existing path, start from there
      if (current && this.regionPaths.has(current)) {
        pathToRegion.push(...this.regionPaths.get(current)!);
      }

      // Track key counts per dungeon as we build the path
      const dungeonKeyCount: Record<string, number> = {};
      const dungeonKeysUsed: Record<string, number> = {};

      // Count keys already collected in the existing path
      for (const step of pathToRegion) {
        if (step.type === "key_collect" && step.name) {
          const keyDungeonId = this.getDungeonFromKeyLocation(step.name);
          if (keyDungeonId) {
            dungeonKeyCount[keyDungeonId] = (dungeonKeyCount[keyDungeonId] || 0) + 1;
          }
        } else if (step.type === "key_door" && step.from) {
          const doorDungeonId = this.getDungeonFromRegion(step.from);
          if (doorDungeonId) {
            dungeonKeysUsed[doorDungeonId] = (dungeonKeysUsed[doorDungeonId] || 0) + 1;
          }
        }
      }

      // Now build the rest of the path
      for (const reg of pathRegions) {
        const parent = regionParent.get(reg);
        const status = this.regionStatuses.get(reg) || "unavailable";
        const dungeonId = this.getDungeonFromRegion(reg);

        if (parent) {
          if (parent.isKeyDoor) {
            // Track key usage for this dungeon
            const doorDungeonId = this.getDungeonFromRegion(parent.from) || dungeonId;
            if (doorDungeonId) {
              dungeonKeysUsed[doorDungeonId] = (dungeonKeysUsed[doorDungeonId] || 0) + 1;
            }
            
            // Get inventory keys for this dungeon
            const inventoryKeys = doorDungeonId ? (this.state.dungeons[doorDungeonId]?.smallKeys || 0) : 0;
            const collectedKeys = doorDungeonId ? (dungeonKeyCount[doorDungeonId] || 0) : 0;
            const usedKeys = doorDungeonId ? (dungeonKeysUsed[doorDungeonId] || 0) : 0;
            const keysAvailable = inventoryKeys + collectedKeys;
            
            pathToRegion.push({
              type: "key_door",
              from: parent.from,
              to: reg,
              status,
              keysAvailable,
              keysUsed: usedKeys,
              details: parent.via
            });
          } else {
            // Check if this is an exit with requirements
            const fromRegion = regions[parent.from];
            let reqString = "";
            if (fromRegion?.exits) {
              for (const [, exit] of Object.entries(fromRegion.exits)) {
                if (exit.to === reg) {
                  const logicState = this.getLogicState(exit.requirements);
                  reqString = this.formatRequirements(logicState);
                  break;
                }
              }
            }
            pathToRegion.push({
              type: "exit",
              from: parent.from,
              to: reg,
              status,
              requirements: reqString || undefined,
              details: dungeonId ? `Dungeon: ${dungeonId}` : undefined
            });
          }
        }

        pathToRegion.push({
          type: "region",
          name: reg,
          status,
          details: dungeonId ? `Part of dungeon: ${dungeonId}` : undefined
        });

        // Check for key locations in this region
        const regionData = regions[reg];
        if (regionData?.locations && dungeonId) {
          for (const [locName] of Object.entries(regionData.locations)) {
            if (this.isKeyLocation(locName) && this.getDungeonFromRegion(reg) === dungeonId) {
              // Track key collection
              dungeonKeyCount[dungeonId] = (dungeonKeyCount[dungeonId] || 0) + 1;
              const inventoryKeys = this.state.dungeons[dungeonId]?.smallKeys || 0;
              const collectedKeys = dungeonKeyCount[dungeonId] || 0;
              
              pathToRegion.push({
                type: "key_collect",
                name: locName,
                keysAvailable: inventoryKeys + collectedKeys,
                details: `Key available in ${reg}`
              });
            }
          }
        }
      }

      this.regionPaths.set(regionName, pathToRegion);
    }
  }

  /**
   * Gets the dungeon ID from a key location name
   */
  private getDungeonFromKeyLocation(locName: string): string | undefined {
    for (const [prefix, dungeonId] of Object.entries(doorPrefixToDungeon)) {
      if (locName.startsWith(prefix)) return dungeonId;
    }
    return undefined;
  }

  public calculateAll(): Record<"locationsLogic" | "entrancesLogic", Record<string, LogicStatus>> {
    this.regionStatuses.clear();
    this.locationStatuses.clear();
    this.entranceStatuses.clear();
    this.regionBunnyState.clear();

    // Pre-calculate all regions to populate cache
    // Object.keys(this.logicSet.regions).forEach((r) => this.evaluateRegion(r));

    // Actually calculate locations and entrances
    this.reachableRegions = this.computeReachableRegions();
    // Get all locations
    const allLocationsStatuses: Record<string, LogicStatus> = {};
    const logicDefault = this.state.settings.logicMode === "nologic" ? "available" : "unavailable";
    Object.keys(locationsData).map((locationKey) => {
      const location = locationsData[locationKey];
      for (const l of Object.values(location.itemLocations)) {
        allLocationsStatuses[l] = logicDefault as LogicStatus;
      }
    });
    if (this.state.settings.logicMode === "nologic") {
      return {
        locationsLogic: allLocationsStatuses,
        entrancesLogic: {},
      };
    }
    const logicObjects = {
      locationsLogic: { ...allLocationsStatuses, ...Object.fromEntries(this.locationStatuses) },
      entrancesLogic: Object.fromEntries(this.entranceStatuses),
    };
    return logicObjects;
  }

  // Precompute all reachable regions from the start region using BFS
  private computeReachableRegions(): Set<string> {
    // All exits out of flute sky require canFlute, so we start from both Menu and Flute Sky
    const startRegions = ["Menu", "Flute Sky"];
    const regions = this.logicSet.regions as Record<string, OverworldRegionLogic>;

    // Clear reachableRegions to ensure clean state for evaluateRegion
    this.reachableRegions.clear();

    const reachable = new Set<string>(startRegions);
    const queue = [...startRegions];

    // Initialize statuses
    for (const region of startRegions) {
      this.regionStatuses.set(region, "available");
      // TOOD: Check is this matters
      // Start regions (Menu, Flute Sky) are never bunny - they are meta-regions
      this.regionBunnyState.set(region, false);
      // Record initial path for start regions
      if (this.debugOptions.enabled) {
        this.recordRegionPath(region, [{
          type: "region",
          name: region,
          status: "available",
          details: "Starting region"
        }]);
      }
    }

    // Track path to each region (for debug mode)
    const regionParent: Map<string, { from: string; via: string; isKeyDoor: boolean }> = new Map();

    // Store blocked exits to re-evaluate later
    let blockedExits: { exit: ExitLogic[string]; from: string }[] = [];

    // Key door tracking per dungeon
    type KeyDoorInfo = { exit: ExitLogic[string]; from: string; dungeonId: string };
    let pendingKeyDoors: KeyDoorInfo[] = [];

    // Track keys spent per dungeon across iterations
    const spentKeys: Record<string, number> = {};

    // Track dungeons that have been seen with multiple depth-1 doors (branching dungeons)
    // Once a dungeon is marked as branching, it should never be treated as linear
    const branchingDungeons = new Set<string>();

    // Helper to check if we should process keys
    const processKeys = this.state.settings.wildSmallKeys === "wild";

    // Phase 1: Explore all regions reachable without using any small keys
    while (queue.length > 0) {
      const current = queue.shift()!;
      const regionLogic = regions[current];
      const currentStatus = this.regionStatuses.get(current) || "unavailable";

      if (regionLogic && regionLogic.exits) {
        for (const exit of Object.values(regionLogic.exits)) {
          if (!exit || !exit.to) continue;

          // Check if already reachable - but still update bunny state if we found a better path
          if (reachable.has(exit.to)) {
            // Even if already reachable, check if this path offers non-bunny access
            const currentBunny = this.getRegionBunnyState(current);
            const newBunny = this.computeBunnyStateForTransition(currentBunny, exit.type);
            // Only update if this path is better (non-bunny) and exit is reachable
            if (!newBunny && this.getRegionBunnyState(exit.to)) {
              // Check if we can actually take this exit
              this.assumingSmallKey = false;
              const requirements = this.getLogicState(exit.requirements);
              const status = this.evaluateLogicState(requirements, { regionName: current });
              if (status === "available") {
                this.updateRegionBunnyState(exit.to, false);
              }
            }
            continue;
          }

          // Check normal availability (no key assumption)
          this.assumingSmallKey = false;
          const requirements = this.getLogicState(exit.requirements);
          const status = this.evaluateLogicState(requirements, { regionName: current });

          if (status === "available") {
            reachable.add(exit.to);
            // console.log(`${exit.to} is reachable from ${current}`);
            this.regionStatuses.set(exit.to, this.getLimitedStatus("available", currentStatus));
            queue.push(exit.to);
            // Compute and update bunny state for this transition
            const currentBunny = this.getRegionBunnyState(current);
            const newBunny = this.computeBunnyStateForTransition(currentBunny, exit.type);
            this.updateRegionBunnyState(exit.to, newBunny);
            // Track path for debug mode - always track parent so we can build full paths
            if (this.debugOptions.enabled && !regionParent.has(exit.to)) {
              regionParent.set(exit.to, { from: current, via: "exit", isKeyDoor: false });
            }
          } else {
            // Check if it's a key door
            // TODO: can we replace this with a _sane_ check where we just check the logic requirements for "smallkey"?
            if (processKeys) {
              this.assumingSmallKey = true;
              const statusWithKey = this.evaluateLogicState(requirements, { regionName: current });
              this.assumingSmallKey = false;

              if (statusWithKey === "available") {
                const dungeonId = this.getDungeonFromRegion(current);
                if (dungeonId) {
                  pendingKeyDoors.push({ exit, from: current, dungeonId });
                  continue;
                }
              }
            }
            blockedExits.push({ exit, from: current });
          }
        }
      }
    }

    // Phase 2: Process key doors with proper key logic per dungeon
    if (processKeys) {
      let madeProgress = true;

      while (madeProgress) {
        madeProgress = false;

        // Re-evaluate blocked exits first (they might now be reachable)
        const nextBlockedExits: typeof blockedExits = [];
        for (const item of blockedExits) {
          const { exit, from } = item;

          if (reachable.has(exit.to)) continue;

          this.assumingSmallKey = false;
          const requirements = this.getLogicState(exit.requirements);
          const status = this.evaluateLogicState(requirements, { regionName: from });

          if (status === "available") {
            reachable.add(exit.to);
            const fromStatus = this.regionStatuses.get(from) || "unavailable";
            this.regionStatuses.set(exit.to, this.getLimitedStatus("available", fromStatus));
            queue.push(exit.to);
            madeProgress = true;
            // Compute and update bunny state for this transition
            const currentBunny = this.getRegionBunnyState(from);
            const newBunny = this.computeBunnyStateForTransition(currentBunny, exit.type);
            this.updateRegionBunnyState(exit.to, newBunny);
            // Track path for debug mode
            if (this.debugOptions.enabled && !regionParent.has(exit.to)) {
              regionParent.set(exit.to, { from, via: "exit", isKeyDoor: false });
            }
          } else {
            // Check if it became a key door
            this.assumingSmallKey = true;
            const statusWithKey = this.evaluateLogicState(requirements, { regionName: from });
            this.assumingSmallKey = false;

            if (statusWithKey === "available") {
              const dungeonId = this.getDungeonFromRegion(from);
              if (dungeonId) {
                pendingKeyDoors.push({ exit, from, dungeonId });
                continue;
              }
            }
            nextBlockedExits.push(item);
          }
        }
        blockedExits = nextBlockedExits;

        // Process newly reachable regions from blocked exits
        while (queue.length > 0) {
          const current = queue.shift()!;
          const regionLogic = regions[current];
          const currentStatus = this.regionStatuses.get(current) || "unavailable";

          if (regionLogic && regionLogic.exits) {
            for (const exit of Object.values(regionLogic.exits)) {
              if (!exit || !exit.to || reachable.has(exit.to)) continue;

              this.assumingSmallKey = false;
              const requirements = this.getLogicState(exit.requirements);
              const status = this.evaluateLogicState(requirements, { regionName: current });

              if (status === "available") {
                reachable.add(exit.to);
                this.regionStatuses.set(exit.to, this.getLimitedStatus("available", currentStatus));
                queue.push(exit.to);
                // Compute and update bunny state for this transition
                const currentBunny = this.getRegionBunnyState(current);
                const newBunny = this.computeBunnyStateForTransition(currentBunny, exit.type);
                this.updateRegionBunnyState(exit.to, newBunny);
                // Track path for debug mode
                if (this.debugOptions.enabled && !regionParent.has(exit.to)) {
                  regionParent.set(exit.to, { from: current, via: "exit", isKeyDoor: false });
                }
              } else if (processKeys) {
                this.assumingSmallKey = true;
                const statusWithKey = this.evaluateLogicState(requirements, { regionName: current });
                this.assumingSmallKey = false;

                if (statusWithKey === "available") {
                  const dungeonId = this.getDungeonFromRegion(current);
                  if (dungeonId) {
                    pendingKeyDoors.push({ exit, from: current, dungeonId });
                  }
                } else {
                  blockedExits.push({ exit, from: current });
                }
              } else {
                blockedExits.push({ exit, from: current });
              }
            }
          }
        }

        // Group key doors by dungeon
        const doorsByDungeon: Record<string, KeyDoorInfo[]> = {};
        for (const door of pendingKeyDoors) {
          if (!doorsByDungeon[door.dungeonId]) doorsByDungeon[door.dungeonId] = [];
          doorsByDungeon[door.dungeonId].push(door);
        }

        // Process each dungeon's key doors
        for (const [dungeonId, allDungeonDoors] of Object.entries(doorsByDungeon)) {
          // Filter to only accessible key doors (from regions we can reach)
          const accessibleDoors = allDungeonDoors.filter(
            (d) => reachable.has(d.from) && !reachable.has(d.exit.to)
          );

          if (accessibleDoors.length === 0) continue;

          // Count available keys - include keys from "possible" regions since we could reach them with optimal play
          const inventoryKeys = this.state.dungeons[dungeonId]?.smallKeys || 0;
          const foundKeys = this.countReachableKeys(reachable, dungeonId, true); // includePossible = true
          const guaranteedKeys = this.countReachableKeys(reachable, dungeonId, false); // only from "available" regions
          const spent = spentKeys[dungeonId] || 0;
          const availableKeys = inventoryKeys + foundKeys - spent;
          const guaranteedAvailableKeys = inventoryKeys + guaranteedKeys - spent;

          if (availableKeys <= 0) continue;

          // Determine the status for regions behind key doors
          const keyDoorStatus = this.analyzeKeyDoorStatus(
            dungeonId,
            accessibleDoors,
            availableKeys,
            guaranteedAvailableKeys,
            reachable,
            regions,
            branchingDungeons
          );

          // Add discovered regions with their statuses
          // First, identify key door targets so we can trace paths from them
          const keyDoorTargets = new Set<string>();
          for (const door of accessibleDoors) {
            if (keyDoorStatus.regionsDiscovered.has(door.exit.to)) {
              keyDoorTargets.add(door.exit.to);
            }
          }

          for (const [region, status] of keyDoorStatus.regionsDiscovered) {
            if (!reachable.has(region)) {
              reachable.add(region);
              this.regionStatuses.set(region, status);
              queue.push(region);
              madeProgress = true;
              // For key door targets, compute bunny state from the door that led here
              const doorUsed = accessibleDoors.find(d => d.exit.to === region);
              if (doorUsed) {
                const fromBunny = this.getRegionBunnyState(doorUsed.from);
                const newBunny = this.computeBunnyStateForTransition(fromBunny, doorUsed.exit.type);
                this.updateRegionBunnyState(region, newBunny);
              }
              // Track path for debug mode - record key door information for direct key door targets
              if (this.debugOptions.enabled) {
                // Find which door led to this region
                if (doorUsed) {
                  regionParent.set(region, { 
                    from: doorUsed.from, 
                    via: `key_door (dungeon: ${dungeonId}, keys: ${availableKeys}, status: ${status})`, 
                    isKeyDoor: true 
                  });
                }
              }
            }
          }

          // Track paths for regions discovered behind key doors (not direct key door targets)
          // by doing a mini-BFS from each key door target
          if (this.debugOptions.enabled) {
            for (const keyDoorTarget of keyDoorTargets) {
              this.tracePathsFromRegion(
                keyDoorTarget,
                keyDoorStatus.regionsDiscovered,
                regions,
                regionParent
              );
            }
          }

          // Update spent keys
          spentKeys[dungeonId] = (spentKeys[dungeonId] || 0) + keyDoorStatus.keysUsed;

          // Remove doors to discovered regions from pending
          pendingKeyDoors = pendingKeyDoors.filter((d) => !keyDoorStatus.regionsDiscovered.has(d.exit.to));
        }

        // Process newly reachable regions from key doors
        while (queue.length > 0) {
          const current = queue.shift()!;
          const regionLogic = regions[current];
          const currentStatus = this.regionStatuses.get(current) || "unavailable";

          if (regionLogic && regionLogic.exits) {
            for (const exit of Object.values(regionLogic.exits)) {
              if (!exit || !exit.to || reachable.has(exit.to)) continue;

              this.assumingSmallKey = false;
              const requirements = this.getLogicState(exit.requirements);
              const status = this.evaluateLogicState(requirements, { regionName: current });

              if (status === "available") {
                reachable.add(exit.to);
                this.regionStatuses.set(exit.to, this.getLimitedStatus("available", currentStatus));
                queue.push(exit.to);
                madeProgress = true;
                // Compute and update bunny state for this transition
                const currentBunny = this.getRegionBunnyState(current);
                const newBunny = this.computeBunnyStateForTransition(currentBunny, exit.type);
                this.updateRegionBunnyState(exit.to, newBunny);
                // Track path for debug mode
                if (this.debugOptions.enabled && !regionParent.has(exit.to)) {
                  regionParent.set(exit.to, { from: current, via: "exit", isKeyDoor: false });
                }
              } else if (processKeys) {
                this.assumingSmallKey = true;
                const statusWithKey = this.evaluateLogicState(requirements, { regionName: current });
                this.assumingSmallKey = false;

                if (statusWithKey === "available") {
                  const dungeonId = this.getDungeonFromRegion(current);
                  if (dungeonId) {
                    pendingKeyDoors.push({ exit, from: current, dungeonId });
                  }
                } else {
                  blockedExits.push({ exit, from: current });
                }
              } else {
                blockedExits.push({ exit, from: current });
              }
            }
          }
        }
      }
    }

    // Update reachableRegions
    this.reachableRegions = reachable;

    // Build full paths for debug mode
    if (this.debugOptions.enabled) {
      this.buildRegionPaths(regionParent, reachable, regions);
    }

    // Process Locations and Entrances for all reachable regions
    for (const current of reachable) {
      const regionLogic = regions[current];
      if (regionLogic) {
        const bestStatus = this.regionStatuses.get(current) || "unavailable";
        const isBunny = this.getRegionBunnyState(current);

        // Process Locations
        if (regionLogic.locations) {
          for (const [locName, locData] of Object.entries(regionLogic.locations)) {
            // Pass bunny state to the evaluation context
            const ctx: EvaluationContext = { regionName: current, isBunny };
            let status = this.evaluateWorldLogic(locData.requirements, ctx);
            
            // If player is a bunny and location is not exempt, mark as unavailable
            // unless the location explicitly allows bunny access or glitch logic applies
            if (isBunny && !this.canObtainAsBunny(locName)) {
              // Check for bunny-related glitches based on logic mode
              const canBunnyRevive = this.resolveBunnyGlitch(locName, ctx);
              if (!canBunnyRevive) {
                status = "unavailable";
              }
            }

            this.locationStatuses.set(locName, this.getLimitedStatus(status, bestStatus));
          }
        }

        // Process Entrances
        if (regionLogic.entrances) {
          for (const entName of regionLogic.entrances) {
            let status: LogicStatus = "available";
            // Check if this entrance corresponds to an exit with requirements
            if (regionLogic.exits && regionLogic.exits[entName]) {
              const exitData = regionLogic.exits[entName];
              const reqs = this.getLogicState(exitData.requirements);
              status = this.evaluateLogicState(reqs, { regionName: current, isBunny });
            }
            this.entranceStatuses.set(entName, this.getLimitedStatus(status, bestStatus));
          }
        }
      }
    }
    return reachable;
  }

  /**
   * Analyzes key doors to determine what status regions behind them should have.
   * 
   * Algorithm:
   * 1. First, do exhaustive exploration to count total keys and doors
   * 2. If total keys >= total doors, everything is "available"
   * 3. Otherwise, use greedy exploration for "available" and mark rest as "possible"
   * 
   * Key doors are bidirectional - opening from one side opens both sides.
   * 
   * Returns: Map of region names to their status (only for newly discovered regions)
   */
  private analyzeKeyDoorStatus(
    dungeonId: string,
    accessibleDoors: { exit: ExitLogic[string]; from: string; dungeonId: string }[],
    availableKeys: number,
    guaranteedAvailableKeys: number,
    currentReachable: Set<string>,
    regions: Record<string, OverworldRegionLogic>,
    branchingDungeons: Set<string>
  ): { regionsDiscovered: Map<string, LogicStatus>; keysUsed: number } {
    if (accessibleDoors.length === 0 || availableKeys <= 0) {
      return { regionsDiscovered: new Map(), keysUsed: 0 };
    }

    const phase1 = this.analyzeKeyDoorStatusPhase1(dungeonId, accessibleDoors, availableKeys, guaranteedAvailableKeys, currentReachable, regions);
    if (phase1.isComplete) {
      return { regionsDiscovered: phase1.regionsDiscovered, keysUsed: phase1.keysUsed };
    }

    const { regionsDiscovered, phase1Reachable, totalDoors, totalKeys, guaranteedTotalKeys } = phase1;
    
    // Phase 2: Not enough keys for all doors
    const { regionMinDoors, doorsAtDepth, doorCluster } = this.analyzeKeyDoorStatusPhase2(dungeonId, accessibleDoors, currentReachable, regions);
    
    return this.determineKeyDoorAvailability(
      dungeonId,
      availableKeys,
      totalDoors,
      totalKeys,
      guaranteedTotalKeys,
      guaranteedAvailableKeys,
      currentReachable,
      regions,
      regionMinDoors,
      doorsAtDepth,
      doorCluster,
      phase1Reachable,
      regionsDiscovered,
      branchingDungeons
    );
  }

  /**
   * Checks if an exit requires a small key to traverse.
   */
  private requiresSmallKey(exit: ExitLogic[string]): boolean {
    // Capitalize first letter to match key format (open -> Open)
    const worldStateRaw = this.state.settings.worldState || "open";
    const worldState = worldStateRaw.charAt(0).toUpperCase() + worldStateRaw.slice(1);
    const worldReqs = exit.requirements?.[worldState as keyof typeof exit.requirements];
    if (!worldReqs) {
      return false;
    }
    
    // Check if requirements contain "smallkey"
    const checkRequirements = (req: unknown): boolean => {
      if (!req) return false;
      if (req === "smallkey") return true;
      if (typeof req === "object" && req !== null) {
        const r = req as { allOf?: unknown[]; anyOf?: unknown[] };
        if (r.allOf) return r.allOf.some(x => checkRequirements(x));
        if (r.anyOf) return r.anyOf.some(x => checkRequirements(x));
      }
      return false;
    };
    
    // worldReqs is LogicState (with always/logical/required/scout)
    if (typeof worldReqs === "object" && worldReqs !== null) {
      const r = worldReqs as { always?: unknown; logical?: unknown; required?: unknown; scout?: unknown };
      return checkRequirements(r.always) || checkRequirements(r.logical) || 
             checkRequirements(r.required) || checkRequirements(r.scout);
    }
    
    return false;
  }

  /**
   * Creates a canonical key for a bidirectional door between two regions.
   * Key doors in ALTTP open from both sides once unlocked.
   */
  private getDoorPairKey(from: string, to: string): string {
    // Sort alphabetically to get the same key regardless of direction
    return from < to ? `${from}|${to}` : `${to}|${from}`;
  }

  /**
   * Explores what's behind a key door without actually opening it.
   * Returns the regions, keys (with locations), additional key doors found, and parent tracking.
   * 
   * IMPORTANT: Key doors are bidirectional. When we've opened a door from A→B,
   * the door from B→A is already open and shouldn't be counted as a new door.
   */
  private exploreKeyDoorPathRecursive(
    startRegion: string,
    dungeonId: string,
    alreadyReachable: Set<string>,
    regions: Record<string, OverworldRegionLogic>,
    visited: Set<string>,
    openedDoorPairs: Set<string> = new Set()
  ): { regions: Set<string>; keys: number; keyLocations: Set<string>; doors: { exit: ExitLogic[string]; from: string }[]; parentMap: Map<string, { from: string; via: string; isKeyDoor: boolean }> } {
    const foundRegions = new Set<string>([startRegion]);
    const keyLocations = new Set<string>();
    const foundDoors: { exit: ExitLogic[string]; from: string }[] = [];
    const parentMap = new Map<string, { from: string; via: string; isKeyDoor: boolean }>();
    const queue = [startRegion];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const regionLogic = regions[current];

      if (!regionLogic) continue;

      // Count keys in this region
      if (regionLogic.locations) {
        for (const locName of Object.keys(regionLogic.locations)) {
          if (this.isKeyLocation(locName) && this.getDungeonFromRegion(current) === dungeonId) {
            const locData = regionLogic.locations[locName];
            const status = this.evaluateWorldLogic(locData.requirements, { regionName: current });
            if (status === "available") {
              keyLocations.add(locName);
            }
          }
        }
      }

      // Explore exits
      if (regionLogic.exits) {
        for (const exit of Object.values(regionLogic.exits)) {
          if (!exit || !exit.to) continue;
          if (visited.has(exit.to) || alreadyReachable.has(exit.to)) continue;

          // Check if this exit is passable without a key
          this.assumingSmallKey = false;
          const requirements = this.getLogicState(exit.requirements);
          const status = this.evaluateLogicState(requirements, { regionName: current });

          if (status === "available") {
            visited.add(exit.to);
            foundRegions.add(exit.to);
            queue.push(exit.to);
            // Track parent for this region
            if (!parentMap.has(exit.to)) {
              parentMap.set(exit.to, { from: current, via: "exit", isKeyDoor: false });
            }
          } else {
            // Check if it's a key door
            this.assumingSmallKey = true;
            const statusWithKey = this.evaluateLogicState(requirements, { regionName: current });
            this.assumingSmallKey = false;

            if (statusWithKey === "available") {
              const exitDungeonId = this.getDungeonFromRegion(current);
              if (exitDungeonId === dungeonId) {
                // Check if this door pair is already opened (bidirectional check)
                const pairKey = this.getDoorPairKey(current, exit.to);
                if (openedDoorPairs.has(pairKey)) {
                  // Door is already open from other side - walk through for free
                  visited.add(exit.to);
                  foundRegions.add(exit.to);
                  queue.push(exit.to);
                  // Track parent for this region
                  if (!parentMap.has(exit.to)) {
                    parentMap.set(exit.to, { from: current, via: "exit (door already open)", isKeyDoor: false });
                  }
                } else {
                  // This is a new key door
                  foundDoors.push({ exit, from: current });
                }
              }
            }
          }
        }
      }
    }

    return { regions: foundRegions, keys: keyLocations.size, keyLocations, doors: foundDoors, parentMap };
  }

  private getLimitedStatus(status: LogicStatus, limit: LogicStatus): LogicStatus {
    const order: LogicStatus[] = ["unavailable", "information", "possible", "ool", "available"];
    return order[Math.min(order.indexOf(status), order.indexOf(limit))];
  }

  /**
   * Traces paths from a starting region to all connected regions (for debug mode).
   * This fills in parent relationships for regions discovered behind key doors.
   * Also follows key doors to regions that are in the discovered set.
   */
  private tracePathsFromRegion(
    startRegion: string,
    discoveredRegions: Map<string, LogicStatus>,
    regions: Record<string, OverworldRegionLogic>,
    regionParent: Map<string, { from: string; via: string; isKeyDoor: boolean }>
  ): void {
    const queue = [startRegion];
    const visited = new Set<string>([startRegion]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const regionLogic = regions[current];

      if (!regionLogic || !regionLogic.exits) continue;

      for (const exit of Object.values(regionLogic.exits)) {
        if (!exit || !exit.to) continue;
        if (visited.has(exit.to)) continue;
        if (!discoveredRegions.has(exit.to)) continue; // Only trace within discovered regions

        // Check if this exit is passable
        this.assumingSmallKey = false;
        const requirements = this.getLogicState(exit.requirements);
        const status = this.evaluateLogicState(requirements, { regionName: current });

        if (status === "available") {
          visited.add(exit.to);
          queue.push(exit.to);
          // Set parent if not already set
          if (!regionParent.has(exit.to)) {
            regionParent.set(exit.to, { from: current, via: "exit", isKeyDoor: false });
          }
        } else {
          // Check if it's a key door - if the destination is in discovered regions, 
          // it means the key door was opened during analysis
          this.assumingSmallKey = true;
          const statusWithKey = this.evaluateLogicState(requirements, { regionName: current });
          this.assumingSmallKey = false;

          if (statusWithKey === "available") {
            // This is a key door that was opened - follow it
            visited.add(exit.to);
            queue.push(exit.to);
            // Set parent if not already set (mark as key door)
            if (!regionParent.has(exit.to)) {
              const dungeonId = this.getDungeonFromRegion(current);
              regionParent.set(exit.to, { 
                from: current, 
                via: `key_door (dungeon: ${dungeonId})`, 
                isKeyDoor: true 
              });
            }
          }
        }
      }
    }
  }


  private getDungeonFromRegion(regionName: string): string | undefined {
    for (const [prefix, dungeonId] of Object.entries(doorPrefixToDungeon)) {
      if (regionName.startsWith(prefix)) return dungeonId;
    }
    return undefined;
  }

  // ==================== BUNNY STATE COMPUTATION ====================
  
  /**
   * Region types that are considered "underworld" - entering these preserves
   * the bunny state from the previous overworld region.
   */
  private static readonly UNDERWORLD_TYPES = new Set(["Cave", "Dungeon"]);

  /**
   * Checks if an exit type leads to the "other world" (where player becomes bunny).
   * In Open mode, DarkWorld is the "other world".
   * In Inverted mode, LightWorld is the "other world".
   */
  private isOtherWorld(exitType: string): boolean {
    const isInverted = this.state.settings.worldState === "inverted";
    if (isInverted) {
      return exitType === "LightWorld";
    }
    return exitType === "DarkWorld";
  }

  /**
   * Checks if an exit type leads to the "home world" (where player is never a bunny).
   * In Open mode, LightWorld is the "home world".
   * In Inverted mode, DarkWorld is the "home world".
   */
  private isHomeWorld(exitType: string): boolean {
    const isInverted = this.state.settings.worldState === "inverted";
    if (isInverted) {
      return exitType === "DarkWorld";
    }
    return exitType === "LightWorld";
  }

  /**
   * Checks if an exit type leads to an underworld (Cave or Dungeon).
   * Underworld areas preserve bunny state from the previous overworld.
   */
  private isUnderworld(exitType: string): boolean {
    return LogicEngine.UNDERWORLD_TYPES.has(exitType);
  }

  /**
   * Computes the bunny state after taking an exit.
   * 
   * Rules:
   * 1. If player has moon pearl, they are never a bunny
   * 2. Entering home world (LW in Open, DW in Inverted) → not bunny
   * 3. Entering other world OW (DW in Open, LW in Inverted) without moon pearl → bunny
   * 4. Entering underworld (Cave/Dungeon) → preserves previous bunny state
   * 
   * @param currentBunnyState Whether the player is currently a bunny
   * @param exitType The type of the exit destination ("LightWorld", "DarkWorld", "Cave", "Dungeon")
   * @returns Whether the player will be a bunny after taking this exit
   */
  private computeBunnyStateForTransition(currentBunnyState: boolean, exitType: string): boolean {
    // Moon pearl always prevents bunny state
    if (this.hasItem("moonpearl")) {
      return false;
    }

    // Entering home world overworld → not bunny
    if (this.isHomeWorld(exitType)) {
      return false;
    }

    // Entering other world overworld → bunny
    if (this.isOtherWorld(exitType)) {
      return true;
    }

    // Entering underworld → preserve current bunny state
    if (this.isUnderworld(exitType)) {
      return currentBunnyState;
    }

    // Unknown type - assume not bunny (safer for logic)
    return false;
  }

  /**
   * Updates the bunny state for a region, using the "best case" rule:
   * If ANY path to the region allows non-bunny access, the region is marked as non-bunny.
   * 
   * This handles the multi-entrance cave scenario:
   * - Cave has DW entrance (bunny path) and connects to LW
   * - Player can reach LW and enter from there without being a bunny
   * - Therefore, all items in the cave are accessible without moon pearl
   * 
   * @param regionName The region being reached
   * @param bunnyStateViaThisPath Whether the player is a bunny on this specific path
   */
  private updateRegionBunnyState(regionName: string, bunnyStateViaThisPath: boolean): void {
    const existingState = this.regionBunnyState.get(regionName);
    
    if (existingState === undefined) {
      // First time reaching this region
      this.regionBunnyState.set(regionName, bunnyStateViaThisPath);
    } else if (existingState === true && bunnyStateViaThisPath === false) {
      // Found a non-bunny path to a region previously only reachable as bunny
      this.regionBunnyState.set(regionName, false);
    }
    // If existingState is already false (non-bunny path exists), keep it
    // If both are true (bunny), keep it as true
  }

  /**
   * Gets the bunny state for a region.
   * Returns false (not bunny) if the region hasn't been processed yet,
   * which is the safe default for logic evaluation.
   */
  private getRegionBunnyState(regionName: string): boolean {
    return this.regionBunnyState.get(regionName) ?? false;
  }

  /**
   * Checks if a location can be obtained as a bunny.
   * Some locations require no interaction and can be obtained in bunny form.
   */
  private canObtainAsBunny(locationName: string): boolean {
    return this.bunnyExemptLocations.has(locationName);
  }

  /**
   * Adds a location to the bunny-exempt list.
   * Call this for locations that can be obtained without any interaction.
   */
  public addBunnyExemptLocation(locationName: string): void {
    this.bunnyExemptLocations.add(locationName);
  }

  /**
   * Clears the bunny-exempt locations list.
   */
  public clearBunnyExemptLocations(): void {
    this.bunnyExemptLocations.clear();
  }

  /**
   * Checks if a bunny can access a location through glitch techniques.
   * This is used when the player is a bunny but glitch logic is enabled.
   * 
   * Supported bunny glitches:
   * - canMirrorSuperBunny: Use mirror to become super bunny
   * - canDungeonBunnyRevive: Revival in dungeons
   * - canBunnyPocket: Store items as bunny with boots
   * 
   * @param _locationName The location being accessed (reserved for location-specific glitches)
   * @param ctx The evaluation context
   * @returns Whether the location can be accessed via bunny glitches
   */
  private resolveBunnyGlitch(_locationName: string, ctx: EvaluationContext): boolean {
    // No glitches in noglitches mode
    if (this.state.settings.logicMode === "noglitches") {
      return false;
    }

    // All glitch modes allow bunny revival techniques
    // Check if we're in a dungeon (for dungeon bunny revive)
    const dungeonId = ctx.dungeonId || this.getDungeonFromRegion(ctx.regionName || "");
    const isInDungeon = !!dungeonId;

    // canDungeonBunnyRevive - can revive in dungeons through various means
    if (isInDungeon) {
      return true;
    }

    // canMirrorSuperBunny - use mirror to become super bunny and access items
    if (this.hasItem("mirror")) {
      return true;
    }

    // canBunnyPocket - store items as bunny (requires boots and bottle or mirror)
    if (this.hasItem("boots")) {
      if (this.hasItem("mirror") || this.getBottleCount() > 0) {
        return true;
      }
    }

    return false;
  }

  // ==================== END BUNNY STATE COMPUTATION ====================

  private countReachableKeys(reachable: Set<string>, dungeonId: string, includePossible: boolean = false): number {
    let count = 0;
    const regions = this.logicSet.regions as Record<string, OverworldRegionLogic>;

    for (const regionName of reachable) {
      // Check if region belongs to the dungeon
      if (this.getDungeonFromRegion(regionName) !== dungeonId) continue;

      const regionStatus = this.regionStatuses.get(regionName);
      const region = regions[regionName];
      if (!region || !region.locations) continue;

      for (const locName of Object.keys(region.locations)) {
        if (this.isKeyLocation(locName)) {
          // Only count keys in available regions, or possible regions if includePossible is true
          if (regionStatus !== "available" && !(includePossible && regionStatus === "possible")) {
            continue;
          }
          const locData = region.locations[locName];
          const status = this.evaluateWorldLogic(locData.requirements, { regionName });
          if (status === "available" || (includePossible && status === "possible")) {
            count++;
          }
        }
      }
    }
    return count;
  }

  private isKeyLocation(name: string): boolean {
    const pottery = this.state.settings.pottery;
    const drops = this.state.settings.keyDrop;

    if (name.includes("Pot Key") || name.includes("Key Pot")) {
      return !(pottery === "keys" || pottery === "cavekeys");
    }
    if (name.includes("Key Drop")) {
      return !drops;
    }
    return false;
  }

  private hasItem(item: string): boolean {
    const items = this.state.items;
    return items[item as keyof ItemsState]?.amount > 0;
  }

  private getLogicState(worldLogic: WorldLogic): LogicState {
    const mode = this.state.settings.worldState === "inverted" ? "Inverted" : "Open";
    const requirements = worldLogic[mode] || worldLogic.Standard || {};

    if (typeof requirements === "string" || (typeof requirements === "object" && requirements !== null && ("allOf" in requirements || "anyOf" in requirements))) {
      return { always: requirements as LogicRequirement };
    }
    return requirements as LogicState;
  }

  private evaluateRequirement(req: LogicRequirement, ctx: EvaluationContext): boolean {
    if (!req) return true;

    // Handle Strings (e.g., "bomb", "canReach|Light World", "keys|2")
    if (Array.isArray(req) && req.length === 1) {
      req = req[0];
    }
    if (typeof req === "string") {
      if (req.includes("|")) {
        return this.resolveComplex(req, ctx);
      }
      return this.resolveSimple(req, ctx);
    }

    // Handle Objects (allOf / anyOf)
    if (typeof req === "object" && req !== null) {
      let result = true;
      if ("allOf" in req && req.allOf) {
        result = req.allOf.every((r) => this.evaluateRequirement(r, ctx));
      }
      if (result && "anyOf" in req && Array.isArray(req.anyOf)) {
        result = req.anyOf.some((r) => this.evaluateRequirement(r, ctx));
      }
      return result;
    }

    return true;
  }

  private bossesKillStatus() {
    const killableBosses: Record<string, boolean> = {};
    killableBosses["armos"] =
      this.resolveSimple("melee_bow", {}) ||
      this.resolveSimple("boomerang", {}) ||
      this.resolveSimple("cane", {}) || // TODO: Check this logic
      this.resolveSimple("rod", {}); // TODO: Check this logic

    killableBosses["lanmolas"] =
      this.resolveSimple("melee_bow", {}) ||
      this.resolveSimple("cane", {}) || // TODO: Check this logic
      this.resolveSimple("rod", {});

    killableBosses["moldorm"] = this.resolveSimple("melee", {});

    killableBosses["helmasaurking"] = this.resolveSimple("melee_bow", {}) && (this.resolveSimple("bomb", {}) || this.resolveSimple("hammer", {}));

    killableBosses["arrghus"] =
      this.resolveSimple("hookshot", {}) &&
      (this.resolveSimple("melee", {}) ||
        (this.resolveSimple("bow", {}) && this.resolveSimple("rod", {})) || // TODO: Check this logic
        (this.resolveSimple("bomb", {}) && this.resolveSimple("rod", {}) && (this.getBottleCount() > 1 || (this.getBottleCount() > 0 && this.resolveSimple("magic", {}))))); // TODO: Check this logic

    killableBosses["mothula"] = this.resolveSimple("melee", {}) || this.resolveSimple("firerod", {}) || this.resolveSimple("cane", {});

    killableBosses["blind"] = this.resolveSimple("melee", {}) || this.resolveSimple("cane", {});

    killableBosses["kholdstare"] = this.resolveSimple("firerod", {}) && (this.resolveSimple("melee", {}) || this.resolveSimple("magic", {}));
    // TODO: Add swordless logic

    killableBosses["vitreous"] = this.resolveSimple("melee_bow", {});

    killableBosses["trinexx"] =
      this.resolveSimple("firerod", {}) && this.resolveSimple("icerod", {}) && (this.resolveSimple("swordbeams", {}) || this.resolveSimple("hammer", {}) || (this.resolveSimple("sword", {}) && this.resolveSimple("magic", {})));

    killableBosses["agahnim"] = this.resolveSimple("melee", {}) || this.resolveSimple("net", {}); // TODO: Add swordless logic
    killableBosses["agahnim2"] = this.resolveSimple("melee", {}) || this.resolveSimple("net", {}); // TODO: Add swordless logic
    killableBosses["bnc"] = true; // Only HC and pots in room

    return killableBosses;
  }

  private getBottleCount(): number {
    let count = 0;
    for (let i = 1; i <= 4; i++) {
      if (this.hasItem(`bottle${i}`)) count++;
    }
    return count;
  }

  private getCrystalCount(): number {
    return Object.values(this.state.dungeons).filter((d) => d.prizeCollected && (d.prize === "crystal" || d.prize === "redCrystal")).length;
  }

  private getRedCrystalCount(): number {
    return Object.values(this.state.dungeons).filter((d) => d.prizeCollected && d.prize === "redCrystal").length;
  }

  private getPendantCount(): number {
    return Object.values(this.state.dungeons).filter((d) => d.prizeCollected && (d.prize === "pendant" || d.prize === "greenPendant")).length;
  }

  private resolveSimple(condition: string, ctx: EvaluationContext): boolean {
    const items = this.state.items;
    let killableBosses;

    // Other complex checks
    switch (condition) {
      case "agahnim":
        return this.state.dungeons["ct"].bossDefeated;
      case "agahnim2":
        return this.state.dungeons["gt"].bossDefeated;
      // case "bigkey":
      //   if (ctx.dungeonId) {
      //     const dungeon = this.state.dungeons[ctx.dungeonId];
      //     return dungeon.bigKey;
      //   }
      //   return false;
      case "bombs":
        return this.hasItem("bomb");
      case "bottle":
        return this.getBottleCount() > 0;
      case "bow":
        // Bow requires 2 to use (1 to have, 1 to use)
        return items.bow.amount > 1;
      case "canFlute":
      case "flute":
        // TODO: CanActivateFlute logic
        return items.flute.amount > 0;
      case "melee":
        return this.hasItem("sword") || this.hasItem("hammer");
      case "melee_bow":
        return this.resolveSimple("melee", ctx) || this.resolveSimple("bow", ctx);
      case "mitts":
        return items.glove.amount > 1;
      case "mirrorshield":
        return items.shield.amount > 2;
      case "swordbeams":
        return items.sword.amount > 1;
      case "temperedSword":
        return items.sword.amount >= 3;
      case "goldSword":
        return items.sword.amount >= 4;
      case "greenPendant":
        return Object.values(this.state.dungeons).some((d) => d.prizeCollected && d.prize === "greenPendant");
      case "canPullPedestal":
        return this.getPendantCount() >= 3;
      case "canUseSilverArrows":
        return items.bow.amount >= 4;
      case "rod":
        return this.hasItem("firerod") || this.hasItem("icerod");
      case "cane":
        return this.hasItem("somaria") || this.hasItem("byrna");
      case "canKillSomeBosses":
        killableBosses = this.bossesKillStatus();
        return Object.values(killableBosses).some((v) => v);
      case "canKillBoss":
        killableBosses = this.bossesKillStatus();
        if (ctx.dungeonId) {
          const dungeon = this.state.dungeons[ctx.dungeonId];
          return killableBosses[dungeon.boss];
        }
        return false;
      case "canKillMostEnemies":
        return this.resolveSimple("melee_bow", ctx) || this.resolveSimple("cane", ctx) || this.resolveSimple("firerod", ctx);
      case "canKillOrExplodeMostEnemies":
        return this.resolveSimple("canKillMostEnemies", ctx) || this.resolveSimple("bomb", ctx);
      case "canKillHookableEneimies":
        return this.resolveSimple("canKillOrExplodeMostEnemies", ctx) || this.resolveSimple("hookshot", ctx);
      case "canFightAgahnim":
        killableBosses = this.bossesKillStatus();
        return killableBosses["agahnim"];
      case "canLightFires":
        return this.hasItem("firerod") || this.hasItem("lantern");
      case "canDarkRoomNavigate":
        // TODO: Add personal logic for dark room navigation
        return this.resolveSimple("lantern", ctx);
      case "canTorchRoomNavigate":
        // TODO: (items.firerod && !isDoorsBranch() && flags.entrancemode === "N");
        return this.resolveSimple("lantern", ctx) || this.hasItem("firerod");
      case "canDefeatCurtains":
        return this.hasItem("sword"); // TODO: Add swordless logic
      case "canKillWizzrobes":
        return this.resolveSimple("melee_bow", ctx) || this.resolveSimple("cane", ctx) || this.resolveSimple("firerod", ctx) || (this.resolveSimple("icerod", ctx) && this.resolveSimple("hookshot", ctx));
      case "canCrossMireGap":
        return this.resolveSimple("boots", ctx) || this.resolveSimple("hookshot", ctx);
      case "canBurnThings":
      case "canBurnThingsMaybeSwordless": // TODO: Differentiate swordless logic
        return this.hasItem("firerod") || (this.hasItem("bombos") && this.resolveSimple("sword", ctx));
      case "canHitSwitch":
        return this.resolveSimple("melee_bow", ctx) || this.resolveSimple("rod", ctx) || this.resolveSimple("cane", ctx) || this.resolveSimple("hookshot", ctx) || this.resolveSimple("bomb", ctx) || this.resolveSimple("boomerang", ctx);
      case "canDestroyEnergyBarrier":
        return this.resolveSimple("swordbeams", ctx);
      case "canBreakTablets":
        return this.resolveSimple("swordbeams", ctx) && this.resolveSimple("book", ctx); // TODO: Add swordless logic
      case "canOpenBonkWalls":
        return this.resolveSimple("boots", ctx) || this.resolveSimple("bomb", ctx);
      case "canHitRangedSwitch":
        // Previous didnt have beams, but did have rods
        return this.resolveSimple("bomb", ctx) || this.resolveSimple("bow", ctx) || this.resolveSimple("boomerang", ctx) || this.resolveSimple("rod", ctx) || this.resolveSimple("swordbeams", ctx) || this.resolveSimple("somaria", ctx);
      case "canGetBonkableItem":
        return this.resolveSimple("boots", ctx) || (this.resolveSimple("quake", ctx) && this.resolveSimple("sword", ctx));
      case "gtleft":
        // TODO: Personalize logic for GT left side
        return this.resolveSimple("hammer", ctx) && this.resolveSimple("hookshot", ctx) && this.resolveSimple("canHitRangedSwitch", ctx);
      case "gtright":
        // TODO: Personalize logic for GT right side
        return this.resolveSimple("somaria", ctx) && this.resolveSimple("firerod", ctx);
      case "zeroKeyPodders":
        return this.resolveSimple("bow", ctx) && this.resolveSimple("hammer", ctx) && this.resolveSimple("canOpenBonkWalls", ctx);
      case "canCrossEnergyBarrier":
        return this.hasItem("swordbeams") || this.hasItem("cape"); // || TODO: Add swordless logic
      case "canOpenGT":
        return this.getCrystalCount() >= 7;
      case "canBuyBigBombMaybe":
      case "canBuyBigBomb":
        return this.getRedCrystalCount() >= 2;
      case "canExitTurtleRockWestAndEnterEast":
        // TODO
        // return (items.bomb || flags.gametype === "I") && flags.entrancemode === "N";
        return this.resolveSimple("bomb", ctx);
      case "canExitTurtleRockBack":
        // TODO
        //  return items.bomb || flags.gametype != "O" || flags.entrancemode != "N";
        return this.resolveSimple("bomb", ctx);

      case "canOpenTR":
        return this.resolveComplex("medallion|tr", ctx) && this.resolveComplex("canReach|Death Mountain TR Pegs Ledge", ctx);
      case "canCollectOldMan":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Old Man Cave (East)", ctx);
      case "canRescueOldMan":
        // TODO Follower shuffle logic
        return this.resolveSimple("canCollectOldMan", ctx) && this.resolveComplex("canReach|Old Man Drop Off", ctx);
      case "canCollectKiki":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Palace of Darkness Area", ctx);
      case "canOpenPod":
        // TODO Follower shuffle logic
        return this.resolveSimple("canCollectKiki", ctx) && this.resolveComplex("canReach|Palace of Darkness Area", ctx);
      case "canCollectFrog":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Frog Area", ctx);
      case "canRescueBlacksmith":
        // TODO Follower shuffle logic
        return this.resolveSimple("canCollectFrog", ctx) && this.resolveComplex("canReach|Blacksmiths Hut", ctx);
      case "canCollectPurpleChest":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Hammer Pegs Area", ctx) && this.resolveSimple("canRescueBlacksmith", ctx);
      case "canDeliverPurpleChest":
        // TODO Follower shuffle logic
        return this.resolveSimple("canCollectPurpleChest", ctx) && this.resolveComplex("canReach|Middle Aged Man", ctx);
      case "canCollectBigBomb":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Big Bomb Shop", ctx) && this.resolveSimple("canBuyBigBomb", ctx);
      case "canOpenPyramidFairy":
        return this.resolveSimple("canCollectBigBomb", ctx) && this.resolveComplex("canReach|Pyramid Area", ctx);
      case "isPyramidOpen":
        // TODO: Check for fast ganon
        return this.resolveSimple("agahnim2", ctx);
      case "canBeatGanon":
        // TODO: check for crystal requirement based on settings
        return this.resolveSimple("agahnim2", ctx);
      case "canOpenTTAttic":
        return this.resolveComplex("canReach|Thieves Attic", ctx) && this.resolveSimple("bomb", ctx);
      case "canCollectBlind":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Thieves Blind's Cell Interior", ctx);
      case "canRevealBlind":
        return this.resolveSimple("canOpenTTAttic", ctx) && this.resolveSimple("canCollectBlind", ctx) && this.resolveComplex("canReach|Thieves Boss", ctx);
      case "smallkey":
        if (this.state.settings.wildSmallKeys !== "wild") return true;
        return this.assumingSmallKey;
      case "bigkey":
        // TODO, work out how to do this
        return true;
      case "canAvoidLasers":
        return items.shield.amount >= 3 || this.resolveSimple("cape", ctx) || this.resolveSimple("byrna", ctx);

      // TODO
      case "canDarkRoomNavigateBlind":
      case "canTorchRoomNavigateBlind":
      case "canFairyReviveHover":
      case "canOWFairyRevive":
      case "canQirnJump":
      case "canFakePowder":
      case "canZoraSplashDelete":
      case "canMirrorWrap":
      case "canTombRaider":
      case "canFairyBarrierRevive":
      case "canShockBlock":
      case "canHover":
      case "canIceBreak":
      case "canHookClip":
      case "canBombJump":
      case "canBombOrBonkCameraUnlock":
      case "canHoverAlot":
      case "canSpeckyClip":
      case "canBombSpooky":
      case "canHeraPot":
      case "canFireSpooky":
      case "canMimicClip":
      case "canPotionCameraUnlock":
      case "canMoldormBounce":
      case "canBunnyCitrus":
      case "canTamSwam":
      case "canReachTurtleRockMiddle":
      case "canBreachMiseryMireMaybe":
      case "canBreachTurtleRockMainMaybe":
      case "canBreachTurtleRockMiddle":
      case "canOnlyReachTurtleRockMain":
      case "canReachTurtleRockBackOpen":
      case "canHMGMireClipBreach":
      case "canHMGMireClipLogic":
      case "canHMGHeraClipBreach":
      case "canHMGHeraClipLogic":
      case "canHMGUnlockHeraBreach":
      case "canHMGUnlockHeraLogic":
      case "canHMGUnlockSwampBreach":
      case "canHMGUnlockSwampLogic":
      case "canHMGMirrorlessSwampBreach":
      case "canHMGMirrorlessSwampLogic":
      case "never":
        return false;

      case "canBootsClip":
        return this.state.settings.logicMode !== "noglitches" ? this.hasItem("boots") : false;

      // Everything below here needs user settings for logic added
      case "canMirrorSuperBunny":
        return this.state.settings.logicMode !== "noglitches" && this.hasItem("mirror");
      case "canDungeonBunnyRevive":
      case "canFakeFlipper":
        return this.state.settings.logicMode !== "noglitches";
      case "canWaterWalk":
        return this.state.settings.logicMode !== "noglitches" && this.hasItem("boots");
      case "canBunnyPocket":
        return this.state.settings.logicMode !== "noglitches" && this.hasItem("boots") && (this.hasItem("mirror") || this.resolveSimple("bottle", ctx));
      case "canSpinSpeedClip":
        return this.state.settings.logicMode !== "noglitches" && this.hasItem("boots") && (this.hasItem("sword") || this.hasItem("hookshot"));

      default:
        // Covers all simple item checks - works because all items are counted now rather than boolean
        // Putting this here allows us to use more complex logic conditions above (i.e. flute)
        if (condition in items) return this.hasItem(condition);

        // console.error(`Unknown simple logic condition: ${condition}`);
        return true;
    }
  }

  private resolveComplex(condition: string, ctx: EvaluationContext): boolean {
    const items = this.state.items;
    const conditionParts = condition.split("|");
    const type = conditionParts[0];
    let dungeonId: string | undefined = ctx.dungeonId;
    let dungeon;

    switch (type) {
      case "canReach": {
        const regionName = conditionParts[1];
        const regionStatus = this.evaluateRegion(regionName);
        return regionStatus === "available";
      }
      case "canBreach": {
        const breachRegionName = conditionParts[1];
        const breachRegionStatus = this.evaluateRegion(breachRegionName);
        return breachRegionStatus !== "unavailable";
      }
      // Custom big keys for hmg logic
      case "bigkey":
        if (!this.state.settings.wildBigKeys) {
          return true;
        }
        dungeon = this.state.dungeons[conditionParts[1]];
        return dungeon.bigKey;
      case "keys": {
        if (this.state.settings.wildSmallKeys === "wild") {
          return true;
        }
        const requiredKeys = parseInt(conditionParts[1], 10);
        if (conditionParts.length === 3) {
          dungeonId = conditionParts[2];
        }
        if (!dungeonId) return false;
        dungeon = this.state.dungeons[dungeonId];
        
        // If we are assuming a small key (for door checks), add 1 to the available count
        // This is a simplification, but helps with key door logic
        const availableKeys = (dungeon?.smallKeys ?? 0) + (this.assumingSmallKey && dungeonId === ctx.dungeonId ? 1 : 0);
        return availableKeys >= requiredKeys;
      }
      case "medallion": {
        const medallionDungeon = conditionParts[1];
        const medallionEntrance = medallionDungeon === "tr" ? "Turtle Rock" : "Misery Mire";
        if (items.quake.amount >= 1 && items.bombos.amount >= 1 && items.ether.amount >= 1) {
          return true;
        }
        const dungeonMedallion = this.state.entrances[medallionEntrance]?.medallion;
        if (dungeonMedallion && dungeonMedallion !== "unknown") {
          return items[dungeonMedallion].amount > 0;
        }
        return false;
      }
      case "canExtendMagic": {
        // TODO - implement proper magic logic
        return this.resolveSimple("magic", ctx) || this.getBottleCount() > 1;
      }
      case "exception":
        // TODO: TO BE IMPLEMENTED AS NEEDED
        return false;
      case "hasFoundEntrance":
      case "hasFoundMapEntry":
        // TODO: Implement entrance logic
        return false;

      default:
        // console.error(`Unknown complex logic condition: ${condition}`);
        return true;
    }
  }

  // Graph-based region evaluation for OW/entrance logic
  private evaluateRegion(regionName: string): LogicStatus {
    // Fast lookup using precomputed reachableRegions
    if (this.regionStatuses.has(regionName)) {
      return this.regionStatuses.get(regionName)!;
    }
    const availability: LogicStatus = this.reachableRegions.has(regionName) ? "available" : "unavailable";
    this.regionStatuses.set(regionName, availability);
    return availability;
  }

  private evaluateWorldLogic(worldLogic: WorldLogic, ctx: EvaluationContext): LogicStatus {
    const requirements = this.getLogicState(worldLogic);
    return this.evaluateLogicState(requirements, ctx);
  }

  private evaluateLogicState(requirements: LogicState, ctx: EvaluationContext): LogicStatus {
    let availability: LogicStatus = "unavailable";

    if (!("always" in requirements) || this.evaluateRequirement(requirements.always!, ctx)) {
      availability = "possible";
      if (!("logical" in requirements) || this.evaluateRequirement(requirements.logical!, ctx)) {
        availability = "available";
      } else if ("required" in requirements && this.evaluateRequirement(requirements.required!, ctx)) {
        availability = "ool";
      }
    }
    return availability;
  }

  private analyzeKeyDoorStatusPhase1(
    dungeonId: string,
    accessibleDoors: { exit: ExitLogic[string]; from: string; dungeonId: string }[],
    availableKeys: number,
    guaranteedAvailableKeys: number,
    currentReachable: Set<string>,
    regions: Record<string, OverworldRegionLogic>
  ): { 
    regionsDiscovered: Map<string, LogicStatus>; 
    keysUsed: number; 
    phase1Reachable: Set<string>;
    totalDoors: number;
    totalKeys: number;
    guaranteedTotalKeys: number;
    isComplete: boolean;
  } {
    const regionsDiscovered = new Map<string, LogicStatus>();
    type DoorEntry = { exit: ExitLogic[string]; from: string };
    
    const phase1OpenedDoors = new Set<string>();
    const phase1Reachable = new Set<string>(currentReachable);
    const phase1Doors: DoorEntry[] = accessibleDoors.map(d => ({ exit: d.exit, from: d.from }));
    const allDiscoveredDoorPairs = new Set<string>();
    
    // First, find all key doors within currently reachable regions
    for (const regionName of currentReachable) {
      const region = regions[regionName];
      if (!region || this.getDungeonFromRegion(regionName) !== dungeonId) continue;
      
      for (const [, exit] of Object.entries(region.exits || {})) {
        const isKeyDoor = this.requiresSmallKey(exit);
        if (isKeyDoor) {
          const pairKey = this.getDoorPairKey(regionName, exit.to);
          if (!allDiscoveredDoorPairs.has(pairKey)) {
            allDiscoveredDoorPairs.add(pairKey);
          }
        }
      }
    }
    
    for (const door of phase1Doors) {
      allDiscoveredDoorPairs.add(this.getDoorPairKey(door.from, door.exit.to));
    }
    
    let totalKeysFound = 0;
    const phase1Queue = [...phase1Doors];
    
    while (phase1Queue.length > 0) {
      const door = phase1Queue.shift()!;
      const pairKey = this.getDoorPairKey(door.from, door.exit.to);
      
      if (phase1OpenedDoors.has(pairKey) || phase1Reachable.has(door.exit.to)) {
        continue;
      }
      
      phase1OpenedDoors.add(pairKey);
      phase1Reachable.add(door.exit.to);
      
      const exploration = this.exploreKeyDoorPathRecursive(
        door.exit.to,
        dungeonId,
        phase1Reachable,
        regions,
        new Set([door.exit.to]),
        phase1OpenedDoors
      );
      
      for (const region of exploration.regions) {
        phase1Reachable.add(region);
      }
      
      totalKeysFound += exploration.keys;
      
      for (const newDoor of exploration.doors) {
        const newPairKey = this.getDoorPairKey(newDoor.from, newDoor.exit.to);
        if (!allDiscoveredDoorPairs.has(newPairKey) && !phase1OpenedDoors.has(newPairKey)) {
          allDiscoveredDoorPairs.add(newPairKey);
          phase1Queue.push(newDoor);
        }
      }
    }
    
    const totalDoors = allDiscoveredDoorPairs.size;
    const totalKeys = availableKeys + totalKeysFound;
    // For guaranteedTotalKeys, we can only count keys found behind doors if the dungeon is linear
    // (i.e., only one path forward, so we're guaranteed to find those keys)
    // For branching dungeons, keys behind doors are NOT guaranteed because player might go a different way
    // We'll pass totalKeysFound down but Phase 2 will decide whether to count it based on dungeon structure
    const guaranteedTotalKeys = guaranteedAvailableKeys + totalKeysFound;
    
    // Use guaranteedTotalKeys to determine if we can mark everything as "available".
    // Keys from "possible" regions (counted in availableKeys but not guaranteedAvailableKeys) 
    // can only help reach things as "possible", not as "available".
    if (guaranteedTotalKeys >= totalDoors) {
      for (const region of phase1Reachable) {
        if (!currentReachable.has(region)) {
          regionsDiscovered.set(region, "available");
        }
      }
      return { regionsDiscovered, keysUsed: totalDoors, phase1Reachable, totalDoors, totalKeys, guaranteedTotalKeys, isComplete: true };
    }

    return { regionsDiscovered, keysUsed: 0, phase1Reachable, totalDoors, totalKeys, guaranteedTotalKeys, isComplete: false };
  }

  private analyzeKeyDoorStatusPhase2(
    dungeonId: string,
    accessibleDoors: { exit: ExitLogic[string]; from: string; dungeonId: string }[],
    currentReachable: Set<string>,
    regions: Record<string, OverworldRegionLogic>
  ): {
    regionMinDoors: Map<string, number>;
    doorsAtDepth: Map<number, number>;
    doorCluster: Map<string, string>;
  } {
    type DoorEntry = { exit: ExitLogic[string]; from: string };
    const regionMinDoors = new Map<string, number>();
    const phase2OpenedDoors = new Set<string>();
    const phase2Doors: DoorEntry[] = accessibleDoors.map(d => ({ exit: d.exit, from: d.from }));
    const phase2DiscoveredPairs = new Set<string>();
    
    interface BFSEntry { region: string; doorsUsed: number; clusterKey?: string }
    const bfsQueue: BFSEntry[] = [];
    const regionVisited = new Set<string>();
    
    const doorsAtDepth = new Map<number, number>();
    
    for (const region of currentReachable) {
      regionMinDoors.set(region, 0);
      regionVisited.add(region);
    }
    
    const doorCluster = new Map<string, string>();
    
    for (const door of phase2Doors) {
      if (!regionVisited.has(door.exit.to)) {
        bfsQueue.push({ region: door.exit.to, doorsUsed: 1, clusterKey: door.exit.to });
        doorsAtDepth.set(1, (doorsAtDepth.get(1) || 0) + 1);
      }
      phase2DiscoveredPairs.add(this.getDoorPairKey(door.from, door.exit.to));
    }
    
    while (bfsQueue.length > 0) {
      const { region, doorsUsed, clusterKey } = bfsQueue.shift()!;
      
      if (regionVisited.has(region)) {
        continue;
      }
      
      regionVisited.add(region);
      regionMinDoors.set(region, doorsUsed);
      if (doorsUsed === 1 && clusterKey) {
        doorCluster.set(region, clusterKey);
      }
      
      const exploration = this.exploreKeyDoorPathRecursive(
        region,
        dungeonId,
        regionVisited,
        regions,
        new Set([region]),
        phase2OpenedDoors
      );
      
      for (const connectedRegion of exploration.regions) {
        if (!regionVisited.has(connectedRegion)) {
          regionVisited.add(connectedRegion);
          regionMinDoors.set(connectedRegion, doorsUsed);
          if (doorsUsed === 1 && clusterKey) {
            doorCluster.set(connectedRegion, clusterKey);
          }
        }
      }
      
      for (const newDoor of exploration.doors) {
        if (!regionVisited.has(newDoor.exit.to)) {
          const newClusterKey = doorsUsed === 1 ? clusterKey : newDoor.exit.to;
          bfsQueue.push({ region: newDoor.exit.to, doorsUsed: doorsUsed + 1, clusterKey: newClusterKey });
          doorsAtDepth.set(doorsUsed + 1, (doorsAtDepth.get(doorsUsed + 1) || 0) + 1);
        }
      }
    }

    return { regionMinDoors, doorsAtDepth, doorCluster };
  }

  private determineKeyDoorAvailability(
    dungeonId: string,
    availableKeys: number,
    totalDoors: number,
    _totalKeys: number,
    _guaranteedTotalKeys: number,
    guaranteedAvailableKeys: number,
    currentReachable: Set<string>,
    regions: Record<string, OverworldRegionLogic>,
    regionMinDoors: Map<string, number>,
    doorsAtDepth: Map<number, number>,
    doorCluster: Map<string, string>,
    phase1Reachable: Set<string>,
    regionsDiscovered: Map<string, LogicStatus>,
    branchingDungeons: Set<string>
  ): { regionsDiscovered: Map<string, LogicStatus>; keysUsed: number } {
    // Count doors at depth 1 (initial accessible doors)
    const depth1Doors = doorsAtDepth.get(1) || 0;
    
    // Track branching dungeons - once marked, they stay branching across iterations
    if (depth1Doors > 1) {
      branchingDungeons.add(dungeonId);
    }
    const isBranchingDungeon = branchingDungeons.has(dungeonId);
    
    // Count bypassable doors (doors where both sides are already reachable)
    let bypassableDoorCount = 0;
    for (const regionName of currentReachable) {
      const region = regions[regionName];
      if (!region || this.getDungeonFromRegion(regionName) !== dungeonId) continue;
      for (const [, exit] of Object.entries(region.exits || {})) {
        if (this.requiresSmallKey(exit) && currentReachable.has(exit.to)) {
          bypassableDoorCount++;
        }
      }
    }
    bypassableDoorCount = Math.floor(bypassableDoorCount / 2); // Each bidirectional door counted twice
    
    let effectiveKeys: number;
    if (depth1Doors === 1 && !isBranchingDungeon) {
      // Linear dungeon - keys found on the critical path are guaranteed
      // We need to count keys at each depth level iteratively:
      // Start with K keys, can reach depth K, find keys there, extend reach, repeat.
      
      // First, build a map of depth -> keys at that depth
      const keysAtDepth = new Map<number, number>();
      for (const regionName of phase1Reachable) {
        const depth = regionMinDoors.get(regionName) || 0;
        const region = regions[regionName];
        if (!region || !region.locations) continue;
        for (const [locName] of Object.entries(region.locations)) {
          if (this.isKeyLocation(locName) && this.getDungeonFromRegion(regionName) === dungeonId) {
            keysAtDepth.set(depth, (keysAtDepth.get(depth) || 0) + 1);
          }
        }
      }
      
      // Now simulate iteratively: start with inventory keys
      // Note: bypassable doors don't consume keys, they're free to traverse
      const keysAvailable = availableKeys;
      let maxReachableDepth = keysAvailable; // Can initially reach this many doors deep
      let totalReachableKeys = 0;
      
      // Iterate: for each depth we can reach, collect keys and extend reach
      for (let depth = 1; depth <= maxReachableDepth; depth++) {
        const keysHere = keysAtDepth.get(depth) || 0;
        totalReachableKeys += keysHere;
        // Each key found extends how far we can go
        maxReachableDepth += keysHere;
      }
      
      effectiveKeys = keysAvailable + totalReachableKeys;
    } else {
      // Branching dungeon - can't guarantee finding keys behind doors
      // because player might open the wrong door first.
      // Only use keys that are guaranteed before any key doors (inventory + keys in reachable regions).
      effectiveKeys = guaranteedAvailableKeys;
    }
    
    // Track keys used
    let keysUsed = 0;
    
    // Build regionsWithKeyDoorExits: regions that have key door exits leading to DEEPER regions
    // These are "critical path" regions because opening them unlocks more doors
    const regionsWithKeyDoorExits = new Set<string>();
    for (const [regionName, depth] of regionMinDoors) {
      if (depth === 0) continue; // Skip already-reachable regions
      const region = regions[regionName];
      if (!region) continue;
      for (const [, exit] of Object.entries(region.exits || {})) {
        if (this.requiresSmallKey(exit)) {
          // Check if this key door leads to a deeper region
          const targetDepth = regionMinDoors.get(exit.to);
          if (targetDepth !== undefined && targetDepth > depth) {
            // This region has a key door that leads to a deeper region - it's on critical path
            regionsWithKeyDoorExits.add(regionName);
            break;
          }
        }
      }
    }
    
    // Build critical clusters: which depth-1 clusters contain critical path regions?
    // Regions in these clusters are "available" because a rational player must open their door
    const criticalClusters = new Set<string>();
    for (const region of regionsWithKeyDoorExits) {
      const cluster = doorCluster.get(region);
      if (cluster) {
        criticalClusters.add(cluster);
      }
    }
    
    // If we can open all doors (including bypassable ones, since player might waste keys on them),
    // everything is available
    if (effectiveKeys >= totalDoors) {
      for (const [region, minDoors] of regionMinDoors) {
        if (!currentReachable.has(region) && minDoors <= effectiveKeys) {
          regionsDiscovered.set(region, "available");
          keysUsed = Math.max(keysUsed, minDoors);
        }
      }
      return { regionsDiscovered, keysUsed };
    }
    
    // Not enough keys for all doors - apply critical path logic
    // A region is on the "critical path" if it has key door exits (unlocks more doors)
    // Critical path regions are "available" because a rational player will open them
    // Side branches (no further doors) are "possible" - player might skip them
    
    // Compute global max reachable depth for the dungeon
    // This determines the deepest region a player could possibly reach
    // For branching dungeons, we simulate optimal play (opening only 1 door per depth)
    // For linear dungeons, pot keys from previous depths extend our reach
    let globalMaxReachableDepth = 0;
    {
      // Build keys at each depth (only used for linear dungeons)
      const keysAtDepthGlobal = new Map<number, number>();
      if (depth1Doors === 1) {
        // Only count keys for linear dungeons where we're guaranteed to find them
        for (const [regionName, depth] of regionMinDoors) {
          if (depth === 0) continue;
          const regionData = regions[regionName];
          if (!regionData || !regionData.locations) continue;
          for (const [locName] of Object.entries(regionData.locations)) {
            if (this.isKeyLocation(locName) && this.getDungeonFromRegion(regionName) === dungeonId) {
              keysAtDepthGlobal.set(depth, (keysAtDepthGlobal.get(depth) || 0) + 1);
            }
          }
        }
      }
      
      // Find max depth with doors
      let maxDepthWithDoors = 0;
      for (const [d] of doorsAtDepth) {
        maxDepthWithDoors = Math.max(maxDepthWithDoors, d);
      }
      
      // Simulate depth progression - optimal play (opening 1 door per branching depth)
      // Don't subtract bypassable doors here - they're optional shortcuts, not required for depth progression
      let keysRemaining = availableKeys;
      
      // Debug for PoD
      for (let d = 1; d <= maxDepthWithDoors; d++) {
        const doorsHere = doorsAtDepth.get(d) || 0;
        if (doorsHere === 0) continue;
        
        // Keys from previous depth - only for linear dungeons
        // For branching dungeons, we can't guarantee finding keys at previous depths
        const keysPrevDepth = (depth1Doors === 1 && d > 1 && d - 1 <= globalMaxReachableDepth) 
          ? (keysAtDepthGlobal.get(d - 1) || 0) 
          : 0;
        keysRemaining += keysPrevDepth;
        
        if (keysRemaining < 1) {
          // Can't open any door at this depth - stopped
          break;
        }
        
        // Can reach this depth (open at least one door)
        globalMaxReachableDepth = d;
        // Only consume 1 key per depth for optimal pathing (best case reach)
        keysRemaining -= 1;
      }
    }
    
    for (const [region, minDoors] of regionMinDoors) {
      if (currentReachable.has(region)) {
        continue;
      }
      
      // Check if this region is on the critical path
      const isOnCriticalPath = regionsWithKeyDoorExits.has(region);
      // Check if this region's cluster contains a critical path region
      const regionCluster = doorCluster.get(region);
      const isInCriticalCluster = regionCluster ? criticalClusters.has(regionCluster) : false;
      
      if (minDoors === 1) {
        // Depth 1 region
        // First check if we can even reach depth 1
        if (globalMaxReachableDepth < 1) {
          // Can't reach depth 1 at all - leave for Phase 3 (which will mark as unreachable)
          continue;
        }
        
        // Count how many depth-1 doors are NOT in critical clusters
        // (these could be "wasted" keys before a rational player reaches critical areas)
        const nonCriticalDepth1Doors = depth1Doors - criticalClusters.size;
        // To guarantee reaching a critical cluster, need enough keys to waste on non-critical doors + 1
        const keysNeededForCriticalCluster = nonCriticalDepth1Doors + 1;
        
        if (depth1Doors === 1 && !isBranchingDungeon) {
          // Only one depth-1 door, no branching choice
          if (effectiveKeys >= 1) {
            regionsDiscovered.set(region, "available");
            keysUsed = Math.max(keysUsed, 1);
          } else if (availableKeys >= 1) {
            regionsDiscovered.set(region, "possible");
            keysUsed = Math.max(keysUsed, 1);  // Track key usage even for "possible"
          }
        } else if (isBranchingDungeon) {
          // Branching dungeon - player could waste keys on wrong paths
          // But still use critical path logic: regions on critical path are more likely to be reached
          // 
          // For both critical and non-critical depth-1 regions in branching dungeons:
          // Need enough keys for ALL doors to guarantee reaching any specific region,
          // since player could waste keys on wrong paths.
          const deeperDoors = totalDoors - depth1Doors;
          
          if (isOnCriticalPath || isInCriticalCluster) {
            // Critical path region in branching dungeon:
            const nonCriticalDepth1 = depth1Doors - criticalClusters.size;
            
            let keysNeeded: number;
            if (criticalClusters.size === 1) {
              // Single critical path: can waste on non-critical + open this + have keys for deeper
              // This is safe because there's only one "right" path to take
              keysNeeded = nonCriticalDepth1 + 1 + Math.min(1, deeperDoors);
            } else {
              // Multiple critical paths: player could go down the wrong critical path
              // and waste keys there before reaching this region.
              // Need enough keys for ALL doors to guarantee reaching any specific critical region.
              keysNeeded = totalDoors;
            }
            
            if (effectiveKeys >= keysNeeded) {
              regionsDiscovered.set(region, "available");
              keysUsed = Math.max(keysUsed, 1);
            } else if (globalMaxReachableDepth >= 1) {
              regionsDiscovered.set(region, "possible");
              keysUsed = Math.max(keysUsed, 1);
            }
          } else {
            // Non-critical (side branch): only available if we can afford ALL doors
            if (effectiveKeys >= totalDoors) {
              regionsDiscovered.set(region, "available");
              keysUsed = Math.max(keysUsed, 1);
            } else if (globalMaxReachableDepth >= 1) {
              regionsDiscovered.set(region, "possible");
              keysUsed = Math.max(keysUsed, 1);
            }
          }
        } else if (isOnCriticalPath || isInCriticalCluster) {
          // Multiple depth-1 doors, but this region is in a critical cluster
          // "Available" only if we have enough keys to waste on all non-critical doors
          // and STILL open this one
          if (effectiveKeys >= keysNeededForCriticalCluster) {
            regionsDiscovered.set(region, "available");
            keysUsed = Math.max(keysUsed, 1);
          } else if (globalMaxReachableDepth >= 1) {
            regionsDiscovered.set(region, "possible");
            keysUsed = Math.max(keysUsed, 1);  // Track key usage even for "possible"
          }
        } else {
          // Side branch - no further doors behind this region
          // Player might skip to save keys for deeper exploration
          // Only "available" if we have enough keys for ALL doors (including bypassable)
          if (effectiveKeys >= totalDoors) {
            regionsDiscovered.set(region, "available");
            keysUsed = Math.max(keysUsed, 1);
          } else if (globalMaxReachableDepth >= 1) {
            regionsDiscovered.set(region, "possible");
            keysUsed = Math.max(keysUsed, 1);  // Track key usage even for "possible"
          }
        }
      } else {
        // Depth 2+ region
        // First check if we can even reach this depth
        if (globalMaxReachableDepth < minDoors) {
          // Can't reach this depth at all - leave for Phase 3 (which will mark as unreachable)
          continue;
        }
        
        // For branching dungeons, deeper regions require enough keys for ALL doors
        // because the player could waste keys on wrong paths before reaching this region
        if (isBranchingDungeon) {
          if (effectiveKeys >= totalDoors) {
            regionsDiscovered.set(region, "available");
            keysUsed = Math.max(keysUsed, minDoors);
          } else if (globalMaxReachableDepth >= minDoors) {
            regionsDiscovered.set(region, "possible");
            keysUsed = Math.max(keysUsed, minDoors);
          }
          continue;
        }
        
        // For a region at depth D to be "available", we need GUARANTEED reachability
        // even if the player makes suboptimal choices at earlier depths.
        //
        // Key insight: even in a "linear" dungeon (depth1Doors === 1), there might be
        // branching at DEEPER levels. We need to account for doors at each depth.
        //
        // Calculate: how many doors are at each depth level up to this region's depth?
        // If cumulative doors at any depth exceed keys available, we can't guarantee access.
        
        if (effectiveKeys >= totalDoors) {
          // Can open all doors - everything reachable is available
          regionsDiscovered.set(region, "available");
          keysUsed = Math.max(keysUsed, minDoors);
        } else {
          // Not enough keys for all doors - check if THIS region is guaranteed reachable
          // 
          // For a region at depth D to be guaranteed reachable, we need:
          // cumulative doors from depth 1 to D <= keys available (accounting for key pickups)
          //
          // Build cumulative door count and check against key budget
          
          // First, build keys found at each depth
          const keysAtDepth = new Map<number, number>();
          for (const [regionName, depth] of regionMinDoors) {
            if (depth === 0) continue; // Already reachable
            const regionData = regions[regionName];
            if (!regionData || !regionData.locations) continue;
            for (const [locName] of Object.entries(regionData.locations)) {
              if (this.isKeyLocation(locName) && this.getDungeonFromRegion(regionName) === dungeonId) {
                keysAtDepth.set(depth, (keysAtDepth.get(depth) || 0) + 1);
              }
            }
          }
          
          // For a region at depth D to be "available" (guaranteed reachable):
          // We need enough keys such that even if we waste keys on other branches,
          // we can still reach this specific region.
          //
          // Key insight: At any depth d where there are multiple doors:
          // - We might waste keys on dead-end branches before finding the right path
          // - If opening all doors at that depth leaves insufficient keys for deeper levels,
          //   then regions at that depth become a "choice" (possible, not available)
          //
          // Algorithm:
          // 1. Simulate "greedy" exploration where we open ALL doors at each depth
          // 2. If at any point we don't have enough keys to continue, mark as not guaranteed
          // 3. Additionally, if we can reach the target but it's one of multiple destinations
          //    at a depth where we can't afford ALL paths, it's "possible" not "available"
          
          // First, get max depth to check (highest depth with any door)
          let maxDepth = minDoors;
          for (const [d] of doorsAtDepth) {
            maxDepth = Math.max(maxDepth, d);
          }
          
          // Simulate: at each depth, track keys remaining after opening ALL doors
          // Start with available keys, minus bypassable doors that could waste keys
          // (bypassable doors are entirely within the initially-reachable area, not in doorsAtDepth)
          const internalBypassableDoors = bypassableDoorCount;
          let keysRemaining = availableKeys - internalBypassableDoors;
          let canGuaranteeReach = true;
          let depthWhereChoiceRequired = -1; // Depth where we can't afford all doors
          let couldOpenAllDoorsAtChoiceDepth = false; // Whether we could open ALL doors at the choice depth
          let maxReachableDepth = 0; // Maximum depth we can guarantee reaching
          let stoppedAtDepth = -1; // Depth where we completely ran out of keys (can't open ANY doors)
          
          for (let d = 1; d <= maxDepth; d++) {
            // If we've already stopped (couldn't open ANY doors at a previous depth), 
            // don't continue - we can't reach deeper depths
            if (stoppedAtDepth >= 0) {
              break;
            }
            
            const doorsHere = doorsAtDepth.get(d) || 0;
            
            // Keys found at depth d-1 (previous depth) can be used for doors at depth d
            // We find keys AFTER opening the door to that depth
            // Only add keys if we actually reached that depth AND dungeon is linear
            // For branching dungeons, we can't guarantee finding keys at previous depths
            const keysPrevDepth = (depth1Doors === 1 && d > 1 && d - 1 <= maxReachableDepth) 
              ? (keysAtDepth.get(d - 1) || 0) 
              : 0;
            keysRemaining += keysPrevDepth;
            
            // Check if we can open all doors at this depth
            if (keysRemaining < doorsHere) {
              // Can't open all doors at this depth - must make a choice
              if (depthWhereChoiceRequired < 0) {
                depthWhereChoiceRequired = d;
                couldOpenAllDoorsAtChoiceDepth = false; // We couldn't open ALL doors
              }
              // We can open SOME doors (up to keysRemaining of them)
              // If we have at least 1 key, we can reach this depth (but not all destinations)
              if (keysRemaining > 0) {
                maxReachableDepth = d;
              } else {
                // We have 0 keys and doors to open - we're completely stuck
                stoppedAtDepth = d;
              }
              keysRemaining = 0; // All keys used
            } else {
              // Can open all doors at this depth
              keysRemaining -= doorsHere;
              maxReachableDepth = d; // We can reach this depth
              
              // Even if we CAN open all doors, check if doing so leaves us unable to proceed
              // If there are doors at deeper levels and we have 0 keys left, 
              // AND there are multiple doors at THIS level, then this is a choice point
              if (keysRemaining === 0 && doorsHere > 1 && d < maxDepth) {
                // Check if there are any doors deeper than this level
                let hasDeeper = false;
                for (let dd = d + 1; dd <= maxDepth; dd++) {
                  if ((doorsAtDepth.get(dd) || 0) > 0) {
                    hasDeeper = true;
                    break;
                  }
                }
                if (hasDeeper && depthWhereChoiceRequired < 0) {
                  depthWhereChoiceRequired = d;
                  couldOpenAllDoorsAtChoiceDepth = true; // We could open all doors at choice depth
                }
              }
            }
          }
          
          // First, check if the target is beyond our maximum reachable depth
          if (minDoors > maxReachableDepth) {
            // We can't reach this depth at all - unreachable
            canGuaranteeReach = false;
            // Don't set to "possible" either - leave for Phase 3 to handle
          } else if (depthWhereChoiceRequired >= 0) {
            // We had to make a choice at some depth
            if (minDoors >= depthWhereChoiceRequired) {
              // Our target is at or after the choice point
              // Check: at the choice depth, if there are multiple doors, 
              // is our destination on the "critical path" that leads deeper?
              // Critical path regions are guaranteed because a rational player takes them.
              const doorsAtChoice = doorsAtDepth.get(depthWhereChoiceRequired) || 0;
              
              // Check if this region or its cluster leads to deeper regions
              // Note: isOnCriticalPath is already defined in outer scope for depth 1 regions
              const isOnCriticalPathDeep = regionsWithKeyDoorExits.has(region);
              
              // For depth > 1 regions, check if they can REACH a region with key door exits
              // without using additional keys (i.e., they're in the same "depth cluster")
              let leadsToDeeper = isOnCriticalPathDeep;
              if (!leadsToDeeper && minDoors === depthWhereChoiceRequired) {
                // BFS from this region to find if we can reach a regionsWithKeyDoorExits member
                // without going through key doors
                const visited = new Set<string>();
                const toVisit = [region];
                while (toVisit.length > 0 && !leadsToDeeper) {
                  const current = toVisit.shift()!;
                  if (visited.has(current)) continue;
                  visited.add(current);
                  
                  // Check if current region leads to deeper
                  if (regionsWithKeyDoorExits.has(current)) {
                    leadsToDeeper = true;
                    break;
                  }
                  
                  // Add neighbors reachable without key doors
                  const currentRegionData = regions[current];
                  if (currentRegionData && currentRegionData.exits) {
                    for (const [, exit] of Object.entries(currentRegionData.exits)) {
                      if (!this.requiresSmallKey(exit) && !visited.has(exit.to)) {
                        // Only consider regions at the same depth (part of our cluster)
                        const targetMinDoors = regionMinDoors.get(exit.to);
                        if (targetMinDoors === minDoors) {
                          toVisit.push(exit.to);
                        }
                      }
                    }
                  }
                }
              }
              
              // Key distinction: 
              // - If couldOpenAllDoorsAtChoiceDepth is TRUE, we reached ALL destinations at the choice depth,
              //   so regions AT that depth are available (if on critical path), but DEEPER may not be.
              // - If couldOpenAllDoorsAtChoiceDepth is FALSE, we couldn't open all doors at the choice depth,
              //   so even regions AT that depth behind different doors are not guaranteed.
              
              if (minDoors === depthWhereChoiceRequired && !couldOpenAllDoorsAtChoiceDepth) {
                // We're at the choice depth AND we couldn't open all doors there
                // Even critical path regions are only "possible" because we might open wrong door
                if (doorsAtChoice > 1) {
                  canGuaranteeReach = false;
                }
              } else if (doorsAtChoice > 1 && !leadsToDeeper) {
                // Multiple destinations at choice depth, and we're NOT on the critical path
                // This is a side branch - not guaranteed
                canGuaranteeReach = false;
              } else if (minDoors > depthWhereChoiceRequired && !leadsToDeeper) {
                // Our target is DEEPER than the choice point, and we're not on critical path
                canGuaranteeReach = false;
              }
              
              // If we're on the critical path (leadsToDeeper) AND we could open all doors at choice depth,
              // or we're deeper than choice and on critical path, remain available
            }
          } else {
            // No choice required - we can open all doors
            canGuaranteeReach = true;
          }
          
          if (canGuaranteeReach) {
            regionsDiscovered.set(region, "available");
            keysUsed = Math.max(keysUsed, minDoors);
          } else if (minDoors <= globalMaxReachableDepth) {
            // Only mark as "possible" if the depth is within what we can actually reach
            regionsDiscovered.set(region, "possible");
            keysUsed = Math.max(keysUsed, minDoors);
          }
          // else: unreachable (Phase 3 handles this)
        }
      }
    }
    
    // Phase 3: Mark remaining reachable regions as "possible" only if they're reachable
    // Use globalMaxReachableDepth which accounts for actual depth progression
    for (const region of phase1Reachable) {
      if (!currentReachable.has(region) && !regionsDiscovered.has(region)) {
        const minDoors = regionMinDoors.get(region);
        // A region is "possible" if its depth is within what we can actually reach
        if (minDoors !== undefined && minDoors <= globalMaxReachableDepth) {
          regionsDiscovered.set(region, "possible");
        }
        // If minDoors > globalMaxReachableDepth, leave as unreachable (not added to regionsDiscovered)
      }
    }

    return { regionsDiscovered, keysUsed };
  }
}
