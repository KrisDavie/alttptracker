import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setEntranceChecked } from "../../store/checksSlice";
import { cn } from "@/lib/utils";
import type { LocationData } from "@/data/locationsData";
import { LocationTooltip } from "./LocationTooltip";
import { useLocationTooltipData } from "@/hooks/useLocationTooltipData";

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

  const entranceCheck = useSelector((state: RootState) => state.checks.entranceChecks[locName]);

  const { itemLocations, itemChecks, displayList, handleCheckClick, handleGroupExpand, resetGroups, targetName } = useLocationTooltipData(locName);

  const xPercent = (location.x / 512) * 100;
  const yPercent = (location.y / 512) * 100;

  function handleClick() {
    dispatch(setEntranceChecked({ entrance: locName, checked: !entranceCheck.checked, manual: true }));
  }

  function handleConnectorClick(e: React.MouseEvent) {
    if (e.button === 1) {
      e.stopPropagation();
    }
  }

  return (
    <div
      key={locName}
      className={cn(
        `absolute
           ${entranceCheck.checked ? "bg-gray-500 opacity-70" : "bg-green-500"}
           rounded-full
           border border-black left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
           group z-10 hover:z-20`,
        props.className,
      )}
      style={{
        top: `${yPercent}%`,
        left: `${xPercent}%`,
      }}
      onClick={handleClick}
      onAuxClick={handleConnectorClick}
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
