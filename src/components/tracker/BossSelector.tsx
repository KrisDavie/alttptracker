import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { incrementBoss } from "@/store/dungeonsSlice";
import { cn } from "@/lib/utils";
import { BossImages } from "@/data/itemData";

interface BossSelectorProps {
  dungeon: string;
  className?: string;
}

function BossSelector({ dungeon, className}: BossSelectorProps) {
  const dispatch = useDispatch();
  const boss = useSelector((state: RootState) => state.dungeons[dungeon]?.boss || "unknown");

  return (
    <div
      key={`${dungeon}-boss`}
      className={cn(``, className)}
      onClick={() => dispatch(incrementBoss({ dungeon, decrement: false }))}
      onContextMenu={(e) => {
        e.preventDefault();
        dispatch(incrementBoss({ dungeon, decrement: true }));
      }}
      style={{
        backgroundImage: `url(${BossImages[boss]})`,
        // opacity: bossDefeated ? 1 : 0.7,
        backgroundPosition: "center",
        backgroundSize: "100%",
        imageRendering: "smooth",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    </div>
  );
}

export default BossSelector;
