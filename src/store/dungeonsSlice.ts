import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";
import { DungeonsData } from "@/data/dungeonData";

export interface DungeonState {
  collectedCount: number;
  bossDefeated: boolean;
  boss: "unknown" | "armos" | "lanmolas" | "moldorm" | "helmasaurking" | "arrghus" | "mothula" | "blind" | "kholdstare" | "vitreous" | "trinexx" | "agahnim" | "agahnim2" | "bnc";
  prize: "unknown" | "crystal" | "pendant" | "redCrystal" | "greenPendant" | "map";
  prizeCollected: boolean;
  smallKeys: number;
  bigKey: boolean;
  map: boolean;
  compass: boolean;
  manuallyChanged: {
    smallKeys: number;
    maxSmallKeys: number;
    bossDefeated: boolean;
    prize: boolean;
    prizeCollected: boolean;
    bigKey: boolean;
  };
}

export interface DungeonsState {
  [key: string]: DungeonState;
}

const dungeonInitialState: DungeonState = {
  collectedCount: 0,
  bossDefeated: false,
  boss: "unknown",
  prize: "unknown",
  prizeCollected: false,
  smallKeys: 0,
  bigKey: false,
  map: false,
  compass: false,
  manuallyChanged: {
    smallKeys: 0,
    maxSmallKeys: 0,
    bossDefeated: false,
    prize: false,
    prizeCollected: false,
    bigKey: false,
  },
};

const PRIZES: NonNullable<DungeonState["prize"]>[] = ["unknown", "greenPendant", "pendant", "crystal", "redCrystal"];

const initialState: Record<string, DungeonState> = Object.keys(DungeonsData).reduce((acc, dungeon) => {
  // TODO: If boss shuffle is enabled, always set boss to unknown
  acc[dungeon] = { ...dungeonInitialState, boss: DungeonsData[dungeon].boss || "unknown" };
  return acc;
}, {} as Record<string, DungeonState>);

export const dungeonsSlice = createSlice({
  name: "dungeons",
  initialState,
  reducers: {
    setDungeonCollectedCount: (state, action: PayloadAction<{ dungeon: string; count: number }>) => {
      const { dungeon, count } = action.payload;
      state[dungeon].collectedCount = count;
    },
    toggleDungeonBoss: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      state[dungeon].bossDefeated = !state[dungeon].bossDefeated;
      state[dungeon].manuallyChanged.bossDefeated = true;
    },
    incrementSmallKeyCount: (state, action: PayloadAction<{ dungeon: string; decrement: boolean }>) => {
      const { dungeon, decrement } = action.payload;
      state[dungeon].manuallyChanged.smallKeys = state[dungeon].manuallyChanged.smallKeys + (decrement ? -1 : 1);
    },
    setMaxSmallKeys: (state, action: PayloadAction<{ dungeon: string; maxSmallKeys: number }>) => {
      const { dungeon, maxSmallKeys } = action.payload;
      console.log("Setting max small keys for", dungeon, "to", maxSmallKeys, "was", state[dungeon].manuallyChanged.maxSmallKeys);
      state[dungeon].manuallyChanged.maxSmallKeys = maxSmallKeys;
    },
    setBigKey: (state, action: PayloadAction<{ dungeon: string; hasBigKey: boolean }>) => {
      const { dungeon, hasBigKey } = action.payload;
      state[dungeon].bigKey = hasBigKey;
      state[dungeon].manuallyChanged.bigKey = true;
    },
    togglePrizeCollected: (state, action: PayloadAction<{ dungeon: string }>) => {
      const { dungeon } = action.payload;
      state[dungeon].prizeCollected = !state[dungeon].prizeCollected;
      state[dungeon].manuallyChanged.prizeCollected = true;
    },
    incrementPrizeCount: (state, action: PayloadAction<{ dungeon: string; decrement: boolean }>) => {
      const { dungeon, decrement } = action.payload;
      const current = state[dungeon].prize ?? "unknown";
      const currentIndex = PRIZES.indexOf(current);
      const maxCount = PRIZES.length - 1;

      if (decrement) {
        state[dungeon].prize = PRIZES[(currentIndex - 1 + (maxCount + 1)) % (maxCount + 1)];
      } else {
        state[dungeon].prize = PRIZES[(currentIndex + 1) % (maxCount + 1)];
      }
      
      state[dungeon].manuallyChanged.prize = true;
    },
    updateDungeonState: (state, action: PayloadAction<{ dungeon: string; newState: Partial<DungeonState> }>) => {
      const { dungeon, newState } = action.payload;
      const current = state[dungeon];
      
      const filteredState = { ...newState };

      const fields = ["bossDefeated", "bigKey", "prizeCollected", "prize"] as const;
      fields.forEach((field) => {
        if (newState[field] !== undefined) {
          const isManual = current.manuallyChanged[field as keyof typeof current.manuallyChanged];

          if (newState[field] === current[field]) {
            current.manuallyChanged[field] = false;
          } else if (isManual) {
            delete filteredState[field];
          }
        }
      });

      if (filteredState.map && (!current.manuallyChanged.prize || current.prize === "unknown")) {
        filteredState.prize = "map"
      }

      Object.assign(current, filteredState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REMEMBER_REHYDRATED, (_state, action) => {
      const rehydrated = (action as unknown as { payload: Record<string, unknown> }).payload.dungeons as Record<string, DungeonState> | undefined;
      if (!rehydrated) return initialState;
      const merged = { ...initialState };
      for (const [key, value] of Object.entries(rehydrated)) {
        if (merged[key]) {
          merged[key] = {
            ...dungeonInitialState,
            ...value,
            manuallyChanged: { ...dungeonInitialState.manuallyChanged, ...value.manuallyChanged },
          };
        }
      }
      return merged;
    });
  },
});

export const { setDungeonCollectedCount, toggleDungeonBoss, incrementSmallKeyCount, setBigKey, incrementPrizeCount, togglePrizeCollected, updateDungeonState, setMaxSmallKeys } = dungeonsSlice.actions;
export default dungeonsSlice.reducer;
