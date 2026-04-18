import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import OWMap from "@/components/layouts/Map/OWMap";
import EntranceLinesOverlay from "@/components/tracker/EntranceLinesOverlay";
import { Loader2 } from "lucide-react";

const TILE = 448;

function getLayoutDimensions(mapMode: "off" | "normal" | "compact" | "vertical" | "popoutNormal" | "popoutVertical") {
  switch (mapMode) {
    case "popoutNormal":
      return { width: TILE * 2, height: TILE };
    case "popoutVertical":
      return { width: TILE, height: TILE * 2 };
    default:
      return { width: TILE, height: TILE };
  }
}

export function TrackerMap() {
  const [scale, setScale] = useState(1);
  const rehydrated = useSelector((state: RootState) => state.trackerState.rehydrated);
  const mapMode = useSelector((state: RootState) => state.settings.mapMode);
  const worldState = useSelector((state: RootState) => state.settings.worldState);
  const { width, height } = useMemo(() => getLayoutDimensions(mapMode), [mapMode]);

  useEffect(() => {
    const handleResize = () => {
      const scaleW = window.innerWidth / width;
      const scaleH = window.innerHeight / height;
      setScale(Math.min(scaleW, scaleH, 1));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [width, height]);

  const isVertical = mapMode === "vertical" || mapMode === "popoutVertical";
  const isCompact = mapMode === "compact";

  let maps = [];

  if (["inverted", "inverted_1", "standverted"].includes(worldState)) {
    maps = [<OWMap key="dw" world="dw" />, <OWMap key="lw" world="lw" />];
  } else {
    maps = [<OWMap key="lw" world="lw" />, <OWMap key="dw" world="dw" />];
  }

  if (!rehydrated) {
    return (
      <div className="h-screen w-screen bg-surface fixed inset-0 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <title>Muffins Tracker 2.0 - Map Popout - Loading...</title>
        <div className="text-primary font-body text-xl animate-pulse">Loading Tracker...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-surface flex items-start justify-start overflow-hidden fixed inset-0 font-body antialiased" onContextMenu={(e) => e.preventDefault()}>
      <title>Muffins Tracker 2.0 - Map Popout</title>
      <div className="stone-texture opacity-[0.03]"></div>
      <div
        data-tracker-bounds
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
        className={`flex ${isVertical || isCompact ? "flex-col" : "flex-row"} items-start`}
      >
        <div
          className="relative"
          style={{
            width: isVertical || isCompact ? `${TILE}px` : `${TILE * 2}px`,
            height: isVertical ? `${TILE * 2}px` : isCompact ? `${TILE / 2}px` : `${TILE}px`,
          }}
        >
          <EntranceLinesOverlay />
          <div
            className={`flex ${isVertical ? "flex-col" : "flex-row"} items-start relative`}
            style={{
              width: isVertical || isCompact ? `${TILE}px` : `${TILE * 2}px`,
              height: isVertical ? `${TILE * 2}px` : isCompact ? `${TILE / 2}px` : `${TILE}px`,
            }}
          >
            {maps}
          </div>
        </div>
      </div>
    </div>
  );
}
