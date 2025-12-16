import ChestCounter from "./ChestCounter";
import SpriteDisplay from "./SpriteDisplay";
import TrackerItem from "./TrackerItem";

function SpriteSquare() {
  return (
    <div className="relative w-full h-full">
      <div className="h-24 w-24">
        <SpriteDisplay />
      </div>
      <div className="h-10 w-10 absolute top-14 right-8">
        <TrackerItem itemName="moonpearl" />
      </div>
      <div className="h-12 w-12 absolute top-0 right-8">
        <TrackerItem itemName="sword" />
      </div>
      <div className="h-10 w-10 absolute bottom-8 right-22">
        <TrackerItem itemName="shield" />
      </div>
      <div className="h-4 w-4 absolute top-11 right-9">
        <TrackerItem itemName="heartpiece" skipFirstImgOnCollect/>
      </div>
      <div className="h-8 w-8">
        <ChestCounter dungeon="gt" small />
      </div>
    </div>
  );
}

export default SpriteSquare;
