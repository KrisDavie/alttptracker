import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import CommunityLayoutItems from "@/components/layouts/CommunityTracker/CommunityLayoutItems";
import OWMap from "@/components/layouts/Map/OWMap";
import EntranceLinesOverlay from "@/components/tracker/EntranceLinesOverlay";
import EntranceSelectionModal from "@/components/tracker/EntranceSelectionModal";
import { Loader2 } from "lucide-react";

const TILE = 448;

function getLayoutDimensions(mapMode: "off" | "normal" | "compact" | "vertical") {
  switch (mapMode) {
    case "off":
      return { width: TILE, height: TILE };
    case "normal":
      return { width: TILE * 3, height: TILE };
    case "compact":
      return { width: TILE, height: TILE * 1.5 };
    case "vertical":
      return { width: TILE, height: TILE * 3 };
  }
}

export function Tracker() {
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

  const showMaps = mapMode !== "off";
  const isVertical = mapMode === "vertical";
  const isCompact = mapMode === "compact";
  const entranceModalOpen = useSelector((state: RootState) => state.trackerState.modalOpen) === 'entrance';
  const selectedEntrance = useSelector((state: RootState) => state.trackerState.selectedEntrance);

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
        <div className="text-primary font-body text-xl animate-pulse">Loading Tracker...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-surface flex items-start justify-start overflow-hidden fixed inset-0 font-body antialiased" onContextMenu={(e) => e.preventDefault()}>
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
        <div style={{ width: `${TILE}px`, height: `${TILE}px`, flexShrink: 0 }} className="relative">
          <CommunityLayoutItems />
          {isCompact && entranceModalOpen && selectedEntrance && (
            <div className="absolute top-0 left-0 w-full h-full z-100">
              <EntranceSelectionModal />
            </div>
          )}
        </div>
        {showMaps && (
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
        )}
      </div>
    </div>
  );
}
