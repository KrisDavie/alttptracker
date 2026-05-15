import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

function StatusBar() {
  const hoveredMarker = useSelector((state: RootState) => state.trackerState.hoveredMarker);
  const tooltipsEnabled = useSelector((state: RootState) => state.settings.showMapTooltips);
  const entranceMode = useSelector((state: RootState) => state.settings.entranceMode);
  const entranceData = useSelector((state: RootState) => state.entrances[hoveredMarker || ""]);

  if (tooltipsEnabled || !hoveredMarker) {
    return null;
  }

  let hoverText = hoveredMarker;

  if (entranceMode !== "none" && entranceData) {
    if (entranceData.to) {
      hoverText = `${hoverText} -> ${entranceData.to}`;
    }
    if (entranceData.note) {
      hoverText += ` || NOTE: ${entranceData.note}`;
    }
  }

  return <div className="absolute bottom-0 z-11 status-bar w-full h-4 bg-black/80 text-white text-center text-xs font-roboto flex items-center justify-center">{hoverText}</div>;
}

export default StatusBar;
