/**
 * LocationMapper - Dynamically maps locationsData entries to their item locations
 * from logic_regions.ts, filtered by current settings.
 *
 * Instead of hard-coding item locations in locationsData.ts, this module computes
 * which item locations belong to each map dot based on the logic_regions graph,
 * then filters them according to the active settings (pottery, keyDrop, enemyShuffle, etc.).
 *
 * APPROACH:
 * 1. Detect "secondary entrances" — entrance entries whose regions are a subset of
 *    another entry's regions (e.g., "Desert Palace Entrance (West)" vs "Desert Palace").
 * 2. Caves (!isDungeon, !overworld, !secondary): BFS from entranceRegions through Cave-type exits; claim regions.
 * 3. Dungeons (isDungeon): BFS from entranceRegions through Dungeon-type exits; skip claimed regions.
 * 4. Overworld entries: matched by entry key name (or locationNames override).
 * 5. Secondary entrances: BFS through all interior types without claiming (shares locations with parent).
 * 6. Categorizes each location and filters based on settings.
 */

import { logic_regions } from "@/data/logic/logic_regions";
import type { SettingsState } from "@/store/settingsSlice";
import { baseLocationsData } from "@/data/locationsData";
import { DungeonsData } from "@/data/dungeonData";

export type LocationCategory = "chest" | "keyDrop" | "potKey" | "pot" | "enemy" | "shop" | "prize" | "bonk" | "event";

export interface LocationInfo {
  name: string;
  category: LocationCategory;
  regionType: string;
}

/**
 * Classify a location name into a category.
 * Returns null for locations that should never be tracked.
 */
function categorizeLocation(name: string): LocationCategory | null {
  // TODO: Add execeptions - IP Block Key Drop etc.
  // Key drops from enemies
  if (name.includes("Key Drop")) return "keyDrop";
  // Pot keys (keys found in specific pots)
  if (name.includes("Pot Key")) return "potKey";
  // Generic numbered pots
  if (name.includes("Pot #")) return "pot";
  // Generic numbered enemies
  if (name.includes("Enemy #")) return "enemy";

  if (name.includes(" - Prize")) return "prize";

  if (name === 'Cold Fairy Statue') return 'bonk';

  // Shop locations (shopsanity)
  if (isShopLocation(name)) return "shop";

  // Dungeon prize locations (tracked via dungeon state, not item checks)
  if (name.endsWith(" - Prize")) return "event";

  // Overworld drops and mechanical/event locations - not directly tracked
  if (
    name.includes("Crab Drop") ||
    name.includes("Bush Drop") ||
    name.includes("Rock Drop") ||
    name.includes("Tree Pull") ||
    name.includes("Crystal_Switch") ||
    name.includes("Boss Kill") ||
    name.includes("Drop Off") ||
    name.includes("Pickup") ||
    name.includes("Large Block") ||
    name === "Floodgate" ||
    name.includes("Trench 1 Switch") ||
    name.includes("Trench 2 Switch") ||
    name.includes("Swamp Drain") ||
    name.includes("Ice Block Drop") ||
    name === "Agahnim 1" ||
    name === "Agahnim 2" ||
    name === "Locksmith" ||
    name === "Flute Activation" ||
    name === "Kiki" ||
    name === "Pyramid Crack" ||
    name === "Lost Old Man" ||
    name === "Missing Smith" ||
    name === "Big Bomb" ||
    name === "Archery Game Prize" ||
    // Dungeon mechanic/event locations
    name === "Skull Star Tile" ||
    name === "Revealing Light" ||
    name === "Suspicious Maiden" ||
    name === "Attic Cracked Floor"
  ) {
    return "event";
  }

  // Default: regular trackable item (chest, NPC, etc.)
  return "chest";
}

/**
 * Shop locations follow a pattern: "Shop Name - Left/Middle/Right"
 * These are present in the Potion Shop, Dark Potion Shop, and various other shops.
 */
function isShopLocation(name: string): boolean {
  const shopPatterns = [
    "Capacity Upgrade - ",
    "Potion Shop - ",
    "Red Shield Shop - ",
    "Dark Potion Shop - ",
    "Dark Death Mountain Shop - ",
    "Lake Hylia Shop - ",
    "Paradox Shop - ",
    "Village of Outcasts Shop - ",
    "Dark Lake Hylia Shop - ",
    "Dark Lumberjack Shop - ",
    "Kakariko Shop - ",
    "Bomb Shop - ",
  ];
  return shopPatterns.some((p) => name.startsWith(p));
}

/**
 * Build the comprehensive location mapping from logic_regions.
 * This runs once at module load time.
 *
 * Strategy:
 * - OW entries: look up entry key (or locationNames) directly in logic_regions
 * - Caves: BFS from entranceRegions through Cave-type exits; claim regions
 * - Dungeons: BFS from entranceRegions through Dungeon-type exits; skip claimed regions
 */
function buildLocationMapping(): {
  result: Map<string, LocationInfo[]>;
  secondaryKeys: Set<string>;
  parentKeys: Set<string>;
} {
  const regions = logic_regions;

  // Build a global location order index from the graph's definition order.
  // logic_regions.ts is auto-generated and lists locations in dungeon progression
  // order, so this gives us a natural traversal ordering for tooltips.
  const locationOrder = new Map<string, number>();
  let orderIdx = 0;
  for (const region of Object.values(regions)) {
    for (const locName of Object.keys(region.locations || {})) {
      if (!locationOrder.has(locName)) {
        locationOrder.set(locName, orderIdx++);
      }
    }
  }

  // Build reverse index: location name → region name
  const locationToRegion = new Map<string, string>();
  for (const [regionName, region] of Object.entries(regions)) {
    for (const locName of Object.keys(region.locations || {})) {
      locationToRegion.set(locName, regionName);
    }
  }

  // BFS helper: expand from start regions following exits to regions of allowed types
  function bfsRegions(startRegions: string[], allowedTypes: Set<string>, skipRegions: Set<string>): Set<string> {
    const visited = new Set<string>();
    const queue: string[] = [];

    for (const r of startRegions) {
      if (!skipRegions.has(r)) {
        visited.add(r);
        queue.push(r);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      const region = regions[current];
      if (!region) continue;

      for (const exit of Object.values(region.exits || {})) {
        const dest = exit.to;
        if (visited.has(dest) || skipRegions.has(dest)) continue;
        const destRegion = regions[dest];
        if (destRegion && allowedTypes.has(destRegion.type)) {
          visited.add(dest);
          queue.push(dest);
        }
      }
    }

    return visited;
  }

  // Collect all locations from a set of regions, sorted by graph definition order
  function collectLocations(regionSet: Set<string>): LocationInfo[] {
    const locations: LocationInfo[] = [];
    const addedNames = new Set<string>();

    for (const regionName of regionSet) {
      const region = regions[regionName];
      if (!region?.locations) continue;
      for (const locName of Object.keys(region.locations)) {
        if (addedNames.has(locName)) continue;
        const category = categorizeLocation(locName);
        if (category && category !== "event") {
          locations.push({
            name: locName,
            category,
            regionType: region.type,
          });
          addedNames.add(locName);
        }
      }
    }

    // Sort by graph definition order (logic_regions.ts lists locations in
    // dungeon progression order since it's auto-generated from game data)
    locations.sort((a, b) => (locationOrder.get(a.name) ?? Infinity) - (locationOrder.get(b.name) ?? Infinity));

    return locations;
  }

  // --- Pre-compute secondary entrances ---
  // An entrance entry (entrance: true) is "secondary" if its entranceRegions are
  // a subset (or equal) of another entry's entranceRegions. Secondary entrances
  // share all their interior locations with a "parent" entry (e.g., "Desert Palace
  // Entrance (West)" is secondary to "Desert Palace"). In non-entrance mode,
  // only the parent's unified dot is shown; in entrance mode, each secondary
  // entrance gets its own marker.
  const allEntranceRegionSets = new Map<string, Set<string>>();
  for (const [key, data] of Object.entries(baseLocationsData)) {
    const er = data.entranceRegions || [];
    if (er.length > 0) {
      allEntranceRegionSets.set(key, new Set(er));
    }
  }

  const secondaryKeys = new Set<string>();
  const parentKeys = new Set<string>();
  for (const [key, myRegions] of allEntranceRegionSets) {
    const data = baseLocationsData[key];
    if (!data.entrance) continue; // Only entrance entries can be secondary

    for (const [otherKey, otherRegions] of allEntranceRegionSets) {
      if (otherKey === key) continue;
      if (otherRegions.size < myRegions.size) continue; // Can't contain us if smaller
      if (![...myRegions].every((r) => otherRegions.has(r))) continue;

      const otherData = baseLocationsData[otherKey];
      const otherIsValidParent = !otherData.entrance || otherData.isDungeon;

      if (otherIsValidParent) {
        // A non-entrance (or dungeon) entry contains our regions — it will be
        // shown in non-entrance mode as the unified parent.
        secondaryKeys.add(key);
        parentKeys.add(otherKey);
        break;
      }

      // Both are entrance entries. Only mark as secondary if the other is a
      // strict superset, or — when region sets are identical — if the other
      // has a lexicographically smaller key (canonical primary tiebreaker).
      // This ensures at least ONE entrance entry representing a given region
      // set remains visible in non-entrance mode.
      if (otherRegions.size > myRegions.size || otherKey < key) {
        secondaryKeys.add(key);
        break;
      }
    }
  }

  const result = new Map<string, LocationInfo[]>();
  const claimedRegions = new Set<string>();
  const caveTypes = new Set(["Cave"]);

  // Phase 1: Process non-dungeon cave entries first (claim their regions)
  // Skip secondary entrances — they share regions with a parent and are handled in Phase 4.
  for (const [entryKey, entryData] of Object.entries(baseLocationsData)) {
    if (entryData.isDungeon || entryData.overworld) continue;
    if (secondaryKeys.has(entryKey)) continue; // Handled in Phase 4

    const entranceRegions = entryData.entranceRegions || [];
    if (entranceRegions.length === 0) continue;

    // BFS from entrance regions through Cave-type exits only
    // (Dungeon-type entrance regions like Sanctuary or Sewers Secret Room
    //  won't expand since they have no Cave-type exits)
    const regionSet = bfsRegions(entranceRegions, caveTypes, claimedRegions);

    // Also include the entrance regions themselves (even if they're Dungeon type)
    for (const r of entranceRegions) {
      regionSet.add(r);
    }

    const locations = collectLocations(regionSet);
    result.set(entryKey, locations);

    // Claim all discovered regions
    for (const r of regionSet) {
      claimedRegions.add(r);
    }
  }

  // Phase 2: Process dungeon entries (skip claimed regions)
  const dungeonTypes = new Set(["Dungeon"]);
  for (const [entryKey, entryData] of Object.entries(baseLocationsData)) {
    if (!entryData.isDungeon) continue;

    const entranceRegions = entryData.entranceRegions || [];
    if (entranceRegions.length === 0) continue;

    // BFS from entrance regions through Dungeon-type exits, skipping claimed
    const regionSet = bfsRegions(entranceRegions, dungeonTypes, claimedRegions);

    const locations = collectLocations(regionSet);
    result.set(entryKey, locations);
  }

  // Phase 3: Process overworld entries (direct location name lookup)
  for (const [entryKey, entryData] of Object.entries(baseLocationsData)) {
    if (!entryData.overworld) continue;

    // Determine location names: use locationNames override or default to [entryKey]
    const locNames = entryData.locationNames || [entryKey];
    const locations: LocationInfo[] = [];

    for (const locName of locNames) {
      const regionName = locationToRegion.get(locName);
      const region = regionName ? regions[regionName] : undefined;
      const category = categorizeLocation(locName);
      if (category && category !== "event") {
        locations.push({
          name: locName,
          category,
          regionType: region?.type || "unknown",
        });
      }
    }

    result.set(entryKey, locations);
  }

  // Phase 4: Process secondary entrance entries
  // These share interior regions with main cave/dungeon entries.
  // BFS through ALL interior types (Cave + Dungeon), no region claiming.
  const interiorTypes = new Set(["Cave", "Dungeon"]);
  for (const entryKey of secondaryKeys) {
    const entryData = baseLocationsData[entryKey];
    if (!entryData) continue;

    const entranceRegions = entryData.entranceRegions || [];
    if (entranceRegions.length === 0) {
      result.set(entryKey, []);
      continue;
    }

    // BFS from entrance regions through all interior types, no skip regions.
    // This allows secondary entries to discover the same locations as their
    // parent cave/dungeon entries (whose regions were already claimed).
    const regionSet = bfsRegions(entranceRegions, interiorTypes, new Set());

    // Also include the entrance regions themselves
    for (const r of entranceRegions) {
      regionSet.add(r);
    }

    const locations = collectLocations(regionSet);
    result.set(entryKey, locations);
  }

  return { result, secondaryKeys, parentKeys };
}

// Pre-computed at module load
const { result: allLocationsMap, secondaryKeys: _secondaryEntranceKeys, parentKeys: _parentOfSecondaryKeys } =
  buildLocationMapping();

/**
 * Whether an entrance entry is "secondary" — its regions are a subset of another
 * (parent) entry's regions. Secondary entrances are hidden in non-entrance mode
 * because the parent's unified dot already covers all their locations.
 */
export function isSecondaryEntrance(entryKey: string): boolean {
  return _secondaryEntranceKeys.has(entryKey);
}

/**
 * Whether an entry is a "parent" of secondary entrances — i.e., it has individual
 * entrance entries that decompose its entranceRegions. In entrance mode, these
 * parent entries are hidden in favor of showing the individual entrance markers.
 */
export function isReplacedByEntrances(entryKey: string): boolean {
  return _parentOfSecondaryKeys.has(entryKey);
}

/**
 * Get ALL possible location names for a locationsData entry (regardless of settings).
 * Used for checksSlice initialization and autotracking.
 */
export function getAllPossibleLocations(entryKey: string): LocationInfo[] {
  return allLocationsMap.get(entryKey) || [];
}

/**
 * Get ALL possible location names across all entries.
 * Used for checksSlice initialization.
 */
export function getAllPossibleLocationNames(): string[] {
  const allNames = new Set<string>();
  for (const locs of allLocationsMap.values()) {
    for (const loc of locs) {
      allNames.add(loc.name);
    }
  }
  return [...allNames];
}

/**
 * Determine if a location is active given current settings.
 */
function isLocationActive(loc: LocationInfo, settings: SettingsState): boolean {
  switch (loc.category) {
    case "chest":
      return true;

    case "keyDrop":
      return settings.enemyDrop !== "none";

    case "potKey":
      return settings.pottery !== "none";

    case "pot":
      // Pots are active based on pottery mode
      // "keys" only shuffles pot keys, not generic pots
      if (settings.pottery === "none" || settings.pottery === "keys") return false;

      // "dungeon" only includes dungeon pots
      if (loc.regionType === "Dungeon") return (['dungeon', 'lottery'].includes(settings.pottery))
      if (loc.regionType === "Cave") return (['cave', 'cavekeys', 'lottery'].includes(settings.pottery));
      return true;

    case "enemy":
      return settings.enemyDrop === "underworld";

    case "bonk":
      return settings.bonkShuffle;

    case "shop":
      return settings.shopsanity;

    case "prize":
      return settings.prizeShuffle !== "vanilla";

    case "event":
      return false;

    default:
      return true;
  }
}

/**
 * Get the active (settings-filtered) location names for a locationsData entry.
 */
export function getActiveLocations(entryKey: string, settings: SettingsState): string[] {
  const allLocs = allLocationsMap.get(entryKey) || [];
  return allLocs.filter((loc: LocationInfo) => isLocationActive(loc, settings)).map((loc: LocationInfo) => loc.name);
}

/**
 * Get a complete map of all entries → active location names for given settings.
 * Useful for batch operations.
 */
export function getActiveLocationsMap(settings: SettingsState): Map<string, string[]> {
  const result = new Map<string, string[]>();
  for (const entryKey of allLocationsMap.keys()) {
    result.set(entryKey, getActiveLocations(entryKey, settings));
  }
  return result;
}

/**
 * Reverse map: portal region name → dungeon ID (e.g., "Hyrule Castle West Portal" → "hc").
 * Built from DungeonsData.portals at module load time.
 */
const portalToDungeonId: Record<string, string> = {};
for (const [dungeonId, dungeonData] of Object.entries(DungeonsData)) {
  for (const portal of dungeonData.portals || []) {
    portalToDungeonId[portal] = dungeonId;
  }
}

/**
 * Get the dungeon ID for a locationsData entry, if it leads to a dungeon.
 * Works for both main dungeon entries and entrance-only entries that lead to dungeons.
 * Returns undefined for non-dungeon entries.
 */
export function getDungeonIdForEntry(entryKey: string): string | undefined {
  const entryData = baseLocationsData[entryKey];
  if (!entryData) return undefined;

  // Check if any of the entry's entrance regions are dungeon portals
  for (const region of entryData.entranceRegions || []) {
    if (portalToDungeonId[region]) {
      return portalToDungeonId[region];
    }
  }
  return undefined;
}
