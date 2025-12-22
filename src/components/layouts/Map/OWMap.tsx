interface OWMapProps {
  world?: "lw" | "dw";
}

import { entranceData } from "@/data/entranceData";
import { locationsData } from "@/data/locationsData";

function OWMap({ world = "lw" }: OWMapProps) {

  const entranceMode = true;

  const bgimg = world === "lw" ? "/lightworld.png" : "/darkworld.png";
  return (
    <div
      className="w-112 h-112 relative"
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
        return (
          <div
            key={locationKey}
            className="absolute h-2.5 w-2.5 bg-green-400 border border-black group z-10 hover:z-20"
            style={{
              top: `${((location.y/512)*448)-3}px`,
              left: `${((location.x/512)*448)-3}px`,
            }}
          >
            <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-2xs whitespace-nowrap rounded pointer-events-none border border-gray-600">
              {locationKey}
            </div>
          </div>
        );
      })}

     {entranceMode &&Object.keys(entranceData).map((entranceKey) => {
        const entrance = entranceData[entranceKey];
        if (entrance.world !== world) return null;
        return (
          <div
            key={entranceKey}
            className="absolute rounded-full h-2.5 w-2.5 bg-blue-400 border border-black group z-10 hover:z-20"
            style={{
              top: `${((entrance.y/512)*448)-3}px`,
              left: `${((entrance.x/512)*448)-3}px`,
            }}
          >
            <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-2xs whitespace-nowrap rounded pointer-events-none border border-gray-600">
              {entranceKey}
            </div>
          </div>
        );
      })}

    </div>
  );
}

export default OWMap;