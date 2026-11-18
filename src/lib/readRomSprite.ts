import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { DeviceMemoryClient, DevicesClient } from "@/sni/sni.client";
import { AddressSpace, MemoryMapping } from "@/sni/sni";
import { qusb2snesBinaryRequest, qusb2snesRequest, qusb2snesSend } from "@/lib/qusb2snes";
import { ROM_SPRITE_RANGES, romSpriteImages, type RomSpriteImages } from "@/lib/romSprite";
import { romSpriteName } from "@/lib/romSpriteName";

export interface RomSprite {
  images: RomSpriteImages;
  /** The bundled sprite it is, or null for one the tracker doesn't ship */
  name: string | null;
}

export interface RomSpriteSource {
  protocol: "sni" | "qusb2snes";
  host: string;
  port: number;
}

/**
 * Reads the player sprite from the first device's ROM, for the launcher to preview before the
 * tracker's autotracking connects. Null when there's no device or it can't read ROM.
 */
export async function readRomSprite(source: RomSpriteSource): Promise<RomSprite | null> {
  const { sheet, palettes } = ROM_SPRITE_RANGES;
  const ranges = source.protocol === "sni" ? await readSni(source, [sheet, palettes]) : await readQusb2snes(source, [sheet, palettes]);
  const images = ranges && romSpriteImages(ranges[0], ranges[1]);
  return images ? { images, name: romSpriteName(ranges[0], ranges[1]) } : null;
}

type Range = { start: number; size: number };

async function readSni({ host, port }: RomSpriteSource, ranges: Range[]): Promise<Uint8Array[] | null> {
  const transport = new GrpcWebFetchTransport({ baseUrl: `http://${host}:${port}` });
  const devices = await new DevicesClient(transport).listDevices({ kinds: [] });
  const uri = devices.response.devices[0]?.uri;
  if (!uri) return null;
  const memory = new DeviceMemoryClient(transport);
  const data: Uint8Array[] = [];
  for (const { start, size } of ranges) {
    const read = await memory.singleRead({
      uri,
      request: { requestMemoryMapping: MemoryMapping.LoROM, requestAddressSpace: AddressSpace.FxPakPro, requestAddress: start, size },
    });
    const bytes = read.response.response?.data;
    if (!bytes) return null;
    data.push(bytes);
  }
  return data;
}

async function readQusb2snes({ host, port }: RomSpriteSource, ranges: Range[]): Promise<Uint8Array[] | null> {
  const ws = new WebSocket(`ws://${host}:${port}`);
  ws.binaryType = "arraybuffer";
  try {
    await new Promise<void>((resolve, reject) => {
      ws.onopen = () => resolve();
      ws.onerror = () => reject(new Error("QUsb2snes WebSocket error"));
    });
    const list = await qusb2snesRequest(ws, "DeviceList");
    const device = (JSON.parse(list.data as string) as { Results?: string[] }).Results?.[0];
    if (!device) return null;
    // Awaiting Info makes sure the Attach has finished before reading (see AutotrackerProvider)
    qusb2snesSend(ws, "Attach", [device]);
    await qusb2snesRequest(ws, "Info");
    const data: Uint8Array[] = [];
    for (const { start, size } of ranges) {
      data.push(await qusb2snesBinaryRequest(ws, "GetAddress", [start.toString(16), size.toString(16)], size));
    }
    return data;
  } finally {
    ws.onopen = ws.onerror = null;
    ws.close();
  }
}
