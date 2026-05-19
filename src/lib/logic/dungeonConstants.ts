/**
 * Shared constants for dungeon/key logic. Centralised so identical magic strings
 * don't drift between OverworldTraverser, DungeonTraverser and related code.
 */

/** Pottery shuffle modes that put small keys into the shuffle pool. */
export const POT_KEY_SHUFFLE_MODES = ["keys", "cavekeys", "lottery", "dungeon"] as const;

/** True when the pottery setting shuffles small keys out of their vanilla pots. */
export function isPotteryKeyShuffle(pottery: string): boolean {
  return (POT_KEY_SHUFFLE_MODES as readonly string[]).includes(pottery);
}

/** Map of door-name prefix → dungeon id, used to identify which dungeon a region belongs to. */
export const DOOR_PREFIX_TO_DUNGEON: Record<string, string> = {
  Sewers: "hc",
  Castle: "hc",
  Eastern: "ep",
  Desert: "dp",
  Hera: "toh",
  Tower: "ct",
  PoD: "pod",
  Swamp: "sp",
  Skull: "sw",
  Thieves: "tt",
  Ice: "ip",
  Mire: "mm",
  TR: "tr",
  GT: "gt",
};

/** Map of overworld portal-name prefix → dungeon id. */
export const PORTAL_TO_DUNGEON: Record<string, string> = {
  Sanctuary: "hc",
  "Hyrule Castle": "hc",
  Sewer: "hc",
  "Agahnims Tower": "ct",
  Eastern: "ep",
  Desert: "dp",
  Hera: "toh",
  "Palace of Darkness": "pod",
  Swamp: "sp",
  Skull: "sw",
  "Thieves Town": "tt",
  Ice: "ip",
  Mire: "mm",
  "Turtle Rock": "tr",
  "Ganons Tower": "gt",
};

/** Region types that are overworld (LightWorld/DarkWorld). */
export const OVERWORLD_REGION_TYPES = new Set(["LightWorld", "DarkWorld"]);

/**
 * Exits where superbunny entry (mirror-cancel on frame of transition) is
 * NOT possible. Names are the exit-key strings used in `logic_regions.ts`.
 */
export const SUPERBUNNY_BLOCKED_EXITS: Set<string> = new Set([]);

/**
 * Locations the player can interact with even while in bunny state. Most are
 * overworld pickups that don't require sword/items, plus shop slots and
 * static tablets.
 */
export const BUNNY_EXEMPT_LOCATIONS: Set<string> = new Set([
  "Link's Uncle",
  "Sahasrahla",
  "Sick Kid",
  "Lost Woods Hideout",
  "Lumberjack Tree",
  "Checkerboard Cave",
  "Potion Shop",
  "Spectacle Rock Cave",
  "Pyramid",
  "Old Man",
  "Hype Cave - Generous Guy",
  "Peg Cave",
  "Bumper Cave Ledge",
  "Dark Blacksmith Ruins",
  "Spectacle Rock",
  "Bombos Tablet",
  "Ether Tablet",
  "Purple Chest",
  "Blacksmith",
  "Master Sword Pedestal",
  "Bottle Merchant",
  "Sunken Treasure", // TODO - Only if dam can be pulled
  "Desert Ledge",
  "Stumpy",
  "Murahdahla",
  "Kakariko Shop - Left",
  "Kakariko Shop - Middle",
  "Kakariko Shop - Right",
  "Lake Hylia Shop - Left",
  "Lake Hylia Shop - Middle",
  "Lake Hylia Shop - Right",
  "Potion Shop - Left",
  "Potion Shop - Middle",
  "Potion Shop - Right",
  "Capacity Upgrade - Left",
  "Capacity Upgrade - Right",
  "Village of Outcasts Shop - Left",
  "Village of Outcasts Shop - Middle",
  "Village of Outcasts Shop - Right",
  "Dark Lake Hylia Shop - Left",
  "Dark Lake Hylia Shop - Middle",
  "Dark Lake Hylia Shop - Right",
  "Dark Death Mountain Shop - Left",
  "Dark Death Mountain Shop - Middle",
  "Dark Death Mountain Shop - Right",
  "Dark Lumberjack Shop - Left",
  "Dark Lumberjack Shop - Middle",
  "Dark Lumberjack Shop - Right",
  "Dark Potion Shop - Left",
  "Dark Potion Shop - Middle",
  "Dark Potion Shop - Right",
  "Red Shield Shop - Left",
  "Red Shield Shop - Middle",
  "Red Shield Shop - Right",
  "Old Man Sword Cave Item 1",
  "Take - Any  # 1 Item 1",
  "Take - Any  # 1 Item 2",
  "Take - Any  # 2 Item 1",
  "Take - Any  # 2 Item 2",
  "Take - Any  # 3 Item 1",
  "Take - Any  # 3 Item 2",
  "Take - Any  # 4 Item 1",
  "Take - Any  # 4 Item 2",
]);
