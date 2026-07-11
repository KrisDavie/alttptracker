import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { History } from "lucide-react";
import type { RootState } from "@/store/store";
import { getEventLogEntryOpacity } from "./eventLogOpacity";

interface EventLogPanelProps {
  height: number;
  columns: number;
}

const eventTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function EventLogPanel({ height, columns }: EventLogPanelProps) {
  const entries = useSelector((state: RootState) => state.eventLog.entries);
  const [now, setNow] = useState(() => Date.now());
  const latestEntryTimestamp = entries[0]?.timestamp;
  const effectiveNow = latestEntryTimestamp ? Math.max(now, latestEntryTimestamp) : now;

  useEffect(() => {
    if (entries.length === 0) return undefined;

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 10 * 1000);

    return () => window.clearInterval(interval);
  }, [entries.length]);

  return (
    <section
      className="w-full bg-black text-white font-roboto flex flex-col"
      style={{ height }}
      aria-label="Event Log"
    >
      <div className="h-8 px-3 flex items-center gap-2 border-b border-gray-700 text-sm font-bold tracking-normal shrink-0">
        <History size={14} aria-hidden="true" />
        <span>Event Log</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-2 py-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {entries.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">No events yet</div>
        ) : (
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridAutoRows: "2rem" }}>
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`grid grid-cols-[1.75rem_1fr_auto] items-center gap-2 min-h-8 px-1 rounded transition-opacity duration-500 ease-out ${index === 0 ? "bg-white/10 ring-1 ring-white/10" : "bg-white/5"}`}
                style={{ opacity: getEventLogEntryOpacity(entry.timestamp, effectiveNow) }}
              >
                <div className="h-7 w-7 flex items-center justify-center bg-black/40">
                  {entry.image && (
                    <img
                      src={entry.image}
                      alt=""
                      className="max-h-7 max-w-7"
                      style={{ imageRendering: "pixelated" }}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs leading-4 font-bold">{entry.title}</div>
                  {entry.detail && <div className="truncate text-[10px] leading-3 text-gray-300">{entry.detail}</div>}
                </div>
                <time className="text-[10px] leading-none text-gray-400 tabular-nums" dateTime={new Date(entry.timestamp).toISOString()}>
                  {eventTimeFormatter.format(entry.timestamp)}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default EventLogPanel;
