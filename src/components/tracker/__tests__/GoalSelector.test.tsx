import { describe, it, expect } from "vitest";
import GoalSelector from "@/components/tracker/GoalSelector";
import { renderWithStore, createTestStore } from "@/components/tracker/__tests__/renderWithStore";
import { setSettings, initialState as settingsInitialState } from "@/store/settingsSlice";
import type { goalTypes, ganonVulnerableTypes } from "@/store/settingsSlice";

/**
 * Regression tests: GoalSelector used to crash (options[curOption].img on
 * undefined) for goals without an options entry — notably "ganonhunt" (used
 * by shipped presets such as Crosshunt), "ad", "completionist", and
 * ganon/fast_ganon combined with ganonVulnerable "other".
 */

function renderGoal(goal: goalTypes, ganonVulnerable?: ganonVulnerableTypes) {
  const store = createTestStore();
  store.dispatch(setSettings({ goal, ...(ganonVulnerable ? { ganonVulnerable } : {}) }));
  return renderWithStore(<GoalSelector type="goal" />, { store });
}

describe("GoalSelector", () => {
  it("renders the ganonhunt goal without crashing and shows its icon", () => {
    const { container } = renderGoal("ganonhunt", "other");
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img!.getAttribute("src")).toBe("/dungeons/ganonhunt.png");
  });

  it("renders the ad (all dungeons) goal without crashing", () => {
    const { container } = renderGoal("ad");
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img!.getAttribute("src")).toBe("/dungeons/alldungeons.png");
  });

  it("renders the completionist goal without crashing", () => {
    const { container } = renderGoal("completionist");
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img!.getAttribute("src")).toBe("/dungeons/ganon_completionist.png");
  });

  it("falls back to the plain goal icon for ganonVulnerable combos without an icon", () => {
    const { container } = renderGoal("fast_ganon", "other");
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img!.getAttribute("src")).toBe("/dungeons/fast_ganon_random.png");
  });

  it("still renders every known goal/vulnerability combination", () => {
    const vulns = settingsInitialState.ganonVulnerable; // sanity: field exists
    expect(vulns).toBeDefined();
    for (const goal of ["ganon", "fast_ganon"] as goalTypes[]) {
      for (const vuln of ["random", "0", "7", "ad", "triforce", "completionist"] as ganonVulnerableTypes[]) {
        const { container, unmount } = renderGoal(goal, vuln);
        const img = container.querySelector("img");
        expect(img, `goal=${goal} vuln=${vuln}`).toBeTruthy();
        expect(img!.getAttribute("src")).toBe(`/dungeons/${goal}_${vuln}.png`);
        unmount();
      }
    }
  });
});
