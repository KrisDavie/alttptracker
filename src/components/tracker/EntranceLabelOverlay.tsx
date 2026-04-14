import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { defaultEntranceLabels } from "@/data/entranceLabels";
import { placeLabels } from "@/lib/labelPlacement";
import type { Rect } from "@/lib/labelPlacement";
import { useMemo } from "react";

interface EntranceLabelOverlayProps {
  obstacles: Record<string, Rect>;
}

const MAP_SIZE = 512;

export default function EntranceLabelOverlay({ obstacles }: EntranceLabelOverlayProps) {
  const entrances = useSelector((state: RootState) => state.entrances);
  const entranceLabelOverrides = useSelector((state: RootState) => state.settings.entranceLabelOverrides);
  const mapMode = useSelector((state: RootState) => state.settings.mapMode);

  const mergedLabels = useMemo(
    () => ({ ...defaultEntranceLabels, ...entranceLabelOverrides }),
    [entranceLabelOverrides]
  );

  const obstaclesPct = useMemo(() => {
    const result: Record<string, Rect> = {};
    for (const [key, rect] of Object.entries(obstacles)) {
      const wPct = (rect.w / MAP_SIZE) * 100;
      const hPct = (rect.h / MAP_SIZE) * 100;
      result[key] = {
        x: (rect.x / MAP_SIZE) * 100 - wPct / 2,
        y: (rect.y / MAP_SIZE) * 100 - hPct / 2,
        w: wPct,
        h: hPct,
      };
    }
    return result;
  }, [obstacles]);

  const labelsToPlace = useMemo(() => {
    const result: Array<{
      id: string;
      text: string;
      color: string;
      markerX: number;
      markerY: number;
      markerW: number;
      markerH: number;
    }> = [];

    for (const entrance of Object.keys(entrances)) {
      const placed = entrances[entrance].to;
      if (!placed) continue;
      const labelInfo = mergedLabels[placed];
      const ob = obstaclesPct[entrance];
      if (labelInfo && ob) {
        result.push({
          id: entrance,
          text: labelInfo.label,
          color: labelInfo.color,
          markerX: ob.x,
          markerY: ob.y,
          markerW: ob.w,
          markerH: ob.h,
        });
      }
    }
    return result;
  }, [entrances, mergedLabels, obstaclesPct]);

  const placedLabels = useMemo(
    () => placeLabels(labelsToPlace, obstaclesPct, {
      charWidthPct: 0.5,
      lineHeightPct: 0.5,
      paddingPct: 1.5,
      gapPct: 0.8,
    }),
    [labelsToPlace, obstaclesPct]
  );

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-9">
      <svg className="absolute inset-0 w-full h-full">
        {placedLabels.map(label => (
          <line
            key={`leader-${label.id}`}
            x1={`${label.anchorX}%`}
            y1={`${label.anchorY}%`}
            x2={`${label.x + label.w / 2}%`}
            y2={`${label.y + label.h / 2}%`}
            stroke="white"
            opacity={0.9}
            strokeWidth="2"
          />
        ))}
      </svg>
      {placedLabels.map(label => (
        <div
          key={label.id}
          className="absolute text-center font-bold whitespace-nowrap font-roboto p-0.5"
          style={{
            left: `${label.x + label.w / 2}%`,
            top: `${label.y + label.h / 2}%`,
            transform: "translate(-50%, -50%)",
            color: label.color,
            fontSize: `${mapMode === "compact" ? 7 : 10}px`,
            lineHeight: 1,
            backgroundColor: "black",
            opacity: 0.9,
            borderColor: label.color,
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          {label.text.toLocaleUpperCase()}
        </div>
      ))}
    </div>
  );
}