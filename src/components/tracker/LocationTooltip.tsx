import { cn } from "@/lib/utils";
import type { LogicStatus } from "@/data/logic/logicTypes";
import type { CheckStatus } from "@/store/checksSlice";

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
}

export function LocationTooltip({ name, xPercent, yPercent, items, singleCheck, onCheckClick, onGroupExpand }: LocationTooltipProps) {
  const tooltipXClasses = name === "Ganon's Tower" ? "left-3/9 -translate-x-5/9" : xPercent < 25 ? "left-0 translate-x-0" : xPercent > 75 ? "right-0 translate-x-0" : "left-1/2 -translate-x-1/2";

  const tooltipClasses = cn("invisible group-hover:visible absolute z-50 w-max select-none", yPercent < 25 ? "top-full pt-1" : "bottom-full pb-1", tooltipXClasses);

  const tooltipInnerClasses = "px-2 py-1 bg-black text-white text-2xs rounded border border-gray-600 shadow-xl";

  return (
    <div className={tooltipClasses}>
      <div className={tooltipInnerClasses}>
        {singleCheck ? (
          <div className="font-bold flex gap-2 whitespace-nowrap items-baseline">
            <span>{name}</span>
            <span className={cn("w-12 text-right", singleCheck.status.checked ? "text-gray-500" : singleCheck.status.logic === "available" ? "text-green-400" : "text-red-400")}>
              {singleCheck.status.checked ? "checked" : singleCheck.status.logic}
            </span>
          </div>
        ) : (
          <>
            <div className="font-bold border-b border-gray-500 mb-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
              {name}
            </div>
            {items && (
              <div className={items.length > 6 ? "grid grid-cols-2 gap-x-2" : ""}>
                {items.map((item) =>
                  item.type === "item" ? (
                    <div
                      key={item.key}
                      className="flex justify-between gap-1 text-4xs whitespace-nowrap hover:bg-gray-800 cursor-pointer rounded items-baseline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCheckClick?.(item.key, !item.info.status.checked);
                      }}
                    >
                      <span className="flex-1">{item.info.displayName}</span>
                      <span
                        className={cn("w-8 text-right", item.info.status.checked ? "text-gray-500" : item.info.status.logic === "available" ? "text-green-400" : item.info.status.logic === "possible" ? "text-yellow-400" : "text-red-400")}
                      >
                        {item.info.status.checked ? "checked" : item.info.status.logic}
                      </span>
                    </div>
                  ) : (
                    <div
                      key={item.key}
                      className="flex justify-between gap-1 text-4xs whitespace-nowrap hover:bg-gray-800 cursor-pointer rounded items-baseline italic opacity-90"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGroupExpand?.(item.key);
                      }}
                    >
                      <span className="flex-1 underline decoration-dotted">
                        {item.items.length} {item.category}
                      </span>
                      <span className={cn("w-8 text-right", item.status === "checked" ? "text-gray-500" : item.status === "available" ? "text-green-400" : item.status === "possible" ? "text-yellow-400" : "text-red-400")}>
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
