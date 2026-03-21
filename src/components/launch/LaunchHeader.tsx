import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sun, Moon, Monitor, Coffee, MessageCircle, Wifi, WifiOff } from "lucide-react";
import type { Theme } from "@/components/ThemeContext";

interface LaunchHeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  autotrackStatus: "checking" | "connected" | "disconnected";
  autotrackProtocol: "sni" | "qusb2snes";
  autotrackHost: string;
  autotrackPort: number;
}

export function LaunchHeader({ theme, setTheme, autotrackStatus, autotrackProtocol, autotrackHost, autotrackPort }: LaunchHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Muffins Tracker 2.0</h1>
          <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">ALttP Randomizer</Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Autotracking status */}
          <Tooltip>
            <TooltipTrigger render={<div className="flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs" />}>
                {autotrackStatus === "connected" ? (
                  <Wifi className="size-4 text-green-500" />
                ) : autotrackStatus === "checking" ? (
                  <Wifi className="size-4 text-yellow-500 animate-pulse" />
                ) : (
                  <WifiOff className="size-4 text-muted-foreground" />
                )}
                <span className="hidden md:inline text-muted-foreground">
                  {autotrackStatus === "connected" ? "Autotracker" : autotrackStatus === "checking" ? "Checking..." : "No autotracker connected"}
                </span>
            </TooltipTrigger>
            <TooltipContent>
              {autotrackStatus === "connected"
                ? `Connected to ${autotrackProtocol === "sni" ? "SNI" : "QUsb2snes"} at ${autotrackHost}:${autotrackPort}`
                : autotrackStatus === "checking"
                  ? "Checking autotracker connection..."
                  : `No autotracker found at ${autotrackHost}:${autotrackPort}`}
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Social links */}
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://discord.gg/VpqbrHjPCu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-medium bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors dark:bg-[#5865F2]/20 dark:hover:bg-[#5865F2]/30"
                />
              }
            >
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">Discord</span>
            </TooltipTrigger>
            <TooltipContent>Join the Discord community</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://ko-fi.com/Q5Q1VMWWD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-xs font-medium bg-[#FF5E5B]/10 text-[#FF5E5B] hover:bg-[#FF5E5B]/20 transition-colors dark:bg-[#FF5E5B]/20 dark:hover:bg-[#FF5E5B]/30"
                />
              }
            >
              <Coffee className="size-4" />
              <span className="hidden sm:inline">Ko-fi</span>
            </TooltipTrigger>
            <TooltipContent>Support on Ko-fi</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          {/* Theme toggle */}
          <div className="flex items-center bg-muted rounded-sm p-0.5">
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-sm transition-colors ${theme === "light" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
              aria-label="Light mode"
            >
              <Sun className="size-3.5" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`p-1.5 rounded-sm transition-colors ${theme === "system" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
              aria-label="System theme"
            >
              <Monitor className="size-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-sm transition-colors ${theme === "dark" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
              aria-label="Dark mode"
            >
              <Moon className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
