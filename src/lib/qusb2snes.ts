/**
 * QUsb2snes WebSocket protocol helpers.
 */

/** Send a QUsb2snes command and await its single response message. */
export function qusb2snesRequest(ws: WebSocket, opcode: string, operands: string[] = []): Promise<MessageEvent> {
  return new Promise((resolve, reject) => {
    const onMessage = (event: MessageEvent) => {
      ws.removeEventListener("error", onError);
      resolve(event);
    };
    const onError = (event: Event) => {
      ws.removeEventListener("message", onMessage);
      reject(new Error(`QUsb2snes WebSocket error during ${opcode}: ${event}`));
    };
    ws.addEventListener("message", onMessage, { once: true });
    ws.addEventListener("error", onError, { once: true });
    ws.send(JSON.stringify({ Opcode: opcode, Space: "SNES", Operands: operands }));
  });
}

/**
 * Send a QUsb2snes GetAddress and accumulate the binary reply until
 * `expectedSize` bytes have arrived. The usb2snes protocol allows large
 * GetAddress replies to be split across multiple binary frames (commonly
 * chunked at 1024 bytes on real hardware) — resolving on the first frame
 * truncates the data AND leaves the remaining frames to be misread as the
 * replies to subsequent requests, desyncing the whole poll cycle.
 */
export function qusb2snesBinaryRequest(
  ws: WebSocket,
  opcode: string,
  operands: string[],
  expectedSize: number,
  timeoutMs = 5000,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const buffer = new Uint8Array(expectedSize);
    let received = 0;
    const cleanup = () => {
      clearTimeout(timer);
      ws.removeEventListener("message", onMessage);
      ws.removeEventListener("error", onError);
    };
    // A device that stops mid-reply would otherwise hang the promise forever
    // and permanently wedge the poll loop (pollingRef never clears).
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`QUsb2snes ${opcode}: timed out after ${received}/${expectedSize} bytes`));
    }, timeoutMs);
    const onMessage = (event: MessageEvent) => {
      if (!(event.data instanceof ArrayBuffer)) {
        cleanup();
        reject(new Error(`QUsb2snes ${opcode}: expected binary frame, received text`));
        return;
      }
      const chunk = new Uint8Array(event.data);
      if (received + chunk.length > expectedSize) {
        cleanup();
        reject(new Error(`QUsb2snes ${opcode}: received ${received + chunk.length} bytes, expected ${expectedSize}`));
        return;
      }
      buffer.set(chunk, received);
      received += chunk.length;
      if (received === expectedSize) {
        cleanup();
        resolve(buffer);
      }
    };
    const onError = (event: Event) => {
      cleanup();
      reject(new Error(`QUsb2snes WebSocket error during ${opcode}: ${event}`));
    };
    ws.addEventListener("message", onMessage);
    ws.addEventListener("error", onError, { once: true });
    ws.send(JSON.stringify({ Opcode: opcode, Space: "SNES", Operands: operands }));
  });
}

/** Send a QUsb2snes command that doesn't produce a response (e.g. Attach). */
export function qusb2snesSend(ws: WebSocket, opcode: string, operands: string[] = []) {
  ws.send(JSON.stringify({ Opcode: opcode, Space: "SNES", Operands: operands }));
}
