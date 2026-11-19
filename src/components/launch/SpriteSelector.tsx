import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import SPRITE_NAMES from "@/data/spriteNames";
import { prettifySpriteName } from "@/lib/launchHelpers";
import type { RomSprite } from "@/lib/readRomSprite";
import { SettingSwitch } from "./SettingControls";

interface SpriteSelectorProps {
  spriteName: string;
  setSpriteName: (name: string) => void;
  spriteFromRom: boolean;
  setSpriteFromRom: (fromRom: boolean) => void;
  /** The sprite read from the connected autotracker's ROM; null while not connected */
  romSprite: RomSprite | null;
  recentSprites: string[];
}

export function SpriteSelector({ spriteName, setSpriteName, spriteFromRom, setSpriteFromRom, romSprite, recentSprites }: SpriteSelectorProps) {
  const [spriteSearch, setSpriteSearch] = useState("");
  // Off without a ROM to read, keeping the saved preference for when there is one
  const usesRom = romSprite !== null && spriteFromRom;
  const preview = (variant: string) => (usesRom && romSprite.images[variant]) || `/sprites/${spriteName}_${variant}.png`;

  const filteredSprites = useMemo(() => {
    if (!spriteSearch) return SPRITE_NAMES;
    const q = spriteSearch.toLowerCase();
    return SPRITE_NAMES.filter((s: string) => s.toLowerCase().includes(q)).slice(0, 60);
  }, [spriteSearch]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Sprite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Preview */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <img
              src={preview("tunic1")}
              alt={spriteName}
              className="w-16 h-16 mx-auto"
              style={{ imageRendering: "pixelated" }}
            />
            <span className="text-[10px] text-muted-foreground mt-1 block">Normal</span>
          </div>
          <div className="text-center">
            <img
              src={preview("tunicbunny1")}
              alt={`${spriteName} bunny`}
              className="w-16 h-16 mx-auto"
              style={{ imageRendering: "pixelated" }}
            />
            <span className="text-[10px] text-muted-foreground mt-1 block">Bunny</span>
          </div>
        </div>
        <div className="text-center text-xs font-medium">{usesRom ? (romSprite.name ? prettifySpriteName(romSprite.name) : "ROM sprite") : prettifySpriteName(spriteName)}</div>
        <SettingSwitch
          label="Use the ROM's sprite when autotracking"
          checked={usesRom}
          onChange={setSpriteFromRom}
          disabled={romSprite === null}
          description={
            romSprite === null
              ? "Connect the autotracker to a device with a ROM loaded to use the sprite from the ROM."
              : "Autotracking reads the sprite from the ROM and shows it in place of a chosen sprite."
          }
        />

        {/* Recent sprites quick-select */}
        {!usesRom && recentSprites.length > 0 && (
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Recent</Label>
            <div className="flex items-center gap-1.5">
              {recentSprites.map((name) => (
                <button
                  key={name}
                  onClick={() => setSpriteName(name)}
                  className={`w-10 h-10 rounded-sm border transition-all cursor-pointer ${name === spriteName ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
                  title={prettifySpriteName(name)}
                >
                  <img
                    src={`/sprites/${name}_tunic1.png`}
                    alt={name}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {!usesRom && (
          <>
            <Input
              placeholder="Search sprites..."
              value={spriteSearch}
              onChange={(e) => setSpriteSearch(e.target.value)}
              className="h-7 text-xs"
            />
            <ScrollArea className="flex-1 min-h-40">
              <div className="grid grid-cols-5 gap-1 p-0.5">
                {filteredSprites.map((name: string) => (
                  <button
                    key={name}
                    onClick={() => setSpriteName(name)}
                    className={`aspect-square rounded-sm border transition-all cursor-pointer ${name === spriteName ? "border-primary bg-primary/10" : "border-transparent hover:bg-muted"}`}
                    title={prettifySpriteName(name)}
                  >
                    <img
                      src={`/sprites/${name}_tunic1.png`}
                      alt={name}
                      className="w-full h-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}
