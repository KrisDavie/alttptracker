import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { SettingsState } from "@/store/settingsSlice";
import { SettingHelp, SettingSelect, SettingSwitch } from "../SettingControls";

interface TrackerSettingsTabProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  autotrackProtocol: "sni" | "qusb2snes";
  setAutotrackProtocol: (protocol: "sni" | "qusb2snes") => void;
  autotrackHost: string;
  setAutotrackHost: (host: string) => void;
  autotrackPort: number;
  setAutotrackPort: (port: number) => void;
}

export function TrackerSettingsTab({
  settings,
  updateSetting,
  autotrackProtocol,
  setAutotrackProtocol,
  autotrackHost,
  setAutotrackHost,
  autotrackPort,
  setAutotrackPort,
}: TrackerSettingsTabProps) {
  return (
    <TabsContent value="tracker" className="flex-1 flex flex-col mt-2 outline-none">
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Tracker Settings</CardTitle>
          <CardDescription>Display, map mode, and autotracker config</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingSelect
            label="Map Mode"
            description="Where the Light and Dark World maps are shown. None hides them. Normal shows them next to the tracker, Compact uses smaller maps and Vertical stacks the two worlds. The Popout options show the maps in a separate window instead."
            value={settings.mapMode}
            onChange={(v) => updateSetting("mapMode", v as SettingsState["mapMode"])}
            options={[
              { value: "off", label: "None" },
              { value: "normal", label: "Normal" },
              { value: "compact", label: "Compact" },
              { value: "vertical", label: "Vertical" },
              { value: "popoutNormal", label: "Popout Normal" },
              { value: "popoutVertical", label: "Popout Vertical" },
            ]}
          />
          <SettingSelect
            label="Connection Lines"
            description="In entrance modes, draw lines on the map between entrances that lead into the same place. Caves draws them for multi-entrance caves (connectors), Dungeons for multi-entrance dungeons, All for both."
            value={settings.connectionLinesMode}
            onChange={(v) => updateSetting("connectionLinesMode", v as SettingsState["connectionLinesMode"])}
            options={[
              { value: "none", label: "None" },
              { value: "caves", label: "Caves" },
              { value: "dungeons", label: "Dungeons" },
              { value: "all", label: "All" },
            ]}
          />
          {/* Left column: Autotracking with Logic below it, beside the taller Display column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Autotracking</Label>
              <div className="flex flex-col gap-3">
                <SettingSwitch label="Enable Autotracking" description="Read your items, keys, dungeon progress and checked locations from the running game through SNI or QUsb2snes, so you don't have to track by hand." checked={settings.autotracking} onChange={(v) => updateSetting("autotracking", v)} />
                <SettingSelect
                  label="Protocol"
                  description="The program the tracker talks to for autotracking: SNI (gRPC, default port 8190) or QUsb2snes (websocket, default port 23074). Changing it resets the port to that default."
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
                    <div className="flex items-center gap-1.5">
                      <Label className="text-xs">Host</Label>
                      <SettingHelp label="Host" description="Address of the computer running SNI or QUsb2snes. Use localhost when it runs on this computer." />
                    </div>
                    <Input value={autotrackHost} onChange={(e) => setAutotrackHost(e.target.value)} className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-xs">Port</Label>
                      <SettingHelp label="Port" description="Port SNI or QUsb2snes is listening on." />
                    </div>
                    <Input type="number" value={autotrackPort} onChange={(e) => setAutotrackPort(parseInt(e.target.value) || 0)} className="h-7 text-xs" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Logic</Label>
              <div className="flex flex-col gap-2">
                <SettingSwitch
                  label="Assume old man access on item collect"
                  description="When the old man item has been collected, assume logical access to Old Man S&Q spot without placing Old Man rescue caves"
                  checked={settings.assumeOldManOnCollect}
                  onChange={(v) => updateSetting("assumeOldManOnCollect", v)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Display</Label>
            <div className="flex flex-col gap-2">
              <SettingSwitch label="Always Count Dungeon Items" description="Include dungeon items (maps, compasses, small keys, big keys and prizes) in dungeon chest counters even when they stay in their own dungeon. When off, counters only count the checks that hold items shuffled outside of the dungeon." checked={!!(settings.includeDungeonItemsInCounter ?? false)} onChange={(v) => updateSetting("includeDungeonItemsInCounter", v)} />
              <SettingSwitch label="Coloured Chests" description="Colour dungeon chest counters by the logic status of their remaining checks. When off, counters are plain white." checked={settings.colouredChests} onChange={(v) => updateSetting("colouredChests", v)} />
              <SettingSwitch label="Proportional Chest Colors" description="Colour dungeon chest counters proportionally by the logic status of each remaining check, instead of a single colour for the whole dungeon." checked={settings.proportionalChestColors ?? false} onChange={(v) => updateSetting("proportionalChestColors", v)} />
              <SettingSwitch label="Show Map Tooltips" description="Show a tooltip listing a marker's checks and their logic status when hovering it on the map. When off, the hovered marker's name is shown in the status bar instead." checked={settings.showMapTooltips} onChange={(v) => updateSetting("showMapTooltips", v)} />
              <SettingSwitch label="Show Chest Tooltips" description="Show a tooltip listing a dungeon's checks and their logic status when hovering its chest counter." checked={settings.showChestTooltips} onChange={(v) => updateSetting("showChestTooltips", v)} />
              <SettingSwitch label="Always Show HC/CT Counts" description="Show chest counters for Hyrule Castle and Agahnim's Tower even when small keys stay in their own dungeons (they are always shown with wild or universal keys)." checked={settings.alwaysShowHCCTCounts} onChange={(v) => updateSetting("alwaysShowHCCTCounts", v)} />
              <SettingSwitch label="Always Show Big Keys" description="Show a big key tracker for every dungeon that has one, even when big keys stay in their own dungeon." checked={settings.alwaysShowBigKeys} onChange={(v) => updateSetting("alwaysShowBigKeys", v)} />
              <SettingSwitch label="Always Show Small Keys" description="Show a small key counter for every dungeon, even when small keys stay in their own dungeon." checked={settings.alwaysShowSmallKeys} onChange={(v) => updateSetting("alwaysShowSmallKeys", v)} />
              <SettingSwitch label="Show Key Totals" description="Show small keys as collected / total for the dungeon instead of only the number collected." checked={settings.showKeyTotals} onChange={(v) => updateSetting("showKeyTotals", v)} />
              <SettingSwitch label="Show Inset Boss Square" description="Draw a smaller square inside dungeon markers on the map, coloured by the logic status of the dungeon's boss, with the dungeon's prize once it is known." checked={settings.showInsetBossSquare} onChange={(v) => updateSetting("showInsetBossSquare", v)} />
              <SettingSwitch
                label="Use old style dungeon squares in entrance"
                description="In entrance modes when a dungeon is placed, display only a single coloured square with the colour of the dungeon label. This will remove logical colouring from dungeon squares on the map in entrance modes."
                checked={settings.useOldStyleDungeonSquares}
                onChange={(v) => updateSetting("useOldStyleDungeonSquares", v)}
              />
              <SettingSelect
                label="Event Log"
                description="A running log of tracker events, such as items picked up while autotracking. Attached shows it below the tracker, Popout opens it in a separate window."
                value={settings.eventLogMode}
                onChange={(v) => updateSetting("eventLogMode", v as SettingsState["eventLogMode"])}
                options={[
                  { value: "off", label: "Off" },
                  { value: "attached", label: "Attached" },
                  { value: "popout", label: "Popout" },
                ]}
              />
              <SettingSwitch
                label="Log Triforce Pieces"
                description="In triforce hunt goals, add an event log entry for every triforce piece collected while autotracking. Needs the event log to be on."
                checked={settings.logTriforcePieces}
                disabled={settings.eventLogMode === "off"}
                onChange={(v) => updateSetting("logTriforcePieces", v)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
