/**
 * Settings that are remembered across sessions (persisted to localStorage).
 *
 * To remember a new setting:
 *   1. Add the field to SettingsState in settingsSlice.ts (with its default)
 *   2. Add the key to REMEMBERED_SETTINGS below
 *
 */

import type { SettingsState } from "@/store/settingsSlice";

/**
 * SettingsState keys that are persisted to localStorage as user defaults.
 * When a new session is created, these saved values override the defaults.
 * When an existing session is resumed, the session's own settings take priority.
 */
export const REMEMBERED_SETTINGS = [
  // UI / display
  "includeDungeonItemsInCounter",
  "colouredChests",
  "showChestTooltips",
  "mapMode",
  "connectionLinesMode",
  "connectionLineColor",
  "spriteName",
  "entranceLabelsMode",
  "showInsetBossSquare",

  // Gameplay
  "autotracking",
  "sequenceBreaks",
] as const satisfies readonly (keyof SettingsState)[];

export type RememberedSettingsKey = (typeof REMEMBERED_SETTINGS)[number];
