import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import DungeonsData from "@/data/dungeonData";
import { getActiveLocations } from "@/lib/logic/locationMapper";

export interface DungeonChestRemaining {
  /** Collectable checks remaining (max - checked - manually collected), clamped at 0. */
  remaining: number;
  /** Total collectable checks after excluding non-shuffled dungeon items. */
  maxCount: number;
  /** Manually collected count from dungeon state. */
  collected: number;
  /** Number of checked locations before dungeon-item adjustments. */
  numChecksFromLocations: number;
}

/**
 * Computes how many collectable checks remain for a dungeon's chest counter,
 * accounting for settings that exclude non-shuffled dungeon items from the pool.
 *
 * Shared by ChestCounter (the visible counter) and MapLocation (to grey out
 * dungeon markers once nothing collectable is left, even if logic still marks
 * locations as available because un-shuffled dungeon items live there).
 */
export function useDungeonChestRemaining(dungeon: string): DungeonChestRemaining {
  const settings = useSelector((state: RootState) => state.settings);
  const checks = useSelector((state: RootState) => state.checks);
  const dungeonState = useSelector((state: RootState) => state.dungeons[dungeon]);
  const collected = useSelector((state: RootState) => state.dungeons[dungeon]?.collectedCount ?? 0);

  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];
  if (!dungeonData || !dungeonState) return { remaining: 0, maxCount: 0, collected, numChecksFromLocations: 0 };

  const dungeonChecks = getActiveLocations(dungeonData.name, settings);
  if (dungeonData.additionalEntries) {
    for (const entry of dungeonData.additionalEntries) {
      dungeonChecks.push(...getActiveLocations(entry, settings));
    }
  }

  let maxCount = dungeonChecks.length;
  let numChecks = dungeonChecks.map((loc) => checks.locationsChecks[loc])?.filter((check) => check?.checked).length || 0;
  const numChecksFromLocations = numChecks;

  const wildBigKeys = settings.wildBigKeys;
  const wildSmallKeys = settings.wildSmallKeys;
  const wildCompasses = settings.wildCompasses;
  const wildMaps = settings.wildMaps;
  const wildPrizes = settings.prizeShuffle;
  const totLocs = dungeonData?.totalLocations;

  const totSKeys = dungeonChecks.filter((loc) => loc.includes("Key Drop") || loc.includes("Pot Key")).length + (totLocs?.smallkeys || 0);
  const totPrizes = dungeonChecks.filter((loc) => loc.includes("Prize")).length;

  if (!settings.includeDungeonItemsInCounter) {
    maxCount -= (wildBigKeys ? 0 : totLocs?.bigkey ? 1 : 0) + (wildSmallKeys === "wild" ? 0 : totSKeys) + (wildCompasses ? 0 : totLocs?.compass ? 1 : 0) + (wildMaps ? 0 : totLocs?.map ? 1 : 0) + (wildPrizes === "wild" ? 0 : totPrizes);

    numChecks -= dungeonState.smallKeys && wildSmallKeys !== "wild" ? dungeonState.smallKeys : 0;
    // HC BK is a special case as it's dropped, so we need to see if enemy drops are enabled to know whether to subtract it or not
    numChecks -= dungeonState.bigKey && !wildBigKeys && (dungeon != "hc" || settings.enemyDrop != "none") ? 1 : 0;
    numChecks -= dungeonState.compass && !wildCompasses ? 1 : 0;
    numChecks -= dungeonState.map && !wildMaps ? 1 : 0;
    numChecks = Math.max(0, numChecks);
  }

  return {
    remaining: Math.max(0, maxCount - numChecks - collected),
    maxCount,
    collected,
    numChecksFromLocations,
  };
}
