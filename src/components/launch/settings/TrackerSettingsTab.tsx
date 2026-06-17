import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { SettingsState } from "@/store/settingsSlice";
import { SettingSelect, SettingSwitch } from "../SettingControls";

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
              <SettingSwitch label="Show Map Tooltips" checked={settings.showMapTooltips} onChange={(v) => updateSetting("showMapTooltips", v)} />
              <SettingSwitch label="Show Chest Tooltips" checked={settings.showChestTooltips} onChange={(v) => updateSetting("showChestTooltips", v)} />
              <SettingSwitch label="Always Show HC/CT Counts" checked={settings.alwaysShowHCCTCounts} onChange={(v) => updateSetting("alwaysShowHCCTCounts", v)} />
              <SettingSwitch label="Always Show Big Keys" checked={settings.alwaysShowBigKeys} onChange={(v) => updateSetting("alwaysShowBigKeys", v)} />
              <SettingSwitch label="Always Show Small Keys" checked={settings.alwaysShowSmallKeys} onChange={(v) => updateSetting("alwaysShowSmallKeys", v)} />
              <SettingSwitch label="Show Key Totals" checked={settings.showKeyTotals} onChange={(v) => updateSetting("showKeyTotals", v)} />
              <SettingSwitch label="Show Inset Boss Square" checked={settings.showInsetBossSquare} onChange={(v) => updateSetting("showInsetBossSquare", v)} />
              <SettingSelect
                label="Event Log"
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
