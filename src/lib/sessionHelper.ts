import { createSession, touchSession } from "./sessionManager";
import { initialState as DEFAULT_SETTINGS, type SettingsState } from "@/store/settingsSlice";
import { loadLauncherPrefs, applyLauncherPrefs, buildPresetIDBState } from "./launchHelpers";
import { getPresetById } from "@/data/launcherPresets";
import { idbDriver } from "./idbDriver";

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
  let settings: SettingsState = applyLauncherPrefs(DEFAULT_SETTINGS, savedPrefs);

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
      touchSession(sessionId);
    } else {
      console.error("Failed to auto-create session", err);
    }
  });

  // Pre-seed settings into the redux-remember store
  const prefix = `alttptracker_session_${sessionId}_`;
  idbDriver.setItem(prefix + "settings", JSON.stringify(settings)).catch(() => {});

  // Pre-seed preset state (items, checks, entrances, dungeons)
  const preset = presetId ? getPresetById(presetId) : undefined;
  const presetState = buildPresetIDBState(startingItems, preset);
  if (presetState.items) idbDriver.setItem(prefix + "items", JSON.stringify(presetState.items)).catch(() => {});
  if (presetState.checks) idbDriver.setItem(prefix + "checks", JSON.stringify(presetState.checks)).catch(() => {});
  if (presetState.entrances) idbDriver.setItem(prefix + "entrances", JSON.stringify(presetState.entrances)).catch(() => {});
  if (presetState.dungeons) idbDriver.setItem(prefix + "dungeons", JSON.stringify(presetState.dungeons)).catch(() => {});
}
