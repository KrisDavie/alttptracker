import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import { MemoryStick } from "lucide-react"

interface AutotrackingIconProps {
  size?: number;
}

function AutotrackingIcon({ size = 16 }: AutotrackingIconProps) {
  const { isConnected, status, selectedDevice } = useSelector((state: RootState) => state.autotracker);

  const statusText = status === "connected" && selectedDevice 
    ? `Connected: ${selectedDevice}` 
    : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="relative group flex items-center">
      <MemoryStick color={isConnected ? "green" : "red"} size={size} />
      <div className="invisible group-hover:visible absolute left-full top-1/5 -translate-y-1/5 ml-2 px-2 py-1 bg-black text-white text-xs whitespace-nowrap rounded pointer-events-none border border-gray-600 z-50">
        {statusText}
      </div>
    </div>
  )
}

export default AutotrackingIcon