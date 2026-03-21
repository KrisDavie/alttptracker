import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ItemsData from "@/data/itemData";
import { STARTING_ITEMS } from "@/lib/launchHelpers";

interface StartingItemsTabProps {
  startingItems: Record<string, number>;
  setStartingItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  toggleStartingItem: (item: string) => void;
}

export function StartingItemsTab({ startingItems, setStartingItems, toggleStartingItem }: StartingItemsTabProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Starting Items</CardTitle>
        <CardDescription>Click items to toggle them as starting inventory. Right-click to remove.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-1">
          {STARTING_ITEMS.map((item) => {
            const data = ItemsData[item as keyof typeof ItemsData];
            if (!data) return null;
            const count = startingItems[item] ?? 0;
            const imgIndex = Math.max(0, count - 1);
            const img = data.images[imgIndex] ?? data.images[0];
            return (
              <Tooltip key={item}>
                <TooltipTrigger>
                  <button
                    className={`relative aspect-square rounded-sm border-2 transition-all cursor-pointer ${count > 0 ? "border-primary bg-primary/10" : "border-transparent bg-muted hover:bg-muted/80"}`}
                    onClick={() => toggleStartingItem(item)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (count > 0) {
                        setStartingItems((prev) => {
                          const next = { ...prev };
                          if (count <= 1) delete next[item];
                          else next[item] = count - 1;
                          return next;
                        });
                      }
                    }}
                  >
                    <img
                      src={img}
                      alt={data.name}
                      className="w-full h-full object-contain"
                      style={{ imageRendering: "pixelated", opacity: count > 0 ? 1 : 0.35 }}
                    />
                    {count > 1 && (
                      <span className="absolute bottom-0 right-0.5 text-[10px] font-bold text-primary">{count}</span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{data.name}{count > 0 ? ` (${count})` : ""}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
