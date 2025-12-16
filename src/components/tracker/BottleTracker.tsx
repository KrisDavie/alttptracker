import TrackerItem from "./TrackerItem";

export default function BottleTracker() {
  return (
    <div className="grid grid-cols-2 w-full h-full">
      <div className="w-full h-full">
        <TrackerItem itemName="bottle" storageKey="bottle1" />
      </div>
      <div className="w-full h-full">
        <TrackerItem itemName="bottle" storageKey="bottle2" />
      </div>
      <div className="w-full h-full">
        <TrackerItem itemName="bottle" storageKey="bottle3" />
      </div>
      <div className="w-full h-full">
        <TrackerItem itemName="bottle" storageKey="bottle4" />
      </div>
    </div>
  );
}
