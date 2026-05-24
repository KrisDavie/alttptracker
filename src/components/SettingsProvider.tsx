import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { setSettings, type SettingsState } from "@/store/settingsSlice";
import { SettingsContext } from "@/hooks/useSettings";
import { useApplyStatusColors } from "@/hooks/useStatusColors";
import { idbDriver } from "@/lib/idbDriver";
import { loadLauncherPrefs, LAUNCHER_PREFS_KEY } from "@/lib/launchHelpers";

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();

  // Sync custom status colors → CSS variables
  useApplyStatusColors();

  // Determine the storage key based on an optional 'id' in the URL
  // This must match the prefix used in store.ts for redux-remember
  const instanceId = useSelector((state: RootState) => state.trackerState.instanceId);
  const storageKey = `alttptracker_session_${instanceId}_settings`;

  // Load settings from URL on mount (overrides persisted state)
  useEffect(() => {
    // const params = new URLSearchParams(window.location.search);
    const urlSettings: Partial<SettingsState> = {};

    if (Object.keys(urlSettings).length > 0) {
      dispatch(setSettings(urlSettings));
    }
  }, [dispatch]);

  // All remembered preferences are owned by the launcher. Re-apply them
  // whenever another tab writes to the launcher prefs key so that changes
  // (colours, display toggles, etc.) are immediately visible in open tracker sessions.
  useEffect(() => {
    const apply = () => {
      const prefs = loadLauncherPrefs();
      if (prefs && Object.keys(prefs).length > 0) dispatch(setSettings(prefs));
    };
    apply();
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === LAUNCHER_PREFS_KEY) apply();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  // Poll IndexedDB for settings changes from other windows (e.g., Launcher)
  useEffect(() => {
    let cancelled = false;
    let lastValue: string | null = null;

    // Initial read
    idbDriver.getItem(storageKey).then((val) => {
      if (!cancelled && val) lastValue = val;
    });

    const interval = setInterval(async () => {
      if (cancelled) return;
      const val = await idbDriver.getItem(storageKey);
      if (val && val !== lastValue) {
        lastValue = val;
        try {
          const newSettings = JSON.parse(val);
          dispatch(setSettings(newSettings));
        } catch (err) {
          console.error("Failed to sync settings from IndexedDB", err);
        }
      }
    }, 2000);

    return () => { cancelled = true; clearInterval(interval); };
  }, [dispatch, storageKey]);

  const saveSettings = (newSettings: Partial<SettingsState>) => {
    dispatch(setSettings(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
