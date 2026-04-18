import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getLogicSet } from "@/lib/logic/logicMapper";
import { OverworldTraverser } from "@/lib/logic/overworldTraverser";
import { buildEffectiveRegions } from "@/lib/logic/regionsProvider";
import { updateLogicStatuses } from "@/store/checksSlice";

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
  const isMapPage = url.pathname === "/map";

  // Pre-mutate the logic graph when topology-affecting state changes.
  // Skips recomputation when only items/dungeons/checks change.
  const logicSet = useMemo(() => getLogicSet(settings.logicMode), [settings.logicMode]);

  const effectiveGraph = useMemo(() => {
    const snapshot = { items: {} as RootState["items"], settings, dungeons: {} as RootState["dungeons"], entrances, checks: undefined, overworld };
    return buildEffectiveRegions(logicSet.regions as Record<string, import("@/data/logic/logicTypes").RegionLogic>, snapshot);
  }, [settings, entrances, overworld, logicSet]);

  useEffect(() => {
    if (isMapPage) {
      // Don't run logic on the map page, the item page manages this
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

    const snapshot = { items, settings, dungeons: effectiveDungeons, entrances, checks, overworld };

    const traverser = new OverworldTraverser(snapshot, { regions: effectiveGraph.regions }, effectiveGraph.metadata);
    const newResults = traverser.calculateAll();

    dispatch(updateLogicStatuses(newResults));
  }, [items, settings, dungeons, entrances, locationsChecks, overworld, effectiveGraph, dispatch, isMapPage]); 

  return <>{children}</>;
}

export default LogicProvider