(function(window) {
    'use strict';
	
	// #region Helper functions
	const rankedAvailability = {
		'available': 0, 'partialavailable': 1, 'darkavailable': 2, 'possible': 3, 'darkpossible': 4, 'information': 5, 'unavailable': 6
	};
	function bestAvailability(...availabilityList) {
		var bestAvailability = 'unavailable';
		for (var k = 0; k < availabilityList.length; k++) {
			var availability = availabilityList[k];
			if (rankedAvailability[availability] < rankedAvailability[bestAvailability]) {
				bestAvailability = availability;
			};
		};
		return bestAvailability;
	};

	const bossToColorMap = {
		'available': 'lime',
		'possible': 'yellow',
		'darkavailable': 'blue',
		'darkpossible': 'purple',
		'unavailable': 'red'
	};
	function ConvertBossToColor(availability) {
		return bossToColorMap[availability];
	};

	function ConvertBossToChest(x) {
		switch (x) {
			case 'available':
				return 'A';
			case 'possible':
				return 'P';
			case 'darkavailable':
				return 'DA';
			case 'darkpossible':
				return 'DP';
			case 'unavailable':
				return 'U';
		}
	};

	function ConvertChestToBoss(x) {
		switch (x) {
			case 'A':
				return 'available';
			case 'P':
				return 'possible';
			case 'DA':
				return 'darkavailable';
			case 'DP':
				return 'darkpossible';
			case 'U':
				return 'unavailable';
		}
	};

	function isNewLogic() {
		return flags.doorshuffle === 'P' || (flags.doorshuffle === 'N' && (flags.wildkeys || flags.gametype === 'R') && flags.wildbigkeys && flags.wildcompasses && flags.wildmaps);
	};
	// #endregion

	// #region General logic functions
	function medallionCheck(i) {
        if ((items.sword === 0 && flags.swordmode != 'S') || (!items.bombos && !items.ether && !items.quake)) return 'unavailable';
        if (medallions[i] === 1 && !items.bombos ||
            medallions[i] === 2 && !items.ether ||
            medallions[i] === 3 && !items.quake) return 'unavailable';
		if (items.bombos && items.ether && items.quake) return 'available';
        if (medallions[i] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';
		return 'available';
    };
	
	function crystalCheck() {
		var crystal_count = 0;
		for (var k = 0; k < 10; k++) {
			if ((prizes[k] === 3 || prizes[k] === 4) && items['boss'+k]) {
				crystal_count++;
			}
		}
		return crystal_count;
	};

	function allDungeonCheck() {
		for (var k = 0; k < 10; k++) {
			if (!items['boss'+k]) {
				return false;
			}
		}
		return true;
	};

	function MinimalBoss(num) { return enemizer_check(num) };
	function enemizer_check(i) {
		switch (enemizer[i]) {
			// Armos
			case 1: if (melee_bow() || items.boomerang > 0 || cane() || rod()) return 'available'; break;
			// Lanmolas
			case 2: if (melee_bow() || cane() || rod() || items.hammer) return 'available'; break;
			// Moldorm
			case 3: if (melee()) return 'available'; break;
			// Helmasaur
			case 4: if (melee_bow() && (items.hammer || items.bomb)) return 'available'; break;
			// Arrghus
			case 5: if (items.hookshot && ((melee() || (items.bow > 1 && rod())) || (items.bomb && rod() && (items.bottle > 1 || (items.bottle > 0 && items.magic))))) return 'available'; break;
			// Mothula
			case 6: if (melee() || items.firerod || cane()) return 'available'; break;
			// Blind
			case 7: if (melee() || cane()) return 'available'; break;
			// Kholdstare
			case 8: if (items.firerod || (items.bombos && (items.sword > 0 || (flags.swordmode === 'S' && items.hammer)))) return 'available'; break;
			// Vitreous
			case 9: if (melee_bow()) return 'available'; break;
			// Trinexx
			case 10: if (items.firerod && items.icerod && (items.hammer || items.sword > 1)) return 'available'; break;
			// Ganon's Tower
			case 11: if (flags.bossshuffle != 'N') { return 'possible' } else if (melee()) return 'available'; break;
			default: return 'unavailable';
		};
	};

	function melee() { return items.sword || items.hammer; }
    function melee_bow() { return melee() || items.bow > 0; }
    function cane() { return items.somaria || items.byrna; }
    function rod() { return items.firerod || items.icerod; }
    function canHitSwitch() { return items.bomb || melee_bow() || cane() || rod() || items.boomerang || items.hookshot; }
	function canHitRangedSwitch() { return items.bomb || items.bow > 0 || items.boomerang || items.somaria || rod(); }
	function agatowerweapon() { return items.sword > 0 || items.somaria || items.bow > 0 || items.hammer || items.firerod; }
    function always() { return 'available'; }
	function canGetBonkableItem() { return items.boots || (items.sword && items.quake) };
	function activeFlute() { return items.flute > 1 || (items.flute && canReachLightWorld()) };
	function canDoTorchDarkRooms() {
		if (items.lantern) return true;
		if (flags.entrancemode != 'N' || flags.doorshuffle != 'N' || flags.owGraphLogic || flags.shopsanity || flags.bonkshuffle) {
			if (items.firerod) return true;
		};
		return false;
	};
	// #endregion
	
	// #region Glitch functions
	function glitchLinkState() { return flags.glitches === 'M' && (items.moonpearl || items.bottle) };
	function canSpinSpeed() { return items.boots && (items.sword || items.hookshot) };
	function canBunnyPocket() { return items.boots && (items.mirror || items.bottle) };
	function canReachSwampGlitchedAsLink() {
		return (flags.glitches != 'N' && items.moonpearl && (flags.glitches === 'M' || items.boots))
	};

	function glitchLinkState() {
		return flags.glitches === 'M' && (items.moonpearl || items.bottle)
	};
	// To unlock Swamp, we need to unlock Hera using either the Hera BK or the Mire BK after clipping from Mire,
	// then have at least one spare Mire key (logic assumes we use two in Mire) to open the switch room door.
	// 
	// Since there are no spare keys in vanilla, MG logic assumes we're smart enough to not open the basement door.
	// However, we still may have to kill the Mire boss and/or check the fire-locked left side to get enough keys,
	// so we can only be absolutely sure we have enough Mire small keys when we have the ability to full-clear Mire.
	// 
	// Assuming we enter Swamp with a Mire key, we can use it to unlock the second waterway door, then carefully 
	// chain pot keys to unlock the doors on the way from the entrance to the second waterway.
	// 
	// The logic assumes we can either hammer the pegs to flood the second waterway after collecting the key, 
	// or S+Q and clip from either Mire or Hera again just to flood the second waterway. This only really matters 
	// for wild keys, because otherwise we're clipping from Mire just to unlock Hera/Swamp and hammer is logically 
	// irrelevant.
	//
	// Assuming Swamp is unlocked, we need to either mirror from the DW and drain the dam as normal, or pre-drain
	// the dam and clip from Hera without taking any overworld transitions. This means we need to either have the
	// mirror or lantern for Swamp to be fully in logic.
	//
	// What if non-keysanity modes were a mistake?
	function canClipFromMireToSwamp() {
		if (!items.moonpearl && !glitchLinkState()) return 'unavailable';

		var canReachMireArea = ((flags.glitches === 'H') && items.boots) || (flags.glitches === 'M')
		if (!canReachMireArea) return 'unavailable';

		if (!items.boots && !items.hookshot) return 'unavailable';

		var med = medallionCheck(0)
		if (med === 'available') {
			if (items.somaria && (items.lantern || items.firerod)) return 'available';
			return 'possible';
		} else {
			return med
		}
	};

	function canWalkIntoSwampMG() {
		if (items.hammer && items.hookshot && items.flippers && (items.lantern || items.mirror)) {
			return 'possible';
		}
		return 'unavailable';
	};

	function canEnterSwampGlitched() {
		var mire = canClipFromMireToSwamp();
		var walk = canWalkIntoSwampMG();
		if (flags.glitches === 'H' && !items.moonpearl) return 'unavailable';

		if (mire === 'available') return canDrainDam('available');
		if (mire === 'possible') {
			return walk === 'unavailable' ? canDrainDam(mire) : walk
		} else {
			return canDrainDam(walk);
		}
	};

	function canDrainDam(status) {
		if (status === 'unavailable') return status;
		return items.mirror ? status : (items.lantern ? status : 'dark' + status)
	};
	// #endregion

	// #region Non-entrance
	function canReachLightWorld() {
		if (flags.gametype != 'I') {
			return true;
		};
		if (flags.gametype === 'I') {
			return items.moonpearl && (items.glove === 2 || (items.glove && items.hammer) || canReachLightWorldBunny());
		};
		return false;
	};

	function canReachLightWorldBunny() {
		if (flags.gametype === 'I') {
			if (items.agahnim || (items.glove === 2 && items.flute > 1)) return true;
		};
		return false;
	};

	function canReachEDW() { 
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N') {
			if (items.moonpearl && items.boots) return true;
			if (items.mirror && (items.boots || (canReachWDM() && items.moonpearl))) return true;
		};
		if (flags.gametype != 'I') {
			if (items.moonpearl) {
				if (items.agahnim) return true;
				if (items.hammer && items.glove) return true;
				if (items.glove === 2 && items.flippers) return true;
			};
		};
		if (flags.gametype === 'I') {
			if (items.agahnim && items.mirror) return true;
			if (items.flippers || items.hammer || items.flute > 1) return true;
		};
		return false;
	};

	function canReachWDW() {
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N' && items.boots) return true;
		if (flags.glitches != 'N' && canReachWDM() && items.mirror) return true;
		if (flags.gametype != 'I') {
			if (items.moonpearl) {
				if (items.glove === 2) return true;
				if (items.glove && items.hammer) return true;
				if (items.agahnim && items.hookshot && (items.flippers || items.glove || items.hammer)) return true;
			};
		};
		if (flags.gametype === 'I') {
			return true;
		};
		return false;
	};

	function canReachSDW() { 
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N' && items.boots && items.moonpearl) return true;
		if (flags.gametype != 'I') {
			if (items.moonpearl) {
				if (items.glove === 2) return true;
				if (items.glove && items.hammer) return true;
				if (items.agahnim && items.hammer) return true;
				if (items.agahnim && items.hookshot && (items.flippers || items.glove)) return true;
			}
		};
		if (flags.gametype === 'I') {
			return true;
		};
		return false;
	};

	function canReachWDM() { 
		if (flags.glitches === 'M' ) return true;
		if (flags.glitches != 'N' && items.boots) return true;
		if (flags.gametype != 'I') {
			if (items.flute >= 1 || items.glove) return true;
		};
		if (flags.gametype === 'I') {
			if (items.flute > 1 || items.glove) return true;
		};
		return false;
	};

	function canReachEDM() {
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N' && items.boots) return true;
		if (flags.glitches != 'N' && canReachWDM() && items.mirror) return true;
		if (flags.gametype != 'I') {
			if (canReachWDM() && (items.hookshot || (items.mirror && items.hammer))) return true;
		};
		if (flags.gametype === 'I') {
			if (canReachWDM()) {
				if (items.moonpearl && items.hookshot) return true;
				if (items.glove > 1) return true;
			};
		};
		return false;
	};

	function canReachDDM() { 
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N' && canReachWDM() && items.mirror) return true;
		if (flags.glitches != 'N' && items.boots && (items.moonpearl || items.hammer)) return true;
		if (flags.gametype != 'I') {
			if (canReachEDM() && items.moonpearl && items.glove > 1) return true;
		};
		if (flags.gametype === 'I') {
			if (items.glove || items.flute > 1) return true;
		};
		return false;
	};

	function canReachDP() { 
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N' && items.boots) return true;
		if (flags.gametype != 'I' ) {
			if (items.book) return true;
			if (items.mirror && canReachMire()) return true;	
		};
		if (flags.gametype === 'I') {
			if (items.book && canReachLightWorld()) return true;
		};
		return false;
	};

	function canReachDPNorth() {
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N' && items.boots) return true;
		if (flags.gametype != 'I' ) {
			if (items.book && items.glove) return true;
			if (items.mirror && canReachMire()) return true;	
		};
		if (flags.gametype === 'I') {
			if (canReachDP() && items.glove) return true;
		};
		return false;
	};

	function canReachHera() { 
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N' && items.boots) return true;
		if (flags.gametype != 'I') {
			if (canReachWDM() && (items.mirror || (items.hookshot && items.hammer))) return true;
		};
		if (flags.gametype === 'I') {
			if (canReachEDM() && items.moonpearl && items.hammer) return true;
		};
		return false;
	};

	function canReachMire() {
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N' && items.boots && canReachSDW()) return true;
		if (flags.gametype != 'I') {
			if (items.glove === 2 && items.flute >= 1) return true;
		};
		if (flags.gametype === 'I') {
			if (items.flute > 1 || (items.flute === 1 && canReachLightWorld())) return true;
			if (canReachLightWorldBunny() && items.mirror) return true;
		};
		return false;
	};

	function canReachSewersDropdown() {
		if (flags.glitches === 'M') return true;
		if (flags.glitches != 'N' && canReachLightWorld()) return true;
		if (flags.gametype != 'I') {
			if (items.glove) return true;
		};
	};

	const dungeonReachLogic = {
		"Hyrule Castle - Main": {
			"Open": {
				"logical": {
					"allOf": [
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
						"canReachLightWorld"
					]
				}
			},
			"Entrance": ["hc_m", "hc_e", "hc_w"]
		},
		"Hyrule Castle - Sewers Dropdown": {
			"Open": {
				"logical": {
					"allOf": [
						"glove"
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
						"canReachLightWorld",
						"glove"
					]
				}
			},
			"Entrance": ["sew"]
		},
		"Sanctuary": {
			"Open": {
				"logical": {
					"allOf": [
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
						"canReachLightWorld"
					]
				}
			},
			"Entrance": ["sanc"]
		},
		"Eastern Palace": {
			"Open": {},
			"Inverted": {
				"required": {
					"allOf": [
						"canReachLightWorldBunny"
					]
				},
				"logical": {
					"allOf": [
						"canReachLightWorld"
					]
				}
			},
			"OpenGlitched": {},
			"InvertedGlitched": {},
			"Entrance": ["ep"]
		},
		"Desert Palace - Main": {
			"Open": {
				"logical": {
					"allOf": [
						"canReachDP",
					]
				}
			},
			"Inverted": {
				"required": {
					"allOf": [
						"canReachLightWorldBunny",
						"book"
					]
				},
				"logical": {
					"allOf": [
						"canReachDP"
					]
				}
			},
			"Entrance": ["dp_e", "dp_w", "dp_m"]
		},
		"Desert Palace - North": {
			"Open": {
				"logical": {
					"allOf": [
						"canReachDPNorth"
					]
				}
			},
			"Inverted": {
				"required": {
					"allOf": [
						"canReachLightWorldBunny",
						"book",
						"glove"
					]
				},
				"logical": {
					"allOf": [
						"canReachDPNorth"
					]
				}
			},
			"Entrance": ["dp_n"]
		},
		"Tower of Hera": {
			"Open": {
				"required": {
					"allOf": [
						"canHitSwitch",
						{
							"anyOf": [
								"glove",
								"flute"
							]
						},
						{
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
						}
					]
				},
				"logical": {
					"allOf": [
						"canHitSwitch",
						"canReachHera"
					],
					"anyOf": [
						"flute",
						"lantern"
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
						"canReachHera"
					],
					"anyOf": [
						"flute",
						"lantern"
					]
				}
			},
			"Entrance": ["toh"]
		},
		"Palace of Darkness": {
			"Open": {
				"required": {
					"anyOf": [
						"canReachEDW",
						{
							"allOf": [
								"agahnim",
								"canOWFairyRevive"
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"canReachEDW"
					]
				}
			},
			"Inverted": {
				"required": {
					"allOf": [
						"canQirnJump"
					]
				},
				"logical": {
					"allOf": [
						"canReachEDW"
					]
				}
			},
			"Entrance": []
		},
		"Swamp Palace": {
			"Open": {
				"logical": {
					"allOf": [
						"canReachSDW"
					]
				}
			},
			"Inverted": {
				"required": {
					"allOf": [
						"canReachLightWorldBunny"
					]
				},
				"logical": {
					"allOf": [
						"canReachLightWorld"
					]
				}
			},
			"Entrance": ["sp"]
		},
		"Skull Woods - Main": {
			"Open": {
				"logical": {
					"allOf": [
						"canReachWDW"
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [ ]
				}
			},
			"Entrance": ["sw_m"]
		},
		"Skull Woods - Middle": {
			"Open": {
				"logical": {
					"allOf": [
						"canReachWDW"
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [ ]
				}
			},
			"Entrance": ["sw_e, sw_w"]
		},
		"Skull Woods - Back": {
			"Open": {
				"logical": {
					"allOf": [
						"canReachWDW",
						"firerod"
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
						"firerod"
					]
				}
			},
			"Entrance": ["sw"]
		},
		"Skull Woods - Drops": {
			"Open": {
				"logical": {
					"allOf": [
						"canReachWDW"
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [ ]
				}
			},
			"Entrance": []
		},
		"Thieves Town": {
			"Open": {
				"logical": {
					"allOf": [
						"canReachWDW"
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
					]
				}
			},
			"Entrance": ["tt"]
		},
		"Ice Palace": {
			"Open": {
				"required": {
					"allOf": [
						"mitts",
						"canFakeFlipper"
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
				"logical": {
					"allOf": [
						"flippers"
					]
				}
			},
			"Entrance": ["ip"]
		},
		"Misery Mire": {
			"Open": {
				"required": {
					"allOf": [
						"canReachMire"
					],
					"anyOf": [
						"moonpearl",
						"canOWFairyRevive"
					]
				},
				"logical": {
					"allOf": [
						"canReachMire",
						"moonpearl"
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
						"canReachMire"
					]
				}
			},
			"Entrance": ["mm"]
		},
		"Turtle Rock - Main": {
			"Open": {
				"logical": {
					"allOf": [
						"canReachDDM",
						"hammer",
						"moonpearl"

					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
						"canReachDDM",
					]
				}
			},
			"Entrance": []
		},
		"Ganons Tower": {
			"Open": {
				"required": {
					"allOf": [
						"canOpenGT",
						"canReachDDM"
					]
				},
				"logical": {
					"allOf": [
						"canOpenGT",
						"canReachDDM",
						"moonpearl"
					]
				}
			},
			"Inverted": {
				"required": {
					"allOf": [
						"canOpenGT",
						"canReachLightworldBunny"
					]
				},
				"logical": {
					"allOf": [
						"canReachLightWorld",
						"canOpenGT",
						"moonpearl"
					]
				}
			},
			"Entrance": ["gt"]
		},
		"Castle Tower": {
			"Open": {
				"logical": {
					"anyOf": [
						"canDestroyEnergyBarrier",
						"cape"
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
						"canReachDDM"
					]
				}
			},
			"Entrance": ["ct"]
		},
		"Placeholder": {
			"Open": {
				"logical": {
					"allOf": [
					]
				}
			},
			"Inverted": {
				"logical": {
					"allOf": [
					]
				}
			},
			"Entrance": []
		}
	};

	function locationRequiresMoonpearl(dungeon) {
		const mapTrackerName = dungeonReachLogic[dungeon]["Entrance"];
		const moonpearlWorld = flags.gametype === 'I' ? 'light' : 'dark';
		for (var i = 0; i < entrances.length; i++) {
			if (entrances[i].known_location === mapTrackerName) {
				return entrances[i].world === moonpearlWorld;
			}
		};
	};

	// Location object contains "anyOf" or "allOf" arrays of conditions
	function dungeonReachInLogic(requirements) {
		if (requirements.allOf) {
			for (const requirement of requirements.allOf) {
				if (dungeonReachLogicSwitch(requirement) != true) return false;
			}
		}
		if (requirements.anyOf) {
			for (const requirement of requirements.anyOf) {
				if (dungeonReachLogicSwitch(requirement) === true) return true;
			}
			return false;
		}
		return true;
	};

	function dungeonReachLogicSwitch(requirement) {
		// If requirement is not a string call inLogic recursively
		if (typeof requirement === 'object') return dungeonReachInLogic(requirement);
		switch (requirement) {
			case "book": return items.book;
			case "glove": return items.glove > 0;
			case "mitts": return items.glove > 1;
			case "flute": return activeFlute();
			case "firerod": return items.firerod;
			case "lantern": return items.lantern;
			case "mirror": return items.mirror;
			case "flippers": return items.flippers;
			case "hammer": return items.hammer;
			case "hookshot": return items.hookshot;
			case "agahnim": return items.agahnim;
			case "moonpearl": return items.moonpearl;
			case "cape": return items.cape;

			case "canHitSwitch": return canHitSwitch();
			case "canDestroyEnergyBarrier": return items.sword > 1 || (flags.swordmode === 'S' && items.hammer);

			case "canFairyReviveHover": return items.boots && items.bottle && items.net;
			case "canFakeFlipper": return items.flippers || true;
			case "canOWFairyRevive": return items.bottle && items.net;
			case "canQirnJump": return true;

			case "canReachLightWorld": return canReachLightWorld();
			case "canReachLightWorldBunny": return canReachLightWorldBunny();
			case "canReachDP": return canReachDP();
			case "canReachDPNorth": return canReachDPNorth();
			case "canReachHera": return canReachHera();
			case "canReachEDW": return canReachEDW();
			case "canReachWDW": return canReachWDW();
			case "canReachSDW": return canReachSDW();
			case "canReachDDM": return canReachDDM();
			case "canReachEDM": return canReachEDM();
			case "canReachMire": return canReachMire();
			case "canOpenGT": return crystalCheck() >= flags.opentowercount;

			default: throw new Error("Unknown requirement: " + requirement);
		};
	};

	function dungeonReachLogicCategory() {
		const glitched = flags.glitches != 'N';
		const inverted = flags.gametype === 'I';
		if (inverted) return glitched ? 'InvertedGlitched' : 'Inverted';
		return glitched ? 'OpenGlitched': 'Open';
	};

	function canReachDungeon(dungeon) {
		if (flags.entrancemode != 'N') {
			const mapTrackerNames = dungeonReachLogic[dungeon]["Entrance"];
			found = false;
			requirePearl = true;
			for (var i = 0; i < mapTrackerNames.length; i++) {
				const mapTrackerName = mapTrackerNames[i];
				if (hasFoundLocation(mapTrackerName)) found = true;
				if (found) {
					if (!locationRequiresMoonpearl(mapTrackerName)) requirePearl = false;
				};
			};
			if (found) return requirePearl && !items.moonpearl ? 'possible' : 'available';
			return 'unavailable';
		};

		if (dungeon === "Misery Mire") {
			var medcheck = medallionCheck(0)
			if (medcheck === 'unavailable') return 'unavailable';
		} else if (dungeon === "Turtle Rock - Main") {
			var medcheck = medallionCheck(1)
			if (medcheck === 'unavailable') return 'unavailable';
		} else {
			var medcheck = 'available';
		};

		const category = dungeonReachLogicCategory();
		const requirements = dungeonReachLogic[dungeon][category];
		if (!("logical" in requirements) || dungeonReachInLogic(requirements["logical"])) {
			return medcheck === 'available' ? 'available' : 'possible';
		} else if ("required" in requirements && dungeonReachInLogic(requirements["required"])) {
			return medcheck === 'available' ? 'darkpossible' : 'possible';
		};
		return 'unavailable';
	};

	window.loadChestFlagsItem = function() {
			
		if (flags.glitches === "O" || flags.glitches === 'H' || flags.glitches === 'M') {

			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() {
					return window.EPBoss();
				},
				can_get_chest: function() {
					return window.EPChests();
				}
			}, { // [1]
				caption: 'Desert Palace {book} / {glove2} {mirror} {flute}',
				is_beaten: false,
				is_beatable: function() {
					return canReachDPNorth() ? window.DPBoss() : 'unavailable';
				},
				can_get_chest: function() {
					return canReachDP() ? window.DPChests() : 'unavailable';
				}
			}, { // [2]
				caption: 'Tower of Hera {mirror} / {hookshot} {hammer}',
				is_beaten: false,
				is_beatable: function() {
					return canReachHera() ? window.HeraBoss() : 'unavailable';
				},
				can_get_chest: function() {
					return canReachHera() ? window.HeraChests() : 'unavailable';
				}
			}, { // [3]
				caption: 'Palace of Darkness',
				is_beaten: false,
				is_beatable: function() {
					if (flags.glitches === 'H' || flags.glitches === 'M') {
						return (items.boots || (flags.glitches === 'M')) ? window.PoDBoss() : 'unavailable';
					} else {
					return canReachEDW() && items.moonpearl ? window.PoDBoss() : 'unavailable';
					}
				},
				can_get_chest: function() {
					if (flags.glitches === 'H' || flags.glitches === 'M') {
						return (items.boots || (flags.glitches === 'M')) ? window.PoDChests() : 'unavailable';
					} else {
					return canReachEDW() && items.moonpearl ? window.PoDChests() : 'unavailable';
				}
				}
			}, { // [4]
				caption: 'Swamp Palace {mirror} {flippers}',
				is_beaten: false,
				is_beatable: function() {
					if (flags.glitches === 'H' || flags.glitches === 'M') {
						return window.SPBoss();
					} else {
					return canReachSDW() && items.flippers && items.moonpearl && items.mirror ? window.SPBoss() : 'unavailable';
					}
				},
				can_get_chest: function() {
					if (flags.glitches === 'H' || flags.glitches === 'M') {
						return window.SPChests();
					} else {
					return canReachSDW() && items.flippers && items.moonpearl && items.mirror ? window.SPChests() : 'unavailable';
				}
				}
			}, { // [5]
				caption: 'Skull Woods',
				is_beaten: false,
				is_beatable: function() {
					return canReachWDW() && ((items.moonpearl || canBunnyPocket())) ? window.SWBoss() : 'unavailable';
				},
				can_get_chest: function() {
					return canReachWDW() ? window.SWChests() : 'unavailable';
				}
			}, { // [6]
				caption: 'Thieves\' Town',
				is_beaten: false,
				is_beatable: function() {
					return canReachWDW() && (items.moonpearl || glitchLinkState()) ? window.TTBoss() : 'unavailable';
				},
				can_get_chest: function() {
					return canReachWDW() && (items.moonpearl || glitchLinkState()) ? window.TTChests() : 'unavailable';
				}
			}, { // [7]
				caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
				is_beaten: false,
				is_beatable: function() {
					if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return (items.glove === 2) || (canReachSDW() && (items.moonpearl || glitchLinkState()) && (flags.glitches === 'M' && items.mirror)) ? window.IPBoss() : 'unavailable';
				},
				can_get_chest: function() {
					if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && flags.swordmode != 'S')) && flags.glitches !== 'M' && flags.glitches !== 'H') return 'unavailable';
					return (items.glove === 2) || (canReachSDW() && (items.moonpearl || glitchLinkState())  && (flags.glitches === 'M' && items.mirror)) ? window.IPChests() : 'unavailable';
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}]',
				is_beaten: false,
				is_beatable: function() {
					if (!items.boots && !items.hookshot) return 'unavailable';
					return canReachMire() && (items.moonpearl || glitchLinkState())  ? window.MMBoss(medallionCheck(0)) : 'unavailable';
				},
				can_get_chest: function() {
					if (!items.boots && !items.hookshot) return 'unavailable';
					return canReachMire() && (items.moonpearl || glitchLinkState())  ? window.MMChests(medallionCheck(0)) : 'unavailable';
				}
			}, { // [9]
				caption: 'Turtle Rock {medallion0}/{mirror}',
				is_beaten: false,
				is_beatable: function() {
					return (items.mirror || (items.boots && items.moonpearl) || (flags.glitches === 'M')) && (items.boots || items.somaria || items.hookshot || items.cape || items.byrna || flags.glitches === 'M') && items.bigkey9 && canReachDDM() ? window.TRMidBoss() : 
						medallionCheck(1) != 'unavailable' && items.moonpearl && items.somaria && ((items.hammer && items.glove === 2 && canReachEDM()) || items.boots) ? window.TRFrontBoss(medallionCheck(1)) :
						'unavailable';
				},
				can_get_chest: function() {
					return (items.mirror || (items.boots && items.moonpearl) || (flags.glitches === 'M')) && (items.boots || items.somaria || items.hookshot || items.cape || items.byrna || flags.glitches === 'M') && canReachDDM() ? window.TRMidChests() : 
						medallionCheck(1) != 'unavailable' && items.moonpearl && items.somaria && ((items.hammer && items.glove === 2 && canReachEDM()) || items.boots) ? window.TRFrontChests(medallionCheck(1)) :
						'unavailable';
				}
			}, { // [10]
				caption: 'Ganon\'s Castle (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if ((crystalCheck() < flags.ganonvulncount && flags.goals != 'A') || (!items.agahnim2 && flags.goals != 'F') || !canReachEDW() || (flags.goals === 'A' && (!items.agahnim || !allDungeonCheck()))) return 'unavailable';
					if ((flags.swordmode != 'S' && items.sword < 2) || (flags.swordmode === 'S' && !items.hammer) || (!items.lantern && !items.firerod)) return 'unavailable';
					//Fast Ganon
					if (flags.goals === 'F' && (items.sword > 1 || flags.swordmode === 'S' && (items.hammer || items.net)) && (items.lantern || items.firerod)) return 'available';
					return window.GTBoss();
				},
				can_get_chest: function() {
					return (items.moonpearl || flags.glitches === 'M') && ((crystalCheck() >= flags.opentowercount && canReachDDM()) || ((items.boots && canReachWDM()) || (flags.glitches === 'M')) ) ? window.GTChests() : 'unavailable';
				}
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ?window.dungeons[11].can_get_chest() :'opened';
				},
				can_get_chest: function() {
					return window.doorCheck(11,false,false,flags.gametype != 'S',['glove','killbomb','bombdash'],'item');
				}
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() {
					if(items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape && !items.agahnim)
						return 'unavailable';
					if(items.mirror && (items.agahnim || (items.glove && items.hammer && items.moonpearl) || (items.glove === 2 && items.moonpearl && items.flippers)))
						return window.doorCheck(12,false,true,true,['kill','swordorswordless'],'item');
					return 'possible';
				}
			}];

			window.agahnim = {
				caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
				is_available: function() {
					if (items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape) return 'unavailable';
					if (!items.sword && !items.hammer && !items.net) return 'unavailable';
					return (items.sword >= 2 || (items.cape && items.sword) || (flags.swordmode === 'S' && (items.hammer || (items.cape && items.net)))) && (items.smallkeyhalf1 >= 2 || flags.gametype == 'R') && agatowerweapon() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			};

			window.chests = [{ // [0]
				caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
				is_opened: false,
				is_available: function() {
					return items.boots ? 'available' : 'unavailable';
				}
			}, { // [1]
				caption: 'Light World Swamp (2)',
				is_opened: false,
				is_available: always
			}, { // [2]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: (flags.gametype === 'S'),
				is_available: always
			}, { // [3]
				caption: 'Spiral Cave',
				is_opened: false,
				is_available: function() {
					return canReachEDM() ?
						items.lantern ||items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [4]
				caption: 'Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion0} unknown OR possible w/out {firerod})',
				is_opened: false,
				is_available: function() {
					return items.mirror && items.hammer && canReachEDM() ? 
						items.lantern || items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [5]
				caption: 'Tavern',
				is_opened: false,
				is_available: always
			}, { // [6]
				caption: 'Chicken House {bomb}',
				is_opened: false,
				is_available: always
			}, { // [7]
				caption: 'Bombable Hut {bomb}',
				is_opened: false,
				is_available: function() {
					return canReachWDW() && (items.moonpearl || glitchLinkState()) ? 'available' : 'unavailable';
				}
			}, { // [8]
				caption: 'C House',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [9]
				caption: 'Aginah\'s Cave {bomb}',
				is_opened: false,
				is_available: always
			}, { // [10]
				caption: 'Mire Shed (2)',
				is_opened: false,
				is_available: function() {
					return canReachMire() && (items.moonpearl || items.mirror || glitchLinkState()) ? 'available' : 'unavailable';
				}
			}, { // [11]
				caption: 'Super Bunny Chests (2)',
				is_opened: false,
				is_available: function() {
					return canReachDDM() ?
						items.lantern || items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [12]
				caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
				is_opened: false,
				is_available: always
			}, { // [13]
				caption: 'Byrna Spike Cave',
				is_opened: false,
				is_available: function() {
					return canReachWDM() && (items.moonpearl || glitchLinkState()) && items.glove && items.hammer && (items.byrna || (items.cape && (items.bottle || items.magic))) ?
						items.lantern || items.flute >= 1 || items.boots || glitchLinkState() ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [14]
				caption: 'Kakariko Well (4 + {bomb})',
				is_opened: false,
				is_available: always
			}, { // [15]
				caption: 'Thieve\'s Hut (4 + {bomb})',
				is_opened: false,
				is_available: always
			}, { // [16]
				caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
				is_opened: false,
				is_available: function() {
					return canReachSDW() && (items.moonpearl || glitchLinkState()) ? 'available' : 'unavailable';
				}
			}, { // [17]
				caption: 'Paradox Cave (5 + 2 {bomb})',
				is_opened: false,
				is_available: function() {
					return canReachEDM() ?
						items.lantern || items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [18]
				caption: 'West of Sanctuary {boots}',
				is_opened: false,
				is_available: function() {
					return items.boots ? 'available' : 'unavailable';
				}
			}, { // [19]
				caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
				is_opened: false,
				is_available: always
			}, { // [20]
				caption: 'Ice Rod Cave {bomb}',
				is_opened: false,
				is_available: always
			}, { // [21]
				caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
				is_opened: false,
				is_available: function() {
					return canReachEDM() && (items.moonpearl || glitchLinkState()) && (items.glove || items.boots || flags.glitches === 'M') && (items.boots || items.hookshot) ?
						items.lantern || items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [22]
				caption: 'Hookshot Cave (3 top chests) {hookshot}',
				is_opened: false,
				is_available: function() {
					return canReachEDM() && (items.moonpearl || glitchLinkState()) && (items.glove || items.boots || flags.glitches === 'M') && items.hookshot ?
						items.lantern || items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [23]
				caption: 'Lost Woods Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [24]
				caption: 'Death Mountain Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDM() ?
					(items.lantern || items.flute >= 1 ? 'available' : 'darkavailable') : 'unavailable';
				}
			}, { // [25]
				caption: 'Mountain Entry Pull Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [26]
				caption: 'Mountain Entry Southeast Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [27]
				caption: 'Lost Woods Pass West Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [28]
				caption: 'Kakariko Portal Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [29]
				caption: 'Fortune Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [30]
				caption: 'Kakariko Pond Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && (canGetBonkableItem()) ? 'available' : 'unavailable';
				}
			}, { // [31]
				caption: 'Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && (canGetBonkableItem()) ? 'available' : 'unavailable';
				}
			}, { // [32]
				caption: 'Sanctuary Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [33]
				caption: 'River Bend West Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && (canGetBonkableItem()) ? 'available' : 'unavailable';
				}
			}, { // [34]
				caption: 'River Bend East Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [35]
				caption: 'Blinds Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [36]
				caption: 'Kakariko Welcome Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [37]
				caption: 'Forgotten Forest Southwest Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [38]
				caption: 'Forgotten Forest Central Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [39]
				caption: 'Hyrule Castle Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [40]
				caption: 'Wooden Bridge Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [41]
				caption: 'Eastern Palace Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [42]
				caption: 'Flute Boy South Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [43]
				caption: 'Flute Boy East Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [44]
				caption: 'Central Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [45]
				caption: 'Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [46]
				caption: 'Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [47]
				caption: 'Flute Boy Approach South Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [48]
				caption: 'Flute Boy Approach North Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [49]
				caption: 'Dark Lumberjack Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && (canGetBonkableItem()) && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [50]
				caption: 'Dark Fortune Bonk Rocks (2)',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [51]
				caption: 'Dark Graveyard West Bonk Rock',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [52]
				caption: 'Dark Graveyard North Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [53]
				caption: 'Dark Graveyard Tomb Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [54]
				caption: 'Qirn Jump West Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [55]
				caption: 'Qirn Jump East Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEDW() && (items.flippers || items.glove || items.hammer) ? 'available' : 'unavailable';
				}
			}, { // [56]
				caption: 'Dark Witch Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEDW() && (items.flippers || items.glove || items.hammer) ? 'available' : 'unavailable';
				}
			}, { // [57]
				caption: 'Pyramid Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [58]
				caption: 'Palace of Darkness Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [59]
				caption: 'Dark Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [60]
				caption: 'Dark Tree Line Tree 3',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [61]
				caption: 'Dark Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [62]
				caption: 'Hype Cave Statue',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [63]
				caption: 'Cold Fairy Statue',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [64]
				caption: 'Treasure Chest Minigame: Pay 30 rupees',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [65]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: always
			}, { // [66]
				caption: 'Sahasrahla {pendant0}',
				is_opened: false,
				is_available: function() {
					for (var k = 0; k < 10; k++) {
						if (prizes[k] === 1 && items['boss'+k])
							return 'available';
					}
					return 'unavailable';
				}
			}, { // [67]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: function() {
					return (items.moonpearl || glitchLinkState()) && canReachSDW() ? 'available' : 'unavailable';
				}
			}, { // [68]
				caption: 'Muffins Kid: Distract him with {bottle} because he can\'t lay off the sauce!',
				is_opened: false,
				is_available: function() {
					return items.bottle ? 'available' : 'unavailable';
				}
			}, { // [69]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return canReachWDW() && (items.moonpearl || glitchLinkState()) && (items.glove === 2 || (flags.glitches === 'M' && items.bottle)) ? 'available' : 'unavailable';
				}
			}, { // [70]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: always
			}, { // [71]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return items.book && canReachHera() ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ?
							items.lantern || items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' :
							'information' :
						'unavailable';
				}
			}, { // [72]
				caption: 'Bombos Tablet {mirror}{sword2}{book}',
				is_opened: false,
				is_available: function() {
					return items.book && ((items.mirror && canReachSDW()) || items.boots || flags.glitches === 'M') ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer))? 'available' : 'information' :
						'unavailable';
				}
			}, { // [73]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					return canReachEDW() && (items.moonpearl || glitchLinkState())  && (items.glove || items.boots || flags.glitches === 'M') ?
						'available' : 'unavailable';
				}
			}, { // [74]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: always
			}, { // [75]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					return canReachLowerWestDeathMountain() ?
						items.lantern ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [76]
				caption: 'Witch: Give her {mushroom}',
				is_opened: false,
				is_available: function() {
					return items.mushroom ? 'available' : 'unavailable';
				}
			}, { // [77]
				caption: 'Forest Hideout',
				is_opened: false,
				is_available: always
			}, { // [78]
				caption: 'Lumberjack Tree {agahnim}{boots}',
				is_opened: false,
				is_available: function() {
					return items.agahnim && items.boots ? 'available' : 'information';
				}
			}, { // [79]
				caption: 'Spectacle Rock Cave',
				is_opened: false,
				is_available: function() {
					return canReachLowerWestDeathMountain() ?
						items.lantern || items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [80]
				caption: 'South of Grove {mirror}',
				is_opened: false,
				is_available: function() {
					return (items.mirror && canReachSDW()) || (items.boots || flags.glitches === 'M') ? 'available' : 'unavailable';
				}
			}, { // [81]
				caption: 'Graveyard Cliff Cave {mirror}',
				is_opened: false,
				is_available: function() {
					return items.boots || (items.mirror && canReachWDW() && items.moonpearl) || flags.glitches === 'M' ? 'available' : 'unavailable';
				}
			}, { // [82]
				caption: 'Checkerboard Cave {mirror}',
				is_opened: false,
				is_available: function() {
					return items.glove && (items.boots || flags.glitches === 'M' || (canReachMire() && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [83]
				caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
				is_opened: false,
				is_available: function() {
					return (items.moonpearl || glitchLinkState()) && (items.glove === 2 || items.boots || flags.glitches === 'M') && items.hammer ? 'available' : 'unavailable';
				}
			}, { // [84]
				caption: 'Library {boots}',
				is_opened: false,
				is_available: function() {
					return items.boots ? 'available' : 'information';
				}
			}, { // [85]
				caption: 'Mushroom',
				is_opened: false,
				is_available: always
			}, { // [86]
				caption: 'Spectacle Rock {mirror}',
				is_opened: false,
				is_available: function() {
					return canReachLowerWestDeathMountain() ?
						items.mirror || items.boots || flags.glitches === 'M' ?
							items.lantern || items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' :
							'information' :
						'unavailable';
				}
			}, { // [87]
				caption: 'Floating Island {mirror}',
				is_opened: false,
				is_available: function() {
					return canReachEDM() ?
						items.boots || flags.glitches === 'M' || (items.mirror && items.moonpearl && items.glove && canReachDDM()) ?
							items.lantern || items.flute >= 1 || items.boots || flags.glitches === 'M' ? 'available' : 'darkavailable' :
							'information' :
						'unavailable';
				}
			}, { // [88]
				caption: 'Race Minigame {bomb}/{boots}',
				is_opened: false,
				is_available: always
			}, { // [89]
				caption: 'Desert West Ledge {book}/{mirror}',
				is_opened: false,
				is_available: function() {
					return canReachDP() ? 'available' : 'information';
				}
			}, { // [90]
				caption: 'Lake Hylia Island {mirror}',
				is_opened: false,
				is_available: function() {
					return items.boots || flags.glitches === 'M' || (items.moonpearl && items.mirror && items.flippers && canReachEDW()) ? 'available' : 'information';
				}
			}, { // [91]
				caption: 'Bumper Cave {cape}',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ?
						flags.glitches === 'M' || (items.moonpearl && (items.boots || (items.glove && items.cape))) ? 'available' : 'information' :
						'unavailable';
				}
			}, { // [92]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					return canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [93]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: function() {
					return canReachSDW() && (items.moonpearl || glitchLinkState()) ? 'available' : 'unavailable';
				}
			}, { // [94]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					return items.flippers || items.boots ? 'available' : 'information';
				}
			}, { // [95]
				caption: 'Buried Itam {shovel}',
				is_opened: false,
				is_available: function() {
					return items.shovel ? 'available' : 'unavailable';
				}
			}, { // [96]
				caption: 'Escape Sewer Side Room (3) {bomb}/{boots}' + (flags.gametype === 'S' ? '' : ' (may need small key)'),
				is_opened: false,
				is_available: function() {
					if (flags.gametype === 'S') return 'available';
					if (flags.wildkeys || flags.gametype == 'R') {
						if (items.glove) return 'available';
						if (items.smallkeyhalf0 >= 1 || flags.gametype == 'R') return canDoTorchDarkRooms() ? 'available' : 'darkavailable';
						return 'unavailable';
					}
					
					return items.glove ? 'available' : canDoTorchDarkRooms() ? 'possible' : 'darkpossible';
				}
			}, { // [97]
				caption: "Castle Secret Entrance (Uncle + 1)",
				is_opened: flags.gametype === 'S',
				is_available: always
			}, { // [98]
				caption: 'Hyrule Castle Dungeon (3)',
				is_opened: flags.gametype === 'S',
				is_available: always
			}, { // [99]
				caption: 'Sanctuary',
				is_opened: flags.gametype === 'S',
				is_available: always
			}, { // [100]
				caption: 'Mad Batter {hammer}/{mirror} + {powder}',
				is_opened: false,
				is_available: function() {
					return items.powder && (items.hammer || flags.glitches === 'M' || (items.mirror && (items.moonpearl && ((items.glove === 2 && canReachWDW()) || (canSpinSpeed() && canReachEDW()))))) ? 'available' : 'unavailable';
				}
			}, { // [101]
				caption: 'Take the frog home {mirror} / Save+Quit',
				is_opened: false,
				is_available: function() {
					return canReachWDW() && (((items.moonpearl || glitchLinkState()) && items.glove === 2) || (flags.glitches === 'M' && items.bottle)) ? 'available' : 'unavailable';
				}
			}, { // [102]
				caption: 'Pyramid Fairy: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
				is_opened: false,
				is_available: function() {
					//crystal check
					var crystal_count = 0;
					for (var k = 0; k < 10; k++) {
						if (prizes[k] === 4 && items['boss'+k])
							crystal_count += 1;
					}
					return (crystal_count >= 2 && canReachSDW() && ((items.moonpearl && items.hammer) || (flags.glitches === 'M' && items.bottle) || (items.mirror && items.agahnim))) || (items.mirror && (items.boots || (flags.glitches === 'M'))) ? 'available' : 'unavailable';
				}
			}, { // [103]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					var pendant_count = 0;
					for (var k = 0; k < 10; k++) {
						if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k]) {
							if (++pendant_count === 3) return 'available';
						}
					}
					return items.book ? 'information' : 'unavailable';
				}
			}, { // [104]
				caption: 'Escape Sewer Dark Room {lantern}',
				is_opened: flags.gametype === 'S',
				is_available: function() {
					return flags.gametype === 'S' || canDoTorchDarkRooms() ? 'available' : 'darkavailable';
				}
			}, { // [105]
				caption: 'Waterfall of Wishing (2) {flippers}',
				is_opened: false,
				is_available: function() {
					return items.flippers || items.boots || items.moonpearl ? 'available' : 'unavailable';
				}
			}, { // [106]
				caption: 'Castle Tower',
				is_opened: false,
				is_available: function() {
					//return items.sword >= 2 || (flags.swordmode === 'S' && items.hammer) || items.cape ? 'available' : 'unavailable';
					if(items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape)
						return 'unavailable';
					return 'available';
				}
			}, { // [107]
				caption: 'Castle Tower (small key)',
				is_opened: false,
				is_available: function() {
					if(items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape)
						return 'unavailable';
					return items.smallkeyhalf1 > 0 || flags.gametype === 'R' ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [108]
				caption: 'Lake Hylia Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [109]
				caption: 'Kakariko Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [110]
				caption: 'Paradox Shop (3) {bomb}',
				is_opened: false,
				is_available: function() {
					return items.bomb && canReachEDM() ?
						items.lantern || items.flute >= 1 || items.boots ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [111]
				caption: 'Dark Lake Hylia Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachSDW() ? 'available' : 'unavailable';
				}
			}, { // [112]
				caption: 'Village of Outcasts Shop (3) {hammer}',
				is_opened: false,
				is_available: function() {
					return canReachWDW() && items.moonpearl && items.hammer ? 'available' : 'unavailable';
				}
			}, { // [113]
				caption: 'Dark Death Mountain Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachDDM() ?
						items.lantern || items.flute >= 1 || items.boots ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [114]
				caption: 'Dark Potion Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [115]
				caption: 'Dark Lumberjack Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [116]
				caption: 'Curiosity Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [117]
				caption: 'Potion Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [118]
				caption: 'Pond of Happiness (2)',
				is_opened: false,
				is_available: always
			}, { // [119]
				caption: 'Bomb Shop (2)',
				is_opened: false,
				is_available: function() {
					return canReachSDW() ? 'available' : 'unavailable';
				}

			}];
		}
		
		else if (flags.glitches != "N" && flags.glitches != 'O' && flags.glitches != 'H' && flags.glitches != 'M') {
			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(0); },
				can_get_chest: function() { return 'available'; }
			}, { // [1]
				caption: 'Desert Palace {book}',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(1); },
				can_get_chest: function() { return 'available'; }
			}, { // [2]
				caption: 'Tower of Hera {hammer} [{hookshot}/{glove2}]',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(2); },
				can_get_chest: function() { return 'available'; }
			}, { // [3]
				caption: 'Palace of Darkness',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(3); },
				can_get_chest: function() { return 'available'; }
			}, { // [4]
				caption: 'Swamp Palace {mirror} {flippers}',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(4); },
				can_get_chest: function() { return 'available'; }
			}, { // [5]
				caption: 'Skull Woods',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(5); },
				can_get_chest: function() { return 'available'; }
			}, { // [6]
				caption: 'Thieves\' Town',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(6); },
				can_get_chest: function() { return 'available'; }
			}, { // [7]
				caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(7); },
				can_get_chest: function() { return 'available'; }
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(8); },
				can_get_chest: function() { return 'available'; }
			}, { // [9]
				caption: 'Turtle Rock {medallion0}/{mirror}',
				is_beaten: false,
				is_beatable: function() { return MinimalBoss(9); },
				can_get_chest: function() { return 'available'; }
			}, { // [10]
				caption: 'Ganon\'s Castle (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if ((crystalCheck() < flags.ganonvulncount && flags.goals != 'A') || (!items.agahnim2 && flags.goals != 'F') || (flags.goals === 'A' && (!items.agahnim || !allDungeonCheck()))) return 'unavailable';
					if ((flags.swordmode != 'S' && items.sword < 2) || (flags.swordmode === 'S' && !items.hammer) || (!items.lantern && !items.firerod)) return 'unavailable';
					if (flags.goals === 'F' && (items.sword > 1 || flags.swordmode === 'S' && items.hammer) && (items.lantern || items.firerod)) return 'available';
					return 'available';
				},
				can_get_chest: function() { return 'available'; }
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ?window.dungeons[11].can_get_chest() :'opened';
				},
				can_get_chest: function() { return 'available'; }
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() { return 'available'; }
			}];

			window.agahnim = {
				caption: 'Agahnim',
				is_available: always
			};

			window.chests = [{ // [0]
				caption: 'King\'s Tomb {boots} + {glove2}',
				is_opened: false,
				is_available: always
			}, { // [1]
				caption: 'Light World Swamp (2)',
				is_opened: false,
				is_available: always
			}, { // [2]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: false,
				is_available: always
			}, { // [3]
				caption: 'Spiral Cave',
				is_opened: false,
				is_available: always
			}, { // [4]
				caption: 'Mimic Cave',
				is_opened: false,
				is_available: always
			}, { // [5]
				caption: 'Tavern',
				is_opened: false,
				is_available: always
			}, { // [6]
				caption: 'Chicken House {bomb}',
				is_opened: false,
				is_available: always
			}, { // [7]
				caption: 'Bombable Hut {bomb}',
				is_opened: false,
				is_available: always
			}, { // [8]
				caption: 'C House',
				is_opened: false,
				is_available: always
			}, { // [9]
				caption: 'Aginah\'s Cave {bomb}',
				is_opened: false,
				is_available: always
			}, { // [10]
				caption: 'Mire Shed (2)',
				is_opened: false,
				is_available: always
			}, { // [11]
				caption: 'Super Bunny Chests (2)',
				is_opened: false,
				is_available: always
			}, { // [12]
				caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
				is_opened: false,
				is_available: always
			}, { // [13]
				caption: 'Byrna Spike Cave',
				is_opened: false,
				is_available: always
			}, { // [14]
				caption: 'Kakariko Well (4 + {bomb})',
				is_opened: false,
				is_available: always
			}, { // [15]
				caption: 'Thieve\'s Hut (4 + {bomb})',
				is_opened: false,
				is_available: always
			}, { // [16]
				caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
				is_opened: false,
				is_available: always
			}, { // [17]
				caption: 'Paradox Cave (5 + 2 {bomb})',
				is_opened: false,
				is_available: always
			}, { // [18]
				caption: 'West of Sanctuary {boots}',
				is_opened: false,
				is_available: always
			}, { // [19]
				caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
				is_opened: false,
				is_available: always
			}, { // [20]
				caption: 'Ice Rod Cave {bomb}',
				is_opened: false,
				is_available: always
			}, { // [21]
				caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
				is_opened: false,
				is_available: always
			}, { // [22]
				caption: 'Hookshot Cave (3 top chests) {hookshot}',
				is_opened: false,
				is_available: always
			}, { // [23]
				caption: 'Lost Woods Hideout Tree',
				is_opened: false,
				is_available: always
			}, { // [24]
				caption: 'Death Mountain Bonk Rocks',
				is_opened: false,
				is_available: always
			}, { // [25]
				caption: 'Mountain Entry Pull Tree',
				is_opened: false,
				is_available: function() {
						for(var k = 0; k < 10; k++)
							if(prizes[k] === 1 && items['boss'+k])
								return 'available';
						return 'unavailable';
				}
			}, { // [26]
				caption: 'Mountain Entry Southeast Tree',
				is_opened: false,
				is_available: always
			}, { // [27]
				caption: 'Lost Woods Pass West Tree',
				is_opened: false,
				is_available: function() {
					return items.bottle ? 'available' : 'unavailable'
				}
			}, { // [28]
				caption: 'Kakariko Portal Tree',
				is_opened: false,
				is_available: always
			}, { // [29]
				caption: 'Fortune Bonk Rocks',
				is_opened: false,
				is_available: always
			}, { // [30]
				caption: 'Kakariko Pond Tree',
				is_opened: false,
				is_available: function() {
					return items.book ? (items.sword >= 2 || (flags.swordmode === 'S' && items.hammer) ? 'available' : 'information') :
						'unavailable';
				}
			}, { // [31]
				caption: 'Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return items.book ? (items.sword >= 2 || (flags.swordmode === 'S' && items.hammer) ? 'available' : 'information') :
						'unavailable';
				}
			}, { // [32]
				caption: 'Sanctuary Tree',
				is_opened: false,
				is_available: always
			}, { // [33]
				caption: 'River Bend West Tree',
				is_opened: false,
				is_available: always
			}, { // [34]
				caption: 'River Bend East Tree',
				is_opened: false,
				is_available: always
			}, { // [35]
				caption: 'Blinds Hideout Tree',
				is_opened: false,
				is_available: function() {
					return items.mushroom ? 'available' : 'unavailable'
				}
			}, { // [36]
				caption: 'Kakariko Welcome Tree',
				is_opened: false,
				is_available: always
			}, { // [37]
				caption: 'Forgotten Forest Southwest Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim ? 'available' : 'information';
				}
			}, { // [38]
				caption: 'Forgotten Forest Central Tree',
				is_opened: false,
				is_available: always
			}, { // [39]
				caption: 'Hyrule Castle Tree',
				is_opened: false,
				is_available: always
			}, { // [40]
				caption: 'Wooden Bridge Tree',
				is_opened: false,
				is_available: always
			}, { // [41]
				caption: 'Eastern Palace Tree',
				is_opened: false,
				is_available: always
			}, { // [42]
				caption: 'Flute Boy South Tree',
				is_opened: false,
				is_available: always
			}, { // [43]
				caption: 'Flute Boy East Tree',
				is_opened: false,
				is_available: function() {
					return items.boots ? 'available' : 'information';
				}
			}, { // [44]
				caption: 'Central Bonk Rocks Tree',
				is_opened: false,
				is_available: always
			}, { // [45]
				caption: 'Tree Line Tree 2',
				is_opened: false,
				is_available: always
			}, { // [46]
				caption: 'Tree Line Tree 4',
				is_opened: false,
				is_available: always
			}, { // [47]
				caption: 'Flute Boy Approach South Tree',
				is_opened: false,
				is_available: always
			}, { // [48]
				caption: 'Flute Boy Approach North Tree',
				is_opened: false,
				is_available: always
			}, { // [49]
				caption: 'Dark Lumberjack Tree',
				is_opened: false,
				is_available: always
			}, { // [50]
				caption: 'Dark Fortune Bonk Rocks (2)',
				is_opened: false,
				is_available: always
			}, { // [51]
				caption: 'Dark Graveyard West Bonk Rock',
				is_opened: false,
				is_available: always
			}, { // [52]
				caption: 'Dark Graveyard North Bonk Rocks',
				is_opened: false,
				is_available: always
			}, { // [53]
				caption: 'Dark Graveyard Tomb Bonk Rocks',
				is_opened: false,
				is_available: always
			}, { // [54]
				caption: 'Qirn Jump West Tree',
				is_opened: false,
				is_available: function() {
					return items.shovel ? 'available' : 'unavailable';
				}
			}, { // [55]
				caption: 'Qirn Jump East Tree',
				is_opened: false,
				is_available: always
			}, { // [56]
				caption: 'Dark Witch Tree',
				is_opened: false,
				is_available: always
			}, { // [57]
				caption: 'Pyramid Tree',
				is_opened: false,
				is_available: always
			}, { // [58]
				caption: 'Palace of Darkness Tree',
				is_opened: false,
				is_available: always
			}, { // [59]
				caption: 'Dark Tree Line Tree 2',
				is_opened: false,
				is_available: always
			}, { // [60]
				caption: 'Dark Tree Line Tree 3',
				is_opened: false,
				is_available: always
			}, { // [61]
				caption: 'Dark Tree Line Tree 4',
				is_opened: false,
				is_available: always
			}, { // [62]
				caption: 'Hype Cave Statue',
				is_opened: false,
				is_available: function() {
					var pendant_count = 0;
					for(var k = 0; k < 10; k++)
						if((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k])
							if(++pendant_count === 3)
								return 'available';
					return items.book ? 'information' : 'unavailable';
				}
			}, { // [63]
				caption: 'Cold Fairy Statue',
				is_opened: false,
				is_available: always
			}, { // [64]
				caption: 'Treasure Chest Minigame: Pay 30 rupees',
				is_opened: false,
				is_available: always
			}, { // [65]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: always
			}, { // [66]
				caption: 'Sahasrahla {pendant0}',
				is_opened: false,
				is_available: always
			}, { // [67]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: always
			}, { // [68]
				caption: 'Muffins Kid: Distract him with {bottle} because he can\'t lay off the sauce!',
				is_opened: false,
				is_available: always
			}, { // [69]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: always
			}, { // [70]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: always
			}, { // [71]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: always
			}, { // [72]
				caption: 'Bombos Tablet {sword2}{book}',
				is_opened: false,
				is_available: always
			}, { // [73]
				caption: 'Catfish',
				is_opened: false,
				is_available: always
			}, { // [74]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: always
			}, { // [75]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: always
			}, { // [76]
				caption: 'Witch: Give her {mushroom}',
				is_opened: false,
				is_available: always
			}, { // [77]
				caption: 'Forest Hideout',
				is_opened: false,
				is_available: always
			}, { // [78]
				caption: 'Lumberjack Tree {agahnim}{boots}',
				is_opened: false,
				is_available: always
			}, { // [79]
				caption: 'Spectacle Rock Cave',
				is_opened: false,
				is_available: always
			}, { // [80]
				caption: 'South of Grove',
				is_opened: false,
				is_available: always
			}, { // [81]
				caption: 'Graveyard Cliff Cave',
				is_opened: false,
				is_available: always
			}, { // [82]
				caption: 'Checkerboard Cave',
				is_opened: false,
				is_available: always
			}, { // [83]
				caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
				is_opened: false,
				is_available: always
			}, { // [84]
				caption: 'Library {boots}',
				is_opened: false,
				is_available: always
			}, { // [85]
				caption: 'Mushroom',
				is_opened: false,
				is_available: always
			}, { // [86]
				caption: 'Spectacle Rock',
				is_opened: false,
				is_available: always
			}, { // [87]
				caption: 'Floating Island',
				is_opened: false,
				is_available: always
			}, { // [88]
				caption: 'Race Minigame {bomb}/{boots}',
				is_opened: false,
				is_available: always
			}, { // [89]
				caption: 'Desert West Ledge {book}',
				is_opened: false,
				is_available: always
			}, { // [90]
				caption: 'Lake Hylia Island {flippers}',
				is_opened: false,
				is_available: always
			}, { // [91]
				caption: 'Bumper Cave {cape}{mirror}',
				is_opened: false,
				is_available: always
			}, { // [92]
				caption: 'Pyramid',
				is_opened: false,
				is_available: always
			}, { // [93]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: always
			}, { // [94]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: always
			}, { // [95]
				caption: 'Buried Item {shovel}',
				is_opened: false,
				is_available: always
			}, { // [96]
				caption: 'Escape Sewer Side Room (3) {bomb}/{boots} (may need small key)',
				is_opened: false,
				is_available: always
			}, { // [97]
				caption: "Castle Secret Entrance (Uncle + 1)",
				is_opened: false,
				is_available: always
			}, { // [98]
				caption: 'Hyrule Castle Dungeon (3)',
				is_opened: false,
				is_available: always
			}, { // [99]
				caption: 'Sanctuary',
				is_opened: false,
				is_available: always
			}, { // [100]
				caption: 'Mad Batter {hammer} + {powder}',
				is_opened: false,
				is_available: always
			}, { // [101]
				caption: 'Take the frog home',
				is_opened: false,
				is_available: always
			}, { // [102]
				caption: 'Pyramid Fairy: Buy OJ bomb from Light Link\'s House after {crystal}5 {crystal}6 (2 items)',
				is_opened: false,
				is_available: always
			}, { // [103]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: always
			}, { // [104]
				caption: 'Escape Sewer Dark Room {lantern}',
				is_opened: false,
				is_available: always
			}, { // [105]
				caption: 'Waterfall of Wishing (2) {flippers}',
				is_opened: false,
				is_available: always
			}, { // [106]
				caption: 'Castle Tower',
				is_opened: false,
				is_available: always
			}, { // [107]
				caption: 'Castle Tower (small key)',
				is_opened: false,
				is_available: always
			}, { // [108]
				caption: 'Lake Hylia Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [109]
				caption: 'Kakariko Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [110]
				caption: 'Paradox Shop (3) {bomb}',
				is_opened: false,
				is_available: always
			}, { // [111]
				caption: 'Dark Lake Hylia Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [112]
				caption: 'Village of Outcasts Shop (3) {hammer}',
				is_opened: false,
				is_available: always
			}, { // [113]
				caption: 'Dark Death Mountain Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [114]
				caption: 'Dark Potion Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [115]
				caption: 'Dark Lumberjack Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [116]
				caption: 'Curiosity Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [117]
				caption: 'Potion Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [118]
				caption: 'Pond of Happiness (2)',
				is_opened: false,
				is_available: always
			}, { // [119]
				caption: 'Bomb Shop (2)',
				is_opened: false,
				is_available: always

			}];
		}

		else if (flags.gametype === "I") {
			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() {
					return window.EPBoss();
				},
				can_get_chest: function() {
					return window.EPChests();
				}
			}, { // [1]
				caption: 'Desert Palace {book}',
				is_beaten: false,
				is_beatable: function() {
					return window.DPBoss();
				},
				can_get_chest: function() {
					return window.DPChests();
				}
			}, { // [2]
				caption: 'Tower of Hera {hammer} [{hookshot}/{glove2}]',
				is_beaten: false,
				is_beatable: function() {
					return window.HeraBoss();
				},
				can_get_chest: function() {
					return window.HeraChests();
				}
			}, { // [3]
				caption: 'Palace of Darkness',
				is_beaten: false,
				is_beatable: function() {
					return window.PoDBoss();
				},
				can_get_chest: function() {
					return window.PoDChests();
				}
			}, { // [4]
				caption: 'Swamp Palace {mirror} {flippers}',
				is_beaten: false,
				is_beatable: function() {
					return window.SPBoss();
				},
				can_get_chest: function() {
					return window.SPChests();
				}
			}, { // [5]
				caption: 'Skull Woods',
				is_beaten: false,
				is_beatable: function() {
					var doorcheck = window.doorCheck(5,false,false,false,['firerod','swordorswordless','mirrorskull','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.SWBoss();
				},
				can_get_chest: function() {
					var doorcheck = window.doorCheck(5,false,false,false,['firerod','swordorswordless','mirrorskull','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.SWChests();
				}
			}, { // [6]
				caption: 'Thieves\' Town',
				is_beaten: false,
				is_beatable: function() {
					var doorcheck = window.doorCheck(6,false,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'hammer' : '','glove','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.TTBoss();
				},
				can_get_chest: function() {
					var doorcheck = window.doorCheck(6,false,false,false,['hammer','glove','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.TTChests();
				}
			}, { // [7]
				caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
				is_beaten: false,
				is_beatable: function() {
					var doorcheck = window.doorCheck(7,false,false,false,['freezor','hammer','glove','hookshot','somaria','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.IPBoss();
				},
				can_get_chest: function() {
					var doorcheck = window.doorCheck(7,false,false,false,['freezor','hammer','glove','hookshot','somaria','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.IPChests();
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachMire() || medallionCheck(0) === 'unavailable') return 'unavailable';
					var doorcheck = window.doorCheck(8,false,true,false,['hookshot','firesource','somaria','bomb'],'boss');
					if(doorcheck) {
						if(doorcheck === 'unavailable')
							return 'unavailable';
						if(medallionCheck(0) === 'possible' && doorcheck === 'available')
							return 'possible';
						if(medallionCheck(0) === 'possible' && doorcheck === 'darkavailable')
							return 'darkpossible';
						return doorcheck;
					};
					if (!items.bigkey8 || !items.somaria) return 'unavailable';
					return window.MMBoss(medallionCheck(0));
				},
				can_get_chest: function() {
					if (!canReachMire() || medallionCheck(0) === 'unavailable') return 'unavailable';
					var doorcheck = window.doorCheck(8,false,true,false,['hookshot','firesource','somaria','bomb'],'item');
					if(doorcheck) {
						if(doorcheck === 'unavailable')
							return 'unavailable';
						if(medallionCheck(0) === 'possible' && doorcheck === 'available')
							return 'possible';
						if(medallionCheck(0) === 'possible' && doorcheck === 'darkavailable')
							return 'darkpossible';
						return doorcheck;
					}
					return window.MMChests(medallionCheck(0));
				}
			}, { // [9]
				caption: 'Turtle Rock {medallion0}/{mirror}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachDDM()) return 'unavailable';
					if(flags.doorshuffle != 'N' || flags.doorshuffle != 'P') {
						if(medallionCheck(1) === 'unavailable' && (!items.mirror || ((!items.hookshot || !items.moonpearl) && items.glove < 2))) return 'unavailable';
						var doorcheck = window.doorCheck(9,items.flute === 0 && !items.lantern,true,false,['somaria','firerod',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'laserbridge' : '','bombdash'],'boss');
						if(doorcheck === 'unavailable')
							return 'unavailable';
						if((medallionCheck(1) === 'possible' || (!items.mirror && !items.bomb)) && doorcheck === 'available')
							return 'possible';
						if((medallionCheck(1) === 'possible' || (!items.mirror && !items.bomb)) && doorcheck === 'darkavailable')
							return 'darkpossible';
						return doorcheck;
					};
					//First, check for back door access through mirror, it has logic priority
					if (items.mirror && canReachEDM()) {
						return window.TRBackBoss();
					//If not, go through normal front door access
					} else {
						if (!items.bigkey9 || medallionCheck(1) === 'unavailable') return 'unavailable';
						var frontcheck = window.TRFrontBoss(medallionCheck(1));
						if (frontcheck === 'available') {
							//Only list as fully available if both front and back entrances are available
							if (items.glove === 2 && items.mirror) {
								return 'available';
							} else {
								return 'possible';
							}
						}
						return frontcheck;
					}
				},
				can_get_chest: function() {
					if (!canReachDDM()) return 'unavailable';
					if(flags.doorshuffle != 'N' && flags.doorshuffle != 'P') {
						if(medallionCheck(1) === 'unavailable' && (!items.mirror || ((!items.hookshot || !items.moonpearl) && items.glove < 2))) return 'unavailable';
						var doorcheck = window.doorCheck(9,items.flute === 0 && !items.lantern,true,false,['somaria','firerod','laserbridge','bombdash'],'item');
						if(doorcheck === 'unavailable')
							return 'unavailable';
							if((medallionCheck(1) === 'possible' || (!items.mirror && !items.bomb)) && doorcheck === 'available')
								return 'possible';
							if((medallionCheck(1) === 'possible' || (!items.mirror && !items.bomb)) && doorcheck === 'darkavailable')
								return 'darkpossible';
						return doorcheck;
					}
					//First, check for back door access through mirror, it has logic priority
					if (items.mirror && canReachEDM()) {
						return window.TRBackChests();
					//If not, go through normal front door access
					} else {
						if (medallionCheck(1) === 'unavailable' || !items.somaria) return 'unavailable';
						var frontcheck = medallionCheck(1);
						if (frontcheck === 'available') {
							//Only list as fully available if both front and back entrances are available
							if (items.glove === 2 && items.mirror) {
								return 'available';
							} else {
								return 'possible';
							}
						}
						return frontcheck;
						//return window.TRFrontChests(medallionCheck(1));//Note: This assumes the key layout allows for clearing it in this direction
					}
				}
			}, { // [10]
				caption: 'Ganon\'s Tower (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if ((crystalCheck() < flags.ganonvulncount && flags.goals != 'A') || ((crystalCheck() < flags.opentowercount || !items.agahnim2) && flags.goals != 'F') || !canReachLightWorld() || (flags.goals === 'A' && (!items.agahnim || !allDungeonCheck()))) return 'unavailable';
					if ((flags.swordmode != 'S' && items.sword < 2) || (flags.swordmode === 'S' && !items.hammer) || (!items.lantern && !items.firerod)) return 'unavailable';
					if (flags.goals === 'F' && (items.sword > 1 || (flags.swordmode === 'S' && items.hammer)) && (items.lantern || items.firerod)) return 'available';
					if(flags.doorshuffle != 'N' || flags.doorshuffle != 'P') {
						var doorcheck = window.doorCheck(10,false,false,false,['hammer','firerod','hookshot','boomerang','somaria',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'boss');
						if(doorcheck)
							return doorcheck;
					};
					if(flags.doorshuffle != 'N' || flags.doorshuffle != 'P') {
						var doorcheck = items.agahnim && items.mirror ? 'available' : window.doorCheck(11,false,false,true,['glove','killbomb','bombdash'],'connector');
						if(doorcheck === 'possible' || doorcheck === 'unavailable')
							return doorcheck;
						if(doorcheck === 'darkpossible')
						{
							doorcheck = window.doorCheck(10,false,false,false,['hammer','firerod','hookshot','boomerang','somaria',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'boss');
							if(doorcheck === 'darkavailable')
								return 'darkpossible';
							return doorcheck;
						}
						return window.doorCheck(10,false,false,false,['hammer','firerod','hookshot','boomerang','somaria',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'boss');
					}
					return window.GTBoss();			
				},
				can_get_chest: function() {
					if (!canReachLightWorldBunny()) return 'unavailable';
					if (flags.opentowercount == 8) return 'possible';
					if (crystalCheck() < 7 && crystalCheck() < flags.opentowercount) return 'unavailable';
					if(flags.doorshuffle != 'N' || flags.doorshuffle != 'P') {
						var doorcheck = items.agahnim && items.mirror ? 'available' : window.doorCheck(11,false,false,true,['glove','killbomb','bombdash'],'connector');
						if(doorcheck === 'possible' || doorcheck === 'unavailable')
							return doorcheck;
						if(doorcheck === 'darkpossible')
						{
							doorcheck = window.doorCheck(10,true,false,false,['hammer','firerod','hookshot','boomerang','somaria','boots','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'item');
							if(doorcheck === 'darkavailable')
								return 'darkpossible';
							return doorcheck;
						}
						return window.doorCheck(10,doorcheck.startsWith('dark'),false,false,['hammer','firerod','hookshot','boomerang','somaria','boots','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'item');
					}
					return window.GTChests();
				}
			}, { // [11]
				caption: 'Hyrule Castle',
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ? window.dungeons[11].can_get_chest() : 'opened';
				},
				can_get_chest: function() {
					if(!canReachLightWorldBunny())
						return 'unavailable';
					var doorcheck = window.doorCheck(11,false,false,true,['glove','killbomb','bombdash'],'item');
					if (doorcheck) return doorcheck;
					return window.HCChests();
				}
			}, { // [12]
				caption: 'Castle Tower',
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() {
					if(!canReachDDM())
						return 'unavailable';
					var doorcheck = window.doorCheck(12,!items.lantern && !activeFlute(),true,true,['kill','swordorswordless'],'item');
					if (doorcheck)
						return doorcheck;
					return window.CTChests();
				}
			}];

			window.agahnim = {
				caption: 'Agahnim',
				is_available: function() {
					if(!canReachDDM()) return 'unavailable';
					if(!items.bomb && !melee_bow() && !cane() && !items.firerod) return 'unavailable';
					if(flags.doorshuffle === 'B') {
						if(!melee_bow() && !cane() && !items.firerod) return 'unavailable';
						return (items.sword || (flags.swordmode === 'S' && (items.hammer || items.net)/* && agatowerweapon()*/)) && (items.smallkeyhalf1 >= 2 || flags.gametype === 'R') ? (items.lantern ? 'available' : 'darkavailable') : 'unavailable';
					};
					if(flags.doorshuffle === 'C') {
						if(!items.sword && !items.hammer && !items.net) return 'unavailable';
						return window.doorCheck(12,!items.lantern && !activeFlute(),true,true,[],'boss');
					};
					if (flags.doorshuffle === 'P' || (flags.doorshuffle === 'N' && (flags.wildkeys || flags.gametype === 'R') && flags.wildbigkeys && flags.wildcompasses && flags.wildmaps)) {
						return CTBoss();
					};
					if (flags.wildkeys) {
						return (items.sword || items.hammer || (items.net && (items.somaria || items.byrna || items.firerod || items.bow > 1))) && (items.sword || (flags.swordmode === 'S' && (items.hammer || items.net))) && (activeFlute() || items.glove) && (items.smallkeyhalf1 >= 2 || flags.gametype == 'R') ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
					} else {
						return (items.sword || items.hammer || (items.net && (items.somaria || items.byrna || items.firerod || items.bow > 1))) && (items.sword || (flags.swordmode === 'S' && (items.hammer || items.net))) && (activeFlute() || items.glove) ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
					};
				}
			};

			window.chests = [{ // [0]
				caption: 'King\'s Tomb {boots} + {glove2}',
				is_opened: false,
				is_available: function() {
					return items.boots && items.glove === 2 && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [1]
				caption: 'Light World Swamp (2)',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [2]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: false,
				is_available: always
			}, { // [3]
				caption: 'Spiral Cave',
				is_opened: false,
				is_available: function() {
					return canReachDDM() && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
						(items.moonpearl ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'unavailable') :
						'unavailable';
				}
			}, { // [4]
				caption: 'Mimic Cave',
				is_opened: false,
				is_available: function() {
					return items.hammer && items.moonpearl && canReachDDM() && (items.hookshot || items.glove === 2) ?
						(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
						'unavailable';
				}
			}, { // [5]
				caption: 'Tavern',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [6]
				caption: 'Chicken House {bomb}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [7]
				caption: 'Bombable Hut {bomb}',
				is_opened: false,
				is_available: function() {
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [8]
				caption: 'C House',
				is_opened: false,
				is_available: always
			}, { // [9]
				caption: 'Aginah\'s Cave {bomb}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [10]
				caption: 'Mire Shed (2)',
				is_opened: false,
				is_available: function() {
					return canReachMire() ? 'available' : 'unavailable';
				}
			}, { // [11]
				caption: 'Super Bunny Chests (2)',
				is_opened: false,
				is_available: function() {
					return canReachDDM() ?
						(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
						'unavailable';
				}
			}, { // [12]
				caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.moonpearl && (items.bomb || items.boots) ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [13]
				caption: 'Byrna Spike Cave',
				is_opened: false,
				is_available: function() {
					return items.glove && items.hammer && (items.byrna || (items.cape && (items.bottle || items.magic))) ?
						items.lantern || activeFlute() ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [14]
				caption: 'Kakariko Well (4 + {bomb})',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.moonpearl ? (items.bomb ? 'available' : 'partialavailable') : 'possible') : 'unavailable';
				}
			}, { // [15]
				caption: 'Thieve\'s Hut (4 + {bomb})',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.moonpearl ? (items.bomb ? 'available' : 'partialavailable') : (items.mirror ? 'possible' : 'unavailable')) : 'unavailable';
				}
			}, { // [16]
				caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
				is_opened: false,
				is_available: function() {
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [17]
				caption: 'Paradox Cave (5 + 2 {bomb})',
				is_opened: false,
				is_available: function() {
					return canReachDDM() && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
						(items.moonpearl && (items.bomb || items.bow || items.boomerang || items.firerod || items.icerod || items.somaria) ?
						(items.lantern || activeFlute() ? (items.bomb ? 'available' : 'partialavailable') : 'darkavailable') :
						(items.sword >= 2 ? 'possible' : 'unavailable')) : 'unavailable';
				}
			}, { // [18]
				caption: 'West of Sanctuary {boots}',
				is_opened: false,
				is_available: function() {
					return items.boots && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [19]
				caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [20]
				caption: 'Ice Rod Cave {bomb}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [21]
				caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
				is_opened: false,
				is_available: function() {
					if (!canReachDDM()) return 'unavailable';
					return (items.boots || items.hookshot) && (items.glove || (items.mirror && items.moonpearl && items.hookshot)) ?
						(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
						'unavailable';
				}
			}, { // [22]
				caption: 'Hookshot Cave (3 top chests) {hookshot}',
				is_opened: false,
				is_available: function() {
					if (!canReachDDM()) return 'unavailable';
					return items.hookshot && (items.glove || (items.mirror && items.moonpearl )) ?
						(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
						'unavailable';
				}
			}, { // [23]
				caption: 'Lost Woods Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [24]
				caption: 'Death Mountain Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDM() && items.moonpearl ?
					(items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'unavailable';
				}
			}, { // [25]
				caption: 'Mountain Entry Pull Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [26]
				caption: 'Mountain Entry Southeast Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [27]
				caption: 'Lost Woods Pass West Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [28]
				caption: 'Kakariko Portal Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [29]
				caption: 'Fortune Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [30]
				caption: 'Kakariko Pond Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && items.moonpearl ? 'available' : 'unavailable';
				}
			}, { // [31]
				caption: 'Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && items.moonpearl ? 'available' : 'unavailable';
				}
			}, { // [32]
				caption: 'Sanctuary Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [33]
				caption: 'River Bend West Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && items.moonpearl ? 'available' : 'unavailable';
				}
			}, { // [34]
				caption: 'River Bend East Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [35]
				caption: 'Blinds Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [36]
				caption: 'Kakariko Welcome Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [37]
				caption: 'Forgotten Forest Southwest Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [38]
				caption: 'Forgotten Forest Central Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [39]
				caption: 'Hyrule Castle Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [40]
				caption: 'Wooden Bridge Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [41]
				caption: 'Eastern Palace Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && items.moonpearl ? 'available' : 'unavailable';
				}
			}, { // [42]
				caption: 'Flute Boy South Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && items.moonpearl ? 'available' : 'unavailable';
				}
			}, { // [43]
				caption: 'Flute Boy East Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && items.moonpearl ? 'available' : 'unavailable';
				}
			}, { // [44]
				caption: 'Central Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld()? 'available' : 'unavailable';
				}
			}, { // [45]
				caption: 'Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && items.moonpearl ? 'available' : 'unavailable';
				}
			}, { // [46]
				caption: 'Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && items.moonpearl ? 'available' : 'unavailable';
				}
			}, { // [47]
				caption: 'Flute Boy Approach South Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [48]
				caption: 'Flute Boy Approach North Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [49]
				caption: 'Dark Lumberjack Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [50]
				caption: 'Dark Fortune Bonk Rocks (2)',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [51]
				caption: 'Dark Graveyard West Bonk Rock',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [52]
				caption: 'Dark Graveyard North Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [53]
				caption: 'Dark Graveyard Tomb Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [54]
				caption: 'Qirn Jump West Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [55]
				caption: 'Qirn Jump East Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && (activeFlute() || items.hammer || items.flippers || (items.agahnim && items.mirror && (items.moonpearl || items.glove))) ? 'available' : 'unavailable';
				}
			}, { // [56]
				caption: 'Dark Witch Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && (activeFlute() || items.hammer || items.flippers || (items.agahnim && items.mirror && (items.moonpearl || items.glove))) ? 'available' : 'unavailable';
				}
			}, { // [57]
				caption: 'Pyramid Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && (activeFlute() || items.hammer || items.flippers || (items.agahnim && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [58]
				caption: 'Palace of Darkness Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && (activeFlute() || items.hammer || items.flippers || (items.agahnim && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [59]
				caption: 'Dark Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && (activeFlute() || items.hammer || items.flippers || (items.agahnim && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [60]
				caption: 'Dark Tree Line Tree 3',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && (activeFlute() || items.hammer || items.flippers || (items.agahnim && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [61]
				caption: 'Dark Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && (activeFlute() || items.hammer || items.flippers || (items.agahnim && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [62]
				caption: 'Hype Cave Statue',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [63]
				caption: 'Cold Fairy Statue',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [64]
				caption: 'Treasure Chest Minigame: Pay 30 rupees',
				is_opened: false,
				is_available: always
			}, { // [65]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [66]
				caption: 'Sahasrahla {pendant0}',
				is_opened: false,
				is_available: function() {
					if(canReachLightWorldBunny())
						for(var k = 0; k < 10; k++)
							if(prizes[k] === 1 && items['boss'+k])
								return 'available';
					return 'unavailable';
				}
			}, { // [67]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: always
			}, { // [68]
				caption: 'Muffins Kid: Distract him with {bottle} because he can\'t lay off the sauce!',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() && items.bottle ? 'available' : 'unavailable';
				}
			}, { // [69]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return (items.mirror || (items.glove === 2 && activeFlute()) || (items.glove === 2 && (items.moonpearl || items.agahnim))) && canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [70]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() ? (items.flippers ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [71]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && items.hammer && items.book && (activeFlute() || items.glove) && (items.hookshot || items.glove === 2) ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer) ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'information') :
						'unavailable';
				}
			}, { // [72]
				caption: 'Bombos Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() && items.book ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information' :
						'unavailable';
				}
			}, { // [73]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					if(canReachEDW() && items.glove) return 'available';
					if(canReachLightWorld() && items.mirror && (items.flippers || items.glove)) return 'available';
					return 'unavailable';
				}
			}, { // [74]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() ? (items.flippers || items.glove ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [75]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					return canReachDDM() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [76]
				caption: 'Witch: Give her {mushroom}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() && items.mushroom ? 'available' : 'unavailable';
				}
			}, { // [77]
				caption: 'Forest Hideout',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'information') : 'unavailable';
				}
			}, { // [78]
				caption: 'Lumberjack Tree {agahnim}{boots}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.agahnim && items.boots && items.moonpearl ? 'available' : 'information') : 'unavailable';
				}
			}, { // [79]
				caption: 'Spectacle Rock Cave',
				is_opened: false,
				is_available: function() {
					return canReachDDM() ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'unavailable';
				}
			}, { // [80]
				caption: 'South of Grove',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'information') : 'unavailable';
				}
			}, { // [81]
				caption: 'Graveyard Cliff Cave {bomb}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [82]
				caption: 'Checkerboard Cave',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() && items.glove ? 'available' : 'unavailable';
				}
			}, { // [83]
				caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
				is_opened: false,
				is_available: function() {
					return items.hammer && (items.glove === 2 || (items.mirror && canReachLightWorldBunny())) ? 'available' : 'unavailable';
				}
			}, { // [84]
				caption: 'Library {boots}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.boots ? (items.moonpearl ? 'available' : 'information') : 'information') : 'unavailable';
				}
			}, { // [85]
				caption: 'Mushroom',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'information') : 'unavailable';
				}
			}, { // [86]
				caption: 'Spectacle Rock',
				is_opened: false,
				is_available: function() {
					if (canReachHera()) return items.lantern || activeFlute() ? 'available' : 'darkavailable';
					if (canReachDDM()) return 'information';
					return 'unavailable';
				}
			}, { // [87]
				caption: 'Floating Island',
				is_opened: false,
				is_available: function() {
					if (canReachEDM()) return items.lantern || activeFlute() ? 'available' : 'darkavailable';
					return 'unavailable';
				}
			}, { // [88]
				caption: 'Race Minigame {bomb}/{boots}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() && (items.bomb || items.boots) ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
				}
			}, { // [89]
				caption: 'Desert West Ledge {book}',
				is_opened: false,
				is_available: function() {
					if (!canReachLightWorldBunny()) return 'unavailable';
					var doorcheck = window.doorCheck(1,false,false,false,['glove',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','firesource','killbomb'],'connector');
					if (doorcheck) return doorcheck === 'available' && !items.moonpearl ? 'possible' : doorcheck;
					if (canReachDP()) return 'available';
					return 'information';
				}
			}, { // [90]
				caption: 'Lake Hylia Island {flippers}',
				is_opened: false,
				is_available: function() {
					if(!canReachLightWorldBunny())
						return 'unavailable';
					return items.moonpearl ? (items.flippers ? 'available' : 'information') : 'information';
				}
			}, { // [91]
				caption: 'Bumper Cave {cape}{mirror}',
				is_opened: false,
				is_available: function() {
					return items.glove && items.cape && items.mirror && canReachLightWorld() ? 'available' : 'information';
				}
			}, { // [92]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					if (canReachEDW()) return 'available';
					return 'unavailable';
				}
			}, { // [93]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: always
			}, { // [94]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					if (!canReachLightWorld()) return 'unavailable';
					if (items.flippers) return 'available';
					return 'information';
				}
			}, { // [95]
				caption: 'Buried Item {shovel}',
				is_opened: false,
				is_available: function() {
					return items.shovel && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [96]
				caption: 'Escape Sewer Side Room (3) {bomb}/{boots} (may need small key)',
				is_opened: false,
				is_available: function() {
					if (!canReachLightWorld() || (!items.bomb && !items.boots)) return 'unavailable';
					var doorcheck = window.doorCheck(11,false,false,true,['glove','killbomb','bombdash'],'item');
					if (doorcheck) return doorcheck;
					if (items.glove) return 'available';
					if (flags.wildkeys) {
						if (items.bomb || melee_bow() || items.firerod || cane()) {
							if (items.smallkeyhalf0 >= 1 || flags.gametype == 'R') return canDoTorchDarkRooms() ? 'available' : 'darkavailable';
						}
						return 'unavailable';
					}
					return items.glove ? 'available' : (items.bomb || melee_bow() || rod() || cane() ? (canDoTorchDarkRooms() ? 'possible' : 'darkpossible') : 'unavailable');
				}
			}, { // [97]
				caption: "Castle Secret Entrance (Uncle + 1)",
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [98]
				caption: 'Hyrule Castle Dungeon (3)',
				is_opened: false,
				is_available: function() {
					if (!canReachLightWorld()) return 'unavailable';
					var doorcheck = window.doorCheck(11,false,false,true,['glove','killbomb','bombdash'],'item');
					if (doorcheck) return doorcheck;
					return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [99]
				caption: 'Sanctuary',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [100]
				caption: 'Mad Batter {hammer} + {powder}',
				is_opened: false,
				is_available: function() {
					return items.powder && items.hammer && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [101]
				caption: 'Take the frog home',
				is_opened: false,
				is_available: function() {
					return (items.mirror || (items.glove === 2 && activeFlute()) || (items.glove === 2 && (items.moonpearl || items.agahnim))) && canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [102]
				caption: 'Fairy: Buy OJ bomb from Light Link\'s House after {crystal}5 {crystal}6 (2 items)',
				is_opened: false,
				is_available: function() {
					var crystal_count = 0;
					for (var k = 0; k < 10; k++) {
						if (prizes[k] === 4 && items['boss'+k]) {
							crystal_count += 1;
						};
					};
					return crystal_count >= 2 && items.mirror && canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [103]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					if (!canReachLightWorldBunny()) return 'unavailable';
					var pendant_count = 0;
					for (var k = 0; k < 10; k++)
						if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k])
							if(++pendant_count === 3)
								return 'available';
					return items.book ? 'information' : 'unavailable';
				}
			}, { // [104]
				caption: 'Escape Sewer Dark Room {lantern}',
				is_opened: false,
				is_available: function() {
					if (!canReachLightWorldBunny()) return 'unavailable';
					var doorcheck = window.doorCheck(11,false,false,true,['glove','killbomb','bombdash'],'item');
					if (doorcheck) return items.moonpearl ? doorcheck : 'unavailable';
					return canReachLightWorldBunny() && items.moonpearl ? (canDoTorchDarkRooms() ? 'available' : 'darkavailable') : 'unavailable';
				}
			}, { // [105]
				caption: 'Waterfall of Wishing (2) {flippers}',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() ? (items.flippers ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [106]
				caption: 'Castle Tower',
				is_opened: false,
				is_available: function() {
					if (!canReachDDM()) return 'unavailable';
					if (flags.doorshuffle === 'B') return window.doorCheck(12,!items.lantern && !activeFlute(),true,true,['kill','swordorswordless'],'item');
					if (flags.doorshuffle === 'C') return window.doorCheck(12,!items.lantern && !activeFlute(),true,true,['kill'],'item');
					if (!items.bomb && !melee_bow() && !cane() && !items.firerod) return 'unavailable';
					return (activeFlute() || items.glove) ? (items.lantern || activeFlute()) ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [107]
				caption: 'Castle Tower (small key)',
				is_opened: false,
				is_available: function() {
					if (!canReachDDM()) return 'unavailable';
					if (flags.doorshuffle === 'B') return window.doorCheck(12,!items.lantern && !activeFlute(),true,true,['kill','swordorswordless'],'item');
					if (flags.doorshuffle === 'C') return window.doorCheck(12,!items.lantern && !activeFlute(),true,true,['kill'],'item');
					if (!items.bomb && !melee_bow() && !cane() && !items.firerod) return 'unavailable';
					if (flags.gametype === 'R') {
						return items.lantern ? 'available' : 'darkavailable';
					} else {
						return items.smallkeyhalf1 > 0 ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
					};
				}
			}, { // [108]
				caption: 'Lake Hylia Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [109]
				caption: 'Kakariko Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [110]
				caption: 'Paradox Shop (3) {bomb}',
				is_opened: false,
				is_available: function() {
					return canReachEDM() && items.moonpearl ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [111]
				caption: 'Dark Lake Hylia Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [112]
				caption: 'Village of Outcasts Shop (3) {hammer}',
				is_opened: false,
				is_available: function() {
					return items.hammer || (items.mirror && canReachLightWorld()) ? 'available' : 'unavailable';
				}
			}, { // [113]
				caption: 'Dark Death Mountain Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachDDM() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [114]
				caption: 'Dark Potion Shop (3)',
				is_opened: false,
				is_available: function() {
					if (items.flippers || items.hammer) return 'available';
					if (canReachEDW() && items.glove) return 'available';
					if (canReachLightWorld() && items.mirror) return 'available';
					return 'unavailable';
				}
			}, { // [115]
				caption: 'Dark Lumberjack Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [116]
				caption: 'Curiosity Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [117]
				caption: 'Potion Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [118]
				caption: 'Pond of Happiness (2)',
				is_opened: false,
				is_available: function() {
					return items.flippers && (canReachLightWorld() || items.glove === 2) ? 'available' : 'unavailable';
				}
			}, { // [119]
				caption: 'Bomb Shop (2)',
				is_opened: false,
				is_available: function() {
					return canReachLightWorldBunny() ? 'available' : 'unavailable';
				}

			}];

		} else {
			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() {
					return window.EPBoss();
				},
				can_get_chest: function() {
					return window.EPChests();
					
				}
			}, { // [1]
				caption: 'Desert Palace {book} / {glove2} {mirror} {flute}',
				is_beaten: false,
				is_beatable: function() {
					return window.DPBoss();
				},
				can_get_chest: function() {
					return window.DPChests();
				}
			}, { // [2]
				caption: 'Tower of Hera {mirror} / {hookshot} {hammer}',
				is_beaten: false,
				is_beatable: function() {
					return window.HeraBoss();
				},
				can_get_chest: function() {
					return window.HeraChests();
				}
			}, { // [3]
				caption: 'Palace of Darkness',
				is_beaten: false,
				is_beatable: function() {
					return window.PoDBoss();
				},
				can_get_chest: function() {
					return window.PoDChests();
				}
			}, { // [4]
				caption: 'Swamp Palace {mirror} {flippers}',
				is_beaten: false,
				is_beatable: function() {
					return window.SPBoss();
				},
				can_get_chest: function() {
					return window.SPChests();
				}
			}, { // [5]
				caption: 'Skull Woods',
				is_beaten: false,
				is_beatable: function() {
					return window.SWBoss();
				},
				can_get_chest: function() {
					return window.SWChests();
				}
			}, { // [6]
				caption: 'Thieves\' Town',
				is_beaten: false,
				is_beatable: function() {
					return window.TTBoss();
				},
				can_get_chest: function() {
					return window.TTChests();
				}
			}, { // [7]
				caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
				is_beaten: false,
				is_beatable: function() {
					return window.IPBoss();
				},
				can_get_chest: function() {
					return window.IPChests();
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}]',
				is_beaten: false,
				is_beatable: function() {
					return window.MMBoss(medallionCheck(0));
				},
				can_get_chest: function() {
					return window.MMChests(medallionCheck(0));
				}
			}, { // [9]
				caption: 'Turtle Rock {medallion0} {hammer} {somaria}',
				is_beaten: false,
				is_beatable: function() {
					return window.TRBoss(medallionCheck(1));
				},
				can_get_chest: function() {
					return window.TRChests(medallionCheck(1));
				}
			}, { // [10]
				caption: 'Ganon\'s Tower (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					return window.GTBoss();
				},
				can_get_chest: function() {
					return window.GTChests();
				}
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ? window.dungeons[11].can_get_chest() : 'opened';
				},
				can_get_chest: function() {
					return window.HCChests();
				}
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.CTBoss();
				},
				can_get_chest: function() {
					return window.CTChests();
				}
			}];

			window.agahnim = {
				caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
				is_available: function() {
					if (items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape && !items.agahnim) return 'unavailable';
					if (!items.sword && !items.hammer && !items.net) return 'unavailable';
					if (!items.bomb && !melee_bow() && !cane() && !items.firerod) return 'unavailable';
					if (flags.doorshuffle === 'B') {
						if(!melee_bow() && !cane() && !items.firerod)
							return 'unavailable';
						if(items.mirror && (items.agahnim || (items.glove && items.hammer && items.moonpearl) || (items.glove === 2 && items.moonpearl && items.flippers)))
							return (items.sword || (flags.swordmode === 'S' && (items.hammer || items.net)/* && agatowerweapon()*/)) && (items.smallkeyhalf1 >= 2 || flags.gametype === 'R') ? (items.lantern ? 'available' : 'darkavailable') : 'unavailable';
						return (items.sword || (flags.swordmode === 'S' && (items.hammer || items.net)/* && agatowerweapon()*/)) && (items.smallkeyhalf1 >= 2 || flags.gametype === 'R') ? (items.lantern ? 'possible' : 'darkpossible') : 'unavailable';
					};

					if (flags.doorshuffle === 'C') {
						if(items.mirror && (items.agahnim || (items.glove && items.hammer && items.moonpearl) || (items.glove === 2 && items.moonpearl && items.flippers)))
							return window.doorCheck(12,false,true,true,[],'boss');
						return 'possible';
					};

					if (flags.doorshuffle === 'P' || (flags.doorshuffle === 'N' && (flags.wildkeys || flags.gametype === 'R') && flags.wildbigkeys && flags.wildcompasses && flags.wildmaps)) {
						return CTBoss();
					};

					if (flags.wildkeys) {
						return (items.sword >= 2 || (items.cape && items.sword) || (flags.swordmode === 'S' && (items.hammer || (items.cape && items.net)))) && (items.smallkeyhalf1 >= 2 || flags.gametype == 'R') && agatowerweapon() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
					} else {
						return ((items.sword >= 2 || (items.cape && items.sword) || (flags.swordmode === 'S' && (items.hammer || (items.cape && items.net)))) && agatowerweapon()) ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
					};
				}
			};

			//define overworld chests
			window.chests = [{ // [0]
				caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
				is_opened: false,
				is_available: function() {
					if (!items.boots) return 'unavailable';
					if ((canReachWDW() && items.mirror) || items.glove === 2) return 'available';
					return 'unavailable';
				}
			}, { // [1]
				caption: 'Light World Swamp (2)',
				is_opened: false,
				is_available: always
			}, { // [2]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: false,
				is_available: always
			}, { // [3]
				caption: 'Spiral Cave',
				is_opened: false,
				is_available: function() {
					return canReachEDM() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [4]
				caption: 'Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion0} unkown OR possible w/out {firerod})',
				is_opened: false,
				is_available: function() {
					if (!items.moonpearl || !items.hammer || items.glove !== 2 || (!items.somaria && flags.doorshuffle === 'N') || !items.mirror || (!items.bomb && flags.doorshuffle === 'N') || (flags.wildkeys && flags.doorshuffle === 'N' && items.smallkey9 <= 1 && flags.gametype != 'R')) return 'unavailable';
					var medallion = medallionCheck(1);	

					if (flags.doorshuffle === 'P') {
						if (medallion === 'unavailable') return 'unavailable';
						if (items.smallkey9 < 3 || !items.bomb) return 'unavailable';
						if (items.somaria) {
							if (medallion === 'possible') return 'possible';
							return (items.lantern || items.flute >= 1 ? 'available' : 'darkavailable');
						};
						if (items.boots) return 'possible';
						return 'unavailable';
					};

					if (medallion) return medallion === 'possible' && items.flute === 0 && !items.lantern ? 'darkpossible' : medallion;

					var doorcheck = window.doorCheck(9,items.flute === 0 && !items.lantern,true,false,['somaria','firerod',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'laserbridge' : '','bomb'],'connector');
					if (doorcheck) return doorcheck;

					if (flags.wildkeys) {
						return (items.smallkey9 <= 1 && flags.gametype != 'R') ? 'unavailable' : (items.lantern || items.flute >= 1 ? 'available' : 'darkavailable');
					};

					return items.firerod ? (items.lantern || items.flute >= 1 ? 'available' : 'darkavailable') : (items.lantern || items.flute >= 1 ? 'possible' : 'darkpossible');
				}
			}, { // [5]
				caption: 'Tavern',
				is_opened: false,
				is_available: always
			}, { // [6]
				caption: 'Chicken House {bomb}',
				is_opened: false,
				is_available: function() {
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [7]
				caption: 'Bombable Hut {bomb}',
				is_opened: false,
				is_available: function() {
					return canReachWDW() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [8]
				caption: 'C House',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [9]
				caption: 'Aginah\'s Cave {bomb}',
				is_opened: false,
				is_available: function() {
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [10]
				caption: 'Mire Shed (2)',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canReachMire() ? 'available' : 'unavailable';
				}
			}, { // [11]
				caption: 'Super Bunny Chests (2)',
				is_opened: false,
				is_available: function() {
					return canReachDDM() ? items.lantern ? 'available' : 'darkavailable' :'unavailable';
				}
			}, { // [12]
				caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
				is_opened: false,
				is_available: function() {
					return items.bomb || items.boots ? 'available' : 'unavailable';
				}
			}, { // [13]
				caption: 'Byrna Spike Cave',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && items.glove && items.hammer && (items.byrna || (items.cape && (items.bottle || items.magic))) ?
						items.lantern || items.flute >= 1 ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [14]
				caption: 'Kakariko Well (4 + {bomb})',
				is_opened: false,
				is_available: function() {
					return items.bomb ? 'available' : 'partialavailable';
				}
			}, { // [15]
				caption: 'Thieve\'s Hut (4 + {bomb})',
				is_opened: false,
				is_available: function() {
					return items.bomb ? 'available' : 'partialavailable';
				}
			}, { // [16]
				caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
				is_opened: false,
				is_available: function() {
					return items.bomb && canReachSDW() ? 'available' : 'unavailable';
				}
			}, { // [17]
				caption: 'Paradox Cave (5 + 2 {bomb})',
				is_opened: false,
				is_available: function() {
					return canReachEDM() &&
					(items.bomb || items.bow || items.boomerang || items.firerod || items.icerod || items.somaria) ?
					(items.lantern || items.flute >= 1 ? (items.bomb ? 'available' : 'partialavailable') : 'darkavailable') : 'unavailable';
				}
			}, { // [18]
				caption: 'West of Sanctuary {boots}',
				is_opened: false,
				is_available: function() {
					return items.boots ? 'available' : 'unavailable';
				}
			}, { // [19]
				caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
				is_opened: false,
				is_available: function() {
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [20]
				caption: 'Ice Rod Cave {bomb}',
				is_opened: false,
				is_available: function() {
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [21]
				caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
				is_opened: false,
				is_available: function() {
					return (item.boots || items.hookshot) && canReachDDM() ?
						items.lantern || items.flute >= 1 ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [22]
				caption: 'Hookshot Cave (3 top chests) {hookshot}',
				is_opened: false,
				is_available: function() {
					return items.hookshot && canReachDDM() ?
						items.lantern || items.flute >= 1 ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [23]
				caption: 'Lost Woods Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [24]
				caption: 'Death Mountain Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDM() ?
					(items.lantern || items.flute >= 1 ? 'available' : 'darkavailable') : 'unavailable';
				}
			}, { // [25]
				caption: 'Mountain Entry Pull Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [26]
				caption: 'Mountain Entry Southeast Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [27]
				caption: 'Lost Woods Pass West Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [28]
				caption: 'Kakariko Portal Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [29]
				caption: 'Fortune Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [30]
				caption: 'Kakariko Pond Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && (canGetBonkableItem()) ? 'available' : 'unavailable';
				}
			}, { // [31]
				caption: 'Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && (canGetBonkableItem()) ? 'available' : 'unavailable';
				}
			}, { // [32]
				caption: 'Sanctuary Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [33]
				caption: 'River Bend West Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && (canGetBonkableItem()) ? 'available' : 'unavailable';
				}
			}, { // [34]
				caption: 'River Bend East Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [35]
				caption: 'Blinds Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [36]
				caption: 'Kakariko Welcome Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [37]
				caption: 'Forgotten Forest Southwest Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [38]
				caption: 'Forgotten Forest Central Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [39]
				caption: 'Hyrule Castle Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [40]
				caption: 'Wooden Bridge Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [41]
				caption: 'Eastern Palace Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [42]
				caption: 'Flute Boy South Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [43]
				caption: 'Flute Boy East Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [44]
				caption: 'Central Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [45]
				caption: 'Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [46]
				caption: 'Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [47]
				caption: 'Flute Boy Approach South Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [48]
				caption: 'Flute Boy Approach North Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [49]
				caption: 'Dark Lumberjack Tree',
				is_opened: false,
				is_available: function() {
					return (canGetBonkableItem()) && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [50]
				caption: 'Dark Fortune Bonk Rocks (2)',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [51]
				caption: 'Dark Graveyard West Bonk Rock',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [52]
				caption: 'Dark Graveyard North Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [53]
				caption: 'Dark Graveyard Tomb Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [54]
				caption: 'Qirn Jump West Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [55]
				caption: 'Qirn Jump East Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDW() && (items.flippers || items.glove || items.hammer) ? 'available' : 'unavailable';
				}
			}, { // [56]
				caption: 'Dark Witch Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDW() && (items.flippers || items.glove || items.hammer) ? 'available' : 'unavailable';
				}
			}, { // [57]
				caption: 'Pyramid Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [58]
				caption: 'Palace of Darkness Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [59]
				caption: 'Dark Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [60]
				caption: 'Dark Tree Line Tree 3',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [61]
				caption: 'Dark Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [62]
				caption: 'Hype Cave Statue',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [63]
				caption: 'Cold Fairy Statue',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [64]
				caption: 'Treasure Chest Minigame: Pay 30 rupees',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [65]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: always
			}, { // [66]
				caption: 'Sahasrahla {pendant0}',
				is_opened: false,
				is_available: function() {
					for (var k = 0; k < 10; k++) {
						if (prizes[k] === 1 && items['boss'+k])
							return 'available';
					}
					return 'unavailable';
				}
			}, { // [67]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: function() {
					return canReachSDW() ? 'available' : 'unavailable';
				}
			}, { // [68]
				caption: 'Muffins Kid: Distract him with {bottle} because he can\'t lay off the sauce!',
				is_opened: false,
				is_available: function() {
					return items.bottle ? 'available' : 'unavailable';
				}
			}, { // [69]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
				}
			}, { // [70]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return items.flippers ? 'available' : 'unavailable';
				}
			}, { // [71]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					if (!canReachHera() || !items.book) return 'unavailable';
					if (items.sword > 1 || (flags.swordmode === 'S' && items.hammer)) return (items.lantern || items.flute >= 1) ? 'available' : 'darkavailable';
					return 'information';
				}
			}, { // [72]
				caption: 'Bombos Tablet {mirror}{sword2}{book}',
				is_opened: false,
				is_available: function() {
					if (!canReachSDW() || !items.book || !items.mirror) return 'unavailable';
					if (items.sword > 1 || (flags.swordmode === 'S' && items.hammer)) return 'available';
					return 'information';
				}
			}, { // [73]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					return canReachEDW() && items.glove ?
						'available' : 'unavailable';
				}
			}, { // [74]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return items.flippers || items.glove ? 'available' : 'unavailable';
				}
			}, { // [75]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					return items.glove || items.flute >= 1 ?
						items.lantern ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [76]
				caption: 'Witch: Give her {mushroom}',
				is_opened: false,
				is_available: function() {
					return items.mushroom ? 'available' : 'unavailable';
				}
			}, { // [77]
				caption: 'Forest Hideout',
				is_opened: false,
				is_available: always
			}, { // [78]
				caption: 'Lumberjack Tree {agahnim}{boots}',
				is_opened: false,
				is_available: function() {
					return items.agahnim && items.boots ? 'available' : 'information';
				}
			}, { // [79]
				caption: 'Spectacle Rock Cave',
				is_opened: false,
				is_available: function() {
					return items.glove || items.flute >= 1 ?
						items.lantern || items.flute >= 1 ? 'available' : 'darkavailable' :
						'unavailable';
				}
			}, { // [80]
				caption: 'South of Grove {mirror}',
				is_opened: false,
				is_available: function() {
					return items.mirror && canReachSDW() ? 'available' : 'unavailable';
				}
			}, { // [81]
				caption: 'Graveyard Cliff Cave {mirror} {bomb}',
				is_opened: false,
				is_available: function() {
					return canReachWDW() && items.mirror && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [82]
				caption: 'Checkerboard Cave {mirror}',
				is_opened: false,
				is_available: function() {
					return canReachMire() && items.mirror ? 'available' : 'unavailable';
				}
			}, { // [83]
				caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
				}
			}, { // [84]
				caption: 'Library {boots}',
				is_opened: false,
				is_available: function() {
					return items.boots ? 'available' : 'information';
				}
			}, { // [85]
				caption: 'Mushroom',
				is_opened: false,
				is_available: always
			}, { // [86]
				caption: 'Spectacle Rock {mirror}',
				is_opened: false,
				is_available: function() {
					return items.glove || items.flute >= 1 ?
						items.mirror ?
							items.lantern || items.flute >= 1 ? 'available' : 'darkavailable' :
							'information' :
						'unavailable';
				}
			}, { // [87]
				caption: 'Floating Island {bomb} {mirror}',
				is_opened: false,
				is_available: function() {
					return canReachEDM() ? canReachDDM() && items.bomb && items.mirror ?
							items.lantern || items.flute >= 1 ? 'available' : 'darkavailable' :
							'information' :
						'unavailable';
				}
			}, { // [88]
				caption: 'Race Minigame {bomb}/{boots}',
				is_opened: false,
				is_available: function() {
					return items.bomb || items.boots || (items.mirror && canReachSDW()) ? 'available' : 'information';
				}
			}, { // [89]
				caption: 'Desert West Ledge {book}/{mirror}',
				is_opened: false,
				is_available: function() {
					if (!canReachDP()) return 'information';
					if (flags.doorshuffle != 'N' && flags.doorshuffle != 'P') {
						return !items.book ? 'possible' : 'available';
					};
					return 'available';
				}
			}, { // [90]
				caption: 'Lake Hylia Island {mirror}',
				is_opened: false,
				is_available: function() {
					return items.flippers && canReachEDW() && items.mirror ? 'available' : 'information';
				}
			}, { // [91]
				caption: 'Bumper Cave {cape}',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ?
						items.glove && items.cape ? 'available' : 'information' :
						'unavailable';
				}
			}, { // [92]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					return items.agahnim || canReachEDW() ? 'available' : 'unavailable';
				}
			}, { // [93]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: function() {
					return canReachSDW() ? 'available' : 'unavailable';
				}
			}, { // [94]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					if (items.flippers) return 'available';
					if (items.glove) return 'information';
					return 'unavailable';
				}
			}, { // [95]
				caption: 'Buried Itam {shovel}',
				is_opened: false,
				is_available: function() {
					return items.shovel ? 'available' : 'unavailable';
				}
			}, { // [96]
				caption: 'Escape Sewer Side Room (3) {bomb}/{boots}' + (flags.gametype === 'S' ? '' : ' (may need small key)'),
				is_opened: false,
				is_available: function() {
					var doorcheck = window.doorCheck(11,false,false,flags.gametype != 'S',['glove','killbomb','bombdash'],'item');
					if (doorcheck) return doorcheck;
					if (!items.bomb && !items.boots) return 'unavailable';
					if (flags.gametype === 'S') return 'available';
					if (flags.wildkeys || flags.gametype == 'R') {
						if (items.glove) return 'available';
						if (items.bomb || melee_bow() || items.firerod || cane()) {
							if (items.smallkeyhalf0 >= 1 || flags.gametype == 'R') return canDoTorchDarkRooms() ? 'available' : 'darkavailable';
						}
						return 'unavailable';
					}
					
					return items.glove ? 'available' : (items.bomb || melee_bow() || rod() || cane() ? (canDoTorchDarkRooms() ? 'possible' : 'darkpossible') : 'unavailable');
				}
			}, { // [97]
				caption: "Castle Secret Entrance (Uncle + 1)",
				is_opened: false,
				is_available: always
			}, { // [98]
				caption: 'Hyrule Castle Dungeon (3)',
				is_opened: false,
				is_available: function() {
					var doorcheck = window.doorCheck(11,false,false,flags.gametype != 'S',['glove','killbomb','bombdash'],'item');
					if (doorcheck) return doorcheck;
					return items.bomb || melee_bow() || items.firerod || cane() ? 'available' : 'partialavailable';
				}
			}, { // [99]
				caption: 'Sanctuary',
				is_opened: false,
				is_available: always
			}, { // [100]
				caption: 'Mad Batter {hammer}/{mirror} + {powder}',
				is_opened: false,
				is_available: function() {
					return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [101]
				caption: 'Take the frog home {mirror} / Save+Quit',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
				}
			}, { // [102]
				caption: 'Pyramid Fairy: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
				is_opened: false,
				is_available: function() {
					var crystal_count = 0;
					for (var k = 0; k < 10; k++) {
						if (prizes[k] === 4 && items['boss'+k])
							crystal_count += 1;
					}
					if (!items.moonpearl || crystal_count < 2) return 'unavailable';
					return canReachSDW() && (items.hammer || items.mirror && items.agahnim) ? 'available' : 'unavailable';

				}
			}, { // [103]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					var pendant_count = 0;
					for (var k = 0; k < 10; k++) {
						if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k]) {
							if (++pendant_count === 3) return 'available';
						}
					}
					return items.book ? 'information' : 'unavailable';
				}
			}, { // [104]
				caption: 'Escape Sewer Dark Room {lantern}',
				is_opened: false,
				is_available: function() {
					var doorcheck = window.doorCheck(11,false,false,flags.gametype != 'S',['glove','killbomb','bombdash'],'item');
					if (doorcheck) return doorcheck;
					return flags.gametype === 'S' || canDoTorchDarkRooms() ? 'available' : 'darkavailable';
				}
			}, { // [105]
				caption: 'Waterfall of Wishing (2) {flippers}',
				is_opened: false,
				is_available: function() {
					return items.flippers ? 'available' : 'unavailable';
				}
			}, { // [106]
				caption: 'Castle Tower',
				is_opened: false,
				is_available: function() {
					if(items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape && !items.agahnim)
						return 'unavailable';
					if(flags.doorshuffle != 'N') {
						if(items.mirror && (items.agahnim || (items.glove && items.hammer && items.moonpearl) || (items.glove === 2 && items.moonpearl && items.flippers)))
							return window.doorCheck(12,false,true,true,['kill','swordorswordless'],'item');
						return 'possible';
					}
					if(!items.bomb && !melee_bow() && !cane() && !items.firerod)
						return 'unavailable';
					return 'available';
				}
			}, { // [107]
				caption: 'Castle Tower (small key)',
				is_opened: false,
				is_available: function() {
					if(items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape && !items.agahnim)
						return 'unavailable';
					if(flags.doorshuffle != 'N') {
						if(items.mirror && (items.agahnim || (items.glove && items.hammer && items.moonpearl) || (items.glove === 2 && items.moonpearl && items.flippers)))
							return window.doorCheck(12,false,true,true,['kill','swordorswordless'],'item');
						return 'possible';
					}
					if(!items.bomb && !melee_bow() && !cane() && !items.firerod)
						return 'unavailable';
					return items.smallkeyhalf1 > 0 || flags.gametype === 'R' ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [108]
				caption: 'Lake Hylia Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [109]
				caption: 'Kakariko Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [110]
				caption: 'Paradox Shop (3) {bomb}',
				is_opened: false,
				is_available: function() {
					return items.bomb && canReachEDM() ?
					items.lantern || items.flute >= 1 ? 'available' : 'darkavailable' :
					'unavailable';
				}
			}, { // [111]
				caption: 'Dark Lake Hylia Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachSDW() ? 'available' : 'unavailable';
				}
			}, { // [112]
				caption: 'Village of Outcasts Shop (3) {hammer}',
				is_opened: false,
				is_available: function() {
					return canReachWDW() && items.hammer ? 'available' : 'unavailable';
				}
			}, { // [113]
				caption: 'Dark Death Mountain Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachDDM() ?
						items.lantern || items.flute >= 1 ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [114]
				caption: 'Dark Potion Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachEDW() && (items.glove || items.hammer || items.flippers) ?
						'available' : 'unavailable';
				}
			}, { // [115]
				caption: 'Dark Lumberjack Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [116]
				caption: 'Curiosity Shop (3)',
				is_opened: false,
				is_available: function() {
					return canReachWDW() ? 'available' : 'unavailable';
				}
			}, { // [117]
				caption: 'Potion Shop (3)',
				is_opened: false,
				is_available: always
			}, { // [118]
				caption: 'Pond of Happiness (2)',
				is_opened: false,
				is_available: function() {
					return items.flippers ? 'available' : 'unavailable';
				}
			}, { // [119]
				caption: 'Bomb Shop (2)',
				is_opened: false,
				is_available: function() {
					return canReachSDW() ? 'available' : 'unavailable';
				}
			}];
		}
	};
	// #endregion

	// #region Entrance
	const entranceMap = {
		"20 Rupee Cave": 67,
		"Agahnims Tower": 10,
		"Aginahs Cave": 58,
		"Bat Cave Drop": 44,
		"Big Bomb Shop": 86,
		"Blacksmiths Hut": 42,
		"Blinds Hideout": 30,
		"Bonk Fairy (Dark)": 87,
		"Bonk Rock Cave": 14,
		"Brewery": 111,
		"Bumper Cave (Top)": 129,
		"Bush Covered House": 37,
		"C-Shaped House": 109,
		"Cave 45": 3,
		"Chicken House": 35,
		"Dark Death Mountain Shop": 135,
		"Dark Lake Hylia Ledge Fairy": 120,
		"Dark Lake Hylia Ledge Hint": 121,
		"Dark Lake Hylia Shop": 119,
		"Dark Potion Shop": 92,
		"Dark Sanctuary Hint": 90,
		"Death Mountain Return Cave (East)": 73,
		"Desert Palace Entrance (North)": 56,
		"Desert Palace Entrance (South)": 53,
		"East Dark World Hint": 117,
		"Elder House (East)": 32,
		"Elder House (West)": 31,
		"Fairy Ascension Cave (Bottom)": 84,
		"Fairy Ascension Cave (Top)": 83,
		"Fortune Teller (Dark)": 106,
		"Ganons Tower": 127,
		"Graveyard Cave": 16,
		"Hammer Peg Cave": 112,
		"Hookshot Cave Back Entrance": 131,
		"Hype Cave": 88,
		"Hyrule Castle Secret Entrance Drop": 12,
		"Ice Palace": 118,
		"Ice Rod Cave": 65,
		"Pyramid Hole": 93,
		"Kakariko Gamble Game": 48,
		"Kakariko Shop": 39,
		"Kakariko Well Drop": 28,
		"Kings Grave": 17,
		"Lake Hylia Fairy": 51,
		"Lake Hylia Fortune Teller": 62,
		"Lake Hylia Shop": 61,
		"Library": 45,
		"Light Hype Fairy": 6,
		"Long Fairy Cave": 52,
		"Lost Woods Hideout Drop": 21,
		"Lumberjack House": 23,
		"Lumberjack Tree Tree": 25,
		"Mimic Cave": 85,
		"Mini Moldorm Cave": 63,
		"Mire Fairy": 125,
		"Mire Hint": 126,
		"Mire Shed": 124,
		"Misery Mire": 123,
		"North Fairy Cave Drop": 19,
		"Old Man Cave (East)": 72,
		"Old Man House (Top)": 76,
		"Palace of Darkness": 114,
		"Paradox Cave (Bottom)": 79,
		"Paradox Cave (Middle)": 78,
		"Potion Shop": 4,
		"Pyramid Fairy": 94,
		"Sanctuary Grave": 15,
		"Skull Woods Final Section": 96,
		"Skull Woods First Section Hole (East)": 103,
		"Skull Woods First Section Hole (North)": 101,
		"Skull Woods First Section Hole (West)": 100,
		"Skull Woods Second Section Hole": 98,
		"Snitch Lady (East)": 34,
		"Spectacle Rock Cave": 69,
		"Spiral Cave": 80,
		"Spiral Cave (Bottom)": 81,
		"Superbunny Cave (Bottom)": 134,
		"Superbunny Cave (Top)": 133,
		"Tavern North": 40,
		"Turtle Rock": 136,
		"Two Brothers House (East)": 47,
		"50 Rupee Cave": 60,
		"Archery Game": 113,
		"Bat Cave Cave": 43,
		"Bonk Fairy (Light)": 1,
		"Bumper Cave (Bottom)": 105,
		"Capacity Upgrade": 64,
		"Checkerboard Cave": 57,
		"Chest Game": 107,
		"Dam": 2,
		"Dark Death Mountain Fairy": 130,
		"Dark Death Mountain Ledge (East)": 139,
		"Dark Death Mountain Ledge (West)": 138,
		"Dark Lake Hylia Fairy": 116,
		"Dark Lake Hylia Ledge Spike Cave": 122,
		"Dark Lumberjack Shop": 104,
		"Dark World Shop": 110,
		"Death Mountain Return Cave (West)": 74,
		"Desert Fairy": 59,
		"Desert Palace Entrance (East)": 55,
		"Desert Palace Entrance (West)": 54,
		"Eastern Palace": 49,
		"Fortune Teller (Light)": 27,
		"Good Bee Cave": 66,
		"Hookshot Cave": 132,
		"Hookshot Fairy": 82,
		"Hyrule Castle Entrance (East)": 9,
		"Hyrule Castle Entrance (South)": 7,
		"Hyrule Castle Entrance (West)": 8,
		"Hyrule Castle Secret Entrance Stairs": 11,
		"Pyramid Exit": 95,
		"Kakariko Well Cave": 29,
		"Light World Bomb Hut": 38,
		"Links House": 0,
		"Lost Woods Gamble": 20,
		"Lost Woods Hideout Stump": 22,
		"Lumberjack Tree Cave": 24,
		"North Fairy Cave": 18,
		"Old Man Cave (West)": 26,
		"Old Man House (Bottom)": 75,
		"Palace of Darkness Hint": 115,
		"Paradox Cave (Top)": 77,
		"Red Shield Shop": 91,
		"Sahasrahlas Hut": 50,
		"Sanctuary": 13,
		"Sick Kids House": 36,
		"Skull Woods First Section Door": 102,
		"Skull Woods Second Section Door (East)": 99,
		"Skull Woods Second Section Door (West)": 97,
		"Snitch Lady (West)": 33,
		"Spectacle Rock Cave (Bottom)": 71,
		"Spectacle Rock Cave Peak": 70,
		"Spike Cave": 128,
		"Swamp Palace": 89,
		"Tavern (Front)": 41,
		"Thieves Town": 108,
		"Tower of Hera": 68,
		"Turtle Rock Isolated Ledge Entrance": 137,
		"Two Brothers House (West)": 46,
		"Waterfall of Wishing": 5
	};

	function hasFoundLocation(x) {
		for (var i = 0; i < entrances.length; i++) {
			if (entrances[i].known_location === x) {
				return true;
			}
		}
		return false;
	}
	
	function hasFoundEntrance(x) { 
		if (flags.entrancemode === 'N') return false;
		return (entrances[x].is_connector || entrances[x].known_location != '');
	};

	function hasFoundEntranceName(x) {
		return hasFoundEntrance(entranceMap[x]);
	};

	function hasFoundRegion(x) {
		if (flags.entrancemode === 'N') return false;
		for (var i = 0; i < x.length; i++) {
			if (hasFoundEntrance(entranceMap[x[i]])) {
				return true;
			};
		};
		return false;
	};

	function canLeaveNorthEastDarkWorldSouth() {
		return items.moonpearl && (items.glove || items.hammer || items.flippers);
	};

	function canLeaveNorthEastDarkWorldWest() {
		return items.moonpearl && items.hookshot;
	};

	function canLeaveSouthEastDarkWorld() {
		return items.moonpearl && items.flippers;
	};

	//Region Connectors - Non-Inverted entrance
	function canReachUpperWestDeathMountain() {
		if (hasFoundEntranceName("Tower of Hera") || (hasFoundEntranceName("Paradox Cave (Top)") && items.hammer)) return true;
		if (items.mirror && hasFoundRegion([
			"Spectacle Rock Cave", "Spectacle Rock Cave Peak", "Spectacle Rock Cave (Bottom)", "Old Man Cave (East)", "Death Mountain Return Cave (East)",
			"Old Man House (Bottom)", "Old Man House (Top)", "Ganons Tower", "Hookshot Cave Back Entrance", "Hookshot Cave",
			"Superbunny Cave (Top)", "Turtle Rock", "Spike Cave", "Dark Death Mountain Fairy"
		])) return true;
		if (items.flute >= 1 && items.mirror) return true;
		if (items.hookshot && (hasFoundRegion([
			"Paradox Cave (Top)", "Paradox Cave (Middle)", "Paradox Cave (Bottom)", "Spiral Cave", "Spiral Cave (Bottom)", "Hookshot Fairy",
			"Fairy Ascension Cave (Top)", "Fairy Ascension Cave (Bottom)"
		]))) return true;
		if (items.hookshot && items.mirror && hasFoundRegion([
			"Superbunny Cave (Bottom)", "Dark Death Mountain Shop", "Turtle Rock Isolated Ledge Entrance", "Dark Death Mountain Ledge (West)", "Dark Death Mountain Ledge (East)"
		])) return true;

		return false;
	};

	function canReachLowerWestDeathMountain(fromEdm=false) {
		if (flags.glitches != 'N' && items.boots) return true;
		if (flags.glitches === 'M' ) return true;
		if (items.flute >= 1) return true;
		if (hasFoundRegion([
				"Spectacle Rock Cave", "Spectacle Rock Cave Peak", "Spectacle Rock Cave (Bottom)", "Old Man Cave (East)", 
				"Death Mountain Return Cave (East)", "Old Man House (Bottom)", "Old Man House (Top)"
		])) return true;
		if (items.hookshot && hasFoundRegion([
				"Paradox Cave (Top)", "Paradox Cave (Middle)", "Paradox Cave (Bottom)", "Spiral Cave", "Spiral Cave (Bottom)", "Hookshot Fairy",
				"Fairy Ascension Cave (Top)", "Fairy Ascension Cave (Bottom)", 
			])) return true;
		if (items.mirror && items.hookshot && hasFoundRegion([
			"Turtle Rock Isolated Ledge Entrance", "Dark Death Mountain Ledge (West)", "Dark Death Mountain Ledge (East)",
			"Superbunny Cave (Bottom)", "Dark Death Mountain Shop"
		])) return true;
		if (items.mirror && hasFoundRegion([
			"Spike Cave", "Dark Death Mountain Fairy", "Ganons Tower", "Hookshot Cave Back Entrance", "Hookshot Cave", "Superbunny Cave (Top)", "Turtle Rock"
		])) return true;
	
		return false;
	};

	function canReachUpperEastDeathMountain() {
		if (hasFoundEntranceName("Paradox Cave (Top)") || (canReachUpperWestDeathMountain() && items.hammer)) return true;
		if (items.mirror && (hasFoundRegion([
			"Ganons Tower", "Hookshot Cave Back Entrance", "Hookshot Cave", "Superbunny Cave (Top)", "Turtle Rock"
		]))) return true;
		if (items.flute >= 1 && items.mirror && items.hammer) return true;
		return false;
	};

	function canReachLowerEastDeathMountain() {
		if ((items.flute >= 1 && items.hookshot)) return true; 
		if (items.hookshot && canReachLowerWestDeathMountain()) return true;
		if (canReachLowerWestDeathMountain() && items.hammer && items.mirror) return true;
		if (hasFoundEntranceName("Tower of Hera") && items.hammer) return true;
		if (hasFoundRegion([
			"Paradox Cave (Middle)", "Paradox Cave (Bottom)", "Spiral Cave", "Spiral Cave (Bottom)", "Hookshot Fairy", "Fairy Ascension Cave (Top)", "Fairy Ascension Cave (Bottom)"
		])) return true;
		if (items.mirror && (hasFoundRegion([
			"Superbunny Cave (Bottom)", "Dark Death Mountain Shop", "Turtle Rock Isolated Ledge Entrance", "Dark Death Mountain Ledge (West)", "Dark Death Mountain Ledge (East)"
		]))) return true;

		return false;
	};
	
	function canReachUpperDarkDeathMountain() {
		if (hasFoundRegion([
			"Ganons Tower", "Hookshot Cave Back Entrance", "Hookshot Cave", "Superbunny Cave (Top)", "Turtle Rock"
		])) return true;
		if (items.hammer && items.glove === 2 && canReachUpperEastDeathMountain()) return true;
		return false;
	};

	function canReachLowerWestDarkDeathMountain() {
		return (hasFoundRegion(["Spike Cave", "Dark Death Mountain Fairy"]) || canReachLowerWestDeathMountain() || canReachUpperDarkDeathMountain());
	};
	
	function canReachLowerEastDarkDeathMountain(fromEdm=false) {
		return (canReachUpperDarkDeathMountain() || hasFoundRegion(["Superbunny Cave (Bottom)", "Dark Death Mountain Shop"]) || (canReachLowerEastDeathMountain() && items.glove === 2));
	};

	function canReachHyruleCastleBalcony() {
		if (hasFoundRegion([
			"Hyrule Castle Entrance (West)", "Hyrule Castle Entrance (East)", "Agahnims Tower"
		])) return true;
		if (canReachEastDarkWorld() && items.mirror) return true;
		return false;
	};

	function canReachSouthEastDarkWorld(fromEastDarkWorld=false) {
		if (hasFoundRegion([
			"Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
		])) return true;
		if (!fromEastDarkWorld) {
			if (items.flippers && items.moonpearl && canReachEastDarkWorld()) return true;
		};
		return false;
	};

	function canReachEastDarkWorld() {
		if (items.agahnim) return true;
		if (items.moonpearl && items.glove && items.hammer) return true;
		if (items.moonpearl && items.glove > 1 && items.flippers) return true;
		if (hasFoundRegion([
			"Pyramid Fairy", "Pyramid Exit", "Palace of Darkness", "Palace of Darkness Hint", "Dark Lake Hylia Fairy", "East Dark World Hint"
		])) return true;
		if (items.moonpearl && (items.hammer || items.flippers) && hasFoundRegion([
			"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop"
		])) return true;
		if (canLeaveNorthEastDarkWorldSouth() && hasFoundEntranceName("Dark Potion Shop")) return true;
		if (items.moonpearl && (items.flippers || items.hammer) && (hasFoundRegion([
			"Dark Sanctuary Hint", "Red Shield Shop", "Skull Woods Second Section Door (East)", "Skull Woods First Section Door", "Dark Lumberjack Shop",
			"Bumper Cave (Bottom)", "Fortune Teller (Dark)", "Chest Game", "Thieves Town", "C-Shaped House", "Brewery", "Bumper Cave (Top)"
		]))) return true;
		if ((items.hammer || items.flippers) && items.moonpearl && canReachSouthDarkWorld(true)) return true;
		if (canLeaveSouthEastDarkWorld() && canReachSouthEastDarkWorld(true)) return true;
		return false;
	};

	function canReachNorthEastDarkWorld() {
		if (hasFoundEntranceName("Dark Potion Shop")) return true;
		if (canReachEastDarkWorld() && items.moonpearl && (items.flippers || items.glove > 0 || items.hammer)) return true;
		return false;
	};

	function canReachWestDarkWorld(fromEastDarkWorld=false) {
		if (items.moonpearl && (items.glove === 2 || (items.glove && items.hammer))) return true;
		if (hasFoundRegion([
			"Dark Sanctuary Hint", "Red Shield Shop", "Skull Woods Second Section Door (East)", "Skull Woods First Section Door", "Dark Lumberjack Shop",
			"Bumper Cave (Bottom)", "Fortune Teller (Dark)", "Chest Game", "Thieves Town", "C-Shaped House", "Brewery", "Bumper Cave (Top)"
		])) return true;
		if (items.moonpearl && (hasFoundEntranceName("Dark World Shop") && items.hammer)) return true;
		if (items.moonpearl && (items.hookshot && (items.flippers || items.hammer)) && hasFoundRegion([
			"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop"
		])) return true;
		if (!fromEastDarkWorld) {
			if (canLeaveNorthEastDarkWorldWest() && canReachNorthEastDarkWorld()) return true;
		};
		return false;
	};
	
	function canReachSouthDarkWorld(fromEastDarkWorld=false) {
		if (items.moonpearl && (items.glove === 2 || (items.glove && items.hammer))) return true;
		if (hasFoundRegion([
			"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop"
		])) return true;
		if (!fromEastDarkWorld) {
			if (items.moonpearl && items.hammer && canReachEastDarkWorld()) return true;
		};
		if (canReachWestDarkWorld(fromEastDarkWorld)) return true;
		return false;
	};

	function canReachSouthWestDarkWorld() {
		if (items.flute >= 1 && items.glove >= 2) return true;
		if (hasFoundRegion([
			"Misery Mire", "Mire Shed", "Mire Hint", "Mire Fairy"
		])) return true;
		return false;
	};	
	
	//Region Connectors - Inverted entrance
	function activeFluteInvertedEntrance() { return items.flute > 1 || (items.flute && (canReachInvertedLightWorld() || flags.activatedflute)) };

	function canReachInvertedLightWorld() {
		if (!items.moonpearl) return false;
		if (canReachInvertedLightWorldBunny()) return true;
		if (hasFoundRegion([
			"Potion Shop", "Hyrule Castle Secret Entrance Stairs", "Graveyard Cave", "Bush Covered House", "Light World Bomb Hut"
		])) return true;
		if (items.flippers && hasFoundRegion(["Waterfall of Wishing", "Capacity Upgrade"])) return true;
		if (items.glove > 1 && hasFoundEntranceName("Kings Grave")) return true;
		if (items.glove && hasFoundEntranceName("Desert Palace Entrance (North)")) return true;

		if (items.glove === 2 && (hasFoundRegion([
			"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop",
			"Dark Sanctuary Hint", "Red Shield Shop", "Skull Woods Second Section Door (East)", "Skull Woods First Section Door", "Dark Lumberjack Shop",
			"Bumper Cave (Bottom)", "Fortune Teller (Dark)", "Chest Game", "Thieves Town", "C-Shaped House", "Brewery", "Bumper Cave (Top)"
		]))) return true;

		if (items.glove && items.hammer && hasFoundRegion([
			"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop",
			"Dark Sanctuary Hint", "Red Shield Shop", "Skull Woods Second Section Door (East)", "Skull Woods First Section Door", "Dark Lumberjack Shop",
			"Bumper Cave (Bottom)", "Fortune Teller (Dark)", "Chest Game", "Thieves Town", "C-Shaped House", "Brewery", "Bumper Cave (Top)",
			"Dark World Shop", "Pyramid Exit", "Palace of Darkness", "Palace of Darkness Hint", "Dark Lake Hylia Fairy", "East Dark World Hint",
			"Pyramid Fairy", "Dark Potion Shop"
		])) return true;

		if (items.glove === 2 && items.hookshot && (hasFoundRegion([
			"Pyramid Exit", "Palace of Darkness", "Palace of Darkness Hint", "Dark Lake Hylia Fairy", "East Dark World Hint",
			"Pyramid Fairy", "Dark Potion Shop"
		]))) return true;

		if ((items.glove === 2 || (items.glove && items.hammer)) && items.flippers && (hasFoundRegion([
			"Ice Palace", "Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave",
		]))) return true;

		if (items.glove === 2 && items.hammer && hasFoundEntranceName("Hammer Peg Cave")) return true;

		return false;
	};

	function canReachInvertedLightWorldBunny() {
		if (items.agahnim || (items.glove === 2 && activeFlute()) || hasFoundRegion([
			"Links House", "Bonk Fairy (Light)", "Dam", "Cave 45", "Light Hype Fairy", "Hyrule Castle Entrance (South)",
			"Hyrule Castle Entrance (West)", "Hyrule Castle Entrance (East)", "Agahnims Tower", "Sanctuary", "Bonk Rock Cave",
			"North Fairy Cave", "Lost Woods Gamble", "Lost Woods Hideout Stump", "Lumberjack House", "Lumberjack Tree Cave",
			"Old Man Cave (West)", "Fortune Teller (Light)", "Kakariko Well Cave", "Blinds Hideout", "Elder House (West)",
			"Elder House (East)", "Snitch Lady (West)", "Snitch Lady (East)", "Chicken House", "Sick Kids House",
			"Kakariko Shop", "Tavern (Front)", "Blacksmiths Hut", "Bat Cave Cave", "Library", "Tavern North", "Two Brothers House (West)",
			"Two Brothers House (East)", "Kakariko Gamble Game", "Eastern Palace", "Sahasrahlas Hut", "Lake Hylia Fairy",
			"Long Fairy Cave", "Desert Palace Entrance (West)", "Desert Palace Entrance (East)", "Checkerboard Cave",
			"Aginahs Cave", "Desert Fairy", "50 Rupee Cave", "Lake Hylia Shop", "Lake Hylia Fortune Teller", "Mini Moldorm Cave",
			"Ice Rod Cave", "Good Bee Cave", "20 Rupee Cave", "Death Mountain Return Cave (West)", "Pyramid Exit"
		])) return true;

		return false;
	};
	
	function canReachInvertedNorthDW() {
		if (hasFoundRegion([
			"Dark Sanctuary Hint", "Red Shield Shop", "Skull Woods Second Section Door (East)", "Skull Woods First Section Door", "Dark Lumberjack Shop",
			"Bumper Cave (Bottom)", "Fortune Teller (Dark)", "Chest Game", "Thieves Town", "C-Shaped House", "Brewery", "Bumper Cave (Top)"
		])) return true;

		if (items.glove === 2 && hasFoundRegion([
			"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop"
		])) return true;

		if (((items.hammer && items.glove === 2) || (items.hookshot && (items.flippers || items.glove || items.hammer))) && (hasFoundRegion([
			"Pyramid Fairy", "Pyramid Exit", "Palace of Darkness", "Palace of Darkness Hint", "Dark Lake Hylia Fairy", "East Dark World Hint"
		]))) return true;

		if (hasFoundEntranceName("Dark Potion Shop") && ((items.hammer && items.glove === 2) || items.hookshot)) return true;

		if (hasFoundEntranceName("Dark World Shop") && items.hammer) return true;

		if (items.flippers && ((items.glove === 2 && items.hammer) || items.hookshot) && hasFoundRegion([
			"Ice Palace", "Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
		])) return true;

		if (activeFluteInvertedEntrance()) return true;

		if (items.mirror) {
			if (canReachInvertedLightWorldBunny()) return true;
			if (hasFoundRegion([
				"Graveyard Cave", "Light World Bomb Hut", "Kings Grave"
			])) return true;
			if (hasFoundEntranceName("Bush Covered House") && items.hammer) return true;
			if (hasFoundEntranceName("Potion Shop") && items.hookshot) return true;
		};

		return false;
	};
	
	function canReachInvertedSouthDW() {
		if (activeFluteInvertedEntrance()) return true;

		if (hasFoundRegion([
			"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop"
		])) return true;

		if (hasFoundRegion([
			"Pyramid Fairy", "Pyramid Exit", "Palace of Darkness", "Palace of Darkness Hint", "Dark Lake Hylia Fairy", "East Dark World Hint"
		])) return true;

		if (items.flippers && items.hammer && hasFoundRegion([
			"Ice Palace", "Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
		])) return true;

		if (canReachInvertedNorthDW()) return true;

		return false;
	};
	
	function canReachInvertedEastDW() {
		if (activeFluteInvertedEntrance()) return true;

		if (hasFoundRegion([
			"Pyramid Fairy", "Pyramid Exit", "Palace of Darkness", "Palace of Darkness Hint", "Dark Lake Hylia Fairy", "East Dark World Hint"
		])) return true;

		if ((items.hammer || items.glove || items.flippers) && hasFoundEntranceName("Dark Potion Shop")) return true;

		if (canReachInvertedSouthDW() && (items.flippers || items.hammer)) return true;

		if (items.mirror) {
			if (canReachInvertedLightWorldBunny()) return true;
			if ((items.hammer || items.glove) && hasFoundEntranceName("Potion Shop")) return true;
			if (hasFoundEntranceName("Hyrule Castle Secret Entrance Stairs")) return true;
		};

		return false;
	};

	function canReachInvertedNorthEastShopArea() {
		if (activeFluteInvertedEntrance()) return true;
		if (hasFoundEntranceName("Dark Potion Shop")) return true;
		if (items.mirror && hasFoundEntranceName("Potion Shop")) return true;
		if (items.mirror && canReachInvertedLightWorld()) return true;
		if (items.flippers && (canReachInvertedNorthDW() || canReachInvertedSouthDW() || canReachInvertedEastDW())) return true;
		if ((items.hammer || items.glove) && canReachInvertedEastDW()) return true;
		return false;
	};
	
	function canReachInvertedMireArea() {
		if (activeFluteInvertedEntrance()) return true;

		if (hasFoundRegion([
			"Misery Mire", "Mire Shed", "Mire Hint", "Mire Fairy"
		])) return true;

		if (items.mirror) {
			if (canReachInvertedLightWorldBunny()) return true;
			if (hasFoundRegion(["Desert Palace Entrance (South)", "Desert Palace Entrance (North)"])) return true;		
		};

		return false;
	};
	
	function canReachInvertedDarkDeathMountain() {
		if (activeFluteInvertedEntrance()) return true;

		if (hasFoundRegion([
			"Ganons Tower", "Spike Cave", "Dark Death Mountain Fairy", "Hookshot Cave Back Entrance",
			"Hookshot Cave", "Superbunny Cave (Top)", "Turtle Rock"
		])) return true;

		if (items.mirror) {
			if (hasFoundRegion([
				"Tower of Hera", "Spectacle Rock Cave", "Spectacle Rock Cave Peak", "Spectacle Rock Cave (Bottom)",
				"Old Man Cave (East)", "Death Mountain Return Cave (East)", "Old Man House (Bottom)",
				"Old Man House (Top)", "Paradox Cave (Top)"
			])) return true;

			if (items.moonpearl && items.hookshot && hasFoundRegion([
				"Paradox Cave (Middle)", "Paradox Cave (Bottom)", "Spiral Cave", "Spiral Cave (Bottom)",
				"Hookshot Fairy", "Fairy Ascension Cave (Top)", "Fairy Ascension Cave (Bottom)", "Mimic Cave"
			])) return true;
		};

		return false;
	};
	
	function canReachInvertedWestDeathMountain() {

		if (canReachInvertedDarkDeathMountain()) return true;

		if (hasFoundRegion([
			"Spectacle Rock Cave", "Spectacle Rock Cave Peak", "Spectacle Rock Cave (Bottom)",
			"Old Man Cave (East)", "Death Mountain Return Cave (East)", "Old Man House (Bottom)",
			"Old Man House (Top)", "Paradox Cave (Top)"
		])) return true;

		if (hasFoundRegion([
			"Tower of Hera", "Spectacle Rock Cave", "Spectacle Rock Cave Peak", "Spectacle Rock Cave (Bottom)",
			"Old Man Cave (East)", "Death Mountain Return Cave (East)", "Old Man House (Bottom)",
			"Old Man House (Top)", "Paradox Cave (Top)"
		])) return true;

		if (items.moonpearl && items.hookshot && hasFoundRegion([
			"Paradox Cave (Top)", "Paradox Cave (Middle)", "Paradox Cave (Bottom)", "Spiral Cave", "Spiral Cave (Bottom)",
			"Hookshot Fairy", "Fairy Ascension Cave (Top)", "Fairy Ascension Cave (Bottom)", "Mimic Cave"
		])) return true;

		if (items.moonpearl && items.hammer && hasFoundEntranceName("Paradox Cave (Top)")) return true;

		return false;
	};

	function canReachInvertedUpperEastDeathMountain() {
		if (hasFoundEntranceName("Paradox Cave (Top)") || (hasFoundEntranceName("Tower of Hera") && items.hammer)) return true;
		if (canReachInvertedDarkDeathMountain() && items.mitts && items.hammer && items.moonpearl) return true;
	};
	
	function canReachInvertedEastDeathMountain() {
		if (canReachInvertedUpperEastDeathMountain()) return true;

		if (hasFoundRegion([
			"Paradox Cave (Middle)", "Paradox Cave (Bottom)", "Spiral Cave", "Spiral Cave (Bottom)",
			"Hookshot Fairy", "Fairy Ascension Cave (Top)", "Fairy Ascension Cave (Bottom)", "Mimic Cave"
		])) return true;

		if (items.moonpearl && items.hookshot && canReachInvertedWestDeathMountain()) return true;

		if (items.glove === 2) {
			if (canReachInvertedDarkDeathMountain()) return true;
			if (hasFoundRegion([
				"Superbunny Cave (Bottom)", "Dark Death Mountain Shop", "Turtle Rock Isolated Ledge Entrance",
			])) return true;
		};

		return false;
	};

	function canReachInvertedHyruleCastleBalcony() {
		if (hasFoundRegion([
			"Hyrule Castle Entrance (West)", "Hyrule Castle Entrance (East)", "Agahnims Tower"
		])) return true;
		if (items.agahnim && items.mirror) return true;
		return false;
	};

	window.loadChestFlagsEntrance = function() {
		
		window.dungeonChecks = [{ // [0]
			can_get_chest: function() {
				entranceChests(['ep'],0);
			}
		}, { // [1]
			can_get_chest: function() {
				entranceChests(['dp_m','dp_w','dp_e','dp_n'],1);
			}
		}, { // [2]
			can_get_chest: function() {
				entranceChests(['toh'],2);
			}
		}, { // [3]
			can_get_chest: function() {
				entranceChests(['pod'],3);
			}
		}, { // [4]
			can_get_chest: function() {
				entranceChests(['sp'],4);
			}
		}, { // [5]
			can_get_chest: function() {
				entranceChests(['placeholder','placeholder','placeholder','sw','placeholder','placeholder','placeholder','placeholder'],5);
			}
		}, { // [6]
			can_get_chest: function() {
				entranceChests(['tt'],6);
			}
		}, { // [7]
			can_get_chest: function() {
				entranceChests(['ip'],7);
			}
		}, { // [8]
			can_get_chest: function() {
				entranceChests(['mm'],8);
			}
		}, { // [9]
			can_get_chest: function() {
				entranceChests(['tr_m','tr_w','tr_e','tr_b'],9);
			}
		}, { // [10]
			can_get_chest: function() {
				entranceChests(['gt'],10);
			}
		}, { // [11]
			can_get_chest: function() {
				entranceChests(['hc_m','hc_w','hc_e','placeholder','placeholder'],11);
			}
		}, { // [12]
			can_get_chest: function() {
				entranceChests(['ct'],12);
			}
		}];

		//Is Inverted Mode
		if (flags.gametype === "I") {
			window.entrances = [{ // [0]
				caption: 'Bomb Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [1]
				caption: 'Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(1)) return 'available';
					return items.boots && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [2]
				caption: 'Dam',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [3]
				caption: 'Haunted Grove',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [4]
				caption: 'Magic Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(4)) return 'available';
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [5]
				caption: 'Well of Wishing',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(5)) return 'available';
					return items.flippers && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [6]
				caption: 'Hype Fairy {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(6)) return 'available';
					return canReachInvertedLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [7]
				caption: 'Hyrule Castle - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [8]
				caption: 'Hyrule Castle - Top Entrance (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(8) || hasFoundEntrance(9) || hasFoundEntrance(10)) return 'available';
					return (items.agahnim && items.mirror) ? 'available' : 'unavailable';
				}
			}, { // [9]
				caption: 'Hyrule Castle - Top Entrance (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(8) || hasFoundEntrance(9) || hasFoundEntrance(10)) return 'available';
					return (items.agahnim && items.mirror) ? 'available' : 'unavailable';
				}
			}, { // [10]
				caption: 'Hyrule Castle - Ganon\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(10)) return 'available';
					if (crystalCheck() < flags.opentowercount && flags.opentowercount != 8) return 'unavailable';
					if (hasFoundEntrance(8) || hasFoundEntrance(9) || (items.agahnim && items.mirror)) {
						if (flags.opentowercount == 8) {
							return 'possible';
						}
						if (crystalCheck() >= flags.opentowercount) return 'available';
					}
					return 'unavailable';
				}
			}, { // [11]
				caption: 'Hyrule Castle - Secret Entrance Stairs',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(11)) return 'available';
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [12]
				caption: 'Hyrule Castle - Secret Entrance Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [13]
				caption: 'Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [14]
				caption: 'Bonk Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(14)) return 'available';
					return items.boots && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [15]
				caption: 'Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.glove && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [16]
				caption: 'Graveyard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(16)) return 'available';
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [17]
				caption: 'King\'s Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(17)) return 'available';
					return items.glove === 2 && items.boots && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [18]
				caption: 'North Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [19]
				caption: 'North Fairy Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [20]
				caption: 'Woods Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [21]
				caption: 'Thief\'s Hideout',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [22]
				caption: 'Hideout Stump',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [23]
				caption: 'Lumberjack Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [24]
				caption: 'Lumberjack Tree Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [25]
				caption: 'Lumberjack Tree',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.agahnim && items.boots && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [26]
				caption: 'Bumper Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(26)) return 'available';
					return items.glove && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [27]
				caption: 'Kakariko Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [28]
				caption: 'Well Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [29]
				caption: 'Well Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [30]
				caption: 'Thief\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [31]
				caption: 'Elder\'s House (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [32]
				caption: 'Elder\'s House (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [33]
				caption: 'Snitch Lady (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [34]
				caption: 'Snitch Lady (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [35]
				caption: 'Chicken House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [36]
				caption: 'Lazy Kid\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [37]
				caption: 'Bush Covered House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(37)) return 'available';
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [38]
				caption: 'Kakariko Bomb Hut {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(38)) return 'available';
					return canReachInvertedLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [39]
				caption: 'Shop (Kak)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [40]
				caption: 'Tavern (Back)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(40)) return 'available';
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [41]
				caption: 'Tavern (Front)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [42]
				caption: 'Swordsmiths',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [43]
				caption: 'Bat Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [44]
				caption: 'Bat Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.hammer && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [45]
				caption: 'Library',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [46]
				caption: 'Two Brothers (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(46)) return 'available';
					return 'unavailable';
				}
			}, { // [47]
				caption: 'Two Brothers (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [48]
				caption: 'Kakariko Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [49]
				caption: 'Eastern Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [50]
				caption: 'Sahasrahla\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [51]
				caption: 'Eastern Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [52]
				caption: 'Eastern Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [53]
				caption: 'Desert Palace - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(53)) return 'available';
					return items.book && canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [54]
				caption: 'Desert Palace - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(54)) return 'available';
					if (items.moonpearl && items.glove && hasFoundEntrance(56)) return 'available';
					return 'unavailable';
				}
			}, { // [55]
				caption: 'Desert Palace - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(55)) return 'available';
					return 'unavailable';
				}
			}, { // [56]
				caption: 'Desert Palace - North Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(56)) return 'available';
					if (items.moonpearl && items.glove && hasFoundEntrance(54)) return 'available';
					return 'unavailable';
				}
			}, { // [57]
				caption: 'Checkerboard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(57)) return 'available';
					return items.glove && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [58]
				caption: 'Aginah\'s Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [59]
				caption: 'Desert Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [60]
				caption: '50 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(60)) return 'available';
					return items.glove && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [61]
				caption: 'Shop (Lake)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [62]
				caption: 'Lake Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [63]
				caption: 'Mini Moldorm Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(63)) return 'available';
					return canReachInvertedLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [64]
				caption: 'Pond of Happiness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(64)) return 'available';
					if (items.glove === 2 && hasFoundEntrance(118)) return 'available';
					if (items.glove === 2 && items.flippers && (canReachInvertedSouthDW() || canReachInvertedEastDW())) return 'available';
					return items.flippers && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [65]
				caption: 'Ice Rod Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(65)) return 'available';
					return canReachInvertedLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [66]
				caption: 'Good Bee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [67]
				caption: '20 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(67)) return 'available';
					return canReachInvertedLightWorld() && items.glove ? 'available' : 'unavailable';
				}
			}, { // [68]
				caption: 'Tower of Hera',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntranceName("Paradox Cave (Top)")) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					if (canReachInvertedEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [69]
				caption: 'Spectacle Rock Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [70]
				caption: 'Spectacle Rock Cave Peak',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [71]
				caption: 'Spectacle Rock Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [72]
				caption: 'Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [73]
				caption: 'Return Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [74]
				caption: 'Bumper Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(74)) return 'available';
					return 'unavailable';
				}
			}, { // [75]
				caption: 'Old Man Cave (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [76]
				caption: 'Old Man Cave (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [77]
				caption: 'Paradox Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (canReachInvertedUpperEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [78]
				caption: 'Paradox Cave (Middle)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [79]
				caption: 'Paradox Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [80]
				caption: 'Spiral Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77) || hasFoundEntrance(80)) return 'available';
					if (canReachInvertedUpperEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [81]
				caption: 'Spiral Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [82]
				caption: 'Hookshot Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [83]
				caption: 'Fairy Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77) || hasFoundEntrance(83)) return 'available';
					if (canReachInvertedUpperEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [84]
				caption: 'Fairy Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77) || hasFoundEntrance(83) || hasFoundEntrance(84)) return 'available';
					if (canReachInvertedUpperEastDeathMountain()) return 'available';
					if (items.moonpearl && items.glove === 2 && canReachInvertedEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [85]
				caption: 'Mimic Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77) || hasFoundEntrance(85)) return 'available';
					if (canReachInvertedUpperEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [86]
				caption: 'Link\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [87]
				caption: 'Dark Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(87)) return 'available';
					return canReachInvertedSouthDW() && items.boots ? 'available' : 'unavailable';
				}
			}, { // [88]
				caption: 'Hype Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [89]
				caption: 'Swamp Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [90]
				caption: 'Dark Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [91]
				caption: 'Forest Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [92]
				caption: 'Dark North East Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthEastShopArea() ? 'available' : 'unavailable';
				}
			}, { // [93]
				caption: 'Hyrule Castle Hole',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (!items.agahnim2) return 'unavailable';
					if (canReachInvertedHyruleCastleBalcony()) return 'available';
					return 'unavailable';
				}
			}, { // [94]
				caption: 'Pyramid Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(94)) return 'available';
					var crystal_count = 0;
					for(var k = 0; k < 10; k++)
						if(prizes[k] === 4 && items['boss'+k])
							crystal_count += 1;
					if (crystal_count >= 2 && canReachInvertedEastDW()) {
						return hasFoundLocation('bomb') ? 'available' : 'possible';
					}
					return 'unavailable';
				}
			}, { // [95]
				caption: 'Hyrule Castle Hole Exit',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [96]
				caption: 'Skull Woods - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(96)) return 'available';
					if (!items.firerod) return 'unavailable';
					if (hasFoundEntranceName("Skull Woods Second Section Door (West)")) return 'available';
					if (items.mirror) {
						if (canReachInvertedLightWorldBunny() || canReachInvertedLightWorld()) return 'available';
					};
					return 'unavailable';
				}
			}, { // [97]
				caption: 'Skull Woods - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(96) || hasFoundEntrance(97)) return 'available';
					if (items.mirror) {
						if (canReachInvertedLightWorldBunny() || canReachInvertedLightWorld()) return 'available';
					};
					return 'unavailable';
				}
			}, { // [98]
				caption: 'Skull Woods - North Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(96) || hasFoundEntrance(97) || hasFoundEntrance(98)) return 'available';
					if (items.mirror) {
						if (canReachInvertedLightWorldBunny() || canReachInvertedLightWorld()) return 'available';
					};
					return 'unavailable';
				}
			}, { // [99]
				caption: 'Skull Woods - Central Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [100]
				caption: 'Skull Woods - South Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [101]
				caption: 'Skull Woods - NE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [102]
				caption: 'Skull Woods - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [103]
				caption: 'Skull Woods - SE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [104]
				caption: 'Lumberjack Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [105]
				caption: 'Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(105)) return 'available';
					if (items.mirror && hasFoundEntranceName("Old Man Cave (West)")) return 'available';
					return (items.glove && canReachInvertedNorthDW()) ? 'available' : 'unavailable';
				}
			}, { // [106]
				caption: 'VoO Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [107]
				caption: 'VoO Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [108]
				caption: 'Thieves\' Town',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [109]
				caption: 'C-Shaped House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [110]
				caption: 'VoO Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(110)) return 'available';
					if (hasFoundEntranceName("Bush Covered House") && items.mirror) return 'available';
					if (items.mirror && canReachInvertedLightWorld()) return 'available';
					if (items.hammer && canReachInvertedNorthDW()) return 'available'
					return 'unavailable';
				}
			}, { // [111]
				caption: 'VoO Bombable Hut {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(111)) return 'available';
					return canReachInvertedNorthDW() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [112]
				caption: 'Hammer Peg Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(112)) return 'available';
					if (items.mirror && items.hammer && canReachInvertedLightWorldBunny()) return 'available';
					return (items.glove === 2 && items.hammer && canReachInvertedNorthDW())  ? 'available' : 'unavailable';
				}
			}, { // [113]
				caption: 'Arrow Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [114]
				caption: 'Palace of Darkness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [115]
				caption: 'PoD North Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [116]
				caption: 'PoD Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [117]
				caption: 'PoD South Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [118]
				caption: 'Ice Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(118)) return 'available';
					if (items.mirror && hasFoundEntranceName("Capacity Upgrade")) return 'available';
					return (items.flippers && (canReachInvertedEastDW() || canReachInvertedSouthDW() || hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122))) ? 'available' : 'unavailable';
				}
			}, { // [119]
				caption: 'Dark Lake Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [120]
				caption: 'Ledge Fairy {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(120)) return 'available';
					if (items.bomb) {
						if (hasFoundRegion([
							"Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
						])) return 'available';
						if (activeFluteInvertedEntrance()) return 'available';
						if (items.mirror && (canReachInvertedLightWorldBunny() || canReachInvertedLightWorld())) return 'available';
						if (items.flippers && (canReachInvertedEastDW() || canReachInvertedSouthDW())) return 'available';
					}
					return 'unavailable';
				}
			}, { // [121]
				caption: 'Ledge Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundRegion([
						"Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
					])) return 'available';
					if (activeFluteInvertedEntrance()) return 'available';
					if (items.mirror && (canReachInvertedLightWorldBunny() || canReachInvertedLightWorld())) return 'available';
					if (items.flippers && (canReachInvertedEastDW() || canReachInvertedSouthDW())) return 'available';
					return 'unavailable';
				}
			}, { // [122]
				caption: 'Ledge Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(122)) return 'available';
					if (!items.glove) return 'unavailable';
					if (hasFoundRegion([
						"Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
					])) return 'available';
					if (activeFluteInvertedEntrance()) return 'available';
					if (items.mirror && (canReachInvertedLightWorldBunny() || canReachInvertedLightWorld())) return 'available';
					if (items.flippers && (canReachInvertedEastDW() || canReachInvertedSouthDW())) return 'available';
					return 'unavailable';
				}
			}, { // [123]
				caption: 'Misery Mire',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(123)) return 'available';
					if (!canReachInvertedMireArea()) return 'unavailable';
					return medallionCheck(0);
				}
			}, { // [124]
				caption: 'Mire Shed',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedMireArea() ? 'available' : 'unavailable';
				}
			}, { // [125]
				caption: 'Mire Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedMireArea() ? 'available' : 'unavailable';
				}
			}, { // [126]
				caption: 'Mire Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedMireArea() ? 'available' : 'unavailable';
				}
			}, { // [127]
				caption: 'Agahnim\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(127)) return 'available';
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [128]
				caption: 'Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [129]
				caption: 'Return Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(129)) return 'available';
					if (items.mirror && hasFoundEntranceName("Death Mountain Return Cave (West)")) return 'available';
					return 'unavailable';
				}
			}, { // [130]
				caption: 'Dark Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [131]
				caption: 'Hookshot Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(131)) return 'available';
					if (items.mirror && canReachInvertedUpperEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [132]
				caption: 'Hookshot Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(132)) return 'available';
					return items.glove && canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [133]
				caption: 'Superbunny Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [134]
				caption: 'Superbunny Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(134) || hasFoundEntrance(135)) return 'available';
					if (items.mirror && canReachInvertedEastDeathMountain()) return 'available';
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [135]
				caption: 'DDM Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(134) || hasFoundEntrance(135)) return 'available';
					if (items.mirror && canReachInvertedEastDeathMountain()) return 'available';
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [136]
				caption: 'Turtle Rock - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(136)) return 'available';
					if (!canReachInvertedDarkDeathMountain()) return 'unavailable';
					return medallionCheck(1);
				}
			}, { // [137]
				caption: 'Turtle Rock - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(137)) return 'available';				
					if (!items.mirror) return 'unavailable';				
					if (hasFoundEntranceName("Fairy Ascension Cave (Top)")) return 'available';
					if (canReachInvertedUpperEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [138]
				caption: 'Turtle Rock Ledge - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(138) || hasFoundEntrance(139)) return 'available';
					if (!items.mirror) return 'unavailable';				
					if (hasFoundEntranceName("Spiral Cave") || hasFoundEntranceName("Mimic Cave")) return 'available';
					if (canReachInvertedUpperEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [139]
				caption: 'Turtle Rock Ledge - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(138) || hasFoundEntrance(139)) return 'available';
					if (!items.mirror) return 'unavailable';				
					if (hasFoundEntranceName("Spiral Cave") || hasFoundEntranceName("Mimic Cave")) return 'available';
					if (canReachInvertedUpperEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}];
				
			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachLightWorld()) return 'unavailable';
					return window.EPBoss();
				},
				can_get_chest: function() {
					if (!canReachLightWorld()) return 'unavailable';
					return window.EPChests();
				}
			}, { // [1]
				caption: 'Desert Palace {book}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachLightWorldBunny() || !items.book) return 'unavailable';
					return window.DPBoss();
				},
				can_get_chest: function() {
					if (!items.book || !canReachLightWorldBunny()) return 'unavailable';
					return window.DPChests();
				}
			}, { // [2]
				caption: 'Tower of Hera {hammer} [{hookshot}/{glove2}]',
				is_beaten: false,
				is_beatable: function() {
					if(!(items.glove || activeFluteInvertedEntrance()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
					return window.HeraBoss();
				},
				can_get_chest: function() {
					if(!(items.glove || activeFluteInvertedEntrance()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
					return window.HeraChests();
				}
			}, { // [3]
				caption: 'Palace of Darkness',
				is_beaten: false,
				is_beatable: function() {
					if(!canReachEDW()) return 'unavailable';
					return window.PoDBoss();
				},
				can_get_chest: function() {
					if (!canReachEDW()) return 'unavailable';
					return window.PoDChests();
				}
			}, { // [4]
				caption: 'Swamp Palace {mirror} {flippers}',
				is_beaten: false,
				is_beatable: function() {
					if (!items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers) return 'unavailable';
					return window.SPBoss();
				},
				can_get_chest: function() {
					if (!items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers) return 'unavailable';
					return window.SPChests();
				}
			}, { // [5]
				caption: 'Skull Woods',
				is_beaten: false,
				is_beatable: function() {
					return window.SWBoss();
				},
				can_get_chest: function() {
					return window.SWChests();
				}
			}, { // [6]
				caption: 'Thieves\' Town',
				is_beaten: false,
				is_beatable: function() {
					return window.TTBoss();
				},
				can_get_chest: function() {
					return window.TTChests();
				}
			}, { // [7]
				caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
				is_beaten: false,
				is_beatable: function() {
					if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPBoss();
				},
				can_get_chest: function() {
					if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPChests();
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}',
				is_beaten: false,
				is_beatable: function() {
					if (!(activeFluteInvertedEntrance() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					if (!items.bigkey8) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMBoss();
				},
				can_get_chest: function() {
					if (!(activeFluteInvertedEntrance() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMChests();
				}
			}, { // [9]
				caption: 'Turtle Rock {medallion0}/{mirror}',
				is_beaten: false,
				is_beatable: function() {
					if (!(items.glove || activeFluteInvertedEntrance()) || !items.somaria) return 'unavailable';
					//First, check for back door access through mirror, it has logic priority
					if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2))) {
						return window.TRBackBoss();
					//If not, go through normal front door access
					} else {
						if (!items.bigkey9) return 'unavailable';
						var state = medallionCheck(1);
						if (state) return state;
						return window.TRFrontBoss();
					}
				},
				can_get_chest: function() {
					if (!(items.glove || activeFluteInvertedEntrance())) return 'unavailable';
					//First, check for back door access through mirror, it has logic priority
					if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2))) {
						return window.TRBackChests();
					//If not, go through normal front door access
					} else {
						if (!items.somaria) return 'unavailable';
						var state = medallionCheck(1);
						if (state) return state;
						return window.TRFrontChests();
					}
				}
			}, { // [10]
				caption: 'Ganon\'s Castle (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if (crystalCheck() < flags.ganonvulncount || !canReachLightWorld()) return 'unavailable';
					if (flags.goals === 'F' && (items.sword > 1 || flags.swordmode === 'S' && items.hammer) && (items.lantern || items.firerod)) return 'available';
					return window.GTBoss();			
				},
				can_get_chest: function() {
					if (crystalCheck() < flags.opentowercount) return 'unavailable';
					return window.GTChests();
				}
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ?window.dungeons[11].can_get_chest() :'opened';
				},
				can_get_chest: function() {
					return window.HCChests();
				}
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() {
					return window.CTChests();
				}
			}];

			window.agahnim = {
				caption: 'Agahnim',
				is_available: function() {
					return window.CTBoss();
				}
			};

			//define overworld chests
			window.chests = [{ // [0]
				caption: 'Light World Swamp',
				is_opened: false,
				is_available: function() {
					if (!hasFoundLocation('dam') ) return 'unavailable';
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [1]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [2]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [3]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [4]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return (items.mirror || (items.glove === 2 && canReachInvertedNorthDW())) && canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [5]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return items.flippers && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [6]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					if (!items.book) return 'unavailable';
					if (hasFoundEntranceName("Tower of Hera") || (canReachInvertedUpperEastDeathMountain() && items.moonpearl && items.hammer)) {
						if (items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) return 'available'
						return 'information';
					};
					return 'unavailable';
				}
			}, { // [7]
				caption: 'Bombos Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					if (!items.book) return 'unavailable';
					return canReachInvertedLightWorldBunny() ?
						((items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information') :
						'unavailable';
				}
			}, { // [8]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					if (items.glove && canReachInvertedEastDW()) return 'available';
					if (canReachInvertedLightWorld() && items.flippers && items.mirror) return 'available';
					return 'unavailable';
				}
			}, { // [9]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return canReachInvertedLightWorld() ? (items.flippers || items.glove ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [10]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					if (canReachInvertedUpperEastDeathMountain() || hasFoundEntranceName("Tower of Hera")) return items.lantern ? 'available' : 'darkavailable';
					if (canReachInvertedWestDeathMountain()) return items.lantern ? 'possible' : 'darkpossible';
					return 'unavailable';
				}
			}, { // [11]
				caption: 'Mushroom',
				is_opened: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? (items.moonpearl ? 'available' : 'information') : 'unavailable';
				}
			}, { // [12]
				caption: 'Spectacle Rock',
				is_opened: false,
				is_available: function() {
					if (hasFoundEntranceName("Tower of Hera")) return 'available';
					if (canReachInvertedUpperEastDeathMountain() && items.hammer && items.moonpearl) return 'available';
					return canReachInvertedWestDeathMountain() ? 'information' : 'unavailable';
				}
			}, { // [13]
				caption: 'Floating Island',
				is_opened: false,
				is_available: function() {
					if (canReachInvertedUpperEastDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [14]
				caption: 'Race Minigame',
				is_opened: false,
				is_available: function() {
					if (items.moonpearl && hasFoundEntrance(46)) return 'available';
					return canReachInvertedLightWorldBunny() ? 'information' : 'unavailable';
				}
			}, { // [15]
				caption: 'Desert West Ledge',
				is_opened: false,
				is_available: function() {
					if (hasFoundEntranceName("Desert Palace Entrance (West)")) return 'available';
					if (items.moonpearl && items.glove && hasFoundEntranceName("Desert Palace Entrance (North)")) return 'available';
					return canReachInvertedLightWorldBunny() ? 'information' : 'unavailable';
				}
			}, { // [16]
				caption: 'Lake Hylia Island {flippers}',
				is_opened: false,
				is_available: function() {
					if (canReachInvertedLightWorld() && items.flippers) return 'available';
					if (canReachInvertedLightWorldBunny() || canReachInvertedLightWorld()) return 'information';
					return 'unavailable';
				}
			}, { // [17]
				caption: 'Bumper Cave',
				is_opened: false,
				is_available: function() {
					if (hasFoundEntranceName("Bumper Cave (Top)")) return 'available';
					if (hasFoundEntranceName("Death Mountain Return Cave (West)") && items.mirror) return 'available';
					return canReachInvertedNorthDW() ? 'information' : 'unavailable';
				}
			}, { // [18]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					if (canReachInvertedEastDW()) return 'available';
					return 'unavailable';
				}
			}, { // [19]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [20]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					if (!canReachInvertedLightWorld())
						return 'unavailable';
					if (items.flippers)
						return 'available';
					if (items.glove)
						return 'information';
					return 'unavailable';
				}
			}, { // [21]
				caption: 'Buried Item {shovel}',
				is_opened: false,
				is_available: function() {
					return items.shovel && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [22]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					if(!canReachInvertedLightWorldBunny() || !canReachInvertedLightWorld())
						return 'unavailable';
					var pendant_count = 0;
					for(var k = 0; k < 10; k++)
						if((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k])
							if(++pendant_count === 3)
								return 'available';
					return items.book ? 'information' : 'unavailable';
				}
			}, { // [23]
				caption: 'Lost Woods Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [24]
				caption: 'Death Mountain Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachInvertedEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [25]
				caption: 'Mountain Entry Pull Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [26]
				caption: 'Mountain Entry Southeast Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [27]
				caption: 'Lost Woods Pass West Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [28]
				caption: 'Kakariko Portal Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [29]
				caption: 'Fortune Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [30]
				caption: 'Kakariko Pond Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [31]
				caption: 'Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [32]
				caption: 'Sanctuary Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [33]
				caption: 'River Bend West Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [34]
				caption: 'River Bend East Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [35]
				caption: 'Blinds Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [36]
				caption: 'Kakariko Welcome Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [37]
				caption: 'Forgotten Forest Southwest Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [38]
				caption: 'Forgotten Forest Central Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [39]
				caption: 'Hyrule Castle Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [40]
				caption: 'Wooden Bridge Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [41]
				caption: 'Eastern Palace Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [42]
				caption: 'Flute Boy South Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [43]
				caption: 'Flute Boy East Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [44]
				caption: 'Central Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachLightWorld()? 'available' : 'unavailable';
				}
			}, { // [45]
				caption: 'Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [46]
				caption: 'Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [47]
				caption: 'Flute Boy Approach South Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [48]
				caption: 'Flute Boy Approach North Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [49]
				caption: 'Dark Lumberjack Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [50]
				caption: 'Dark Fortune Bonk Rocks (2)',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [51]
				caption: 'Dark Graveyard West Bonk Rock',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [52]
				caption: 'Dark Graveyard North Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [53]
				caption: 'Dark Graveyard Tomb Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [54]
				caption: 'Qirn Jump West Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [55]
				caption: 'Qirn Jump East Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedNorthEastShopArea() ? 'available' : (items.sword && items.quake && canReachInvertedNorthDW() ? 'bonkinfo' : 'unavailable');
				}
			}, { // [56]
				caption: 'Dark Witch Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedNorthEastShopArea() ? 'available' : 'unavailable';
				}
			}, { // [57]
				caption: 'Pyramid Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [58]
				caption: 'Palace of Darkness Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [59]
				caption: 'Dark Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [60]
				caption: 'Dark Tree Line Tree 3',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [61]
				caption: 'Dark Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [62]
				caption: 'Hype Cave Statue',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}

			}];
		}
		else if (flags.glitches != "N") {
			window.entrances = [{ // [0]
				caption: 'Link\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [1]
				caption: 'Bonk Fairy (Light)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [2]
				caption: 'Dam',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [3]
				caption: 'Cave 45',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [4]
				caption: 'Potion Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [5]
				caption: 'Waterfall of Wishing',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [6]
				caption: 'Light Hype Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [7]
				caption: 'Hyrule Castle Entrance (South)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [8]
				caption: 'Hyrule Castle Entrance (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [9]
				caption: 'Hyrule Castle Entrance (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [10]
				caption: 'Agahnims Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [11]
				caption: 'Hyrule Castle Secret Entrance Stairs',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [12]
				caption: 'Hyrule Castle Secret Entrance Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [13]
				caption: 'Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [14]
				caption: 'Bonk Rock Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [15]
				caption: 'Sanctuary Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [16]
				caption: 'Graveyard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [17]
				caption: 'Kings Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [18]
				caption: 'North Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [19]
				caption: 'North Fairy Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [20]
				caption: 'Woods Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [21]
				caption: 'Thief\'s Hideout',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [22]
				caption: 'Hideout Stump',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [23]
				caption: 'Lumberjack Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [24]
				caption: 'Lumberjack Tree Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [25]
				caption: 'Lumberjack Tree',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [26]
				caption: 'Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [27]
				caption: 'Kakariko Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [28]
				caption: 'Well Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [29]
				caption: 'Well Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [30]
				caption: 'Thief\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [31]
				caption: 'Elder\'s House (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [32]
				caption: 'Elder\'s House (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [33]
				caption: 'Snitch Lady (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [34]
				caption: 'Snitch Lady (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [35]
				caption: 'Chicken House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [36]
				caption: 'Lazy Kid\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [37]
				caption: 'Bush Covered House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [38]
				caption: 'Kakariko Bomb Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [39]
				caption: 'Shop (Kak)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [40]
				caption: 'Tavern (Back)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [41]
				caption: 'Tavern (Front)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [42]
				caption: 'Swordsmiths',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [43]
				caption: 'Bat Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [44]
				caption: 'Bat Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [45]
				caption: 'Library',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [46]
				caption: 'Two Brothers (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [47]
				caption: 'Two Brothers (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [48]
				caption: 'Kakariko Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [49]
				caption: 'Eastern Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [50]
				caption: 'Sahasrahla\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [51]
				caption: 'Eastern Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [52]
				caption: 'Eastern Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [53]
				caption: 'Desert Palace - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [54]
				caption: 'Desert Palace - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [55]
				caption: 'Desert Palace - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [56]
				caption: 'Desert Palace - North Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [57]
				caption: 'Checkerboard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [58]
				caption: 'Aginah\'s Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [59]
				caption: 'Desert Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [60]
				caption: '50 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [61]
				caption: 'Shop (Lake)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [62]
				caption: 'Lake Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [63]
				caption: 'Mini Moldorm Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [64]
				caption: 'Pond of Happiness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [65]
				caption: 'Ice Rod Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [66]
				caption: 'Good Bee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [67]
				caption: '20 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [68]
				caption: 'Tower of Hera',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [69]
				caption: 'Spectacle Rock Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [70]
				caption: 'Spectacle Rock Cave Peak',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [71]
				caption: 'Spectacle Rock Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [72]
				caption: 'Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [73]
				caption: 'Return Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [74]
				caption: 'Return Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [75]
				caption: 'Old Man Cave (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [76]
				caption: 'Old Man Cave (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [77]
				caption: 'Paradox Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [78]
				caption: 'Paradox Cave (Middle)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [79]
				caption: 'Paradox Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [80]
				caption: 'Spiral Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [81]
				caption: 'Spiral Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [82]
				caption: 'Hookshot Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [83]
				caption: 'Fairy Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [84]
				caption: 'Fairy Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [85]
				caption: 'Mimic Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [86]
				caption: 'Bomb Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [87]
				caption: 'Dark Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [88]
				caption: 'Hype Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [89]
				caption: 'Swamp Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [90]
				caption: 'Dark Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [91]
				caption: 'Forest Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [92]
				caption: 'Dark North East Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [93]
				caption: 'Pyramid Hole',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [94]
				caption: 'Pyramid Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [95]
				caption: 'Pyramid Exit',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [96]
				caption: 'Skull Woods - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [97]
				caption: 'Skull Woods - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [98]
				caption: 'Skull Woods - North Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [99]
				caption: 'Skull Woods - Central Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [100]
				caption: 'Skull Woods - South Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [101]
				caption: 'Skull Woods - NE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [102]
				caption: 'Skull Woods - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [103]
				caption: 'Skull Woods - SE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [104]
				caption: 'Lumberjack Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [105]
				caption: 'Bumper Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [106]
				caption: 'VoO Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [107]
				caption: 'VoO Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [108]
				caption: 'Thieves\' Town',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [109]
				caption: 'C-Shaped House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [110]
				caption: 'VoO Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [111]
				caption: 'VoO Bombable Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [112]
				caption: 'Hammer Peg Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [113]
				caption: 'Arrow Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [114]
				caption: 'Palace of Darkness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [115]
				caption: 'PoD North Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [116]
				caption: 'PoD Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [117]
				caption: 'PoD South Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [118]
				caption: 'Ice Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [119]
				caption: 'Dark Lake Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [120]
				caption: 'Ledge Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [121]
				caption: 'Ledge Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [122]
				caption: 'Ledge Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [123]
				caption: 'Misery Mire',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [124]
				caption: 'Mire Shed',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [125]
				caption: 'Mire Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [126]
				caption: 'Mire Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [127]
				caption: 'Ganon\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [128]
				caption: 'Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [129]
				caption: 'Bumper Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [130]
				caption: 'Dark Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [131]
				caption: 'Hookshot Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [132]
				caption: 'Hookshot Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [133]
				caption: 'Superbunny Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [134]
				caption: 'Superbunny Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [135]
				caption: 'DDM Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [136]
				caption: 'Turtle Rock - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [137]
				caption: 'Turtle Rock - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [138]
				caption: 'Turtle Rock Ledge - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [139]
				caption: 'Turtle Rock Ledge - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}];
				
			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachLightWorld()) return 'unavailable';
					return window.EPBoss();
				},
				can_get_chest: function() {
					if (!canReachLightWorld()) return 'unavailable';
					return window.EPChests();
				}
			}, { // [1]
				caption: 'Desert Palace {book}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachLightWorldBunny() || !items.book) return 'unavailable';
					return window.DPBoss();
				},
				can_get_chest: function() {
					if (!items.book || !canReachLightWorldBunny()) return 'unavailable';
					return window.DPChests();
				}
			}, { // [2]
				caption: 'Tower of Hera {hammer} [{hookshot}/{glove2}]',
				is_beaten: false,
				is_beatable: function() {
					if(!(items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
					return window.HeraBoss();
				},
				can_get_chest: function() {
					if(!(items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
					return window.HeraChests();
				}
			}, { // [3]
				caption: 'Palace of Darkness',
				is_beaten: false,
				is_beatable: function() {
					if(!canReachEastDarkWorld()) return 'unavailable';
					return window.PoDBoss();
				},
				can_get_chest: function() {
					if (!canReachEastDarkWorld()) return 'unavailable';
					return window.PoDChests();
				}
			}, { // [4]
				caption: 'Swamp Palace {mirror} {flippers}',
				is_beaten: false,
				is_beatable: function() {
					if (!items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers) return 'unavailable';
					return window.SPBoss();
				},
				can_get_chest: function() {
					if (!items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers) return 'unavailable';
					return window.SPChests();
				}
			}, { // [5]
				caption: 'Skull Woods',
				is_beaten: false,
				is_beatable: function() {
					return window.SWBoss();
				},
				can_get_chest: function() {
					return window.SWChests();
				}
			}, { // [6]
				caption: 'Thieves\' Town',
				is_beaten: false,
				is_beatable: function() {
					return window.TTBoss();
				},
				can_get_chest: function() {
					return window.TTChests();
				}
			}, { // [7]
				caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
				is_beaten: false,
				is_beatable: function() {
					if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPBoss();
				},
				can_get_chest: function() {
					if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPChests();
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}',
				is_beaten: false,
				is_beatable: function() {
					if (!(activeFlute() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					if (!items.bigkey8) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMBoss();
				},
				can_get_chest: function() {
					if (!(activeFlute() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMChests();
				}
			}, { // [9]
				caption: 'Turtle Rock {medallion0}/{mirror}',
				is_beaten: false,
				is_beatable: function() {
					if (!(items.glove || activeFlute()) || !items.somaria) return 'unavailable';
					//First, check for back door access through mirror, it has logic priority
					if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2))) {
						return window.TRBackBoss();
					//If not, go through normal front door access
					} else {
						if (!items.bigkey9) return 'unavailable';
						var state = medallionCheck(1);
						if (state) return state;
						return window.TRFrontBoss();
					}
				},
				can_get_chest: function() {
					if (!(items.glove || activeFlute())) return 'unavailable';
					//First, check for back door access through mirror, it has logic priority
					if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2))) {
						return window.TRBackChests();
					//If not, go through normal front door access
					} else {
						if (!items.somaria) return 'unavailable';
						var state = medallionCheck(1);
						if (state) return state;
						return window.TRFrontChests();
					}
				}
			}, { // [10]
				caption: 'Ganon\'s Castle (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if (crystalCheck() < flags.ganonvulncount || !canReachLightWorld()) return 'unavailable';
					if (flags.goals === 'F' && (items.sword > 1 || flags.swordmode === 'S' && items.hammer) && (items.lantern || items.firerod)) return 'available';
					return window.GTBoss();			
				},
				can_get_chest: function() {
					if (crystalCheck() < flags.opentowercount) return 'unavailable';
					return window.GTChests();
				}
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ?window.dungeons[11].can_get_chest() :'opened';
				},
				can_get_chest: function() {
					return window.HCChests();
				}
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() {
					return window.CTChests();
				}
			}];

			window.agahnim = {
				caption: 'Agahnim',
				is_available: function() {
					return window.CTBoss();
				}
			};

			//define overworld chests
			window.chests = [{ // [0]
				caption: 'Light World Swamp',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [1]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: false,
				is_available: always
			}, { // [2]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [3]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: always
			}, { // [4]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return (items.mirror || items.glove === 2) && canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [5]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorld() ? (items.flippers ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [6]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [7]
				caption: 'Bombos Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [8]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [9]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [10]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [11]
				caption: 'Mushroom',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [12]
				caption: 'Spectacle Rock',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [13]
				caption: 'Floating Island',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [14]
				caption: 'Race Minigame {bomb}/{boots}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
				}
			}, { // [15]
				caption: 'Desert West Ledge {book}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? (items.book ? (items.moonpearl ? 'available' : 'information') : 'information') : 'unavailable';
				}
			}, { // [16]
				caption: 'Lake Hylia Island {flippers}',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [17]
				caption: 'Bumper Cave {cape}{mirror}',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [18]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [19]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: always
			}, { // [20]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [21]
				caption: 'Buried Item {shovel}',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [22]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					return 'available';
				}
			}, { // [23]
				caption: 'Lost Woods Hideout Tree',
				is_opened: false,
				is_available: always
			}, { // [24]
				caption: 'Death Mountain Bonk Rocks',
				is_opened: false,
				is_available: always
			}, { // [25]
				caption: 'Mountain Entry Pull Tree',
				is_opened: false,
				is_available: always
			}, { // [26]
				caption: 'Mountain Entry Southeast Tree',
				is_opened: false,
				is_available: always
			}, { // [27]
				caption: 'Lost Woods Pass West Tree',
				is_opened: false,
				is_available: always
			}, { // [28]
				caption: 'Kakariko Portal Tree',
				is_opened: false,
				is_available: always
			}, { // [29]
				caption: 'Fortune Bonk Rocks',
				is_opened: false,
				is_available: always
			}, { // [30]
				caption: 'Kakariko Pond Tree',
				is_opened: false,
				is_available: always
			}, { // [31]
				caption: 'Bonk Rocks Tree',
				is_opened: false,
				is_available: always
			}, { // [32]
				caption: 'Sanctuary Tree',
				is_opened: false,
				is_available: always
			}, { // [33]
				caption: 'River Bend West Tree',
				is_opened: false,
				is_available: always
			}, { // [34]
				caption: 'River Bend East Tree',
				is_opened: false,
				is_available: always
			}, { // [35]
				caption: 'Blinds Hideout Tree',
				is_opened: false,
				is_available: always
			}, { // [36]
				caption: 'Kakariko Welcome Tree',
				is_opened: false,
				is_available: always
			}, { // [37]
				caption: 'Forgotten Forest Southwest Tree',
				is_opened: false,
				is_available: always
			}, { // [38]
				caption: 'Forgotten Forest Central Tree',
				is_opened: false,
				is_available: always
			}, { // [39]
				caption: 'Hyrule Castle Tree',
				is_opened: false,
				is_available: always
			}, { // [40]
				caption: 'Wooden Bridge Tree',
				is_opened: false,
				is_available: always
			}, { // [41]
				caption: 'Eastern Palace Tree',
				is_opened: false,
				is_available: always
			}, { // [42]
				caption: 'Flute Boy South Tree',
				is_opened: false,
				is_available: always
			}, { // [43]
				caption: 'Flute Boy East Tree',
				is_opened: false,
				is_available: always
			}, { // [44]
				caption: 'Central Bonk Rocks Tree',
				is_opened: false,
				is_available: always
			}, { // [45]
				caption: 'Tree Line Tree 2',
				is_opened: false,
				is_available: always
			}, { // [46]
				caption: 'Tree Line Tree 4',
				is_opened: false,
				is_available: always
			}, { // [47]
				caption: 'Flute Boy Approach South Tree',
				is_opened: false,
				is_available: always
			}, { // [48]
				caption: 'Flute Boy Approach North Tree',
				is_opened: false,
				is_available: always
			}, { // [49]
				caption: 'Dark Lumberjack Tree',
				is_opened: false,
				is_available: always
			}, { // [50]
				caption: 'Dark Fortune Bonk Rocks (2)',
				is_opened: false,
				is_available: always
			}, { // [51]
				caption: 'Dark Graveyard West Bonk Rock',
				is_opened: false,
				is_available: always
			}, { // [52]
				caption: 'Dark Graveyard North Bonk Rocks',
				is_opened: false,
				is_available: always
			}, { // [53]
				caption: 'Dark Graveyard Tomb Bonk Rocks',
				is_opened: false,
				is_available: always
			}, { // [54]
				caption: 'Qirn Jump West Tree',
				is_opened: false,
				is_available: always
			}, { // [55]
				caption: 'Qirn Jump East Tree',
				is_opened: false,
				is_available: always
			}, { // [56]
				caption: 'Dark Witch Tree',
				is_opened: false,
				is_available: always
			}, { // [57]
				caption: 'Pyramid Tree',
				is_opened: false,
				is_available: always
			}, { // [58]
				caption: 'Palace of Darkness Tree',
				is_opened: false,
				is_available: always
			}, { // [59]
				caption: 'Dark Tree Line Tree 2',
				is_opened: false,
				is_available: always
			}, { // [60]
				caption: 'Dark Tree Line Tree 3',
				is_opened: false,
				is_available: always
			}, { // [61]
				caption: 'Dark Tree Line Tree 4',
				is_opened: false,
				is_available: always
			}, { // [62]
				caption: 'Hype Cave Statue',
				is_opened: false,
				is_available: always
			}];
		} else {
			window.entrances = [{ // [0]
				caption: 'Links House',
				world: 'light',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [1]
				caption: 'Bonk Fairy (Light)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntranceName("Bonk Fairy (Light)")) return 'available';
					return (items.boots ? 'available' : 'unavailable');
				}
			}, { // [2]
				caption: 'Dam',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [3]
				caption: 'Haunted Grove',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntranceName("Cave 45")) return 'available';
					return (items.mirror && canReachSouthDarkWorld() ? 'available' : 'unavailable');
				}
			}, { // [4]
				caption: 'Magic Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [5]
				caption: 'Well of Wishing',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntranceName("Waterfall of Wishing")) return 'available';
					return (items.flippers ? 'available' : 'unavailable');
				}
			}, { // [6]
				caption: 'Hype Fairy {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [7]
				caption: 'Hyrule Castle - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [8]
				caption: 'Hyrule Castle - Top Entrance (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntranceName("Hyrule Castle Entrance (West)")) return 'available';
					return canReachHyruleCastleBalcony() ? 'available' : 'unavailable';
				}
			}, { // [9]
				caption: 'Hyrule Castle - Top Entrance (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntranceName("Hyrule Castle Entrance (East)")) return 'available';
					return canReachHyruleCastleBalcony() ? 'available' : 'unavailable';
				}
			}, { // [10]
				caption: 'Hyrule Castle - Agahnim\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(10)) return 'available';
					return canReachHyruleCastleBalcony() && (items.sword > 1 || items.cape || items.agahnim || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'unavailable';
				}
			}, { // [11]
				caption: 'Hyrule Castle - Secret Entrance Stairs',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [12]
				caption: 'Hyrule Castle - Secret Entrance Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [13]
				caption: 'Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [14]
				caption: 'Bonk Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(14)) return 'available';
					return (items.boots ? 'available' : 'unavailable');
				}
			}, { // [15]
				caption: 'Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (items.glove > 0 ? 'available' : 'unavailable');
				}
			}, { // [16]
				caption: 'Graveyard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(16)) return 'available';
					return (items.mirror && items.moonpearl && canReachWestDarkWorld() ? 'available' : 'unavailable');
				}
			}, { // [17]
				caption: 'King\'s Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(17)) return 'available';
					if (!items.boots) return 'unavailable';
					if ((canReachWestDarkWorld() && items.mirror && items.moonpearl) || items.glove === 2) return 'available';
					return 'unavailable';
				}
			}, { // [18]
				caption: 'North Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [19]
				caption: 'North Fairy Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [20]
				caption: 'Woods Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [21]
				caption: 'Thief\'s Hideout',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [22]
				caption: 'Hideout Stump',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [23]
				caption: 'Lumberjack Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [24]
				caption: 'Lumberjack Tree Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [25]
				caption: 'Lumberjack Tree',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(25)) return 'available';
					return items.agahnim && items.boots ? 'available' : 'unavailable';
				}
			}, { // [26]
				caption: 'Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(26)) return 'available';
					return (items.glove > 0 || (hasFoundEntrance(105) && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [27]
				caption: 'Kakariko Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [28]
				caption: 'Well Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [29]
				caption: 'Well Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [30]
				caption: 'Thief\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [31]
				caption: 'Elder\'s House (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [32]
				caption: 'Elder\'s House (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [33]
				caption: 'Snitch Lady (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [34]
				caption: 'Snitch Lady (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [35]
				caption: 'Chicken House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [36]
				caption: 'Lazy Kid\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [37]
				caption: 'Bush Covered House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [38]
				caption: 'Kakariko Bomb Hut {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(38)) return 'available';
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [39]
				caption: 'Shop (Kak)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [40]
				caption: 'Tavern (Back)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [41]
				caption: 'Tavern (Front)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [42]
				caption: 'Swordsmiths',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [43]
				caption: 'Bat Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [44]
				caption: 'Bat Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return ((hasFoundEntrance(112) && items.mirror) || (items.hammer || items.glove === 2 && items.mirror && items.moonpearl)) ? 'available' : 'unavailable';
				}
			}, { // [45]
				caption: 'Library',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [46]
				caption: 'Two Brothers (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(46)) return 'available';				
					return ((canReachSouthDarkWorld() && items.mirror) ? 'available' : 'unavailable');
				}
			}, { // [47]
				caption: 'Two Brothers (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [48]
				caption: 'Kakariko Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [49]
				caption: 'Eastern Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [50]
				caption: 'Sahasrahla\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [51]
				caption: 'Eastern Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [52]
				caption: 'Eastern Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [53]
				caption: 'Desert Palace - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(53)) return 'available';				
					if (items.book || (items.flute >= 1 && items.glove === 2 && items.mirror) || (items.mirror && canReachSouthWestDarkWorld()) || ((hasFoundEntrance(123)) && items.mirror)) return 'available';
					return 'unavailable';
				}
			}, { // [54]
				caption: 'Desert Palace - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(54)) return 'available';
					return ((items.flute >= 1 && items.glove === 2 && items.mirror) || (items.mirror && canReachSouthWestDarkWorld()) || (hasFoundEntrance(56) && items.glove > 0)) ? 'available' : 'unavailable';
				}
			}, { // [55]
				caption: 'Desert Palace - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return hasFoundEntrance(55) ? 'available' : 'unavailable';
				}
			}, { // [56]
				caption: 'Desert Palace - North Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(56)) return 'available';
					return ((hasFoundEntrance(54) && items.glove > 0) || (items.mirror && canReachSouthWestDarkWorld()) || (items.flute >= 1 && items.glove === 2 && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [57]
				caption: 'Checkerboard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(57)) return 'available';
					return (canReachSouthWestDarkWorld() && items.mirror && items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [58]
				caption: 'Aginah\'s Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [59]
				caption: 'Desert Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [60]
				caption: '50 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(60)) return 'available';
					return (items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [61]
				caption: 'Shop (Lake)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [62]
				caption: 'Lake Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [63]
				caption: 'Mini Moldorm Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(63)) return 'available';
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [64]
				caption: 'Pond of Happiness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(64)) return 'available';
					if (hasFoundEntrance(118) && items.mirror) return 'available';
					return (items.flippers) ? 'available' : 'unavailable';
				}
			}, { // [65]
				caption: 'Ice Rod Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(65)) return 'available';
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [66]
				caption: 'Good Bee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [67]
				caption: '20 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(67)) return 'available';
					return (items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [68]
				caption: 'Tower of Hera',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(68)) return 'available';
					if ((canReachLowerWestDarkDeathMountain() || canReachLowerWestDeathMountain()) && items.mirror) return 'available';
					return (canReachUpperWestDeathMountain()) ? 'available' : 'unavailable';
				}
			}, { // [69]
				caption: 'Spectacle Rock Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(69)) return 'available';
					return canReachLowerWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [70]
				caption: 'Spectacle Rock Cave Peak',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(70)) return 'available';
					return canReachLowerWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [71]
				caption: 'Spectacle Rock Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(71)) return 'available';
					return canReachLowerWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [72]
				caption: 'Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(72)) return 'available';
					return canReachLowerWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [73]
				caption: 'Return Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(73)) return 'available';
					return canReachLowerWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [74]
				caption: 'Return Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(74)) return 'available';
					if (hasFoundEntrance(129) && items.mirror) return 'available';
					return 'unavailable';
				}
			}, { // [75]
				caption: 'Old Man Cave (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(75)) return 'available';
					return canReachLowerWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [76]
				caption: 'Old Man Cave (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(76)) return 'available';
					return canReachLowerWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [77]
				caption: 'Paradox Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77)) return 'available';
					return canReachUpperEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [78]
				caption: 'Paradox Cave (Middle)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(78)) return 'available';
					return canReachLowerEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [79]
				caption: 'Paradox Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(79)) return 'available';
					return canReachLowerEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [80]
				caption: 'Spiral Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(80)) return 'available';
					return (canReachUpperEastDeathMountain() || hasFoundEntrance(80) || ((hasFoundEntrance(138) || hasFoundEntrance(139)) && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [81]
				caption: 'Spiral Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(81)) return 'available';
					return canReachLowerEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [82]
				caption: 'Hookshot Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(82)) return 'available';
					return canReachLowerEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [83]
				caption: 'Fairy Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(83)) return 'available';
					return (canReachUpperEastDeathMountain() || (hasFoundEntrance(137) && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [84]
				caption: 'Fairy Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(84)) return 'available';
					if (items.moonpearl && items.mirror && canReachLowerEastDarkDeathMountain()) return 'available';
					return (hasFoundEntrance(83) || canReachUpperEastDeathMountain() || (canReachLowerEastDeathMountain() && items.glove === 2) || (hasFoundEntrance(137) && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [85]
				caption: 'Mimic Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(85)) return 'available';
					return ((items.mirror && (hasFoundEntrance(138) || hasFoundEntrance(139)))) ? 'available' : 'unavailable';
				}
			}, { // [86]
				caption: 'Bomb Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachSouthDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [87]
				caption: 'Dark Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(87)) return 'available';
					return (canReachSouthDarkWorld() && items.boots && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [88]
				caption: 'Hype Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(88)) return 'available';
					return (canReachSouthDarkWorld() && items.moonpearl && items.bomb) ? 'available' : 'unavailable';
				}
			}, { // [89]
				caption: 'Swamp Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachSouthDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [90]
				caption: 'Dark Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [91]
				caption: 'Forest Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [92]
				caption: 'Dark North East Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachNorthEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [93]
				caption: 'Pyramid Hole',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(93)) return 'available';
					if (!items.agahnim2) return 'unavailable';
					return canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [94]
				caption: 'Pyramid Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(94)) return 'available';
					var crystal_count = 0;
					for(var k = 0; k < 10; k++)
						if(prizes[k] === 4 && items['boss'+k])
							crystal_count += 1;
					if (crystal_count >= 2 && canReachEastDarkWorld()) {
						return hasFoundLocation('bomb') ? 'available' : 'possible';
					}
					return 'unavailable';
				}
			}, { // [95]
				caption: 'Pyramid Exit',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(95)) return 'available';
					if (!items.agahnim2 || !items.moonpearl) return 'unavailable';
					return canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [96]
				caption: 'Skull Woods - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(96)) return 'available';
					if (hasFoundEntrance(97) && items.moonpearl && items.firerod) return 'available';
					return 'unavailable';
				}
			}, { // [97]
				caption: 'Skull Woods - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(97) || hasFoundEntrance(96)) return 'available';
					return 'unavailable';
				}
			}, { // [98]
				caption: 'Skull Woods - North Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(98)) return 'available';
					if ((hasFoundEntrance(96) || hasFoundEntrance(97)) && items.moonpearl) return 'available';
					return 'unavailable';
				}
			}, { // [99]
				caption: 'Skull Woods - Central Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(99)) return 'available';
					return canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [100]
				caption: 'Skull Woods - South Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(100)) return 'available';
					return canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [101]
				caption: 'Skull Woods - NE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(101)) return 'available';
					return (canReachWestDarkWorld() && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [102]
				caption: 'Skull Woods - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(102)) return 'available';
					return canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [103]
				caption: 'Skull Woods - SE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(103)) return 'available';
					return canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [104]
				caption: 'Lumberjack Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (canReachWestDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [105]
				caption: 'Bumper Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(105)) return 'available';
					return (canReachWestDarkWorld() && items.glove > 0 && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [106]
				caption: 'VoO Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (canReachWestDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [107]
				caption: 'VoO Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (canReachWestDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [108]
				caption: 'Thieves\' Town',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(108)) return 'available';
					return (canReachWestDarkWorld() && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [109]
				caption: 'C-Shaped House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (canReachWestDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [110]
				caption: 'VoO Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(110)) return 'available';
					return (canReachWestDarkWorld() && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
				}
			}, { // [111]
				caption: 'VoO Bombable Hut {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(111)) return 'available';
					return (canReachWestDarkWorld() && items.moonpearl && items.bomb) ? 'available' : 'unavailable';
				}
			}, { // [112]
				caption: 'Hammer Peg Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(112)) return 'available';
					return (canReachWestDarkWorld() && items.moonpearl && items.hammer && items.glove === 2) ? 'available' : 'unavailable';
				}
			}, { // [113]
				caption: 'Arrow Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(113)) return 'available';
					return (canReachWestDarkWorld() || canReachSouthDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [114]
				caption: 'Palace of Darkness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(114)) return 'available';
					return (items.moonpearl && canReachEastDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [115]
				caption: 'PoD North Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(115)) return 'available';
					return canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [116]
				caption: 'PoD Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(116)) return 'available';
					return canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [117]
				caption: 'PoD South Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(117)) return 'available';
					return canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [118]
				caption: 'Ice Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(118)) return 'available';
					if (hasFoundEntrance(64) && items.glove === 2) return 'available';
					if (!items.flippers || items.glove < 2) return 'unavailable';
					return 'available';
				}
			}, { // [119]
				caption: 'Dark Lake Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(119)) return 'available';
					return (canReachSouthDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [120]
				caption: 'Ledge Fairy {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(120)) return 'available';
					return (canReachSouthEastDarkWorld() && items.moonpearl && items.bomb) ? 'available' : 'unavailable';
				}
			}, { // [121]
				caption: 'Ledge Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(121)) return 'available';
					return (canReachSouthEastDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [122]
				caption: 'Ledge Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(122)) return 'available';
					return (canReachSouthEastDarkWorld() && items.moonpearl && items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [123]
				caption: 'Misery Mire',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(123)) return 'available';
					if (!canReachSouthWestDarkWorld() || !items.moonpearl || medallionCheck(0) === 'unavailable') return 'unavailable';
					return (medallionCheck(0) === 'possible') ? 'possible' : 'available';
				}
			}, { // [124]
				caption: 'Mire Shed',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(124)) return 'available';
					return (canReachSouthWestDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [125]
				caption: 'Mire Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(125)) return 'available';
					return (canReachSouthWestDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [126]
				caption: 'Mire Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(126)) return 'available';
					return (canReachSouthWestDarkWorld()) ? 'available' : 'unavailable';
				}
			}, { // [127]
				caption: 'Ganon\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(127)) return 'available';
					if (canReachUpperDarkDeathMountain()) {
						if (flags.opentowercount == 8) {
							return 'possible';
						}
						return ((crystalCheck() >= flags.opentowercount)) ? 'available' : 'unavailable';
					}
					return 'unavailable';
				}
			}, { // [128]
				caption: 'Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(128)) return 'available';
					return (canReachLowerWestDeathMountain() || canReachUpperWestDeathMountain() || canReachLowerWestDarkDeathMountain()) ? 'available' : 'unavailable';
				}
			}, { // [129]
				caption: 'Bumper Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(129)) return 'available';
					return 'unavailable';
				}
			}, { // [130]
				caption: 'Dark Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(130)) return 'available';
					return (canReachLowerWestDeathMountain() || canReachUpperWestDeathMountain() || canReachLowerWestDarkDeathMountain()) ? 'available' : 'unavailable';
				}
			}, { // [131]
				caption: 'Hookshot Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(131)) return 'available';
					return 'unavailable';
				}
			}, { // [132]
				caption: 'Hookshot Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(132)) return 'available';
					return (canReachUpperDarkDeathMountain() && items.moonpearl && items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [133]
				caption: 'Superbunny Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(133)) return 'available';
					return (canReachUpperDarkDeathMountain()) ? 'available' : 'unavailable';
				}
			}, { // [134]
				caption: 'Superbunny Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(134)) return 'available';
					return (canReachLowerEastDarkDeathMountain()|| (canReachLowerEastDeathMountain() && items.glove === 2)) ? 'available' : 'unavailable';
				}
			}, { // [135]
				caption: 'DDM Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(135)) return 'available';
					return (canReachLowerEastDarkDeathMountain()|| (canReachLowerEastDeathMountain() && items.glove === 2)) ? 'available' : 'unavailable';
				}
			}, { // [136]
				caption: 'Turtle Rock - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(136)) return 'available';
					if (!canReachUpperEastDeathMountain() || !items.moonpearl || !items.hammer || items.glove < 2 || medallionCheck(1) === 'unavailable') return 'unavailable';
					return (medallionCheck(1) === 'possible') ? 'possible' : 'available';
					
				}
			}, { // [137]
				caption: 'Turtle Rock - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(137)) return 'available';
					return 'unavailable';
				}
			}, { // [138]
				caption: 'Turtle Rock Ledge - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(138)) return 'available';
					if (hasFoundEntrance(139)) return 'available';
					return 'unavailable';
				}
			}, { // [139]
				caption: 'Turtle Rock Ledge - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(139)) return 'available';
					if (hasFoundEntrance(138)) return 'available';
					return 'unavailable';
				}
			}];		
			
			
			// define dungeon chests
			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() {
					return dungeonBoss(0,[hasFoundLocation('ep') ? 'available' : 'unavailable'],[false]);
				},
				can_get_chest: function() {
					return dungeonChests(0,[hasFoundLocation('ep') ? 'available' : 'unavailable'],[false]);
				}
			}, { // [1]
				caption: 'Desert Palace',
				is_beaten: false,
				is_beatable: function() {
					return dungeonBoss(1,[hasFoundLocation('dp_m') ? 'available' : 'unavailable',hasFoundLocation('dp_w') ? 'available' : 'unavailable',hasFoundLocation('dp_e') ? 'available' : 'unavailable',hasFoundLocation('dp_n') ? 'available' : 'unavailable'],[false,false,false,false]);
				},
				can_get_chest: function() {
					return dungeonChests(1,[hasFoundLocation('dp_m') ? 'available' : 'unavailable',hasFoundLocation('dp_w') ? 'available' : 'unavailable',hasFoundLocation('dp_e') ? 'available' : 'unavailable',hasFoundLocation('dp_n') ? 'available' : 'unavailable'],[false,false,false,false]);
				}
			}, { // [2]
				caption: 'Tower of Hera',
				is_beaten: false,
				is_beatable: function() {
					return dungeonBoss(2,[hasFoundLocation('toh') ? 'available' : 'unavailable'],[false]);
				},
				can_get_chest: function() {
					return dungeonChests(2,[hasFoundLocation('toh') ? 'available' : 'unavailable'],[false]);
				}
			}, { // [3]
				caption: 'Palace of Darkness',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachEDW()) return 'unavailable';
					if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
					return window.PoDBoss();
				},
				can_get_chest: function() {
					if (!canReachEDW()) return 'unavailable';
					if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
					return window.PoDChests();
				}
			}, { // [4]
				caption: 'Swamp Palace {mirror} {flippers}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachSDW() || !items.mirror || !items.flippers) return 'unavailable';
					if (!items.glove && !items.agahnim) return 'unavailable';
					return window.SPBoss();
				},
				can_get_chest: function() {
					if (!canReachSDW() || !items.mirror || !items.flippers) return 'unavailable';
					if (!items.glove && !items.agahnim) return 'unavailable';
					return window.SPChests();
				}
			}, { // [5]
				caption: 'Skull Woods',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachWestDarkWorld() || !canReachWDW()) return 'unavailable';
					return window.SWBoss();
				},
				can_get_chest: function() {
					if (!canReachWestDarkWorld() || !canReachWDW()) return 'unavailable';
					return window.SWChests();
				}
			}, { // [6]
				caption: 'Thieves\' Town',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachWestDarkWorld() || !canReachWDW()) return 'unavailable';
					return window.TTBoss();
				},
				can_get_chest: function() {
					if (!canReachWestDarkWorld() || !canReachWDW()) return 'unavailable';
					return window.TTChests();
				}
			}, { // [7]
				caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
				is_beaten: false,
				is_beatable: function() {
					if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
					if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPBoss();
				},
				can_get_chest: function() {
					if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
					if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPChests();
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}]',
				is_beaten: false,
				is_beatable: function() {
					if (!items.moonpearl || items.flute === 0 || items.glove !== 2) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					if (!items.bigkey8) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMBoss();
				},
				can_get_chest: function() {
					if (!items.moonpearl || items.flute === 0 || items.glove !== 2) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMChests();
				}
			}, { // [9]
				caption: 'Turtle Rock {medallion0} {hammer} {somaria}',
				is_beaten: false,
				is_beatable: function() {
					if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !canReachDDM()) return 'unavailable';
					if (!items.hookshot && !items.mirror) return 'unavailable';
					if (!items.bigkey9) return 'unavailable';
					var state = medallionCheck(1);
					if (state) return state;
					return window.TRFrontBoss();
				},
				can_get_chest: function() {
					if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !canReachDDM()) return 'unavailable';
					if (!items.hookshot && !items.mirror) return 'unavailable';
					if (!items.somaria) return 'unavailable';
					var state = medallionCheck(1);
					if (state) return state;				
					return window.TRFrontChests();
				}
			}, { // [10]
				caption: 'Ganon\'s Castle (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if (crystalCheck() < flags.ganonvulncount || !canReachDDM()) return 'unavailable';
					//Fast Ganon
					if (flags.goals === 'F' && (items.sword > 1 || flags.swordmode === 'S' && (items.hammer || items.net)) && (items.lantern || items.firerod)) return 'available';
					return window.GTBoss();
				},
				can_get_chest: function() {
					if (crystalCheck() < flags.opentowercount || items.glove < 2 || !items.hammer || !canReachDDM()) return 'unavailable';
					return window.GTChests();
				}
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ?window.dungeons[11].can_get_chest() :'opened';
				},
				can_get_chest: function() {
					return window.HCChests();
				}
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() {
					return window.CTChests();
				}
			}];

			window.agahnim = {
				caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
				is_available: function() {
					return window.CTBoss();
				}
			};

			//define overworld chests
			window.chests = [{ // [0]
				caption: 'Dam (Underwater)',
				is_opened: false,
				is_available: function () {
					return hasFoundLocation('dam') ? 'available' : 'unavailable';
				}
			}, { // [1]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: (flags.gametype === 'S'),
				is_available: always
			}, { // [2]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: always
			}, { // [3]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canReachSouthDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [4]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
				}
			}, { // [5]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return items.flippers ? 'available' : 'unavailable';
				}
			}, { // [6]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					if ((canReachUpperWestDeathMountain() || (canReachLowerWestDarkDeathMountain() && items.mirror)) && items.book) {
						return (items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information';
					}
					return 'unavailable';
				}
			}, { // [7]
				caption: 'Bombos Tablet {mirror}{sword2}{book}',
				is_opened: false,
				is_available: function() {
					return items.book && items.mirror && canReachSouthDarkWorld() ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer))? 'available' : 'information' :
						'unavailable';
				}
			}, { // [8]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					if (canReachNorthEastDarkWorld() && items.moonpearl && items.glove) return 'available';
					return 'unavailable';
				}
			}, { // [9]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return items.flippers || items.glove ? 'available' : 'unavailable';
				}
			}, { // [10]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					if (canReachUpperWestDeathMountain()) {
						return items.lantern ? 'available' : 'darkavailable';
					}
					if (canReachLowerWestDeathMountain()) {
						return items.lantern ? 'possible' : 'darkpossible';
					}
					return 'unavailable';
				}
			}, { // [11]
				caption: 'Mushroom',
				is_opened: false,
				is_available: always
			}, { // [12]
				caption: 'Spectacle Rock {mirror}',
				is_opened: false,
				is_available: function() {
					if (canReachLowerWestDeathMountain()) {
						return items.mirror ? 'available' : 'information';
					}
					return 'unavailable';
				}
			}, { // [13]
				caption: 'Floating Island {mirror}',
				is_opened: false,
				is_available: function() {
					return (hasFoundEntrance(131) && items.mirror) ? 'available' : (canReachUpperEastDeathMountain() ? 'information' : 'unavailable');
				}
			}, { // [14]
				caption: 'Race Minigame',
				is_opened: false,
				is_available: function() {
					return (hasFoundEntrance(46) || (canReachSouthDarkWorld() && items.mirror) ? 'available' : 'information');
				}
			}, { // [15]
				caption: 'Desert West Ledge',
				is_opened: false,
				is_available: function() {
					return (hasFoundEntrance(54) || (items.mirror && canReachSouthWestDarkWorld()) || (items.flute >= 1 && items.glove === 2 && items.mirror) || (hasFoundEntrance(56) && items.glove > 0)) ? 'available' : 'information';
				}
			}, { // [16]
				caption: 'Lake Hylia Island {mirror}',
				is_opened: false,
				is_available: function() {
					return items.flippers && items.mirror && items.moonpearl && canReachEastDarkWorld() ? 'available' : 'information';
				}
			}, { // [17]
				caption: 'Bumper Cave {cape}',
				is_opened: false,
				is_available: function() {
					return hasFoundEntrance(129) ? 'available' : (canReachWestDarkWorld() ? 'information' : 'unavailable');
				}
			}, { // [18]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					return canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [19]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canReachSouthDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [20]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					if (items.flippers) return 'available';
					if (items.glove) return 'information';
					return 'unavailable';
				}
			}, { // [21]
				caption: 'Buried Itam {shovel}',
				is_opened: false,
				is_available: function() {
					return items.shovel ? 'available' : 'unavailable';
				}
			}, { // [22]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					var pendant_count = 0;
					for (var k = 0; k < 10; k++) {
						if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k]) {
							if (++pendant_count === 3) return 'available';
						}
					}
					return items.book ? 'information' : 'unavailable';
				}
			}, { // [23]
				caption: 'Lost Woods Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [24]
				caption: 'Death Mountain Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() && canReachUpperEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [25]
				caption: 'Mountain Entry Pull Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [26]
				caption: 'Mountain Entry Southeast Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [27]
				caption: 'Lost Woods Pass West Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [28]
				caption: 'Kakariko Portal Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [29]
				caption: 'Fortune Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [30]
				caption: 'Kakariko Pond Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && (canGetBonkableItem()) ? 'available' : 'unavailable';
				}
			}, { // [31]
				caption: 'Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && (canGetBonkableItem()) ? 'available' : 'unavailable';
				}
			}, { // [32]
				caption: 'Sanctuary Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [33]
				caption: 'River Bend West Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [34]
				caption: 'River Bend East Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [35]
				caption: 'Blinds Hideout Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [36]
				caption: 'Kakariko Welcome Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [37]
				caption: 'Forgotten Forest Southwest Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [38]
				caption: 'Forgotten Forest Central Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [39]
				caption: 'Hyrule Castle Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [40]
				caption: 'Wooden Bridge Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [41]
				caption: 'Eastern Palace Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [42]
				caption: 'Flute Boy South Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [43]
				caption: 'Flute Boy East Tree',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [44]
				caption: 'Central Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [45]
				caption: 'Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [46]
				caption: 'Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return items.agahnim && canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [47]
				caption: 'Flute Boy Approach South Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [48]
				caption: 'Flute Boy Approach North Tree',
				is_opened: false,
				is_available: function() {
					return canGetBonkableItem() ? 'available' : 'unavailable';
				}
			}, { // [49]
				caption: 'Dark Lumberjack Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [50]
				caption: 'Dark Fortune Bonk Rocks (2)',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [51]
				caption: 'Dark Graveyard West Bonk Rock',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [52]
				caption: 'Dark Graveyard North Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [53]
				caption: 'Dark Graveyard Tomb Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [54]
				caption: 'Qirn Jump West Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachWestDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [55]
				caption: 'Qirn Jump East Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachNorthEastDarkWorld() ? 'available' : (items.moonpearl && items.sword && items.quake && canReachWestDarkWorld() ? 'bonkinfo' : 'unavailable');
				}
			}, { // [56]
				caption: 'Dark Witch Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachNorthEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [57]
				caption: 'Pyramid Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [58]
				caption: 'Palace of Darkness Tree',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [59]
				caption: 'Dark Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [60]
				caption: 'Dark Tree Line Tree 3',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [61]
				caption: 'Dark Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachEastDarkWorld() ? 'available' : 'unavailable';
				}
			}, { // [62]
				caption: 'Hype Cave Statue',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && canGetBonkableItem() && canReachSouthDarkWorld() ? 'available' : 'unavailable';
				}
			}];
		}
	};

	// #endregion

	// #region Mike Chest Logic
	const logic_open_keydrop = {
		"Desert Palace": {
		   "Desert Palace - Beamos Hall Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachDesertPalaceNorth",
					"keys|1",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|1"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachDesertPalaceNorth",
					"keys|2"
				 ]
			  }
		   },
		   "Desert Palace - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachDesertPalaceMain",
					"bigkey"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachDesertPalaceMain"
				 ]
			  }
		   },
		   "Desert Palace - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachDesertPalaceMain",
					"keys|1",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachDesertPalaceMain",
					"keys|4"
				 ]
			  }
		   },
		   "Desert Palace - Boss": {
			  "always": {
				 "allOf": [
					"canBreachDesertPalaceNorth",
					"bigkey",
					"keys|3",
					"canKillBoss",
					"canLightFires",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachDesertPalaceNorth",
					"keys|4"
				 ]
			  }
		   },
		   "Desert Palace - Compass Chest": {
			  "always": {
				 "allOf": [
					"canBreachDesertPalaceMain",
					"keys|1"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachDesertPalaceMain",
					"keys|4"
				 ]
			  }
		   },
		   "Desert Palace - Desert Tiles 1 Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachDesertPalaceNorth"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachDesertPalaceNorth"
				 ]
			  }
		   },
		   "Desert Palace - Desert Tiles 2 Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachDesertPalaceNorth",
					"keys|2",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachDesertPalaceNorth",
					"keys|3"
				 ]
			  }
		   },
		   "Desert Palace - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachDesertPalaceMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachDesertPalaceMain"
				 ]
			  }
		   },
		   "Desert Palace - Torch": {
			  "always": {
				 "allOf": [
					"canBreachDesertPalaceMain",
					"boots"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachDesertPalaceMain"
				 ]
			  }
		   }
		},
		"Castle Tower": {
		   "Castle Tower - Circle of Pots Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachCastleTower",
					"keys|3",
					"canKillMostEnemies",
					"canDarkRoomNavigateBlind"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachCastleTower",
					"canDarkRoomNavigate"
				 ]
			  }
		   },
		   "Castle Tower - Dark Archer Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachCastleTower",
					"keys|2",
					"canKillMostEnemies",
					"canDarkRoomNavigateBlind"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachCastleTower",
					"canDarkRoomNavigate"
				 ]
			  }
		   },
		   "Castle Tower - Dark Maze": {
			  "always": {
				 "allOf": [
					"canBreachCastleTower",
					"keys|1",
					"canKillMostEnemies",
					"canDarkRoomNavigateBlind"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachCastleTower",
					"canDarkRoomNavigate"
				 ]
			  }
		   },
		   "Castle Tower - Room 03": {
			  "always": {
				 "allOf": [
					"canBreachCastleTower",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachCastleTower",
					"canKillMostEnemies"
				 ]
			  }
		   },
		   "Castle Tower - Boss": {
			  "always": {
				 "allOf": [
					"canBreachCastleTower",
					"keys|4",
					"canKillMostEnemies",
					"canDefeatCurtains",
					"canFightAgahnim",
					"canDarkRoomNavigateBlind"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachCastleTower",
					"canDarkRoomNavigate"
				 ]
			  }
		   }
		},
		"Eastern Palace": {
		   "Eastern Palace - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachEasternPalace",
					"bigkey"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachEasternPalace"
				 ]
			  }
		   },
		   "Eastern Palace - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachEasternPalace",
					"keys|1",
					"canDarkRoomNavigateBlind"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachEasternPalace",
					"keys|2",
					"canDarkRoomNavigate",
					"canKillOrExplodeMostEnemies"
				 ]
			  }
		   },
		   "Eastern Palace - Boss": {
			  "always": {
				 "allOf": [
					"canBreachEasternPalace",
					"bigkey",
					"keys|1",
					"canKillBoss",
					"bow",
					"canTorchRoomNavigateBlind"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|1"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachEasternPalace",
					"keys|2",
					"canTorchRoomNavigate"
				 ]
			  }
		   },
		   "Eastern Palace - Cannonball Chest": {
			  "always": {
				 "allOf": [
					"canBreachEasternPalace"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachEasternPalace"
				 ]
			  }
		   },
		   "Eastern Palace - Compass Chest": {
			  "always": {
				 "allOf": [
					"canBreachEasternPalace"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachEasternPalace"
				 ]
			  }
		   },
		   "Eastern Palace - Dark Eyegore Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachEasternPalace",
					"bigkey",
					"canTorchRoomNavigateBlind"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachEasternPalace",
					"canTorchRoomNavigate"
				 ]
			  }
		   },
		   "Eastern Palace - Dark Square Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachEasternPalace",
					"canDarkRoomNavigateBlind"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachEasternPalace",
					"canDarkRoomNavigate"
				 ]
			  }
		   },
		   "Eastern Palace - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachEasternPalace"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachEasternPalace"
				 ]
			  },
			  "superlogic": {
				 "allOf": [
					"hookshot"
				 ]
			  }
		   }
		},
		"Ganons Tower": {
		   "Ganons Tower - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"bigkey",
					"keys|2"
				 ],
				 "anyOf": [
					"hammer",
					{
					   "allOf": [
						  "somaria",
						  "canLightFires"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					{
					   "allOf": [
						  "keys|2",
						  "hammer",
						  {
							 "anyOf": [
								"canHover",
								"hookshot",
								"canBombJump"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "keys|3",
						  "somaria",
						  "canLightFires",
						  {
							 "anyOf": [
								"firerod",
								{
								   "anyOf": [
									  "canHover",
									  "canBombJump"
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
					"canReachGanonsTower",
					"keys|7"
				 ],
				 "anyOf": [
					"gtleft",
					"gtright"
				 ]
			  }
		   },
		   "Ganons Tower - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|2",
					"canUseBombs",
					"canKillArmos"
				 ],
				 "anyOf": [
					"hammer",
					{
					   "allOf": [
						  "somaria",
						  "canLightFires"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					{
					   "allOf": [
						  "keys|2",
						  "hammer",
						  {
							 "anyOf": [
								"canHover",
								"hookshot",
								"canBombJump"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "keys|3",
						  "somaria",
						  "canLightFires",
						  {
							 "anyOf": [
								"firerod",
								{
								   "anyOf": [
									  "canHover",
									  "canBombJump"
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
					"canReachGanonsTower",
					"keys|7",
					"canKillArmos",
					"canUseBombs"
				 ],
				 "anyOf": [
					"gtleft",
					"gtright"
				 ]
			  }
		   },
		   "Ganons Tower - Big Key Room - Left": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|2",
					"canUseBombs",
					"canKillArmos"
				 ],
				 "anyOf": [
					"hammer",
					{
					   "allOf": [
						  "somaria",
						  "canLightFires"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					{
					   "allOf": [
						  "keys|2",
						  "hammer",
						  {
							 "anyOf": [
								"canHover",
								"hookshot",
								"canBombJump"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "keys|3",
						  "somaria",
						  "canLightFires",
						  {
							 "anyOf": [
								"firerod",
								{
								   "anyOf": [
									  "canHover",
									  "canBombJump"
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
					"canReachGanonsTower",
					"keys|7",
					"canKillArmos",
					"canUseBombs"
				 ],
				 "anyOf": [
					"gtleft",
					"gtright"
				 ]
			  }
		   },
		   "Ganons Tower - Big Key Room - Right": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|2",
					"canUseBombs",
					"canKillArmos"
				 ],
				 "anyOf": [
					"hammer",
					{
					   "allOf": [
						  "somaria",
						  "canLightFires"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					{
					   "allOf": [
						  "keys|2",
						  "hammer",
						  {
							 "anyOf": [
								"canHover",
								"hookshot",
								"canBombJump"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "keys|3",
						  "somaria",
						  "canLightFires",
						  {
							 "anyOf": [
								"firerod",
								{
								   "anyOf": [
									  "canHover",
									  "canBombJump"
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
					"canReachGanonsTower",
					"keys|7",
					"canKillArmos",
					"canUseBombs"
				 ],
				 "anyOf": [
					"gtleft",
					"gtright"
				 ]
			  }
		   },
		   "Ganons Tower - Bob's Chest": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|2"
				 ],
				 "anyOf": [
					"hammer",
					{
					   "allOf": [
						  "somaria",
						  "canLightFires"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					{
					   "allOf": [
						  "keys|2",
						  "hammer",
						  {
							 "anyOf": [
								"canHover",
								"hookshot",
								"canBombJump"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "keys|3",
						  "somaria",
						  "canLightFires",
						  {
							 "anyOf": [
								"firerod",
								{
								   "anyOf": [
									  "canHover",
									  "canBombJump"
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
					"canReachGanonsTower",
					"keys|7"
				 ],
				 "anyOf": [
					"gtleft",
					"gtright"
				 ]
			  }
		   },
		   "Ganons Tower - Bob's Torch": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"boots"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower"
				 ]
			  }
		   },
		   "Ganons Tower - Compass Room - Bottom Left": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|1",
					"somaria",
					"canLightFires"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|1"
				 ],
				 "anyOf": [
					"firerod",
					{
					   "anyOf": [
						  "canHover",
						  "canBombJump"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"keys|7",
					"firerod"
				 ]
			  }
		   },
		   "Ganons Tower - Compass Room - Bottom Right": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|1",
					"somaria",
					"canLightFires"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|1"
				 ],
				 "anyOf": [
					"firerod",
					{
					   "anyOf": [
						  "canHover",
						  "canBombJump"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"keys|7",
					"firerod"
				 ]
			  }
		   },
		   "Ganons Tower - Compass Room - Top Left": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|1",
					"somaria",
					"canLightFires"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|1"
				 ],
				 "anyOf": [
					"firerod",
					{
					   "anyOf": [
						  "canHover",
						  "canBombJump"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"keys|7",
					"firerod"
				 ]
			  }
		   },
		   "Ganons Tower - Compass Room - Top Right": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|1",
					"somaria",
					"canLightFires"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|1"
				 ],
				 "anyOf": [
					"firerod",
					{
					   "anyOf": [
						  "canHover",
						  "canBombJump"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"keys|7",
					"firerod"
				 ]
			  }
		   },
		   "Ganons Tower - Conveyor Cross Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|1",
					"somaria",
					"canLightFires"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|1"
				 ],
				 "anyOf": [
					"firerod",
					{
					   "anyOf": [
						  "canHover",
						  "canBombJump"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"keys|7",
					"firerod"
				 ]
			  }
		   },
		   "Ganons Tower - Conveyor Star Pits Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower"
				 ]
			  }
		   },
		   "Ganons Tower - DMs Room - Bottom Left": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"hammer"
				 ],
				 "anyOf": [
					"hookshot",
					"canHover",
					"canBombJump"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"hookshot"
				 ]
			  }
		   },
		   "Ganons Tower - DMs Room - Bottom Right": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"hammer"
				 ],
				 "anyOf": [
					"hookshot",
					"canHover",
					"canBombJump"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"hookshot"
				 ]
			  }
		   },
		   "Ganons Tower - DMs Room - Top Left": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"hammer"
				 ],
				 "anyOf": [
					"hookshot",
					"canHover",
					"canBombJump"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"hookshot"
				 ]
			  }
		   },
		   "Ganons Tower - DMs Room - Top Right": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"hammer"
				 ],
				 "anyOf": [
					"hookshot",
					"canHover",
					"canBombJump"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"hookshot"
				 ]
			  }
		   },
		   "Ganons Tower - Double Switch Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"hammer",
					"canHitRangedSwitch"
				 ],
				 "anyOf": [
					"hookshot",
					"boots",
					"canBombJump"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower"
				 ],
				 "anyOf": [
					"hookshot",
					"boots"
				 ]
			  }
		   },
		   "Ganons Tower - Firesnake Room": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|1",
					"hammer",
					"canHitRangedSwitch"
				 ],
				 "anyOf": [
					"hookshot",
					"boots",
					"canBombJump"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"keys|7",
					"hookshot"
				 ]
			  }
		   },
		   "Ganons Tower - Hope Room - Left": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower"
				 ]
			  }
		   },
		   "Ganons Tower - Hope Room - Right": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower"
				 ]
			  }
		   },
		   "Ganons Tower - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|1",
					"hammer"
				 ],
				 "anyOf": [
					"hookshot",
					"boots",
					"canBombJump"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|5"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"keys|8"
				 ],
				 "anyOf": [
					"hookshot",
					"boots"
				 ]
			  }
		   },
		   "Ganons Tower - Mini Helmasaur Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"bigkey",
					"canLightFires"
				 ],
				 "anyOf": [
					"bow",
					{
					   "allOf": [
						  "canMimicClip",
						  "canKillMostEnemies"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"bow"
				 ]
			  }
		   },
		   "Ganons Tower - Mini Helmasaur Room - Left": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"bigkey",
					"canLightFires"
				 ]
			  },
			  "required": {
				 "anyOf": [
					"bow",
					{
					   "allOf": [
						  "canMimicClip",
						  "canKillMostEnemies"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"bow"
				 ]
			  }
		   },
		   "Ganons Tower - Mini Helmasaur Room - Right": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"bigkey",
					"canLightFires"
				 ]
			  },
			  "required": {
				 "anyOf": [
					"bow",
					{
					   "allOf": [
						  "canMimicClip",
						  "canKillMostEnemies"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"bow"
				 ]
			  }
		   },
		   "Ganons Tower - Pre-Moldorm Chest": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"bigkey",
					"keys|1",
					"canLightFires",
					"canUseBombs"
				 ],
				 "anyOf": [
					"bow",
					{
					   "allOf": [
						  "canMimicClip",
						  "canKillMostEnemies"
					   ]
					}
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"keys|7",
					"bow"
				 ]
			  }
		   },
		   "Ganons Tower - Randomizer Room - Bottom Left": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|2",
					"hammer",
					"canUseBombs"
				 ],
				 "anyOf": [
					"hookshot",
					"canHover",
					"canBombJump"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"hookshot",
					"keys|8"
				 ]
			  }
		   },
		   "Ganons Tower - Randomizer Room - Bottom Right": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|2",
					"hammer",
					"canUseBombs"
				 ],
				 "anyOf": [
					"hookshot",
					"canHover",
					"canBombJump"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"hookshot",
					"keys|8"
				 ]
			  }
		   },
		   "Ganons Tower - Randomizer Room - Top Left": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|2",
					"hammer",
					"canUseBombs"
				 ],
				 "anyOf": [
					"hookshot",
					"canHover",
					"canBombJump"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"hookshot",
					"keys|8"
				 ]
			  }
		   },
		   "Ganons Tower - Randomizer Room - Top Right": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"keys|2",
					"hammer",
					"canUseBombs"
				 ],
				 "anyOf": [
					"hookshot",
					"canHover",
					"canBombJump"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"hookshot",
					"keys|8"
				 ]
			  }
		   },
		   "Ganons Tower - Tile Room": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"somaria"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower"
				 ]
			  }
		   },
		   "Ganons Tower - Validation Chest": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"bigkey",
					"keys|2",
					"canLightFires",
					"melee",
					"canUseBombs",
					{
					   "anyOf": [
						  "hookshot",
						  "canHover"
					   ]
					}
				 ],
				 "anyOf": [
					"bow",
					{
					   "allOf": [
						  "canMimicClip",
						  "canKillMostEnemies"
					   ]
					}
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"keys|8",
					"bow",
					"hookshot"
				 ]
			  }
		   },
		   "Ganons Tower - Boss": {
			  "always": {
				 "allOf": [
					"canBreachGanonsTower",
					"bigkey",
					"keys|2",
					"canFightAgahnim",
					"canLightFires",
					"canUseBombs",
					{
					   "anyOf": [
						  {
							 "allOf": [
								"melee",
								"hookshot"
							 ]
						  },
						  "canHover",
						  "canMoldormBounce"
					   ]
					}
				 ],
				 "anyOf": [
					"bow",
					{
					   "allOf": [
						  "canMimicClip",
						  "canKillMostEnemies"
					   ]
					}
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachGanonsTower",
					"bow",
					"keys|8",
					"melee",
					"hookshot"
				 ]
			  }
		   }
		},
		"Hyrule Castle": {
		   "Hyrule Castle - Big Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachHyruleCastle",
					"keys|2",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canBreachHyruleCastle",
					"keys|4"
				 ]
			  }
		   },
		   "Hyrule Castle - Boomerang Chest": {
			  "always": {
				 "allOf": [
					"canBreachHyruleCastle",
					"keys|1",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachHyruleCastle",
					"keys|3"
				 ]
			  }
		   },
		   "Hyrule Castle - Boomerang Guard Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachHyruleCastle",
					"keys|1",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachHyruleCastle",
					"keys|3"
				 ]
			  }
		   },
		   "Hyrule Castle - Key Rat Key Drop": {
			  "always": {
				 "allOf": [
					"keys|1",
					"canKillOrExplodeMostEnemies",
					"canTorchRoomNavigateBlind"
				 ],
				 "anyOf": [
					   "canBreachHyruleCastle",
					   "canBreachSewersDropdown"
					]
			  },
			  "required": {
				 "allOf": [
					"keys|1"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"keys|3",
					"canTorchRoomNavigate"
				 ],
				 "anyOf": [
					"canReachHyruleCastle",
					"canReachSewersDropdown"
				 ]
			  }
		   },
		   "Hyrule Castle - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachHyruleCastle"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachHyruleCastle"
				 ]
			  }
		   },
		   "Hyrule Castle - Map Guard Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachHyruleCastle",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachHyruleCastle"
				 ]
			  }
		   },
		   "Hyrule Castle - Zelda's Chest": {
			  "always": {
				 "allOf": [
					"canBreachHyruleCastle",
					"bigkey",
					"keys|2",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachHyruleCastle",
					"keys|4"
				 ]
			  }
		   },
		   "Sewers - Dark Cross": {
			  "always": {
				 "allOf": [
					"canTorchRoomNavigateBlind"
				 ],
				 "anyOf": [
					"canBreachHyruleCastle",
					{
					   "allOf": [
						  "canBreachSewersDropdown",
						  "keys|2"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachHyruleCastle",
					{
					   "allOf": [
						  "canBreachSewersDropdown",
						  "keys|4"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canDarkRoomNavigate"
				 ],
				 "anyOf": [
					"canReachHyruleCastle",
					{
					   "allOf": [
						  "canReachSewersDropdown",
						  "keys|4"
					   ]
					}
				 ]
			  }
		   },
		   "Sewers - Secret Room - Left": {
			  "always": {
				 "allOf": [
					"canOpenBonkWalls"
				 ],
				 "anyOf": [
					"canBreachSewersDropdown",
					{
					   "allOf": [
						  "canBreachHyruleCastle",
						  "keys|2",
						  "canTorchRoomNavigateBlind"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachSewersDropdown",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "anyOf": [
					"canReachSewersDropdown",
					{
					   "allOf": [
						  "canReachHyruleCastle",
						  "keys|4",
						  "canTorchRoomNavigate"
					   ]
					}
				 ]
			  }
		   },
		   "Sewers - Secret Room - Middle": {
			  "always": {
				 "allOf": [
					"canOpenBonkWalls"
				 ],
				 "anyOf": [
					"canBreachSewersDropdown",
					{
					   "allOf": [
						  "canBreachHyruleCastle",
						  "keys|2",
						  "canTorchRoomNavigateBlind"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachSewersDropdown",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "anyOf": [
					"canReachSewersDropdown",
					{
					   "allOf": [
						  "canReachHyruleCastle",
						  "keys|4",
						  "canTorchRoomNavigate"
					   ]
					}
				 ]
			  }
		   },
		   "Sewers - Secret Room - Right": {
			  "always": {
				 "allOf": [
					"canOpenBonkWalls"
				 ],
				 "anyOf": [
					"canBreachSewersDropdown",
					{
					   "allOf": [
						  "canBreachHyruleCastle",
						  "keys|2",
						  "canTorchRoomNavigateBlind"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachSewersDropdown",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "anyOf": [
					"canReachSewersDropdown",
					{
					   "allOf": [
						  "canReachHyruleCastle",
						  "keys|4",
						  "canTorchRoomNavigate"
					   ]
					}
				 ]
			  }
		   },
		   "Sanctuary": {
			  "always": {
				 "anyOf": [
					"canBreachSanctuary",
					"canBreachSewersDropdown",
					{
					   "allOf": [
						  "canBreachHyruleCastle",
						  "keys|2",
						  "canTorchRoomNavigateBlind"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachSanctuary",
					"canBreachSewersDropdown",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "anyOf": [
					"canReachSanctuary",
					"canReachSewersDropdown",
					{
					   "allOf": [
						  "canReachHyruleCastle",
						  "keys|4",
						  "canTorchRoomNavigate"
					   ]
					}
				 ]
			  }
		   }
		},
		"Skull Woods": {
		   "Skull Woods - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachSkullMiddle",
					"bigkey"
				 ],
				 "anyOf": [
					"canUseBombs",
					"canHover"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSkullMain",
					"canUseBombs"
				 ]
			  }
		   },
		   "Skull Woods - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachSkullMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSkullMiddle"
				 ]
			  },
			  "superlogic": {
				 "allOf": [
					"somaria"
				 ]
			  }
		   },
		   "Skull Woods - Boss": {
			  "always": {
				 "allOf": [
					"canBreachSkullBack",
					"canKillBoss",
					"canDefeatCurtains",
					"keys|2"
				 ],
				 "anyOf": [
					"firerod",
					{
					   "allOf": [
						  "lantern",
						  {
							 "anyOf": [
								"canUseBombs",
								"canHover"
							 ]
						  }
					   ]
					}
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSkullBack",
					"keys|5",
					"firerod"
				 ]
			  }
		   },
		   "Skull Woods - Bridge Room": {
			  "always": {
				 "allOf": [
					"canBreachSkullBack"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSkullBack"
				 ]
			  }
		   },
		   "Skull Woods - Compass Chest": {
			  "always": {
				 "anyOf": [
					"canBreachSkullDrops",
					{
					   "allOf": [
						  "canBreachSkullMain",
						  "keys|1"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachSkullDrops",
					"keys|1"
				 ]
			  },
			  "logical": {
				 "anyOf": [
					"canReachSkullDrops",
					{
					   "allOf": [
						  "canReachSkullMain",
						  "keys|5"
					   ]
					}
				 ]
			  }
		   },
		   "Skull Woods - Map Chest": {
			  "always": {
				 "anyOf": [
					"canBreachSkullDrops",
					"canBreachSkullMain"
				 ]
			  },
			  "logical": {
				 "anyOf": [
					"canReachSkullDrops",
					"canReachSkullMain"
				 ]
			  }
		   },
		   "Skull Woods - Pinball Room": {
			  "always": {
				 "anyOf": [
					"canBreachSkullDrops",
					{
					   "allOf": [
						  "canBreachSkullMain",
						  "keys|1"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachSkullDrops",
					"keys|1"
				 ]
			  },
			  "logical": {
				 "anyOf": [
					"canReachSkullDrops",
					{
					   "allOf": [
						  "canReachSkullMain",
						  "keys|4"
					   ]
					}
				 ]
			  }
		   },
		   "Skull Woods - Pot Prison": {
			  "always": {
				 "anyOf": [
					"canBreachSkullDrops",
					{
					   "allOf": [
						  "canBreachSkullMain",
						  "keys|1"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachSkullDrops",
					"keys|1"
				 ]
			  },
			  "logical": {
				 "anyOf": [
					"canReachSkullDrops",
					{
					   "allOf": [
						  "canReachSkullMain",
						  "keys|5"
					   ]
					}
				 ]
			  }
		   },
		   "Skull Woods - Spike Corner Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachSkullBack",
					"keys|1",
					"canDefeatCurtains"
				 ],
				 "anyOf": [
					"firerod",
					{
					   "allOf": [
						  "lantern",
						  {
							 "anyOf": [
								"canBombJump",
								"canHover"
							 ]
						  }
					   ]
					}
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSkullBack",
					"keys|4",
					"firerod"
				 ]
			  }
		   },
		   "Skull Woods - West Lobby Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachSkullMiddle"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSkullMiddle"
				 ]
			  }
		   }
		},
		"Swamp Palace": {
		   "Swamp Palace - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|2",
					"bigkey",
					"flippers"
				 ],
				 "anyOf": [
					"canSpeckyClip",
					{
					   "allOf": [
						  "hammer",
						  "keys|3"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canSpeckyClip",
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|3",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"flippers"
				 ],
				 "anyOf": [
					{
					   "allOf": [
						  "keys|2",
						  "canSpeckyClip",
						  "canBombSpooky"
					   ]
					},
					{
					   "allOf": [
						  "keys|3",
						  "canSpeckyClip"
					   ]
					},
					{
					   "allOf": [
						  "keys|3",
						  "canBombSpooky",
						  "hammer"
					   ]
					},
					{
					   "allOf": [
						  "keys|4",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					{
					   "allOf": [
						  "keys|4",
						  "canSpeckyClip",
						  "canBombSpooky"
					   ]
					},
					{
					   "allOf": [
						  "canSpeckyClip",
						  "keys|5"
					   ]
					},
					{
					   "allOf": [
						  "canBombSpooky",
						  "keys|5",
						  "hammer"
					   ]
					},
					{
					   "allOf": [
						  "keys|6",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|6",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - West Chest": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"flippers"
				 ],
				 "anyOf": [
					{
					   "allOf": [
						  "keys|2",
						  "canSpeckyClip",
						  "canBombSpooky"
					   ]
					},
					{
					   "allOf": [
						  "keys|3",
						  "canSpeckyClip"
					   ]
					},
					{
					   "allOf": [
						  "keys|3",
						  "canBombSpooky",
						  "hammer"
					   ]
					},
					{
					   "allOf": [
						  "keys|4",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					{
					   "allOf": [
						  "keys|4",
						  "canSpeckyClip",
						  "canBombSpooky"
					   ]
					},
					{
					   "allOf": [
						  "canSpeckyClip",
						  "keys|5"
					   ]
					},
					{
					   "allOf": [
						  "canBombSpooky",
						  "keys|5",
						  "hammer"
					   ]
					},
					{
					   "allOf": [
						  "keys|6",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|6",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - Boss": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"flippers",
					"canKillBoss",
					"hookshot",
					"keys|4"
				 ],
				 "anyOf": [
					"canSpeckyClip",
					{
					   "allOf": [
						  "keys|5",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canSpeckyClip",
					"keys|5"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|6",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - Compass Chest": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|2",
					"flippers"
				 ],
				 "anyOf": [
					"canSpeckyClip",
					{
					   "allOf": [
						  "keys|3",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canSpeckyClip",
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|3",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - Entrance": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"flippers",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace"
				 ]
			  }
		   },
		   "Swamp Palace - Flooded Room - Left": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|3",
					"flippers",
					"hookshot"
				 ],
				 "anyOf": [
					"canSpeckyClip",
					{
					   "allOf": [
						  "keys|4",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canSpeckyClip",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|5",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - Flooded Room - Right": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|3",
					"flippers",
					"hookshot"
				 ],
				 "anyOf": [
					"canSpeckyClip",
					{
					   "allOf": [
						  "keys|4",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canSpeckyClip",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|5",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - Hookshot Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|2",
					"flippers",
					"hookshot"
				 ],
				 "anyOf": [
					"canSpeckyClip",
					{
					   "allOf": [
						  "keys|3",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canSpeckyClip",
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|3",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|1",
					"flippers",
					"canUseBombs"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace"
				 ]
			  }
		   },
		   "Swamp Palace - Pot Row Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|1",
					"flippers"
				 ]
			  },
			 "logical": {
				 "allOf": [
					"canReachSwampPalace"
				 ]
			  }
		   },
		   "Swamp Palace - Trench 1 Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|2",
					"flippers"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace"
				 ]
			  }
		   },
		   "Swamp Palace - Trench 2 Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|2",
					"flippers"
				 ],
				 "anyOf": [
					"canSpeckyClip",
					{
					   "allOf": [
						  "keys|3",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canSpeckyClip",
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|3",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - Waterfall Room": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|3",
					"flippers",
					"hookshot"
				 ],
				 "anyOf": [
					"canSpeckyClip",
					{
					   "allOf": [
						  "keys|4",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canSpeckyClip",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|5",
					"hammer"
				 ]
			  }
		   },
		   "Swamp Palace - Waterway Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachSwampPalace",
					"keys|3",
					"flippers",
					"hookshot"
				 ],
				 "anyOf": [
					"canSpeckyClip",
					{
					   "allOf": [
						  "keys|4",
						  "hammer"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canSpeckyClip",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachSwampPalace",
					"keys|5",
					"hammer"
				 ]
			  }
		   }
		},
		"Thieves Town": {
		   "Thieves Town - Ambush Chest": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown"
				 ]
			  }
		   },
		   "Thieves Town - Attic": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown",
					"keys|2",
					"bigkey"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown",
					"keys|3"
				 ]
			  }
		   },
		   "Thieves Town - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown",
					"keys|2",
					"bigkey",
					"hammer"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown",
					"keys|3"
				 ]
			  }
		   },
		   "Thieves Town - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown"
				 ]
			  }
		   },
		   "Thieves Town - Blind's Cell": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown",
					"bigkey",
					"keys|1"
				 ],
				 "anyOf": [
					"canKillMostEnemies",
					"canUseBombs",
					"glove"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown"
				 ]
			  }
		   },
		   "Thieves Town - Boss": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown",
					"keys|2",
					"bigkey",
					"canKillBoss",
					"canUseBombs"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown",
					"keys|3"
				 ]
			  }
		   },
		   "Thieves Town - Compass Chest": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown"
				 ]
			  }
		   },
		   "Thieves Town - Hallway Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown",
					"bigkey"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown"
				 ]
			  }
		   },
		   "Thieves Town - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown"
				 ]
			  }
		   },
		   "Thieves Town - Spike Switch Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachThievesTown",
					"bigkey",
					"keys|1"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachThievesTown"
				 ]
			  }
		   }
		},
		"Tower of Hera": {
		   "Tower of Hera - Basement Cage": {
			  "always": {
				 "allOf": [
					"canBreachTowerOfHera",
					"canHitSwitch"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTowerOfHera"
				 ]
			  }
		   },
		   "Tower of Hera - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachTowerOfHera",
					"bigkey",
					"canHitSwitch"
				 ],
				 "anyOf": [
					"canKillOrExplodeMostEnemies",
					"canHeraPot"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTowerOfHera",
					"canKillOrExplodeMostEnemies"
				 ]
			  }
		   },
		   "Tower of Hera - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachTowerOfHera",
					"keys|1",
					"canHitSwitch",
					"canLightFires"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTowerOfHera"
				 ]
			  }
		   },
		   "Tower of Hera - Boss": {
			  "always": {
				 "allOf": [
					"canBreachTowerOfHera",
					"canHitSwitch",
					"canKillBoss"
				 ],
				 "anyOf": [
					"canHeraPot",
					{
					   "allOf": [
						  "bigkey",
						  "canKillOrExplodeMostEnemies"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTowerOfHera",
					"bigkey",
					"canKillOrExplodeMostEnemies"
				 ]
			  }
		   },
		   "Tower of Hera - Compass Chest": {
			  "always": {
				 "allOf": [
					"canBreachTowerOfHera",
					"canHitSwitch"
				 ],
				 "anyOf": [
					"canHeraPot",
					{
					   "allOf": [
						  "bigkey",
						  "canKillOrExplodeMostEnemies"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTowerOfHera",
					"bigkey",
					"canKillOrExplodeMostEnemies"
				 ]
			  }
		   },
		   "Tower of Hera - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachTowerOfHera",
					"canHitSwitch"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTowerOfHera"
				 ]
			  }
		   } 
		},
		"Turtle Rock": {
		   "Turtle Rock - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"bigkey",
					"keys|3",
					"canUseBombs"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria"
				 ]
			  }
		   },
		   "Turtle Rock - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"keys|4",
					"canHitSwitch"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain",
					"keys|6"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria",
					"keys|6"
				 ]
			  }
		   },
		   "Turtle Rock - Boss": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"bigkey",
					"keys|5",
					"canKillBoss",
					"canOpenBonkWalls",
					"canHitRangedSwitch",
					"canDarkRoomNavigateBlind"
				 ],
				 "anyOf": [
					"canHoverAlot",
					"somaria"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain",
					"keys|5"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria",
					"keys|6",
					"canDarkRoomNavigate"
				 ]
			  }
		   },
		   "Turtle Rock - Chain Chomps": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"keys|2",
					"canHitRangedSwitch"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria"
				 ]
			  }
		   },
		   "Turtle Rock - Compass Chest": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria"
				 ]
			  }
		   },
		   "Turtle Rock - Crystaroller Room": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"bigkey",
					"keys|3",
					"canOpenBonkWalls",
					"canHitRangedSwitch"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria"
				 ]
			  }
		   },
		   "Turtle Rock - Eye Bridge - Bottom Left": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"bigkey",
					"keys|4",
					"canOpenBonkWalls",
					"canDarkRoomNavigateBlind"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria",
					"canDarkRoomNavigate",
					"keys|5"
				 ],
				 "anyOf": [
					"mirrorshield",
					"byrna",
					"cape"
				 ]
			  }
		   },
		   "Turtle Rock - Eye Bridge - Bottom Right": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"bigkey",
					"keys|4",
					"canOpenBonkWalls",
					"canDarkRoomNavigateBlind"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria",
					"canDarkRoomNavigate",
					"keys|5"
				 ],
				 "anyOf": [
					"mirrorshield",
					"byrna",
					"cape"
				 ]
			  }
		   },
		   "Turtle Rock - Eye Bridge - Top Left": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"bigkey",
					"keys|4",
					"canOpenBonkWalls",
					"canDarkRoomNavigateBlind"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria",
					"canDarkRoomNavigate",
					"keys|5"
				 ],
				 "anyOf": [
					"mirrorshield",
					"byrna",
					"cape"
				 ]
			  }
		   },
		   "Turtle Rock - Eye Bridge - Top Right": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"bigkey",
					"keys|4",
					"canOpenBonkWalls",
					"canDarkRoomNavigateBlind"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria",
					"canDarkRoomNavigate",
					"keys|5"
				 ],
				 "anyOf": [
					"mirrorshield",
					"byrna",
					"cape"
				 ]
			  }
		   },
		   "Turtle Rock - Pokey 1 Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"keys|1",
					"canKillMostEnemies"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"keys|1",
					"somaria"
				 ]
			  }
		   },
		   "Turtle Rock - Pokey 2 Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"keys|3",
					"canKillMostEnemies"
				 ],
				 "anyOf": [
					"somaria",
					"canHoverAlot"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain",
					"somaria",
					"keys|3"
				 ]
			  }
		   },
		   "Turtle Rock - Roller Room - Left": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"somaria",
					"firerod"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain"
				 ]
			  }
		   },
		   "Turtle Rock - Roller Room - Right": {
			  "always": {
				 "allOf": [
					"canBreachTurtleRockMainMaybe",
					"somaria",
					"firerod"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachTurtleRockMain"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachTurtleRockMain"
				 ]
			  }
		   }
		},
		"Turtle Rock - Entrance": {
		   "Turtle Rock - Big Chest": {
			  "logical": {
				 "allOf": [
					"bigkey",
					"canReachTurtleEast"
				 ],
				 "anyOf": [
					"somaria",
					"hookshot"
				 ]
			  }
		   },
		   "Turtle Rock - Big Key Chest": {
			  "logical": {
				 "anyOf": [
					{
					   "allOf": [
						  "canReachTurtleRockMain",
						  "keys|6",
						  "somaria"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleEast",
						  "keys|6",
						  {
							 "anyOf": [
								"hookshot",
								"somaria"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleWest",
						  "keys|6"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleBack",
						  "keys|6",
						  "somaria",
						  "lantern",
						  "canOpenBonkWalls"
					   ]
					}
				 ]
			  }
		   },
		   "Turtle Rock - Boss": {
			  "logical": {
				 "allOf": [
					"somaria",
					"bigkey",
					"keys|6",
					"canKillBoss"
				 ],
				 "anyOf": [
					"canReachTurtleBack",
					{
					   "allOf": [
						  "canDarkRoomNavigate",
						  "canOpenBonkWalls",
						  {
							 "anyOf": [
								"canReachTurtleRockMain",
								"canReachTurtleEast",
								"canReachTurtleWest"
							 ]
						  }
					   ]
					}
				 ]
			  }
		   },
		   "Turtle Rock - Chain Chomps": {
			  "logical": {
				 "anyOf": [
					{
					   "allOf": [
						  "canReachTurtleRockMain",
						  "somaria",
						  "keys|3"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleEast",
						  {
							 "anyOf": [
								"somaria",
								"hookshot"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleWest"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleBack",
						  "somaria",
						  "lantern",
						  "canOpenBonkWalls"
					   ]
					}
				 ]
			  }
		   },
		   "Turtle Rock - Compass Chest": {
			  "logical": {
				 "allOf": [
					"somaria"
				 ],
				 "anyOf": [
					"canReachTurtleRockMain",
					{
					   "allOf": [
						  "keys|6",
						  {
							 "anyOf": [
								"canReachTurtleEast",
								"canReachTurtleWest",
								{
								   "allOf": [
									  "canReachTurtleBack",
									  "lantern",
									  "canOpenBonkWalls"
								   ]
								}
							 ]
						  }
					   ]
					}
				 ]
			  }
		   },
		   "Turtle Rock - Crystaroller Room": {
			  "logical": {
				 "anyOf": [
					{
					   "allOf": [
						  "canReachTurtleRockMain",
						  "somaria",
						  "bigkey",
						  "keys|3",
						  "canOpenBonkWalls"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleEast",
						  "bigkey",
						  "canOpenBonkWalls",
						  {
							 "anyOf": [
								"somaria",
								"hookshot"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleWest",
						  "bigkey",
						  "canOpenBonkWalls"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleBack",
						  "somaria",
						  "bigkey",
						  "lantern"
					   ]
					}
				 ]
			  }
		   },
		   "Turtle Rock - Eye Bridge - Bottom Left": {
			  "logical": {
				 "allOf": [
					{
					   "anyOf": [
						  "canReachTurtleBack",
						  {
							 "allOf": [
								"somaria",
								"lantern",
								"bigkey",
								"canOpenBonkWalls",
								"keys|5",
								{
								   "anyOf": [
									  "canReachTurtleRockMain",
									  "canReachTurtleEast",
									  "canReachTurtleWest"
								   ]
								}
							 ]
						  }
					   ]
					}
				 ],
				 "anyOf": [
					"mirrorshield",
					"byrna",
					"cape"
				 ]
			  }
		   },
		   "Turtle Rock - Eye Bridge - Bottom Right": {
			  "logical": {
				 "allOf": [
					{
					   "anyOf": [
						  "canReachTurtleBack",
						  {
							 "allOf": [
								"somaria",
								"lantern",
								"bigkey",
								"canOpenBonkWalls",
								"keys|5",
								{
								   "anyOf": [
									  "canReachTurtleRockMain",
									  "canReachTurtleEast",
									  "canReachTurtleWest"
								   ]
								}
							 ]
						  }
					   ]
					}
				 ],
				 "anyOf": [
					"mirrorshield",
					"byrna",
					"cape"
				 ]
			  }
		   },
		   "Turtle Rock - Eye Bridge - Top Left": {
			  "logical": {
				 "allOf": [
					{
					   "anyOf": [
						  "canReachTurtleBack",
						  {
							 "allOf": [
								"somaria",
								"lantern",
								"bigkey",
								"canOpenBonkWalls",
								"keys|5",
								{
								   "anyOf": [
									  "canReachTurtleRockMain",
									  "canReachTurtleEast",
									  "canReachTurtleWest"
								   ]
								}
							 ]
						  }
					   ]
					}
				 ],
				 "anyOf": [
					"mirrorshield",
					"byrna",
					"cape"
				 ]
			  }
		   },
		   "Turtle Rock - Eye Bridge - Top Right": {
			  "logical": {
				 "allOf": [
					{
					   "anyOf": [
						  "canReachTurtleBack",
						  {
							 "allOf": [
								"somaria",
								"lantern",
								"bigkey",
								"canOpenBonkWalls",
								"keys|5",
								{
								   "anyOf": [
									  "canReachTurtleRockMain",
									  "canReachTurtleEast",
									  "canReachTurtleWest"
								   ]
								}
							 ]
						  }
					   ]
					}
				 ],
				 "anyOf": [
					"mirrorshield",
					"byrna",
					"cape"
				 ]
			  }
		   },
		   "Turtle Rock - Pokey 1 Key Drop": {
			  "logical": {
				 "allOf": [
					"canKillMostEnemies",
					"keys|5"
				 ],
				 "anyOf": [
					{
					   "allOf": [
						  "canReachTurtleRockMain",
						  "somaria"
					   ]
					},
					"canReachTurtleWest",
					{
					   "allOf": [
						  "canReachTurtleEast",
						  {
							 "anyOf": [
								"somaria",
								"hookshot"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleBack",
						  "somaria",
						  "lantern",
						  "canOpenBonkWalls"
					   ]
					}
				 ]
			  }
		   },
		   "Turtle Rock - Pokey 2 Key Drop": {
			  "logical": {
				 "allOf": [
					"canKillMostEnemies"
				 ],
				 "anyOf": [
					{
					   "allOf": [
						  "canReachTurtleRockMain",
						  "somaria",
						  "keys|3"
					   ]
					},
					"canReachTurtleWest",
					{
					   "allOf": [
						  "canReachTurtleEast",
						  {
							 "anyOf": [
								"somaria",
								"hookshot"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleBack",
						  "somaria",
						  "lantern",
						  "canOpenBonkWalls"
					   ]
					}
				 ]
			  }
		   },
		   "Turtle Rock - Roller Room - Left": {
			  "logical": {
				 "allOf": [
					"somaria",
					"firerod"
				 ],
				 "anyOf": [
					"canReachTurtleRockMain",
					{
					   "allOf": [
						  "canReachTurtleEast",
						  "keys|6"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleWest",
						  "keys|6"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleBack",
						  "lantern",
						  "canOpenBonkWalls",
						  "keys|6"
					   ]
					}
				 ]
			  }
		   },
		   "Turtle Rock - Roller Room - Right": {
			  "logical": {
				 "allOf": [
					"somaria",
					"firerod"
				 ],
				 "anyOf": [
					"canReachTurtleRockMain",
					{
					   "allOf": [
						  "canReachTurtleEast",
						  "keys|6"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleWest",
						  "keys|6"
					   ]
					},
					{
					   "allOf": [
						  "canReachTurtleBack",
						  "lantern",
						  "canOpenBonkWalls",
						  "keys|6"
					   ]
					}
				 ]
			  }
		   }
		},
		"Misery Mire": {
		   "Misery Mire - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes",
					"bigkey"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachMiseryMire"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire"
				 ]
			  }
		   },
		   "Misery Mire - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes",
					"canLightFires",
					"keys|2"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachMiseryMire",
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire",
					"keys|6"
				 ]
			  }
		   },
		   "Misery Mire - Boss": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes",
					"bigkey",
					"somaria",
					"canKillBoss",
					"canDarkRoomNavigateBlind"
				 ],
				 "anyOf": [
					"canUseBombs",
					"canFireSpooky"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachMiseryMire"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire",
					"canDarkRoomNavigate",
					"canUseBombs"
				 ]
			  }
		   },
		   "Misery Mire - Bridge Chest": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachMiseryMire"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire"
				 ]
			  }
		   },
		   "Misery Mire - Compass Chest": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes",
					"canLightFires",
					"keys|2"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachMiseryMire",
					"keys|3"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire",
					"keys|6"
				 ]
			  }
		   },
		   "Misery Mire - Conveyor Crystal Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes",
					"keys|1"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachMiseryMire",
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire",
					"keys|5"
				 ]
			  }
		   },
		   "Misery Mire - Fishbone Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes"
				 ],
				 "anyOf": [
					"keys|2",
					"bigkey"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachMiseryMire"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire"
				 ],
				 "anyOf": [
					"keys|5",
					"bigkey"
				 ]
			  }
		   },
		   "Misery Mire - Main Lobby": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes"
				 ],
				 "anyOf": [
					"keys|1",
					"bigkey"
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachMiseryMire",
					"keys|1",
					"bigkey"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire"
				 ],
				 "anyOf": [
					"keys|2",
					"bigkey"
				 ]
			  }
		   },
		   "Misery Mire - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes"
				 ],
				 "anyOf": [
					"keys|1",
					"bigkey"
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBreachMiseryMire",
					"keys|1",
					"bigkey"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire"
				 ],
				 "anyOf": [
					"keys|2",
					"bigkey"
				 ]
			  }
		   },
		   "Misery Mire - Spike Chest": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachMiseryMire"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire"
				 ]
			  }
		   },
		   "Misery Mire - Spikes Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachMiseryMireMaybe",
					"canCrossMireGap",
					"canKillWizzrobes"
				 ]
			  },
			  "required": {
				 "allOf": [
					"canBreachMiseryMire"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachMiseryMire"
				 ]
			  }
		   }
		},
		"Ice Palace": {
		   "Ice Palace - Jelly Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"canBurnThings"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace"
				 ]
			  }
		   },
		   "Ice Palace - Compass Chest": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"keys|1",
					"canBurnThings",
					"canKillOrExplodeMostEnemies"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace"
				 ]
			  }
		   },
		   "Ice Palace - Conveyor Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"canBurnThings",
					"keys|1"
				 ],
				 "anyOf": [
					"canUseBombs",
					{
					   "allOf": [
						  "canIceBreak",
						  "keys|3"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canUseBombs",
					{
					   "allOf": [
						  "canIceBreak",
						  "keys|3"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace",
					"canUseBombs"
				 ]
			  }
		   },
		   "Ice Palace - Freezor Chest": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"canBurnThings",
					"keys|2"
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canUseBombs",
					"canIceBreak"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace",
					"canUseBombs"
				 ]
			  }
		   },
		   "Ice Palace - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"bigkey",
					"keys|2",
					"canBurnThings"
				 ],
				 "anyOf": [
					"canUseBombs",
					{
					   "allOf": [
						  "canIceBreak",
						  "canHookClip"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace",
					"canUseBombs"
				 ]
			  }
		   },
		   "Ice Palace - Spike Room": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"keys|1",
					"canBurnThings"
				 ],
				 "anyOf": [
					"canIceBreak",
					{
					   "allOf": [
						  "canUseBombs",
						  "keys|2",
						  {
							 "anyOf": [
								"hookshot",
								"keys|3"
							 ]
						  }
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace",
					"keys|2",
					"canUseBombs"
				 ],
				 "anyOf": [
					"keys|6",
					"hookshot"
				 ]
			  }
		   },
		   "Ice Palace - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"keys|1",
					"canBurnThings",
					"glove",
					"hammer"
				 ],
				 "anyOf": [
					"canIceBreak",
					{
					   "allOf": [
						  "canUseBombs",
						  "keys|2",
						  {
							 "anyOf": [
								"hookshot",
								"keys|3"
							 ]
						  }
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace",
					"keys|2",
					"canUseBombs"
				 ],
				 "anyOf": [
					"keys|6",
					"hookshot"
				 ]
			  }
		   },
		   "Ice Palace - Hammer Block Key Drop": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"keys|1",
					"canBurnThings",
					"glove",
					"hammer"
				 ],
				 "anyOf": [
					"canIceBreak",
					{
					   "allOf": [
						  "canUseBombs",
						  "keys|2",
						  {
							 "anyOf": [
								"hookshot",
								"keys|3"
							 ]
						  }
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace",
					"keys|2",
					"canUseBombs"
				 ],
				 "anyOf": [
					"keys|6",
					"hookshot"
				 ]
			  }
		   },
		   "Ice Palace - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"keys|1",
					"canBurnThings"
				 ],
				 "anyOf": [
					"canIceBreak",
					{
					   "allOf": [
						  "keys|2",
						  "canUseBombs",
						  "glove",
						  "hammer",      
						  {
							 "anyOf": [
								"hookshot",
								"keys|3"
							 ]
						  }
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace",
					"keys|2",
					"canUseBombs",
					"glove",
					"hammer"
				 ],
				 "anyOf": [
					"keys|6",
					"hookshot"
				 ]
			  }
		   },
		   "Ice Palace - Many Pots Pot Key": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"keys|2",
					"canBurnThings"
				 ],
				 "anyOf": [
					"canUseBombs",
					"canIceBreak"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace",
					"keys|2",
					"canUseBombs"
				 ]
			  }
		   },
		   "Ice Palace - Iced T Room": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"keys|2",
					"canBurnThings"
				 ],
				 "anyOf": [
					"canUseBombs",
					"canIceBreak"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachIcePalace",
					"keys|2",
					"canUseBombs"
				 ]
			  }
		   },
		   "Ice Palace - Boss": {
			  "always": {
				 "allOf": [
					"canBreachIcePalace",
					"keys|2",
					"canBurnThings",
					"glove",
					"hammer",
					"canKillBoss"
				 ],
				 "anyOf": [
					"canIceBreak",
					{
					   "allOf": [
						  "canUseBombs",
						  {
							 "anyOf": [
								"canBombJump",
								{
								   "allOf": [
									  "bigkey",
									  "keys|3"
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
					"canReachIcePalace",
					"bigkey",
					"keys|5",
					"canUseBombs"
				 ],
				 "anyOf": [
					"keys|6",
					"somaria"
				 ]
			  }
		   }
		},
		"Palace of Darkness": {
		   "Palace of Darkness - Big Chest": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness",
					"bigkey",
					"keys|2"
				 ],
				 "anyOf": [
					{
					   "anyOf": [
						  "canBombJump",
						  "canHoverAlot"
					   ]
					},
					{
					   "allOf": [
						  "keys|5",
						  "canUseBombs",
						  "canDarkRoomNavigateBlind"
					   ]
					}
				 ]
			  },
			  "required": {
				 "anyOf": [
					{
					   "allOf": [
						  "keys|2",
						  {
							 "anyOf": [
								"canBombJump",
								"canHoverAlot"
							 ]
						  }
					   ]
					},
					{
					   "allOf": [
						  "keys|5",
						  "canUseBombs",
						  "canDarkRoomNavigateBlind"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"keys|6",
					"canDarkRoomNavigate",
					"canUseBombs"
				 ]
			  }
		   },
		   "Palace of Darkness - Big Key Chest": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness",
					"keys|1",
					"canUseBombs"
				 ],
				 "anyOf": [
					"keys|2",
					{
					   "allOf": [
						  "canRushRightSidePod"
					   ]
					}
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"keys|6",
					"canUseBombs"
				 ]
			  }
		   },
		   "Palace of Darkness - Boss": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness",
					"bigkey",
					"keys|1",
					"canKillBoss",
					"bow",
					"hammer",
					"canDarkRoomNavigateBlind"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"keys|6",
					"canDarkRoomNavigate"
				 ]
			  }
		   },
		   "Palace of Darkness - Compass Chest": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness",
					"keys|2"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"keys|4"
				 ]
			  }
		   },
		   "Palace of Darkness - Dark Basement - Left": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness",
					"keys|2",
					"canTorchRoomNavigateBlind"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"keys|4",
					"canTorchRoomNavigate"
				 ]
			  }
		   },
		   "Palace of Darkness - Dark Basement - Right": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness",
					"keys|2",
					"canTorchRoomNavigateBlind"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|2"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"keys|4",
					"canTorchRoomNavigate"
				 ]
			  }
		   },
		   "Palace of Darkness - Dark Maze - Bottom": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness",
					"keys|2",
					"canDarkRoomNavigateBlind"
				 ],
				 "anyOf": [
					"canBombJump",
					"keys|3"
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBombJump",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"keys|6",
					"canDarkRoomNavigate"
				 ]
			  }
		   },
		   "Palace of Darkness - Dark Maze - Top": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness",
					"keys|2",
					"canDarkRoomNavigateBlind"
				 ],
				 "anyOf": [
					"canBombJump",
					"keys|3"
				 ]
			  },
			  "required": {
				 "anyOf": [
					"canBombJump",
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"keys|6",
					"canDarkRoomNavigate"
				 ]
			  }
		   },
		   "Palace of Darkness - Harmless Hellway": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness",
					"keys|3"
				 ]
			  },
			  "required": {
				 "allOf": [
					"keys|4"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"keys|6"
				 ]
			  }
		   },
		   "Palace of Darkness - Map Chest": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness"
				 ],
				 "anyOf": [
					"canRushRightSidePod",
					{
					   "allOf": [
						  "keys|1",
						  "canHover",
						  "canUseBombs"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"bow",
					"canOpenBonkWalls"
				 ]
			  }
		   },
		   "Palace of Darkness - Shooter Room": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness"
				 ]
			  }
		   },
		   "Palace of Darkness - Stalfos Basement": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness"
				 ],
				 "anyOf": [
					"keys|1",
					"canRushRightSidePod"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness"
				 ],
				 "anyOf": [
					"keys|1",
					"zeroKeyPodders"
				 ]
			  }
		   },
		   "Palace of Darkness - The Arena - Bridge": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness"
				 ],
				 "anyOf": [
					"keys|1",
					"canRushRightSidePod"
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness"
				 ],
				 "anyOf": [
					"keys|1",
					"zeroKeyPodders"
				 ]
			  }
		   },
		   "Palace of Darkness - The Arena - Ledge": {
			  "always": {
				 "allOf": [
					"canBreachPalaceOfDarkness"
				 ],
				 "anyOf": [
					{
					   "allOf": [
						  "canUseBombs",
						  "canRushRightSidePod"
					   ]
					},
					{
					   "allOf": [
						  "keys|1",
						  "canHover"
					   ]
					}
				 ]
			  },
			  "logical": {
				 "allOf": [
					"canReachPalaceOfDarkness",
					"bow",
					"canUseBombs"
				 ]
			  }
		   }
		}
	 };
	const logic_open = {
		"Desert Palace": {
			"Desert Palace - Big Chest": {
				"logical": {
					"allOf": [
						"bigkey"
					]
				}
			},
			"Desert Palace - Big Key Chest": {
				"required": {
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				},
				"logical": {
					"allOf": [
						"keys|1"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				}
			},
			"Desert Palace - Boss": {
				"required": {
					"allOf": [
						"bigkey",
						"canLightFires",
						"canKillBoss",
						"canAccessDesertNorth"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"keys|1",
						"canLightFires",
						"canKillBoss",
						"canAccessDesertNorth"
					]
				}
			},
			"Desert Palace - Compass Chest": {
				"required": {
					"allOf": []
				},
				"logical": {
					"allOf": [
						"keys|1"
					]
				}
			},
			"Desert Palace - Map Chest": {},
			"Desert Palace - Torch": {
				"logical": {
					"allOf": [
						"boots"
					]
				}
			}
		},
		"Castle Tower": {
			"Castle Tower - Dark Maze": {
				"required": {
					"allOf": [
						"keys|1"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				},
				"logical": {
					"allOf": [
						"keys|1",
						"canDarkRoomNavigate",
						"canKillMostEnemies"
					]
				}
			},
			"Castle Tower - Room 03": {
				"required": {
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				},
				"logical": {
					"allOf": [
						"canKillMostEnemies"
					]
				}
			},
			"Castle Tower - Boss": {
				"required": {
					"allOf": [
						"keys|2",
						"canDefeatCurtains",
						{
							"anyOf": [
								"sword",
								"net",
								"hammer"
							]
						}
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				},
				"logical": {
					"allOf": [
						"keys|2",
						"canDarkRoomNavigate",
						"canDefeatCurtains"
					],
					"anyOf": [
						"sword",
						"net",
						"hammer"
					]
				}
			}
		},
		"Eastern Palace": {
			"Eastern Palace - Big Chest": {
				"logical": {
					"allOf": [
						"bigkey"
					]
				}
			},
			"Eastern Palace - Big Key Chest": {
				"required": {
					"allOf": []
				},
				"logical": {
					"allOf": [
						"canDarkRoomNavigate"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				}
			},
			"Eastern Palace - Boss": {
				"required": {
					"allOf": [
						"bigkey",
						"canKillBoss",
						"bow"
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"canKillBoss",
						"canDarkRoomNavigate",
						"bow"
					]
				}
			},
			"Eastern Palace - Cannonball Chest": {},
			"Eastern Palace - Compass Chest": {},
			"Eastern Palace - Map Chest": {}
		},
		"Ganons Tower": {
			"Ganons Tower - Big Chest": {
				"required": {
					"allOf": [
						"bigkey"
					],
					"anyOf": [
						{
							"allOf": [
								"hammer",
								{
									"anyOf": [
										"canHover",
										"hookshot",
										"canBombJump"
									]
								}
							]
						},
						{
							"allOf": [
								"somaria",
								"canLightFires",
								{
									"anyOf": [
										"firerod",
										{
											"anyOf": [
												"canHover",
												"canBombJump"
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
						"keys|3",
						"bigkey"
					],
					"anyOf": [
						"gtleft",
						"gtright"
					]
				}
			},
			"Ganons Tower - Big Key Chest": {
				"required": {
					"allOf": [
						"canUseBombs",
						"canKillArmos"
					],
					"anyOf": [
						{
							"allOf": [
								"hammer",
								{
									"anyOf": [
										"canHover",
										"hookshot",
										"canBombJump"
									]
								}
							]
						},
						{
							"allOf": [
								"somaria",
								"canLightFires",
								{
									"anyOf": [
										"firerod",
										{
											"anyOf": [
												"canHover",
												"canBombJump"
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
						"keys|3",
						"canKillArmos",
						"canUseBombs"
					],
					"anyOf": [
						"gtleft",
						"gtright"
					]
				}
			},
			"Ganons Tower - Big Key Room - Left": {
				"required": {
					"allOf": [
						"canUseBombs",
						"canKillArmos"
					],
					"anyOf": [
						{
							"allOf": [
								"hammer",
								{
									"anyOf": [
										"canHover",
										"hookshot",
										"canBombJump"
									]
								}
							]
						},
						{
							"allOf": [
								"somaria",
								"canLightFires",
								{
									"anyOf": [
										"firerod",
										{
											"anyOf": [
												"canHover",
												"canBombJump"
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
						"keys|3",
						"canKillArmos",
						"canUseBombs"
					],
					"anyOf": [
						"gtleft",
						"gtright"
					]
				}
			},
			"Ganons Tower - Big Key Room - Right": {
				"required": {
					"allOf": [
						"canUseBombs",
						"canKillArmos"
					],
					"anyOf": [
						{
							"allOf": [
								"hammer",
								{
									"anyOf": [
										"canHover",
										"hookshot",
										"canBombJump"
									]
								}
							]
						},
						{
							"allOf": [
								"somaria",
								"canLightFires",
								{
									"anyOf": [
										"firerod",
										{
											"anyOf": [
												"canHover",
												"canBombJump"
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
						"keys|3",
						"canKillArmos",
						"canUseBombs"
					],
					"anyOf": [
						"gtleft",
						"gtright"
					]
				}
			},
			"Ganons Tower - Bob's Chest": {
				"required": {
					"anyOf": [
						{
							"allOf": [
								"hammer",
								{
									"anyOf": [
										"canHover",
										"hookshot",
										"canBombJump"
									]
								}
							]
						},
						{
							"allOf": [
								"somaria",
								"canLightFires",
								{
									"anyOf": [
										"firerod",
										{
											"anyOf": [
												"canHover",
												"canBombJump"
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
						"keys|3"
					],
					"anyOf": [
						"gtleft",
						"gtright"
					]
				}
			},
			"Ganons Tower - Bob's Torch": {
				"logical": {
					"allOf": [
						"boots"
					]
				}
			},
			"Ganons Tower - Compass Room - Bottom Left": {
				"required": {
					"allOf": [
						"somaria",
						"canLightFires"
					],
					"anyOf": [
						"firerod",
						{
							"anyOf": [
								"canHover",
								"canBombJump"
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|4",
						"somaria",
						"firerod"
					]
				}
			},
			"Ganons Tower - Compass Room - Bottom Right": {
				"required": {
					"allOf": [
						"somaria",
						"canLightFires"
					],
					"anyOf": [
						"firerod",
						{
							"anyOf": [
								"canHover",
								"canBombJump"
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|4",
						"somaria",
						"firerod"
					]
				}
			},
			"Ganons Tower - Compass Room - Top Left": {
				"required": {
					"allOf": [
						"somaria",
						"canLightFires"
					],
					"anyOf": [
						"firerod",
						{
							"anyOf": [
								"canHover",
								"canBombJump"
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|4",
						"somaria",
						"firerod"
					]
				}
			},
			"Ganons Tower - Compass Room - Top Right": {
				"required": {
					"allOf": [
						"somaria",
						"canLightFires"
					],
					"anyOf": [
						"firerod",
						{
							"anyOf": [
								"canHover",
								"canBombJump"
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|4",
						"somaria",
						"firerod"
					]
				}
			},
			"Ganons Tower - Conveyor Star Pits Pot Key": {},
			"Ganons Tower - DMs Room - Bottom Left": {
				"required": {
					"allOf": [
						"hammer"
					],
					"anyOf": [
						"hookshot",
						"canHover",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"hammer",
						"hookshot"
					]
				}
			},
			"Ganons Tower - DMs Room - Bottom Right": {
				"required": {
					"allOf": [
						"hammer"
					],
					"anyOf": [
						"hookshot",
						"canHover",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"hammer",
						"hookshot"
					]
				}
			},
			"Ganons Tower - DMs Room - Top Left": {
				"required": {
					"allOf": [
						"hammer"
					],
					"anyOf": [
						"hookshot",
						"canHover",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"hammer",
						"hookshot"
					]
				}
			},
			"Ganons Tower - DMs Room - Top Right": {
				"required": {
					"allOf": [
						"hammer"
					],
					"anyOf": [
						"hookshot",
						"canHover",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"hammer",
						"hookshot"
					]
				}
			},
			"Ganons Tower - Firesnake Room": {
				"required": {
					"allOf": [
						"hammer",
						"keys|1"
					],
					"anyOf": [
						"hookshot",
						"canHover",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"hammer",
						"hookshot",
						"keys|3"
					]
				}
			},
			"Ganons Tower - Hope Room - Left": {},
			"Ganons Tower - Hope Room - Right": {},
			"Ganons Tower - Map Chest": {
				"required": {
					"allOf": [
						"hammer"
					],
					"anyOf": [
						"hookshot",
						"boots",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"keys|4"
					],
					"anyOf": [
						"boots",
						"hookshot"
					]
				}
			},

			"Ganons Tower - Mini Helmasaur Room - Left": {
				"required": {
					"allOf": [
						"bigkey",
						"canLightFires"
					],
					"anyOf": [
						"bow",
						{
							"allOf": [
								"canMimicClip",
								"canKillMostEnemies"
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"canLightFires",
						"bow"
					]
				}
			},
			"Ganons Tower - Mini Helmasaur Room - Right": {
				"required": {
					"allOf": [
						"bigkey",
						"canLightFires"
					],
					"anyOf": [
						"bow",
						{
							"allOf": [
								"canMimicClip",
								"canKillMostEnemies"
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"canLightFires",
						"bow"
					]
				}
			},
			"Ganons Tower - Pre-Moldorm Chest": {
				"required": {
					"allOf": [
						"bigkey",
						"canLightFires",
						"canUseBombs"
					],
					"anyOf": [
						"bow",
						{
							"allOf": [
								"canMimicClip",
								"canKillMostEnemies"
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|3",
						"bigkey",
						"canLightFires",
						"bow",
						"canUseBombs"
					]
				}
			},
			"Ganons Tower - Randomizer Room - Bottom Left": {
				"required": {
					"allOf": [
						"hammer",
						"canUseBombs"
					],
					"anyOf": [
						"hookshot",
						"canHover",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"hammer",
						"hookshot",
						"keys|4",
						"canUseBombs"
					]
				}
			},
			"Ganons Tower - Randomizer Room - Bottom Right": {
				"required": {
					"allOf": [
						"hammer",
						"canUseBombs"
					],
					"anyOf": [
						"hookshot",
						"canHover",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"hammer",
						"hookshot",
						"keys|4",
						"canUseBombs"
					]
				}
			},
			"Ganons Tower - Randomizer Room - Top Left": {
				"required": {
					"allOf": [
						"hammer",
						"canUseBombs"
					],
					"anyOf": [
						"hookshot",
						"canHover",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"hammer",
						"hookshot",
						"keys|4",
						"canUseBombs"
					]
				}
			},
			"Ganons Tower - Randomizer Room - Top Right": {
				"required": {
					"allOf": [
						"hammer",
						"canUseBombs"
					],
					"anyOf": [
						"hookshot",
						"canHover",
						"canBombJump"
					]
				},
				"logical": {
					"allOf": [
						"hammer",
						"hookshot",
						"keys|4",
						"canUseBombs"
					]
				}
			},
			"Ganons Tower - Tile Room": {
				"logical": {
					"allOf": [
						"somaria"
					]
				}
			},
			"Ganons Tower - Validation Chest": {
				"required": {
					"allOf": [
						"bigkey",
						"canLightFires",
						"melee",
						"canUseBombs",
						{
							"anyOf": [
								"bow",
								"canMimicClip"
							]
						}
					],
					"anyOf": [
						"hookshot",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"bow",
						"keys|4",
						"bigkey",
						"canLightFires",
						"melee",
						"hookshot",
						"canUseBombs"
					]
				}
			},
			"Ganons Tower - Boss": {
				"required": {
					"allOf": [
						"bigkey",
						"canKillBoss",
						"canLightFires",
						"canUseBombs",
						{
							"anyOf": [
								{
									"allOf": [
										"melee",
										"hookshot"
									]
								},
								"canHover",
								"canMoldormBounce"
							]
						}
					],
					"anyOf": [
						"bow",
						"canMimicClip"
					]
				},
				"logical": {
					"allOf": [
						"bow",
						"keys|4",
						"bigkey",
						"canLightFires",
						"melee",
						"hookshot",
						"canUseBombs"
					]
				}
			}
		},
		"Hyrule Castle": {
			"Hyrule Castle - Boomerang Chest": {
				"required": {
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				},
				"logical": {
					"allOf": [
						"keys|1"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				}
			},
			"Hyrule Castle - Map Chest": {},
			"Hyrule Castle - Zelda's Chest": {
				"required": {
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				},
				"logical": {
					"allOf": [
						"keys|1"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				}
			},
			"Sewers - Dark Cross": {
				"required": {
					"allOf": []
				},
				"logical": {
					"allOf": [
						"canDarkRoomNavigate"
					]
				}
			},
			"Sewers - Secret Room - Left": {
				"required": {
					"allOf": [
						"canOpenBonkWalls"
					]
				},
				"logical": {
					"allOf": [
						"canOpenBonkWalls"
					],
					"anyOf": [
						"glove",
						{
							"allOf": [
								"canDarkRoomNavigate",
								"keys|1"
							]
						}
					]
				}
			},
			"Sewers - Secret Room - Middle": {
				"required": {
					"allOf": [
						"canOpenBonkWalls"
					]
				},
				"logical": {
					"allOf": [
						"canOpenBonkWalls"
					],
					"anyOf": [
						"glove",
						{
							"allOf": [
								"canDarkRoomNavigate",
								"keys|1"
							]
						}
					]
				}
			},
			"Sewers - Secret Room - Right": {
				"required": {
					"allOf": [
						"canOpenBonkWalls"
					]
				},
				"logical": {
					"allOf": [
						"canOpenBonkWalls"
					],
					"anyOf": [
						"glove",
						{
							"allOf": [
								"canDarkRoomNavigate",
								"keys|1"
							]
						}
					]
				}
			},
			"Sanctuary": {}
		},
		"Skull Woods": {
			"Skull Woods - Big Chest": {
				"required": {
					"allOf": [
						"bigkey"
					],
					"anyOf": [
						"canUseBombs",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"canUseBombs"
					]
				}
			},
			"Skull Woods - Big Key Chest": {},
			"Skull Woods - Boss": {
				"required": {
					"allOf": [
						"canDefeatCurtains",
						"canKillBoss"
					],
					"anyOf": [
						"canUseBombs",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"keys|3",
						"canKillBoss",
						"canDefeatCurtains",
						"firerod"
					]
				}
			},
			"Skull Woods - Bridge Room": {
				"logical": {
					"allOf": [
						"firerod"
					]
				}
			},
			"Skull Woods - Compass Chest": {},
			"Skull Woods - Map Chest": {},
			"Skull Woods - Pinball Room": {},
			"Skull Woods - Pot Prison": {}
		},
		"Swamp Palace": {
			"Swamp Palace - Big Chest": {
				"required": {
					"allOf": [
						"bigkey",
						"keys|1",
						"flippers"
					],
					"anyOf": [
						"canSpeckyClip",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"keys|1",
						"hammer",
						"flippers"
					]
				}
			},
			"Swamp Palace - Big Key Chest": {
				"required": {
					"allOf": [
						"flippers",
						"keys|1"
					],
					"anyOf": [
						"canSpeckyClip",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"keys|1",
						"hammer",
						"flippers"
					]
				}
			},
			"Swamp Palace - West Chest": {
				"required": {
					"allOf": [
						"flippers",
						"keys|1"
					],
					"anyOf": [
						"canSpeckyClip",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"keys|1",
						"hammer",
						"flippers"
					]
				}
			},
			"Swamp Palace - Boss": {
				"required": {
					"allOf": [
						"flippers",
						"hookshot",
						"keys|1",
						"canKillBoss"
					],
					"anyOf": [
						"canSpeckyClip",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"keys|1",
						"hammer",
						"flippers",
						"hookshot",
						"canKillBoss"
					]
				}
			},
			"Swamp Palace - Compass Chest": {
				"required": {
					"allOf": [
						"flippers",
						"keys|1"
					],
					"anyOf": [
						"canSpeckyClip",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"keys|1",
						"hammer",
						"flippers"
					]
				}
			},
			"Swamp Palace - Entrance": {
				"logical": {
					"allOf": [
						"flippers"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				}
			},
			"Swamp Palace - Flooded Room - Left": {
				"required": {
					"allOf": [
						"flippers",
						"keys|1",
						"hookshot"
					],
					"anyOf": [
						"canSpeckyClip",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"keys|1",
						"hammer",
						"flippers",
						"hookshot"
					]
				}
			},
			"Swamp Palace - Flooded Room - Right": {
				"required": {
					"allOf": [
						"flippers",
						"keys|1",
						"hookshot"
					],
					"anyOf": [
						"canSpeckyClip",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"keys|1",
						"hammer",
						"flippers",
						"hookshot"
					]
				}
			},
			"Swamp Palace - Map Chest": {
				"logical": {
					"allOf": [
						"keys|1",
						"canUseBombs",
						"flippers"
					]
				}
			},
			"Swamp Palace - Waterfall Room": {
				"required": {
					"allOf": [
						"flippers",
						"keys|1",
						"hookshot"
					],
					"anyOf": [
						"canSpeckyClip",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"keys|1",
						"hammer",
						"flippers",
						"hookshot"
					]
				}
			}
		},
		"Thieves' Town": {
			"Thieves' Town - Ambush Chest": {},
			"Thieves' Town - Attic": {
				"required": {
					"allOf": [
						"bigkey"
					]
				},
				"logical": {
					"allOf": [
						"keys|1",
						"bigkey"
					]
				}
			},
			"Thieves' Town - Big Chest": {
				"required": {
					"allOf": [
						"bigkey",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"keys|1",
						"hammer"
					]
				}
			},
			"Thieves' Town - Big Key Chest": {},
			"Thieves' Town - Blind's Cell": {
				"logical": {
					"allOf": [
						"bigkey"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs",
						"glove"
					]
				}
			},
			"Thieves' Town - Boss": {
				"required": {
					"allOf": [
						"bigkey",
						"canUseBombs",
						"canKillBoss"
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"keys|1",
						"canKillBoss",
						"canUseBombs"
					]
				}
			},
			"Thieves' Town - Compass Chest": {},
			"Thieves' Town - Map Chest": {}
		},
		"Tower of Hera": {
			"Tower of Hera - Basement Cage": {},
			"Tower of Hera - Big Chest": {
				"required": {
					"allOf": [
						"bigkey"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs",
						"canHeraPot"
					]
				},
				"logical": {
					"allOf": [
						"bigkey"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				}
			},
			"Tower of Hera - Big Key Chest": {
				"logical": {
					"allOf": [
						"keys|1",
						"canLightFires"
					]
				}
			},
			"Tower of Hera - Boss": {
				"required": {
					"allOf": [
						"canKillBoss"
					],
					"anyOf": [
						"canHeraPot",
						{
							"allOf": [
								"bigkey",
								{
									"anyOf": [
										"canKillMostEnemies",
										"canUseBombs"
									]
								}
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"canKillBoss"
					]
				}
			},
			"Tower of Hera - Compass Chest": {
				"required": {
					"anyOf": [
						"canHeraPot",
						{
							"allOf": [
								"bigkey",
								{
									"anyOf": [
										"canKillMostEnemies",
										"canUseBombs"
									]
								}
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"bigkey"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				}
			},
			"Tower of Hera - Map Chest": {}
		},
		"Turtle Rock": {
			"Turtle Rock - Big Chest": {
				"required": {
					"allOf": [
						"bigkey",
						"keys|2",
						"canUseBombs"
					],
					"anyOf": [
						"somaria",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"somaria",
						"bigkey",
						"keys|2",
						"canUseBombs"
					]
				}
			},
			"Turtle Rock - Big Key Chest": {
				"required": {
					"allOf": [
						"keys|2"
					],
					"anyOf": [
						"somaria",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"somaria",
						"keys|4"
					]
				}
			},
			"Turtle Rock - Boss": {
				"required": {
					"allOf": [
						"bigkey",
						"keys|3",
						"canKillBoss",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"canHover",
						"somaria"
					]
				},
				"logical": {
					"allOf": [
						"somaria",
						"bigkey",
						"keys|4",
						"canDarkRoomNavigate",
						"canKillBoss",
						"canOpenBonkWalls"
					]
				}
			},
			"Turtle Rock - Chain Chomps": {
				"required": {
					"allOf": [
						"keys|1"
					],
					"anyOf": [
						"somaria",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"somaria",
						"keys|1"
					]
				}
			},
			"Turtle Rock - Compass Chest": {
				"required": {
					"anyOf": [
						"somaria",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"somaria"
					]
				}
			},
			"Turtle Rock - Crystaroller Room": {
				"required": {
					"allOf": [
						"bigkey",
						"keys|2",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"somaria",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"somaria",
						"bigkey",
						"keys|2",
						"canOpenBonkWalls"
					]
				}
			},
			"Turtle Rock - Eye Bridge - Bottom Left": {
				"required": {
					"allOf": [
						"bigkey",
						"keys|2",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"somaria",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"somaria",
						"canDarkRoomNavigate",
						"bigkey",
						"keys|3",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"mirrorshield",
						"byrna",
						"cape"
					]
				}
			},
			"Turtle Rock - Eye Bridge - Bottom Right": {
				"required": {
					"allOf": [
						"bigkey",
						"keys|2",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"somaria",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"somaria",
						"canDarkRoomNavigate",
						"bigkey",
						"keys|3",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"mirrorshield",
						"byrna",
						"cape"
					]
				}
			},
			"Turtle Rock - Eye Bridge - Top Left": {
				"required": {
					"allOf": [
						"bigkey",
						"keys|2",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"somaria",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"somaria",
						"canDarkRoomNavigate",
						"bigkey",
						"keys|3",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"mirrorshield",
						"byrna",
						"cape"
					]
				}
			},
			"Turtle Rock - Eye Bridge - Top Right": {
				"required": {
					"allOf": [
						"bigkey",
						"keys|2",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"somaria",
						"canHover"
					]
				},
				"logical": {
					"allOf": [
						"somaria",
						"canDarkRoomNavigate",
						"bigkey",
						"keys|3",
						"canOpenBonkWalls"
					],
					"anyOf": [
						"mirrorshield",
						"byrna",
						"cape"
					]
				}
			},
			"Turtle Rock - Roller Room - Left": {
				"logical": {
					"allOf": [
						"somaria",
						"firerod"
					]
				}
			},
			"Turtle Rock - Roller Room - Right": {
				"logical": {
					"allOf": [
						"somaria",
						"firerod"
					]
				}
			}
		},
		"Misery Mire": {
			"Misery Mire - Big Chest": {
				"logical": {
					"allOf": [
						"bigkey",
						"canKillWizzrobes",
						"canCrossMireGap"
					]
				}
			},
			"Misery Mire - Big Key Chest": {
				"required": {
					"allOf": [
						"canKillWizzrobes",
						"canLightFires",
						"canCrossMireGap"
					]
				},
				"logical": {
					"allOf": [
						"keys|3",
						"canKillWizzrobes",
						"canLightFires",
						"canCrossMireGap"
					]
				}
			},
			"Misery Mire - Boss": {
				"required": {
					"allOf": [
						"canCrossMireGap",
						"bigkey",
						"canKillBoss",
						"somaria"
					],
					"anyOf": [
						"canUseBombs",
						"canFireSpooky"
					]
				},
				"logical": {
					"allOf": [
						"canCrossMireGap",
						"bigkey",
						"canKillBoss",
						"canDarkRoomNavigate",
						"canUseBombs",
						"somaria"
					]
				}
			},
			"Misery Mire - Bridge Chest": {
				"logical": {
					"allOf": [
						"canKillWizzrobes",
						"canCrossMireGap"
					]
				}
			},
			"Misery Mire - Compass Chest": {
				"required": {
					"allOf": [
						"canKillWizzrobes",
						"canLightFires",
						"canCrossMireGap"
					]
				},
				"logical": {
					"allOf": [
						"keys|3",
						"canKillWizzrobes",
						"canLightFires",
						"canCrossMireGap"
					]
				}
			},
			"Misery Mire - Main Lobby": {
				"required": {
					"allOf": [
						"canKillWizzrobes",
						"canCrossMireGap"
					]
				},
				"logical": {
					"allOf": [
						"canKillWizzrobes",
						"canCrossMireGap"
					],
					"anyOf": [
						"keys|1",
						"bigkey"
					]
				}
			},
			"Misery Mire - Map Chest": {
				"required": {
					"allOf": [
						"canKillWizzrobes",
						"canCrossMireGap"
					]
				},
				"logical": {
					"allOf": [
						"canKillWizzrobes",
						"canCrossMireGap"
					],
					"anyOf": [
						"keys|1",
						"bigkey"
					]
				}
			},
			"Misery Mire - Spike Chest": {
				"logical": {
					"allOf": [
						"canKillWizzrobes",
						"canCrossMireGap"
					]
				}
			}
		},
		"Ice Palace": {
			"Ice Palace - Compass Chest": {
				"logical": {
					"allOf": [
						"canBurnThings"
					],
					"anyOf": [
						"canKillMostEnemies",
						"canUseBombs"
					]
				}
			},
			"Ice Palace - Freezor Chest": {
				"required": {
					"allOf": [
						"canBurnThings"
					],
					"anyOf": [
						"canUseBombs",
						{
							"allOf": [
								"canIceBreak",
								{
									"anyOf": [
										"keys|1",
										{
											"allOf": [
												"glove",
												"hammer"
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
						"canBurnThings",
						"canUseBombs"
					]
				}
			},
			"Ice Palace - Big Chest": {
				"required": {
					"allOf": [
						"canBurnThings",
						"bigkey",
						{
							"anyOf": [
								"canUseBombs",
								"hookshot"
							]
						}
					],
					"anyOf": [
						"canUseBombs",
						{
							"allOf": [
								"canIceBreak",
								{
									"anyOf": [
										"keys|1",
										{
											"allOf": [
												"glove",
												"hammer"
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
						"bigkey",
						"canBurnThings",
						"canUseBombs"
					]
				}
			},
			"Ice Palace - Spike Room": {
				"required": {
					"allOf": [
						"canBurnThings"
					],
					"anyOf": [
						"canIceBreak",
						"canUseBombs"
					]
				},
				"logical": {
					"allOf": [
						"canBurnThings",
						"canUseBombs"
					],
					"anyOf": [
						"keys|2",
						"hookshot"
					]
				}
			},
			"Ice Palace - Map Chest": {
				"required": {
					"allOf": [
						"canBurnThings",
						"glove",
						"hammer"
					],
					"anyOf": [
						"canIceBreak",
						"canUseBombs"
					]
				},
				"logical": {
					"allOf": [
						"canBurnThings",
						"canUseBombs",
						"glove",
						"hammer"
					],
					"anyOf": [
						"keys|2",
						"hookshot"
					]
				}
			},
			"Ice Palace - Big Key Chest": {
				"required": {
					"allOf": [
						"canBurnThings"
					],
					"anyOf": [
						"canIceBreak",
						{
							"allOf": [
								"hammer",
								"glove",
								"canUseBombs"
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"canBurnThings",
						"canUseBombs",
						"glove",
						"hammer"
					],
					"anyOf": [
						"keys|2",
						"hookshot"
					]
				}
			},
			"Ice Palace - Iced T Room": {
				"required": {
					"allOf": [
						"canBurnThings"
					],
					"anyOf": [
						"canUseBombs",
						{
							"allOf": [
								"canIceBreak",
								{
									"anyOf": [
										"keys|1",
										{
											"allOf": [
												"glove",
												"hammer"
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
						"canBurnThings",
						"canUseBombs"
					]
				}
			},
			"Ice Palace - Boss": {
				"required": {
					"allOf": [
						"canBurnThings",
						"glove",
						"hammer",
						"canKillBoss"
					],
					"anyOf": [
						"canIceBreak",
						{
							"allOf": [
								"canUseBombs",
								{
									"anyOf": [
										"canBombJump",
										{
											"allOf": [
												"bigkey",
												"somaria"
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
						"bigkey",
						"canBurnThings",
						"canUseBombs",
						"glove",
						"hammer",
						"keys|1",
						"canKillBoss"
					],
					"anyOf": [
						"keys|2",
						"somaria"
					]
				}
			}
		},
		"Palace of Darkness": {
			"Palace of Darkness - Big Chest": {
				"required": {
					"allOf": [
						"bigkey"
					],
					"anyOf": [
						{
							"allOf": [
								"keys|3",
								"canUseBombs"
							]
						},
						{
							"allOf": [
								"keys|2",
								{
									"anyOf": [
										"canBombJump",
										"canHover"
									]
								}
							]
						},
						{
							"allOf": [
								"hammer",
								"canOpenBonkWalls",
								"keys|1",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								},
								{
									"anyOf": [
										"canBombJump",
										"canHover",
										{
											"allOf": [
												"keys|2",
												"canUseBombs"
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
						"bigkey",
						"keys|6",
						"canDarkRoomNavigate",
						"canUseBombs"
					]
				}
			},
			"Palace of Darkness - Big Key Chest": {
				"required": {
					"allOf": [
						"canUseBombs",
						"keys|1"
					],
					"anyOf": [
						"keys|2",
						{
							"allOf": [
								"canOpenBonkWalls",
								"hammer",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|6",
						"canUseBombs"
					]
				}
			},
			"Palace of Darkness - Boss": {
				"required": {
					"allOf": [
						"bigkey",
						"keys|1",
						"canKillBoss",
						"bow",
						"hammer"
					]
				},
				"logical": {
					"allOf": [
						"bigkey",
						"keys|6",
						"canKillBoss",
						"canDarkRoomNavigate",
						"bow",
						"hammer"
					]
				}
			},
			"Palace of Darkness - Compass Chest": {
				"required": {
					"anyOf": [
						"keys|2",
						{
							"allOf": [
								"keys|1",
								"canOpenBonkWalls",
								"hammer",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|4"
					]
				}
			},
			"Palace of Darkness - Dark Basement - Left": {
				"required": {
					"anyOf": [
						"keys|2",
						{
							"allOf": [
								"keys|1",
								"canOpenBonkWalls",
								"hammer",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|4",
						"canDarkRoomNavigate"
					]
				}
			},
			"Palace of Darkness - Dark Basement - Right": {
				"required": {
					"anyOf": [
						"keys|2",
						{
							"allOf": [
								"keys|1",
								"canOpenBonkWalls",
								"hammer",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|4",
						"canDarkRoomNavigate"
					]
				}
			},
			"Palace of Darkness - Dark Maze - Bottom": {
				"allOf": [
					"keys|6",
					"canDarkRoomNavigate"
				]
			},
			"Palace of Darkness - Dark Maze - Top": {
				"allOf": [
					"keys|6",
					"canDarkRoomNavigate"
				]
			},
			"Palace of Darkness - Harmless Hellway": {
				"required": {
					"anyOf": [
						"keys|3",
						{
							"allOf": [
								"keys|2",
								"canOpenBonkWalls",
								"hammer",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"keys|6"
					]
				}
			},
			"Palace of Darkness - Map Chest": {
				"required": {
					"anyOf": [
						{
							"allOf": [
								"keys|1",
								"canHover",
								"canUseBombs"
							]
						},
						{
							"allOf": [
								"canOpenBonkWalls",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"bow",
						"canOpenBonkWalls"
					]
				}
			},
			"Palace of Darkness - Shooter Room": {},
			"Palace of Darkness - Stalfos Basement": {
				"required": {
					"anyOf": [
						"keys|1",
						{
							"allOf": [
								"canOpenBonkWalls",
								"hammer",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						}
					]
				},
				"logical": {
					"anyOf": [
						"keys|1",
						"zeroKeyPodders"
					]
				}
			},
			"Palace of Darkness - The Arena - Bridge": {
				"required": {
					"anyOf": [
						"keys|1",
						{
							"allOf": [
								"canOpenBonkWalls",
								"hammer",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						}
					]
				},
				"logical": {
					"anyOf": [
						"keys|1",
						"zeroKeyPodders"
					]
				}
			},
			"Palace of Darkness - The Arena - Ledge": {
				"required": {
					"anyOf": [
						{
							"allOf": [
								"keys|1",
								"canHover"
							]
						},
						{
							"allOf": [
								"canUseBombs",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						},
						{
							"allOf": [
								"canHover",
								"hammer",
								{
									"anyOf": [
										"bow",
										"canMimicClip",
										"canPotionCameraUnlock"
									]
								}
							]
						}
					]
				},
				"logical": {
					"allOf": [
						"bow",
						"canUseBombs"
					]
				}
			}
		}
	};

	// Location object contains "anyOf" or "allOf" arrays of conditions
	function inLogic(dungeonId, requirements) {
		if (requirements.allOf) {
			for (const requirement of requirements.allOf) {
				if (logicSwitch(dungeonId, requirement) != true) return false;
			}
		}
		if (requirements.anyOf) {
			for (const requirement of requirements.anyOf) {
				if (logicSwitch(dungeonId, requirement) === true) return true;
			}
			return false;
		}
		return true;
	};

	function isDoorsBranch() {
		if (flags.doorshuffle != 'N') return true;
		if (flags.owGraphLogic) return true;
		if (flags.bonkshuffle != 'N') return true;
		return false;
	};

	function logicSwitch(dungeonId, requirement) {
		// If requirement is not a string call inLogic recursively
		if (typeof requirement === 'object') return inLogic(dungeonId, requirement);

		if (requirement.startsWith('keys')) {
			if (flags.gametype === 'R') return true;
			const count = requirement.split('|')[1];
			switch (dungeonId) {
				case 11: var keyname = 'smallkeyhalf0'; break; // HC
				case 12: var keyname = 'smallkeyhalf1'; break; // CT
				default: var keyname = 'smallkey' + dungeonId;
			};
			return items[keyname] >= count;
		};

		if (dungeonId === 11 && requirement === 'bigkey') return items.bigkeyhalf0; // HC
		if (dungeonId === 12 && requirement === 'bigkey') return items.bigkeyhalf1; // CT

		switch (requirement) {
			case 'bigkey': return items['bigkey' + dungeonId];

			case 'boots': return items.boots;
			case 'bow': return items.bow > 1;
			case 'net': return items.net;
			case 'byrna': return items.byrna;
			case 'cape': return items.cape;
			case 'flippers': return items.flippers;
			case 'firerod': return items.firerod;
			case 'glove': return items.glove > 0;
			case 'hammer': return items.hammer;
			case 'hookshot': return items.hookshot;
			case 'icerod': return items.icerod;
			case 'lantern': return items.lantern;
			case 'melee_bow': return items.sword > 0 || items.hammer || items.bow > 1;
			case 'melee': return items.sword > 0 || items.hammer;
			case 'mirrorshield': return items.shield > 2;
			case 'somaria': return items.somaria;
			case 'sword': return items.sword > 0;

			case 'canKillBoss': return enemizer_check(dungeonId) === 'available';
			case 'canKillArmos': return enemizer_check(0) === 'available';
			case 'canUseBombs': return items.bomb;
			case 'canKillMostEnemies': return items.sword > 0 || items.hammer || items.bow > 1 || items.somaria || items.byrna || items.firerod;
			case 'canKillOrExplodeMostEnemies': return items.sword > 0 || items.hammer || items.bow > 1 || items.somaria || items.byrna || items.firerod || items.bomb;
			case 'canFightAgahnim': return items.sword > 0 || items.hammer || items.net;
			case 'canLightFires': return items.lantern || items.firerod;
			case 'canDarkRoomNavigate': return items.lantern;
			case 'canTorchRoomNavigate': return items.lantern || (items.firerod && !isDoorsBranch() && !flags.entrancemode === 'N');
			case 'canDefeatCurtains': return items.sword > 0 || flags.swordmode === 'S';
			case 'canKillWizzrobes': return items.sword > 0 || items.hammer || items.bow > 1 || items.byrna || items.somaria || (items.icerod && (items.bomb || items.hookshot)) || items.firerod;
			case 'canCrossMireGap': return items.boots || items.hookshot;
			case 'canBurnThings': return items.firerod || (items.bombos && items.sword > 0);
			case 'canHitSwitch': return canHitSwitch();
			case 'canHitRangedSwitch': return canHitRangedSwitch();

			case 'canIceBreak': return items.somaria;
			case 'canHookClip': return items.hookshot;
			case 'canBombJump': return items.bomb;
			case 'canHover': return items.boots;
			case 'canHoverAlot': return items.boots;
			case 'canSpeckyClip': return items.bomb && items.hookshot;
			case 'canBombSpooky': return items.bomb;
			case 'canHeraPot': return items.hookshot && (items.boots || items.bomb);
			case 'canOpenBonkWalls': return items.boots || items.bomb;
			case 'canFireSpooky': return items.firerod && items.somaria;
			case 'canMimicClip': return true;
			case 'canPotionCameraUnlock': return items.bottle > 0;
			case 'canMoldormBounce': return items.bomb && items.sword > 0;
			case 'canDarkRoomNavigateBlind': return true || items.lantern;
			case 'canTorchRoomNavigateBlind': return true || (items.lantern || (items.firerod && !isDoorsBranch() && !flags.entrancemode === 'N'));
			case 'canRushRightSidePod': return items.hammer && (items.bomb || items.boots) && (true || items.bow > 1 || items.bottle);

			case 'canReachHyruleCastle': return canReachDungeon('Hyrule Castle - Main') === 'available';
			case 'canReachSewersDropdown': return canReachDungeon('Hyrule Castle - Sewers Dropdown') === 'available';
			case 'canReachSanctuary': return canReachDungeon('Sanctuary') === 'available';
			case 'canReachEasternPalace': return canReachDungeon('Eastern Palace') === 'available';
			case 'canReachDesertPalaceMain': return canReachDungeon('Desert Palace - Main') === 'available';
			case 'canReachDesertPalaceNorth': return canReachDungeon('Desert Palace - North') === 'available';
			case 'canReachTowerOfHera': return canReachDungeon('Tower of Hera') === 'available';
			case 'canReachCastleTower': return canReachDungeon('Castle Tower') === 'available';
			case 'canReachPalaceOfDarkness': return canReachDungeon('Palace of Darkness') === 'available';
			case 'canReachSwampPalace': return canReachDungeon('Swamp Palace') === 'available';
			case 'canReachSkullBack': return canReachDungeon("Skull Woods - Back") === 'available';
			case 'canReachSkullMain': return canReachDungeon("Skull Woods - Main") === 'available';
			case 'canReachSkullMiddle': return canReachDungeon("Skull Woods - Middle") === 'available';
			case 'canReachSkullDrops': return canReachDungeon("Skull Woods - Drops") === 'available';
			case 'canReachThievesTown': return canReachDungeon('Thieves Town') === 'available';
			case 'canReachIcePalace': return canReachDungeon('Ice Palace') === 'available';
			case 'canReachMiseryMire': return canReachDungeon('Misery Mire') === 'available';
			case 'canReachTurtleRockMain': return canReachDungeon("Turtle Rock - Main") === 'available';
			case 'canReachTurtleRockWest': return canReachDungeon("Turtle Rock - West") === 'available';
			case 'canReachTurtleRockEast': return canReachDungeon("Turtle Rock - East") === 'available';
			case 'canReachTurtleRockBack': return canReachDungeon("Turtle Rock - Back") === 'available';
			case 'canReachGanonsTower': return canReachDungeon('Ganons Tower') === 'available';

			case 'canBreachHyruleCastle': return canReachDungeon('Hyrule Castle - Main') != 'unavailable';
			case 'canBreachSewersDropdown': return canReachDungeon('Hyrule Castle - Sewers Dropdown') != 'unavailable';
			case 'canBreachSanctuary': return canReachDungeon('Sanctuary') != 'unavailable';
			case 'canBreachEasternPalace': return canReachDungeon('Eastern Palace') != 'unavailable';
			case 'canBreachDesertPalaceMain': return canReachDungeon('Desert Palace - Main') != 'unavailable';
			case 'canBreachDesertPalaceNorth': return canReachDungeon('Desert Palace - North') != 'unavailable';
			case 'canBreachTowerOfHera': return canReachDungeon('Tower of Hera') != 'unavailable';
			case 'canBreachCastleTower': return canReachDungeon('Castle Tower') != 'unavailable';
			case 'canBreachPalaceOfDarkness': return canReachDungeon('Palace of Darkness') != 'unavailable';
			case 'canBreachSwampPalace': return canReachDungeon('Swamp Palace') != 'unavailable';
			case 'canBreachSkullBack': return canReachDungeon("Skull Woods - Back") != 'unavailable';
			case 'canBreachSkullMain': return canReachDungeon("Skull Woods - Main") != 'unavailable';
			case 'canBreachSkullMiddle': return canReachDungeon("Skull Woods - Middle") != 'unavailable';
			case 'canBreachSkullDrops': return canReachDungeon("Skull Woods - Drops") != 'unavailable';
			case 'canBreachThievesTown': return canReachDungeon('Thieves Town') != 'unavailable';
			case 'canBreachIcePalace': return canReachDungeon('Ice Palace') != 'unavailable';
			case 'canBreachMiseryMire': return canReachDungeon('Misery Mire') != 'unavailable' && canReachDungeon('Misery Mire') != 'possible';
			case 'canBreachMiseryMireMaybe': return canReachDungeon('Misery Mire') != 'unavailable';
			case 'canBreachTurtleRockMain': return canReachDungeon("Turtle Rock - Main") != 'unavailable' && canReachDungeon('Misery Mire') != 'possible';
			case 'canBreachTurtleRockMainMaybe': return canReachDungeon("Turtle Rock - Main") != 'unavailable';
			case 'canBreachTurtleRockWest': return canReachDungeon("Turtle Rock - West") != 'unavailable';
			case 'canBreachTurtleRockEast': return canReachDungeon("Turtle Rock - East") != 'unavailable';
			case 'canBreachTurtleRockBack': return canReachDungeon("Turtle Rock - Back") != 'unavailable';
			case 'canBreachGanonsTower': return canReachDungeon('Ganons Tower') != 'unavailable';

			case 'gtleft': return items.hammer && items.hookshot && canHitRangedSwitch();
			case 'gtright': return items.somaria && items.firerod;
			case 'zeroKeyPodders': return items.bow > 1 && items.hammer && (items.bomb || items.boots);
			default: throw new Error('Unknown requirement: ' + requirement);
		};
	};

	function dungeonAvailability(dungeonId, dungeonName) {
		//            if ( window.autotrack === undefined) {
		//                return 'possible';
		//            }
		const logic = flags.doorshuffle === 'P' ? logic_open_keydrop : logic_open;
		var checksAlways = 0;
		var checksRequired = 0;
		var checksLogical = 0;
		var checksSuperLogic = 0;
		for (const [location, requirements] of Object.entries(logic[dungeonName])) {
			if (location.includes(' - Boss')) {
				if (dungeonName === 'Ganons Tower' || dungeonName === 'Castle Tower') {
					continue;
				};
			};
			if (inLogic(dungeonId, requirements["always"])) {
				checksAlways++;
				if (!("logical" in requirements) || inLogic(dungeonId, requirements["logical"])) {
					checksLogical++;
					checksRequired++;
					if (("superlogical" in requirements) && inLogic(dungeonId, requirements["superlogical"])) {
						checksSuperLogic++;
					}
				} else if (!("required" in requirements) || inLogic(dungeonId, requirements["required"])) {
					checksRequired++;
					if (("superlogical" in requirements) && inLogic(dungeonId, requirements["superlogical"])) {
						checksSuperLogic++;
					}
				};
			};
		};

		const hasNoBossItem = (dungeonName === 'Ganons Tower' || dungeonName === 'Castle Tower') ? true : false;
		const maxChecks = Object.keys(logic[dungeonName]).length - hasNoBossItem;
		const collected = maxChecks - items['chest' + dungeonId];

		if (checksLogical >= maxChecks) return 'available';
		if ((checksLogical - collected) > 0) return 'partialavailable';
		if ((checksRequired - collected) > 0) return 'darkpossible';
		if ((checksAlways - collected) > 0) return 'possible';

		return 'unavailable';
	};

	function bossAvailability(dungeonId, dungeonName) {
		const logic = flags.doorshuffle === 'P' ? logic_open_keydrop : logic_open;
		const requirements = logic[dungeonName][dungeonName + ' - Boss'];
		if (!("always" in requirements) || inLogic(dungeonId, requirements["always"])) {
			if (!("logical" in requirements) || inLogic(dungeonId, requirements["logical"])) return 'available';
			if (!("required" in requirements) || (inLogic(dungeonId, requirements["required"]))) return 'darkpossible';
			return 'possible';
		};
		return 'unavailable';
	};
	// #endregion

	// #region Door Chest Logic
	function available_chests(dungeonid, allchests, maxchest, chestcount) {
		var achests = 0;
		var pchests = 0;
		var dachests = 0;
		var dpchests = 0;
		var uchests = 0;
		var keys = 0;

		for (var i = 0; i < allchests.length; i++) {
			switch (allchests[i]) {
				case 'A':
					achests++;
					break;
				case 'P':
					pchests++;
					break;
				case 'DA':
					dachests++;
					break;
				case 'DP':
					dpchests++;
					break;
				case 'U':
					uchests++;
					break;
				case 'K':
					keys++;
					break;
			}
		}

		//Move dungeon items from available to possible
		if (!flags.wildmaps && dungeonid != 12) {
			if (achests > 0) {
				pchests++;
				achests--;
			} else if (dachests > 0) {
				dpchests++;
				dachests--;
			}
		}

		if (!flags.wildcompasses && dungeonid < 11) {
			if (achests > 0) {
				pchests++;
				achests--;
			} else if (dachests > 0) {
				dpchests++;
				dachests--;
			}
		}

		var itemscollected = (maxchest - chestcount);

		for (var i = 0; i < itemscollected; i++) {
			if (achests > 0) {
				achests--;
			} else if (dachests > 0) {
				dachests--;
			} else if (pchests > 0) {
				pchests--;
			} else if (dpchests > 0) {
				dpchests--;
			}
		}

		if (flags.ambrosia === 'Y' && dungeonid < 10 && chestcount === 1 && !dungeons[dungeonid].is_beaten) {
			return ConvertChestToBoss(allchests[allchests.length - 1]);
		}

		if (achests > 0) return 'available';
		if (dachests > 0) return 'darkavailable';
		if (pchests > 0) return 'possible';
		if (dpchests > 0) return 'darkpossible';
		return 'unavailable';
	};

	function maxKeys(dungeon) {
		return flags.doorshuffle === 'C' ? 29 : [0, 1, 1, 6, 1, 3, 1, 2, 3, 4, 4, 1, 2][dungeon];//Note: This assumes Key Drop Shuffle is off in Basic
	};

	function door_enemizer_check(dungeon) {
		if (dungeon === 6) {
			var atticCell = (flags.doorshuffle === 'C' ? items.bombfloor : items.bomb) && (items.bigkey6 || !flags.wildbigkeys);
			if (!atticCell && (flags.bossshuffle === 'N' || enemizer[6] === 7))
				return 'unavailable';
			if (!atticCell && flags.bossshuffle != 'N' && enemizer[6] % 11 === 0) {
				var check = enemizer_check(6);
				return check === 'available' ? 'possible' : check;
			}
		}
		if (dungeon >= 10)
			return items.sword || items.hammer || items.net || dungeon === 11 ? 'available' : 'unavailable';
		return (dungeon === 7 && (!items.hammer || items.glove == 0)) ? 'unavailable' : enemizer_check(dungeon);
	};

	window.entranceInDarkWorld = function (n) {
		return n == 93 || n == 95 ? flags.gametype != 'I' : n >= 86;
	};

	window.entranceInBunnyWorld = function (n) {
		return n == 93 || n == 95 || (n >= 86) == (flags.gametype != 'I');
	};

	// Tells chest logic if the player can reach the dungeon in logic in entrance modes
	window.entranceChests = function (entranceNames, dungeonID) {
		if (!(items['chest' + dungeonID] > 0 || (dungeonID < 10 && !dungeons[dungeonID].is_beaten))) {
			if (dungeonID < 10) document.getElementById('entranceBoss' + dungeonID).style.visibility = 'hidden';
			return;
		};

		var entranceAvail = [];
		var entranceBunny = [];
		var found = false;

		nextEntrance:
		for (var i = 0; i < entranceNames.length; i++) {
			for (var j = 0; j < entrances.length; j++) {
				if (entrances[j].known_location === entranceNames[i]) {
					entranceAvail.push('available');
					entranceBunny.push(!items.moonpearl && entranceInBunnyWorld(j));
					found = true;
					continue nextEntrance;
				}
			}

			//special cases
			if (entranceNames[i] === 'placeholder') {
				if (dungeonID == 5 && canReachWestDarkWorld()) {
					entranceAvail.push('available');
					entranceBunny.push(!items.moonpearl && entranceInBunnyWorld(102));
					found = true;
				};

				if (dungeonID == 11 && i == 3) {
					entranceAvail.push(flags.gametype != 'I' && (flags.gametype == 'S' || (flags.doorshuffle === 'N' || flags.doorshuffle === 'P')) ? 'available' : 'possible');
					entranceBunny.push(false);
					found = true;
				};

				if (dungeonID == 11 && i == 4) {
					if (
						entrances[22].known_location === 'sanc' ||
						entrances[29].known_location === 'sanc' ||
						entrances[18].known_location === 'sanc' ||
						entrances[11].known_location === 'sanc' ||
						(entrances[24].known_location === 'sanc' && items.boots && items.agahnim) ||
						(entrances[43].known_location === 'sanc' && items.hammer) ||
						(entrances[95].known_location === 'sanc' && items.agahnim2) ||
						(entrances[13].known_location === 'sanc' && items.glove > 0 && (flags.gametype != 'I' || (items.moonpearl && canReachWestDarkWorld())))
					) {
						entranceAvail.push('available');
						var bunny = false;
						for (var j = 0; j < entrances.length; j++) {
							if (entrances[j].known_location === 'sanc') {
								bunny = !items.moonpearl && entranceInBunnyWorld(j);
								break;
							};
						};
						entranceBunny.push(bunny);
						found = true;
					};
				};

				continue nextEntrance;
			};

			//not found
			entranceAvail.push('unavailable');
			entranceBunny.push(false);
		};

		if (!found) {
			if (dungeonID < 10) {
				document.getElementById('entranceBoss' + dungeonID).style.visibility = 'hidden';
			};
			document.getElementById('chest' + dungeonID).style.backgroundColor = 'white';
			document.getElementById('chest' + dungeonID).style.color = 'black';
		} else {
			if (dungeonID < 10) {
				document.getElementById('entranceBoss' + dungeonID).style.visibility = (!dungeons[dungeonID].is_beaten && !owGraphLogic ? 'visible' : 'hidden');
				document.getElementById('entranceBoss' + dungeonID).style.background = ConvertBossToColor(dungeonBoss(dungeonID, entranceAvail, entranceBunny));
			};
			const curStyle = window.getComputedStyle(document.documentElement);
			var c = dungeonChests(dungeonID, entranceAvail, entranceBunny);
			switch (c) {
				case 'available':
					document.getElementById('chest' + dungeonID).style.backgroundColor = curStyle.getPropertyValue('--available-color');
					document.getElementById('chest' + dungeonID).style.color = rgbToTextColour(curStyle.getPropertyValue('--available-color'));
					break;
				case 'darkavailable':
					document.getElementById('chest' + dungeonID).style.backgroundColor = curStyle.getPropertyValue('--darkavailable-color');
					document.getElementById('chest' + dungeonID).style.color = rgbToTextColour(curStyle.getPropertyValue('--darkavailable-color'));
					break;
				case 'possible':
					document.getElementById('chest' + dungeonID).style.backgroundColor = curStyle.getPropertyValue('--possible-color');
					document.getElementById('chest' + dungeonID).style.color = rgbToTextColour(curStyle.getPropertyValue('--possible-color'));
					break;
				case 'darkpossible':
					document.getElementById('chest' + dungeonID).style.backgroundColor = curStyle.getPropertyValue('--darkpossible-color');
					document.getElementById('chest' + dungeonID).style.color = rgbToTextColour(curStyle.getPropertyValue('--darkpossible-color'));
					break;
				case 'partialavailable':
					document.getElementById('chest' + dungeonID).style.backgroundColor = curStyle.getPropertyValue('--partialavailable-color');
					document.getElementById('chest' + dungeonID).style.color = rgbToTextColour(curStyle.getPropertyValue('--partialavailable-color'));
					break;
				case 'information':
					document.getElementById('chest' + dungeonID).style.backgroundColor = curStyle.getPropertyValue('--information-color');
					document.getElementById('chest' + dungeonID).style.color = rgbToTextColour(curStyle.getPropertyValue('--information-color'));
					break;
				default:
					document.getElementById('chest' + dungeonID).style.backgroundColor = curStyle.getPropertyValue('--unavailable-color');
					document.getElementById('chest' + dungeonID).style.color = rgbToTextColour(curStyle.getPropertyValue('--unavailable-color'));
			};
		};
	};

	window.doorCheck = function (dungeon, onlyDarkPossible, darkRoom, torchDarkRoom, posRequired, goal, onlyBunny = false) {

		if (flags.doorshuffle === 'N' || flags.doorshuffle === 'P')
			return null; // non-doors uses the normal logic

		var doorcheck = 'available'
		if (onlyBunny) {
			var bosscheck = 'unavailable';
		} else {
			var bosscheck = door_enemizer_check(dungeon);
		};
		if (goal === 'boss') doorcheck = bosscheck;
		if (doorcheck === 'unavailable') return 'unavailable';

		var wildsmallkeys = flags.wildkeys || flags.gametype === 'R';

		if (goal === 'item') {
			// Is last item on the boss?
			if (items['chest' + dungeon] === 1) {
				if (dungeon < 10 && flags.doorshuffle === 'B' && !items['boss' + dungeon] && bosscheck != 'available') {
					if (bosscheck === 'unavailable' && (flags.ambrosia === 'Y' || (flags.wildmaps && flags.wildcompasses && (wildsmallkeys || maxKeys(dungeon) == 0) && flags.wildbigkeys)))
						return 'unavailable';
					doorcheck = 'possible';
				};
			};

			if (dungeon < 10 && flags.doorshuffle === 'C' && !items['boss' + dungeon] && bosscheck != 'available' && (items['chest' + dungeon] == 1 || (!items['chestknown' + dungeon] && items['chest' + dungeon] == 2))) {
				if (bosscheck === 'unavailable' && items['chestknown' + dungeon] && (flags.ambrosia === 'Y' || (flags.wildmaps && flags.wildcompasses && wildsmallkeys && flags.wildbigkeys)))
					return 'unavailable';
				doorcheck = 'possible';
			}
		};

		var dungeonAlt = dungeon > 10 ? 'half' + (dungeon - 11) : '' + dungeon;

		if (doorcheck === 'available') {
			if (onlyBunny) doorcheck = 'possible'; 
			if (goal === 'item' && flags.doorshuffle === 'C' && items['chest' + dungeon] === 1 && !items['chestknown' + dungeon]) doorcheck = 'possible'; //Unknown if even one item is still in there
			if (flags.wildkeys && flags.gametype != 'R' && items['smallkey' + dungeonAlt] < maxKeys(dungeon)) doorcheck = 'possible'; //Could need more small keys
			if (flags.wildbigkeys && (dungeon <= 10 || flags.doorshuffle === 'C') && !items['bigkey' + dungeonAlt]) doorcheck = 'possible';	//Could need big key
			if (goal != 'boss' && dungeon < 10 && bosscheck != 'available' && flags.ambrosia === 'N' && ((!wildsmallkeys && maxKeys(dungeon) > 0) || !flags.wildbigkeys)) doorcheck = 'possible';//Boss could have required key
		};

		if (flags.doorshuffle === 'C') {
			posRequired = ['firerod', 'somaria', 'flippers', 'hookshot', 'boots', 'bow', 'hammer', 'swordorswordless', 'glove', 'bomb', flags.bossshuffle === 'N' ? '' : 'icerod'];
			if (goal === 'item' || !wildsmallkeys || !flags.wildbigkeys)
				posRequired.push('laserbridge');
			if (flags.entrancemode === 'N' && dungeon === 4)
				posRequired.push('mirror');
			if (flags.gametype != 'I' && flags.entrancemode === 'N' && !owGraphLogic && dungeon === 1)
				posRequired.push('mirrordesert');
			if (flags.gametype === 'I' && flags.entrancemode === 'N' && !owGraphLogic && dungeon === 5)
				posRequired.push('mirrorskull');
			darkRoom = torchDarkRoom = true;
		};

		if (doorcheck === 'available') {
			label:
			for (var i = 0; i < posRequired.length; i++) {
				switch (posRequired[i]) {
					case '':
						break;
					case 'firesource':
						if (!items.lantern && !items.firerod) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'hookboots':
						if (!items.hookshot && !items.boots) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'wizzrobe':
						if (!melee_bow() && !rod() && !cane()) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'freezor':
						if (!items.firerod && (!items.bombos || (items.sword === 0 && flags.swordmode != 'S'))) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'swordorswordless':
						if (items.sword === 0 && flags.swordmode != 'S') {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'boomerang':
						if (!items.boomerang && !items.bomb) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'bombdash':
						if (!items.bomb && !items.boots) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'kill':
						if (!melee_bow() && !cane() && !items.firerod) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'killbomb':
						if (!items.bomb && !melee_bow() && !cane() && !items.firerod) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'laserbridge':
						if (!items.cape && !items.byrna && items.shield < 3) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'mirrordesert':
						if (!items.mirror || items.flute === 0 || items.glove < 2) {
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'mirrorskull':
						if (!items.mirror || !canReachLightWorldBunny()) {
							doorcheck = 'possible';
							break label;
						}
						break;
					default:
						if (!items[posRequired[i]]) {
							doorcheck = 'possible';
							break label;
						}
				}
			}
		};

		if (onlyDarkPossible) doorcheck = 'dark' + doorcheck;

		if (doorcheck === 'available' && !onlyDarkPossible && !items.lantern && (darkRoom || torchDarkRoom))
			doorcheck = 'darkavailable';

		return doorcheck;
	};

	//dungeonEntrances is an array of length dungeonEntranceCounts[dungeonID] with values 'available', 'possible' or 'unavailable'
	//dungeonEntrancesBunny is an array of length dungeonEntranceCounts[dungeonID] with values true (can only access as a bunny) or false/null/undefined otherwise
	window.dungeonBoss = function (dungeonID, dungeonEntrances, dungeonEntrancesBunny) {
		if (dungeonID === 11)
			return items.chest11 ? dungeonChests(11, dungeonEntrances, dungeonEntrancesBunny) : "opened";
		var state = "unavailable", bunny = true, allAccessible = true;
		for (var k = 0; k < dungeonEntranceCounts[dungeonID]; k++) {
			if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P') && dungeonEntrancesBunny[k])
				dungeonEntrances[k] = "unavailable";
			if (dungeonEntrances[k] !== "unavailable") {
				state = bestAvailability(state, dungeonEntrances[k]);
				if (!dungeonEntrancesBunny[k])
					bunny = false;
			}
			if (dungeonEntrances[k] !== "available" || dungeonEntrancesBunny[k]) {
				if (k !== 0 && dungeonID === 1 && dpFrontLogic)
					continue;
				if (k !== 0 && dungeonID === 9 && trFrontLogic)
					continue;
				allAccessible = false;
			}
		}
		if (bunny)
			return "unavailable";
		var best = state;
		switch (dungeonID) {
			case 0:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? EPBoss() : doorCheck(0, false, true, true, ['hookshot', 'bow'], 'boss');
				break;
			case 1:
				if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P')) {
					var front = bestAvailability(dungeonEntrances[0], dungeonEntrances[1], dungeonEntrances[2]), back = dungeonEntrances[3]
					state = DPBoss(front, back);
				}
				else
					state = doorCheck(1, false, false, false, [(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '', 'firesource', 'killbomb'], 'boss');
				break;
			case 2:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? HeraBoss() : doorCheck(2, false, false, false, [(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'firesource' : '', 'kill'], 'boss');
				break;
			case 3:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? PoDBoss() : doorCheck(3, false, true, true, ['boots', 'hammer', 'bow', 'bomb'], 'boss');
				break;
			case 4:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? SPBoss() : doorCheck(4, false, false, false, ['flippers', flags.entrancemode === 'N' ? 'mirror' : '', 'hookshot', 'hammer', 'bomb'], 'boss');
				break;
			case 5:
				if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P')) {
					var front = bestAvailability(dungeonEntrances[0], dungeonEntrances[1], dungeonEntrances[2]), back = dungeonEntrances[3];
					state = SWBoss(front, back);
				}
				else
					state = doorCheck(5, false, false, false, ['firerod', 'swordorswordless', 'bomb'], 'boss');
				break;
			case 6:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? TTBoss() : doorCheck(6, false, false, false, [(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'hammer' : '', 'glove', 'bomb'], 'boss');
				break;
			case 7:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? IPBoss() : doorCheck(7, false, false, false, ['freezor', 'hammer', 'glove', 'hookshot', 'somaria', 'bomb'], 'boss');
				break;
			case 8:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? MMBoss("available") : doorCheck(8, false, true, false, ['hookshot', 'firesource', 'somaria', 'bomb'], 'boss');
				break;
			case 9:
				if (trFrontLogic)
					state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? TRFrontBoss("available") : doorCheck(9, false, true, false, ['somaria', 'firerod', (!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'laserbridge' : ''], 'boss');
				else
					state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? TRBoss(...dungeonEntrances) : doorCheck(9, false, true, false, ['somaria', 'firerod', (!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'laserbridge' : ''], 'boss');
				break;
			case 10:
				if ((crystalCheck() < flags.ganonvulncount && flags.goals != 'A') || ((crystalCheck() < flags.opentowercount || !items.agahnim2) && flags.goals != 'F') || (flags.goals === 'A' && (!items.agahnim || !allDungeonCheck())))
					return "unavailable";
				if ((flags.swordmode != 'S' && items.sword < 2) || (flags.swordmode === 'S' && !items.hammer) || (!items.lantern && !items.firerod))
					return "unavailable";
				if (flags.goals === 'F' && (items.sword > 1 || (flags.swordmode === 'S' && items.hammer)) && (items.lantern || items.firerod))
					state = "available";
				else
					state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? GTBoss() : doorCheck(10, false, false, false, ['hammer', 'firerod', 'hookshot', 'boomerang', 'somaria', (!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '', 'bow', flags.bossshuffle === 'N' ? '' : 'icerod', 'bomb'], 'boss');
				break;
			case 12:
				if (!items.sword && !items.hammer && !items.net)
					return "unavailable";
				state = flags.doorshuffle === 'C' ? doorCheck(12, false, true, true, [], 'boss') : CTBoss();
		}
		if (best === "darkavailable") {
			if (state === "available" || state === "possible")
				state = "dark" + state;
			best = "available";
		}
		if (best === "darkpossible") {
			if (state === "available" || state === "darkavailable" || state === "possible")
				state = "darkpossible";
			best = "possible";
		}
		if (flags.doorshuffle !== 'N' && state === "available" && (best === "possible" || !allAccessible))
			return "possible";
		if (flags.doorshuffle !== 'N' && state === "darkavailable" && (best === "possible" || !allAccessible))
			return "darkpossible";
		if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P') && state === "available" && best === "possible")
			return "possible";
		if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P') && state === "darkavailable" && best === "possible")
			return "darkpossible";
		return state;
	};

	//dungeonEntrances is an array of length dungeonEntranceCounts[dungeonID] with values 'available', 'possible' or 'unavailable'
	//dungeonEntrancesBunny is an array of length dungeonEntranceCounts[dungeonID] with values true (can only access as a bunny) or false/null/undefined otherwise
	window.dungeonChests = function (dungeonID, dungeonEntrances, dungeonEntrancesBunny) {
		var state = "unavailable", bunny = true, allAccessible = true;
		for (var k = 0; k < dungeonEntranceCounts[dungeonID]; k++) {
			if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P') && dungeonEntrancesBunny[k])
				dungeonEntrances[k] = "unavailable";
			if (dungeonEntrances[k] !== "unavailable") {
				state = bestAvailability(state, dungeonEntrances[k]);
				if (!dungeonEntrancesBunny[k])
					bunny = false;
			}
			if (dungeonEntrances[k] !== "available" || dungeonEntrancesBunny[k]) {
				if (k !== 0 && dungeonID === 1 && dpFrontLogic)
					continue;
				if (k !== 0 && dungeonID === 9 && trFrontLogic)
					continue;
				allAccessible = false;
			}
		}
		if (state === "unavailable")
			return "unavailable";
		if (bunny && (flags.doorshuffle === 'N' || flags.doorshuffle === 'P'))
			return "unavailable";
		if (bunny && flags.doorshuffle === 'B' && dungeonID !== 2)
			return "unavailable";

		var best = state;
		switch (dungeonID) {
			case 0:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? EPChests() : doorCheck(0, false, true, true, ['hookshot', 'bow'], 'item', bunny);
				break;
			case 1:
				if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P')) {
					var front = bestAvailability(dungeonEntrances[0], dungeonEntrances[1], dungeonEntrances[2]), back = dungeonEntrances[3];
					state = DPChests(front, back);
				} else
					state = doorCheck(1, false, false, false, ['boots', 'firesource', 'killbomb'], 'item', bunny);
				break;
			case 2:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? HeraChests() : doorCheck(2, false, false, false, ['firesource', 'kill'], 'item', bunny);
				break;
			case 3:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? PoDChests() : doorCheck(3, false, true, true, ['boots', 'hammer', 'bow', 'bomb'], 'item', bunny);
				break;
			case 4:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? SPChests() : doorCheck(4, false, false, false, ['flippers', flags.entrancemode === 'N' ? 'mirror' : '', 'hookshot', 'hammer', 'bomb'], 'item', bunny);
				break;
			case 5:
				if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P')) {
					var front = bestAvailability(dungeonEntrances[0], dungeonEntrances[1], dungeonEntrances[2]), back = dungeonEntrances[3];
					state = SWChests(front, back);
				}
				else
					state = doorCheck(5, false, false, false, ['firerod', 'swordorswordless', 'bomb'], 'item', bunny);
				break;
			case 6:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? TTChests() : doorCheck(6, false, false, false, ['hammer', 'glove', 'bomb'], 'item', bunny);
				break;
			case 7:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? IPChests() : doorCheck(7, false, false, false, ['freezor', 'hammer', 'glove', 'hookshot', 'somaria', 'bomb'], 'item', bunny);
				break;
			case 8:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? MMChests("available") : doorCheck(8, false, true, false, ['hookshot', 'firesource', 'somaria', 'bomb'], 'item', bunny);
				break;
			case 9:
				if (trFrontLogic)
					state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? TRFrontChests("available") : doorCheck(9, false, true, false, ['somaria', 'firerod', 'laserbridge'], 'item', bunny);
				else
					state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? TRChests(...dungeonEntrances) : doorCheck(9, false, true, false, ['somaria', 'firerod', 'laserbridge'], 'item', bunny);
				break;
			case 10:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? GTChests() : doorCheck(10, false, false, false, ['hammer', 'firerod', 'hookshot', 'boomerang', 'somaria', 'boots', 'bow', flags.bossshuffle === 'N' ? '' : 'icerod', 'bomb'], 'item', bunny);
				break;
			case 11:
				if (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') {
					var front = bestAvailability(dungeonEntrances[0], dungeonEntrances[1], dungeonEntrances[2]), back = dungeonEntrances[4], sanc = dungeonEntrances[3];
					state = HCChests(front, back, sanc);
				}
				else
					state = doorCheck(11, false, false, flags.gametype != 'S', ['killbomb', 'bombdash'], 'item', bunny);
				break;
			case 12:
				state = (flags.doorshuffle === 'N' || flags.doorshuffle === 'P') ? CTChests() : doorCheck(12, false, true, true, ['kill', 'swordorswordless'], 'item', bunny);
		}

		if (best === "darkavailable") {
			if (state === "available" || state === "possible")
				state = "dark" + state;
			best = "available";
		}
		if (best === "darkpossible") {
			if (state === "available" || state === "darkavailable" || state === "possible")
				state = "darkpossible";
			best = "possible";
		}

		if ((flags.doorshuffle !== 'N' && flags.doorshuffle !== 'P') && state === "available" && (best === "possible" || !allAccessible))
			return "possible";
		if ((flags.doorshuffle !== 'N' && flags.doorshuffle !== 'P') && state === "darkavailable" && (best === "possible" || !allAccessible))
			return "darkpossible";
		if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P') && state === "available" && best === "possible")
			return "possible";
		if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P') && state === "darkavailable" && best === "possible")
			return "darkpossible";

		return state;
	};
	// #endregion

	// #region Dungeon Bosses
	window.EPBoss = function () {
		if (isNewLogic()) return bossAvailability(0, 'Eastern Palace');

		const reachability = canReachDungeon('Eastern Palace');
		if (reachability === 'unavailable') return 'unavailable';

		var bossState = window.doorCheck(0,false,true,true,['hookshot','bow'],'boss');
		if (!bossState) {
			bossState = enemizer_check(0);
			//Standard check
			if (!items.bigkey0) bossState = 'unavailable';
			if (items.bow < 2 && flags.enemyshuffle === 'N') bossState = 'unavailable';
			//Dark Room check
			if (!canDoTorchDarkRooms()) bossState = 'possible';
		};

		if (reachability != 'available' && (bossState === 'available' || bossState === 'partialavailable') ) {
			bossState = reachability
		};

		return bossState;
	};

	//front and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
	window.DPBoss = function (front = 'available', back = 'unavailable') {
		if (isNewLogic()) {
			return bossAvailability(1, 'Desert Palace');
		};

		const reachability_main = canReachDungeon('Desert Palace - Main');
		const reachability = canReachDungeon('Desert Palace - North');
		var bossState = window.doorCheck(1,false,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','glove','firesource','killbomb','mirrordesert'],'boss');
		if (bossState) {
			if (reachability_main === 'unavailable' && reachability === 'unavailable') return 'unavailable';
			return bossState;
		} else {
			if (reachability === 'unavailable') return 'unavailable';
			if (reachability_main != reachability && flags.entrancemode === 'N' && (items.glove || flags.glitches != 'N')) {
				reachability_main = reachability = bestAvailability(reachability_main, reachability);
			};
			var bossState = enemizer_check(1);
			if (!items.bigkey1 || (!items.firerod && !items.lantern)) bossState = 'unavailable';
			if (reachability === 'possible' || reachability === 'darkpossible') bossState = reachability;
			if (!flags.wildbigkeys) {
				if (reachability_main != 'available' && reachability_main != 'darkavailable') bossState = reachability_main;
				if ((flags.wildkeys && items.smallkey1 === 0 && flags.gametype != 'R') || !items.boots) bossState = reachability_main === 'darkavailable' ? 'darkpossible' : 'possible';
				if (!flags.wildkeys && flags.gametype != 'R' && !items.boots) bossState = reachability_main === 'darkavailable' ? 'darkpossible' : 'possible';
			};
		};

		return bossState;
	};

	window.HeraBoss = function () {
		if (isNewLogic()) {
			return bossAvailability(2, 'Tower of Hera');
		};

		const reachability = canReachDungeon('Tower of Hera');
		if (reachability === 'unavailable') return 'unavailable';

		var bossState = window.doorCheck(2,items.flute === 0 && !items.lantern,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'firesource' : '','kill'],'boss');
		if (!bossState) {
			var isDark = !items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots) && flags.entrancemode === 'N' && !owGraphLogic;
			var dungeoncheck = enemizer_check(2);
			// If we can't kill the boss, nothing else matters.
			if (dungeoncheck === 'unavailable') return 'unavailable';

			if (flags.glitches === 'H' || flags.glitches === 'M') {
				// If we are shuffling keys and have BK2 (Hera), we can always walk in and climb
				if (flags.wildbigkeys && items.bigkey2) return dungeoncheck;
				// otherwise, we can definitely access Hera if we can clip from Mire
				var clipFromMire = (items.moonpearl || glitchLinkState()) && ((flags.glitches === 'H' && (items.boots || items.mirror)) || flags.glitches === 'M') && (items.boots || items.hookshot);
				// as long as we either aren't shuffling big keys or have BK8 (Mire), and have the medallion
				if (clipFromMire && (flags.wildbigkeys ? items.bigkey8 : true) && medallionCheck(0) === 'available') return dungeoncheck;
				// and if we aren't tracking big keys and can't clip from Mire, we can kill the boss if the BK is in the first two 
				// chests, which we can't determine based on items alone.
				return 'possible';
			} else {
				if (flags.doorshuffle === 'P' || (flags.doorshuffle === 'N' && (flags.wildkeys || flags.gametype === 'R') && flags.wildbigkeys && flags.wildcompasses && flags.wildmaps)) {
					return bossAvailability(2, 'Tower of Hera');
				};
		
				if (!items.bigkey2) return 'unavailable';

				if (flags.wildbigkeys) {
					if (dungeoncheck === 'available') {
						return isDark ? 'darkavailable' : 'available';
					} else {
						return isDark ? 'darkpossible' : 'possible';
					}
				}
				if ((flags.wildkeys && (items.smallkey2 === 0 && flags.gametype != 'R')) || (!items.lantern && !items.firerod)) return isDark ? 'darkpossible' : 'possible';
				return (dungeoncheck === 'available' ? (isDark ? 'darkavailable' : 'available') : (isDark ? 'darkpossible' : 'possible'));
			}
		};

		if (reachability != 'available' && (bossState === 'available' || bossState === 'partialavailable')) {
			bossState = reachability
		};

		return bossState;
	};

	window.PoDBoss = function () {
		if (isNewLogic()) {
			return bossAvailability(3, 'Palace of Darkness');
		};
		const reachability = canReachDungeon('Palace of Darkness');
		if (reachability === 'unavailable') return 'unavailable';

		var bossState = window.doorCheck(3,false,true,true,['boots','hammer','bow','bomb'],'boss');
		if (!bossState) {
			var bossState = enemizer_check(3);
			if (!items.bigkey3 || !items.hammer || items.bow < 2 || bossState === 'unavailable') return 'unavailable';
			if (flags.wildbigkeys || flags.wildkeys) {
				if (items.smallkey3 < 5 && flags.gametype != 'R') return 'unavailable';
				if (items.smallkey3 === 5 && flags.gametype != 'R') {
					bossState = (items.lantern ? 'possible' : 'darkpossible');
				} else {
					bossState = (dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
				}
			} else {
				bossState = (dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
			}
		};

		if (reachability != 'available' && (bossState === 'available' || bossState === 'partialavailable')) {
			bossState = reachability
		};

		return bossState;
	};

	window.SPBoss = function () {
		if (flags.glitches === 'M' || flags.glitches === 'H') {
			if (!items.hookshot || !items.flippers) return 'unavailable';
			return canEnterSwampGlitched()
		};

		if (isNewLogic()) {
			if (flags.entrancemode != 'N') {
				if (!hasFoundLocation('dam')) return 'unavailable';
			} else {
				if (!items.mirror) return 'unavailable';
			}
			return bossAvailability(4, 'Swamp Palace');
		};
0
		const reachability = canReachDungeon('Swamp Palace');
		if (reachability === 'unavailable') return 'unavailable';

		var bossState = window.doorCheck(4,false,false,false,['flippers','mirror','hookshot','hammer','bomb'],'boss');
		if (!bossState) {
			var bossState = enemizer_check(4);
			if (!items.hammer || !items.hookshot || (items.smallkey4 === 0 && flags.gametype != 'R')) {
				bossState = 'unavailable';
			};
		}

		if (reachability != 'available' && (bossState === 'available' || bossState === 'partialavailable')) {
			bossState = reachability
		};

		return bossState;		
	};

	//front and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
	window.SWBoss = function (front = 'available', back = 'unavailable') {
		if (isNewLogic()) {
			return bossAvailability(5, 'Skull Woods');
		};
		var front = canReachDungeon('Skull Woods - Front');
		var middle = canReachDungeon('Skull Woods - Middle');
		var back = canReachDungeon('Skull Woods - Back');
		if (front === 'unavailable' && middle === 'unavailable' && back === 'unavailable') return 'unavailable';
		var doorcheck = window.doorCheck(5,false,false,false,['firerod','swordorswordless','bomb'],'boss');
		if (doorcheck) return doorcheck;

		if (back === 'unavailable') {
			return 'unavailable';
		};
		var dungeoncheck = enemizer_check(5);
		var keycheck = front === 'available' || front === 'darkavailable' || flags.gametype === 'R' || (flags.wildkeys && items.smallkey5) ? 'available' : front === 'possible' || front === 'darkpossible' || (!flags.wildkeys && back != 'unavailable') ? 'possible' : 'unavailable';
		if (back === 'unavailable' || dungeoncheck === 'unavailable' || keycheck === 'unavailable' || (items.sword === 0 && flags.swordmode != 'S')) return 'unavailable';
		if (back === 'darkpossible' || (back === 'darkavailable' && keycheck === 'possible')) return 'darkpossible';
		if (back === 'darkavailable' && keycheck === 'available') return 'darkavailable';
		if (back === 'possible' || keycheck === 'possible') return 'possible';
		return dungeoncheck;
	};

	window.TTBoss = function () {
		if (isNewLogic()) {
			return bossAvailability(6, 'Thieves Town');
		};

		const reachability = canReachDungeon('Thieves Town');
		if (reachability === 'unavailable') return 'unavailable';

		var doorcheck = window.doorCheck(6,false,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'hammer' : '','glove','bomb'],'boss');
		if (doorcheck) {
			return doorcheck;
		} else {
			var dungeoncheck = enemizer_check(6);
			if (!items.bomb && (flags.bossshuffle === 'N' || enemizer[6] === 7)) return 'unavailable';
			if (!items.bomb && dungeoncheck === 'available' && flags.bossshuffle != 'N' && enemizer[6] % 11 === 0) dungeoncheck = 'possible';
			return (items.bigkey6 ? dungeoncheck : 'unavailable');
		};
	};

	window.IPBoss = function () {
		if (isNewLogic()) {
			return bossAvailability(7, 'Ice Palace');
		};

		var doorcheck = window.doorCheck(7,false,false,false,['freezor','hammer','glove','hookshot','somaria','bomb'],'boss');
		if (doorcheck) {
			return doorcheck;
		} else {
			if (!items.firerod && (!items.bombos || (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
			var dungeoncheck = enemizer_check(7);
			if (!items.hammer || items.glove === 0 || dungeoncheck === 'unavailable') return 'unavailable';
			if (!items.bomb) return items.somaria ? 'possible' : 'unavailable';
			if (flags.wildbigkeys) {
				if (!items.bigkey7) return 'possible';
			} else {
				if (!items.hookshot && flags.gametype != 'R') return 'possible';
			}
			if (flags.wildkeys || flags.gametype === 'R') {
				if (flags.gametype != 'R' && (items.smallkey7 === 0 || (items.smallkey7 === 1 && !items.somaria))) return 'possible';
			} else {
				if (!items.hookshot || !items.somaria) return 'possible';
			}

			return dungeoncheck;
		};
	};

	window.MMBoss = function (medcheck) {
		if (isNewLogic()) {
			return bossAvailability(8, 'Misery Mire');
		};

		const reachability = canReachDungeon('Misery Mire');
		if (reachability === 'unavailable') return 'unavailable';

		var doorcheck = window.doorCheck(8,false,true,false,['hookshot','firesource','somaria','bomb'],'boss');
		if (doorcheck) {
			return doorcheck;
		} else {
			if (!items.boots && !items.hookshot) return 'unavailable';
			if (medcheck === 'unavailable') return 'unavailable';
			if (flags.doorshuffle === 'P' || (flags.doorshuffle === 'N' && (flags.wildkeys || flags.gametype === 'R') && flags.wildbigkeys && flags.wildcompasses && flags.wildmaps)) {
				const state = bossAvailability(8, 'Misery Mire');
				if (state === 'unavailable') return 'unavailable';
				if (medcheck === 'possible') return 'possible';
				return state;
			};
			var dungeoncheck = enemizer_check(8);
			if (!items.bigkey8 || !items.somaria || !items.bomb || dungeoncheck === 'unavailable') return 'unavailable';
			if (dungeoncheck === 'possible' || medcheck === 'possible') {
				return (items.lantern ? 'possible' : 'darkpossible');
			}
			if (!flags.wildbigkeys) {
				if (!items.lantern && !items.firerod) {
					return 'darkpossible';
				} else {
					return (items.lantern ? 'available' : 'darkavailable');
				};
			};
			return (dungeoncheck === 'possible' ? (items.lantern ? 'possible' : 'darkpossible') : 'unavailable');
		};
	};

	//front, middle, bigchest and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
	//Not properly implemented!
	window.TRBoss = function (front = 'available', middle = 'unavailable', bigchest = 'unavailable', back = 'unavailable') {
		if (isNewLogic()) {
			return bossAvailability(9, 'Turtle Rock');
		};

		front = canReachDungeon('Turtle Rock - Front');
		middle = canReachDungeon('Turtle Rock - West');
		bigchest = canReachDungeon('Turtle Rock - East');
		back = canReachDungeon('Turtle Rock - Back');
		var doorcheck = window.doorCheck(9,items.flute === 0 && !items.lantern,true,false,['somaria','firerod',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'laserbridge' : '','bomb'],'boss');
		if (doorcheck) {
			return doorcheck;
		} else {
			if (front === 'unavailable' && middle === 'unavailable' && bigchest === 'unavailable' && back === 'unavailable') return 'unavailable';

			if (back != 'unavailable' && middle != 'available' && items.somaria && items.lantern && (items.bomb || items.boots)) {//More complicated with dark room navigation
				middle = back;
			}
			if (bigchest != 'unavailable' && middle != 'available' && (flags.entrancemode === 'N' || ((items.somaria || items.hookshot) && (melee_bow() || items.firerod || cane())))) {
				middle = bigchest;
			}
			if (middle != 'unavailable' && bigchest != 'available' && items.bomb && flags.entrancemode === 'N') {
				bigchest = middle;
			}
			if (middle != 'unavailable' && front != 'available' && items.somaria) {
				front = middle;
			}
			if (front != 'unavailable' && middle != 'available' && items.somaria && items.smallkey9 >= 2) {
				middle = (flags.wildkeys || flags.gametype === 'R') && items.smallkey9 === 4 ? front : 'possible';
			}
			if ((middle != 'unavailable' || bigchest != 'unavailable') && back != 'available' && items.somaria && items.lantern && (items.bomb || items.boots) && items.bigkey9) {
				back = (flags.wildkeys || flags.gametype === 'R') && items.smallkey9 === 4 && flags.wildbigkeys ? (middle === 'available' ? middle : bigchest) : 'possible';
			}
			var dungeoncheck = enemizer_check(9);
			if (!items.bigkey9 || !items.smallkey9 || !items.somaria || (back === 'unavailable' && !items.bomb && !items.boots) || dungeoncheck === 'unavailable') return 'unavailable';
			if (flags.wildkeys) {
				if (items.smallkey9 < 4 && flags.gametype != 'R') return 'possible';
			}
			if (((!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys) && (!items.firerod || front != 'available' || middle != 'available' || (bigchest != 'available' && !flags.wildkeys && flags.gametype != 'R') || back != 'available')) return 'possible';
			return back === 'available' ? dungeoncheck : ((front === 'available' || middle === 'available' || back === 'available') && (items.bomb || items.boots) ? (items.lantern ? 'available' : 'darkavailable') : 'possible');
		};
	};

	window.TRFrontBoss = function (medcheck) {
		if (medcheck === 'unavailable') return 'unavailable';
		if (flags.doorshuffle === 'P' || (flags.doorshuffle === 'N' && (flags.wildkeys || flags.gametype === 'R') && flags.wildbigkeys && flags.wildcompasses && flags.wildmaps)) {
			const state = bossAvailability(9, 'Turtle Rock');
			if (state === 'unavailable') return 'unavailable';
			if (medcheck === 'possible') return 'possible';
			return state;
		};
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.somaria || (!items.bomb && !items.boots) || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildkeys) {
			if (items.smallkey9 < 4 && flags.gametype != 'R') return 'unavailable';
		}
		return (dungeoncheck === 'available' && medcheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
	};

	window.TRMidBoss = function () {
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.somaria || (!items.bomb && !items.boots) || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildbigkeys || flags.wildkeys) {
			if (items.smallkey9 < 2 && flags.gametype != 'R') return 'unavailable';
			if (items.smallkey9 < 4 && flags.gametype != 'R') return 'possible';
			return dungeoncheck;
		} else {
			if (!items.firerod) return 'possible';
			return (dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
		}
	};

	window.TRBackBoss = function () {
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.somaria || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildkeys) {
			if (items.smallkey9 === 0 && flags.gametype != 'R') return 'unavailable';
			if (items.smallkey9 < 4 && flags.gametype != 'R') return 'possible';
			return dungeoncheck;
		} else {
			if (!items.firerod) return 'possible';
			return (dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
		}
	};

	window.GTBoss = function () {
		if (isNewLogic()) {
			return bossAvailability(10, 'Ganons Tower');
		};

		const reachability = canReachDungeon('Ganons Tower');
		if (reachability === 'unavailable') return 'unavailable';
		var doorcheck = window.doorCheck(10,items.flute === 0 && !items.lantern,false,false,['hammer','firerod','hookshot','boomerang','somaria',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'boss');
		if (doorcheck) {
			return doorcheck;
		} else {

			var dungeoncheck = enemizer_check(10);
			if (!items.bigkey10 || (items.bow < 2 && flags.enemyshuffle === 'N') || (!items.lantern && !items.firerod) || !items.hookshot || ((items.sword < 2 && flags.swordmode != 'S') || (flags.swordmode === 'S' && !items.hammer)) || !items.bomb || dungeoncheck === 'unavailable') return 'unavailable';
			if (!items.sword && !items.hammer && !items.net) return 'unavailable';
			if (flags.wildkeys) {
				if (items.smallkey10 === 0 && flags.gametype != 'R') return 'unavailable';
				if (items.smallkey10 < 3 && flags.gametype != 'R') return 'possible';
			}

			return dungeoncheck;
		};
	};

	window.CTBoss = function () {
		if (isNewLogic()) {
			return bossAvailability(12, 'Castle Tower');
		};

		const reachability = canReachDungeon('Castle Tower');
		if (reachability === 'unavailable') return 'unavailable';
		const doorcheck = window.doorCheck(12,false,true,true,[],'boss');
		if (doorcheck) {
			return doorcheck;
		} else {
			if ((!items.bomb || flags.doorshuffle != 'N') && !melee_bow() && !cane() && !items.firerod) return 'unavailable';
			if (items.sword == 0 && flags.swordmode != 'S') return 'unavailable';
			if (items.sword == 0 && !items.hammer && !items.net) return 'unavailable';
			if (flags.wildkeys && flags.gametype != 'R' && items.smallkeyhalf1 < 2) return 'unavailable';
			return items.lantern ? 'available' : 'darkavailable';
		};
	};
	// #endregion

	// #region Dungeon Chests
	window.EPChests = function () {
		if (isNewLogic()) {
			return dungeonAvailability(0, 'Eastern Palace')
		};

		const reachability = canReachDungeon('Eastern Palace');
		if (reachability === 'unavailable') return 'unavailable';

		var dungeonState = window.doorCheck(0,false,true,true,['hookshot','bow'],'item');
		if (!dungeonState) { // Old logic
				
			const dungeoncheck = enemizer_check(0);
			var chests = ['U', 'U', 'U', 'U', 'U', 'U'];

			//Cannonball Chest
			chests[0] = 'A';
			//Compass Chest
			chests[1] = 'A';
			//Map Chest
			chests[2] = 'A';
			//Big Chest
			if (flags.wildbigkeys) {
				chests[3] = (items.bigkey0 ? 'A' : 'U');
			} else {
				chests[3] = (items.lantern ? 'K' : 'P'); //Key replaces itself
			}
			//Big Key Chest
			if (!flags.wildbigkeys) {
				chests[4] = (items.lantern ? 'A' : (((items.bow > 1 || flags.enemyshuffle != 'N') && dungeoncheck === 'available') ? 'DA' : 'P'));
			} else {
				chests[4] = (items.lantern ? 'A' : 'DA');
			}
			//Boss
			chests[5] = ConvertBossToChest(EPBoss());

			dungeonState = available_chests(0, chests, items.maxchest0, items.chest0);
		};

		if (reachability != 'available' && (dungeonState === 'available' || dungeonState === 'partialavailable') ) {
			dungeonState = reachability
		};

		return dungeonState;
	};

	//front and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
	window.DPChests = function (front = 'available', back = 'unavailable') {
		if (isNewLogic()) {
			return dungeonAvailability(1, 'Desert Palace')
		};

		const reachability_front = canReachDungeon('Desert Palace - Main');
		const reachability_north = canReachDungeon('Desert Palace - North');
		if (reachability_front === 'unavailable' && reachability_north === 'unavailable') return 'unavailable';

		var dungeonState = window.doorCheck(1,false,false,false,['boots','glove','firesource','killbomb','mirrordesert'],'item');
		if (dungeonState) {
			if (dungeonState === 'possible' || reachability_front === 'possible' || reachability_north === 'possible') {
				return 'possible';
			};
			return dungeonState;
		} else {
			if (reachability_front === 'unavailable') return 'unavailable';
			var chests = ['U', 'U', 'U', 'U', 'U', 'U'];


			//Map Chest
			chests[0] = 'A';

			//Torch
			if (items.boots) {
				// If not wild keys, this will be set as a key
				if (!flags.wildkeys && flags.gametype != 'R') {
					chests[1] = 'K';
				} else {
					//if it is wild keys or retro, it will simply be an item, even if the big key is wild, as that will be replaced with the big chest
					chests[1] = 'A';
				}
			}

			//Compass Chest
			//Big Key Chest
			if (flags.gametype == 'R') {
				//If retro, simply available
				chests[2] = 'A';
				chests[3] = 'A';
			} else {
				//If wild keys simply need a key
				if (flags.wildkeys) {
					chests[2] = (items.smallkey1 === 1 ? 'A' : 'U');
					chests[3] = (items.smallkey1 === 1 ? 'A' : 'U');
				} else {
					//If wild keys is off, but wild big keys is on, then it is only available if both boots and big key, otherwise possible
					if (flags.wildbigkeys) {
						if (items.boots) {
							//If Boots, two items at a minimum are available, so flagging compass as available as always with boots,
							//where the rest are only possible without the big key
							chests[2] = 'A';
							chests[3] = (items.bigkey1 && items.boots ? 'A' : 'P');
						} else {
							chests[2] = (items.bigkey1 && items.boots ? 'A' : 'P');
							chests[3] = (items.bigkey1 && items.boots ? 'A' : 'P');
						}
					} else {
						//Neither wild keys is on, available with boots, otherwise possible
						chests[2] = (items.boots ? 'A' : 'P');
						chests[3] = (items.boots ? 'A' : 'P');
					}
				}
			}

			//Big Chest
			if (flags.wildbigkeys) {
				//If wild big keys, always simply available with the key
				chests[4] = (items.bigkey1 ? 'A' : 'U');
			} else {
				//In all non-wild big keys, it will be replaced by itself
				if (flags.wildkeys) {
					//Need both the small key and boots to be available, else it will be possible because it could be in the map chest
					chests[4] = (items.boots && items.smallkey === 1 ? 'K' : 'P');
				} else {
					//If both wild keys and wild big keys are off, available with boots, but still possible without
					chests[4] = (items.boots ? 'K' : 'P');
				}
			}

			if (reachability_front === 'possible' || reachability_front === 'darkavailable') {
				for (var k = 0; k < 5; k++) {
					if (chests[k] === 'A') chests[k] = front === 'possible' ? 'P' : 'DA';
				}
			}
			if (reachability_front === 'darkpossible') {
				for (var k = 0; k < 5; k++) {
					if (chests[k] === 'A' || chests[k] === 'P') chests[k] = 'D' + chests[k];
				}
			}

			//Boss
			chests[5] = ConvertBossToChest(DPBoss(reachability_front, reachability_north));

			dungeonState = available_chests(1, chests, items.maxchest1, items.chest1);

			if (reachability_front != 'available' && (dungeonState === 'available' || dungeonState === 'partialavailable') ) {
				return reachability_front
			} else {
				return dungeonState;
			}
		};
	};

	window.HeraChests = function () {
		if (isNewLogic()) {
			return dungeonAvailability(2, 'Tower of Hera')
		};

		const reachability = canReachDungeon('Tower of Hera');
		if (reachability === 'unavailable') return 'unavailable';

		var dungeonState = window.doorCheck(2,!activeFlute() && !items.lantern,false,false,['firesource','kill'],'item');
		if (!dungeonState) {
			var isDark = items.flute === 0 && !items.lantern && !(flags.glitches != 'N') && flags.entrancemode === 'N' && !owGraphLogic;

			var chests = ['U', 'U', 'U', 'U', 'U', 'U'];

			//Small Key
			if (flags.wildbigkeys && (flags.wildkeys || flags.gametype === 'R')) {
				chests[0] = (isDark ? 'DA' : 'A');
			} else {
				chests[0] = (items.lantern || items.firerod) ? 'K' : (isDark ? 'DP' : 'P'); //Setting this as the small key as it is always available with a fire source
			}

			//Map
			chests[1] = (isDark ? 'DA' : 'A');

			//Big Key Chest
			if (flags.wildbigkeys) {
				if ((items.smallkey2 === 0 && flags.gametype != 'R') || (!items.lantern && !items.firerod)) {
					chests[2] = 'U';
				} else {
					if (flags.wildkeys) {
						chests[2] = (items.smallkey2 === 0 ? 'U' : (isDark ? 'DA' : 'A'));
					} else {
						//This needs to be only possible without the big key, because the small key could be locked upstairs in wild big keys
						if (items.bigkey2) {
							chests[2] = (isDark ? 'DA' : 'A');
						} else {
							chests[2] = (isDark ? 'DP' : 'P');
						}
					}
				}
			} else {
				if (items.lantern || items.firerod) {
					chests[2] = (flags.wildkeys ? (isDark ? 'DA' : 'A') : 'K');
				} else {
					chests[2] = 'U';
				}
			}

			//Compass Chest
			if (flags.wildbigkeys) {
				chests[3] = (items.bigkey2 ? (isDark ? 'DA' : 'A') : 'U');
			} else if (flags.wildkeys) {
				if (items.smallkey2 === 1 && (items.lantern || items.firerod)) {
					chests[3] = (isDark ? 'DA' : 'A');
				} else {
					chests[3] = (isDark ? 'DP' : 'P');
				}
			} else {
				if (items.lantern || items.firerod) {
					chests[3] = (isDark ? 'DA' : 'A');
				} else {
					chests[3] = (isDark ? 'DP' : 'P');
				}
			}

			//Big Chest
			if (flags.wildbigkeys) {
				chests[4] = (items.bigkey2 ? (isDark ? 'DA' : 'A') : 'U');
			} else if (flags.wildkeys || flags.gametype === 'R') {
				if ((items.smallkey2 === 1 || flags.gametype === 'R') && (items.lantern || items.firerod)) {
					chests[4] = (isDark ? 'DA' : 'A');
				} else {
					chests[4] = (isDark ? 'DP' : 'P');
				}
			} else {
				if (items.lantern || items.firerod) {
					chests[4] = (isDark ? 'DA' : 'A');
				} else {
					chests[4] = (isDark ? 'DP' : 'P');
				}
			}

			//Boss
			chests[5] = ConvertBossToChest(HeraBoss());

			dungeonState = available_chests(2, chests, items.maxchest2, items.chest2);
		};

		if (reachability != 'available' && (dungeonState === 'available' || dungeonState === 'partialavailable') ) {
			dungeonState = reachability
		};

		return dungeonState;
	};

	window.PoDChests = function () {
		if (isNewLogic()) {
			return dungeonAvailability(3, 'Palace of Darkness');
		};

		const reachability = canReachDungeon('Palace of Darkness');
		if (reachability === 'unavailable') return 'unavailable';

		var dungeonState = window.doorCheck(3,false,true,true,['boots','hammer','bow','bomb'],'item');
		if (!dungeonState) {
			var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

			//Because of the complexity of PoD and key logic, there are going to be five modes here to consider:
			//1) No Key Shuffle
			//2) Retro (w/ Big Key shuffle checks)
			//3) Small Key shuffle only
			//4) Big Key shuffle only
			//5) Small Key + Big Key shuffle
			//
			//We will revisit this at a later time, likely v32, to try to condense
	
			//1) No Key Shuffle
			if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {
				if ((items.bow > 1 || flags.enemyshuffle != 'N') && items.bomb) {
					//If there is a bow and bombs, all chests are available with hammer, with dark logic
					//Reserving four keys up front, two in the back, with the big key
	
					//Shooter Room
					chests[0] = 'K'; //Reserved key 1
					//Map Chest
					chests[1] = 'A';
					//The Arena - Ledge
					chests[2] = 'K'; //Reserved key 2
					//Stalfos Basement
					chests[3] = 'K'; //Reserved key 3
					//The Arena - Bridge
					chests[4] = 'K'; //Reserved big key
					//Big Key Chest
					chests[5] = 'K'; //Reserved key 4
					//Compass Chest
					chests[6] = 'K'; //Reserved key 5
					//Harmless Hellway
					chests[7] = 'K'; //Reserved key 6
					//Dark Basement - Left
					chests[8] = canDoTorchDarkRooms() ? 'A' : 'DA';
					//Dark Basement - Right
					chests[9] = canDoTorchDarkRooms() ? 'A' : 'DA';
					//Dark Maze - Top
					chests[10] = (items.lantern ? 'A' : 'DA');
					//Dark Maze - Bottom
					chests[11] = (items.lantern ? 'A' : 'DA');
					//Big Chest
					chests[12] = (items.lantern ? 'A' : 'DA');
					//Boss
					chests[13] = ConvertBossToChest(PoDBoss());
				} else {
					//Shooter Room
					chests[0] = 'P';
					if (items.bow > 1 || flags.enemyshuffle != 'N') {
						//Map Chest
						chests[1] = (items.bomb || items.boots) ? 'P' : 'U';
						//The Arena - Ledge
						chests[2] = (items.bomb ? 'P' : 'U');
					}
					//Stalfos Basement
					chests[3] = 'P';
					//The Arena - Bridge
					chests[4] = 'P';
					//Big Key Chest
					chests[5] = (items.bomb ? 'P' : 'U');
					//Compass Chest
					chests[6] = 'P';
					//Harmless Hellway
					chests[7] = 'P';
					//Dark Basement - Left
					chests[8] = canDoTorchDarkRooms() ? 'P' : 'DP';
					//Dark Basement - Right
					chests[9] = canDoTorchDarkRooms() ? 'P' : 'DP';
					//Dark Maze - Top
					chests[10] = (items.lantern ? 'P' : 'DP');
					//Dark Maze - Bottom
					chests[11] = (items.lantern ? 'P' : 'DP');
					//Big Chest
					chests[12] = (items.bomb ? items.lantern ? 'P' : 'DP' : 'U');
					//Boss
					chests[13] = 'U';
				}
	
				//2) Retro (w/ Big Key shuffle checks)
				//We ignore the wild keys check, as retro overrides it
			} else if (flags.gametype === 'R') {
				chests[0] = 'A';
	
				if (items.bow > 1 || flags.enemyshuffle != 'N') {
					//Map Chest
					chests[1] = (items.bomb || items.boots) ? 'A' : 'U';
					//The Arena - Ledge
					chests[2] = (items.bomb ? 'A' : 'U');
				}
				//Stalfos Basement
				chests[3] = 'A';
				//The Arena - Bridge
				chests[4] = 'A';
				//Big Key Chest
				chests[5] = (items.bomb ? 'A' : 'U');
				//Compass Chest
				chests[6] = 'A';
				//Harmless Hellway
				chests[7] = 'A';
				//Dark Basement - Left
				chests[8] = canDoTorchDarkRooms() ? 'A' : 'DA';
				//Dark Basement - Right
				chests[9] = canDoTorchDarkRooms() ? 'A' : 'DA';
				//Dark Maze - Top
				chests[10] = (items.lantern ? 'A' : 'DA');
				//Dark Maze - Bottom
				chests[11] = (items.lantern ? 'A' : 'DA');
				//Big Chest
				if (items.bigkey3) {
					chests[12] = (items.bomb ? items.lantern ? 'A' : 'DA' : 'P');
				}
				//Boss
				chests[13] = ConvertBossToChest(PoDBoss());
	
				//3) Small Key shuffle only
			} else if (!flags.wildbigkeys && flags.wildkeys) {
				chests[0] = 'A';
	
				if (items.bow > 1 || flags.enemyshuffle != 'N') {
					//Map Chest
					chests[1] = (items.bomb || items.boots) ? 'A' : 'U';
					//The Arena - Ledge
					chests[2] = (items.bomb ? 'A' : 'U');
				}
	
				if ((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) || items.smallkey3 > 0) {
					//Stalfos Basement
					chests[3] = 'A';
					//The Arena - Bridge
					chests[4] = 'A';
				}
	
				//Big Key Chest
				if (items.bomb && (((items.hammer && (items.bow > 1 || flags.enemyshuffle != 'N')) && items.smallkey3 > 2) || items.smallkey3 > 3)) {
					chests[5] = 'A';
				}
	
				if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 0) || items.smallkey3 > 1) {
					//Compass Chest
					chests[6] = 'A';
					//Dark Basement - Left
					chests[8] = canDoTorchDarkRooms() ? 'A' : 'DA';
					//Dark Basement - Right
					chests[9] = canDoTorchDarkRooms() ? 'A' : 'DA';
				}
	
				if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 3) || items.smallkey3 > 4) {
					//Harmless Hellway
					chests[7] = 'A';
				}
	
				if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 1) || items.smallkey3 > 2) {
					//Dark Maze - Top
					chests[10] = (items.lantern ? 'A' : 'DA');
					//Dark Maze - Bottom
					chests[11] = (items.lantern ? 'A' : 'DA');
					//Big Chest
					chests[12] = (items.bomb ? items.lantern ? 'K' : 'DP' : 'P'); // This is the big key replacement
				}
	
				//Boss
				chests[13] = ConvertBossToChest(PoDBoss());
				//4) Big Key shuffle only
			} else if (flags.wildbigkeys && !flags.wildkeys) {
				if ((items.bow > 1 || flags.enemyshuffle === 'N') && items.bomb) {
					//If there is a bow and bombs, all chests are available with hammer, with dark logic
					//Reserving four keys up front, two in the back, with the big key
	
					//Shooter Room
					chests[0] = 'K'; //Reserved key 1
					//Map Chest
					chests[1] = 'A';
					//The Arena - Ledge
					chests[2] = 'K'; //Reserved key 2
					//Stalfos Basement
					chests[3] = 'K'; //Reserved key 3
					//The Arena - Bridge
					chests[4] = 'K'; //Reserved key 4
					//Big Key Chest
					chests[5] = 'K'; //Reserved key 5
					//Compass Chest
					chests[6] = 'K'; //Reserved key 6
					//Harmless Hellway
					chests[7] = 'A';
					//Dark Basement - Left
					chests[8] = canDoTorchDarkRooms() ? 'A' : 'DA';
					//Dark Basement - Right
					chests[9] = canDoTorchDarkRooms() ? 'A' : 'DA';
					//Dark Maze - Top
					chests[10] = (items.lantern ? 'A' : 'DA');
					//Dark Maze - Bottom
					chests[11] = (items.lantern ? 'A' : 'DA');
					//Big Chest
					chests[12] = (items.bigkey3 ? (items.lantern ? 'A' : 'DA') : 'U');
					//Boss
					chests[13] = ConvertBossToChest(PoDBoss());
				} else {
					//Shooter Room
					chests[0] = 'P';
					if (items.bow > 1 || flags.enemyshuffle === 'N') {
						//Map Chest
						chests[1] = (items.bomb || items.boots) ? 'P' : 'U';
						//The Arena - Ledge
						chests[2] = items.bomb ? 'P' : 'U';
					}
					//Stalfos Basement
					chests[3] = 'P';
					//The Arena - Bridge
					chests[4] = 'P';
					//Big Key Chest
					chests[5] = (items.bomb ? 'P' : 'U');
					//Compass Chest
					chests[6] = 'P';
					//Harmless Hellway
					chests[7] = 'P';
					//Dark Basement - Left
					chests[8] = canDoTorchDarkRooms() ? 'P' : 'DP';
					//Dark Basement - Right
					chests[9] = canDoTorchDarkRooms() ? 'P' : 'DP';
					//Dark Maze - Top
					chests[10] = (items.lantern ? 'P' : 'DP');
					//Dark Maze - Bottom
					chests[11] = (items.lantern ? 'P' : 'DP');
					//Big Chest
					chests[12] = (items.bigkey3 && items.bomb ? (items.lantern ? 'P' : 'DP') : 'U');
					//Boss
					chests[13] = 'U';
				}
				//5) Small Key + Big Key shuffle
			} else {
				chests[0] = 'A';
	
				if (items.bow > 1 || flags.enemyshuffle != 'N') {
					//Map Chest
					chests[1] = (items.bomb || items.boots ? 'A' : 'U');
					//The Arena - Ledge
					chests[2] = (items.bomb ? 'A' : 'U');
				}
	
				if ((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) || items.smallkey3 > 0) {
					//Stalfos Basement
					chests[3] = 'A';
					//The Arena - Bridge
					chests[4] = 'A';
				}
	
				//Big Key Chest
				if (items.bomb && (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N'))) && items.smallkey3 > 2) || items.smallkey3 > 3)) {
					chests[5] = 'A';
				}
	
				if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 0) || items.smallkey3 > 1) {
					//Compass Chest
					chests[6] = 'A';
					//Dark Basement - Left
					chests[8] = canDoTorchDarkRooms() ? 'A' : 'DA';
					//Dark Basement - Right
					chests[9] = canDoTorchDarkRooms() ? 'A' : 'DA';
				}
	
				//Harmless Hellway
				if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 3) || items.smallkey3 > 4) {
					chests[7] = 'A';
				}
	
				if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 1) || items.smallkey3 > 2) {
					//Dark Maze - Top
					chests[10] = (items.lantern ? 'A' : 'DA');
					//Dark Maze - Bottom
					chests[11] = (items.lantern ? 'A' : 'DA');
					//Big Chest
					chests[12] = (items.bigkey3 && items.bomb ? (items.lantern ? 'A' : 'DA') : 'U');
				}
	
				//Boss
				chests[13] = ConvertBossToChest(PoDBoss());
			}
	
			dungeonState = available_chests(3, chests, items.maxchest3, items.chest3);
		};

		if (reachability != 'available' && (dungeonState === 'available' || dungeonState === 'partialavailable') ) {
			dungeonState = reachability
		};

		return dungeonState;
	};

	window.SPChests = function () {	
		if (isNewLogic()) {
			if (flags.entrancemode != 'N' && !hasFoundLocation('dam')) return 'unavailable';
			if (flags.entrancemode === 'N' && (!items.flippers || !items.mirror)) return 'unavailable';
			return dungeonAvailability(4, 'Swamp Palace');
		};

		var reachability = canReachDungeon('Swamp Palace');

		var dungeonState = window.doorCheck(4,false,false,false,['flippers','mirror','hookshot','hammer','bomb'],'item');
		if (!dungeonState) {
			if (!items.flippers) return 'unavailable';
			if (flags.glitches === 'M' || flags.glitches === 'H') {
				function accessToChest(status) {
					if (status === 'unavailable') return 'U';
					else if (status === 'darkpossible') return 'DP';
					else if (status === 'possible') return 'P';
					else if (status === 'darkavailable') return 'DA';
					else return 'A'
				}
				var entry = canEnterSwampGlitched();
				var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];
				chests[0] = (canReachSwampGlitchedAsLink() && items.flippers && items.mirror) ? 'A' : accessToChest(entry);
				chests[1] = accessToChest(entry);
				chests[2] = accessToChest(entry);
				chests[3] = accessToChest(entry);
				chests[4] = accessToChest(entry);
				chests[5] = accessToChest(entry);
				if (items.hookshot) {
					chests[6] = accessToChest(entry);
					chests[7] = accessToChest(entry);
					chests[8] = accessToChest(entry);
				}
				chests[9] = ConvertBossToChest(SPBoss());
				dungeonState = available_chests(4, chests, items.maxchest4, items.chest4);
			} else {
				if (flags.entrancemode != 'N' && !hasFoundLocation('dam')) return 'unavailable';
				if (flags.entrancemode === 'N' && (!items.flippers || !items.mirror)) return 'unavailable';
				var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];
		
				//Entrance
				if (flags.wildkeys || flags.gametype === 'R') {
					chests[0] = 'A';
				} else {
					chests[0] = 'K';
				}
		
				if (!flags.wildkeys || items.smallkey4 > 0 || flags.gametype == 'R') {
					//Map Chest
					chests[1] = (items.bomb ? 'A' : 'U');
		
					//Without hammer, cannot go any further
					if (items.hammer) {
						//Compass Chest
						chests[2] = 'A';
		
						//Big Chest
						if (flags.wildbigkeys) {
							chests[3] = (items.bigkey4 ? 'A' : 'U');
						} else {
							chests[3] = (items.hookshot ? 'K' : 'U');
						}
		
						//West Chest
						chests[4] = 'A';
		
						//Big Key Chest
						chests[5] = 'A';
		
						//Without hookshot, cannot go any further
						if (items.hookshot) {
		
							//Flooded Room - Left
							chests[6] = 'A';
		
							//Flooded Room - Right
							chests[7] = 'A';
		
							//Waterfall Room
							chests[8] = 'A';
		
							//Boss
							chests[9] = ConvertBossToChest(SPBoss());
						}
					}
				}
				dungeonState = available_chests(4, chests, items.maxchest4, items.chest4);
			};
		};

		if (reachability != 'available' && (dungeonState === 'available' || dungeonState === 'partialavailable') ) {
			dungeonState = reachability
		};

		return dungeonState;
	};

	//front and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
	window.SWChests = function (front = 'available', back = 'unavailable') {
		if (isNewLogic()) {
			return dungeonAvailability(5, 'Skull Woods');
		};

		if (flags.entrancemode != 'N') {
			const reachability = canReachDungeon('Skull Woods - Main');
			if (reachability === 'unavailable') return 'unavailable';
		}
		var dungeonState = window.doorCheck(5,false,false,false,['firerod','swordorswordless','bomb'],'item');
		if (!dungeonState) {
			if (front != back && flags.entrancemode === 'N' && (items.firerod || front === 'unavailable')) {
				front = back = bestAvailability(front, back);
			}
			var dungeoncheck = enemizer_check(5);

			var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

			if (front != 'unavailable') {
				//Compass Chest
				if (flags.wildkeys || flags.gametype === 'R') {
					chests[0] = 'A';
				} else {
					chests[0] = 'K'; //Marking front three chests as keys
				}

				//Pot Prison
				if (flags.wildkeys || flags.gametype === 'R') {
					chests[1] = 'A';
				} else {
					chests[1] = 'K'; //Marking front three chests as keys
				}

				//Map Chest
				if (flags.wildkeys || flags.gametype === 'R') {
					chests[2] = 'A';
				} else {
					chests[2] = 'K'; //Marking front three chests as keys
				}

				//Pinball Room
				chests[3] = 'A';

				//Big Chest
				if (items.bomb) {
					if (flags.wildbigkeys) {
						chests[4] = (items.bigkey5) ? 'A' : 'U';
					} else {
						if (back === 'available' && (front === 'available' || flags.gametype === 'R' || (flags.wildkeys && items.smallkey5)) && (items.sword > 0 || flags.swordmode === 'S') && items.firerod && dungeoncheck === 'available') {
							chests[4] = 'K'; //If is full clearable, set to a key, else possible
						} else {
							chests[4] = 'P';
						}
					}
				}

				//Big Key Chest
				chests[5] = 'A';

				if (front === 'possible' || front === 'darkavailable') {
					for (var k = 0; k < 6; k++) {
						if (chests[k] === 'A') chests[k] = front === 'possible' ? 'P' : 'DA';
					}
				}
				if (front === 'darkpossible') {
					for (var k = 0; k < 6; k++) {
						if (chests[k] === 'A' || chests[k] === 'P') chests[k] = 'D' + chests[k];
					}
				}
			}

			if (back != 'unavailable') {
				//Bridge Room
				chests[6] = back === 'available' || back === 'darkavailable' ? (front != 'available' && front != 'darkavailable' && !flags.wildkeys && flags.gametype != 'R' ? 'P' : 'A') : 'P';
				if (back === 'darkavailable' || back === 'darkpossible' || (back === 'available' && front === 'darkavailable' && !flags.wildkeys && flags.gametype != 'R')) chests[6] = 'D' + chests[6];

				//Boss
				chests[7] = ConvertBossToChest(SWBoss(front, back));
			}

			return available_chests(5, chests, items.maxchest5, items.chest5);
		}
	};

	window.TTChests = function () {
		if (isNewLogic()) {
			return dungeonAvailability(6, 'Thieves Town')
		};
		const reachability = canReachDungeon('Thieves Town');
		if (reachability === 'unavailable') return 'unavailable';
		var doorcheck = window.doorCheck(6,false,false,false,['hammer','glove','bomb'],'item');
		if (doorcheck) {
			return doorcheck;
		} else {
			var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

			//Map Chest
			chests[0] = 'A';

			//Ambush Chest
			chests[1] = 'A';

			//Compass Chest
			chests[2] = 'A';

			//Big Key Chest
			if (flags.wildbigkeys && flags.wildkeys) {
				chests[3] = 'A';
			} else if (flags.wildbigkeys && !flags.wildkeys) {
				//The small key could be in Blind's Cell
				chests[3] = (items.bigkey6 ? 'A' : 'P');
			} else {
				chests[3] = 'K';
			}

			if (items.bigkey6) {
				//Attic
				chests[4] = 'A';

				//Blind's Cell
				if (flags.wildkeys || flags.gametype === 'R') {
					chests[5] = 'A';
				} else {
					chests[5] = 'K'; //Reserving this chest for the small key possibility without hammer
				}

				//Big Chest			
				if (flags.wildbigkeys || flags.wildkeys || flags.gametype === 'R') {
					chests[6] = ((items.smallkey6 === 1 || flags.gametype == 'R') && items.hammer ? 'A' : 'U');
				} else {
					chests[6] = (items.hammer ? 'A' : 'P');
				}

				//Boss
				chests[7] = ConvertBossToChest(TTBoss());
			}

			return available_chests(6, chests, items.maxchest6, items.chest6);
		};
	};

	window.IPChests = function () {
		if (isNewLogic()) {
			if (!(flags.glitches === 'M' || flags.glitches === 'H')) {
				return dungeonAvailability(7, 'Ice Palace')
			};
		};

		const reachability = canReachDungeon('Ice Palace');
		if (reachability === 'unavailable') return 'unavailable';

		var doorcheck = window.doorCheck(7,false,false,false,['freezor','hammer','glove','hookshot','somaria','bomb'],'item');
		if (doorcheck) {
			return doorcheck;
		} else {

			if (!items.firerod && (!items.bombos || (items.sword == 0 && flags.swordmode != 'S')) && !(flags.glitches === 'M' || flags.glitches === 'H')) return 'unavailable';
			var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

			//Compass Chest
			if (flags.wildkeys || flags.gametype === 'R') {
				chests[0] = 'A';
			} else {
				chests[0] = items.bomb ? 'K' : 'P'; //Reserving as small key 1 but only if we can get further into the dungeon as well
			}

			if (items.bomb) {
				//Spike Room
				if (flags.wildkeys) {
					chests[1] = (items.hookshot || (items.smallkey7 > 0 || flags.gametype == 'R')) ? 'A' : 'U';
				} else {
					chests[1] = items.hookshot ? 'A' : 'P';
				}

				if (items.hammer) {
					//Map Chest
					if (items.glove > 0) {
						if (flags.wildkeys) {
							chests[2] = (items.hookshot || (items.smallkey7 > 0 || flags.gametype == 'R')) ? 'A' : 'U';
						} else {
							chests[2] = (items.hookshot ? (!flags.wildkeys ? 'K' : 'A') : 'P'); //Reserving as small key 2
						}

						//Big Key Chest
						if (flags.wildkeys) {
							chests[3] = (items.hookshot || (items.smallkey7 > 0 || flags.gametype == 'R')) ? 'A' : 'U';
						} else {
							chests[3] = (items.hookshot || items.somaria) ? 'A' : 'P';
						}
					}

					//Boss
					chests[7] = ConvertBossToChest(IPBoss());
				}

				//Freezor Chest
				chests[4] = (items.firerod || (items.bombos && (items.sword > 0 || flags.swordmode === 'S'))) ? 'A' : 'U';

				//Iced T Room
				chests[5] = 'A';

				//Big Chest
				if (flags.wildbigkeys) {
					chests[6] = (items.bigkey7 ? 'A' : 'U');
				} else {
					chests[6] = (items.hammer ? 'K' : 'P');
				}
			}

			return available_chests(7, chests, items.maxchest7, items.chest7);
		};
	};

	window.MMChests = function (medcheck) {
		if (isNewLogic()) {
			return dungeonAvailability(8, 'Misery Mire');
		};

		const reachability = canReachDungeon('Misery Mire');
		if (reachability === 'unavailable') return 'unavailable';

		var doorcheck = window.doorCheck(8,false,true,false,['hookshot','firesource','somaria','bomb'],'item');
		if (doorcheck) {
			return doorcheck;
		} else {
			if (!items.boots && !items.hookshot) return 'unavailable';
			if (!melee_bow() && !rod() && !cane()) return 'unavailable';
			if (medcheck === 'unavailable') return 'unavailable';
			if (medcheck === 'possible') return 'possible';

			var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

			//Bridge Chest
			//Spike Chest
			//Main Lobby
			if (!flags.wildkeys) {
				chests[0] = (items.lantern || items.firerod ? 'K' : 'P'); //Reserving as small key 1 if a fire source is available
				chests[1] = (items.lantern || items.firerod ? 'K' : 'P'); //Reserving as small key 2 if a fire source is available
				chests[2] = (items.lantern || items.firerod ? 'K' : 'P'); //Reserving as small key 3 if a fire source is available
			} else {
				chests[0] = 'A';
				chests[1] = 'A';
				chests[2] = 'A';
			}

			//Map Chest
			chests[3] = 'A';

			if (items.lantern || items.firerod) {
				//Compass Chest
				chests[4] = 'A';

				//Big Key Chest
				chests[5] = 'A';
			}

			//Big Chest
			if (flags.wildbigkeys) {
				chests[6] = (items.bigkey8 ? 'A' : 'U');
			} else if (flags.wildkeys) {
				chests[6] = (items.lantern || items.firerod ? 'K' : 'U'); //Reserving big key
			} else {
				chests[6] = (items.lantern || items.firerod ? 'K' : 'P'); //Reserving big key
			}

			//Boss
			chests[7] = (items.bomb ? ConvertBossToChest(MMBoss(medcheck)) : 'U');

			return available_chests(8, chests, items.maxchest8, items.chest8);
		};
	};

	//front, middle, bigchest and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
	//Not properly implemented!
	window.TRChests = function (front = 'available', middle = 'unavailable', bigchest = 'unavailable', back = 'unavailable') {
		if (isNewLogic()) {
			return dungeonAvailability(9, 'Turtle Rock');
		};

		front = canReachDungeon('Turtle Rock - Front');
		middle = canReachDungeon('Turtle Rock - West');
		bigchest = canReachDungeon('Turtle Rock - East');
		back = canReachDungeon('Turtle Rock - Back');

		var doorcheck = window.doorCheck(9,items.flute === 0 && !items.lantern,true,false,['somaria','firerod','laserbridge','bomb'],'item');
		if (doorcheck) {
			return doorcheck;
		} else {

				
			if (back != 'unavailable' && middle != 'available' && items.somaria && items.lantern && (items.bomb || items.boots)) {//More complicated with dark room navigation
				middle = back;
			}
			if (bigchest != 'unavailable' && middle != 'available' && (flags.entrancemode === 'N' || ((items.somaria || items.hookshot) && (melee_bow() || items.firerod || cane())))) {
				middle = bigchest;
			}
			if (middle != 'unavailable' && bigchest != 'available' && items.bomb && flags.entrancemode === 'N') {
				bigchest = middle;
			}
			if (middle != 'unavailable' && front != 'available' && items.somaria) {
				front = middle;
			}
			if (front != 'unavailable' && middle != 'available' && items.somaria && items.smallkey9 >= 2) {
				middle = (flags.wildkeys || flags.gametype === 'R') && items.smallkey9 === 4 ? front : 'possible';
			}
			if ((middle != 'unavailable' || bigchest != 'unavailable') && back != 'available' && items.somaria && items.lantern && (items.bomb || items.boots) && items.bigkey9) {
				back = (flags.wildkeys || flags.gametype === 'R') && items.smallkey9 === 4 && flags.wildbigkeys ? (middle === 'available' ? middle : bigchest) : 'possible';
			}
			var dungeoncheck = enemizer_check(9);
			//If we have absolutely everything, available
			if (dungeoncheck === 'available' && front === 'available' && middle === 'available' && bigchest === 'available' && back === 'available' && items.somaria && (items.bomb || items.boots) && items.firerod && items.smallkey9 === 4 && items.bigkey9) return items.lantern ? 'available' : 'darkavailable';
			//Else, see if we can use Inverted or OWG logic
			if (middle === 'available' && bigchest === 'available' && back === 'available') return TRBackChests();
			if (middle === 'available' && bigchest === 'available' && TRMidChests().endsWith('available')) return TRMidChests();
			if (middle != 'unavailable' && bigchest != 'unavailable' && back != 'unavailable') {
				var check = TRBackChests();
				if (check === 'available') return 'possible';
				if (check === 'darkavailable') return 'darkpossible';
				return check;
			}
			if (middle != 'unavailable' && bigchest != 'unavailable') {
				var check = TRMidChests();
				if (check === 'available') return 'possible';
				if (check === 'darkavailable') return 'darkpossible';
				return check;
			}
			//Otherwise, no idea
			return 'possible';
		};
	};

	window.TRFrontChests = function (medcheck) {
		if (flags.doorshuffle === 'P' || (flags.doorshuffle === 'N' && (flags.wildkeys || flags.gametype === 'R') && flags.wildbigkeys && flags.wildcompasses && flags.wildmaps)) {
			if (medcheck === 'unavailable') return 'unavailable';
			const state = dungeonAvailability(9, 'Turtle Rock');
			if (state === 'unavailable') return 'unavailable';
			if (medcheck === 'possible') return 'possible';
			return state;
		};
		if (!items.somaria) return 'unavailable';
		if (medcheck === 'unavailable') return 'unavailable';
		var isDark = items.flute === 0 && !items.lantern && !(flags.glitches != 'N' && items.boots) && flags.entrancemode === 'N' && !owGraphLogic && !(flags.glitches === 'M');

		if (medcheck === 'possible') return (isDark ? 'darkpossible' : 'possible');

		var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

		//Because of the complexity of TR and key logic, there are going to be five modes here to consider:
		//1) No Key Shuffle
		//2) Retro (w/ Big Key shuffle checks)
		//3) Small Key shuffle only
		//4) Big Key shuffle only
		//5) Small Key + Big Key shuffle
		//
		//We will revisit this at a later time, likely v32, to try to condense

		//1) No Key Shuffle
		if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {
			//Compass Chest
			chests[0] = 'K'; //Reserved as first small key

			//Chain Chomps
			chests[1] = 'K'; //Reserved as second small key

			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'K'; //Reserved as third small key, regardless if the fire rod is accessable or not

			//Big Chest
			chests[5] = (items.bomb ? items.firerod ? 'K' : 'P' : 'U'); //Reserved as big key, if fire rod made it accessable to this point

			if (items.bomb || items.boots) {
				//Crystaroller Room
				chests[6] = (items.firerod ? 'K' : 'P'); //Reserved as fourth small key

				//Laser Bridge
				chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));

				//Boss
				chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
			}

			//2) Retro (w/ Big Key shuffle checks)
			//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			//Compass Chest
			chests[0] = 'A';

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			chests[5] = (items.bomb ? items.firerod ? 'K' : 'P' : 'U'); //Reserved as big key, if fire rod made it accessable to this point

			if (items.bomb || items.boots) {
				//Crystaroller Room
				chests[6] = (items.firerod ? 'A' : 'P');

				//Laser Bridge
				chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));

				//Boss
				chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
			}

			//3) Small Key shuffle only
		} else if (!flags.wildbigkeys && flags.wildkeys) {
			//Compass Chest
			chests[0] = 'A';

			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			if (items.smallkey9 > 0) {
				//Chain Chomps
				chests[1] = 'A';

				if (items.smallkey9 > 1) {
					//Big Key Chest
					chests[4] = 'A';

					//Big Chest
					chests[5] = (items.bomb ? (items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, if fire rod made it accessable to this point

					if (items.bomb || items.boots) {
						//Crystaroller Room
						chests[6] = (items.firerod ? 'A' : 'P');

						if (items.smallkey9 > 2) {
							//Laser Bridge
							chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
							chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
							chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
							chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));

							if (items.smallkey9 > 3) {
								//Boss
								chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
							}
						}
					}
				}
			}
			//4) Big Key shuffle only
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			//Compass Chest
			chests[0] = (items.firerod ? 'K' : 'P'); //Reserved as first small key

			//Chain Chomps
			chests[1] = (items.firerod ? 'K' : 'P'); //Reserved as second small key

			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = (items.firerod ? 'K' : 'P'); //Reserved as third small key, regardless if the fire rod is accessable or not

			if (items.bigkey9 && (items.bomb || items.boots)) {
				//Big Chest
				chests[5] = (items.bomb ? items.firerod ? 'A' : 'P' : 'U'); //Reserved as big key, if fire rod made it accessable to this point

				//Crystaroller Room
				chests[6] = (items.firerod ? 'K' : 'P'); //Reserved as fourth small key

				//Laser Bridge
				chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));

				//Boss
				chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
			}
			//5) Small Key + Big Key shuffle
		} else {
			//Compass Chest
			chests[0] = 'A';

			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			if (items.smallkey9 > 0) {
				//Chain Chomps
				chests[1] = 'A';

				if (items.smallkey9 > 1) {
					//Big Key Chest
					chests[4] = 'A';

					if (items.bigkey9 && (items.bomb || items.boots)) {
						//Big Chest
						chests[5] = (items.bomb ? 'A' : 'U');

						//Crystaroller Room
						chests[6] = 'A';

						if (items.smallkey9 > 2) {
							//Laser Bridge
							chests[7] = (items.lantern ? 'A' : 'DA');
							chests[8] = (items.lantern ? 'A' : 'DA');
							chests[9] = (items.lantern ? 'A' : 'DA');
							chests[10] = (items.lantern ? 'A' : 'DA');

							if (items.smallkey9 > 3) {
								//Boss
								chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
							}
						}
					}
				}
			}
		}

		if (isDark) {
			for (var i = 0; i < 12; i++) {
				if (chests[i] === 'A') chests[i] = 'DA';
				if (chests[i] === 'P') chests[i] = 'DP';
			}
		}

		return available_chests(9, chests, items.maxchest9, items.chest9);
	};

	window.TRMidChests = function () {
		var isDark = items.flute === 0 && !items.lantern && !(flags.glitches != 'N' && items.boots) && flags.entrancemode === 'N' && !owGraphLogic && !(flags.glitches === 'M');

		var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

		//Always have direct access to Big Key and Chain Chomp chest through west door, regardless of keys

		//1) No Key Shuffle
		if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A'; //Reserved as third small key

			//Big Chest
			chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon

			//Crystaroller Room
			//If you do not have somaria, you can get through with the big key
			chests[6] = (items.somaria && items.firerod ? 'A' : 'P');

			//Laser Bridge
			//If you have somaria but not fire rod, there are up to two items not accessible, so only marking two as keys and the rest are possible
			if (items.somaria) {
				chests[7] = 'K'; //Reserved as first small key
				chests[8] = 'K'; //Reserved as second small key
				chests[9] = (items.firerod ? 'K' : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? 'K' : (items.lantern ? 'P' : 'DP'));
			}

			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());
			//2) Retro (w/ Big Key shuffle checks)
			//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon

			//Crystaroller Room
			//If you do not have somaria, you can get through with the big key
			chests[6] = (items.somaria && items.firerod ? 'A' : 'P');

			//Laser Bridge
			//If you have somaria but not fire rod, there are up to two items not accessible, so only marking two as keys and the rest are possible
			if (items.somaria) {
				chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			}

			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());
			//3) Small Key shuffle only
		} else if (!flags.wildbigkeys && flags.wildkeys) {
			//Compass Chest
			if (items.somaria && items.smallkey9 > 0) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria && items.smallkey9 > 0) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon

			//Crystaroller Room
			//If you do not have somaria, you can get through with the big key
			chests[6] = (items.somaria && items.firerod && items.smallkey9 > 0 ? 'A' : 'P');

			//Laser Bridge
			//If you have somaria but not fire rod, there are up to two items not accessible, so only marking two as keys and the rest are possible
			if (items.somaria) {
				if (items.smallkey9 > 2) {
					chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
					chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
					chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
					chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				} else if (items.smallley9 > 0) {
					chests[7] = (items.lantern ? 'P' : 'DP');
					chests[8] = (items.lantern ? 'P' : 'DP');
					chests[9] = (items.lantern ? 'P' : 'DP');
					chests[10] = (items.lantern ? 'P' : 'DP');
				}
			}

			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());

			//4) Big Key shuffle only
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			if ((items.somaria || items.hookshot) && items.bigkey9) {
				chests[5] = 'A';
			}

			//Crystaroller Room
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			if (items.bigkey9) {
				chests[6] = 'A';
			}

			//Laser Bridge
			if (items.somaria && items.bigkey9) {
				chests[7] = 'K'; //Reserved as first small key
				chests[8] = 'K'; //Reserved as second small key
				chests[9] = 'K'; //Reserved as third small key
				chests[10] = 'K'; //Reserved as fourth small key
			}

			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());
			//5) Small Key + Big Key shuffle
		} else {
			//Compass Chest
			if (items.somaria && items.smallkey9 > 0) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria && items.smallkey9 > 0) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			if ((items.somaria || items.hookshot) && items.bigkey9) {
				chests[5] = 'A';
			}

			//Crystaroller Room
			//If you do not have somaria, you can get through with the big key
			if (items.bigkey9) {
				chests[6] = 'A';
			}

			//Laser Bridge
			//If you have somaria but not fire rod, there are up to two items not accessible, so only marking two as keys and the rest are possible
			if (items.somaria && items.bigkey9) {
				chests[7] = (items.smallkey9 > 2 ? (items.lantern ? 'A' : 'DA') : (items.smallkey9 > 0 ? (items.lantern ? 'P' : 'DP') : 'U'));
				chests[8] = (items.smallkey9 > 2 ? (items.lantern ? 'A' : 'DA') : (items.smallkey9 > 0 ? (items.lantern ? 'P' : 'DP') : 'U'));
				chests[9] = (items.smallkey9 > 2 ? (items.lantern ? 'A' : 'DA') : (items.smallkey9 > 0 ? (items.lantern ? 'P' : 'DP') : 'U'));
				chests[10] = (items.smallkey9 > 2 ? (items.lantern ? 'A' : 'DA') : (items.smallkey9 > 0 ? (items.lantern ? 'P' : 'DP') : 'U'));
			}

			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());
		}

		if (isDark) {
			for (var i = 0; i < 12; i++) {
				if (chests[i] === 'A') chests[i] = 'DA';
				if (chests[i] === 'P') chests[i] = 'DP';
			}
		}

		return available_chests(9, chests, items.maxchest9, items.chest9);
	};

	window.TRBackChests = function () {
		var isDark = items.flute === 0 && !items.lantern && flags.entrancemode === 'N' && !owGraphLogic;

		var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

		//Always have direct access to Laser Bridge through back door, Big Key and Chain Chomp chest through west door, regardless of keys

		//1) No Key Shuffle
		if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon

			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : 'DA') : 'P');

			//Laser Bridge
			chests[7] = 'K'; //Reserved as first small key
			chests[8] = 'K'; //Reserved as second small key
			chests[9] = 'K'; //Reserved as third small key
			chests[10] = 'K'; //Reserved as fourth small key

			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());
			//2) Retro (w/ Big Key shuffle checks)
			//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			if (flags.wildbigkeys) {
				chests[5] = (items.bigkey9 && (items.somaria || items.hookshot) ? 'A' : 'U');
			} else {
				chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon
			}

			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : 'DA') : 'P');

			//Laser Bridge
			chests[7] = 'A';
			chests[8] = 'A';
			chests[9] = 'A';
			chests[10] = 'A';

			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());
			//3) Small Key shuffle only
		} else if (!flags.wildbigkeys && flags.wildkeys) {
			//Compass Chest
			if (items.somaria && items.smallkey9 > 0) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria && items.smallkey9 > 0) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			chests[5] = ((items.somaria || items.firerod) ? 'K' : 'P');

			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : 'DA') : 'P');

			//Laser Bridge
			chests[7] = 'A';
			chests[8] = 'A';
			chests[9] = 'A';
			chests[10] = 'A';

			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());

			//4) Big Key shuffle only
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			chests[5] = ((items.somaria || items.firerod) && items.bigkey9 ? 'A' : 'U');

			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : (items.bigkey9 ? 'A' : 'DA')) : (items.bigkey9 ? 'A' : 'U'));

			//Laser Bridge
			chests[7] = (items.somaria ? 'K' : 'P'); //Reserved as first small key if access to the front are available, else possible only with small keys up front
			chests[8] = (items.somaria ? 'K' : 'P'); //Reserved as second small key if access to the front are available, else possible only with small keys up front
			chests[9] = (items.somaria ? 'K' : 'P'); //Reserved as third small key if access to the front are available, else possible only with small keys up front
			chests[10] = (items.somaria ? 'K' : 'P'); //Reserved as fourth small key if access to the front are available, else possible only with small keys up front

			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());
			//5) Small Key + Big Key shuffle
		} else {
			//Compass Chest
			if (items.somaria && items.smallkey9 > 0) {
				chests[0] = 'A';
			}

			//Chain Chomps
			chests[1] = 'A';

			if (items.firerod && items.somaria && items.smallkey9 > 0) {
				//Roller Room - Left
				chests[2] = 'A';

				//Roller Room - Right
				chests[3] = 'A';
			}

			//Big Key Chest
			chests[4] = 'A';

			//Big Chest
			chests[5] = ((items.somaria || items.firerod) && items.bigkey9 ? 'A' : 'U');

			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : (items.bigkey9 ? 'A' : 'DA')) : (items.bigkey9 ? 'A' : 'U'));

			//Laser Bridge
			chests[7] = 'A'; //Reserved as first small key
			chests[8] = 'A'; //Reserved as second small key
			chests[9] = 'A'; //Reserved as third small key
			chests[10] = 'A'; //Reserved as fourth small key

			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());
		}

		if (isDark) {
			for (var i = 0; i < 12; i++) {
				if (chests[i] === 'A') chests[i] = 'DA';
				if (chests[i] === 'P') chests[i] = 'DP';
			}
		}

		return available_chests(9, chests, items.maxchest9, items.chest9);
	};

	window.GTChests = function () {
		if (isNewLogic()) {
			return dungeonAvailability(10, 'Ganons Tower')
		};

		const reachability = canReachDungenon('Ganons Tower');
		if (reachability === 'unavailable') return 'unavailable';
		var doorcheck = window.doorCheck(10,items.flute === 0 && !items.lantern,false,false,['hammer','firerod','hookshot','boomerang','somaria','boots','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'item');
		if (doorcheck) {
			return doorcheck;
		} else {

			var isDark = items.flute === 0 && !items.lantern && flags.gametype != 'I' && !(flags.glitches != 'N' && items.boots) && flags.entrancemode === 'N' && !owGraphLogic && !(flags.glitches === 'M');

			var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

			//1) No Key Shuffle
			if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {

				//Bob's Torch - 0 
				if (items.boots) chests[0] = 'A';

				if (items.hammer) {
					if (items.hookshot) {
						//DMs Room - Top Left - 0
						chests[1] = 'K'; //Reserving as small key 1
						//DMs Room - Top Right - 0
						chests[2] = 'K'; //Reserving as small key 2
						//DMs Room - Bottom Left - 0
						chests[3] = 'A';
						//DMs Room - Bottom Right - 0
						chests[4] = 'A';

						//Firesnake Room - 0
						chests[6] = 'K';  //Reserving as small key 3

						if (items.bomb) {
							//Randomizer Room - Top Left - 1
							chests[7] = 'A';
							//Randomizer Room - Top Right - 1
							chests[8] = 'A';
							//Randomizer Room - Bottom Left - 1
							chests[9] = 'A';
							//Randomizer Room - Bottom Right - 1
							chests[10] = 'A';
						}
					}

					if (items.hookshot || items.boots) {
						//Map Chest - 1
						chests[5] = 'A';
					}
				}

				if ((items.hammer && items.hookshot) || (items.firerod && items.somaria)) {
					//Big Chest - 2
					chests[11] = 'K'; //Reserving as big key
					//Bob's Chest - 2
					chests[12] = 'A';

					if (items.bomb) {
						//Big Key Chest - 2
						chests[13] = 'A';
						//Big Key Room - Left - 2
						chests[14] = 'A';
						//Big Key Room - Right - 2
						chests[15] = 'A';
					}
				}

				//Hope Room - Left - 0
				chests[16] = 'A';

				//Hope Room - Right - 0
				chests[17] = 'A';

				if (items.somaria) {
					//Tile Room - 0
					chests[18] = 'A';

					if (items.firerod) {
						//Compass Room - Top Left - 2
						chests[19] = 'K'; //Reserving as small key 4
						//Compass Room - Top Right - 2
						chests[20] = 'A';
						//Compass Room - Bottom Left - 2
						chests[21] = 'A';
						//Compass Room - Bottom Right - 2
						chests[22] = 'A';
					}
				}

				if ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
					//Mini Helmasaur Room - Left - 3
					chests[23] = 'A';
					//Mini Helmasaur Room - Right - 3
					chests[24] = 'A';
					if (items.bomb) {
						//Pre-Moldorm Chest - 3
						chests[25] = 'A';

						if (items.hookshot) {
							//Moldorm Chest
							chests[26] = 'A';
						}
					}
				}
				//2) Retro (w/ Big Key shuffle checks)
				//We ignore the wild keys check, as retro overrides it
			} else if (flags.gametype === 'R') {
				//Bob's Torch - 0 
				if (items.boots) chests[0] = 'A';

				if (items.hammer) {
					if (items.hookshot) {
						//DMs Room - Top Left - 0
						chests[1] = 'A';
						//DMs Room - Top Right - 0
						chests[2] = 'A';
						//DMs Room - Bottom Left - 0
						chests[3] = 'A';
						//DMs Room - Bottom Right - 0
						chests[4] = 'A';

						//Firesnake Room - 0
						chests[6] = 'A';

						if (items.bomb) {
							//Randomizer Room - Top Left - 1
							chests[7] = 'A';
							//Randomizer Room - Top Right - 1
							chests[8] = 'A';
							//Randomizer Room - Bottom Left - 1
							chests[9] = 'A';
							//Randomizer Room - Bottom Right - 1
							chests[10] = 'A';
						}
					}

					if (items.hookshot || items.boots) {
						//Map Chest - 1
						chests[5] = 'A';
					}
				}

				if ((items.hammer && items.hookshot) || (items.firerod && items.somaria)) {
					//Big Chest - 2
					chests[11] = (flags.wildbigkeys ? (items.bigkey10 ? 'A' : 'U') : 'K'); //Reserving as big key
					//Bob's Chest - 2
					chests[12] = 'A';

					if (items.bomb) {
						//Big Key Chest - 2
						chests[13] = 'A';
						//Big Key Room - Left - 2
						chests[14] = 'A';
						//Big Key Room - Right - 2
						chests[15] = 'A';
					}
				}

				//Hope Room - Left - 0
				chests[16] = 'A';

				//Hope Room - Right - 0
				chests[17] = 'A';

				if (items.somaria) {
					//Tile Room - 0
					chests[18] = 'A';

					if (items.firerod) {
						//Compass Room - Top Left - 2
						chests[19] = 'A';
						//Compass Room - Top Right - 2
						chests[20] = 'A';
						//Compass Room - Bottom Left - 2
						chests[21] = 'A';
						//Compass Room - Bottom Right - 2
						chests[22] = 'A';
					}
				}

				if ((!flags.wildbigkeys || items.bigkey10) && (items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
					//Mini Helmasaur Room - Left - 3
					chests[23] = 'A';
					//Mini Helmasaur Room - Right - 3
					chests[24] = 'A';
					if (items.bomb) {
						//Pre-Moldorm Chest - 3
						chests[25] = 'A';

						if (items.hookshot) {
							//Moldorm Chest
							chests[26] = 'A';
						}
					}
				}
				//3) Small Key shuffle only
			} else if (!flags.wildbigkeys && flags.wildkeys) {
				//Bob's Torch - 0 
				if (items.boots) chests[0] = 'A';

				if (items.hammer) {
					if (items.hookshot) {
						//DMs Room - Top Left - 0
						chests[1] = 'A';
						//DMs Room - Top Right - 0
						chests[2] = 'A';
						//DMs Room - Bottom Left - 0
						chests[3] = 'A';
						//DMs Room - Bottom Right - 0
						chests[4] = 'A';

						//Firesnake Room - 0
						chests[6] = 'A';

						if (items.smallkey10 > 0 && items.bomb) {
							//Randomizer Room - Top Left - 1
							chests[7] = 'A';
							//Randomizer Room - Top Right - 1
							chests[8] = 'A';
							//Randomizer Room - Bottom Left - 1
							chests[9] = 'A';
							//Randomizer Room - Bottom Right - 1
							chests[10] = 'A';
						}
					}

					if ((items.hookshot || items.boots) && items.smallkey10 > 0) {
						//Map Chest - 1
						chests[5] = 'A';
					}
				}

				if (((items.hammer && items.hookshot) || (items.firerod && items.somaria)) && items.smallkey10 > 1) {
					//Big Chest - 2
					chests[11] = 'K';
					//Bob's Chest - 2
					chests[12] = 'A';

					if (items.bomb) {
						//Big Key Chest - 2
						chests[13] = 'A';
						//Big Key Room - Left - 2
						chests[14] = 'A';
						//Big Key Room - Right - 2
						chests[15] = 'A';
					}
				}

				//Hope Room - Left - 0
				chests[16] = 'A';

				//Hope Room - Right - 0
				chests[17] = 'A';

				if (items.somaria) {
					//Tile Room - 0
					chests[18] = 'A';

					if (items.firerod && items.smallkey10 > 1) {
						//Compass Room - Top Left - 2
						chests[19] = 'A';
						//Compass Room - Top Right - 2
						chests[20] = 'A';
						//Compass Room - Bottom Left - 2
						chests[21] = 'A';
						//Compass Room - Bottom Right - 2
						chests[22] = 'A';
					}
				}

				if ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod) && items.smallkey10 > 0 && items.bigkey10) {
					//Mini Helmasaur Room - Left - 3
					chests[23] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
					//Mini Helmasaur Room - Right - 3
					chests[24] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');

					if (items.bomb) {
						//Pre-Moldorm Chest - 3
						chests[25] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');

						if (items.hookshot) {
							//Moldorm Chest - 3
							chests[26] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
						}
					}
				}
				//4) Big Key shuffle only
			} else if (flags.wildbigkeys && !flags.wildkeys) {
				//Bob's Torch - 0 
				if (items.boots) chests[0] = 'A';

				if (items.hammer) {
					if (items.hookshot) {
						//DMs Room - Top Left - 0
						chests[1] = 'K'; //Reserving as small key 1
						//DMs Room - Top Right - 0
						chests[2] = 'K'; //Reserving as small key 2
						//DMs Room - Bottom Left - 0
						chests[3] = 'A';
						//DMs Room - Bottom Right - 0
						chests[4] = 'A';

						//Firesnake Room - 0
						chests[6] = 'K';  //Reserving as small key 3

						if (items.bomb) {
							//Randomizer Room - Top Left - 1
							chests[7] = 'A';
							//Randomizer Room - Top Right - 1
							chests[8] = 'A';
							//Randomizer Room - Bottom Left - 1
							chests[9] = 'A';
							//Randomizer Room - Bottom Right - 1
							chests[10] = 'A';
						}
					}

					if (items.hookshot || items.boots) {
						//Map Chest - 1
						chests[5] = 'A';
					}
				}

				if ((items.hammer && items.hookshot) || (items.firerod && items.somaria)) {
					//Big Chest - 2
					chests[11] = (items.bigkey10 ? 'A' : 'U');
					//Bob's Chest - 2
					chests[12] = 'A';

					if (items.bomb) {
						//Big Key Chest - 2
						chests[13] = 'A';
						//Big Key Room - Left - 2
						chests[14] = 'A';
						//Big Key Room - Right - 2
						chests[15] = 'A';
					}
				}

				//Hope Room - Left - 0
				chests[16] = 'A';

				//Hope Room - Right - 0
				chests[17] = 'A';

				if (items.somaria) {
					//Tile Room - 0
					chests[18] = 'A';

					if (items.firerod) {
						//Compass Room - Top Left - 2
						chests[19] = 'K'; //Reserving as small key 4
						//Compass Room - Top Right - 2
						chests[20] = 'A';
						//Compass Room - Bottom Left - 2
						chests[21] = 'A';
						//Compass Room - Bottom Right - 2
						chests[22] = 'A';
					}
				}

				if (items.bigkey10 && (items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
					//Mini Helmasaur Room - Left - 3
					chests[23] = 'A';
					//Mini Helmasaur Room - Right - 3
					chests[24] = 'A';

					if (items.bomb) {
						//Pre-Moldorm Chest - 3
						chests[25] = 'A';

						if (items.hookshot) {
							//Moldorm Chest
							chests[26] = 'A';
						}
					}
				}
				//5) Small Key + Big Key shuffle
			} else {
				//Bob's Torch - 0 
				if (items.boots) chests[0] = 'A';

				if (items.hammer) {
					if (items.hookshot) {
						//DMs Room - Top Left - 0
						chests[1] = 'A';
						//DMs Room - Top Right - 0
						chests[2] = 'A';
						//DMs Room - Bottom Left - 0
						chests[3] = 'A';
						//DMs Room - Bottom Right - 0
						chests[4] = 'A';

						//Firesnake Room - 0
						chests[6] = 'A';

						if (items.smallkey10 > 0 && items.bomb) {
							//Randomizer Room - Top Left - 1
							chests[7] = 'A';
							//Randomizer Room - Top Right - 1
							chests[8] = 'A';
							//Randomizer Room - Bottom Left - 1
							chests[9] = 'A';
							//Randomizer Room - Bottom Right - 1
							chests[10] = 'A';
						}
					}

					if ((items.hookshot || items.boots) && items.smallkey10 > 0) {
						//Map Chest - 1
						chests[5] = 'A';
					}
				}

				if (((items.hammer && items.hookshot) || (items.firerod && items.somaria)) && items.smallkey10 > 1) {
					//Big Chest - 2
					chests[11] = (items.bigkey10 ? 'A' : 'U');
					//Bob's Chest - 2
					chests[12] = 'A';

					if (items.bomb) {
						//Big Key Chest - 2
						chests[13] = 'A';
						//Big Key Room - Left - 2
						chests[14] = 'A';
						//Big Key Room - Right - 2
						chests[15] = 'A';
					}
				}

				//Hope Room - Left - 0
				chests[16] = 'A';

				//Hope Room - Right - 0
				chests[17] = 'A';

				if (items.somaria) {
					//Tile Room - 0
					chests[18] = 'A';

					if (items.firerod && items.smallkey10 > 1) {
						//Compass Room - Top Left - 2
						chests[19] = 'A';
						//Compass Room - Top Right - 2
						chests[20] = 'A';
						//Compass Room - Bottom Left - 2
						chests[21] = 'A';
						//Compass Room - Bottom Right - 2
						chests[22] = 'A';
					}
				}

				if ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod) && (items.smallkey10 > 0 || flags.entrancemode != 'Y') && items.bigkey10) {
					//Mini Helmasaur Room - Left - 3
					chests[23] = ((items.smallkey10 > 2 || flags.gametype == 'R' || flags.entrancemode != 'Y') ? 'A' : 'P');
					//Mini Helmasaur Room - Right - 3
					chests[24] = ((items.smallkey10 > 2 || flags.gametype == 'R' || flags.entrancemode != 'Y') ? 'A' : 'P');

					if (items.bomb) {
						//Pre-Moldorm Chest - 3
						chests[25] = ((items.smallkey10 > 2 || flags.gametype == 'R' || (flags.entrancemode != 'Y' && items.smallkey10 > 0)) ? 'A' : 'P');

						if (items.hookshot) {
							//Moldorm Chest - 3
							chests[26] = ((items.smallkey10 > 2 || flags.gametype == 'R' || (flags.entrancemode != 'Y' && items.smallkey10 > 1)) ? 'A' : 'P');
						}
					}
				}
			}

			if (flags.wildbigkeys || flags.wildkeys || flags.gametype === 'R') {


			} else {
				//Bob's Torch - 0 
				if (items.boots) chests[0] = 'A';

				if (items.hammer) {
					if (items.hookshot) {
						//DMs Room - Top Left - 0
						chests[1] = 'K'; //Reserving as small key 1
						//DMs Room - Top Right - 0
						chests[2] = 'K'; //Reserving as small key 2
						//DMs Room - Bottom Left - 0
						chests[3] = 'A';
						//DMs Room - Bottom Right - 0
						chests[4] = 'A';

						//Firesnake Room - 0
						chests[6] = 'K';  //Reserving as small key 3

						if (items.bomb) {
							//Randomizer Room - Top Left - 1
							chests[7] = 'A';
							//Randomizer Room - Top Right - 1
							chests[8] = 'A';
							//Randomizer Room - Bottom Left - 1
							chests[9] = 'A';
							//Randomizer Room - Bottom Right - 1
							chests[10] = 'A';
						}
					}

					if (items.hookshot || items.boots) {
						//Map Chest - 1
						chests[5] = 'A';
					}
				}

				if ((items.hammer && items.hookshot) || (items.firerod && items.somaria)) {
					//Big Chest - 2
					chests[11] = 'K';
					//Bob's Chest - 2
					chests[12] = 'A';

					if (items.bomb) {
						//Big Key Chest - 2
						chests[13] = 'A';
						//Big Key Room - Left - 2
						chests[14] = 'A';
						//Big Key Room - Right - 2
						chests[15] = 'A';
					}
				}

				//Hope Room - Left - 0
				chests[16] = 'A';

				//Hope Room - Right - 0
				chests[17] = 'A';

				if (items.somaria) {
					//Tile Room - 0
					chests[18] = 'A';

					if (items.firerod) {
						//Compass Room - Top Left - 2
						chests[19] = 'K'; //Reserving as small key 4
						//Compass Room - Top Right - 2
						chests[20] = 'A';
						//Compass Room - Bottom Left - 2
						chests[21] = 'A';
						//Compass Room - Bottom Right - 2
						chests[22] = 'A';
					}
				}

				if ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
					//Mini Helmasaur Room - Left - 3
					chests[23] = 'A';
					//Mini Helmasaur Room - Right - 3
					chests[24] = 'A';
					if (items.bomb) {
						//Pre-Moldorm Chest - 3
						chests[25] = 'A';

						if (items.hookshot) {
							//Moldorm Chest
							chests[26] = 'A';
						}
					}
				}
			}

			if (isDark) {
				for (var i = 0; i < 27; i++) {
					if (chests[i] === 'A') chests[i] = 'DA';
					if (chests[i] === 'P') chests[i] = 'DP';
				}
			}

			return available_chests(10, chests, items.maxchest10, items.chest10);
		};
	};

	//front, back and sanc can be 'available', 'possible' or 'unavailable', at most two can be 'unavailable'
	window.HCChests = function (front = 'available', back = 'unavailable', sanc = 'unavailable') {
		if (isNewLogic()) {
			return dungeonAvailability(11, 'Hyrule Castle');
		};

		var front = canReachDungenon('Hyrule Castle - Main');
		var back = canReachDungenon('Hyrule Castle - Sewers Dropdown');
		var sanc = canReachDungenon('Sanctuary');
		if (front === 'unavailable' && back === 'unavailable' && sanc === 'unavailable') return 'unavailable';

		var doorcheck = window.doorCheck(11,false,false,flags.gametype != 'S',['glove','killbomb','bombdash'],'item');
		if (doorcheck) {
			return doorcheck;
		} else {
			var weapon = items.bomb || melee_bow() || items.firerod || cane();
			if (flags.gametype === 'S') {
				front = back = sanc = 'available';
				weapon = true;
			}
			//Walk from front to back
			if (front != 'unavailable' && back != 'available' && (weapon || items.icerod || flags.gametype === 'R')) {
				var backFromFront = canDoTorchDarkRooms() ? front : (front === 'available' || front === 'possible' ? 'dark' + front : front);
				if (flags.gametype === 'R') {
					back = bestAvailability(back, backFromFront);
				} else {
					if (!flags.wildkeys) {
						back = bestAvailability(back, backFromFront.startsWith('dark') ? 'darkpossible' : 'possible');
					} else {
						if (items.smallkeyhalf0) {
							back = bestAvailability(back, backFromFront);
						}
					}
				}
			}
			//Walk from back to sanc
			if (back != 'unavailable' && sanc != 'available') {
				bestAvailability(sanc, back);
			}

			var chests = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

			var frontChest = ConvertBossToChest(front);
			var backChest = ConvertBossToChest(back);
			var sancChest = ConvertBossToChest(sanc);

			if (front != 'unavailable') {
				chests[0] = frontChest;
				if (weapon) {
					chests[1] = frontChest;
					chests[2] = frontChest;
				}
				if (canDoTorchDarkRooms() || flags.gametype === 'S') {
					chests[3] = frontChest;
				} else {
					chests[3] = front === 'available' || front === 'darkavailable' ? 'DA' : 'DP';
				}
			} else {
				if (back != 'unavailable' && (weapon || items.icerod)) {
					var darkCrossFromBack = canDoTorchDarkRooms() ? backChest : (backChest === 'A' || backChest === 'P' ? 'D' + backChest : backChest);
					if (flags.gametype === 'R') {
						chests[3] = darkCrossFromBack;
					} else {
						if (!flags.wildkeys) {
							chests[3] = darkCrossFromBack === 'A' ? 'P' : (darkCrossFromBack === 'DA' ? 'DP' : darkCrossFromBack);
						} else {
							if (items.smallkeyhalf0) {
								chests[3] = darkCrossFromBack;
							}
						}
					}
				}
			}

			if (back != 'unavailable' && (items.bomb || items.boots)) {
				chests[4] = back === backChest;
				chests[5] = back === backChest;
				chests[6] = back === backChest;
			}
			if (sanc != 'unavailable') {
				chests[7] = sancChest;
			}
			if (!flags.wildkeys && flags.gametype != 'R') {
				if (flags.gametype === 'S') {
					chests[0] = 'K';
				} else {
					for (var k = 0; k < 8; k++) {//Small key could be anywhere. Temporary bad solution
						if (chests[k] === 'A') {
							chests[k] = 'P';
							break;
						}
						if (chests[k] === 'DA') {
							chests[k] = 'DP';
							break;
						}
					}
				}
			}

			return available_chests(11, chests, items.maxchest11, items.chest11);
		};
	};

	window.CTChests = function () {
		if (isNewLogic()) {
			return dungeonAvailability(12, 'Castle Tower')
		};

		const reachability = canReachDungenon('Castle Tower');
		if (reachability === 'unavailable') return 'unavailable';
		const doorcheck = window.doorCheck(12,false,true,true,['kill','swordorswordless'],'item');
		if (doorcheck) {
			return doorcheck;
		} else {
			if (!items.bomb && !melee_bow() && !cane() && !items.firerod) return 'unavailable';

			var chests = ['U', 'U'];

			if (flags.wildkeys || flags.gametype === 'R') {
				chests[0] = 'A';
				if (items.smallkeyhalf1 > 0)
					chests[1] = items.lantern ? 'A' : 'DA';
			}
			else {
				chests[0] = 'K';
				chests[1] = 'K';
			}

			return available_chests(12, chests, items.maxchest12, items.chest12);
		};
	};
	// #endregion

}(window));
