import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setModalClose, setSelectedEntrance } from "@/store/trackerSlice";
import { defaultEntranceLabels } from "@/data/entranceLabels";
import { allConnectorEntrances } from "@/data/entranceConnections";
import { Button } from "../ui/button";
import { useMemo } from "react";

interface Connection {
  source: string;
  to: string;
}

function isConnectorTarget(to: string): boolean {
  return allConnectorEntrances.includes(to) || to.startsWith("Unknown Connector") || to.startsWith("Generic Connector");
}

function ConnectionRow({ source, to, color }: { source: string; to: string; color: string }) {
  return (
    <div className="flex items-center gap-1 text-2xs leading-tight py-0.5">
      <span className="flex-1 min-w-0 font-semibold text-right" style={{ color }} title={to}>
        {to}
      </span>
      <span className="text-gray-500 shrink-0">@</span>
      <span className="flex-1 min-w-0 text-gray-300" title={source}>
        {source}
      </span>
    </div>
  );
}

function ConnectionListModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.trackerState.modalOpen) === "connections";
  const entrances = useSelector((state: RootState) => state.entrances);
  const mapMode = useSelector((state: RootState) => state.settings.mapMode);
  const entranceLabelOverrides = useSelector((state: RootState) => state.settings.entranceLabelOverrides);
  const mergedLabels = useMemo(() => ({ ...defaultEntranceLabels, ...entranceLabelOverrides }), [entranceLabelOverrides]);

  const { links, connectors } = useMemo(() => {
    const links: Connection[] = [];
    const connectors: Connection[] = [];
    for (const [source, data] of Object.entries(entrances)) {
      const to = data?.to;
      if (!to) continue;
      if (isConnectorTarget(to)) connectors.push({ source, to });
      else links.push({ source, to });
    }
    // Links sorted by destination so the player can quickly find a placed location.
    links.sort((a, b) => a.to.localeCompare(b.to) || a.source.localeCompare(b.source));
    connectors.sort((a, b) => a.source.localeCompare(b.source));
    return { links, connectors };
  }, [entrances]);

  if (mapMode === "off" || !isOpen) return null;

  const compact = mapMode === "compact";
  const colorFor = (to: string) => mergedLabels[to]?.color ?? "#d1d5db";

  return (
    <div className={`absolute inset-x-8 ${compact ? "inset-y-0.5" : "inset-y-6"} bg-gray-900/95 border-2 border-gray-600 rounded-lg flex flex-col text-white p-4 z-50 shadow-2xl overflow-hidden pointer-events-auto`}>
      <div className="text-center w-full mb-2 shrink-0">
        <p className={`${compact ? "text-2xs" : "text-sm"} font-semibold text-gray-300 uppercase tracking-wider`}>Connections</p>
      </div>

      <div className={`grid ${["compact", "vertical", "popoutVertical"].includes(mapMode) ? "grid-rows-2" : "grid-cols-2"} gap-4 w-full flex-1 min-h-0`}>
        {/* Links */}
        <div className="flex flex-col min-h-0">
          <span className="text-xs font-bold text-gray-400 border-b border-gray-600 pb-1 mb-1 shrink-0">Links ({links.length})</span>
          <div className="flex flex-col overflow-y-auto pr-1 min-h-0">
            {links.length === 0 && <span className="text-2xs text-gray-500 italic">No links placed</span>}
            {links.map(({ source, to }) => (
              <ConnectionRow key={source} source={source} to={to} color={colorFor(to)} />
            ))}
          </div>
        </div>

        {/* Connectors */}
        <div className="flex flex-col min-h-0">
          <span className="text-xs font-bold text-gray-400 border-b border-gray-600 pb-1 mb-1 shrink-0">Connectors ({connectors.length})</span>
          <div className="flex flex-col overflow-y-auto pr-1 min-h-0">
            {connectors.length === 0 && <span className="text-2xs text-gray-500 italic">No connectors placed</span>}
            {connectors.map(({ source, to }) => (
              <ConnectionRow key={source} source={source} to={to} color={colorFor(to)} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-3 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          className="w-40"
          onClick={() => {
            dispatch(setSelectedEntrance([null, false]));
            dispatch(setModalClose());
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default ConnectionListModal;
