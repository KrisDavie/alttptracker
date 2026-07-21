import { dropdownLinks } from "@/data/dropdownData";
import { locationsData } from "@/data/locationsData";

/**
 * Dropdown pairing helpers.
 *
 * A "dropdown" is a one-way drop entrance (a hole/grave you fall into). Each is
 * paired in `dropdownData` with its associated normal entrance (the door of the
 * same building) — the dropdown is always listed first.
 *
 * Randomizer rules these helpers support:
 * - In every entrance mode, a dropdown may only be linked to another dropdown
 *   (holes shuffle among holes).
 * - In every mode except "insanity", a dropdown and its paired entrance are
 *   forcibly linked together: linking one side implies the partner link.
 * - Some pairs (Skull/Zelga Woods) are only forced when the `zelgaWoods`
 *   setting is enabled.
 */

export interface DropdownPair {
  id: string;
  /** The dropdown (hole/grave) side — always first in the data list. */
  drop: string;
  /** The associated normal entrance (door) side. */
  partner: string;
  /** Whether this pair is only active when the zelgaWoods setting is enabled. */
  requiresZelgaWoods: boolean;
}

const ALL_PAIRS: DropdownPair[] = Object.entries(dropdownLinks).map(([id, d]) => ({
  id,
  drop: d.entrances[0],
  partner: d.entrances[1],
  requiresZelgaWoods: !!d.zelgaWoods,
}));

/** Pairs that are active given the current zelgaWoods setting. */
export function getActiveDropdownPairs(zelgaWoods: boolean): DropdownPair[] {
  return ALL_PAIRS.filter((p) => !p.requiresZelgaWoods || zelgaWoods);
}

/** The set of dropdown (hole) entrance names that are active. */
export function getActiveDropdownNames(zelgaWoods: boolean): Set<string> {
  return new Set(getActiveDropdownPairs(zelgaWoods).map((p) => p.drop));
}

/** Find the active pair that contains `entrance` on either side. */
export function getDropdownPairFor(entrance: string, zelgaWoods: boolean): DropdownPair | undefined {
  return getActiveDropdownPairs(zelgaWoods).find((p) => p.drop === entrance || p.partner === entrance);
}

/** Whether `entrance` is the dropdown (hole) side of an active pair. */
export function isDropdown(entrance: string, zelgaWoods: boolean): boolean {
  return getActiveDropdownNames(zelgaWoods).has(entrance);
}

/** Whether `entrance` participates in an active pair (either side). */
export function isPairedEntrance(entrance: string, zelgaWoods: boolean): boolean {
  return !!getDropdownPairFor(entrance, zelgaWoods);
}

/**
 * The partner of `entrance` within its active pair (drop ↔ door), or undefined
 * if it isn't part of an active pair.
 */
export function getDropdownPartner(entrance: string, zelgaWoods: boolean): string | undefined {
  const pair = getDropdownPairFor(entrance, zelgaWoods);
  if (!pair) return undefined;
  return pair.drop === entrance ? pair.partner : pair.drop;
}

/**
 * Compute the forced partner link implied by linking `entrance` → `to`.
 *
 * When both endpoints belong to active pairs, linking one side forces the
 * partners together: partner(entrance) → partner(to). Returns undefined when
 * either endpoint isn't paired (nothing to force).
 */
export function getForcedPartnerLink(
  entrance: string,
  to: string,
  zelgaWoods: boolean,
): { entrance: string; to: string } | undefined {
  const entrancePartner = getDropdownPartner(entrance, zelgaWoods);
  const toPartner = getDropdownPartner(to, zelgaWoods);
  if (!entrancePartner || !toPartner) return undefined;
  return { entrance: entrancePartner, to: toPartner };
}

/**
 * The selection pool an entrance belongs to, used to restrict valid link
 * targets. Dropdowns may only link to dropdowns; outside insanity a paired door
 * may only link to other paired doors; everything else is "normal".
 */
export type EntrancePool = "dropdown" | "pairedDoor" | "normal";

export function getEntrancePool(entrance: string, entranceMode: string, zelgaWoods: boolean): EntrancePool {
  if (isDropdown(entrance, zelgaWoods)) return "dropdown";
  if (entranceMode !== "insanity" && isPairedEntrance(entrance, zelgaWoods)) return "pairedDoor";
  return "normal";
}

/**
 * Zelga Woods entrance-group overrides (OWR `skullwoods: "followlinked"`).
 *
 * In zelgawoods mode the Skull Woods forest changes shape:
 * - Two NEW drop-downs exist — First Section Hole (North) and Second Section
 *   Hole — which join the normal drop pool (paired with their doors, like
 *   Kakariko Well Drop/Cave).
 * - The southeast holes — First Section Hole (East)/(West) — connect VANILLA
 *   in every mode and must not be shuffled or severed.
 * - The three skull doors join the normal door pool per mode (First Section
 *   Door and Second Section Door (East) as forced partners of the new drops;
 *   Second Section Door (West) as a free pool entrance).
 *
 * Without zelgawoods, the base `entrance_modes` groups (skull_drops /
 * skull_doors) apply unchanged.
 */
const ZELGA_DROP_MODES: Record<string, string> = {
  dungeonssimple: "vanilla",
  dungeonsfull: "vanilla",
  lite: "drops",
  lean: "drops",
  simple: "shuffle",
  restricted: "shuffle",
  full: "shuffle",
  district: "northwest_hyrule",
  swapped: "swap",
  crossed: "shuffle",
  insanity: "shuffle",
  vanilla: "vanilla",
};

const ZELGA_DOOR_MODES: Record<string, string> = {
  dungeonssimple: "vanilla",
  dungeonsfull: "vanilla",
  lite: "shuffle",
  lean: "shuffle",
  simple: "shuffle",
  restricted: "shuffle",
  full: "shuffle",
  district: "northwest_hyrule",
  swapped: "swap",
  crossed: "shuffle",
  insanity: "shuffle",
  vanilla: "vanilla",
};

const ZELGA_VANILLA_MODES: Record<string, string> = {
  dungeonssimple: "vanilla",
  dungeonsfull: "vanilla",
  lite: "vanilla",
  lean: "vanilla",
  simple: "vanilla",
  restricted: "vanilla",
  full: "vanilla",
  district: "vanilla",
  swapped: "vanilla",
  crossed: "vanilla",
  insanity: "vanilla",
  vanilla: "vanilla",
};

const ZELGA_GROUP_OVERRIDES: Record<string, Record<string, string>> = {
  // stay vanilla in every mode
  "Skull Woods First Section Hole (East)": ZELGA_VANILLA_MODES,
  "Skull Woods First Section Hole (West)": ZELGA_VANILLA_MODES,
  // the two new drop-downs behave like a standard drop (cf. Kakariko Well Drop)
  "Skull Woods First Section Hole (North)": ZELGA_DROP_MODES,
  "Skull Woods Second Section Hole": ZELGA_DROP_MODES,
  // Doors behave like a standard door entrance (cf. Kakariko Well Cave)
  "Skull Woods First Section Door": ZELGA_DOOR_MODES,
  "Skull Woods Second Section Door (East)": ZELGA_DOOR_MODES,
  "Skull Woods Second Section Door (West)": ZELGA_DOOR_MODES,
};

/**
 * Resolve the entrance group for an entrance in the given entrance mode,
 * applying Zelga Woods overrides when the setting is enabled. This is the
 * single source of truth — map markers, link-target filtering and the logic
 * graph (entrance severing) must all agree on it.
 */
export function getEntranceGroup(name: string, entranceMode: string, zelgaWoods: boolean): string | null {
  const base = locationsData[name]?.entrance_modes?.[entranceMode] ?? null;
  if (!zelgaWoods) return base;
  const override = ZELGA_GROUP_OVERRIDES[name];
  if (!override) return base;
  return override[entranceMode] ?? base;
}

/**
 * In non-insanity modes a dropdown (hole) and its paired door move together, so
 * the door side is redundant on the map. Returns true when `entrance` is the
 * door (partner) side of an active dropdown pair and should be hidden, leaving
 * only the drop marker (which also removes the tiny drop↔door connector line).
 * Skull Woods is handled automatically: its pairs are only active with the
 * zelgaWoods setting, so in non-zelga modes none of its front entrances hide.
 */
export function isHiddenPairedDoor(entrance: string, entranceMode: string, zelgaWoods: boolean): boolean {
  if (entranceMode === "insanity") return false;
  const pair = getDropdownPairFor(entrance, zelgaWoods);
  return !!pair && pair.partner === entrance;
}
