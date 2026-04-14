// Percentage space
export type Rect = { x: number; y: number; w: number; h: number };
type LabelInput = { id: string; text: string; color: string; markerX: number; markerY: number; markerW: number; markerH: number };
type MarkerObstacle = Record<string, Rect>;
export type PlacedLabel = { id: string; text: string; color: string; w: number; h: number; x: number; y: number; anchorX: number; anchorY: number; needsLeader: boolean };
type PlacementConfig = { charWidthPct: number; lineHeightPct: number; paddingPct: number; gapPct: number };

const PLACED_LABEL_PREFIX = "__label__";

const rectOverlap = (r1: Rect, r2: Rect): boolean => {
  return !(r1.x + r1.w <= r2.x || r1.x >= r2.x + r2.w || r1.y + r1.h <= r2.y || r1.y >= r2.y + r2.h);
};

const percentageOverlap = (r1: Rect, r2: Rect): number => {
  const xOverlap = Math.max(0, Math.min(r1.x + r1.w, r2.x + r2.w) - Math.max(r1.x, r2.x));
  const yOverlap = Math.max(0, Math.min(r1.y + r1.h, r2.y + r2.h) - Math.max(r1.y, r2.y));
  const overlapArea = xOverlap * yOverlap;
  const labelArea = r1.w * r1.h;
  return overlapArea / labelArea;
};

/**
 * Generate candidate positions at multiple distances around the marker.
 * Returns [name, rect] pairs. Distance multiplier controls how far away
 * from the marker each ring of candidates sits.
 */
function generateCandidates(
  label: LabelInput,
  labelWidth: number,
  labelHeight: number,
  gap: number,
): [string, Rect][] {
  const cx = label.markerX + label.markerW / 2;
  const cy = label.markerY + label.markerH / 2;
  const candidates: [string, Rect][] = [];

  const distances = [1, 2, 3];

  for (const d of distances) {
    const g = gap * d;
    const suffix = d > 1 ? `_d${d}` : "";

    // Cardinal + diagonal offsets relative to marker center
    const positions: [string, number, number][] = [
      [`top${suffix}`,         cx - labelWidth / 2,                     label.markerY - g - labelHeight],
      [`bottom${suffix}`,      cx - labelWidth / 2,                     label.markerY + label.markerH + g],
      [`left${suffix}`,        label.markerX - g - labelWidth,          cy - labelHeight / 2],
      [`right${suffix}`,       label.markerX + label.markerW + g,       cy - labelHeight / 2],
      [`topLeft${suffix}`,     label.markerX - g - labelWidth,          label.markerY - g - labelHeight],
      [`topRight${suffix}`,    label.markerX + label.markerW + g,       label.markerY - g - labelHeight],
      [`bottomLeft${suffix}`,  label.markerX - g - labelWidth,          label.markerY + label.markerH + g],
      [`bottomRight${suffix}`, label.markerX + label.markerW + g,       label.markerY + label.markerH + g],
    ];

    for (const [name, x, y] of positions) {
      candidates.push([name, { x, y, w: labelWidth, h: labelHeight }]);
    }
  }

  return candidates;
}

/**
 * Score a candidate position. Lower is better.
 * - Label-on-label overlap is penalized 3x vs marker overlap
 * - Out-of-bounds gets a heavy penalty
 * - Distance from marker adds a small cost to prefer closer placements
 * - Direction preference breaks ties
 */
function scoreCandidate(
  name: string,
  rect: Rect,
  obstacles: MarkerObstacle,
  markerCx: number,
  markerCy: number,
): number {
  let overlap = 0;

  for (const obstacleKey in obstacles) {
    if (!rectOverlap(rect, obstacles[obstacleKey])) continue;
    const pct = percentageOverlap(rect, obstacles[obstacleKey]);
    // Penalize label-on-label overlap more heavily so labels avoid each other
    overlap += obstacleKey.startsWith(PLACED_LABEL_PREFIX) ? pct * 3 : pct;
  }

  // Heavy penalty for out of bounds
  if (rect.x < 0 || rect.x + rect.w > 100 || rect.y < 0 || rect.y + rect.h > 100) {
    overlap += 10;
  }

  // Distance cost: small penalty for being further from marker (normalized to gap units)
  const dx = (rect.x + rect.w / 2) - markerCx;
  const dy = (rect.y + rect.h / 2) - markerCy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Base direction name without distance suffix
  const baseName = name.replace(/_d\d+$/, "");
  const dirPref: Record<string, number> = {
    top: 0, left: 1, right: 1,
    topLeft: 2, topRight: 2,
    bottomLeft: 3, bottomRight: 3,
    bottom: 4,
  };

  // overlap dominates, then distance, then direction preference
  return overlap * 1000 + dist * 2 + (dirPref[baseName] ?? 4);
}

export const placeLabels = (labels: LabelInput[], obstacles: MarkerObstacle, config: PlacementConfig): PlacedLabel[] => {
  // Work on a copy so we don't mutate the caller's obstacle map
  const obs: MarkerObstacle = { ...obstacles };
  const placedLabels: PlacedLabel[] = [];

  // --- Pass 1: greedy placement ---
  for (const label of labels) {
    const labelWidth = label.text.length * config.charWidthPct + config.paddingPct * 2;
    const labelHeight = config.lineHeightPct + config.paddingPct * 2;
    const markerCx = label.markerX + label.markerW / 2;
    const markerCy = label.markerY + label.markerH / 2;

    const candidates = generateCandidates(label, labelWidth, labelHeight, config.gapPct);

    let bestName = candidates[0][0];
    let bestRect = candidates[0][1];
    let bestScore = Infinity;

    for (const [name, rect] of candidates) {
      const score = scoreCandidate(name, rect, obs, markerCx, markerCy);
      if (score < bestScore) {
        bestScore = score;
        bestName = name;
        bestRect = rect;
      }
    }

    const obstacleKey = PLACED_LABEL_PREFIX + label.id;
    obs[obstacleKey] = bestRect;
    placedLabels.push({
      id: label.id,
      text: label.text,
      color: label.color,
      w: bestRect.w,
      h: bestRect.h,
      x: bestRect.x,
      y: bestRect.y,
      anchorX: markerCx,
      anchorY: markerCy,
      needsLeader: !bestName.startsWith("top") || bestName.startsWith("topL") || bestName.startsWith("topR"),
    });
  }

  // --- Pass 2: nudge labels that still overlap other labels ---
  for (let i = 0; i < placedLabels.length; i++) {
    const pl = placedLabels[i];
    const label = labels[i];
    const labelWidth = pl.w;
    const labelHeight = pl.h;

    // Check if this label overlaps any other placed label
    const myKey = PLACED_LABEL_PREFIX + pl.id;
    let hasLabelOverlap = false;
    for (const key in obs) {
      if (key === myKey) continue;
      if (!key.startsWith(PLACED_LABEL_PREFIX)) continue;
      if (rectOverlap(obs[myKey], obs[key])) {
        hasLabelOverlap = true;
        break;
      }
    }
    if (!hasLabelOverlap) continue;

    // Remove this label from obstacles, re-score, and replace
    const savedRect = obs[myKey];
    delete obs[myKey];

    const candidates = generateCandidates(label, labelWidth, labelHeight, config.gapPct);
    const markerCx = label.markerX + label.markerW / 2;
    const markerCy = label.markerY + label.markerH / 2;

    let bestName = "";
    let bestRect = savedRect;
    let bestScore = scoreCandidate("current", savedRect, obs, markerCx, markerCy);

    for (const [name, rect] of candidates) {
      const score = scoreCandidate(name, rect, obs, markerCx, markerCy);
      if (score < bestScore) {
        bestScore = score;
        bestName = name;
        bestRect = rect;
      }
    }

    obs[myKey] = bestRect;
    pl.x = bestRect.x;
    pl.y = bestRect.y;
    pl.needsLeader = !bestName.startsWith("top") || bestName.startsWith("topL") || bestName.startsWith("topR");
  }

  return placedLabels;
};
