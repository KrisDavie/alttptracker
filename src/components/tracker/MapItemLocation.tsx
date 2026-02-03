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

  const itemLocations = location.itemLocations.filter((loc) => !loc.includes("#"));

  const itemChecks = useSelector((state: RootState) => {
    const checks: Record<string, { displayName: string; status: CheckStatus }> = {};
    itemLocations.forEach((itemLoc) => {
      let _iloc = itemLoc;
      if (type === "dungeon") {
        _iloc = itemLoc.split(" - ").slice(1).join(" - "); // For dungeons, use dungeon name only
      }
      checks[itemLoc] = {
        displayName: _iloc,
        status: state.checks.locationsChecks[itemLoc],
      };
    });
    return checks;
  }, shallowEqual);

  const checksList = Object.values(itemChecks).map((c) => c.status);

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
    "invisible group-hover:visible absolute z-50 w-max select-none",
    yPercent < 25 ? "top-full pt-1" : "bottom-full pb-1",
    xPercent < 25 ? "left-0 translate-x-0" : xPercent > 75 ? "right-0 translate-x-0" : "left-1/2 -translate-x-1/2",
  );

  const tooltipInnerClasses = "px-2 py-1 bg-black text-white text-2xs rounded border border-gray-600";

  function handleClick() {
    if (location.itemLocations && location.itemLocations.length > 1) {
      // Multiple locations, toggle all
      const newStatus = status !== "all";
      const updatedChecks: Record<string, CheckStatus> = {};
      location.itemLocations.forEach((itemLoc) => {
        if (itemChecks[itemLoc]) {
          updatedChecks[itemLoc] = {
            ...itemChecks[itemLoc].status,
            checked: newStatus,
            manuallyChecked: true,
          };
        }
      });
      dispatch(updateMultipleLocations(updatedChecks));
    } else {
      const loc = location.itemLocations[0];
      if (itemChecks[loc]) {
        dispatch(setLocationChecked({ location: loc, checked: !itemChecks[loc].status.checked, manual: true }));
      }
    }
  }

  return (
    <div
      key={locName}
      className={cn(
        "absolute border border-black left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group z-10 hover:z-20",
        status === "all"
          ? "bg-gray-500/70"
          : maxLogicStatus === "available"
            ? "bg-green-500"
            : maxLogicStatus === "ool"
              ? "bg-yellow-500"
              : "bg-red-500",
        status === "some" && "is-hatched",
        props.className,
      )}
      style={{
        top: `${yPercent}%`,
        left: `${xPercent}%`,
      }}
      onClick={handleClick}
    >
      {showTooltip && (
        <div className={tooltipClasses}>
          <div className={tooltipInnerClasses}>
            {checksList.length === 1 ? (
              <div className="font-bold flex gap-2 whitespace-nowrap items-baseline">
                <span>{locName}</span>
                <span
                  className={cn(
                    "w-12 text-right",
                    checksList[0]?.checked ? "text-gray-500" : checksList[0]?.logic === "available" ? "text-green-400" : "text-red-400",
                  )}
                >
                  {checksList[0]?.checked ? "checked" : checksList[0]?.logic}
                </span>
              </div>
            ) : (
              <>
                <div
                  className="font-bold border-b border-gray-500 mb-1 whitespace-nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {locName}
                </div>
                <div className={checksList.length > 6 ? "grid grid-cols-2 gap-x-4" : ""}>
                  {Object.entries(itemChecks).map(([key, info]) => (
                    <div
                      key={key}
                      className="flex justify-between gap-2 text-3xs whitespace-nowrap hover:bg-gray-800 cursor-pointer px-0.5 rounded items-baseline"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setLocationChecked({ location: key, checked: !info.status.checked, manual: true }));
                      }}
                    >
                      <span className="flex-1">{info.displayName}</span>
                      <span
                        className={cn(
                          "w-10 text-right",
                          info.status.checked
                            ? "text-gray-500"
                            : info.status.logic === "available"
                              ? "text-green-400"
                              : info.status.logic === "possible"
                                ? "text-yellow-400"
                                : "text-red-400",
                        )}
                      >
                        {info.status.checked ? "checked" : info.status.logic}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapItemLocation;
