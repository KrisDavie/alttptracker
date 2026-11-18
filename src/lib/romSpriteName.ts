import { ROM_SPRITE_RANGES } from "@/lib/romSprite";
import { spriteFingerprint } from "@/lib/spriteFingerprint";
import { SPRITE_FINGERPRINTS } from "@/data/spriteFingerprints";

/** The bundled sprite a ROM's sprite sheet and palettes are, or null for a sprite the tracker doesn't ship */
export function romSpriteName(sheet: Uint8Array, palettes: Uint8Array): string | null {
  if (sheet.length !== ROM_SPRITE_RANGES.sheet.size || palettes.length !== ROM_SPRITE_RANGES.palettes.size) return null;
  return SPRITE_FINGERPRINTS[spriteFingerprint(sheet, palettes)] ?? null;
}
