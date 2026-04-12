// Percentage space
export type Rect = { x: number; y: number; w: number; h: number };
type LabelInput = { id: string; text: string; color: string; markerX: number; markerY: number; markerW: number; markerH: number };
type MarkerObstacle = Rect;
export type PlacedLabel = { id: string; text: string; color: string; w: number; h: number; x: number; y: number; anchorX: number; anchorY: number; needsLeader: boolean };
type PlacementConfig = { charWidthPct: number; lineHeightPct: number; paddingPct: number; gapPct: number };

const rectOverlap = (r1: Rect, r2: Rect): boolean => {
  return !(r1.x + r1.w <= r2.x || r1.x >= r2.x + r2.w || r1.y + r1.h <= r2.y || r1.y >= r2.y + r2.h);
};

const percentageOverlap = (r1: Rect, r2: Rect): number => {
  const xOverlap = Math.max(0, Math.min(r1.x + r1.w, r2.x + r2.w) - Math.max(r1.x, r2.x));
  const yOverlap = Math.max(0, Math.min(r1.y + r1.h, r2.y + r2.h) - Math.max(r1.y, r2.y));
  const overlapArea = xOverlap * yOverlap;
  const labelArea = r1.w * r1.h;
  return overlapArea / labelArea;
}

const directionPreference: Record<string, number> = {
  top: 0, left: 1, right: 1,
  topLeft: 2, topRight: 2,
  bottomLeft: 3, bottomRight: 3, bottom: 4,
};

export const placeLabels = (labels: LabelInput[], obstacles: MarkerObstacle[], config: PlacementConfig): PlacedLabel[] => {
  const placedLabels: PlacedLabel[] = [];
  for (const label of labels) {
    const labelWidth = label.text.length * config.charWidthPct + config.paddingPct * 2;
    const labelHeight = config.lineHeightPct + config.paddingPct * 2;

    const candidates: Record<string, Rect> = {
      top: {
        x: label.markerX + label.markerW / 2 - labelWidth / 2,
        y: label.markerY - config.gapPct - labelHeight,
        w: labelWidth,
        h: labelHeight,
      },
      bottom: {
        x: label.markerX + label.markerW / 2 - labelWidth / 2,
        y: label.markerY + label.markerH + config.gapPct,
        w: labelWidth,
        h: labelHeight,
      },
      left: {
        x: label.markerX - config.gapPct - labelWidth,
        y: label.markerY + label.markerH / 2 - labelHeight / 2,
        w: labelWidth,
        h: labelHeight,
      },
      right: {
        x: label.markerX + label.markerW + config.gapPct,
        y: label.markerY + label.markerH / 2 - labelHeight / 2,
        w: labelWidth,
        h: labelHeight,
      },
      topLeft: {
        x: label.markerX - config.gapPct - labelWidth,
        y: label.markerY - config.gapPct - labelHeight,
        w: labelWidth,
        h: labelHeight,
      },
      topRight: {
        x: label.markerX + label.markerW + config.gapPct,
        y: label.markerY - config.gapPct - labelHeight,
        w: labelWidth,
        h: labelHeight,
      },
      bottomLeft: {
        x: label.markerX - config.gapPct - labelWidth,
        y: label.markerY + label.markerH + config.gapPct,
        w: labelWidth,
        h: labelHeight,
      },
      bottomRight: {
        x: label.markerX + label.markerW + config.gapPct,
        y: label.markerY + label.markerH + config.gapPct,
        w: labelWidth,
        h: labelHeight,
      },
    };

    const candidateScores: Record<string, number> = {};

    for (const pos in candidates) {
      let overlaps = 0;
      for (const obstacle of obstacles) {
        if (rectOverlap(candidates[pos], obstacle)) {
          overlaps+= percentageOverlap(candidates[pos], obstacle);
        }
      }
      // Heavy penalty for out of bounds
      if (candidates[pos].x < 0 || candidates[pos].x + candidates[pos].w > 100 || candidates[pos].y < 0 || candidates[pos].y + candidates[pos].h > 100) {
        overlaps += 10;
      }
      // Tie-breaker based on preferred label positions
      candidateScores[pos] = overlaps * 100 + directionPreference[pos];
    }
    const bestPos = Object.keys(candidateScores).reduce((a, b) => candidateScores[a] <= candidateScores[b] ? a : b);
    
    // Add the placed label as an obstacle for future labels
    obstacles.push(candidates[bestPos]); 
    placedLabels.push({
      id: label.id,
      text: label.text,
      color: label.color,
      w: candidates[bestPos].w,
      h: candidates[bestPos].h,
      x: candidates[bestPos].x,
      y: candidates[bestPos].y,
      anchorX: label.markerX + label.markerW / 2,
      anchorY: label.markerY + label.markerH / 2,
      needsLeader: bestPos !== 'top'
    });
  }
  return placedLabels;
};
