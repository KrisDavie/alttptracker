import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import ChestCounter from "../ChestCounter";
import { renderWithStore, createTestStore } from "./renderWithStore";
import { setBigKey, incrementSmallKeyCount } from "@/store/dungeonsSlice";

function getCountEl() {
  // The inner div holding the number sits inside the chest sprite container.
  // It's the descendant containing only the numeric text.
  return document.querySelector("div.font-roboto") as HTMLElement;
}

describe("ChestCounter", () => {
  it("right-clicking on a fresh counter marks all chests collected (display = 0)", async () => {
    const user = userEvent.setup();
    renderWithStore(<ChestCounter dungeon="toh" />);
    const el = getCountEl();
    // Initial display equals total locations minus dungeon items (per default settings).
    expect(Number(el.textContent)).toBeGreaterThan(0);

    await user.pointer({ target: el, keys: "[MouseRight]" });

    expect(el.textContent).toBe("0");
  });

  it("right-click does not display 1 when big key tracked but location not checked (Bug 1 regression)", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    // Simulate the player tracking the big key manually without the location
    // being checked. Previously this drove `numChecks` negative and made the
    // chest counter unable to reach 0.
    store.dispatch(setBigKey({ dungeon: "toh", hasBigKey: true }));
    store.dispatch(incrementSmallKeyCount({ dungeon: "toh", decrement: false }));
    renderWithStore(<ChestCounter dungeon="toh" />, { store });
    const el = getCountEl();

    await user.pointer({ target: el, keys: "[MouseRight]" });

    expect(el.textContent).toBe("0");
  });

  it("left-clicking through the counter eventually reaches 0", () => {
    renderWithStore(<ChestCounter dungeon="toh" />);
    const el = getCountEl();
    const start = Number(el.textContent);
    expect(start).toBeGreaterThan(0);

    // userEvent is slow per-click; use fireEvent for the loop.
    for (let i = 0; i < start; i++) {
      fireEvent.click(el);
    }

    expect(el.textContent).toBe("0");
  });

  it("left-clicking past 0 wraps back to the full count", () => {
    renderWithStore(<ChestCounter dungeon="toh" />);
    const el = getCountEl();
    const start = Number(el.textContent);

    for (let i = 0; i < start; i++) fireEvent.click(el);
    expect(el.textContent).toBe("0");

    fireEvent.click(el);
    expect(Number(el.textContent)).toBe(start);
  });

  it("EP shows 3 chests by default (6 chests minus 3 dungeon items, no phantom prize subtraction)", () => {
    // EP totalLocations: chests=6, bigkey=true, map=true, compass=true,
    // prize=true (vanilla). Default settings: wildBigKeys=false, wildMaps=false,
    // wildCompasses=false, prizeShuffle=vanilla. The prize is NOT in
    // dungeonChecks (locationMapper filters it out for vanilla), so we should
    // subtract only big key + map + compass = 3 \u2192 display = 3.
    renderWithStore(<ChestCounter dungeon="ep" />);
    const el = getCountEl();
    expect(Number(el.textContent)).toBe(3);
  });
});
