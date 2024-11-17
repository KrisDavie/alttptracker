(function(window) {
    'use strict';

    window.bigDungeonData = [
        {
            "id": 0,
            "name": "Eastern Palace",
            "shortName": "ep",
            "regions": ["Eastern Palace"],
            "entranceModal": [
                {
                    "nameSuffix": "",
                    "tag": "ep",
                    "group": "lwdungeon",
                    "style": "--ep-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest0",
                "default": 6,
                "keys": 0,
                "keypot": 1,
                "keydrop": 1,
                "pottery": 0,
                "mobbery": 0,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest0",
                "locations": [[0x172, 0x10], [0x154, 0x10], [0x150, 0x10], [0x152, 0x10], [0x170, 0x10], [0x191, 0x08]],
                "keydrops": [[0x133, 0x10]],
                "keypots": [[0x175, 0x8]],
                "compass": [0x365, 0x20],
                "bigkey": [0x367, 0x20],
                "map": [0x369, 0x20],
                "smallkeys": 0x4E2,
                "prize": 0x2,
                "dungeonprize": 0
            }
        },
        {
            "id": 1,
            "name": "Desert Palace",
            "shortName": "dp",
            "regions": ["Desert Palace - Main", "Desert Palace - North"],
            "entranceModal": [
                {
                    "nameSuffix": "Main",
                    "tag": "dp_m",
                    "group": "lwdungeon",
                    "style": "--dp-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "West",
                    "tag": "dp_w",
                    "group": "lwdungeon",
                    "style": "--dp-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "East",
                    "tag": "dp_e",
                    "group": "lwdungeon",
                    "style": "--dp-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "North",
                    "tag": "dp_n",
                    "group": "lwdungeon",
                    "style": "--dp_n-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest1",
                "default": 6,
                "keys": 1,
                "keypot": 3,
                "keydrop": 0,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest1",
                "locations": [[0xe6, 0x10], [0xe7, 0x04], [0xe8, 0x10], [0x10a, 0x10], [0xea, 0x10], [0x67, 0x08]],
                "keydrops": [],
                "keypots": [[0xc7, 0x4], [0xa7, 0x20], [0x87, 0x1]],
                "compass": [0x365, 0x10],
                "bigkey": [0x367, 0x10],
                "map": [0x369, 0x10],
                "smallkeys": 0x4E3,
                "prize": 0x3,
                "dungeonprize": 1
            }
        },
        {
            "id": 2,
            "name": "Tower of Hera",
            "shortName": "toh",
            "regions": ["Tower of Hera"],
            "entranceModal": [
                {
                    "nameSuffix": "",
                    "tag": "toh",
                    "group": "lwdungeon",
                    "style": "--toh-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest2",
                "default": 6,
                "keys": 1,
                "keypot": 0,
                "keydrop": 0,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest2",
                "locations": [[0x10f, 0x04], [0xee, 0x10], [0x10e, 0x10], [0x4e, 0x10], [0x4e, 0x20], [0xf, 0x08]],
                "keydrops": [],
                "keypots": [],
                "compass": [0x364, 0x20],
                "bigkey": [0x366, 0x20],
                "map": [0x368, 0x20],
                "smallkeys": 0x4EA,
                "prize": 0xA,
                "dungeonprize": 2
            }
        },
        {
            "id": 3,
            "name": "Palace of Darkness",
            "shortName": "pod",
            "regions": ["Palace of Darkness"],
            "entranceModal": [
                {
                    "nameSuffix": "",
                    "tag": "pod",
                    "group": "dwdungeon",
                    "style": "--pod-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest3",
                "default": 14,
                "keys": 6,
                "keypot": 0,
                "keydrop": 0,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest3",
                "locations": [[0x12, 0x10], [0x56, 0x10], [0x54, 0x10], [0x54, 0x20], [0x74, 0x10], [0x14, 0x10], [0x34, 0x10], [0x34, 0x20], [0x34, 0x40], [0x32, 0x10], [0x32, 0x20], [0xd4, 0x10], [0xd4, 0x20], [0xb5, 0x08]],
                "keydrops": [],
                "keypots": [],
                "compass": [0x365, 0x02],
                "bigkey": [0x367, 0x02],
                "map": [0x369, 0x02],
                "smallkeys": 0x4E6,
                "prize": 0x6,
                "dungeonprize": 3
            }
        },
        {
            "id": 4,
            "name": "Swamp Palace",
            "shortName": "sp",
            "regions": ["Swamp Palace"],
            "entranceModal": [
                {
                    "nameSuffix": "",
                    "tag": "sp",
                    "group": "dwdungeon",
                    "style": "--sp-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest4",
                "default": 10,
                "keys": 1,
                "keypot": 5,
                "keydrop": 0,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest4",
                "locations": [[0x50, 0x10], [0x6e, 0x10], [0x6c, 0x10], [0x6a, 0x10], [0x68, 0x10], [0x8c, 0x10], [0xec, 0x10], [0xec, 0x20], [0xcc, 0x10], [0xd, 0x08]],
                "keydrops": [],
                "keypots": [[0x71, 0x10], [0x6f, 0x80], [0x6d, 0x8], [0x6b, 0x80], [0x2c, 0x80]],
                "compass": [0x365, 0x04],
                "bigkey": [0x367, 0x04],
                "map": [0x369, 0x04],
                "smallkeys": 0x4E5,
                "prize": 0x5,
                "dungeonprize": 4
            }
        },
        {
            "id": 5,
            "name": "Skull Woods",
            "shortName": "sw",
            "regions": ["Skull Woods - Main", "Skull Woods - Middle", "Skull Woods - Back", "Skull Woods - Drops"],
            "entranceModal": [
                {
                    "nameSuffix": "Back",
                    "tag": "sw",
                    "group": "dwdungeon",
                    "style": "--sw-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "Main",
                    "tag": "sw_m",
                    "group": "dwdungeon",
                    "style": "--sw-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "West",
                    "tag": "sw_w",
                    "group": "dwdungeon",
                    "style": "--sw-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "East",
                    "tag": "sw_e",
                    "group": "dwdungeon",
                    "style": "--sw-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest5",
                "default": 8,
                "keys": 3,
                "keypot": 1,
                "keydrop": 1,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest5",
                "locations": [[0xce, 0x10], [0xd0, 0x10], [0xae, 0x10], [0xae, 0x20], [0xb0, 0x10], [0xb0, 0x20], [0xb2, 0x10], [0x53, 0x08]],
                "keydrops": [[0x73, 0x40]],
                "keypots": [[0xac, 0x4]],
                "compass": [0x364, 0x80],
                "bigkey": [0x366, 0x80],
                "map": [0x368, 0x80],
                "smallkeys": 0x4E8,
                "prize": 0x8,
                "dungeonprize": 5
            }                
        },
        {
            "id": 6,
            "name": "Thieves Town",
            "shortName": "tt",
            "regions": ["Thieves Town"],
            "entranceModal": [
                {
                    "nameSuffix": "",
                    "tag": "tt",
                    "group": "dwdungeon",
                    "style": "--tt-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest6",
                "default": 8,
                "keys": 1,
                "keypot": 2,
                "keydrop": 0,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest6",
                "locations": [[0x1b6, 0x10], [0x1b6, 0x20], [0x196, 0x10], [0x1b8, 0x10], [0xca, 0x10], [0x8a, 0x10], [0x88, 0x10], [0x159, 0x08]],
                "keydrops": [],
                "keypots": [[0x179, 0x40], [0x157, 0x80]],
                "compass": [0x364, 0x10],
                "bigkey": [0x366, 0x10],
                "map": [0x368, 0x10],
                "smallkeys": 0x4EB,
                "prize": 0xB,
                "dungeonprize": 6
            }
        },
        {
            "id": 7,
            "name": "Ice Palace",
            "shortName": "ip",
            "regions": ["Ice Palace"],
            "entranceModal": [
                {
                    "nameSuffix": "",
                    "tag": "ip",
                    "group": "dwdungeon",
                    "style": "--ip-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest7",
                "default": 8,
                "keys": 2,
                "keypot": 2,
                "keydrop": 2,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest7",
                "locations": [[0x5c, 0x10], [0x7e, 0x10], [0x3e, 0x10], [0xbe, 0x10], [0xfc, 0x10], [0x15c, 0x10], [0x13c, 0x10], [0x1bd, 0x08]],
                "keydrops": [[0x1d, 0x10], [0x7c, 0x80]],
                "keypots": [[0x7f, 0x2], [0x13f, 0x8]],
                "compass": [0x364, 0x40],
                "bigkey": [0x366, 0x40],
                "map": [0x368, 0x40],
                "smallkeys": 0x4E9,
                "prize": 0x9,
                "dungeonprize": 7
            }
        },
        {
            "id": 8,
            "name": "Misery Mire",
            "shortName": "mm",
            "regions": ["Misery Mire"],
            "entranceModal": [
                {
                    "nameSuffix": "",
                    "tag": "mm",
                    "group": "dwdungeon",
                    "style": "--mm-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest8",
                "default": 8,
                "keys": 3,
                "keypot": 2,
                "keydrop": 1,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest8",
                "locations": [[0x144, 0x10], [0x166, 0x10], [0x184, 0x10], [0x182, 0x10], [0x1a2, 0x10], [0x186, 0x10], [0x186, 0x20], [0x121, 0x08]],
                "keydrops": [[0x182, 0x40]],
                "keypots": [[0x167, 0x80], [0x143, 0x80]],
                "compass": [0x365, 0x01],
                "bigkey": [0x367, 0x01],
                "map": [0x369, 0x01],
                "smallkeys": 0x4E7,
                "prize": 0x7,
                "dungeonprize": 8
            }
        },
        {
            "id": 9,
            "name": "Turtle Rock",
            "shortName": "tr",
            "regions": ["Turtle Rock - Main", "Turtle Rock - West", "Turtle Rock - East", "Turtle Rock - Back"],
            "entranceModal": [
                {
                    "nameSuffix": "Main",
                    "tag": "tr_m",
                    "group": "dwdungeon",
                    "style": "--tr-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "West",
                    "tag": "tr_w",
                    "group": "dwdungeon",
                    "style": "--tr-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "East",
                    "tag": "tr_e",
                    "group": "dwdungeon",
                    "style": "--tr-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "Back",
                    "tag": "tr_b",
                    "group": "dwdungeon",
                    "style": "--tr-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest9",
                "default": 12,
                "keys": 4,
                "keypot": 0,
                "keydrop": 2,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest9",
                "locations": [[0x1ac, 0x10], [0x16e, 0x10], [0x16e, 0x20], [0x16c, 0x10], [0x28, 0x10], [0x48, 0x10], [0x8, 0x10], [0x1aa, 0x10], [0x1aa, 0x20], [0x1aa, 0x40], [0x1aa, 0x80], [0x149, 0x08]],
                "keydrops": [[0x16d, 0x4], [0x27, 0x2]],
                "keypots": [],
                "compass": [0x364, 0x08],
                "bigkey": [0x366, 0x08],
                "map": [0x368, 0x08],
                "smallkeys": 0x4EC,
                "prize": 0xC,
                "dungeonprize": 9
            }
        },
        {
            "id": 10,
            "name": "Ganons Tower",
            "shortName": "gt",
            "regions": ["Ganons Tower"],
            "entranceModal": [
                {
                    "nameSuffix": "",
                    "tag": "gt",
                    "group": "dwdungeon",
                    "style": "--gt-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest10",
                "default": 27,
                "keys": 4,
                "keypot": 3,
                "keydrop": 1,
                "bigkeydrop": false,
                "bigkey": true,
                "map": true,
                "compass": true
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest10",
                "locations": [[0x119, 0x04], [0xf6, 0x10], [0xf6, 0x20], [0xf6, 0x40], [0xf6, 0x80], [0x116, 0x10], [0xfa, 0x10], [0xf8, 0x10], [0xf8, 0x20], [0xf8, 0x40], [0xf8, 0x80], [0x118, 0x10], [0x118, 0x20], [0x118, 0x40], [0x118, 0x80], [0x38, 0x10], [0x38, 0x20], [0x38, 0x40], [0x11a, 0x10], [0x13a, 0x10], [0x13a, 0x20], [0x13a, 0x40], [0x13a, 0x80], [0x7a, 0x10], [0x7a, 0x20], [0x7a, 0x40], [0x9a, 0x10]],
                "keydrops": [[0x7b, 0x20]],
                "keypots": [[0x117, 0x40], [0x137, 0x40], [0xf7, 0x8]],
                "compass": [0x364, 0x04],
                "bigkey": [0x366, 0x04],
                "map": [0x368, 0x04],
                "smallkeys": 0x4ED
            }
        },
        {
            "id": 11,
            "name": "Hyrule Castle",
            "shortName": "hc",
            "regions": ["Hyrule Castle - Main", "Hyrule Castle - Sewers Dropdown", "Sanctuary"],
            "entranceModal": [
                {
                    "nameSuffix": "Main",
                    "tag": "hc_m",
                    "group": "lwdungeon",
                    "style": "--hc-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "West",
                    "tag": "hc_w",
                    "group": "lwdungeon",
                    "style": "--hc-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "East",
                    "tag": "hc_e",
                    "group": "lwdungeon",
                    "style": "--hc-color",
                    "showLabel": true
                },
                {
                    "nameSuffix": "Sanctuary",
                    "tag": "sanc",
                    "group": "start",
                    "style": "--sanc-color",
                    "showLabel": false
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest11",
                "default": 8,
                "keys": 1,
                "keypot": 0,
                "keydrop": 3,
                "bigkeydrop": true,
                "bigkey": false,
                "map": true,
                "compass": false
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest11",
                "locations": [[0xe4, 0x10], [0xe2, 0x10], [0x100, 0x10], [0x64, 0x10], [0x22, 0x10], [0x22, 0x20], [0x22, 0x40], [0x24, 0x10]],
                "keydrops": [[0xe5, 0x80], [0xe3, 0x40], [0x101, 0x20], [0x43, 0x80]],
                "keypots": [],
                "compass": [0x365, 0x40],
                "bigkey": [0x367, 0x40],
                "map": [0x369, 0x40],
                "smallkeys": 0x4E0
            }
        },
        {
            "id": 12,
            "name": "Castle Tower",
            "shortName": "ct",
            "regions": ["Castle Tower"],
            "entranceModal": [
                {
                    "nameSuffix": "",
                    "tag": "ct",
                    "group": "lwdungeon",
                    "style": "--ct-color",
                    "showLabel": true
                }
            ],
            "totalLocations": {
                "dungeonarrayname": "chest12",
                "default": 2,
                "keys": 2,
                "keypot": 0,
                "keydrop": 2,
                "bigkeydrop": false,
                "bigkey": false,
                "map": false,
                "compass": false
            },
            "dungeonDataMem": {
                "dungeonarrayname": "chest12",
                "locations": [[0x1c0, 0x10], [0x1a0, 0x10]],
                "keydrops": [[0x181, 0x10], [0x160, 0x20]],
                "keypots": [],
                "compass": [0x365, 0x08],
                "bigkey": [0x367, 0x08],
                "map": [0x369, 0x08],
                "smallkeys": 0x4E4
            }
        }
    ]

    // Create data object for custom coloring of dungeon squares
    const enstranceModalStyles = [
        {
            "label": "Ganon",
            "tag": "ganon",
            "style": "--ganon-color",
            "group": "dwdungeon",
            "requireItem": false,
            "showLabel": true
        },
        {
            "label": "Connector",
            "tag": "connector",
            "style": "--connector-color",
            "group": "generalkey",
            "isConnector": true,
            "requireItem": false,
            "showLabel": false
        },
        {
            "label": "Link's House",
            "tag": "link",
            "style": "--link-color",
            "isConnector": false,
            "group": "start",
            "requireItem": false,
            "showLabel": false
        },
        {
            "label": "Old Man",
            "tag": "mount",
            "style": "--mount-color",
            "isConnector": true,
            "group": "start",
            "requireItem": false,
            "showLabel": false
        },
        {
            "label": "Items Ahoy",
            "tag": "item",
            "style": "--item-color",
            "isConnector": false,
            "group": "generalkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Magic Shop",
            "tag": "magic",
            "style": "--magic-color",
            "isConnector": false,
            "group": "lwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Muffin Kid",
            "tag": "kid",
            "style": "--kid-color",
            "isConnector": false,
            "group": "lwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Swordsmiths",
            "tag": "smith",
            "style": "--smith-color",
            "isConnector": false,
            "group": "lwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Magic Bat",
            "tag": "bat",
            "style": "--bat-color",
            "isConnector": false,
            "group": "lwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Library",
            "tag": "lib",
            "style": "--lib-color",
            "isConnector": false,
            "group": "lwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Sahasrahla",
            "tag": "saha",
            "style": "--saha-color",
            "isConnector": false,
            "group": "lwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Mimic Cave",
            "tag": "mimc",
            "style": "--mimc-color",
            "isConnector": false,
            "group": "lwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Dam",
            "tag": "dam",
            "style": "--dam-color",
            "isConnector": false,
            "group": "lwkey",
            "requireItem": false,
            "showLabel": true
        },
        {
            "label": "Bomb Shop",
            "tag": "bomb",
            "style": "--bomb-color",
            "isConnector": false,
            "group": "dwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Bumper Cave",
            "tag": "bump",
            "style": "--bump-color",
            "isConnector": true,
            "group": "dwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Spike Cave",
            "tag": "spike",
            "style": "--spike-color",
            "isConnector": false,
            "group": "dwkey",
            "requireItem": true,
            "showLabel": true            
        },
        {
            "label": "Hookshot Cave",
            "tag": "hook",
            "style": "--hook-color",
            "isConnector": true,
            "group": "dwkey",
            "requireItem": true,
            "showLabel": true
        },
        {
            "label": "Rupee Farm",
            "tag": "rupee",
            "style": "--rupee-color",
            "isConnector": false,
            "group": "generalkey",
            "requireItem": false,
            "showLabel": false
        },
        {
            "label": "Shop",
            "tag": "shop",
            "style": "--shop-color",
            "isConnector": false,
            "group": "generalkey",
            "requireItem": false,
            "showLabel": false
        },
        {
            "label": "Dark Connector",
            "tag": "dark",
            "style": "--dark-color",
            "isConnector": true,
            "group": "generalkey",
            "requireItem": false,
            "showLabel": false
        }
    ];

    // Create data object for custom coloring of dungeon squares
    window.customColours = {};

    for ( const modal of enstranceModalStyles ) {
        if ( window.customColours[modal.style] === undefined ) {
            window.customColours[modal.style] = []
        }
        window.customColours[modal.style].push(modal.tag)
    }

    for ( const dungeon of bigDungeonData ) {
        for ( const modal of dungeon.entranceModal ) {
            if ( window.customColours[modal.style] === undefined ) {
                window.customColours[modal.style] = []
            }
            window.customColours[modal.style].push(modal.tag)
        }
    }

    // Create data object for entrance modal tags
    window.entranceModalTags = {};
    for ( const modal of enstranceModalStyles ) {
        window.entranceModalTags[modal.tag] = modal
    }

    for ( const dungeon of bigDungeonData ) {
        for ( const modal of dungeon.entranceModal ) {
            window.entranceModalTags[modal.tag] = modal
        }
    }

    // Create data object for total locations in each dungeon
    window.dungeonTotalLocations = {}
    for ( const dungeon of bigDungeonData ) {
        window.dungeonTotalLocations[dungeon.shortName] = dungeon.totalLocations
    }

    // Create data object for dungeon data memory for autotracking
    window.dungeonDataMem = {}
    for ( const dungeon of bigDungeonData ) {
        window.dungeonDataMem[dungeon.shortName] = dungeon.dungeonDataMem
    }

    // Create data object for the entrance tracker modal
    window.dungeonCheckMap = []
    for ( const dungeon of bigDungeonData ) {
        let dungeonCheck = {
            "id": dungeon.id,
            "dungeon": dungeon.name,
            "regions": dungeon.regions,
            "mapTrackerNames": [],
            "abbreviation": dungeon.shortName,
        }
        for ( const modal of dungeon.entranceModal ) {
            dungeonCheck.mapTrackerNames.push(modal.tag)
        }
        window.dungeonCheckMap[dungeon.id] = dungeonCheck
    }

	window.defineEntranceTypes = function() {
		defineEntranceType(0, 'lwdungeon', 'hc_m', 'Hyrule Castle (Main)');
		defineEntranceType(1, 'lwdungeon', 'hc_w', 'Hyrule Castle (West)');
		defineEntranceType(2, 'lwdungeon', 'hc_e', 'Hyrule Castle (East)');
		defineEntranceType(3, 'lwdungeon', 'ct', 'Castle Tower');
		defineEntranceType(4, 'lwdungeon', 'ep', 'Eastern Palace');
		defineEntranceType(5, 'lwdungeon', 'dp_m', 'Desert Palace (Main)');
		defineEntranceType(6, 'lwdungeon', 'dp_w', 'Desert Palace (West)');
		defineEntranceType(7, 'lwdungeon', 'dp_e', 'Desert Palace (East)');
		defineEntranceType(8, 'lwdungeon', 'dp_n', 'Desert Palace (North)');
		defineEntranceType(9, 'lwdungeon', 'toh', 'Tower of Hera');
		defineEntranceType(10, 'dwdungeon', 'pod', 'Palace of Darkness');
		defineEntranceType(11, 'dwdungeon', 'sp', 'Swamp Palace');
		defineEntranceType(12, 'dwdungeon', 'sw_m', 'Skull Woods (Main)');
		defineEntranceType(13, 'dwdungeon', 'sw_w', 'Skull Woods (West)');
		defineEntranceType(14, 'dwdungeon', 'sw_e', 'Skull Woods (East)');
		defineEntranceType(15, 'dwdungeon', 'sw', 'Skull Woods (Back)');
		defineEntranceType(16, 'dwdungeon', 'tt', 'Thieve\'s Town');
		defineEntranceType(17, 'dwdungeon', 'ip', 'Ice Palace');
		defineEntranceType(18, 'dwdungeon', 'mm', 'Misery Mire');
		defineEntranceType(19, 'dwdungeon', 'tr_m', 'Turtle Rock (Main)');
		defineEntranceType(20, 'dwdungeon', 'tr_w', 'Turtle Rock (West)');
		defineEntranceType(21, 'dwdungeon', 'tr_e', 'Turtle Rock (East)');
		defineEntranceType(22, 'dwdungeon', 'tr_b', 'Turtle Rock (Back)');
		defineEntranceType(23, 'dwdungeon', 'gt', 'Ganon\'s Tower');
		defineEntranceType(24, 'dwdungeon', 'ganon', 'Ganon');
		defineEntranceType(25, 'start', 'link', 'Link\'s House');
		defineEntranceType(26, 'start', 'sanc', 'Sanctuary');
		defineEntranceType(27, 'start', 'mount', 'Death Mountain (Start)');
		defineEntranceType(28, 'lwkey', 'magic', 'Magic Shop');
		defineEntranceType(29, 'lwkey', 'kid', 'Lazy Kid');
		defineEntranceType(30, 'lwkey', 'smith', 'Swordsmiths');
		defineEntranceType(31, 'lwkey', 'bat', 'Magic Bat');
		defineEntranceType(32, 'lwkey', 'lib', 'Library');
		defineEntranceType(33, 'lwkey', 'saha', 'Sahasrahla\'s Hut');
		defineEntranceType(34, 'lwkey', 'mimc', 'Mimic Cave');
		defineEntranceType(35, 'lwkey', 'dam', 'Dam');
		defineEntranceType(36, 'dwkey', 'bomb', 'Bomb Shop');
		defineEntranceType(37, 'dwkey', 'bump', 'Bumper Cave');
		defineEntranceType(38, 'dwkey', 'spike', 'Spike Cave');
		defineEntranceType(39, 'dwkey', 'hook', 'Hookshot Cave');
		defineEntranceType(40, 'generalkey', 'rupee', 'Rupee Cave');
		defineEntranceType(41, 'generalkey', 'shop', 'Shop');
		defineEntranceType(42, 'generalkey', 'dark', 'Dark Cave');
		defineEntranceType(43, 'generalkey', 'connector', 'Unknown Connector');
		defineEntranceType(44, 'generalkey', 'item', 'Room/Cave w/ Chest');
		defineEntranceType(1000, 'null', '', '???');
	}

    window.entranceNameToIndex = {};
	window.entranceNameToFriendlyName = {};
	window.entranceNameToGroup = {};

	window.defineEntranceType = function(index, group, name, friendlyName) {
		entranceNameToIndex[name] = index;
		entranceNameToFriendlyName[name] = friendlyName;
		entranceNameToGroup[name] = group;
	}

    window.requireItem = function(x) {
		switch (x) {
			case 'magic':
			case 'kid':
			case 'smith':
			case 'bat':
			case 'lib':
			case 'saha':
			case 'mimc':
			case 'dam':
			case 'bomb':
			case 'bump':
			case 'spike':
			case 'hook':
				return true
			default: return false;
		}
	}

    window.mapVariables = {
        "leftOffset": {
            "dark": 221,
            "light": 0
        },
        "connectorLineOffset": 5.5
    }

})(window);