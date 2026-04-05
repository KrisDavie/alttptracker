/**
 * RegionsProvider — Pre-mutated logic graph pipeline.
 *
 * Takes the base logic_regions graph and applies all shuffle transforms (entrance,
 * tile flip, layout, whirlpool, flute, doors) to produce an effective regions object.
 * Shuffled exits are severed (to set to null) or remapped in the graph itself, so
 * the traverser never needs runtime exit resolution.
 *
 * TRANSFORM ORDER:
 * 1. Entrance shuffle: sever + remap entrance exits
 * 2. Tile flip: remap tile-boundary exits crossing flip boundaries
 * 3. Layout shuffle: remap tile-boundary exits via edgeLinks
 * 4. Whirlpool shuffle: remap whirlpool exits via whirlpoolLinks
 * 5. Flute shuffle: remap flute exits via fluteLinks
 * 6. Door shuffle: (skeleton — no-op) remap dungeon room exits
 *
 * SEVERING STRATEGY:
 * Shuffled-but-unlinked exits get `to` set to null (sentinel). The traverser skips
 * them via existing `!exit?.to` guards. The exit key is preserved for UI/tracking.
 *
 * PERFORMANCE:
 * Only regions with modified exits are shallow-copied. The base logic_regions object
 * is never mutated. Transforms share a precomputed RegionMetadata context.
 */

import type { ExitLogic, GameState, LogicRequirement, LogicState, RegionLogic, WorldLogic } from "@/data/logic/logicTypes";
import { entranceLocations } from "@/data/locationsData";
import { whirlpoolRegistry, parallelLinks } from "@/data/logic/owData";

// ─── Shared metadata computed once for all transforms ──────────────────

export interface RegionMetadata {
  /** exit name → [{ to, type }] from the base graph */
  exitDestMap: Map<string, { to: string; type: string }[]>;
  /** exit name → [{ regionName, regionType }] parent regions */
  exitToParentRegions: Map<string, { regionName: string; regionType: string }[]>;
  /** entrance name → correct overworld parent region */
  entranceToParentRegion: Map<string, string>;
  /** region name → owid */
  regionToOwid: Map<string, number>;
  /** exit name → the region that defines it */
  exitToSourceRegion: Map<string, string>;
  /** Set of exit names that cross tile boundaries (different owid between source and dest) */
  tileBoundaryExits: Set<string>;
  /** interior region/entrance name → owid of the overworld region that lists it in entrances[] */
  interiorToOwid: Map<string, number>;
  /** Flute exit name → 1-based spot index */
  fluteSpotExits: Map<string, number>;
  /** Set of whirlpool exit names */
  whirlpoolExitNames: Set<string>;
}

/**
 * Build all metadata needed by transforms and traverser from the base regions graph.
 * This is computed once and shared.
 */
export function buildRegionMetadata(regions: Record<string, RegionLogic>): RegionMetadata {
  const exitDestMap = new Map<string, { to: string; type: string }[]>();
  const exitToParentRegions = new Map<string, { regionName: string; regionType: string }[]>();
  const entranceToParentRegion = new Map<string, string>();
  const regionToOwid = new Map<string, number>();
  const exitToSourceRegion = new Map<string, string>();
  const tileBoundaryExits = new Set<string>();
  const interiorToOwid = new Map<string, number>();
  const fluteSpotExits = new Map<string, number>();
  const whirlpoolExitNames = new Set(whirlpoolRegistry);

  // Single pass over all regions
  for (const [regionName, regionLogic] of Object.entries(regions)) {
    // owid mapping
    if (regionLogic.owid != null) {
      regionToOwid.set(regionName, regionLogic.owid);
      if (regionLogic.entrances) {
        for (const entrance of regionLogic.entrances) {
          interiorToOwid.set(entrance, regionLogic.owid);
        }
      }
    }

    if (!regionLogic.exits) continue;
    for (const [exitName, exit] of Object.entries(regionLogic.exits)) {
      if (!exit?.to) continue;

      // Exit dest map
      if (!exitDestMap.has(exitName)) {
        exitDestMap.set(exitName, []);
        exitToParentRegions.set(exitName, []);
      }
      exitDestMap.get(exitName)!.push({ to: exit.to, type: exit.type });
      exitToParentRegions.get(exitName)!.push({ regionName, regionType: regionLogic.type });

      // Exit source map
      exitToSourceRegion.set(exitName, regionName);

      // Tile-boundary exit detection
      const sourceOwid = regionLogic.owid;
      const destRegionLogic = regions[exit.to];
      const destOwid = destRegionLogic?.owid;
      if (sourceOwid != null && destOwid != null && sourceOwid !== destOwid &&
        (exit.type === "LightWorld" || exit.type === "DarkWorld")) {
        tileBoundaryExits.add(exitName);
      }
    }
  }

  // Entrance → parent region mapping
  for (const [entranceName, locData] of Object.entries(entranceLocations)) {
    const parent = pickParentRegion(exitToParentRegions.get(entranceName), locData.world);
    if (parent) entranceToParentRegion.set(entranceName, parent);
  }

  // Flute spot exits from "Flute Sky" region
  const fluteRegion = regions["Flute Sky"];
  if (fluteRegion?.exits) {
    let index = 1;
    for (const exitName of Object.keys(fluteRegion.exits)) {
      fluteSpotExits.set(exitName, index++);
    }
  }

  return {
    exitDestMap,
    exitToParentRegions,
    entranceToParentRegion,
    regionToOwid,
    exitToSourceRegion,
    tileBoundaryExits,
    interiorToOwid,
    fluteSpotExits,
    whirlpoolExitNames,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────

/**
 * Pick the correct parent region for an entrance based on its world.
 * "lw" entrances match LightWorld regions, "dw" match DarkWorld regions.
 */
export function pickParentRegion(
  parents: { regionName: string; regionType: string }[] | undefined,
  entranceWorld: string
): string | undefined {
  if (!parents || parents.length === 0) return undefined;
  if (parents.length === 1) return parents[0].regionName;
  const targetType = entranceWorld === "dw" ? "DarkWorld" : "LightWorld";
  const match = parents.find(p => p.regionType === targetType);
  return match?.regionName ?? parents[0].regionName;
}

/**
 * Pick the correct exit destination for an entrance based on its world.
 */
export function pickExitDest(
  dests: { to: string; type: string }[] | undefined,
  parents: { regionName: string; regionType: string }[] | undefined,
  entranceWorld: string
): { to: string; type: string } | undefined {
  if (!dests || dests.length === 0) return undefined;
  if (dests.length === 1) return dests[0];
  if (!parents || parents.length !== dests.length) return dests[0];
  const targetType = entranceWorld === "dw" ? "DarkWorld" : "LightWorld";
  const idx = parents.findIndex(p => p.regionType === targetType);
  return idx >= 0 ? dests[idx] : dests[0];
}

/**
 * Get a shallow-copied exits object for a region, creating it if not already copied.
 * Tracks which regions have been copied via the `copied` set.
 */
function getOrCopyExits(
  regions: Record<string, RegionLogic>,
  regionName: string,
  copied: Set<string>,
): ExitLogic {
  if (!copied.has(regionName)) {
    const original = regions[regionName];
    regions[regionName] = { ...original, exits: { ...original.exits } };
    copied.add(regionName);
  }
  return regions[regionName].exits;
}

/**
 * Set an exit's destination (and optionally type) in the mutated graph.
 * If `to` is null, the exit is severed (traverser skips via `!exit?.to` guard).
 */
function setExitTo(
  exits: ExitLogic,
  exitName: string,
  to: string | null,
  type?: string,
): void {
  const existing = exits[exitName];
  if (!existing) return;
  // Cast to allow null — traverser handles this via `!exit?.to`
  exits[exitName] = { ...existing, to: to as string, ...(type != null ? { type } : {}) };
}

// ─── OWR world helpers (stateless, operate on state data) ──────────────

function getEffectiveWorld(owid: number, tileWorlds: Record<string | number, "light" | "dark">): "light" | "dark" {
  const override = tileWorlds[owid];
  if (override) return override;
  return (owid < 64 || owid >= 128) ? "light" : "dark";
}

function getVanillaWorld(owid: number): "light" | "dark" {
  return (owid < 64 || owid >= 128) ? "light" : "dark";
}

// ─── Transform 1a: Entrance shuffle (no map) ─────────────────────────
// When mapMode is "off" and entrance shuffle is active, the player cannot
// input entrance links via the UI. Instead, add free exits from Menu to
// every shuffled entrance destination so all interiors are reachable.

function applyEntranceShuffleNoMap(
  regions: Record<string, RegionLogic>,
  state: GameState,
): Record<string, RegionLogic> {
  const result = { ...regions };
  const entranceMode = state.settings.entranceMode;
  const emptyRequirements = { Open: {}, Inverted: {} };

  // Collect all interior destinations for shuffled entrances
  const menuExits: Record<string, { to: string; type: string; requirements: typeof emptyRequirements }> = {};

  for (const [entranceName, locData] of Object.entries(entranceLocations)) {
    const pool = locData.entrance_modes?.[entranceMode];
    if (!pool || pool === "vanilla") continue;

    const portalRegions = locData.entranceRegions;
    if (!portalRegions || portalRegions.length === 0) continue;

    for (const portalRegion of portalRegions) {
      if (!regions[portalRegion]) continue;
      const regionType = regions[portalRegion].type ?? "Dungeon";
      menuExits[`Entrance Shuffle ${entranceName} - ${portalRegion}`] = {
        to: portalRegion,
        type: regionType,
        requirements: emptyRequirements,
      };
    }
  }

  // Append free exits to Menu
  const menuRegion = result["Menu"];
  if (menuRegion) {
    result["Menu"] = {
      ...menuRegion,
      exits: { ...menuRegion.exits, ...menuExits },
    };
  }

  return result;
}

// ─── Transform 1: Entrance shuffle ────────────────────────────────────

function applyEntranceShuffle(
  regions: Record<string, RegionLogic>,
  state: GameState,
  meta: RegionMetadata,
): Record<string, RegionLogic> {
  if (state.settings.entranceMode === "none") return regions;

  // When map is off, the player has no UI to input entrance links.
  // Add free exits from Menu to every shuffled entrance's interior so
  // all dungeons/caves are assumed reachable regardless of shuffle.
  if (state.settings.mapMode === "off") {
    return applyEntranceShuffleNoMap(regions, state);
  }

  const result = { ...regions };
  const copied = new Set<string>();
  const entranceMode = state.settings.entranceMode;

  // --- Forward pass: sever or remap entrance exits ---
  const reverseLinks = new Map<string, string>(); // destination entrance → source entrance
  const genericConnectors = new Map<string, string[]>();

  for (const [entranceName, locData] of Object.entries(entranceLocations)) {
    const pool = locData.entrance_modes?.[entranceMode];
    if (!pool || pool === "vanilla") continue;

    // When Link's House isn't shuffled, keep the S&Q destination vanilla.
    // Links House is always kept (Open/Standard/Inverted_1 S&Q destination).
    // Big Bomb Shop is only kept in Inverted mode (it's the Inverted S&Q destination).
    if (!state.settings.shuffleLinks) {
      if (entranceName === "Links House") continue;
      if (entranceName === "Big Bomb Shop" && state.settings.worldState === "inverted") continue;
    }

    // Find parent region containing this entrance exit
    const parentRegion = meta.entranceToParentRegion.get(entranceName);
    if (!parentRegion || !result[parentRegion]?.exits?.[entranceName]) continue;

    const link = state.entrances[entranceName]?.to;
    const exits = getOrCopyExits(result, parentRegion, copied);

    if (link) {
      // User linked this entrance — remap to destination's interior
      const linkData = entranceLocations[link];
      const destInfo = pickExitDest(
        meta.exitDestMap.get(link),
        meta.exitToParentRegions.get(link),
        linkData?.world ?? "lw"
      );
      if (destInfo) {
        setExitTo(exits, entranceName, destInfo.to, destInfo.type);
        reverseLinks.set(link, entranceName);
      } else if (link.startsWith("Generic Connector")) {
        setExitTo(exits, entranceName, link, "Cave");
        if (!genericConnectors.has(link)) {
          genericConnectors.set(link, []);
        }
        genericConnectors.get(link)!.push(entranceName);
      } else {
        // Generic destination (Shop, Rupee, etc.) — sever
        setExitTo(exits, entranceName, null);
      }
    } else {
      // Shuffled but not yet linked — sever
      setExitTo(exits, entranceName, null);
    }
  }

  // --- Reverse pass: remap interior return exits ---
  for (const [entranceName, locData] of Object.entries(entranceLocations)) {
    const pool = locData.entrance_modes?.[entranceMode];
    if (!pool || pool === "vanilla") continue;

    // Skip entrances kept vanilla above
    if (!state.settings.shuffleLinks) {
      if (entranceName === "Links House") continue;
      if (entranceName === "Big Bomb Shop" && state.settings.worldState === "inverted") continue;
    }

    // Find the interior region for this entrance
    const destInfo = pickExitDest(
      meta.exitDestMap.get(entranceName),
      meta.exitToParentRegions.get(entranceName),
      locData.world
    );
    if (!destInfo) continue;
    const portalRegion = result[destInfo.to];
    if (!portalRegion?.exits) continue;

    // Parent region for this entrance
    const parentRegion = meta.entranceToParentRegion.get(entranceName);
    if (!parentRegion) continue;

    // Find return exits: exits from the portal whose vanilla destination matches the parent
    const matchingReturnExits = Object.entries(portalRegion.exits)
      .filter(([, returnExit]) => returnExit.to === parentRegion);

    // Match specific return exit (handle connectors with directional qualifiers)
    let targetReturnExitName: string | undefined;
    if (matchingReturnExits.length === 1) {
      targetReturnExitName = matchingReturnExits[0][0];
    } else if (matchingReturnExits.length > 1) {
      const dirMatch = entranceName.match(/\(([^)]+)\)$/);
      if (dirMatch) {
        const direction = dirMatch[1];
        const match = matchingReturnExits.find(([name]) => name.includes(`(${direction})`));
        if (match) targetReturnExitName = match[0];
      }
      if (!targetReturnExitName) targetReturnExitName = matchingReturnExits[0][0];
    }

    if (!targetReturnExitName) continue;

    const sourceEntrance = reverseLinks.get(entranceName);
    const interiorExits = getOrCopyExits(result, destInfo.to, copied);

    if (sourceEntrance) {
      // Someone linked to this entrance — return exit goes to linker's overworld region
      const sourceOverworld = meta.entranceToParentRegion.get(sourceEntrance);
      if (sourceOverworld) {
        const sourceRegion = result[sourceOverworld];
        setExitTo(interiorExits, targetReturnExitName, sourceOverworld, sourceRegion?.type ?? "LightWorld");
      }
    } else {
      // Nobody linked to this entrance — sever the return exit
      setExitTo(interiorExits, targetReturnExitName, null);
    }
  }

  // --- Create Generic Connector synthetic regions ---
  const emptyRequirements = { Open: {}, Inverted: {} };
  for (const [connectorName, sourceEntrances] of genericConnectors.entries()) {
    const connectorExits: Record<string, { to: string, type: string, requirements: typeof emptyRequirements }> = {};

    for (const ent of sourceEntrances) {
      const parentOverworld = meta.entranceToParentRegion.get(ent);
      if (parentOverworld) {
        const sourceRegion = result[parentOverworld];
        connectorExits[`Return to ${ent}`] = {
          to: parentOverworld,
          type: sourceRegion?.type ?? "LightWorld",
          requirements: emptyRequirements
        };
      }
    }

    result[connectorName] = {
      type: "Cave", // Valid interior type
      locations: {},
      entrances: sourceEntrances,
      exits: connectorExits,
    } as unknown as RegionLogic;
  }

  return result;
}

// ─── Transform 2: Tile Flip (Mixed OWR) ──────────────────────────────

function applyTileFlipRemaps(
  regions: Record<string, RegionLogic>,
  state: GameState,
  meta: RegionMetadata,
): Record<string, RegionLogic> {
  if (!state.settings.owMixed || Object.keys(state.overworld.tileWorlds).length === 0) return regions;

  const result = { ...regions };
  const copied = new Set<string>();

  for (const exitName of meta.tileBoundaryExits) {
    const sourceRegion = meta.exitToSourceRegion.get(exitName);
    if (!sourceRegion) continue;
    const sourceOwid = meta.regionToOwid.get(sourceRegion);

    const exitDef = regions[sourceRegion]?.exits?.[exitName];
    if (!exitDef?.to) continue;
    const destOwid = meta.regionToOwid.get(exitDef.to);

    if (sourceOwid == null || destOwid == null) continue;

    const sourceFlipped = getEffectiveWorld(sourceOwid, state.overworld.tileWorlds) !== getVanillaWorld(sourceOwid);
    const destFlipped = getEffectiveWorld(destOwid, state.overworld.tileWorlds) !== getVanillaWorld(destOwid);

    if (sourceFlipped !== destFlipped) {
      const parallelExit = (parallelLinks as Record<string, string>)[exitName];
      if (parallelExit) {
        const parallelSource = meta.exitToSourceRegion.get(parallelExit);
        if (parallelSource) {
          const parallelExitDef = regions[parallelSource]?.exits?.[parallelExit];
          if (parallelExitDef?.to) {
            const exits = getOrCopyExits(result, sourceRegion, copied);
            setExitTo(exits, exitName, parallelExitDef.to);
          }
        }
      }
    }
  }

  return result;
}

// ─── Transform 3: Layout Shuffle ─────────────────────────────────────

function applyLayoutRemaps(
  regions: Record<string, RegionLogic>,
  state: GameState,
  meta: RegionMetadata,
): Record<string, RegionLogic> {
  if (state.settings.owLayout === "vanilla") return regions;

  const result = { ...regions };
  const copied = new Set<string>();

  for (const exitName of meta.tileBoundaryExits) {
    const destExitName = state.overworld.edgeLinks[exitName];
    if (destExitName === undefined) continue; // Not in edgeLinks → vanilla (already in graph)

    const sourceRegion = meta.exitToSourceRegion.get(exitName);
    if (!sourceRegion) continue;
    const exits = getOrCopyExits(result, sourceRegion, copied);

    if (destExitName === null) {
      // Explicitly unknown → sever
      setExitTo(exits, exitName, null);
    } else {
      // Remap: destination is the region that defines the destination edge exit
      const destRegion = meta.exitToSourceRegion.get(destExitName);
      if (!destRegion) {
        setExitTo(exits, exitName, null);
      } else {
        const destRegionLogic = regions[destRegion];
        setExitTo(exits, exitName, destRegion, destRegionLogic?.type ?? undefined);
      }
    }
  }

  return result;
}

// ─── Transform 4: Whirlpool Shuffle ──────────────────────────────────

function applyWhirlpoolRemaps(
  regions: Record<string, RegionLogic>,
  state: GameState,
  meta: RegionMetadata,
): Record<string, RegionLogic> {
  if (!state.settings.owWhirlpool) return regions;

  const result = { ...regions };
  const copied = new Set<string>();

  for (const exitName of meta.whirlpoolExitNames) {
    const destWhirlpool = state.overworld.whirlpoolLinks[exitName];
    if (destWhirlpool === undefined) continue; // Not in whirlpoolLinks → vanilla

    const sourceRegion = meta.exitToSourceRegion.get(exitName);
    if (!sourceRegion) continue;
    const exits = getOrCopyExits(result, sourceRegion, copied);

    if (destWhirlpool === null) {
      setExitTo(exits, exitName, null);
    } else {
      const destRegion = meta.exitToSourceRegion.get(destWhirlpool);
      if (!destRegion) {
        setExitTo(exits, exitName, null);
      } else {
        const destRegionLogic = regions[destRegion];
        setExitTo(exits, exitName, destRegion, destRegionLogic?.type ?? undefined);
      }
    }
  }

  return result;
}

// ─── Transform 5: Flute Shuffle ─────────────────────────────────────

function applyFluteRemaps(
  regions: Record<string, RegionLogic>,
  state: GameState,
  meta: RegionMetadata,
): Record<string, RegionLogic> {
  if (state.settings.owFluteShuffle === "vanilla") return regions;

  const result = { ...regions };
  const copied = new Set<string>();

  for (const [exitName, spotIndex] of meta.fluteSpotExits) {
    const destRegion = state.overworld.fluteLinks[spotIndex];
    if (destRegion === undefined) continue; // Not in fluteLinks → vanilla

    // Flute exits all come from "Flute Sky" region
    const exits = getOrCopyExits(result, "Flute Sky", copied);

    if (destRegion === null) {
      setExitTo(exits, exitName, null);
    } else {
      const destRegionLogic = regions[destRegion];
      if (!destRegionLogic) {
        setExitTo(exits, exitName, null);
      } else {
        setExitTo(exits, exitName, destRegion, destRegionLogic.type ?? undefined);
      }
    }
  }

  return result;
}

// ─── Transform 6: Door Shuffle (skeleton) ────────────────────────────

/**
 * Door shuffle remaps exits between dungeon rooms.
 *
 * Modes:
 * - basic: shuffles within a single dungeon
 * - crossed: shuffles between all dungeons
 * - partitioned: shuffles between groups of dungeons
 *
 * Constraints:
 * - Only exits crossing different tileIDs are eligible
 * - Exits to/from the same tileID remain vanilla
 *
 * Currently a no-op — will consume a future `state.doors` slice.
 */
function applyDoorRemaps(
  regions: Record<string, RegionLogic>,
  _state: GameState, // eslint-disable-line @typescript-eslint/no-unused-vars
  _meta: RegionMetadata, // eslint-disable-line @typescript-eslint/no-unused-vars
): Record<string, RegionLogic> {
  // TODO: Implement when door shuffle state/slice is added.
  // Will operate on dungeon-type regions, severing cross-tileID exits
  // and remapping based on state.doors links.
  return regions;
}

// ─── Standverted pre-processing ──────────────────────────────────────

/**
 * Apply standverted tile flips to state before transforms run.
 * Returns the modified state (does NOT mutate the original).
 */
export function applyStandvertedState(state: GameState): GameState {
  if (state.settings.worldState !== "standverted") return state;

  const standvertedFlips: Record<number, "light" | "dark"> = {
    19: "dark",   // Sanctuary - Home
    83: "light",
    20: "dark",   // Graveyard
    84: "light",
    26: "dark",   // Forgotten forest
    90: "light",
    27: "dark",   // Hyrule Castle
    91: "light",
    43: "dark",   // Central bonk rocks
    107: "light",
    44: "dark",   // Link's House - Home
    108: "light",
  };

  return {
    ...state,
    settings: { ...state.settings, owMixed: true },
    overworld: {
      ...state.overworld,
      tileWorlds: { ...standvertedFlips, ...state.overworld.tileWorlds },
    },
  };
}

// ─── Main pipeline entry point ────────────────────────────────────────

/**
 * Build the effective regions graph by applying all shuffle transforms.
 * Returns the mutated regions and shared metadata (needed by traverser).
 */
export function buildEffectiveRegions(
  baseRegions: Record<string, RegionLogic>,
  state: GameState,
): { regions: Record<string, RegionLogic>; metadata: RegionMetadata } {
  // Apply standverted state adjustments first
  const effectiveState = applyStandvertedState(state);

  // Build shared metadata from the BASE (unmodified) regions
  const metadata = buildRegionMetadata(baseRegions);

  // Apply transforms in order — each receives the progressively mutated graph
  let regions = baseRegions as Record<string, RegionLogic>;

  regions = applyEntranceShuffle(regions, effectiveState, metadata);
  regions = applyTileFlipRemaps(regions, effectiveState, metadata);
  regions = applyLayoutRemaps(regions, effectiveState, metadata);
  regions = applyWhirlpoolRemaps(regions, effectiveState, metadata);
  regions = applyFluteRemaps(regions, effectiveState, metadata);
  regions = applyDoorRemaps(regions, effectiveState, metadata);
  regions = applyStandardLogicChanges(regions, effectiveState);
  regions = applyStandvertedPortalFixes(regions, effectiveState);


  return { regions, metadata };
}

/** 
* In standard, the player is given a free lamp cone in the sewers, and therefore
* the escape sequence does not need the lamp. This function applies the necessary 
* logic changes to reflect that.
*/
function applyStandardLogicChanges(
  regions: Record<string, RegionLogic>,
  state: GameState,
): Record<string, RegionLogic> {

  if (!['standard', 'standverted'].includes(state.settings.worldState)) {
    return regions;
  }

  const escapeRegions = [
    "Sewers Behind Tapestry",
    "Sewers Rope Room",
    "Sewers Dark Cross",
    "Sewers Water",
    "Sewers Dark Aquabats",
    "Sewers Key Rat"
  ];

  const result = { ...regions };
  const toStrip = new Set(["lantern"]);

  for (const regionName of escapeRegions) {
    const region = result[regionName];
    if (!region) continue;

    // Deep-copy exits with lantern stripped
    const newExits: ExitLogic = {};
    for (const [exitName, exit] of Object.entries(region.exits)) {
      newExits[exitName] = {
        ...exit,
        requirements: stripRequirementsFromWorldLogic(exit.requirements, toStrip),
      };
    }

    // Deep-copy locations with lantern stripped
    const newLocations: RegionLogic["locations"] = {};
    for (const [locName, loc] of Object.entries(region.locations)) {
      newLocations[locName] = {
        ...loc,
        requirements: stripRequirementsFromWorldLogic(loc.requirements, toStrip),
      };
    }

    result[regionName] = { ...region, exits: newExits, locations: newLocations };
  }

  return result;
}

/**
 * Strip matching requirement strings from a WorldLogic requirements object.
 * Returns a new object — does not mutate the original.
 */
function stripRequirementsFromWorldLogic(worldLogic: WorldLogic, toStrip: Set<string>): WorldLogic {
  const result: WorldLogic = {};
  for (const [worldKey, logicState] of Object.entries(worldLogic)) {
    if (typeof logicState === "string") {
      (result as Record<string, unknown>)[worldKey] = logicState;
    } else {
      (result as Record<string, unknown>)[worldKey] = stripRequirementsFromLogicState(logicState as LogicState, toStrip);
    }
  }
  return result;
}

function stripRequirementsFromLogicState(logicState: LogicState, toStrip: Set<string>): LogicState {
  const result: LogicState = {};
  for (const tier of ["always", "logical", "required", "information", "scout"] as const) {
    if (logicState[tier] != null) {
      result[tier] = stripRequirementsFromRequirement(logicState[tier]!, toStrip);
    }
  }
  return result;
}

function stripRequirementsFromRequirement(req: LogicRequirement, toStrip: Set<string>): LogicRequirement {
  if (typeof req === "string") {
    return toStrip.has(req) ? ({} as LogicRequirement) : req;
  }
  if ("allOf" in req && req.allOf) {
    const filtered = req.allOf
      .map(r => stripRequirementsFromRequirement(r, toStrip))
      .filter(r => typeof r !== "string" || !toStrip.has(r));
    const meaningful = filtered.filter(r => typeof r === "string" || Object.keys(r).length > 0);
    if (meaningful.length === 0) return {};
    return { allOf: meaningful };
  }
  if ("anyOf" in req && req.anyOf) {
    return { anyOf: req.anyOf.map(r => stripRequirementsFromRequirement(r, toStrip)) };
  }
  return req;
}


/**
 * Temporary fix: patch Agahnim's Tower portal exits for standverted mode.
 *
 * In standverted the castle tile is flipped back to its normal (Light World)
 * position, so the AT exit should go to Hyrule Castle Ledge (Open behaviour),
 * not GT Stairs (Inverted behaviour). The dungeon traverser evaluates these
 * exits using Inverted logic (standverted → Inverted), which picks the wrong
 * set of requirements.
 *
 * TODO: Fix this properly by either:
 *  - Adding a Standverted world-logic key in the generation scripts, or
 *  - Having the dungeon traverser pass an effectiveWorldState (based on tile
 *    flips) when evaluating external exit requirements.
 * That would generalise to any dungeon portal affected by tile flips.
 */
function applyStandvertedPortalFixes(
  regions: Record<string, RegionLogic>,
  state: GameState,
): Record<string, RegionLogic> {
  if (state.settings.worldState !== "standverted") return regions;
  // Entrance shuffle remaps destinations — skip the hard-coded patch when active
  if (state.settings.entranceMode !== "none") return regions;

  const result = { ...regions };

  // AT Portal: swap exit availability (AT is on its normal LW tile)
  const atPortal = result["Agahnims Tower Portal"];
  if (atPortal?.exits) {
    result["Agahnims Tower Portal"] = {
      ...atPortal,
      exits: {
        ...atPortal.exits,
        // Normal exit to HC Ledge — should be available (Open behaviour)
        "Agahnims Tower Exit": {
          ...atPortal.exits["Agahnims Tower Exit"],
          requirements: { Open: {}, Inverted: {} },
        },
        // Inverted exit to GT Stairs — should be blocked (AT is not on DM)
        "Agahnims Tower Exit (Inverted)": {
          ...atPortal.exits["Agahnims Tower Exit (Inverted)"],
          requirements: { Open: "never", Inverted: "never" },
        },
      },
    };
  }

  // GT Stairs (owid 67, NOT flipped): GT is physically here in standverted.
  // Block inverted AT entry; enable normal GT entry with canOpenGT.
  const gtStairs = result["GT Stairs"];
  if (gtStairs?.exits) {
    result["GT Stairs"] = {
      ...gtStairs,
      exits: {
        ...gtStairs.exits,
        // Block entry to AT (AT is not on Death Mountain in standverted)
        ...(gtStairs.exits["Ganons Tower (Inverted)"] && {
          "Ganons Tower (Inverted)": {
            ...gtStairs.exits["Ganons Tower (Inverted)"],
            requirements: { Open: "never", Inverted: "never" },
          },
        }),
        // Enable normal GT entry (Open behaviour: canOpenGT)
        ...(gtStairs.exits["Ganons Tower"] && {
          "Ganons Tower": {
            ...gtStairs.exits["Ganons Tower"],
            requirements: { Open: { always: { allOf: ["canOpenGT"] } }, Inverted: { always: { allOf: ["canOpenGT"] } } },
          },
        }),
      },
    };
  }

  // GT Portal: swap exit availability (GT exits to DM, not HC Ledge)
  const gtPortal = result["Ganons Tower Portal"];
  if (gtPortal?.exits) {
    result["Ganons Tower Portal"] = {
      ...gtPortal,
      exits: {
        ...gtPortal.exits,
        // Normal exit to GT Stairs — should be available (Open behaviour)
        "Ganons Tower Exit": {
          ...gtPortal.exits["Ganons Tower Exit"],
          requirements: { Open: {}, Inverted: {} },
        },
        // Inverted exit to HC Ledge — should be blocked (GT is not on castle tile)
        "Ganons Tower Exit (Inverted)": {
          ...gtPortal.exits["Ganons Tower Exit (Inverted)"],
          requirements: { Open: "never", Inverted: "never" },
        },
      },
    };
  }

  return result;
}
