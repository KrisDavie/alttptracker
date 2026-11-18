/**
 * The player sprite as the ROM holds it: the sprite sheet and palettes a sprite file (.zspr) writes.
 * Draws the poses the bundled /sprites images use (which are these 32×32 images scaled 4×):
 * SpriteSomething's "File select" without the sword and shield, and "Bunny stand".
 */

/** Where autotracking reads the sprite, in SNI's FX Pak Pro address space (the ROM starts at 0) */
export const ROM_SPRITE_RANGES = {
  /** 896 4bpp tiles, 16 across: 8 columns of 16×16 blocks */
  sheet: { start: 0x80000, size: 0x7000 },
  /** Green, blue and red mail, then the bunny: 15 BGR555 colours each (colour 0 is transparent) */
  palettes: { start: 0xdd308, size: 120 },
};

export const ROM_SPRITE_SIZE = 32;

interface Pose {
  /** Head and body blocks: [column, row] of 16×16 blocks */
  head: [number, number];
  body: [number, number];
  flipsBody: boolean;
  shadow: boolean;
}

/** SpriteSomething's A3 + P4 (flipped) and Z5 + AA0 */
const LINK: Pose = { head: [3, 0], body: [4, 15], flipsBody: true, shadow: false };
const BUNNY: Pose = { head: [5, 25], body: [0, 26], flipsBody: false, shadow: true };
/** Where the head block goes; the body is 8 pixels lower and the shadow 7 */
const ORIGIN = { x: 7, y: 6 };
/** SpriteSomething's main_shadow: rows of [first x, width] from 10 rows below the shadow's top */
const SHADOW_ROWS: [number, number][] = [[5, 6], [3, 10], [2, 12], [2, 12], [3, 10], [5, 6]];
const SHADOW_COLOR: [number, number, number, number] = [0x28, 0x28, 0x28, 255];

/** A pixel's colour index (0–15) in a 16×16 block */
function colorIndex(sheet: Uint8Array, [column, row]: [number, number], x: number, y: number): number {
  const tile = (row * 2 + Math.floor(y / 8)) * 16 + column * 2 + Math.floor(x / 8);
  const offset = tile * 32 + (y % 8) * 2;
  const bit = 7 - (x % 8);
  return [offset, offset + 1, offset + 16, offset + 17].reduce((index, at, plane) => index | (((sheet[at] >> bit) & 1) << plane), 0);
}

/** RGBA colours 0–15 of a palette; colour 0 is transparent */
function palette(palettes: Uint8Array, index: number): [number, number, number, number][] {
  const colors: [number, number, number, number][] = [[0, 0, 0, 0]];
  for (let color = 0; color < 15; color++) {
    const offset = index * 30 + color * 2;
    const bgr = palettes[offset] | (palettes[offset + 1] << 8);
    const channel = (shift: number) => Math.floor((((bgr >> shift) & 31) * 255) / 31);
    colors.push([channel(0), channel(5), channel(10), 255]);
  }
  return colors;
}

/**
 * RGBA pixels, row by row, for a mail level (1–3), as a bunny without the Moon Pearl. Like the
 * bundled images, the bunny wears the blue or red mail's palette once Link has that mail.
 * Null unless the sheet and palettes are complete.
 */
export function romSpritePixels(sheet: Uint8Array, palettes: Uint8Array, mail: number, bunny: boolean): Uint8ClampedArray<ArrayBuffer> | null {
  if (sheet.length !== ROM_SPRITE_RANGES.sheet.size || palettes.length !== ROM_SPRITE_RANGES.palettes.size) return null;
  const level = Math.min(Math.max(mail, 1), 3);
  const colors = palette(palettes, bunny && level === 1 ? 3 : level - 1);
  const pose = bunny ? BUNNY : LINK;
  const pixels = new Uint8ClampedArray(ROM_SPRITE_SIZE * ROM_SPRITE_SIZE * 4);
  const set = (x: number, y: number, rgba: [number, number, number, number]) => pixels.set(rgba, (y * ROM_SPRITE_SIZE + x) * 4);

  if (pose.shadow) {
    const shadowTop = ORIGIN.y + 7 + 10;
    SHADOW_ROWS.forEach(([x, width], row) => {
      for (let column = x; column < x + width; column++) set(ORIGIN.x + column, shadowTop + row, SHADOW_COLOR);
    });
  }
  // The head goes on top of the body
  const parts: [[number, number], number, boolean][] = [[pose.body, 8, pose.flipsBody], [pose.head, 0, false]];
  for (const [block, dy, flips] of parts) {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const index = colorIndex(sheet, block, flips ? 15 - x : x, y);
        if (index !== 0) set(ORIGIN.x + x, ORIGIN.y + dy + y, colors[index]);
      }
    }
  }
  return pixels;
}

/** The images SpriteDisplay picks from, keyed like the bundled files: "tunic1"…"tunic3", "tunicbunny1"…"tunicbunny3" */
export type RomSpriteImages = Record<string, string>;

/** PNG data URLs of every mail level and bunny, or null if the data is incomplete or there's no canvas */
export function romSpriteImages(sheet: Uint8Array, palettes: Uint8Array): RomSpriteImages | null {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = ROM_SPRITE_SIZE;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const images: RomSpriteImages = {};
  for (const bunny of [false, true]) {
    for (const mail of [1, 2, 3]) {
      const pixels = romSpritePixels(sheet, palettes, mail, bunny);
      if (!pixels) return null;
      context.putImageData(new ImageData(pixels, ROM_SPRITE_SIZE, ROM_SPRITE_SIZE), 0, 0);
      images[`tunic${bunny ? "bunny" : ""}${mail}`] = canvas.toDataURL("image/png");
    }
  }
  return images;
}
