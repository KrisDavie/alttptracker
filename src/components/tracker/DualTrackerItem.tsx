import TrackerItem from "./TrackerItem";

interface DualTrackerItemProps {
  item1: string;
  item2: string;
}

export default function DualTrackerItem({ item1, item2 }: DualTrackerItemProps) {
  return (
    <div
      className="grid grid-cols-2 grid-rows-2 w-full h-full"
      style={{
        backgroundImage: "url(/items/splitbackground.png)",
        backgroundSize: "100% 100%",
        imageRendering: "pixelated",
      }}
    >
      <div className="col-start-1 row-start-1 w-full h-full">
        <TrackerItem itemName={item1} />
      </div>
      <div className="col-start-2 row-start-2 w-full h-full">
        <TrackerItem itemName={item2} />
      </div>
    </div>
  );
}
