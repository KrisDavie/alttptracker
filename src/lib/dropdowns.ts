import { dropdownLinks } from "@/data/dropdownData";

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
