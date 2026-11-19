/**
 * A fingerprint of a sprite's sheet and mail palettes, which a ROM holds exactly as the sprite's .zspr
 * does, to recognise the sprite a ROM has among the bundled ones. No imports, so
 * scripts/generate-sprites.ts can run it under Node directly.
 */
export function spriteFingerprint(sheet: Uint8Array, palettes: Uint8Array): string {
  // cyrb53
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (const bytes of [sheet, palettes]) {
    for (const value of bytes) {
      h1 = Math.imul(h1 ^ value, 2654435761);
      h2 = Math.imul(h2 ^ value, 1597334677);
    }
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}
