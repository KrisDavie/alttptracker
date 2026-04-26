export interface EntranceConnectorGroup {
  type: 'cave' | 'dungeon';
  entrances: string[];
}

export const entranceConnectorGroups: { [groupId: string]: EntranceConnectorGroup  } = {
  "lost_woods_hideout": {
    type: "cave",
    entrances: ["Lost Woods Hideout Drop", "Lost Woods Hideout Stump"],
  },
  "lumberjack_tree": {
    type: "cave",
    entrances: ["Lumberjack Tree Tree", "Lumberjack Tree Cave"],
  },
  "kakariko_well": {
    type: "cave",
    entrances: ["Kakariko Well Drop", "Kakariko Well Cave"],
  },
  "bat_cave": {
    type: "cave",
    entrances: ["Bat Cave Drop", "Bat Cave Cave"],
  },
  "spectacle_rock_cave": {
    type: "cave",
    entrances: ["Spectacle Rock Cave (Bottom)", "Spectacle Rock Cave Peak", "Spectacle Rock Cave"],
  },
  "spiral_cave": {
    type: "cave",
    entrances: ["Spiral Cave", "Spiral Cave (Bottom)"],
  },
  "fairy_ascension_cave": {
    type: "cave",
    entrances: ["Fairy Ascension Cave (Bottom)", "Fairy Ascension Cave (Top)"],
  },
  "paradox_cave": {
    type: "cave",
    entrances: ["Paradox Cave (Bottom)", "Paradox Cave (Middle)", "Paradox Cave (Top)"],
  },
  "death_mountain_return_cave": {
    type: "cave",
    entrances: ["Death Mountain Return Cave (West)", "Death Mountain Return Cave (East)"],
  },
  "elder_house": {
    type: "cave",
    entrances: ["Elder House (West)", "Elder House (East)"],
  },
  "brothers_connector": {
    type: "cave",
    entrances: ["Two Brothers House (West)", "Two Brothers House (East)"],
  },
  "hookshot_cave": {
    type: "cave",
    entrances: ["Hookshot Cave", "Hookshot Cave Back Entrance"],
  },
  "superbunny_cave": {
    type: "cave",
    entrances: ["Superbunny Cave (Top)", "Superbunny Cave (Bottom)"],
  },
  "bumper_cave": {
    type: "cave",
    entrances: ["Bumper Cave (Bottom)", "Bumper Cave (Top)"],
  },
  "skull_woods": {
    type: "dungeon",
    entrances: [
      "Skull Woods First Section Door",
      "Skull Woods Second Section Door (East)",
      "Skull Woods Second Section Door (West)",
      "Skull Woods First Section Hole (North)",
      "Skull Woods First Section Hole (East)",
      "Skull Woods First Section Hole (West)",
      "Skull Woods Second Section Hole",
    ],
  },
  "turtle_rock": {
    type: "dungeon",
    entrances: [
      "Turtle Rock",
      "Dark Death Mountain Ledge (West)",
      "Dark Death Mountain Ledge (East)",
      "Turtle Rock Isolated Ledge Entrance",
    ],
  },
  "desert_palace": {
    type: "dungeon",
    entrances: [
      "Desert Palace Entrance (West)",
      "Desert Palace Entrance (South)",
      "Desert Palace Entrance (East)",
    ],
  },
  "hyrule_castle": {
    type: "dungeon",
    entrances: [
      "Hyrule Castle Entrance (South)",
      "Hyrule Castle Entrance (West)",
      "Hyrule Castle Entrance (East)",
    ],
  },
};
