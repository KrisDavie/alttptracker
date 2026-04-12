import type { SettingsState } from "@/store/settingsSlice";
import { REMEMBERED_SETTINGS, type RememberedSettingsKey } from "@/data/userPreferences";
import type { LauncherPreset } from "@/data/launcherPresets";
import type { ChecksState, CheckStatus } from "@/store/checksSlice";
import type { EntranceData } from "@/store/entrancesSlice";
import type { DungeonState } from "@/store/dungeonsSlice";
import ItemsData from "@/data/itemData";

export const LAUNCHER_PREFS_KEY = "muffins_launcher_prefs";
export const RECENT_SPRITES_KEY = "muffins_recent_sprites";
export const MAX_RECENT_SPRITES = 6;

/** Persisted launcher preferences — derived from REMEMBERED_SETTINGS registry. */
export type LauncherPrefs = Pick<SettingsState, RememberedSettingsKey>;

export function loadLauncherPrefs(): Partial<LauncherPrefs> {
  try {
    const raw = localStorage.getItem(LAUNCHER_PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLauncherPrefs(prefs: LauncherPrefs) {
  localStorage.setItem(LAUNCHER_PREFS_KEY, JSON.stringify(prefs));
}

/**
 * Build a LauncherPrefs object from current settings.
 * Picks all REMEMBERED_SETTINGS keys automatically.
 */
export function buildLauncherPrefs(settings: SettingsState): LauncherPrefs {
  const prefs: Record<string, unknown> = {};
  for (const key of REMEMBERED_SETTINGS) {
    prefs[key] = settings[key];
  }
  return prefs as LauncherPrefs;
}

/**
 * Apply saved launcher preferences onto a base SettingsState.
 * Object-valued keys (like sequenceBreaks) are shallow-merged;
 * all others are replaced directly.
 */
export function applyLauncherPrefs(base: SettingsState, saved: Partial<LauncherPrefs>): SettingsState {
  const result = { ...base };
  for (const key of REMEMBERED_SETTINGS) {
    if (key in saved) {
      const baseVal = base[key];
      const savedVal = (saved as Record<string, unknown>)[key];
      if (typeof baseVal === "object" && baseVal !== null && !Array.isArray(baseVal)) {
        // Shallow-merge object values (e.g. sequenceBreaks)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any)[key] = { ...(baseVal as any), ...(savedVal as any) };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result as any)[key] = savedVal;
      }
    }
  }
  return result;
}

export function loadRecentSprites(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SPRITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushRecentSprite(name: string) {
  const recent = loadRecentSprites().filter((s) => s !== name);
  recent.unshift(name);
  localStorage.setItem(RECENT_SPRITES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT_SPRITES)));
}

export const STARTING_ITEMS = [
  "bow", "boomerang", "hookshot", "bomb", "powder", "mushroom",
  "firerod", "icerod", "bombos", "ether", "quake",
  "lantern", "hammer", "shovel", "flute", "net", "book",
  "bottle", "somaria", "byrna", "cape", "mirror",
  "boots", "glove", "flippers", "moonpearl", "sword",
  "shield",
] as const;

export function prettifySpriteName(name: string): string {
  return name
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Build IDB-ready state objects from starting items and preset fields.
 * Returns only the keys that need to be written (undefined = skip).
 */
export function buildPresetIDBState(
  startingItems: Record<string, number>,
  preset?: LauncherPreset,
): {
  items?: Record<string, { amount: number }>;
  checks?: ChecksState;
  entrances?: Record<string, Partial<EntranceData>>;
  dungeons?: Record<string, Partial<DungeonState>>;
} {
  const result: ReturnType<typeof buildPresetIDBState> = {};

  // --- Items ---
  if (Object.keys(startingItems).length > 0) {
    const itemsState: Record<string, { amount: number }> = {};
    for (const key of Object.keys(ItemsData)) {
      if (key.startsWith("bottle")) continue;
      itemsState[key] = { amount: 0 };
    }
    itemsState["bottle1"] = { amount: 0 };
    itemsState["bottle2"] = { amount: 0 };
    itemsState["bottle3"] = { amount: 0 };
    itemsState["bottle4"] = { amount: 0 };
    for (const [item, count] of Object.entries(startingItems)) {
      if (item === "bottle") {
        for (let i = 1; i <= Math.min(count, 4); i++) {
          itemsState[`bottle${i}`] = { amount: 1 };
        }
      } else if (itemsState[item]) {
        itemsState[item] = { amount: count };
      }
    }
    result.items = itemsState;
  }

  if (!preset) return result;

  // --- Checks (locations + entrances) ---
  const hasCheckedLocations = preset.checkedLocations && Object.keys(preset.checkedLocations).length > 0;
  const hasCheckedEntrances = preset.checkedEntrances && preset.checkedEntrances.length > 0;
  if (hasCheckedLocations || hasCheckedEntrances) {
    const checksState: ChecksState = { locationsChecks: {}, entranceChecks: {} };
    const defaultCheck: CheckStatus = { checked: false, logic: "unavailable", manuallyChecked: false, scoutedItems: [] };

    if (preset.checkedLocations) {
      for (const [name, data] of Object.entries(preset.checkedLocations)) {
        checksState.locationsChecks[name] = {
          ...defaultCheck,
          checked: true,
          scoutedItems: data.scoutedItems ?? [],
        };
      }
    }
    if (preset.checkedEntrances) {
      for (const name of preset.checkedEntrances) {
        checksState.entranceChecks[name] = { ...defaultCheck, checked: true };
      }
    }
    result.checks = checksState;
  }

  // --- Entrance placements ---
  if (preset.entrancePlacements && Object.keys(preset.entrancePlacements).length > 0) {
    const entrancesState: Record<string, Partial<EntranceData>> = {};
    for (const [entrance, destination] of Object.entries(preset.entrancePlacements)) {
      entrancesState[entrance] = {
        checked: true,
        connector: false,
        connectorGroup: null,
        to: destination,
        oneway: false,
      };
    }
    result.entrances = entrancesState;
  }

  // --- Dungeon state ---
  if (preset.dungeonState && Object.keys(preset.dungeonState).length > 0) {
    const dungeonsState: Record<string, Partial<DungeonState>> = {};
    for (const [code, data] of Object.entries(preset.dungeonState)) {
      dungeonsState[code] = { ...data };
    }
    result.dungeons = dungeonsState;
  }

  return result;
}
