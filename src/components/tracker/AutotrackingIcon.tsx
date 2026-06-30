import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import { MemoryStick, TriangleAlert } from "lucide-react";
import { useLocalNetworkAccess, shouldWarnLocalNetworkAccess } from "@/lib/localNetworkAccess";

interface AutotrackingIconProps {
  size?: number;
}

function AutotrackingIcon({ size = 16 }: AutotrackingIconProps) {
  const { isConnected, status, selectedDevice } = useSelector((state: RootState) => state.autotracker);
  const autotrackingEnabled = useSelector((state: RootState) => state.settings.autotracking);
  const lnaState = useLocalNetworkAccess();
  const showLnaWarning = autotrackingEnabled && !isConnected && status !== "no devices found" && shouldWarnLocalNetworkAccess(lnaState);

  const statusText = status === "connected" && selectedDevice ? `Connected: ${selectedDevice}` : status.charAt(0).toUpperCase() + status.slice(1);

  const color = isConnected ? "green" : status === "no devices found" ? "goldenrod" : "red";

  const lnaWarningText =
    lnaState === "denied"
      ? "Local network access is blocked for this site. Autotracking can't reach a device on your computer until you allow local network access in your browser's site settings."
      : "Your browser may ask for permission to access your local network when autotracking connects. Allow it so the tracker can reach SNI/QUsb2snes.";

  return (
    <div className="relative group flex items-center gap-1">
      {showLnaWarning ? <TriangleAlert color={lnaState === "denied" ? "red" : "goldenrod"} size={size} /> : <MemoryStick color={color} size={size} />}
      <div className="invisible group-hover:visible absolute top-full left-0 mt-1 px-2 py-1 bg-black text-white text-xs w-max max-w-64 whitespace-pre-wrap rounded pointer-events-none border border-gray-600 z-50">
        {lnaState === "denied" ? "" : `${statusText}${showLnaWarning ? "\n\n" : ""}`}
        {showLnaWarning && `⚠ ${lnaWarningText}`}
      </div>
    </div>
  );
}

export default AutotrackingIcon;
