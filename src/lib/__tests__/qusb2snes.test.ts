import { describe, it, expect, vi } from "vitest";
import { qusb2snesBinaryRequest } from "@/lib/qusb2snes";

/**
 * Regression tests: GetAddress replies can be split across multiple binary
 * WebSocket frames (usb2snes chunks large reads, commonly at 1024 bytes).
 * The old implementation resolved on the FIRST frame, truncating data and
 * desyncing every subsequent request on the socket.
 */

type Listener = (event: MessageEvent) => void;

function createMockWebSocket() {
  const listeners: Record<string, Listener[]> = { message: [], error: [] };
  return {
    sent: [] as string[],
    addEventListener(type: string, listener: Listener) {
      listeners[type].push(listener);
    },
    removeEventListener(type: string, listener: Listener) {
      listeners[type] = listeners[type].filter((l) => l !== listener);
    },
    send(data: string) {
      this.sent.push(data);
    },
    emitBinary(bytes: number[]) {
      const buf = new Uint8Array(bytes).buffer;
      for (const l of [...listeners.message]) l({ data: buf } as MessageEvent);
    },
    emitText(text: string) {
      for (const l of [...listeners.message]) l({ data: text } as MessageEvent);
    },
    listenerCount(type: string) {
      return listeners[type].length;
    },
  };
}

describe("qusb2snesBinaryRequest", () => {
  it("accumulates a reply split across multiple binary frames", async () => {
    const ws = createMockWebSocket();
    const promise = qusb2snesBinaryRequest(ws as unknown as WebSocket, "GetAddress", ["f5f000", "4ff"], 1279);

    // 1024-byte chunk + 255-byte chunk (the real-world split for the "main" range)
    ws.emitBinary(Array.from({ length: 1024 }, (_, i) => i % 256));
    ws.emitBinary(Array.from({ length: 255 }, () => 0xab));

    const data = await promise;
    expect(data).toHaveLength(1279);
    expect(data[0]).toBe(0);
    expect(data[1023]).toBe(1023 % 256);
    expect(data[1024]).toBe(0xab);
    expect(data[1278]).toBe(0xab);
    // Listeners must be cleaned up so leftover frames can't leak into later requests
    expect(ws.listenerCount("message")).toBe(0);
  });

  it("resolves immediately for single-frame replies", async () => {
    const ws = createMockWebSocket();
    const promise = qusb2snesBinaryRequest(ws as unknown as WebSocket, "GetAddress", ["f5f000", "4"], 4);
    ws.emitBinary([1, 2, 3, 4]);
    expect(Array.from(await promise)).toEqual([1, 2, 3, 4]);
  });

  it("rejects when a text frame arrives instead of binary (desync guard)", async () => {
    const ws = createMockWebSocket();
    const promise = qusb2snesBinaryRequest(ws as unknown as WebSocket, "GetAddress", ["0", "4"], 4);
    ws.emitText('{"Results": []}');
    await expect(promise).rejects.toThrow(/expected binary frame/);
    expect(ws.listenerCount("message")).toBe(0);
  });

  it("rejects when more bytes arrive than requested", async () => {
    const ws = createMockWebSocket();
    const promise = qusb2snesBinaryRequest(ws as unknown as WebSocket, "GetAddress", ["0", "2"], 2);
    ws.emitBinary([1, 2, 3]);
    await expect(promise).rejects.toThrow(/received 3 bytes, expected 2/);
  });

  it("times out instead of hanging when the reply stalls mid-transfer", async () => {
    vi.useFakeTimers();
    try {
      const ws = createMockWebSocket();
      const promise = qusb2snesBinaryRequest(ws as unknown as WebSocket, "GetAddress", ["0", "800"], 2048, 5000);
      ws.emitBinary(Array.from({ length: 1024 }, () => 0));
      const assertion = expect(promise).rejects.toThrow(/timed out after 1024\/2048 bytes/);
      vi.advanceTimersByTime(5001);
      await assertion;
      expect(ws.listenerCount("message")).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
