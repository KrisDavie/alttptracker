import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import type { RootState } from "@/store/store";
import { getEventLogColumnCountForWidth } from "@/lib/trackerSizing";
import EventLogPanel from "@/components/tracker/EventLogPanel";

function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function TrackerEventLog() {
  const rehydrated = useSelector((state: RootState) => state.trackerState.rehydrated);
  const [windowSize, setWindowSize] = useState(getWindowSize);
  const columns = useMemo(() => getEventLogColumnCountForWidth(windowSize.width), [windowSize.width]);

  useEffect(() => {
    const handleResize = () => setWindowSize(getWindowSize());

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!rehydrated) {
    return (
      <div className="h-screen w-screen bg-surface fixed inset-0 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <title>Muffins Tracker 2.0 - Event Log - Loading...</title>
        <div className="text-primary font-body text-xl animate-pulse">Loading Event Log...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden fixed inset-0 font-body antialiased">
      <title>Muffins Tracker 2.0 - Event Log</title>
      <EventLogPanel height={windowSize.height} columns={columns} />
    </div>
  );
}
