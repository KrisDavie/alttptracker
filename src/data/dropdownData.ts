export interface DropdownLink {
  entrances: string[];
  zelgaWoods?: boolean;
}

// DROPDOWN MUST BE FIRST IN THE LIST
export const dropdownLinks: { [linkId: string]: DropdownLink  } = {
  "lost_woods_hideout": {
    entrances: ["Lost Woods Hideout Drop", "Lost Woods Hideout Stump"],
  },
  "lumberjack_tree": {
    entrances: ["Lumberjack Tree Tree", "Lumberjack Tree Cave"],
  },
  "kakariko_well": {
    entrances: ["Kakariko Well Drop", "Kakariko Well Cave"],
  },
  "bat_cave": {
    entrances: ["Bat Cave Drop", "Bat Cave Cave"],
  },
  "hc_secret_entrance": {
    entrances: ["Hyrule Castle Secret Entrance Drop", "Hyrule Castle Secret Entrance Stairs"],
  },
  "north_fariy": {
    entrances: ["North Fairy Cave Drop", "North Fairy Cave"],
  },
  "sanc": {
    entrances: ["Sanctuary Grave", "Sanctuary"],
  },
  "ganon_drop": {
    entrances: ["Pyramid Hole", "Pyramid Entrance"],
  },
  "zelga_woods_east": {
    entrances: ["Skull Woods Second Section Hole", "Skull Woods Second Section Door (East)"],
    zelgaWoods: true,
  },
  "zelga_woods_west": {
    entrances: ["Skull Woods First Section Hole (North)", "Skull Woods First Section Door"],
    zelgaWoods: true,
  },
}