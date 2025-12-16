import ChestCounter from "./ChestCounter";
import BossIcon from "./BossIcon";

interface DungeonSquareProps {
  dungeon: string;
  direction?: "horizontal" | "vertical";
}

function DungeonSquare({ dungeon, direction = "horizontal" }: DungeonSquareProps) {

  return (
    <>
      <div className={`h-16 flex items-center justify-center ${direction === "horizontal" ? "flex-row h-16 w-32" : "flex-col h-32 w-16"}`}>
        <div className="h-16 w-16">
          <BossIcon dungeon={dungeon} />
        </div>
        <div className={`h-16 w-16`}>
            <ChestCounter dungeon={dungeon} />
        </div>
      </div>
    </>
  );
}

export default DungeonSquare;
