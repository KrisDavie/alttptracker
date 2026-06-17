import { describe, expect, it } from "vitest";
import {
  EVENT_LOG_HEIGHT,
  EVENT_LOG_LAYOUT_HEIGHT,
  getEventLogColumnCount,
  getEventLogColumnCountForWidth,
  getTrackerWindowSizeForEventLogMode,
  TILE,
} from "@/lib/trackerSizing";

describe("tracker sizing", () => {
  it("uses two event log columns per tracker tile", () => {
    expect(getEventLogColumnCount("off")).toBe(2);
    expect(getEventLogColumnCount("compact")).toBe(2);
    expect(getEventLogColumnCount("vertical")).toBe(2);
    expect(getEventLogColumnCount("popoutNormal")).toBe(2);
    expect(getEventLogColumnCount("popoutVertical")).toBe(2);
    expect(getEventLogColumnCount("normal")).toBe(6);
    expect(getEventLogColumnCountForWidth(TILE * 2)).toBe(4);
  });

  it("caps attached event log sizing to three rows", () => {
    expect(EVENT_LOG_HEIGHT).toBe(144);
    expect(getTrackerWindowSizeForEventLogMode("normal", "attached")).toEqual({ width: TILE * 3, height: TILE + EVENT_LOG_LAYOUT_HEIGHT });
    expect(getTrackerWindowSizeForEventLogMode("normal", "popout")).toEqual({ width: TILE * 3, height: TILE });
  });
});
