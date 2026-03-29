import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { SettingsState } from "@/store/settingsSlice";
import { SettingSelect, SettingSwitch } from "./SettingControls";

interface TrackerSettingsProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  autotrackProtocol: "sni" | "qusb2snes";
  setAutotrackProtocol: (protocol: "sni" | "qusb2snes") => void;
  autotrackHost: string;
  setAutotrackHost: (host: string) => void;
  autotrackPort: number;
  setAutotrackPort: (port: number) => void;
}

export function TrackerSettings({
  settings, updateSetting,
  autotrackProtocol, setAutotrackProtocol,
  autotrackHost, setAutotrackHost,
  autotrackPort, setAutotrackPort,
}: TrackerSettingsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Tracker Settings</CardTitle>
        <CardDescription>Display, map mode, and autotracker config</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <Label className="text-xs font-medium">Display</Label>
          <div className="flex flex-col gap-2">
            <SettingSwitch label="Count Dungeon Items" checked={!!(settings.includeDungeonItemsInCounter ?? false)} onChange={(v) => updateSetting("includeDungeonItemsInCounter", v)} />
            <SettingSwitch label="Coloured Chests" checked={settings.colouredChests} onChange={(v) => updateSetting("colouredChests", v)} />
            <SettingSwitch label="Show Chest Tooltips" checked={settings.showChestTooltips} onChange={(v) => updateSetting("showChestTooltips", v)} />
            <SettingSwitch label="Dark Room Navigation" checked={settings.sequenceBreaks.canNavigateDarkRooms} onChange={(v) => updateSetting("sequenceBreaks", { ...settings.sequenceBreaks, canNavigateDarkRooms: v })} />
          </div>
        </div>
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
      </CardContent>
    </Card>
  );
}
