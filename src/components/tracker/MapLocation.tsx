import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setLocationChecked } from "../../store/checksSlice";
import { cn } from "@/lib/utils";

interface MapLocationProps {
  name: string | string[];
  className?: string;
  type: "dungeon" | "entrance" | "item" | "multiItem" | "tree";
  x: number;
  y: number;
  tooltip?: boolean;
  locations?: string[];
}


function MapLocation(props: MapLocationProps) {
  const dispatch = useDispatch();
  const showTooltip = props.tooltip ?? false;

  const locName = typeof props.name === "string" ? props.name : props.name[0];
  const checked = useSelector((state: RootState) => state.checks.checks[locName]) ?? "none";

  function handleClick() {
    if (props.type === "item" || props.type === "multiItem" || props.type === "tree") {
      const nextStatus = checked === "all" ? "none" : "all";
      dispatch(setLocationChecked({ location: locName, checked: nextStatus }));
    }
  }

  return (
    <div
      key={locName}
      className={cn(
        `absolute
           ${checked === "all" ? "bg-gray-500 opacity-70" : checked === "some" ? "bg-green-500 is-hatched" : "bg-green-500"}
           ${props.type === "entrance" ? "rounded-full" : ""} 
           border border-black left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
           group z-10 hover:z-20`,
        props.className
      )}
      style={{
        top: `${(props.y / 512) * 448}px`,
        left: `${(props.x / 512) * 448}px`,
      }}
      onClick={handleClick}
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
