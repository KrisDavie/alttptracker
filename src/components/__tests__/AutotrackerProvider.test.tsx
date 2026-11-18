import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { AutotrackerProvider } from "@/components/AutotrackerProvider";
import { renderWithStore, createTestStore } from "@/components/tracker/__tests__/renderWithStore";
import { ROM_SPRITE_RANGES } from "@/lib/romSprite";

/** Reads by start address; set failSpriteRead to make the sprite's reads fail */
const sni = vi.hoisted(() => ({ reads: [] as number[], failSpriteRead: false }));

vi.mock("@/sni/sni.client", () => ({
  DevicesClient: class {
    listDevices() {
      return Promise.resolve({ response: { devices: [{ uri: "mister:://mister" }] } });
    }
  },
  DeviceMemoryClient: class {
    singleRead({ request }: { request: { requestAddress: number; size: number } }) {
      sni.reads.push(request.requestAddress);
      if (sni.failSpriteRead && request.requestAddress === 0x80000) return Promise.reject(new Error("can't read ROM"));
      const data = new Uint8Array(request.size);
      if (request.requestAddress === 0x7fc0) data.set(new TextEncoder().encode("VT TEST ROM"));
      return Promise.resolve({ response: { response: { data } } });
    }
  },
}));

// jsdom has no canvas: stand in for the PNG encoding
vi.mock("@/lib/romSprite", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/romSprite")>()),
  romSpriteImages: (sheet: Uint8Array, palettes: Uint8Array) => ({ tunic1: `sheet ${sheet.length}, palettes ${palettes.length}` }),
}));

describe("AutotrackerProvider", () => {
  beforeEach(() => {
    sni.reads = [];
    sni.failSpriteRead = false;
  });

  it("reads the player sprite from the ROM once", async () => {
    const store = createTestStore();
    renderWithStore(<AutotrackerProvider>{null}</AutotrackerProvider>, { store });

    await waitFor(() => expect(store.getState().autotracker.romSprite).toEqual({ tunic1: "sheet 28672, palettes 120" }), { timeout: 3000 });
    // Keeps polling the game without reading the sprite again
    const polls = sni.reads.filter((address) => address === 0x7fc0).length;
    await waitFor(() => expect(sni.reads.filter((address) => address === 0x7fc0).length).toBeGreaterThan(polls + 1), { timeout: 3000 });
    expect(sni.reads.filter((address) => address === ROM_SPRITE_RANGES.sheet.start)).toHaveLength(1);
    expect(sni.reads.filter((address) => address === ROM_SPRITE_RANGES.palettes.start)).toHaveLength(1);
  });

  it("stays connected when the device can't read the sprite", async () => {
    sni.failSpriteRead = true;
    vi.spyOn(console, "error").mockImplementation(() => {});
    const store = createTestStore();
    renderWithStore(<AutotrackerProvider>{null}</AutotrackerProvider>, { store });

    await waitFor(() => expect(sni.reads).toContain(ROM_SPRITE_RANGES.sheet.start), { timeout: 3000 });
    const polls = sni.reads.filter((address) => address === 0x7fc0).length;
    await waitFor(() => expect(sni.reads.filter((address) => address === 0x7fc0).length).toBeGreaterThan(polls), { timeout: 3000 });
    expect(store.getState().autotracker.isConnected).toBe(true);
    expect(store.getState().autotracker.romSprite).toBeNull();
  });
});
