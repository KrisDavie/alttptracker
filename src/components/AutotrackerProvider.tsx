import React, { useEffect, useState, useRef } from "react";
import { DUNGEON_ITEMS, getRangeFromAddress, MEMORY_RANGES, SPECIAL_HANDLE_INVENTORY_ITEMS, type DungeonInfo } from "@/data/sramLocations";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { setConnected, setDeviceList, setRomName } from "@/store/autotrackerSlice";
import { DeviceMemoryClient, DevicesClient } from "@/sni/sni.client";
import { AddressSpace, MemoryMapping } from "@/sni/sni";
import { locationsData } from "@/data/locationsData";
import { ALL_SRAM_LOCATIONS_MAP, INVENTORY_LOCATIONS } from "@/data/sramLocations";
import { getAllPossibleLocations } from "@/lib/logic/locationMapper";
import { updateMultipleLocations, type CheckStatus } from "@/store/checksSlice";
import { updateMultipleItems } from "@/store/itemsSlice";
import { updateDungeonState, type DungeonState } from "@/store/dungeonsSlice";

/** Send a QUsb2snes command and await its single response message. */
function qusb2snesRequest(ws: WebSocket, opcode: string, operands: string[] = []): Promise<MessageEvent> {
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

/** Send a QUsb2snes command that doesn't produce a response (e.g. Attach). */
function qusb2snesSend(ws: WebSocket, opcode: string, operands: string[] = []) {
  ws.send(JSON.stringify({ Opcode: opcode, Space: "SNES", Operands: operands }));
}

interface AutotrackerProviderProps {
  children: React.ReactNode;
}

export const AutotrackerProvider: React.FC<AutotrackerProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const autotrackerState = useSelector((state: RootState) => state.autotracker);
  const autotrackingEnabled = useSelector((state: RootState) => state.settings.autotracking);
  const settings = useSelector((state: RootState) => state.settings);
  const { isConnected, connectionType, selectedDevice, romName, host, port } = autotrackerState;
  const [autoTrackingData, setAutoTrackingData] = useState<Record<string, Uint8Array>>({});
  const [qusb2Websocket, setQusb2Websocket] = useState<WebSocket | null>(null);

  const checks = useSelector((state: RootState) => state.checks.locationsChecks);
  const checksRef = useRef(checks);


  // Keep the ref updated with the latest checks state
  useEffect(() => {
    checksRef.current = checks;
  }, [checks]);

  const items = useSelector((state: RootState) => state.items);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Connecting and querying data
  useEffect(() => {
    if (!autotrackingEnabled) {
      return;
    }

    if (!host || !port) {
      console.error("Host or port not set for autotracker connection");
      return;
    }
    
    if (connectionType === "qusb2snes") {
      if (!qusb2Websocket || qusb2Websocket.readyState !== WebSocket.OPEN) {
        const ws = new WebSocket(`ws://${host}:${port}`);
        ws.binaryType = "arraybuffer";
        ws.onopen = () => {
          console.log("Connected to QUsb2snes WebSocket");
          setQusb2Websocket(ws);
        };
        ws.onclose = () => {
          console.log("QUsb2snes WebSocket closed");
          setQusb2Websocket(null);
        };
      }
    }

    // --- Transport-agnostic helpers ---
    async function fetchDevices(): Promise<string[]> {
      if (connectionType === "sni") {
        const transport = new GrpcWebFetchTransport({ baseUrl: `http://${host}:${port}` });
        const deviceClient = new DevicesClient(transport);
        const devicesResponse = await deviceClient.listDevices({ kinds: [] });
        return devicesResponse.response.devices.map((device) => device.uri);
      } else {
        if (!qusb2Websocket || qusb2Websocket.readyState !== WebSocket.OPEN) {
          throw new Error("WebSocket not connected for QUsb2snes");
        }
        const response = await qusb2snesRequest(qusb2Websocket, "DeviceList");
        const parsed = JSON.parse(response.data as string) as { Results: string[] };
        return parsed.Results ?? [];
      }
    }

    async function connectToDevice(devices: string[]): Promise<void> {
      if (devices.length === 0) return;
      const device = devices[0];
      dispatch(setDeviceList(devices));

      if (connectionType === "sni") {
        dispatch(setConnected({ selectedDevice: device, isConnected: true }));
      } else {
        // Attach to the device (no response expected)
        qusb2snesSend(qusb2Websocket!, "Attach", [device]);
        dispatch(setConnected({ selectedDevice: device, isConnected: true }));
      }
    }

    async function fetchMemoryRange(requestAddress: number, size: number): Promise<Uint8Array | undefined> {
      if (connectionType === "sni") {
        if (!selectedDevice) throw new Error("No device selected");
        const transport = new GrpcWebFetchTransport({ baseUrl: `http://${host}:${port}` });
        const memClient = new DeviceMemoryClient(transport);
        const memoryRangeResponse = await memClient.singleRead({
          uri: selectedDevice,
          request: {
            requestMemoryMapping: MemoryMapping.LoROM, // TODO: Detect this on connection (and when reloading rom)
            requestAddressSpace: AddressSpace.FxPakPro,
            requestAddress,
            size,
          },
        });
        return memoryRangeResponse.response.response?.data;
      } else {
        if (!qusb2Websocket || qusb2Websocket.readyState !== WebSocket.OPEN) {
          throw new Error("WebSocket not connected for QUsb2snes");
        }
        const response = await qusb2snesRequest(
          qusb2Websocket,
          "GetAddress",
          [requestAddress.toString(16), size.toString(16)],
        );
        return new Uint8Array(response.data as ArrayBuffer);
      }
    }

    // --- Shared polling loop ---
    const poll = async () => {
      // For QUsb2snes, wait until the WebSocket is actually open before doing anything
      if (connectionType === "qusb2snes" && (!qusb2Websocket || qusb2Websocket.readyState !== WebSocket.OPEN)) {
        return;
      }

      if (!isConnected) {
        try {
          const devices = await fetchDevices();
          await connectToDevice(devices);
        } catch (error) {
          console.error("Error during device discovery:", error);
        }
      } else {
        const newData: Record<string, Uint8Array> = {};
        for (const [name, range] of Object.entries(MEMORY_RANGES)) {
          try {
            const data = await fetchMemoryRange(range.start, range.size);
            if (data) {
              if (name === "romname") {
                const fetchedRomName = new TextDecoder().decode(data).replace(/\0/g, "");
                if (romName !== fetchedRomName) {
                  dispatch(setRomName(fetchedRomName));
                }
              } else if (name === "gamemode") {
                const gameMode = data[0];
                if (![0x07, 0x09, 0x0b].includes(gameMode)) {
                  break; // Invalid game mode, skip processing
                }
              } else {
                newData[name] = data;
              }
            }
          } catch (error) {
            console.error(`Error fetching memory range ${range.start.toString(16)}-${(range.start + range.size - 1).toString(16)}:`, error);
          }
        }
        setAutoTrackingData(newData);
      }
    };

    const interval = setInterval(poll, 500);
    poll();

    return () => clearInterval(interval);
  }, [isConnected, connectionType, selectedDevice, romName, host, port, dispatch, autotrackingEnabled, qusb2Websocket]);

  // Actually process the data and mark things as checked etc.
  useEffect(() => {
    if (Object.keys(autoTrackingData).length === 0) return;

    const getByte = (addr: number) => {
      const rangeData = getRangeFromAddress(addr);
      if (!rangeData) return null;
      const { name, range } = rangeData;
      const data = autoTrackingData[name];
      return data ? data[addr - range.start] || 0 : null;
    };

    const getWord = (addr: number) => {
      const rangeData = getRangeFromAddress(addr);
      if (!rangeData) return null;
      const { name, range } = rangeData;
      const data = autoTrackingData[name];
      if (!data) return null;
      const offset = addr - range.start;
      return (data[offset] || 0) | ((data[offset + 1] || 0) << 8);
    };

    const updates: Record<string, CheckStatus> = {};
    const itemUpdates: Record<string, number> = {};
    const dungeonUpdates: Record<string, Partial<DungeonState>> = {};


    // // TODO: Add full processing here
    const FORK = romName?.slice(0, 2)
    // const VERSION = romName?.slice(2, 5)


    // Item locations — use ALL possible locations for autotracking
    // (we want to track anything the player picks up, even if settings don't show it)
    Object.keys(locationsData).forEach((entryKey) => {
      getAllPossibleLocations(entryKey).forEach((locInfo) => {
        const itemLoc = locInfo.name;
        const locationState = checksRef.current[itemLoc];
        if (!locationState || locationState.manuallyChecked || locationState.checked) return;

        const sramLoc = ALL_SRAM_LOCATIONS_MAP[itemLoc];
        const val = sramLoc ? getWord(sramLoc.wramAddress) : null;
        if (val === null) return;

        if ((val & sramLoc!.mask) !== 0) {
          updates[itemLoc] = { ...locationState, checked: true, manuallyChecked: false };
        }
      });
    });

    // Inventory items
    INVENTORY_LOCATIONS.forEach((sramLoc) => {
      const itemName = sramLoc.name.replace("Inventory - ", "");
      const currentAmount = itemsRef.current[itemName]?.amount ?? 0;
      const val = getByte(sramLoc.wramAddress);
      if (val === null) return;

      let newValue = sramLoc.mask === 0 ? val : (val & sramLoc.mask) !== 0 ? 1 : 0;
      if (itemName.startsWith("bottle")) newValue = Math.max(0, newValue - 1);

      if (newValue !== currentAmount) itemUpdates[itemName] = newValue;
    });

    // Special items
    SPECIAL_HANDLE_INVENTORY_ITEMS.forEach((sramLoc) => {
      const itemName = sramLoc.name.replace("Inventory - ", "");
      const val = getByte(sramLoc.wramAddress);
      if (val === null) return;

      switch (itemName) {
        case "bow": {
          const bits = val & 0xc0;
          if (bits !== 0) itemUpdates["bow"] = bits === 0x40 ? 2 : bits === 0x80 ? 3 : 4;
          break;
        }
        case "boomerang": {
          const bits = val & 0xc0;
          if (bits !== 0) itemUpdates["boomerang"] = bits === 0x80 ? 1 : bits === 0x40 ? 2 : 3;
          break;
        }
        case "bombs": itemUpdates["bomb"] = val > 0 ? 1 : 0; break;
        case "mushroom": {
          const bits = val & 0x28;
          itemUpdates["mushroom"] = bits & 0x28 ? 1 : bits & 0x08 ? 2 : 0;
          break;
        }
        case "powder":
        case "shovel": itemUpdates[itemName] = (val & sramLoc.mask) !== 0 ? 1 : 0; break;
        case "flute": {
          const fluteState = val & 0x03;
          itemUpdates["flute"] = fluteState === 1 || fluteState === 3 ? 2 : fluteState === 2 ? 1 : 0;
          break;
        }
      }
    });

    // Dungeon items and info
    DUNGEON_ITEMS.forEach(({ dungeon, datas }) => {
      const newState: Partial<DungeonState> = {};
      Object.entries(datas).forEach(([key, item]) => {
        const val = getByte(item.wramAddress);
        if (val === null) return;
        const isSet = (val & item.mask) !== 0;

        switch (key as DungeonInfo) {
          case "smallKeys": newState.smallKeys = val; break;
          case "bigKey":    newState.bigKey = isSet; break;
          case "compass":   newState.compass = isSet; break;
          case "map":       newState.map = isSet; break;
          case "prize":     newState.prizeCollected = isSet; break;
          case "boss":      newState.bossDefeated = isSet; break;
        }
      });
      dungeonUpdates[dungeon] = newState;
    });

    // Detect Aga1
    const ctBossDefeated = getByte(0xf5f3c5);
    if (ctBossDefeated !== null && ctBossDefeated >= 0x03) {
      if (!dungeonUpdates['ct']) dungeonUpdates['ct'] = {};
      dungeonUpdates['ct'].bossDefeated = true;
    }

    // Only fix double small keys when enemy drops and pottery don't already add small keys, since those can cause >1 small keys in a dungeon legitimately
    // This fix doesn't account for GT. In GT, there is more than 1 small key and so we can't easily detect this issue
    // VT currently has an issue where torch or freestanding small keys are counted twice in memory
    // This only happens when it's found in it's vanilla dungeon, but it shouldn't go above this regardless, so we can just cap it at 1 small key for those dungeons when certain settings are enabled
    const fixDoubleSmallKeys = FORK === "VT" && settings.enemyDrop === "none" && !["keys",  "cavekeys" , "dungeon" , "lottery"].includes(settings.pottery) // && settings.doors === "none";

    if (fixDoubleSmallKeys) {
      for (const dungeon of ['dp', 'toh']) {
        if (dungeonUpdates[dungeon] && dungeonUpdates[dungeon].smallKeys && dungeonUpdates[dungeon].smallKeys > 1) {
          dungeonUpdates[dungeon].smallKeys = 1;
        }
      }
    }

    if (Object.keys(updates).length > 0) dispatch(updateMultipleLocations(updates));
    if (Object.keys(itemUpdates).length > 0) dispatch(updateMultipleItems(itemUpdates));
    Object.entries(dungeonUpdates).forEach(([dungeon, newState]) => {
      if (Object.keys(newState).length > 0) dispatch(updateDungeonState({ dungeon, newState }));
    });
  }, [autoTrackingData, romName, dispatch, settings]);

  return <>{children}</>;
};
