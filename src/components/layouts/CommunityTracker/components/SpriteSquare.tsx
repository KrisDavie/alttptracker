import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import ChestCounter from "../../../tracker/ChestCounter";
import SpriteDisplay from "../../../tracker/SpriteDisplay";
import TrackerItem from "../../../tracker/TrackerItem";
import BigKeyTracker from "../../../tracker/BigKeyTracker";
import SmallKeyTracker from "../../../tracker/SmallKeyTracker";
import AutotrackingIcon from "@/components/AutotrackingIcon";

function SpriteSquare() {
  const wildBigKeys = useSelector((state: RootState) => state.settings.wildBigKeys);
  const wildSmallKeys = useSelector((state: RootState) => state.settings.wildSmallKeys);
  const autotracking = useSelector((state: RootState) => state.settings.autotracking);
  const doors = false;

  return (
    <div className="relative w-full h-full">
      <div className="h-24 w-24">
        <SpriteDisplay />
      </div>
      <div className="h-10 w-10 absolute top-14 right-8">
        <TrackerItem itemName="moonpearl" />
      </div>
      <div className="h-12 w-12 absolute top-0 right-8">
        <TrackerItem itemName="sword" />
      </div>
      <div className="h-10 w-10 absolute bottom-8 right-22">
        <TrackerItem itemName="shield" />
      </div>
      <div className="h-4 w-4 absolute top-11 right-9">
        <TrackerItem itemName="heartpiece" skipFirstImgOnCollect />
      </div>
      {autotracking && (
        <div className="h-4 w-4 absolute top-1 right-7.5">
          <AutotrackingIcon size={16} />
        </div>
      )}

      {wildSmallKeys === "wild" && (
        <div>
          <div className="h-4 w-4 absolute top-4 right-4">
            <SmallKeyTracker dungeon="hc" size="1x1" />
          </div>
          <div className="h-4 w-4 absolute top-0.5 right-1 text-white font-bold font-arialblack text-2xs">HC</div>
        </div>
      )}
      {wildSmallKeys === "wild" && (
        <div>
          <div className="h-4 w-4 absolute top-16 right-4">
            <SmallKeyTracker dungeon="ct" size="1x1" />
          </div>

          <div className="h-4 w-4 absolute top-12.5 right-1 text-white font-bold font-arialblack text-2xs">CT</div>
        </div>
      )}

      <div className="flex flex-row h-8 w-32">
        <div className="flex flex-row h-8 w-8">
          <ChestCounter dungeon="gt" small />
        </div>
        {wildBigKeys && <BigKeyTracker dungeon="gt" />}
        {wildSmallKeys === "wild" && <SmallKeyTracker dungeon="gt" size={doors ? "1x1" : "1x2"} />}
      </div>
    </div>
  );
}

export default SpriteSquare;
