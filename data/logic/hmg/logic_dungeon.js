(function (window) {
  "use strict";

  window.hmg_logic_dungeon = {
    "Desert Palace": {
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
          allOf: [
            "canBreach|Desert Palace - Main",
            "canKillOrExplodeMostEnemies",
            {
              anyOf: ["keys|1", "canBreach|Desert Palace - North"],
            },
          ],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - Main", "keys|1"],
        },
      },
      "Desert Palace - Boss": {
        always: {
          allOf: ["canBreach|Desert Palace - North", "bigkey", "canKillBoss", "canLightFires", "canKillOrExplodeMostEnemies"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - North", "keys|1"],
        },
      },
      "Desert Palace - Prize": {
        always: {
          allOf: ["canBreach|Desert Palace - North", "bigkey", "canKillBoss", "canLightFires", "canKillOrExplodeMostEnemies"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - North", "keys|1"],
        },
      },
      "Desert Palace - Compass Chest": {
        always: {
          allOf: [
            "canBreach|Desert Palace - Main",
            {
              anyOf: ["keys|1", "canBreach|Desert Palace - North"],
            },
          ],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Desert Palace - Main", "keys|1"],
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
          allOf: ["canBreach|Castle Tower", "keys|2", "canKillMostEnemies", "canDefeatCurtains", "canFightAgahnim", "canDarkRoomNavigateBlind"],
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
          allOf: ["canBreach|Eastern Palace", "canDarkRoomNavigateBlind"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace", "canDarkRoomNavigate", "canKillOrExplodeMostEnemies"],
        },
      },
      "Eastern Palace - Boss": {
        always: {
          allOf: ["canBreach|Eastern Palace", "bigkey", "canKillBoss", "bow", "canTorchRoomNavigateBlind"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace", "canTorchRoomNavigate"],
        },
      },
      "Eastern Palace - Prize": {
        always: {
          allOf: ["canBreach|Eastern Palace", "bigkey", "canKillBoss", "bow", "canTorchRoomNavigateBlind"],
        },
        logical: {
          allOf: ["canReach|Eastern Palace", "canTorchRoomNavigate"],
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
          allOf: ["canBreach|Ganons Tower", "bigkey"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            {
              allOf: [
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
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
          allOf: ["canReach|Ganons Tower", "keys|3"],
          anyOf: ["gtleft", "gtright"],
        },
      },
      "Ganons Tower - Big Key Chest": {
        always: {
          allOf: ["canBreach|Ganons Tower", "bombs", "canKillArmos"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            {
              allOf: [
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
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
          allOf: ["canReach|Ganons Tower", "keys|3", "canKillArmos", "bombs"],
          anyOf: ["gtleft", "gtright"],
        },
      },
      "Ganons Tower - Big Key Room - Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "bombs", "canKillArmos"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            {
              allOf: [
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
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
          allOf: ["canReach|Ganons Tower", "keys|3", "canKillArmos", "bombs"],
          anyOf: ["gtleft", "gtright"],
        },
      },
      "Ganons Tower - Big Key Room - Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "bombs", "canKillArmos"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            {
              allOf: [
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
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
          allOf: ["canReach|Ganons Tower", "keys|3", "canKillArmos", "bombs"],
          anyOf: ["gtleft", "gtright"],
        },
      },
      "Ganons Tower - Bob's Chest": {
        always: {
          allOf: ["canBreach|Ganons Tower"],
          anyOf: [
            "hammer",
            {
              allOf: ["somaria", "canLightFires"],
            },
          ],
        },
        required: {
          allOf: ["keys|1"],
          anyOf: [
            {
              allOf: [
                "hammer",
                {
                  anyOf: ["canHover", "hookshot", "canBombJump"],
                },
              ],
            },
            {
              allOf: [
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
          allOf: ["canReach|Ganons Tower", "keys|3"],
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
          allOf: ["canBreach|Ganons Tower", "somaria", "canLightFires"],
        },
        required: {
          anyOf: [
            "firerod",
            {
              anyOf: ["canHover", "canBombJump"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|4", "firerod"],
        },
      },
      "Ganons Tower - Compass Room - Bottom Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "somaria", "canLightFires"],
        },
        required: {
          anyOf: [
            "firerod",
            {
              anyOf: ["canHover", "canBombJump"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|4", "firerod"],
        },
      },
      "Ganons Tower - Compass Room - Top Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "somaria", "canLightFires"],
        },
        required: {
          anyOf: [
            "firerod",
            {
              anyOf: ["canHover", "canBombJump"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|4", "firerod"],
        },
      },
      "Ganons Tower - Compass Room - Top Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "somaria", "canLightFires"],
        },
        required: {
          anyOf: [
            "firerod",
            {
              anyOf: ["canHover", "canBombJump"],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|4", "firerod"],
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
      "Ganons Tower - Firesnake Room": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer", "canHitRangedSwitch"],
          anyOf: ["hookshot", "boots", "canBombJump"],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|3", "hookshot"],
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
          allOf: ["canBreach|Ganons Tower", "hammer"],
          anyOf: ["hookshot", "boots", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|4"],
          anyOf: ["hookshot", "boots"],
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
          allOf: ["canBreach|Ganons Tower", "bigkey", "canLightFires", "bombs"],
          anyOf: [
            "bow",
            {
              allOf: ["canMimicClip", "canKillMostEnemies"],
            },
          ],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|3", "bow"],
        },
      },
      "Ganons Tower - Randomizer Room - Bottom Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer", "bombs"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot", "keys|4"],
        },
      },
      "Ganons Tower - Randomizer Room - Bottom Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer", "bombs"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot", "keys|4"],
        },
      },
      "Ganons Tower - Randomizer Room - Top Left": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer", "bombs"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot", "keys|4"],
        },
      },
      "Ganons Tower - Randomizer Room - Top Right": {
        always: {
          allOf: ["canBreach|Ganons Tower", "hammer", "bombs"],
          anyOf: ["hookshot", "canHover", "canBombJump"],
        },
        required: {
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "hookshot", "keys|4"],
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
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "keys|4", "bow", "hookshot"],
        },
      },
      "Ganons Tower - Boss": {
        always: {
          allOf: [
            "canBreach|Ganons Tower",
            "bigkey",
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
          allOf: ["keys|2"],
        },
        logical: {
          allOf: ["canReach|Ganons Tower", "bow", "keys|4", "melee", "hookshot"],
        },
      },
    },
    "Hyrule Castle": {
      "Hyrule Castle - Boomerang Chest": {
        always: {
          allOf: ["canBreach|Hyrule Castle - Main", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Hyrule Castle - Main", "keys|1"],
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
      "Hyrule Castle - Zelda's Chest": {
        always: {
          allOf: ["canBreach|Hyrule Castle - Main", "canKillOrExplodeMostEnemies"],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Hyrule Castle - Main", "keys|1"],
        },
      },
      "Sewers - Dark Cross": {
        always: {
          allOf: ["canTorchRoomNavigateBlind"],
          anyOf: [
            "canBreach|Hyrule Castle - Main",
            {
              allOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|1"],
            },
          ],
        },
        required: {
          anyOf: [
            "canBreach|Hyrule Castle - Main",
            {
              allOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|1"],
            },
          ],
        },
        logical: {
          allOf: ["canTorchRoomNavigate"],
          anyOf: [
            "canReach|Hyrule Castle - Main",
            {
              allOf: ["canReach|Hyrule Castle - Sewers Dropdown", "keys|1"],
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
              allOf: ["canBreach|Hyrule Castle - Main", "canTorchRoomNavigateBlind"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|1"],
        },
        logical: {
          anyOf: [
            "canReach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canReach|Hyrule Castle - Main", "keys|1", "canTorchRoomNavigate"],
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
              allOf: ["canBreach|Hyrule Castle - Main", "canTorchRoomNavigateBlind"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|1"],
        },
        logical: {
          anyOf: [
            "canReach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canReach|Hyrule Castle - Main", "keys|1", "canTorchRoomNavigate"],
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
              allOf: ["canBreach|Hyrule Castle - Main", "canTorchRoomNavigateBlind"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Hyrule Castle - Sewers Dropdown", "keys|1"],
        },
        logical: {
          anyOf: [
            "canReach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canReach|Hyrule Castle - Main", "keys|1", "canTorchRoomNavigate"],
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
              allOf: ["canBreach|Hyrule Castle - Main", "canTorchRoomNavigateBlind"],
            },
          ],
        },
        required: {
          anyOf: ["canBreach|Sanctuary", "canBreach|Hyrule Castle - Sewers Dropdown", "keys|1"],
        },
        logical: {
          anyOf: [
            "canReach|Sanctuary",
            "canReach|Hyrule Castle - Sewers Dropdown",
            {
              allOf: ["canReach|Hyrule Castle - Main", "keys|1", "canTorchRoomNavigate"],
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
          allOf: [
            "canBreach|Skull Woods - Back",
            "canKillBoss",
            "canDefeatCurtains",
            {
              anyOf: ["canBreach|Skull Woods - Middle", "keys|1"],
            },
            {
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
          ],
        },
        logical: {
          allOf: ["canReach|Skull Woods - Back", "keys|3", "firerod"],
        },
      },
      "Skull Woods - Prize": {
        always: {
          allOf: [
            "canBreach|Skull Woods - Back",
            "canKillBoss",
            "canDefeatCurtains",
            {
              anyOf: ["canBreach|Skull Woods - Middle", "keys|1"],
            },
            {
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
          ],
        },
        logical: {
          allOf: ["canReach|Skull Woods - Back", "keys|3", "firerod"],
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
        logical: {
          anyOf: [
            "canReach|Skull Woods - Drops",
            {
              allOf: ["canReach|Skull Woods - Main", "keys|3"],
            },
          ],
        },
      },
      "Skull Woods - Map Chest": {
        always: {
          anyOf: ["canBreach|Skull Woods - Drops", "canBreach|Skull Woods - Main"],
        },
        required: {
          anyOf: [
            "canBreach|Skull Woods - Main",
            {
              allOf: ["canBreach|Skull Woods - Drops", "keys|1"],
            },
          ],
        },
        logical: {
          anyOf: [
            "canReach|Skull Woods - Main",
            {
              allOf: ["canReach|Skull Woods - Drops", "keys|1"],
            },
          ],
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
              allOf: ["canReach|Skull Woods - Main", "keys|3"],
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
              allOf: ["canReach|Skull Woods - Main", "keys|3"],
            },
          ],
        },
      },
    },
    // TODO: This needs proper mirrorless logic added
    "Swamp Palace": {
      "Swamp Palace - Big Chest": {
        always: {
          allOf: [
            "canBreach|Swamp Palace",
            "flippers",
            {
              anyOf: ["canSpeckyClip", "hammer", "canHMGMireClipBreach", "canHMGHeraClipBreach"],
            },
            {
              anyOf: [
                "bigkey",
                {
                  allOf: ["canHMGMireClipBreach", "bigkey|mm"],
                },
                {
                  allOf: ["canHMGHeraClipBreach", "bigkey|toh"],
                },
              ],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: [
            "canReach|Swamp Palace",
            "flippers",
            {
              anyOf: ["hammer", "canHMGMireClipLogic", "canHMGHeraClipLogic"],
            },
            {
              anyOf: [
                "bigkey",
                {
                  allOf: ["canHMGMireClipLogic", "bigkey|mm"],
                },
                {
                  allOf: ["canHMGHeraClipLogic", "bigkey|toh"],
                },
              ],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
        },
      },
      "Swamp Palace - Big Key Chest": {
        always: {
          allOf: [
            "canBreach|Swamp Palace",
            "flippers",
            {
              anyOf: ["canSpeckyClip", "hammer", "canHMGMireClipBreach", "canHMGHeraClipBreach"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: [
            "canReach|Swamp Palace",
            "flippers",
            {
              anyOf: ["hammer", "canHMGMireClipLogic", "canHMGHeraClipLogic"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
        },
      },
      "Swamp Palace - West Chest": {
        always: {
          allOf: [
            "canBreach|Swamp Palace",
            "flippers",
            {
              anyOf: ["canSpeckyClip", "hammer", "canHMGMireClipBreach", "canHMGHeraClipBreach"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: [
            "canReach|Swamp Palace",
            "flippers",
            {
              anyOf: ["hammer", "canHMGMireClipLogic", "canHMGHeraClipLogic"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
        },
      },
      "Swamp Palace - Boss": {
        always: {
          allOf: [
            "hookshot",
            "canBreach|Swamp Palace",
            "flippers",
            "canKillBoss",
            {
              anyOf: ["canSpeckyClip", "hammer", "canHMGMireClipBreach", "canHMGHeraClipBreach"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: [
            "canReach|Swamp Palace",
            "flippers",
            {
              anyOf: ["hammer", "canHMGMireClipLogic", "canHMGHeraClipLogic"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
        },
      },
      "Swamp Palace - Prize": {
        always: {
          allOf: [
            "hookshot",
            "canBreach|Swamp Palace",
            "flippers",
            "canKillBoss",
            {
              anyOf: ["canSpeckyClip", "hammer", "canHMGMireClipBreach", "canHMGHeraClipBreach"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: [
            "canReach|Swamp Palace",
            "flippers",
            {
              anyOf: ["hammer", "canHMGMireClipLogic", "canHMGHeraClipLogic"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
        },
      },
      "Swamp Palace - Compass Chest": {
        always: {
          allOf: [
            "canBreach|Swamp Palace",
            "flippers",
            {
              anyOf: ["canSpeckyClip", "hammer", "canHMGMireClipBreach", "canHMGHeraClipBreach"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: [
            "canReach|Swamp Palace",
            "flippers",
            {
              anyOf: ["hammer", "canHMGMireClipLogic", "canHMGHeraClipLogic"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
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
          allOf: [
            "hookshot",
            "canBreach|Swamp Palace",
            "flippers",
            {
              anyOf: ["canSpeckyClip", "hammer", "canHMGMireClipBreach", "canHMGHeraClipBreach"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: [
            "canReach|Swamp Palace",
            "flippers",
            {
              anyOf: ["hammer", "canHMGMireClipLogic", "canHMGHeraClipLogic"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
        },
      },
      "Swamp Palace - Flooded Room - Right": {
        always: {
          allOf: [
            "hookshot",
            "canBreach|Swamp Palace",
            "flippers",
            {
              anyOf: ["canSpeckyClip", "hammer", "canHMGMireClipBreach", "canHMGHeraClipBreach"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: [
            "canReach|Swamp Palace",
            "flippers",
            {
              anyOf: ["hammer", "canHMGMireClipLogic", "canHMGHeraClipLogic"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
        },
      },
      "Swamp Palace - Map Chest": {
        always: {
          allOf: ["canBreach|Swamp Palace", "flippers", "bombs"],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: ["canReach|Swamp Palace"],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
        },
      },
      "Swamp Palace - Waterfall Room": {
        always: {
          allOf: [
            "hookshot",
            "canBreach|Swamp Palace",
            "flippers",
            {
              anyOf: ["canSpeckyClip", "hammer", "canHMGMireClipBreach", "canHMGHeraClipBreach"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampBreach"],
        },
        logical: {
          allOf: [
            "canReach|Swamp Palace",
            "flippers",
            {
              anyOf: ["hammer", "canHMGMireClipLogic", "canHMGHeraClipLogic"],
            },
          ],
          anyOf: ["keys|1", "canHMGUnlockSwampLogic"],
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
          allOf: ["canBreach|Thieves Town", "bigkey"],
        },
        logical: {
          allOf: ["canReach|Thieves Town", "keys|1"],
        },
      },
      "Thieves Town - Big Chest": {
        always: {
          allOf: ["canBreach|Thieves Town", "bigkey", "hammer"],
        },
        required: {
          allOf: ["keys|1"],
        },
        logical: {
          allOf: ["canReach|Thieves Town", "keys|1"],
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
          allOf: ["canBreach|Thieves Town", "bigkey"],
          anyOf: ["canKillMostEnemies", "bombs", "glove"],
        },
        logical: {
          allOf: ["canReach|Thieves Town"],
        },
      },
      "Thieves Town - Boss": {
        always: {
          allOf: ["canBreach|Thieves Town", "bigkey", "canKillBoss", "bombs"],
        },
        logical: {
          allOf: ["canReach|Thieves Town", "keys|1"],
        },
      },
      "Thieves Town - Prize": {
        always: {
          allOf: ["canBreach|Thieves Town", "bigkey", "canKillBoss", "bombs"],
        },
        logical: {
          allOf: ["canReach|Thieves Town", "keys|1"],
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
      "Thieves Town - Map Chest": {
        always: {
          allOf: ["canBreach|Thieves Town"],
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
          anyOf: [
            {
              allOf: ["canBreach|Tower of Hera", "bigkey", "canHitSwitch"],
              anyOf: ["canKillOrExplodeMostEnemies", "canHeraPot"],
            },
            {
              allOf: ["canBreach|Misery Mire", "bigkey|mm", "keys|mm|3"],
              anyOf: [
                "boots",
                {
                  allOf: ["bombs", "canLightFires"],
                },
              ],
            },
          ],
        },
        logical: {
          anyOf: [
            {
            allOf: ["canReach|Misery Mire", "bigkey|mm"],
            },
            "bigkey|toh",
          ],
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
            {
              allOf: ["canBreach|Misery Mire", "bigkey|mm", "keys|mm|3"],
              anyOf: [
                "boots",
                {
                  allOf: ["bombs", "canLightFires"],
                },
              ],
            },
          ],
        },
        logical: {
          anyOf: [
            {
            allOf: ["canReach|Misery Mire", "bigkey|mm"],
            },
            "bigkey|toh",
          ],
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
            {
              allOf: ["canBreach|Misery Mire", "bigkey|mm", "keys|mm|3"],
              anyOf: [
                "boots",
                {
                  allOf: ["bombs", "canLightFires"],
                },
              ],
            },
          ],
        },
        logical: {
          anyOf: [
            {
            allOf: ["canReach|Misery Mire", "bigkey|mm"],
            },
            "bigkey|toh",
          ],
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
            {
              allOf: ["canBreach|Misery Mire", "bigkey|mm", "keys|mm|3"],
              anyOf: [
                "boots",
                {
                  allOf: ["bombs", "canLightFires"],
                },
              ],
            },
          ],
        },
        logical: {
          anyOf: [
            {
            allOf: ["canReach|Misery Mire", "bigkey|mm"],
            },
            "bigkey|toh",
          ],
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
                "keys|2",
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
                "keys|2",
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
              allOf: ["canReach|Turtle Rock - Main", "keys|2", "canExitTurtleRockWestAndEnterEast", "canKillMostEnemies", "somaria"],
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
              allOf: ["canBreachTurtleRockMainMaybe", "keys|2", "canHitSwitch"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind", "canOpenBonkWalls", "canHitSwitch"],
              anyOf: ["somaria", "canHoverAlot"],
            },
          ],
        },
        required: {
          allOf: ["keys|4", "canHitSwitch"],
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
          allOf: ["keys|4", "canHitSwitch"],
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
              allOf: ["canBreachTurtleRockMainMaybe", "keys|3", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
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
              allOf: ["canBreach|Turtle Rock - Main", "keys|3", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "keys|2", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1"],
            },
          ],
        },
        logical: {
          allOf: ["keys|4", "somaria"],
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
              allOf: ["canBreachTurtleRockMainMaybe", "keys|3", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
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
              allOf: ["canBreach|Turtle Rock - Main", "keys|3", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "keys|2", "canOpenBonkWalls", "canHitRangedSwitch", "canDarkRoomNavigateBlind"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1"],
            },
          ],
        },
        logical: {
          allOf: ["keys|4", "somaria"],
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
              allOf: ["canBreachTurtleRockMainMaybe", "keys|1"],
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
                    "keys|1",
                    {
                      allOf: ["canOnlyReachTurtleRockMain", "keys|1"],
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
                    "keys|3",
                    {
                      allOf: ["canOnlyReachTurtleRockMain", "keys|1"],
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
              allOf: ["canBreachTurtleRockMiddle", "keys|1"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
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
              allOf: ["canBreachTurtleRockMiddle", "keys|2"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
            },
          ],
        },
        logical: {
          allOf: ["somaria"],
          anyOf: [
            "canReach|Turtle Rock - Main",
            {
              allOf: ["canReachTurtleRockMiddle", "keys|4"],
            },
            {
              allOf: ["canReach|Turtle Rock - Back", "keys|4", "canOpenBonkWalls", "canDarkRoomNavigate"],
            },
          ],
        },
      },
      "Turtle Rock - Crystaroller Room": {
        always: {
          allOf: ["canHitRangedSwitch"],
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|2", "canOpenBonkWalls"],
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
                    "keys|2",
                    {
                      allOf: ["canOnlyReachTurtleRockMain", "keys|2"],
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
                "keys|3",
                {
                  allOf: ["canOnlyReachTurtleRockMain", "keys|2"],
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
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "bigkey", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
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
              allOf: ["canReach|Turtle Rock - Main", "bigkey", "keys|3", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|3", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            "canReach|Turtle Rock - Back",
          ],
        },
      },
      "Turtle Rock - Eye Bridge - Bottom Right": {
        always: {
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "bigkey", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
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
              allOf: ["canReach|Turtle Rock - Main", "bigkey", "keys|3", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|3", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            "canReach|Turtle Rock - Back",
          ],
        },
      },
      "Turtle Rock - Eye Bridge - Top Left": {
        always: {
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "bigkey", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
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
              allOf: ["canReach|Turtle Rock - Main", "bigkey", "keys|3", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|3", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            "canReach|Turtle Rock - Back",
          ],
        },
      },
      "Turtle Rock - Eye Bridge - Top Right": {
        always: {
          anyOf: [
            {
              allOf: ["canBreachTurtleRockMainMaybe", "bigkey", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            "canBreach|Turtle Rock - Back",
          ],
        },
        required: {
          anyOf: [
            {
              allOf: ["canBreach|Turtle Rock - Main", "bigkey", "keys|2", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
              anyOf: ["somaria", "canHoverAlot"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "canOpenBonkWalls", "canDarkRoomNavigateBlind"],
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
              allOf: ["canReach|Turtle Rock - Main", "bigkey", "keys|3", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            {
              allOf: ["canBreachTurtleRockMiddle", "bigkey", "keys|3", "canOpenBonkWalls", "canDarkRoomNavigate", "somaria"],
            },
            "canReach|Turtle Rock - Back",
          ],
        },
      },
      "Turtle Rock - Roller Room - Left": {
        always: {
          allOf: ["somaria", "firerod"],
          anyOf: [
            "canBreachTurtleRockMainMaybe",
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
        required: {
          anyOf: [
            "canBreach|Turtle Rock - Main",
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch", "keys|1"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
        logical: {
          anyOf: [
            "canReach|Turtle Rock - Main",
            {
              allOf: ["canReachTurtleRockMiddle", "canHitSwitch", "keys|4"],
            },
            {
              allOf: ["canReach|Turtle Rock - Back", "keys|4", "canDarkRoomNavigate", "canHitRangedSwitch", "canOpenBonkWalls"],
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
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
        required: {
          anyOf: [
            "canBreach|Turtle Rock - Main",
            {
              allOf: ["canBreachTurtleRockMiddle", "canHitSwitch", "keys|1"],
            },
            {
              allOf: ["canBreach|Turtle Rock - Back", "keys|1", "canDarkRoomNavigateBlind", "canHitRangedSwitch", "canOpenBonkWalls"],
            },
          ],
        },
        logical: {
          anyOf: [
            "canReach|Turtle Rock - Main",
            {
              allOf: ["canReachTurtleRockMiddle", "canHitSwitch", "keys|4"],
            },
            {
              allOf: ["canReach|Turtle Rock - Back", "keys|4", "canDarkRoomNavigate", "canHitRangedSwitch", "canOpenBonkWalls"],
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
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes", "canLightFires"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire", "keys|3"],
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
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes", "canLightFires"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire", "keys|3"],
        },
      },
      "Misery Mire - Main Lobby": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire"],
          anyOf: ["keys|1", "bigkey"],
        },
      },
      "Misery Mire - Map Chest": {
        always: {
          allOf: ["canBreachMiseryMireMaybe", "canCrossMireGap", "canKillWizzrobes"],
        },
        required: {
          allOf: ["canBreach|Misery Mire"],
        },
        logical: {
          allOf: ["canReach|Misery Mire"],
          anyOf: ["keys|1", "bigkey"],
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
    },
    "Ice Palace": {
      "Ice Palace - Compass Chest": {
        always: {
          allOf: ["canBreach|Ice Palace", "canKillOrExplodeMostEnemies"],
        },
        logical: {
          allOf: ["canReach|Ice Palace"],
        },
      },
      "Ice Palace - Freezor Chest": {
        always: {
          allOf: ["canBreach|Ice Palace", "canBurnThingsMaybeSwordless"],
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
          allOf: ["canBreach|Ice Palace", "bigkey"],
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
          allOf: ["canBreach|Ice Palace"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                {
                  anyOf: ["keys|1", "hookshot", "canBombJump"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "bombs", "hookshot"],
        },
      },
      "Ice Palace - Map Chest": {
        always: {
          allOf: ["canBreach|Ice Palace", "glove", "hammer"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                {
                  anyOf: ["hookshot", "keys|1", "canBombJump"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "hookshot", "bombs"],
        },
      },
      "Ice Palace - Big Key Chest": {
        always: {
          allOf: ["canBreach|Ice Palace"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                "glove",
                "hammer",
                {
                  anyOf: ["hookshot", "keys|1", "canBombJump"],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "hookshot", "bombs", "glove", "hammer"],
        },
      },
      "Ice Palace - Iced T Room": {
        always: {
          allOf: ["canBreach|Ice Palace"],
          anyOf: ["bombs", "canIceBreak"],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "bombs"],
        },
      },
      "Ice Palace - Boss": {
        always: {
          allOf: ["canBreach|Ice Palace", "canBurnThingsMaybeSwordless", "glove", "hammer", "canKillBoss"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                {
                  anyOf: [
                    "canBombJump",
                    {
                      allOf: [
                        "bigkey",
                        {
                          anyOf: ["somaria", "keys|2"],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "bigkey", "keys|1", "bombs"],
          anyOf: ["keys|2", "somaria"],
        },
      },
      "Ice Palace - Prize": {
        always: {
          allOf: ["canBreach|Ice Palace", "canBurnThingsMaybeSwordless", "glove", "hammer", "canKillBoss"],
          anyOf: [
            "canIceBreak",
            {
              allOf: [
                "bombs",
                {
                  anyOf: [
                    "canBombJump",
                    {
                      allOf: [
                        "bigkey",
                        {
                          anyOf: ["somaria", "keys|2"],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        logical: {
          allOf: ["canReach|Ice Palace", "bigkey", "keys|1", "bombs"],
          anyOf: ["keys|2", "somaria"],
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
