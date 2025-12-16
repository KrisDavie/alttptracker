import SpriteSquare from "../tracker/SpriteSquare";
import BottleTracker from "../tracker/BottleTracker";
import DualTrackerItem from "../tracker/DualTrackerItem";
import DungeonSquare from "../tracker/DungeonSquare";
import TrackerItem from "../tracker/TrackerItem";
import BossIcon from "../tracker/BossIcon";

function CommunityLayoutItems() {
  // Regular community tracker layout:
  // +-----------+-----------------------+
  // |  SPRITE   |                       |
  // |   (2x2)   |                       |
  // |           |                       |
  // +-----------+         ITEMS         |
  // |           |         (5x5)         |
  // |  LW BOSS  |                       |
  // |   (2x3)   |                       |
  // |           |                       |
  // |           |                       |
  // +-----------+-----------+-----------+
  // |              DW BOSS              |
  // |               (7x2)               |
  // |                                   |
  // +-----------------------------------+

  return (
    <div className="w-112 h-112 flex flex-col bg-black">
      {/* Top of tracker */}
      <div className="flex flex-row h-80">
        {/* Left side */}
        <div className="flex flex-col w-32">
          {/* Sprite */}
          <div className="flex flex-col h-32">
            <SpriteSquare />
          </div>
          {/* LW bosses */}
          <div className="flex flex-col">
            <DungeonSquare dungeon="ep" />
            <DungeonSquare dungeon="dp" />
            <DungeonSquare dungeon="toh" />
          </div>
        </div>
        {/* Items */}
        <div className="flex flex-col w-80 ">
          <div className="flex flex-row h-16 w-full ">
            <TrackerItem itemName="bow" />
            <TrackerItem itemName="boomerang" />
            <TrackerItem itemName="hookshot" />
            <TrackerItem itemName="bomb" />
            <DualTrackerItem item1="mushroom" item2="powder" />
          </div>
          <div className="flex flex-row h-16 w-full ">
            <TrackerItem itemName="firerod" />
            <TrackerItem itemName="icerod" />
            <TrackerItem itemName="bombos" />
            <TrackerItem itemName="ether" />
            <TrackerItem itemName="quake" />
          </div>
          <div className="flex flex-row h-16 w-full ">
            <TrackerItem itemName="lantern" />
            <TrackerItem itemName="hammer" />
            <DualTrackerItem item1="shovel" item2="flute" />
            <TrackerItem itemName="net" />
            <TrackerItem itemName="book" />
          </div>
          <div className="flex flex-row h-16 w-full ">
            <BottleTracker />
            <TrackerItem itemName="somaria" />
            <TrackerItem itemName="byrna" />
            <TrackerItem itemName="cape" />
            <TrackerItem itemName="mirror" />
          </div>
          <div className="flex flex-row h-16 w-full ">
            <TrackerItem itemName="boots" />
            <TrackerItem itemName="glove" />
            <TrackerItem itemName="flippers" />
            <TrackerItem itemName="magic" />
            <div
              className="relative min-w-16 min-h-16"
              style={{
                backgroundImage: "url(/items/splitbackground.png)",
                backgroundSize: "100% 100%",
                imageRendering: "pixelated",
              }}
            >
              <div className="absolute top-0 left-0 w-1/2 h-1/2">
                <BossIcon dungeon="ct" />
              </div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2">
                <BossIcon dungeon="gt" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* DW bosses */}
      <div className="flex flex-row">
        <DungeonSquare dungeon="pod" direction="vertical" />
        <DungeonSquare dungeon="sp" direction="vertical" />
        <DungeonSquare dungeon="sw" direction="vertical" />
        <DungeonSquare dungeon="tt" direction="vertical" />
        <DungeonSquare dungeon="ip" direction="vertical" />
        <DungeonSquare dungeon="mm" direction="vertical" />
        <DungeonSquare dungeon="tr" direction="vertical" />
      </div>
    </div>
  );
}

export default CommunityLayoutItems;
