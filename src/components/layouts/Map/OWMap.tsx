import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../../../store/store";

import MapLocation from "@/components/tracker/MapLocation";
import { locationsData, entranceLocations } from "@/data/locationsData";
import {
  getActiveLocations,
  getDungeonIdForEntry,
  isSecondaryEntrance,
  isReplacedByEntrances,
} from "@/lib/logic/locationMapper";

import { setSelectedEntrance, setCurrentMode } from "@/store/trackerSlice";
import { cn } from "@/lib/utils";
import EntranceSelectionModal from "@/components/tracker/EntranceSelectionModal";

interface OWMapProps {
  world?: "lw" | "dw";
}

function OWMap({ world = "lw" }: OWMapProps) {
  const dispatch = useDispatch();
  const entranceMode = useSelector((state: RootState) => state.settings.entranceMode);
  const bonkShuffle = useSelector((state: RootState) => state.settings.bonkShuffle);
  const mapMode = useSelector((state: RootState) => state.settings.mapMode);
  const entranceModalOpen = useSelector((state: RootState) => state.trackerState.modalOpen) === 'entrance';
  const selectedEntrance = useSelector((state: RootState) => state.trackerState.selectedEntrance);
  const settings = useSelector((state: RootState) => state.settings);
  const currentMode = useSelector((state: RootState) => state.trackerState.currentMode);

  const selectedWorld = selectedEntrance ? locationsData[selectedEntrance]?.world : "";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch(setSelectedEntrance([null, false]));
        dispatch(setCurrentMode("none"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const bgimg = world === "lw" ? "/lightworld.png" : "/darkworld.png";

  let fullSize: string, smallSize: string, dungeonSize: string, entranceSize: string;

  switch (mapMode) {
    case "vertical":
    case "normal":
      fullSize = "h-4 w-4";
      smallSize = "h-2.5 w-2.5";
      dungeonSize = "h-5.5 w-5.5";
      entranceSize = "h-3 w-3";
      break;
    case "compact":
      fullSize = "h-2.5 w-2.5";
      smallSize = "h-1.5 w-1.5";
      dungeonSize = "h-3.5 w-3.5";
      entranceSize = "h-[9px] w-[9px]";
      break;
  }
  return (
    <div
      className={cn("w-full h-full relative", currentMode === "connect" && "cursor-crosshair")}
      key={world}
      style={{
        backgroundImage: `url("${bgimg}")`,
        backgroundPosition: "center",
        backgroundSize: "100%",
        imageRendering: "pixelated",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {(entranceModalOpen && selectedWorld === world && mapMode !== "compact") && (
        <div className="absolute top-0 left-0 w-full h-full z-100">
          <EntranceSelectionModal />
        </div>
      )}
      {/* Item locations */}
      {Object.keys(locationsData).map((locationKey) => {
        const location = locationsData[locationKey];
        if (location.world !== world) return null;
        if (!bonkShuffle && location.bonk) return null;

        if (entranceMode !== "none") {
          // Entrance mode: show individual entrance markers, hide unified parent entries
          if (isReplacedByEntrances(locationKey)) return null;
          // Only show entrances that are not shuffled in the current entrance mode
          if (location.entrance && location.entrance_modes?.[entranceMode] !== "vanilla") return null;
        } else {
          // Non-entrance mode: show unified entries, hide secondary entrances
          if (isSecondaryEntrance(locationKey)) return null;
        }

        const activeLocations = getActiveLocations(locationKey, settings);
        if (activeLocations.length === 0) return null;

        // Determine dot type
        let itemType = "item";
        if (location.bonk) {
          itemType = "tree";
        }
        if (location.isDungeon || getDungeonIdForEntry(locationKey)) {
          itemType = "dungeon";
        }

        return (
          <MapLocation
            key={locationKey}
            name={locationKey}
            location={location}
            type={itemType as "dungeon" | "item" | "tree"}
            className={`hover:origin-center hover:scale-150 ${itemType === "tree" ? smallSize : itemType === "dungeon" ? dungeonSize : fullSize}`}
            tooltip={true}
            isEntrance={false}
          />
        );
      })}

      {/* Entrance tracking dots (green/gray) - only in entrance mode, for any shuffled entrance */}
      {Object.keys(entranceLocations).map((locationKey) => {
        if (entranceMode === "none") return null;
        const location = entranceLocations[locationKey];
        if (location.world !== world) return null;
        if (location.entrance_modes?.[entranceMode] === "vanilla") return null;
        if (locationKey.includes("Inverted") && settings.worldState === 'open') return null;

        return (
          <MapLocation
            key={locationKey}
            name={locationKey}
            location={location}
            type="entrance"
            className={`hover:origin-center hover:scale-150 ${entranceSize}`}
            tooltip={true}
            isEntrance={true}
          />
        );
      })}
    </div>
  );
}

export default OWMap;