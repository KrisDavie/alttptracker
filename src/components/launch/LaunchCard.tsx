import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Trash2, Rocket, ChevronRight, Pin, PinOff } from "lucide-react";
import { getPresetById } from "@/data/launcherPresets";
import { MAX_SESSIONS, DISPLAY_SESSIONS, type TrackerSession } from "@/lib/sessionManager";
import { prettifySpriteName, formatRelativeTime } from "@/lib/launchHelpers";

interface LaunchCardProps {
  sessionName: string;
  setSessionName: (name: string) => void;
  spriteName: string;
  selectedPresetId: string | null;
  sessions: TrackerSession[];
  sessionsLoaded: boolean;
  canCreateSession: boolean;
  onLaunch: (sessionId?: string) => void;
  onDeleteSession: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function LaunchCard({
  sessionName, setSessionName, spriteName, selectedPresetId,
  sessions, sessionsLoaded, canCreateSession,
  onLaunch, onDeleteSession, onTogglePin,
}: LaunchCardProps) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="py-1 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full">
            <Input
              placeholder="Session name (optional)"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="h-10 text-sm flex-1 max-w-md"
            />
            <div className="flex items-center gap-3">
              {/* Sprite preview */}
              <div className="flex items-center gap-2">
                <img
                  src={`/sprites/${spriteName}_tunic1.png`}
                  alt={spriteName}
                  className="w-8 h-8"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-xs text-muted-foreground">{prettifySpriteName(spriteName)}</span>
              </div>
              {selectedPresetId && (() => {
                const p = getPresetById(selectedPresetId);
                return p ? <Badge variant="secondary" className="text-xs">{p.name}</Badge> : null;
              })()}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {sessions.length}/{MAX_SESSIONS} saved sessions
            </Badge>
            <Button
              size="lg"
              className="cursor-pointer text-base px-8 font-semibold"
              disabled={!canCreateSession}
              onClick={() => onLaunch()}
            >
              <Rocket className="size-5 mr-2" />
              Launch Tracker
            </Button>
          </div>
        </div>

        {/* Saved sessions */}
        {sessionsLoaded && sessions.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-1.5">Saved Sessions</h3>
              <div className={sessions.length > DISPLAY_SESSIONS ? "max-h-22 overflow-y-auto" : undefined}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center rounded-sm border px-2 py-1.5 group hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {session.spriteName && (
                          <img
                            src={`/sprites/${session.spriteName}_tunic1.png`}
                            alt={session.spriteName}
                            className="w-5 h-5 shrink-0"
                            style={{ imageRendering: "pixelated" }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-medium truncate leading-tight">
                            {session.pinned && <Pin className="size-2.5 inline mr-0.5 text-primary" />}
                            {session.name}
                          </div>
                          <div className="text-[9px] text-muted-foreground leading-tight">
                            {session.presetId && (() => {
                              const p = getPresetById(session.presetId);
                              return p ? <span>{p.name} &middot; </span> : null;
                            })()}
                            {formatRelativeTime(session.lastAccessedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center shrink-0 ml-1">
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer size-5"
                              onClick={() => onLaunch(session.id)}
                            >
                              <ChevronRight className="size-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Resume session</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer size-5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onTogglePin(session.id)}
                            >
                              {session.pinned ? <PinOff className="size-3" /> : <Pin className="size-3" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{session.pinned ? "Unpin session" : "Pin session"}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="cursor-pointer size-5 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onDeleteSession(session.id)}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete session</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
