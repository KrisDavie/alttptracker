(function (window) {
  "use strict";

  window.logic_dungeon_keydrop = {
    "Desert Palace": {
      "Desert Palace - Beamos Hall Pot Key": {
        always: {
          allOf: ["canBreach|Desert Palace - North", "keys|1", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - North", "keys|2"],
        },
      },
      "Desert Palace - Big Chest": {
        always: {
          allOf: ["canBreach|Desert Palace - Main", "bigkey"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - Main"],
        },
      },
      "Desert Palace - Big Key Chest": {
        always: {
          allOf: ["canBreach|Desert Palace - Main", "keys|1", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|4"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - Main", "keys|4"],
        },
      },
      "Desert Palace - Boss": {
        always: {
          allOf: ["canBreach|Desert Palace - North", "bigkey", "keys|3", "canKillBoss", "canLightFires", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|3"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - North", "keys|4"],
        },
      },
      "Desert Palace - Prize": {
        always: {
          allOf: ["canBreach|Desert Palace - North", "bigkey", "keys|3", "canKillBoss", "canLightFires", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|3"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - North", "keys|4"],
        },
      },
      "Desert Palace - Compass Chest": {
        always: {
          allOf: ["canBreach|Desert Palace - Main", "keys|1"],
        },
        required: {
          allOf: ["keys|4"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - Main", "keys|4"],
        },
      },
      "Desert Palace - Desert Tiles 1 Pot Key": {
        always: {
          allOf: ["canBreach|Desert Palace - North"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - North"],
        },
      },
      "Desert Palace - Desert Tiles 2 Pot Key": {
        always: {
          allOf: ["canBreach|Desert Palace - North", "keys|2", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - North", "keys|3"],
        },
      },
      "Desert Palace - Map Chest": {
        always: {
          allOf: ["canBreach|Desert Palace - Main"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - Main"],
        },
      },
      "Desert Palace - Torch": {
        always: {
          allOf: ["canBreach|Desert Palace - Main", "boots"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - Main"],
        },
      },
    },
    "Castle Tower": {
      "Castle Tower - Circle of Pots Key Drop": {
        always: {
          allOf: ["canBreach|Castle Tower", "keys|3", "canKillMostEnemies", "canDarkRoomNavigateBlind"],
        },
        logical: {
          allOf: ["canReach|Castle Tower", "canDarkRoomNavigate"],
        },
      },
      "Castle Tower - Dark Archer Key Drop": {
        always: {
          allOf: ["canBreach|Castle Tower", "keys|2", "canKillMostEnemies", "canDarkRoomNavigateBlind"],
        },
        logical: {
          allOf: ["canReach|Castle Tower", "canDarkRoomNavigate"],
        },
      },
      "Castle Tower - Dark Maze": {
        always: {
          allOf: ["canBreach|Castle Tower", "keys|1", "canKillMostEnemies", "canDarkRoomNavigateBlind"],
        },
        logical: {
          allOf: ["canReach|Castle Tower", "canDarkRoomNavigate"],
        },
      },
      "Castle Tower - Room 03": {
        always: {
          allOf: ["canBreach|Castle Tower", "canKillOrExplodeMostEnemies"],
        },
        logical: {
          allOf: ["canReach|Castle Tower", "canKillMostEnemies"],
        },
      },
      "Castle Tower - Boss": {
        always: {
          allOf: ["canBreach|Castle Tower", "keys|4", "canKillMostEnemies", "canDefeatCurtains", "canFightAgahnim", "canDarkRoomNavigateBlind"],
        },
        logical: {
          allOf: ["canReach|Castle Tower", "canDarkRoomNavigate"],
        },
      },
    },
    "Eastern Palace": {
      "Eastern Palace - Big Chest": {
        always: {
          allOf: ["canBreach|Eastern Palace", "bigkey"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace"],
        },
      },
      "Eastern Palace - Big Key Chest": {
        always: {
          allOf: ["canBreach|Eastern Palace", "keys|1", "canDarkRoomNavigateBlind"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace", "keys|2", "canDarkRoomNavigate", "canKillOrExplodeMostEnemies"],
        },
      },
      "Eastern Palace - Boss": {
        always: {
          allOf: ["canBreach|Eastern Palace", "bigkey", "keys|1", "canKillBoss", "bow", "canTorchRoomNavigateBlind"],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace", "keys|2", "canTorchRoomNavigate"],
        },
      },
      "Eastern Palace - Prize": {
        always: {
          allOf: ["canBreach|Eastern Palace", "bigkey", "keys|1", "canKillBoss", "bow", "canTorchRoomNavigateBlind"],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace", "keys|2", "canTorchRoomNavigate"],
        },
      },
      "Eastern Palace - Cannonball Chest": {
        always: {
          allOf: ["canBreach|Eastern Palace"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace"],
        },
      },
      "Eastern Palace - Compass Chest": {
        always: {
          allOf: ["canBreach|Eastern Palace"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace"],
        },
      },
      "Eastern Palace - Dark Eyegore Key Drop": {
        always: {
          allOf: ["canBreach|Eastern Palace", "bigkey", "canTorchRoomNavigateBlind"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace", "canTorchRoomNavigate"],
        },
      },
      "Eastern Palace - Dark Square Pot Key": {
        always: {
          allOf: ["canBreach|Eastern Palace", "canDarkRoomNavigateBlind"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace", "canDarkRoomNavigate"],
        },
      },
      "Eastern Palace - Map Chest": {
        always: {
          allOf: ["canBreach|Eastern Palace"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace"],
        },
        superlogic: {
          allOf: ["hookshot"],
        },
      },
    },
    "Ganons Tower": {
      "Ganons Tower - Big Chest": {
        always: {
          allOf: ["canBreach|Ganons Tower", "bigkey", "keys|2"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: [
                "keys|2",
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
                "keys|3",
                "somaria",
                "canLightFires",
                {
                  anyOf: [
                    "firerod",
                    {
                      anyOf: ["canHover", "canBombJump"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7"],
          anyOf: ["gtleft", "gtright"],
        },
      },
      "Ganons Tower - Big Key Chest": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|2", "bombs", "canKillArmos"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: [
                "keys|2",
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
                "keys|3",
                "somaria",
                "canLightFires",
                {
                  anyOf: [
                    "firerod",
                    {
                      anyOf: ["canHover", "canBombJump"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "canKillArmos", "bombs"],
          anyOf: ["gtleft", "gtright"],
        },
      },
      "Ganons Tower - Big Key Room - Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|2", "bombs", "canKillArmos"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: [
                "keys|2",
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
                "keys|3",
                "somaria",
                "canLightFires",
                {
                  anyOf: [
                    "firerod",
                    {
                      anyOf: ["canHover", "canBombJump"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "canKillArmos", "bombs"],
          anyOf: ["gtleft", "gtright"],
        },
      },
      "Ganons Tower - Big Key Room - Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|2", "bombs", "canKillArmos"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: [
                "keys|2",
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
                "keys|3",
                "somaria",
                "canLightFires",
                {
                  anyOf: [
                    "firerod",
                    {
                      anyOf: ["canHover", "canBombJump"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "canKillArmos", "bombs"],
          anyOf: ["gtleft", "gtright"],
        },
      },
      "Ganons Tower - Bob's Chest": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|2"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: [
                "keys|2",
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
                "keys|3",
                "somaria",
                "canLightFires",
                {
                  anyOf: [
                    "firerod",
                    {
                      anyOf: ["canHover", "canBombJump"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7"],
          anyOf: ["gtleft", "gtright"],
        },
      },
      "Ganons Tower - Bob's Torch": {
        always: {
          allOf: ["canBreach|Ganons Tower", "boots"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower"],
        },
      },
      "Ganons Tower - Compass Room - Bottom Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|1", "somaria", "canLightFires"],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            "firerod",
            {
              anyOf: ["canHover", "canBombJump"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "firerod"],
        },
      },
      "Ganons Tower - Compass Room - Bottom Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|1", "somaria", "canLightFires"],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            "firerod",
            {
              anyOf: ["canHover", "canBombJump"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "firerod"],
        },
      },
      "Ganons Tower - Compass Room - Top Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|1", "somaria", "canLightFires"],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            "firerod",
            {
              anyOf: ["canHover", "canBombJump"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "firerod"],
        },
      },
      "Ganons Tower - Compass Room - Top Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|1", "somaria", "canLightFires"],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            "firerod",
            {
              anyOf: ["canHover", "canBombJump"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "firerod"],
        },
      },
      "Ganons Tower - Conveyor Cross Pot Key": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|1", "somaria", "canLightFires"],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            "firerod",
            {
              anyOf: ["canHover", "canBombJump"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "firerod"],
        },
      },
      "Ganons Tower - Conveyor Star Pits Pot Key": {
        always: {
          allOf: ["canBreach|Ganons Tower"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower"],
        },
      },
      "Ganons Tower - DMs Room - Bottom Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot"],
        },
      },
      "Ganons Tower - DMs Room - Bottom Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot"],
        },
      },
      "Ganons Tower - DMs Room - Top Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot"],
        },
      },
      "Ganons Tower - DMs Room - Top Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot"],
        },
      },
      "Ganons Tower - Double Switch Pot Key": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer", "canHitRangedSwitch"],
          anyOf: ["hookshot", "boots", "canBombJump"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower"],
          anyOf: ["hookshot", "boots"],
        },
      },
      "Ganons Tower - Firesnake Room": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|1", "hammer", "canHitRangedSwitch"],
          anyOf: ["hookshot", "boots", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "hookshot"],
        },
      },
      "Ganons Tower - Hope Room - Left": {
        always: {
          allOf: ["canBreach|Ganons Tower"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower"],
        },
      },
      "Ganons Tower - Hope Room - Right": {
        always: {
          allOf: ["canBreach|Ganons Tower"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower"],
        },
      },
      "Ganons Tower - Map Chest": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|1", "hammer"],
          anyOf: ["hookshot", "boots", "canBombJump"],
        },
        required: {
          allOf: ["keys|5"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|8"],
          anyOf: ["hookshot", "boots"],
        },
      },
      "Ganons Tower - Mini Helmasaur Key Drop": {
        always: {
          allOf: ["canBreach|Ganons Tower", "bigkey", "canLightFires"],
          anyOf: [
            "bow",
            {
              allOf: ["canMimicClip", "canKillMostEnemies"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "bow"],
        },
      },
      "Ganons Tower - Mini Helmasaur Room - Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "bigkey", "canLightFires"],
        },
        required: {
          anyOf: [
            "bow",
            {
              allOf: ["canMimicClip", "canKillMostEnemies"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "bow"],
        },
      },
      "Ganons Tower - Mini Helmasaur Room - Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "bigkey", "canLightFires"],
        },
        required: {
          anyOf: [
            "bow",
            {
              allOf: ["canMimicClip", "canKillMostEnemies"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "bow"],
        },
      },
      "Ganons Tower - Pre-Moldorm Chest": {
        always: {
          allOf: ["canBreach|Ganons Tower", "bigkey", "keys|1", "canLightFires", "bombs"],
          anyOf: [
            "bow",
            {
              allOf: ["canMimicClip", "canKillMostEnemies"],
            },
          ],
        },
        required: {
          allOf: ["keys|3"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|7", "bow"],
        },
      },
      "Ganons Tower - Randomizer Room - Bottom Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|2", "hammer", "bombs"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot", "keys|8"],
        },
      },
      "Ganons Tower - Randomizer Room - Bottom Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|2", "hammer", "bombs"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot", "keys|8"],
        },
      },
      "Ganons Tower - Randomizer Room - Top Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|2", "hammer", "bombs"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot", "keys|8"],
        },
      },
      "Ganons Tower - Randomizer Room - Top Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "keys|2", "hammer", "bombs"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot", "keys|8"],
        },
      },
      "Ganons Tower - Tile Room": {
        always: {
          allOf: ["canBreach|Ganons Tower", "somaria"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower"],
        },
      },
      "Ganons Tower - Validation Chest": {
        always: {
          allOf: [
            "canBreach|Ganons Tower",
            "bigkey",
            "keys|2",
            "canLightFires",
            "melee",
            "bombs",
            {
              anyOf: ["hookshot", "canHover"],
            },
          ],
          anyOf: [
            "bow",
            {
              allOf: ["canMimicClip", "canKillMostEnemies"],
            },
          ],
        },
        required: {
          allOf: ["keys|3"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|8", "bow", "hookshot"],
        },
      },
      "Ganons Tower - Boss": {
        always: {
          allOf: [
            "canBreach|Ganons Tower",
            "bigkey",
            "keys|2",
            "canFightAgahnim",
            "canLightFires",
            "bombs",
            {
              anyOf: [
                {
                  allOf: ["melee", "hookshot"],
                },
                "canHover",
                "canMoldormBounce",
              ],
            },
          ],
          anyOf: [
            "bow",
            {
              allOf: ["canMimicClip", "canKillMostEnemies"],
            },
          ],
        },
        required: {
          allOf: ["keys|3"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "bow", "keys|8", "melee", "hookshot"],
        },
      },
    },
    "Hyrule Castle": {
      "Hyrule Castle - Big Key Drop": {
        always: {
          allOf: ["canBreach|Hyrule Castle - Main", "keys|2", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|3"],
        },
        logical: {
          allOf: ["canBreach|Hyrule Castle - Main", "keys|4"],
        },
      },
      "Hyrule Castle - Boomerang Chest": {
        always: {
          allOf: ["canBreach|Hyrule Castle - Main", "keys|1", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Hyrule Castle - Main", "keys|3"],
        },
      },
      "Hyrule Castle - Boomerang Guard Key Drop": {
        always: {
          allOf: ["canBreach|Hyrule Castle - Main", "keys|1", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Hyrule Castle - Main", "keys|3"],
        },
      },
      "Hyrule Castle - Key Rat Key Drop": {
        always: {
          allOf: ["keys|1", "canKillOrExplodeMostEnemies", "canTorchRoomNavigateBlind"],
          anyOf: ["canBreach|Hyrule Castle - Main", "canBreach|Hyrule Castle - Sewers Dropdown"],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["keys|3", "canTorchRoomNavigate"],
          anyOf: ["canReach|Hyrule Castle - Main", "canReach|Hyrule Castle - Sewers Dropdown"],
        },
      },
      "Hyrule Castle - Map Chest": {
        always: {
          allOf: ["canBreach|Hyrule Castle - Main"],
        },
        logical: {
          allOf: ["canReach|Hyrule Castle - Main"],
        },
      },
      "Hyrule Castle - Map Guard Key Drop": {
        always: {
          allOf: ["canBreach|Hyrule Castle - Main", "canKillOrExplodeMostEnemies"],
        },
        logical: {
          allOf: ["canReach|Hyrule Castle - Main"],
        },
      },
      "Hyrule Castle - Zelda's Chest": {
        always: {
          allOf: ["canBreach|Hyrule Castle - Main", "bigkey", "keys|2", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|3"],
        },
        logical: {
          allOf: ["canReach|Hyrule Castle - Main", "keys|4"],
        },
      },
      "Sewers - Dark Cross": {
        always: {
          allOf: ["canTorchRoomNavigateBlind"],
          anyOf: [
            "canBreach|Hyrule Castle - Main",
            {
              allOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|2"],
            },
          ],
        },
        required: {
          anyOf: [
            "canBreach|Hyrule Castle - Main",
            {
              allOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|4"],
            },
          ],
        },
        logical: {
          allOf: ["canTorchRoomNavigate"],
          anyOf: [
            "canReach|Hyrule Castle - Main",
            {
              allOf: ["canReach|Hyrule Castle - Sewers Dropdown", "keys|4"],
            },
          ],
        },
      },
      "Sewers - Secret Room - Left": {
        always: {
          allOf: ["canOpenBonkWalls"],
          anyOf: [
            "canBreach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canBreach|Hyrule Castle - Main", "keys|2", "canTorchRoomNavigateBlind"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|4"],
        },
        logical: {
          anyOf: [
            "canReach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canReach|Hyrule Castle - Main", "keys|4", "canTorchRoomNavigate"],
            },
          ],
        },
      },
      "Sewers - Secret Room - Middle": {
        always: {
          allOf: ["canOpenBonkWalls"],
          anyOf: [
            "canBreach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canBreach|Hyrule Castle - Main", "keys|2", "canTorchRoomNavigateBlind"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|4"],
        },
        logical: {
          anyOf: [
            "canReach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canReach|Hyrule Castle - Main", "keys|4", "canTorchRoomNavigate"],
            },
          ],
        },
      },
      "Sewers - Secret Room - Right": {
        always: {
          allOf: ["canOpenBonkWalls"],
          anyOf: [
            "canBreach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canBreach|Hyrule Castle - Main", "keys|2", "canTorchRoomNavigateBlind"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|4"],
        },
        logical: {
          anyOf: [
            "canReach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canReach|Hyrule Castle - Main", "keys|4", "canTorchRoomNavigate"],
            },
          ],
        },
      },
      Sanctuary: {
        always: {
          anyOf: [
            "canBreach|Sanctuary",
            "canBreach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canBreach|Hyrule Castle - Main", "keys|2", "canTorchRoomNavigateBlind"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Sanctuary", "canBreach|Hyrule Castle - Sewers Dropdown", "keys|4"],
        },
        logical: {
          anyOf: [
            "canReach|Sanctuary",
            "canReach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canReach|Hyrule Castle - Main", "keys|4", "canTorchRoomNavigate"],
            },
          ],
        },
      },
    },
    "Skull Woods": {
      "Skull Woods - Big Chest": {
        always: {
          allOf: ["canBreach|Skull Woods - Main", "bigkey"],
          anyOf: ["bombs", "canHover"],
        },
        logical: {
          allOf: ["canReach|Skull Woods - Main", "bombs"],
        },
      },
      "Skull Woods - Big Key Chest": {
        always: {
          allOf: ["canBreach|Skull Woods - Middle"],
        },
        logical: {
          allOf: ["canReach|Skull Woods - Middle"],
        },
        superlogic: {
          allOf: ["somaria"],
        },
      },
      "Skull Woods - Boss": {
        always: {
          allOf: ["canBreach|Skull Woods - Back", "canKillBoss", "canDefeatCurtains", "keys|2"],
          anyOf: [
            "firerod",
            {
              allOf: [
                "lantern",
                {
                  anyOf: ["bombs", "canHover"],
                },
              ],
            },
          ],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Skull Woods - Back", "keys|5", "firerod"],
        },
      },
      "Skull Woods - Prize": {
        always: {
          allOf: ["canBreach|Skull Woods - Back", "canKillBoss", "canDefeatCurtains", "keys|2"],
          anyOf: [
            "firerod",
            {
              allOf: [
                "lantern",
                {
                  anyOf: ["bombs", "canHover"],
                },
              ],
            },
          ],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Skull Woods - Back", "keys|5", "firerod"],
        },
      },
      "Skull Woods - Bridge Room": {
        always: {
          allOf: ["canBreach|Skull Woods - Back"],
        },
        logical: {
          allOf: ["canReach|Skull Woods - Back"],
        },
      },
      "Skull Woods - Compass Chest": {
        always: {
          anyOf: [
            "canBreach|Skull Woods - Drops",
            {
              allOf: ["canBreach|Skull Woods - Main", "keys|1"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Skull Woods - Drops", "keys|1"],
        },
        logical: {
          anyOf: [
            "canReach|Skull Woods - Drops",
            {
              allOf: ["canReach|Skull Woods - Main", "keys|5"],
            },
          ],
        },
      },
      "Skull Woods - Map Chest": {
        always: {
          anyOf: ["canBreach|Skull Woods - Drops", "canBreach|Skull Woods - Main"],
        },
        logical: {
          anyOf: ["canReach|Skull Woods - Drops", "canReach|Skull Woods - Main"],
        },
      },
      "Skull Woods - Pinball Room": {
        always: {
          anyOf: [
            "canBreach|Skull Woods - Drops",
            {
              allOf: ["canBreach|Skull Woods - Main", "keys|1"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Skull Woods - Drops", "keys|1"],
        },
        logical: {
          anyOf: [
            "canReach|Skull Woods - Drops",
            {
              allOf: ["canReach|Skull Woods - Main", "keys|4"],
            },
          ],
        },
      },
      "Skull Woods - Pot Prison": {
        always: {
          anyOf: [
            "canBreach|Skull Woods - Drops",
            {
              allOf: ["canBreach|Skull Woods - Main", "keys|1"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Skull Woods - Drops", "keys|1"],
        },
        logical: {
          anyOf: [
            "canReach|Skull Woods - Drops",
            {
              allOf: ["canReach|Skull Woods - Main", "keys|5"],
            },
          ],
        },
      },
      "Skull Woods - Spike Corner Key Drop": {
        always: {
          allOf: ["canBreach|Skull Woods - Back", "keys|1", "canDefeatCurtains"],
          anyOf: [
            "firerod",
            {
              allOf: [
                "lantern",
                {
                  anyOf: ["canBombJump", "canHover"],
                },
              ],
            },
          ],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Skull Woods - Back", "keys|4", "firerod"],
        },
      },
      "Skull Woods - West Lobby Pot Key": {
        always: {
          allOf: ["canBreach|Skull Woods - Middle"],
        },
        logical: {
          allOf: ["canReach|Skull Woods - Middle"],
        },
      },
    },
    "Swamp Palace": {
      "Swamp Palace - Big Chest": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|2", "bigkey", "flippers"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["hammer", "keys|3"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|3"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|3", "hammer"],
        },
      },
      "Swamp Palace - Big Key Chest": {
        always: {
          allOf: ["canBreach|Swamp Palace", "flippers"],
          anyOf: [
            {
              allOf: ["keys|2", "canSpeckyClip", "canBombSpooky"],
            },
            {
              allOf: ["keys|3", "canSpeckyClip"],
            },
            {
              allOf: ["keys|3", "canBombSpooky", "hammer"],
            },
            {
              allOf: ["keys|4", "hammer"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["keys|4", "canSpeckyClip", "canBombSpooky"],
            },
            {
              allOf: ["canSpeckyClip", "keys|5"],
            },
            {
              allOf: ["canBombSpooky", "keys|5", "hammer"],
            },
            {
              allOf: ["keys|6", "hammer"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|6", "hammer"],
        },
      },
      "Swamp Palace - West Chest": {
        always: {
          allOf: ["canBreach|Swamp Palace", "flippers"],
          anyOf: [
            {
              allOf: ["keys|2", "canSpeckyClip", "canBombSpooky"],
            },
            {
              allOf: ["keys|3", "canSpeckyClip"],
            },
            {
              allOf: ["keys|3", "canBombSpooky", "hammer"],
            },
            {
              allOf: ["keys|4", "hammer"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["keys|4", "canSpeckyClip", "canBombSpooky"],
            },
            {
              allOf: ["canSpeckyClip", "keys|5"],
            },
            {
              allOf: ["canBombSpooky", "keys|5", "hammer"],
            },
            {
              allOf: ["keys|6", "hammer"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|6", "hammer"],
        },
      },
      "Swamp Palace - Boss": {
        always: {
          allOf: ["canBreach|Swamp Palace", "flippers", "canKillBoss", "hookshot", "keys|4"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["keys|5", "hammer"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|5"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|6", "hammer"],
        },
      },
      "Swamp Palace - Prize": {
        always: {
          allOf: ["canBreach|Swamp Palace", "flippers", "canKillBoss", "hookshot", "keys|4"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["keys|5", "hammer"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|5"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|6", "hammer"],
        },
      },
      "Swamp Palace - Compass Chest": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|2", "flippers"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["keys|3", "hammer"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|3"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|3", "hammer"],
        },
      },
      "Swamp Palace - Entrance": {
        always: {
          allOf: ["canBreach|Swamp Palace", "flippers", "canKillOrExplodeMostEnemies"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace"],
        },
      },
      "Swamp Palace - Flooded Room - Left": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|3", "flippers", "hookshot"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["keys|4", "hammer"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|4"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|5", "hammer"],
        },
      },
      "Swamp Palace - Flooded Room - Right": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|3", "flippers", "hookshot"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["keys|4", "hammer"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|4"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|5", "hammer"],
        },
      },
      "Swamp Palace - Hookshot Pot Key": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|2", "flippers", "hookshot"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["keys|3", "hammer"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|3"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|3", "hammer"],
        },
      },
      "Swamp Palace - Map Chest": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|1", "flippers", "bombs"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace"],
        },
      },
      "Swamp Palace - Pot Row Pot Key": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|1", "flippers"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace"],
        },
      },
      "Swamp Palace - Trench 1 Pot Key": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|2", "flippers"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace"],
        },
      },
      "Swamp Palace - Trench 2 Pot Key": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|2", "flippers"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["keys|3", "hammer"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|3"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|3", "hammer"],
        },
      },
      "Swamp Palace - Waterfall Room": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|3", "flippers", "hookshot"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["keys|4", "hammer"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|4"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|5", "hammer"],
        },
      },
      "Swamp Palace - Waterway Pot Key": {
        always: {
          allOf: ["canBreach|Swamp Palace", "keys|3", "flippers", "hookshot"],
          anyOf: [
            "canSpeckyClip",
            {
              allOf: ["keys|4", "hammer"],
            },
          ],
        },
        required: {
          anyOf: ["canSpeckyClip", "keys|4"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace", "keys|5", "hammer"],
        },
      },
    },
    "Thieves Town": {
      "Thieves Town - Ambush Chest": {
        always: {
          allOf: ["canBreach|Thieves Town"],
        },
        logical: {
          allOf: ["canReach|Thieves Town"],
        },
      },
      "Thieves Town - Attic": {
        always: {
          allOf: ["canBreach|Thieves Town", "keys|2", "bigkey"],
        },
        logical: {
          allOf: ["canReach|Thieves Town", "keys|3"],
        },
      },
      "Thieves Town - Big Chest": {
        always: {
          allOf: ["canBreach|Thieves Town", "keys|2", "bigkey", "hammer"],
        },
        required: {
          allOf: ["keys|3"],
        },
        logical: {
          allOf: ["canReach|Thieves Town", "keys|3"],
        },
      },
      "Thieves Town - Big Key Chest": {
        always: {
          allOf: ["canBreach|Thieves Town"],
        },
        logical: {
          allOf: ["canReach|Thieves Town"],
        },
      },
      "Thieves Town - Blind's Cell": {
        always: {
          allOf: ["canBreach|Thieves Town", "bigkey", "keys|1"],
          anyOf: ["canKillMostEnemies", "bombs", "glove"],
        },
        logical: {
          allOf: ["canReach|Thieves Town"],
        },
      },
      "Thieves Town - Boss": {
        always: {
          allOf: ["canBreach|Thieves Town", "keys|2", "bigkey", "canKillBoss", "bombs"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Thieves Town", "keys|3"],
        },
      },
      "Thieves Town - Prize": {
        always: {
          allOf: ["canBreach|Thieves Town", "keys|2", "bigkey", "canKillBoss", "bombs"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Thieves Town", "keys|3"],
        },
      },
      "Thieves Town - Compass Chest": {
        always: {
          allOf: ["canBreach|Thieves Town"],
        },
        logical: {
          allOf: ["canReach|Thieves Town"],
        },
      },
      "Thieves Town - Hallway Pot Key": {
        always: {
          allOf: ["canBreach|Thieves Town", "bigkey"],
        },
        logical: {
          allOf: ["canReach|Thieves Town"],
        },
      },
      "Thieves Town - Map Chest": {
        always: {
          allOf: ["canBreach|Thieves Town"],
        },
        logical: {
          allOf: ["canReach|Thieves Town"],
        },
      },
      "Thieves Town - Spike Switch Pot Key": {
        always: {
          allOf: ["canBreach|Thieves Town", "bigkey", "keys|1"],
        },
        logical: {
          allOf: ["canReach|Thieves Town"],
        },
      },
    },
    "Tower of Hera": {
      "Tower of Hera - Basement Cage": {
        always: {
          allOf: ["canBreach|Tower of Hera", "canHitSwitch"],
        },
        logical: {
          allOf: ["canReach|Tower of Hera"],
        },
      },
      "Tower of Hera - Big Chest": {
        always: {
          allOf: ["canBreach|Tower of Hera", "bigkey", "canHitSwitch"],
          anyOf: ["canKillOrExplodeMostEnemies", "canHeraPot"],
        },
        logical: {
          allOf: ["canReach|Tower of Hera", "canKillOrExplodeMostEnemies"],
        },
      },
      "Tower of Hera - Big Key Chest": {
        always: {
          allOf: ["canBreach|Tower of Hera", "keys|1", "canHitSwitch", "canLightFires"],
        },
        logical: {
          allOf: ["canReach|Tower of Hera"],
        },
      },
      "Tower of Hera - Boss": {
        always: {
          allOf: ["canBreach|Tower of Hera", "canHitSwitch", "canKillBoss"],
          anyOf: [
            "canHeraPot",
            {
              allOf: ["bigkey", "canKillOrExplodeMostEnemies"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Tower of Hera", "bigkey", "canKillOrExplodeMostEnemies"],
        },
      },
      "Tower of Hera - Prize": {
        always: {
          allOf: ["canBreach|Tower of Hera", "canHitSwitch", "canKillBoss"],
          anyOf: [
            "canHeraPot",
            {
              allOf: ["bigkey", "canKillOrExplodeMostEnemies"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Tower of Hera", "bigkey", "canKillOrExplodeMostEnemies"],
        },
      },
      "Tower of Hera - Compass Chest": {
        always: {
          allOf: ["canBreach|Tower of Hera", "canHitSwitch"],
          anyOf: [
            "canHeraPot",
            {
              allOf: ["bigkey", "canKillOrExplodeMostEnemies"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Tower of Hera", "bigkey", "canKillOrExplodeMostEnemies"],
        },
      },
      "Tower of Hera - Map Chest": {
        always: {
          allOf: ["canBreach|Tower of Hera", "canHitSwitch"],
        },
        logical: {
          allOf: ["canReach|Tower of Hera"],
        },
      },
    },
    "Turtle Rock": {
      "Turtle Rock - Big Chest": {
        always: {
          allOf: ["bigkey"],
          anyOf: [
            {
              allOf: [
                "canBreachTurtleRockMainMaybe",
                "keys|3",
                "canExitTurtleRockWestAndEnterEast",
                {
                  anyOf: ["somaria", "canHoverAlot"],
                },
                {
                  anyOf: ["canKillOrExplodeMostEnemies", "canBombOrBonkCameraUnlock"],
                },
              ],
            },
            {
              allOf: ["canBreach|Turtle Rock - East"],
              anyOf: ["somaria", "canHover", "canBombJump", "hookshot"],
            },
          ],
        },
        required: {
          anyOf: [
            "canBreach|Turtle Rock - East",
            {
              allOf: [
                "canBreach|Turtle Rock - Main",
                "keys|3",
                "canExitTurtleRockWestAndEnterEast",
                {
                  anyOf: ["somaria", "canHoverAlot"],
                },
                {
                  anyOf: ["canKillMostEnemies", "canBombOrBonkCameraUnlock"],
                },
              ],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: ["canReach|Turtle Rock - Main", "keys|3", "canExitTurtleRockWestAndEnterEast", "canKillMostEnemies", "somaria"],
            },
            {
              allOf: ["canReach|Turtle Rock - East"],
              anyOf: ["somaria", "hookshot"],
            },
          ],
        },
      },
      "Turtle Rock - Big Key Chest": {
        always: {
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "keys|4", "canHitSwitch"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "keys|1", "canHitSwitch"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1", "canDarkRoomNavigateBlind", "canOpenBonkWalls", "canHitSwitch"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        required: {
          allOf: ["keys|6", "canHitSwitch"],
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreachTurtleRockMiddle",
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind", "canOpenBonkWalls"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        logical: {
          allOf: ["keys|6", "canHitSwitch"],
          anyOf: [
            {
              allOf: ["canReach|Turtle Rock - Main", "somaria"],
            },
            "canReachTurtleRockMiddle",
            {
              allOf: ["canReach|Turtle Rock - Back", "canDarkRoomNavigate", "canOpenBonkWalls", "somaria"],
            },
          ],
        },
      },
      "Turtle Rock - Boss": {
        always: {
          allOf: [
            "bigkey",
            "canKillBoss",
            {
              anyOf: ["canHoverAlot", "somaria"],
            },
          ],
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "keys|5", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "keys|2", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1"],
            },
          ],
        },
        required: {
          allOf: [
            {
              anyOf: ["canHoverAlot", "somaria"],
            },
          ],
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "keys|5", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "keys|3", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1"],
            },
          ],
        },
        logical: {
          allOf: ["keys|6", "somaria"],
          anyOf: [
            "canReach|Turtle Rock - Back",
            {
              allOf: [
                {
                  anyOf: ["canReach|Turtle Rock - Main", "canReachTurtleRockMiddle"],
                },
                "canOpenBonkWalls",
                "canHitRangedSwitch",
                "canDarkRoomNavigate",
              ],
            },
          ],
        },
      },
      "Turtle Rock - Prize": {
        always: {
          allOf: [
            "bigkey",
            "canKillBoss",
            {
              anyOf: ["canHoverAlot", "somaria"],
            },
          ],
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "keys|5", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "keys|2", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1"],
            },
          ],
        },
        required: {
          allOf: [
            {
              anyOf: ["canHoverAlot", "somaria"],
            },
          ],
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "keys|5", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "keys|3", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1"],
            },
          ],
        },
        logical: {
          allOf: ["keys|6", "somaria"],
          anyOf: [
            "canReach|Turtle Rock - Back",
            {
              allOf: [
                {
                  anyOf: ["canReach|Turtle Rock - Main", "canReachTurtleRockMiddle"],
                },
                "canOpenBonkWalls",
                "canHitRangedSwitch",
                "canDarkRoomNavigate",
              ],
            },
          ],
        },
      },
      "Turtle Rock - Chain Chomps": {
        always: {
          allOf: ["canHitRangedSwitch"],
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "keys|2"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreachTurtleRockMiddle",
            {
              allOf: ["canBreach|Turtle Rock - Back", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: [
                "canBreach|Turtle Rock - Main",
                {
                  anyOf: [
                    "keys|2",
                    {
                      allOf: ["canOnlyReachTurtleRockMain", "keys|2"],
                    },
                  ],
                },
              ],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreachTurtleRockMiddle",
            {
              allOf: ["canBreach|Turtle Rock - Back", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: [
                "canReach|Turtle Rock - Main",
                "somaria",
                {
                  anyOf: [
                    "keys|4",
                    {
                      allOf: ["canOnlyReachTurtleRockMain", "keys|2"],
                    },
                  ],
                },
              ],
            },
            "canReachTurtleRockMiddle",
            {
              allOf: ["canReach|Turtle Rock - Back", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
          ],
        },
      },
      "Turtle Rock - Compass Chest": {
        always: {
          allOf: [
            {
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
          anyOf: [
            "canBreachTurtleRockMainMaybe",
            {
              allOf: ["canBreachTurtleRockMiddle", "keys|2"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
            },
          ],
        },
        required: {
          allOf: [
            {
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
          anyOf: [
            "canBreach|Turtle Rock - Main",
            {
              allOf: ["canBreachTurtleRockMiddle", "keys|3"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|3", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
            },
          ],
        },
        logical: {
          allOf: ["somaria"],
          anyOf: [
            "canReach|Turtle Rock - Main",
            {
              allOf: ["canReachTurtleRockMiddle", "keys|6"],
            },
            {
              allOf: ["canReach|Turtle Rock - Back", "keys|6", "canOpenBonkWalls", "canDarkRoomNavigate"],
            },
          ],
        },
      },
      "Turtle Rock - Crystaroller Room": {
        always: {
          allOf: ["canHitRangedSwitch"],
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|3", "canOpenBonkWalls"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canHitRangedSwitch"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: [
                "canBreach|Turtle Rock - Main",
                "bigkey",
                "canOpenBonkWalls",
                {
                  anyOf: ["somaria", "canHoverAlot"],
                },
                {
                  anyOf: [
                    "keys|4",
                    {
                      allOf: ["canOnlyReachTurtleRockMain", "keys|3"],
                    },
                  ],
                },
              ],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canHitRangedSwitch"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: ["canReach|Turtle Rock - Main", "bigkey", "canOpenBonkWalls", "somaria"],
              anyOf: [
                "keys|4",
                {
                  allOf: ["canOnlyReachTurtleRockMain", "keys|3"],
                },
              ],
            },
            {
              allOf: ["canReachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canHitRangedSwitch"],
            },
            {
              allOf: ["canReach|Turtle Rock - Back", "canDarkRoomNavigate", "somaria"],
            },
          ],
        },
      },
      "Turtle Rock - Eye Bridge - Bottom Left": {
        always: {
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|4", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|1", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "bigkey", "keys|4", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|1", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        logical: {
          allOf: [
            {
              anyOf: ["mirrorshield", "byrna", "cape"],
            },
          ],
          anyOf: [
            {
              allOf: ["canReach|Turtle Rock - Main", "bigkey", "keys|5", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|5", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            "canReach|Turtle Rock - Back",
          ],
        },
      },
      "Turtle Rock - Eye Bridge - Bottom Right": {
        always: {
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|4", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|1", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "bigkey", "keys|4", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|1", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        logical: {
          allOf: [
            {
              anyOf: ["mirrorshield", "byrna", "cape"],
            },
          ],
          anyOf: [
            {
              allOf: ["canReach|Turtle Rock - Main", "bigkey", "keys|5", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|5", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            "canReach|Turtle Rock - Back",
          ],
        },
      },
      "Turtle Rock - Eye Bridge - Top Left": {
        always: {
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|4", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|1", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "bigkey", "keys|4", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|1", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        logical: {
          allOf: [
            {
              anyOf: ["mirrorshield", "byrna", "cape"],
            },
          ],
          anyOf: [
            {
              allOf: ["canReach|Turtle Rock - Main", "bigkey", "keys|5", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|5", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            "canReach|Turtle Rock - Back",
          ],
        },
      },
      "Turtle Rock - Eye Bridge - Top Right": {
        always: {
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|4", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|1", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "bigkey", "keys|4", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|1", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        logical: {
          allOf: [
            {
              anyOf: ["mirrorshield", "byrna", "cape"],
            },
          ],
          anyOf: [
            {
              allOf: ["canReach|Turtle Rock - Main", "bigkey", "keys|5", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|5", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            "canReach|Turtle Rock - Back",
          ],
        },
      },
      "Turtle Rock - Pokey 1 Key Drop": {
        always: {
          allOf: ["canKillOrExplodeMostEnemies"],
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "keys|1"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch", "keys|1"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls", "keys|1"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: [
                "canBreach|Turtle Rock - Main",
                {
                  anyOf: [
                    "keys|2",
                    {
                      allOf: ["canOnlyReachTurtleRockMain", "keys|1"],
                    },
                  ],
                },
                {
                  anyOf: ["somaria", "canHoverAlot"],
                },
              ],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch", "keys|1"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls", "keys|1"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        logical: {
          allOf: [
            {
              anyOf: [
                "keys|5",
                {
                  allOf: ["canOnlyReachTurtleRockMain", "keys|1"],
                },
              ],
            },
          ],
          anyOf: [
            {
              allOf: ["canReach|Turtle Rock - Main", "somaria"],
            },
            {
              allOf: ["canReachTurtleRockMiddle", "canHitSwitch"],
            },
            {
              allOf: ["canReach|Turtle Rock - Back", "canDarkRoomNavigate", "canHitRangedSwitch", "canOpenBonkWalls", "somaria"],
            },
          ],
        },
      },
      "Turtle Rock - Pokey 2 Key Drop": {
        always: {
          allOf: ["canHitSwitch", "canKillOrExplodeMostEnemies"],
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "keys|3"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreachTurtleRockMiddle",
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "keys|3"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreachTurtleRockMiddle",
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        logical: {
          anyOf: [
            {
              allOf: [
                "canReach|Turtle Rock - Main",
                "somaria",
                {
                  anyOf: [
                    "keys|5",
                    {
                      allOf: ["canOnlyReachTurtleRockMain", "keys|3"],
                    },
                  ],
                },
              ],
            },
            "canReachTurtleRockMiddle",
            {
              allOf: ["canReach|Turtle Rock - Back", "canDarkRoomNavigate", "canHitRangedSwitch", "canOpenBonkWalls", "somaria"],
            },
          ],
        },
      },
      "Turtle Rock - Roller Room - Left": {
        always: {
          allOf: ["somaria", "firerod"],
          anyOf: [
            "canBreachTurtleRockMainMaybe",
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch", "keys|2"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|2", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
        required: {
          anyOf: [
            "canBreach|Turtle Rock - Main",
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch", "keys|3"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|3", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
        logical: {
          anyOf: [
            "canReach|Turtle Rock - Main",
            {
              allOf: ["canReachTurtleRockMiddle", "canHitSwitch", "keys|6"],
            },
            {
              allOf: ["canReach|Turtle Rock - Back", "keys|6", "canDarkRoomNavigate", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
      },
      "Turtle Rock - Roller Room - Right": {
        always: {
          allOf: ["somaria", "firerod"],
          anyOf: [
            "canBreachTurtleRockMainMaybe",
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch", "keys|2"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|2", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
        required: {
          anyOf: [
            "canBreach|Turtle Rock - Main",
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch", "keys|3"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|3", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
        logical: {
          anyOf: [
            "canReach|Turtle Rock - Main",
            {
              allOf: ["canReachTurtleRockMiddle", "canHitSwitch", "keys|6"],
            },
            {
              allOf: ["canReach|Turtle Rock - Back", "keys|6", "canDarkRoomNavigate", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
      },
    },
    "Misery Mire": {
      "Misery Mire - Big Chest": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes", "bigkey"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire"],
        },
      },
      "Misery Mire - Big Key Chest": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes", "canLightFires", "keys|2"],
        },
        required: {
          allOf: ["canBreach|Misery Mire", "keys|3"],
        },
        logical: {
          allOf: ["canReach|Misery Mire", "keys|6"],
        },
      },
      "Misery Mire - Boss": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes", "bigkey", "somaria", "canKillBoss", "canDarkRoomNavigateBlind"],
          anyOf: ["bombs", "canFireSpooky"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire", "canDarkRoomNavigate", "bombs"],
        },
      },
      "Misery Mire - Prize": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes", "bigkey", "somaria", "canKillBoss", "canDarkRoomNavigateBlind"],
          anyOf: ["bombs", "canFireSpooky"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire", "canDarkRoomNavigate", "bombs"],
        },
      },
      "Misery Mire - Bridge Chest": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire"],
        },
      },
      "Misery Mire - Compass Chest": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes", "canLightFires", "keys|2"],
        },
        required: {
          allOf: ["canBreach|Misery Mire", "keys|3"],
        },
        logical: {
          allOf: ["canReach|Misery Mire", "keys|6"],
        },
      },
      "Misery Mire - Conveyor Crystal Key Drop": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes", "keys|1"],
        },
        required: {
          allOf: ["canBreach|Misery Mire", "keys|2"],
        },
        logical: {
          allOf: ["canReach|Misery Mire", "keys|5"],
        },
      },
      "Misery Mire - Fishbone Pot Key": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes"],
          anyOf: ["keys|2", "bigkey"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire"],
          anyOf: ["keys|5", "bigkey"],
        },
      },
      "Misery Mire - Main Lobby": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes"],
          anyOf: ["keys|1", "bigkey"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire"],
          anyOf: ["keys|2", "bigkey"],
        },
      },
      "Misery Mire - Map Chest": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes"],
          anyOf: ["keys|1", "bigkey"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire"],
          anyOf: ["keys|2", "bigkey"],
        },
      },
      "Misery Mire - Spike Chest": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire"],
        },
      },
      "Misery Mire - Spikes Pot Key": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire"],
        },
      },
    },
    "Ice Palace": {
      "Ice Palace - Jelly Key Drop": {
        always: {
          allOf: ["canBreach|Ice Palace", "canBurnThings"],
        },
        logical: {
          allOf: ["canReach|Ice Palace"],
        },
      },
      "Ice Palace - Compass Chest": {
        always: {
          allOf: ["canBreach|Ice Palace", "keys|1", "canBurnThingsMaybeSwordless", "canKillOrExplodeMostEnemies"],
        },
        logical: {
          allOf: ["canReach|Ice Palace"],
        },
      },
      "Ice Palace - Conveyor Key Drop": {
        always: {
          allOf: ["canBreach|Ice Palace", "canBurnThings", "keys|1"],
          anyOf: [
            "bombs",
            {
              allOf: ["canIceBreak", "keys|3"],
            },
          ],
        },
        required: {
          anyOf: [
            "bombs",
            {
              allOf: ["canIceBreak", "keys|3"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "bombs"],
        },
      },
      "Ice Palace - Freezor Chest": {
        always: {
          allOf: ["canBreach|Ice Palace", "canBurnThingsMaybeSwordless", "keys|2"],
        },
        required: {
          anyOf: ["bombs", "canIceBreak"],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "bombs"],
        },
      },
      "Ice Palace - Big Chest": {
        always: {
          allOf: ["canBreach|Ice Palace", "bigkey", "keys|2", "canBurnThingsMaybeSwordless"],
          anyOf: [
            "bombs",
            {
              allOf: ["canIceBreak", "canHookClip"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "bombs"],
        },
      },
      "Ice Palace - Spike Room": {
        always: {
          allOf: ["canBreach|Ice Palace", "keys|1", "canBurnThingsMaybeSwordless"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                "keys|2",
                {
                  anyOf: ["hookshot", "keys|3"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "keys|2", "bombs"],
          anyOf: ["keys|6", "hookshot"],
        },
      },
      "Ice Palace - Map Chest": {
        always: {
          allOf: ["canBreach|Ice Palace", "keys|1", "canBurnThingsMaybeSwordless", "glove", "hammer"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                "keys|2",
                {
                  anyOf: ["hookshot", "keys|3"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "keys|2", "bombs"],
          anyOf: ["keys|6", "hookshot"],
        },
      },
      "Ice Palace - Hammer Block Key Drop": {
        always: {
          allOf: ["canBreach|Ice Palace", "keys|1", "canBurnThings", "glove", "hammer"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                "keys|2",
                {
                  anyOf: ["hookshot", "keys|3"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "keys|2", "bombs"],
          anyOf: ["keys|6", "hookshot"],
        },
      },
      "Ice Palace - Big Key Chest": {
        always: {
          allOf: ["canBreach|Ice Palace", "keys|1", "canBurnThingsMaybeSwordless"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "keys|2",
                "bombs",
                "glove",
                "hammer",
                {
                  anyOf: ["hookshot", "keys|3"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "keys|2", "bombs", "glove", "hammer"],
          anyOf: ["keys|6", "hookshot"],
        },
      },
      "Ice Palace - Many Pots Pot Key": {
        always: {
          allOf: ["canBreach|Ice Palace", "keys|2", "canBurnThings"],
          anyOf: ["bombs", "canIceBreak"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "keys|2", "bombs"],
        },
      },
      "Ice Palace - Iced T Room": {
        always: {
          allOf: ["canBreach|Ice Palace", "keys|2", "canBurnThingsMaybeSwordless"],
          anyOf: ["bombs", "canIceBreak"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "keys|2", "bombs"],
        },
      },
      "Ice Palace - Boss": {
        always: {
          allOf: ["canBreach|Ice Palace", "keys|2", "canBurnThingsMaybeSwordless", "glove", "hammer", "canKillBoss"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                {
                  anyOf: [
                    "canBombJump",
                    {
                      allOf: ["bigkey", "keys|3"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "bigkey", "keys|5", "bombs"],
          anyOf: ["keys|6", "somaria"],
        },
      },
      "Ice Palace - Prize": {
        always: {
          allOf: ["canBreach|Ice Palace", "keys|2", "canBurnThingsMaybeSwordless", "glove", "hammer", "canKillBoss"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                {
                  anyOf: [
                    "canBombJump",
                    {
                      allOf: ["bigkey", "keys|3"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "bigkey", "keys|5", "bombs"],
          anyOf: ["keys|6", "somaria"],
        },
      },
    },
    "Palace of Darkness": {
      "Palace of Darkness - Big Chest": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "bigkey", "keys|2"],
          anyOf: [
            {
              anyOf: ["canBombJump", "canHoverAlot"],
            },
            {
              allOf: ["keys|5", "bombs", "canDarkRoomNavigateBlind"],
            },
          ],
        },
        required: {
          anyOf: [
            {
              allOf: [
                "keys|2",
                {
                  anyOf: ["canBombJump", "canHoverAlot"],
                },
              ],
            },
            {
              allOf: ["keys|5", "bombs", "canDarkRoomNavigateBlind"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|6", "canDarkRoomNavigate", "bombs"],
        },
      },
      "Palace of Darkness - Big Key Chest": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "keys|1", "bombs"],
          anyOf: [
            "keys|2",
            {
              allOf: ["hammer"],
              anyOf: ["bow", "canMimicClip", "canPotionCameraUnlock"],
            },
          ],
        },
        required: {
          allOf: ["keys|4"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|6", "bombs"],
        },
      },
      "Palace of Darkness - Boss": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "bigkey", "keys|1", "canKillBoss", "bow", "hammer", "canDarkRoomNavigateBlind"],
        },
        required: {
          allOf: ["keys|4"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|6", "canDarkRoomNavigate"],
        },
      },
      "Palace of Darkness - Prize": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "bigkey", "keys|1", "canKillBoss", "bow", "hammer", "canDarkRoomNavigateBlind"],
        },
        required: {
          allOf: ["keys|4"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|6", "canDarkRoomNavigate"],
        },
      },
      "Palace of Darkness - Compass Chest": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "keys|2"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|4"],
        },
      },
      "Palace of Darkness - Dark Basement - Left": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "keys|2", "canTorchRoomNavigateBlind"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|4", "canTorchRoomNavigate"],
        },
      },
      "Palace of Darkness - Dark Basement - Right": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "keys|2", "canTorchRoomNavigateBlind"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|4", "canTorchRoomNavigate"],
        },
      },
      "Palace of Darkness - Dark Maze - Bottom": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "keys|2", "canDarkRoomNavigateBlind"],
          anyOf: ["canBombJump", "keys|3"],
        },
        required: {
          anyOf: ["canBombJump", "keys|4"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|6", "canDarkRoomNavigate"],
        },
      },
      "Palace of Darkness - Dark Maze - Top": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "keys|2", "canDarkRoomNavigateBlind"],
          anyOf: ["canBombJump", "keys|3"],
        },
        required: {
          anyOf: ["canBombJump", "keys|4"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|6", "canDarkRoomNavigate"],
        },
      },
      "Palace of Darkness - Harmless Hellway": {
        always: {
          allOf: ["canBreach|Palace of Darkness", "keys|3"],
        },
        required: {
          allOf: ["keys|4"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "keys|6"],
        },
      },
      "Palace of Darkness - Map Chest": {
        always: {
          allOf: ["canBreach|Palace of Darkness"],
          anyOf: [
            {
              allOf: ["canOpenBonkWalls"],
              anyOf: ["bow", "canMimicClip", "canPotionCameraUnlock"],
            },
            {
              allOf: ["keys|1", "canHover", "bombs"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "bow", "canOpenBonkWalls"],
        },
      },
      "Palace of Darkness - Shooter Room": {
        always: {
          allOf: ["canBreach|Palace of Darkness"],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness"],
        },
      },
      "Palace of Darkness - Stalfos Basement": {
        always: {
          allOf: ["canBreach|Palace of Darkness"],
          anyOf: [
            "keys|1",
            {
              allOf: ["canOpenBonkWalls", "hammer"],
              anyOf: ["bow", "canMimicClip", "canPotionCameraUnlock"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness"],
          anyOf: ["keys|1", "zeroKeyPodders"],
        },
      },
      "Palace of Darkness - The Arena - Bridge": {
        always: {
          allOf: ["canBreach|Palace of Darkness"],
          anyOf: [
            "keys|1",
            {
              allOf: ["hammer", "canOpenBonkWalls"],
              anyOf: ["bow", "canMimicClip", "canPotionCameraUnlock"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness"],
          anyOf: ["keys|1", "zeroKeyPodders"],
        },
      },
      "Palace of Darkness - The Arena - Ledge": {
        always: {
          allOf: ["canBreach|Palace of Darkness"],
          anyOf: [
            {
              allOf: [
                "bombs",
                {
                  anyOf: ["bow", "canMimicClip", "canPotionCameraUnlock"],
                },
              ],
            },
            {
              allOf: ["keys|1", "canHover"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Palace of Darkness", "bow", "bombs"],
        },
      },
    },
  };
})(window);
