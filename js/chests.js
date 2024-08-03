(function(window) {
    'use strict';
	
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
	
    function melee() { return items.sword || items.hammer; }
    function melee_bow() { return melee() || items.bow > 0; }
    function cane() { return items.somaria || items.byrna; }
    function rod() { return items.firerod || items.icerod; }
    function canHitSwitch() { return items.bomb || melee_bow() || cane() || rod() || items.boomerang || items.hookshot; }
    function agatowerweapon() { return items.sword > 0 || items.somaria || items.bow > 0 || items.hammer || items.firerod; }
    function always() { return 'available'; }
	function canGetBonkableItem() { return items.boots || (items.sword && items.quake) };
	function activeFlute() { return (items.flute === 1 && (canReachLightWorld() || flags.activatedflute)) || items.flute > 1 };
	
	// Glitched-specific functions
	function glitchLinkState() { return flags.glitches === 'M' && (items.moonpearl || items.bottle) };
	function canSpinSpeed() { return items.boots && (items.sword || items.hookshot) };
	function canBunnyPocket() { return items.boots && (items.mirror || items.bottle) };

	// Non-entrance reach-functions

	function canReachLightWorld() {
		if (flags.gametype != 'I') {
			return true;
		};
		if (flags.gametype === 'I') {
			items.moonpearl && (items.glove === 2 || (items.glove && items.hammer) || canReachLightWorldBunny());
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
			if (items.mirror && (items.boots || (canReach() && items.moonpearl))) return true;
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
			(canReachWDM() && (items.mirror || (items.hookshot && items.hammer)))
		};
		if (flags.gametype === 'I') {
			if (canReachEDM() && items.moonpearl && items.hammer) return true;
		};
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

	window.loadChestFlagsItem = function() {
			
		//Is OWG Mode, does not cover Inverted
		if (flags.glitches === "O" || flags.glitches === 'H' || flags.glitches === 'M') {
			// define dungeon chests
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
					return canReachDP() ? window.DPBoss() : 'unavailable';
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

			//define overworld chests
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
		
		// Unsupported glitch mode, with minimal checks for availability aside from hard-locked locations
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

			//define overworld chests
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
		
		//Is Inverted Mode
		else if (flags.gametype === "I") {
			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachLightWorld()) return 'unavailable';
					var doorcheck = window.doorCheck(0,false,true,true,['hookshot','bow'],'boss');
					if (doorcheck) return doorcheck;
					return window.EPBoss();
				},
				can_get_chest: function() {
					if (!canReachLightWorld()) return 'unavailable';
					var doorcheck = window.doorCheck(0,false,true,true,['hookshot','bow'],'item');
					if (doorcheck) return doorcheck;
					return window.EPChests();
				}
			}, { // [1]
				caption: 'Desert Palace {book}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachLightWorldBunny() || !items.book) return 'unavailable';
					var doorcheck = window.doorCheck(1,false,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','glove','firesource','killbomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.DPBoss();
				},
				can_get_chest: function() {
					//if (!items.book || !canReachLightWorldBunny()) return 'unavailable';
					if (!canReachLightWorld() || !items.book) return 'unavailable';
					var doorcheck = window.doorCheck(1,false,false,false,['boots','glove','firesource','killbomb'],'item');
					if (doorcheck) return doorcheck;
					return window.DPChests();
				}
			}, { // [2]
				caption: 'Tower of Hera {hammer} [{hookshot}/{glove2}]',
				is_beaten: false,
				is_beatable: function() {
					if(!canReachHera()) return 'unavailable';
					var doorcheck = window.doorCheck(2,!activeFlute() && !items.lantern,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'firesource' : ''],'boss');
					if (doorcheck) return doorcheck;
					return window.HeraBoss();
				},
				can_get_chest: function() {
					if(!canReachHera()) return 'unavailable';
					var doorcheck = window.doorCheck(2,!activeFlute() && !items.lantern,false,false,['firesource'],'item');
					if (doorcheck) return doorcheck;
					return window.HeraChests();
				}
			}, { // [3]
				caption: 'Palace of Darkness',
				is_beaten: false,
				is_beatable: function() {
					if(!canReachEDW()) return 'unavailable';
					var doorcheck = window.doorCheck(3,false,true,true,['boots','hammer','bow','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.PoDBoss();
				},
				can_get_chest: function() {
					if (!canReachEDW()) return 'unavailable';
					var doorcheck = window.doorCheck(3,false,true,true,['boots','hammer','bow','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.PoDChests();
				}
			}, { // [4]
				caption: 'Swamp Palace {mirror} {flippers}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachLightWorld() || !items.mirror) return 'unavailable';
					var doorcheck = window.doorCheck(4,false,false,false,['flippers','mirror','hookshot','hammer','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.SPBoss();
				},
				can_get_chest: function() {
					if (!canReachLightWorld() || !items.mirror) return 'unavailable';
					var doorcheck = window.doorCheck(4,false,false,false,['flippers','mirror','hookshot','hammer','bomb'],'item');
					if (doorcheck) return doorcheck;
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

			//define overworld chests
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
			// define dungeon chests
			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() {
					var doorcheck = window.doorCheck(0,false,true,true,['hookshot','bow'],'boss');
					if (doorcheck) return doorcheck;
					return window.EPBoss();
				},
				can_get_chest: function() {
					var doorcheck = window.doorCheck(0,false,true,true,['hookshot','bow'],'item');
					if (doorcheck) return doorcheck;
					return window.EPChests();
					
				}
			}, { // [1]
				caption: 'Desert Palace {book} / {glove2} {mirror} {flute}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachDP()) return 'unavailable';
					var doorcheck = window.doorCheck(1,false,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','glove','firesource','killbomb','mirrordesert'],'boss');
					if (doorcheck) return doorcheck;
					return window.DPBoss();
				},
				can_get_chest: function() {
					if (!items.book && !(items.flute >= 1 && items.glove === 2 && items.mirror)) return 'unavailable';
					var doorcheck = window.doorCheck(1,false,false,false,['boots','glove','firesource','killbomb','mirrordesert'],'item');
					if (doorcheck) return doorcheck;
					return window.DPChests();
				}
			}, { // [2]
				caption: 'Tower of Hera {mirror} / {hookshot} {hammer}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachHera()) return 'unavailable';
					var doorcheck = window.doorCheck(2,items.flute === 0 && !items.lantern,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'firesource' : '','kill'],'boss');
					if (doorcheck) return doorcheck;
					if (!canHitSwitch()) return 'unavailable';
					return window.HeraBoss();
				},
				can_get_chest: function() {
					if (!canReachHera()) return 'unavailable';
					var doorcheck = window.doorCheck(2,items.flute === 0 && !items.lantern,false,false,['firesource','kill'],'item');
					if (doorcheck) return doorcheck;
					if (!canHitSwitch()) return 'unavailable';
					return window.HeraChests();
				}
			}, { // [3]
				caption: 'Palace of Darkness',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachEDW()) return 'unavailable';
					var doorcheck = window.doorCheck(3,false,true,true,['boots','hammer','bow','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.PoDBoss();
				},
				can_get_chest: function() {
					if (!canReachEDW()) return 'unavailable';
					if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
					var doorcheck = window.doorCheck(3,false,true,true,['boots','hammer','bow','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.PoDChests();
				}
			}, { // [4]
				caption: 'Swamp Palace {mirror} {flippers}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachSDW()) return 'unavailable';
					var doorcheck = window.doorCheck(4,false,false,false,['flippers','mirror','hookshot','hammer','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.SPBoss();
				},
				can_get_chest: function() {
					if (!canReachSDW()) return 'unavailable';
					var doorcheck = window.doorCheck(4,false,false,false,['flippers','mirror','hookshot','hammer','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.SPChests();
				}
			}, { // [5]
				caption: 'Skull Woods',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachWDW()) return 'unavailable';
					var doorcheck = window.doorCheck(5,false,false,false,['firerod','swordorswordless','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.SWBoss();
				},
				can_get_chest: function() {
					if (!canReachWDW()) return 'unavailable';
					var doorcheck = window.doorCheck(5,false,false,false,['firerod','swordorswordless','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.SWChests();
				}
			}, { // [6]
				caption: 'Thieves\' Town',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachWDW()) return 'unavailable';
					var doorcheck = window.doorCheck(6,false,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'hammer' : '','glove','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.TTBoss();
				},
				can_get_chest: function() {
					if (!canReachWDW()) return 'unavailable';
					var doorcheck = window.doorCheck(6,false,false,false,['hammer','glove','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.TTChests();
				}
			}, { // [7]
				caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
				is_beaten: false,
				is_beatable: function() {
					if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
					var doorcheck = window.doorCheck(7,false,false,false,['freezor','hammer','glove','hookshot','somaria','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.IPBoss();
				},
				can_get_chest: function() {
					if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
					var doorcheck = window.doorCheck(7,false,false,false,['freezor','hammer','glove','hookshot','somaria','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.IPChests();
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}]',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachMire()) return 'unavailable';
					var doorcheck = window.doorCheck(8,false,true,false,['hookshot','firesource','somaria','bomb'],'boss');
					if(doorcheck) {
						if(doorcheck === 'unavailable')
							return 'unavailable';
						if(medallionCheck(0) === 'possible' && doorcheck === 'available')
							return 'possible';
						if(medallionCheck(0) === 'possible' && doorcheck === 'darkavailable')
							return 'darkpossible';
						return doorcheck;
					}
					if (!items.bigkey8 || !items.somaria) return 'unavailable';
					return window.MMBoss(medallionCheck(0));
				},
				can_get_chest: function() {
					if (!canReachMire()) return 'unavailable';
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
				caption: 'Turtle Rock {medallion0} {hammer} {somaria}',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachDDM() || !items.hammer) return 'unavailable';
					if (medallionCheck(1) === 'unavailable') return 'unavailable';
					var doorcheck = window.doorCheck(9,items.flute === 0 && !items.lantern,true,false,['somaria','firerod',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'laserbridge' : '','bomb'],'boss');
					if(doorcheck) {
						if(doorcheck === 'unavailable')
							return 'unavailable';
						if(medallionCheck(1) === 'possible' && doorcheck === 'available')
							return 'possible';
						if(medallionCheck(1) === 'possible' && doorcheck === 'darkavailable')
							return 'darkpossible';
						return doorcheck;
					};
					if (!items.bigkey9) return 'unavailable';
					return window.TRFrontBoss(medallionCheck(1));
				},
				can_get_chest: function() {
					if (!canReachDDM() || !items.hammer) return 'unavailable';
					if (medallionCheck(1) === 'unavailable') return 'unavailable';
					var doorcheck = window.doorCheck(9,items.flute === 0 && !items.lantern,true,false,['somaria','firerod','laserbridge','bomb'],'item');
					if(doorcheck) {
						if(doorcheck === 'unavailable')
							return 'unavailable';
						if(medallionCheck(1) === 'possible' && doorcheck === 'available')
							return 'possible';
						if(medallionCheck(1) === 'possible' && doorcheck === 'darkavailable')
							return 'darkpossible';
						return doorcheck;
					};
					return window.TRFrontChests(medallionCheck(1));
				}
			}, { // [10]
				caption: 'Ganon\'s Tower (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if ((crystalCheck() < flags.ganonvulncount && flags.goals != 'A') || ((crystalCheck() < flags.opentowercount || !items.agahnim2) && flags.goals != 'F') || !canReachDDM() || (flags.goals === 'A' && (!items.agahnim || !allDungeonCheck()))) return 'unavailable';
					if ((flags.swordmode != 'S' && items.sword < 2) || (flags.swordmode === 'S' && !items.hammer) || (!items.lantern && !items.firerod)) return 'unavailable';
					//Fast Ganon
					if (flags.goals === 'F' && (items.sword > 1 || (flags.swordmode === 'S' && items.hammer)) && (items.lantern || items.firerod)) return 'available';
					var doorcheck = window.doorCheck(10,items.flute === 0 && !items.lantern,false,false,['hammer','firerod','hookshot','boomerang','somaria',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'boss');
					if (doorcheck) return doorcheck;
					return window.GTBoss();
				},
				can_get_chest: function() {
					if (items.glove < 2 || (!items.hookshot && (!items.mirror || !items.hammer)) || !canReachDDM()) return 'unavailable';
					if (flags.opentowercount == 8) {
						return (items.lantern || items.flute >= 1) ? 'possible' : 'darkpossible';
					}
					if (crystalCheck() < 7 && crystalCheck() < flags.opentowercount) return 'unavailable';
					var doorcheck = window.doorCheck(10,items.flute === 0 && !items.lantern,false,false,['hammer','firerod','hookshot','boomerang','somaria','boots','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'item');
					if (doorcheck) return doorcheck;
					return window.GTChests();
				}
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ? window.dungeons[11].can_get_chest() : 'opened';
				},
				can_get_chest: function() {
					if (flags.doorshuffle != 'P') {
						return window.doorCheck(11,false,false,flags.gametype != 'S',['glove','killbomb','bombdash'],'item');
					};
					return window.HCChests();
				}
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() {
					if (items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape && !items.agahnim) return 'unavailable';
					if (flags.doorshuffle !== 'P' && !(flags.doorshuffle === 'N' && (flags.wildkeys || flags.gametype === 'R') && flags.wildbigkeys && flags.wildcompasses && flags.wildmaps)) {
						if(items.mirror && (items.agahnim || (items.glove && items.hammer && items.moonpearl) || (items.glove === 2 && items.moonpearl && items.flippers)))
							return window.doorCheck(12,false,true,true,['kill','swordorswordless'],'item');
						return 'possible';
					};
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
	
	// Entrance helper functions
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
	//Light World
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
	
	//Dark World
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
					if(!canReachPyramid()) return 'unavailable';
					return window.PoDBoss();
				},
				can_get_chest: function() {
					if (!canReachPyramid()) return 'unavailable';
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
					if(!canReachPyramid()) return 'unavailable';
					return window.PoDBoss();
				},
				can_get_chest: function() {
					if (!canReachPyramid()) return 'unavailable';
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
					/*return items.moonpearl && items.hammer && items.book && (activeFlute() || items.glove) && (items.hookshot || items.glove === 2) ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer) ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'information') :
						'unavailable';*/
				}
			}, { // [7]
				caption: 'Bombos Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*return canReachLightWorldBunny() && items.book ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information' :
						'unavailable';*/
				}
			}, { // [8]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(!items.glove)
						return 'unavailable';
					if(canReachPyramid())
						return 'available';
					return 'unavailable';*/
				}
			}, { // [9]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorld() ? (items.flippers || items.glove ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [10]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return items.glove || activeFlute() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [11]
				caption: 'Mushroom',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
				}
			}, { // [12]
				caption: 'Spectacle Rock',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(!(items.glove || activeFlute()))
						return 'unavailable';
					return items.moonpearl && items.hammer && (items.hookshot || items.glove === 2) ?
						(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
						'information';*/
				}
			}, { // [13]
				caption: 'Floating Island',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*return (activeFlute() || items.glove) && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
						(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
						'unavailable';*/
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
					/*if(!canReachLightWorldBunny())
						return 'unavailable';
					return items.moonpearl ? (items.flippers ? 'available' : 'information') : 'information';*/
				}
			}, { // [17]
				caption: 'Bumper Cave {cape}{mirror}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return items.glove && items.cape && items.mirror && canReachLightWorld() ? 'available' : 'information';
				}
			}, { // [18]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(canReachPyramid())
						return 'available';
					return 'unavailable';*/
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
					/*if(!canReachLightWorld())
						return 'unavailable';
					if(items.flippers)
						return 'available';
					return 'information';*/
				}
			}, { // [21]
				caption: 'Buried Item {shovel}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return items.shovel && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [22]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(!canReachLightWorldBunny())
						return 'unavailable';
					var pendant_count = 0;
					for(var k = 0; k < 10; k++)
						if((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k])
							if(++pendant_count === 3)
								return 'available';
					return items.book ? 'information' : 'unavailable';*/
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
	

}(window));
