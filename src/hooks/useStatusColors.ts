import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { DEFAULT_STATUS_COLORS, DEFAULT_STATUS_TEXT_COLORS } from "@/store/settingsSlice";
import type { LogicStatus } from "@/data/logic/logicTypes";

/**
 * Syncs custom status colors from Redux settings → CSS custom properties on :root.
 * Call once near the app root (e.g. in SettingsProvider).
 */
export function useApplyStatusColors() {
  const customColors = useSelector((state: RootState) => state.settings.customColors);
  const customTextColors = useSelector((state: RootState) => state.settings.customTextColors);

  useEffect(() => {
    const root = document.documentElement;
    const colors = { ...DEFAULT_STATUS_COLORS, ...customColors };
    const textColors = { ...DEFAULT_STATUS_TEXT_COLORS, ...customTextColors };

    for (const [key, value] of Object.entries(colors)) {
      root.style.setProperty(`--status-${key}`, value);
    }
    for (const [key, value] of Object.entries(textColors)) {
      root.style.setProperty(`--status-text-${key}`, value);
    }
  }, [customColors, customTextColors]);
}

/** Map bg class for a logic status on map markers */
export function mapStatusBg(status: LogicStatus | "checked" | "selected" | "none"): string {
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
