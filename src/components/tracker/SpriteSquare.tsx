import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import ChestCounter from "./ChestCounter";
import SpriteDisplay from "./SpriteDisplay";
import TrackerItem from "./TrackerItem";
import BigKeyTracker from "./BigKeyTracker";
import SmallKeyTracker from "./SmallKeyTracker";

function SpriteSquare() {
  const wildBigKeys = useSelector((state: RootState) => state.tracker.settings.wildBigKeys);
  const wildSmallKeys = useSelector((state: RootState) => state.tracker.settings.wildSmallKeys);
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
      {wildSmallKeys && (
        <div>
          <div className="h-4 w-4 absolute top-4 right-4">
            <SmallKeyTracker dungeon="hc" size="1x1" />
          </div>
          <div className="h-4 w-4 absolute top-0.5 right-1 text-white font-bold font-arialblack text-2xs">HC</div>
        </div>
      )}
      {wildSmallKeys && (
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
        {wildSmallKeys && <SmallKeyTracker dungeon="gt" size={doors ? "1x1" : "1x2"} />}
      </div>
    </div>
  );
}

export default SpriteSquare;
