import { createSession } from "./sessionManager";
import { initialState as DEFAULT_SETTINGS, type SettingsState } from "@/store/settingsSlice";
import { loadLauncherPrefs } from "./launchHelpers";
import { getPresetById } from "@/data/launcherPresets";
import { idbDriver } from "./idbDriver";
import ItemsData from "@/data/itemData";

/**
 * Detects or generates the current session/instance ID from URL parameters.
 * Uses 'id' from the query string. When on /tracker with no id, replicates
 * the Launch flow: applies LauncherPrefs + optional ?preset= param, creates
 * a session in IndexedDB, and pre-seeds settings/items.
 *
 * On non-tracker pages (e.g. the launcher), returns a transient ID without
 * creating a session, so refreshing the launcher doesn't pollute the session list.
 *
 * This value is memoized for the duration of the page load to ensure
 * consistency across various initialization entry points (Redux store,
 * slices, providers).
 */

let memoizedId: string;

export function getSessionInstanceId(): string {
  if (memoizedId) return memoizedId;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    memoizedId = id;
    return memoizedId;
  }

  // Generate a stable ID for this page load
  memoizedId = crypto.randomUUID().slice(0, 8);

  // Only create a persistent session when on the /tracker route
  const isTracker = window.location.pathname === "/tracker";
  if (isTracker) {
    launchDirectSession(memoizedId, urlParams);
  }

  return memoizedId;
}

/**
 * Replicates the Launch flow for direct /tracker visits.
 * Reads LauncherPrefs from localStorage, applies ?preset= if provided,
 * creates a session record, and pre-seeds settings + starting items into
 * the redux-remember IndexedDB store.
 */
function launchDirectSession(sessionId: string, urlParams: URLSearchParams) {
  const savedPrefs = loadLauncherPrefs();
  const presetParam = urlParams.get("preset");

  // Build settings: start from defaults, overlay launcher prefs (UI settings)
  let settings: SettingsState = {
    ...DEFAULT_SETTINGS,
    mapMode: (savedPrefs.mapMode as SettingsState["mapMode"]) ?? DEFAULT_SETTINGS.mapMode,
    connectionLinesMode: (savedPrefs.connectionLinesMode as SettingsState["connectionLinesMode"]) ?? DEFAULT_SETTINGS.connectionLinesMode,
    autotracking: savedPrefs.autotracking ?? DEFAULT_SETTINGS.autotracking,
    includeDungeonItemsInCounter: savedPrefs.includeDungeonItemsInCounter ?? DEFAULT_SETTINGS.includeDungeonItemsInCounter,
    sequenceBreaks: { ...DEFAULT_SETTINGS.sequenceBreaks, ...savedPrefs.sequenceBreaks },
    spriteName: savedPrefs.spriteName ?? DEFAULT_SETTINGS.spriteName,
  };

  let startingItems: Record<string, number> = {};
  let presetId: string | undefined;

  // Apply preset if provided
  if (presetParam) {
    const preset = getPresetById(presetParam);
    if (preset) {
      settings = { ...settings, ...preset.settings };
      startingItems = preset.startingItems ?? {};
      presetId = preset.id;
    }
  }

  const sessionName = `Session ${new Date().toLocaleDateString()}`;

  // Create the session record in IndexedDB (fire-and-forget)
  createSession(
    settings,
    sessionName,
    savedPrefs.spriteName,
    presetId,
    sessionId,
  ).catch(err => {
    if (err?.name === "ConstraintError") {
      import("@/lib/sessionManager").then(m => m.touchSession(sessionId));
    } else {
      console.error("Failed to auto-create session", err);
    }
  });

  // Pre-seed settings into the redux-remember store
  const prefix = `alttptracker_session_${sessionId}_`;
  idbDriver.setItem(prefix + "settings", JSON.stringify(settings)).catch(() => {});

  // Pre-seed starting items if any
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
    idbDriver.setItem(prefix + "items", JSON.stringify(itemsState)).catch(() => {});
  }
}
