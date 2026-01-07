(function (window) {
  "use strict";

  window.owg_logic_regions = {
    "Light World": {
      Open: {},
      Inverted: {
        always: {
          anyOf: [
            "agahnim",
            {
              allOf: [
                "canBreach|Dark World - Death Mountain",
                {
                  anyOf: [
                    {
                      allOf: ["canBootsClip", "moonpearl"],
                    },
                    "canBunnyCitrus",
                  ],
                },
              ],
            },
            {
              allOf: ["mitts", "flute"],
            },
            {
              allOf: ["mitts", "canBootsClip", "moonpearl"],
            },
            {
              allOf: ["moonpearl", "mitts"],
            },
            {
              allOf: ["moonpearl", "glove", "canBombClip"],
            },
            {
              allOf: ["moonpearl", "glove", "hammer"],
            },
            {
              allOf: [
                "mitts",
                {
                  anyOf: ["flippers", "canZoraSplashDelete", "canQirnJump"],
                },
                "canOWFairyRevive",
              ],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: ["canReach|Dark World - Death Mountain", "canBootsClip", "moonpearl"],
            },
            {
              allOf: ["mitts", "canBootsClip", "moonpearl"],
            },
            {
              allOf: ["agahnim", "lantern"],
            },
            {
              allOf: ["mitts", "flute"],
            },
            {
              allOf: ["moonpearl", "mitts"],
            },
            {
              allOf: ["moonpearl", "glove", "hammer"],
            },
          ],
        },
      },
    },
    "Dark World - East": {
      Open: {
        always: {
          anyOf: [
            "agahnim",
            {
              allOf: [
                "canBreach|Light World - Lower West Death Mountain",
                {
                  anyOf: [
                    {
                      allOf: ["canBootsClip", "moonpearl"],
                    },
                    "canBunnyCitrus",
                    "mirror",
                  ],
                },
              ],
            },
            {
              allOf: [
                "moonpearl",
                "mitts",
                {
                  anyOf: ["flippers", "canWaterWalk", "canZoraSplashDelete", "canQirnJump"],
                },
              ],
            },
            {
              allOf: ["moonpearl", "glove", "hammer"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: [
                "canReach|Light World - Lower West Death Mountain",
                {
                  anyOf: [
                    "mirror",
                    {
                      allOf: ["canBootsClip", "moonpearl"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["agahnim", "lantern"],
            },
            {
              allOf: ["moonpearl", "mitts", "flippers"],
            },
            {
              allOf: ["moonpearl", "glove", "hammer"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            {
              allOf: ["agahnim", "mirror"],
            },
            "hammer",
            "flippers",
            "flute",
            "canZoraSplashDelete",
            "canQirnJump",
            {
              allOf: ["canBootsClip", "moonpearl"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: ["agahnim", "mirror", "lantern"],
            },
            "hammer",
            "flippers",
            "flute",
            {
              allOf: ["canBootsClip", "moonpearl"],
            },
          ],
        },
      },
    },
    "Dark World - West": {
      Open: {
        always: {
          anyOf: [
            {
              allOf: [
                "canBreach|Light World - Lower West Death Mountain",
                {
                  anyOf: [
                    {
                      allOf: ["canBootsClip", "moonpearl"],
                    },
                    "canBunnyCitrus",
                    "mirror",
                  ],
                },
              ],
            },
            {
              allOf: ["moonpearl"],
              anyOf: [
                "mitts",
                {
                  allOf: ["glove", "hammer"],
                },
                {
                  allOf: [
                    "agahnim",
                    "hookshot",
                    {
                      anyOf: ["hammer", "glove", "flippers", "canZoraSplashDelete"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          anyOf: [
            "mitts",
            {
              allOf: [
                "canReach|Light World - Lower West Death Mountain",
                {
                  anyOf: [
                    "mirror",
                    {
                      allOf: ["canBootsClip", "moonpearl"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["glove", "hammer"],
            },
            {
              allOf: [
                "agahnim",
                "lantern",
                "hookshot",
                {
                  anyOf: ["hammer", "glove", "flippers"],
                },
              ],
            },
          ],
        },
      },
      Inverted: {},
    },
    "Dark World - South": {
      Open: {
        always: {
          anyOf: [
            "canBreach|Dark World - West",
            {
              allOf: ["agahnim", "moonpearl", "hammer"],
            },
          ],
        },
        logical: {
          anyOf: [
            "canReach|Dark World - West",
            {
              allOf: ["agahnim", "moonpearl", "hammer", "lantern"],
            },
          ],
        },
      },
      Inverted: {},
    },
    "Light World - Lower West Death Mountain": {
      Open: {
        always: {
          anyOf: [
            "canBootsClip",
            "flute",
            {
              allOf: [
                "glove",
                {
                  anyOf: ["lantern", "canDarkRoomNavigateBlind"],
                },
              ],
            },
          ],
        },
        logical: {
          anyOf: ["lantern", "canBootsClip", "flute"],
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
    "Light World - Upper West Death Mountain": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - Lower West Death Mountain"],
          anyOf: [
            "mirror",
            "canBootsClip",
            {
              allOf: [
                "hammer",
                {
                  anyOf: ["hookshot", "canFairyReviveHover"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World - Lower West Death Mountain"],
          anyOf: [
            "mirror",
            "canBootsClip",
            {
              allOf: ["hammer", "hookshot"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            {
              allOf: ["canBreach|Light World - East Death Mountain", "moonpearl", "hammer"],
            },
            {
              allOf: ["canBreach|Light World - Lower West Death Mountain", "canBootsClip", "moonpearl"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: ["canReach|Light World - East Death Mountain"],
            },
            {
              allOf: ["canReach|Light World - Lower West Death Mountain", "canBootsClip", "moonpearl"],
            },
          ],
        },
      },
    },
    "Light World - East Death Mountain": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - Lower West Death Mountain"],
          anyOf: [
            "hookshot",
            "canBootsClip",
            "canFairyReviveHover",
            {
              allOf: ["mirror", "hammer"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World - Lower West Death Mountain"],
          anyOf: [
            "canBootsClip",
            "hookshot",
            {
              allOf: ["mirror", "hammer"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain"],
          anyOf: [
            "mitts",
            {
              allOf: [
                "moonpearl",
                {
                  anyOf: ["hookshot", "canFairyReviveHover", "canBootsClip"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
        },
      },
    },
    "Dark World - Death Mountain": {
      Open: {
        always: {
          anyOf: [
            {
              allOf: [
                "canBreach|Light World - East Death Mountain",
                {
                  anyOf: [
                    "mirror",
                    "mitts",
                    {
                      allOf: ["canBootsClip", "hammer"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: [
                "canReach|Light World - Lower West Death Mountain",
                {
                  anyOf: [
                    "mirror",
                    {
                      allOf: ["canBootsClip", "moonpearl"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canBreach|Dark World - West", "canBootsClip", "moonpearl"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: ["canReach|Light World - East Death Mountain"],
            },
            {
              allOf: ["canReach|Dark World - West", "canBootsClip", "moonpearl"],
            },
            {
              allOf: ["canReach|Light World - Lower West Death Mountain", "canBootsClip", "moonpearl"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            "flute",
            "canBootsClip",
            {
              allOf: [
                "glove",
                {
                  anyOf: ["canDarkRoomNavigateBlind", "lantern"],
                },
              ],
            },
          ],
        },
        logical: {
          anyOf: [
            "flute",
            "canBootsClip",
            {
              allOf: ["glove", "lantern"],
            },
          ],
        },
      },
    },
    "Dark World - Mire": {
      Open: {
        always: {
          anyOf: [
            {
              allOf: ["canBreach|Dark World - West", "canBootsClip", "moonpearl"],
            },
            {
              allOf: ["flute", "mitts"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            "canBootsClip",
            {
              allOf: ["flute", "mitts"],
            },
            {
              allOf: ["canBreach|Light World", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: [
            "canBootsClip",
            {
              allOf: ["flute", "mitts"],
            },
            {
              allOf: ["canReach|Light World", "mirror"],
            },
          ],
        },
      },
    },
    "Hyrule Castle - Main": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
      Entrance: ["hc_m", "hc_e", "hc_w"],
    },
    "Hyrule Castle - Sewers Dropdown": {
      Open: {
        always: {
          anyOf: ["glove", "canTamSwam"],
        },
        logical: {
          allOf: ["glove"],
        },
      },
      Inverted: {
        always: {
          allOf: [
            "canBreach|Light World",
            "moonpearl",
            {
              anyOf: ["glove", "canTamSwam"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
      Entrance: ["exception|sewers"],
    },
    Sanctuary: {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
        logical: {
          allOf: ["canReach|Light World"],
          anyOf: ["moonpearl", "canMirrorSuperBunny"],
        },
      },
      Entrance: ["sanc"],
    },
    "Eastern Palace": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
      Entrance: ["ep"],
    },
    "Desert Palace - Main": {
      Open: {
        always: {
          anyOf: [
            "canBootsClip",
            "book",
            {
              allOf: ["canBreach|Dark World - Mire", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: ["book", "canReach|Dark World - Mire", "canBootsClip"],
        },
      },
      Inverted: {
        always: {
          allOf: [
            "canBreach|Light World",
            {
              anyOf: [
                "book",
                {
                  allOf: ["canBootsClip", "moonpearl"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: [
            "canBreach|Light World",
            {
              anyOf: [
                "book",
                {
                  allOf: ["canBootsClip", "moonpearl"],
                },
              ],
            },
          ],
        },
      },
      Entrance: ["dp_e", "dp_w", "dp_m"],
    },
    "Desert Palace - North": {
      Open: {
        always: {
          anyOf: [
            "canBootsClip",
            {
              allOf: ["book", "glove"],
            },
            {
              allOf: ["canBreach|Dark World - Mire", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: [
            "canBootsClip",
            {
              allOf: ["book", "glove"],
            },
            {
              allOf: ["canReach|Dark World - Mire", "mirror"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            {
              allOf: ["canBreach|Light World", "canBootsClip", "moonpearl"],
            },
            {
              allOf: ["canBreach|Light World", "book", "glove"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
      Entrance: ["dp_n"],
    },
    "Tower of Hera": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - Upper West Death Mountain", "canHitSwitch"],
        },
        logical: {
          allOf: ["canReach|Light World - Upper West Death Mountain"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - Upper West Death Mountain", "canHitSwitch", { anyOf: ["moonpearl", "canMirrorSuperBunny"] }],
        },
        logical: {
          allOf: ["canReach|Light World - Upper West Death Mountain"],
        },
      },
      Entrance: ["toh"],
    },
    "Palace of Darkness": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - East"],
          anyOf: ["moonpearl", "canOWFairyRevive"],
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
      Entrance: ["pod"],
    },
    "Swamp Palace": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - South", "moonpearl", "mirror"],
        },
        logical: {
          allOf: ["canReach|Dark World - South"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "mirror"],
        },
        logical: {
          allOf: ["canReach|Light World"],
        },
      },
      Entrance: ["sp"],
    },
    "Skull Woods - Main": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
      Entrance: ["sw_m"],
    },
    "Skull Woods - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
      Entrance: ["sw_e", "sw_w"],
    },
    "Skull Woods - Back": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "firerod"],
          anyOf: ["canBunnyPocket"],
        },
        logical: {
          allOf: [
            "canReach|Dark World - West",
            {
              anyOf: ["moonpearl", "canBunnyPocket"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          allOf: ["firerod"],
        },
      },
      Entrance: ["sw"],
    },
    "Skull Woods - Drops": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
      Entrance: ["exception|swdrops"],
    },
    "Thieves Town": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Dark World - West"],
        },
      },
      Inverted: {},
      Entrance: ["tt"],
    },
    "Ice Palace": {
      Open: {
        always: {
          allOf: ["mitts"],
          anyOf: ["flippers", "canFakeFlipper", "canWaterWalk"],
        },
        logical: {
          allOf: ["mitts"],
        },
      },
      Inverted: {
        always: {
          anyOf: ["canQirnJump", "canZoraSplashDelete", "flippers", "canFakeFlipper"],
        },
      },
      Entrance: ["ip"],
    },
    "Misery Mire": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - Mire"],
          anyOf: ["moonpearl", "canOWFairyRevive"],
        },
        logical: {
          allOf: ["canReach|Dark World - Mire", "moonpearl"],
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
      Entrance: ["mm"],
    },
    "Turtle Rock - Main": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "hammer", "mitts", "moonpearl"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
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
      Entrance: ["tr_m"],
    },
    "Turtle Rock - West": {
      Open: {
        always: {
          allOf: [
            "canBreach|Dark World - Death Mountain",
            {
              anyOf: [
                {
                  allOf: ["canBootsClip", "moonpearl"],
                },
                "mirror",
              ],
            },
          ],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            { 
              allOf: ["canBreach|Light World - East Death Mountain", "mirror"] 
            },
            "canBootsClip",
          ],
        },
        logical: {
          anyOf: ["canReach|Light World - East Death Mountain", "canBootsClip"],
        },
      },
      Entrance: ["tr_w"],
    },
    "Turtle Rock - East": {
      Open: {
        always: {
          allOf: [
            "canBreach|Dark World - Death Mountain",
            {
              anyOf: [
                {
                  allOf: ["canBootsClip", "moonpearl"],
                },
                "mirror",
              ],
            },
          ],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            { 
              allOf: ["canBreach|Light World - East Death Mountain", "mirror"] 
            },
            "canBootsClip",
          ],
        },
        logical: {
          anyOf: ["canReach|Light World - East Death Mountain", "canBootsClip"],
        },
      },
      Entrance: ["tr_e"],
    },
    "Turtle Rock - Back": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - Lower West Death Mountain", "canMirrorWrap"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "mirror"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
      Entrance: ["tr_b"],
    },
    "Ganons Tower": {
      Open: {
        always: {
          anyOf: [
            {
              allOf: ["canBreach|Dark World - Death Mountain"],
              anyOf: ["moonpearl", "canBunnyCitrus"],
            },
            {
              allOf: ["canBreach|Light World - Lower West Death Mountain", "canBunnyCitrus"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain", "moonpearl"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "canOpenGT"],
          anyOf: ["moonpearl", "canDungeonBunnyRevive"],
        },
        logical: {
          allOf: ["canReach|Light World", "canOpenGT", "moonpearl"],
        },
      },
      Entrance: ["gt"],
    },
    "Castle Tower": {
      Open: {
        always: {
          anyOf: [
            "canDestroyEnergyBarrier",
            "cape",
            {
              allOf: ["canBreach|Dark World - East", "canFairyBarrierRevive"],
            },
            "canShockBlock",
          ],
        },
        logical: {
          anyOf: ["canDestroyEnergyBarrier", "cape"],
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
      Entrance: ["ct"],
    },
    Placeholder: {
      Open: {
        logical: {
          allOf: [],
        },
      },
      Inverted: {
        logical: {
          allOf: [],
        },
      },
      Entrance: [],
    },
  };
})(window);
