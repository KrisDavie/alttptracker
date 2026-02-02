import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setDungeonCollectedCount } from "../../store/dungeonsSlice";
import DungeonsData from "@/data/dungeonData";

interface ChestCounterProps {
  dungeon: string;
  small?: boolean;
}

function ChestCounter({ dungeon, small = false }: ChestCounterProps) {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const collected = useSelector((state: RootState) => state.dungeons[dungeon]?.collectedCount ?? 0);
  const wildBigKeys = useSelector((state: RootState) => state.settings.wildBigKeys);
  const wildSmallKeys = useSelector((state: RootState) => state.settings.wildSmallKeys);
  const wildCompasses = useSelector((state: RootState) => state.settings.wildCompasses);
  const wildMaps = useSelector((state: RootState) => state.settings.wildMaps);

  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];
  const totLocs = dungeonData?.totalLocations;

  let maxCount = dungeonData && totLocs ? (totLocs.chests) : 0
  let totSKeys = dungeonData && totLocs ? (totLocs.smallkeys) : 0;

  if (['keys', 'cavekeys'].includes(settings.pottery)) {
    totSKeys += dungeonData?.totalLocations?.keypots || 0;
    maxCount += dungeonData?.totalLocations?.keypots || 0;
  }

  if (settings.keyDrop) {
    totSKeys += dungeonData?.totalLocations?.keydrops || 0;
    maxCount += dungeonData?.totalLocations?.keydrops || 0;
  }

  // Adjust maxCount based on settings

  // Maxcount starts as total locations, then we subtract out items that are not shuffled
  if (!settings.includeDungeonItemsInCounter) {
    maxCount -= ((wildBigKeys ? 0 : (totLocs?.bigkey ? 1 : 0))
      + (wildSmallKeys === "wild" ? 0 : (totSKeys))
      + (wildCompasses ? 0 : (totLocs?.compass ? 1 : 0))
      + (wildMaps ? 0 : (totLocs?.map ? 1 : 0)));
  }

  // TODO: Collected can be more than maxCount when settings are toggle off after collecting items.
  // This causes the remaining checks to go negative. We should probably clamp collected to maxCount when settings change.

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
        onContextMenu={(e) => { e.preventDefault(); setCount(collected - 1); }}
      >
        <div className={`flex flex-col items-center justify-center h-7/10 w-7/10 bg-white bg-opacity-50 ${small ? "border" : "border-2"} border-black ${checksRemaining === 0 ? "invisible" : ""}`}>
          <div className={`text-black ${small ? "": "text-4xl"} select-none font-roboto font-black`} onClick={(e) => { e.stopPropagation(); setCount(collected + 1); }} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setCount(collected - 1); }}>
            {checksRemaining}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChestCounter;
