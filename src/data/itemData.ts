const ItemsData = {
  "bow": {
    name: "Bow",
    description: "A ranged weapon for attacking enemies from a distance.",
    maxCount: 4,
    images: [
      "/items/bow0.png",
      "/items/bow1.png",
      "/items/bow2.png",
      "/items/bow3.png",
    ]
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
    description: "A magical medallion that creates a powerful explosion.",
    maxCount: 1,
    images: [
      "/items/bombos.png",
    ],
  },
  "ether": {
    name: "Ether Medallion",
    description: "A magical medallion that unleashes a bolt of lightning.",
    maxCount: 1,
    images: [
      "/items/ether.png",
    ],
  },
  "quake": {
    name: "Quake Medallion",
    description: "A magical medallion that causes an earthquake.",
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
    description: "A heavy hammer used to smash obstacles and enemies.",
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
    description: "An ancient book that allows reading Hylian inscriptions.",
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
  },
  "somaria": {
    name: "Cane of Somaria",
    description: "A magical cane that creates blocks for puzzle solving.",
    maxCount: 1,
    images: [
      "/items/somaria.png",
    ],
  },
  "byrna": {
    name: "Cane of Byrna",
    description: "A magical cane that provides a protective shield.",
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
    description: "A mirror that teleports the player back to the entrance of dungeons.",
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
  },
  "flippers": {
    name: "Flippers",
    description: "A swimming aid that allows the player to swim in deep water.",
    maxCount: 1,
    images: [
      "/items/flippers.png",
    ],
  },
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
    description: "An item that allows the player to maintain their human form in the Dark World.",
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
  },
  "mail": {
    name: "Mail",
    description: "Armor that reduces damage taken from enemies.",
    maxCount: 2,
    images: [
      "/items/bluemail.png",
      "/items/bluemail.png",
    ],
  },


};

export default ItemsData;