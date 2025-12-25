import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import DungeonsData from "@/data/dungeonData";
import { setSmallKeyCount } from "@/store/dungeonsSlice";

interface SmallKeyTrackerProps {
  dungeon: string;
  size?: "1x1" | "1x2";
}

function SmallKeyTracker({ dungeon, size = "1x2" }: SmallKeyTrackerProps) {
  const dispatch = useDispatch();
  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];
  const collectedSmallKeys = useSelector((state: RootState) => state.dungeons.dungeons[dungeon]?.smallKeys ?? 0);
  const maxSmallKeys = dungeonData?.totalLocations?.smallkeys || 0;

  function setCount(newCount: number) {
    let finalCount = newCount;
    if (newCount < 0) {
      finalCount = maxSmallKeys;
    } else if (newCount > maxSmallKeys) {
      finalCount = 0;
    }
    dispatch(setSmallKeyCount({ dungeon, count: finalCount }));
  }

  if (size === "1x1") {
    return (
      <div
        className="grid grid-cols-2 grid-rows-2 w-8 h-8 relative"
        onClick={() => setCount(collectedSmallKeys + 1)}
        onContextMenu={(e) => {
          e.preventDefault();
          setCount(collectedSmallKeys - 1);
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
        <div className={`col-start-1 row-start-1 col-span-2 row-span-2 font-bold font-arialblack text-xl ${collectedSmallKeys === maxSmallKeys ? "text-green-700" : "text-white"} flex items-center justify-center select-none pl-2 pt-2`}>{collectedSmallKeys}</div>
      </div>
    );
  } else {
    return (
      <div
        className="flex flex-row w-16 h-8"
        onClick={() => setCount(collectedSmallKeys + 1)}
        onContextMenu={(e) => {
          e.preventDefault();
          setCount(collectedSmallKeys - 1);
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
        <div className={`min-w-8 min-h-8 font-bold font-arialblack text-xl ${collectedSmallKeys === maxSmallKeys ? "text-green-700" : "text-white"} flex items-center justify-center select-none`}>{collectedSmallKeys}</div>
      </div>
    );
  }
}

export default SmallKeyTracker;
