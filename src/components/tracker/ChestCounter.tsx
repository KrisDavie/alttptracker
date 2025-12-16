import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setDungeonCollectedCount } from "../../store/trackerSlice";
import DungeonsData from "@/data/dungeonData";

interface ChestCounterProps {
  dungeon: string;
  small?: boolean;
}

function ChestCounter({ dungeon, small = false }: ChestCounterProps) {
  const dispatch = useDispatch();
  const collected = useSelector((state: RootState) => state.tracker.dungeons[dungeon]?.collectedCount ?? 0);
  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];
  const totLocs = dungeonData?.totalLocations;

  const maxCount = dungeonData && totLocs ? (totLocs.chests) : 0

  const checksRemaining = Math.max(0, maxCount - collected);

  function setCount(newCount: number) {
    let finalCount = newCount;
    if (newCount < 0) {
      finalCount = maxCount;
    } else if (newCount > maxCount) {
      finalCount = 0;
    }
    dispatch(setDungeonCollectedCount({ dungeon, count: finalCount }));
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `url(/dungeons/${collected === maxCount ? "chest0" : "smallchest"}.png)`,
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
        onContextMenu={(e) => { e.preventDefault(); setCount(collected - 1); }}
      >
        <div className={`flex flex-col items-center justify-center h-7/10 w-7/10 bg-white bg-opacity-50 ${small ? "border" : "border-2"} border-black ${collected === maxCount ? "hidden" : ""}`}>
          <div className={`text-black ${small ? "text-sm" : "text-3xl"} font-bold select-none`} onClick={(e) => { e.stopPropagation(); setCount(collected + 1); }} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setCount(collected - 1); }}>
            {checksRemaining}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChestCounter;
