import { useMemo, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SettingsState } from "@/store/settingsSlice";
import { defaultEntranceLabels, type EntranceLabel } from "@/data/entranceLabels";
import { baseLocationsData } from "@/data/locationsData";
import { ColourPicker } from "./ColourPicker";

interface EntranceLabelsTabProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const MAX_LABEL_LENGTH = 6;

// All entrance candidates: every location flagged as an entrance, plus any
// names already present in defaults/overrides (in case the data set differs).
function buildEntranceCandidates(overrides: Record<string, EntranceLabel>): string[] {
  const set = new Set<string>();
  for (const [name, data] of Object.entries(baseLocationsData)) {
    if (data.entrance) set.add(name);
  }
  for (const name of Object.keys(defaultEntranceLabels)) set.add(name);
  for (const name of Object.keys(overrides)) set.add(name);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function EntranceLabelsTab({ settings, updateSetting }: EntranceLabelsTabProps) {
  const overrides = useMemo(
    () => settings.entranceLabelOverrides ?? {},
    [settings.entranceLabelOverrides]
  );
  const [filter, setFilter] = useState("");

  const allEntrances = useMemo(() => buildEntranceCandidates(overrides), [overrides]);

  const customEntries = useMemo(
    () =>
      Object.keys(overrides)
        .filter((name) => !(name in defaultEntranceLabels))
        .sort((a, b) => a.localeCompare(b)),
    [overrides]
  );

  const defaultEntries = useMemo(
    () => Object.keys(defaultEntranceLabels).sort((a, b) => a.localeCompare(b)),
    []
  );

  const dropdownOptions = useMemo(() => {
    const trimmed = filter.trim().toLowerCase();
    const taken = new Set<string>([
      ...Object.keys(defaultEntranceLabels),
      ...Object.keys(overrides),
    ]);
    return allEntrances
      .filter((name) => !taken.has(name))
      .filter((name) => (trimmed ? name.toLowerCase().includes(trimmed) : true))
      .slice(0, 30);
  }, [allEntrances, filter, overrides]);

  const setOverride = (name: string, label: string, color: string) => {
    const next = { ...overrides, [name]: { label, color } };
    updateSetting("entranceLabelOverrides", next);
  };

  const removeOverride = (name: string) => {
    const next = { ...overrides };
    delete next[name];
    updateSetting("entranceLabelOverrides", next);
  };

  const resetAll = () => {
    updateSetting("entranceLabelOverrides", {});
  };

  const addEntrance = (name: string) => {
    setOverride(name, name.slice(0, MAX_LABEL_LENGTH), "#ffffff");
    setFilter("");
  };

  const resolveDefault = (name: string): EntranceLabel => {
    return overrides[name] ?? defaultEntranceLabels[name];
  };

  return (
    <TabsContent value="entranceLabels" className="flex-1 flex flex-col mt-2 outline-none">
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Entrance Labels</CardTitle>
          <CardDescription>
            Configure which entrances show labels on the map in entrance shuffle mode.
            Adjust colours for the default set, add custom entrances with your own label and colour,
            or reset everything back to the defaults.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={resetAll}>
              Reset to defaults
            </Button>
          </div>

          <Separator />

          {/* Default labels */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Default labels</h3>
              <p className="text-xs text-muted-foreground">
                Change the label text or colour for any default entrance. Reset to defaults to restore original values.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 max-h-96 overflow-y-auto pr-2">
              {defaultEntries.map((name) => {
                const current = resolveDefault(name);
                return (
                  <div key={`default-${name}`} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate" title={name}>{name}</div>
                    </div>
                    <Input
                      value={current.label}
                      maxLength={MAX_LABEL_LENGTH}
                      onChange={(e) => setOverride(name, e.target.value.slice(0, MAX_LABEL_LENGTH), current.color)}
                      className="h-7 w-24 text-xs"
                      placeholder="Label"
                    />
                    <ColourPicker
                      value={current.color}
                      onChange={(v) => setOverride(name, current.label, v)}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* Custom labels */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Custom labels</h3>
              <p className="text-xs text-muted-foreground">
                Add entrances not in the default set. Labels are limited to {MAX_LABEL_LENGTH} characters.
              </p>
            </div>

            {customEntries.length === 0 && (
              <p className="text-xs text-muted-foreground italic">No custom entrance labels.</p>
            )}

            <div className="grid grid-cols-1 gap-2">
              {customEntries.map((name) => {
                const entry = overrides[name];
                return (
                  <div key={`custom-${name}`} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate" title={name}>{name}</div>
                    </div>
                    <Input
                      value={entry.label}
                      maxLength={MAX_LABEL_LENGTH}
                      onChange={(e) => setOverride(name, e.target.value.slice(0, MAX_LABEL_LENGTH), entry.color)}
                      className="h-7 w-24 text-xs"
                      placeholder="Label"
                    />
                    <ColourPicker
                      value={entry.color}
                      onChange={(v) => setOverride(name, entry.label, v)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer h-7 px-2 text-xs"
                      onClick={() => removeOverride(name)}
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Add new entrance */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-medium">Add entrance</div>
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search entrances..."
                className="h-8 text-xs"
              />
              {filter.trim() && (
                <div className="max-h-64 overflow-y-auto rounded border border-border bg-popover">
                  {dropdownOptions.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      No matching entrances.
                    </div>
                  ) : (
                    dropdownOptions.map((name) => (
                      <button
                        key={name}
                        type="button"
                        className="block w-full text-left px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        onClick={() => addEntrance(name)}
                      >
                        {name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </section>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
