import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import "./App.css";
import CommunityLayoutItems from "./components/layouts/CommunityTracker/CommunityLayoutItems";
import OWMap from "./components/layouts/Map/OWMap";

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

function App() {
  const [scale, setScale] = useState(1);
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

  let maps = []

  if (['inverted', 'inverted_1', 'standverted'].includes(worldState)) {
    maps = [<OWMap key="dw" world="dw" />, <OWMap key="lw" world="lw" />];
  } else {
    maps = [<OWMap key="lw" world="lw" />, <OWMap key="dw" world="dw" />];
  }


  return (
    <div className="h-screen w-screen bg-neutral-900 flex items-start justify-start overflow-hidden fixed inset-0" onContextMenu={(e) => e.preventDefault()}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
          flexShrink: 0,
        }}
        className={`flex ${isVertical || isCompact ? "flex-col" : "flex-row"} items-start`}
      >
        <div style={{ width: `${TILE}px`, height: `${TILE}px`, flexShrink: 0 }}>
          <CommunityLayoutItems />
        </div>
        {showMaps && (
          <div
            className={`flex ${isVertical ? "flex-col" : "flex-row"} items-start`}
            style={{
              width: isVertical || isCompact ? `${TILE}px` : `${TILE * 2}px`,
              height: isVertical ? `${TILE * 2}px` : isCompact ? `${TILE / 2}px` : `${TILE}px`,
            }}
          >
            {maps}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
