import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setDungeonCollectedCount } from "../../store/dungeonsSlice";
import DungeonsData from "@/data/dungeonData";
import { mapStatusBg } from "@/hooks/useStatusColors";
import { getActiveLocations } from "@/lib/logic/locationMapper";
import { useLocationTooltipData } from "@/hooks/useLocationTooltipData";
import { useDungeonChestRemaining } from "@/hooks/useDungeonChestRemaining";
import { LocationTooltip } from "./LocationTooltip";
import type { LogicStatus } from "@/data/logic/logicTypes";

export function squareSlicePath(startAngle: number, endAngle: number): string {
  const cx = 50, cy = 50, half = 50;
  function perimeterPoint(angle: number): [number, number] {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const absCos = Math.abs(cos), absSin = Math.abs(sin);
    const t = absCos < 1e-10 ? half / absSin : absSin < 1e-10 ? half / absCos : Math.min(half / absCos, half / absSin);
    return [cx + cos * t, cy + sin * t];
  }
  // Corner angles (clockwise from top, range -π/2 … 3π/2)
  const corners = [
    { angle: -Math.PI / 4, x: 100, y: 0 },
    { angle:  Math.PI / 4, x: 100, y: 100 },
    { angle: 3 * Math.PI / 4, x: 0, y: 100 },
    { angle: 5 * Math.PI / 4, x: 0, y: 0 },
  ];
  const [x1, y1] = perimeterPoint(startAngle);
  const [x2, y2] = perimeterPoint(endAngle);
  const mid = corners.filter(c => c.angle > startAngle && c.angle < endAngle);
  const pts: [number, number][] = [[x1, y1], ...mid.map(c => [c.x, c.y] as [number, number]), [x2, y2]];
  return `M${cx},${cy} ${pts.map(([x, y]) => `L${x},${y}`).join(" ")} Z`;
}

interface ChestCounterProps {
  dungeon: string;
  small?: boolean;
}

function ChestCounter({ dungeon, small = false }: ChestCounterProps) {
  const dispatch = useDispatch();
  const showChestTooltips = useSelector((state: RootState) => state.settings.showChestTooltips ?? true);
  const colouredChests = useSelector((state: RootState) => state.settings.colouredChests ?? true);
  const proportionalChestColors = useSelector((state: RootState) => state.settings.proportionalChestColors ?? false);
  const settings = useSelector((state: RootState) => state.settings);
  const checks = useSelector((state: RootState) => state.checks);

  const dungeonData = DungeonsData[dungeon as keyof typeof DungeonsData];

  const { itemLocations, itemChecks, displayList, status, maxLogicStatus, handleCheckClick, handleGroupExpand, resetGroups } = useLocationTooltipData(dungeonData.name, dungeonData.additionalEntries);

  const { remaining: rawChecksRemaining, maxCount, collected, numChecksFromLocations } = useDungeonChestRemaining(dungeon);

  // Per-status breakdown of unchecked active locations, used for the proportional colour slices
  const STATUS_ORDER = ["available", "possible", "ool", "information", "unavailable"] as const;
  let statusCounts: { status: (typeof STATUS_ORDER)[number]; count: number }[] = [];
  if (proportionalChestColors) {
    const dungeonChecks = getActiveLocations(dungeonData.name, settings);
    if (dungeonData.additionalEntries) {
      for (const entry of dungeonData.additionalEntries) {
        dungeonChecks.push(...getActiveLocations(entry, settings));
      }
    }
    statusCounts = STATUS_ORDER.map((status) => ({
      status,
      count: dungeonChecks.filter((loc) => !checks.locationsChecks[loc]?.checked && checks.locationsChecks[loc]?.logic === status).length,
    })).filter(({ count }) => count > 0);
  }

  const total = statusCounts.reduce((sum, { count }) => sum + count, 0);
  const slices: { status: typeof STATUS_ORDER[number]; startAngle: number; endAngle: number }[] = [];
  let sliceAngle = -Math.PI / 2;
  for (const { status, count } of statusCounts) {
    const startAngle = sliceAngle;
    sliceAngle += (count / total) * 2 * Math.PI;
    slices.push({ status, startAngle, endAngle: sliceAngle });
  }

  // Some game locations record the picked-up item in SRAM immediately but only mark the
  // location as cleared after the player transitions rooms. When such a location holds a
  // dungeon item (e.g. big key), `dungeonState.bigKey` flips on while the location's
  // checked flag stays false, transiently subtracting 1 from `numChecks` without a
  // matching increase, which would spuriously bump the chest counter by 1 until the
  // room transition occurs.
  //
  // Suppress that spurious increase: only let the displayed count grow for legitimate
  // reasons (manual `collected` decrease, settings change affecting maxCount, or a
  // location being un-checked). Uses the React "adjust state during render" pattern —
  // a conditional setState during render, which is idempotent and Compiler-safe.
  const [displayed, setDisplayed] = useState(rawChecksRemaining);
  const [lastDeps, setLastDeps] = useState({ collected, maxCount, numChecksFromLocations });

  if (collected !== lastDeps.collected || maxCount !== lastDeps.maxCount || numChecksFromLocations !== lastDeps.numChecksFromLocations) {
    // A tracked dependency changed: a dungeon-item-only change (the spurious spike)
    // leaves these untouched, so the displayed value stays frozen in that case.
    const allowIncrease = collected < lastDeps.collected || maxCount !== lastDeps.maxCount || numChecksFromLocations < lastDeps.numChecksFromLocations;
    setLastDeps({ collected, maxCount, numChecksFromLocations });
    setDisplayed(!allowIncrease && rawChecksRemaining > displayed ? displayed : rawChecksRemaining);
  }

  const checksRemaining = displayed;

  function setCount(newCount: number) {
    let finalCount = newCount;
    if (newCount < 0) {
      finalCount = maxCount;
    } else if (newCount > maxCount) {
      finalCount = 0;
    }
    dispatch(setDungeonCollectedCount({ dungeon, count: finalCount }));
  }

  let finalMaxLogicStatus: LogicStatus | "someAvailable"

  const itemChecksStatusSet = new Set(
    itemLocations
      .filter((loc) => !itemChecks?.[loc]?.status.checked)
      .map((loc) => itemChecks?.[loc]?.status.logic)
      .filter((status): status is LogicStatus => !!status)
  );

  if ( itemChecksStatusSet.size != 1 && itemChecksStatusSet.has("available")) {
    finalMaxLogicStatus = "someAvailable";
  } else {
    finalMaxLogicStatus = maxLogicStatus;
  }


  const bgClass = status === "none" && maxLogicStatus === "unavailable" ? mapStatusBg("none") : status === "all" ? mapStatusBg("checked") : mapStatusBg(finalMaxLogicStatus);

  return (
    <>
      <div
        className="group relative"
        style={{
          backgroundImage: `url(/dungeons/${checksRemaining === 0 ? "chest0" : "smallchest"}.png)`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setCount(collected + 1)}
        onContextMenu={(e) => {
          e.preventDefault();
          setCount(collected - 1);
        }}
      >
        {proportionalChestColors && maxLogicStatus !== "unavailable" ? (
          <div className={`relative h-7/10 w-7/10 flex items-center justify-center ${checksRemaining === 0 ? "invisible" : ""}`}>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              {colouredChests && slices.length > 0 ? (
                slices.length === 1 ? (
                  <rect x="0" y="0" width="100" height="100" style={{ fill: `var(--status-${slices[0].status})` }} fillOpacity={0.8} />
                ) : (
                  slices.map(({ status, startAngle, endAngle }) => (
                    <path key={status} d={squareSlicePath(startAngle, endAngle)} style={{ fill: `var(--status-${status})` }} fillOpacity={0.8} />
                  ))
                )
              ) : (
                <rect x="0" y="0" width="100" height="100" fill="white" fillOpacity={0.6} />
              )}
              <rect x="1" y="1" width="98" height="98" fill="none" stroke="black" strokeWidth={small ? 2 : 3} />
            </svg>
            <div
              className={`relative text-black ${small ? "text-xs" : checksRemaining > 99 ? "text-xl" : "text-3xl"} select-none font-roboto font-black leading-none z-10`}
              style={{ textShadow: "0 0 3px white, 0 0 3px white" }}
              onClick={(e) => {
                e.stopPropagation();
                setCount(collected + 1);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCount(collected - 1);
              }}
            >
              {checksRemaining}
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center h-7/10 w-7/10 ${colouredChests ? bgClass : "bg-white"} bg-opacity-50 ${small ? "border" : "border-2"} border-black ${checksRemaining === 0 ? "invisible" : ""}`}>
            <div
              className={`text-black ${small ? (checksRemaining > 99 ? "text-xs" : "") : checksRemaining > 99 ? "text-2xl" : "text-4xl"} select-none font-roboto font-black`}
              onClick={(e) => {
                e.stopPropagation();
                setCount(collected + 1);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCount(collected - 1);
              }}
            >
              {checksRemaining}
            </div>
          </div>
        )}
        {showChestTooltips && (
          <LocationTooltip
            name={dungeonData.name}
            xPercent={50}
            yPercent={0}
            items={itemLocations.length > 1 ? displayList : undefined}
            singleCheck={itemLocations.length === 1 ? { ...itemChecks[itemLocations[0]], key: itemLocations[0] } : undefined}
            onCheckClick={handleCheckClick}
            onGroupExpand={handleGroupExpand}
            onClose={resetGroups}
            autoPosition
            preventExpansion
            size="md"
          />
        )}
      </div>
    </>
  );
}

export default ChestCounter;
