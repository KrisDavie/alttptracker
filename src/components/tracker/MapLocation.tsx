import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setEntranceChecked } from "../../store/checksSlice";
import { cn } from "@/lib/utils";
import { locationsData, type LocationData } from "@/data/locationsData";
import { useLocationTooltipData } from "@/hooks/useLocationTooltipData";
import { mapStatusBg } from "@/hooks/useStatusColors";
import { LocationTooltip } from "./LocationTooltip";
import { setSelectedEntrance, setCurrentMode } from "@/store/trackerSlice";
import { connectGenericConnector, setEntranceLink } from "@/store/entrancesSlice";
import { defaultEntranceLabels } from "@/data/entranceLabels";
import { useMemo } from "react";
import { getDungeonIdForEntry } from "@/lib/logic/locationMapper";

interface MapLocationProps {
  name: string;
  location: LocationData;
  className?: string;
  type: "dungeon" | "item" | "tree" | "entrance";
  tooltip?: boolean;
  isEntrance: boolean;
}

function MapLocation(props: MapLocationProps) {
  const { name: locName, location, isEntrance } = props;
  const dispatch = useDispatch();
  const showTooltip = props.tooltip ?? false;

  const entranceMode = useSelector((state: RootState) => state.settings.entranceMode);
  const currentMode = useSelector((state: RootState) => state.trackerState.currentMode);
  const zelgaWoods = useSelector((state: RootState) => state.settings.zelgaWoods);
  const hoveredDungeon = useSelector((state: RootState) => state.trackerState.hoveredDungeon);
  const entranceLabelOverrides = useSelector((state: RootState) => state.settings.entranceLabelOverrides);

  const mergedLabels = useMemo(
    () => ({ ...defaultEntranceLabels, ...entranceLabelOverrides }),
    [entranceLabelOverrides]
  );

  // Entrance specific state
  const to = useSelector((state: RootState) => isEntrance ? state.entrances[locName]?.to : undefined);
  const selectedEntrance = useSelector((state: RootState) => state.trackerState.selectedEntrance);

  const dungeonId = getDungeonIdForEntry(to ?? "");
  const isHighlighted = isEntrance && dungeonId && hoveredDungeon === dungeonId;

  let selectedEntranceGroup = selectedEntrance ? locationsData[selectedEntrance]?.entrance_modes?.[entranceMode || "none"] : null;
  if (selectedEntranceGroup === "skull_doors" && zelgaWoods) {
    selectedEntranceGroup = "shuffle";
  }

  let selfEntranceGroup = isEntrance ? locationsData[locName]?.entrance_modes?.[entranceMode || "none"] : null;
  if (selfEntranceGroup === "skull_doors" && zelgaWoods) {
    selfEntranceGroup = "shuffle";
  }

  const maxConnectorGroup = useSelector((state: RootState) => Object.values(state.entrances).reduce((max, entrance) => {
    if (entrance.connectorGroup) {
      return Math.max(max, entrance.connectorGroup)
    }
    return max;
  }, 0));

  const entranceCheck = useSelector((state: RootState) => isEntrance ? state.checks.entranceChecks[locName] : undefined);

  const labelColor = isEntrance && to ? mergedLabels?.[to]?.color : undefined;

  // We use the `to` field if it's an entrance and it's resolved, otherwise the name itself
  const targetLocationName = isEntrance && to ? to : locName;
  const isLinked = isEntrance && to && to !== "";

  const { itemLocations, itemChecks, displayList, status, maxLogicStatus, handleCheckClick, handleGroupExpand, toggleAllChecks, resetGroups, targetName } = useLocationTooltipData(isEntrance ? to ?? "" : targetLocationName);

  const xPercent = (location.x / 512) * 100;
  const yPercent = (location.y / 512) * 100;

  function handleLocationClick(e: React.MouseEvent) {
    e.stopPropagation();

    // Handle left click (click)
    if (e.button === 0 && e.type === "click") {
      if (isEntrance) {
        if (currentMode === "connect" && selectedEntrance) {
          dispatch(setEntranceLink({ entrance: selectedEntrance, to: locName }));
          console.log("linking", selectedEntrance, "to", locName)
          dispatch(setSelectedEntrance([null, false]));
          dispatch(setCurrentMode("none"));
        } else {
          if (isLinked && itemLocations.length > 0) {
            toggleAllChecks();
          } else if (entranceCheck) {
            dispatch(setEntranceChecked({ entrance: locName, checked: !entranceCheck.checked, manual: true }));
          }
        }
      } else {
        toggleAllChecks();
      }
      return;
    }

    // Handle middle/right clicks (auxclick/contextmenu)
    if (!isEntrance || entranceMode === "none") return;

    if (e.type === "contextmenu") {
      e.preventDefault();
    }

    // Middle click (auxclick)
    if (e.button === 1 && e.type === "auxclick") {
      if (!selectedEntrance) {
        dispatch(setSelectedEntrance([locName, false]));
        dispatch(setCurrentMode("connect"));
      } else if (currentMode === "connect" && selectedEntrance !== locName) {
        dispatch(connectGenericConnector({ source: selectedEntrance, destination: locName, connectorId: maxConnectorGroup + 1 }));
        dispatch(setSelectedEntrance([null, false]));
        dispatch(setCurrentMode("none"));
      }
    }
    
    // Right click (contextmenu)
    if (e.button === 2 && e.type === "contextmenu") {
      dispatch(setSelectedEntrance([locName, true]));
    }
  }

  const isHatched = (!isEntrance || isLinked) && status === "some";
  const isGenericConnector = isLinked && itemLocations.length === 0;
  const bgClass =
    isEntrance && !isLinked
      ? (entranceCheck?.checked ? mapStatusBg("checked") : locName === selectedEntrance ? mapStatusBg("selected") : mapStatusBg(entranceCheck?.logic || "unavailable"))
      : isGenericConnector
        ? (entranceCheck?.checked ? mapStatusBg("checked") : mapStatusBg(entranceCheck?.logic || "unavailable"))
        : (status === "all" ? mapStatusBg("checked") : mapStatusBg(maxLogicStatus));

  return (
    <div
      key={locName}
      className={cn(
        "absolute border left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group z-10 hover:z-20",
        !labelColor && "border-black",
        (isEntrance && itemLocations.length === 0) && "rounded-full",
        bgClass,
        isHatched && "is-hatched",
        props.className,
        selfEntranceGroup && selectedEntranceGroup === selfEntranceGroup && "ring-2 ring-blue-500",
        selfEntranceGroup && selectedEntranceGroup && selectedEntranceGroup !== selfEntranceGroup && "hidden",
        currentMode === "connect" && "cursor-crosshair",
        ((entranceCheck?.checked && !isLinked) || (status === "all")) ? "opacity-80" : "",
        isHighlighted && "ring-2 ring-yellow-500"
      )}
      style={{
        top: `${yPercent}%`,
        left: `${xPercent}%`,
        ...(labelColor && { borderColor: labelColor, borderWidth: "2px"}),
      }}
      onClick={handleLocationClick}
      onAuxClick={handleLocationClick}
      onContextMenu={handleLocationClick}
      onMouseLeave={resetGroups}
    >
      {showTooltip && (
        <LocationTooltip
          name={isEntrance ? (targetName === locName || !targetName ? locName : `${locName} → ${targetName}`) : locName}
          xPercent={xPercent}
          yPercent={yPercent}
          items={itemLocations.length > 1 ? displayList : undefined}
          singleCheck={
            itemLocations.length === 1
              ? { ...itemChecks[itemLocations[0]], key: itemLocations[0] }
              : (isEntrance && !isLinked && entranceCheck)
                ? {
                    key: locName,
                    status: entranceCheck,
                    displayName: locName,
                  }
                : undefined
          }
          onCheckClick={handleCheckClick}
          onGroupExpand={handleGroupExpand}
          onClose={resetGroups}
        />
      )}
    </div>
  );
}

export default MapLocation;
