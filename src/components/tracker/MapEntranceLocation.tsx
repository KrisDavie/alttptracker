import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setEntranceChecked } from "../../store/checksSlice";
import { cn } from "@/lib/utils";
import { locationsData, type LocationData } from "@/data/locationsData";
import { LocationTooltip } from "./LocationTooltip";
import { useLocationTooltipData } from "@/hooks/useLocationTooltipData";
import { mapStatusBg } from "@/hooks/useStatusColors";
import { setSelectedEntrance, setCurrentMode } from "@/store/trackerSlice";
import { connectGenericConnector, setEntranceLink } from "@/store/entrancesSlice";

interface MapEntranceLocationProps {
  name: string;
  location: LocationData;
  className?: string;
  tooltip?: boolean;
}

function MapEntranceLocation(props: MapEntranceLocationProps) {
  const { name: locName, location } = props;
  const dispatch = useDispatch();
  const showTooltip = props.tooltip ?? false;

  const entranceMode = useSelector((state: RootState) => state.settings.entranceMode);
  const currentMode = useSelector((state: RootState) => state.trackerState.currentMode);

  const to = useSelector((state: RootState) => state.entrances[locName]?.to);
  const selectedEntrance = useSelector((state: RootState) => state.trackerState.selectedEntrance);

  const selectedEntranceGroup = selectedEntrance? locationsData[selectedEntrance]?.entrance_modes?.[entranceMode || "none"] : null
  const selfEntranceGroup = locationsData[locName]?.entrance_modes?.[entranceMode || "none"];
  const maxConnectorGroup = useSelector((state: RootState) => Object.values(state.entrances).reduce((max, entrance) => {
    if (entrance.connectorGroup) {
      return Math.max(max, entrance.connectorGroup)
    }
    return max;
  }, 0)
)


  const entranceCheck = useSelector((state: RootState) => state.checks.entranceChecks[locName]);

  const { itemLocations, itemChecks, displayList, handleCheckClick, handleGroupExpand, resetGroups, targetName } = useLocationTooltipData(to ?? '');

  const xPercent = (location.x / 512) * 100;
  const yPercent = (location.y / 512) * 100;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    console.log("click", e.button)
    if (e.button !== 0) return;
    if (currentMode === "connect" && selectedEntrance && selectedEntrance !== locName) {
      dispatch(setEntranceLink({ entrance: selectedEntrance, to: locName }));
      dispatch(setSelectedEntrance([null, false]));
      dispatch(setCurrentMode("none"));
    } else {
      dispatch(setEntranceChecked({ entrance: locName, checked: !entranceCheck.checked, manual: true }));
    }
  }

  function handleEntranceClick(e: React.MouseEvent) {

    // Middle click for quick actions
    if (e.button === 1) {
      e.stopPropagation();
      if (!selectedEntrance) {
        dispatch(setSelectedEntrance([locName, false]));
        dispatch(setCurrentMode("connect"));
      } else if (currentMode === "connect" && selectedEntrance !== locName) {
        dispatch(connectGenericConnector({ source: selectedEntrance, destination: locName, connectorId: maxConnectorGroup + 1 }));
        dispatch(setSelectedEntrance([null, false]));
        dispatch(setCurrentMode("none"));
      }
    }
    // Right click to set entrance with modal open
    if (e.button === 2) {
      e.preventDefault();
      dispatch(setSelectedEntrance([locName, true]));
    }
  }

  return (
    <div
      key={locName}
      className={cn(
        "absolute border border-black left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group z-10 hover:z-20 rounded-full",
        entranceCheck.checked ? mapStatusBg("checked") : locName === selectedEntrance ? mapStatusBg("selected") : mapStatusBg(entranceCheck.logic),
        props.className,
        selfEntranceGroup && selectedEntranceGroup === selfEntranceGroup && "ring-2 ring-blue-500",
        selfEntranceGroup && selectedEntranceGroup && selectedEntranceGroup !== selfEntranceGroup && "hidden",
        currentMode === "connect" && "cursor-crosshair"
      )}
      style={{
        top: `${yPercent}%`,
        left: `${xPercent}%`,
      }}
      onClick={handleClick}
      onAuxClick={handleEntranceClick}
      onContextMenu={handleEntranceClick}
      onMouseLeave={resetGroups}
    >
      {showTooltip && (
        <LocationTooltip
          name={targetName === locName ? locName : `${locName} → ${targetName}`}
          xPercent={xPercent}
          yPercent={yPercent}
          items={itemLocations.length > 1 ? displayList : undefined}
          singleCheck={
            itemLocations.length === 1
              ? { ...itemChecks[itemLocations[0]], key: itemLocations[0] }
              : itemLocations.length === 0
                ? {
                    key: locName,
                    status: entranceCheck,
                    displayName: locName,
                  }
                : undefined
          }
          onCheckClick={handleCheckClick}
          onGroupExpand={handleGroupExpand}
        />
      )}
    </div>
  );
}

export default MapEntranceLocation;
