import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

import MapLocation from "@/components/tracker/MapLocation";
import { entranceData } from "@/data/entranceData";
import { locationsData } from "@/data/locationsData";

interface OWMapProps {
  world?: "lw" | "dw";
}

function OWMap({ world = "lw" }: OWMapProps) {
  const entranceMode = useSelector((state: RootState) => state.settings.entranceMode);
  const bonkShuffle = true;

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
        if (entranceMode !== "none" && !location.overworld) return null;
        if (!bonkShuffle && location.bonk) return null;
        let itemType = "item";
        if (location.bonk) {
          itemType = "tree";
        }
        return (
          <MapLocation
            name={locationKey}
            type={itemType as "dungeon" | "entrance" | "item" | "multiItem" | "tree"}
            x={location.x}
            y={location.y}
            className={`hover:origin-center hover:scale-150 ${itemType === "tree" ? "h-2.5 w-2.5" : "h-4 w-4"}`}
            tooltip={true}
          />
        );
      })}

      {Object.keys(entranceData).map((locationKey) => {
        if (entranceMode === "none") return null;
        const location = entranceData[locationKey];
        if (location.world !== world) return null;
        const itemType = "entrance";
        return <MapLocation name={locationKey} type={itemType as "dungeon" | "entrance" | "item" | "multiItem" | "tree"} x={location.x} y={location.y} className="h-3 w-3 hover:origin-center hover:scale-150" tooltip={true} />;
      })}
    </div>
  );
}

export default OWMap;
