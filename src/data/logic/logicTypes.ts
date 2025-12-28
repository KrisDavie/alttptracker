// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type LogicRequirement = string | { allOf: LogicRequirement[] } | { anyOf: LogicRequirement[] } | {};

export type LogicStatus = "unavailable" | "available" | "possible" | "information" | "ool";

export interface LogicState {
  always?: LogicRequirement;
  logical?: LogicRequirement;
  required?: LogicRequirement;
  scout?: LogicRequirement;
}

export interface WorldLogic {
  Open?: LogicState | LogicRequirement;
  Inverted?: LogicState | LogicRequirement;
  Standard?: LogicState | LogicRequirement;
  Entrance?: string[];
}

export type LogicData = Record<string, LogicState>;
export type WorldLogicData = Record<string, WorldLogic>;
export type DungeonLogicData = Record<string, LogicData>;
