import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { SettingsState } from "@/store/settingsSlice";
import { SettingSelect, SettingSwitch } from "../SettingControls";

interface AdvancedTabProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

export function AdvancedTab({ settings, updateSetting }: AdvancedTabProps) {
  return (
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
                  { value: "random", label: "Random" },
                ]}
              />
              <SettingSelect
                label="Enemy Shuffle"
                value={settings.enemyShuffle}
                onChange={(v) => updateSetting("enemyShuffle", v as SettingsState["enemyShuffle"])}
                options={[
                  { value: "none", label: "None" },
                  // { value: "shuffled", label: "Shuffled" },
                  { value: "random", label: "Random" },
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
  );
}
