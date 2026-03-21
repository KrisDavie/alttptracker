import type { SettingsState } from "@/store/settingsSlice";

export interface LauncherPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<SettingsState>;
  /** Starting items to grant (item key → amount) */
  startingItems?: Record<string, number>;
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
    description: "Open mode, defeat Ganon, no glitches",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized" },
  },
  {
    id: "open76",
    name: "Open 7/6",
    description: "Open mode, fast Ganon with 6 crystals required",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized" },
  },
  {
    id: "openboots",
    name: "Open Boots",
    description: "Open mode, defeat Ganon, start with boots",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized" },
    startingItems: { boots: 1 },
  },
  {
    id: "standard",
    name: "Standard",
    description: "Standard mode, defeat Ganon",
    settings: { worldState: "standard", goal: "ganon", logicMode: "noglitches", swords: "randomized" },
  },
  {
    id: "standardboots",
    name: "Standard Boots",
    description: "Standard mode, defeat Ganon, start with boots",
    settings: { worldState: "standard", goal: "ganon", logicMode: "noglitches", swords: "randomized" },
    startingItems: { boots: 1 },
  },
  {
    id: "casualboots",
    name: "Casual Boots",
    description: "Standard mode, assured sword, start with boots",
    settings: { worldState: "standard", goal: "ganon", logicMode: "noglitches", swords: "assured" },
    startingItems: { boots: 1 },
  },

  // ── All Dungeons ────────────────────────────────────────────────────────
  {
    id: "ad",
    name: "All Dungeons",
    description: "Open mode, all dungeons goal",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized" },
  },
  {
    id: "adenemizer",
    name: "AD Enemizer",
    description: "All Dungeons with boss and enemy shuffle",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", bossShuffle: "simple", enemyShuffle: "shuffled" },
  },
  {
    id: "adkdb",
    name: "ADKDB",
    description: "All Dungeons, keysanity, key drop, start with boots",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "adkeydrop",
    name: "AD Keydrop",
    description: "All Dungeons with keysanity and key drop pots",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "adkeydropshop",
    name: "AD Keydrop Shop",
    description: "All Dungeons with keysanity, key drop pots, and shopsanity",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "adkeysanity",
    name: "AD Keysanity",
    description: "All Dungeons with full keysanity",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "adtileswap",
    name: "AD Tile Swap",
    description: "All Dungeons with overworld tile swap",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", owMixed: true },
  },

  // ── Keysanity Variants ──────────────────────────────────────────────────
  {
    id: "openkeysanity",
    name: "Open Keysanity",
    description: "Open mode, defeat Ganon, all dungeon items wild",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "open47keys",
    name: "4/7 Open Keys",
    description: "Open keysanity, 4 crystals for tower, 7 for Ganon",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "mcshuffle",
    name: "MC Shuffle",
    description: "Maps and compasses shuffled, keys in dungeon",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", wildMaps: true, wildCompasses: true },
  },
  {
    id: "mcboss",
    name: "MCBoss",
    description: "Maps and compasses shuffled with boss shuffle",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", wildMaps: true, wildCompasses: true, bossShuffle: "simple" },
  },

  // ── Crosskeys / Entrance Shuffle ────────────────────────────────────────
  {
    id: "crosskeys",
    name: "Crosskeys",
    description: "Simple ER with full keysanity, fast Ganon",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "crosskeys2024",
    name: "Crosskeys 2024/5/6",
    description: "Crosskeys with pseudoboots",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "crosshunt",
    name: "Crosshunt",
    description: "Simple ER, keysanity, Ganon hunt with 0 tower crystals",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "crosskeys_flute_ms_pb",
    name: "Crosskeys Flute MS PB",
    description: "Crosskeys with activated flute, mirror scroll, pseudoboots",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, activatedFlute: true },
  },
  {
    id: "crosskeys_kd_flute_inv_pb_zw",
    name: "Crosskeys KD Flute Inv PB ZW",
    description: "Inverted crosskeys with key drop, activated flute, pseudoboots",
    settings: { worldState: "inverted", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, activatedFlute: true },
  },
  {
    id: "crosskeys_kd_ms_pb_zw",
    name: "Crosskeys KD MS PB ZW",
    description: "Crosskeys with key drop, mirror scroll, pseudoboots",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "crosskeys_ms_pb_zw",
    name: "Crosskeys MS PB ZW",
    description: "Crosskeys with mirror scroll, pseudoboots",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "crosskeys_kd_ad",
    name: "Crosskeys KD AD",
    description: "Crosskeys with key drop, all dungeons goal",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "supercrosskeys",
    name: "Supercrosskeys",
    description: "Simple ER, keysanity, key drop, pseudoboots, bonk shuffle, fast Ganon 4 crystals",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, bonkShuffle: true },
  },
  {
    id: "invertedcrosskeys",
    name: "Inverted Crosskeys",
    description: "Inverted mode with simple ER and full keysanity",
    settings: { worldState: "inverted", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },

  // ── Crisscross / Doors ──────────────────────────────────────────────────
  {
    id: "crisscross",
    name: "Crisscross",
    description: "Simple ER, crossed doors, keysanity, pseudoboots, shopsanity",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "beginnerdoors",
    name: "Beginner Doors",
    description: "Standard mode, crossed doors, assured sword, pseudoboots",
    settings: { worldState: "standard", goal: "ganon", logicMode: "noglitches", swords: "assured" },
  },
  {
    id: "intermediatedoors",
    name: "Intermediate Doors",
    description: "Standard mode, crossed doors, assured sword, pseudoboots, keysanity",
    settings: { worldState: "standard", goal: "ganon", logicMode: "noglitches", swords: "assured", wildSmallKeys: "wild", wildBigKeys: true },
  },

  // ── Inverted ────────────────────────────────────────────────────────────
  {
    id: "inverted",
    name: "Inverted",
    description: "Inverted mode, defeat Ganon",
    settings: { worldState: "inverted", goal: "ganon", logicMode: "noglitches", swords: "randomized" },
  },
  {
    id: "inverted_startflute",
    name: "Inverted (Start Flute)",
    description: "Inverted mode with activated starting flute",
    settings: { worldState: "inverted", goal: "ganon", logicMode: "noglitches", swords: "randomized", activatedFlute: true },
    startingItems: { flute: 1 },
  },
  {
    id: "invertedkeysanity",
    name: "Inverted Keysanity",
    description: "Inverted mode with full keysanity",
    settings: { worldState: "inverted", goal: "ganon", logicMode: "noglitches", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "invertedadkeysanity",
    name: "Inverted AD Keysanity",
    description: "Inverted mode, all dungeons, full keysanity",
    settings: { worldState: "inverted", goal: "dungeons", logicMode: "noglitches", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "influkeys",
    name: "Influkeys",
    description: "Inverted, keysanity, activated flute, start with flute",
    settings: { worldState: "inverted", goal: "ganon", logicMode: "noglitches", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, activatedFlute: true },
    startingItems: { flute: 1 },
  },
  {
    id: "invrosia",
    name: "Invrosia",
    description: "Inverted mode with assured sword and wild big keys",
    settings: { worldState: "inverted", goal: "ganon", logicMode: "noglitches", swords: "assured", wildBigKeys: true },
  },

  // ── Swordless / Combat Variants ─────────────────────────────────────────
  {
    id: "championsswordless",
    name: "Champions Swordless",
    description: "Swordless with MC shuffle",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "swordless", wildMaps: true, wildCompasses: true },
  },
  {
    id: "championshunt",
    name: "Champions Hunt",
    description: "Assured sword, wild big keys, 5 tower crystals, Ganon hunt, start with boots",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "assured", wildBigKeys: true },
    startingItems: { boots: 1 },
  },

  // ── Enemizer ────────────────────────────────────────────────────────────
  {
    id: "enemizer",
    name: "Enemizer",
    description: "Open mode with boss and enemy shuffle",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", bossShuffle: "simple", enemyShuffle: "shuffled" },
  },
  {
    id: "enemizerboots",
    name: "Enemizer Boots",
    description: "Enemizer with starting boots",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", bossShuffle: "simple", enemyShuffle: "shuffled" },
    startingItems: { boots: 1 },
  },
  {
    id: "enemizerkeydrop",
    name: "Enemizer Keydrop",
    description: "Enemizer with key drop pots and full keysanity",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", bossShuffle: "simple", enemyShuffle: "shuffled", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },

  // ── Goal Variants ───────────────────────────────────────────────────────
  {
    id: "bosshunt",
    name: "Bosshunt",
    description: "Ganon hunt with 0 tower crystals",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized" },
  },
  {
    id: "ganonhunt",
    name: "Ganonhunt",
    description: "Ganon hunt, assured sword, wild big keys, 5/2, start with boots",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "assured", wildBigKeys: true },
    startingItems: { boots: 1 },
  },
  {
    id: "goldrush",
    name: "Gold Rush",
    description: "Triforce hunt with full keysanity, start with boots",
    settings: { worldState: "open", goal: "triforce_hunt", logicMode: "noglitches", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "reducedcrystals",
    name: "Reduced Crystals",
    description: "Open mode, fast Ganon with 6 crystals",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized" },
  },
  {
    id: "doubledown",
    name: "Double Down",
    description: "All Dungeons, keysanity, start with boots",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "duality",
    name: "Duality",
    description: "Fast Ganon 1/5, full keysanity",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },

  // ── Special Modes ───────────────────────────────────────────────────────
  {
    id: "ambrosia",
    name: "Ambrosia",
    description: "Standard mode, assured sword, ambrosia",
    settings: { worldState: "standard", goal: "ganon", logicMode: "noglitches", swords: "assured" },
  },
  {
    id: "ambroz1a",
    name: "AmbroZ1a",
    description: "Retro mode, Ganon hunt, ambrosia, activated flute",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", activatedFlute: true },
  },
  {
    id: "cabookey",
    name: "Cabookey",
    description: "Standard mode, all dungeons, keysanity, assured sword, start with boots",
    settings: { worldState: "standard", goal: "dungeons", logicMode: "noglitches", swords: "assured", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "cabookeydrop",
    name: "Cabookeydrop",
    description: "Standard mode, all dungeons, keysanity, key drop, assured sword, start with boots",
    settings: { worldState: "standard", goal: "dungeons", logicMode: "noglitches", swords: "assured", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "hardopenplus",
    name: "Hard Open Plus",
    description: "Open mode, defeat Ganon",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized" },
  },
  {
    id: "ludicrousspeed",
    name: "Ludicrous Speed",
    description: "All Dungeons with wild compasses",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", wildCompasses: true },
  },
  {
    id: "mystery",
    name: "Mystery",
    description: "Mystery/unknown settings — boss and enemy shuffle, keysanity",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", bossShuffle: "simple", enemyShuffle: "shuffled", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "patronparty",
    name: "Patron Party",
    description: "Inverted, boss shuffle, keysanity, pseudoboots, activated flute, start with hookshot/glove/flute",
    settings: { worldState: "inverted", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", bossShuffle: "simple", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true, activatedFlute: true },
    startingItems: { hookshot: 1, glove: 1, flute: 1 },
  },
  {
    id: "potpourri",
    name: "Potpourri",
    description: "All Dungeons, boss shuffle, wild keys, activated flute, start with hookshot/icerod/flute",
    settings: { worldState: "open", goal: "dungeons", logicMode: "noglitches", swords: "randomized", bossShuffle: "simple", wildSmallKeys: "wild", wildBigKeys: true, activatedFlute: true },
    startingItems: { hookshot: 1, icerod: 1, flute: 1 },
  },
  {
    id: "potsandbones",
    name: "Pots & Bones",
    description: "Standard, simple ER, key drop, triforce hunt, keysanity, start with boots/lantern/red boomerang",
    settings: { worldState: "standard", goal: "triforce_hunt", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1, lantern: 1, boomerang: 2 },
  },
  {
    id: "retrance",
    name: "Retrance",
    description: "Retro mode, simple ER, keysanity, assured sword",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "assured", entranceMode: "simple", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "shoptillyoudrop",
    name: "Shop Till You Drop",
    description: "Retro mode, simple ER, key drop, keysanity, shopsanity, start with boots",
    settings: { worldState: "open", goal: "fast_ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
  {
    id: "truepothunt",
    name: "True Pot Hunt",
    description: "Simple ER, key drop, triforce hunt, keysanity, shopsanity, start with boots/lantern",
    settings: { worldState: "open", goal: "triforce_hunt", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1, lantern: 1 },
  },
  {
    id: "xdhunt",
    name: "XDHunt",
    description: "Simple ER, key drop, Ganon hunt, keysanity, pseudoboots, 4 tower crystals",
    settings: { worldState: "open", goal: "ganon", logicMode: "noglitches", swords: "randomized", entranceMode: "simple", pottery: "keys", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },
  {
    id: "stanvertedkeys",
    name: "Stanverted Keys",
    description: "Standard mode, overworld shuffle, keysanity, defeat Ganon",
    settings: { worldState: "standard", goal: "ganon", logicMode: "noglitches", swords: "randomized", owMixed: true, wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
  },

  // ── Glitched ────────────────────────────────────────────────────────────
  {
    id: "owg",
    name: "OWG",
    description: "Overworld glitches logic",
    settings: { worldState: "open", goal: "ganon", logicMode: "overworldglitches", swords: "randomized" },
    startingItems: { boots: 1 },
  },
  {
    id: "owg_assured",
    name: "OWG Assured",
    description: "Overworld glitches with assured sword, start with boots",
    settings: { worldState: "open", goal: "ganon", logicMode: "overworldglitches", swords: "assured" },
    startingItems: { boots: 1 },
  },
  {
    id: "hmg",
    name: "HMG",
    description: "Hybrid major glitches, start with boots",
    settings: { worldState: "open", goal: "ganon", logicMode: "hybridglitches", swords: "randomized" },
    startingItems: { boots: 1 },
  },
  {
    id: "nologic",
    name: "No Logic",
    description: "No logic — anything goes, keysanity, start with boots",
    settings: { worldState: "open", goal: "ganon", logicMode: "nologic", swords: "randomized", wildSmallKeys: "wild", wildBigKeys: true, wildMaps: true, wildCompasses: true },
    startingItems: { boots: 1 },
  },
];

// ---------------------------------------------------------------------------
// Preset categories — from the old tracker's index.html
// ---------------------------------------------------------------------------

export const presetCategories: PresetCategory[] = [
  {
    id: "ladder",
    title: "Step Ladder",
    discordUrl: "https://discord.gg/yVdTkEZhk6",
    presetIds: [
      "casualboots",
      "crosskeys",
      "crosskeys2024",
      "crisscross",
      "openkeysanity",
      "adkeysanity",
      "mystery",
    ],
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
    presetIds: [
      "open47keys",
      "ad",
      "ambroz1a",
      "casualboots",
      "cabookeydrop",
      "enemizer",
      "inverted_startflute",
      "enemizerboots",
      "mystery",
      "openboots",
      "standard",
      "stanvertedkeys",
    ],
  },
];

// Discord links for tournament sub-communities (rendered in the category header)
export const tournamentDiscords = [
  { label: "League", url: "https://discord.gg/yeJWJvT" },
  { label: "Beer League", url: "https://discord.gg/s8ybdqDrRh" },
  { label: "German Tournament", url: "https://discord.gg/5zuANcS" },
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
  "xdhuntplus": "crisscross",
  "open_enemizer_starting_mc": "enemizerkeydrop",
  "nologic_rods": "nologic",
  "adkeys": "adkeysanity",
  "inverted_adkeys": "invertedadkeysanity",
  "crisscross_zw": "crisscross",
  "mmmmladder": "mystery",
  "cabookeydrop_noct": "cabookeydrop",
  "stdinvkeys": "stanvertedkeys",
  "adkdb": "adkdb",
  "pab": "potsandbones",
  "tph2023": "truepothunt",
  "retrance_bow": "retrance",
  "mmmmavid23": "mystery",
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
