import { useSelector, useDispatch, shallowEqual } from "react-redux";
import type { RootState } from "@/store/store";
import { setLocationChecked, type CheckStatus, updateMultipleLocations } from "@/store/checksSlice";
import { getActiveLocations } from "@/lib/logic/locationMapper";
import { useMemo, useState, useCallback } from "react";
import type { LogicStatus } from "@/data/logic/logicTypes";
import type { TooltipListItem, TooltipCheckInfo } from "@/components/tracker/LocationTooltip";

export function useLocationTooltipData(locName: string) {
  const dispatch = useDispatch();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const settings = useSelector((state: RootState) => state.settings);
  const entrances = useSelector((state: RootState) => state.entrances);

  // 1. Resolve the actual name if it's an entrance and redirected
  const targetName = useMemo(() => {
    if (settings.entranceMode !== "none" && entrances[locName]?.to) {
      return entrances[locName].to;
    }
    return locName;
  }, [locName, settings.entranceMode, entrances]);

  const itemLocations = useMemo(() => {
    const list = getActiveLocations(targetName, settings);
    const nonPots = list.filter((loc) => !loc.includes("#"));
    const pots = list.filter((loc) => loc.includes("#"));
    return [...nonPots, ...pots];
  }, [targetName, settings]);

  const checkStatuses = useSelector((state: RootState) => {
    return itemLocations.map((loc) => state.checks.locationsChecks[loc]);
  }, shallowEqual);

  const itemChecks = useMemo(() => {
    const checks: Record<string, TooltipCheckInfo> = {};
    itemLocations.forEach((itemLoc, index) => {
      let _iloc = itemLoc;
      if (itemLoc.includes(" - ")) {
        _iloc = itemLoc.split(" - ").slice(1).join(" - ");
      }
      checks[itemLoc] = {
        displayName: _iloc,
        status: checkStatuses[index] || { checked: false, logic: "unavailable", manuallyChecked: false, scoutedItems: [] },
      };
    });
    return checks;
  }, [itemLocations, checkStatuses]);

  const checksList = useMemo(() => Object.values(itemChecks).map((c) => c.status), [itemChecks]);

  const status = useMemo(() => {
    let s: "all" | "some" | "none" = "none";
    if (checksList.length === 1) {
      s = checksList[0]?.checked ? "all" : "none";
    } else if (checksList.length > 1) {
      const allChecked = checksList.every((check) => check?.checked);
      if (allChecked) s = "all";
      else if (checksList.some((check) => check?.checked)) s = "some";
    }
    return s;
  }, [checksList]);

  const maxLogicStatus = useMemo(() => {
    return checksList.reduce((best, check) => {
      if (check?.checked) return best;
      if (check?.logic === "available") return "available";
      if (check?.logic === "possible" && best !== "available") return "possible";
      return best;
    }, "unavailable" as LogicStatus);
  }, [checksList]);

  const displayList = useMemo(() => {
    const COLLAPSE_LIMIT = 10;
    const standardList: TooltipListItem[] = [];
    const potsGroups: Partial<Record<LogicStatus | "checked", TooltipListItem[]>> = {};
    const enemiesGroups: Partial<Record<LogicStatus | "checked", TooltipListItem[]>> = {};

    Object.entries(itemChecks).forEach(([key, info]) => {
      const isPot = (info.displayName.includes("Pot Key") || info.displayName.includes("Pot #") || info.displayName.includes("Block")) && !info.displayName.includes("Enemy");
      const isEnemy = info.displayName.includes("Enemy") || info.displayName.includes("Key Drop");

      const statusKey = info.status.checked ? "checked" : info.status.logic;

      if (isPot) {
        if (!potsGroups[statusKey]) potsGroups[statusKey] = [];
        potsGroups[statusKey]!.push({ type: "item", key, info });
      } else if (isEnemy) {
        if (!enemiesGroups[statusKey]) enemiesGroups[statusKey] = [];
        enemiesGroups[statusKey]!.push({ type: "item", key, info });
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

    const processCategory = (categoryGroups: Partial<Record<LogicStatus | "checked", TooltipListItem[]>>, categoryType: "pots" | "enemies", categoryLabel: "Pots" | "Enemies"): TooltipListItem[] => {
      const result: TooltipListItem[] = [];
      const totalCount = Object.values(categoryGroups).reduce((sum, items) => sum + (items?.length || 0), 0);
      const sortedStatuses = (Object.keys(categoryGroups) as Array<LogicStatus | "checked">).sort((a, b) => {
        return (statusOrder[b] ?? 0) - (statusOrder[a] ?? 0);
      });

      sortedStatuses.forEach((statusKey) => {
        const items = categoryGroups[statusKey];
        if (!items || items.length === 0) return;

        const groupId = `${categoryType}-${statusKey}`;
        const isLargeCategory = totalCount > COLLAPSE_LIMIT;
        const isSubstantialGroup = items.length > 3 || statusKey === "checked";
        const shouldCollapse = isLargeCategory && isSubstantialGroup && !expandedGroups.has(groupId);

        if (shouldCollapse && items.length > 1) {
          result.push({
            type: "group",
            key: groupId,
            category: categoryLabel,
            status: statusKey,
            items: items.map((i) => (i.type === "item" ? { key: i.key, info: i.info } : null)).filter((item): item is { key: string; info: TooltipCheckInfo } => item !== null),
          });
        } else {
          items.forEach((item) => {
            result.push(item);
          });
        }
      });

      return result;
    };

    const potsList = processCategory(potsGroups, "pots", "Pots");
    const enemiesList = processCategory(enemiesGroups, "enemies", "Enemies");

    return [...standardList, ...potsList, ...enemiesList];
  }, [itemChecks, expandedGroups]);

  const handleCheckClick = useCallback(
    (key: string, checked: boolean) => {
      dispatch(setLocationChecked({ location: key, checked, manual: true }));
    },
    [dispatch],
  );

  const handleGroupExpand = useCallback((key: string) => {
    setExpandedGroups((prev) => new Set(prev).add(key));
  }, []);

  const toggleAllChecks = useCallback(() => {
    if (itemLocations && itemLocations.length > 1) {
      const newStatus = status !== "all";
      const updatedChecks: Record<string, CheckStatus> = {};
      itemLocations.forEach((itemLoc) => {
        const currentInfo = itemChecks[itemLoc];
        if (currentInfo) {
          updatedChecks[itemLoc] = { ...currentInfo.status, checked: newStatus, manuallyChecked: true };
        }
      });
      dispatch(updateMultipleLocations(updatedChecks));
    } else {
      const loc = itemLocations[0];
      if (itemChecks[loc]) {
        dispatch(setLocationChecked({ location: loc, checked: !itemChecks[loc].status.checked, manual: true }));
      }
    }
  }, [itemLocations, status, itemChecks, dispatch]);

  const resetGroups = useCallback(() => {
    setExpandedGroups(new Set());
  }, []);

  return {
    itemLocations,
    itemChecks,
    displayList,
    status,
    maxLogicStatus,
    handleCheckClick,
    handleGroupExpand,
    toggleAllChecks,
    resetGroups,
    targetName,
  };
}
