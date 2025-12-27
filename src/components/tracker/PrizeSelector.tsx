import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { incrementPrizeCount } from "@/store/dungeonsSlice";
import { cn } from "@/lib/utils";

interface PrizeSelectorProps {
  dungeon: string;
  className?: string;
}

function PrizeSelector({ dungeon, className }: PrizeSelectorProps) {
  const dispatch = useDispatch();
  const prize = useSelector((state: RootState) => state.dungeons.dungeons[dungeon]?.prize || "unknown");
  const prizeCollected = useSelector((state: RootState) => state.dungeons.dungeons[dungeon]?.prizeCollected || false);

  const prizeImages: Record<string, string> = {
    unknown: "/dungeons/prize_unknown.png",
    greenPendant: "/dungeons/green_pendant.png",
    pendant: "/dungeons/pendant.png",
    map: "/dungeons/map.png",
    redCrystal: "/dungeons/red_crystal.png",
    crystal: "/dungeons/crystal.png",
  };

  return (
    <div
      key={`${dungeon}-prize`}
      className={cn(`border-2 ${prizeCollected ? "border-green-600" : "border-red-600"}`, className)}
      onClick={() => dispatch(incrementPrizeCount({ dungeon, decrement: false }))}
      onContextMenu={(e) => {
        e.preventDefault();
        dispatch(incrementPrizeCount({ dungeon, decrement: true }));
      }}
      style={{
        backgroundImage: `url(${prizeImages[prize]})`,
        opacity: prizeCollected ? 1 : 0.7,
        backgroundPosition: "center",
        backgroundSize: (prize === "greenPendant" || prize === "pendant") ? "90%" : "110%",
        imageRendering: "smooth",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    </div>
  );
}

export default PrizeSelector;
