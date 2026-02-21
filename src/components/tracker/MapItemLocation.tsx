import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { RootState } from "../../store/store";
import { setLocationChecked, type CheckStatus, updateMultipleLocations } from "../../store/checksSlice";
import { cn } from "@/lib/utils";
import type { LocationData } from "@/data/locationsData";
import type { LogicStatus } from "@/data/logic/logicTypes";
import { getActiveLocations } from "@/lib/logic/locationMapper";
import { useMemo, useState } from "react";

interface MapItemLocationProps {
  name: string;
  location: LocationData;
  className?: string;
  type: "dungeon" | "item" | "tree";
  tooltip?: boolean;
}

type CheckInfo = { displayName: string; status: CheckStatus };
type DisplayItem = { key: string; info: CheckInfo };
type DisplayGroupStatus = LogicStatus | "checked";

type DisplayGroup = {
  type: "group";
  key: string;
  items: DisplayItem[];
  status: DisplayGroupStatus;
  category: "Pots" | "Enemies";
};

type DisplayListItem = { type: "item"; key: string; info: CheckInfo } | DisplayGroup;

function MapItemLocation(props: MapItemLocationProps) {
  const { name: locName, location } = props;
  const dispatch = useDispatch();
  const showTooltip = props.tooltip ?? false;
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const settings = useSelector((state: RootState) => state.settings);
  const itemLocations = useMemo(() => {
    const list = getActiveLocations(locName, settings);
    const nonPots = list.filter((loc) => !loc.includes("#"));
    const pots = list.filter((loc) => loc.includes("#"));
    return [...nonPots, ...pots];
  }, [locName, settings]);

  const checkStatuses = useSelector((state: RootState) => {
    return itemLocations.map((loc) => state.checks.locationsChecks[loc]);
  }, shallowEqual);

  const itemChecks = useMemo(() => {
    const checks: Record<string, CheckInfo> = {};
    itemLocations.forEach((itemLoc, index) => {
      let _iloc = itemLoc;
      if (itemLoc.includes(" - ")) {
        _iloc = itemLoc.split(" - ").slice(1).join(" - ");
      }
      checks[itemLoc] = {
        displayName: _iloc,
        status: checkStatuses[index],
      };
    });
    return checks;
  }, [itemLocations, checkStatuses]);

  const checksList = useMemo(() => Object.values(itemChecks).map((c) => c.status), [itemChecks]);

  let status: "all" | "some" | "none" = "none";
  if (checksList.length === 1) {
    status = checksList[0]?.checked ? "all" : "none";
  } else if (checksList.length > 1) {
    const allChecked = checksList.every((check) => check?.checked);
    if (allChecked) status = "all";
    else if (checksList.some((check) => check?.checked)) status = "some";
  }

  const maxLogicStatus = checksList.reduce((best, check) => {
    if (check?.checked) return best;
    if (check?.logic === "available") return "available";
    if (check?.logic === "possible" && best !== "available") return "possible";
    return best;
  }, "unavailable" as LogicStatus);

  const COLLAPSE_LIMIT = 10;

  const displayList = useMemo(() => {
    const standardList: DisplayListItem[] = [];
    const potsGroups: Partial<Record<DisplayGroupStatus, DisplayItem[]>> = {};
    const enemiesGroups: Partial<Record<DisplayGroupStatus, DisplayItem[]>> = {};

    // Step 1: Divide items into standard or groupable categories
    Object.entries(itemChecks).forEach(([key, info]) => {
      const isPot =
        (info.displayName.includes("Pot Key") || info.displayName.includes("Pot #") || info.displayName.includes("Block")) &&
        !info.displayName.includes("Enemy");
      const isEnemy = info.displayName.includes("Enemy") || info.displayName.includes("Key Drop");

      const statusKey = info.status.checked ? "checked" : info.status.logic;

      if (isPot) {
        if (!potsGroups[statusKey]) potsGroups[statusKey] = [];
        potsGroups[statusKey]!.push({ key, info });
      } else if (isEnemy) {
        if (!enemiesGroups[statusKey]) enemiesGroups[statusKey] = [];
        enemiesGroups[statusKey]!.push({ key, info });
      } else {
        standardList.push({ type: "item", key, info });
      }
    });

    const statusOrder: Record<string, number> = {
      available: 5,
      possible: 4,
      ool: 3,
      information: 2,
      unavailable: 1,
      checked: 0,
    };

    const processCategory = (
      categoryGroups: Partial<Record<DisplayGroupStatus, DisplayItem[]>>,
      categoryType: "pots" | "enemies",
      categoryLabel: "Pots" | "Enemies",
    ): DisplayListItem[] => {
      const result: DisplayListItem[] = [];
      const totalCount = Object.values(categoryGroups).reduce((sum, items) => sum + (items?.length || 0), 0);

      // Sort statuses by priority
      const sortedStatuses = (Object.keys(categoryGroups) as DisplayGroupStatus[]).sort((a, b) => {
        return (statusOrder[b] ?? 0) - (statusOrder[a] ?? 0);
      });

      sortedStatuses.forEach((statusKey) => {
        const items = categoryGroups[statusKey];
        if (!items || items.length === 0) return;

        const groupId = `${categoryType}-${statusKey}`;
        // Only collapse if:
        // 1. the total category is large enough to warrant collapsing (> COLLAPSE_LIMIT)
        // 2. We have many items in this specific status group (> 3) OR they are already checked (less interesting)
        const isLargeCategory = totalCount > COLLAPSE_LIMIT;
        const isSubstantialGroup = items.length > 3 || statusKey === "checked";

        const shouldCollapse = isLargeCategory && isSubstantialGroup && !expandedGroups.has(groupId);

        if (shouldCollapse && items.length > 1) {
          result.push({
            type: "group",
            key: groupId,
            category: categoryLabel,
            status: statusKey,
            items,
          });
        } else {
          items.forEach((item) => {
            result.push({ type: "item", key: item.key, info: item.info });
          });
        }
      });

      return result;
    };

    const potsList = processCategory(potsGroups, "pots", "Pots");
    const enemiesList = processCategory(enemiesGroups, "enemies", "Enemies");

    return [...standardList, ...potsList, ...enemiesList];
  }, [itemChecks, expandedGroups]);

  const xPercent = (location.x / 512) * 100;
  const yPercent = (location.y / 512) * 100;

  const tooltipXClasses = locName == "Ganon's Tower" ? "left-3/9 -translate-x-5/9" : xPercent < 25 ? "left-0 translate-x-0" : xPercent > 75 ? "right-0 translate-x-0" : "left-1/2 -translate-x-1/2";
  const tooltipClasses = cn("invisible group-hover:visible absolute z-50 w-max select-none", yPercent < 25 ? "top-full pt-1" : "bottom-full pb-1", tooltipXClasses);

  const tooltipInnerClasses = "px-2 py-1 bg-black text-white text-2xs rounded border border-gray-600";

  function handleClick() {
    if (itemLocations && itemLocations.length > 1) {
      const newStatus = status !== "all";
      const updatedChecks: Record<string, CheckStatus> = {};
      itemLocations.forEach((itemLoc) => {
        if (itemChecks[itemLoc]) {
          updatedChecks[itemLoc] = { ...itemChecks[itemLoc].status, checked: newStatus, manuallyChecked: true };
        }
      });
      dispatch(updateMultipleLocations(updatedChecks));
    } else {
      const loc = itemLocations[0];
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
        status === "all" ? "bg-gray-500/70" : maxLogicStatus === "available" ? "bg-green-500" : maxLogicStatus === "possible" ? "bg-yellow-500" : "bg-red-500",
        status === "some" && "is-hatched",
        props.className,
      )}
      style={{ top: `${yPercent}%`, left: `${xPercent}%` }}
      onClick={handleClick}
      onMouseLeave={() => setExpandedGroups(new Set())}
    >
      {showTooltip && (
        <div className={tooltipClasses}>
          <div className={tooltipInnerClasses}>
            {checksList.length === 1 ? (
              <div className="font-bold flex gap-2 whitespace-nowrap items-baseline">
                <span>{locName}</span>
                <span className={cn("w-12 text-right", checksList[0]?.checked ? "text-gray-500" : checksList[0]?.logic === "available" ? "text-green-400" : "text-red-400")}>{checksList[0]?.checked ? "checked" : checksList[0]?.logic}</span>
              </div>
            ) : (
              <>
                <div className="font-bold border-b border-gray-500 mb-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  {locName}
                </div>
                <div className={displayList.length > 6 ? "grid grid-cols-2 gap-x-2" : ""}>
                  {displayList.map((item) =>
                    item.type === "item" ? (
                      <div
                        key={item.key}
                        className="flex justify-between gap-1 text-4xs whitespace-nowrap hover:bg-gray-800 cursor-pointer rounded items-baseline"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setLocationChecked({ location: item.key, checked: !item.info.status.checked, manual: true }));
                        }}
                      >
                        <span className="flex-1">{item.info.displayName}</span>
                        <span
                          className={cn("w-8 text-right", item.info.status.checked ? "text-gray-500" : item.info.status.logic === "available" ? "text-green-400" : item.info.status.logic === "possible" ? "text-yellow-400" : "text-red-400")}
                        >
                          {item.info.status.checked ? "checked" : item.info.status.logic}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={item.key}
                        className="flex justify-between gap-1 text-4xs whitespace-nowrap hover:bg-gray-800 cursor-pointer rounded items-baseline italic opacity-90"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedGroups((prev) => new Set(prev).add(item.key));
                        }}
                      >
                        <span className="flex-1 underline decoration-dotted">
                          {item.items.length} {item.category}
                        </span>
                        <span className={cn("w-8 text-right", item.status === "checked" ? "text-gray-500" : item.status === "available" ? "text-green-400" : item.status === "possible" ? "text-yellow-400" : "text-red-400")}>
                          {item.status}
                        </span>
                      </div>
                    ),
                  )}
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
