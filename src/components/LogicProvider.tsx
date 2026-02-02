import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getLogicSet } from "@/lib/logic/logicMapper";
import { OverworldTraverser } from "@/lib/logic/overworldTraverser";
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

  useEffect(() => {
    const snapshot = { items, settings, dungeons, entrances }; // Get current Redux state
    const logicSet = getLogicSet(settings.logicMode);

    const traverser = new OverworldTraverser(snapshot, logicSet);
    const newResults = traverser.calculateAll();

    dispatch(updateLogicStatuses(newResults));
  }, [items, settings, dungeons, entrances, dispatch]); 

  return <>{children}</>;
}

export default LogicProvider