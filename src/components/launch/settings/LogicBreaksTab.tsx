import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import type { SettingsState, UserSequenceBreaks } from "@/store/settingsSlice";

// ---------------------------------------------------------------------------
// Logic break definitions
// ---------------------------------------------------------------------------

interface LogicBreak {
  id: keyof UserSequenceBreaks;
  label: string;
  tooltip: string;
}

const DUNGEON_LOGIC: LogicBreak[] = [
  { id: "canNavigateDarkRooms", label: "Dark Room Navigation", tooltip: "Navigate dark rooms without a light source (lamp/firerod)" },
  { id: "canIceBreak", label: "Ice Breaker", tooltip: "Use somaria to clip through the wall in IP Big Key Chest Room" },
  // { id: "canHookClip", label: "Hook Clip", tooltip: "Use the hookshot to clip through walls" },
  { id: "canBombJump", label: "Bomb Jumps", tooltip: "Use bomb recoil to cross gaps" },
  // { id: "canBombOrBonkCameraUnlock", label: "Bonk/Bomb Camera Unlock", tooltip: "Use to get past double Pokeys without a weapon" },
  { id: "canHover", label: "Hover", tooltip: "Use boots + Pegasus to hover across gaps" },
  // { id: "canHoverAlot", label: "Long Hovers", tooltip: "Extended hovering across longer gaps" },
  // { id: "canSpeckyClip", label: "Specky Clip", tooltip: "Bypass flooding the first trench in Swamp Palace" },
  // { id: "canFireSpooky", label: "Spooky Action", tooltip: "Use the firerod for spooky action" },
  // { id: "canBombSpooky", label: "Bomb Spooky", tooltip: "Hit switches in other quadrants with bombs" },
  // { id: "canHeraPot", label: "Herapot", tooltip: "Get to the top of Hera with the hookshot and no Big Key" },
  // { id: "canMimicClip", label: "Mimic Clip", tooltip: "Clip Mimics into walls to bypass kill rooms without the bow" },
  // { id: "canPotionCameraUnlock", label: "Potion Camera Unlock", tooltip: "Bypass Mimic kill rooms in front of PoD" },
  // { id: "canMoldormBounce", label: "Moldorm Bounce", tooltip: "Get to Aga 2 without the hookshot" },
  // { id: "canTorchRoomNavigateBlind", label: "Lightless Torch Room Navigation", tooltip: "Navigate rooms with torches with no light sources" },
];

const OVERWORLD_LOGIC: LogicBreak[] = [
  // { id: "canFairyReviveHover", label: "Fairy Revive Hover", tooltip: "Hover to EDM with a fairy revival" },
  // { id: "canFakeFlipper", label: "Fake Flippers", tooltip: "Enter water without flippers" },
  // { id: "canOWFairyRevive", label: "OW Fairy Revival", tooltip: "Become link by dying as a bunny over deep water and have a fairy revive you" },
  // { id: "canQirnJump", label: "Qirn Jump", tooltip: "Get to East Dark World without the hammer, flippers or killing Aga 1" },
  // { id: "canMirrorSuperBunny", label: "Mirror Super Bunny", tooltip: "Get superbunny state by using the mirror on the same frame as entering a cave" },
  { id: "canSuperBunny", label: "Mirror Super Bunny", tooltip: "Enter caves/dungeons as superbunny by mirror-canceling on the frame of entry. Sequence break in No Glitches; in logic for glitched modes." },
  // { id: "canDungeonBunnyRevive", label: "Dungeon Bunny Revive", tooltip: "Die in a dungeon as a bunny to become link" },
  // { id: "canFakePowder", label: "Fake Powder", tooltip: "Use somaria with no magic and the mushroom to use powder" },
  // { id: "canWaterWalk", label: "Water Walk", tooltip: "Walk on water using precise movement" },
  // { id: "canZoraSplashDelete", label: "Zora Splash Delete", tooltip: "Get the Zora ledge item with a splash delete" },
  // { id: "canBunnyPocket", label: "Bunny Pocket", tooltip: "Use items in the overworld as a bunny" },
  // { id: "canFairyBarrierRevive", label: "Fairy Barrier Revive", tooltip: "Bypass the Aga 1 barrier with a fairy revive" },
  // { id: "canShockBlock", label: "Shock Block", tooltip: "Use Somaria to bypass the Aga 1 barrier" },
  // { id: "canTombRaider", label: "Tomb Raider", tooltip: "Use hookshot to access King's Tomb from Graveyard Ledge" },
];

const GLITCH_LOGIC: LogicBreak[] = [
  // { id: "canTamSwam", label: "Swim Clip", tooltip: "Clip through terrain while swimming" },
  // { id: "canBunnyCitrus", label: "Bunny Citrus", tooltip: "Can citrus clip as a bunny" },
  // { id: "canMirrorWrap", label: "Mirror Wrap", tooltip: "Wrap the screen using the mirror" },
];

function createAllBreaksState(value: boolean): Partial<UserSequenceBreaks> {
  const state: Partial<UserSequenceBreaks> = {};
  for (const b of [...DUNGEON_LOGIC, ...OVERWORLD_LOGIC, ...GLITCH_LOGIC]) {
    state[b.id] = value;
  }
  return state;
}

function createNothingStupidState(): Partial<UserSequenceBreaks> {
  const state = createAllBreaksState(true);
  state.canHoverAlot = false;
  state.canFairyReviveHover = false;
  state.canOWFairyRevive = false;
  return state;
}

function createBasicState(): Partial<UserSequenceBreaks> {
  const state = createAllBreaksState(true);
  state.canHover = false;
  state.canHoverAlot = false;
  state.canFairyReviveHover = false;
  state.canOWFairyRevive = false;
  return state;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function LogicBreakRow({ b, checked, onToggle }: { b: LogicBreak; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" id={b.id} checked={checked} onChange={onToggle} className="rounded-sm border-input accent-primary cursor-pointer" />
      <label htmlFor={b.id} className="text-xs cursor-pointer flex-1">
        {b.label}
      </label>
      <Tooltip>
        <TooltipTrigger>
          <Info className="size-3 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="max-w-64">{b.tooltip}</TooltipContent>
      </Tooltip>
    </div>
  );
}

function LogicColumn({ title, subtitle, breaks, sequenceBreaks, onToggle }: { title: string; subtitle?: string; breaks: LogicBreak[]; sequenceBreaks: UserSequenceBreaks; onToggle: (id: keyof UserSequenceBreaks) => void }) {
  return (
    <div>
      <h4 className="text-xs font-semibold mb-2">{title}</h4>
      {subtitle && <p className="text-[10px] text-muted-foreground mb-2">{subtitle}</p>}
      <div className="space-y-1">
        {breaks.map((b) => (
          <LogicBreakRow key={b.id} b={b} checked={sequenceBreaks[b.id] ?? false} onToggle={() => onToggle(b.id)} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main tab component
// ---------------------------------------------------------------------------

interface LogicBreaksTabProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

export function LogicBreaksTab({ settings, updateSetting }: LogicBreaksTabProps) {
  const toggleBreak = (id: keyof UserSequenceBreaks) => {
    updateSetting("sequenceBreaks", { ...settings.sequenceBreaks, [id]: !settings.sequenceBreaks[id] });
  };

  const applyPreset = (preset: "all" | "nostupid" | "basic" | "none") => {
    let overrides: Partial<UserSequenceBreaks>;
    switch (preset) {
      case "all":
        overrides = createAllBreaksState(true);
        break;
      case "nostupid":
        overrides = createNothingStupidState();
        break;
      case "basic":
        overrides = createBasicState();
        break;
      case "none":
        overrides = createAllBreaksState(false);
        break;
    }
    updateSetting("sequenceBreaks", { ...settings.sequenceBreaks, ...overrides });
  };

  return (
    <TabsContent value="logicbreaks" className="flex-1 flex flex-col mt-2 outline-none">
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Logic / Sequence Breaks</CardTitle>
          <CardDescription>Configure which sequence breaks and glitch techniques the tracker logic should consider reachable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => applyPreset("all")}>
              All
            </Button>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => applyPreset("nostupid")}>
                  Nothing Stupid
                </Button>
              </TooltipTrigger>
              <TooltipContent>Removes long hovers and bunny fairy revivals</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => applyPreset("basic")}>
                  Basic
                </Button>
              </TooltipTrigger>
              <TooltipContent>Removes all hovers and bunny fairy revivals</TooltipContent>
            </Tooltip>
            <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => applyPreset("none")}>
              None
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LogicColumn title="Dungeon Logic" breaks={DUNGEON_LOGIC} sequenceBreaks={settings.sequenceBreaks} onToggle={toggleBreak} />
            <LogicColumn title="Overworld Logic" breaks={OVERWORLD_LOGIC} sequenceBreaks={settings.sequenceBreaks} onToggle={toggleBreak} />
            <LogicColumn title="Glitch Logic" subtitle="Only applicable in glitched modes" breaks={GLITCH_LOGIC} sequenceBreaks={settings.sequenceBreaks} onToggle={toggleBreak} />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
