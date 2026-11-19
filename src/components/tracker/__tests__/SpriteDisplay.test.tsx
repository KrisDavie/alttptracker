import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import SpriteDisplay from "../SpriteDisplay";
import { renderWithStore, createTestStore } from "./renderWithStore";
import { setItemCount } from "@/store/itemsSlice";
import { setRomSprite } from "@/store/autotrackerSlice";
import { setSettings } from "@/store/settingsSlice";

function getSpriteEl() {
  return document.querySelector("[style*='background-image']") as HTMLElement;
}

describe("SpriteDisplay", () => {
  it("should show bunny sprite when moonpearl is not collected", () => {
    renderWithStore(<SpriteDisplay />);
    // No moonpearl: bunny sprite, mail collected=0 so index = 0+1 = 1
    expect(getSpriteEl().style.backgroundImage).toContain("link_tunicbunny1.png");
  });

  it("should show normal sprite when moonpearl is collected", () => {
    const store = createTestStore();
    store.dispatch(setItemCount({ itemName: "moonpearl", count: 1 }));
    renderWithStore(<SpriteDisplay />, { store });

    const bg = getSpriteEl().style.backgroundImage;
    expect(bg).toContain("link_tunic1.png");
    expect(bg).not.toContain("bunny");
  });

  it("should show the ROM's sprite once autotracking has read it", () => {
    const store = createTestStore();
    store.dispatch(setItemCount({ itemName: "moonpearl", count: 1 }));
    store.dispatch(setItemCount({ itemName: "mail", count: 1 }));
    store.dispatch(setRomSprite({ tunic2: "data:image/png;base64,ROMBLUE", tunicbunny2: "data:image/png;base64,ROMBUNNY" }));
    renderWithStore(<SpriteDisplay spriteName="zelda" />, { store });
    expect(getSpriteEl().style.backgroundImage).toContain("ROMBLUE");
  });

  it("should show the chosen sprite when the ROM's is turned off", () => {
    const store = createTestStore();
    store.dispatch(setRomSprite({ tunicbunny1: "data:image/png;base64,ROMBUNNY" }));
    store.dispatch(setSettings({ spriteFromRom: false }));
    renderWithStore(<SpriteDisplay spriteName="zelda" />, { store });
    expect(getSpriteEl().style.backgroundImage).toContain("zelda_tunicbunny1.png");
  });

  it("should use custom spriteName in image path", () => {
    renderWithStore(<SpriteDisplay spriteName="zelda" />);
    expect(getSpriteEl().style.backgroundImage).toContain("zelda_tunicbunny1.png");
  });

  it("should increment mail level on click", async () => {
    const user = userEvent.setup();
    renderWithStore(<SpriteDisplay />);
    const el = getSpriteEl();
    expect(el.style.backgroundImage).toContain("tunicbunny1.png");

    await user.click(el);
    // mail goes from 0 to 1, sprite index = 1+1 = 2
    expect(el.style.backgroundImage).toContain("tunicbunny2.png");
  });

  it("should decrement mail level on right-click", async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    store.dispatch(setItemCount({ itemName: "mail", count: 1 }));
    renderWithStore(<SpriteDisplay />, { store });

    const el = getSpriteEl();
    // mail=1, sprite index = 1+1 = 2
    expect(el.style.backgroundImage).toContain("tunicbunny2.png");

    await user.pointer({ target: el, keys: "[MouseRight]" });
    // mail goes from 1 to 0, sprite index = 0+1 = 1
    expect(el.style.backgroundImage).toContain("tunicbunny1.png");
  });

  it("should wrap around to max when decrementing from 0", async () => {
    const user = userEvent.setup();
    renderWithStore(<SpriteDisplay />);
    const el = getSpriteEl();
    expect(el.style.backgroundImage).toContain("tunicbunny1.png");

    await user.pointer({ target: el, keys: "[MouseRight]" });
    // mail=0, decrement: newCount=-1, wraps to maxCount=2, sprite index = 2+1 = 3
    expect(el.style.backgroundImage).toContain("tunicbunny3.png");
  });
});
