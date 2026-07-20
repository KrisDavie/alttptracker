import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { SettingsState } from "@/store/settingsSlice";
import { getLogicSet } from "@/lib/logic/logicMapper";
import { OverworldTraverser } from "@/lib/logic/overworldTraverser";
import { buildEffectiveRegions } from "@/lib/logic/regionsProvider";
import { updateLogicStatuses } from "@/store/checksSlice";

/**
 * Settings as seen by the logic engine: pure-UI fields are pinned to
 * constants so changing them (map layout, colours, tooltips, sprite, event
 * log…) doesn't rebuild the logic graph or re-run the full traversal — a
 * significant main-thread cost on every recompute.
 *
 * mapMode is special: logic only cares whether the map is off (shuffled
 * entrances are then assumed reachable), so it is canonicalized to
 * "off" | "normal".
 */
function normalizeSettingsForLogic(settings: SettingsState): SettingsState {
  return {
    ...settings,
    mapMode: settings.mapMode === "off" ? "off" : "normal",
    autotracking: false,
    includeDungeonItemsInCounter: false,
    connectionLinesMode: "none",
    connectionLineColor: "",
    spriteName: "",
    colouredChests: false,
    showMapTooltips: false,
    showChestTooltips: false,
    entranceLabelsMode: "off",
    showInsetBossSquare: false,
    alwaysShowHCCTCounts: false,
    alwaysShowBigKeys: false,
    alwaysShowSmallKeys: false,
    showKeyTotals: false,
    eventLogMode: "off",
    logTriforcePieces: false,
    entranceLabelOverrides: {},
    customColors: undefined,
    appBackground: "",
  };
}

interface LogicProviderProps {
  children: React.ReactNode;
}
  
function LogicProvider({ children }: LogicProviderProps) {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const items = useSelector((state: RootState) => state.items);
  const dungeons = useSelector((state: RootState) => state.dungeons);
  const entrances = useSelector((state: RootState) => state.entrances);
  const locationsChecks = useSelector((state: RootState) => state.checks.locationsChecks);
  const overworld = useSelector((state: RootState) => state.overworld);

  const url = new URL(window.location.href);
  const isPassivePage = url.pathname === "/map" || url.pathname === "/event-log";

  // Pre-mutate the logic graph when topology-affecting state changes.
  // Skips recomputation when only items/dungeons/checks change.
  const logicSet = useMemo(() => getLogicSet(settings.logicMode), [settings.logicMode]);

  // Identity-stable logic-relevant settings: recompute only when a field the
  // logic engine actually reads changes (UI-only fields are normalized away).
  const normalizedSettings = useMemo(() => normalizeSettingsForLogic(settings), [settings]);
  const logicSettingsKey = JSON.stringify(normalizedSettings);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const logicSettings = useMemo(() => normalizedSettings, [logicSettingsKey]);

  const effectiveGraph = useMemo(() => {
    const snapshot = { items: {} as RootState["items"], settings: logicSettings, dungeons: {} as RootState["dungeons"], entrances, checks: undefined, overworld };
    return buildEffectiveRegions(logicSet.regions as Record<string, import("@/data/logic/logicTypes").RegionLogic>, snapshot);
  }, [logicSettings, entrances, overworld, logicSet]);

  useEffect(() => {
    if (isPassivePage) {
      // Don't run logic on popout-only pages; the tracker page manages this.
      return;
    }
    // Build checks record with just { checked } for the logic engine
    const checks: Record<string, { checked: boolean }> = {};
    for (const [name, status] of Object.entries(locationsChecks)) {
      checks[name] = { checked: status.checked };
    }

    // Apply manuallyChanged offsets to dungeon small keys so the logic
    // engine sees the effective count (base + manual adjustment).
    const effectiveDungeons: typeof dungeons = {};
    for (const [id, dState] of Object.entries(dungeons)) {
      effectiveDungeons[id] = {
        ...dState,
        smallKeys: Math.max(0, dState.smallKeys + (dState.manuallyChanged?.smallKeys ?? 0)),
      };
    }

    const snapshot = { items, settings: logicSettings, dungeons: effectiveDungeons, entrances, checks, overworld };

    const traverser = new OverworldTraverser(snapshot, { regions: effectiveGraph.regions }, effectiveGraph.metadata);
    const newResults = traverser.calculateAll();

    dispatch(updateLogicStatuses(newResults));
  }, [items, logicSettings, dungeons, entrances, locationsChecks, overworld, effectiveGraph, dispatch, isPassivePage]);

  return <>{children}</>;
}

export default LogicProvider
