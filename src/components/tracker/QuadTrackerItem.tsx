import TrackerItem from "./TrackerItem";

type ItemProp = string | { name: string; storageKey?: string; skipFirstImgOnCollect?: boolean };

interface QuadTrackerItemProps {
  item1: ItemProp;
  item2: ItemProp;
  item3: ItemProp;
  item4: ItemProp;
}

function renderItem(item: ItemProp) {
  if (typeof item === "string") {
    return <TrackerItem itemName={item} />;
  }
  return (
    <TrackerItem
      itemName={item.name}
      storageKey={item.storageKey}
      skipFirstImgOnCollect={item.skipFirstImgOnCollect}
    />
  );
}

export default function QuadTrackerItem({ item1, item2, item3, item4 }: QuadTrackerItemProps) {
  return (
    <div className="grid grid-cols-2 w-full h-full">
      <div className="w-full h-full">{renderItem(item1)}</div>
      <div className="w-full h-full">{renderItem(item2)}</div>
      <div className="w-full h-full">{renderItem(item3)}</div>
      <div className="w-full h-full">{renderItem(item4)}</div>
    </div>
  );
}
