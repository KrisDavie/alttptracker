import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { entranceConnectorGroups } from "../../data/entranceConnections";
import { locationsData, entranceLocations } from "../../data/locationsData";

export default function EntranceLinesOverlay() {
  const mapMode = useSelector((state: RootState) => state.settings.mapMode);
  const worldState = useSelector((state: RootState) => state.settings.worldState);
  const connectionLinesMode = useSelector((state: RootState) => state.settings.connectionLinesMode);
  const connectionLineColor = useSelector((state: RootState) => state.settings.connectionLineColor);
  const entrances = useSelector((state: RootState) => state.entrances);

  if (mapMode === "off" || connectionLinesMode === "none") return null;

  const groupedLinks = new Map<string, string[]>(); // groupId -> array of overworld location names

  // Reverse mapping from vanilla entrance name to its group id
  const vanillaToGroup = new Map<string, string>();
  for (const [groupId, group] of Object.entries(entranceConnectorGroups)) {
    for (const vanillaName of group.entrances) {
      vanillaToGroup.set(vanillaName, groupId);
    }
  }

  for (const [owName, entranceData] of Object.entries(entrances)) {
    if (entranceData.to) {
      const groupId = vanillaToGroup.get(entranceData.to);
      if (groupId) {
        if (!groupedLinks.has(groupId)) {
          groupedLinks.set(groupId, []);
        }
        groupedLinks.get(groupId)!.push(owName);
      } else if (entranceData.to.startsWith("Generic Connector")) {
        const groupId = entranceData.to;
        if (groupId) {
          if (!groupedLinks.has(`${groupId}`)) {
            groupedLinks.set(`${groupId}`, []);
          }
          groupedLinks.get(`${groupId}`)!.push(owName);
        }
      }
    }
  }

  const isVertical = mapMode === "vertical";
  const w1 = ["inverted", "inverted_1", "standverted"].includes(worldState) ? "dw" : "lw";
  
  // Calculate absolute % coordinates based on layout
  const getCoords = (owName: string) => {
    const loc = entranceLocations[owName] || locationsData[owName];
    if (!loc) return null;

    let xPercent = (loc.x / 512) * 100;
    let yPercent = (loc.y / 512) * 100;

    const mapIndex = loc.world === w1 ? 0 : 1;

    if (isVertical) {
      // 2 maps stacked
      yPercent = (yPercent / 2) + (mapIndex * 50);
    } else {
      // compact and normal
      xPercent = (xPercent / 2) + (mapIndex * 50);
    }

    return { x: xPercent, y: yPercent };
  };

  const linesToDraw: { x1: number; y1: number; x2: number; y2: number; groupType: "cave" | "dungeon"; id: string }[] = [];

  for (const [groupId, owNames] of groupedLinks.entries()) {
    let group = entranceConnectorGroups[groupId];
    if (!group && groupId.startsWith("Generic Connector")) {
      group = {
        type: "cave",
        entrances: owNames
      }
    }
    if (connectionLinesMode === "caves" && group.type === "dungeon") continue;
    if (connectionLinesMode === "dungeons" && group.type === "cave") continue;
    
    if (owNames.length >= 2) {
      const coords = owNames.map(name => getCoords(name)).filter(c => c !== null) as { x: number; y: number }[];
      
      // Draw fully connected graph
      for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          linesToDraw.push({
            x1: coords[i].x,
            y1: coords[i].y,
            x2: coords[j].x,
            y2: coords[j].y,
            groupType: group.type ?? "cave",
            id: `${groupId}-${i}-${j}`,
          });
        }
      }
    }
  }

  if (linesToDraw.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
      {linesToDraw.map(line => (
        <line
          key={line.id}
          x1={`${line.x1}%`}
          y1={`${line.y1}%`}
          x2={`${line.x2}%`}
          y2={`${line.y2}%`}
          stroke={connectionLineColor}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}