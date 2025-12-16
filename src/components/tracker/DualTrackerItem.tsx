import TrackerItem from "./TrackerItem";

interface DualTrackerItemProps {
  item1: string;
  item2: string;
}

export default function DualTrackerItem({ item1, item2 }: DualTrackerItemProps) {
  return (
    <div
      className="relative w-full h-full"
      style={{
        backgroundImage: "url(/items/splitbackground.png)",
        backgroundSize: "100% 100%",
        imageRendering: "pixelated",
      }}
    >
      <div className="absolute top-0 left-0 w-1/2 h-1/2">
        <TrackerItem itemName={item1} />
      </div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
        <TrackerItem itemName={item2} />
      </div>
    </div>
  );
}
