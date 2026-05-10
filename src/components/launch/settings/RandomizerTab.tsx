import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { SettingsState } from "@/store/settingsSlice";
import { SettingSelect, SettingSwitch } from "../SettingControls";
import { StartingItemsTab } from "../StartingItemsTab";

interface RandomizerTabProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  startingItems: Record<string, number>;
  setStartingItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  toggleStartingItem: (item: string) => void;
}

export function RandomizerTab({ settings, updateSetting, startingItems, setStartingItems, toggleStartingItem }: RandomizerTabProps) {
  return (
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
              // { value: "ad", label: "All Dungeons" },
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
              { value: "ad", label: "All Dungeons" },
              { value: "completionist", label: "Completionist" },
              { value: "triforce", label: "Ganonhunt" },
              { value: "random", label: "Random crystals" },
              // { value: "other", label: "Other conditions" },
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
  );
}
