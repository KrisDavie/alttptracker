import { logic_regions } from "@/data/logic/logic_regions";

import type { RegionLogic, WorldLogicData } from "@/data/logic/logicTypes";

export interface LogicSet {
  regions: WorldLogicData | Record<string, RegionLogic>;
}

export type LogicMode = "noglitches" | "overworldglitches" | "hybridglitches" | "nologic";

export const getLogicSet = (mode: LogicMode): LogicSet => {
  switch (mode) {
    default:
      return {
        regions: logic_regions,
      };
  }
};
