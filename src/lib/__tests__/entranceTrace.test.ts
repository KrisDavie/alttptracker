import { describe, it, expect } from "vitest";
import { buildEntranceTooltipName } from "../entranceTrace";
import type { EntrancesState, EntranceData } from "@/store/entrancesSlice";

function entrance(partial: Partial<EntranceData> = {}): EntranceData {
  return { checked: false, connector: false, connectorGroup: null, to: null, oneway: false, ...partial };
}

describe("buildEntranceTooltipName", () => {
  it("returns the plain name when the entrance is unlinked", () => {
    const entrances: EntrancesState = { Dam: entrance() };
    expect(buildEntranceTooltipName("Dam", null, entrances)).toBe("Dam");
  });

  it("traces a two-way named connector to its other side's exit", () => {
    const entrances: EntrancesState = {
      Dam: entrance({ to: "Elder House (East)", checked: true }),
      "Misery Mire": entrance({ to: "Elder House (West)", checked: true }),
    };
    expect(buildEntranceTooltipName("Dam", "Elder House (East)", entrances)).toBe(
      "Dam → Elder House (East)\nConnectors:\nElder House (West) → Misery Mire",
    );
  });

  it("marks unresolved sides as unlinked", () => {
    const entrances: EntrancesState = {
      Dam: entrance({ to: "Elder House (East)", checked: true }),
    };
    expect(buildEntranceTooltipName("Dam", "Elder House (East)", entrances)).toBe(
      "Dam → Elder House (East)\nConnectors:\nElder House (West) → unlinked",
    );
  });

  it("lists every other side for a multi-way connector", () => {
    const entrances: EntrancesState = {
      A: entrance({ to: "Turtle Rock", checked: true }),
      B: entrance({ to: "Dark Death Mountain Ledge (West)", checked: true }),
      C: entrance({ to: "Dark Death Mountain Ledge (East)", checked: true }),
      D: entrance({ to: "Turtle Rock Isolated Ledge Entrance", checked: true }),
    };
    expect(buildEntranceTooltipName("A", "Turtle Rock", entrances)).toBe(
      "A → Turtle Rock\nConnectors:\nDark Death Mountain Ledge (West) → B\nDark Death Mountain Ledge (East) → C\nTurtle Rock Isolated Ledge Entrance → D",
    );
  });

  it("links generic connectors directly to the other endpoint", () => {
    const entrances: EntrancesState = {
      Dam: entrance({ to: "Generic Connector 1", connectorGroup: 1, checked: true }),
      "Misery Mire": entrance({ to: "Generic Connector 1", connectorGroup: 1, checked: true }),
    };
    expect(buildEntranceTooltipName("Dam", "Generic Connector 1", entrances)).toBe(
      "Dam → Generic Connector\nConnectors:\nMisery Mire",
    );
  });

  it("falls back to a plain arrow for unknown connectors", () => {
    const entrances: EntrancesState = { Dam: entrance({ to: "Unknown Connector 2" }) };
    expect(buildEntranceTooltipName("Dam", "Unknown Connector 2", entrances)).toBe("Dam → Unknown Connector 2");
  });
});
