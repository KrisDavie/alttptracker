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
  const { name: locName, location, type } = props;
  const dispatch = useDispatch();
  const showTooltip = props.tooltip ?? false;

  const itemLocations = location.itemLocations.filter((loc) => !loc.includes('#'));

  const itemChecks = useSelector(
    (state: RootState) => {
      const checks: Record<string, CheckStatus> = {};
      itemLocations.forEach((itemLoc) => {
        let _iloc = itemLoc;
        if (type === "dungeon") {
          _iloc = itemLoc.split(" - ").slice(1).join(" - "); // For dungeons, use dungeon name only
        }
        checks[_iloc] = state.checks.locationsChecks[itemLoc];
      });
      return checks;
    },
    shallowEqual
  );

  const checksList = Object.values(itemChecks);

  // How many locations are checked?
  let status: "all" | "some" | "none" = "none";
  if (checksList.length === 1) {
    status = checksList[0]?.checked ? "all" : "none";
  } else if (checksList.length > 1) {
    const allChecked = checksList.every((check) => check?.checked);
    const someChecked = checksList.some((check) => check?.checked);
    if (allChecked) {
      status = "all";
    } else if (someChecked) {
      status = "some";
    } else {
      status = "none";
    }
  }

  const maxLogicStatus = checksList.reduce((best, check) => {
    if (check?.checked) return best;
    if (check?.logic === "available") return "available";
    if (check?.logic === "ool" && best !== "available") return "ool";
    return best;
  }, "unavailable" as LogicStatus);

  const xPercent = (location.x / 512) * 100;
  const yPercent = (location.y / 512) * 100;

  const tooltipClasses = cn(
    "invisible group-hover:visible absolute z-50 px-2 py-1 bg-black text-white text-2xs w-max rounded pointer-events-none border border-gray-600",
    yPercent < 25 ? "top-full mt-1" : "bottom-full mb-1",
    xPercent < 25 ? "left-0 translate-x-0" : xPercent > 75 ? "right-0 translate-x-0" : "left-1/2 -translate-x-1/2"
  );

  function handleClick() {
    if (location.itemLocations && location.itemLocations.length > 1) {
      // Multiple locations, toggle all
      const newStatus = status !== "all";
      const updatedChecks: Record<string, CheckStatus> = {};
      location.itemLocations.forEach((itemLoc) => {
        if (itemChecks[itemLoc]) {
          updatedChecks[itemLoc] = {
            ...itemChecks[itemLoc],
            checked: newStatus,
            manuallyChecked: true,
          };
        }
      });
      dispatch(updateMultipleLocations(updatedChecks));
    } else {
      const loc = location.itemLocations[0];
      if (itemChecks[loc]) {
        dispatch(setLocationChecked({ location: loc, checked: !itemChecks[loc].checked, manual: true }));
      }
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
      {showTooltip && (
        <div className={tooltipClasses}>
          {checksList.length === 1 ? (
            <div className="font-bold flex gap-2 whitespace-nowrap">
              <span>{locName}</span>
              <span className={checksList[0]?.logic === "available" ? "text-green-400" : "text-red-400"}>
                {checksList[0]?.checked ? "Checked" : checksList[0]?.logic}
              </span>
            </div>
          ) : (
            <>
              <div className="font-bold border-b border-gray-500 mb-1 whitespace-nowrap">{locName}</div>
              <div className={checksList.length > 4 ? "grid grid-cols-2 gap-x-4" : ""}>
                {Object.entries(itemChecks).map(([name, check]) => (
                  <div key={name} className="flex justify-between gap-2 text-3xs whitespace-nowrap">
                    <span>{name}</span>
                    <span className={check?.logic === "available" ? "text-green-400" : "text-red-400"}>
                      {check?.checked ? "Checked" : check?.logic}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MapItemLocation;
