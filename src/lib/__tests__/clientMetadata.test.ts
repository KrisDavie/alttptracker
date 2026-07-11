import { describe, it, expect } from "vitest";
import { collectClientMetadata } from "../clientMetadata";

describe("collectClientMetadata", () => {
  it("captures core environment fields without throwing", async () => {
    const meta = await collectClientMetadata();

    // Always-present basics.
    expect(typeof meta.userAgent).toBe("string");

    // Window/viewport geometry mirrors the (jsdom) window.
    expect(meta.window.innerWidth).toBe(window.innerWidth);
    expect(meta.window.innerHeight).toBe(window.innerHeight);
    expect(meta.window.devicePixelRatio).toBe(window.devicePixelRatio);

    // Screen geometry mirrors the (jsdom) screen.
    expect(meta.screen.width).toBe(screen.width);
    expect(meta.screen.height).toBe(screen.height);

    // Preferences block is populated (values may be undefined but object exists).
    expect(meta.preferences).toBeDefined();
  });

  it("derives a zoom estimate from outer/inner width", async () => {
    const meta = await collectClientMetadata();
    if (window.innerWidth > 0) {
      expect(meta.window.zoomPercentEstimate).toBe(Math.round((window.outerWidth / window.innerWidth) * 100));
    }
  });
});
