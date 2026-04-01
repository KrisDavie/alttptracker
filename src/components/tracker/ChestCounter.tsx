import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setDungeonCollectedCount } from "../../store/dungeonsSlice";
import DungeonsData from "@/data/dungeonData";
import { mapStatusBg } from "@/hooks/useStatusColors";
import { getActiveLocations } from "@/lib/logic/locationMapper";
import { useLocationTooltipData } from "@/hooks/useLocationTooltipData";
import { LocationTooltip } from "./LocationTooltip";

interface ChestCounterProps {
  dungeon: string;
  small?: boolean;
}

function ChestCounter({ dungeon, small = false }: ChestCounterProps) {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const showChestTooltips = useSelector((state: RootState) => state.settings.showChestTooltips ?? true);
  const colouredChests = useSelector((state: RootState) => state.settings.colouredChests ?? true);
  const collected = useSelector((state: RootState) => state.dungeons[dungeon]?.collectedCount ?? 0);
  const checks = useSelector((state: RootState) => state.checks);
  const dungeonState = useSelector((state: RootState) => state.dungeons[dungeon]);

  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];

  const { itemLocations, itemChecks, displayList, status, maxLogicStatus, handleCheckClick, handleGroupExpand, resetGroups } = useLocationTooltipData(dungeonData.name, dungeonData.additionalEntries);

  // Dynamically compute active item locations based on current settings
  const dungeonChecks = getActiveLocations(dungeonData.name, settings);
  if (dungeonData.additionalEntries) {
    for (const entry of dungeonData.additionalEntries) {
      dungeonChecks.push(...getActiveLocations(entry, settings));
    }
  }

  let maxCount = dungeonChecks.length;
  let numChecks = dungeonChecks.map((loc) => checks.locationsChecks[loc])?.filter((check) => check?.checked).length || 0;

  const wildBigKeys = settings.wildBigKeys;
  const wildSmallKeys = settings.wildSmallKeys;
  const wildCompasses = settings.wildCompasses;
  const wildMaps = settings.wildMaps;
  const wildPrizes = settings.prizeShuffle;
  const totLocs = dungeonData?.totalLocations;

  const hasPrize = totLocs?.prize ?? false;

  // Count small keys in the active location set
  const totSKeys = dungeonChecks.filter((loc) => loc.includes("Key Drop") || loc.includes("Pot Key")).length + (totLocs?.smallkeys || 0);

  const totPrizes = dungeonChecks.filter((loc) => loc.includes("Prize")).length + (hasPrize ? 1 : 0);

  // Adjust maxCount based on settings
  // Subtract out dungeon items that are not shuffled into the pool
  if (!settings.includeDungeonItemsInCounter) {
    maxCount -= (wildBigKeys ? 0 : totLocs?.bigkey ? 1 : 0) + (wildSmallKeys === "wild" ? 0 : totSKeys) + (wildCompasses ? 0 : totLocs?.compass ? 1 : 0) + (wildMaps ? 0 : totLocs?.map ? 1 : 0) + (wildPrizes === "wild" ? 0 : totPrizes);

    // Only count dungeon items
    numChecks -= dungeonState.smallKeys && wildSmallKeys !== "wild" ? dungeonState.smallKeys : 0;
    numChecks -= dungeonState.bigKey && !wildBigKeys ? 1 : 0;
    numChecks -= dungeonState.compass && !wildCompasses ? 1 : 0;
    numChecks -= dungeonState.map && !wildMaps ? 1 : 0;
    numChecks -= hasPrize && wildPrizes !== "wild" ? 1 : 0;
  }

  // TODO: Collected can be more than maxCount when settings are toggle off after collecting items.
  // This causes the remaining checks to go negative. We should probably clamp collected to maxCount when settings change.
  const checksRemaining = Math.max(0, maxCount - numChecks - collected);

  function setCount(newCount: number) {
    let finalCount = newCount;
    if (newCount < 0) {
      finalCount = maxCount;
    } else if (newCount > maxCount) {
      finalCount = 0;
    }
    dispatch(setDungeonCollectedCount({ dungeon, count: finalCount }));
  }

  const bgClass = status === "none" && maxLogicStatus === "unavailable" ? mapStatusBg("none") : status === "all" ? mapStatusBg("checked") : mapStatusBg(maxLogicStatus);

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
            onClick={(e) => {
              e.stopPropagation();
              setCount(collected + 1);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCount(collected - 1);
            }}
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
