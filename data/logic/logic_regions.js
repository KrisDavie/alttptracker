(function(window) {
    'use strict';

    window.logic_regions = {
    "Light World": {
        "Open": {},
        "Inverted": {
            "always": {
                "anyOf": [
                    "agahnim",
                    {
                        "allOf": [
                            "mitts",
                            "flute"
                        ]
                    },
                    {
                        "allOf": [
                            "moonpearl",
                            "mitts"
                        ]
                    },
                    {
                        "allOf": [
                            "moonpearl",
                            "hammer"
                        ]
                    },
                    {
                        "allOf": [
                            "mitts",
                            {
                                "anyOf": [
                                    "flippers",
                                    "canZoraSplashDelete",
                                    "canQirnJump"
                                ]
                            },
                            "canOWFairyRevive"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "agahnim",
                            "lantern"
                        ]
                    },
                    {
                        "allOf": [
                            "mitts",
                            "flute"
                        ]
                    },
                    {
                        "allOf": [
                            "moonpearl",
                            "mitts"
                        ]
                    },
                    {
                        "allOf": [
                            "moonpearl",
                            "hammer"
                        ]
                    }
                ]
            }
        }
    },
    "Dark World - East": {
        "Open": {
            "always": {
                "anyOf": [
                    "agahnim",
                    {
                        "allOf": [
                            "moonpearl",
                            "mitts",
                            {
                                "anyOf": [
                                    "flippers",
                                    "canWaterWalk",
                                    "canZoraSplashDelete",
                                    "canQirnJump"
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "moonpearl",
                            "glove",
                            "hammer"
                        ]
                    },
                    {
                        "allOf": [
                            "moonpearl",
                            "canBreach|Maridia - Portal",
                            {
                                "anyOf": [
                                    "flippers",
                                    "canFakeFlipper"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "agahnim",
                            "lantern"
                        ]
                    },
                    {
                        "allOf": [
                            "moonpearl",
                            "mitts",
                            "flippers"
                        ]
                    },
                    {
                        "allOf": [
                            "moonpearl",
                            "glove",
                            "hammer"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Maridia - Portal",
                            "moonpearl",
                            "flippers"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "agahnim",
                            "mirror"
                        ]
                    },
                    "hammer",
                    "flippers",
                    "flute",
                    "canZoraSplashDelete",
                    "canQirnJump"
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "agahnim",
                            "mirror",
                            "lantern"
                        ]
                    },
                    "hammer",
                    "flippers",
                    "flute"
                ]
            }
        }
    },
    "Dark World - West": {
        "Open": {
            "always": {
                "allOf": [
                    "moonpearl"
                ],
                "anyOf": [
                    "mitts",
                    {
                        "allOf": [
                            "glove",
                            "hammer"
                        ]
                    },
                    {
                        "allOf": [
                            "agahnim",
                            "hookshot",
                            {
                                "anyOf": [
                                    "hammer",
                                    "glove",
                                    "flippers",
                                    "canZoraSplashDelete"
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Maridia - Portal",
                            "hookshot",
                            {
                                "anyOf": [
                                    "flippers",
                                    "canFakeFlipper"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    "mitts",
                    {
                        "allOf": [
                            "glove",
                            "hammer"
                        ]
                    },
                    {
                        "allOf": [
                            "agahnim",
                            "lantern",
                            "hookshot",
                            {
                                "anyOf": [
                                    "hammer",
                                    "glove",
                                    "flippers"
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Maridia - Portal",
                            "hookshot",
                            "flippers"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Dark World - South": {
        "Open": {
            "always": {
                "anyOf": [
                    "canBreach|Dark World - West",
                    {
                        "allOf": [
                            "agahnim",
                            "moonpearl",
                            "hammer"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Maridia - Portal",
                            "moonpearl",
                            "hammer",
                            {
                                "anyOf": [
                                    "flippers",
                                    "canFakeFlipper"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    "canReach|Dark World - West",
                    {
                        "allOf": [
                            "agahnim",
                            "moonpearl",
                            "hammer",
                            "lantern"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Maridia - Portal",
                            "moonpearl",
                            "hammer",
                            "flippers"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Light World - Lower West Death Mountain": {
        "Open": {
            "always": {
                "anyOf": [
                    "flute",
                    "canBreach|Norfair - Business Center",
                    {
                        "allOf": [
                            "glove",
                            {
                                "anyOf": [
                                    "canDarkRoomNavigateBlind",
                                    "lantern"
                                ]
                            }
                        ]
                    },
                ]
            },
            "logical": {
                "anyOf": [
                    "flute",
                    {
                        "allOf": [
                            "glove",
                            "lantern"
                        ]
                    },
                    "canReach|Norfair - Business Center"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain"
                ]
            }            
        }
    },
    "Light World - Upper West Death Mountain": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - Lower West Death Mountain"
                ],
                "anyOf": [
                    "mirror",
                    {
                        "allOf": [
                            "hammer",
                            {
                                "anyOf": [
                                    "hookshot",
                                    "canFairyReviveHover"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Lower West Death Mountain"
                ],
                "anyOf": [
                    "mirror",
                    {
                        "allOf": [
                            "hammer",
                            "hookshot"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "moonpearl",
                    "hammer"
                ]
            },
            "logical": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Light World - East Death Mountain": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - Lower West Death Mountain"
                ],
                "anyOf": [
                    "hookshot",
                    "canFairyReviveHover",
                    {
                        "allOf": [
                            "mirror",
                            "hammer"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Lower West Death Mountain"
                ],
                "anyOf": [
                    "hookshot",
                    {
                        "allOf": [
                            "mirror",
                            "hammer"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain"
                ],
                "anyOf": [
                    "mitts",
                    {
                        "allOf": [
                            "moonpearl",
                            {
                                "anyOf": [
                                    "hookshot",
                                    "canFairyReviveHover"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain"
                ],
                "anyOf": [
                    "mitts",
                    {
                        "allOf": [
                            "moonpearl",
                            "hookshot"
                        ]
                    }
                ]
            }
        }
    },
    "Dark World - Death Mountain": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "mitts"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        },
        "Inverted": {
            "always": {
                "anyOf": [
                    "flute",
                    {
                        "allOf": [
                            "glove",
                            {
                                "anyOf": [
                                    "canDarkRoomNavigateBlind",
                                    "lantern"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    "flute",
                    {
                        "allOf": [
                            "glove",
                            "lantern"
                        ]
                    }
                ]
            }
        }
    },
    "Dark World - Mire": {
        "Open": {
            "always": {
                "anyOf": [
                    "canBreach|Lower Norfair - Portal",
                    {
                        "allOf": [
                            "flute",
                            "mitts"
                        ]
                    }
                ]
                
            },
            "logical": {
                "anyOf": [
                    "canReach|Lower Norfair - Portal",
                    {
                        "allOf": [
                            "flute",
                            "mitts"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "flute",
                            "mitts"
                        ]        
                    },
                    {
                        "allOf": [
                            "canBreach|Light World",
                            "mirror"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "flute",
                            "mitts"
                        ]        
                    },
                    {
                        "allOf": [
                            "canReach|Light World",
                            "mirror"
                        ]
                    }
                ]
            }
        }

    },
    "Hyrule Castle - Main": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        },
        "Entrance": [
            "hc_m",
            "hc_e",
            "hc_w"
        ]
    },
    "Hyrule Castle - Sewers Dropdown": {
        "Open": {
            "always": {
                "allOf": [
                    "glove"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "glove"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        },
        "Entrance": [
            "exception|sewers"
        ]
    },
    "Sanctuary": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ],
                "anyOf": [
                    "moonpearl",
                    "canMirrorSuperBunny"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        },
        "Entrance": [
            "sanc"
        ]
    },
    "Eastern Palace": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ],
                "anyOf": [
                    "moonpearl",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        },
        "Entrance": [
            "ep"
        ]
    },
    "Desert Palace - Main": {
        "Open": {
            "always": {
                "anyOf": [
                    "book",
                    {
                        "allOf": [
                            "canBreach|Dark World - Mire",
                            "mirror"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    "book",
                    "canReach|Dark World - Mire"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "book"
                ],
                "anyOf": [
                    "moonpearl",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        },
        "Entrance": [
            "dp_e",
            "dp_w",
            "dp_m"
        ]
    },
    "Desert Palace - North": {
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "book",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Dark World - Mire",
                            "mirror"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "book",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Dark World - Mire",
                            "mirror"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "book",
                    "glove"
                ],
                "anyOf": [
                    "moonpearl",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        },
        "Entrance": [
            "dp_n"
        ]
    },
    "Tower of Hera": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - Upper West Death Mountain",
                    "canHitSwitch"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Upper West Death Mountain"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World - Upper West Death Mountain",
                    "moonpearl",
                    "canHitSwitch"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Upper West Death Mountain"
                ]
            }
        },
        "Entrance": [
            "toh"
        ]
    },
    "Palace of Darkness": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East"
                ],
                "anyOf": [
                    "moonpearl",
                    "canOWFairyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ]
            }
        },
        "Entrance": [
            "pod"
        ]
    },
    "Swamp Palace": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "moonpearl",
                    "mirror"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "mirror"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        },
        "Entrance": [
            "sp"
        ]
    },
    "Skull Woods - Main": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ],
                "anyOf": [
                    "moonpearl",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {},
        "Entrance": [
            "sw_m"
        ]
    },
    "Skull Woods - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ],
                "anyOf": [
                    "moonpearl",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {},
        "Entrance": ["sw_e", "sw_w"]
    },
    "Skull Woods - Back": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "firerod"
                ],
                "anyOf": [
                    "moonpearl",
                    {
                        "allOf": [
                            "canDungeonBunnyRevive",
                            "canBunnyPocket"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "firerod"
                ]
            }
        },
        "Entrance": [
            "sw"
        ]
    },
    "Skull Woods - Drops": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ],
                "anyOf": [
                    "moonpearl",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {},
        "Entrance": ["exception|swdrops"]
    },
    "Thieves Town": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {},
        "Entrance": [
            "tt"
        ]
    },
    "Ice Palace": {
        "Open": {
            "always": {
                "allOf": [
                    "mitts",
                    {
                        "anyOf": [
                            "moonpearl",
                            "canDungeonBunnyRevive"
                        ]
                    }
                ],
                "anyOf": [
                    "flippers",
                    "canFakeFlipper",
                    "canWaterWalk"
                ]
            },
            "logical": {
                "allOf": [
                    "mitts",
                    "moonpearl",
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "always": {
                "anyOf": [
                    "canQirnJump",
                    "canZoraSplashDelete",
                    "flippers"
                ]
            },
            "logical": {
                "allOf": [
                    "flippers"
                ]
            }
        },
        "Entrance": [
            "ip"
        ]
    },
    "Misery Mire": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Mire"
                ],
                "anyOf": [
                    "moonpearl",
                    "canOWFairyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Mire",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Mire"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Mire"
                ]
            }
        },
        "Entrance": [
            "mm"
        ]
    },
    "Turtle Rock - Main": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "hammer",
                    "mitts",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain"
                ]
            }
        },
        "Entrance": [
            "tr_m"
        ]
    },
    "Turtle Rock - West": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain",
                    "canSpinSpeedClip"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "mirror"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        },
        "Entrance": [
            "tr_w"
        ]
    },
    "Turtle Rock - East": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain",
                    "canSpinSpeedClip"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "mirror"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        },
        "Entrance": [
            "tr_e"
        ]
    },
    "Turtle Rock - Back": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - Lower West Death Mountain",
                    "canMirrorWrap"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "mirror"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        },
        "Entrance": [
            "tr_b"
        ]
    },
    "Ganons Tower": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain",
                    "canOpenGT"
                ],
                "anyOf": [
                    "moonpearl",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "canOpenGT"
                ],
                "anyOf": [
                    "moonpearl",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "canOpenGT",
                    "moonpearl"
                ]
            }
        },
        "Entrance": [
            "gt"
        ]
    },
    "Castle Tower": {
        "Open": {
            "always": {
                "anyOf": [
                    "canDestroyEnergyBarrier",
                    "cape",
                    {
                        "allOf": [
                            "canBreach|Dark World - East",
                            "canFairyBarrierRevive"
                        ]
                    },
                    "canShockBlock"
                ]
            },
            "logical": {
                "anyOf": [
                    "canDestroyEnergyBarrier",
                    "cape"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain"
                ]
            }
        },
        "Entrance": [
            "ct"
        ]
    },
    "Crateria - Terminator": { // terminator
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    {
                        "anyOf": [
                            "canDestroyBombWalls",
                            "speed"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Ship",
                    {
                        "anyOf": [
                            "canDestroyBombWalls",
                            "speed"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Crateria - Ship": { // ship
        "Open": {},
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Crateria - Moat": { // moat (LEFT SIDE)
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Crateria - Ship",
                            "SMKeys|Crateria2|canUsePowerBombs",
                            "super"
                        ]
                    },
                    {
                        "allOf": [ // norfair portal and up red tower
                            "canBreach|Norfair - Business Center",
                            "SMKeys|Crateria2|canUsePowerBombs",
                            {
                                "anyOf": [ // red tower bottom to red tower mid
                                    "ice",
                                    "hijump",
                                    "space",
                                    "canIBJ",
                                    "canSpringBallJump",
                                    "canStupidShortCharge", // red tower bottom
                                ]
                            },
                            {
                                "anyOf": [ // red tower mid to red tower top
                                    "ice",
                                    "space",
                                    "canClimbRedTower"
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [ // through forgotten highway from maridia portal
                            // i'm not writing suitless logic for a niche scenario while sphere 1 supers/pbs exists
                            "canBreach|Maridia - Portal",
                            "super",
                            {
                                "anyOf": [
                                    {
                                        "allOf": [
                                            "gravity",
                                            {
                                                "anyOf": [
                                                    {
                                                        "allOf": [ // go to portal, down sand pits, up toilet, through FH
                                                            "SMKeys|Maridia2",
                                                            "canDestroyBombWalls"
                                                        ]
                                                    },
                                                    {
                                                        "allOf": [
                                                            "SMKeys|MaridiaB",
                                                            "canEscapeDraygon"
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                    // future mm2 will put suitless logic here
                                ]
                            }
                            
                        ]
                    },
                    {
                        "allOf": [ // through forgotten highway from tube, redundant check for non-keys but it's relevant for keys because of crat 2
                            "canBreach|Brinstar - Red Tower",
                            "canUsePowerBombs",
                            "super",
                            {
                                "anyOf": [
                                    "gravity",
                                    {
                                        "allOf": [
                                            "hijump",
                                            "canSuitlessMaridia",
                                            "canWestSandHallBombJump" // double check for hijump because readability
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [ 
                            "canReach|Crateria - Ship",
                            "SMKeys|Crateria2|canUsePowerBombs",
                            "super"
                        ]
                    },
                    {
                        "allOf": [ // norfair portal and up red tower
                            "canReach|Norfair - Business Center",
                            "SMKeys|Crateria2|canUsePowerBombs",
                            {
                                "anyOf": [
                                    "ice",
                                    "hijump",
                                    "space"
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [ // through forgotten highway from maridia portal
                            "canReach|Maridia - Portal",
                            "gravity",
                            "super",
                            {
                                "anyOf": [
                                    {
                                        "allOf": [ // go to portal, down sand pits, up toilet, through FH
                                            "SMKeys|Maridia2",
                                            "canDestroyBombWalls"
                                        ]
                                    },
                                    { 
                                        "anyOf": [ // kill draygon, logic requires a way out because grav jump 2 hard
                                            "space",
                                            "SMKeys|MaridiaB",
                                            "canIBJ",
                                            {
                                                "allOf": [ 
                                                    "speed",
                                                    "hijump"
                                                ]
                                            }
                                        ]
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [ // through forgotten highway from tube, redundant check for non-keys but it's relevant for keys because of crat 2
                            "canReach|Brinstar - Red Tower",
                            "canUsePowerBombs",
                            "super",
                            "gravity"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },

    "Wrecked Ship": { // main shaft
        "Open": {
            "always": {
                "allOf": [
                    "super",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canBreach|Crateria - Ship",
                                    "SMKeys|Crateria2|canUsePowerBombs",
                                    {
                                        "anyOf": [ // can cross moat
                                            "speed",
                                            "grapple",
                                            "space",
                                            "canGravityJump",
                                            "canMoatCWJ",
                                            "canMoatHBJ",
                                            {
                                                "allOf": [
                                                    "gravity",
                                                    "canIBJ"
                                                ]
                                            },
                                            {
                                                "allOf": [
                                                    "gravity",
                                                    "hijump"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "allOf": [ // through forgotten highway from tube, redundant check for non-keys but it's relevant for keys because of crat 2
                                    "canBreach|Brinstar - Red Tower",
                                    "canUsePowerBombs",
                                    {
                                        "anyOf": [
                                            "gravity",
                                            {
                                                "allOf": [
                                                    "hijump",
                                                    "canSuitlessMaridia",
                                                    "canWestSandHallBombJump" // double check for hijump because readability
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "allOf": [ // forgotten highway from maridia portal
                                    "canBreach|Maridia - Portal",
                                    "gravity",
                                    {
                                        "anyOf": [
                                            {
                                                "allOf": [ // go to portal, down sand pits, up toilet, through FH
                                                    "SMKeys|Maridia2",
                                                    "canDestroyBombWalls"
                                                ]
                                            },
                                            { 
                                                "allOf": [
                                                    "SMKeys|MaridiaB",
                                                    "canEscapeDraygon"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }

                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "super",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canReach|Crateria - Ship",
                                    "SMKeys|Crateria2|canUsePowerBombs",
                                    {
                                        "anyOf": [ // can cross moat
                                            "speed",
                                            "grapple",
                                            "space",
                                            {
                                                "allOf": [
                                                    "gravity",
                                                    "canIBJ"
                                                ]
                                            },
                                            {
                                                "allOf": [
                                                    "gravity",
                                                    "hijump"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "allOf": [ // forgotten highway from tube
                                    "canReach|Brinstar - Red Tower",
                                    "canUsePowerBombs",
                                    "gravity"
                                ]
                            },
                            {
                                "allOf": [ // forgotten highway from maridia portal
                                    "canReach|Maridia - Portal",
                                    "gravity",
                                    {
                                        "anyOf": [
                                            {
                                                "allOf": [ // go to portal, down sand pits, up toilet, through FH
                                                    "SMKeys|Maridia2",
                                                    "canDestroyBombWalls"
                                                ]
                                            },
                                            { 
                                                "allOf": [
                                                    "SMKeys|MaridiaB",
                                                    {
                                                        "anyOf": [ // kill draygon, logic requires a way out because grav jump 2 hard
                                                            "space",
                                                            "canIBJ",
                                                            {
                                                                "allOf": [ 
                                                                    "speed",
                                                                    "hijump"
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                    
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },

    "Brinstar - Green Elevator": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Terminator"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Terminator"
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Brinstar - Big Pink": { // big pink
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Brinstar - Green Elevator",
                            "canOpenRedDoors",
                            {
                                "anyOf": [
                                    "canDestroyBombWalls",
                                    "speed"
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Brinstar - Blue",
                            "canUsePowerBombs"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Norfair - Business Center",
                            "morph",
                            {
                                "anyOf": [
                                    "wave",
                                    "canGateGlitch",
                                ]
                            },
                            {
                                "anyOf": [
                                    "ice",
                                    "hijump",
                                    "space",
                                    "canIBJ",
                                    "canSpringBallJump",
                                    "canStupidShortCharge" // red tower bottom
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "canReach|Brinstar - Green Elevator",
                            "canOpenRedDoors",
                            "canDestroyBombWalls"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Brinstar - Blue",
                            "canUsePowerBombs"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Norfair - Business Center",
                            "morph",
                            "wave",
                            {
                                "anyOf": [
                                    "ice",
                                    "hijump",
                                    "space"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },    
    "Brinstar - Blue": { // retro brin elevator
        "Open": {
            "always": {
                "allOf": [
                    "canReach|Crateria - Ship"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Ship"
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Brinstar - Red Tower": { // red tower middle
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Brinstar - Big Pink",
                            "super",
                            "morph"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Brinstar - Blue",
                            "super",
                            "canUsePowerBombs"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Norfair - Business Center",
                            {
                                "anyOf": [
                                    "ice",
                                    "hijump",
                                    "space",
                                    "canIBJ",
                                    "canSpringBallJump",
                                    "canStupidShortCharge" // red tower bottom
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "canReach|Brinstar - Big Pink",
                            "super",
                            "morph"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Brinstar - Blue",
                            "super",
                            "canUsePowerBombs"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Norfair - Business Center",
                            {
                                "anyOf": [
                                    "ice",
                                    "hijump",
                                    "space"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Brinstar - Kraid": { // kraid kihunter room - past morph tunnel
        "Open": {
            "always": {
                "allOf": [
                    "canReach|Norfair - Business Center",
                    "super",
                    "canPassBombPassages"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Business Center",
                    "super",
                    "canPassBombPassages"
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },

    "Maridia - Main Street": {
        "Open": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canBreach|Norfair - Business Center",
                                    "canUsePowerBombs"
                                ]
                            },
                            {
                                "allOf": [
                                    "canBreach|Maridia - Portal",
                                    "SMKeys|Maridia2",
                                    "gravity", // not writing powerbombless suitless logic until it actually becomes relevant
                                    "morph",
                                    {
                                        "anyOf": [
                                            "morphbombs",
                                            "powerbomb",
                                            "screw"
                                        ]
                                    }
                                ]                  
                            }
                        ]
                    },
                    {
                        "anyOf": [
                            "gravity",
                            "canSuitlessMaridia"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "gravity",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canReach|Norfair - Business Center",
                                    "canUsePowerBombs"
                                ]
                            },
                            {
                                "allOf": [
                                    "canReach|Maridia - Portal",
                                    {
                                        "anyOf": [
                                            "canPassBombPassages",
                                            "screw" // i think this should need morph too but whatevs
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Maridia - Pre-Aqueduct": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Main Street", // canSuitlessMaridia is already checked in here
                    { // can climb main street
                        "anyOf": [
                            "gravity",
                            "canHijumpIceMainStreetClimb",
                            {
                                "allOf": [
                                    "hijump",
                                    "canSpringBallJump"
                                ]
                            },
                            "canUnderwaterWallJump"
                        ]
                    },
                    { // can cross everest
                        "anyOf": [
                            "canGravityJump",
                            "grapple",
                            {
                                "allOf": [
                                    "gravity",
                                    {
                                        "anyOf": [
                                            "speed",
                                            "space",
                                            "canIBJ"
                                        ]
                                    }
                                ]
                            },
                            "canCrabClimb",
                            "canDoubleSpringBallJump"
                        ]
                    },
                    "SMKeys|Maridia1"
                ]
            },
            "logical": {
                "allOf": [
                    "gravity",
                    "SMKeys|Maridia1",
                    {
                        "anyOf": [
                            "canReach|Maridia - Portal",
                            {
                                "allOf": [
                                    "canReach|Maridia - Main Street",
                                    {
                                        "anyOf": [
                                            "space",
                                            "canIBJ",
                                            "speed",
                                            "grapple"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Maridia - Portal": { // bottom of pre-colosseum
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Dark World - East",
                            {
                                "anyOf": [
                                    "flippers",
                                    "canWaterWalk",
                                    "canZoraSplashDelete",
                                    "canQirnJump"
                                ]
                            },
                            "morph",
                            {
                                "anyOf": [
                                    "gravity",
                                    {
                                        "allOf": [
                                            "canSuitlessMaridia",
                                            "hijump",
                                        ]
                                    },
                                    {
                                        "allOf": [
                                            "canBootlessSuitless",
                                            "canSpringBallJump"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Maridia - Pre-Aqueduct",
                            "SMKeys|Maridia2",
                            "speed",
                            {
                                "anyOf": [ // can kill botwoon
                                    "charge",
                                    "ammoDamage|5000" // TODO: make this dependent on user logic
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canReach|Dark World - East",
                                    "flippers",
                                    "morph",
                                    "gravity"
                                ]
                            },
                            {
                                "allOf": [
                                    "canReach|Maridia - Pre-Aqueduct",
                                    "SMKeys|Maridia2",
                                    "speed", // logic assumes you have gravity here
                                    // {
                                    //     "anyOf": [ // can kill botwoon
                                    //         "charge",
                                    //         "ammoDamage|5000" // make this dependent on user logic?
                                    //     ]
                                    // }
                                    // logic doesn't actually check if you can kill botwoon :)
                                ]
                            }
                        ]
                    }
                ]    
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    
    "Norfair - Business Center": {
        "Open": {
            "always": {
                "anyOf": [
                    "canBreach|Light World - Lower West Death Mountain",
                    "canBreach|Brinstar - Red Tower"
                ]
            },
            "logical": {
                "anyOf": [
                    "canReach|Light World - Lower West Death Mountain",
                    "canReach|Brinstar - Red Tower"
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Norfair - Bubble Mountain": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Business Center",
                    {
                        "anyOf": [
                            {
                                "anyOf": [
                                    {
                                        "allOf": [
                                            {
                                                "anyOf": [
                                                    "varia",
                                                    "canHellrun"
                                                ]
                                            },
                                            "SMKeys|Norfair2|super",
                                            {
                                                "anyOf": [
                                                    "space",
                                                    "canIBJ",
                                                    "hijump",
                                                    "speed",
                                                    "canSpringBallJump",
                                                    "canNovaBoost",
                                                    {
                                                        "allOf": [
                                                            "ice",
                                                            "varia" // THIS WILL INCREASE TANK REQS ?
                                                        ]
                                                    }
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            },
                            {
                                "allOf": [
                                    "speed",
                                    "canShortHellrun",
                                    "canPassBombPassages",
                                    "SMKeys|Norfair2"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Business Center",
                    "varia",
                    "SMKeys|Norfair2|super",
                    {
                        "anyOf": [
                            "space",
                            "canIBJ",
                            "hijump",
                            "speed"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Norfair - Crocomire": {
        "Open": {
            "always": {
                "anyOf": [
                    { // the normal way
                        "allOf": [
                            "canReach|Norfair - Business Center",
                            "SMKeys|NorfairB|super",
                            // checking varia/canHellrun in each individual level
                            {
                                "anyOf": [
                                    {
                                        "allOf": [ // croc speedway via ice gates
                                            {
                                                "anyOf": [
                                                    "canShortHellrun",
                                                    "varia"
                                                ]
                                            },
                                            "super",
                                            "canUsePowerBombs",
                                            "speed"
                                        ]
                                    },
                                    {
                                        "allOf": [ // frog speedway & croc gate
                                            {
                                                "anyOf": [
                                                    "canShortHellrun",
                                                    "varia"
                                                ]
                                            },
                                            "speed",
                                            {
                                                "anyOf": [
                                                    "wave",
                                                    "canGateGlitch"
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "allOf": [
                                            {
                                                "anyOf": [
                                                    "canHellrun",
                                                    "varia"
                                                ]
                                            },
                                            "SMKeys|Norfair2|super",
                                            "morph",
                                            {
                                                "anyOf": [
                                                    "wave",
                                                    "canGateGlitch"
                                                ]
                                            },
                                            {
                                                "anyOf": [
                                                    "space",
                                                    "canIBJ",
                                                    "hijump",
                                                    "speed",
                                                    "canSpringBallJump",
                                                    "canNovaBoost",
                                                    {
                                                        "allOf": [
                                                            "ice",
                                                            "varia" // THIS WILL INCREASE TANK REQS ?
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "anyOf": [
                                                    "morphbombs",
                                                    "powerbomb",
                                                    "gravity" // remembered highway????!?!!!?!?
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    { // hit LN portal from zelda, go up WRITG, go down mickey mouse, reverse lava dive, go up purple shaft and down croc gate to croc... without morph or speed :)
                        "allOf": [
                            "canReach|Lower Norfair - Portal",
                            "varia",
                            "gravity",
                            "space",
                            "screw",
                            "super",
                            "wave",
                            "SMKeys|NorfairB"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    { // the normal way
                        "allOf": [
                            "canReach|Norfair - Business Center",
                            "varia",
                            "SMKeys|NorfairB|super",
                            {
                                "anyOf": [
                                    {
                                        "allOf": [ // croc speedway via ice gates
                                            "super",
                                            "canUsePowerBombs",
                                            "speed"
                                        ]
                                    },
                                    {
                                        "allOf": [ // frog speedway & croc gate
                                            "speed",
                                            "wave"
                                        ]
                                    },
                                    {
                                        "allOf": [
                                            "super",
                                            "morph",
                                            "wave",
                                            {
                                                "anyOf": [ // precathedral
                                                    "space",
                                                    "canIBJ",
                                                    "hijump",
                                                    "speed",
                                                ]
                                            },
                                            {
                                                "anyOf": [
                                                    "morphbombs",
                                                    "powerbomb",
                                                    "gravity" // remembered highway????!?!!!?!?
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    { // hit LN portal from zelda, go up WRITG, go down mickey mouse, reverse lava dive, go up purple shaft and down croc gate to croc... without morph or speed :)
                        "allOf": [
                            "canReach|Lower Norfair - Portal",
                            "varia",
                            "gravity",
                            "space",
                            "screw",
                            "super",
                            "wave",
                            "SMKeys|NorfairB"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },

    "Lower Norfair - Elevator": { // TODO add LN hellrun logic - my body is not ready
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Lower Norfair - Portal",
                            "super",
                            "varia", // todo remove this and add in hellrun logic
                            {
                                "anyOf": [
                                    "canIBJ",
                                    {
                                        "allOf": [
                                            "space",
                                            "canDestroyBombWalls"
                                        ]
                                    },
                                    {
                                        "allOf": [
                                            "canSpringBallJump",
                                            "canUsePowerBombs",
                                        ]
                                    },
                                    {
                                        "allOf": [
                                            "canHijumpSpeedScrewAttackRoomClimb",
                                            "canDestroyBombWalls"
                                        ]
                                    },
                                    {
                                        "allOf": [
                                            "speed",
                                            {
                                                "anyOf": [
                                                    "charge",
                                                    "super"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            { // can get from bottom of prepillars to elevator
                                "anyOf": [
                                    "canUsePowerBombs",
                                    {
                                        "allOf": [ // the long way round - varia will be hard req'd for this
                                            "screw",
                                            "space",
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Norfair - Bubble Mountain",
                            "canTraverseGravitron"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "canReach|Lower Norfair - Portal",
                            "varia",
                            "canDestroyBombWalls",
                            "super",
                            {
                                "anyOf": [
                                    "space",
                                    "canIBJ"
                                ]
                            },
                            {
                                "anyOf": [
                                    "canUsePowerBombs",
                                    {
                                        "allOf": [
                                            "space",
                                            "screw"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "varia",
                            "canReach|Norfair - Bubble Mountain",
                            "canUsePowerBombs",
                            "space",
                            "gravity",
                            "super" // sj assured so picky chozo -> 5 super gt fight :)
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Lower Norfair - Portal": { // really "can get to screw loc"
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canDestroyBombWalls",
                            "canBreach|Dark World - Mire",
                            {
                                "anyOf": [
                                    "varia",
                                    "canHellrun"
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Lower Norfair - Elevator",
                            "canUsePowerBombs",
                            {
                                "anyOf": [
                                    {
                                        "allOf": [
                                            "super",
                                            "canGateGlitch"
                                        ]
                                    },
                                    {
                                        "allOf": [ // gt fight without charge/plasma = need varia (maybe model varialess ammo gt later)
                                            "space",
                                            "varia",
                                            "super"
                                        ]
                                    },
                                    {
                                        "allOf": [ // gt fight varialess with charge plasma, surely 8 tanks will be fine Clueless
                                            "super",
                                            "space",
                                            "charge",
                                            "plasma"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "canReach|Lower Norfair - Elevator",
                            "varia",
                            "space",
                            "gravity",
                            "canUsePowerBombs",
                            "super"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Dark World - Mire",
                            "canDestroyBombWalls",
                            "varia"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
    "Lower Norfair - Amphitheatre": {
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Lower Norfair - Elevator",
                            "SMKeys|LowerNorfair1",
                            "varia", // add hellrun logic later
                            "canUsePowerBombs",
                            "canClimbWRITG"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Lower Norfair - Portal",
                            "SMKeys|LowerNorfair1",
                            "varia", // add hellrun logic later
                            "super",
                            { // can climb screw attack room
                                "anyOf": [
                                    "canIBJ",
                                    {
                                        "allOf": [
                                            "space",
                                            "canDestroyBombWalls"
                                        ]
                                    },
                                    {
                                        "allOf": [
                                            "canSpringBallJump",
                                            "canUsePowerBombs",
                                        ]
                                    },
                                    {
                                        "allOf": [
                                            "canHijumpSpeedScrewAttackRoomClimb",
                                            "canDestroyBombWalls"
                                        ]
                                    },
                                    {
                                        "allOf": [
                                            "speed",
                                            {
                                                "anyOf": [
                                                    "charge",
                                                    "super"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            "canClimbWRITG",
                            { // exit logic
                                "anyOf": [
                                    "morph",
                                    "canReverseAcidDive"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "SMKeys|LowerNorfair1",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canReach|Lower Norfair - Elevator",
                                    "morph", // see below comment
                                    "varia",
                                    "canUsePowerBombs"
                                ]
                            },
                            {
                                "allOf": [
                                    "canReach|Lower Norfair - Portal",
                                    "morph", // logic requires CanExit on normal for all LN items, which is just morph, so i'm putting it in here
                                    // LN Portal assures canDestroyBombWalls
                                    "varia",
                                    "super"
                                ]
                            }
                        ]
                    },
                    { // can logically climb writg
                        "anyOf": [
                            "space",
                            "canIBJ"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "logical": {
                "allOf": []
            }
        }
    },
}})(window);