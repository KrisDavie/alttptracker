import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import DungeonsData from "@/data/dungeonData";
import { incrementSmallKeyCount } from "@/store/dungeonsSlice";

interface SmallKeyTrackerProps {
  dungeon: string;
  size?: "1x1" | "1x2";
  showTotal?: boolean;
}

function SmallKeyTracker({ dungeon, size = "1x2", showTotal = true }: SmallKeyTrackerProps) {
  const dispatch = useDispatch();
  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];
  const settings = useSelector((state: RootState) => state.settings);
  const collectedSmallKeys = useSelector((state: RootState) => state.dungeons[dungeon]?.smallKeys ?? 0);
  let maxSmallKeys = dungeonData?.totalLocations?.smallkeys || 0;
  if (["keys", "cavekeys"].includes(settings.pottery)) {
    maxSmallKeys += dungeonData?.totalLocations?.keypots || 0;
  }
  if (settings.keyDrop) {
    maxSmallKeys += dungeonData?.totalLocations?.keydrops || 0;
  }

  // TODO: Make maxSmallKeys inc/decrementable

  if (size === "1x1") {
    return (
      <div
        className="grid grid-cols-2 grid-rows-2 w-8 h-8 relative"
        onClick={() => dispatch(incrementSmallKeyCount({ dungeon, maxCount: maxSmallKeys, decrement: false }))}
        onContextMenu={(e) => {
          e.preventDefault();
          dispatch(incrementSmallKeyCount({ dungeon, maxCount: maxSmallKeys, decrement: true }));
        }}
      >
        <div
          className="col-start-1 row-start-1 w-full h-full"
          style={{
            backgroundImage: `url(/dungeons/smallkey.png)`,
            backgroundPosition: "center",
            backgroundSize: "100%",
            imageRendering: "pixelated",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></div>
        {!showTotal && (
          <div className={`col-start-1 row-start-1 col-span-2 row-span-2 font-bold font-arialblack text-xl ${collectedSmallKeys === maxSmallKeys ? "text-green-700" : "text-white"} flex items-center justify-center select-none pl-2 pt-2`}>
            {collectedSmallKeys}
          </div>
        )}
        {/* If showing total, add a split and show got/tot */}
        {showTotal && (
          <>
            <div className={`col-start-2 row-start-1 font-bold font-arialblack text-sm ${collectedSmallKeys === maxSmallKeys ? "text-green-700" : "text-white"} flex items-center justify-center select-none`}>
              {collectedSmallKeys}
            </div>
            <div className="col-start-2 row-start-1 mt-4 h-px w-5/5 bg-white flex items-center justify-center select-none ">
            </div>
            <div className={`col-start-2 row-start-2 font-bold font-arialblack text-sm ${collectedSmallKeys === maxSmallKeys ? "text-green-700" : "text-white"} flex items-center justify-center select-none`}>
              {maxSmallKeys}
            </div>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div
        className="flex flex-row w-16 h-8"
        onClick={() => dispatch(incrementSmallKeyCount({ dungeon, maxCount: maxSmallKeys, decrement: false }))}
        onContextMenu={(e) => {
          e.preventDefault();
          dispatch(incrementSmallKeyCount({ dungeon, maxCount: maxSmallKeys, decrement: true }));
        }}
      >
        <div
          className="w-8 h-8"
          style={{
            backgroundImage: `url(/dungeons/smallkey.png)`,
            width: "100%",
            height: "100%",
            backgroundPosition: "center",
            backgroundSize: "100%",
            imageRendering: "pixelated",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></div>
        {!showTotal && <div className={`min-w-8 min-h-8 font-bold font-arialblack text-xl ${collectedSmallKeys === maxSmallKeys ? "text-green-700" : "text-white"} flex items-center justify-center select-none`}>{collectedSmallKeys}</div>}
        {showTotal && (
          <div className="grid grid-cols-1 grid-rows-1 min-w-8 h-8 items-center justify-center">
            <div className={`col-start-1 row-start-1 font-bold font-arialblack text-sm ${collectedSmallKeys === maxSmallKeys ? "text-green-700" : "text-white"} flex items-center justify-center select-none`}>
              {collectedSmallKeys}
            </div>
            <div className="col-start-1 row-start-1 mt-4 ml-2 h-px w-1/2 bg-white flex items-center justify-center select-none ">
            </div>
            <div className={`col-start-1 row-start-2 mt-0.5 font-bold font-arialblack text-sm ${collectedSmallKeys === maxSmallKeys ? "text-green-700" : "text-white"} flex items-center justify-center select-none`}>
              {maxSmallKeys}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SmallKeyTracker;
