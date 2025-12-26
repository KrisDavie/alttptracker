import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setLocationChecked, setEntranceChecked } from "../../store/checksSlice";
import { cn } from "@/lib/utils";

interface MapLocationProps {
  name: string | string[];
  className?: string;
  type: "dungeon" | "entrance" | "item" | "multiItem" | "tree";
  x: number;
  y: number;
  tooltip?: boolean;
}


function MapLocation(props: MapLocationProps) {
  const dispatch = useDispatch();
  const showTooltip = props.tooltip ?? false;

  const locName = typeof props.name === "string" ? props.name : props.name[0];
  const check = useSelector((state: RootState) => props.type === "entrance" ? state.checks.entranceChecks[locName] : state.checks.locationsChecks[locName]);
  const status = check?.status ?? "none";

  function handleClick() {
    const nextStatus = status === "all" ? "none" : "all";
    if (["item", "multiItem", "tree", "dungeon"].includes(props.type)) {
      dispatch(setLocationChecked({ location: locName, status: nextStatus, manual: true }));
    } else if (props.type === "entrance") {
      dispatch(setEntranceChecked({ entrance: locName, status: nextStatus, manual: true }));
    }
  }

  function handleConnectorClick(e: React.MouseEvent) {
    // Middle click for connector logic
    if (e.button === 1) {
      e.stopPropagation();
      console.log("Connector click on", locName);
    }

  }

  return (
    <div
      key={locName}
      className={cn(
        `absolute
           ${status === "all" ? "bg-gray-500 opacity-70" : status === "some" ? "bg-green-500 is-hatched" : "bg-green-500"}
           ${props.type === "entrance" ? "rounded-full" : ""} 
           border border-black left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
           group z-10 hover:z-20`,
        props.className
      )}
      style={{
        top: `${(props.y / 512)*100}%`,
        left: `${(props.x / 512)*100}%`,
      }}
      onClick={handleClick}
      {...(props.type === "entrance" ? { onAuxClick: handleConnectorClick } : {})}
    >
      {showTooltip && (
        <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-2xs whitespace-nowrap rounded pointer-events-none border border-gray-600" onClick={handleClick}>
          {locName}
        </div>
      )}
    </div>
  );
}

export default MapLocation;
