(function (window) {
  "use strict";

  window.owg_logic_nondungeon_checks = {
    "Aginah's Cave": {
      Open: {
        always: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    Blacksmith: {
      Open: {
        always: {
          allOf: ["mitts", "moonpearl"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["mitts", "mirror"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Blind's Hideout - Far Left": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Blind's Hideout - Far Right": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Blind's Hideout - Left": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Blind's Hideout - Right": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Blind's Hideout - Top": {
      Open: {
        always: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Bombos Tablet": {
      Open: {
        scout: {
          allOf: ["book"],
          anyOf: [
            "canBootsClip",
            {
              allOf: ["mirror", "canBreach|Dark World - South"],
            },
          ],
        },
        always: {
          allOf: ["book", "canBreakTablets"],
          anyOf: [
            "canBootsClip",
            {
              allOf: ["mirror", "canBreach|Dark World - South"],
            },
          ],
        },
        logical: {
          anyOf: ["canReach|Dark World - South", "canBootsClip"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World", "book"],
        },
        always: {
          allOf: ["canBreach|Light World", "book", "canBreakTablets"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Bonk Rock Cave": {
      Open: {
        always: {
          allOf: ["boots"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "boots", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World", "boots"],
        },
      },
    },
    "Bottle Merchant": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    Brewery: {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "bombs"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          allOf: ["bombs"],
        },
      },
    },
    "Bumper Cave Ledge": {
      Open: {
        scout: {
          allOf: ["canBreach|Dark World - West"],
        },
        always: {
          allOf: ["canBreach|Dark World - West", "canBootsClip", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Dark World - West"],
        },
        always: {
          allOf: ["canBreach|Dark World - West", "canBootsClip", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
    },
    "C-Shaped House": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
          anyOf: ["moonpearl", "mirror"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
    },
    "Capacity Upgrade - Left": {
      Open: {},
      Inverted: {
        required: {
          anyOf: [
            "mitts",
            {
              allOf: ["canBreach|Light World", "moonpearl"],
            },
          ],
        },
        logical: {
          anyOf: [
            "mitts",
            {
              allOf: ["canReach|Light World", "moonpearl"],
            },
          ],
        },
      },
    },
    "Capacity Upgrade - Right": {
      Open: {},
      Inverted: {
        required: {
          anyOf: [
            "mitts",
            {
              allOf: ["canBreach|Light World", "moonpearl"],
            },
          ],
        },
        logical: {
          anyOf: [
            "mitts",
            {
              allOf: ["canReach|Light World", "moonpearl"],
            },
          ],
        },
      },
    },
    Catfish: {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            "canBreach|Dark World - Death Mountain",
          ],
        },
      },
    },
    "Cave 45": {
      Open: {
        always: {
          anyOf: [
            "canBootsClip",
            {
              allOf: ["canBreach|Dark World - South", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: ["canReach|Dark World - South", "canBootsClip"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World"],
        },
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
      },
    },
    "Checkerboard Cave": {
      Open: {
        always: {
          allOf: ["glove"],
          anyOf: [
            "canBootsClip",
            {
              allOf: ["canBreach|Dark World - Mire", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: ["canReach|Dark World - Mire", "canBootsClip"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "glove"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Chest Game": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
    },
    "Chicken House": {
      Open: {
        always: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Dark Death Mountain Shop - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
    },
    "Dark Death Mountain Shop - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
    },
    "Dark Death Mountain Shop - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
    },
    "Dark Lake Hylia Shop - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - South"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {},
    },
    "Dark Lake Hylia Shop - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - South"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {},
    },
    "Dark Lake Hylia Shop - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - South"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {},
    },
    "Dark Lumberjack Shop - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
    },
    "Dark Lumberjack Shop - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
    },
    "Dark Lumberjack Shop - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
    },
    "Dark Potion Shop - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "moonpearl"],
          anyOf: ["canBootsClip", "glove", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["canBootsClip", "glove", "hammer", "flippers"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East"],
          anyOf: ["glove", "canBootsClip", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["glove", "canBootsClip", "hammer", "flippers"],
        },
      },
    },
    "Dark Potion Shop - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "moonpearl"],
          anyOf: ["canBootsClip", "glove", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["canBootsClip", "glove", "hammer", "flippers"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East"],
          anyOf: ["glove", "canBootsClip", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["glove", "canBootsClip", "hammer", "flippers"],
        },
      },
    },
    "Dark Potion Shop - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "moonpearl"],
          anyOf: ["canBootsClip", "glove", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["canBootsClip", "glove", "hammer", "flippers"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East"],
          anyOf: ["glove", "canBootsClip", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["glove", "canBootsClip", "hammer", "flippers"],
        },
      },
    },
    "Desert Ledge": {
      Open: {
        scout: {},
        always: {
          anyOf: [
            "book",
            "canBootsClip",
            {
              allOf: ["canBreach|Dark World - Mire", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: [
            "book",
            "canBootsClip",
            {
              allOf: ["canReach|Dark World - Mire", "mirror"],
            },
          ],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World"],
        },
        always: {
          allOf: ["canBreach|Light World"],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBootsClip", "moonpearl"],
            },
            {
              allOf: ["book"],
              anyOf: ["moonpearl", "canMirrorSuperBunny", "canDungeonBunnyRevive"],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World",
            "moonpearl",
            {
              anyOf: ["canBootsClip", "book"],
            },
          ],
        },
      },
    },
    "Digging Game": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - South", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {},
    },
    "Ether Tablet": {
      Open: {
        scout: {
          allOf: ["canBreach|Light World - Upper West Death Mountain", "book"],
        },
        always: {
          allOf: ["canBreach|Light World - Upper West Death Mountain", "book", "canBreakTablets"],
        },
        logical: {
          allOf: ["canReach|Light World - Upper West Death Mountain"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World - Upper West Death Mountain", "book"],
        },
        always: {
          allOf: ["canBreach|Light World - Upper West Death Mountain", "book", "canBreakTablets"],
        },
        logical: {
          allOf: ["canReach|Light World - Upper West Death Mountain"],
        },
      },
    },
    "Floating Island": {
      Open: {
        scout: {
          allOf: ["canBreach|Light World - East Death Mountain"],
        },
        always: {
          anyOf: [
            { allOf: ["canBreach|Light World - East Death Mountain", "canBootsClip"] },
            {
              allOf: ["canBreach|Dark World - Death Mountain", "mirror", "bombs", "moonpearl"],
            },
          ],
        },
        always: {
          anyOf: [
            { allOf: ["canBreach|Light World - East Death Mountain", "canBootsClip"] },
            {
              allOf: ["canBreach|Dark World - Death Mountain", "mirror", "bombs", "moonpearl"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
    },
    "Floodgate Chest": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Flute Spot": {
      Open: {
        always: {
          allOf: ["shovel"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "shovel"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Graveyard Cave": {
      Open: {
        always: {
          anyOf: [
            {
              allOf: ["canBreach|Light World - Lower West Death Mountain", "canBootsClip"],
            },
            {
              allOf: ["canBreach|Dark World - West", "moonpearl", "mirror", "bombs"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: ["canReach|Light World - Lower West Death Mountain", "canBootsClip"],
            },
            {
              allOf: ["canReach|Dark World - West", "moonpearl", "mirror", "bombs"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    Hobo: {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Hookshot Cave - Bottom Left": {
      Open: {
        always: {
          allOf: [
            "canBreach|Dark World - Death Mountain",
            "moonpearl",
            {
              anyOf: [
                "glove",
                {
                  allOf: ["canBootsClip", "bombs"],
                },
              ],
            },
          ],
          anyOf: ["hookshot", "canHover"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain", "hookshot"],
        },
      },
      Inverted: {
        always: {
          allOf: [
            {
              anyOf: ["hookshot", "canHover"],
            },
          ],
          anyOf: [
            {
              allOf: [
                "canBreach|Dark World - Death Mountain",
                {
                  anyOf: [
                    "glove",
                    {
                      allOf: ["canBootsClip", "bombs"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canBreach|Light World - East Death Mountain", "mirror", "bombs"],
            },
          ],
        },
        logical: {
          allOf: ["hookshot"],
          anyOf: [
            {
              allOf: [
                "canReach|Dark World - Death Mountain",
                {
                  anyOf: [
                    "glove",
                    {
                      allOf: ["canBootsClip", "bombs"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canReach|Light World - East Death Mountain", "mirror", "bombs"],
            },
          ],
        },
      },
    },
    "Hookshot Cave - Bottom Right": {
      Open: {
        always: {
          allOf: [
            "canBreach|Dark World - Death Mountain",
            "moonpearl",
            {
              anyOf: [
                "glove",
                {
                  allOf: ["canBootsClip", "bombs"],
                },
              ],
            },
          ],
          anyOf: ["hookshot", "boots"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: [
            {
              anyOf: ["hookshot", "boots"],
            },
          ],
          anyOf: [
            {
              allOf: [
                "canBreach|Dark World - Death Mountain",
                {
                  anyOf: [
                    "glove",
                    {
                      allOf: ["canBootsClip", "bombs"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canBreach|Light World - East Death Mountain", "mirror", "bombs"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: [
                "canReach|Dark World - Death Mountain",
                {
                  anyOf: [
                    "glove",
                    {
                      allOf: ["canBootsClip", "bombs"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canReach|Light World - East Death Mountain", "mirror", "bombs"],
            },
          ],
        },
      },
    },
    "Hookshot Cave - Top Left": {
      Open: {
        always: {
          allOf: [
            "canBreach|Dark World - Death Mountain",
            "moonpearl",
            {
              anyOf: [
                "glove",
                {
                  allOf: ["canBootsClip", "bombs"],
                },
              ],
            },
          ],
          anyOf: ["hookshot", "canHover"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain", "hookshot"],
        },
      },
      Inverted: {
        always: {
          allOf: [
            {
              anyOf: ["hookshot", "canHover"],
            },
          ],
          anyOf: [
            {
              allOf: [
                "canBreach|Dark World - Death Mountain",
                {
                  anyOf: [
                    "glove",
                    {
                      allOf: ["canBootsClip", "bombs"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canBreach|Light World - East Death Mountain", "mirror", "bombs"],
            },
          ],
        },
        logical: {
          allOf: ["hookshot"],
          anyOf: [
            {
              allOf: [
                "canReach|Dark World - Death Mountain",
                {
                  anyOf: [
                    "glove",
                    {
                      allOf: ["canBootsClip", "bombs"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canReach|Light World - East Death Mountain", "mirror", "bombs"],
            },
          ],
        },
      },
    },
    "Hookshot Cave - Top Right": {
      Open: {
        always: {
          allOf: [
            "canBreach|Dark World - Death Mountain",
            "moonpearl",
            {
              anyOf: [
                "glove",
                {
                  allOf: ["canBootsClip", "bombs"],
                },
              ],
            },
          ],
          anyOf: ["hookshot", "canHover"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain", "hookshot"],
        },
      },
      Inverted: {
        always: {
          allOf: [
            {
              anyOf: ["hookshot", "canHover"],
            },
          ],
          anyOf: [
            {
              allOf: [
                "canBreach|Dark World - Death Mountain",
                {
                  anyOf: [
                    "glove",
                    {
                      allOf: ["canBootsClip", "bombs"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canBreach|Light World - East Death Mountain", "mirror", "bombs"],
            },
          ],
        },
        logical: {
          allOf: ["hookshot"],
          anyOf: [
            {
              allOf: [
                "canReach|Dark World - Death Mountain",
                {
                  anyOf: [
                    "glove",
                    {
                      allOf: ["canBootsClip", "bombs"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canReach|Light World - East Death Mountain", "mirror", "bombs"],
            },
          ],
        },
      },
    },
    "Hype Cave - Bottom": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - South", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {
        always: {
          allOf: ["bombs"],
        },
      },
    },
    "Hype Cave - Generous Guy": {
      Open: {
        always: {
          allOf: ["canReach|Dark World - South", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {
        always: {
          allOf: ["bombs"],
        },
      },
    },
    "Hype Cave - Middle Left": {
      Open: {
        always: {
          allOf: ["canReach|Dark World - South", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {
        always: {
          allOf: ["bombs"],
        },
      },
    },
    "Hype Cave - Middle Right": {
      Open: {
        always: {
          allOf: ["canReach|Dark World - South", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {
        always: {
          allOf: ["bombs"],
        },
      },
    },
    "Hype Cave - Top": {
      Open: {
        always: {
          allOf: ["canReach|Dark World - South", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {
        always: {
          allOf: ["bombs"],
        },
      },
    },
    "Hyrule Castle Dungeon (3)": {
      Open: {
        always: [],
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Ice Rod Cave": {
      Open: {
        always: {
          anyOf: ["bombs", "canBootsClip"],
        },
        logical: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Shop - Left": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Shop - Middle": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Shop - Right": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Tavern": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Well - Bottom": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Well - Left": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Well - Middle": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Well - Right": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Well - Top": {
      Open: {
        always: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "King Zora": {
      Open: {
        always: {
          anyOf: ["flippers", "canFakeFlipper", "glove"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
          anyOf: ["flippers", "canFakeFlipper", "glove"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "King's Tomb": {
      Open: {
        always: {
          allOf: ["boots"],
          anyOf: [
            "mitts",
            {
              allOf: ["canBreach|Dark World - West", "moonpearl", "mirror"],
            },
            {
              allOf: ["canBreach|Light World - Lower West Death Mountain", "canBootsClip"],
            },
          ],
        },
        logical: {
          anyOf: [
            "mitts",
            "canReach|Dark World - West",
            {
              allOf: ["canBreach|Light World - Lower West Death Mountain", "canBootsClip"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "boots"],
          anyOf: [
            "mitts",
            "canTombRaider",
            {
              allOf: ["canBreach|Light World - Lower West Death Mountain", "canBootsClip"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World"],
          anyOf: [
            "mitts",
            {
              allOf: ["canBreach|Light World - Lower West Death Mountain", "canBootsClip"],
            },
          ],
        },
      },
    },
    "Lake Hylia Island": {
      Open: {
        scout: {},
        always: {
          anyOf: [
            {
              allOf: ["canBreach|Dark World - East", "mirror", "moonpearl", "flippers"],
            },
            "canBootsClip",
          ],
        },
        logical: {
          anyOf: [{ allOf: ["mirror", "moonpearl", "flippers", "canReach|Dark World - East"] }, "canBootsClip"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World"],
        },
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
          anyOf: ["flippers", "canFakeFlipper", "canBootsClip"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Lake Hylia Shop - Left": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Lake Hylia Shop - Middle": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Lake Hylia Shop - Right": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    Library: {
      Open: {
        scout: {},
        always: {
          allOf: ["boots"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World"],
        },
        always: {
          allOf: ["canBreach|Light World", "boots"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Light World", "moonpearl"],
        },
      },
    },
    "Link's House": {
      Open: {},
      Inverted: {},
    },
    "Link's Uncle": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Lost Woods Hideout": {
      Open: {},
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World"],
        },
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World", "moonpearl"],
        },
      },
    },
    "Lumberjack Tree": {
      Open: {
        scout: {},
        always: {
          allOf: ["agahnim", "boots"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World"],
        },
        always: {
          allOf: ["agahnim", "boots", "moonpearl"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "Magic Bat": {
      Open: {
        always: {
          allOf: [
            {
              anyOf: ["powder", "canFakePowder"],
            },
          ],
          anyOf: [
            "hammer",
            "canMirrorWrap",
            {
              allOf: ["canBreach|Dark World - West", "moonpearl", "mirror", "mitts"],
            },
          ],
        },
        logical: {
          allOf: ["powder"],
          anyOf: [
            "hammer",
            {
              allOf: ["canReach|Dark World - West", "mitts", "moonpearl"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          allOf: [
            "canBreach|Light World",
            "moonpearl",
            {
              anyOf: ["hammer", "canMirrorWrap"],
            },
          ],
          anyOf: ["powder", "canFakePowder"],
        },
        logical: {
          allOf: ["canReach|Light World", "powder", "hammer"],
        },
      },
    },
    "Master Sword Pedestal": {
      Open: {
        scout: {
          allOf: ["book"],
        },
        always: {
          allOf: ["canPullPedestal"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World", "book"],
        },
        always: {
          allOf: ["canBreach|Light World", "canPullPedestal"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Maze Race": {
      Open: {
        scout: {},
        always: {
          anyOf: [
            "canOpenBonkWalls",
            "canBootsClip",
            {
              allOf: ["mirror", "canBreach|Dark World - South"],
            },
          ],
        },
        logical: {
          anyOf: [
            "canOpenBonkWalls",
            "canBootsClip",
            {
              allOf: ["mirror", "canReach|Dark World - South"],
            },
          ],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World"],
        },
        always: {
          allOf: [
            "canBreach|Light World",
            {
              anyOf: [
                "canBootsClip",
                {
                  allOf: ["moonpearl", "canOpenBonkWalls"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Mimic Cave": {
      Open: {
        always: {
          allOf: ["hammer", "mirror"],
        },
      },
      Inverted: {
        always: {
          allOf: ["hammer", "mirror"],
        },
      },
    },
    "Mini Moldorm Cave - Far Left": {
      Open: {
        always: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Mini Moldorm Cave - Far Right": {
      Open: {
        always: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Mini Moldorm Cave - Generous Guy": {
      Open: {
        always: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Mini Moldorm Cave - Left": {
      Open: {
        always: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Mini Moldorm Cave - Right": {
      Open: {
        always: {
          allOf: ["bombs"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "bombs", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Mire Shed - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - Mire"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Dark World - Mire"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Mire"],
        },
        logical: {
          allOf: ["canReach|Dark World - Mire"],
        },
      },
    },
    "Mire Shed - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - Mire"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Dark World - Mire"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Mire"],
        },
        logical: {
          allOf: ["canReach|Dark World - Mire"],
        },
      },
    },
    Mushroom: {
      Open: {},
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World"],
        },
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World", "moonpearl"],
        },
      },
    },
    "Old Man": {
      Open: {
        always: {
          anyOf: ["flute", "glove", "canBreach|Light World - Lower West Death Mountain"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        always: {
          anyOf: ["flute", "glove", "canBreach|Light World - Lower West Death Mountain"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "Paradox Cave Lower - Far Left": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            "canHitRangedSwitch",
            {
              allOf: ["canBootsClip", "canHitSwitch"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain", "canHitRangedSwitch"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            {
              allOf: ["moonpearl", "canHitRangedSwitch"],
            },
            {
              allOf: ["canBootsClip", "moonpearl", "canHitSwitch"],
            },
            {
              allOf: ["canMirrorSuperBunny", "swordbeams"],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World - East Death Mountain",
            {
              anyOf: [
                {
                  allOf: ["moonpearl", "canHitRangedSwitch"],
                },
                {
                  allOf: ["canMirrorSuperBunny", "swordbeams"],
                },
              ],
            },
          ],
        },
      },
    },
    "Paradox Cave Lower - Far Right": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            "canHitRangedSwitch",
            {
              allOf: ["canBootsClip", "canHitSwitch"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain", "canHitRangedSwitch"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            {
              allOf: ["moonpearl", "canHitRangedSwitch"],
            },
            {
              allOf: ["canBootsClip", "moonpearl", "canHitSwitch"],
            },
            {
              allOf: ["canMirrorSuperBunny", "swordbeams"],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World - East Death Mountain",
            {
              anyOf: [
                {
                  allOf: ["moonpearl", "canHitRangedSwitch"],
                },
                {
                  allOf: ["canMirrorSuperBunny", "swordbeams"],
                },
              ],
            },
          ],
        },
      },
    },
    "Paradox Cave Lower - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            "canHitRangedSwitch",
            {
              allOf: ["canBootsClip", "canHitSwitch"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain", "canHitRangedSwitch"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            {
              allOf: ["moonpearl", "canHitRangedSwitch"],
            },
            {
              allOf: ["canBootsClip", "moonpearl", "canHitSwitch"],
            },
            {
              allOf: ["canMirrorSuperBunny", "swordbeams"],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World - East Death Mountain",
            {
              anyOf: [
                {
                  allOf: ["moonpearl", "canHitRangedSwitch"],
                },
                {
                  allOf: ["canMirrorSuperBunny", "swordbeams"],
                },
              ],
            },
          ],
        },
      },
    },
    "Paradox Cave Lower - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            "canHitRangedSwitch",
            {
              allOf: ["canBootsClip", "canHitSwitch"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain", "canHitRangedSwitch"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            {
              allOf: ["moonpearl", "canHitRangedSwitch"],
            },
            {
              allOf: ["canBootsClip", "moonpearl", "canHitSwitch"],
            },
            {
              allOf: ["canMirrorSuperBunny", "swordbeams"],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World - East Death Mountain",
            {
              anyOf: [
                {
                  allOf: ["moonpearl", "canHitRangedSwitch"],
                },
                {
                  allOf: ["canMirrorSuperBunny", "swordbeams"],
                },
              ],
            },
          ],
        },
      },
    },
    "Paradox Cave Lower - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            "canHitRangedSwitch",
            {
              allOf: ["canBootsClip", "canHitSwitch"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain", "canHitRangedSwitch"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
          anyOf: [
            {
              allOf: ["moonpearl", "canHitRangedSwitch"],
            },
            {
              allOf: ["canBootsClip", "moonpearl", "canHitSwitch"],
            },
            {
              allOf: ["canMirrorSuperBunny", "swordbeams"],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World - East Death Mountain",
            {
              anyOf: [
                {
                  allOf: ["moonpearl", "canHitRangedSwitch"],
                },
                {
                  allOf: ["canMirrorSuperBunny", "swordbeams"],
                },
              ],
            },
          ],
        },
      },
    },
    "Paradox Cave Upper - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "moonpearl", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
    },
    "Paradox Cave Upper - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "moonpearl", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
    },
    "Paradox Shop - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "moonpearl", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
    },
    "Paradox Shop - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "moonpearl", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
    },
    "Paradox Shop - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "moonpearl", "bombs"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
    },
    "Peg Cave": {
      Open: {
        always: {
          allOf: ["hammer"],
          anyOf: [
            {
              allOf: ["canBreach|Dark World - East", "moonpearl", "canBootsClip"],
            },
            {
              allOf: ["mitts", "moonpearl"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          allOf: ["hammer"],
          anyOf: [
            "mitts",
            {
              allOf: ["canBreach|Light World", "mirror"],
            },
            {
              allOf: ["canBreach|Dark World - East", "canBootsClip"],
            },
          ],
        },
        logical: {
          anyOf: ["mitts", "canReach|Light World", "canReach|Dark World - East"],
        },
      },
    },
    "Potion Shop": {
      Open: {
        always: {
          allOf: ["mushroom"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "mushroom"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Potion Shop - Left": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Potion Shop - Middle": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Potion Shop - Right": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Purple Chest": {
      Open: {
        always: {
          allOf: ["mitts", "moonpearl"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World",
            {
            anyOf: [
              "mitts",
              "mirror",
            ]
            },
            {
              allOf: ["canBreach|Dark World - East", "moonpearl", "canBootsClip"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    Pyramid: {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
    },
    "Pyramid Fairy - Left": {
      Open: {
        always: {
          anyOf: [
            {
              allOf: ["canBreach|Dark World - South", "canBuyBigBombMaybe"],
              anyOf: [
                {
                  allOf: ["moonpearl", "hammer"],
                },
                {
                  allOf: ["agahnim", "mirror"],
                },
              ],
            },
            {
              allOf: ["canBreach|Light World - Lower West Death Mountain", "mirror", "canBootsClip"],
            },
            {
              allOf: ["canBreach|Dark World - East", "canTamSwam", "moonpearl"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: [
                "canBuyBigBomb",
                {
                  anyOf: [
                    {
                      allOf: ["moonpearl", "hammer"],
                    },
                    {
                      allOf: ["agahnim", "mirror"],
                    },
                  ],
                },
              ],
            },
            "mirror",
          ],
        },
      },
      Inverted: {
        always: {
          allOf: [
            "canBreach|Light World",
            {
              anyOf: [
                "canTamSwam",
                {
                  allOf: ["canBuyBigBombMaybe", "mirror"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canBuyBigBomb", "canReach|Light World"],
        },
      },
    },
    "Pyramid Fairy - Right": {
      Open: {
        always: {
          anyOf: [
            {
              allOf: ["canBreach|Dark World - South", "canBuyBigBombMaybe"],
              anyOf: [
                {
                  allOf: ["moonpearl", "hammer"],
                },
                {
                  allOf: ["agahnim", "mirror"],
                },
              ],
            },
            {
              allOf: ["canBreach|Light World - Lower West Death Mountain", "mirror", "canBootsClip"],
            },
            {
              allOf: ["canBreach|Dark World - East", "canTamSwam", "moonpearl"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: [
                "canBuyBigBomb",
                {
                  anyOf: [
                    {
                      allOf: ["moonpearl", "hammer"],
                    },
                    {
                      allOf: ["agahnim", "mirror"],
                    },
                  ],
                },
              ],
            },
            "mirror",
          ],
        },
      },
      Inverted: {
        always: {
          allOf: [
            "canBreach|Light World",
            {
              anyOf: [
                "canTamSwam",
                {
                  allOf: ["canBuyBigBombMaybe", "mirror"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canBuyBigBomb", "canReach|Light World"],
        },
      },
    },
    "Red Shield Shop - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
    },
    "Red Shield Shop - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
    },
    "Red Shield Shop - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
    },
    Sahasrahla: {
      Open: {
        always: {
          allOf: ["greenpendant"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "greenpendant"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Sahasrahla's Hut - Left": {
      Open: {
        always: {
          allOf: ["canOpenBonkWalls"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: [
            {
              allOf: ["moonpearl", "canOpenBonkWalls"],
            },
            {
              allOf: ["mirror", "boots"],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World",
            {
              anyOf: [
                "mirror",
                {
                  allOf: ["moonpearl", "canOpenBonkWalls"],
                },
              ],
            },
          ],
        },
      },
    },
    "Sahasrahla's Hut - Middle": {
      Open: {
        always: {
          allOf: ["canOpenBonkWalls"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: [
            {
              allOf: ["moonpearl", "canOpenBonkWalls"],
            },
            {
              allOf: ["mirror", "boots"],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World",
            {
              anyOf: [
                "mirror",
                {
                  allOf: ["moonpearl", "canOpenBonkWalls"],
                },
              ],
            },
          ],
        },
      },
    },
    "Sahasrahla's Hut - Right": {
      Open: {
        always: {
          allOf: ["canOpenBonkWalls"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: [
            {
              allOf: ["moonpearl", "canOpenBonkWalls"],
            },
            {
              allOf: ["mirror", "boots"],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World",
            {
              anyOf: [
                "mirror",
                {
                  allOf: ["moonpearl", "canOpenBonkWalls"],
                },
              ],
            },
          ],
        },
      },
    },
    Sanctuary: {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "mirror"],
          logical: {
            allOf: [
              "canReach|Light World",
              {
                anyOf: ["mirror", "moonpearl"],
              },
            ],
          },
        },
      },
    },
    "Secret Passage": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Sick Kid": {
      Open: {
        always: {
          allOf: ["bottle"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "bottle"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Spectacle Rock": {
      Open: {
        scout: {
          allOf: ["canBreach|Light World - Lower West Death Mountain"],
        },
        always: {
          allOf: [
            "canBreach|Light World - Lower West Death Mountain",
            {
              anyOf: ["canBootsClip", "mirror"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World - Lower West Death Mountain"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        always: {
          allOf: ["canBreach|Light World - Upper West Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Light World - Upper West Death Mountain"],
        },
      },
    },
    "Spectacle Rock Cave": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - Lower West Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Light World - Lower West Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
    },
    "Spike Cave": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - Lower West Death Mountain", "moonpearl", "hammer", "glove"],
        },
        required: {
          anyOf: ["cape"],
        },
        logical: {
          allOf: ["canReach|Light World - Lower West Death Mountain"],
          anyOf: [
            "byrna",
            {
              allOf: [
                "cape",
                {
                  anyOf: ["halfmagic", "bottle"],
                },
              ],
            },
          ],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain", "hammer", "glove"],
          anyOf: ["byrna", "cape"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
          anyOf: ["halfmagic", "bottle"],
        },
      },
    },
    "Spiral Cave": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain"],
        },
        // TODO: Check
        logical: {
          allOf: ["canReach|Light World - East Death Mountain", "moonpearl", "canKillOrExplodeMostEnemies"],
        },
      },
    },
    Stumpy: {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - South", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {},
    },
    "Sunken Treasure": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World", "moonpearl"],
        },
      },
    },
    "Superbunny Cave - Bottom": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
    },
    "Superbunny Cave - Top": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
    },
    "Village of Outcasts Shop - Left": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "hammer"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            "hammer",
            {
              allOf: ["canBreach|Light World", "moonpearl", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: ["hammer", "canReach|Light World"],
        },
      },
    },
    "Village of Outcasts Shop - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "hammer"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            "hammer",
            {
              allOf: ["canBreach|Light World", "moonpearl", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: ["hammer", "canReach|Light World"],
        },
      },
    },
    "Village of Outcasts Shop - Right": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "hammer"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            "hammer",
            {
              allOf: ["canBreach|Light World", "moonpearl", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: ["hammer", "canReach|Light World"],
        },
      },
    },
    "Waterfall Fairy - Left": {
      Open: {
        always: {
          anyOf: ["flippers", "canWaterWalk", "moonpearl"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Waterfall Fairy - Right": {
      Open: {
        always: {
          anyOf: ["flippers", "canWaterWalk", "moonpearl"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Zora's Ledge": {
      Open: {
        scout: {
          anyOf: ["flippers", "canWaterWalk", "glove", "canFakeFlipper", "boots"],
        },
        always: {
          anyOf: [
            "flippers",
            "boots",
            {
              allOf: ["canWaterWalk", "moonpearl"],
            },
            {
              allOf: [
                "canZoraSplashDelete",
                {
                  anyOf: ["glove", "canFakeFlipper"],
                },
              ],
            },
          ],
        },
        logical: {
          anyOf: ["flippers", "boots"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World", "moonpearl"],
          anyOf: ["flippers", "canWaterWalk", "glove", "canFakeFlipper"],
        },
        always: {
          allOf: ["canBreach|Light World", "moonpearl"],
          anyOf: [
            "flippers",
            {
              allOf: ["canWaterWalk", "moonpearl"],
            },
            {
              allOf: [
                "canZoraSplashDelete",
                {
                  anyOf: ["glove", "canFakeFlipper"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: [
            "canReach|Light World"
          ],
        },
      },
    },
    "Lost Woods Hideout Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        scout: {
          allOf: ["canBreach|Light World"],
        },
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Death Mountain Bonk Rocks": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
    },
    "Mountain Entry Pull Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Mountain Entry Southeast Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Lost Woods Pass West Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Portal Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Fortune Bonk Rocks": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Pond Tree": {
      Open: {
        always: {
          allOf: ["agahnim", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        always: {
          allOf: ["agahnim", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "Bonk Rocks Tree": {
      Open: {
        always: {
          allOf: ["agahnim", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        always: {
          allOf: ["agahnim", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "Sanctuary Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "River Bend West Tree": {
      Open: {
        always: {
          allOf: ["agahnim", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        always: {
          allOf: ["agahnim", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "River Bend East Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Blinds Hideout Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Kakariko Welcome Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Forgotten Forest Southwest Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Forgotten Forest Central Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Hyrule Castle Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Wooden Bridge Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Eastern Palace Tree": {
      Open: {
        always: {
          allOf: ["agahnim", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        always: {
          allOf: ["agahnim", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "Flute Boy South Tree": {
      Open: {
        always: {
          allOf: ["agahnim", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        always: {
          allOf: ["agahnim", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "Flute Boy East Tree": {
      Open: {
        always: {
          allOf: ["agahnim", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        always: {
          allOf: ["agahnim", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "Central Bonk Rocks Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Tree Line Tree 2": {
      Open: {
        always: {
          allOf: ["agahnim", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        always: {
          allOf: ["agahnim", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "Tree Line Tree 4": {
      Open: {
        always: {
          allOf: ["agahnim", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
      Inverted: {
        always: {
          allOf: ["agahnim", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["lantern"],
        },
      },
    },
    "Flute Boy Approach South Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Flute Boy Approach North Tree": {
      Open: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
    "Dark Lumberjack Tree": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
    },
    "Dark Fortune Bonk Rocks (2)": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
    },
    "Dark Graveyard West Bonk Rocks": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
    },
    "Dark Graveyard North Bonk Rocks": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
    },
    "Dark Graveyard Tomb Bonk Rocks": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
    },
    "Qirn Jump West Tree": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
    },
    "Qirn Jump East Tree": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem", "moonpearl"],
          anyOf: ["glove", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["glove", "hammer", "flippers"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem"],
          anyOf: ["glove", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["glove", "hammer", "flippers"],
        },
      },
    },
    "Dark Witch Tree": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem", "moonpearl"],
          anyOf: ["glove", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["glove", "hammer", "flippers"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem"],
          anyOf: ["glove", "hammer", "flippers", "canZoraSplashDelete"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
          anyOf: ["glove", "hammer", "flippers"],
        },
      },
    },
    "Pyramid Tree": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
    },
    "Palace of Darkness Tree": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
    },
    "Dark Tree Line Tree 2": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
    },
    "Dark Tree Line Tree 3": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
    },
    "Dark Tree Line Tree 4": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - East", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Dark World - East"],
        },
      },
    },
    "Hype Cave Statue": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - South", "canGetBonkableItem", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canGetBonkableItem"],
        },
      },
    },
    "Cold Fairy Statue": {
      Open: {
        always: {
          allOf: ["bombs", "canGetBonkableItem"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "moonpearl", "bombs", "canGetBonkableItem"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
    },
  };
})(window);
