import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { SettingsState } from "@/store/settingsSlice";
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

export function GameSettingsTabs({
  settings, updateSetting, startingItems, setStartingItems, toggleStartingItem,
  autotrackProtocol, setAutotrackProtocol, autotrackHost, setAutotrackHost, autotrackPort, setAutotrackPort,
}: GameSettingsTabsProps) {
  return (
    <Tabs defaultValue="randomizer">
      <TabsList className="w-full justify-between">
        <div className="flex">
          <TabsTrigger value="randomizer">Randomizer</TabsTrigger>
          <TabsTrigger value="dungeon">Dungeon</TabsTrigger>
          <TabsTrigger value="entrance">Entrance</TabsTrigger>
          <TabsTrigger value="enemies">Enemies</TabsTrigger>
          <TabsTrigger value="overworld">Overworld</TabsTrigger>
          <TabsTrigger value="items">Starting Items</TabsTrigger>
        </div>
        <div className="min-w-60"/>
        <TabsTrigger value="tracker">Tracker Settings</TabsTrigger>
      </TabsList>

      {/* Randomizer tab */}
      <TabsContent value="randomizer">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Randomizer Settings</CardTitle>
            <CardDescription>Core game mode and logic settings</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingSelect label="World State" value={settings.worldState} onChange={(v) => updateSetting("worldState", v as SettingsState["worldState"])} options={[
              { value: "standard", label: "Standard" },
              { value: "open", label: "Open" },
              { value: "standverted", label: "Standverted" },
              { value: "inverted_1", label: "Inverted 1.0" },
              { value: "inverted", label: "Inverted 2.0" },
            ]} />
            <SettingSelect label="Logic Mode" value={settings.logicMode} onChange={(v) => updateSetting("logicMode", v as SettingsState["logicMode"])} options={[
              { value: "noglitches", label: "No Glitches" },
              // { value: "overworldglitches", label: "Overworld Glitches" },
              // { value: "hybridglitches", label: "Hybrid Glitches" },
              { value: "nologic", label: "No Logic" },
            ]} />
            <SettingSelect label="Goal" value={settings.goal} onChange={(v) => updateSetting("goal", v as SettingsState["goal"])} options={[
              { value: "fast_ganon", label: "Fast Ganon" },
              { value: "ganon", label: "Defeat Ganon" },
              { value: "dungeons", label: "All Dungeons" },
              { value: "pedestal", label: "Pedestal" },
              { value: "triforce_hunt", label: "Triforce Hunt" },
            ]} />
            <SettingSelect label="Swords" value={settings.swords} onChange={(v) => updateSetting("swords", v as SettingsState["swords"])} options={[
              { value: "randomized", label: "Randomized" },
              // { value: "assured", label: "Assured" },
              // { value: "vanilla", label: "Vanilla" },
              // { value: "swordless", label: "Swordless" },
            ]} />
            <SettingSelect label="Item Pool" value={settings.itemPool} onChange={(v) => updateSetting("itemPool", v as SettingsState["itemPool"])} options={[
              { value: "normal", label: "Normal" },
              // { value: "hard", label: "Hard" },
              // { value: "expert", label: "Expert" },
            ]} />
            <SettingSelect label="Pottery" value={settings.pottery} onChange={(v) => updateSetting("pottery", v as SettingsState["pottery"])} options={[
              { value: "none", label: "None" },
              { value: "keys", label: "Key Pots" },
              { value: "cave", label: "Cave Pots" },
              { value: "cavekeys", label: "Cave+Key Pots" },
              { value: "reduced", label: "Reduced" },
              { value: "clustered", label: "Clustered" },
              { value: "nonempty", label: "Non-empty" },
              { value: "dungeon", label: "Dungeon" },
              { value: "lottery", label: "Lottery" },
            ]} />
            <SettingSelect label="Enemy Drops" value={settings.enemyDrop} onChange={(v) => updateSetting("enemyDrop", v as SettingsState["enemyDrop"])} options={[
              { value: "none", label: "None" },
              { value: "keys", label: "Key Enemies" },
              { value: "underworld", label: "Underworld" },
            ]} />
            <div className="space-y-2">
              <Label className="text-xs font-medium">Misc</Label>
              <div className="flex flex-col gap-2">
                <SettingSwitch label="Bonk Shuffle" checked={settings.bonkShuffle} onChange={(v) => updateSetting("bonkShuffle", v)} />
                <SettingSwitch label="Activated Flute" checked={settings.activatedFlute} onChange={(v) => updateSetting("activatedFlute", v)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Dungeon tab */}
      <TabsContent value="dungeon">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Dungeon Items & Keys</CardTitle>
            <CardDescription>Key shuffle and dungeon item settings</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingSelect label="Small Keys" value={settings.wildSmallKeys} onChange={(v) => updateSetting("wildSmallKeys", v as SettingsState["wildSmallKeys"])} options={[
              { value: "inDungeon", label: "In Dungeon" },
              { value: "wild", label: "Randomized" },
              { value: "universal", label: "Universal" },
            ]} />
            <div className="space-y-2">
              <Label className="text-xs font-medium">Dungeon Items</Label>
              <div className="flex flex-col gap-2">
                <SettingSwitch label="Wild Big Keys" checked={settings.wildBigKeys} onChange={(v) => updateSetting("wildBigKeys", v)} />
                <SettingSwitch label="Wild Maps" checked={settings.wildMaps} onChange={(v) => updateSetting("wildMaps", v)} />
                <SettingSwitch label="Wild Compasses" checked={settings.wildCompasses} onChange={(v) => updateSetting("wildCompasses", v)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Entrance tab */}
      <TabsContent value="entrance">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Entrance Shuffle</CardTitle>
            <CardDescription>How dungeon and overworld entrances are randomized</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingSelect label="Entrance Mode" value={settings.entranceMode} onChange={(v) => updateSetting("entranceMode", v as SettingsState["entranceMode"])} options={[
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
            ]} />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Enemies tab */}
      <TabsContent value="enemies">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Enemy & Boss Settings</CardTitle>
            <CardDescription>Enemy and boss shuffle options</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingSelect label="Boss Shuffle" value={settings.bossShuffle} onChange={(v) => updateSetting("bossShuffle", v as SettingsState["bossShuffle"])} options={[
              { value: "none", label: "None" },
              // { value: "simple", label: "Simple" },
              // { value: "full", label: "Full" },
              // { value: "random", label: "Random" },
            ]} />
            <SettingSelect label="Enemy Shuffle" value={settings.enemyShuffle} onChange={(v) => updateSetting("enemyShuffle", v as SettingsState["enemyShuffle"])} options={[
              { value: "none", label: "None" },
              // { value: "shuffled", label: "Shuffled" },
              // { value: "random", label: "Random" },
            ]} />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Overworld tab */}
      <TabsContent value="overworld">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Overworld Shuffle</CardTitle>
            <CardDescription>Overworld layout and crossing settings</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingSelect label="Layout" value={settings.owLayout} onChange={(v) => updateSetting("owLayout", v as SettingsState["owLayout"])} options={[
              { value: "vanilla", label: "Vanilla" },
              // { value: "grid", label: "Grid" },
              // { value: "wild", label: "Wild" },
            ]} />
            <SettingSelect label="Crossed" value={settings.owCrossed} onChange={(v) => updateSetting("owCrossed", v as SettingsState["owCrossed"])} options={[
              { value: "none", label: "None" },
              // { value: "grouped", label: "Grouped" },
              // { value: "polar", label: "Polar" },
              // { value: "unrestricted", label: "Unrestricted" },
            ]} />
            <SettingSelect label="Flute Shuffle" value={settings.owFluteShuffle} onChange={(v) => updateSetting("owFluteShuffle", v as SettingsState["owFluteShuffle"])} options={[
              { value: "vanilla", label: "Vanilla" },
              // { value: "balanced", label: "Balanced" },
              // { value: "random", label: "Random" },
            ]} />
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
          </CardContent>
        </Card>
      </TabsContent>

      {/* Starting Items tab */}
      <TabsContent value="items">
        <StartingItemsTab
          startingItems={startingItems}
          setStartingItems={setStartingItems}
          toggleStartingItem={toggleStartingItem}
        />
      </TabsContent>

      {/* Tracker Settings tab */}
      <TabsContent value="tracker">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tracker Settings</CardTitle>
            <CardDescription>Display, map mode, and autotracker config</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingSelect label="Map Mode" value={settings.mapMode} onChange={(v) => updateSetting("mapMode", v as SettingsState["mapMode"])} options={[
              { value: "off", label: "None" },
              { value: "normal", label: "Normal" },
              { value: "compact", label: "Compact" },
              { value: "vertical", label: "Vertical" },
            ]} />
            <SettingSelect label="Connection Lines" value={settings.connectionLinesMode} onChange={(v) => updateSetting("connectionLinesMode", v as SettingsState["connectionLinesMode"])} options={[
              { value: "none", label: "None" },
              { value: "caves", label: "Caves" },
              { value: "dungeons", label: "Dungeons" },
              { value: "all", label: "All" },
            ]} />
            <div className="space-y-2">
              <Label className="text-xs font-medium">Autotracking</Label>
              <div className="flex flex-col gap-3">
                <SettingSwitch label="Enable Autotracking" checked={settings.autotracking} onChange={(v) => updateSetting("autotracking", v)} />
                <SettingSelect label="Protocol" value={autotrackProtocol} onChange={(v) => {
                  const proto = v as "sni" | "qusb2snes";
                  setAutotrackProtocol(proto);
                  setAutotrackPort(proto === "sni" ? 8190 : 23074);
                }} options={[
                  { value: "sni", label: "SNI gRPC" },
                  { value: "qusb2snes", label: "QUsb2snes" },
                ]} />
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
                <SettingSwitch label="Count Dungeon Items" checked={settings.includeDungeonItemsInCounter ?? false} onChange={(v) => updateSetting("includeDungeonItemsInCounter", v)} />
                <SettingSwitch label="Dark Room Navigation" checked={settings.sequenceBreaks.canNavigateDarkRooms} onChange={(v) => updateSetting("sequenceBreaks", { ...settings.sequenceBreaks, canNavigateDarkRooms: v })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
