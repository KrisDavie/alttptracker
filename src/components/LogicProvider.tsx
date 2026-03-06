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

  // Pre-mutate the logic graph when topology-affecting state changes.
  // Skips recomputation when only items/dungeons/checks change.
  const logicSet = useMemo(() => getLogicSet(settings.logicMode), [settings.logicMode]);

  const effectiveGraph = useMemo(() => {
    const snapshot = { items: {} as RootState["items"], settings, dungeons: {} as RootState["dungeons"], entrances, checks: undefined, overworld };
    return buildEffectiveRegions(logicSet.regions as Record<string, import("@/data/logic/logicTypes").RegionLogic>, snapshot);
  }, [settings, entrances, overworld, logicSet]);

  useEffect(() => {
    // Build checks record with just { checked } for the logic engine
    const checks: Record<string, { checked: boolean }> = {};
    for (const [name, status] of Object.entries(locationsChecks)) {
      checks[name] = { checked: status.checked };
    }
    const snapshot = { items, settings, dungeons, entrances, checks, overworld };

    const traverser = new OverworldTraverser(snapshot, { regions: effectiveGraph.regions }, effectiveGraph.metadata);
    const newResults = traverser.calculateAll();

    dispatch(updateLogicStatuses(newResults));
  }, [items, settings, dungeons, entrances, locationsChecks, overworld, effectiveGraph, dispatch]); 

  return <>{children}</>;
}

export default LogicProvider