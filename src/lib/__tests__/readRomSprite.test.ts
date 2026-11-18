import { describe, it, expect, vi, beforeEach } from "vitest";
import { readRomSprite } from "@/lib/readRomSprite";
import { ROM_SPRITE_RANGES } from "@/lib/romSprite";

const sni = vi.hoisted(() => ({ devices: [] as string[], reads: [] as [string, number][] }));

vi.mock("@/sni/sni.client", () => ({
  DevicesClient: class {
    listDevices() {
      return Promise.resolve({ response: { devices: sni.devices.map((uri) => ({ uri })) } });
    }
  },
  DeviceMemoryClient: class {
    singleRead({ uri, request }: { uri: string; request: { requestAddress: number; size: number } }) {
      sni.reads.push([uri, request.requestAddress]);
      return Promise.resolve({ response: { response: { data: new Uint8Array(request.size) } } });
    }
  },
}));

vi.mock("@/lib/romSpriteName", () => ({ romSpriteName: () => "link" }));

// jsdom has no canvas: stand in for the PNG encoding
vi.mock("@/lib/romSprite", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/romSprite")>()),
  romSpriteImages: (sheet: Uint8Array, palettes: Uint8Array) => ({ tunic1: `sheet ${sheet.length}, palettes ${palettes.length}` }),
}));

const SOURCE = { protocol: "sni" as const, host: "localhost", port: 8190 };

describe("readRomSprite", () => {
  beforeEach(() => {
    sni.devices = [];
    sni.reads = [];
  });

  it("reads the sprite from the first device over SNI", async () => {
    sni.devices = ["mister:://mister", "other"];
    expect(await readRomSprite(SOURCE)).toEqual({ images: { tunic1: "sheet 28672, palettes 120" }, name: "link" });
    expect(sni.reads).toEqual([
      ["mister:://mister", ROM_SPRITE_RANGES.sheet.start],
      ["mister:://mister", ROM_SPRITE_RANGES.palettes.start],
    ]);
  });

  it("is null without a device", async () => {
    expect(await readRomSprite(SOURCE)).toBeNull();
    expect(sni.reads).toEqual([]);
  });
});
