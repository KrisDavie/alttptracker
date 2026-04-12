import type { SettingsState } from "@/store/settingsSlice";
import type { DungeonState } from "@/store/dungeonsSlice";
import { locationsData } from "./locationsData";

export interface LauncherPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<SettingsState>;
  /** Starting items to grant (item key → amount) */
  startingItems?: Record<string, number>;
  /** Locations to mark as checked at launch, keyed by location name */
  checkedLocations?: Record<string, { scoutedItems?: string[] }>;
  /** Entrance location names to mark as checked (items collected) */
  checkedEntrances?: string[];
  /** Entrance → destination links to pre-place (e.g. {"Eastern Palace": "Hookshot Cave"}) */
  entrancePlacements?: Record<string, string>;
  /** Partial dungeon state keyed by dungeon short code (e.g. "dp", "ep") */
  dungeonState?: Record<string, Pick<Partial<DungeonState>, "smallKeys" | "bigKey" | "prize">>;
}

export interface PresetCategory {
  id: string;
  title: string;
  /** Optional Discord invite URL for this community/category */
  discordUrl?: string;
  /** Preset IDs to show as buttons in this category */
  presetIds: string[];
}

// ---------------------------------------------------------------------------
// Master preset list — translated from the legacy tracker's index.js
// ---------------------------------------------------------------------------

export const allPresets: LauncherPreset[] = [
  // ── Core / Simple ───────────────────────────────────────────────────────
  {
    id: "open",
    name: "Open",
    description: "Open 7/7",
    settings: {},
  },
  {
    id: "open76",
    name: "Open 7/6",
    description: "Open mode, fast Ganon with 6 crystals ganon, 7 crystals GT",
    settings: { goal: "fast_ganon", ganonVulnerable: "6" },
  },
  {
    id: "openboots",
    name: "Open Boots",
    description: "Open 7/7, boots start",
    settings: {},
    startingItems: { boots: 1 },
  },
  {
    id: "standard",
    name: "Standard",
    description: "Standard 7/7",
    settings: { worldState: "standard" },
  },
  {
    id: "standardboots",
    name: "Standard Boots",
    description: "Standard 7/7, boots start",
    settings: { worldState: "standard" },
    startingItems: { boots: 1 },
  },
  {
    id: "casualboots",
    name: "Casual Boots",
    description: "Standard 7/7, assured sword, boots start",
    settings: { worldState: "standard", swords: "assured" },
    startingItems: { boots: 1 },
  },

  // ── All Dungeons ────────────────────────────────────────────────────────
  {
    id: "ad",
    name: "All Dungeons",
    description: "Open, All Dungeons ",
    settings: { goal: "dungeons" },
  },
  {
    id: "adenemizer",
    name: "AD Enemizer",
    description: "All Dungeons with boss and enemy shuffle",
    settings: { goal: "dungeons", bossShuffle: "random", enemyShuffle: "random" },
  },
  {
    id: "adkdb",
    name: "ADKDB",
    description: "All Dungeons, keysanity, key drop, start with boots",
    settings: { goal: "dungeons", enemyDrop: "keys", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "adkdf",
    name: "ADKDF",
    description: "All Dungeons, keysanity, key drop, start with boots",
    settings: { goal: "dungeons", entranceMode: "crossed", shuffleLinks: true, enemyDrop: "keys", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, pseudoboots: true },
    entrancePlacements: {
      "Sick Kids House": "Links House",
      "Chicken House": "Hyrule Castle Entrance (South)",
      "Hyrule Castle Entrance (East)": "Hyrule Castle Entrance (West)",
      "Hyrule Castle Entrance (West)": "Hyrule Castle Entrance (East)",
      "Sanctuary": "Sanctuary",
      "Blinds Hideout": "Eastern Palace",
      "Elder House (East)": "Desert Palace Entrance (South)",
      "Mire Shed": "Desert Palace Entrance (West)",
      "Mire Fairy": "Desert Palace Entrance (East)",
      "Desert Palace Entrance (North)": "Desert Palace Entrance (North)",
      "Elder House (West)": "Tower of Hera",
      "Ganons Tower": "Agahnims Tower",
      "Snitch Lady (East)": "Palace of Darkness",
      "Snitch Lady (West)": "Swamp Palace",
      "Mire Hint": "Dam",
      "Kakariko Well Cave": "Skull Woods First Section Door",
      "Skull Woods First Section Door": "Skull Woods Final Section Door",
      "Skull Woods Second Section Door (East)": "Skull Woods Second Section Door (East)",
      "Skull Woods Second Section Door (West)": "Skull Woods Second Section Door (West)",
      "Bush Covered House": "Thieves Town",
      "Tavern North": "Ice Palace",
      "Tavern (Front)": "Misery Mire",
      "Light World Bomb Hut": "Turtle Rock",
      "Dark Death Mountain Ledge (West)": "Dark Death Mountain Ledge (West)",
      "Dark Death Mountain Ledge (East)": "Dark Death Mountain Ledge (East)",
      "Desert Palace Entrance (East)": "Turtle Rock Isolated Ledge Entrance",
      "Kakariko Shop": "Ganons Tower",
      "Blacksmiths Hut": "Sahasrahlas Hut",
      "Bat Cave Drop": "Kakariko Well Drop",
      "Bat Cave Cave": "Kakariko Well Cave",
      "Desert Palace Entrance (West)": "Mini Moldorm Cave",
      "Skull Woods Final Section Door": "Blinds Hideout",
      "Mimic Cave": "Hype Cave",
      "Misery Mire": "Paradox Cave (Top)",
      "Agahnims Tower": "Paradox Cave (Middle)",
      "Pyramid Hole": "Pyramid Hole",
      "Two Brothers House (East)": "Potion Shop",
      "Kakariko Gamble Game": "Capacity Fairy",
      "Library": "Generic Shop"
    }
  },
  {
    id: "adkeydrop",
    name: "AD Keydrop",
    description: "All Dungeons with keysanity and key drop pots",
    settings: { goal: "dungeons", enemyDrop: "keys", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "adkeydropshop",
    name: "AD Keydrop Shop",
    description: "All Dungeons with keysanity, key drop pots, and shopsanity",
    settings: { goal: "dungeons", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, shopsanity: true },
  },
  {
    id: "adkeysanity",
    name: "AD Keysanity",
    description: "All Dungeons with full keysanity",
    settings: { goal: "dungeons", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "adtileswap",
    name: "AD Tile Swap",
    description: "All Dungeons with overworld tile swap",
    settings: { goal: "dungeons", owMixed: true },
  },

  // ── Keysanity Variants ──────────────────────────────────────────────────
  {
    id: "openkeysanity",
    name: "Open Keysanity",
    description: "Open mode, defeat Ganon, all dungeon items wild",
    settings: { wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "open47keys",
    name: "4/7 Open Keys",
    description: "Open keysanity, 4 crystals for tower, 7 for Ganon",
    settings: { gtOpen: "4", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "mcshuffle",
    name: "MC Shuffle",
    description: "Maps and compasses shuffled, keys in dungeon",
    settings: { wildMaps: true, wildCompasses: true },
  },
  {
    id: "mcboss",
    name: "MCBoss",
    description: "Maps and compasses shuffled with boss shuffle",
    settings: { wildMaps: true, wildCompasses: true, bossShuffle: "random" },
  },

  // ── Crosskeys / Entrance Shuffle ────────────────────────────────────────
  {
    id: "crosskeys",
    name: "Crosskeys",
    description: "Crossed ER with full keysanity, fast Ganon",
    settings: { goal: "fast_ganon", entranceMode: "crossed", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "crosskeys2024",
    name: "Crosskeys 2024/5/6",
    description: "Crosskeys with pseudoboots",
    settings: { goal: "fast_ganon", entranceMode: "crossed", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, pseudoboots: true },
  },
  {
    id: "crosshunt",
    name: "Crosshunt",
    description: "Crosskeys, ganon hunt with 0 tower crystals",
    settings: { entranceMode: "crossed", gtOpen: "0", ganonVulnerable: "other", goal: "ganonhunt", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "crosskeys_flute_ms_pb",
    name: "Crosskeys Flute MS PB",
    description: "Crosskeys with activated flute, mirror scroll, pseudoboots",
    settings: { goal: "fast_ganon", entranceMode: "crossed", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, activatedFlute: true, mirrorScroll: true, pseudoboots: true },
  },
  {
    id: "crosskeys_kd_flute_inv_pb_zw",
    name: "Crosskeys KD Flute Inv PB ZW",
    description: "Inverted crosskeys with key drop, activated flute, pseudoboots",
    settings: { worldState: "inverted", goal: "fast_ganon", entranceMode: "crossed", pottery: "keys", enemyDrop: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, activatedFlute: true, pseudoboots: true },
  },
  {
    id: "crosskeys_kd_ms_pb_zw",
    name: "Crosskeys KD MS PB ZW",
    description: "Crosskeys with key drop, mirror scroll, pseudoboots",
    settings: { goal: "fast_ganon", entranceMode: "crossed", pottery: "keys", enemyDrop: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, mirrorScroll: true, pseudoboots: true },
  },
  {
    id: "crosskeys_ms_pb_zw",
    name: "Crosskeys MS PB ZW",
    description: "Crosskeys with mirror scroll, pseudoboots",
    settings: { goal: "fast_ganon", entranceMode: "crossed", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, mirrorScroll: true, pseudoboots: true },
  },
  {
    id: "crosskeys_kd_ad",
    name: "Crosskeys KD AD",
    description: "Crosskeys with key drop, all dungeons goal",
    settings: { goal: "dungeons", entranceMode: "crossed", pottery: "keys", enemyDrop: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "supercrosskeys",
    name: "Supercrosskeys",
    description: "Crosskeys key drop, pseudoboots, bonk shuffle, fast Ganon 4 crystals",
    settings: { goal: "fast_ganon", entranceMode: "crossed", ganonVulnerable: "4", pottery: "keys", enemyDrop: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, bonkShuffle: true },
  },
  {
    id: "invertedcrosskeys",
    name: "Inverted Crosskeys",
    description: "Inverted Crosskeys",
    settings: { worldState: "inverted", goal: "fast_ganon", entranceMode: "crossed", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },

  // ── Crisscross / Doors ──────────────────────────────────────────────────
  {
    id: "crisscross",
    name: "Crisscross",
    description: "Crosskeys, crossed doors, pseudoboots, shopsanity",
    settings: { goal: "fast_ganon", entranceMode: "crossed", doors: "crossed", pottery: "keys", enemyDrop: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, pseudoboots: true, shopsanity: true },
  },
  {
    id: "beginnerdoors",
    name: "Beginner Doors",
    description: "Standard mode, basic doors, assured sword, pseudoboots",
    settings: { worldState: "standard", swords: "assured", doors: "basic", pseudoboots: true },
  },
  {
    id: "intermediatedoors",
    name: "Intermediate Doors",
    description: "Standard mode, partitioned doors, assured sword, pseudoboots, keysanity",
    settings: { worldState: "standard", swords: "assured", doors: "partitioned", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, pseudoboots: true },
  },

  // ── Inverted ────────────────────────────────────────────────────────────
  {
    id: "inverted",
    name: "Inverted",
    description: "Inverted mode, defeat Ganon",
    settings: { worldState: "inverted" },
  },
  {
    id: "inverted_startflute",
    name: "Inverted (Start Flute)",
    description: "Inverted mode with activated starting flute",
    settings: { worldState: "inverted", activatedFlute: true },
    startingItems: { flute: 1 },
  },
  {
    id: "invertedkeysanity",
    name: "Inverted Keysanity",
    description: "Inverted mode with full keysanity",
    settings: { worldState: "inverted", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "invertedadkeysanity",
    name: "Inverted AD Keysanity",
    description: "Inverted mode, all dungeons, full keysanity",
    settings: { worldState: "inverted", goal: "dungeons", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "influkeys",
    name: "Influkeys",
    description: "Inverted, keysanity, activated flute, start with flute",
    settings: { worldState: "inverted", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, activatedFlute: true },
    startingItems: { flute: 1 },
  },
  {
    id: "invrosia",
    name: "Invrosia",
    description: "Inverted mode with assured sword, wild big keys and guaranteed non-dungeon item on the boss",
    settings: { worldState: "inverted", swords: "assured", wildBigKeys: true, ambrosia: true },
  },

  // ── Swordless / Combat Variants ─────────────────────────────────────────
  {
    id: "championsswordless",
    name: "Champions Swordless",
    description: "Swordless with MC shuffle",
    settings: { swords: "swordless", wildMaps: true, wildCompasses: true },
  },
  {
    id: "championshunt",
    name: "Champions Hunt",
    description: "Assured sword, wild big keys, 5 tower crystals, Ganon hunt, start with boots",
    settings: { swords: "assured", gtOpen: "5", goal: "ganonhunt", ganonVulnerable: "other", wildBigKeys: true },
    startingItems: { boots: 1 },
  },

  // ── Enemizer ────────────────────────────────────────────────────────────
  {
    id: "enemizer",
    name: "Enemizer",
    description: "Open mode with boss and enemy shuffle",
    settings: { bossShuffle: "random", enemyShuffle: "random" },
  },
  {
    id: "enemizerboots",
    name: "Enemizer Boots",
    description: "Enemizer with starting boots",
    settings: { bossShuffle: "random", enemyShuffle: "random" },
    startingItems: { boots: 1 },
  },
  {
    id: "enemizerkeydrop",
    name: "Enemizer Keydrop",
    description: "Enemizer with key drop pots and full keysanity",
    settings: { bossShuffle: "random", enemyShuffle: "random", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },

  // ── Goal Variants ───────────────────────────────────────────────────────
  {
    id: "bosshunt",
    name: "Bosshunt",
    description: "Ganon hunt with 0 tower crystals",
    settings: {goal: "ganonhunt", gtOpen: "0", ganonVulnerable: "other" },
  },
  {
    id: "ganonhunt",
    name: "Ganonhunt",
    description: "Ganon hunt, assured sword, wild big keys, 5/2, start with boots",
    settings: { swords: "assured", wildBigKeys: true,  gtOpen: "5", ganonVulnerable: "other", goal: "ganonhunt" },
    startingItems: { boots: 1 },
  },
  {
    id: "goldrush",
    name: "Gold Rush",
    description: "Triforce hunt with full keysanity, start with boots",
    settings: { goal: "triforce_hunt", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "reducedcrystals",
    name: "Reduced Crystals",
    description: "Open mode, fast Ganon with 6 crystals",
    settings: { goal: "fast_ganon", gtOpen: "6", ganonVulnerable: "6" },
  },
  {
    id: "doubledown",
    name: "Double Down",
    description: "All Dungeons, keysanity, start with boots",
    settings: { goal: "dungeons", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "duality",
    name: "Duality",
    description: "Fast Ganon 1/5, full keysanity",
    settings: { goal: "fast_ganon", gtOpen: "1", ganonVulnerable: "5", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },

  // ── Special Modes ───────────────────────────────────────────────────────
  {
    id: "ambrosia",
    name: "Ambrosia",
    description: "Standard mode, assured sword, ambrosia",
    settings: { worldState: "standard", swords: "assured", ambrosia: true },
  },
  {
    id: "ambroz1a",
    name: "AmbroZ1a",
    description: "Retro mode, Ganon hunt, ambrosia, activated flute",
    settings: { worldState: "inverted_1", wildSmallKeys: "universal", activatedFlute: true, ambrosia: true },
  },
  {
    id: "cabookey",
    name: "Cabookey",
    description: "Standard mode, all dungeons, keysanity, assured sword, start with boots",
    settings: { worldState: "standard", goal: "dungeons", swords: "assured", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "cabookeydrop",
    name: "Cabookeydrop",
    description: "Standard mode, all dungeons, keysanity, key drop, assured sword, start with boots",
    settings: { worldState: "standard", goal: "dungeons", swords: "assured", pottery: "keys", enemyDrop: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "hardopenplus",
    name: "Hard Open Plus",
    description: "Open mode, defeat Ganon",
    settings: {},
  },
  {
    id: "ludicrousspeed",
    name: "Ludicrous Speed",
    description: "All Dungeons with wild compasses",
    settings: { goal: "dungeons", wildCompasses: true },
  },
  {
    id: "mystery",
    name: "Mystery",
    description: "Mystery/unknown settings",
    settings: {},
  },
  {
    id: "patronparty",
    name: "Patron Party",
    description: "Inverted, boss shuffle, keysanity, pseudoboots, activated flute, start with hookshot/glove/flute",
    settings: { worldState: "inverted_1", goal: "fast_ganon", bossShuffle: "random", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, activatedFlute: true },
    startingItems: { hookshot: 1, glove: 1, flute: 1 },
  },
  {
    id: "potpourri",
    name: "Potpourri",
    description: "All Dungeons, boss shuffle, wild keys, activated flute, start with hookshot/icerod/flute",
    settings: { goal: "dungeons", bossShuffle: "random", wildSmallKeys: "wild", wildBigKeys: true, activatedFlute: true },
    startingItems: { hookshot: 1, icerod: 1, flute: 1 },
  },
  {
    id: "potsandbones",
    name: "Pots & Bones",
    description: "Standard, crossed ER, key drop, triforce hunt, keysanity, start with boots/lantern/red boomerang",
    settings: { worldState: "standard", goal: "triforce_hunt", entranceMode: "crossed", pottery: "lottery", enemyDrop: "underworld", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1, lantern: 1, boomerang: 2 },
  },
  {
    id: "retrance",
    name: "Retrance",
    description: "Retro mode, crossed ER, keysanity, assured sword",
    settings: { goal: "fast_ganon", swords: "assured", entranceMode: "crossed", wildSmallKeys: "universal", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "shoptillyoudrop",
    name: "Shop Till You Drop",
    description: "Retro mode, crossed ER, key drop, keysanity, shopsanity, start with boots",
    settings: { goal: "fast_ganon", entranceMode: "crossed", pottery: "keys", enemyDrop: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, shopsanity: true },
    startingItems: { boots: 1 },
  },
  {
    id: "truepothunt",
    name: "True Pot Hunt",
    description: "Crossed ER, key drop, triforce hunt, keysanity, shopsanity, start with boots/lantern",
    settings: { goal: "triforce_hunt", entranceMode: "crossed", pottery: "lottery", enemyDrop: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, shopsanity: true },
    startingItems: { boots: 1, lantern: 1 },
  },
  {
    id: "xdhunt",
    name: "XDHunt",
    description: "Crossed ER, key drop, Ganon hunt, keysanity, pseudoboots, 4 tower crystals",
    settings: { entranceMode: "crossed", pottery: "keys", enemyDrop: "keys", gtOpen: "4", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, pseudoboots: true },
  },
  {
    id: "stanvertedkeys",
    name: "Stanverted Keys",
    description: "Standard mode, overworld shuffle, keysanity, defeat Ganon",
    settings: { worldState: "standverted", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },

  // ── Glitched ────────────────────────────────────────────────────────────
  {
    id: "owg",
    name: "OWG",
    description: "Overworld glitches logic",
    settings: { logicMode: "overworldglitches" },
    startingItems: { boots: 1 },
  },
  {
    id: "owg_assured",
    name: "OWG Assured",
    description: "Overworld glitches with assured sword, start with boots",
    settings: { logicMode: "overworldglitches", swords: "assured" },
    startingItems: { boots: 1 },
  },
  {
    id: "hmg",
    name: "HMG",
    description: "Hybrid major glitches, start with boots",
    settings: { logicMode: "hybridglitches" },
    startingItems: { boots: 1 },
  },
  {
    id: "nologic",
    name: "No Logic",
    description: "No logic — anything goes, keysanity, start with boots",
    settings: { logicMode: "nologic", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
];

// ADKDF
const adkdfIndex = allPresets.findIndex((p) => p.id === "adkdf");
const adkdfCheckedLocations: Record<string, { scoutedItems?: string[] }> = {}
const adkdfCheckedEntrances: string[] = [];

const excludedEntrances = new Set([
  "Kakariko Well Drop",
  "Pyramid Hole",
  "Library",
])

const excludedLocations = new Set([
  "Master Sword Pedestal",
  "Desert Ledge",
  "Bottle Merchant"
])

for (const locName of Object.keys(locationsData)) {
  const loc = locationsData[locName];
  if (loc.entrance && !excludedEntrances.has(locName)) {
    adkdfCheckedEntrances.push(locName);
  }
}

for (const locName of Object.keys(locationsData)) {
  if (!excludedLocations.has(locName) && locationsData[locName].overworld) {
    adkdfCheckedLocations[locName] = {};
  }
}

if (adkdfIndex !== -1) {
  allPresets[adkdfIndex].checkedEntrances = adkdfCheckedEntrances;
  allPresets[adkdfIndex].checkedLocations = adkdfCheckedLocations;
}


// ---------------------------------------------------------------------------
// Preset categories — from the old tracker's index.html
// ---------------------------------------------------------------------------

export const presetCategories: PresetCategory[] = [
  {
    id: "ladder",
    title: "Step Ladder",
    discordUrl: "https://discord.gg/yVdTkEZhk6",
    presetIds: ["casualboots", "crosskeys", "crosskeys2024", "crisscross", "openkeysanity", "adkeysanity", "mystery"],
  },
  {
    id: "glitched",
    title: "Glitched Presets",
    discordUrl: "https://discord.gg/8ggH24gV8Y",
    presetIds: ["owg", "hmg", "nologic"],
  },
  {
    id: "tournament",
    title: "Tournament Presets",
    presetIds: ["open47keys", "ad", "adkdf", "ambroz1a", "casualboots", "cabookeydrop", "enemizer", "inverted_startflute", "enemizerboots", "mystery", "openboots", "standard", "stanvertedkeys"],
  },
];

// Discord links for tournament sub-communities (rendered in the category header)
export const tournamentDiscords = [
  { label: "League", url: "https://discord.gg/yeJWJvT" },
  { label: "Beer League", url: "https://discord.gg/s8ybdqDrRh" },
  { label: "German Tournament", url: "https://discord.gg/5zuANcS" },
  { label: "ADKDF", url: "https://discord.gg/M22pmUYw" }
];

/** Look up a preset by ID. Returns undefined if not found. */
export function getPresetById(id: string): LauncherPreset | undefined {
  return allPresets.find((p) => p.id === id);
}

/**
 * Map API mode slugs (from alttpr.racing) to local preset IDs.
 * Only needed when the slug differs from the preset ID.
 * For exact matches (e.g., slug "open" → preset "open"), the
 * lookup in resolvePresetFromSlug() handles it automatically.
 */
export const ladderSlugToPresetId: Record<string, string> = {
  xdhuntplus: "crisscross",
  open_enemizer_starting_mc: "enemizerkeydrop",
  nologic_rods: "nologic",
  adkeys: "adkeysanity",
  inverted_adkeys: "invertedadkeysanity",
  crisscross_zw: "crisscross",
  mmmmladder: "mystery",
  cabookeydrop_noct: "cabookeydrop",
  stdinvkeys: "stanvertedkeys",
  adkdb: "adkdb",
  pab: "potsandbones",
  tph2023: "truepothunt",
  retrance_bow: "retrance",
  mmmmavid23: "mystery",
};

/**
 * Resolve an API mode slug to a local preset ID.
 * Strips path prefixes (ladder/, league/, etc.), checks the explicit
 * override map first, then falls back to a direct preset ID lookup.
 */
export function resolvePresetFromSlug(rawSlug: string): string | undefined {
  const slug = rawSlug.replace(/^[^/]+\//, "");
  if (ladderSlugToPresetId[slug]) return ladderSlugToPresetId[slug];
  if (getPresetById(slug)) return slug;
  return undefined;
}

export default allPresets;
