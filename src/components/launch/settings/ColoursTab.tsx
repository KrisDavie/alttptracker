import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  COLOURBLIND_STATUS_COLORS,
  DEFAULT_APP_BACKGROUND,
  DEFAULT_CONNECTION_LINE_COLOR,
  DEFAULT_STATUS_COLORS,
  type SettingsState,
  type StatusColors,
} from "@/store/settingsSlice";
import { ColourPicker } from "./ColourPicker";

interface ColoursTabProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

interface StatusColourRow {
  key: keyof StatusColors;
  label: string;
  description: string;
}

const STATUS_ROWS: StatusColourRow[] = [
  { key: "available", label: "Available", description: "Locations you can reach right now" },
  { key: "someAvailable", label: "Some Available", description: "Chest colour when some locations, but not all are available" },
  { key: "possible", label: "Possible", description: "Reachable depending on key/door choices" },
  { key: "ool", label: "Out of logic", description: "Reachable but outside the logic ruleset" },
  { key: "information", label: "Information", description: "Informational hints / scouts" },
  { key: "unavailable", label: "Unavailable", description: "Cannot be reached with current items" },
  { key: "checked", label: "Checked", description: "Already collected / cleared" },
  { key: "selected", label: "Selected", description: "Currently focused location" },
];

export function ColoursTab({ settings, updateSetting }: ColoursTabProps) {
  const customColors = settings.customColors ?? {};

  const setStatusColour = (key: keyof StatusColors, value: string) => {
    updateSetting("customColors", { ...customColors, [key]: value });
  };

  const applyDefaultPreset = () => {
    updateSetting("customColors", { ...DEFAULT_STATUS_COLORS });
    updateSetting("appBackground", DEFAULT_APP_BACKGROUND);
    updateSetting("connectionLineColor", DEFAULT_CONNECTION_LINE_COLOR);
  };

  const applyColourblindPreset = () => {
    updateSetting("customColors", { ...COLOURBLIND_STATUS_COLORS });
  };

  const applyTransparentBackground = () => {
    updateSetting("appBackground", "#00000000");
  };

  const resolveMarker = (k: keyof StatusColors) => customColors[k] ?? DEFAULT_STATUS_COLORS[k];

  return (
    <TabsContent value="colours" className="flex-1 flex flex-col mt-2 outline-none">
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Colours</CardTitle>
          <CardDescription>
            Customise tracker colours. Changes apply immediately. Entrance label colours are configured separately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="cursor-pointer" onClick={applyDefaultPreset}>
              Default
            </Button>
            <Button variant="outline" size="sm" className="cursor-pointer" onClick={applyColourblindPreset}>
              Colourblind
            </Button>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="sm" className="cursor-pointer" onClick={applyTransparentBackground}>
                  Transparent Background
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-72">
                <p className="font-semibold mb-1">Works only in OBS Browser Source.</p>
                <p>
                  A transparent background is composited correctly when OBS renders the page itself
                  (Browser Source). Window Capture and Display Capture grab pixels from the OS, which
                  flattens the page against the browser&apos;s opaque window background, so the
                  transparency will not show through.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator />

          {/* General */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">General</h3>
              <p className="text-xs text-muted-foreground">
                Background and overlay colours. Set the background alpha to 0 for OBS browser-source overlays.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <ColourPicker
                label="App background"
                description="Tracker page background"
                value={settings.appBackground ?? DEFAULT_APP_BACKGROUND}
                onChange={(v) => updateSetting("appBackground", v)}
                alpha
              />
              <ColourPicker
                label="Connection lines"
                description="Lines connecting shuffled entrances"
                value={settings.connectionLineColor}
                onChange={(v) => updateSetting("connectionLineColor", v)}
                alpha
              />
            </div>
          </section>

          <Separator />

          {/* Marker / map colours */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Logic status colours</h3>
              <p className="text-xs text-muted-foreground">
                Used for map markers, chest counters, and tooltip text.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {STATUS_ROWS.map((row) => (
                <ColourPicker
                  key={`marker-${row.key}`}
                  label={row.label}
                  description={row.description}
                  value={resolveMarker(row.key)}
                  onChange={(v) => setStatusColour(row.key, v)}
                  alpha
                />
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
