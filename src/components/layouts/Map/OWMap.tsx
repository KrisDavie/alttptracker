interface OWMapProps {
  world?: "lw" | "dw";
}

import MapLocation from "@/components/tracker/MapLocation";
import { entranceData } from "@/data/entranceData";
import { locationsData } from "@/data/locationsData";

function OWMap({ world = "lw" }: OWMapProps) {

  const entranceMode = true;

  const bgimg = world === "lw" ? "/lightworld.png" : "/darkworld.png";
  return (
    <div
      className="w-112 h-112 relative"
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
      {Object.keys(locationsData).map((locationKey) => {
        const location = locationsData[locationKey];
        if (location.world !== world) return null;
        if (entranceMode && !location.overworld) return null;
        let itemType = "item"
        if (location.bonk) {
          itemType = "tree"
        }
        return (
          <MapLocation
            name={locationKey}
            type={itemType as "dungeon" | "entrance" | "item" | "multiItem" | "tree"}
            x={location.x}
            y={location.y}
          />
        );
      })}

      {Object.keys(entranceData).map((locationKey) => {
        const location = entranceData[locationKey];
        if (location.world !== world) return null;
        const itemType = "entrance"
        return (
          <MapLocation
            name={locationKey}
            type={itemType as "dungeon" | "entrance" | "item" | "multiItem" | "tree"}
            x={location.x}
            y={location.y}
          />
        );
      })}

    </div>
  );
}

export default OWMap;