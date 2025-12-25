import { createContext, useContext } from "react";
import type { SettingsState } from "@/store/settingsSlice";

export interface SettingsContextType {
  saveSettings: (settings: Partial<SettingsState>) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
