import type { LogicRequirement } from "../../data/logic/logicTypes";

export interface OverworldEdge {
  name: string;
  tileId: number;
  region: string; // The region this edge belongs to
  direction: "North" | "South" | "West" | "East";
  terrain: "Land" | "Water";
}

export interface OverworldConnection {
  to: string; // Can be a region name or an edge name
  requirements?: LogicRequirement;
}

export interface OverworldRegion {
  name: string;
  tileId: number;
  connections: OverworldConnection[];
}

export interface OverworldGraph {
  regions: Record<string, OverworldRegion>;
  edges: Record<string, OverworldEdge>;
  edgeConnections: Record<string, string>; // Maps edge name to connected edge name
}
