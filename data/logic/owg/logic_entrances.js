(function (window) {
  "use strict";

  window.owg_logic_entrances = {
    "20 Rupee Cave": {
      Open: {
        allOf: ["glove"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "glove"],
      },
    },
    "Agahnims Tower": {
      Open: {
        allOf: ["canReach|Hyrule Castle Balcony"],
        anyOf: ["canCrossEnergyBarrier", "agahnim"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Hyrule Castle Balcony", "canOpenGT"],
      },
    },
    "Aginahs Cave": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Bat Cave Drop": {
      Open: {
        anyOf: [
          "hammer",
          {
            allOf: ["mitts", "moonpearl", "mirror"],
          },
          {
            allOf: ["hasFoundEntrance|Hammer Peg Cave", "mirror"],
          },
        ],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "hammer"],
      },
    },
    "Big Bomb Shop": {
      Open: {
        allOf: ["canReach|South Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South Dark World"],
      },
    },
    "Blacksmiths Hut": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Blinds Hideout": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Bonk Fairy (Dark)": {
      Open: {
        allOf: ["canReach|South Dark World", "moonpearl", "boots"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South Dark World", "boots"],
      },
    },
    "Bonk Rock Cave": {
      Open: {
        allOf: ["boots"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "boots"],
      },
    },
    Brewery: {
      Open: {
        allOf: ["canReach|West Dark World", "moonpearl", "bombs"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World", "bombs"],
      },
    },
    "Bumper Cave (Top)": {
      Open: {
        allOf: ["canReach|West Dark World"],
        anyOf: [
          "canBunnyCitrus",
          {
            allOf: ["canBootsClip", "moonpearl"],
          },
        ],
      },
      Inverted: {
        anyOf: [
          { allOf: ["canBootsClip", "canReach|Inverted West Dark World"] },
          {
            allOf: ["hasFoundEntrance|Death Mountain Return Cave (West)", "mirror"],
          },
        ],
      },
    },
    "Bush Covered House": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World"],
      },
    },
    "C-Shaped House": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Cave 45": {
      Open: {
        anyOf: [
          "canBootsClip",
          {
            allOf: ["canReach|South Dark World", "mirror"],
          },
        ],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Chicken House": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Dark Death Mountain Shop": {
      Open: {
        allOf: ["canReach|Lower East Dark Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower East Dark Death Mountain"],
      },
    },
    "Dark Lake Hylia Ledge Fairy": {
      Open: {
        allOf: ["canReach|South East Dark World", "moonpearl", "bombs"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South East Dark World", "bombs"],
      },
    },
    "Dark Lake Hylia Ledge Hint": {
      Open: {
        allOf: ["canReach|South East Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South East Dark World"],
      },
    },
    "Dark Lake Hylia Shop": {
      Open: {
        allOf: ["canReach|South Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South Dark World"],
      },
    },
    "Dark Potion Shop": {
      Open: {
        allOf: ["canReach|North East Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted North East Dark World"],
      },
    },
    "Dark Sanctuary Hint": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Death Mountain Return Cave (East)": {
      Open: {
        allOf: ["canReach|Lower West Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower West Death Mountain"],
      },
    },
    "Desert Palace Entrance (North)": {
      Open: {
        anyOf: [
          "canBootsClip",
          {
            allOf: ["hasFoundEntrance|Desert Palace Entrance (West)", "glove"],
          },
          {
            allOf: ["canReach|South West Dark World", "mirror"],
          },
        ],
      },
      Inverted: {
        anyOf: [
          { allOf: ["canBootsClip", "moonpearl", "canReach|South Dark World"] },
          {
            allOf: ["hasFoundEntrance|Desert Palace Entrance (West)", "moonpearl", "glove"],
          },
        ],
      },
    },
    "Desert Palace Entrance (South)": {
      Open: {
        anyOf: [
          "book",
          {
            allOf: ["canReach|South West Dark World", "mirror"],
          },
        ],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny", "book"],
      },
    },
    "East Dark World Hint": {
      Open: {
        allOf: ["canReach|East Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted East Dark World"],
      },
    },
    "Elder House (East)": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Elder House (West)": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Fairy Ascension Cave (Bottom)": {
      Open: {
        anyOf: [
          "canReach|Upper East Death Mountain",
          "hasFoundEntrance|Fairy Ascension Cave (Top)",
          {
            allOf: ["hasFoundEntrance|Turtle Rock Isolated Ledge Entrance", "mirror"],
          },
          {
            allOf: ["canReach|Lower East Death Mountain", "mitts"],
          },
          {
            allOf: ["canReach|Lower East Dark Death Mountain", "moonpearl", "mirror"],
          },
        ],
      },
      Inverted: {
        anyOf: [
          "canReach|Inverted Upper East Death Mountain",
          "hasFoundEntrance|Fairy Ascension Cave (Top)",
          {
            allOf: ["canReach|Inverted Lower East Death Mountain", "mitts"],
          },
        ],
      },
    },
    "Fairy Ascension Cave (Top)": {
      Open: {
        anyOf: [
          "canReach|Upper East Death Mountain",
          {
            allOf: ["hasFoundEntrance|Turtle Rock Isolated Ledge Entrance", "mirror"],
          },
        ],
      },
      Inverted: {
        allOf: ["canReach|Inverted Upper East Death Mountain"],
      },
    },
    "Fortune Teller (Dark)": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Ganons Tower": {
      Open: {
        allOf: ["canReach|Upper Dark Death Mountain"],
        anyOf: [{ allOf: ["canBootsClip", "moonpearl"] }, { allOf: ["canOpenGT"] }],
      },
      Inverted: {
        allOf: ["canReach|Inverted Dark Death Mountain"],
      },
    },
    "Graveyard Cave": {
      Open: {
        anyOf: [{ allOf: ["canBootsClip", "canReach|Lower West Death Mountain"] }, { allOf: ["canReach|West Dark World", "moonpearl", "mirror"] }],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World"],
      },
    },
    "Hammer Peg Cave": {
      Open: {
        allOf: ["mitts", "moonpearl", "hammer"],
      },
      Inverted: {
        allOf: ["hammer"],
        anyOf: [
          "mitts",
          {
            allOf: ["canReach|Inverted Light World Bunny", "mirror"],
          },
        ],
      },
    },
    "Hookshot Cave Back Entrance": {
      Open: {
        allOf: ["never"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Upper East Death Mountain", "mirror"],
      },
    },
    "Hype Cave": {
      Open: {
        allOf: ["canReach|Inverted South Dark World", "moonpearl", "bombs"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South Dark World", "bombs"],
      },
    },
    "Hyrule Castle Secret Entrance Drop": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World"],
      },
    },
    "Ice Palace": {
      Open: {
        allOf: ["mitts"],
        anyOf: ["flippers", "hasFoundEntrance|Capacity Upgrade"],
      },
      Inverted: {
        anyOf: [
          "flippers",
          {
            allOf: ["mirror"],
            anyOf: [
              "hasFoundEntrance|Capacity Upgrade",
              {
                allOf: ["canReach|Inverted Light World", "flippers"],
              },
            ],
          },
        ],
      },
    },
    "Ice Rod Cave": {
      Open: {
        allOf: ["bombs"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "bombs"],
      },
    },
    "Pyramid Hole": {
      Open: {
        allOf: ["canReach|East Dark World", "agahnim2"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Hyrule Castle Balcony", "agahnim2"],
      },
    },
    "Kakariko Gamble Game": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Kakariko Shop": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Kakariko Well Drop": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Kings Grave": {
      Open: {
        allOf: ["boots"],
        anyOf: ["mitts", { allOf: ["canBootsClip", "canReach|Lower West Death Mountain"] }, { allOf: ["canReach|West Dark World", "moonpearl", "mirror"] }],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "mitts", "boots"],
      },
    },
    "Lake Hylia Fairy": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Lake Hylia Fortune Teller": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Lake Hylia Shop": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    Library: {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Light Hype Fairy": {
      Open: {
        allOf: ["bombs"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "bombs"],
      },
    },
    "Long Fairy Cave": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Lost Woods Hideout Drop": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World"],
      },
    },
    "Lumberjack House": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Lumberjack Tree Tree": {
      Open: {
        allOf: ["agahnim", "boots"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "agahnim", "boots"],
      },
    },
    "Mimic Cave": {
      Open: {
        allOf: ["mirror"],
        // TODO: Canreach TR bridge?
        anyOf: ["hasFoundEntrance|Dark Death Mountain Ledge (East)", "hasFoundEntrance|Dark Death Mountain Ledge (West)"],
      },
      Inverted: {
        anyOf: ["canReach|Inverted Upper East Death Mountain", "hasFoundEntrance|Spiral Cave"],
      },
    },
    "Mini Moldorm Cave": {
      Open: {
        allOf: ["bombs"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "bombs"],
      },
    },
    "Mire Fairy": {
      Open: {
        allOf: ["canReach|South West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South West Dark World"],
      },
    },
    "Mire Hint": {
      Open: {
        allOf: ["canReach|South West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South West Dark World"],
      },
    },
    "Mire Shed": {
      Open: {
        allOf: ["canReach|South West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South West Dark World"],
      },
    },
    "Misery Mire": {
      Open: {
        allOf: ["canReach|South West Dark World", "moonpearl"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South West Dark World"],
      },
    },
    "North Fairy Cave Drop": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Old Man Cave (East)": {
      Open: {
        allOf: ["canReach|Lower West Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower West Death Mountain"],
      },
    },
    "Old Man House (Top)": {
      Open: {
        allOf: ["canReach|Lower West Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower West Death Mountain"],
      },
    },
    "Palace of Darkness": {
      Open: {
        allOf: ["canReach|East Dark World", "moonpearl"],
      },
      Inverted: {
        allOf: ["canReach|Inverted East Dark World"],
      },
    },
    "Paradox Cave (Bottom)": {
      Open: {
        allOf: ["canReach|Lower East Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower East Death Mountain"],
      },
    },
    "Paradox Cave (Middle)": {
      Open: {
        allOf: ["canReach|Lower East Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower East Death Mountain"],
      },
    },
    "Potion Shop": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World"],
      },
    },
    "Pyramid Fairy": {
      Open: {
        anyOf: [{ allOf: ["mirror", "canBootsClip", "canReach|Lower West Death Mountain"] }, { allOf: ["canReach|East Dark World", "hasFoundMapEntry|bomb", "canBuyBigBomb"] }],
      },
      Inverted: {
        allOf: ["canReach|East Dark World", "hasFoundMapEntry|bomb", "canBuyBigBomb"],
      },
    },
    "Sanctuary Grave": {
      Open: {
        allOf: ["glove"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "glove"],
      },
    },
    "Skull Woods Final Section": {
      Open: {
        allOf: ["firerod", "moonpearl", "hasFoundEntrance|Skull Woods Second Section Door (West)"],
      },
      Inverted: {
        allOf: ["firerod", "hasFoundEntrance|Skull Woods Second Section Door (West)"],
      },
    },
    "Skull Woods First Section Hole (East)": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Skull Woods First Section Hole (North)": {
      Open: {
        allOf: ["canReach|West Dark World", "moonpearl"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Skull Woods First Section Hole (West)": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Skull Woods Second Section Hole": {
      Open: {
        allOf: ["moonpearl"],
        anyOf: ["hasFoundEntrance|Skull Woods Second Section Door (West)", "hasFoundEntrance|Skull Woods Final Section"],
      },
      Inverted: {
        anyOf: ["hasFoundEntrance|Skull Woods Second Section Door (West)", "hasFoundEntrance|Skull Woods Final Section"],
      },
    },
    "Snitch Lady (East)": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Spectacle Rock Cave": {
      Open: {
        allOf: ["canReach|Lower West Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower West Death Mountain"],
      },
    },
    "Spiral Cave": {
      Open: {
        anyOf: [
          "canReach|Upper East Death Mountain",
          {
            allOf: [
              "mirror",
              {
                anyOf: ["hasFoundEntrance|Dark Death Mountain Ledge (East)", "hasFoundEntrance|Dark Death Mountain Ledge (West)"],
              },
            ],
          },
        ],
      },
      Inverted: {
        anyOf: ["canReach|Inverted Upper East Death Mountain", "hasFoundEntrance|Mimic Cave"],
      },
    },
    "Spiral Cave (Bottom)": {
      Open: {
        allOf: ["canReach|Lower East Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower East Death Mountain"],
      },
    },
    "Superbunny Cave (Bottom)": {
      Open: {
        allOf: ["canReach|Lower East Dark Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower East Dark Death Mountain"],
      },
    },
    "Superbunny Cave (Top)": {
      Open: {
        allOf: ["canReach|Upper Dark Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Dark Death Mountain"],
      },
    },
    "Tavern North": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Turtle Rock": {
      Open: {
        allOf: ["canReach|Upper East Death Mountain", "hammer", "moonpearl"],
        anyOf: ["mitts", "canBootsClip"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Dark Death Mountain"],
      },
    },
    "Two Brothers House (East)": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "50 Rupee Cave": {
      Open: {
        allOf: ["glove"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "glove"],
      },
    },
    "Archery Game": {
      Open: {
        allOf: ["canReach|South Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South Dark World"],
      },
    },
    "Bat Cave Cave": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Bonk Fairy (Light)": {
      Open: {
        allOf: ["boots"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "boots"],
      },
    },
    "Bumper Cave (Bottom)": {
      Open: {
        allOf: ["moonpearl", "canReach|West Dark World"],
        anyOf: ["glove", "canBootsClip"],
      },
      Inverted: {
        anyOf: [
          {
            allOf: ["hasFoundEntrance|Death Mountain Return Cave (West)", "mirror"],
          },
          {
            allOf: ["canReach|Inverted West Dark World"],
            anyOf: ["glove", "canBootsClip"],
          },
        ],
      },
    },
    "Capacity Upgrade": {
      Open: {},
      Inverted: {
        anyOf: [
          "mitts",
          "canReach|Inverted Light World",
          {
            allOf: ["hasFoundEntrance|Ice Palace", "mitts"],
          },
        ],
      },
    },
    "Checkerboard Cave": {
      Open: {
        anyOf: ["canBootsClip", { allOf: ["canReach|South West Dark World", "mirror", "glove"] }],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "glove"],
      },
    },
    "Chest Game": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    Dam: {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Dark Death Mountain Fairy": {
      Open: {
        allOf: ["canReach|Lower West Dark Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Dark Death Mountain"],
      },
    },
    "Dark Death Mountain Ledge (East)": {
      Open: {
        anyOf: [{ allOf: ["canReach|Upper Dark Death Mountain", "moonpearl", "canBootsClip"] }, { allOf: ["hasFoundEntrance|Dark Death Mountain Ledge (West)"] }],
      },
      Inverted: {
        anyOf: [
          { allOf: ["canRech|Inverted Upper Dark Death Mountain", "canBootsClip"] },
          "hasFoundEntrance|Dark Death Mountain Ledge (West)",
          {
            allOf: [
              "mirror",
              {
                anyOf: ["hasFoundEntrance|Spiral Cave", "hasFoundEntrance|Mimic Cave", "canReach|Inverted Upper East Death Mountain"],
              },
            ],
          },
        ],
      },
    },
    "Dark Death Mountain Ledge (West)": {
      Open: {
        anyOf: [{ allOf: ["canReach|Upper Dark Death Mountain", "moonpearl", "canBootsClip"] }, { allOf: ["hasFoundEntrance|Dark Death Mountain Ledge (East)"] }],
      },
      Inverted: {
        anyOf: [
          { allOf: ["canRech|Inverted Upper Dark Death Mountain", "canBootsClip"] },
          "hasFoundEntrance|Dark Death Mountain Ledge (East)",
          {
            allOf: [
              "mirror",
              {
                anyOf: ["hasFoundEntrance|Spiral Cave", "hasFoundEntrance|Mimic Cave", "canReach|Inverted Upper East Death Mountain"],
              },
            ],
          },
        ],
      },
    },
    "Dark Lake Hylia Fairy": {
      Open: {
        allOf: ["canReach|East Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted East Dark World"],
      },
    },
    "Dark Lake Hylia Ledge Spike Cave": {
      Open: {
        allOf: ["canReach|South East Dark World", "moonpearl", "glove"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South East Dark World", "glove"],
      },
    },
    "Dark Lumberjack Shop": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Dark World Shop": {
      Open: {
        allOf: ["canReach|West Dark World", "moonpearl", "hammer"],
      },
      Inverted: {
        anyOf: [
          "hammer",
          {
            allOf: ["canReach|Inverted Light World", "mirror"],
          },
        ],
      },
    },
    "Death Mountain Return Cave (West)": {
      Open: {
        anyOf: ["canBootsClip", { allOf: ["hasFoundEntrance|Bumper Cave (Top)", "mirror"] }],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "canBootsClip"],
      },
    },
    "Desert Fairy": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Desert Palace Entrance (East)": {
      Open: {
        allOf: ["canReach|South West Dark World", "mirror"],
      },
      Inverted: {
        allOf: ["never"],
      },
    },
    "Desert Palace Entrance (West)": {
      Open: {
        anyOf: [
          "canBootsClip",
          {
            allOf: ["canReach|South West Dark World", "mirror"],
          },
          {
            allOf: ["hasFoundEntrance|Desert Palace Entrance (North)", "glove"],
          },
        ],
      },
      Inverted: {
        allOf: [
          "moonpearl",
          {
            anyOf: ["canReach|Inverted Light World", { allOf: ["hasFoundEntrance|Desert Palace Entrance (North)", "glove"] }],
          },
        ],
      },
    },
    "Eastern Palace": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Fortune Teller (Light)": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Good Bee Cave": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Hookshot Cave": {
      Open: {
        allOf: ["canReach|Upper Dark Death Mountain", "moonpearl", "glove"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Dark Death Mountain", "glove"],
      },
    },
    "Hookshot Fairy": {
      Open: {
        allOf: ["canReach|Lower East Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower East Death Mountain"],
      },
    },
    "Hyrule Castle Entrance (East)": {
      Open: {
        allOf: ["canReach|Hyrule Castle Balcony"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Hyrule Castle Balcony"],
      },
    },
    "Hyrule Castle Entrance (South)": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Hyrule Castle Entrance (West)": {
      Open: {
        allOf: ["canReach|Hyrule Castle Balcony"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Hyrule Castle Balcony"],
      },
    },
    "Hyrule Castle Secret Entrance Stairs": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World"],
      },
    },
    "Pyramid Exit": {
      Open: {
        allOf: ["canReach|East Dark World", "agahnim2"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Kakariko Well Cave": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Light World Bomb Hut": {
      Open: {
        allOf: ["bombs"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", "bombs"],
      },
    },
    "Links House": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Lost Woods Gamble": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Lost Woods Hideout Stump": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Lumberjack Tree Cave": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "North Fairy Cave": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Old Man Cave (West)": {
      Open: {
        anyOf: [
          "canBootsClip",
          "glove",
          {
            allOf: ["hasFoundEntrance|Bumper Cave (Bottom)", "mirror"],
          },
        ],
      },
      Inverted: {
        allOf: ["canReach|Inverted Light World", { anyOf: ["glove", "canBootsClip"] }],
      },
    },
    "Old Man House (Bottom)": {
      Open: {
        allOf: ["canReach|Lower West Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower West Death Mountain"],
      },
    },
    "Palace of Darkness Hint": {
      Open: {
        allOf: ["canReach|East Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted East Dark World"],
      },
    },
    "Paradox Cave (Top)": {
      Open: {
        allOf: ["canReach|Upper East Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Upper East Death Mountain"],
      },
    },
    "Red Shield Shop": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Sahasrahlas Hut": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    Sanctuary: {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Sick Kids House": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Skull Woods First Section Door": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Skull Woods Second Section Door (East)": {
      Open: {
        allOf: ["canReach|West Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Skull Woods Second Section Door (West)": {
      Open: {
        allOf: ["hasFoundEntrance|Skull Woods Final Section"],
      },
      Inverted: {
        allOf: ["hasFoundEntrance|Skull Woods Final Section"],
      },
    },
    "Snitch Lady (West)": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Spectacle Rock Cave (Bottom)": {
      Open: {
        allOf: ["canReach|Lower West Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower West Death Mountain"],
      },
    },
    "Spectacle Rock Cave Peak": {
      Open: {
        allOf: ["canReach|Lower West Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Lower West Death Mountain"],
      },
    },
    "Spike Cave": {
      Open: {
        allOf: ["canReach|Lower West Dark Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Dark Death Mountain"],
      },
    },
    "Swamp Palace": {
      Open: {
        allOf: ["canReach|South Dark World"],
      },
      Inverted: {
        allOf: ["canReach|Inverted South Dark World"],
      },
    },
    "Tavern (Front)": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World Bunny"],
      },
    },
    "Thieves Town": {
      Open: {
        allOf: ["canReach|West Dark World", "moonpearl"],
      },
      Inverted: {
        allOf: ["canReach|Inverted West Dark World"],
      },
    },
    "Tower of Hera": {
      Open: {
        allOf: ["canReach|Upper West Death Mountain"],
      },
      Inverted: {
        allOf: ["canReach|Inverted Upper West Death Mountain"],
      },
    },
    "Turtle Rock Isolated Ledge Entrance": {
      Open: {
        allOf: ["never"],
      },
      Inverted: {
        allOf: ["mirror"],
        anyOf: ["canReach|Inverted Upper East Death Mountain", "hasFoundEntrance|Fairy Ascension Cave (Top)"],
      },
    },
    "Two Brothers House (West)": {
      Open: {
        allOf: ["canReach|South Dark World", "mirror"],
      },
      Inverted: {
        allOf: ["never"],
      },
    },
    "Waterfall of Wishing": {
      Open: {},
      Inverted: {
        allOf: ["canReach|Inverted Light World"],
      },
    },
  };
})(window);
