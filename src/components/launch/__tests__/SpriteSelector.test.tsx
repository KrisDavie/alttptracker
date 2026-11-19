import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpriteSelector } from "../SpriteSelector";

const ROM_SPRITE = { images: { tunic1: "data:rom-link", tunicbunny1: "data:rom-bunny" }, name: null };

function renderSelector(props: Partial<React.ComponentProps<typeof SpriteSelector>> = {}) {
  const setSpriteFromRom = vi.fn();
  render(
    <TooltipProvider>
      <SpriteSelector spriteName="link" setSpriteName={vi.fn()} spriteFromRom setSpriteFromRom={setSpriteFromRom} romSprite={null} recentSprites={[]} {...props} />
    </TooltipProvider>,
  );
  return { setSpriteFromRom, toggle: screen.getByRole("switch") };
}

describe("SpriteSelector", () => {
  it("disables and turns off the ROM sprite without a connected ROM, keeping the choices", () => {
    const { toggle } = renderSelector();
    expect(toggle.hasAttribute("data-disabled")).toBe(true);
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(screen.getAllByAltText("link")[0].getAttribute("src")).toBe("/sprites/link_tunic1.png");
    expect(screen.getByPlaceholderText("Search sprites...")).toBeTruthy();
  });

  it("shows the ROM's sprite and hides the choices once connected with the preference on", () => {
    const { toggle } = renderSelector({ romSprite: ROM_SPRITE });
    expect(toggle.hasAttribute("data-disabled")).toBe(false);
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    expect(screen.getAllByAltText("link")[0].getAttribute("src")).toBe("data:rom-link");
    expect(screen.getByAltText("link bunny").getAttribute("src")).toBe("data:rom-bunny");
    expect(screen.queryByPlaceholderText("Search sprites...")).toBeNull();
    expect(screen.getByText("ROM sprite")).toBeTruthy();
  });

  it("names the ROM's sprite when it's a bundled one", () => {
    renderSelector({ romSprite: { ...ROM_SPRITE, name: "zelda" } });
    expect(screen.getByText("Zelda")).toBeTruthy();
  });

  it("keeps the chosen sprite when connected with the preference off", async () => {
    const { toggle, setSpriteFromRom } = renderSelector({ romSprite: ROM_SPRITE, spriteFromRom: false });
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(screen.getAllByAltText("link")[0].getAttribute("src")).toBe("/sprites/link_tunic1.png");
    expect(screen.getByPlaceholderText("Search sprites...")).toBeTruthy();
    await userEvent.click(toggle);
    expect(setSpriteFromRom.mock.calls[0][0]).toBe(true);
  });
});
