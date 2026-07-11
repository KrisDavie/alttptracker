import { describe, expect, it } from "vitest";
import { getEventLogEntryOpacity } from "../eventLogOpacity";

const MINUTE = 60 * 1000;
const NOW = 100 * MINUTE;

describe("getEventLogEntryOpacity", () => {
  it("keeps fresh entries fully opaque", () => {
    expect(getEventLogEntryOpacity(NOW, NOW)).toBe(1);
    expect(getEventLogEntryOpacity(NOW - (3 * MINUTE) + 1, NOW)).toBe(1);
  });

  it("steps down to seventy-five percent opacity at three minutes old", () => {
    expect(getEventLogEntryOpacity(NOW - (3 * MINUTE), NOW)).toBe(0.75);
  });

  it("caps entries at forty percent opacity once they are an hour old", () => {
    expect(getEventLogEntryOpacity(NOW - (60 * MINUTE), NOW)).toBe(0.4);
    expect(getEventLogEntryOpacity(NOW - (90 * MINUTE), NOW)).toBe(0.4);
  });
});
