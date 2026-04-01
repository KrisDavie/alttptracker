import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Info, Github, AlertOctagon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { SettingsState } from "@/store/settingsSlice";
import { getPresetById, resolvePresetFromSlug } from "@/data/launcherPresets";
import ItemsData from "@/data/itemData";
import { getSessions, createSession, deleteSession, togglePin, MAX_SESSIONS, type TrackerSession } from "@/lib/sessionManager";
import { idbDriver } from "@/lib/idbDriver";
import { loadLauncherPrefs, saveLauncherPrefs, buildLauncherPrefs, applyLauncherPrefs, loadRecentSprites, pushRecentSprite } from "@/lib/launchHelpers";
import { LaunchHeader } from "./launch/LaunchHeader";
import { PresetSection } from "./launch/PresetSection";
import { LaunchCard } from "./launch/LaunchCard";
import { GameSettingsTabs } from "./launch/GameSettingsTabs";
import { SpriteSelector } from "./launch/SpriteSelector";
import { initialState as DEFAULT_SETTINGS } from "@/store/settingsSlice";

const LaunchPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const savedPrefs = useMemo(() => loadLauncherPrefs(), []);
  const [settings, setSettings] = useState<SettingsState>(() =>
    applyLauncherPrefs(DEFAULT_SETTINGS, savedPrefs)
  );
  const [spriteName, setSpriteName] = useState(savedPrefs.spriteName ?? "link");
  const [startingItems, setStartingItems] = useState<Record<string, number>>({});
  const [sessions, setSessions] = useState<TrackerSession[]>([]);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [recentSprites, setRecentSprites] = useState<string[]>(() => loadRecentSprites());
  const [autotrackHost, setAutotrackHost] = useState("localhost");
  const [autotrackPort, setAutotrackPort] = useState(8190);
  const [autotrackProtocol, setAutotrackProtocol] = useState<"sni" | "qusb2snes">("sni");
  const [autotrackStatus, setAutotrackStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [sessionName, setSessionName] = useState("");
  const [motd, setMotd] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [nextLadder, setNextLadder] = useState<{ presetId: string; name: string; time: Date } | null>(null);

  // Load sessions from IndexedDB
  useEffect(() => {
    getSessions().then((s) => {
      setSessions(s);
      setSessionsLoaded(true);
    });
  }, []);

  // Fetch next ladder race from alttpr.racing API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ladder/upcoming");
        if (cancelled) return;
        if (!res.ok) return;
        const data = await res.json();
        const race = data[0];
        if (!race || cancelled) return;
        const modeRes = await fetch(`/api/ladder/modes/${encodeURIComponent(race.mode)}`);
        if (cancelled) return;
        if (!modeRes.ok) return;
        const modeData = await modeRes.json();
        const presetId = resolvePresetFromSlug(modeData.slug ?? "");
        if (presetId && !cancelled) {
          setNextLadder({
            presetId,
            name: modeData.name,
            time: new Date(parseInt(race.time) * 1000),
          });
        }
      } catch {
        // Silently ignore — fetch may fail due to network or proxy unavailability
      }
    })()
    return () => {
      cancelled = true;
    };
  }, []);

  // Save UI preferences when sprite or interface settings change
  useEffect(() => {
    saveLauncherPrefs(buildLauncherPrefs({ ...settings, spriteName }));
  }, [spriteName, settings]);

  // Fetch MOTD from public/motd.txt
  // Lets us update the launch page with important announcements without needing a full redeploy or relying on third-party services for dynamic content
  useEffect(() => {
    let cancelled = false;
    fetch("/motd.txt")
      .then((r) => (r.ok ? r.text() : null))
      .then((text) => {
        if (!cancelled && text?.trim()) setMotd(text.trim());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch any active alerts from the server (e.g., maintenance notices)
  useEffect(() => {
    let cancelled = false;
    fetch("/alerts.txt")
      .then((r) => (r.ok ? r.text() : null))
      .then((text) => {
        if (!cancelled && text?.trim()) setAlerts(text.trim());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Probe autotracker connection on mount and when settings change
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setAutotrackStatus("checking");
      if (autotrackProtocol === "sni") {
        try {
          await fetch(`http://${autotrackHost}:${autotrackPort}`, {
            mode: "no-cors",
            signal: AbortSignal.timeout(2000),
          });
          if (!cancelled) setAutotrackStatus("connected");
        } catch {
          if (!cancelled) setAutotrackStatus("disconnected");
        }
      } else {
        try {
          const ws = new WebSocket(`ws://${autotrackHost}:${autotrackPort}`);
          ws.onopen = () => {
            if (!cancelled) setAutotrackStatus("connected");
            ws.close();
          };
          ws.onerror = () => {
            if (!cancelled) setAutotrackStatus("disconnected");
          };
          setTimeout(() => {
            if (ws.readyState !== WebSocket.OPEN) {
              ws.close();
              if (!cancelled) setAutotrackStatus("disconnected");
            }
          }, 2000);
        } catch {
          if (!cancelled) setAutotrackStatus("disconnected");
        }
      }
    }, 10000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [autotrackHost, autotrackPort, autotrackProtocol]);

  const updateSetting = useCallback(<K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = getPresetById(presetId);
    if (preset) {
      setSettings((prev) => applyLauncherPrefs({ ...DEFAULT_SETTINGS, ...preset.settings }, buildLauncherPrefs(prev)));
      setStartingItems(preset.startingItems ?? {});
      setSelectedPresetId(presetId);
    }
  }, []);

  const toggleStartingItem = useCallback((item: string) => {
    setStartingItems((prev) => {
      const current = prev[item] ?? 0;
      const maxCount = ItemsData[item as keyof typeof ItemsData]?.maxCount ?? 1;
      if (current >= maxCount) {
        const next = { ...prev };
        delete next[item];
        return next;
      }
      return { ...prev, [item]: current + 1 };
    });
  }, []);

  const launchTracker = useCallback(
    async (sessionId?: string) => {
      let id = sessionId;
      const isNewSession = !id;

      if (isNewSession) {
        // Create session with current settings including the selected sprite
        const launchSettings = { ...settings, spriteName };
        const session = await createSession(launchSettings, sessionName || undefined, spriteName, selectedPresetId ?? undefined);
        id = session.id;
        setSessions(await getSessions());
      }

      pushRecentSprite(spriteName);
      setRecentSprites(loadRecentSprites());

      const prefix = `alttptracker_session_${id}_`;

      if (isNewSession) {
        // Persist settings with the spriteName included
        await idbDriver.setItem(prefix + "settings", JSON.stringify({ ...settings, spriteName }));

        if (Object.keys(startingItems).length > 0) {
          const itemsState: Record<string, { amount: number }> = {};
          for (const key of Object.keys(ItemsData)) {
            if (key.startsWith("bottle")) continue;
            itemsState[key] = { amount: 0 };
          }
          itemsState["bottle1"] = { amount: 0 };
          itemsState["bottle2"] = { amount: 0 };
          itemsState["bottle3"] = { amount: 0 };
          itemsState["bottle4"] = { amount: 0 };
          for (const [item, count] of Object.entries(startingItems)) {
            if (item === "bottle") {
              for (let i = 1; i <= Math.min(count, 4); i++) {
                itemsState[`bottle${i}`] = { amount: 1 };
              }
            } else if (itemsState[item]) {
              itemsState[item] = { amount: count };
            }
          }
          await idbDriver.setItem(prefix + "items", JSON.stringify(itemsState));
        }
      }

      const windowSizes: Record<string, { w: number; h: number }> = {
        off: { w: 448, h: 448 },
        normal: { w: 1344, h: 449 },
        compact: { w: 448, h: 672 },
        vertical: { w: 448, h: 1344 },
      };
      const { w, h } = windowSizes[settings.mapMode] ?? windowSizes.normal;
      window.open(`/tracker?id=${encodeURIComponent(id!)}`, "_blank", `width=${w},height=${h}`);
    },
    [settings, spriteName, sessionName, selectedPresetId, startingItems],
  );

  const handleDeleteSession = useCallback(async (id: string) => {
    await deleteSession(id);
    setSessions(await getSessions());
  }, []);

  const handleTogglePin = useCallback(async (id: string) => {
    await togglePin(id);
    setSessions(await getSessions());
  }, []);

  const unpinnedCount = sessions.filter((s) => !s.pinned).length;
  const canCreateSession = unpinnedCount > 0 || sessions.length < MAX_SESSIONS;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground overflow-auto">
        <LaunchHeader theme={theme} setTheme={setTheme} autotrackStatus={autotrackStatus} autotrackProtocol={autotrackProtocol} autotrackHost={autotrackHost} autotrackPort={autotrackPort} />

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
          {/* Alerts */}
          {alerts && (
            <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              <AlertOctagon className="size-4 mt-0.5 shrink-0 text-red-600" />
              <span className="whitespace-pre-line">{alerts}</span>
            </div>
          )}
          {/* MOTD */}
          {motd && (
            <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              <Info className="size-4 mt-0.5 shrink-0 text-primary" />
              <span className="whitespace-pre-line">{motd}</span>
            </div>
          )}

          <PresetSection nextLadder={nextLadder} applyPreset={applyPreset} />

          <LaunchCard
            sessionName={sessionName}
            setSessionName={setSessionName}
            spriteName={spriteName}
            selectedPresetId={selectedPresetId}
            sessions={sessions}
            sessionsLoaded={sessionsLoaded}
            canCreateSession={canCreateSession}
            onLaunch={launchTracker}
            onDeleteSession={handleDeleteSession}
            onTogglePin={handleTogglePin}
          />

          <div className="relative flex flex-col lg:block">
            {/* Settings tabs (game settings + tracker settings) */}
            <div className="lg:mr-86 min-h-150 h-full flex flex-col">
              <GameSettingsTabs
                settings={settings}
                updateSetting={updateSetting}
                startingItems={startingItems}
                setStartingItems={setStartingItems}
                toggleStartingItem={toggleStartingItem}
                autotrackProtocol={autotrackProtocol}
                setAutotrackProtocol={setAutotrackProtocol}
                autotrackHost={autotrackHost}
                setAutotrackHost={setAutotrackHost}
                autotrackPort={autotrackPort}
                setAutotrackPort={setAutotrackPort}
              />
            </div>

            {/* Sidebar: Sprite */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-[320px] flex flex-col h-full">
              <SpriteSelector spriteName={spriteName} setSpriteName={setSpriteName} recentSprites={recentSprites} />
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t pt-4 pb-6 mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>Design by Muffins</span>
            <a href="https://github.com/KrisDavie/alttptracker" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Github className="size-3.5" />
              GitHub
            </a>
          </footer>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default LaunchPage;
