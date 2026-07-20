import { describe, it, expect } from "vitest";
import {
  getDropdownPartner,
  isDropdown,
  isPairedEntrance,
  getEntrancePool,
  getForcedPartnerLink,
  isHiddenPairedDoor,
} from "@/lib/dropdowns";
import reducer, { setEntranceLink } from "@/store/entrancesSlice";

const initial = () => reducer(undefined, { type: "@@INIT" });

describe("dropdown helpers", () => {
  it("resolves partners on both sides of a pair", () => {
    expect(getDropdownPartner("Kakariko Well Drop", false)).toBe("Kakariko Well Cave");
    expect(getDropdownPartner("Kakariko Well Cave", false)).toBe("Kakariko Well Drop");
    expect(getDropdownPartner("Sanctuary", false)).toBe("Sanctuary Grave");
  });

  it("identifies the dropdown (hole) side only", () => {
    expect(isDropdown("Kakariko Well Drop", false)).toBe(true);
    expect(isDropdown("Kakariko Well Cave", false)).toBe(false);
    expect(isPairedEntrance("Kakariko Well Cave", false)).toBe(true);
    expect(isPairedEntrance("Dam", false)).toBe(false);
  });

  it("gates zelgaWoods pairs on the setting", () => {
    expect(isDropdown("Skull Woods Second Section Hole", false)).toBe(false);
    expect(getDropdownPartner("Skull Woods Second Section Hole", false)).toBeUndefined();
    expect(isDropdown("Skull Woods Second Section Hole", true)).toBe(true);
    expect(getDropdownPartner("Skull Woods Second Section Hole", true)).toBe("Skull Woods Second Section Door (East)");
  });

  it("assigns selection pools, with insanity decoupling paired doors", () => {
    expect(getEntrancePool("Kakariko Well Drop", "crossed", false)).toBe("dropdown");
    expect(getEntrancePool("Kakariko Well Cave", "crossed", false)).toBe("pairedDoor");
    expect(getEntrancePool("Kakariko Well Cave", "insanity", false)).toBe("normal");
    // Dropdowns stay their own pool even in insanity.
    expect(getEntrancePool("Kakariko Well Drop", "insanity", false)).toBe("dropdown");
    expect(getEntrancePool("Dam", "crossed", false)).toBe("normal");
  });

  it("computes the forced partner link", () => {
    expect(getForcedPartnerLink("Kakariko Well Cave", "Sanctuary", false)).toEqual({
      entrance: "Kakariko Well Drop",
      to: "Sanctuary Grave",
    });
    // No forcing when either side isn't paired.
    expect(getForcedPartnerLink("Dam", "Sanctuary", false)).toBeUndefined();
  });

  it("hides the paired door (cave) side but never the drop, outside insanity", () => {
    // Door side is hidden; drop side stays visible.
    expect(isHiddenPairedDoor("Kakariko Well Cave", "crossed", false)).toBe(true);
    expect(isHiddenPairedDoor("Kakariko Well Drop", "crossed", false)).toBe(false);
    // Unpaired entrances are never hidden.
    expect(isHiddenPairedDoor("Dam", "crossed", false)).toBe(false);
    // Insanity keeps both sides (they shuffle independently).
    expect(isHiddenPairedDoor("Kakariko Well Cave", "insanity", false)).toBe(false);
  });

  it("only hides Skull Woods doors when zelgaWoods is enabled", () => {
    // Non-zelga: Skull Woods front entrances form a shuffle pool — nothing hidden.
    expect(isHiddenPairedDoor("Skull Woods First Section Door", "crossed", false)).toBe(false);
    expect(isHiddenPairedDoor("Skull Woods Second Section Door (East)", "crossed", false)).toBe(false);
    // Zelga: the two zelga pairs hide their door side, showing the drop.
    expect(isHiddenPairedDoor("Skull Woods First Section Door", "crossed", true)).toBe(true);
    expect(isHiddenPairedDoor("Skull Woods Second Section Door (East)", "crossed", true)).toBe(true);
    expect(isHiddenPairedDoor("Skull Woods First Section Hole (North)", "crossed", true)).toBe(false);
    expect(isHiddenPairedDoor("Skull Woods Second Section Hole", "crossed", true)).toBe(false);
    // The vanilla southeast holes are not part of a pair, so never hidden.
    expect(isHiddenPairedDoor("Skull Woods First Section Hole (East)", "crossed", true)).toBe(false);
    expect(isHiddenPairedDoor("Skull Woods First Section Hole (West)", "crossed", true)).toBe(false);
  });
});

describe("setEntranceLink forced pairing", () => {
  it("auto-links the paired drop when a door is linked (non-insanity)", () => {
    const s = reducer(initial(), setEntranceLink({ entrance: "Kakariko Well Cave", to: "Sanctuary", zelgaWoods: false, entranceMode: "crossed" }));
    expect(s["Kakariko Well Cave"].to).toBe("Sanctuary");
    expect(s["Kakariko Well Drop"].to).toBe("Sanctuary Grave");
    expect(s["Kakariko Well Drop"].checked).toBe(true);
  });

  it("auto-links the paired door when a drop is linked", () => {
    const s = reducer(initial(), setEntranceLink({ entrance: "Kakariko Well Drop", to: "Sanctuary Grave", zelgaWoods: false, entranceMode: "crossed" }));
    expect(s["Kakariko Well Cave"].to).toBe("Sanctuary");
  });

  it("clears the partner when one side is unlinked", () => {
    const linked = reducer(initial(), setEntranceLink({ entrance: "Kakariko Well Cave", to: "Sanctuary", zelgaWoods: false, entranceMode: "crossed" }));
    const cleared = reducer(linked, setEntranceLink({ entrance: "Kakariko Well Cave", to: null, zelgaWoods: false, entranceMode: "crossed" }));
    expect(cleared["Kakariko Well Cave"].to).toBeNull();
    expect(cleared["Kakariko Well Drop"].to).toBeNull();
    expect(cleared["Kakariko Well Drop"].checked).toBe(false);
  });

  it("does not force pairing in insanity mode", () => {
    const s = reducer(initial(), setEntranceLink({ entrance: "Kakariko Well Cave", to: "Sanctuary", zelgaWoods: false, entranceMode: "insanity" }));
    expect(s["Kakariko Well Cave"].to).toBe("Sanctuary");
    expect(s["Kakariko Well Drop"].to).toBeNull();
  });

  it("does not pair zelgaWoods holes unless enabled", () => {
    const off = reducer(initial(), setEntranceLink({ entrance: "Skull Woods Second Section Door (East)", to: "Sanctuary", zelgaWoods: false, entranceMode: "crossed" }));
    expect(off["Skull Woods Second Section Hole"].to).toBeNull();

    const on = reducer(initial(), setEntranceLink({ entrance: "Skull Woods Second Section Hole", to: "Sanctuary Grave", zelgaWoods: true, entranceMode: "crossed" }));
    expect(on["Skull Woods Second Section Door (East)"].to).toBe("Sanctuary");
  });
});
