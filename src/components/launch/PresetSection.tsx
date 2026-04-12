import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Timer, Search, ChevronDown } from "lucide-react";
import { allPresets, presetCategories, tournamentDiscords, getPresetById } from "@/data/launcherPresets";
import { DiscordIcon } from "./DiscordIcon";

interface PresetSectionProps {
  nextLadder: { presetId: string; name: string; time: Date } | null;
  applyPreset: (presetId: string) => void;
}

export function PresetSection({ nextLadder, applyPreset }: PresetSectionProps) {
  const [presetSearch, setPresetSearch] = useState("");
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const presetDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!presetDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(e.target as Node)) {
        setPresetDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [presetDropdownOpen]);

  const filteredPresets = useMemo(() => {
    if (!presetSearch) return allPresets;
    const q = presetSearch.toLowerCase();
    return allPresets.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
  }, [presetSearch]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Presets</h2>
        <div className="flex items-center gap-2">
          {nextLadder && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="xs"
                    className="cursor-pointer"
                    onClick={() => applyPreset(nextLadder.presetId)}
                  />
                }
              >
                <Timer className="size-3.5 mr-1" />
                Next Ladder: {nextLadder.name}
                <span className="ml-1.5 text-[10px] text-muted-foreground">
                  {nextLadder.time.toLocaleString([], { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </span>
              </TooltipTrigger>
              <TooltipContent>Load the next Step Ladder race preset</TooltipContent>
            </Tooltip>
          )}
          {/* Rich filterable all-presets dropdown */}
          <div className="relative" ref={presetDropdownRef}>
            <button
              type="button"
              onClick={() => { setPresetDropdownOpen((v) => !v); setPresetSearch(""); }}
              className="flex items-center gap-1.5 h-8 px-3 rounded-sm border border-input bg-transparent text-xs hover:bg-muted transition-colors cursor-pointer"
            >
              <Search className="size-3.5 text-muted-foreground" />
              <span>Browse all presets...</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            {presetDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 w-72 rounded-sm border bg-popover text-popover-foreground shadow-md">
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search presets..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className="w-full h-7 pl-7 pr-2 rounded-sm border border-input bg-transparent text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto p-1">
                  {filteredPresets.length === 0 ? (
                    <div className="px-3 py-4 text-xs text-muted-foreground text-center">No presets found</div>
                  ) : (
                    filteredPresets.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => { applyPreset(p.id); setPresetDropdownOpen(false); }}
                        className="flex flex-col w-full text-left px-3 py-2 rounded-sm text-xs hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                      >
                        <span className="font-medium">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{p.description}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categorized preset buttons */}
      {presetCategories.map((cat) => (
        <div key={cat.id} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-medium text-muted-foreground">{cat.title}</h3>
            {cat.discordUrl && (
              <a
                href={cat.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#5865F2] hover:text-[#5865F2]/80 transition-colors"
                title={`${cat.title} Discord`}
              >
                <DiscordIcon className="size-3.5" />
              </a>
            )}
            {cat.id === "tournament" && tournamentDiscords.map((td) => (
              <a
                key={td.label}
                href={td.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-[#5865F2] hover:text-[#5865F2]/80 transition-colors"
                title={`${td.label} Discord`}
              >
                <DiscordIcon className="size-3" />
                <span>{td.label}</span>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.presetIds.map((pid) => {
              const preset = getPresetById(pid);
              if (!preset) return null;
              return (
                <Tooltip key={pid}>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => applyPreset(pid)}
                      />
                    }
                  >
                    {preset.name}
                  </TooltipTrigger>
                  <TooltipContent>{preset.description}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
