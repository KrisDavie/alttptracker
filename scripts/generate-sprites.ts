/**
 * Draws public/sprites from the sprites alttpr.com offers, with the same code autotracking uses to
 * draw a ROM's sprite (src/lib/romSprite.ts), so the two match. Also writes src/data/spriteNames.ts and
 * src/data/spriteFingerprints.ts, which names the sprite a ROM has. Run when sprites are added or updated:
 *
 *   node scripts/generate-sprites.ts [--cache <dir>]
 *
 * alttpr.com's Link .zspr can't be downloaded, as it's Nintendo's, so Link's comes from snesrev's
 * sprites-gfx instead.
 *
 * Downloads are kept in the cache (by default in the system's temp directory) so reruns are quick.
 * A sprite that isn't drawn, like one whose download failed, keeps its images
 * and fingerprint as they are; sprites alttpr.com no longer offers are removed.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { crc32, deflateSync } from "node:zlib";
import { ROM_SPRITE_RANGES, ROM_SPRITE_SIZE, romSpritePixels } from "../src/lib/romSprite.ts";
import { spriteFingerprint } from "../src/lib/spriteFingerprint.ts";

const SPRITE_LIST = "https://alttpr.com/sprites";
const LINK_ZSPR = "https://snesrev.github.io/sprites-gfx/snes/zelda3/link/sheets/001.link.1.zspr";
const SPRITES = new URL("../public/sprites/", import.meta.url);
const NAMES = new URL("../src/data/spriteNames.ts", import.meta.url);
const FINGERPRINTS = new URL("../src/data/spriteFingerprints.ts", import.meta.url);
/** The bundled images are the 32×32 ones scaled up */
const SCALE = 4;
const VARIANTS = [1, 2, 3].flatMap((mail) => [{ mail, bunny: false }, { mail, bunny: true }]);
const IMAGE = /^(.+)_tunic(bunny)?[123]\.png$/;

function flag(name: string): string | undefined {
  const at = process.argv.indexOf(name);
  return at > 0 ? process.argv[at + 1] : undefined;
}
const CACHE = flag("--cache") ?? join(tmpdir(), "alttpr-sprites");
const LINK = "link";

interface ListedSprite {
  name: string;
  file: string;
}

/** The file name a sprite's images use: "Boo 2" is boo_2 */
function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

/** The sprite sheet and mail palettes of a .zspr, as the ROM holds them */
function readZspr(file: Buffer): { sheet: Uint8Array; palettes: Uint8Array } {
  if (file.toString("ascii", 0, 4) !== "ZSPR") throw new Error("not a .zspr");
  const sheetAt = file.readUInt32LE(9);
  const paletteAt = file.readUInt32LE(15);
  return {
    sheet: file.subarray(sheetAt, sheetAt + ROM_SPRITE_RANGES.sheet.size),
    palettes: file.subarray(paletteAt, paletteAt + ROM_SPRITE_RANGES.palettes.size),
  };
}

/** An 8-bit RGBA PNG of 32×32 pixels, scaled up */
function encodePng(pixels: Uint8ClampedArray): Buffer {
  const size = ROM_SPRITE_SIZE * SCALE;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const from = (Math.floor(y / SCALE) * ROM_SPRITE_SIZE + Math.floor(x / SCALE)) * 4;
      raw.set(pixels.subarray(from, from + 4), y * (size * 4 + 1) + 1 + x * 4);
    }
  }
  const chunk = (type: string, data: Buffer) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** A .zspr from the cache, else downloaded into it; null if it can't be downloaded */
async function download(url: string): Promise<Buffer | null> {
  const cached = join(CACHE, url.slice(url.lastIndexOf("/") + 1));
  if (existsSync(cached)) return readFileSync(cached);
  const response = await fetch(url);
  if (!response.ok) return null;
  const file = Buffer.from(await response.arrayBuffer());
  writeFileSync(cached, file);
  return file;
}

mkdirSync(CACHE, { recursive: true });
const listed = ((await (await fetch(SPRITE_LIST)).json()) as ListedSprite[]).map((sprite) => ({ ...sprite, slug: slug(sprite.name) }));
const failed: string[] = [];
const fingerprints = new Map<string, string>();
const drawn = new Set<string>();
// Kept for sprites that aren't drawn this time
const { SPRITE_FINGERPRINTS: previous } = (await import(FINGERPRINTS.href).catch(() => ({ SPRITE_FINGERPRINTS: {} }))) as {
  SPRITE_FINGERPRINTS: Record<string, string>;
};

// A few at a time, to be gentle on alttpr.com
for (let start = 0; start < listed.length; start += 8) {
  await Promise.all(
    listed.slice(start, start + 8).map(async (sprite) => {
      try {
        const url = sprite.slug === LINK ? LINK_ZSPR : sprite.file;
        const file = await download(url);
        if (!file) throw new Error(`can't download ${url}`);
        const { sheet, palettes } = readZspr(file);
        for (const { mail, bunny } of VARIANTS) {
          const pixels = romSpritePixels(sheet, palettes, mail, bunny);
          if (!pixels) throw new Error("incomplete sheet or palettes");
          writeFileSync(new URL(`${sprite.slug}_tunic${bunny ? "bunny" : ""}${mail}.png`, SPRITES), encodePng(pixels));
        }
        fingerprints.set(spriteFingerprint(sheet, palettes), sprite.slug);
        drawn.add(sprite.slug);
      } catch (error) {
        failed.push(`${sprite.name} (${(error as Error).message})`);
      }
    }),
  );
}

const offered = new Set(listed.map((sprite) => sprite.slug));
const removed = new Set<string>();
for (const file of readdirSync(SPRITES)) {
  const name = file.match(IMAGE)?.[1];
  if (name && !offered.has(name)) {
    unlinkSync(new URL(file, SPRITES));
    removed.add(name);
  }
}

// Every offered sprite with images, including any not drawn this time but drawn before
const names = [...offered].filter((name) => existsSync(new URL(`${name}_tunic1.png`, SPRITES))).sort((a, b) => a.localeCompare(b));
writeFileSync(
  NAMES,
  `// Generated by scripts/generate-sprites.ts from ${SPRITE_LIST}. Do not edit.

const SPRITE_NAMES = [
${names.map((name) => `  "${name}",`).join("\n")}
] as const;

export default SPRITE_NAMES;
`,
);

for (const [fingerprint, name] of Object.entries(previous)) {
  if (!drawn.has(name) && names.includes(name)) fingerprints.set(fingerprint, name);
}
writeFileSync(
  FINGERPRINTS,
  `// Generated by scripts/generate-sprites.ts from ${SPRITE_LIST}. Do not edit.

/** Each bundled sprite's spriteFingerprint, by fingerprint */
export const SPRITE_FINGERPRINTS: Record<string, string> = {
${[...fingerprints]
  .sort(([, a], [, b]) => a.localeCompare(b))
  .map(([fingerprint, name]) => `  "${fingerprint}": "${name}",`)
  .join("\n")}
};
`,
);

console.log(`${drawn.size} of ${listed.length} sprites drawn, ${names.length} listed`);
if (failed.length) console.log(`Kept as they were:\n  ${failed.join("\n  ")}`);
if (removed.size) console.log(`No longer offered, removed: ${[...removed].sort().join(", ")}`);
