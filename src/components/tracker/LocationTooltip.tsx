import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { LogicStatus } from "@/data/logic/logicTypes";
import type { CheckStatus } from "@/store/checksSlice";
import type { ScoutedItem } from "@/store/scoutsSlice";
import { getScoutedItemIcon, getScoutedItemLabel } from "@/lib/scoutedItems";
import { tooltipStatusText } from "@/hooks/useStatusColors";
import { getSequenceBreakLabel } from "@/data/sequenceBreakLabels";

export type TooltipCheckInfo = { displayName: string; status: CheckStatus };
export type TooltipDisplayItem = { key: string; info: TooltipCheckInfo };
export type TooltipDisplayGroup = {
  type: "group";
  key: string;
  items: TooltipDisplayItem[];
  status: LogicStatus | "checked";
  category: "Pots" | "Enemies";
};

export type TooltipListItem = { type: "item"; key: string; info: TooltipCheckInfo } | TooltipDisplayGroup;

interface LocationTooltipProps {
  name: string;
  xPercent: number;
  yPercent: number;
  items?: TooltipListItem[];
  singleCheck?: TooltipCheckInfo & { key: string };
  scoutedItems?: ScoutedItem[];
  note?: string;
  onCheckClick?: (key: string, checked: boolean) => void;
  onGroupExpand?: (key: string) => void;
  onClose?: () => void;
  /** When true, use JS-based repositioning to keep tooltip within the tracker container */
  autoPosition?: boolean;
  preventExpansion?: boolean;
  size?: "sm" | "md";
}

export function LocationTooltip({ name, xPercent, yPercent, items, singleCheck, scoutedItems, onCheckClick, onGroupExpand, onClose, note, autoPosition = false, preventExpansion = false, size = "sm" }: LocationTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const itemTextClass = size === "md" ? "text-2xs" : "text-4xs";
  const statusWidth = size === "md" ? "w-14" : "w-8";

  // The base horizontal translate applied by the CSS classes below. Repositioning
  // composes corrections on top of this so it works regardless of the anchor.
  const baseTranslateX = autoPosition ? "-50%" : name === "Ganons Tower" ? "-55.5556%" : xPercent < 25 ? "0px" : xPercent > 75 ? "0px" : "-50%";

  // JS-based repositioning to keep a tooltip within the scaled tracker container's
  // screen-space bounds. The tracker uses CSS transform:scale(), so we compare
  // offsetWidth vs getBoundingClientRect to derive the effective scale for
  // screen→local coordinate conversion. Used by both chest-counter tooltips
  // (autoPosition) and map tooltips.
  const reposition = useCallback(() => {
    const el = tooltipRef.current;
    if (!el) return;

    // Reset inline overrides so the CSS classes define the starting position
    el.style.translate = "";
    el.style.removeProperty("top");
    el.style.removeProperty("bottom");
    el.style.removeProperty("padding-top");
    el.style.removeProperty("padding-bottom");
    el.style.removeProperty("max-width");

    // Find the tracker container's screen-space bounds
    const boundsEl = el.closest("[data-tracker-bounds]");
    const bounds = boundsEl ? boundsEl.getBoundingClientRect() : { left: 0, right: document.documentElement.clientWidth, top: 0, bottom: window.innerHeight };

    const localWidth = el.offsetWidth;
    let rect = el.getBoundingClientRect();
    const scale = localWidth > 0 ? rect.width / localWidth : 1;

    // Shrink to fit when the tooltip is wider than the available bounds
    const maxScreenWidth = bounds.right - bounds.left - 8;
    if (rect.width > maxScreenWidth && scale > 0) {
      el.style.maxWidth = `${maxScreenWidth / scale}px`;
      rect = el.getBoundingClientRect();
    }

    // Vertical: flip above/below if the current side overflows
    if (rect.top < bounds.top) {
      el.style.bottom = "auto";
      el.style.top = "100%";
      el.style.paddingTop = "0.25rem";
      el.style.paddingBottom = "0";
    } else if (rect.bottom > bounds.bottom) {
      el.style.top = "auto";
      el.style.bottom = "100%";
      el.style.paddingBottom = "0.25rem";
      el.style.paddingTop = "0";
    }
    rect = el.getBoundingClientRect();

    // Horizontal clamp (screen-space delta needed to fit inside bounds)
    let dxScreen = 0;
    if (rect.right > bounds.right - 4) dxScreen = bounds.right - 4 - rect.right;
    if (rect.left + dxScreen < bounds.left + 4) dxScreen = bounds.left + 4 - rect.left;

    // Vertical clamp (in case a flipped tooltip still overflows)
    let dyScreen = 0;
    if (rect.bottom > bounds.bottom - 4) dyScreen = bounds.bottom - 4 - rect.bottom;
    if (rect.top + dyScreen < bounds.top + 4) dyScreen = bounds.top + 4 - rect.top;

    if ((dxScreen !== 0 || dyScreen !== 0) && scale > 0) {
      const dxLocal = dxScreen / scale;
      const dyLocal = dyScreen / scale;
      el.style.translate = `calc(${baseTranslateX} + ${dxLocal}px) ${dyLocal}px`;
    }
  }, [baseTranslateX]);

  useEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;

    let rafId = 0;
    const scheduleReposition = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(reposition);
    };

    window.addEventListener("resize", scheduleReposition);

    let ro: ResizeObserver | undefined;
    const parent = el.parentElement;
    if (autoPosition) {
      // Chest-counter tooltips: reposition on mount and whenever their size changes.
      scheduleReposition();
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(scheduleReposition);
        ro.observe(el);
      }
    } else {
      // Map tooltips: reposition lazily when the marker is hovered (avoids a
      // layout pass for every marker on mount).
      parent?.addEventListener("mouseenter", scheduleReposition);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleReposition);
      ro?.disconnect();
      parent?.removeEventListener("mouseenter", scheduleReposition);
    };
  }, [autoPosition, reposition]);

  // Map tooltips: CSS-only base positioning based on xPercent/yPercent
  const tooltipXClasses = name === "Ganons Tower" ? "left-3/9 -translate-x-5/9" : xPercent < 25 ? "left-0 translate-x-0" : xPercent > 75 ? "right-0 translate-x-0" : "left-1/2 -translate-x-1/2";

  const tooltipClasses = autoPosition
    ? cn("invisible group-hover:visible absolute z-50 w-max select-none", "top-full pt-1", "left-1/2 -translate-x-1/2")
    : cn("invisible group-hover:visible absolute z-50 w-max select-none", yPercent < 25 ? "top-full pt-1" : "bottom-full pb-1", tooltipXClasses);

  const tooltipInnerClasses = cn("px-2 py-1 bg-black text-white rounded border border-gray-600 shadow-xl", size === "md" ? "text-xs" : "text-2xs");

  return (
    <div ref={tooltipRef} className={tooltipClasses} onMouseLeave={onClose}>
      <div className={tooltipInnerClasses}>
        {singleCheck ? (
          (() => {
            const [firstLine, ...restLines] = name.split("\n");
            return (
              <div>
                <div className="font-bold flex gap-2 items-baseline">
                  <span className="min-w-0 wrap-break-word">{firstLine}</span>
                  <span
                    className={cn("w-12 shrink-0 text-right", tooltipStatusText(singleCheck.status.checked ? "checked" : singleCheck.status.logic))}
                    title={singleCheck.status.logic === "ool" && singleCheck.status.oolReasons?.length ? `Requires: ${singleCheck.status.oolReasons.map(getSequenceBreakLabel).join(", ")}` : undefined}
                  >{singleCheck.status.checked ? "checked" : singleCheck.status.logic}{singleCheck.status.logic === "ool" && singleCheck.status.oolReasons?.length ? " ?" : ""}</span>
                </div>
                {restLines.length > 0 && (
                  <div className={cn("font-normal opacity-70 whitespace-pre-wrap wrap-break-word", size === "md" ? "text-2xs" : "text-4xs")}>{restLines.join("\n")}</div>
                )}
                {note && <div className={cn("mt-1 italic opacity-90", size === "md" ? "text-2xs" : "text-4xs")}>NOTE: {note}</div>}
              </div>
            );
          })()
        ) : (
          <>
            <div className="border-b border-gray-500 mb-1 whitespace-pre-wrap wrap-break-word" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const [firstLine, ...restLines] = name.split("\n");
                return (
                  <>
                    <div className="font-bold wrap-break-word">{firstLine}</div>
                    {restLines.length > 0 && (
                      <div className={cn("font-normal opacity-70", size === "md" ? "text-2xs" : "text-4xs")}>{restLines.join("\n")}</div>
                    )}
                  </>
                );
              })()}
              {note && <div className={cn("mt-1 italic opacity-90", size === "md" ? "text-2xs" : "text-4xs")}>NOTE: {note}</div>}
            </div>

            {items && (
              <div className={items.length > 6 ? "grid grid-cols-2 grid-flow-col gap-x-2" : ""} style={items.length > 6 ? { gridTemplateRows: `repeat(${Math.ceil(items.length / 2)}, auto)` } : undefined}>
                {items.map((item) =>
                  item.type === "item" ? (
                    <div
                      key={item.key}
                      className={cn("flex justify-between gap-1 whitespace-nowrap hover:bg-gray-800 cursor-pointer rounded items-baseline", itemTextClass)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCheckClick?.(item.key, !item.info.status.checked);
                      }}
                    >
                      <span className="flex-1 min-w-0 truncate">{item.info.displayName}</span>
                      <span
                        className={cn(statusWidth, "shrink-0 text-right", tooltipStatusText(item.info.status.checked ? "checked" : item.info.status.logic))}
                        title={item.info.status.logic === "ool" && item.info.status.oolReasons?.length ? `Requires: ${item.info.status.oolReasons.map(getSequenceBreakLabel).join(", ")}` : undefined}
                      >{item.info.status.checked ? "checked" : item.info.status.logic}{item.info.status.logic === "ool" && item.info.status.oolReasons?.length ? " ?" : ""}</span>
                    </div>
                  ) : (
                    <div
                      key={item.key}
                      className={cn("flex justify-between gap-1 whitespace-nowrap hover:bg-gray-800 cursor-pointer rounded items-baseline italic opacity-90", itemTextClass)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!preventExpansion) {
                          onGroupExpand?.(item.key);
                        }
                      }}
                    >
                      <span className={`flex-1 min-w-0 truncate underline ${preventExpansion ? "" : "decoration-dotted"}`}>
                        {item.items.length} {item.category}
                      </span>
                      <span className={cn(statusWidth, "shrink-0 text-right", tooltipStatusText(item.status === "checked" ? "checked" : item.status))}>{item.status}</span>
                    </div>
                  ),
                )}
              </div>
            )}
          </>
        )}
        {scoutedItems && scoutedItems.length > 0 && (
          <div className={cn("flex flex-wrap gap-1 items-center", singleCheck || items ? "mt-1 pt-1 border-t border-gray-600" : "")}>
            <span className={cn("text-gray-300", size === "md" ? "text-2xs" : "text-4xs")}>Scouted:</span>
            {scoutedItems.map((scout, idx) => {
              const icon = getScoutedItemIcon(scout);
              return icon ? (
                <div
                  key={`${scout.kind}:${scout.id}:${idx}`}
                  title={getScoutedItemLabel(scout)}
                  className="w-4 h-4 shrink-0"
                  style={{
                    backgroundImage: `url(${icon})`,
                    backgroundPosition: "center",
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "pixelated",
                  }}
                />
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
