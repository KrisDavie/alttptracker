import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

import MapItemLocation from "@/components/tracker/MapItemLocation";
import MapEntranceLocation from "@/components/tracker/MapEntranceLocation";
import { locationsData, entranceLocations } from "@/data/locationsData";
import {
  getActiveLocations,
  getDungeonIdForEntry,
  isSecondaryEntrance,
  isReplacedByEntrances,
} from "@/lib/logic/locationMapper";

interface OWMapProps {
  world?: "lw" | "dw";
}

function OWMap({ world = "lw" }: OWMapProps) {
  const entranceMode = useSelector((state: RootState) => state.settings.entranceMode);
  const bonkShuffle = useSelector((state: RootState) => state.settings.bonkShuffle);
  const mapMode = useSelector((state: RootState) => state.settings.mapMode);
  const settings = useSelector((state: RootState) => state.settings);

  const bgimg = world === "lw" ? "/lightworld.png" : "/darkworld.png";

  let fullSize: string, smallSize: string;

  switch (mapMode) {
    case "vertical":
    case "normal":
      fullSize = "h-4 w-4";
      smallSize = "h-2.5 w-2.5";
      break;
    case "compact":
      fullSize = "h-2.5 w-2.5";
      smallSize = "h-1.5 w-1.5";
      break;
  }
  return (
    <div
      className="w-full h-full relative"
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
      {/* Item location dots */}
      {Object.keys(locationsData).map((locationKey) => {
        const location = locationsData[locationKey];
        if (location.world !== world) return null;
        if (!bonkShuffle && location.bonk) return null;

        if (entranceMode !== "none") {
          // Entrance mode: show individual entrance markers, hide unified parent entries
          if (isReplacedByEntrances(locationKey)) return null;
          // Skip entrances whose mode is vanilla in current entrance mode
          if (location.entrance && location.entrance_modes?.[entranceMode] === "vanilla") return null;
        } else {
          // Non-entrance mode: show unified entries, hide secondary entrances
          if (isSecondaryEntrance(locationKey)) return null;
        }

        // Only filter: entries with 0 active item locations are hidden
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
          <MapItemLocation
            key={locationKey}
            name={locationKey}
            location={location}
            type={itemType as "dungeon" | "item" | "tree"}
            className={`hover:origin-center hover:scale-150 ${itemType === "tree" ? smallSize : fullSize}`}
            tooltip={true}
          />
        );
      })}

      {/* Entrance tracking dots (green/gray) - only in entrance mode, for 0-item entrances */}
      {Object.keys(entranceLocations).map((locationKey) => {
        if (entranceMode === "none") return null;
        const location = entranceLocations[locationKey];
        if (location.world !== world) return null;
        if (location.entrance_modes?.[entranceMode] === "vanilla") return null;

        // Only show entrance-only markers for entries with 0 item locations
        // (entries WITH items are already shown as MapItemLocation dots above)
        const activeLocations = getActiveLocations(locationKey, settings);
        if (activeLocations.length > 0) return null;

        return (
          <MapEntranceLocation
            key={locationKey}
            name={locationKey}
            location={location}
            className="h-3 w-3 hover:origin-center hover:scale-150"
            tooltip={true}
          />
        );
      })}
    </div>
  );
}

export default OWMap;