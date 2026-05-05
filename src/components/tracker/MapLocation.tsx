import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setEntranceChecked } from "../../store/checksSlice";
import { cn } from "@/lib/utils";
import { locationsData, type LocationData } from "@/data/locationsData";
import { useLocationTooltipData } from "@/hooks/useLocationTooltipData";
import { mapStatusBg } from "@/hooks/useStatusColors";
import { LocationTooltip } from "./LocationTooltip";
import { setSelectedEntrance, setCurrentMode, setSelectedLocation } from "@/store/trackerSlice";
import { connectGenericConnector, setEntranceLink } from "@/store/entrancesSlice";
import { defaultEntranceLabels } from "@/data/entranceLabels";
import { useMemo } from "react";
import { getDungeonIdForEntry } from "@/lib/logic/locationMapper";
import { getScoutedItemIcon, scoutedItemsEqual } from "@/lib/scoutedItems";
import { allConnectorEntrances } from "@/data/entranceConnections";

interface MapLocationProps {
  name: string;
  location: LocationData;
  className?: string;
  type: "dungeon" | "item" | "tree" | "entrance";
  tooltip?: boolean;
  isEntrance: boolean;
}

function resolveEntranceGroup(name: string | null, entranceMode: string | undefined, zelgaWoods: boolean) {
  if (!name) return null;
  const group = locationsData[name]?.entrance_modes?.[entranceMode || "none"] ?? null;
  return group === "skull_doors" && zelgaWoods ? "shuffle" : group;
}

function MapLocation(props: MapLocationProps) {
  const { name: locName, location, isEntrance } = props;
  const dispatch = useDispatch();
  const showTooltip = props.tooltip ?? false;

  // ---- Settings / global UI state ----
  const entranceMode = useSelector((state: RootState) => state.settings.entranceMode);
  const zelgaWoods = useSelector((state: RootState) => state.settings.zelgaWoods);
  const entranceLabelOverrides = useSelector((state: RootState) => state.settings.entranceLabelOverrides);
  const showInsetBossSquare = useSelector((state: RootState) => state.settings.showInsetBossSquare);
  const currentMode = useSelector((state: RootState) => state.trackerState.currentMode);
  const hoveredDungeon = useSelector((state: RootState) => state.trackerState.hoveredDungeon);
  const hoveredScout = useSelector((state: RootState) => state.trackerState.hoveredScout);
  const selectedLocation = useSelector((state: RootState) => state.trackerState.selectedLocation);
  const selectedEntrance = useSelector((state: RootState) => state.trackerState.selectedEntrance);
  const scoutedItems = useSelector((state: RootState) => state.scouts.markers[locName]);

  // ---- Entrance-scoped store state ----
  const to = useSelector((state: RootState) => (isEntrance ? state.entrances[locName]?.to : undefined));
  const entranceCheck = useSelector((state: RootState) => (isEntrance ? state.checks.entranceChecks[locName] : undefined));
  const maxConnectorGroup = useSelector((state: RootState) =>
    Object.values(state.entrances).reduce((max, e) => (e.connectorGroup ? Math.max(max, e.connectorGroup) : max), 0),
  );

  const mergedLabels = useMemo(() => ({ ...defaultEntranceLabels, ...entranceLabelOverrides }), [entranceLabelOverrides]);

  // ---- Derived entrance state ----
  const isLinked = !!(isEntrance && to);
  const isConnector = !!(isEntrance && to && allConnectorEntrances.includes(to));
  const dungeonId = getDungeonIdForEntry(to ?? "");
  const isLinkedToDungeon = isEntrance && to ? !!dungeonId : false;
  const showAsDiamond = isConnector && !isLinkedToDungeon;

  // Resolve dungeon id for the displayed location (dungeon entry directly, or entrance pointing to one)
  const resolvedDungeonId = isEntrance ? dungeonId : getDungeonIdForEntry(locName);
  const isHighlighted = isEntrance && dungeonId && hoveredDungeon === dungeonId;

  const selectedEntranceGroup = resolveEntranceGroup(selectedEntrance, entranceMode, zelgaWoods);
  const selfEntranceGroup = isEntrance ? resolveEntranceGroup(locName, entranceMode, zelgaWoods) : null;

  const labelColor = isEntrance && to ? mergedLabels?.[to]?.color : undefined;

  // We use the `to` field if it's an entrance and it's resolved, otherwise the name itself
  const targetLocationName = isEntrance && to ? to : locName;
  const { itemLocations, itemChecks, displayList, status, maxLogicStatus, handleCheckClick, handleGroupExpand, toggleAllChecks, resetGroups, targetName } = useLocationTooltipData(isEntrance ? (to ?? "") : targetLocationName);

  const xPercent = (location.x / 512) * 100;
  const yPercent = (location.y / 512) * 100;

  function handleLocationClick(e: React.MouseEvent) {
    e.stopPropagation();

    // Handle left click (click)
    if (e.button === 0 && e.type === "click") {
      if (isEntrance) {
        if (currentMode === "connect" && selectedEntrance) {
          dispatch(setEntranceLink({ entrance: selectedEntrance, to: locName }));
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

    // Right click (contextmenu) on non-entrance markers: toggle scout mode for this marker.
    if (!isEntrance && e.type === "contextmenu") {
      e.preventDefault();
      if (currentMode === "scout" && selectedLocation === locName) {
        dispatch(setCurrentMode("none"));
        dispatch(setSelectedLocation(null));
      } else {
        dispatch(setCurrentMode("scout"));
        dispatch(setSelectedLocation(locName));
      }
      return;
    }

    // Handle middle/right clicks (auxclick/contextmenu) for entrances
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

  // let bgClass: string;

  function getBgClass() {
    if (locName === selectedEntrance) return mapStatusBg("selected");
    if (isEntrance) {
      if (isLinked) {
        if (itemLocations.length === 0) {
          // Checked -> Connector -> Entrance availability
          return entranceCheck?.checked ? mapStatusBg("checked") : showAsDiamond ? mapStatusBg("connector") : mapStatusBg(entranceCheck?.logic || "unavailable");
        } else {
          // Connector -> All items checked -> Internal logic status
          return status === "all" ? (showAsDiamond ? mapStatusBg("connector") : mapStatusBg("checked")) : mapStatusBg(maxLogicStatus);
        }
      } else {
        // Unlinked entrance: Checked -> Entrance availability
        return entranceCheck?.checked ? mapStatusBg("checked") : mapStatusBg(entranceCheck?.logic || "unavailable");
      }
    } else {
      // Non-entrance: All items checked -> Internal logic status
      return mapStatusBg(status === "all" ? "checked" : maxLogicStatus);
    }

  }


  // Boss inner-square: when this marker maps to a dungeon and that dungeon has a "- Boss" check
  const bossLocationKey = resolvedDungeonId ? itemLocations.find((l) => l.endsWith(" - Boss")) : undefined;
  const bossCheckStatus = bossLocationKey ? itemChecks[bossLocationKey]?.status : undefined;
  const bossBgClass = bossCheckStatus ? (bossCheckStatus.checked ? mapStatusBg("checked") : mapStatusBg(bossCheckStatus.logic)) : undefined;

  const isScoutSelected = !isEntrance && currentMode === "scout" && selectedLocation === locName;
  const isScoutHoverHighlighted = !isEntrance && !!hoveredScout && !!scoutedItems && scoutedItems.some((s) => scoutedItemsEqual(s, hoveredScout));
  const firstScout = !isEntrance && scoutedItems && scoutedItems.length > 0 ? scoutedItems[0] : undefined;
  const firstScoutIcon = firstScout ? getScoutedItemIcon(firstScout) : undefined;

  const isRound = isEntrance && itemLocations.length === 0 && !showAsDiamond;
  const isFaded = ((entranceCheck?.checked && !isLinked) || status === "all") && !showAsDiamond;
  // Hide entrances that don't match the currently selected entrance group
  const hidden = !!(selfEntranceGroup && selectedEntranceGroup && selectedEntranceGroup !== selfEntranceGroup);
  // Highlight entrances in the same group as the selected entrance
  const highlightGroup = !!(selfEntranceGroup && selectedEntranceGroup === selfEntranceGroup);

  const tooltipName = isEntrance && targetName && targetName !== locName ? `${locName} → ${targetName}` : locName;
  const singleCheck =
    itemLocations.length === 1
      ? { ...itemChecks[itemLocations[0]], key: itemLocations[0] }
      : isEntrance && !isLinked && entranceCheck
        ? { key: locName, status: entranceCheck, displayName: locName }
        : undefined;

  const bgClass = getBgClass();
  return (
    <div
      key={locName}
      className={cn(
        "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group z-10 hover:z-20",
        props.className,
        hidden && "hidden",
        currentMode === "connect" && "cursor-crosshair",
        isFaded && "opacity-80",
      )}
      style={{ top: `${yPercent}%`, left: `${xPercent}%` }}
      onClick={handleLocationClick}
      onAuxClick={handleLocationClick}
      onContextMenu={handleLocationClick}
      onMouseLeave={resetGroups}
    >
      {/* Visual square (rotated for connector diamonds) */}
      <div
        className={cn(
          "absolute inset-0 border",
          !labelColor && ((showAsDiamond && !["bg-status-connector", "bg-status-checked"].includes(bgClass)) ? "border-status-connector" : "border-black" ),
          bgClass,
          isRound && "rounded-full",
          isHatched && "is-hatched",
          highlightGroup && "ring-2 ring-blue-500",
          (isHighlighted || isScoutHoverHighlighted) && "ring-2 ring-yellow-500",
          isScoutSelected && "ring-2 ring-pink-500",
          showAsDiamond && "rotate-45",
        )}
        style={labelColor ? { borderColor: labelColor, borderWidth: "2px" } : undefined}
      >
        {showInsetBossSquare && bossBgClass && (
          <div className={cn("absolute inset-1 border border-black pointer-events-none", bossBgClass, bossCheckStatus?.checked && "opacity-80")} />
        )}
        {firstScoutIcon && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${firstScoutIcon})`,
              backgroundPosition: "center",
              backgroundSize: "100%",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
            }}
          />
        )}
      </div>
      {showTooltip && (
        <LocationTooltip
          name={tooltipName}
          xPercent={xPercent}
          yPercent={yPercent}
          items={itemLocations.length > 1 ? displayList : undefined}
          singleCheck={singleCheck}
          onCheckClick={handleCheckClick}
          onGroupExpand={handleGroupExpand}
          onClose={resetGroups}
          scoutedItems={!isEntrance ? scoutedItems : undefined}
        />
      )}
    </div>
  );
}

export default MapLocation;
