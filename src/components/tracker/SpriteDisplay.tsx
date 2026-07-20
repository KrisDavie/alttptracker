import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setItemCount } from "../../store/itemsSlice";
import ItemsData from "@/data/itemData";
import { toggleScoutedItem } from "@/store/scoutsSlice";
import { setCurrentMode, setHoveredScout, setSelectedLocation } from "@/store/trackerSlice";

interface SpriteDisplayProps {
  spriteName?: string;
}

function SpriteDisplay({ spriteName = "link" }: SpriteDisplayProps) {
  const dispatch = useDispatch();
  const key = "mail";
  const collected = useSelector((state: RootState) => state.items[key]?.amount ?? 0);
  const itemData = ItemsData[key as keyof typeof ItemsData];
  const maxCount = itemData ? itemData.maxCount : 1;
  const moonPearlCollected = useSelector((state: RootState) => state.items["moonpearl"]?.amount ?? 0);
  const currentMode = useSelector((state: RootState) => state.trackerState.currentMode);
  const selectedLocation = useSelector((state: RootState) => state.trackerState.selectedLocation);


  const spriteImage = `/sprites/${spriteName}_tunic${moonPearlCollected ? "" : "bunny"}${collected + 1}.png`;

  function setCount(newCount: number) {
    let finalCount = newCount;
    if (newCount < 0) {
      finalCount = maxCount;
    } else if (newCount > maxCount) {
      finalCount = 0;
    }
    dispatch(setItemCount({ itemName: key, count: finalCount }));
  }

  const scoutItem = { kind: "item" as const, id: key };


  return (
    <div
      style={{
        backgroundImage: `url(${spriteImage})`,
        width: "100%",
        height: "100%",
        backgroundPosition: "center",
        backgroundSize: "100%",
        imageRendering: "pixelated",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => setCount(collected + 1)}
      onContextMenu={(e) => {
        e.preventDefault();
        if (currentMode === "scout" && selectedLocation) {
          dispatch(toggleScoutedItem({ marker: selectedLocation, item: scoutItem }));
          dispatch(setCurrentMode("none"));
          dispatch(setSelectedLocation(null));
          return;
        }
        setCount(collected - 1);
      }}
      onMouseEnter={() => dispatch(setHoveredScout(scoutItem))}
      onMouseLeave={() => dispatch(setHoveredScout(null))}
    ></div>
  );
}

export default SpriteDisplay;
