(function (window) {
  "use strict";

  window.logic_regions = {
    "Light World": {
      Open: {},
      Inverted: {
        always: {
          anyOf: [
            "agahnim",
            {
              allOf: ["mitts", "flute"],
            },
            {
              allOf: ["moonpearl", "mitts"],
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
            {
              allOf: ["mitts", "moonpearl", "mirror"],
            },
            "hammer",
            "flippers",
            "flute",
            "canZoraSplashDelete",
            "canQirnJump",
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: ["agahnim", "mirror", "lantern"],
            },
            {
              allOf: ["mitts", "moonpearl", "mirror"],
            },
            "hammer",
            "flippers",
            "flute",
          ],
        },
      },
    },
    "Dark World - West": {
      Open: {
        always: {
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
        logical: {
          anyOf: [
            "mitts",
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
            "flute",
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
            {
              allOf: ["glove", "lantern"],
            },
          ],
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
            {
              allOf: ["hammer", "hookshot"],
            },
          ],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "moonpearl", "hammer"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
    },
    "Light World - East Death Mountain": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - Lower West Death Mountain"],
          anyOf: [
            "hookshot",
            "canFairyReviveHover",
            {
              allOf: ["mirror", "hammer"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Light World - Lower West Death Mountain"],
          anyOf: [
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
                  anyOf: ["hookshot", "canFairyReviveHover"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Dark World - Death Mountain"],
          anyOf: [
            "mitts",
            {
              allOf: ["moonpearl", "hookshot"],
            },
          ],
        },
      },
    },
    "Dark World - Death Mountain": {
      Open: {
        always: {
          allOf: ["canBreach|Light World - East Death Mountain", "mitts"],
        },
        logical: {
          allOf: ["canReach|Light World - East Death Mountain"],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            "flute",
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
          allOf: ["flute", "mitts"],
        },
      },
      Inverted: {
        always: {
          anyOf: [
            "flute",
            {
              allOf: ["canBreach|Light World", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: [
            "flute",
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
          allOf: ["canBreach|Light World", "canDungeonBunnyRevive"],
        },
        logical: {
          allOf: ["canReach|Light World", "moonpearl"],
        },
      },
      Entrance: ["hc_m", "hc_e", "hc_w"],
    },
    "Hyrule Castle - Sewers Dropdown": {
      Open: {
        always: {
          allOf: ["glove"],
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
          allOf: ["canReach|Light World", "moonpearl"],
        },
      },
      Entrance: ["sanc"],
    },
    "Eastern Palace": {
      Open: {},
      Inverted: {
        always: {
          allOf: ["canBreach|Light World"],
          anyOf: ["moonpearl", "canDungeonBunnyRevive"],
        },
        logical: {
          allOf: ["canReach|Light World", "moonpearl"],
        },
      },
      Entrance: ["ep"],
    },
    "Desert Palace - Main": {
      Open: {
        always: {
          anyOf: [
            "book",
            {
              allOf: ["canBreach|Dark World - Mire", "mirror"],
            },
          ],
        },
        logical: {
          anyOf: ["book", "canReach|Dark World - Mire"],
        },
      },
      Inverted: {
        always: {
          allOf: ["canBreach|Light World", "book"],
          anyOf: ["moonpearl", "canDungeonBunnyRevive"],
        },
        logical: {
          allOf: ["canReach|Light World", "moonpearl"],
        },
      },
      Entrance: ["dp_e", "dp_w", "dp_m"],
    },
    "Desert Palace - North": {
      Open: {
        always: {
          anyOf: [
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
          allOf: ["canBreach|Light World", "book", "glove"],
          anyOf: ["moonpearl", "canDungeonBunnyRevive"],
        },
        logical: {
          allOf: ["canReach|Light World", "moonpearl"],
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
          allOf: ["canBreach|Light World - Upper West Death Mountain", "moonpearl", "canHitSwitch"],
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
          anyOf: ["moonpearl", "canDungeonBunnyRevive"],
        },
        logical: {
          allOf: ["canReach|Dark World - West", "moonpearl"],
        },
      },
      Inverted: {},
      Entrance: ["sw_m"],
    },
    "Skull Woods - Middle": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West"],
          anyOf: ["moonpearl", "canDungeonBunnyRevive"],
        },
        logical: {
          allOf: ["canReach|Dark World - West", "moonpearl"],
        },
      },
      Inverted: {},
      Entrance: ["sw_e", "sw_w"],
    },
    "Skull Woods - Back": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - West", "firerod"],
          anyOf: [
            "moonpearl",
            {
              allOf: ["canDungeonBunnyRevive", "canBunnyPocket"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Dark World - West", "moonpearl"],
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
          anyOf: ["moonpearl", "canDungeonBunnyRevive"],
        },
        logical: {
          allOf: ["canReach|Dark World - West", "moonpearl"],
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
          allOf: [
            "mitts",
            {
              anyOf: ["moonpearl", "canDungeonBunnyRevive"],
            },
          ],
          anyOf: ["flippers", "canFakeFlipper", "canWaterWalk"],
        },
        logical: {
          allOf: ["mitts", "moonpearl", "flippers"],
        },
      },
      Inverted: {
        always: {
          anyOf: ["canQirnJump", "canZoraSplashDelete", "flippers"],
        },
        logical: {
          allOf: ["flippers"],
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
          allOf: ["canBreach|Dark World - Death Mountain", "canSpinSpeedClip"],
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
      Entrance: ["tr_w"],
    },
    "Turtle Rock - East": {
      Open: {
        always: {
          allOf: ["canBreach|Dark World - Death Mountain", "canSpinSpeedClip"],
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
      Entrance: ["tr_e"],
    },
    "Turtle Rock - Back": {
      Open: {
        always: {
          allOf: ["canReachTurtleRockBackOpen"],
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
          allOf: ["canBreach|Dark World - Death Mountain", "canOpenGT"],
          anyOf: ["moonpearl", "canDungeonBunnyRevive"],
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
