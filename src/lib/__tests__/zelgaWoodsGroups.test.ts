import { describe, it, expect } from "vitest";
import { getEntranceGroup } from "@/lib/dropdowns";
import { locationsData } from "@/data/locationsData";
import { getLogicSet } from "@/lib/logic/logicMapper";
import { buildEffectiveRegions } from "@/lib/logic/regionsProvider";
import { gameState } from "@/lib/logic/__tests__/testHelpers";
import type { RegionLogic } from "@/data/logic/logicTypes";

/**
 * Zelga Woods (OWR `skullwoods: "followlinked"`) entrance-group regressions.
 *
 * Intended layout (verified against the OWR source):
 * - RED (new drop-downs): First Section Hole (North) and Second Section Hole
 *   join the normal drop pool, paired with their doors.
 * - GREEN (vanilla): First Section Hole (East)/(West) stay vanilla and must
 *   not be shuffled, shown as shuffled markers, or severed in the logic graph.
 * - BLUE (pool): the doors join the normal door pool.
 *
 * Previously only "skull_doors" was remapped (to a hard-coded "shuffle"), so
 * the new drops could not be linked on the map and the vanilla holes were
 * severed in logic.
 */

const RED_DROPS = ["Skull Woods First Section Hole (North)", "Skull Woods Second Section Hole"];
const GREEN_HOLES = ["Skull Woods First Section Hole (East)", "Skull Woods First Section Hole (West)"];
const DOORS = ["Skull Woods First Section Door", "Skull Woods Second Section Door (East)", "Skull Woods Second Section Door (West)"];
const ALL_MODES = ["dungeonssimple", "dungeonsfull", "lite", "lean", "simple", "restricted", "full", "district", "swapped", "crossed", "insanity", "vanilla"];

describe("getEntranceGroup with zelgaWoods", () => {
  it("returns base groups unchanged when zelgaWoods is off", () => {
    for (const name of [...RED_DROPS, ...GREEN_HOLES]) {
      expect(getEntranceGroup(name, "crossed", false)).toBe("skull_drops");
    }
    for (const name of DOORS) {
      expect(getEntranceGroup(name, "crossed", false)).toBe("skull_doors");
    }
  });

  it("keeps the green southeast holes vanilla in every mode", () => {
    for (const name of GREEN_HOLES) {
      for (const mode of ALL_MODES) {
        expect(getEntranceGroup(name, mode, true), `${name} in ${mode}`).toBe("vanilla");
      }
    }
  });

  it("makes the new drop-downs behave like a standard drop (Kakariko Well Drop) per mode", () => {
    for (const name of RED_DROPS) {
      for (const mode of ALL_MODES) {
        // district keeps skull woods' own district group
        const expected = mode === "district" ? "northwest_hyrule" : locationsData["Kakariko Well Drop"].entrance_modes![mode];
        expect(getEntranceGroup(name, mode, true), `${name} in ${mode}`).toBe(expected);
      }
    }
  });

  it("makes the doors behave like a standard door entrance (Kakariko Well Cave) per mode", () => {
    for (const name of DOORS) {
      for (const mode of ALL_MODES) {
        const expected = mode === "district" ? "northwest_hyrule" : locationsData["Kakariko Well Cave"].entrance_modes![mode];
        expect(getEntranceGroup(name, mode, true), `${name} in ${mode}`).toBe(expected);
      }
    }
  });

  it("does not affect unrelated entrances", () => {
    expect(getEntranceGroup("Kakariko Well Drop", "crossed", true)).toBe("shuffle");
    expect(getEntranceGroup("Dam", "crossed", true)).toBe(locationsData["Dam"].entrance_modes!["crossed"]);
  });
});

describe("regionsProvider entrance severing with zelgaWoods", () => {
  function severedStateOfExit(regions: Record<string, RegionLogic>, exitName: string): boolean | undefined {
    for (const region of Object.values(regions)) {
      if (region.exits && exitName in region.exits) {
        return region.exits[exitName].to === null;
      }
    }
    return undefined;
  }

  it("keeps the green holes connected and severs the red drops/doors (crossed + zelgaWoods)", () => {
    const state = gameState().withSettings({ entranceMode: "crossed", zelgaWoods: true }).build();
    const logicSet = getLogicSet("noglitches");
    const { regions } = buildEffectiveRegions(logicSet.regions as Record<string, RegionLogic>, state);

    for (const name of GREEN_HOLES) {
      expect(severedStateOfExit(regions, name), `${name} should stay vanilla-connected`).toBe(false);
    }
    for (const name of [...RED_DROPS, ...DOORS]) {
      expect(severedStateOfExit(regions, name), `${name} should be severed until linked`).toBe(true);
    }
  });

  it("severs all four holes when zelgaWoods is off (crossed)", () => {
    const state = gameState().withSettings({ entranceMode: "crossed", zelgaWoods: false }).build();
    const logicSet = getLogicSet("noglitches");
    const { regions } = buildEffectiveRegions(logicSet.regions as Record<string, RegionLogic>, state);

    for (const name of [...GREEN_HOLES, ...RED_DROPS, ...DOORS]) {
      expect(severedStateOfExit(regions, name), `${name} should be severed`).toBe(true);
    }
  });
});
