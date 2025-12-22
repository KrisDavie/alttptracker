import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setLocationChecked } from "../../store/trackerSlice";

interface MapLocationProps {
  name: string | string[];
  type: "dungeon" | "entrance" | "item" | "multiItem" | "tree";
  x: number;
  y: number;
}

function MapLocation(props: MapLocationProps) {
  const dispatch = useDispatch();

  const checked = useSelector((state: RootState) => state.tracker.checks[typeof props.name === "string" ? props.name : props.name[0]]);
  const locName = typeof props.name === "string" ? props.name : props.name[0];

  function handleClick() {
    if (props.type === "item" || props.type === "multiItem" || props.type === "tree") {
      dispatch(setLocationChecked({ location: locName, checked: !checked }));
    }
  }

  return (
      <div
        key={locName}
        className={`absolute
           ${checked ? "bg-gray-500 opacity-70": "bg-green-500"}
           ${props.type === "entrance" ? "rounded-full" : ""} 
           ${props.type === "tree" ? "h-2.5 w-2.5": props.type === "entrance" ? "h-3 w-3" : "h-4 w-4"}
           border border-black 
           group z-10 hover:z-20`}
        style={{
          top: `${(props.y / 512) * 448 - 3}px`,
          left: `${(props.x / 512) * 448 - 3}px`,
        }}
        onClick={handleClick}
      >
        <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-2xs whitespace-nowrap rounded pointer-events-none border border-gray-600" onClick={handleClick}>{locName}</div>
      </div>
  );
}

export default MapLocation;
