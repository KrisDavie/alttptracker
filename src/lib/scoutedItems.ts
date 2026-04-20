import ItemsData from "@/data/itemData";
import type { ScoutedItem } from "@/store/scoutsSlice";

/**
 * Resolve the display icon URL for a scouted item.
 * For items, uses the first image in the item's images list.
 * For small/big keys, uses the generic dungeon key icons.
 */
export function getScoutedItemIcon(scout: ScoutedItem): string {
  if (scout.kind === "smallkey") return "/dungeons/smallkey.png";
  if (scout.kind === "bigkey") return "/dungeons/bigkey.png";

  const key = scout.id.startsWith("bottle") ? "bottle" : scout.id;
  const data = ItemsData[key as keyof typeof ItemsData];
  if (!data) return "";
  return data.images[0] ?? "";
}

/** Human-readable label for a scouted item (used in tooltips). */
export function getScoutedItemLabel(scout: ScoutedItem): string {
  if (scout.kind === "smallkey") return `Small Key (${scout.id.toUpperCase()})`;
  if (scout.kind === "bigkey") return `Big Key (${scout.id.toUpperCase()})`;
  const key = scout.id.startsWith("bottle") ? "Bottle" : scout.id;
  const data = ItemsData[key as keyof typeof ItemsData];
  return data?.name ?? scout.id;
}

export function scoutedItemsEqual(a: ScoutedItem, b: ScoutedItem): boolean {
  return a.kind === b.kind && a.id === b.id;
}
