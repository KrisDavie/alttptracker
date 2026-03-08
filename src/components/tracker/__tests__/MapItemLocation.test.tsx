import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import MapItemLocation from "../MapItemLocation";
import { renderWithStore } from "./renderWithStore";
import type { LogicStatus } from "@/data/logic/logicTypes";

// Mock the hook that MapItemLocation depends on
const mockToggleAllChecks = vi.fn();
const mockResetGroups = vi.fn();
const mockHandleCheckClick = vi.fn();
const mockHandleGroupExpand = vi.fn();

let mockHookReturn = {
  itemLocations: ["Test Location - Chest"],
  itemChecks: {
    "Test Location - Chest": {
      displayName: "Chest",
      status: { checked: false, logic: "unavailable" as LogicStatus, manuallyChecked: false, scoutedItems: [] },
    },
  },
  displayList: [],
  status: "none" as "all" | "some" | "none",
  maxLogicStatus: "unavailable" as LogicStatus,
  handleCheckClick: mockHandleCheckClick,
  handleGroupExpand: mockHandleGroupExpand,
  toggleAllChecks: mockToggleAllChecks,
  resetGroups: mockResetGroups,
  targetName: "Test Location",
};

vi.mock("@/hooks/useLocationTooltipData", () => ({
  useLocationTooltipData: () => mockHookReturn,
}));

const defaultLocation = { x: 100, y: 200, world: "lw" as const, open: true, isDungeon: false, overworld: true, shopsanity: false, pots: false, enemies: false, bonk: false };

describe("MapItemLocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default unchecked/unavailable state
    mockHookReturn = {
      itemLocations: ["Test Location - Chest"],
      itemChecks: {
        "Test Location - Chest": {
          displayName: "Chest",
          status: { checked: false, logic: "unavailable", manuallyChecked: false, scoutedItems: [] },
        },
      },
      displayList: [],
      status: "none",
      maxLogicStatus: "unavailable",
      handleCheckClick: mockHandleCheckClick,
      handleGroupExpand: mockHandleGroupExpand,
      toggleAllChecks: mockToggleAllChecks,
      resetGroups: mockResetGroups,
      targetName: "Test Location",
    };
  });

  it("should use the unavailable background class when the location is unavailable", () => {
    renderWithStore(
      <MapItemLocation name="Test Location" location={defaultLocation} type="item" />,
    );
    const el = document.querySelector(".absolute") as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.className).toContain("bg-status-unavailable");
  });

  it("should use the available background class when the location is available", () => {
    mockHookReturn.maxLogicStatus = "available";
    renderWithStore(
      <MapItemLocation name="Test Location" location={defaultLocation} type="item" />,
    );
    const el = document.querySelector(".absolute") as HTMLElement;
    expect(el.className).toContain("bg-status-available");
  });

  it("should use the possible background class when the location is possible", () => {
    mockHookReturn.maxLogicStatus = "possible";
    renderWithStore(
      <MapItemLocation name="Test Location" location={defaultLocation} type="item" />,
    );
    const el = document.querySelector(".absolute") as HTMLElement;
    expect(el.className).toContain("bg-status-possible");
  });

  it("should use the checked background class when all items are checked", () => {
    mockHookReturn.status = "all";
    mockHookReturn.itemChecks["Test Location - Chest"].status.checked = true;
    renderWithStore(
      <MapItemLocation name="Test Location" location={defaultLocation} type="item" />,
    );
    const el = document.querySelector(".absolute") as HTMLElement;
    expect(el.className).toContain("bg-status-checked");
  });

  it("should apply hatched class when some items are checked", () => {
    mockHookReturn.status = "some";
    renderWithStore(
      <MapItemLocation name="Test Location" location={defaultLocation} type="item" />,
    );
    const el = document.querySelector(".absolute") as HTMLElement;
    expect(el.className).toContain("is-hatched");
  });

  it("should call toggleAllChecks when clicked", async () => {
    const user = userEvent.setup();
    renderWithStore(
      <MapItemLocation name="Test Location" location={defaultLocation} type="item" />,
    );
    const el = document.querySelector(".absolute") as HTMLElement;
    await user.click(el);
    expect(mockToggleAllChecks).toHaveBeenCalledTimes(1);
  });

  it("should be positioned based on location coordinates", () => {
    renderWithStore(
      <MapItemLocation name="Test Location" location={defaultLocation} type="item" />,
    );
    const el = document.querySelector(".absolute") as HTMLElement;
    const xPercent = (100 / 512) * 100;
    const yPercent = (200 / 512) * 100;
    expect(el.style.left).toBe(`${xPercent}%`);
    expect(el.style.top).toBe(`${yPercent}%`);
  });
});
