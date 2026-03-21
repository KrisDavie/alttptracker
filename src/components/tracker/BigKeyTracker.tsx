import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setBigKey } from "@/store/dungeonsSlice";

interface BigKeyTrackerProps {
  dungeon: string;
  size?: "1x1" | "1x2";
}

function BigKeyTracker({ dungeon, size = "1x2" }: BigKeyTrackerProps) {
  const dispatch = useDispatch();
  const collectedBigKey = useSelector((state: RootState) => state.dungeons[dungeon]?.bigKey);

  function toggleBigKey() {
    dispatch(setBigKey({ dungeon, hasBigKey: !collectedBigKey }));   

  }
  return (
    <div
      className={`flex flex-row ${size === "1x1" ? "w-4 h-4" : "w-8 h-8"} relative`}
      onClick={() => toggleBigKey()}
      onContextMenu={(e) => {
        e.preventDefault();
        toggleBigKey();
      }}
    >
      <div
        className="w-full h-full absolute top-0 left-0"
        style={{
          backgroundImage: `url(/dungeons/bigkey.png)`,
          backgroundPosition: "center",
          backgroundSize: "100%",
          opacity: collectedBigKey ? 1 : 0.3,
          imageRendering: "pixelated",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></div>
    </div>
  );

}

export default BigKeyTracker;
