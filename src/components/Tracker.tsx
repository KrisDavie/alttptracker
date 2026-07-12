import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { EVENT_LOG_GAP, EVENT_LOG_HEIGHT, TILE, getEventLogColumnCount, getTrackerLayoutDimensions } from "@/lib/trackerSizing";
import CommunityLayoutItems from "@/components/layouts/CommunityTracker/CommunityLayoutItems";
import OWMap from "@/components/layouts/Map/OWMap";
import EntranceLinesOverlay from "@/components/tracker/EntranceLinesOverlay";
import EntranceSelectionModal from "@/components/tracker/EntranceSelectionModal";
import ConnectionListModal from "@/components/tracker/ConnectionListModal";
import ItemEntranceListModal from "@/components/tracker/ItemEntranceListModal";
import { Loader2 } from "lucide-react";
import StatusBar from "./tracker/StatusBar";
import EventLogPanel from "./tracker/EventLogPanel";

export function Tracker() {
  const rehydrated = useSelector((state: RootState) => state.trackerState.rehydrated);
  const mapMode = useSelector((state: RootState) => state.settings.mapMode);
  const worldState = useSelector((state: RootState) => state.settings.worldState);
  const eventLogMode = useSelector((state: RootState) => state.settings.eventLogMode);
  const showAttachedEventLog = eventLogMode === "attached";
  const { width: trackerWidth, height: trackerHeight } = useMemo(() => getTrackerLayoutDimensions(mapMode), [mapMode]);
  const eventLogHeight = showAttachedEventLog ? EVENT_LOG_HEIGHT : 0;
  const eventLogColumns = useMemo(() => getEventLogColumnCount(mapMode), [mapMode]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const widthScale = Math.min(window.innerWidth / trackerWidth, 1);
      const gap = showAttachedEventLog ? EVENT_LOG_GAP : 0;
      const totalHeight = trackerHeight + eventLogHeight + gap;
      const heightScale = Math.min(window.innerHeight / totalHeight, 1);
      setScale(Math.min(widthScale, heightScale));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [trackerWidth, trackerHeight, showAttachedEventLog, eventLogHeight]);

  const height = trackerHeight + eventLogHeight + (showAttachedEventLog ? EVENT_LOG_GAP : 0);

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
        <title>Muffins Tracker 2.0 - Tracker - Loading...</title>
        <div className="text-primary font-body text-xl animate-pulse">Loading Tracker...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-surface flex items-start justify-start overflow-hidden fixed inset-0 font-body antialiased" onContextMenu={(e) => e.preventDefault()}>
      <title>Muffins Tracker 2.0 - Tracker</title>
      <div className="stone-texture opacity-[0.03]"></div>
      <div
        data-tracker-bounds
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${trackerWidth}px`,
          height: `${height}px`,
          gap: showAttachedEventLog ? `${EVENT_LOG_GAP}px` : undefined,
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
        className="flex flex-col items-start"
      >
        <div
          style={{ width: `${trackerWidth}px`, height: `${trackerHeight}px`, flexShrink: 0 }}
          className={`relative flex ${isVertical || isCompact ? "flex-col" : "flex-row"} items-start`}
        >
          <div style={{ width: `${TILE}px`, height: `${TILE}px`, flexShrink: 0 }} className="relative">
            <CommunityLayoutItems />
          </div>
          {showMaps && !['popoutNormal', 'popoutVertical'].includes(mapMode) && (
            <div
              className="relative"
              style={{
                width: isVertical || isCompact ? `${TILE}px` : `${TILE * 2}px`,
                height: isVertical ? `${TILE * 2}px` : isCompact ? `${TILE / 2}px` : `${TILE}px`,
              }}
              >
              {entranceModalOpen && !isCompact && (
                <div className="absolute top-0 left-0 w-full h-full z-100 pointer-events-none">
                  <EntranceSelectionModal />
                </div>
              )}
              {!isCompact && (
                <div className="absolute top-0 left-0 w-full h-full z-100 pointer-events-none">
                  <ConnectionListModal />
                  <ItemEntranceListModal />
                </div>
              )}
              <EntranceLinesOverlay />
              <StatusBar />
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
          {isCompact && (
            <div className="absolute inset-0 z-100 pointer-events-none">
              <ConnectionListModal />
              <ItemEntranceListModal />
              {entranceModalOpen && selectedEntrance && (
                <EntranceSelectionModal />)}
            </div>
          )}
        </div>
        {showAttachedEventLog && <EventLogPanel height={eventLogHeight} columns={eventLogColumns} />}
      </div>
    </div>
  );
}
