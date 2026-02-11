import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import ChestCounter from "../../../tracker/ChestCounter";
import SpriteDisplay from "../../../tracker/SpriteDisplay";
import TrackerItem from "../../../tracker/TrackerItem";
import BigKeyTracker from "../../../tracker/BigKeyTracker";
import SmallKeyTracker from "../../../tracker/SmallKeyTracker";
import AutotrackingIcon from "@/components/tracker/AutotrackingIcon";
import { setModalOpen } from "@/store/trackerSlice";

function SpriteSquare() {
  const dispatch = useDispatch();
  const wildBigKeys = useSelector((state: RootState) => state.settings.wildBigKeys);
  const wildSmallKeys = useSelector((state: RootState) => state.settings.wildSmallKeys);
  const keyDrop = useSelector((state: RootState) => state.settings.keyDrop);
  const autotracking = useSelector((state: RootState) => state.settings.autotracking);
  const doors = false;

  return (
    <div className="relative w-full h-full">
      <div className="h-24 w-24">
        <SpriteDisplay spriteName="dark_link" />
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
      {/* Mystery Flags */}
      <div className="h-6 w-6 absolute top-12 left-0">
        <div
          style={{
            backgroundImage: `url(/dungeons/flagicon.png)`,
            width: "100%",
            height: "100%",
            backgroundPosition: "center",
            backgroundSize: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => dispatch(setModalOpen("mystery"))}
        />
      </div>
      {/* Autotracking Icon */}
      {autotracking && (
        <div className="h-4 w-4 absolute top-0.5 right-18.5">
          <AutotrackingIcon size={16} />
        </div>
      )}
      {/* HC */}
      {(wildSmallKeys === "wild" || keyDrop) && (
        <div>
          <div className="h-4 w-4 absolute top-4 right-4">
            {wildSmallKeys === "wild" && <SmallKeyTracker dungeon="hc" size="1x1" />}
            {keyDrop && (
              <div className={`h-1 w-1 absolute ${wildSmallKeys === "wild" ? "top-4 right-3" : "top-0 right-3"} rounded-full bg-black`}>
                <BigKeyTracker dungeon="hc" size={wildSmallKeys === "wild" ? "1x1" : "1x2"} />
              </div>
            )}
          </div>
          <div className="h-4 w-4 absolute top-0.5 right-1 text-white font-bold font-arialblack text-2xs">HC</div>
        </div>
      )}
      {/* CT */}
      {(wildSmallKeys === "wild" || keyDrop) && (
        <div>
          <div className="h-4 w-4 absolute top-16 right-4">
            {wildSmallKeys === "wild" && <SmallKeyTracker dungeon="ct" size="1x1" />}
            {keyDrop && (
              <div className={`h-1 w-1 absolute ${wildSmallKeys === "wild" ? "top-4 right-3" : "top-0 right-3"} rounded-full bg-black`}>
                <BigKeyTracker dungeon="ct" size={wildSmallKeys === "wild" ? "1x1" : "1x2"} />
              </div>
            )}
          </div>
          <div className="h-4 w-4 absolute top-12.5 right-1 text-white font-bold font-arialblack text-2xs">CT</div>
        </div>
      )}
      {/* GT */}
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
