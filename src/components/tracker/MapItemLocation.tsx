import { cn } from "@/lib/utils";
import type { LocationData } from "@/data/locationsData";
import { useLocationTooltipData } from "@/hooks/useLocationTooltipData";
import { LocationTooltip } from "./LocationTooltip";

interface MapItemLocationProps {
  name: string;
  location: LocationData;
  className?: string;
  type: "dungeon" | "item" | "tree";
  tooltip?: boolean;
}

function MapItemLocation(props: MapItemLocationProps) {
  const { name: locName, location } = props;
  const showTooltip = props.tooltip ?? false;

  const { itemLocations, itemChecks, displayList, status, maxLogicStatus, handleCheckClick, handleGroupExpand, toggleAllChecks, resetGroups } = useLocationTooltipData(locName);

  const xPercent = (location.x / 512) * 100;
  const yPercent = (location.y / 512) * 100;

  return (
    <div
      key={locName}
      className={cn(
        "absolute border border-black left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group z-10 hover:z-20",
        status === "all" ? "bg-gray-500/70" : maxLogicStatus === "available" ? "bg-green-500" : maxLogicStatus === "possible" ? "bg-yellow-500" : "bg-red-500",
        status === "some" && "is-hatched",
        props.className,
      )}
      style={{ top: `${yPercent}%`, left: `${xPercent}%` }}
      onClick={toggleAllChecks}
      onMouseLeave={resetGroups}
    >
      {showTooltip && (
        <LocationTooltip
          name={locName}
          xPercent={xPercent}
          yPercent={yPercent}
          items={itemLocations.length > 1 ? displayList : undefined}
          singleCheck={itemLocations.length === 1 ? { ...itemChecks[itemLocations[0]], key: itemLocations[0] } : undefined}
          onCheckClick={handleCheckClick}
          onGroupExpand={handleGroupExpand}
        />
      )}
    </div>
  );
}

export default MapItemLocation;
