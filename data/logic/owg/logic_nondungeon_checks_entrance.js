(function(window) {
    'use strict';

    window.owg_logic_nondungeon_checks_entrance = {
    "Sunken Treasure": {
        "Open": {
            "allOf": [
                "hasFoundMapEntry|dam"
            ]
        },
        "Inverted": {
            "allOf": [
                "hasFoundMapEntry|dam",
                "canReach|Inverted Light World Bunny"
            ]
        }
    },
    "Bottle Merchant": {
        "Open": {},
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World Bunny"
            ]
        }
    },
    "Old Man": {
        "Open": {
            "allOf": [
                "canReach|Upper West Death Mountain",
                "lantern"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Upper West Death Mountain",
                "canReach|Inverted Dark Death Mountain",
                "lantern"
            ]
        }
    },
    "Stumpy": {
        "Open": {
            "allOf": [
                "canReach|South Dark World",
                "moonpearl"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted South Dark World"
            ]
        }
    },
    "Purple Chest": {
        "Open": {
            "allOf": [
                "mitts",
                "moonpearl"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World Bunny"
            ],
            "anyOf": [
                "mirror",
                {
                    "allOf": [
                        "mitts"
                    ],
                    "anyOf": [
                        "flute",
                        "moonpearl",
                        "agahnim"
                    ]
                }
            ]
        }
    },
    "Hobo": {
        "Open": {
            "allOf": [
                "flippers"
            ]
        },
        "Inverted": {
            "allOf": [
                "flippers",
                "canReach|Inverted Light World"
            ]
        }
    },
    "Ether Tablet": {
        "Open": {
            "scout": {
                "allOf": [
                    "canReach|Upper West Death Mountain",
                    "book"
                ]
            },
            "allOf": [
                "canReach|Upper West Death Mountain",
                "book",
                "canBreakTablets"
            ]
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted Upper West Death Mountain",
                    "book"
                ]
            },
            "allOf": [
                "canReach|Inverted Upper West Death Mountain",
                "book",
                "canBreakTablets"
            ]
        }
    },
    "Bombos Tablet": {
        "Open": {
            "scout": {
                "allOf": [
                    "canReach|South Dark World",
                    "mirror",
                    "book"
                ]
            },
            "allOf": [
                "canReach|South Dark World",
                "mirror",
                "book",
                "canBreakTablets"
            ]
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted Light World Bunny",
                    "book"
                ]
            },
            "allOf": [
                "canReach|Inverted Light World Bunny",
                "book",
                "canBreakTablets"
            ]
        }
    },
    "Catfish": {
        "Open": {
            "allOf": [
                "canReach|East Dark World",
                "moonpearl",
                "glove"
            ]
        },
        "Inverted": {
            "anyOf": [
                {
                    "allOf": [
                        "canReach|Inverted East Dark World",
                        "glove"
                    ]
                },
                {
                    "allOf": [
                        "canReach|Inverted Light World",
                        "flippers",
                        "mirror"
                    ]
                }
            ]
        }
    },
    "King Zora": {
        "Open": {
            "anyOf": [
                "glove",
                "flippers"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World"
            ],
            "anyOf": [
                "glove",
                "flippers"
            ]
        }
    },
    "Mushroom": {
        "Open": {},
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted Light World Bunny"
                ]
            },
            "allOf": [
                "canReach|Inverted Light World"
            ]
        }
    },
    "Spectacle Rock": {
        "Open": {
            "scout": {
                "allOf": [
                    "canReach|Lower West Death Mountain"
                ]
            },
            "allOf": [
                "canReach|Lower West Death Mountain",
                "mirror"
            ]
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted Lower West Death Mountain"
                ]
            },
            "allOf": [
                "canReach|Inverted Upper West Death Mountain"
            ]
        }
    },
    "Floating Island": {
        "Open": {
            "scout": {
                "allOf": [
                    "canReach|Upper East Death Mountain"
                ]
            },
            "allOf": [
                "hasFoundEntrance|Hookshot Cave Back Entrance",
                "mirror"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Upper East Death Mountain"
            ]
        }
    },
    "Maze Race": {
        "Open": {
            "scout": {},
            "anyOf": [
                "hasFoundEntrance|Two Brothers House (West)",
                {
                    "allOf": [
                        "canReach|South Dark World",
                        "mirror"
                    ]
                }
            ]
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted Light World Bunny"
                ]
            },
            "allOf": [
                "hasFoundEntrance|Two Brothers House (West)",
                "moonpearl"
            ]
        }
    },
    "Desert Ledge": {
        "Open": {
            "scout": {},
            "anyOf": [
                {
                    "allOf": [
                        "canReach|South West Dark World",
                        "mirror"
                    ]
                },
                "hasFoundEntrance|Desert Palace Entrance (West)",
                {
                    "allOf": [
                        "hasFoundEntrance|Desert Palace Entrance (North)",
                        "glove"
                    ]
                }
            ]
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted Light World Bunny"
                ]
            },
            "anyOf": [
                "hasFoundEntrance|Desert Palace Entrance (West)",
                {
                    "allOf": [
                        "hasFoundEntrance|Desert Palace Entrance (North)",
                        "moonpearl",
                        "glove"
                    ]
                }

            ]
        }
    },
    "Lake Hylia Island": {
        "Open": {
            "scout": {},
            "allOf": [
                "flippers",
                "moonpearl",
                "mirror",
                "canReach|East Dark World"
            ]
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted Light World Bunny"
                ]
            },
            "allOf": [
                "canReach|Inverted Light World",
                "flippers"
            ]
        }
    },
    "Bumper Cave Ledge": {
        "Open": {
            "scout": {
                "allOf": [
                    "canReach|West Dark World"
                ]
            },
            "allOf": [
                "hasFoundEntrance|Bumper Cave (Top)"
            ]
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted West Dark World"
                ]
            },
            "anyOf": [
                "hasFoundEntrance|Bumper Cave (Top)",
                {
                    "allOf": [
                        "mirror",
                        "hasFoundEntrance|Death Mountain Return Cave (West)"
                    ]
                }
            ]
        }
    },
    "Pyramid": {
        "Open": {
            "allOf": [
                "canReach|East Dark World"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted East Dark World"
            ]
        }
    },
    "Digging Game": {
        "Open": {
            "allOf": [
                "canReach|South Dark World",
                "moonpearl"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted South Dark World"
            ]
        }
    },
    "Zora's Ledge": {
        "Open": {
            "scout": {},
            "allOf": [
                "flippers"
            ]
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted Light World Bunny"
                ],
                "anyOf": [
                    "canOWFairyRevive",
                    {
                        "allOf": [
                            "canReach|Inverted Light World",
                            "glove"
                        ]
                    }
                ]
            },
            "allOf": [
                "flippers",
                "canReach|Inverted Light World"
            ]
        }
    },
    "Flute Spot": {
        "Open": {
            "allOf": [
                "shovel"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "shovel"
            ]
        }
    },
    "Master Sword Pedestal": {
        "Open": {
            "scout": {
                "allOf": [
                    "book"
                ]
            },
            "allOf": [
                "canPullPedestal"
            ]
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canReach|Inverted Light World Bunny",
                    "book",
                ]
            },
            "allOf": [
                "canReach|Inverted Light World Bunny",
                "canPullPedestal"
            ]
        }
    },
    "Lost Woods Hideout Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Death Mountain Bonk Rocks": {
        "Open": {
            "allOf": [
                "canReach|Upper East Death Mountain",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Upper East Death Mountain",
                "moonpearl",
                "canGetBonkableItem"
            ]
        }
    },
    "Mountain Entry Pull Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Mountain Entry Southeast Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Lost Woods Pass West Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Kakariko Portal Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Fortune Bonk Rocks": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Kakariko Pond Tree": {
        "Open": {
            "allOf": [
                "agahnim",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "agahnim",
                "moonpearl",
                "canGetBonkableItem"
            ]
        }
    },
    "Bonk Rocks Tree": {
        "Open": {
            "allOf": [
                "agahnim",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "agahnim",
                "moonpearl",
                "canGetBonkableItem"
            ]
        }
    },
    "Sanctuary Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "River Bend West Tree": {
        "Open": {
            "allOf": [
                "agahnim",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "agahnim",
                "moonpearl",
                "canGetBonkableItem"
            ]
        }
    },
    "River Bend East Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Blinds Hideout Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Kakariko Welcome Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Forgotten Forest Southwest Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Forgotten Forest Central Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Hyrule Castle Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Wooden Bridge Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Eastern Palace Tree": {
        "Open": {
            "allOf": [
                "agahnim",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "agahnim",
                "moonpearl",
                "canGetBonkableItem"
            ]
        }
    },
    "Flute Boy South Tree": {
        "Open": {
            "allOf": [
                "agahnim",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "agahnim",
                "moonpearl",
                "canGetBonkableItem"
            ]
        }
    },
    "Flute Boy East Tree": {
        "Open": {
            "allOf": [
                "agahnim",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "agahnim",
                "moonpearl",
                "canGetBonkableItem"
            ]
        }
    },
    "Central Bonk Rocks Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Tree Line Tree 2": {
        "Open": {
            "allOf": [
                "agahnim",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "agahnim",
                "moonpearl",
                "canGetBonkableItem"
            ]
        }
    },
    "Tree Line Tree 4": {
        "Open": {
            "allOf": [
                "agahnim",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "agahnim",
                "moonpearl",
                "canGetBonkableItem"
            ]
        }
    },
    "Flute Boy Approach South Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Flute Boy Approach North Tree": {
        "Open": {
            "allOf": [
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted Light World",
                "canGetBonkableItem"
            ]
        }
    },
    "Dark Lumberjack Tree": {
        "Open": {
            "allOf": [
                "canReach|West Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted West Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Dark Fortune Bonk Rocks (2)": {
        "Open": {
            "allOf": [
                "canReach|West Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted West Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Dark Graveyard West Bonk Rocks": {
        "Open": {
            "allOf": [
                "canReach|West Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted West Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Dark Graveyard North Bonk Rocks": {
        "Open": {
            "allOf": [
                "canReach|West Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted West Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Dark Graveyard Tomb Bonk Rocks": {
        "Open": {
            "allOf": [
                "canReach|West Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted West Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Qirn Jump West Tree": {
        "Open": {
            "allOf": [
                "canReach|West Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted West Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Qirn Jump East Tree": {
        "Open": {
            "allOf": [
                "canReach|North East Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted North East Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Dark Witch Tree": {
        "Open": {
            "allOf": [
                "canReach|North East Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted North East Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Pyramid Tree": {
        "Open": {
            "allOf": [
                "canReach|East Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted East Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Palace of Darkness Tree": {
        "Open": {
            "allOf": [
                "canReach|East Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted East Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Dark Tree Line Tree 2": {
        "Open": {
            "allOf": [
                "canReach|East Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted East Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Dark Tree Line Tree 3": {
        "Open": {
            "allOf": [
                "canReach|East Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted East Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Dark Tree Line Tree 4": {
        "Open": {
            "allOf": [
                "canReach|East Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted East Dark World",
                "canGetBonkableItem"
            ]
        }
    },
    "Hype Cave Statue": {
        "Open": {
            "allOf": [
                "canReach|South Dark World",
                "moonpearl",
                "canGetBonkableItem"
            ]
        },
        "Inverted": {
            "allOf": [
                "canReach|Inverted South Dark World",
                "canGetBonkableItem"
            ]
        }
    }
}})(window);