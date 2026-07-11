import type { EventLogMode, MapMode } from "@/store/settingsSlice";

export const TILE = 448;

export const EVENT_LOG_GAP = 4;
export const EVENT_LOG_COLUMN_WIDTH = TILE / 2;
export const EVENT_LOG_ROWS = 3;
export const EVENT_LOG_ROW_HEIGHT = 32;
export const EVENT_LOG_ROW_GAP = 4;
export const EVENT_LOG_HEADER_HEIGHT = 32;
export const EVENT_LOG_LIST_VERTICAL_PADDING = 8;
export const EVENT_LOG_HEIGHT = (
  EVENT_LOG_HEADER_HEIGHT
  + EVENT_LOG_LIST_VERTICAL_PADDING
  + EVENT_LOG_ROWS * EVENT_LOG_ROW_HEIGHT
  + (EVENT_LOG_ROWS - 1) * EVENT_LOG_ROW_GAP
);
export const EVENT_LOG_LAYOUT_HEIGHT = EVENT_LOG_HEIGHT + EVENT_LOG_GAP;

export function getTrackerLayoutDimensions(mapMode: MapMode) {
  switch (mapMode) {
    case "off":
    case "popoutNormal":
    case "popoutVertical":
      return { width: TILE, height: TILE };
    case "normal":
      return { width: TILE * 3, height: TILE };
    case "compact":
      return { width: TILE, height: TILE * 1.5 };
    case "vertical":
      return { width: TILE, height: TILE * 3 };
  }
}

export function getEventLogColumnCount(mapMode: MapMode) {
  const { width } = getTrackerLayoutDimensions(mapMode);
  return getEventLogColumnCountForWidth(width);
}

export function getEventLogColumnCountForWidth(width: number) {
  return Math.max(1, Math.floor(width / EVENT_LOG_COLUMN_WIDTH));
}

export function getMapPopoutDimensions(mapMode: MapMode) {
  switch (mapMode) {
    case "popoutNormal":
      return { width: TILE * 2, height: TILE };
    case "popoutVertical":
      return { width: TILE, height: TILE * 2 };
    default:
      return { width: TILE, height: TILE };
  }
}

export function getTrackerWindowSizeForEventLogMode(mapMode: MapMode, eventLogMode: EventLogMode) {
  const { width, height } = getTrackerLayoutDimensions(mapMode);
  return {
    width,
    height: height + (eventLogMode === "attached" ? EVENT_LOG_LAYOUT_HEIGHT : 0),
  };
}

export function getEventLogPopoutDimensions() {
  return { width: TILE, height: EVENT_LOG_HEIGHT };
}
