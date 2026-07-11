interface ItemData {
  name: string;
  description: string;
  maxCount: number;
  images: string[];
  levelNames?: string[];
  pseudoImage?: string;
}

const ItemsData: Record<string, ItemData> = {
  "bow": {
    name: "Bow",
    description: "A ranged weapon for attacking enemies from a distance.",
    maxCount: 4,
    images: [
      "/items/bow0.png",
      "/items/bow1.png",
      "/items/bow2.png",
      "/items/bow3.png",
    ],
    levelNames: ["Bow", "Silver Arrows", "Bow and Arrows", "Bow and Silver Arrows"],
  },
  "boomerang": {
    name: "Boomerang",
    description: "A returning weapon that can stun enemies and retrieve items.",
    maxCount: 3,
    images: [
      "/items/boomerang1.png",
      "/items/boomerang2.png",
      "/items/boomerang3.png",
    ],
    levelNames: ["Blue Boomerang", "Red Boomerang", "Boomerangs"],
  },
  "hookshot": {
    name: "Hookshot",
    description: "A grappling device used to pull the player towards distant objects or stun enemies.",
    maxCount: 1,
    images: [
      "/items/hookshot.png",
    ],
  },
  "bomb": {
    name: "Bombs",
    description: "Explosive devices used to damage enemies or destroy obstacles.",
    maxCount: 1,
    images: [
      "/items/bomb.png",
    ],
  },
  "mushroom": {
    name: "Mushroom",
    description: "A fetch quest item that sometimes doubles as powder.",
    maxCount: 2,
    images: [
      "/items/mushroom.png",
      "/items/mushroom_turnedin.png",
    ],
    levelNames: ["Mushroom", "Mushroom Turned In"],
  },
  "powder": {
    name: "Magic Powder",
    description: "A magical powder used to transform certain enemies and objects.",
    maxCount: 1,
    images: [
      "/items/powder.png",
    ],
  },
  "firerod": {
    name: "Fire Rod",
    description: "A magical rod that shoots fireballs.",
    maxCount: 1,
    images: [
      "/items/firerod.png",
    ],
  },
  "icerod": {
    name: "Ice Rod",
    description: "A magical rod that shoots ice bolts.",
    maxCount: 1,
    images: [
      "/items/icerod.png",
    ],
  },
  "bombos": {
    name: "Bombos Medallion",
    description: "A magical medallion that unleashes a ring of fire, scorching all enemies.",
    maxCount: 1,
    images: [
      "/items/bombos.png",
    ],
  },
  "ether": {
    name: "Ether Medallion",
    description: "A magical medallion that calls down lightning and freezes nearby enemies.",
    maxCount: 1,
    images: [
      "/items/ether.png",
    ],
  },
  "quake": {
    name: "Quake Medallion",
    description: "A magical medallion that shakes the earth and can turn ground enemies into slimes.",
    maxCount: 1,
    images: [
      "/items/quake.png",
    ],
  },
  "lantern": {
    name: "Lantern",
    description: "A light source used to illuminate dark areas.",
    maxCount: 1,
    images: [
      "/items/lantern.png",
    ],
  },
  "hammer": {
    name: "Hammer",
    description: "A heavy hammer used to smash pegs and enemies.",
    maxCount: 1,
    images: [
      "/items/hammer.png",
    ],
  },
  "shovel": {
    name: "Shovel",
    description: "A tool used for digging up hidden items.",
    maxCount: 1,
    images: [
      "/items/shovel.png",
    ],
  },
  "flute": {
    name: "Flute",
    description: "A magical flute that summons a bird for navigation.",
    maxCount: 2,
    images: [
      "/items/flute.png",
      "/items/flute_activated.png",
    ],
    levelNames: ["Flute", "Activated Flute"],
  },
  "net": {
    name: "Bug Net",
    description: "A net used to catch bugs and other small creatures.",
    maxCount: 1,
    images: [
      "/items/net.png",
    ],
  },
  "book": {
    name: "Book of Mudora",
    description: "An ancient book that allows reading the Hylian language.",
    maxCount: 1,
    images: [
      "/items/book.png",
    ],
  },
  "bottle": {
    name: "Bottle",
    description: "A container used to hold potions, fairies, and other items.",
    maxCount: 7,
    images: [
      "/items/bottle_empty.png",
      "/items/bottle_red.png",
      "/items/bottle_green.png",
      "/items/bottle_blue.png",
      "/items/bottle_fairy.png",
      "/items/bottle_bee.png",
      "/items/bottle_goodbee.png",
    ],
    levelNames: ["Bottle", "Red Potion", "Green Potion", "Blue Potion", "Fairy", "Bee", "Good Bee"],
  },
  "somaria": {
    name: "Cane of Somaria",
    description: "A magical cane that creates blocks and can fire projectiles.",
    maxCount: 1,
    images: [
      "/items/somaria.png",
    ],
  },
  "byrna": {
    name: "Cane of Byrna",
    description: "A magical cane that provides a protective shield and damages nearby enemies.",
    maxCount: 1,
    images: [
      "/items/byrna.png",
    ],
  },
  "cape": {
    name: "Magic Cape",
    description: "A cape that grants temporary invisibility.",
    maxCount: 1,
    images: [
      "/items/cape.png",
    ],
  },
  "mirror": {
    name: "Magic Mirror",
    description: "A mirror used to return to the starting overworld or a dungeon entrance.",
    maxCount: 1,
    images: [
      "/items/mirror.png",
    ],
    pseudoImage: "/items/mirrorscroll.png",
  },
  "boots": {
    name: "Pegasus Boots",
    description: "Boots that allow the player to dash quickly.",
    maxCount: 1,
    images: [
      "/items/boots.png",
    ],
    pseudoImage: "/items/pseudoboots.png",
  },
  "glove": {
    name: "Power Glove",
    description: "A glove that increases the player's strength to lift heavier objects.",
    maxCount: 2,
    images: [
      "/items/glove1.png",
      "/items/glove2.png",
    ],
    levelNames: ["Power Glove", "Titan's Mitts"],
  },
  "flippers": {
    name: "Flippers",
    description: "Flippers that allow the player to swim in deep water.",
    maxCount: 1,
    images: [
      "/items/flippers.png",
    ],
  },
  // TODO: Add quarter magic
  "magic": {
    name: "Half Magic",
    description: "An upgrade that increases the player's magic meter capacity.",
    maxCount: 1,
    images: [
      "/items/magic.png",
    ],
  },
  "moonpearl": {
    name: "Moon Pearl",
    description: "A gem that allows the player to maintain their Hylian form.",
    maxCount: 1,
    images: [
      "/items/moonpearl.png",
    ],
  },
  "heartpiece": {
    name: "Heart Piece",
    description: "A fragment of a heart that increases the player's maximum health when four are collected.",
    maxCount: 4,
    images: [
      "/items/heartpiece0.png",
      "/items/heartpiece1.png",
      "/items/heartpiece2.png",
      "/items/heartpiece3.png",
    ],
  },
  "shield": {
    name: "Shield",
    description: "A defensive item used to block attacks.",
    maxCount: 3,
    images: [
      "/items/shield1.png",
      "/items/shield2.png",
      "/items/shield3.png",
    ],
    levelNames: ["Fighter Shield", "Fire Shield", "Mirror Shield"],
  },
  "sword": {
    name: "Sword",
    description: "A melee weapon used to attack enemies.",
    maxCount: 4,
    images: [
      "/items/sword1.png",
      "/items/sword2.png",
      "/items/sword3.png",
      "/items/sword4.png",
    ],
    levelNames: ["Fighter Sword", "Master Sword", "Tempered Sword", "Golden Sword"],
  },
  // TODO: Get green and red mail images
  "mail": {
    name: "Mail",
    description: "Armor that reduces damage taken from enemies.",
    maxCount: 2,
    images: [
      "/items/bluemail.png",
      "/items/bluemail.png",
    ],
    levelNames: ["Blue Mail", "Red Mail"],
  },
};

export const PrizeImages: Record<string, string> = {
  unknown: "/dungeons/unknown.png",
  greenPendant: "/dungeons/green_pendant.png",
  pendant: "/dungeons/pendant.png",
  map: "/dungeons/map.png",
  redCrystal: "/dungeons/red_crystal.png",
  crystal: "/dungeons/crystal.png",
};

export const PrizeNames: Record<string, string> = {
  unknown: "Unknown Prize",
  greenPendant: "Green Pendant",
  pendant: "Pendant",
  redCrystal: "Red Crystal",
  crystal: "Crystal",
};

export const DungeonItemNames = {
  smallKey: "Small Key",
  bigKey: "Big Key",
  map: "Map",
  compass: "Compass",
} as const;

export default ItemsData;
