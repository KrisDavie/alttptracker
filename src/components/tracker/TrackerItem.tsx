import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { incrementItemCount } from "../../store/itemsSlice";
import { toggleScoutedItem } from "@/store/scoutsSlice";
import { setCurrentMode, setHoveredScout, setSelectedLocation } from "@/store/trackerSlice";
import ItemsData from "@/data/itemData";

interface TrackerItemProps {
  itemName: string;
  storageKey?: string;
  skipFirstImgOnCollect?: boolean;
}

function TrackerItem({ itemName, storageKey, skipFirstImgOnCollect = false }: TrackerItemProps) {
  const dispatch = useDispatch();
  const key = storageKey || itemName;
  let collected = useSelector((state: RootState) => state.items[key]?.amount ?? 0);
  const pseudoboots = useSelector((state: RootState) => state.settings.pseudoboots);
  const mirrorScroll = useSelector((state: RootState) => state.settings.mirrorScroll);
  const currentMode = useSelector((state: RootState) => state.trackerState.currentMode);
  const selectedLocation = useSelector((state: RootState) => state.trackerState.selectedLocation);
  const itemData = ItemsData[itemName as keyof typeof ItemsData];
  let itemImage = itemData ? itemData.images[Math.max(0, collected - (skipFirstImgOnCollect ? 0 : 1))] : "unknown";

  if (itemName === "boots" && collected === 0 && pseudoboots) {
    itemImage = "/items/pseudoboots.png";
    collected = 1; 
  } else if (itemName === "mirror" && collected === 0 && mirrorScroll) {
    itemImage = "/items/mirrorscroll.png";
    collected = 1; 
  }

  const scoutItem = { kind: "item" as const, id: key };

  return (
    <div
      style={{
        backgroundImage: `url(${itemImage})`,
        width: "100%",
        height: "100%",
        opacity: collected > 0 ? 1 : 0.3,
        backgroundPosition: "center",
        backgroundSize: "100%",
        imageRendering: "pixelated",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => {
        if (currentMode === "scout" && selectedLocation) {
          dispatch(toggleScoutedItem({ marker: selectedLocation, item: scoutItem }));
          dispatch(setCurrentMode("none"));
          dispatch(setSelectedLocation(null));
          return;
        }
        dispatch(incrementItemCount({ itemName, decrement: false, skipFirstImgOnCollect, storageKey: key }));
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (currentMode === "scout") {
          dispatch(setCurrentMode("none"));
          dispatch(setSelectedLocation(null));
          return;
        }
        dispatch(incrementItemCount({ itemName, decrement: true, skipFirstImgOnCollect, storageKey: key }));
      }}
      onMouseEnter={() => dispatch(setHoveredScout(scoutItem))}
      onMouseLeave={() => dispatch(setHoveredScout(null))}
    ></div>
  );
}

export default TrackerItem;
