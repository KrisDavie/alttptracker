(function(window) {
    'use strict';

    window.logic_nondungeon_checks = {
    "Aginah's Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Blacksmith": {
        "Open": {
            "always": {
                "allOf": [
                    "mitts",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ],
                "anyOf": [
                    "mitts",
                    "mirror"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Blind's Hideout - Far Left": {
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
        }
    },
    "Blind's Hideout - Far Right": {
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
        }
    },
    "Blind's Hideout - Left": {
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
        }
    },
    "Blind's Hideout - Right": {
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
        }
    },
    "Blind's Hideout - Top": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Bombos Tablet": {
        "Open": {
            "scout": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "book",
                    "mirror"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "book",
                    "mirror",
                    "canBreakTablets"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South",
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World",
                    "book",
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "book",
                    "canBreakTablets"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Bonk Rock Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "boots"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "boots"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Bottle Merchant": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Brewery": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        }
    },
    "Bumper Cave Ledge": {
        "Open": {
            "scout": {
                "allOf": [
                    "canBreach|Dark World - West",
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "glove",
                    "cape",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Dark World - West",
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "glove",
                    "cape",
                    "mirror",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "C-Shaped House": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ],
                "anyOf": [
                    "moonpearl",
                    "mirror"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {}
    },
    "Capacity Upgrade - Left": {
        "Open": {
            "logical": {
                "allOf": [
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "required": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Light World",
                            "moonpearl"
                        ]
                    },
                    {
                        "allOf": [
                            "mitts",
                            {
                                "anyOf": [
                                    "flippers",
                                    "flute"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "flippers"
                ],
                "anyOf": [
                    "mitts",
                    {
                        "allOf": [
                            "canReach|Light World",
                            "moonpearl"
                        ]
                    }
                ]
            }
        }
    },
    "Capacity Upgrade - Right": {
        "Open": {
            "logical": {
                "allOf": [
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "required": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Light World",
                            "moonpearl"
                        ]
                    },
                    {
                        "allOf": [
                            "mitts",
                            {
                                "anyOf": [
                                    "flippers",
                                    "flute"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "flippers"
                ],
                "anyOf": [
                    "mitts",
                    {
                        "allOf": [
                            "canReach|Light World",
                            "moonpearl"
                        ]
                    }
                ]
            }
        }
    },
    "Catfish": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "moonpearl",
                    "glove"
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
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Dark World - East",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Light World",
                            "moonpearl",
                            "mirror"
                        ]
                    }
                ]
            },
            "required": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Dark World - East",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Light World",
                            "moonpearl",
                            "mirror",
                            "flippers"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "canReach|Dark World - East",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Light World",
                            "moonpearl",
                            "mirror",
                            "flippers"
                        ]
                    }
                ]
            }
        }
    },
    "Cave 45": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
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
            "scout": {
                "allOf": [
                    "canBreach|Light World",
                ]
            },
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
        }
    },
    "Checkerboard Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Mire",
                    "mirror",
                    "glove"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Mire"
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
        }
    },
    "Chest Game": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ],
                "anyOf": [
                    "moonpearl",
                    "canMirrorSuperBunny"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {}
    },
    "Chicken House": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Dark Death Mountain Shop - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "mitts"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain",
                    "mitts"
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
    "Dark Death Mountain Shop - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "mitts"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain",
                    "mitts"
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
    "Dark Death Mountain Shop - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "mitts"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain",
                    "mitts"
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
    "Dark Lake Hylia Shop - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South"
                ]
            }
        },
        "Inverted": {}
    },
    "Dark Lake Hylia Shop - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South"
                ]
            }
        },
        "Inverted": {}
    },
    "Dark Lake Hylia Shop - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South"
                ]
            }
        },
        "Inverted": {}
    },
    "Dark Lumberjack Shop - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {}
    },
    "Dark Lumberjack Shop - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {}
    },
    "Dark Lumberjack Shop - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {}
    },
    "Dark Potion Shop - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "moonpearl"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        }
    },
    "Dark Potion Shop - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "moonpearl"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        }
    },
    "Dark Potion Shop - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "moonpearl"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        }
    },
    "Desert Ledge": {
        "Open": {
            "scout": {},
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
            "scout": {
                "allOf": [
                    "canBreach|Light World",
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "required": {
                "allOf": [
                    "book"
                ],
                "anyOf": [
                    "moonpearl",
                    "canMirrorSuperBunny",
                    "canDungeonBunnyRevive"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl",
                    "book"
                ]
            }
        }
    },
    "Digging Game": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South"
                ]
            }
        },
        "Inverted": {}
    },
    "Ether Tablet": {
        "Open": {
            "scout": {
                "allOf": [
                    "canBreach|Light World - Upper West Death Mountain",
                    "book"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World - Upper West Death Mountain",
                    "book",
                    "canBreakTablets"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Upper West Death Mountain"
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World - Upper West Death Mountain",
                    "book"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World - Upper West Death Mountain",
                    "book",
                    "canBreakTablets"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Upper West Death Mountain"
                ]
            }
        }
    },
    "Floating Island": {
        "Open": {
            "scout": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain",
                    "mirror",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Floodgate Chest": {
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
        }
    },
    "Flute Spot": {
        "Open": {
            "always": {
                "allOf": [
                    "shovel"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "shovel"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Graveyard Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "mirror",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Hobo": {
        "Open": {
            "always": {
                "anyOf": [
                    "flippers",
                    "canFakeFlipper"
                ]
            },
            "logical": {
                "allOf": [
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ],
                "anyOf": [
                    "flippers",
                    "canFakeFlipper"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "flippers"
                ]
            }
        }
    },
    "Hookshot Cave - Bottom Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain",
                    "moonpearl",
                    "glove"
                ],
                "anyOf": [
                    "hookshot",
                    "canHover"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain",
                    "hookshot"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            "hookshot",
                            "canHover"
                        ]
                    }
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Dark World - Death Mountain",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Light World - East Death Mountain",
                            "mirror",
                            "bombs"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "hookshot"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "canReach|Dark World - Death Mountain",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Light World - East Death Mountain",
                            "mirror",
                            "bombs"
                        ]
                    }
                ]
            }
        }
    },
    "Hookshot Cave - Bottom Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain",
                    "moonpearl",
                    "glove"
                ],
                "anyOf": [
                    "hookshot",
                    "boots"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            "hookshot",
                            "boots"
                        ]
                    }
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Dark World - Death Mountain",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Light World - East Death Mountain",
                            "mirror",
                            "bombs"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    {
                        "allOf": [
                            "canReach|Dark World - Death Mountain",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Light World - East Death Mountain",
                            "mirror",
                            "bombs"
                        ]
                    }
                ]
            }
        }
    },
    "Hookshot Cave - Top Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain",
                    "moonpearl",
                    "glove"
                ],
                "anyOf": [
                    "hookshot",
                    "canHover"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain",
                    "hookshot"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            "hookshot",
                            "canHover"
                        ]
                    }
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Dark World - Death Mountain",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Light World - East Death Mountain",
                            "mirror",
                            "bombs"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "hookshot"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "canReach|Dark World - Death Mountain",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Light World - East Death Mountain",
                            "mirror",
                            "bombs"
                        ]
                    }
                ]
            }
        }
    },
    "Hookshot Cave - Top Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain",
                    "moonpearl",
                    "glove"
                ],
                "anyOf": [
                    "hookshot",
                    "canHover"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain",
                    "hookshot"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            "hookshot",
                            "canHover"
                        ]
                    }
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Dark World - Death Mountain",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Light World - East Death Mountain",
                            "mirror",
                            "bombs"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "hookshot"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "canReach|Dark World - Death Mountain",
                            "glove"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Light World - East Death Mountain",
                            "mirror",
                            "bombs"
                        ]
                    }
                ]
            }
        }
    },
    "Hype Cave - Bottom": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        }
    },
    "Hype Cave - Generous Guy": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        }
    },
    "Hype Cave - Middle Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        }
    },
    "Hype Cave - Middle Right": {
        "Open": {
           "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        }
    },
    "Hype Cave - Top": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South",
                    "bombs",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        }
    },
    "Hyrule Castle Dungeon (3)": {
        "Open": {
            "always": []
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Ice Rod Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Kakariko Shop - Left": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Kakariko Shop - Middle": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Kakariko Shop - Right": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Kakariko Tavern": {
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
        }
    },
    "Kakariko Well - Bottom": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        }
    },
    "Kakariko Well - Left": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        }
    },
    "Kakariko Well - Middle": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        }
    },
    "Kakariko Well - Right": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        }
    },
    "Kakariko Well - Top": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "King Zora": {
        "Open": {
            "always": {
                "anyOf": [
                    "flippers",
                    "canFakeFlipper",
                    "glove"
                ]
            },
            "logical": {
                "anyOf": [
                    "flippers",
                    "glove"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ],
                "anyOf": [
                    "flippers",
                    "canFakeFlipper",
                    "glove"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ],
                "anyOf": [
                    "flippers",
                    "glove"
                ]
            }
        }
    },
    "King's Tomb": {
        "Open": {
            "always": {
                "allOf": [
                    "boots"
                ],
                "anyOf": [
                    "mitts",
                    {
                        "allOf": [
                            "canBreach|Dark World - West",
                            "moonpearl",
                            "mirror"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    "mitts",
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "boots"
                ],
                "anyOf": [
                    "mitts",
                    "canTombRaider"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "mitts"
                ]
            }
        }
    },
    "Lake Hylia Island": {
        "Open": {
            "scout": {},
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "mirror",
                    "moonpearl",
                    "flippers"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World",
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ],
                "anyOf": [
                    "flippers",
                    "canFakeFlipper"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "flippers"
                ]
            }
        }
    },
    "Lake Hylia Shop - Left": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Lake Hylia Shop - Middle": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Lake Hylia Shop - Right": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Library": {
        "Open": {
            "scout": {},
            "always": {
                "allOf": [
                    "boots"
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World",
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "boots"
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
        }
    },
    "Link's House": {
        "Open": {},
        "Inverted": {}
    },
    "Link's Uncle": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Lost Woods Hideout": {
        "Open": {},
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        }
    },
    "Lumberjack Tree": {
        "Open": {
            "scout": {},
            "always": {
                "allOf": [
                    "agahnim",
                    "boots"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "always": {
                "allOf": [
                    "agahnim",
                    "boots",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "Magic Bat": {
        "Open": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            "powder",
                            "canFakePowder"
                        ]
                    }
                ],
                "anyOf": [
                    "hammer",
                    {
                        "allOf": [
                            "canBreach|Dark World - West",
                            "moonpearl",
                            "mirror",
                            "mitts"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "powder"
                ],
                "anyOf": [
                    "hammer",
                    {
                        "allOf": [
                            "canReach|Dark World - West",
                            "mitts",
                            "moonpearl"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "hammer"
                ],
                "anyOf": [
                    "powder",
                    "canFakePowder"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "powder"
                ]
            }
        }
    },
    "Master Sword Pedestal": {
        "Open": {
            "scout": {
                "allOf": [
                    "book"
                ]
            },
            "always": {
                "allOf": [
                    "canPullPedestal"
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World",
                    "book"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "canPullPedestal"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Maze Race": {
        "Open": {
            "scout": {},
            "always": {
                "anyOf": [
                    "canOpenBonkWalls",
                    {
                        "allOf": [
                            "mirror",
                            "canBreach|Dark World - South"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    "canOpenBonkWalls",
                    {
                        "allOf": [
                            "mirror",
                            "canReach|Dark World - South"
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World",
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canOpenBonkWalls"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Mimic Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "hammer",
                    "mirror"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "hammer",
                    "mirror"
                ]
            }
        }
    },
    "Mini Moldorm Cave - Far Left": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Mini Moldorm Cave - Far Right": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Mini Moldorm Cave - Generous Guy": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Mini Moldorm Cave - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Mini Moldorm Cave - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "bombs",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Mire Shed - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Mire"
                ],
                "anyOf": [
                    "moonpearl",
                    "canMirrorSuperBunny"
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
        }
    },
    "Mire Shed - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Mire"
                ],
                "anyOf": [
                    "moonpearl",
                    "canMirrorSuperBunny"
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
        }
    },
    "Mushroom": {
        "Open": {},
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        }
    },
    "Old Man": {
        "Open": {
            "always": {
                "anyOf": [
                    "flute",
                    "glove",
                    "canBreach|Norfair - Business Center"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "always": {
                "anyOf": [
                    "flute",
                    "glove"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "Paradox Cave Lower - Far Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "canHitRangedSwitch"
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
                    "canBreach|Light World - East Death Mountain"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "canHitRangedSwitch"
                        ]
                    },
                    {
                        "allOf": [
                            "canMirrorSuperBunny",
                            "swordbeams"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Paradox Cave Lower - Far Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "canHitRangedSwitch"
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
                    "canBreach|Light World - East Death Mountain"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "canHitRangedSwitch"
                        ]
                    },
                    {
                        "allOf": [
                            "canMirrorSuperBunny",
                            "swordbeams"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Paradox Cave Lower - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "canHitRangedSwitch"
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
                    "canBreach|Light World - East Death Mountain"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "canHitRangedSwitch"
                        ]
                    },
                    {
                        "allOf": [
                            "canMirrorSuperBunny",
                            "swordbeams"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Paradox Cave Lower - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "canHitRangedSwitch"
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
                    "canBreach|Light World - East Death Mountain"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "canHitRangedSwitch"
                        ]
                    },
                    {
                        "allOf": [
                            "canMirrorSuperBunny",
                            "swordbeams"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Paradox Cave Lower - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "canHitRangedSwitch"
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
                    "canBreach|Light World - East Death Mountain"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "canHitRangedSwitch"
                        ]
                    },
                    {
                        "allOf": [
                            "canMirrorSuperBunny",
                            "swordbeams"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Paradox Cave Upper - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "bombs"
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
                    "canBreach|Light World - East Death Mountain",
                    "moonpearl",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Paradox Cave Upper - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "bombs"
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
                    "canBreach|Light World - East Death Mountain",
                    "moonpearl",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Paradox Shop - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "bombs"
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
                    "canBreach|Light World - East Death Mountain",
                    "moonpearl",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Paradox Shop - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "bombs"
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
                    "canBreach|Light World - East Death Mountain",
                    "moonpearl",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Paradox Shop - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "bombs"
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
                    "canBreach|Light World - East Death Mountain",
                    "moonpearl",
                    "bombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Peg Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "mitts",
                    "moonpearl",
                    "hammer"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "hammer"
                ],
                "anyOf": [
                    "mitts",
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
                    "mitts",
                    "canReach|Light World"
                ]
            }
        }
    },
    "Potion Shop": {
        "Open": {
            "always": {
                "allOf": [
                    "mushroom"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "mushroom"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Potion Shop - Left": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Potion Shop - Middle": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Potion Shop - Right": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Purple Chest": {
        "Open": {
            "always": {
                "allOf": [
                    "mitts",
                    "moonpearl"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ],
                "anyOf": [
                    "mitts",
                    "mirror"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Pyramid": {
        "Open": {
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
        }
    },
    "Pyramid Fairy - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "canBuyBigBombMaybe"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "hammer"
                        ]
                    },
                    {
                        "allOf": [
                            "agahnim",
                            "mirror"
                        ]
                    }
                ]
            },
            "required": {
                "allOf": [
                    "canBuyBigBomb"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South",
                    "canBuyBigBomb"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "canBuyBigBombMaybe",
                    "mirror"
                ]
            },
            "required": {
                "allOf": [
                    "canBuyBigBomb"
                ],
                "logical": {
                    "allOf": [
                        "canReach|Light World",
                        "canBuyBigBomb"
                    ]
                }
            },
            "logical": {
                "allOf": [
                    "canBuyBigBomb",
                    "canReach|Light World"
                ]
            }
        }
    },
    "Pyramid Fairy - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "canBuyBigBombMaybe"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "hammer"
                        ]
                    },
                    {
                        "allOf": [
                            "agahnim",
                            "mirror"
                        ]
                    }
                ]
            },
            "required": {
                "allOf": [
                    "canBuyBigBomb"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South",
                    "canBuyBigBomb"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "canBuyBigBombMaybe",
                    "mirror"
                ]
            },
            "required": {
                "allOf": [
                    "canBuyBigBomb"
                ],
                "logical": {
                    "allOf": [
                        "canReach|Light World",
                        "canBuyBigBomb"
                    ]
                }
            },
            "logical": {
                "allOf": [
                    "canBuyBigBomb",
                    "canReach|Light World"
                ]
            }
        }
    },
    "Red Shield Shop - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {}
    },
    "Red Shield Shop - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {}
    },
    "Red Shield Shop - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {}
    },
    "Sahasrahla": {
        "Open": {
            "always": {
                "allOf": [
                    "greenpendant"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "greenpendant"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Sahasrahla's Hut - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canOpenBonkWalls"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "canOpenBonkWalls"
                        ]
                    },
                    {
                        "allOf": [
                            "canMirrorSuperBunny",
                            "boots"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl",
                    "canOpenBonkWalls"
                ]
            }
        }
    },
    "Sahasrahla's Hut - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canOpenBonkWalls"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "canOpenBonkWalls"
                        ]
                    },
                    {
                        "allOf": [
                            "canMirrorSuperBunny",
                            "boots"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl",
                    "canOpenBonkWalls"
                ]
            }
        }
    },
    "Sahasrahla's Hut - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canOpenBonkWalls"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ],
                "anyOf": [
                    {
                        "allOf": [
                            "moonpearl",
                            "canOpenBonkWalls"
                        ]
                    },
                    {
                        "allOf": [
                            "canMirrorSuperBunny",
                            "boots"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl",
                    "canOpenBonkWalls"
                ]
            }
        }
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
        }
    },
    "Secret Passage": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Sick Kid": {
        "Open": {
            "always": {
                "allOf": [
                    "bottle"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "bottle"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Spectacle Rock": {
        "Open": {
            "scout": {
                "allOf": [
                    "canBreach|Light World - Lower West Death Mountain"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World - Lower West Death Mountain",
                    "mirror"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Lower West Death Mountain"
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World - Upper West Death Mountain"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Upper West Death Mountain"
                ]
            }
        }
    },
    "Spectacle Rock Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - Lower West Death Mountain"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Lower West Death Mountain"
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
    "Spike Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - Lower West Death Mountain",
                    "moonpearl",
                    "hammer",
                    "glove"
                ],
            },
            "required": {
                "anyOf": [
                    "cape"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - Lower West Death Mountain"
                ],
                "anyOf": [
                    'byrna',
                    {
                        "allOf": [
                            "cape",
                            {
                                "anyOf": [
                                    "halfmagic",
                                    "bottle"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain",
                    "hammer",
                    "glove"
                ],
                "anyOf": [
                    "byrna",
                    "cape"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - Death Mountain"
                ],
                "anyOf": [
                    "halfmagic",
                    "bottle"
                ]
            }
        }
    },
    "Spiral Cave": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain"
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
                    "canBreach|Light World - East Death Mountain"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain",
                    "moonpearl",
                    "canKillOrExplodeMostEnemies"
                ]
            }
        }
    },
    "Stumpy": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "moonpearl"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - South"
                ]
            }
        },
        "Inverted": {}
    },
    "Sunken Treasure": {
        "Open": {},
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "moonpearl"
                ]
            }
        }
    },
    "Superbunny Cave - Bottom": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain"
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
    "Superbunny Cave - Top": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - Death Mountain"
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
    "Village of Outcasts Shop - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "hammer"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "anyOf": [
                    "hammer",
                    {
                        "allOf": [
                            "canBreach|Light World",
                            "moonpearl",
                            "mirror"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    "hammer",
                    "canReach|Light World"
                ]
            }
        }
    },
    "Village of Outcasts Shop - Middle": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "hammer"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "anyOf": [
                    "hammer",
                    {
                        "allOf": [
                            "canBreach|Light World",
                            "moonpearl",
                            "mirror"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    "hammer",
                    "canReach|Light World"
                ]
            }
        }
    },
    "Village of Outcasts Shop - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "hammer"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "anyOf": [
                    "hammer",
                    {
                        "allOf": [
                            "canBreach|Light World",
                            "moonpearl",
                            "mirror"
                        ]
                    }
                ]
            },
            "logical": {
                "anyOf": [
                    "hammer",
                    "canReach|Light World"
                ]
            }
        }
    },
    "Waterfall Fairy - Left": {
        "Open": {
            "always": {
                "anyOf": [
                    "flippers",
                    "canWaterWalk",
                    {
                        "allOf": [
                            "canFakeFlipper",
                            "moonpearl"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ],
                "anyOf": [
                    "flippers",
                    "canFakeFlipper",
                    "canWaterWalk"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "flippers"
                ]
            }
        }
    },
    "Waterfall Fairy - Right": {
        "Open": {
            "always": {
                "anyOf": [
                    "flippers",
                    "canWaterWalk",
                    {
                        "allOf": [
                            "canFakeFlipper",
                            "moonpearl"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ],
                "anyOf": [
                    "flippers",
                    "canFakeFlipper",
                    "canWaterWalk"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "flippers"
                ]
            }
        }
    },
    "Zora's Ledge": {
        "Open": {
            "scout": {
                "anyOf": [
                    "flippers",
                    "canWaterWalk",
                    "glove",
                    "canFakeFlipper"
                ]
            },
            "always": {
                "anyOf": [
                    "flippers",
                    {
                        "allOf": [
                            "canWaterWalk",
                            "moonpearl"
                        ]
                    },
                    {
                        "allOf": [
                            "canZoraSplashDelete",
                            {
                                "anyOf": [
                                    "glove",
                                    "canFakeFlipper"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ],
                "anyOf": [
                    "flippers",
                    "canWaterWalk",
                    "glove",
                    "canFakeFlipper"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl"
                ],
                "anyOf": [
                    "flippers",
                    {
                        "allOf": [
                            "canWaterWalk",
                            "moonpearl"
                        ]
                    },
                    {
                        "allOf": [
                            "canZoraSplashDelete",
                            {
                                "anyOf": [
                                    "glove",
                                    "canFakeFlipper"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World",
                    "flippers"
                ]
            }
        }       
    },
    "Lost Woods Hideout Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "scout": {
                "allOf": [
                    "canBreach|Light World"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Death Mountain Bonk Rocks": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Light World - East Death Mountain",
                    "canGetBonkableItem"
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
                    "canBreach|Light World - East Death Mountain",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World - East Death Mountain"
                ]
            }
        }
    },
    "Mountain Entry Pull Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Mountain Entry Southeast Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Lost Woods Pass West Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Kakariko Portal Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Fortune Bonk Rocks": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Kakariko Pond Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "agahnim",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "agahnim",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "Bonk Rocks Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "agahnim",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "agahnim",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "Sanctuary Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "River Bend West Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "agahnim",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "agahnim",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "River Bend East Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Blinds Hideout Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Kakariko Welcome Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Forgotten Forest Southwest Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Forgotten Forest Central Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Hyrule Castle Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Wooden Bridge Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Eastern Palace Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "agahnim",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "agahnim",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "Flute Boy South Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "agahnim",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "agahnim",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "Flute Boy East Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "agahnim",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "agahnim",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "Central Bonk Rocks Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Tree Line Tree 2": {
        "Open": {
            "always": {
                "allOf": [
                    "agahnim",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "agahnim",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "Tree Line Tree 4": {
        "Open": {
            "always": {
                "allOf": [
                    "agahnim",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "agahnim",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "lantern"
                ]
            }
        }
    },
    "Flute Boy Approach South Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Flute Boy Approach North Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    "Dark Lumberjack Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        }
    },
    "Dark Fortune Bonk Rocks (2)": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        }
    },
    "Dark Graveyard West Bonk Rocks": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        }
    },
    "Dark Graveyard North Bonk Rocks": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        }
    },
    "Dark Graveyard Tomb Bonk Rocks": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        }
    },
    "Qirn Jump West Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - West",
                    "moonpearl",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - West"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canGetBonkableItem"
                ]
            }
        }
    },
    "Qirn Jump East Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "canGetBonkableItem",
                    "moonpearl"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "canGetBonkableItem"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        }
    },
    "Dark Witch Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "canGetBonkableItem",
                    "moonpearl"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "canGetBonkableItem"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers",
                    "canZoraSplashDelete"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ],
                "anyOf": [
                    "glove",
                    "hammer",
                    "flippers"
                ]
            }
        }
    },
    "Pyramid Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "canGetBonkableItem",
                    "moonpearl"
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
                    "canBreach|Dark World - East",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ]
            }
        }
    },
    "Palace of Darkness Tree": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "canGetBonkableItem",
                    "moonpearl"
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
                    "canBreach|Dark World - East",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ]
            }
        }
    },
    "Dark Tree Line Tree 2": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "canGetBonkableItem",
                    "moonpearl"
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
                    "canBreach|Dark World - East",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ]
            }
        }
    },
    "Dark Tree Line Tree 3": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "canGetBonkableItem",
                    "moonpearl"
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
                    "canBreach|Dark World - East",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ]
            }
        }
    },
    "Dark Tree Line Tree 4": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - East",
                    "canGetBonkableItem",
                    "moonpearl"
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
                    "canBreach|Dark World - East",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Dark World - East"
                ]
            }
        }
    },
    "Hype Cave Statue": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Dark World - South",
                    "canGetBonkableItem",
                    "moonpearl"
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
                    "canGetBonkableItem"
                ]
            }
        }
    },
    "Cold Fairy Statue": {
        "Open": {
            "always": {
                "allOf": [
                    "bombs",
                    "canGetBonkableItem"
                ]
            }
        },
        "Inverted": {
            "always": {
                "allOf": [
                    "canBreach|Light World",
                    "moonpearl",
                    "bombs",
                    "canGetBonkableItem"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Light World"
                ]
            }
        }
    },
    // super metroid locations
    "Gauntlet E-Tank": { // TODO: add gauntlet health reqs for user preference?
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    "SMKeys|Crateria1",
                    {
                        "anyOf": [
                            "speed",
                            "space",
                            "canIBJ",
                            "canGauntletWalljumps"
                        ]
                    },
                    { // screw or morph + morph bombs or morph + 10 pbs
                        "anyOf": [
                            "screw",
                            "morphbombs",
                            "powerbomb|10"
                        ]
                    },
                    {
                        "anyOf": [
                            "screw",
                            "morph"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Ship",
                    "tanks|1",
                    "morph",
                    "SMKeys|Crateria1",
                    {
                        "anyOf": [
                            "speed",
                            "space",
                            "canIBJ"
                        ]
                    },
                    {
                        "anyOf": [
                            "canIBJ",
                            "powerbomb|10", // two packs
                            "screw"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Back of Gauntlet - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    "canPassBombPassages",
                    "SMKeys|Crateria1",
                    {
                        "anyOf": [
                            "speed",
                            "space",
                            "canIBJ",
                            "canGauntletWalljumps"
                        ]
                    },
                    {
                        "anyOf": [
                            "canIBJ",
                            "powerbomb|10", // two packs
                            "screw"
                        ]
                    }
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Crateria - Terminator",
                    "canUsePowerBombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Ship",
                    "tanks|2",
                    "morph",
                    "canPassBombPassages",
                    "SMKeys|Crateria1",
                    {
                        "anyOf": [
                            "speed",
                            "space",
                            "canIBJ"
                        ]
                    },
                    {
                        "anyOf": [
                            "canIBJ",
                            "powerbomb|10", // two packs
                            "screw"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Back of Gauntlet - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    "canPassBombPassages",
                    "SMKeys|Crateria1",
                    {
                        "anyOf": [
                            "speed",
                            "space",
                            "canIBJ",
                            "canGauntletWalljumps"
                        ]
                    },
                    {
                        "anyOf": [
                            "canIBJ",
                            "powerbomb|10", // two packs
                            "screw"
                        ]
                    }
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Crateria - Terminator",
                    "canUsePowerBombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Ship",
                    "tanks|2",
                    "morph",
                    "canPassBombPassages",
                    "SMKeys|Crateria1",
                    {
                        "anyOf": [
                            "speed",
                            "space",
                            "canIBJ"
                        ]
                    },
                    {
                        "anyOf": [
                            "canIBJ",
                            "powerbomb|10", // two packs
                            "screw"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Terminator E-Tank": {
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
        "Inverted": {}
    },
    "Crateria Power Bomb": {
        "Open": {
            "always": {
                "allOf": [
                    "SMKeys|Crateria1|canUsePowerBombs",
                    "canBreach|Crateria - Ship",
                    {
                        "anyOf": [
                            "space",
                            "speed",
                            "canIBJ"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "SMKeys|Crateria1|canUsePowerBombs",
                    "canReach|Crateria - Ship",
                    {
                        "anyOf": [
                            "space",
                            "speed",
                            "canIBJ"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Bomb Torizo": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    "SMKeys|CrateriaB|canOpenRedDoors",
                    {
                        "anyOf": [
                            "canAlcatrazEscape", // checks morph
                            "canPassBombPassages"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Ship",
                    "SMKeys|CrateriaB|canOpenRedDoors",
                    "canPassBombPassages"
                ]
            }
        },
        "Inverted": {}
    },
    "230 Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    "canPassBombPassages"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Ship",
                    "canPassBombPassages"
                ]
            }
        },
        "Inverted": {}
    },
    "Climb Super": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    "canUsePowerBombs",
                    "speed",
                    "tanks|1"
                    // maybe put in xray climb?
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    "canUsePowerBombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    "canUsePowerBombs",
                    "speed",
                    "tanks|2"
                ]
            }
        },
        "Inverted": {}
    },
    "Old Mother Brain Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Ship",
                    {
                        "anyOf": [
                            "canDestroyBombWalls",
                            "canOldMBWithSpeed"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Ship",
                    "canDestroyBombWalls"
                ]
            }
        },
        "Inverted": {}
    },
    "Moat Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Crateria - Moat"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Crateria - Moat"
                ]
            }
        },
        "Inverted": {}
    },
    "Sky Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            }
        },
        "Inverted": {}
    },
    "Maze Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            }
        },
        "Inverted": {}
    },
    "Ocean Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "morph",
                    "canBreach|Crateria - Moat",
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
                            },
                            "canBreach|Wrecked Ship"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "morph",
                    "canReach|Crateria - Moat",
                    {
                        "anyOf": [
                            "speed",
                            "grapple",
                            "space",
                            "canReach|Wrecked Ship",
                            {
                                "allOf": [
                                    "gravity",
                                    "canIBJ",
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
            }
        },
        "Inverted": {}
    },
    "Early Super Bridge Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "canEarlySupersBridgeQuickdrop",
                            "canPassBombPassages"
                        ]
                    }
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Brinstar - Green Elevator",
                    "canOpenRedDoors"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    "canPassBombPassages"
                ]
            }
        },
        "Inverted": {}
    },
    "Brinstar Reserve": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "speed",
                            "canTrivialMockball"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    "speed"
                ]
            }
        },
        "Inverted": {}
    },
    "Brinstar Reserve Front Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    "morph",
                    {
                        "anyOf": [
                            "speed",
                            "canTrivialMockball"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    "morph",
                    "speed"
                ]
            }
        },
        "Inverted": {}
    },
    "Brinstar Reserve Back Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    "morph",
                    {
                        "anyOf": [
                            "speed",
                            "canTrivialMockball"
                        ]
                    },
                    {
                        "anyOf": [
                            "canHoleInOne",
                            "canPassBombPassages"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    "speed",
                    "canPassBombPassages"
                ]
            }
        },
        "Inverted": {}
    },
    "Early Super": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "speed",
                            "canTrivialMockball"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Green Elevator",
                    "canOpenRedDoors",
                    "speed"
                ]
            }
        },
        "Inverted": {}
    },
    "Etecoons E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                   "canBreach|Brinstar - Green Elevator",
                   "SMKeys|Brinstar2",
                   "canUsePowerBombs" 
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Green Elevator",
                    "SMKeys|Brinstar2",
                    "canUsePowerBombs"
                ]
            }
        },
        "Inverted": {}
    },
    "Etecoons Super": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Green Elevator",
                    "SMKeys|Brinstar2",
                    "canUsePowerBombs",
                    "super"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Green Elevator",
                    "SMKeys|Brinstar2",
                    "canUsePowerBombs",
                    "super"
                ]
            }
        },
        "Inverted": {}
    },
    "Etecoons Power Bomb": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Green Elevator",
                    "SMKeys|Brinstar2",
                    "canUsePowerBombs" 
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Green Elevator",
                    "SMKeys|Brinstar2",
                    "canUsePowerBombs"
                ]
            }
        },
        "Inverted": {}
    },
    "Mission Impossible Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Big Pink"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Big Pink"
                ]
            }
        },
        "Inverted": {}
    },
    "Mission Impossible Power Bomb": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Big Pink",
                    "canUsePowerBombs",
                    "super"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Big Pink",
                    "canUsePowerBombs",
                    "super"
                ]
            }
        },
        "Inverted": {}
    },
    "Wave Gate E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Big Pink",
                    "canUsePowerBombs",
                    "SMKeys|Brinstar2",
                    {
                        "anyOf": [
                            "wave",
                            "canHiJumpWaveGateGlitch",
                            "canHiJumplessWaveGateGlitch"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Big Pink",
                    "canUsePowerBombs",
                    "SMKeys|Brinstar2",
                    "wave"
                ]
            }
        },
        "Inverted": {}
    },
    "Spore Spawn Super": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Big Pink",
                    "canPassBombPassages",
                    "super",
                    {
                        "anyOf": [
                            "SMKeys|BrinstarB",
                            {
                                "allOf": [
                                    "SMKeys|Brinstar2",
                                    "canSporeSpawnSkip"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Big Pink",
                    "canPassBombPassages",
                    "super",
                    "SMKeys|BrinstarB"
                ]
            }
        },
        "Inverted": {}
    },
    "Charge Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Big Pink"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Big Pink"
                ]
            }
        },
        "Inverted": {}
    },
    "Charge Beam": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Big Pink",
                    "canPassBombPassages"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Big Pink",
                    "canPassBombPassages"
                ]
            }
        },
        "Inverted": {}
    },
    "Waterway E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Big Pink",
                    "canUsePowerBombs",
                    "speed"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Big Pink",
                    "canUsePowerBombs",
                    "speed",
                    {
                        "anyOf": [
                            "tanks|1",
                            "gravity"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Pipe Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "morph",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canBreach|Brinstar - Big Pink",
                                    "super"
                                ]
                            },
                            {
                                "allOf": [
                                    "canBreach|Brinstar - Blue",
                                    "powerbomb"
                                ]
                            },
                            {
                                "allOf": [
                                    "canBreach|Brinstar - Red Tower",
                                    {
                                        "anyOf": [
                                            "wave",
                                            "canGateGlitch"
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
                    "morph",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canReach|Brinstar - Big Pink",
                                    "super"
                                ]
                            },
                            {
                                "allOf": [
                                    "canReach|Brinstar - Blue",
                                    "powerbomb"
                                ]
                            },
                            {
                                "allOf": [
                                    "canReach|Brinstar - Red Tower",
                                    "wave"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Behind Morph Power Bomb": {
        "Open": {
            "always": {
                "allOf": [
                    "canReach|Brinstar - Blue",
                    "canUsePowerBombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Blue",
                    "canUsePowerBombs"
                ]
            }
        },
        "Inverted": {}
    },
    "Morph Ball Pedestal": {
        "Open": {
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Blue"
                ]
            }
        },
        "Inverted": {}
    },
    "Alpha Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canReach|Brinstar - Blue",
                    "morph"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Blue",
                    "morph"
                ]
            }
        },
        "Inverted": {}
    },
    "Blue Brinstar Ceiling E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Blue",
                    "SMKeys|Brinstar1",
                    {
                        "anyOf": [
                            "canCeilingDboost",
                            "canIBJ",
                            "hijump",
                            "speed",
                            "ice",
                            "space",
                            "canSpringBallJump"
                        ]
                    }
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Brinstar - Blue",
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Blue",
                    "SMKeys|Brinstar1",
                    {
                        "anyOf": [
                            "canIBJ",
                            "hijump",
                            "speed",
                            "ice",
                            "space",
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Beta Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canReach|Brinstar - Blue",
                    "morph",
                    "SMKeys|Brinstar1"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Blue",
                    "morph",
                    "SMKeys|Brinstar1"
                ]
            }
        },
        "Inverted": {}
    },
    "Billy Mays Front Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Blue",
                    "SMKeys|Brinstar1",
                    "canUsePowerBombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Blue",
                    "SMKeys|Brinstar1",
                    "canUsePowerBombs"
                ]
            }
        },
        "Inverted": {}
    },
    "Billy Mays Back Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Blue",
                    "SMKeys|Brinstar1",
                    "canUsePowerBombs"               
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Blue",
                    "SMKeys|Brinstar1",
                    "canUsePowerBombs"
                ]
            }
        },
        "Inverted": {}
    },
    "Alpha Power Bomb": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Red Tower",
                    "super",
                    {
                        "anyOf": [
                            "canUsePowerBombs",
                            "ice",
                            "canClimbRedTower"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Red Tower",
                    "super",
                    {
                        "anyOf": [
                            "canUsePowerBombs",
                            "ice"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Alpha Power Bomb Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Red Tower",
                    "super",
                    "canUsePowerBombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Red Tower",
                    "super",
                    "canUsePowerBombs"
                ]
            }
        },
        "Inverted": {}
    },
    "Beta Power Bomb": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Red Tower",
                    "super",
                    "canUsePowerBombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Red Tower",
                    "super",
                    "canUsePowerBombs"
                ]
            }
        },
        "Inverted": {}
    },
    "X-Ray Scope": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Red Tower",
                    "canUsePowerBombs",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "grapple",
                            "space",
                            "canXrayDboost",
                            { // methods with a tank requirement
                                "allOf": [
                                    {
                                        "anyOf": [
                                            "tanks|5",
                                            {
                                                "allOf": [
                                                    "tanks|3",
                                                    "varia"
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "anyOf": [
                                            "canSpringBallJump",
                                            "canIBJ",
                                            {
                                                "allOf": [
                                                    "hijump",
                                                    "speed"
                                                ]
                                            },
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
                    "canReach|Brinstar - Red Tower",
                    "canUsePowerBombs",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "grapple",
                            "space"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Spazer": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Red Tower",
                    "canPassBombPassages",
                    "super"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Red Tower",
                    "canPassBombPassages",
                    "super"
                ]
            }
        },
        "Inverted": {}
    },
    "Kraid Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Kraid",
                    "canUsePowerBombs"
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Brinstar - Kraid",
                    {
                        "anyOf": [
                            "wave",
                            "xray",
                            "canUsePowerBombs"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Kraid",
                    "canUsePowerBombs"
                ]
            }
        },
        "Inverted": {}
    },
    "Varia Suit": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Kraid",
                    "SMKeys|BrinstarB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Kraid",
                    "SMKeys|BrinstarB"
                ]
            }
        },
        "Inverted": {}
    },
    "Kraid E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Kraid",
                    "SMKeys|BrinstarB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Brinstar - Kraid",
                    "SMKeys|BrinstarB"
                ]
            }
        },
        "Inverted": {}
    },
    "Spooky Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship"
                ]
            }
        },
        "Inverted": {}
    },
    "Wrecked Ship Left Super": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            }
        },
        "Inverted": {}
    },
    "Wrecked Ship Right Super": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            }
        },
        "Inverted": {}
    },
    "Wrecked Ship E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB",
                    {
                        "anyOf": [ // can pass sponge bath
                            "hijump",
                            "speed",
                            "space",
                            "gravity",
                            "canSpringBallJump",
                            "canSpongeBathBombJump"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB",
                    {
                        "anyOf": [ // can pass sponge bath
                            "hijump",
                            "speed",
                            "space",
                            "gravity"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Attic Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            }
        },
        "Inverted": {}
    },
    "Bowling Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB",
                    "SMKeys|WreckedShip1",
                    {
                        "anyOf": [
                            "grapple",
                            "space",
                            "tanks|1",
                            "varia"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB",
                    "SMKeys|WreckedShip1",
                    {
                        "anyOf": [
                            "grapple",
                            "space",
                            "tanks|3",
                            {
                                "allOf": [
                                    "varia",
                                    "tanks|2"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Wrecked Ship Reserve": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "canUsePowerBombs",
                    "SMKeys|WreckedShipB",
                    "SMKeys|WreckedShip1",
                    "speed",
                    {
                        "anyOf": [
                            "grapple",
                            "space",
                            "tanks|1",
                            "varia"
                        ]
                    }
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB",
                    "SMKeys|WreckedShip1",
                    {
                        "anyOf": [
                            "canUsePowerBombs",
                            "wave",
                            "xray"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship",
                    "canPassBombPassages",
                    "canUsePowerBombs",
                    "SMKeys|WreckedShipB",
                    "SMKeys|WreckedShip1",
                    "speed",
                    {
                        "anyOf": [
                            "grapple",
                            "space",
                            "tanks|3",
                            {
                                "allOf": [
                                    "varia",
                                    "tanks|2"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Gravity Suit": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB",
                    {
                        "anyOf": [
                            "canBowlingSkip",
                            {
                                "allOf": [
                                    "SMKeys|WreckedShip1",
                                    {
                                        "anyOf": [
                                            "grapple",
                                            "space",
                                            "tanks|1",
                                            "varia"
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
                    "canReach|Wrecked Ship",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB",
                    "SMKeys|WreckedShip1",
                    {
                        "anyOf": [
                            "grapple",
                            "space",
                            "tanks|3",
                            {
                                "allOf": [
                                    "varia",
                                    "tanks|2"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Main Street Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Main Street",
                    "gravity",
                    "speed" // not putting stupid blue suits in logic because they're stupid
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Maridia - Main Street",
                    "gravity",
                    "speed"
                ]
            }
        },
        "Inverted": {}
    },
    "Crab Super": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Main Street",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    {
                                        "anyOf": [
                                            "canHijumpIceMainStreetClimb",
                                            "canSpringBallJump"
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
                    "canReach|Maridia - Main Street",
                    "gravity"
                ]
            }
        },
        "Inverted": {}
    },
    "Mama Turtle E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Main Street",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    {
                                        "anyOf": [
                                            "canHijumpIceMainStreetClimb",
                                            "canSpringBallJump"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "anyOf": [
                            "canIBJ",
                            "space",
                            {
                                "allOf": [
                                    "gravity",
                                    "speed"
                                ]
                            },
                            "grapple",
                            "canSpringBallJump",
                            "canTurtlePowerBombJump"
                        ]
                    }
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Maridia - Main Street",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    {
                                        "anyOf": [
                                            "canHijumpIceMainStreetClimb",
                                            "canSpringBallJump"
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
                    "canReach|Maridia - Main Street",
                    "gravity",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "canIBJ",
                            "space",
                            "speed",
                            "grapple"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Mama Turtle Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Main Street",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    {
                                        "anyOf": [
                                            "canHijumpIceMainStreetClimb",
                                            "canSpringBallJump"
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
                    "canReach|Maridia - Main Street",
                    "gravity",
                    "canOpenRedDoors",
                ]
            }
        },
        "Inverted": {}
    },
    "Beach Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Pre-Aqueduct",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    {
                                        "anyOf": [
                                            "canSpringBallJump",
                                            "ice"
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
                    "canReach|Maridia - Pre-Aqueduct",
                    "gravity"
                ]
            }
        },
        "Inverted": {}
    },
    "Watering Hole - Left": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Pre-Aqueduct",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    {
                                        "anyOf": [
                                            "canSpringBallJump",
                                            "ice"
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
                    "canReach|Maridia - Pre-Aqueduct",
                    "gravity"
                ]
            }
        },
        "Inverted": {}
    },
    "Watering Hole - Right": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Pre-Aqueduct",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    {
                                        "anyOf": [
                                            "canSpringBallJump",
                                            "ice"
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
                    "canReach|Maridia - Pre-Aqueduct",
                    "gravity"
                ]
            }
        },
        "Inverted": {}
    },
    "Aqueduct Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Pre-Aqueduct",
                    "gravity",
                    {
                        "anyOf": [
                            "speed",
                            "canSnailClip"
                        ]
                    }
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Maridia - Pre-Aqueduct",
                    {
                        "anyOf": [
                            "gravity",
                            "canGrappleJump",
                            "canSnailClimb"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Maridia - Pre-Aqueduct",
                    "gravity",
                    "speed"
                ]
            }
        },
        "Inverted": {}
    },
    "Aqueduct Super": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Pre-Aqueduct",
                    "gravity",
                    {
                        "anyOf": [
                            "speed",
                            "canSnailClip"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Maridia - Pre-Aqueduct",
                    "gravity",
                    "speed"
                ]
            }
        },
        "Inverted": {}
    },
    "Left Sand Pit Missile": {
        "Open": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canBreach|Maridia - Pre-Aqueduct",
                                    "super",
                                    "canUsePowerBombs",
                                ]
                            },
                            {
                                "allOf": [
                                    "canBreach|Maridia - Portal",
                                    "super",
                                    "morph",
                                    {
                                        "anyOf": [
                                            "gravity",
                                            {
                                                "allOf": [
                                                    "hijump",
                                                    "canSuitlessMaridia"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    "canSpringBallJump"
                                ]
                            },
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    "space"
                                ]
                            },
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "canBreakFree"
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
                            "canReach|Maridia - Pre-Aqueduct",
                            "super",
                            "canUsePowerBombs",
                            "gravity"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Maridia - Portal",
                            "SMKeys|Maridia2",
                            "gravity",
                            "super",
                            "canPassBombPassages"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Maridia Reserve": {
        "Open": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canBreach|Maridia - Pre-Aqueduct",
                                    "super",
                                    "canUsePowerBombs",
                                ]
                            },
                            {
                                "allOf": [
                                    "canBreach|Maridia - Portal",
                                    "super",
                                    "morph",
                                    {
                                        "anyOf": [
                                            "gravity",
                                            {
                                                "allOf": [
                                                    "hijump",
                                                    "canSuitlessMaridia"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    "canSpringBallJump"
                                ]
                            },
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    "space"
                                ]
                            },
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "canBreakFree"
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
                            "canReach|Maridia - Pre-Aqueduct",
                            "super",
                            "canUsePowerBombs",
                            "gravity"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Maridia - Portal",
                            "SMKeys|Maridia2",
                            "gravity",
                            "super",
                            "canPassBombPassages"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Right Sand Pit Missile": {
        "Open": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canBreach|Maridia - Pre-Aqueduct",
                                    "super",
                                    "canUsePowerBombs",
                                ]
                            },
                            {
                                "allOf": [
                                    "canBreach|Maridia - Portal",
                                    "super",
                                    "morph",
                                    {
                                        "anyOf": [
                                            "gravity",
                                            {
                                                "allOf": [
                                                    "hijump",
                                                    "canSuitlessMaridia"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
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
                            "canReach|Maridia - Pre-Aqueduct",
                            "super",
                            "canUsePowerBombs",
                            "gravity"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Maridia - Portal",
                            "SMKeys|Maridia2",
                            "gravity",
                            "super",
                            "canPassBombPassages"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Right Sand Pit Power Bomb": {
        "Open": {
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canBreach|Maridia - Pre-Aqueduct",
                                    "super",
                                    "canUsePowerBombs",
                                ]
                            },
                            {
                                "allOf": [
                                    "canBreach|Maridia - Portal",
                                    "super",
                                    "morph",
                                    {
                                        "anyOf": [
                                            "gravity",
                                            {
                                                "allOf": [
                                                    "canSuitlessMaridia",
                                                    "hijump",
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    "canSuitlessMaridia",
                                    "hijump",
                                    {
                                        "anyOf": [
                                            "canSpringBallJump",
                                            "canUnderwaterWallJump"
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
                            "canReach|Maridia - Pre-Aqueduct",
                            "super",
                            "canUsePowerBombs",
                            "gravity"
                        ]
                    },
                    {
                        "allOf": [
                            "canReach|Maridia - Portal",
                            "SMKeys|Maridia2",
                            "gravity",
                            "super",
                            "canPassBombPassages"
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Botwoon E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Portal",
                    "SMKeys|Maridia2"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Maridia - Portal",
                    "SMKeys|Maridia2"
                ]
            }    
        },
        "Inverted": {}
    },
    "Precious Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Portal",
                    "super",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    // can climb pre-colosseum, region has suitless checks
                                    {
                                        "anyOf": [
                                            "ice",
                                            "grapple",
                                            {
                                                "allOf": [
                                                    "canDoubleSpringBallJump",
                                                    "space"
                                                ]
                                            }
                                        ]
                                    },
                                    { // can cross colosseum
                                        "anyOf": [
                                            "space",
                                            "grapple",
                                            "canCrossColosseumSuitlessWithIce"
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
                    "canReach|Maridia - Portal",
                    "gravity",
                    "super"
                ]
            }    
        },
        "Inverted": {}
    },
    "Space Jump": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Portal",
                    "super",
                    "SMKeys|MaridiaB",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    // can climb pre-colosseum, region has suitless checks
                                    {
                                        "anyOf": [
                                            "ice",
                                            "grapple",
                                            {
                                                "allOf": [
                                                    "canDoubleSpringBallJump",
                                                    "space"
                                                ]
                                            }
                                        ]
                                    },
                                    { // can cross colosseum
                                        "anyOf": [
                                            "space",
                                            "grapple",
                                            "canCrossColosseumSuitlessWithIce"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    "canEscapeDraygon"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Maridia - Portal",
                    "SMKeys|MaridiaB",
                    "gravity",
                    "super",
                    {
                        "anyOf": [
                            "space",
                            "canIBJ",
                            {
                                "allOf": [
                                    "hijump",
                                    "speed"
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Plasma Beam": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Portal",
                    "super",
                    "SMKeys|MaridiaB",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    // can climb pre-colosseum, region has suitless checks
                                    {
                                        "anyOf": [
                                            "ice",
                                            "grapple",
                                            {
                                                "allOf": [
                                                    "canDoubleSpringBallJump",
                                                    "space"
                                                ]
                                            }
                                        ]
                                    },
                                    { // can cross colosseum
                                        "anyOf": [
                                            "space",
                                            "grapple",
                                            "canCrossColosseumSuitlessWithIce"
                                        ]
                                    },
                                    "hijump", // need hjb + space to go through cac alley or hjb to get out of sand after going down a sand pit
                                ]
                            }
                        ]
                    },
                    "canEscapeDraygon",
                    { // can kill plasma pirates
                        "anyOf": [
                            "plasma",
                            "screw",
                            "canPseudoScrewPlasmaPirates",
                            "canSparkPlasmaPirates"
                        ]
                    },
                    { // can escape plasma room
                        "anyOf": [
                            "canShortCharge",
                            "hijump",
                            "space",
                            "canIBJ",
                            "canSpringBallJump",
                            "canHypoJump"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Maridia - Portal",
                    "SMKeys|MaridiaB",
                    "gravity",
                    "super",
                    {
                        "anyOf": [
                            "space",
                            "canIBJ",
                            {
                                "allOf": [
                                    "hijump",
                                    "speed"
                                ]
                            }
                        ]
                    },
                    {
                        "anyOf": [
                            "plasma",
                            "screw"
                        ]
                    },
                    {
                        "anyOf": [
                            "hijump",
                            "space",
                            "canIBJ"
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Spring Ball": {
        "Open": {
            "always": {
                "allOf": [
                    "super",
                    "canUsePowerBombs",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canBreach|Maridia - Main Street",
                                    {
                                        "anyOf": [
                                            "gravity",
                                            {
                                                "allOf": [
                                                    "canWestSandHallBombJump",
                                                    "canSuitlessMaridia",
                                                    "ice",
                                                ]
                                            }
                                            
                                        ]
                                    }
                                ]
                            },
                            {
                                "allOf": [
                                    "canBreach|Maridia - Portal",
                                    "SMKeys|Maridia2",
                                    "ice"
                                ]
                            }
                        ]
                    },
                    { // can climb or clip through pants room
                        "anyOf": [
                            {
                                "allOf": [
                                    "grapple",
                                    "gravity",
                                    {
                                        "anyOf": [
                                            "hijump",
                                            "space",
                                            "canPantsRoomGravJump"
                                        ]
                                    }
                                ]
                            },
                            "canPantsRoomIceClip",
                            "canXrayClimb",
                            "canPantsRoomFlatley",
                            "canBombCrystalFlashClip",
                            "canSuitlessCrystalFlashClip"
                        ]
                    },
                    {
                        "anyOf": [
                            "gravity",
                            "spring",
                            "canRJump"
                        ]
                    }


                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Maridia - Main Street",
                    "super",
                    "canUsePowerBombs",
                    "grapple",
                    "gravity",
                    {
                        "anyOf": [
                            "space",
                            "hijump"
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Hi-Jump Boots E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Business Center",
                    "canOpenRedDoors"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Business Center",
                    "canOpenRedDoors"
                ]
            }    
        },
        "Inverted": {}
    },
    "Hi-Jump Boots": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Business Center",
                    "canOpenRedDoors",
                    "canPassBombPassages"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Business Center",
                    "canOpenRedDoors",
                    "canPassBombPassages"
                ]
            }    
        },
        "Inverted": {}
    },
    "Hi-Jump Boots Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Business Center",
                    "canOpenRedDoors",
                    "morph"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Business Center",
                    "canOpenRedDoors",
                    "morph"
                ]
            }    
        },
        "Inverted": {}
    },
    "Ice Beam": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Business Center",
                    "super",
                    "morph",
                    {
                        "anyOf": [
                            "speed",
                            "canTrivialMockball"
                        ]
                    },
                    {
                        "anyOf": [
                            "varia",
                            "canShortHellrun"
                        ]
                    },
                    {
                        "anyOf": [
                            "canPassBombPassages",
                            "canIceEscape",
                            "canIcelessIceEscape"
                        ]
                    }

                ]
            },
            "logical": {
                "allOf": [
                    "super",
                    "speed",
                    "canPassBombPassages",
                    "varia"
                ]
            }    
        },
        "Inverted": {}
    },
    "Crumble Shaft Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "super",
                    {
                        "anyOf": [
                            { // the normal way
                                "allOf": [
                                    "canBreach|Norfair - Business Center",
                                    "canUsePowerBombs",
                                    {
                                        "anyOf": [
                                            "speed",
                                            "canTrivialMockball"
                                        ]
                                    },
                                    {
                                        "anyOf": [
                                            "varia",
                                            "canShortHellrun"
                                        ]
                                    }
                                ]
                            },
                            { // reverse croc speedway morphless
                                "allOf": [
                                    "canBreach|Norfair - Crocomire",
                                    "canReverseSparkCrocSpeedway"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Business Center",
                    "super",
                    "speed",
                    "canUsePowerBombs",
                    "varia"
                ]
            }    
        },
        "Inverted": {}
    },
    "Cathedral Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Business Center",
                    {
                        "anyOf": [
                            "varia",
                            "canHellrun"
                        ]
                    },
                    "morph",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canOpenRedDoors",
                                    {
                                        "anyOf": [
                                            "canIBJ",
                                            "space",
                                            "hijump",
                                            "speed",
                                            "canSpringBallJump",
                                            "canNovaBoost",
                                            {
                                                "allOf": [
                                                    "ice",
                                                    {
                                                        "anyOf": [
                                                            "varia",
                                                            "tanks|5" // canHellrun is already checked earlier
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "allOf": [
                                    "speed",
                                    "canPassBombPassages"
                                ]
                            }
                        ]
                    }
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Norfair - Business Center",
                    {
                        "anyOf": [
                            "varia",
                            "canHellrun"
                        ]
                    },
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canOpenRedDoors",
                                    {
                                        "anyOf": [
                                            "canIBJ",
                                            "space",
                                            "hijump",
                                            "speed",
                                            "canSpringBallJump",
                                            "canNovaBoost",
                                            {
                                                "allOf": [
                                                    "ice",
                                                    {
                                                        "anyOf": [
                                                            "varia",
                                                            "tanks|5" // canHellrun is already checked earlier
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "allOf": [
                                    "speed",
                                    "canPassBombPassages"
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
                    "morph",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "canOpenRedDoors",
                                    {
                                        "anyOf": [
                                            "canIBJ",
                                            "space",
                                            "hijump",
                                            "speed"
                                        ]
                                    }
                                ]
                            },
                            {
                                "allOf": [
                                    "speed",
                                    "canPassBombPassages"
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Bubble Mountain Corner Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Bubble Mountain",
                ]
            },
            "scout": {
                "allOf": [
                    "canBreach|Norfair - Business Center",
                    "speed",
                    {
                        "anyOf": [
                            "canShortHellrun",
                            "varia"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Bubble Mountain"
                ]
            }    
        },
        "Inverted": {}
    },
    "Norfair Reserve Front Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Bubble Mountain",
                    "super",
                    {
                        "anyOf": [
                            "varia",
                            "canHellrun"
                        ]
                    },
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            "canSpringBallJump",
                            "canHypoJump",
                            {
                                "allOf": [
                                    "morph",
                                    {
                                        "anyOf": [
                                            "grapple",
                                            "canNorfairReserveDBoost"
                                        ]
                                    },
                                    {
                                        "anyOf": [
                                            "speed",
                                            "canPassBombPassages"
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
                    "canReach|Norfair - Bubble Mountain",
                    "super",
                    "varia",
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            {
                                "allOf": [
                                    "morph",
                                    "grapple",
                                    {
                                        "anyOf": [
                                            "speed",
                                            "canPassBombPassages"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Norfair Reserve Hidden Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Bubble Mountain",
                    "super",
                    "morph",
                    {
                        "anyOf": [
                            "varia",
                            "canHellrun"
                        ]
                    },
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            "canSpringBallJump",
                            "canHypoJump",
                            {
                                "allOf": [
                                    {
                                        "anyOf": [
                                            "grapple",
                                            "canNorfairReserveDBoost"
                                        ]
                                    },
                                    {
                                        "anyOf": [
                                            "speed",
                                            "canPassBombPassages"
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
                    "canReach|Norfair - Bubble Mountain",
                    "super",
                    "varia",
                    "morph",
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            {
                                "allOf": [
                                    "grapple",
                                    {
                                        "anyOf": [
                                            "speed",
                                            "canPassBombPassages"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Norfair Reserve": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Bubble Mountain",
                    "super",
                    "morph",
                    {
                        "anyOf": [
                            "varia",
                            "canHellrun"
                        ]
                    },
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            "canSpringBallJump",
                            "canHypoJump",
                            {
                                "allOf": [
                                    {
                                        "anyOf": [
                                            "grapple",
                                            "canNorfairReserveDBoost"
                                        ]
                                    },
                                    {
                                        "anyOf": [
                                            "speed",
                                            "canPassBombPassages"
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
                    "canReach|Norfair - Bubble Mountain",
                    "super",
                    "varia",
                    "morph",
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            {
                                "allOf": [
                                    "grapple",
                                    {
                                        "anyOf": [
                                            "speed",
                                            "canPassBombPassages"
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Speed Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Bubble Mountain",
                    "super",
                    "morph",
                    {
                        "anyOf": [
                            "varia",
                            "canHellrun"
                        ]
                    },
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            "canSpringBallJump",
                            "canHypoJump",  
                            {
                                "anyOf": [
                                    "speed",
                                    "canPassBombPassages"
                                ]  
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Bubble Mountain",
                    "super",
                    "varia",
                    "morph",
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            {
                                "anyOf": [
                                    "speed",
                                    "canPassBombPassages"
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Speed Booster": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Bubble Mountain",
                    "super",
                    "morph",
                    {
                        "anyOf": [
                            "varia",
                            "canHellrun"
                        ]
                    },
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            "canSpringBallJump",
                            "canHypoJump", 
                            {   
                                "anyOf": [
                                "speed",
                                "canPassBombPassages"
                                ]  
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Bubble Mountain",
                    "super",
                    "varia",
                    "morph",
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            {
                                "anyOf": [
                                    "speed",
                                    "canPassBombPassages"
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Wave Missile": {
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Norfair - Bubble Mountain",
                            "super",
                            {
                                "anyOf": [
                                    "varia",
                                    "canHellrun"
                                ]
                            },
                            {
                                "anyOf": [ // can climb bm
                                    "space",
                                    "canIBJ",
                                    "ice",
                                    "hijump",
                                    "canSpringBallJump",
                                    "canHypoJump",  
                                    { 
                                        "anyOf": [
                                            "speed",
                                            "canPassBombPassages"
                                        ] 
                                    } 
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Norfair - Business Center",
                            "speed",
                            "varia",
                            {
                                "anyOf": [
                                    "wave",
                                    "canGateGlitch"
                                ]
                            },
                            {
                                "anyOf": [ // spiky acid snakes
                                    "varia", // tank the damage
                                    "grapple",
                                    "space",
                                    "canStupidShortCharge",
                                ]
                            },
                            "morph"
                            // this puts getting up double chamber from the bottom door in logic always, surely future me will not have a problem with this
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Bubble Mountain",
                    "super",
                    "varia",
                    "morph",
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            {
                                "anyOf": [
                                    "speed",
                                    "canPassBombPassages"
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Wave Beam": {
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Norfair - Bubble Mountain",
                            "super",
                            {
                                "anyOf": [
                                    "varia",
                                    "canHellrun"
                                ]
                            },
                            {
                                "anyOf": [ // can climb bm
                                    "space",
                                    "canIBJ",
                                    "ice",
                                    "hijump",
                                    "canSpringBallJump",
                                    "canHypoJump",  
                                    { 
                                        "anyOf": [
                                            "speed",
                                            "canPassBombPassages"
                                        ] 
                                    } 
                                ]
                            },
                            { // can exit wave beam area
                                "anyOf": [
                                    "morph",
                                    "grapple",
                                    "space",
                                    "hijump",
                                    "canHypoJump"
                                ]
                            },
                            {
                                "anyOf": [
                                    "morph",
                                    "wave",
                                    "canGateGlitch"
                                ]
                            }
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Norfair - Business Center",
                            "speed",
                            "varia",
                            {
                                "anyOf": [
                                    "wave",
                                    "canGateGlitch"
                                ]
                            },
                            {
                                "anyOf": [ // spiky acid snakes
                                    "varia", // tank the damage
                                    "grapple",
                                    "space",
                                    "canStupidShortCharge",
                                ]
                            },
                            "morph"
                            // this puts getting up double chamber from the bottom door in logic always, surely future me will not have a problem with this
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Bubble Mountain",
                    "super",
                    "varia",
                    "morph",
                    {
                        "anyOf": [ // can climb bm
                            "space",
                            "canIBJ",
                            "ice",
                            "hijump",
                            {
                                "anyOf": [
                                    "speed",
                                    "canPassBombPassages"
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Crocomire E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Crocomire",
                    /*{ leaving this here but not using it because it's not in the logic because total is a madman
                        "anyOf": [
                            "charge",
                            "ammoDamage|2500"
                        ]
                    }*/
                    {
                        "anyOf": [
                            "tanks|1",
                            "space",
                            "grapple",
                            "varia"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Crocomire",
                    {
                        "anyOf": [
                            "tanks|1",
                            "space",
                            "grapple",
                            "varia"
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Croc Power Bomb": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Crocomire",
                    "canOpenRedDoors",
                    {
                        "anyOf": [
                            "canIBJ",
                            "space",
                            "hijump",
                            "grapple",
                            "canSpringBallJump",
                            "canShortCharge",
                            "canCrocFarmRoomDBoost"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Crocomire",
                    {
                        "anyOf": [
                            "canIBJ",
                            "space",
                            "hijump",
                            "grapple"
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Cosine Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Crocomire",
                    "canOpenRedDoors",
                    "morph"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Crocomire",
                    "canOpenRedDoors",
                    "morph"
                ]
            }    
        },
        "Inverted": {}
    },
    "Indiana Jones Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Crocomire",
                    {
                        "anyOf": [
                            "canIBJ",
                            {
                                "allOf": [
                                    "space",
                                    "morph",
                                ]
                            },
                            {
                                "allOf": [
                                    "space",
                                    "canGateGlitch",
                                    "super"
                                ]
                            },
                            {
                                "allOf": [
                                    "speed",
                                    {
                                        "anyOf": [
                                            "canStupidShortCharge",
                                            "canUsePowerBombs",
                                        ]
                                    }
                                ]
                            },
                            {
                                "allOf": [
                                    "grapple",
                                    "canGateGlitch",
                                    "super",
                                    "morph" // either need morph to get down or to grapple all the way back which is really stupid
                                ]
                            },
                            "canNeatoSpringBallJump"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Norfair - Crocomire",
                    "morph",
                    {
                        "anyOf": [
                            "canIBJ",
                            "space",
                            {
                                "allOf": [
                                    "speed",
                                    "canUsePowerBombs"
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Grapple Beam": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Norfair - Crocomire",
                    {
                        "anyOf": [
                            {
                                "allOf": [
                                    "speed",
                                    "canUsePowerBombs"
                                ]
                            },
                            "canIBJ",
                            "canSpringBallJump",
                            {
                                "allOf": [
                                    "morph",
                                    "space"
                                ]
                            },
                            {
                                "allOf": [
                                    "gravity",
                                    "morph",
                                    "speed"
                                ]
                            },
                            {
                                "allOf": [
                                    "canGateGlitch",
                                    "super",
                                    {
                                        "anyOf": [
                                            "morph",
                                            "grapple",
                                            {
                                                "allOf": [
                                                    "hijump",
                                                    "speed"
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
                    "canReach|Norfair - Crocomire",
                    "morph",
                    {
                        "anyOf": [
                            "canIBJ",
                            "space",
                            {
                                "allOf": [
                                    "speed",
                                    "canUsePowerBombs"
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Croc Escape Missile": {
        "Open": {
            "scout": {
                "allOf": [
                    "canBreach|Norfair - Business Center"
                ]
            },
            "always": {
                "allOf": [
                    {
                        "anyOf": [
                            // basically copy pasting the canBreach|Norfair - Crocomire code except without the norfair boss requirements lmao
                            { // the normal way
                                "allOf": [
                                    "canBreach|Norfair - Business Center",
                                    {
                                        "anyOf": [
                                            {
                                                "allOf": [ // croc speedway via ice gates
                                                    "canShortHellrun",
                                                    "super",
                                                    "canUsePowerBombs",
                                                    "speed"
                                                ]
                                            },
                                            {
                                                "allOf": [ // frog speedway & croc gate
                                                    "canShortHellrun",
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
                                                            "varia",
                                                            "canHellrun"
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
                                    "canBreach|Lower Norfair - Portal",
                                    "varia",
                                    "gravity",
                                    "space",
                                    "screw",
                                    "super",
                                    "wave",
                                ]
                            }
                        ]
                    },
                    {
                        "anyOf": [
                            "grapple",
                            "space",
                            "canIBJ",
                            "canStupidShortCharge",
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
            "logical": {
                "allOf": [
                    "canReach|Norfair - Crocomire",
                    {
                        "anyOf": [
                            "grapple",
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
            }    
        },
        "Inverted": {}
    },
    "Gold Torizo Missile": {
        "Open": {
            "scout": {
                "allOf": [
                    "canBreach|Lower Norfair - Portal",
                    "canDestroyBombWalls"
                ]
            },
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Elevator",
                    "canUsePowerBombs",
                    "space",
                    { // can kill gt
                        "anyOf": [
                            "charge",
                            "super"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Elevator",
                    "canUsePowerBombs",
                    "space",
                    "super"
                ]
            }    
        },
        "Inverted": {}
    },
    "Gold Torizo Super": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Portal",
                    "canDestroyBombWalls",
                    "varia", // probably model hellrun logic laterrrrrrrrrrr
                    {
                        "anyOf": [
                            "charge",
                            "super"
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Portal",
                    "canDestroyBombWalls",
                    "varia",
                    {
                        "anyOf": [
                            "charge",
                            "super"
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Screw Attack": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Portal"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Portal"
                ]
            }    
        },
        "Inverted": {}
    },
    "Mickey Mouse Missile": {
        "Open": {
            "always": {
                "anyOf": [
                    {
                        "allOf": [
                            "canBreach|Lower Norfair - Elevator",
                            "varia", // add hellrun logic later
                            "canUsePowerBombs",
                            "canClimbWRITG"
                        ]
                    },
                    {
                        "allOf": [
                            "canBreach|Lower Norfair - Portal",
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
                                    "canReach|Lower Norfair - Elevator",
                                    "morph", // see below comment
                                    "varia",
                                    "canUsePowerBombs"
                                ]
                            },
                            {
                                "allOf": [
                                    "canReach|Lower Norfair - Portal",
                                    "morph",
                                    "canDestroyBombWalls",
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
        "Inverted": {}
    },
    "Firefleas E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Amphitheatre",
                    {
                        "anyOf": [
                            "super",
                            "canUsePowerBombs",
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Amphitheatre",
                    {
                        "anyOf": [
                            "super",
                            "canUsePowerBombs",
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Hotarubi Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Amphitheatre"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Amphitheatre"
                ]
            }    
        },
        "Inverted": {}
    },
    "Jail Power Bomb": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Amphitheatre",
                    "canPassBombPassages"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Amphitheatre",
                    "canPassBombPassages"
                ]
            }    
        },
        "Inverted": {}
    },
    "FrankerZ Missile": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Amphitheatre",
                    {
                        "anyOf": [
                            "canPassBombPassages",
                            {
                                "allOf": [
                                    "morph",
                                    "screw"
                                ]
                            }
                        ]
                    }
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Amphitheatre",
                    {
                        "anyOf": [
                            "canPassBombPassages",
                            {
                                "allOf": [
                                    "morph",
                                    "screw"
                                ]
                            }
                        ]
                    }
                ]
            }    
        },
        "Inverted": {}
    },
    "Power Bombs of Shame": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Amphitheatre",
                    "canUsePowerBombs"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Amphitheatre",
                    "canUsePowerBombs"
                ]
            }    
        },
        "Inverted": {}
    },
    "Ridley E-Tank": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Amphitheatre",
                    "canUsePowerBombs",
                    "super",
                    { // canKillRidley
                        "anyOf": [
                            {
                                "allOf": [
                                    "varia",
                                    "ammoDamageSupersDoubled|18000"
                                ]
                            },
                            {
                                "allOf": [
                                    "varia",
                                    "charge" // 300 shot fight poggy woggy!!!!!!!!!!!
                                ]
                            }
                        ]
                    },
                    "SMKeys|LowerNorfairB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Amphitheatre",
                    "canUsePowerBombs",
                    "super",
                    { // canKillRidley
                        "anyOf": [
                            {
                                "allOf": [
                                    "varia",
                                    "ammoDamageSupersDoubled|18000"
                                ]
                            },
                            {
                                "allOf": [
                                    "varia",
                                    "charge" // 300 shot fight poggy woggy!!!!!!!!!!!
                                ]
                            }
                        ]
                    },
                    "SMKeys|LowerNorfairB"
                ]
            }    
        },
        "Inverted": {}
    },
    "Kraid": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Brinstar - Kraid",
                    "canPassBombPassages",
                    "SMKeys|BrinstarB",
                ]
            },
            "logical": {
                "allOf": [
                    "canBreach|Brinstar - Kraid",
                    "canPassBombPassages",
                    "SMKeys|BrinstarB",
                ]
            }    
        },
        "Inverted": {}
    },
    "Phantoon": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Wrecked Ship",
                    "super",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Wrecked Ship",
                    "super",
                    "canPassBombPassages",
                    "SMKeys|WreckedShipB"
                ]
            }    
        },
        "Inverted": {}
    },
    "Draygon": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Maridia - Portal",
                    "super",
                    "SMKeys|MaridiaB",
                    {
                        "anyOf": [
                            "gravity",
                            {
                                "allOf": [
                                    // can climb pre-colosseum, region has suitless checks
                                    {
                                        "anyOf": [
                                            "ice",
                                            "grapple",
                                            {
                                                "allOf": [
                                                    "canDoubleSpringBallJump",
                                                    "space"
                                                ]
                                            }
                                        ]
                                    },
                                    { // can cross colosseum
                                        "anyOf": [
                                            "space",
                                            "grapple",
                                            "canCrossColosseumSuitlessWithIce"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    "canEscapeDraygon"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Maridia - Portal",
                    "SMKeys|MaridiaB",
                    "gravity",
                    "super",
                    {
                        "anyOf": [
                            "space",
                            "canIBJ",
                            {
                                "allOf": [
                                    "hijump",
                                    "speed"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "Inverted": {}
    },
    "Ridley": {
        "Open": {
            "always": {
                "allOf": [
                    "canBreach|Lower Norfair - Amphitheatre",
                    "canUsePowerBombs",
                    "super",
                    { // canKillRidley
                        "anyOf": [
                            {
                                "allOf": [
                                    "varia",
                                    "ammoDamageSupersDoubled|18000"
                                ]
                            },
                            {
                                "allOf": [
                                    "varia",
                                    "charge" // 300 shot fight poggy woggy!!!!!!!!!!!
                                ]
                            }
                        ]
                    },
                    "SMKeys|LowerNorfairB"
                ]
            },
            "logical": {
                "allOf": [
                    "canReach|Lower Norfair - Amphitheatre",
                    "canUsePowerBombs",
                    "super",
                    { // canKillRidley
                        "anyOf": [
                            {
                                "allOf": [
                                    "varia",
                                    "ammoDamageSupersDoubled|18000"
                                ]
                            },
                            {
                                "allOf": [
                                    "varia",
                                    "charge" // 300 shot fight poggy woggy!!!!!!!!!!!
                                ]
                            }
                        ]
                    },
                    "SMKeys|LowerNorfairB"
                ]
            }  
        },
        "Inverted": {}
    },
}})(window);