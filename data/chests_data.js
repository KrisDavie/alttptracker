(function (window) {
  "use strict";

  window.chests_data = [
    {
        "open_idx": 0,
        "caption": "King's Tomb {boots} + {glove2}/{mirror}",
        "checks": [
            "King's Tomb"
        ]
    },
    {
        "open_idx": 1,
        "caption": "Light World Swamp (2)",
        "checks": [
            "Sunken Treasure",
            "Floodgate Chest"
        ]
    },
    {
        "open_idx": 2,
        "caption": "Link's House",
        "checks": [
            "Link's House"
        ],
        "entrance_idx": 1
    },
    {
        "open_idx": 3,
        "caption": "Spiral Cave",
        "checks": [
            "Spiral Cave"
        ]
    },
    {
        "open_idx": 4,
        "caption": "Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion0} unkown OR possible w/out {firerod})",
        "checks": [
            "Mimic Cave"
        ]
    },
    {
        "open_idx": 5,
        "caption": "Tavern",
        "checks": [
            "Kakariko Tavern"
        ]
    },
    {
        "open_idx": 6,
        "caption": "Chicken House {bomb}",
        "checks": [
            "Chicken House"
        ]
    },
    {
        "open_idx": 7,
        "caption": "Brewery {bomb}",
        "checks": [
            "Brewery"
        ]
    },
    {
        "open_idx": 8,
        "caption": "C-Shaped House",
        "checks": [
            "C-Shaped House"
        ]
    },
    {
        "open_idx": 9,
        "caption": "Aginah's Cave {bomb}",
        "checks": [
            "Aginah's Cave"
        ]
    },
    {
        "open_idx": 10,
        "caption": "Mire Shed (2)",
        "checks": [
            "Mire Shed - Left",
            "Mire Shed - Right"
        ]
    },
    {
        "open_idx": 11,
        "caption": "Super Bunny Chests (2)",
        "checks": [
            "Superbunny Cave - Bottom",
            "Superbunny Cave - Top"
        ]
    },
    {
        "open_idx": 12,
        "caption": "Sahasrahla's Hut (3) {bomb}/{boots}",
        "checks": [
            "Sahasrahla's Hut - Left",
            "Sahasrahla's Hut - Middle",
            "Sahasrahla's Hut - Right"
        ]
    },
    {
        "open_idx": 13,
        "caption": "Spike Cave",
        "checks": [
            "Spike Cave"
        ]
    },
    {
        "open_idx": 14,
        "caption": "Kakariko Well (4 + {bomb})",
        "checks": [
            "Kakariko Well - Bottom",
            "Kakariko Well - Left",
            "Kakariko Well - Middle",
            "Kakariko Well - Right",
            "Kakariko Well - Top"
        ]
    },
    {
        "open_idx": 15,
        "caption": "Thieve's Hut (4 + {bomb})",
        "checks": [
            "Blind's Hideout - Far Left",
            "Blind's Hideout - Left",
            "Blind's Hideout - Right",
            "Blind's Hideout - Far Right",
            "Blind's Hideout - Top"
        ]
    },
    {
        "open_idx": 16,
        "caption": "Hype Cave! {bomb} (NPC + 4 {bomb})",
        "checks": [
            "Hype Cave - Generous Guy",
            "Hype Cave - Bottom",
            "Hype Cave - Middle Right",
            "Hype Cave - Middle Left",
            "Hype Cave - Top"
        ]
    },
    {
        "open_idx": 17,
        "caption": "Paradox Cave (5 + 2 {bomb})",
        "checks": [
            "Paradox Cave Lower - Far Left",
            "Paradox Cave Lower - Left",
            "Paradox Cave Lower - Middle",
            "Paradox Cave Lower - Right",
            "Paradox Cave Lower - Far Right",
            "Paradox Cave Upper - Left",
            "Paradox Cave Upper - Right"
        ]
    },
    {
        "open_idx": 18,
        "caption": "Bonk Rock Cave {boots}",
        "checks": [
            "Bonk Rock Cave"
        ]
    },
    {
        "open_idx": 19,
        "caption": "Minimoldorm Cave (NPC + 4) {bomb}",
        "checks": [
            "Mini Moldorm Cave - Far Left",
            "Mini Moldorm Cave - Left",
            "Mini Moldorm Cave - Generous Guy",
            "Mini Moldorm Cave - Right",
            "Mini Moldorm Cave - Far Right"
        ]
    },
    {
        "open_idx": 20,
        "caption": "Ice Rod Cave {bomb}",
        "checks": [
            "Ice Rod Cave"
        ]
    },
    {
        "open_idx": 21,
        "caption": "Hookshot Cave (bottom chest) {hookshot}/{boots}",
        "checks": [
            "Hookshot Cave - Bottom Right"
        ]
    },
    {
        "open_idx": 22,
        "caption": "Hookshot Cave (3) {hookshot}",
        "checks": [
            "Hookshot Cave - Top Right",
            "Hookshot Cave - Top Left",
            "Hookshot Cave - Bottom Left"
        ]
    },
    {
        "open_idx": 23,
        "caption": "Lost Woods Hideout Tree",
        "checks": [
            "Lost Woods Hideout Tree"
        ],
        "entrance_idx": 23
    },
    {
        "open_idx": 24,
        "caption": "Death Mountain Bonk Rocks",
        "checks": [
            "Death Mountain Bonk Rocks"
        ],
        "entrance_idx": 24
    },
    {
        "open_idx": 25,
        "caption": "Mountain Entry Pull Tree",
        "checks": [
            "Mountain Entry Pull Tree"
        ],
        "entrance_idx": 25
    },
    {
        "open_idx": 26,
        "caption": "Mountain Entry Southeast Tree",
        "checks": [
            "Mountain Entry Southeast Tree"
        ],
        "entrance_idx": 26
    },
    {
        "open_idx": 27,
        "caption": "Lost Woods Pass West Tree",
        "checks": [
            "Lost Woods Pass West Tree"
        ],
        "entrance_idx": 27
    },
    {
        "open_idx": 28,
        "caption": "Kakariko Portal Tree",
        "checks": [
            "Kakariko Portal Tree"
        ],
        "entrance_idx": 28
    },
    {
        "open_idx": 29,
        "caption": "Fortune Bonk Rocks",
        "checks": [
            "Fortune Bonk Rocks"
        ],
        "entrance_idx": 29
    },
    {
        "open_idx": 30,
        "caption": "Kakariko Pond Tree",
        "checks": [
            "Kakariko Pond Tree"
        ],
        "entrance_idx": 30
    },
    {
        "open_idx": 31,
        "caption": "Bonk Rocks Tree",
        "checks": [
            "Bonk Rocks Tree"
        ],
        "entrance_idx": 31
    },
    {
        "open_idx": 32,
        "caption": "Sanctuary Tree",
        "checks": [
            "Sanctuary Tree"
        ],
        "entrance_idx": 32
    },
    {
        "open_idx": 33,
        "caption": "River Bend West Tree",
        "checks": [
            "River Bend West Tree"
        ],
        "entrance_idx": 33
    },
    {
        "open_idx": 34,
        "caption": "River Bend East Tree",
        "checks": [
            "River Bend East Tree"
        ],
        "entrance_idx": 34
    },
    {
        "open_idx": 35,
        "caption": "Blinds Hideout Tree",
        "checks": [
            "Blinds Hideout Tree"
        ],
        "entrance_idx": 35
    },
    {
        "open_idx": 36,
        "caption": "Kakariko Welcome Tree",
        "checks": [
            "Kakariko Welcome Tree"
        ],
        "entrance_idx": 36
    },
    {
        "open_idx": 37,
        "caption": "Forgotten Forest Southwest Tree",
        "checks": [
            "Forgotten Forest Southwest Tree"
        ],
        "entrance_idx": 37
    },
    {
        "open_idx": 38,
        "caption": "Forgotten Forest Central Tree",
        "checks": [
            "Forgotten Forest Central Tree"
        ],
        "entrance_idx": 38
    },
    {
        "open_idx": 39,
        "caption": "Hyrule Castle Tree",
        "checks": [
            "Hyrule Castle Tree"
        ],
        "entrance_idx": 39
    },
    {
        "open_idx": 40,
        "caption": "Wooden Bridge Tree",
        "checks": [
            "Wooden Bridge Tree"
        ],
        "entrance_idx": 40
    },
    {
        "open_idx": 41,
        "caption": "Eastern Palace Tree",
        "checks": [
            "Eastern Palace Tree"
        ],
        "entrance_idx": 41
    },
    {
        "open_idx": 42,
        "caption": "Flute Boy South Tree",
        "checks": [
            "Flute Boy South Tree"
        ],
        "entrance_idx": 42
    },
    {
        "open_idx": 43,
        "caption": "Flute Boy East Tree",
        "checks": [
            "Flute Boy East Tree"
        ],
        "entrance_idx": 43
    },
    {
        "open_idx": 44,
        "caption": "Central Bonk Rocks Tree",
        "checks": [
            "Central Bonk Rocks Tree"
        ],
        "entrance_idx": 44
    },
    {
        "open_idx": 45,
        "caption": "Tree Line Tree 2",
        "checks": [
            "Tree Line Tree 2"
        ],
        "entrance_idx": 45
    },
    {
        "open_idx": 46,
        "caption": "Tree Line Tree 4",
        "checks": [
            "Tree Line Tree 4"
        ],
        "entrance_idx": 46
    },
    {
        "open_idx": 47,
        "caption": "Flute Boy Approach South Tree",
        "checks": [
            "Flute Boy Approach South Tree"
        ],
        "entrance_idx": 47
    },
    {
        "open_idx": 48,
        "caption": "Flute Boy Approach North Tree",
        "checks": [
            "Flute Boy Approach North Tree"
        ],
        "entrance_idx": 48
    },
    {
        "open_idx": 49,
        "caption": "Dark Lumberjack Tree",
        "checks": [
            "Dark Lumberjack Tree"
        ],
        "entrance_idx": 49
    },
    {
        "open_idx": 50,
        "caption": "Dark Fortune Bonk Rocks (2)",
        "checks": [
            "Dark Fortune Bonk Rocks (2)"
        ],
        "entrance_idx": 50
    },
    {
        "open_idx": 51,
        "caption": "Dark Graveyard West Bonk Rocks",
        "checks": [
            "Dark Graveyard West Bonk Rocks"
        ],
        "entrance_idx": 51
    },
    {
        "open_idx": 52,
        "caption": "Dark Graveyard North Bonk Rocks",
        "checks": [
            "Dark Graveyard North Bonk Rocks"
        ],
        "entrance_idx": 52
    },
    {
        "open_idx": 53,
        "caption": "Dark Graveyard Tomb Bonk Rocks",
        "checks": [
            "Dark Graveyard Tomb Bonk Rocks"
        ],
        "entrance_idx": 53
    },
    {
        "open_idx": 54,
        "caption": "Qirn Jump West Tree",
        "checks": [
            "Qirn Jump West Tree"
        ],
        "entrance_idx": 54
    },
    {
        "open_idx": 55,
        "caption": "Qirn Jump East Tree",
        "checks": [
            "Qirn Jump East Tree"
        ],
        "entrance_idx": 55
    },
    {
        "open_idx": 56,
        "caption": "Dark Witch Tree",
        "checks": [
            "Dark Witch Tree"
        ],
        "entrance_idx": 56
    },
    {
        "open_idx": 57,
        "caption": "Pyramid Tree",
        "checks": [
            "Pyramid Tree"
        ],
        "entrance_idx": 57
    },
    {
        "open_idx": 58,
        "caption": "Palace of Darkness Tree",
        "checks": [
            "Palace of Darkness Tree"
        ],
        "entrance_idx": 58
    },
    {
        "open_idx": 59,
        "caption": "Dark Tree Line Tree 2",
        "checks": [
            "Dark Tree Line Tree 2"
        ],
        "entrance_idx": 59
    },
    {
        "open_idx": 60,
        "caption": "Dark Tree Line Tree 3",
        "checks": [
            "Dark Tree Line Tree 3"
        ],
        "entrance_idx": 60
    },
    {
        "open_idx": 61,
        "caption": "Dark Tree Line Tree 4",
        "checks": [
            "Dark Tree Line Tree 4"
        ],
        "entrance_idx": 61
    },
    {
        "open_idx": 62,
        "caption": "Hype Cave Statue",
        "checks": [
            "Hype Cave Statue"
        ],
        "entrance_idx": 62
    },
    {
        "open_idx": 63,
        "caption": "Cold Fairy Statue",
        "checks": [
            "Cold Fairy Statue"
        ]
    },
    {
        "open_idx": 64,
        "caption": "Treasure Chest Minigame: Pay 30 rupees",
        "checks": [
            "Chest Game"
        ]
    },
    {
        "open_idx": 65,
        "caption": "Bottle Merchant: 100 rupees",
        "checks": [
            "Bottle Merchant"
        ]
    },
    {
        "open_idx": 66,
        "caption": "Sahasrahla {pendant0}",
        "checks": [
            "Sahasrahla"
        ]
    },
    {
        "open_idx": 67,
        "caption": "Stumpy",
        "checks": [
            "Stumpy"
        ],
        "entrance_idx": 3
    },
    {
        "open_idx": 68,
        "caption": "Muffins Kid: Distract him with {bottle}!",
        "checks": [
            "Sick Kid"
        ]
    },
    {
        "open_idx": 69,
        "caption": "Gary's Lunchbox (save the frog first)",
        "checks": [
            "Purple Chest"
        ],
        "entrance_idx": 4
    },
    {
        "open_idx": 70,
        "caption": "Admin under the bridge {flippers}",
        "checks": [
            "Hobo"
        ],
        "entrance_idx": 5
    },
    {
        "open_idx": 71,
        "caption": "Ether Tablet {sword2}{book}",
        "checks": [
            "Ether Tablet"
        ],
        "entrance_idx": 6
    },
    {
        "open_idx": 72,
        "caption": "Bombos Tablet {mirror}{sword2}{book}",
        "checks": [
            "Bombos Tablet"
        ],
        "entrance_idx": 7
    },
    {
        "open_idx": 73,
        "caption": "Catfish",
        "checks": [
            "Catfish"
        ],
        "entrance_idx": 8
    },
    {
        "open_idx": 74,
        "caption": "King Zora: Pay 500 rupees",
        "checks": [
            "King Zora"
        ],
        "entrance_idx": 9
    },
    {
        "open_idx": 75,
        "caption": "Lost Old Man {lantern}",
        "checks": [
            "Old Man"
        ],
        "entrance_idx": 10
    },
    {
        "open_idx": 76,
        "caption": "Witch: Give her {mushroom}",
        "checks": [
            "Potion Shop"
        ]
    },
    {
        "open_idx": 77,
        "caption": "Forest Hideout",
        "checks": [
            "Lost Woods Hideout"
        ]
    },
    {
        "open_idx": 78,
        "caption": "Lumberjack Tree {agahnim}{boots}",
        "checks": [
            "Lumberjack Tree"
        ]
    },
    {
        "open_idx": 79,
        "caption": "Spectacle Rock Cave",
        "checks": [
            "Spectacle Rock Cave"
        ]
    },
    {
        "open_idx": 80,
        "caption": "South of Grove {mirror}",
        "checks": [
            "Cave 45"
        ]
    },
    {
        "open_idx": 81,
        "caption": "Graveyard Cliff Cave {mirror} {bomb}",
        "checks": [
            "Graveyard Cave"
        ]
    },
    {
        "open_idx": 82,
        "caption": "Checkerboard Cave {mirror}",
        "checks": [
            "Checkerboard Cave"
        ]
    },
    {
        "open_idx": 83,
        "caption": "Hammerpegs {hammer}!",
        "checks": [
            "Peg Cave"
        ]
    },
    {
        "open_idx": 84,
        "caption": "Library {boots}",
        "checks": [
            "Library"
        ]
    },
    {
        "open_idx": 85,
        "caption": "Mushroom",
        "checks": [
            "Mushroom"
        ],
        "entrance_idx": 11
    },
    {
        "open_idx": 86,
        "caption": "Spectacle Rock {mirror}",
        "checks": [
            "Spectacle Rock"
        ],
        "entrance_idx": 12
    },
    {
        "open_idx": 87,
        "caption": "Floating Island {bomb} {mirror}",
        "checks": [
            "Floating Island"
        ]
    },
    {
        "open_idx": 88,
        "caption": "Race Minigame {bomb}/{boots}",
        "checks": [
            "Maze Race"
        ]
    },
    {
        "open_idx": 89,
        "caption": "Desert West Ledge {book}/{mirror}",
        "checks": [
            "Desert Ledge"
        ]
    },
    {
        "open_idx": 90,
        "caption": "Lake Hylia Island {mirror}",
        "checks": [
            "Lake Hylia Island"
        ],
        "entrance_idx": 16
    },
    {
        "open_idx": 91,
        "caption": "Bumper Cave {cape}",
        "checks": [
            "Bumper Cave Ledge"
        ],
        "entrance_idx": 17
    },
    {
        "open_idx": 92,
        "caption": "Pyramid",
        "checks": [
            "Pyramid"
        ],
        "entrance_idx": 18
    },
    {
        "open_idx": 93,
        "caption": "Digging Game: Pay 80 rupees",
        "checks": [
            "Digging Game"
        ],
        "entrance_idx": 19
    },
    {
        "open_idx": 94,
        "caption": "Zora River Ledge {flippers}",
        "checks": [
            "Zora's Ledge"
        ],
        "entrance_idx": 20
    },
    {
        "open_idx": 95,
        "caption": "Buried Itam {shovel}",
        "checks": [
            "Flute Spot"
        ],
        "entrance_idx": 21
    },
    {
        "open_idx": 96,
        "caption": "Escape Sewer Side Room (3) {bomb}/{boots}",
        "checks": [
            "Escape Sewer Side Room"
        ]
    },
    {
        "open_idx": 97,
        "caption": "Castle Secret Entrance (Uncle + 1)",
        "checks": [
            "Link's Uncle",
            "Secret Passage"
        ]
    },
    {
        "open_idx": 98,
        "caption": "Hyrule Castle Dungeon (3)",
        "checks": [
            "Hyrule Castle Dungeon (3)"
        ]
    },
    {
        "open_idx": 99,
        "caption": "Sanctuary",
        "checks": [
            "Sanctuary"
        ]
    },
    {
        "open_idx": 100,
        "caption": "Mad Batter {hammer}/{mirror} + {powder}",
        "checks": [
            "Magic Bat"
        ]
    },
    {
        "open_idx": 101,
        "caption": "Take the frog home {mirror} / Save+Quit",
        "checks": [
            "Blacksmith"
        ]
    },
    {
        "open_idx": 102,
        "caption": "Pyramid Fairy: Buy OJ bomb from Dark Link's House after {crystal}5 {crystal}6 (2 items)",
        "checks": [
            "Pyramid Fairy - Left",
            "Pyramid Fairy - Right"
        ]
    },
    {
        "open_idx": 103,
        "caption": "Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})",
        "checks": [
            "Master Sword Pedestal"
        ],
        "entrance_idx": 22
    },
    {
        "open_idx": 104,
        "caption": "Escape Sewer Dark Room {lantern}",
        "checks": [
            "Escape Sewer Dark Cross"
        ]
    },
    {
        "open_idx": 105,
        "caption": "Waterfall of Wishing (2) {flippers}",
        "checks": [
            "Waterfall Fairy - Left",
            "Waterfall Fairy - Right"
        ]
    },
    {
        "open_idx": 106,
        "caption": "Castle Tower",
        "checks": [
            "Castle Tower"
        ]
    },
    {
        "open_idx": 107,
        "caption": "Castle Tower (small key)",
        "checks": [
            "Castle Tower - Room 03"
        ]
    },
    {
        "open_idx": 108,
        "caption": "Lake Hylia Shop (3)",
        "checks": [
            "Lake Hylia Shop - Left",
            "Lake Hylia Shop - Middle",
            "Lake Hylia Shop - Right"
        ]
    },
    {
        "open_idx": 109,
        "caption": "Kakariko Shop (3)",
        "checks": [
            "Kakariko Shop - Left",
            "Kakariko Shop - Middle",
            "Kakariko Shop - Right"
        ]
    },
    {
        "open_idx": 110,
        "caption": "Paradox Shop (3) {bomb}",
        "checks": [
            "Paradox Shop - Left",
            "Paradox Shop - Middle",
            "Paradox Shop - Right"
        ]
    },
    {
        "open_idx": 111,
        "caption": "Dark Lake Hylia Shop (3)",
        "checks": [
            "Dark Lake Hylia Shop - Left",
            "Dark Lake Hylia Shop - Middle",
            "Dark Lake Hylia Shop - Right"
        ]
    },
    {
        "open_idx": 112,
        "caption": "Village of Outcasts Shop (3) {hammer}",
        "checks": [
            "Village of Outcasts Shop - Left",
            "Village of Outcasts Shop - Middle",
            "Village of Outcasts Shop - Right"
        ]
    },
    {
        "open_idx": 113,
        "caption": "Dark Death Mountain Shop (3)",
        "checks": [
            "Dark Death Mountain Shop - Left",
            "Dark Death Mountain Shop - Middle",
            "Dark Death Mountain Shop - Right"
        ]
    },
    {
        "open_idx": 114,
        "caption": "Dark Potion Shop (3)",
        "checks": [
            "Dark Potion Shop - Left",
            "Dark Potion Shop - Middle",
            "Dark Potion Shop - Right"
        ]
    },
    {
        "open_idx": 115,
        "caption": "Dark Lumberjack Shop (3)",
        "checks": [
            "Dark Lumberjack Shop - Left",
            "Dark Lumberjack Shop - Middle",
            "Dark Lumberjack Shop - Right"
        ]
    },
    {
        "open_idx": 116,
        "caption": "Red Shield Shop (3)",
        "checks": [
            "Red Shield Shop - Left",
            "Red Shield Shop - Middle",
            "Red Shield Shop - Right"
        ]
    },
    {
        "open_idx": 117,
        "caption": "Potion Shop (3)",
        "checks": [
            "Potion Shop - Left",
            "Potion Shop - Middle",
            "Potion Shop - Right"
        ]
    },
    {
        "open_idx": 118,
        "caption": "Capacity Upgrade Fairy (2)",
        "checks": [
            "Capacity Upgrade - Left",
            "Capacity Upgrade - Right"
        ]
    },
    {
        "open_idx": 119,
        "caption": "Bomb Shop (2)",
        "checks": [
            "Bomb Shop - Left",
            "Bomb Shop - Right"
        ]
    },
    {
        'open_idx': 120,
        'caption': 'Gauntlet E-Tank',
        'checks': ['Gauntlet E-Tank']
    },
    {
        'open_idx': 121,
        'caption': 'Back of Gauntlet - Left',
        'checks': ['Back of Gauntlet - Left']
    },
    {
        'open_idx': 122,
        'caption': 'Back of Gauntlet - Right',
        'checks': ['Back of Gauntlet - Right']
    },
    {
        'open_idx': 123,
        'caption': 'Terminator E-Tank',
        'checks': ['Terminator E-Tank']
    },
    {
        'open_idx': 124,
        'caption': 'Crateria Power Bomb',
        'checks': ['Crateria Power Bomb']
    },
    { 'open_idx': 125, 'caption': 'Bomb Torizo', 'checks': ['Bomb Torizo'] },
    { 'open_idx': 126, 'caption': '230 Missile', 'checks': ['230 Missile'] },
    { 'open_idx': 127, 'caption': 'Climb Super', 'checks': ['Climb Super'] },
    {
        'open_idx': 128,
        'caption': 'Old Mother Brain Missile',
        'checks': ['Old Mother Brain Missile']
    },
    { 'open_idx': 129, 'caption': 'Moat Missile', 'checks': ['Moat Missile'] },
    { 'open_idx': 130, 'caption': 'Sky Missile', 'checks': ['Sky Missile'] },
    { 'open_idx': 131, 'caption': 'Maze Missile', 'checks': ['Maze Missile'] },
    { 'open_idx': 132, 'caption': 'Ocean Missile', 'checks': ['Ocean Missile'] },
    {
        'open_idx': 133,
        'caption': 'Early Super Bridge Missile',
        'checks': ['Early Super Bridge Missile']
    },
    {
        'open_idx': 134,
        'caption': 'Brinstar Reserve',
        'checks': ['Brinstar Reserve']
    },
    {
        'open_idx': 135,
        'caption': 'Brinstar Reserve Front Missile',
        'checks': ['Brinstar Reserve Front Missile']
    },
    {
        'open_idx': 136,
        'caption': 'Brinstar Reserve Back Missile',
        'checks': ['Brinstar Reserve Back Missile']
    },
    { 'open_idx': 137, 'caption': 'Early Super', 'checks': ['Early Super'] },
    {
        'open_idx': 138,
        'caption': 'Etecoons E-Tank',
        'checks': ['Etecoons E-Tank']
    },
    { 'open_idx': 139, 'caption': 'Etecoons Super', 'checks': ['Etecoons Super'] },
    {
        'open_idx': 140,
        'caption': 'Etecoons Power Bomb',
        'checks': ['Etecoons Power Bomb']
    },
    {
        'open_idx': 141,
        'caption': 'Mission Impossible Missile',
        'checks': ['Mission Impossible Missile']
    },
    {
        'open_idx': 142,
        'caption': 'Mission Impossible Power Bomb',
        'checks': ['Mission Impossible Power Bomb']
    },
    {
        'open_idx': 143,
        'caption': 'Wave Gate E-Tank',
        'checks': ['Wave Gate E-Tank']
    },
    {
        'open_idx': 144,
        'caption': 'Spore Spawn Super',
        'checks': ['Spore Spawn Super']
    },
    { 'open_idx': 145, 'caption': 'Charge Missile', 'checks': ['Charge Missile'] },
    { 'open_idx': 146, 'caption': 'Charge Beam', 'checks': ['Charge Beam'] },
    {
        'open_idx': 147,
        'caption': 'Waterway E-Tank',
        'checks': ['Waterway E-Tank']
    },
    { 'open_idx': 148, 'caption': 'Pipe Missile', 'checks': ['Pipe Missile'] },
    {
        'open_idx': 149,
        'caption': 'Behind Morph Power Bomb',
        'checks': ['Behind Morph Power Bomb']
    },
    {
        'open_idx': 150,
        'caption': 'Morph Ball Pedestal',
        'checks': ['Morph Ball Pedestal']
    },
    { 'open_idx': 151, 'caption': 'Alpha Missile', 'checks': ['Alpha Missile'] },
    {
        'open_idx': 152,
        'caption': 'Blue Brinstar Ceiling E-Tank',
        'checks': ['Blue Brinstar Ceiling E-Tank']
    },
    { 'open_idx': 153, 'caption': 'Beta Missile', 'checks': ['Beta Missile'] },
    {
        'open_idx': 154,
        'caption': 'Billy Mays Front Missile',
        'checks': ['Billy Mays Front Missile', 'Billy Mays Hidden Missile']
    },
    {
        'open_idx': 155,
        'caption': 'Alpha Power Bomb',
        'checks': ['Alpha Power Bomb']
    },
    {
        'open_idx': 156,
        'caption': 'Alpha Power Bomb Missile',
        'checks': ['Alpha Power Bomb Missile']
    },
    {
        'open_idx': 157,
        'caption': 'Beta Power Bomb',
        'checks': ['Beta Power Bomb']
    },
    { 'open_idx': 158, 'caption': 'X-Ray Scope', 'checks': ['X-Ray Scope'] },
    { 'open_idx': 159, 'caption': 'Spazer', 'checks': ['Spazer'] },
    { 'open_idx': 160, 'caption': 'Kraid Missile', 'checks': ['Kraid Missile'] },
    { 'open_idx': 161, 'caption': 'Varia Suit', 'checks': ['Varia Suit'] },
    { 'open_idx': 162, 'caption': 'Kraid E-Tank', 'checks': ['Kraid E-Tank'] },
    { 'open_idx': 163, 'caption': 'Spooky Missile', 'checks': ['Spooky Missile'] },
    {
        'open_idx': 164,
        'caption': 'Wrecked Ship Left Supers',
        'checks': ['Wrecked Ship Left Supers']
    },
    {
        'open_idx': 165,
        'caption': 'Wrecked Ship Right Supers',
        'checks': ['Wrecked Ship Right Supers']
    },
    {
        'open_idx': 166,
        'caption': 'Wrecked Ship E-Tank',
        'checks': ['Wrecked Ship E-Tank']
    },
    { 'open_idx': 167, 'caption': 'Attic Missile', 'checks': ['Attic Missile'] },
    {
        'open_idx': 168,
        'caption': 'Bowling Missile',
        'checks': ['Bowling Missile']
    },
    {
        'open_idx': 169,
        'caption': 'Wrecked Ship Reserve',
        'checks': ['Wrecked Ship Reserve']
    },
    { 'open_idx': 170, 'caption': 'Gravity Suit', 'checks': ['Gravity Suit'] },
    {
        'open_idx': 171,
        'caption': 'Main Street Missile',
        'checks': ['Main Street Missile']
    },
    { 'open_idx': 172, 'caption': 'Crab Super', 'checks': ['Crab Super'] },
    {
        'open_idx': 173,
        'caption': 'Mama Turtle E-Tank',
        'checks': ['Mama Turtle E-Tank']
    },
    {
        'open_idx': 174,
        'caption': 'Mama Turtle Missile',
        'checks': ['Mama Turtle Missile']
    },
    { 'open_idx': 175, 'caption': 'Beach Missile', 'checks': ['Beach Missile'] },
    {
        'open_idx': 176,
        'caption': 'Watering Hole - Left',
        'checks': ['Watering Hole - Left', 'Watering Hole - Right']
    },
    {
        'open_idx': 177,
        'caption': 'Left Sand Pit Missile',
        'checks': ['Left Sand Pit Missile', 'Maridia Reserve']
    },
    {
        'open_idx': 178,
        'caption': 'Right Sand Pit Missile',
        'checks': ['Right Sand Pit Missile']
    },
    {
        'open_idx': 179,
        'caption': 'Right Sand Pit Power Bomb',
        'checks': ['Right Sand Pit Power Bomb']
    },
    {
        'open_idx': 180,
        'caption': 'Aqueduct Missile',
        'checks': ['Aqueduct Missile']
    },
    { 'open_idx': 181, 'caption': 'Aqueduct Super', 'checks': ['Aqueduct Super'] },
    { 'open_idx': 182, 'caption': 'Botwoon E-Tank', 'checks': ['Botwoon E-Tank'] },
    {
        'open_idx': 183,
        'caption': 'Precious Missile',
        'checks': ['Precious Missile']
    },
    { 'open_idx': 184, 'caption': 'Space Jump', 'checks': ['Space Jump'] },
    { 'open_idx': 185, 'caption': 'Plasma Beam', 'checks': ['Plasma Beam'] },
    { 'open_idx': 186, 'caption': 'Spring Ball', 'checks': ['Spring Ball'] },
    {
        'open_idx': 187,
        'caption': 'Hi-Jump Boots E-Tank',
        'checks': ['Hi-Jump Boots E-Tank']
    },
    { 'open_idx': 188, 'caption': 'Hi-Jump Boots', 'checks': ['Hi-Jump Boots'] },
    {
        'open_idx': 189,
        'caption': 'Hi-Jump Boots Missile',
        'checks': ['Hi-Jump Boots Missile']
    },
    { 'open_idx': 190, 'caption': 'Ice Beam', 'checks': ['Ice Beam'] },
    {
        'open_idx': 191,
        'caption': 'Crumble Shaft Missile',
        'checks': ['Crumble Shaft Missile']
    },
    {
        'open_idx': 192,
        'caption': 'Cathedral Missile',
        'checks': ['Cathedral Missile']
    },
    {
        'open_idx': 193,
        'caption': 'Bubble Mountain Corner Missile',
        'checks': ['Bubble Mountain Corner Missile']
    },
    {
        'open_idx': 194,
        'caption': 'Norfair Reserve Front Missile',
        'checks': ['Norfair Reserve Front Missile']
    },
    {
        'open_idx': 195,
        'caption': 'Norfair Reserve Hidden Missile',
        'checks': ['Norfair Reserve Hidden Missile']
    },
    {
        'open_idx': 196,
        'caption': 'Norfair Reserve',
        'checks': ['Norfair Reserve']
    },
    { 'open_idx': 197, 'caption': 'Speed Missile', 'checks': ['Speed Missile'] },
    { 'open_idx': 198, 'caption': 'Speed Booster', 'checks': ['Speed Booster'] },
    { 'open_idx': 199, 'caption': 'Wave Missile', 'checks': ['Wave Missile'] },
    { 'open_idx': 200, 'caption': 'Wave Beam', 'checks': ['Wave Beam'] },
    {
        'open_idx': 201,
        'caption': 'Crocomire E-Tank',
        'checks': ['Crocomire E-Tank']
    },
    {
        'open_idx': 202,
        'caption': 'Croc Power Bomb',
        'checks': ['Croc Power Bomb']
    },
    { 'open_idx': 203, 'caption': 'Cosine Missile', 'checks': ['Cosine Missile'] },
    {
        'open_idx': 204,
        'caption': 'Indiana Jones Missile',
        'checks': ['Indiana Jones Missile']
    },
    { 'open_idx': 205, 'caption': 'Grapple Beam', 'checks': ['Grapple Beam'] },
    {
        'open_idx': 206,
        'caption': 'Croc Escape Missile',
        'checks': ['Croc Escape Missile']
    },
    {
        'open_idx': 207,
        'caption': 'Gold Torizo Missile',
        'checks': ['Gold Torizo Missile']
    },
    {
        'open_idx': 208,
        'caption': 'Gold Torizo Super',
        'checks': ['Gold Torizo Super']
    },
    { 'open_idx': 209, 'caption': 'Screw Attack', 'checks': ['Screw Attack'] },
    {
        'open_idx': 210,
        'caption': 'Mickey Mouse Missile',
        'checks': ['Mickey Mouse Missile']
    },
    {
        'open_idx': 211,
        'caption': 'Firefleas E-Tank',
        'checks': ['Firefleas E-Tank']
    },
    {
        'open_idx': 212,
        'caption': 'Hotarubi Missile',
        'checks': ['Hotarubi Missile']
    },
    {
        'open_idx': 213,
        'caption': 'Jail Power Bomb',
        'checks': ['Jail Power Bomb']
    },
    {
        'open_idx': 214,
        'caption': 'FrankerZ Missile',
        'checks': ['FrankerZ Missile']
    },
    {
        'open_idx': 215,
        'caption': 'Power Bombs of Shame',
        'checks': ['Power Bombs of Shame']
    },
    { 'open_idx': 216, 'caption': 'Ridley E-Tank', 'checks': ['Ridley E-Tank'] },
    { 'open_idx': 217, 'caption': 'Kraid', 'checks': ['Kraid'] },
    { 'open_idx': 218, 'caption': 'Phantoon', 'checks': ['Phantoon'] },
    { 'open_idx': 219, 'caption': 'Draygon', 'checks': ['Draygon'] },
    { 'open_idx': 220, 'caption': 'Ridley', 'checks': ['Ridley'] },
    {
        "entrance_idx": 0,
        "caption": "Sunken Treasure",
        "checks": [
            "Sunken Treasure"
        ]
    },
    {
        "entrance_idx": 2,
        "caption": "Bottle Merchant: Pay 100 rupees",
        "checks": [
            "Bottle Merchant"
        ]
    },
    {
        "entrance_idx": 13,
        "caption": "Floating Island {mirror}",
        "checks": [
            "Floating Island"
        ]
    },
    {
        "entrance_idx": 14,
        "caption": "Race Minigame",
        "checks": [
            "Maze Race"
        ]
    },
    {
        "entrance_idx": 15,
        "caption": "Desert West Ledge",
        "checks": [
            "Desert Ledge"
        ]
    },
    
];

})(window);
