import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setDungeonCollectedCount } from "../../store/dungeonsSlice";
import DungeonsData from "@/data/dungeonData";
import { mapStatusBg } from "@/hooks/useStatusColors";
import { useLocationTooltipData } from "@/hooks/useLocationTooltipData";
import { useDungeonChestRemaining } from "@/hooks/useDungeonChestRemaining";
import { LocationTooltip } from "./LocationTooltip";
import type { LogicStatus } from "@/data/logic/logicTypes";

interface ChestCounterProps {
  dungeon: string;
  small?: boolean;
}

function ChestCounter({ dungeon, small = false }: ChestCounterProps) {
  const dispatch = useDispatch();
  const showChestTooltips = useSelector((state: RootState) => state.settings.showChestTooltips ?? true);
  const colouredChests = useSelector((state: RootState) => state.settings.colouredChests ?? true);

  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];

  const { itemLocations, itemChecks, displayList, status, maxLogicStatus, handleCheckClick, handleGroupExpand, resetGroups } = useLocationTooltipData(dungeonData.name, dungeonData.additionalEntries);

  const { remaining: rawChecksRemaining, maxCount, collected, numChecksFromLocations } = useDungeonChestRemaining(dungeon);

  // Some game locations record the picked-up item in SRAM immediately but only mark the
  // location as cleared after the player transitions rooms. When such a location holds a
  // dungeon item (e.g. big key), `dungeonState.bigKey` flips on while the location's
  // checked flag stays false, transiently subtracting 1 from `numChecks` without a
  // matching increase, which would spuriously bump the chest counter by 1 until the
  // room transition occurs.
  //
  // Suppress that spurious increase: only let the displayed count grow for legitimate
  // reasons (manual `collected` decrease, settings change affecting maxCount, or a
  // location being un-checked). Uses the React "adjust state during render" pattern —
  // a conditional setState during render, which is idempotent and Compiler-safe.
  const [displayed, setDisplayed] = useState(rawChecksRemaining);
  const [lastDeps, setLastDeps] = useState({ collected, maxCount, numChecksFromLocations });

  if (collected !== lastDeps.collected || maxCount !== lastDeps.maxCount || numChecksFromLocations !== lastDeps.numChecksFromLocations) {
    // A tracked dependency changed: a dungeon-item-only change (the spurious spike)
    // leaves these untouched, so the displayed value stays frozen in that case.
    const allowIncrease = collected < lastDeps.collected || maxCount !== lastDeps.maxCount || numChecksFromLocations < lastDeps.numChecksFromLocations;
    setLastDeps({ collected, maxCount, numChecksFromLocations });
    setDisplayed(!allowIncrease && rawChecksRemaining > displayed ? displayed : rawChecksRemaining);
  }

  const checksRemaining = displayed;

  function setCount(newCount: number) {
    let finalCount = newCount;
    if (newCount < 0) {
      finalCount = maxCount;
    } else if (newCount > maxCount) {
      finalCount = 0;
    }
    dispatch(setDungeonCollectedCount({ dungeon, count: finalCount }));
  }

  let finalMaxLogicStatus: LogicStatus | "someAvailable"

  const itemChecksStatusSet = new Set(
    itemLocations
      .filter((loc) => !itemChecks?.[loc]?.status.checked)
      .map((loc) => itemChecks?.[loc]?.status.logic)
      .filter((status): status is LogicStatus => !!status)
  );

  if ( itemChecksStatusSet.size != 1 && itemChecksStatusSet.has("available")) {
    finalMaxLogicStatus = "someAvailable";
  } else {
    finalMaxLogicStatus = maxLogicStatus;
  }


  const bgClass = status === "none" && maxLogicStatus === "unavailable" ? mapStatusBg("none") : status === "all" ? mapStatusBg("checked") : mapStatusBg(finalMaxLogicStatus);


  return (
    <>
      <div
        className="group relative"
        style={{
          backgroundImage: `url(/dungeons/${checksRemaining === 0 ? "chest0" : "smallchest"}.png)`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setCount(collected + 1)}
        onContextMenu={(e) => {
          e.preventDefault();
          setCount(collected - 1);
        }}
      >
        <div className={`flex flex-col items-center justify-center h-7/10 w-7/10 ${colouredChests ? bgClass : "bg-white"} bg-opacity-50 ${small ? "border" : "border-2"} border-black ${checksRemaining === 0 ? "invisible" : ""}`}>
          <div
            className={`text-black ${small ? (checksRemaining > 99 ? "text-xs" : "") : checksRemaining > 99 ? "text-2xl" : "text-4xl"} select-none font-roboto font-black`}
          >
            {checksRemaining}
          </div>
        </div>
        {showChestTooltips && (
          <LocationTooltip
            name={dungeonData.name}
            xPercent={50}
            yPercent={0}
            items={itemLocations.length > 1 ? displayList : undefined}
            singleCheck={itemLocations.length === 1 ? { ...itemChecks[itemLocations[0]], key: itemLocations[0] } : undefined}
            onCheckClick={handleCheckClick}
            onGroupExpand={handleGroupExpand}
            onClose={resetGroups}
            autoPosition
            preventExpansion
            size="md"
          />
        )}
      </div>
    </>
  );
}

export default ChestCounter;
