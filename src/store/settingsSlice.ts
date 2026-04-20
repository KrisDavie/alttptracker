import type { EntranceLabel } from "@/data/entranceLabels";
import { createSlice } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";
import { applyLauncherPrefs, loadLauncherPrefs } from "@/lib/launchHelpers";

export interface StatusColors {
  available: string;
  possible: string;
  ool: string;
  information: string;
  unavailable: string;
  checked: string;
  selected: string;
}

export const DEFAULT_STATUS_COLORS: StatusColors = {
  available: "#22c55e",
  possible: "#eab308",
  ool: "#7e22ce",
  information: "#06b6d4",
  unavailable: "#ef4444",
  checked: "rgba(107, 114, 128, 0.7)",
  selected: "#3b82f6",
};

export const DEFAULT_STATUS_TEXT_COLORS: StatusColors = {
  available: "#4ade80",
  possible: "#facc15",
  ool: "#c084fc",
  information: "#22d3ee",
  unavailable: "#f87171",
  checked: "#6b7280",
  selected: "#3b82f6",
};

export const defaultUserSequenceBreaks = {
  // All false by default, users can toggle these on to allow the logic to consider them as "possible but not guaranteed" options
  canNavigateDarkRooms: false,

  // Dungeon logic breaks
  canIceBreak: false,
  canHookClip: false,
  canBombJump: false,
  canBombOrBonkCameraUnlock: false,
  canHover: false,
  canHoverAlot: false,
  canSpeckyClip: false,
  canFireSpooky: false,
  canBombSpooky: false,
  canHeraPot: false,
  canMimicClip: false,
  canPotionCameraUnlock: false,
  canMoldormBounce: false,
  canDarkRoomNavigateBlind: false,
  canTorchRoomNavigateBlind: false,

  // Overworld logic breaks
  canFairyReviveHover: false,
  canFakeFlipper: false,
  canOWFairyRevive: false,
  canQirnJump: false,
  canMirrorSuperBunny: false,
  canDungeonBunnyRevive: false,
  canFakePowder: false,
  canWaterWalk: false,
  canZoraSplashDelete: false,
  canBunnyPocket: false,
  canFairyBarrierRevive: false,
  canShockBlock: false,
  canTombRaider: false,

  // Glitch logic breaks
  canTamSwam: false,
  canBunnyCitrus: false,
  canMirrorWrap: false,
};

// Type allows boolean values for all sequence break keys
export type UserSequenceBreaks = { [K in keyof typeof defaultUserSequenceBreaks]: boolean };

export type goalTypes = "ganon" | "fast_ganon" | "ad" | "pedestal" | "triforce_hunt" | "ganonhunt" | "trinity" | "completionist";
export type gtOpenTypes = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "random" | "locksmith";
export type ganonVulnerableTypes = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "random" | "completionist" | "ad" | "triforce" | "other";

export interface SettingsState {
  // Mode Settings
  logicMode: "noglitches" | "overworldglitches" | "hybridglitches" | "nologic";
  worldState: "open" | "standard" | "inverted" | "inverted_1" | "standverted";
  gtOpen: gtOpenTypes;
  ganonVulnerable: ganonVulnerableTypes;
  wildSmallKeys: "inDungeon" | "wild" | "universal";
  wildBigKeys: boolean;
  wildMaps: boolean;
  wildCompasses: boolean;
  pottery: "none" | "keys" | "cave" | "cavekeys" | "reduced" | "clustered" | "nonempty" | "dungeon" | "lottery";
  enemyDrop: "none" | "keys" | "underworld";
  entranceMode: "none" | "dungeonssimple" | "dungeonsfull" | "lite" | "lean" | "simple" | "restricted" | "full" | "district" | "swapped" | "crossed" | "insanity";
  bossShuffle: "none" | "simple" | "full" | "random";
  enemyShuffle: "none" | "shuffled" | "random";
  goal: goalTypes;
  swords: "randomized" | "assured" | "vanilla" | "swordless";
  prizeShuffle: "vanilla" | "inDungeon" | "wild";
  shuffleLinks: boolean;
  activatedFlute: boolean;
  bonkShuffle: boolean;
  shopsanity: boolean;
  pseudoboots: boolean;
  mirrorScroll: boolean;
  ambrosia: boolean;
  followerShuffle: boolean;
  tavernShuffle: boolean;
  zelgaWoods: boolean;

  // DR Stuff
  doors: "vanilla" | "basic" | "partitioned" | "crossed" 

  // OW Stuff
  owLayout: "vanilla" | "grid" | "wild" 
  owCrossed: "none" | "grouped" | "polar" | "unrestricted" 
  owMixed: boolean 
  owParallel: boolean
  owTerrain: boolean
  owKeepSimilar: boolean
  owWhirlpool: boolean
  owFluteShuffle: "vanilla" | "balanced" | "random"

  // UI settings
  autotracking: boolean;
  mapMode: "off" | "normal" | "compact" | "vertical" | "popoutNormal" | "popoutVertical";
  includeDungeonItemsInCounter?: boolean;
  connectionLinesMode: "none" | "caves" | "dungeons" | "all";
  connectionLineColor: string;
  spriteName: string;
  colouredChests: boolean;
  showChestTooltips: boolean;
  entranceLabelsMode: "off" | "labels" | "labels_lines";
  showInsetBossSquare: boolean;
  alwaysShowHCCTCounts: boolean;
  alwaysShowBigKeys: boolean;
  alwaysShowSmallKeys: boolean;

  // Player sequence break settings
  sequenceBreaks: UserSequenceBreaks;

  entranceLabelOverrides: Record<string, EntranceLabel>

  // Custom colors
  customColors?: Partial<StatusColors>;
  customTextColors?: Partial<StatusColors>;
}

export const initialState: SettingsState = {
  logicMode: "noglitches",
  worldState: "open",
  gtOpen: "7",
  ganonVulnerable: "7",
  wildSmallKeys: "inDungeon",
  wildBigKeys: false,
  wildMaps: false,
  wildCompasses: false,
  pottery: "none",
  enemyDrop: "none",
  entranceMode: "none",
  bossShuffle: "none",
  enemyShuffle: "none",
  goal: "ganon",
  swords: "randomized",
  prizeShuffle: "vanilla",
  shuffleLinks: false,
  activatedFlute: false,
  bonkShuffle: false,
  shopsanity: false,
  pseudoboots: false,
  mirrorScroll: false,
  ambrosia: false,
  followerShuffle: false,
  tavernShuffle: false,
  zelgaWoods: false,

  // DR Stuff
  doors: "vanilla",

  // OW Stuff
  owLayout: "vanilla",
  owCrossed: "none",
  owMixed: false,
  owParallel: false,
  owTerrain: false,
  owKeepSimilar: true,
  owWhirlpool: false,
  owFluteShuffle: "vanilla",

  // UI settings
  autotracking: true,
  includeDungeonItemsInCounter: false,
  mapMode: "normal",
  connectionLinesMode: "all",
  connectionLineColor: "#ff00f9ff",
  spriteName: "link",
  colouredChests: true,
  showChestTooltips: true,
  entranceLabelsMode: "labels_lines",
  showInsetBossSquare: true,
  alwaysShowHCCTCounts: false,
  alwaysShowBigKeys: false,
  alwaysShowSmallKeys: false,

  // Sequence breaks
  sequenceBreaks: defaultUserSequenceBreaks,

  entranceLabelOverrides: {}
};

export const settingsSlice = createSlice({
  name: "trackerSettings",
  initialState,
  reducers: {
    setSettings: (state, action: { payload: Partial<SettingsState> }) => {
      const newState = { ...state, ...action.payload };
      return newState;
    },
    setWildSmallKeys: (state, action: { payload: "inDungeon" | "wild" | "universal" }) => {
      state.wildSmallKeys = action.payload;
    },
    toggleWildBigKeys: (state) => {
      state.wildBigKeys = !state.wildBigKeys;
    },
    setMapMode: (state, action: { payload: "off" | "normal" | "compact" | "vertical" }) => {
      state.mapMode = action.payload;
    },
    setSequenceBreaks: (state, action: { payload: Partial<UserSequenceBreaks> }) => {
      state.sequenceBreaks = { ...state.sequenceBreaks, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REMEMBER_REHYDRATED, (_state, action) => {
      const rehydrated = (action as unknown as { payload: Record<string, unknown> }).payload.settings as Partial<SettingsState> | undefined;
      if (!rehydrated) return initialState;

      // @ts-expect-error - This is an old saved state and we migrate to new type combinations
      if (rehydrated.goal === "dungeons" || rehydrated.ganonVulnerable === "dungeons") {
        rehydrated.goal = "ganon";
        rehydrated.ganonVulnerable = "ad";
      }
      const merged = {
        ...initialState,
        ...rehydrated,
        sequenceBreaks: { ...initialState.sequenceBreaks, ...rehydrated.sequenceBreaks },
      };
      // On load, override remembered user preferences (mapMode, etc.) with
      // current launcher prefs so the latest user choices always win.
      return applyLauncherPrefs(merged as SettingsState, loadLauncherPrefs());
    });
  },
});

export const { setSettings, setWildSmallKeys, toggleWildBigKeys, setSequenceBreaks } = settingsSlice.actions;
export default settingsSlice.reducer;
