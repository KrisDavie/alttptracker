import SpriteSquare from "../tracker/SpriteSquare";
import QuadTrackerItem from "../tracker/QuadTrackerItem";
import DualTrackerItem from "../tracker/DualTrackerItem";
import DungeonSquare from "../tracker/DungeonSquare";
import TrackerItem from "../tracker/TrackerItem";
import MagicAgaSquare from "../tracker/MagicAgaSquare";
import AgaOrCastleCountsSquare from "../tracker/AgaOrCastleCountsSquare";

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
    <div className="w-112 h-112 grid grid-cols-7 grid-rows-7 bg-black">
      {/* Sprite (2x2) */}
      <div className="col-start-1 row-start-1 col-span-2 row-span-2">
        <SpriteSquare />
      </div>

      {/* LW Bosses (2x3) */}
      <div className="col-start-1 row-start-3 col-span-2 row-span-3 grid grid-rows-3">
        <DungeonSquare dungeon="ep" />
        <DungeonSquare dungeon="dp" />
        <DungeonSquare dungeon="toh" />
      </div>

      {/* Items (5x5) */}
      <div className="col-start-3 row-start-1 col-span-5 row-span-5 grid grid-cols-5 grid-rows-5">
        <TrackerItem itemName="bow" />
        <TrackerItem itemName="boomerang" />
        <TrackerItem itemName="hookshot" />
        <TrackerItem itemName="bomb" />
        <DualTrackerItem item1="mushroom" item2="powder" />

        <TrackerItem itemName="firerod" />
        <TrackerItem itemName="icerod" />
        <TrackerItem itemName="bombos" />
        <TrackerItem itemName="ether" />
        <TrackerItem itemName="quake" />

        <TrackerItem itemName="lantern" />
        <TrackerItem itemName="hammer" />
        <DualTrackerItem item1="shovel" item2="flute" />
        <TrackerItem itemName="net" />
        <TrackerItem itemName="book" />

        <QuadTrackerItem item1={{ name: "bottle", storageKey: "bottle1" }} item2={{ name: "bottle", storageKey: "bottle2" }} item3={{ name: "bottle", storageKey: "bottle3" }} item4={{ name: "bottle", storageKey: "bottle4" }} />
        <TrackerItem itemName="somaria" />
        <TrackerItem itemName="byrna" />
        <TrackerItem itemName="cape" />
        <TrackerItem itemName="mirror" />

        <TrackerItem itemName="boots" />
        <TrackerItem itemName="glove" />
        <TrackerItem itemName="flippers" />
        {/* Is magic alone or magic + aga in keys */}
        <MagicAgaSquare />
        {/* Is aga or castle counts in keys */}
        <AgaOrCastleCountsSquare />
      </div>

      {/* DW Bosses (7x2) */}
      <div className="col-start-1 row-start-6 col-span-7 row-span-2 grid grid-cols-7">
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
