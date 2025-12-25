interface DungeonData {
  name: string;
  icon: string;
  defeatedIcon?: string;
  totalLocations?: {
    chests: number;
    smallkeys: number;
    keypots: number;
    keydrops: number;
    pots: number;
    mobs: number;
    bigkeydrops: boolean;
    bigkey: boolean;
    map: boolean;
    compass: boolean;
    prize: boolean;
  };
}

export const DungeonsData: Record<string, DungeonData> = {
  ep: {
    name: "Eastern Palace",
    icon: "/dungeons/armos.png",
    totalLocations: {
      chests: 6,
      smallkeys: 0,
      keypots: 1,
      keydrops: 1,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  dp: {
    name: "Desert Palace",
    icon: "/dungeons/lanmolas.png",
    totalLocations: {
      chests: 6,
      smallkeys: 1,
      keypots: 3,
      keydrops: 0,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  toh: {
    name: "Tower of Hera",
    icon: "/dungeons/moldorm.png",
    totalLocations: {
      chests: 6,
      smallkeys: 1,
      keypots: 0,
      keydrops: 0,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  pod: {
    name: "Palace of Darkness",
    icon: "/dungeons/helmasaur_king.png",
    totalLocations: {
      chests: 14,
      smallkeys: 6,
      keypots: 0,
      keydrops: 0,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  sp: {
    name: "Swamp Palace",
    icon: "/dungeons/arrghus.png",
    totalLocations: {
      chests: 10,
      smallkeys: 1,
      keypots: 5,
      keydrops: 0,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  sw: {
    name: "Skull Woods",
    icon: "/dungeons/mothula.png",
    totalLocations: {
      chests: 8,
      smallkeys: 3,
      keypots: 1,
      keydrops: 1,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  tt: {
    name: "Thieves' Town",
    icon: "/dungeons/blind.png",
    totalLocations: {
      chests: 8,
      smallkeys: 1,
      keypots: 2,
      keydrops: 0,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  ip: {
    name: "Ice Palace",
    icon: "/dungeons/kholdstare.png",
    totalLocations: {
      chests: 8,
      smallkeys: 2,
      keypots: 2,
      keydrops: 2,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  mm: {
    name: "Misery Mire",
    icon: "/dungeons/vitreous.png",
    totalLocations: {
      chests: 8,
      smallkeys: 3,
      keypots: 2,
      keydrops: 1,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  tr: {
    name: "Turtle Rock",
    icon: "/dungeons/trinexx.png",
    totalLocations: {
      chests: 12,
      smallkeys: 4,
      keypots: 0,
      keydrops: 2,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: true,
    },
  },
  gt: {
    name: "Ganon's Tower",
    icon: "/dungeons/agahnim20.png",
    defeatedIcon: "/dungeons/agahnim1.png",
    totalLocations: {
      chests: 27,
      smallkeys: 4,
      keypots: 3,
      keydrops: 1,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: true,
      map: true,
      compass: true,
      prize: false,
    },
  },
  ct: {
    name: "Castle Tower",
    icon: "/dungeons/agahnim0.png",
    defeatedIcon: "/dungeons/agahnim1.png",
    totalLocations: {
      chests: 2,
      smallkeys: 2,
      keypots: 0,
      keydrops: 2,
      pots: 0,
      mobs: 0,
      bigkeydrops: false,
      bigkey: false,
      map: false,
      compass: false,
      prize: false,
    },
  },
  hc: {
    name: "Hyrule Castle",
    icon: "/dungeons/bnc.png",
    totalLocations: {
      chests: 8,
      smallkeys: 1,
      keypots: 0,
      keydrops: 3,
      pots: 0,
      mobs: 0,
      bigkeydrops: true,
      bigkey: false,
      map: true,
      compass: false,
      prize: false,
    },
  },
};

export default DungeonsData;
