import type { ItemsState } from "@/store/itemsSlice";
import type { SettingsState } from "@/store/settingsSlice";
import type { DungeonState, DungeonsState } from "@/store/dungeonsSlice";
import type { EntranceData, EntrancesState } from "@/store/entrancesSlice";
import { DungeonsData } from "@/data/dungeonData";
import ItemsData from "@/data/itemData";
import { entranceData } from "@/data/entranceData";
import { OverworldTraverser } from "../overworldTraverser";
import { getLogicSet, type LogicMode } from "../logicMapper";

/**
 * Helper to create a default items state with all items at 0
 */
export function createEmptyItems(): ItemsState {
  const items: ItemsState = {};
  for (const itemName of Object.keys(ItemsData)) {
    if (itemName.startsWith("bottle")) continue;
    items[itemName] = { amount: 0 };
  }
  // Add bottles
  items["bottle1"] = { amount: 0 };
  items["bottle2"] = { amount: 0 };
  items["bottle3"] = { amount: 0 };
  items["bottle4"] = { amount: 0 };
  return items;
}

/**
 * Helper to create items state with specific items set
 * Items can be specified by name with optional count (default 1 for most, 2 for bow)
 */
export function createItems(itemsToSet: Record<string, number>): ItemsState {
  const items = createEmptyItems();
  for (const [itemName, amount] of Object.entries(itemsToSet)) {
    if (items[itemName]) {
      items[itemName].amount = amount;
    } else {
      items[itemName] = { amount };
    }
  }
  return items;
}

/**
 * Preset for "all items" - useful for testing locations
 */
export function createAllItems(): ItemsState {
  const items = createEmptyItems();
  // Set all items to max or reasonable amounts
  items["bow"] = { amount: 4 }; // Silver arrows
  items["boomerang"] = { amount: 3 };
  items["hookshot"] = { amount: 1 };
  items["bomb"] = { amount: 1 };
  items["mushroom"] = { amount: 2 };
  items["powder"] = { amount: 1 };
  items["firerod"] = { amount: 1 };
  items["icerod"] = { amount: 1 };
  items["bombos"] = { amount: 1 };
  items["ether"] = { amount: 1 };
  items["quake"] = { amount: 1 };
  items["lantern"] = { amount: 1 };
  items["hammer"] = { amount: 1 };
  items["shovel"] = { amount: 1 };
  items["flute"] = { amount: 2 };
  items["net"] = { amount: 1 };
  items["book"] = { amount: 1 };
  items["bottle1"] = { amount: 1 };
  items["bottle2"] = { amount: 1 };
  items["bottle3"] = { amount: 1 };
  items["bottle4"] = { amount: 1 };
  items["somaria"] = { amount: 1 };
  items["byrna"] = { amount: 1 };
  items["cape"] = { amount: 1 };
  items["mirror"] = { amount: 1 };
  items["boots"] = { amount: 1 };
  items["glove"] = { amount: 2 }; // Titan's Mitt
  items["flippers"] = { amount: 1 };
  items["magic"] = { amount: 1 };
  items["moonpearl"] = { amount: 1 };
  items["shield"] = { amount: 3 }; // Mirror Shield
  items["sword"] = { amount: 4 }; // Gold Sword
  items["mail"] = { amount: 2 };
  return items;
}

/**
 * Helper to create default settings
 */
export function createDefaultSettings(): SettingsState {
  return {
    logicMode: "noglitches",
    worldState: "open",
    wildSmallKeys: "inDungeon",
    wildBigKeys: false,
    wildMaps: false,
    wildCompasses: false,
    keyDrop: false,
    pottery: "none",
    entranceMode: "none",
    bossShuffle: "none",
    enemyShuffle: "none",
    goal: "fast_ganon",
    swords: "randomized",
    itemPool: "normal",
    activatedFlute: false,
    bonkShuffle: false,
    autotracking: false,
  };
}

/**
 * Helper to create settings with specific overrides
 */
export function createSettings(overrides: Partial<SettingsState>): SettingsState {
  return { ...createDefaultSettings(), ...overrides };
}

/**
 * Helper to create a default dungeon state
 */
function createDefaultDungeonState(dungeonId: string): DungeonState {
  const dungeonData = DungeonsData[dungeonId];
  return {
    collectedCount: 0,
    bossDefeated: false,
    boss: dungeonData?.boss || "unknown",
    prize: "unknown",
    prizeCollected: false,
    smallKeys: 0,
    bigKey: false,
    map: false,
    compass: false,
  };
}

/**
 * Helper to create default dungeons state
 */
export function createEmptyDungeons(): DungeonsState {
  const dungeons: DungeonsState = {};
  for (const dungeonId of Object.keys(DungeonsData)) {
    dungeons[dungeonId] = createDefaultDungeonState(dungeonId);
  }
  return dungeons;
}

/**
 * Helper to create dungeons with specific configurations
 */
export function createDungeons(config: Record<string, Partial<DungeonState>>): DungeonsState {
  const dungeons = createEmptyDungeons();
  for (const [dungeonId, overrides] of Object.entries(config)) {
    if (dungeons[dungeonId]) {
      dungeons[dungeonId] = { ...dungeons[dungeonId], ...overrides };
    }
  }
  return dungeons;
}

/**
 * Helper to create default entrances state
 */
export function createEmptyEntrances(): EntrancesState {
  const entrances: EntrancesState = {};
  for (const entranceName of Object.keys(entranceData)) {
    entrances[entranceName] = {
      checked: false,
      connector: false,
      connectorGroup: null,
      to: null,
      oneway: false,
    };
  }
  // Add medallion-specific entrances
  entrances["Misery Mire"] = { ...entrances["Misery Mire"], medallion: "unknown" };
  entrances["Turtle Rock"] = { ...entrances["Turtle Rock"], medallion: "unknown" };
  return entrances;
}

/**
 * Helper to create entrances with specific configurations
 */
export function createEntrances(config: Record<string, Partial<EntranceData>>): EntrancesState {
  const entrances = createEmptyEntrances();
  for (const [entranceName, overrides] of Object.entries(config)) {
    if (entrances[entranceName]) {
      entrances[entranceName] = { ...entrances[entranceName], ...overrides };
    }
  }
  return entrances;
}

/**
 * Game state builder for fluent test setup
 */

const vanillaPrizes = {
  "ep": "greenPendant",
  "dp": "pendant",
  "toh": "pendant",
  "pod": "crystal",
  "sp": "crystal",
  "sw": "crystal",
  "tt": "crystal",
  "ip": "redCrystal",
  "mm": "redCrystal",
  "tr": "crystal",
}

export class GameStateBuilder {
  private items: ItemsState;
  private settings: SettingsState;
  private dungeons: DungeonsState;
  private entrances: EntrancesState;

  constructor() {
    this.items = createEmptyItems();
    this.settings = createDefaultSettings();
    this.dungeons = createEmptyDungeons();
    this.entrances = createEmptyEntrances();
  }

  withAllItems(): this {
    this.items = createAllItems();
    return this;
  }

  withAllPrizes(): this {
    for (const [dungeonId, prize] of Object.entries(vanillaPrizes)) {
      if (this.dungeons[dungeonId]) {
        this.dungeons[dungeonId].prize = prize as DungeonState["prize"];
        this.dungeons[dungeonId].prizeCollected = true;
      }
    }
    return this;
  }

  withItems(itemsToSet: Record<string, number>): this {
    for (const [itemName, amount] of Object.entries(itemsToSet)) {
      if (this.items[itemName]) {
        this.items[itemName].amount = amount;
      } else {
        this.items[itemName] = { amount };
      }
    }
    return this;
  }

  withoutItems(itemsToRemove: string[]): this {
    for (const itemName of itemsToRemove) {
      if (this.items[itemName]) {
        this.items[itemName].amount = 0;
      }
    }
    return this;
  }

  withSettings(overrides: Partial<SettingsState>): this {
    this.settings = { ...this.settings, ...overrides };
    return this;
  }

  withDungeon(dungeonId: string, overrides: Partial<DungeonState>): this {
    if (this.dungeons[dungeonId]) {
      this.dungeons[dungeonId] = { ...this.dungeons[dungeonId], ...overrides };
    }
    return this;
  }

  withEntrance(entranceName: string, overrides: Partial<EntranceData>): this {
    if (this.entrances[entranceName]) {
      this.entrances[entranceName] = { ...this.entrances[entranceName], ...overrides };
    }
    return this;
  }

  build() {
    return {
      items: this.items,
      settings: this.settings,
      dungeons: this.dungeons,
      entrances: this.entrances,
    };
  }
}

/**
 * Convenience function to create a new game state builder
 */
export function gameState(): GameStateBuilder {
  return new GameStateBuilder();
}

/**
 * Gets detailed key information for a dungeon.
 * Useful for debugging key logic issues.
 */
export function getDungeonKeyInfo(
  dungeonId: string,
  state: ReturnType<GameStateBuilder["build"]>,
  logicMode: LogicMode = "noglitches"
): {
  inventoryKeys: number;
  potentialKeys: string[];
  keyDoorsFound: string[];
} {
  const logicSet = getLogicSet(logicMode);
  const engine = new OverworldTraverser(state, logicSet);
  
  // Run calculation to populate internal state
  engine.calculateAll();
  
  const inventoryKeys = state.dungeons[dungeonId]?.smallKeys || 0;
  const potentialKeys: string[] = [];
  const keyDoorsFound: string[] = [];
  
  // Scan regions for key locations
  const regions = logicSet.regions as Record<string, { locations?: Record<string, unknown>; exits?: Record<string, { to: string }> }>;
  
  const dungeonPrefixes: Record<string, string[]> = {
    "hc": ["Sewers", "Castle"],
    "ep": ["Eastern"],
    "dp": ["Desert"],
    "toh": ["Hera"],
    "ct": ["Tower"],
    "pod": ["PoD"],
    "sp": ["Swamp"],
    "sw": ["Skull"],
    "tt": ["Thieves"],
    "ip": ["Ice"],
    "mm": ["Mire"],
    "tr": ["TR"],
    "gt": ["GT"],
  };
  
  const prefixes = dungeonPrefixes[dungeonId] || [];
  
  for (const [regionName, region] of Object.entries(regions)) {
    const belongsToDungeon = prefixes.some(p => regionName.startsWith(p));
    if (!belongsToDungeon) continue;
    
    // Check for key locations
    if (region.locations) {
      for (const locName of Object.keys(region.locations)) {
        if (locName.includes("Pot Key") || locName.includes("Key Pot") || locName.includes("Key Drop")) {
          potentialKeys.push(`${locName} (in ${regionName})`);
        }
      }
    }
    
    // Check for key doors (exits that require small keys)
    if (region.exits) {
      for (const [exitName, exit] of Object.entries(region.exits)) {
        // Simple check - key doors typically have "Key" or specific naming
        if (exitName.includes("Key") || exitName.includes("Locked")) {
          keyDoorsFound.push(`${regionName} → ${exit.to} (${exitName})`);
        }
      }
    }
  }
  
  console.log(`=== Key Info for ${dungeonId.toUpperCase()} ===`);
  console.log(`Inventory Keys: ${inventoryKeys}`);
  console.log(`Potential Key Locations (${potentialKeys.length}):`);
  for (const key of potentialKeys) {
    console.log(`  - ${key}`);
  }
  console.log(`Key Doors Found (${keyDoorsFound.length}):`);
  for (const door of keyDoorsFound) {
    console.log(`  - ${door}`);
  }
  
  return { inventoryKeys, potentialKeys, keyDoorsFound };
}