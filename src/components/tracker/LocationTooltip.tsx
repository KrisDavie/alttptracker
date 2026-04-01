import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { LogicStatus } from "@/data/logic/logicTypes";
import type { CheckStatus } from "@/store/checksSlice";
import { tooltipStatusText } from "@/hooks/useStatusColors";

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
  onCheckClick?: (key: string, checked: boolean) => void;
  onGroupExpand?: (key: string) => void;
  onClose?: () => void;
  /** When true, use JS-based repositioning to keep tooltip within the tracker container */
  autoPosition?: boolean;
  preventExpansion?: boolean;
  size?: "sm" | "md";
}

export function LocationTooltip({ name, xPercent, yPercent, items, singleCheck, onCheckClick, onGroupExpand, onClose, autoPosition = false, preventExpansion = false, size = "sm" }: LocationTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const itemTextClass = size === "md" ? "text-2xs" : "text-4xs";
  const statusWidth = size === "md" ? "w-14" : "w-8";

  // JS-based repositioning for autoPosition tooltips (chest counters).
  // Keeps the tooltip within the scaled tracker container's screen-space bounds.
  // The tracker uses CSS transform:scale(), so we compare offsetWidth vs
  // getBoundingClientRect to derive the effective scale for coordinate conversion.
  const reposition = useCallback(() => {
    const el = tooltipRef.current;
    if (!el) return;

    // Reset inline overrides so CSS classes set the initial position
    el.style.translate = '';
    el.style.removeProperty('top');
    el.style.removeProperty('bottom');
    el.style.removeProperty('padding-top');
    el.style.removeProperty('padding-bottom');

    const localWidth = el.offsetWidth;
    const screenRect = el.getBoundingClientRect();
    const scale = localWidth > 0 ? screenRect.width / localWidth : 1;

    // Find the tracker container's screen-space bounds
    const boundsEl = el.closest('[data-tracker-bounds]');
    const bounds = boundsEl
      ? boundsEl.getBoundingClientRect()
      : { left: 0, right: document.documentElement.clientWidth, top: 0, bottom: window.innerHeight };

    // Horizontal correction (screen-space → local-space)
    let dxScreen = 0;
    if (screenRect.right > bounds.right - 4) {
      dxScreen = (bounds.right - 4) - screenRect.right;
    }
    if (screenRect.left + dxScreen < bounds.left + 4) {
      dxScreen = (bounds.left + 4) - screenRect.left;
    }
    if (dxScreen !== 0) {
      const dxLocal = dxScreen / scale;
      el.style.translate = `calc(-50% + ${dxLocal}px) 0`;
    }

    // Vertical: flip above/below if needed
    if (screenRect.top < bounds.top) {
      el.style.bottom = 'auto';
      el.style.top = '100%';
      el.style.paddingTop = '0.25rem';
      el.style.paddingBottom = '0';
    } else if (screenRect.bottom > bounds.bottom) {
      el.style.top = 'auto';
      el.style.bottom = '100%';
      el.style.paddingBottom = '0.25rem';
      el.style.paddingTop = '0';
    }
  }, []);

  useEffect(() => {
    if (!autoPosition) return;
    const el = tooltipRef.current;
    if (!el) return;

    let rafId = requestAnimationFrame(reposition);
    const scheduleReposition = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(reposition);
    };

    window.addEventListener('resize', scheduleReposition);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(scheduleReposition);
      ro.observe(el);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', scheduleReposition);
      ro?.disconnect();
    };
  }, [autoPosition, reposition]);

  // Map tooltips: CSS-only positioning based on xPercent/yPercent
  const tooltipXClasses = name === "Ganon's Tower" ? "left-3/9 -translate-x-5/9" : xPercent < 25 ? "left-0 translate-x-0" : xPercent > 75 ? "right-0 translate-x-0" : "left-1/2 -translate-x-1/2";

  const tooltipClasses = autoPosition
    ? cn("invisible group-hover:visible absolute z-50 w-max select-none", "top-full pt-1", "left-1/2 -translate-x-1/2")
    : cn("invisible group-hover:visible absolute z-50 w-max select-none", yPercent < 25 ? "top-full pt-1" : "bottom-full pb-1", tooltipXClasses);

  const tooltipInnerClasses = cn(
    "px-2 py-1 bg-black text-white rounded border border-gray-600 shadow-xl",
    size === "md" ? "text-xs" : "text-2xs",
  );

  return (
    <div ref={tooltipRef} className={tooltipClasses} onMouseLeave={onClose}>
      <div className={tooltipInnerClasses}>
        {singleCheck ? (
          <div className="font-bold flex gap-2 whitespace-nowrap items-baseline">
            <span>{name}</span>
            <span className={cn("w-12 text-right", tooltipStatusText(singleCheck.status.checked ? "checked" : singleCheck.status.logic))}>
              {singleCheck.status.checked ? "checked" : singleCheck.status.logic}
            </span>
          </div>
        ) : (
          <>
            <div className="font-bold border-b border-gray-500 mb-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
              {name}
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
                      >
                        {item.info.status.checked ? "checked" : item.info.status.logic}
                      </span>
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
                      <span className={cn(statusWidth, "shrink-0 text-right", tooltipStatusText(item.status === "checked" ? "checked" : item.status))}>
                        {item.status}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
