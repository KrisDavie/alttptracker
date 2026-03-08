import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import TrackerItem from "../TrackerItem";
import { renderWithStore, createTestStore } from "./renderWithStore";
import { setItemCount } from "@/store/itemsSlice";

function getItemEl() {
  return document.querySelector("[style*='opacity']") as HTMLElement;
}

describe("TrackerItem", () => {
  it("should display opacity 0.3 when the item is not collected", () => {
    renderWithStore(<TrackerItem itemName="hookshot" />);
    expect(getItemEl().style.opacity).toBe("0.3");
  });

  it("should display opacity 1 when the item is collected", () => {
    const store = createTestStore();
    store.dispatch(setItemCount({ itemName: "hookshot", count: 1 }));
    renderWithStore(<TrackerItem itemName="hookshot" />, { store });
    expect(getItemEl().style.opacity).toBe("1");
  });

  it("should become collected (opacity 1) after a single click", async () => {
    const user = userEvent.setup();
    renderWithStore(<TrackerItem itemName="hookshot" />);
    const el = getItemEl();
    expect(el.style.opacity).toBe("0.3");

    await user.click(el);

    expect(el.style.opacity).toBe("1");
  });

  it("should show the correct background image for the collected amount", async () => {
    const user = userEvent.setup();
    renderWithStore(<TrackerItem itemName="bow" />);
    const el = getItemEl();
    // bow uncollected (collected=0): images[max(0, 0-1)] = images[0] = bow0.png
    expect(el.style.backgroundImage).toContain("bow0.png");

    await user.click(el);
    // collected=1: images[max(0, 1-1)] = images[0] = bow0.png
    expect(el.style.backgroundImage).toContain("bow0.png");

    await user.click(el);
    // collected=2: images[max(0, 2-1)] = images[1] = bow1.png
    expect(el.style.backgroundImage).toContain("bow1.png");
  });

  it("should decrement on right-click", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(setItemCount({ itemName: "bow", count: 2 }));
    renderWithStore(<TrackerItem itemName="bow" />, { store });

    const el = getItemEl();
    expect(el.style.opacity).toBe("1");

    await user.pointer({ target: el, keys: "[MouseRight]" });
    // 2 -> 1, still collected
    expect(el.style.opacity).toBe("1");
    expect(el.style.backgroundImage).toContain("bow0.png");
  });
});
