import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { toggleDungeonBoss } from "../../store/trackerSlice";
import DungeonsData from "@/data/dungeonData";

interface BossIconProps {
  dungeon: string;
}

function BossIcon({ dungeon }: BossIconProps) {
  const dispatch = useDispatch();
  const bossDefeated = useSelector((state: RootState) => state.tracker.dungeons[dungeon]?.bossDefeated ?? false);
  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];
  
  if (!dungeonData) return null;

  const dungeonImage = (bossDefeated && dungeonData.defeatedIcon) ||dungeonData.icon;

  return (
    <div
      className="h-full w-full"
      onClick={() => dispatch(toggleDungeonBoss({ dungeon: dungeon }))}
      style={{
        backgroundImage: `url(${dungeonImage})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        opacity: bossDefeated ? 1 : 0.3,
        imageRendering: "pixelated"
      }}
    />
  );
}

export default BossIcon;
