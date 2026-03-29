import type { SettingsState } from "@/store/settingsSlice";
import { REMEMBERED_SETTINGS, type RememberedSettingsKey } from "@/data/userPreferences";

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
