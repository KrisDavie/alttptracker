import { describe, it, expect, vi } from "vitest";
import { ROM_SPRITE_RANGES } from "@/lib/romSprite";
import { spriteFingerprint } from "@/lib/spriteFingerprint";
import { romSpriteName } from "@/lib/romSpriteName";

const sheet = new Uint8Array(ROM_SPRITE_RANGES.sheet.size).fill(1);
const palettes = new Uint8Array(ROM_SPRITE_RANGES.palettes.size).fill(2);

const fingerprint = vi.hoisted(() => ({ known: "" }));
vi.mock("@/data/spriteFingerprints", () => ({
  get SPRITE_FINGERPRINTS() {
    return { [fingerprint.known]: "known" };
  },
}));

describe("romSpriteName", () => {
  it("names a sprite whose sheet and palettes match a bundled sprite's", () => {
    fingerprint.known = spriteFingerprint(sheet, palettes);
    expect(romSpriteName(sheet, palettes)).toBe("known");
  });

  it("is null for a sprite the tracker doesn't ship, or incomplete data", () => {
    fingerprint.known = spriteFingerprint(sheet, palettes);
    const changed = palettes.slice();
    changed[119] = 3;
    expect(romSpriteName(sheet, changed)).toBeNull();
    expect(romSpriteName(sheet.subarray(1), palettes)).toBeNull();
  });
});
