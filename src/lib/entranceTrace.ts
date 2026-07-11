import { entranceConnectorGroups } from "@/data/entranceConnections";
import type { EntrancesState } from "@/store/entrancesSlice";

/** Find the named connector group that contains the given connector side, if any. */
function findConnectorGroupBySide(side: string) {
  return Object.values(entranceConnectorGroups).find((g) => g.entrances.includes(side));
}

/** Find the overworld entrance that the player exits at when leaving the given connector side. */
function findEntranceLinkingTo(side: string, entrances: EntrancesState): string | undefined {
  return Object.keys(entrances).find((name) => entrances[name]?.to === side);
}

/**
 * Build a human-readable tooltip name for an entrance.
 *
 * For connector entrances this traces where the other side(s) of the connector
 * drop the player back out into the overworld. The result is a multi-line
 * string (newline-separated): the first line is the entrance the player walks
 * into, followed by a "Connectors:" header and one line per other side, e.g.:
 *   Dam → Elder House (East)
 *   Connectors:
 *   Elder House (West) → Misery Mire
 *
 * Multi-way connectors (3/4 sides such as Turtle Rock) list every other side
 * on its own line under "Connectors:".
 */
export function buildEntranceTooltipName(locName: string, to: string | null | undefined, entrances: EntrancesState): string {
  if (!to) return locName;

  // Named connector (e.g. Elder House (East) / (West)): trace through to the other sides.
  const group = findConnectorGroupBySide(to);
  if (group) {
    const otherSides = group.entrances.filter((s) => s !== to);
    if (otherSides.length === 0) return `${locName} → ${to}`;
    const lines = otherSides.map((side) => {
      const exit = findEntranceLinkingTo(side, entrances);
      return `${side} → ${exit ?? "unlinked"}`;
    });
    return [`${locName} → ${to}`, "Connectors:", ...lines].join("\n");
  }

  // Generic connector: other endpoints share the same connectorGroup. There is
  // no named intermediate, so list the other endpoint(s) under a generic label.
  if (to.startsWith("Generic Connector")) {
    const groupId = entrances[locName]?.connectorGroup;
    if (groupId != null) {
      const others = Object.keys(entrances).filter((name) => name !== locName && entrances[name]?.connectorGroup === groupId);
      if (others.length > 0) return [`${locName} → Generic Connector`, "Connectors:", ...others].join("\n");
    }
    return `${locName} → ${to}`;
  }

  // Unknown connector or plain (non-connector) link.
  return `${locName} → ${to}`;
}
