import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setModalClose, setSelectedEntrance } from "@/store/trackerSlice";
import { entranceLocations, locationsData } from "@/data/locationsData";
import { getActiveLocations, getDungeonIdForEntry, isSecondaryEntrance } from "@/lib/logic/locationMapper";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface ItemEntranceRow {
  source: string;
  to: string;
  linkedChildren: string[];
  total: number;
  checked: number;
  cleared: boolean;
}

function ItemEntranceListModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.trackerState.modalOpen) === "itemEntrances";
  const entrances = useSelector((state: RootState) => state.entrances);
  const settings = useSelector((state: RootState) => state.settings);
  const locationsChecks = useSelector((state: RootState) => state.checks.locationsChecks);
  const mapMode = useSelector((state: RootState) => state.settings.mapMode);

  const rows = useMemo(() => {
    const result: ItemEntranceRow[] = [];

    const reverseEntranceMap: Record<string, string> = {};
    for (const [source, data] of Object.entries(entrances)) {
      if (data.to) {
        reverseEntranceMap[data.to] = source;
      }
    }

    const entranceKeys = Object.keys(entranceLocations);
    const secondaryKeys = entranceKeys.filter((key) => isSecondaryEntrance(key));
    const parentKeys = Object.keys(locationsData).filter((key) => {
      const data = locationsData[key];
      return Boolean(data?.entranceRegions?.length) && !isSecondaryEntrance(key);
    });

    const getEntranceRegions = (key: string): Set<string> => new Set(locationsData[key]?.entranceRegions || []);

    // Group secondary entrances (e.g. Top/Bottom/Middle) under their canonical
    // parent entry so only the parent carries item counts.
    const childrenByParent = new Map<string, string[]>();
    for (const child of secondaryKeys) {
      const childRegions = getEntranceRegions(child);
      if (childRegions.size === 0) continue;

      const candidates = parentKeys
        .filter((parent) => parent !== child)
        .filter((parent) => {
          const parentRegions = getEntranceRegions(parent);
          if (parentRegions.size < childRegions.size || parentRegions.size === 0) return false;
          for (const region of childRegions) {
            if (!parentRegions.has(region)) return false;
          }
          return true;
        })
        .sort((a, b) => {
          const aSize = getEntranceRegions(a).size;
          const bSize = getEntranceRegions(b).size;
          if (aSize !== bSize) return aSize - bSize;
          return a.localeCompare(b);
        });

      const parent = candidates[0];
      if (!parent) continue;

      const current = childrenByParent.get(parent) || [];
      current.push(child);
      childrenByParent.set(parent, current);
    }

    for (const entrance of parentKeys) {

      // TODO: Fix properly. This accidentally includes Pyramid ledge.
      if (entrance === "Pyramid") continue;
      // Exclude dungeons — they are tracked separately.
      if (getDungeonIdForEntry(entrance)) continue;

      const locs = getActiveLocations(entrance, settings);
      if (locs.length === 0) continue;

      const total = locs.length;
      const checked = locs.filter((l) => locationsChecks[l]?.checked).length;

      const linkedChildren = (childrenByParent.get(entrance) || [])
        .filter((child) => Boolean(reverseEntranceMap[child]))
        .sort((a, b) => a.localeCompare(b))
        .map((child) => `${child} -> ${reverseEntranceMap[child]}`);

      result.push({
        source: entrance,
        to: reverseEntranceMap[entrance] ?? "",
        linkedChildren,
        total,
        checked,
        cleared: checked >= total,
      });
    }

    // Uncleared entrances first (sorted by number of checks, most first); cleared sink to the bottom.
    result.sort((a, b) => {
      if (a.cleared !== b.cleared) return a.cleared ? 1 : -1;
      if (b.total !== a.total) return b.total - a.total;
      return a.source.localeCompare(b.source);
    });

    return result;
  }, [entrances, settings, locationsChecks]);

  if (mapMode === "off" || !isOpen) return null;

  const compact = mapMode === "compact";
  const remaining = rows.filter((r) => !r.cleared).length;

  return (
    <div
      className={`absolute inset-x-8 ${compact ? "inset-y-0.5" : "inset-y-6"} bg-gray-900/95 border-2 border-gray-600 rounded-lg flex flex-col text-white p-4 z-50 shadow-2xl overflow-hidden pointer-events-auto`}
    >
      <div className="text-center w-full mb-2 shrink-0">
        <p className={`${compact ? "text-2xs" : "text-sm"} font-semibold text-gray-300 uppercase tracking-wider`}>Entrances with Items</p>
        <p className="text-2xs text-gray-400">{remaining} remaining</p>
      </div>

      <div className={`grid ${["compact", "vertical", "popoutVertical"].includes(mapMode) ? "grid-cols-1" : "grid-cols-2"} gap-x-8 flex-1 min-h-0 overflow-y-auto pr-2 w-full max-w-4xl mx-auto content-start`}>
        {rows.map(({ source, to, linkedChildren, total, checked, cleared }) => (
          <div
            key={source}
            className={cn(
              "flex items-start gap-2 text-2xs leading-tight py-0.5 border-b border-gray-800",
              cleared && "opacity-40 line-through",
            )}
          >
            <span className="flex-1 min-w-0 text-gray-300 font-black" title={source}>
              <span className="block truncate">
                {source}{" "}
                <span className="text-white font-medium" title={source}>
                ({to === "" ? "unplaced" : to})
                </span>
              </span>
              {linkedChildren.length > 0 && (
                <span className="block text-gray-400 font-medium" title={linkedChildren.join("\n")}>
                  <span className="block">Linked:</span>
                  {linkedChildren.map((child) => (
                    <span key={child} className="block truncate">
                      {child}
                    </span>
                  ))}
                </span>
              )}
            </span>
            <span className={cn("shrink-0 tabular-nums w-10 text-right", cleared ? "text-gray-500" : "text-gray-300")}>
              {checked}/{total}
            </span>
          </div>
        ))}
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

export default ItemEntranceListModal;
