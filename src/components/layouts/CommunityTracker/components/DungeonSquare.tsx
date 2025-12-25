import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import ChestCounter from "../../../tracker/ChestCounter";
import BossIcon from "../../../tracker/BossIcon";
import SmallKeyTracker from "../../../tracker/SmallKeyTracker";
import BigKeyTracker from "../../../tracker/BigKeyTracker";
import MedallionSelector from "@/components/tracker/MedallionSelector";
import PrizeSelector from "@/components/tracker/PrizeSelector";

interface DungeonSquareProps {
  dungeon: string;
  direction?: "horizontal" | "vertical";
}

function DungeonSquare({ dungeon, direction = "horizontal" }: DungeonSquareProps) {
  const wildSmallKeys = useSelector((state: RootState) => state.settings.wildSmallKeys);
  const wildBigKeys = useSelector((state: RootState) => state.settings.wildBigKeys);
  const doors = false;

  const renderContent = () => {
    // Standard Mode
    if (wildSmallKeys === "inDungeon" && !wildBigKeys && !doors) {
      return <ChestCounter dungeon={dungeon} />;
    }

    // Doors Mode (Placeholder structure)
    if (doors) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
          <div className="col-span-1 row-span-1">
            <ChestCounter dungeon={dungeon} small />
          </div>
          <div className="col-span-1 row-span-1">{wildSmallKeys === "wild" && <SmallKeyTracker dungeon={dungeon} size="1x1" />}</div>
          {/* Add more door-specific slots here */}
        </div>
      );
    }

    // Wild Keys Mode
    return (
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
        <div className="col-span-1 row-span-1">
          <ChestCounter dungeon={dungeon} small />
        </div>
        <div className="col-span-1 row-span-1">{wildBigKeys && <BigKeyTracker dungeon={dungeon} />}</div>
        <div className="col-span-2 row-span-1">{wildSmallKeys === "wild" && <SmallKeyTracker dungeon={dungeon} size="1x2" />}</div>
      </div>
    );
  };

  return (
    <div className={`h-16 flex items-center justify-center ${direction === "horizontal" ? "flex-row h-16 w-32" : "flex-col h-32 w-16"}`}>
      <div className="h-16 w-16 relative">
        <BossIcon dungeon={dungeon} />
        <PrizeSelector dungeon={dungeon} className="absolute bottom-0 right-0 h-1/2 w-1/2 rounded-full bg-black" />
        {(dungeon === "mm" || dungeon === "tr") && <MedallionSelector entrance={dungeon} className="absolute bottom-0 left-0 h-1/2 w-1/2" />}
      </div>
      <div className="h-16 w-16">{renderContent()}</div>
    </div>
  );
}

export default DungeonSquare;
