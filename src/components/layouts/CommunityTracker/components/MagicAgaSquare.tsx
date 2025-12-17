import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import TrackerItem from "../../../tracker/TrackerItem";
import BossIcon from "../../../tracker/BossIcon";

function MagicAgaSquare() {
  // const wildBigKeys = useSelector((state: RootState) => state.tracker.settings.wildBigKeys);
  const wildSmallKeys = useSelector((state: RootState) => state.tracker.settings.wildSmallKeys);

  if (!wildSmallKeys) {
    return <TrackerItem itemName="magic" />;
  }

  return (
    <div className="grid grid-cols-2 w-full h-full">
      <div className="w-full h-full">
        <BossIcon dungeon="ct" />
      </div>
      <div className="w-full h-full"></div>
      <div className="w-full h-full">
        <TrackerItem itemName="magic" />
      </div>
      <div className="w-full h-full">
        <BossIcon dungeon="gt" />
      </div>
    </div>
  );
}

export default MagicAgaSquare;
