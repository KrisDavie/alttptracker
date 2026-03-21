import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Logic break definitions
// ---------------------------------------------------------------------------

interface LogicBreak {
  id: string;
  label: string;
  tooltip: string;
}

const DUNGEON_LOGIC: LogicBreak[] = [
  { id: "canIceBreak", label: "Ice Breaker", tooltip: "Use somaria to clip through the wall in IP Big Key Chest Room" },
  { id: "canHookClip", label: "Hook Clip", tooltip: "Use the hookshot to clip through walls" },
  { id: "canBombJump", label: "Bomb Jumps", tooltip: "Use bomb recoil to cross gaps" },
  { id: "canBombOrBonkCameraUnlock", label: "Bonk/Bomb Camera Unlock", tooltip: "Use to get past double Pokeys without a weapon" },
  { id: "canHover", label: "Hover", tooltip: "Use boots + Pegasus to hover across gaps" },
  { id: "canHoverAlot", label: "Long Hovers", tooltip: "Extended hovering across longer gaps" },
  { id: "canSpeckyClip", label: "Specky Clip", tooltip: "Bypass flooding the first trench in Swamp Palace" },
  { id: "canFireSpooky", label: "Spooky Action", tooltip: "Use the firerod for spooky action" },
  { id: "canBombSpooky", label: "Bomb Spooky", tooltip: "Hit switches in other quadrants with bombs" },
  { id: "canHeraPot", label: "Herapot", tooltip: "Get to the top of Hera with the hookshot and no Big Key" },
  { id: "canMimicClip", label: "Mimic Clip", tooltip: "Clip Mimics into walls to bypass kill rooms without the bow" },
  { id: "canPotionCameraUnlock", label: "Potion Camera Unlock", tooltip: "Bypass Mimic kill rooms in front of PoD" },
  { id: "canMoldormBounce", label: "Moldorm Bounce", tooltip: "Get to Aga 2 without the hookshot" },
  { id: "canDarkRoomNavigateBlind", label: "Lightless Dark Room Navigation", tooltip: "Navigate dark rooms with no light sources" },
  { id: "canTorchRoomNavigateBlind", label: "Lightless Torch Room Navigation", tooltip: "Navigate rooms with torches with no light sources" },
];

const OVERWORLD_LOGIC: LogicBreak[] = [
  { id: "canFairyReviveHover", label: "Fairy Revive Hover", tooltip: "Hover to EDM with a fairy revival" },
  { id: "canFakeFlipper", label: "Fake Flippers", tooltip: "Enter water without flippers" },
  { id: "canOWFairyRevive", label: "OW Fairy Revival", tooltip: "Become link by dying as a bunny over deep water and have a fairy revive you" },
  { id: "canQirnJump", label: "Qirn Jump", tooltip: "Get to East Dark World without the hammer, flippers or killing Aga 1" },
  { id: "canMirrorSuperBunny", label: "Mirror Super Bunny", tooltip: "Get superbunny state by using the mirror on the same frame as entering a cave" },
  { id: "canDungeonBunnyRevive", label: "Dungeon Bunny Revive", tooltip: "Die in a dungeon as a bunny to become link" },
  { id: "canFakePowder", label: "Fake Powder", tooltip: "Use somaria with no magic and the mushroom to use powder" },
  { id: "canWaterWalk", label: "Water Walk", tooltip: "Walk on water using precise movement" },
  { id: "canZoraSplashDelete", label: "Zora Splash Delete", tooltip: "Get the Zora ledge item with a splash delete" },
  { id: "canBunnyPocket", label: "Bunny Pocket", tooltip: "Use items in the overworld as a bunny" },
  { id: "canFairyBarrierRevive", label: "Fairy Barrier Revive", tooltip: "Bypass the Aga 1 barrier with a fairy revive" },
  { id: "canShockBlock", label: "Shock Block", tooltip: "Use Somaria to bypass the Aga 1 barrier" },
  { id: "canTombRaider", label: "Tomb Raider", tooltip: "Use hookshot to access King's Tomb from Graveyard Ledge" },
];

const GLITCH_LOGIC: LogicBreak[] = [
  { id: "canTamSwam", label: "Swim Clip", tooltip: "Clip through terrain while swimming" },
  { id: "canBunnyCitrus", label: "Bunny Citrus", tooltip: "Can citrus clip as a bunny" },
  { id: "canMirrorWrap", label: "Mirror Wrap", tooltip: "Wrap the screen using the mirror" },
];

type LogicState = Record<string, boolean>;

function allBreakIds(): string[] {
  return [...DUNGEON_LOGIC, ...OVERWORLD_LOGIC, ...GLITCH_LOGIC].map((b) => b.id);
}

function createState(value: boolean): LogicState {
  const ids = allBreakIds();
  const state: LogicState = {};
  for (const id of ids) state[id] = value;
  return state;
}

// "Nothing Stupid" removes long hovers and bunny fairy revivals
function createNothingStupid(): LogicState {
  const state = createState(true);
  state.canHoverAlot = false;
  state.canFairyReviveHover = false;
  state.canOWFairyRevive = false;
  return state;
}

// "Basic" removes all hovers and bunny fairy revivals
function createBasic(): LogicState {
  const state = createState(true);
  state.canHover = false;
  state.canHoverAlot = false;
  state.canFairyReviveHover = false;
  state.canOWFairyRevive = false;
  return state;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const LogicBreaksPage: React.FC = () => {
  const navigate = useNavigate();
  const [logicState, setLogicState] = useState<LogicState>(() => createState(true));

  const toggle = useCallback((id: string) => {
    setLogicState((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const applyPreset = useCallback((preset: "all" | "nostupid" | "basic" | "none") => {
    switch (preset) {
      case "all": setLogicState(createState(true)); break;
      case "nostupid": setLogicState(createNothingStupid()); break;
      case "basic": setLogicState(createBasic()); break;
      case "none": setLogicState(createState(false)); break;
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => navigate("/")}>
                <ArrowLeft className="size-4 mr-1" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-lg font-bold tracking-tight">Logic / Sequence Breaks</h1>
              <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">ALttP Randomizer</Badge>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          {/* Info banner */}
          <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            <Info className="size-4 mt-0.5 shrink-0 text-primary" />
            <span>
              Configure which sequence breaks and glitch techniques the tracker logic should consider reachable.
              These settings affect which locations are marked as available.
            </span>
          </div>

          {/* Presets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Logic Presets</CardTitle>
              <CardDescription>Quick-apply a group of logic settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => applyPreset("all")}>
                  All Glitches / Sequence Breaks
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
            </CardContent>
          </Card>

          {/* Logic settings grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LogicColumn title="Dungeon Logic" breaks={DUNGEON_LOGIC} state={logicState} onToggle={toggle} />
            <LogicColumn title="Overworld Logic" breaks={OVERWORLD_LOGIC} state={logicState} onToggle={toggle} />
            <LogicColumn title="Glitch Logic" subtitle="Only applicable in glitched modes" breaks={GLITCH_LOGIC} state={logicState} onToggle={toggle} />
          </div>

          {/* Save & Back */}
          <div className="flex justify-end">
            <Button className="cursor-pointer" onClick={() => navigate("/")}>
              Save &amp; Back
            </Button>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface LogicColumnProps {
  title: string;
  subtitle?: string;
  breaks: LogicBreak[];
  state: LogicState;
  onToggle: (id: string) => void;
}

function LogicColumn({ title, subtitle, breaks, state, onToggle }: LogicColumnProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
        {subtitle && <CardDescription className="text-[10px]">{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-1">
        {breaks.map((b) => (
          <div key={b.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={b.id}
              checked={state[b.id] ?? false}
              onChange={() => onToggle(b.id)}
              className="rounded-sm border-input accent-primary cursor-pointer"
            />
            <label htmlFor={b.id} className="text-xs cursor-pointer flex-1">{b.label}</label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-64">{b.tooltip}</TooltipContent>
            </Tooltip>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default LogicBreaksPage;
