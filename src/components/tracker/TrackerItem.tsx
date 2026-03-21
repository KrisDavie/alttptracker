import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { incrementItemCount } from "../../store/itemsSlice";
import ItemsData from "@/data/itemData";

interface TrackerItemProps {
  itemName: string;
  storageKey?: string;
  skipFirstImgOnCollect?: boolean;
}

function TrackerItem({ itemName, storageKey, skipFirstImgOnCollect = false }: TrackerItemProps) {
  const dispatch = useDispatch();
  const key = storageKey || itemName;
  const collected = useSelector((state: RootState) => state.items[key]?.amount ?? 0);
  const itemData = ItemsData[itemName as keyof typeof ItemsData];
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
      onClick={() => dispatch(incrementItemCount({ itemName, decrement: false, skipFirstImgOnCollect, storageKey: key }))}
      onContextMenu={(e) => {
        e.preventDefault();
        dispatch(incrementItemCount({ itemName, decrement: true, skipFirstImgOnCollect, storageKey: key }));
      }}
    ></div>
  );
}

export default TrackerItem;
