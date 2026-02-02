export interface EntranceInfo {
  x: number;
  y: number;
  world: 'lw' | 'dw';
  modes: { [key: string]: string };
}

export const entranceData: { [key: string]: EntranceInfo } = {
  "Ice Cave Water Drop": {
    "x": 0.0,
    "y": 0.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "error",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Shopping Mall Water Drop": {
    "x": 0.0,
    "y": 0.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "error",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Lost Woods Gamble": {
    "x": 94.5,
    "y": 8.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Lost Woods Hideout Drop": {
    "x": 96.5,
    "y": 67.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "drops",
      "lean": "drops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Lost Woods Hideout Stump": {
    "x": 93.5,
    "y": 77.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Lumberjack Tree Tree": {
    "x": 153.5,
    "y": 38.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "drops",
      "lean": "drops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Lumberjack Tree Cave": {
    "x": 169.5,
    "y": 16.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Lumberjack House": {
    "x": 171.5,
    "y": 31.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Old Man Cave (East)": {
    "x": 207.5,
    "y": 96.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Old Man Cave (West)": {
    "x": 181.5,
    "y": 90.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Old Man House (Bottom)": {
    "x": 229.5,
    "y": 120.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Old Man House (Top)": {
    "x": 273.5,
    "y": 82.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Death Mountain Return Cave (West)": {
    "x": 183.5,
    "y": 78.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Death Mountain Return Cave (East)": {
    "x": 201.5,
    "y": 70.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Spectacle Rock Cave": {
    "x": 249.5,
    "y": 74.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Spectacle Rock Cave (Bottom)": {
    "x": 233.5,
    "y": 70.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Spectacle Rock Cave Peak": {
    "x": 249.5,
    "y": 52.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Spiral Cave": {
    "x": 407.5,
    "y": 46.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Spiral Cave (Bottom)": {
    "x": 410.0,
    "y": 66.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Mimic Cave": {
    "x": 431.5,
    "y": 46.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Fairy Ascension Cave (Bottom)": {
    "x": 419.5,
    "y": 70.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Fairy Ascension Cave (Top)": {
    "x": 419.5,
    "y": 58.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hookshot Fairy": {
    "x": 431.5,
    "y": 74.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Paradox Cave (Bottom)": {
    "x": 441.5,
    "y": 110.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Paradox Cave (Middle)": {
    "x": 438.0,
    "y": 74.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Paradox Cave (Top)": {
    "x": 439.5,
    "y": 32.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "light_death_mountain",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Waterfall of Wishing": {
    "x": 460.5,
    "y": 69.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Fortune Teller (Light)": {
    "x": 95.5,
    "y": 166.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Bonk Rock Cave": {
    "x": 199.5,
    "y": 150.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Sanctuary Grave": {
    "x": 265.5,
    "y": 150.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "drops",
      "lean": "drops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Graveyard Cave": {
    "x": 292.0,
    "y": 141.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Kings Grave": {
    "x": 307.5,
    "y": 151.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "North Fairy Cave Drop": {
    "x": 328.5,
    "y": 159.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "drops",
      "lean": "drops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "North Fairy Cave": {
    "x": 342.0,
    "y": 140.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Potion Shop": {
    "x": 409.5,
    "y": 172.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Kakariko Well Drop": {
    "x": 11.5,
    "y": 218.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "drops",
      "lean": "drops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Kakariko Well Cave": {
    "x": 24.0,
    "y": 218.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Blinds Hideout": {
    "x": 65.5,
    "y": 214.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Elder House (West)": {
    "x": 77.5,
    "y": 215.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Elder House (East)": {
    "x": 86.0,
    "y": 215.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Snitch Lady (East)": {
    "x": 105.5,
    "y": 247.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Snitch Lady (West)": {
    "x": 25.5,
    "y": 239.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Chicken House": {
    "x": 49.5,
    "y": 277.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Sick Kids House": {
    "x": 79.5,
    "y": 275.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Bush Covered House": {
    "x": 103.5,
    "y": 273.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Light World Bomb Hut": {
    "x": 13.5,
    "y": 305.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Kakariko Shop": {
    "x": 56.0,
    "y": 299.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Tavern North": {
    "x": 81.5,
    "y": 289.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Tavern (Front)": {
    "x": 81.5,
    "y": 305.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hyrule Castle Secret Entrance Stairs": {
    "x": 281.5,
    "y": 220.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hyrule Castle Secret Entrance Drop": {
    "x": 304.5,
    "y": 213.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "drops",
      "lean": "drops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Sahasrahlas Hut": {
    "x": 414.5,
    "y": 232.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Blacksmiths Hut": {
    "x": 155.5,
    "y": 273.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Bat Cave Drop": {
    "x": 165.5,
    "y": 288.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "drops",
      "lean": "drops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Bat Cave Cave": {
    "x": 161.5,
    "y": 284.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Two Brothers House (West)": {
    "x": 55.5,
    "y": 368.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "kakariko",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Two Brothers House (East)": {
    "x": 71.5,
    "y": 368.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "kakariko",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Library": {
    "x": 79.5,
    "y": 338.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "kakariko",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Kakariko Gamble Game": {
    "x": 109.5,
    "y": 359.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "kakariko",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Bonk Fairy (Light)": {
    "x": 241.5,
    "y": 334.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Links House": {
    "x": 279.5,
    "y": 353.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Lake Hylia Fairy": {
    "x": 421.5,
    "y": 330.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Long Fairy Cave": {
    "x": 501.5,
    "y": 358.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Checkerboard Cave": {
    "x": 89.5,
    "y": 398.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Aginahs Cave": {
    "x": 101.5,
    "y": 422.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Cave 45": {
    "x": 136.0,
    "y": 423.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Light Hype Fairy": {
    "x": 305.5,
    "y": 399.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Lake Hylia Fortune Teller": {
    "x": 332.0,
    "y": 411.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Lake Hylia Shop": {
    "x": 371.5,
    "y": 393.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Capacity Upgrade": {
    "x": 405.5,
    "y": 436.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Mini Moldorm Cave": {
    "x": 333.5,
    "y": 481.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Ice Rod Cave": {
    "x": 457.5,
    "y": 395.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Good Bee Cave": {
    "x": 467.5,
    "y": 395.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "20 Rupee Cave": {
    "x": 462.0,
    "y": 402.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Desert Fairy": {
    "x": 141.5,
    "y": 456.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "50 Rupee Cave": {
    "x": 159.5,
    "y": 490.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dam": {
    "x": 240.0,
    "y": 480.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Lumberjack Shop": {
    "x": 171.5,
    "y": 29.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Death Mountain Fairy": {
    "x": 207.5,
    "y": 96.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Spike Cave": {
    "x": 293.5,
    "y": 74.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hookshot Cave": {
    "x": 425.5,
    "y": 34.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hookshot Cave Back Entrance": {
    "x": 409.5,
    "y": 8.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Superbunny Cave (Top)": {
    "x": 440.0,
    "y": 32.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Superbunny Cave (Bottom)": {
    "x": 431.5,
    "y": 74.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Death Mountain Shop": {
    "x": 438.0,
    "y": 74.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Bumper Cave (Bottom)": {
    "x": 181.5,
    "y": 90.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Bumper Cave (Top)": {
    "x": 183.5,
    "y": 79.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "two_way_entrances",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Fortune Teller (Dark)": {
    "x": 96.0,
    "y": 166.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Sanctuary Hint": {
    "x": 235.5,
    "y": 141.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Potion Shop": {
    "x": 411.5,
    "y": 173.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Chest Game": {
    "x": 25.5,
    "y": 239.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "C-Shaped House": {
    "x": 106.0,
    "y": 247.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Brewery": {
    "x": 55.5,
    "y": 299.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark World Shop": {
    "x": 103.5,
    "y": 273.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Red Shield Shop": {
    "x": 169.5,
    "y": 236.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Pyramid Fairy": {
    "x": 239.5,
    "y": 249.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Pyramid Hole": {
    "x": 254.5,
    "y": 209.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "drops",
      "lean": "drops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Pyramid Entrance": {
    "x": 221.5,
    "y": 249.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Palace of Darkness Hint": {
    "x": 434.5,
    "y": 257.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hammer Peg Cave": {
    "x": 161.5,
    "y": 310.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Archery Game": {
    "x": 109.5,
    "y": 359.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "kakariko",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Bonk Fairy (Dark)": {
    "x": 241.5,
    "y": 334.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Big Bomb Shop": {
    "x": 279.5,
    "y": 353.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Lake Hylia Fairy": {
    "x": 422.0,
    "y": 331.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "East Dark World Hint": {
    "x": 502.0,
    "y": 359.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Mire Shed": {
    "x": 19.5,
    "y": 411.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Mire Fairy": {
    "x": 55.5,
    "y": 411.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Mire Hint": {
    "x": 101.5,
    "y": 423.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hype Cave": {
    "x": 305.5,
    "y": 399.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "item_caves",
      "lean": "item_caves",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Lake Hylia Shop": {
    "x": 331.5,
    "y": 411.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Lake Hylia Ledge Fairy": {
    "x": 458.0,
    "y": 395.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Lake Hylia Ledge Hint": {
    "x": 467.5,
    "y": 395.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Lake Hylia Ledge Spike Cave": {
    "x": 461.5,
    "y": 402.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "vanilla",
      "lean": "vanilla",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Sanctuary": {
    "x": 235.5,
    "y": 136.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hyrule Castle Entrance (West)": {
    "x": 229.5,
    "y": 198.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hyrule Castle Entrance (South)": {
    "x": 255.5,
    "y": 224.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Hyrule Castle Entrance (East)": {
    "x": 282.0,
    "y": 199.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Eastern Palace": {
    "x": 491.0,
    "y": 200.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "single_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "single_entrance_dungeon",
      "restricted": "single_entrance_dungeon",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Desert Palace Entrance (West)": {
    "x": 17.5,
    "y": 407.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Desert Palace Entrance (South)": {
    "x": 37.5,
    "y": 407.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Desert Palace Entrance (East)": {
    "x": 57.5,
    "y": 407.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Desert Palace Entrance (North)": {
    "x": 37.5,
    "y": 393.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Tower of Hera": {
    "x": 286.5,
    "y": 17.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "single_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "single_entrance_dungeon",
      "restricted": "single_entrance_dungeon",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Agahnims Tower": {
    "x": 255.5,
    "y": 205.0,
    "world": "lw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "lw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Palace of Darkness": {
    "x": 491.0,
    "y": 202.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "single_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "single_entrance_dungeon",
      "restricted": "single_entrance_dungeon",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Swamp Palace": {
    "x": 240.0,
    "y": 480.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "single_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "single_entrance_dungeon",
      "restricted": "single_entrance_dungeon",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Skull Woods First Section Door": {
    "x": 93.5,
    "y": 76.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "skull_doors",
      "dungeonsfull": "skull_doors",
      "lite": "skull_doors",
      "lean": "skull_doors",
      "simple": "skull_doors",
      "restricted": "skull_doors",
      "full": "skull_doors",
      "district": "northwest_hyrule",
      "swapped": "skull_doors",
      "crossed": "skull_doors",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Skull Woods Second Section Door (East)": {
    "x": 74.0,
    "y": 75.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "skull_doors",
      "dungeonsfull": "skull_doors",
      "lite": "skull_doors",
      "lean": "skull_doors",
      "simple": "skull_doors",
      "restricted": "skull_doors",
      "full": "skull_doors",
      "district": "northwest_hyrule",
      "swapped": "skull_doors",
      "crossed": "skull_doors",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Skull Woods Second Section Door (West)": {
    "x": 29.5,
    "y": 67.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "skull_doors",
      "dungeonsfull": "skull_doors",
      "lite": "skull_doors",
      "lean": "skull_doors",
      "simple": "skull_doors",
      "restricted": "skull_doors",
      "full": "skull_doors",
      "district": "northwest_hyrule",
      "swapped": "skull_doors",
      "crossed": "skull_doors",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Skull Woods Final Section": {
    "x": 19.5,
    "y": 26.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "single_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "single_entrance_dungeon",
      "restricted": "single_entrance_dungeon",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Thieves Town": {
    "x": 63.5,
    "y": 248.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "single_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "single_entrance_dungeon",
      "restricted": "single_entrance_dungeon",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Ice Palace": {
    "x": 407.5,
    "y": 442.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "single_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "dw_dungeons",
      "lean": "shuffle",
      "simple": "single_entrance_dungeon",
      "restricted": "single_entrance_dungeon",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Misery Mire": {
    "x": 37.5,
    "y": 412.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "single_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "dw_dungeons",
      "lean": "shuffle",
      "simple": "single_entrance_dungeon",
      "restricted": "single_entrance_dungeon",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Turtle Rock": {
    "x": 481.5,
    "y": 41.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "dw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Death Mountain Ledge (West)": {
    "x": 408.0,
    "y": 47.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "dw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Dark Death Mountain Ledge (East)": {
    "x": 432.0,
    "y": 47.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "dw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Turtle Rock Isolated Ledge Entrance": {
    "x": 419.5,
    "y": 59.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "multi_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "dw_dungeons",
      "lean": "shuffle",
      "simple": "multi_entrance_dungeon",
      "restricted": "multi_entrance_dungeon",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Ganons Tower": {
    "x": 287.5,
    "y": 10.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "single_entrance_dungeon",
      "dungeonsfull": "dungeon",
      "lite": "dw_dungeons",
      "lean": "shuffle",
      "simple": "single_entrance_dungeon",
      "restricted": "single_entrance_dungeon",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Skull Woods First Section Hole (North)": {
    "x": 96.5,
    "y": 66.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "skull_drops",
      "dungeonsfull": "skull_drops",
      "lite": "skull_drops",
      "lean": "skull_drops",
      "simple": "skull_drops",
      "restricted": "skull_drops",
      "full": "skull_drops",
      "district": "northwest_hyrule",
      "swapped": "skull_drops",
      "crossed": "skull_drops",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Skull Woods First Section Hole (East)": {
    "x": 100.0,
    "y": 86.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "skull_drops",
      "dungeonsfull": "skull_drops",
      "lite": "skull_drops",
      "lean": "skull_drops",
      "simple": "skull_drops",
      "restricted": "skull_drops",
      "full": "skull_drops",
      "district": "northwest_hyrule",
      "swapped": "skull_drops",
      "crossed": "skull_drops",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Skull Woods First Section Hole (West)": {
    "x": 79.5,
    "y": 90.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "skull_drops",
      "dungeonsfull": "skull_drops",
      "lite": "skull_drops",
      "lean": "skull_drops",
      "simple": "skull_drops",
      "restricted": "skull_drops",
      "full": "skull_drops",
      "district": "northwest_hyrule",
      "swapped": "skull_drops",
      "crossed": "skull_drops",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Skull Woods Second Section Hole": {
    "x": 61.5,
    "y": 46.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "skull_drops",
      "dungeonsfull": "skull_drops",
      "lite": "skull_drops",
      "lean": "skull_drops",
      "simple": "skull_drops",
      "restricted": "skull_drops",
      "full": "skull_drops",
      "district": "northwest_hyrule",
      "swapped": "skull_drops",
      "crossed": "skull_drops",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Inverted Pyramid Hole": {
    "x": 260.0,
    "y": 208.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  },
  "Inverted Pyramid Entrance": {
    "x": 216.0,
    "y": 186.0,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "shuffle",
      "lean": "shuffle",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle",
      "vanilla": "vanilla"
    }
  }
};
