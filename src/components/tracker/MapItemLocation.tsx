import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { RootState } from "../../store/store";
import { setLocationChecked, type CheckStatus, updateMultipleLocations } from "../../store/checksSlice";
import { cn } from "@/lib/utils";
import type { LocationData } from "@/data/locationsData";
import type { LogicStatus } from "@/data/logic/logicTypes";

interface MapItemLocationProps {
  name: string;
  location: LocationData;
  className?: string;
  type: "dungeon" | "item" | "tree";
  tooltip?: boolean;
}

function MapItemLocation(props: MapItemLocationProps) {
  const { name: locName, location } = props;
  const dispatch = useDispatch();
  const showTooltip = props.tooltip ?? false;

  const itemLocations = location.itemLocations.filter((loc) => !loc.includes('#'));

  const itemChecks = useSelector(
    (state: RootState) => itemLocations.map((itemLoc) => state.checks.locationsChecks[itemLoc]),
    shallowEqual
  );

  // How many locations are checked?
  let status: "all" | "some" | "none" = "none";
  if (itemChecks.length === 1) {
    status = itemChecks[0]?.checked ? "all" : "none";
  } else if (itemChecks.length > 1) {
    const allChecked = itemChecks.every((check) => check?.checked);
    const someChecked = itemChecks.some((check) => check?.checked);
    if (allChecked) {
      status = "all";
    } else if (someChecked) {
      status = "some";
    } else {
      status = "none";
    }
  }

  const maxLogicStatus = itemChecks.reduce((best, check) => {
    if (check?.checked) return best;
    if (check?.logic === "available") return "available";
    if (check?.logic === "ool" && best !== "available") return "ool";
    return best;
  }, "unavailable" as LogicStatus);

  const xPercent = (location.x / 512) * 100;
  const yPercent = (location.y / 512) * 100;

  const tooltipClasses = cn(
    "invisible group-hover:visible absolute z-50 px-2 py-1 bg-black text-white text-2xs whitespace-nowrap rounded pointer-events-none border border-gray-600",
    yPercent < 12.5 ? "top-full mt-1" : "bottom-full mb-1",
    xPercent < 25 ? "left-0 translate-x-0" : xPercent > 75 ? "right-0 translate-x-0" : "left-1/2 -translate-x-1/2"
  );

  function handleClick() {
    if (location.itemLocations && location.itemLocations.length > 1) {
      // Multiple locations, toggle all
      const newStatus = status === "all" ? false : true;
      const updatedChecks: Record<string, CheckStatus> = {};
      location.itemLocations.forEach((itemLoc, index) => {
        updatedChecks[itemLoc] = {
          ...itemChecks[index],
          checked: newStatus,
          manuallyChecked: true,
        };
      });
      dispatch(updateMultipleLocations(updatedChecks));
    } else {
      dispatch(setLocationChecked({ location: location.itemLocations[0], checked: !itemChecks[0].checked, manual: true }));
    }
  }

  return (
    <div
      key={locName}
      className={cn(
        `absolute
           ${status === "all" ? "bg-gray-500 opacity-70" : status === "some" ? `is-hatched` : `` + 
            `${maxLogicStatus === "available" ? "bg-green-500" : maxLogicStatus === "ool" ? "bg-yellow-500" : "bg-red-500"}`}
           border border-black left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
           group z-10 hover:z-20`,
        props.className
      )}
      style={{
        top: `${yPercent}%`,
        left: `${xPercent}%`,
      }}
      onClick={handleClick}
    >
      {showTooltip && <div className={tooltipClasses}>{locName}</div>}
    </div>
  );
}

export default MapItemLocation;
