import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSettings, type SettingsState } from "@/store/settingsSlice";
import { SettingsContext } from "@/hooks/useSettings";

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();

  // Determine the storage key based on an optional 'id' in the URL
  // This must match the prefix used in store.ts for redux-remember
  const urlParams = new URLSearchParams(window.location.search);
  const instanceId = urlParams.get("id") || urlParams.get("instance") || "default";
  const storageKey = `alttptracker_session_${instanceId}_settings`;

  // Load settings from URL on mount (overrides persisted state)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSettings: Partial<SettingsState> = {};
    
    // if (params.has("wildSmallKeys")) urlSettings.wildSmallKeys = params.get("wildSmallKeys") === "true";
    // if (params.has("wildBigKeys")) urlSettings.wildBigKeys = params.get("wildBigKeys") === "true";
    // Add more legacy mappings as needed

    if (Object.keys(urlSettings).length > 0) {
      dispatch(setSettings(urlSettings));
    }
  }, [dispatch]);

  // Listen for changes from other windows (e.g., Launcher) with the same ID
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const newSettings = JSON.parse(e.newValue);
          dispatch(setSettings(newSettings));
        } catch (err) {
          console.error("Failed to sync settings from storage event", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
