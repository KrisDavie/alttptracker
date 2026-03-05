import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface OverworldState {
  // Per-tile effective world — only stores tiles that differ from vanilla
  // Key: owid, Value: "light" | "dark"
  tileWorlds: Record<number, "light" | "dark">;

  // Key: source name, Value: destination name (null = unknown)
  edgeLinks: Record<string, string | null>;

  // Key: whirlpool exit name, Value: destination whirlpool exit name (null = unknown)
  whirlpoolLinks: Record<string, string | null>;

  // Key: flute spot index (1-8), Value: destination region name (null = unknown)
  fluteLinks: Record<number, string | null>;

  // Tile groups: array of groups, each group is a Set of owid values
  tileGroups: number[][];

  // Per-edge crossed state
  crossedEdges: Record<string, boolean>;

}


const overworldInitialState: OverworldState = {
  tileWorlds: {},
  edgeLinks: {},
  whirlpoolLinks: {},
  fluteLinks: {},
  tileGroups: [],
  crossedEdges: {},
};



export const overworldSlice = createSlice({
  name: "overworld",
  initialState: overworldInitialState,
  reducers: {
    setTileWorld(state, action: PayloadAction<{ owid: number; world: "light" | "dark" | null }>) {
      const { owid, world } = action.payload;
      // Auto-pair: LW owid (0-63) ↔ DW owid (64-127). owid+0x40 = paired tile.
      const paired = owid < 64 ? owid + 64 : owid < 128 ? owid - 64 : null;
      const pairedWorld = world === "light" ? "dark" : world === "dark" ? "light" : null;
      if (world) {
        state.tileWorlds[owid] = world;
      } else {
        delete state.tileWorlds[owid];
      }
      if (paired != null) {
        if (pairedWorld) {
          state.tileWorlds[paired] = pairedWorld;
        } else {
          delete state.tileWorlds[paired];
        }
      }
    },
    setEdgeLink(state, action: PayloadAction<{ source: string; destination: string | null }>) {
      const { source, destination } = action.payload;
      state.edgeLinks[source] = destination;
    },
    setWhirlpoolLink(state, action: PayloadAction<{ source: string; destination: string | null }>) {
      const { source, destination } = action.payload;
      state.whirlpoolLinks[source] = destination;
    },
    setFluteLink(state, action: PayloadAction<{ index: number; destination: string | null }>) {
      const { index, destination } = action.payload;
      state.fluteLinks[index] = destination;
    },
    setTileGroup(state, action: PayloadAction<{ groupIndex: number; owids: number[] }>) {
      const { groupIndex, owids } = action.payload;
      state.tileGroups[groupIndex] = owids;
    },
    toggleCrossedEdge(state, action: PayloadAction<{ edge: string }>) {
      const { edge } = action.payload;
      state.crossedEdges[edge] = !state.crossedEdges[edge];
    },
    resetOverworldState() {
      return overworldInitialState;
    },
  },
});

export const {setTileWorld, setEdgeLink, setWhirlpoolLink, setFluteLink, setTileGroup, toggleCrossedEdge, resetOverworldState} = overworldSlice.actions;
export default overworldSlice.reducer;
