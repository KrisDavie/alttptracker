import type { UserSequenceBreaks } from "@/store/settingsSlice";

export const LAUNCHER_PREFS_KEY = "muffins_launcher_prefs";
export const RECENT_SPRITES_KEY = "muffins_recent_sprites";
export const MAX_RECENT_SPRITES = 6;

export interface LauncherPrefs {
  spriteName: string;
  mapMode: string;
  connectionLinesMode: string;
  autotracking: boolean;
  includeDungeonItemsInCounter: boolean;
  sequenceBreaks: UserSequenceBreaks;
  canNavigateDarkRooms?: boolean;
}

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
