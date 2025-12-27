import React, { useEffect, useState, useRef } from "react";
import { DUNGEON_ITEMS, getRangeFromAddress, MEMORY_RANGES, SPECIAL_HANDLE_INVENTORY_ITEMS, type DungeonInfo, type SramData } from "@/data/sramLocations";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { setConnectedgRPC, setDeviceList, setRomName } from "@/store/autotrackerSlice";
import { DeviceMemoryClient, DevicesClient } from "@/sni/sni.client";
import { AddressSpace, MemoryMapping } from "@/sni/sni";
import { locationsData } from "@/data/locationsData";
import { ALL_SRAM_LOCATIONS_MAP, INVENTORY_LOCATIONS } from "@/data/sramLocations";
import { updateMultipleLocations, type CheckStatus, type Status } from "@/store/checksSlice";
import { updateMultipleItems } from "@/store/itemsSlice";
import { updateDungeonState, type DungeonState } from "@/store/dungeonsSlice";

interface AutotrackerProviderProps {
  children: React.ReactNode;
}

const getTransport = ({ host, port }: { host: string; port: number }) => {
  return new GrpcWebFetchTransport({
    baseUrl: `http://${host}:${port}`,
  });
};

export const AutotrackerProvider: React.FC<AutotrackerProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const autotrackerState = useSelector((state: RootState) => state.autotracker);
  const { isConnected, connectionType, selectedDevice, romName, host, port } = autotrackerState;
  const [autoTrackingData, setAutoTrackingData] = useState<Record<string, Uint8Array>>({});

  const checks = useSelector((state: RootState) => state.checks.locationsChecks);
  const checksRef = useRef(checks);

  // Keep the ref updated with the latest checks state
  useEffect(() => {
    checksRef.current = checks;
  }, [checks]);

  const items = useSelector((state: RootState) => state.items.items);
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Connecting and querying data
  useEffect(() => {
    if (connectionType !== "sni") {
      return;
    }

    if (!host || !port) {
      console.error("Host or port not set for autotracker connection");
      return;
    }

    async function fetchDevices(transport: GrpcWebFetchTransport) {
      const deviceClient = new DevicesClient(transport);
      const devicesResponse = await deviceClient.listDevices({ kinds: [] });
      return devicesResponse.response.devices.map((device) => device.uri);
    }

    async function fetchMemoryRange(transport: GrpcWebFetchTransport, requestAddress: number, size: number) {
      if (!selectedDevice) {
        throw new Error("No device selected");
      }
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
    }

    // Polling loop
    const poll = async () => {
      const transport = getTransport({ host, port });
      if (!isConnected) {
        fetchDevices(transport)
          .then((devices) => {
            if (devices.length > 0) {
              console.log("Fetched devices:", devices);
              dispatch(setDeviceList(devices));
              dispatch(setConnectedgRPC({ selectedDevice: devices[0], isConnected: true }));
            }
          })
          .catch((error) => {
            console.error("Error fetching devices:", error);
          });
      } else {
        const newData: Record<string, Uint8Array> = {};
        for (const [index, range] of MEMORY_RANGES.entries()) {
          try {
            const data = await fetchMemoryRange(transport, range.start, range.size);
            if (data) {
              if (index === 0) {
                // Checking ROM name range
                const fetchedRomName = new TextDecoder().decode(data).replace(/\0/g, "");
                if (romName !== fetchedRomName) {
                  console.log("ROM name changed:", fetchedRomName);
                  dispatch(setRomName(fetchedRomName));
                }
              } else if (index === 1) {
                // Checking first range for game mode
                const gameMode = data[0];
                if (![0x07, 0x09, 0x0b].includes(gameMode)) {
                  break; // Invalid game mode, skip processing
                }
              } else {
                newData[range.name] = data;
              }
            }
          } catch (error) {
            console.error(`Error fetching memory range ${range.start.toString(16)}-${range.end.toString(16)}:`, error);
          }
        }
        setAutoTrackingData(newData);
      }
    };

    const interval = setInterval(poll, 500);
    poll();

    return () => clearInterval(interval);
  }, [isConnected, connectionType, selectedDevice, romName, host, port, dispatch]);

  // Actually process the data and mark things as checked etc. This will likely be very long
  useEffect(() => {
    if (Object.keys(autoTrackingData).length === 0) {
      return;
    }

    const updates: Record<string, CheckStatus> = {};
    const itemUpdates: Record<string, number> = {};
    const dungeonUpdates: Record<string, Partial<DungeonState>> = {};

    // Item locations
    Object.entries(locationsData).forEach(([location, locData]) => {
      // TODO: Check that settings enable this location to be auto-tracked
      const locationState = checksRef.current[location];
      const locationChecked = locationState?.status ?? "none";

      if (locationState.manuallyChecked) {
        return; // Skip manually checked locations
      }

      if (locationChecked === "all") {
        return; // Already cleared
      }

      // Checks for this location
      const locationMax = locData.itemLocations.length;
      const checkedLocations = locData.itemLocations.reduce((count, itemLoc) => {
        const sramLoc = ALL_SRAM_LOCATIONS_MAP[itemLoc];

        if (!sramLoc) {
          return count;
        }

        const memRange = getRangeFromAddress(sramLoc.wramAddress);

        if (!memRange) {
          console.warn(`No memory range found for location ${itemLoc} at ${sramLoc.wramAddress.toString(16)}`);
          return count;
        }

        const data = autoTrackingData[memRange.name];

        if (!data) {
          return count;
        }

        const offset = sramLoc.wramAddress - memRange.start;
        const byte1 = data[offset] || 0;
        const byte2 = data[offset + 1] || 0;
        const value = byte1 + (byte2 << 8);

        const isChecked = (value & sramLoc.mask) !== 0;

        if (isChecked) {
          return count + 1;
        }

        return count;
      }, 0);

      let newStatus: Status = "none";
      if (checkedLocations === locationMax) {
        newStatus = "all";
      } else if (checkedLocations > 0) {
        newStatus = "some";
      }

      if (newStatus !== locationChecked) {
        updates[location] = { ...locationState, status: newStatus, manuallyChecked: false };
      }
    });

    // Inventory items - covers most things
    INVENTORY_LOCATIONS.forEach((sramLoc) => {
      const itemName = sramLoc.name.replace("Inventory - ", "");
      const currentAmount = itemsRef.current[itemName]?.amount ?? 0;

      const memRange = getRangeFromAddress(sramLoc.wramAddress);
      if (!memRange) return;

      const data = autoTrackingData[memRange.name];
      if (!data) return;

      const offset = sramLoc.wramAddress - memRange.start;
      const value = data[offset] || 0;

      let newValue = 0;
      if (sramLoc.mask === 0) {
        newValue = value;
      } else {
        newValue = (value & sramLoc.mask) !== 0 ? 1 : 0;
      }

      if (itemName.startsWith("bottle")) {
        newValue = Math.max(0, newValue - 1);
      }

      if (newValue !== currentAmount) {
        itemUpdates[itemName] = newValue;
      }
    });

    // Special handling for some items, either different in PH or complex checks needed
    SPECIAL_HANDLE_INVENTORY_ITEMS.forEach((sramLoc) => {
      const itemName = sramLoc.name.replace("Inventory - ", "");
      
      // TODO: Re-add handling for practice hack

      const memRange = getRangeFromAddress(sramLoc.wramAddress);
      if (!memRange) return;

      const data = autoTrackingData[memRange.name];
      if (!data) return;

      const offset = sramLoc.wramAddress - memRange.start;
      const value = data[offset] || 0;

      switch (itemName) {
        case "bow": {
          const bits = value & 0xc0;
          if (bits === 0x00) { break; }
          // TODO, add non prog bows flag
          // Index up by one because empty bow no quiver
          itemUpdates["bow"] = bits === 0x40 ? 2 : bits === 0x80 ? 3 : 4;
          break;
        }
        case "boomerang": {
          const bits = value & 0xc0;
          if (bits === 0x00) { break; }
          itemUpdates["boomerang"] = bits === 0x80 ? 1 : bits === 0x40 ? 2 : 3;
          break;
        }
        case "bombs":
          itemUpdates["bomb"] = value > 0 ? 1 : 0;
          break;
        case "mushroom": {
          const bits = value & 0x28;
          itemUpdates["mushroom"] = bits & 0x28 ? 1 : bits & 0x08 ? 2 : 0;
          break;
        }
        case "powder":
        case "shovel":
          itemUpdates[itemName] = (value & sramLoc.mask) !== 0 ? 1 : 0;
          break;
        case "flute": {
          const fluteState = value & 0x03;
          itemUpdates["flute"] = fluteState == 0x01 || fluteState == 0x03 ? 2 : fluteState === 0x02 ? 1 : 0;
          break;
        }
        default:
      }
    });

    // Dungeon items and info
    DUNGEON_ITEMS.forEach((dungeonItem) => {
      const dungeon = dungeonItem.dungeon;
      const newDungeonState: Partial<DungeonState> = {};
      Object.keys(dungeonItem.datas).forEach((key) => {
        const itemData = dungeonItem.datas[key as DungeonInfo];
        const memRange = getRangeFromAddress(itemData.wramAddress);
        if (!memRange) return;
        const data = autoTrackingData[memRange.name]
        const offset = itemData.wramAddress - memRange.start;
        const value = data[offset] || 0;
        if (key === "smallKeys") {
          newDungeonState.smallKeys = value;
        } else if (key === "bigKey") {
          newDungeonState.bigKey = (value & itemData.mask) !== 0;
        } else if (key === "compass") {
          newDungeonState.compass = (value & itemData.mask) !== 0;
        } else if (key === "map") {
          newDungeonState.map = (value & itemData.mask) !== 0;
        }
      })
      dungeonUpdates[dungeon] = newDungeonState;
    });


    if (Object.keys(updates).length > 0) {
      dispatch(updateMultipleLocations(updates));
    }

    if (Object.keys(itemUpdates).length > 0) {
      dispatch(updateMultipleItems(itemUpdates));
    }

    if (Object.keys(dungeonUpdates).length > 0) {
      Object.entries(dungeonUpdates).forEach(([dungeon, newState]) => {
        dispatch(updateDungeonState({ dungeon, newState }));
      });
    }
  }, [autoTrackingData, dispatch]);

  return <>{children}</>;
};
