import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import DungeonsData from "@/data/dungeonData";
import { incrementSmallKeyCount, setMaxSmallKeys } from "@/store/dungeonsSlice";
import { toggleScoutedItem } from "@/store/scoutsSlice";
import { setCurrentMode, setHoveredScout, setSelectedLocation } from "@/store/trackerSlice";

interface SmallKeyTrackerProps {
  dungeon: string;
  size?: "1x1" | "1x2";
  showTotal?: boolean;
}

function SmallKeyTracker({ dungeon, size = "1x2", showTotal = true }: SmallKeyTrackerProps) {
  const dispatch = useDispatch();
  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];
  const settings = useSelector((state: RootState) => state.settings);
  const _collectedSmallKeys = useSelector((state: RootState) => state.dungeons[dungeon]?.smallKeys ?? 0);
  const currentMode = useSelector((state: RootState) => state.trackerState.currentMode);
  const selectedLocation = useSelector((state: RootState) => state.trackerState.selectedLocation);

  // Allow to still increment/decrement small keys even if manually changed, but keep track of manual changes to adjust the count accordingly
  const manuallyChangedSmallKeys = useSelector((state: RootState) => state.dungeons[dungeon]?.manuallyChanged.smallKeys ?? 0);
  const manuallyChangedMaxSmallKeys = useSelector((state: RootState) => state.dungeons[dungeon]?.manuallyChanged.maxSmallKeys ?? 0);

  let collectedSmallKeys = _collectedSmallKeys + manuallyChangedSmallKeys;

  let maxSmallKeys = dungeonData?.totalLocations?.smallkeys || 0;
  if (["keys", "cavekeys", "lottery", "dungeon"].includes(settings.pottery)) {
    maxSmallKeys += dungeonData?.totalLocations?.keypots || 0;
  }
  if (settings.enemyDrop !== "none") {
    maxSmallKeys += dungeonData?.totalLocations?.keydrops || 0;
  }
  maxSmallKeys = Math.max(0, maxSmallKeys + manuallyChangedMaxSmallKeys);

  if (collectedSmallKeys > maxSmallKeys) {
    collectedSmallKeys = maxSmallKeys;
  } else if (collectedSmallKeys < 0) {
    collectedSmallKeys = 0;
  }

  const MAX_CHANGABLE = false;

  function handleWheel(e: React.WheelEvent) {
    if (!MAX_CHANGABLE) return;
    if (e.deltaY < 0) {
      dispatch(setMaxSmallKeys({ dungeon, maxSmallKeys: manuallyChangedMaxSmallKeys + 1 }));
    } else {
      dispatch(setMaxSmallKeys({ dungeon, maxSmallKeys: manuallyChangedMaxSmallKeys - 1 }));
    }
  }

  const commonProps = {
    onWheel: handleWheel,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentMode === "scout" && selectedLocation) {
        dispatch(toggleScoutedItem({ marker: selectedLocation, item: { kind: "smallkey", id: dungeon } }));
        dispatch(setCurrentMode("none"));
        dispatch(setSelectedLocation(null));
        return;
      }
      dispatch(incrementSmallKeyCount({ dungeon, decrement: false }));
    },
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentMode === "scout") {
        dispatch(setCurrentMode("none"));
        dispatch(setSelectedLocation(null));
        return;
      }
      dispatch(incrementSmallKeyCount({ dungeon, decrement: true }));
    },
    onMouseEnter: () => dispatch(setHoveredScout({ kind: "smallkey", id: dungeon })),
    onMouseLeave: () => dispatch(setHoveredScout(null)),
  };

  const keyIcon = (
    <div
      style={{
        backgroundImage: `url(/dungeons/smallkey.png)`,
        backgroundPosition: "center",
        backgroundSize: "100%",
        imageRendering: "pixelated",
        width: "100%",
        height: "100%",
      }}
    />
  );

  const statusColor = collectedSmallKeys === maxSmallKeys ? "text-green-700" : "text-white";

  if (size === "1x1") {
    return (
      <div className="grid grid-cols-2 grid-rows-2 w-8 h-8 relative" {...commonProps}>
        <div className="col-start-1 row-start-1 w-full h-full">{keyIcon}</div>
        {!showTotal ? (
          <div className={`col-start-1 row-start-1 col-span-2 row-span-2 font-bold font-arialblack text-xl ${statusColor} flex items-center justify-center select-none pl-2 pt-2`}>
            {collectedSmallKeys}
          </div>
        ) : (
          <>
            <div className={`col-start-2 row-start-1 font-bold font-arialblack text-sm ${statusColor} flex items-center justify-center select-none`}>
              {collectedSmallKeys}
            </div>
            <div className="col-start-2 row-start-1 mt-4 h-px w-5/5 bg-white flex items-center justify-center select-none" />
            <div className={`col-start-2 row-start-2 font-bold font-arialblack text-sm ${statusColor} flex items-center justify-center select-none`}>
              {maxSmallKeys}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-row w-16 h-8" {...commonProps}>
      <div className="w-8 h-8">{keyIcon}</div>
      {!showTotal ? (
        <div className={`min-w-8 min-h-8 font-bold font-arialblack text-xl ${statusColor} flex items-center justify-center select-none`}>
          {collectedSmallKeys}
        </div>
      ) : (
        <div className="grid grid-cols-1 grid-rows-1 min-w-8 h-8 items-center justify-center">
          <div className={`col-start-1 row-start-1 font-bold font-arialblack text-sm ${statusColor} flex items-center justify-center select-none`}>
            {collectedSmallKeys}
          </div>
          <div className="col-start-1 row-start-1 mt-4 ml-2 h-px w-1/2 bg-white flex items-center justify-center select-none" />
          <div className={`col-start-1 row-start-2 mt-0.5 font-bold font-arialblack text-sm ${statusColor} flex items-center justify-center select-none`}>
            {maxSmallKeys}
          </div>
        </div>
      )}
    </div>
  );
}

export default SmallKeyTracker;
