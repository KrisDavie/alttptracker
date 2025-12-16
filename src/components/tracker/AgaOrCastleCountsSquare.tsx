import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import BossIcon from "./BossIcon";
import ChestCounter from "./ChestCounter";

function AgaOrCastleCountsSquare() {
  // const wildBigKeys = useSelector((state: RootState) => state.tracker.settings.wildBigKeys);
  const wildSmallKeys = useSelector((state: RootState) => state.tracker.settings.wildSmallKeys);

  if (!wildSmallKeys) {
    return (
      <div
        className="grid grid-cols-2 grid-rows-2 w-full h-full"
        style={{
          backgroundImage: "url(/items/splitbackground.png)",
          backgroundSize: "100% 100%",
          imageRendering: "pixelated",
        }}
      >
        <div className="col-start-1 row-start-1 w-full h-full">
          <BossIcon dungeon="ct" />
        </div>
        <div className="col-start-2 row-start-2 w-full h-full">
          <BossIcon dungeon="gt" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 w-full h-full">
      <div className="w-full h-full text-white font-arialblack font-bold text-2xs flex items-end justify-end pb-1 pr-1">HC</div>
      <div className="w-full h-full">
        <ChestCounter dungeon="hc" small />
      </div>
      <div className="w-full h-full text-white font-arialblack font-bold text-2xs flex items-end justify-end pb-1 pr-1">CT</div>
      <div className="w-full h-full">
        <ChestCounter dungeon="ct" small />
      </div>
    </div>
  );
}

export default AgaOrCastleCountsSquare;
