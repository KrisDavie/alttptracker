import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setItemCount } from "../../store/trackerSlice";
import ItemsData from "@/data/itemData";

interface TrackerItemProps {
  itemName: string;
  storageKey?: string;
  skipFirstImgOnCollect?: boolean;
}

function TrackerItem({ itemName, storageKey, skipFirstImgOnCollect = false }: TrackerItemProps) {
  const dispatch = useDispatch();
  const key = storageKey || itemName;
  const collected = useSelector((state: RootState) => state.tracker.items[key]?.amount ?? 0);
  const itemData = ItemsData[itemName as keyof typeof ItemsData];
  const maxCount = (itemData ? itemData.maxCount : 1) - (skipFirstImgOnCollect ? 1 : 0);

  function setCount(newCount: number) {
    let finalCount = newCount;
    if (newCount < 0) {
      finalCount = maxCount;
    } else if (newCount > maxCount) {
      finalCount = 0;
    }
    dispatch(setItemCount({ itemName: key, count: finalCount }));
  }

  const itemImage = itemData ? itemData.images[Math.max(0, collected - (skipFirstImgOnCollect ? 0 : 1))] : "unknown";


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
      onClick={() => setCount(collected + 1)}
      onContextMenu={(e) => {
        e.preventDefault();
        setCount(collected - 1);
      }}
    ></div>
  );
}

export default TrackerItem;
