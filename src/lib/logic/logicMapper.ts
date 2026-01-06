// import { logic_dungeon } from "@/data/logic/noglitches/logic_dungeon";
// import { logic_dungeon_keydrop } from "@/data/logic/noglitches/logic_dungeon_keydrop";
// import { logic_entrances } from "@/data/logic/noglitches/logic_entrances";
// import { logic_nondungeon_checks } from "@/data/logic/noglitches/logic_nondungeon_checks";
// import { logic_nondungeon_checks_entrance } from "@/data/logic/noglitches/logic_nondungeon_checks_entrance";
import { logic_regions } from "@/data/logic/logic_regions";

// import { hmg_logic_dungeon } from "@/data/logic/hmg/logic_dungeon";
// import { hmg_logic_entrances } from "@/data/logic/hmg/logic_entrances";
// import { hmg_logic_nondungeon_checks } from "@/data/logic/hmg/logic_nondungeon_checks";
// import { hmg_logic_nondungeon_checks_entrance } from "@/data/logic/hmg/logic_nondungeon_checks_entrance";
// import { hmg_logic_regions } from "@/data/logic/hmg/logic_regions";

// import { owg_logic_entrances } from "@/data/logic/owg/logic_entrances";
// import { owg_logic_nondungeon_checks } from "@/data/logic/owg/logic_nondungeon_checks";
// import { owg_logic_nondungeon_checks_entrance } from "@/data/logic/owg/logic_nondungeon_checks_entrance";
// import { owg_logic_regions } from "@/data/logic/owg/logic_regions";

import type { OverworldRegionLogic, WorldLogicData } from "@/data/logic/logicTypes";

export interface LogicSet {
  regions: WorldLogicData | Record<string, OverworldRegionLogic>;
}

export type LogicMode = "noglitches" | "overworldglitches" | "hybridglitches" | "nologic";

export const getLogicSet = (mode: LogicMode): LogicSet => {
  switch (mode) {
    case "hybridglitches":
      return {
        regions: logic_regions,
      };
    case "overworldglitches":
      return {
        regions: logic_regions,
      };
    case "noglitches":
    case "nologic":
    default:
      return {
        regions: logic_regions,
      };
  }
};
