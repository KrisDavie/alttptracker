export interface EntranceInfo {
  x: number;
  y: number;
  world: 'lw' | 'dw';
  modes: { [key: string]: string };
}

// X and Y are based on a 512x512 map

export const entranceData: { [key: string]: EntranceInfo } = {
  "20 Rupee Cave": {
    "x": 462,
    "y": 406,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pottery",
      "lean": "fixed_pottery",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "50 Rupee Cave": {
    "x": 159.5,
    "y": 490.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pottery",
      "lean": "fixed_pottery",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },  
  "Agahnims Tower": {
    "x": 255.5,
    "y": 205,
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
      "insanity": "shuffle"
    }
  },
  "Aginahs Cave": {
    "x": 101.5,
    "y": 422,
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
      "insanity": "shuffle"
    }
  },
  "Archery Game": {
    "x": 109.5,
    "y": 359.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "kakariko",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Bat Cave Cave": {
    "x": 161.5,
    "y": 284,
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
      "insanity": "shuffle"
    }
  },
  "Bat Cave Drop": {
    "x": 165.5,
    "y": 288,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Blacksmiths Hut": {
    "x": 155.5,
    "y": 273,
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
      "insanity": "shuffle"
    }
  },
  "Blinds Hideout": {
    "x": 64,
    "y": 215,
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
      "insanity": "shuffle"
    }
  },
  "Bonk Fairy (Dark)": {
    "x": 241.5,
    "y": 334.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_takeanys_enemy_drops_fairies",
      "lean": "fixed_takeanys_enemy_drops_fairies",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Bonk Fairy (Light)": {
    "x": 241.5,
    "y": 334,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_enemy_drops_fairies",
      "lean": "fixed_enemy_drops_fairies",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Bonk Rock Cave": {
    "x": 199.5,
    "y": 150,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Bumper Cave (Top)": {
    "x": 183.5,
    "y": 79,
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
      "insanity": "shuffle"
    }
  },
  "Bush Covered House": {
    "x": 103.5,
    "y": 273.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "C-Shaped House": {
    "x": 106,
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
      "insanity": "shuffle"
    }
  },
  "Capacity Upgrade": {
    "x": 405.5,
    "y": 436.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_shop_n_bones",
      "lean": "fixed_shop_n_bones",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Cave 45": {
    "x": 136,
    "y": 423,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Chest Game": {
    "x": 25.5,
    "y": 239,
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
      "insanity": "shuffle"
    }
  },
  "Chicken House": {
    "x": 49.5,
    "y": 277,
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
      "insanity": "shuffle"
    }
  },
  "Dam": {
    "x": 240,
    "y": 480,
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
      "insanity": "shuffle"
    }
  },
  "Dark Death Mountain Fairy": {
    "x": 207.5,
    "y": 96.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_takeanys",
      "lean": "fixed_takeanys",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark Death Mountain Ledge (East)": {
    "x": 432,
    "y": 47,
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
      "insanity": "shuffle"
    }
  },
  "Dark Death Mountain Ledge (West)": {
    "x": 408,
    "y": 47,
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
      "insanity": "shuffle"
    }
  },
  "Dark Death Mountain Shop": {
    "x": 438,
    "y": 74.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_shops",
      "lean": "fixed_shops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark Lake Hylia Fairy": {
    "x": 422,
    "y": 331,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark Lake Hylia Ledge Fairy": {
    "x": 455,
    "y": 394,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_takeanys",
      "lean": "fixed_takeanys",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark Lake Hylia Ledge Hint": {
    "x": 469,
    "y": 394,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark Lake Hylia Ledge Spike Cave": {
    "x": 462,
    "y": 406,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pottery",
      "lean": "fixed_pottery",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark Lake Hylia Shop": {
    "x": 331.5,
    "y": 411,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_shops",
      "lean": "fixed_shops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark Lumberjack Shop": {
    "x": 171.5,
    "y": 29.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_shops",
      "lean": "fixed_shops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark Potion Shop": {
    "x": 411.5,
    "y": 173,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_shops",
      "lean": "fixed_shops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark Sanctuary Hint": {
    "x": 235.5,
    "y": 141,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Dark World Shop": {
    "x": 103.5,
    "y": 273,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_shops",
      "lean": "fixed_shops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Death Mountain Return Cave (East)": {
    "x": 201.5,
    "y": 70,
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
      "insanity": "shuffle"
    }
  },
  "Death Mountain Return Cave (West)": {
    "x": 183.5,
    "y": 78,
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
      "insanity": "shuffle"
    }
  },
  "Desert Fairy": {
    "x": 141.5,
    "y": 456.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_takeanys",
      "lean": "fixed_takeanys",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Desert Palace Entrance (North)": {
    "x": 37.5,
    "y": 393,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Desert Palace Entrance (West)": {
    "x": 17.5,
    "y": 407,
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
      "insanity": "shuffle"
    }
  },
  "East Dark World Hint": {
    "x": 502,
    "y": 359,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Eastern Palace": {
    "x": 491,
    "y": 200,
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
      "insanity": "shuffle"
    }
  },
  "Elder House (East)": {
    "x": 88,
    "y": 215,
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
      "insanity": "shuffle"
    }
  },
  "Elder House (West)": {
    "x": 77,
    "y": 215,
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
      "insanity": "shuffle"
    }
  },
  "Fairy Ascension Cave (Bottom)": {
    "x": 419.5,
    "y": 70,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Fortune Teller (Dark)": {
    "x": 96,
    "y": 166,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Fortune Teller (Light)": {
    "x": 95.5,
    "y": 166,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Ganons Tower": {
    "x": 287.5,
    "y": 10,
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
      "insanity": "shuffle"
    }
  },
  "Good Bee Cave": {
    "x": 469,
    "y": 394,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_bonk",
      "lean": "fixed_bonk",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Graveyard Cave": {
    "x": 292,
    "y": 141,
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
      "insanity": "shuffle"
    }
  },
  "Hammer Peg Cave": {
    "x": 161.5,
    "y": 310,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Hookshot Cave Back Entrance": {
    "x": 409.5,
    "y": 8,
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
      "insanity": "shuffle"
    }
  },
  "Hookshot Fairy": {
    "x": 431.5,
    "y": 74.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pots_n_bones_fairies",
      "lean": "fixed_pots_n_bones_fairies",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "death_mountain",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Hype Cave": {
    "x": 305.5,
    "y": 399,
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
      "insanity": "shuffle"
    }
  },
  "Hyrule Castle Entrance (East)": {
    "x": 282,
    "y": 199,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Hyrule Castle Secret Entrance Drop": {
    "x": 304.5,
    "y": 213,
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
      "insanity": "shuffle"
    }
  },
  "Hyrule Castle Secret Entrance Stairs": {
    "x": 281.5,
    "y": 220,
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
      "insanity": "shuffle"
    }
  },
  "Ice Palace": {
    "x": 407.5,
    "y": 442,
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
      "insanity": "shuffle"
    }
  },
  "Ice Rod Cave": {
    "x": 455,
    "y": 394,
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
      "insanity": "shuffle"
    }
  },
  // "Inverted Pyramid Entrance": {
  //   "x": 1728,
  //   "y": 1488,
  //   "world": "lw",
  //   "modes": {
  //     "dungeonssimple": "vanilla",
  //     "dungeonsfull": "vanilla",
  //     "lite": "shuffle",
  //     "lean": "shuffle",
  //     "simple": "shuffle",
  //     "restricted": "shuffle",
  //     "full": "shuffle",
  //     "district": "central_hyrule",
  //     "swapped": "swap",
  //     "crossed": "shuffle",
  //     "insanity": "shuffle"
  //   }
  // },
  // "Inverted Pyramid Hole": {
  //   "x": 2080,
  //   "y": 1664,
  //   "world": "lw",
  //   "modes": {
  //     "dungeonssimple": "vanilla",
  //     "dungeonsfull": "vanilla",
  //     "lite": "shuffle",
  //     "lean": "shuffle",
  //     "simple": "shuffle",
  //     "restricted": "shuffle",
  //     "full": "shuffle",
  //     "district": "central_hyrule",
  //     "swapped": "swap",
  //     "crossed": "shuffle",
  //     "insanity": "shuffle"
  //   }
  // },
  "Kakariko Gamble Game": {
    "x": 109.5,
    "y": 359.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "kakariko",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Kakariko Shop": {
    "x": 56,
    "y": 299.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_shops",
      "lean": "fixed_shops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Kakariko Well Cave": {
    "x": 24,
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
      "insanity": "shuffle"
    }
  },
  "Kakariko Well Drop": {
    "x": 11.5,
    "y": 218,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Lake Hylia Fairy": {
    "x": 421.5,
    "y": 330.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Lake Hylia Fortune Teller": {
    "x": 332,
    "y": 411.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Lake Hylia Shop": {
    "x": 371.5,
    "y": 393,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_shops",
      "lean": "fixed_shops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "lake_hylia",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Library": {
    "x": 79.5,
    "y": 338,
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
      "insanity": "shuffle"
    }
  },
  "Light Hype Fairy": {
    "x": 305.5,
    "y": 399,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_takeanys",
      "lean": "fixed_takeanys",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "central_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Light World Bomb Hut": {
    "x": 13.5,
    "y": 305,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pots_n_bones",
      "lean": "fixed_pots_n_bones",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Long Fairy Cave": {
    "x": 501.5,
    "y": 358.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_enemy_drops_fairies",
      "lean": "fixed_enemy_drops_fairies",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Lost Woods Gamble": {
    "x": 94.5,
    "y": 8,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Lost Woods Hideout Drop": {
    "x": 96.5,
    "y": 67,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Lumberjack House": {
    "x": 171.5,
    "y": 31.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pottery",
      "lean": "fixed_pottery",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Lumberjack Tree Tree": {
    "x": 153.5,
    "y": 38,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Mini Moldorm Cave": {
    "x": 333.5,
    "y": 481,
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
      "insanity": "shuffle"
    }
  },
  "Mire Fairy": {
    "x": 55.5,
    "y": 411,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_non_items",
      "lean": "fixed_non_items",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Mire Hint": {
    "x": 101.5,
    "y": 423,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pottery",
      "lean": "fixed_pottery",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "desert",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Mire Shed": {
    "x": 19.5,
    "y": 411,
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
      "insanity": "shuffle"
    }
  },
  "Misery Mire": {
    "x": 37.5,
    "y": 412,
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
      "insanity": "shuffle"
    }
  },
  "North Fairy Cave": {
    "x": 342,
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
      "insanity": "shuffle"
    }
  },
  "North Fairy Cave Drop": {
    "x": 328.5,
    "y": 159,
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
      "insanity": "shuffle"
    }
  },
  "Old Man Cave (East)": {
    "x": 207.5,
    "y": 96,
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
      "insanity": "shuffle"
    }
  },
  "Old Man Cave (West)": {
    "x": 181.5,
    "y": 90,
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
      "insanity": "shuffle"
    }
  },
  "Old Man House (Bottom)": {
    "x": 229.5,
    "y": 120,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Palace of Darkness": {
    "x": 491,
    "y": 202,
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
      "insanity": "shuffle"
    }
  },
  "Palace of Darkness Hint": {
    "x": 434.5,
    "y": 257.5,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pottery",
      "lean": "fixed_pottery",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "eastern_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Paradox Cave (Middle)": {
    "x": 443,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Potion Shop": {
    "x": 409.5,
    "y": 172,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Pyramid Hole": {
    "x": 254.5,
    "y": 209,
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
      "insanity": "shuffle"
    }
  },
  "Red Shield Shop": {
    "x": 169.5,
    "y": 236,
    "world": "dw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_shops",
      "lean": "fixed_shops",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_hyrule",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Sanctuary Grave": {
    "x": 265.5,
    "y": 150,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Skull Woods Final Section": {
    "x": 19.5,
    "y": 26,
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
      "insanity": "shuffle"
    }
  },
  "Skull Woods First Section Door": {
    "x": 93.5,
    "y": 76,
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
      "insanity": "shuffle"
    }
  },
  "Skull Woods First Section Hole (East)": {
    "x": 100,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Skull Woods Second Section Door (East)": {
    "x": 74,
    "y": 75,
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
      "insanity": "shuffle"
    }
  },
  "Skull Woods Second Section Door (West)": {
    "x": 29.5,
    "y": 67,
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
      "insanity": "shuffle"
    }
  },
  "Skull Woods Second Section Hole": {
    "x": 61.5,
    "y": 46,
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
      "insanity": "shuffle"
    }
  },
  "Snitch Lady (East)": {
    "x": 105.5,
    "y": 247.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pottery",
      "lean": "fixed_pottery",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Snitch Lady (West)": {
    "x": 25.5,
    "y": 239.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pottery",
      "lean": "fixed_pottery",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
    }
  },
  "Spectacle Rock Cave": {
    "x": 249.5,
    "y": 74,
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
      "insanity": "shuffle"
    }
  },
  "Spectacle Rock Cave (Bottom)": {
    "x": 233.5,
    "y": 70,
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
      "insanity": "shuffle"
    }
  },
  "Spectacle Rock Cave Peak": {
    "x": 249.5,
    "y": 52,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Spiral Cave": {
    "x": 407,
    "y": 46,
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
      "insanity": "shuffle"
    }
  },
  "Spiral Cave (Bottom)": {
    "x": 407,
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
      "insanity": "shuffle"
    }
  },
  "Superbunny Cave (Bottom)": {
    "x": 425,
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
      "insanity": "shuffle"
    }
  },
  "Superbunny Cave (Top)": {
    "x": 440,
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
      "insanity": "shuffle"
    }
  },
  "Swamp Palace": {
    "x": 240,
    "y": 480,
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
      "insanity": "shuffle"
    }
  },
  "Tavern (Front)": {
    "x": 81.5,
    "y": 305.5,
    "world": "lw",
    "modes": {
      "dungeonssimple": "vanilla",
      "dungeonsfull": "vanilla",
      "lite": "fixed_pottery",
      "lean": "fixed_pottery",
      "simple": "shuffle",
      "restricted": "shuffle",
      "full": "shuffle",
      "district": "northwest_dark_world",
      "swapped": "swap",
      "crossed": "shuffle",
      "insanity": "shuffle"
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Tower of Hera": {
    "x": 286.5,
    "y": 17,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  },
  "Two Brothers House (East)": {
    "x": 71.5,
    "y": 368,
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
      "insanity": "shuffle"
    }
  },
  "Two Brothers House (West)": {
    "x": 55.5,
    "y": 368,
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
      "insanity": "shuffle"
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
      "insanity": "shuffle"
    }
  }
};

export const PER_MODE_ENTRANCE_GROUPS: { [mode: string]: { [group: string]: string[] } } = {
  "dungeonssimple": {},
  "dungeonsfull": {},
  "lite": {},
  "lean": {},
  "simple": {},
  "restricted": {},
  "full": {},
  "district": {},
  "swapped": {},
  "crossed": {},
  "insanity": {}
};

for (const [location, data] of Object.entries(entranceData)) {
  for (const [mode, group] of Object.entries(data.modes)) {
    if (!(group in PER_MODE_ENTRANCE_GROUPS[mode])) {
      PER_MODE_ENTRANCE_GROUPS[mode][group] = [];
    }
    PER_MODE_ENTRANCE_GROUPS[mode][group].push(location);
  }
}