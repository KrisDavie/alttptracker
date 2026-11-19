import { describe, it, expect } from "vitest";
import { ROM_SPRITE_RANGES, ROM_SPRITE_SIZE, romSpritePixels } from "@/lib/romSprite";

/** A sprite sheet with chosen colour indices at pixels of 16×16 blocks */
function sheet(pixels: { block: [number, number]; x: number; y: number; index: number }[]): Uint8Array {
  const data = new Uint8Array(ROM_SPRITE_RANGES.sheet.size);
  for (const { block, x, y, index } of pixels) {
    const tile = (block[1] * 2 + Math.floor(y / 8)) * 16 + block[0] * 2 + Math.floor(x / 8);
    const row = tile * 32 + (y % 8) * 2;
    [0, 1, 16, 17].forEach((offset, plane) => {
      if ((index >> plane) & 1) data[row + offset] |= 1 << (7 - (x % 8));
    });
  }
  return data;
}

/** Palettes where colour 1 of palette p is (p + 1) × 8 in red, colour 2 green, colour 3 blue (BGR555) */
const palettes = (() => {
  const data = new Uint8Array(ROM_SPRITE_RANGES.palettes.size);
  for (let palette = 0; palette < 4; palette++) {
    const level = palette + 1;
    [level, level << 5, level << 10].forEach((value, color) => {
      data[palette * 30 + color * 2] = value & 0xff;
      data[palette * 30 + color * 2 + 1] = value >> 8;
    });
  }
  return data;
})();

function pixel(rgba: Uint8ClampedArray | null, x: number, y: number): number[] {
  const offset = (y * ROM_SPRITE_SIZE + x) * 4;
  return Array.from(rgba!.slice(offset, offset + 4));
}

describe("romSpritePixels", () => {
  it("needs the whole sheet and all four palettes", () => {
    expect(romSpritePixels(new Uint8Array(10), palettes, 1, false)).toBeNull();
    expect(romSpritePixels(sheet([]), new Uint8Array(90), 1, false)).toBeNull();
  });

  it("draws the head over the flipped body, without a shadow", () => {
    const rgba = romSpritePixels(
      sheet([
        { block: [3, 0], x: 0, y: 0, index: 1 }, // head, top left
        { block: [3, 0], x: 3, y: 15, index: 1 }, // head, overlapping the body
        { block: [4, 15], x: 12, y: 7, index: 2 }, // body, flipped to x 3, under the head
        { block: [4, 15], x: 0, y: 15, index: 3 }, // body, flipped to bottom right
      ]),
      palettes, 1, false,
    );
    expect(pixel(rgba, 7, 6)).toEqual([8, 0, 0, 255]);
    expect(pixel(rgba, 10, 21)).toEqual([8, 0, 0, 255]);
    expect(pixel(rgba, 22, 29)).toEqual([0, 0, 8, 255]);
    expect(pixel(rgba, 12, 28)).toEqual([0, 0, 0, 0]);
    expect(pixel(rgba, 0, 0)).toEqual([0, 0, 0, 0]);
  });

  it("draws the bunny's head over its body, below which is the shadow", () => {
    const rgba = romSpritePixels(
      sheet([
        { block: [5, 25], x: 3, y: 15, index: 1 },
        { block: [0, 26], x: 3, y: 7, index: 2 },
        { block: [0, 26], x: 15, y: 15, index: 3 },
      ]),
      palettes, 1, true,
    );
    expect(pixel(rgba, 10, 21)).toEqual([32, 0, 0, 255]);
    expect(pixel(rgba, 22, 29)).toEqual([0, 0, 32, 255]);
    expect(pixel(rgba, 12, 28)).toEqual([0x28, 0x28, 0x28, 255]); // shadow's bottom row
  });

  it("uses the mail's palette, and the bunny's without mail", () => {
    const data = sheet([
      { block: [3, 0], x: 0, y: 0, index: 1 },
      { block: [5, 25], x: 0, y: 0, index: 1 },
    ]);
    const red = (mail: number, bunny: boolean) => pixel(romSpritePixels(data, palettes, mail, bunny), 7, 6)[0];
    expect([red(1, false), red(2, false), red(3, false)]).toEqual([8, 16, 24]);
    expect([red(1, true), red(2, true), red(3, true)]).toEqual([32, 16, 24]);
  });
});
