import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { DEFAULT_APP_BACKGROUND, DEFAULT_STATUS_COLORS } from "@/store/settingsSlice";
import type { LogicStatus } from "@/data/logic/logicTypes";

/**
 * Syncs custom status colors from Redux settings → CSS custom properties on :root.
 * Call once near the app root (e.g. in SettingsProvider).
 *
 * Tooltip text uses the same value as the corresponding marker colour so a single
 * setting drives both visuals consistently.
 */
export function useApplyStatusColors() {
  const customColors = useSelector((state: RootState) => state.settings.customColors);
  const appBackground = useSelector((state: RootState) => state.settings.appBackground ?? DEFAULT_APP_BACKGROUND);

  useEffect(() => {
    const root = document.documentElement;
    const colors = { ...DEFAULT_STATUS_COLORS, ...customColors };

    for (const [key, value] of Object.entries(colors)) {
      root.style.setProperty(`--status-${key}`, value);
      root.style.setProperty(`--status-text-${key}`, value);
    }

    // Apply background to both root and body so transparency works for OBS overlays.
    root.style.background = appBackground;
    document.body.style.background = appBackground;
  }, [customColors, appBackground]);
}

/** Map bg class for a logic status on map markers */
export function mapStatusBg(status: LogicStatus | "checked" | "selected" | "connector" | "none"): string {
  switch (status) {
    case "available":
      return "bg-status-available";
    case "possible":
      return "bg-status-possible";
    case "ool":
      return "bg-status-ool";
    case "information":
      return "bg-status-information";
    case "unavailable":
      return "bg-status-unavailable";
    case "checked":
      return "bg-status-checked";
    case "selected":
      return "bg-status-selected";
    case "connector":
      return "bg-status-connector";
    case "none":
    default:
      return "bg-status-none";
  }
}

/** Tooltip text class for a logic status */
export function tooltipStatusText(status: LogicStatus | "checked"): string {
  switch (status) {
    case "available":
      return "text-status-text-available";
    case "possible":
      return "text-status-text-possible";
    case "ool":
      return "text-status-text-ool";
    case "information":
      return "text-status-text-information";
    case "unavailable":
      return "text-status-text-unavailable";
    case "checked":
      return "text-status-text-checked";
  }
}
