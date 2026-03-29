import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import type { SettingsState, UserSequenceBreaks } from "@/store/settingsSlice";
import { SettingSelect, SettingSwitch } from "./SettingControls";
import { StartingItemsTab } from "./StartingItemsTab";

interface GameSettingsTabsProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  startingItems: Record<string, number>;
  setStartingItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  toggleStartingItem: (item: string) => void;
  autotrackProtocol: "sni" | "qusb2snes";
  setAutotrackProtocol: (protocol: "sni" | "qusb2snes") => void;
  autotrackHost: string;
  setAutotrackHost: (host: string) => void;
  autotrackPort: number;
  setAutotrackPort: (port: number) => void;
}

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
  // { id: "canIceBreak", label: "Ice Breaker", tooltip: "Use somaria to clip through the wall in IP Big Key Chest Room" },
  // { id: "canHookClip", label: "Hook Clip", tooltip: "Use the hookshot to clip through walls" },
  // { id: "canBombJump", label: "Bomb Jumps", tooltip: "Use bomb recoil to cross gaps" },
  // { id: "canBombOrBonkCameraUnlock", label: "Bonk/Bomb Camera Unlock", tooltip: "Use to get past double Pokeys without a weapon" },
  // { id: "canHover", label: "Hover", tooltip: "Use boots + Pegasus to hover across gaps" },
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
// Logic break sub-component
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
// Main component
// ---------------------------------------------------------------------------

export function GameSettingsTabs({
  settings,
  updateSetting,
  startingItems,
  setStartingItems,
  toggleStartingItem,
  autotrackProtocol,
  setAutotrackProtocol,
  autotrackHost,
  setAutotrackHost,
  autotrackPort,
  setAutotrackPort,
}: GameSettingsTabsProps) {
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
    <TooltipProvider>
      <Tabs defaultValue="randomizer" className="flex flex-col h-full">
        <TabsList className="w-full justify-between shrink-0">
          <div className="flex flex-row w-full justify-between">
            <div>
              <TabsTrigger value="randomizer">Randomizer</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="logicbreaks">Logic Breaks</TabsTrigger>
            </div>
            <div>
              <TabsTrigger value="tracker">Tracker Settings</TabsTrigger>
            </div>
          </div>
        </TabsList>

        {/* Randomizer tab */}
        <TabsContent value="randomizer" className="flex-1 flex flex-col mt-2 outline-none">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="text-sm">Randomizer Settings</CardTitle>
              <CardDescription>Core game mode and logic settings</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingSelect
                label="World State"
                value={settings.worldState}
                onChange={(v) => updateSetting("worldState", v as SettingsState["worldState"])}
                options={[
                  { value: "standard", label: "Standard" },
                  { value: "open", label: "Open" },
                  { value: "standverted", label: "Standverted" },
                  { value: "inverted_1", label: "Inverted 1.0" },
                  { value: "inverted", label: "Inverted 2.0" },
                ]}
              />
              <SettingSelect
                label="Logic Mode"
                value={settings.logicMode}
                onChange={(v) => updateSetting("logicMode", v as SettingsState["logicMode"])}
                options={[
                  { value: "noglitches", label: "No Glitches" },
                  // { value: "overworldglitches", label: "Overworld Glitches" },
                  // { value: "hybridglitches", label: "Hybrid Glitches" },
                  { value: "nologic", label: "No Logic" },
                ]}
              />
              <SettingSelect
                label="Goal"
                value={settings.goal}
                onChange={(v) => updateSetting("goal", v as SettingsState["goal"])}
                options={[
                  { value: "fast_ganon", label: "Fast Ganon" },
                  { value: "ganon", label: "Defeat Ganon" },
                  { value: "dungeons", label: "All Dungeons" },
                  { value: "pedestal", label: "Pedestal" },
                  { value: "triforce_hunt", label: "Triforce Hunt" },
                ]}
              />
              <SettingSelect
                label="Swords"
                value={settings.swords}
                onChange={(v) => updateSetting("swords", v as SettingsState["swords"])}
                options={[
                  { value: "randomized", label: "Randomized" },
                  // { value: "assured", label: "Assured" },
                  // { value: "vanilla", label: "Vanilla" },
                  // { value: "swordless", label: "Swordless" },
                ]}
              />
              <SettingSelect
                label="Ganon Vulnerable"
                value={settings.ganonVulnerable}
                onChange={(v) => updateSetting("ganonVulnerable", v as SettingsState["ganonVulnerable"])}
                options={[
                  { value: "0", label: "0 crystals" },
                  { value: "1", label: "1 crystal" },
                  { value: "2", label: "2 crystals" },
                  { value: "3", label: "3 crystals" },
                  { value: "4", label: "4 crystals" },
                  { value: "5", label: "5 crystals" },
                  { value: "6", label: "6 crystals" },
                  { value: "7", label: "7 crystals" },
                  { value: "random", label: "Random crystals" },
                  { value: "other", label: "Other conditions" },
                ]}
              />
              <SettingSelect
                label="GT Open"
                value={settings.gtOpen}
                onChange={(v) => updateSetting("gtOpen", v as SettingsState["gtOpen"])}
                options={[
                  { value: "0", label: "0 crystals" },
                  { value: "1", label: "1 crystal" },
                  { value: "2", label: "2 crystals" },
                  { value: "3", label: "3 crystals" },
                  { value: "4", label: "4 crystals" },
                  { value: "5", label: "5 crystals" },
                  { value: "6", label: "6 crystals" },
                  { value: "7", label: "7 crystals" },
                  { value: "random", label: "Random crystals" },
                  { value: "locksmith", label: "Locksmith" },
                  { value: "other", label: "Other conditions" },
                ]}
              />

              <SettingSelect
                label="Pottery"
                value={settings.pottery}
                onChange={(v) => updateSetting("pottery", v as SettingsState["pottery"])}
                options={[
                  { value: "none", label: "None" },
                  { value: "keys", label: "Key Pots" },
                  { value: "cave", label: "Cave Pots" },
                  { value: "cavekeys", label: "Cave+Key Pots" },
                  { value: "reduced", label: "Reduced" },
                  { value: "clustered", label: "Clustered" },
                  { value: "nonempty", label: "Non-empty" },
                  { value: "dungeon", label: "Dungeon" },
                  { value: "lottery", label: "Lottery" },
                ]}
              />
              <SettingSelect
                label="Enemy Drops"
                value={settings.enemyDrop}
                onChange={(v) => updateSetting("enemyDrop", v as SettingsState["enemyDrop"])}
                options={[
                  { value: "none", label: "None" },
                  { value: "keys", label: "Key Enemies" },
                  { value: "underworld", label: "Underworld" },
                ]}
              />

              <div className="col-span-2">
                <Separator className="mb-2" />
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Misc</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    <SettingSwitch label="Activated Flute" checked={settings.activatedFlute} onChange={(v) => updateSetting("activatedFlute", v)} />
                    <SettingSwitch label="Ambrosia" checked={settings.ambrosia} onChange={(v) => updateSetting("ambrosia", v)} />
                    <SettingSwitch label="Bonk Shuffle" checked={settings.bonkShuffle} onChange={(v) => updateSetting("bonkShuffle", v)} />
                    <SettingSwitch label="Follower Shuffle" checked={settings.followerShuffle} onChange={(v) => updateSetting("followerShuffle", v)} />
                    <SettingSwitch label="Mirror scroll" checked={settings.mirrorScroll} onChange={(v) => updateSetting("mirrorScroll", v)} />
                    <SettingSwitch label="Shopsanity" checked={settings.shopsanity} onChange={(v) => updateSetting("shopsanity", v)} />
                    <SettingSwitch label="Pseudoboots" checked={settings.pseudoboots} onChange={(v) => updateSetting("pseudoboots", v)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <StartingItemsTab startingItems={startingItems} setStartingItems={setStartingItems} toggleStartingItem={toggleStartingItem} />
          </div>
        </TabsContent>

        {/* Advanced tab — Dungeon, Entrance, Enemies, Overworld combined */}
        <TabsContent value="advanced" className="flex-1 flex flex-col mt-2 outline-none">
          <Card className="flex-1">
            <CardContent className="pt-6 space-y-6">
              {/* Dungeon Items & Keys */}
              <div>
                <h3 className="text-sm font-semibold mb-1">Dungeon Items & Keys</h3>
                <p className="text-xs text-muted-foreground mb-3">Key shuffle and dungeon item settings</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <SettingSelect
                      label="Small Keys"
                      value={settings.wildSmallKeys}
                      onChange={(v) => updateSetting("wildSmallKeys", v as SettingsState["wildSmallKeys"])}
                      options={[
                        { value: "inDungeon", label: "In Dungeon" },
                        { value: "wild", label: "Randomized" },
                        { value: "universal", label: "Universal" },
                      ]}
                    />
                    <SettingSelect
                      label="Prize Shuffle"
                      value={settings.prizeShuffle}
                      onChange={(v) => updateSetting("prizeShuffle", v as SettingsState["prizeShuffle"])}
                      options={[
                        { value: "vanilla", label: "Vanilla" },
                        { value: "inDungeon", label: "In Dungeon" },
                        { value: "wild", label: "Randomized" },
                      ]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Dungeon Items</Label>
                    <div className="flex flex-col gap-2">
                      <SettingSwitch label="Wild Big Keys" checked={settings.wildBigKeys} onChange={(v) => updateSetting("wildBigKeys", v)} />
                      <SettingSwitch label="Wild Maps" checked={settings.wildMaps} onChange={(v) => updateSetting("wildMaps", v)} />
                      <SettingSwitch label="Wild Compasses" checked={settings.wildCompasses} onChange={(v) => updateSetting("wildCompasses", v)} />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Entrance Shuffle */}
              <div>
                <h3 className="text-sm font-semibold mb-1">Entrance Shuffle</h3>
                <p className="text-xs text-muted-foreground mb-3">How dungeon and overworld entrances are randomized</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SettingSelect
                    label="Entrance Mode"
                    value={settings.entranceMode}
                    onChange={(v) => updateSetting("entranceMode", v as SettingsState["entranceMode"])}
                    options={[
                      { value: "none", label: "None" },
                      { value: "dungeonssimple", label: "Dungeons Simple" },
                      { value: "dungeonsfull", label: "Dungeons Full" },
                      { value: "lite", label: "Lite" },
                      { value: "lean", label: "Lean" },
                      { value: "simple", label: "Simple" },
                      { value: "restricted", label: "Restricted" },
                      { value: "full", label: "Full" },
                      { value: "district", label: "District" },
                      { value: "swapped", label: "Swapped" },
                      { value: "crossed", label: "Crossed" },
                      { value: "insanity", label: "Insanity" },
                    ]}
                  />
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2">
                      <SettingSwitch label="Link's House Shuffle" checked={settings.shuffleLinks} onChange={(v) => updateSetting("shuffleLinks", v)} />
                      <SettingSwitch label="Tavern Shuffle" checked={settings.tavernShuffle} onChange={(v) => updateSetting("tavernShuffle", v)} />
                      <SettingSwitch label="Zelga Woods" checked={settings.zelgaWoods} onChange={(v) => updateSetting("zelgaWoods", v)} />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Enemy & Boss Settings */}
              <div>
                <h3 className="text-sm font-semibold mb-1">Enemy & Boss Settings</h3>
                <p className="text-xs text-muted-foreground mb-3">Enemy and boss shuffle options</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SettingSelect
                    label="Boss Shuffle"
                    value={settings.bossShuffle}
                    onChange={(v) => updateSetting("bossShuffle", v as SettingsState["bossShuffle"])}
                    options={[
                      { value: "none", label: "None" },
                      // { value: "simple", label: "Simple" },
                      // { value: "full", label: "Full" },
                      // { value: "random", label: "Random" },
                    ]}
                  />
                  <SettingSelect
                    label="Enemy Shuffle"
                    value={settings.enemyShuffle}
                    onChange={(v) => updateSetting("enemyShuffle", v as SettingsState["enemyShuffle"])}
                    options={[
                      { value: "none", label: "None" },
                      // { value: "shuffled", label: "Shuffled" },
                      // { value: "random", label: "Random" },
                    ]}
                  />
                </div>
              </div>

              <Separator />

              {/* Overworld Shuffle */}
              <div>
                <h3 className="text-sm font-semibold mb-1">Overworld Shuffle</h3>
                <p className="text-xs text-muted-foreground mb-3">Overworld layout and crossing settings</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SettingSelect
                    label="Layout"
                    value={settings.owLayout}
                    onChange={(v) => updateSetting("owLayout", v as SettingsState["owLayout"])}
                    options={[
                      { value: "vanilla", label: "Vanilla" },
                      // { value: "grid", label: "Grid" },
                      // { value: "wild", label: "Wild" },
                    ]}
                  />
                  <SettingSelect
                    label="Crossed"
                    value={settings.owCrossed}
                    onChange={(v) => updateSetting("owCrossed", v as SettingsState["owCrossed"])}
                    options={[
                      { value: "none", label: "None" },
                      // { value: "grouped", label: "Grouped" },
                      // { value: "polar", label: "Polar" },
                      // { value: "unrestricted", label: "Unrestricted" },
                    ]}
                  />
                  <SettingSelect
                    label="Flute Shuffle"
                    value={settings.owFluteShuffle}
                    onChange={(v) => updateSetting("owFluteShuffle", v as SettingsState["owFluteShuffle"])}
                    options={[
                      { value: "vanilla", label: "Vanilla" },
                      // { value: "balanced", label: "Balanced" },
                      // { value: "random", label: "Random" },
                    ]}
                  />
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Overworld Flags</Label>
                    <div className="flex flex-col gap-2">
                      {/* <SettingSwitch label="Tile Flip (Mixed)" checked={settings.owMixed} onChange={(v) => updateSetting("owMixed", v)} /> */}
                      {/* <SettingSwitch label="Parallel" checked={settings.owParallel} onChange={(v) => updateSetting("owParallel", v)} /> */}
                      {/* <SettingSwitch label="Free Terrain" checked={settings.owTerrain} onChange={(v) => updateSetting("owTerrain", v)} /> */}
                      {/* <SettingSwitch label="Keep Similar Edges" checked={settings.owKeepSimilar} onChange={(v) => updateSetting("owKeepSimilar", v)} /> */}
                      {/* <SettingSwitch label="Whirlpool Shuffle" checked={settings.owWhirlpool} onChange={(v) => updateSetting("owWhirlpool", v)} /> */}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logic Breaks tab */}
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

        {/* Tracker Settings tab */}
        <TabsContent value="tracker" className="flex-1 flex flex-col mt-2 outline-none">
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tracker Settings</CardTitle>
              <CardDescription>Display, map mode, and autotracker config</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingSelect
                label="Map Mode"
                value={settings.mapMode}
                onChange={(v) => updateSetting("mapMode", v as SettingsState["mapMode"])}
                options={[
                  { value: "off", label: "None" },
                  { value: "normal", label: "Normal" },
                  { value: "compact", label: "Compact" },
                  { value: "vertical", label: "Vertical" },
                ]}
              />
              <SettingSelect
                label="Connection Lines"
                value={settings.connectionLinesMode}
                onChange={(v) => updateSetting("connectionLinesMode", v as SettingsState["connectionLinesMode"])}
                options={[
                  { value: "none", label: "None" },
                  { value: "caves", label: "Caves" },
                  { value: "dungeons", label: "Dungeons" },
                  { value: "all", label: "All" },
                ]}
              />
              <div className="space-y-2">
                <Label className="text-xs font-medium">Autotracking</Label>
                <div className="flex flex-col gap-3">
                  <SettingSwitch label="Enable Autotracking" checked={settings.autotracking} onChange={(v) => updateSetting("autotracking", v)} />
                  <SettingSelect
                    label="Protocol"
                    value={autotrackProtocol}
                    onChange={(v) => {
                      const proto = v as "sni" | "qusb2snes";
                      setAutotrackProtocol(proto);
                      setAutotrackPort(proto === "sni" ? 8190 : 23074);
                    }}
                    options={[
                      { value: "sni", label: "SNI gRPC" },
                      { value: "qusb2snes", label: "QUsb2snes" },
                    ]}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Host</Label>
                      <Input value={autotrackHost} onChange={(e) => setAutotrackHost(e.target.value)} className="h-7 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Port</Label>
                      <Input type="number" value={autotrackPort} onChange={(e) => setAutotrackPort(parseInt(e.target.value) || 0)} className="h-7 text-xs" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Display</Label>
                <div className="flex flex-col gap-2">
                  <SettingSwitch label="Count Dungeon Items" checked={!!(settings.includeDungeonItemsInCounter ?? false)} onChange={(v) => updateSetting("includeDungeonItemsInCounter", v)} />
                  <SettingSwitch label="Coloured Chests" checked={settings.colouredChests} onChange={(v) => updateSetting("colouredChests", v)} />
                  <SettingSwitch label="Show Chest Tooltips" checked={settings.showChestTooltips} onChange={(v) => updateSetting("showChestTooltips", v)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
}
