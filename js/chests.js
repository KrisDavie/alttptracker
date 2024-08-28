(function(window) {
    'use strict';

	// #region Helper functions
	function bestAvailability(arr) {
		var best = 'unavailable';
		for (var i = 0; i < arr.length; i++) {
			switch (arr[i]) {
				case 'available': return 'available';
				case 'partialavailable': best = 'partialavailable'; break;
				case 'darkavailable': if (best != 'partialavailable') { best = 'darkavailable'; break };
				case 'possible': if (best != 'darkavailable' && best != 'partialavailable') { best = 'possible'; break };
			};
		};
		return best;
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
			case 'available': return 'A';
			case 'possible': return 'P';
			case 'darkavailable': return 'DA';
			case 'darkpossible': return 'DP';
			case 'unavailable': return 'U';
		}
	};

	function ConvertChestToBoss(x) {
		switch (x) {
			case 'A': return 'available';
			case 'P': return 'possible';
			case 'DA': return 'darkavailable';
			case 'DP': return 'darkpossible';
			case 'U': return 'unavailable';
		}
	};

	function colorDungeonSquares(dungeonID, accessibility, chestAvailability, bossAvailability) {
		let bossvisibility = 'hidden';
		let bosscolor = 'red';
		let bgcolor = 'white';
		let color = 'black';
		if (accessibility != 'unavailable') {
			if (dungeonID < 10) {
				bossvisibility = (!dungeons[dungeonID].is_beaten && !owGraphLogic ? 'visible' : 'hidden');
				bosscolor = ConvertBossToColor(bossAvailability);
			};
			const curStyle = window.getComputedStyle(document.documentElement);
			bgcolor = curStyle.getPropertyValue("--" + chestAvailability + "-color");
			color = rgbToTextColour(curStyle.getPropertyValue("--" + chestAvailability + "-color"));
		};

		if (dungeonID < 10) {
			document.getElementById('entranceBoss' + dungeonID).style.visibility = bossvisibility;
			document.getElementById('entranceBoss' + dungeonID).style.background = bosscolor;
		};
		document.getElementById('chest' + dungeonID).style.backgroundColor = bgcolor;
		document.getElementById('chest' + dungeonID).style.color = color;
	};

	function isNewLogic() {
		return flags.doorshuffle === 'P' || (flags.doorshuffle === 'N' && (flags.wildkeys || flags.gametype === 'R') && flags.wildbigkeys && flags.wildcompasses && flags.wildmaps);
	};

	function isDoorsBranch() {
		if (flags.doorshuffle != 'N') return true;
		if (flags.owGraphLogic) return true;
		if (flags.bonkshuffle != 'N') return true;
		return false;
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
	function activeFlute() { return items.flute > 1 || (items.flute && canReachLightWorld()) };
	function canDoTorchDarkRooms() {
		if (items.lantern) return true;
		if (flags.entrancemode != 'N' || flags.doorshuffle != 'N' || flags.owGraphLogic || flags.shopsanity || flags.bonkshuffle) {
			if (items.firerod) return true;
		};
		return false;
	};
	function pendantCheck(type) {
		let pendant_count = 0;
		let green_pendant = false;
		for (var k = 0; k < 10; k++) {
			if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k]) {
				pendant_count++;
			};
			if (prizes[k] === 1 && items['boss'+k]) {
				green_pendant = true;
			};
		};
		if (type === 'green') return green_pendant;
		if (type === 'all') return pendant_count === 3;
	};
	// #endregion

	// #region Non-entrance reach and check logic
	// Location object contains "anyOf" or "allOf" arrays of conditions
	function stateOfAll(requirements) {
		if (requirements.allOf) {
			for (const requirement of requirements.allOf) {
				if (!stateOf(requirement)) return false;
			}
		}
		if (requirements.anyOf) {
			for (const requirement of requirements.anyOf) {
				if (stateOf(requirement)) return true;
			}
			return false;
		}
		return true;
	};

	function stateOf(requirement) {
		// If requirement is not a string call inLogic recursively
		if (typeof requirement === 'object') return stateOfAll(requirement);

		if (requirement.startsWith("canReach|")) {
			const region = requirement.split("|")[1];
			return canReachRegion(region) === 'available';
		};

		if (requirement.startsWith("canBreach|")) {
			const region = requirement.split("|")[1];
			const state = canReachRegion(region);
			return state != 'unavailable' && state != 'possible';
		};

		switch (requirement) {
			case "book": return items.book;
			case "bombs": return items.bomb;
			case "boots": return items.boots;
			case "byrna": return items.byrna;
			case "glove": return items.glove > 0;
			case "mitts": return items.glove > 1;
			case "flute": return activeFlute();
			case "firerod": return items.firerod;
			case "lantern": return items.lantern;
			case "mirror": return items.mirror;
			case "somaria": return items.somaria;
			case "mushroom": return items.mushroom;
			case "powder": return items.powder;
			case "flippers": return items.flippers;
			case "hammer": return items.hammer;
			case "hookshot": return items.hookshot;
			case "agahnim": return items.agahnim;
			case "moonpearl": return items.moonpearl;
			case "cape": return items.cape;
			case "flute": return items.flute > 1 || (flags.gametype != 'I' && items.flute);
			case "swordbeams": return items.sword > 1;
			case "bottle": return items.bottle;
			case "halfmagic": return items.magic;
			case "shovel": return items.shovel;

			case "canHitSwitch": return canHitSwitch();
			case "canDestroyEnergyBarrier": return items.sword > 1 || (flags.swordmode === 'S' && items.hammer);
			case "canBreakTablets": return items.sword > 1 || (flags.swordmode === 'S' && items.hammer);
			case "canPullPedestal": return pendantCheck('all');
			case "greenpendant": return pendantCheck('green');
			case "canOpenBonkWalls": return items.boots || items.bomb;
			case "canHitRangedSwitch": return canHitRangedSwitch();
			case 'canKillOrExplodeMostEnemies': return items.sword > 0 || items.hammer || items.bow > 1 || items.somaria || items.byrna || items.firerod || items.bomb;
			case "canGetBonkableItem": return items.boots || (items.sword && items.quake);

			case 'canDarkRoomNavigateBlind': return true;
			case "canFairyReviveHover": return items.boots && items.bottle && items.net;
			case "canFakeFlipper": return items.flippers || true;
			case "canOWFairyRevive": return items.bottle && items.net;
			case "canQirnJump": return items.bomb;
			case "canMirrorSuperBunny": return items.mirror;
			case "canDungeonBunnyRevive": return true;
			case "canFakeFlipper": return true;
			case "canFakePowder": return items.somaria && items.mushroom;
			case "canWaterWalk": return items.boots && items.bomb;
			case "canZoraSplashDelete": return (items.bomb && items.bow > 0) || (items.somaria && items.bomb && items.boomerang > 1) || (items.bomb && items.icerod) || (items.bottle && items.net && items.bomb);
			case "canBunnyPocket": return items.boots && (items.mirror || items.bottle)
			case "canSpinSpeedClip": return false;
			case "canMirrorWrap": return false;
			case "canFairyBarrierRevive": return items.bottle && items.net && items.mirror;
			case "canShockBlock": return items.somaria;
			case "canHover": return items.boots;

			case "canOpenGT": return crystalCheck() >= flags.opentowercount;
			case "canBuyBigBomb": {
				var crystal_count = 0;
				for (var k = 0; k < 10; k++) {
					if (prizes[k] === 4 && items['boss'+k])
						crystal_count += 1;
				}
				return crystal_count >= 2;
			}

			default: throw new Error("Unknown requirement: " + requirement);
		};
	};

	function canReachRegion(region) {
		if (flags.entrancemode != 'N') {
			if (flags.mapmode === 'N') return 'available';
			const mapTrackerNames = window.regionReachLogic[region]["Entrance"];
			var found = false;
			var requirePearl = true;
			for (var i = 0; i < mapTrackerNames.length; i++) {
				const mapTrackerName = mapTrackerNames[i];
				if (mapTrackerName.includes("exception|")) {
					const exception = mapTrackerName.split("|")[1];
					switch (exception) {
						case "sewers": {
							return (
								entrances[22].known_location === 'sanc' ||
								entrances[29].known_location === 'sanc' ||
								entrances[18].known_location === 'sanc' ||
								entrances[11].known_location === 'sanc' ||
								(entrances[24].known_location === 'sanc' && items.boots && items.agahnim) ||
								(entrances[43].known_location === 'sanc' && items.hammer) ||
								(entrances[95].known_location === 'sanc' && items.agahnim2) ||
								(entrances[13].known_location === 'sanc' && items.glove > 0 && (flags.gametype != 'I' || (canReachInvertedLightWorld()))) ||
								(entrances[102].known_location === 'sanc' && (items.moonpearl || flags.gametype === 'I'))
							) ? 'available' : 'unavailable';
						};
					};
				} else if (hasFoundLocation(mapTrackerName)) {
					found = true;
					if (!locationRequiresMoonpearl(mapTrackerName)) {
						requirePearl = false;
					};
				};
			};
			if (found) return requirePearl && !items.moonpearl ? 'darkavailable' : 'available';
			return 'unavailable';
		};

		// Not entrance
		if (region === "Misery Mire") {
			var medcheck = medallionCheck(0)
			if (medcheck === 'unavailable') return 'unavailable';
		} else if (region === "Turtle Rock - Main") {
			var medcheck = medallionCheck(1)
			if (medcheck === 'unavailable') return 'unavailable';
		} else {
			var medcheck = 'available';
		};

		const category = flags.gametype === 'I' ? 'Inverted' : 'Open';
		const requirements = window.regionReachLogic[region][category];
		let availability = 'unavailable';
		if (!("always" in requirements) || stateOfAll(requirements["always"])) {
			availability = 'possible';
			if (!("logical" in requirements) || stateOfAll(requirements["logical"])) {
				availability = 'available';
			} else if (!("required" in requirements) || stateOfAll(requirements["required"])) {
				availability = 'darkavailable';
			};
		};
		if (availability === 'unavailable') return 'unavailable';
		if (availability === 'possible') return 'possible';
		if (availability === 'available') return medcheck === 'available' ? 'available' : medcheck;
		if (availability === 'darkavailable') return medcheck === 'available' ? 'darkavailable' : medcheck;
	};

	function checkAvailability(locations) {
		const category = flags.gametype === 'I' ? 'Inverted' : 'Open';
		let available = 0;
		let required = 0;
		let possible = 0;
		let unavailable = 0; 
		for (var i = 0; i < locations.length; i++) {
			const location = locations[i];
			const requirements = window.checkLogic[location][category];
			let availability = 'unavailable';
			if (!("always" in requirements) || stateOfAll(requirements["always"])) {
				availability = 'possible';
				if (!("logical" in requirements) || stateOfAll(requirements["logical"])) {
					availability = 'available';
				} else if (!("required" in requirements) || stateOfAll(requirements["required"])) {
					availability = 'darkavailable';
				};
			};
			switch (availability) {
				case 'available': available++; break;
				case 'darkavailable': required++; break;
				case 'possible': possible++; break;
				default: unavailable++;
			};
		};
		if (available > 0 && unavailable === 0) return 'available';
		if (available > 0 && unavailable > 0) return 'partialavailable';
		if (required > 0) return 'darkavailable';
		if (possible > 0) return 'possible';
		return 'unavailable';
	};
	// #endregion

	// #region Entrance reach and check logic
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

	// #region Connectors - Non-Inverted entrance
	function canReachUpperWestDeathMountain() {
		if (items.flute >= 1 && items.mirror) return true;
		if (hasFoundEntranceName("Tower of Hera") || (hasFoundEntranceName("Paradox Cave (Top)") && items.hammer)) return true;
		if (items.mirror && hasFoundRegion([
			"Spectacle Rock Cave", "Spectacle Rock Cave Peak", "Spectacle Rock Cave (Bottom)", "Old Man Cave (East)", "Death Mountain Return Cave (East)",
			"Old Man House (Bottom)", "Old Man House (Top)", "Ganons Tower", "Hookshot Cave Back Entrance", "Hookshot Cave",
			"Superbunny Cave (Top)", "Turtle Rock", "Spike Cave", "Dark Death Mountain Fairy"
		])) return true;
		if (items.hookshot && items.mirror && (hasFoundRegion([
			"Paradox Cave (Top)", "Paradox Cave (Middle)", "Paradox Cave (Bottom)", "Spiral Cave", "Spiral Cave (Bottom)", "Hookshot Fairy",
			"Fairy Ascension Cave (Top)", "Fairy Ascension Cave (Bottom)", "Superbunny Cave (Bottom)", "Dark Death Mountain Shop",
			"Turtle Rock Isolated Ledge Entrance", "Dark Death Mountain Ledge (West)", "Dark Death Mountain Ledge (East)"
		]))) return true;

		return false;
	};

	function canReachLowerWestDeathMountain() {
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
		if (hasFoundRegion([
			"Paradox Cave (Middle)", "Paradox Cave (Bottom)", "Spiral Cave", "Spiral Cave (Bottom)", "Hookshot Fairy", "Fairy Ascension Cave (Top)", "Fairy Ascension Cave (Bottom)"
		])) return true;
		if (items.mirror && (hasFoundRegion([
			"Superbunny Cave (Bottom)", "Dark Death Mountain Shop", "Turtle Rock Isolated Ledge Entrance", "Dark Death Mountain Ledge (West)", "Dark Death Mountain Ledge (East)",
			"Ganons Tower", "Hookshot Cave", "Superbunny Cave (Top)", "Turtle Rock"
		]))) return true;
		if (items.hookshot && canReachLowerWestDeathMountain()) return true;
		if (canReachUpperWestDeathMountain() && items.hammer) return true;

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
	
	function canReachLowerEastDarkDeathMountain() {
		return (canReachUpperDarkDeathMountain() || hasFoundRegion(["Superbunny Cave (Bottom)", "Dark Death Mountain Shop"]) || (canReachLowerEastDeathMountain() && items.glove === 2));
	};

	function canReachHyruleCastleBalcony() {
		if (hasFoundRegion([
			"Hyrule Castle Entrance (West)", "Hyrule Castle Entrance (East)", "Agahnims Tower"
		])) return true;
		if (canReachEastDarkWorld() && items.mirror) return true;
		return false;
	};

	function canReachSouthEastDarkWorld(toEastDarkWorld=false) {
		if (hasFoundRegion([
			"Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
		])) return true;
		if (!toEastDarkWorld) {
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

	function canReachWestDarkWorld(toEastDarkWorld=false) {
		if (items.moonpearl && (items.glove === 2 || (items.glove && items.hammer))) return true;
		if (hasFoundRegion([
			"Dark Sanctuary Hint", "Red Shield Shop", "Skull Woods Second Section Door (East)", "Skull Woods First Section Door", "Dark Lumberjack Shop",
			"Bumper Cave (Bottom)", "Fortune Teller (Dark)", "Chest Game", "Thieves Town", "C-Shaped House", "Brewery", "Bumper Cave (Top)"
		])) return true;
		if (items.moonpearl && (hasFoundEntranceName("Dark World Shop") && items.hammer)) return true;
		if (items.moonpearl && (items.hookshot && (items.flippers || items.hammer)) && hasFoundRegion([
			"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop"
		])) return true;
		if (!toEastDarkWorld) {
			if (canLeaveNorthEastDarkWorldWest() && canReachNorthEastDarkWorld()) return true;
		};
		return false;
	};

	function canReachSouthDarkWorld(toEastDarkWorld=false) {
		if (items.moonpearl && (items.glove === 2 || (items.glove && items.hammer))) return true;
		if (hasFoundRegion([
			"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop"
		])) return true;
		if (!toEastDarkWorld) {
			if (items.moonpearl && items.hammer && canReachEastDarkWorld()) return true;
		};
		if (canReachWestDarkWorld(toEastDarkWorld)) return true;
		return false;
	};

	function canReachSouthWestDarkWorld() {
		if (items.flute >= 1 && items.glove >= 2) return true;
		if (hasFoundRegion([
			"Misery Mire", "Mire Shed", "Mire Hint", "Mire Fairy"
		])) return true;
		return false;
	};
	// #endregion
	
	// #region Connectors - Inverted entrance
	function activeFluteInvertedEntrance() { return items.flute > 1 || (items.flute && (canReachInvertedLightWorld() || flags.activatedflute)) };

	function canReachInvertedLightWorld() {
		if (!items.moonpearl) return false;
		if (items.glove >= 2 || (items.glove && items.hammer)) return true;
		if (items.agahnim || (items.glove === 2 && activeFluteInvertedEntrance()) || hasFoundRegion([
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
		if (canReachInvertedLightWorld()) return true;
		if (items.agahnim || (items.glove === 2 && activeFluteInvertedEntrance()) || hasFoundRegion([
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
	
	function canReachInvertedWestDW() {
		return true; // Always accessible
		// Dark sanc is always in the north DW unless it changes
		// if (hasFoundRegion([
		// 	"Dark Sanctuary Hint", "Red Shield Shop", "Skull Woods Second Section Door (East)", "Skull Woods First Section Door", "Dark Lumberjack Shop",
		// 	"Bumper Cave (Bottom)", "Fortune Teller (Dark)", "Chest Game", "Thieves Town", "C-Shaped House", "Brewery", "Bumper Cave (Top)"
		// ])) return true;

		// if (items.glove === 2 && hasFoundRegion([
		// 	"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop"
		// ])) return true;

		// if (((items.hammer && items.glove === 2) || (items.hookshot && (items.flippers || items.glove || items.hammer))) && (hasFoundRegion([
		// 	"Pyramid Fairy", "Pyramid Exit", "Palace of Darkness", "Palace of Darkness Hint", "Dark Lake Hylia Fairy", "East Dark World Hint"
		// ]))) return true;

		// if (hasFoundEntranceName("Dark Potion Shop") && ((items.hammer && items.glove === 2) || items.hookshot)) return true;

		// if (hasFoundEntranceName("Dark World Shop") && items.hammer) return true;

		// if (items.flippers && ((items.glove === 2 && items.hammer) || items.hookshot) && hasFoundRegion([
		// 	"Ice Palace", "Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
		// ])) return true;

		// if (activeFluteInvertedEntrance()) return true;

		// if (items.mirror) {
		// 	if (canReachInvertedLightWorldBunny()) return true;
		// 	if (hasFoundRegion([
		// 		"Graveyard Cave", "Light World Bomb Hut", "Kings Grave"
		// 	])) return true;
		// 	if (hasFoundEntranceName("Bush Covered House") && items.hammer) return true;
		// 	if (hasFoundEntranceName("Potion Shop") && items.hookshot) return true;
		// };

		// return false;
	};
	
	function canReachInvertedSouthDW() {
		return true; // Always accessible
		// if (activeFluteInvertedEntrance()) return true;

		// if (hasFoundRegion([
		// 	"Big Bomb Shop", "Bonk Fairy (Dark)", "Hype Cave", "Swamp Palace", "Archery Game", "Dark Lake Hylia Shop"
		// ])) return true;

		// if (hasFoundRegion([
		// 	"Pyramid Fairy", "Pyramid Exit", "Palace of Darkness", "Palace of Darkness Hint", "Dark Lake Hylia Fairy", "East Dark World Hint"
		// ])) return true;

		// if (items.flippers && items.hammer && hasFoundRegion([
		// 	"Ice Palace", "Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
		// ])) return true;

		// if (canReachInvertedNorthDW()) return true;

		// return false;
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

	function canReachInvertedNorthEastDW() {
		if (activeFluteInvertedEntrance()) return true;
		if (hasFoundEntranceName("Dark Potion Shop")) return true;
		if (items.mirror && hasFoundEntranceName("Potion Shop")) return true;
		if (items.mirror && canReachInvertedLightWorld()) return true;
		if (items.flippers && (canReachInvertedWestDW() || canReachInvertedSouthDW() || canReachInvertedEastDW())) return true;
		if ((items.hammer || items.glove) && canReachInvertedEastDW()) return true;
		return false;
	};
	
	function canReachInvertedSouthWestDW() {
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

	function canReachInvertedSouthEastDW() {
		if (hasFoundRegion([
			"Dark Lake Hylia Ledge Fairy", "Dark Lake Hylia Ledge Hint", "Dark Lake Hylia Ledge Spike Cave"
		])) return true;
		if (items.flippers && canReachInvertedSouthDW()) return true;
		if (activeFluteInvertedEntrance()) return true;
		if (items.mirror && canReachInvertedLightWorldBunny()) return true;
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
	
	function canReachInvertedLowerWestDeathMountain() {

		if (canReachInvertedDarkDeathMountain()) return true;

		if (hasFoundRegion([
			"Tower of Hera", "Spectacle Rock Cave", "Spectacle Rock Cave Peak", "Spectacle Rock Cave (Bottom)",
			"Old Man Cave (East)", "Death Mountain Return Cave (East)", "Old Man House (Bottom)",
			"Old Man House (Top)" 
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

	function canReachInvertedUpperWestDeathMountain() {
		if (hasFoundEntranceName("Tower of Hera")) return true;
		if (items.moonpearl && items.hammer && hasFoundEntranceName("Paradox Cave (Top)")) return true;
		if (canReachInvertedDarkDeathMountain() && items.mitts && items.hammer && items.moonpearl) return true;
		return false;
	};
 	
	function canReachInvertedLowerEastDeathMountain() {
		if (canReachInvertedUpperEastDeathMountain()) return true;

		if (hasFoundRegion([
			"Paradox Cave (Middle)", "Paradox Cave (Bottom)", "Spiral Cave", "Spiral Cave (Bottom)",
			"Hookshot Fairy", "Fairy Ascension Cave (Top)", "Fairy Ascension Cave (Bottom)", "Mimic Cave"
		])) return true;

		if (items.moonpearl && items.hookshot && canReachInvertedLowerWestDeathMountain()) return true;

		if (items.glove === 2) {
			if (canReachInvertedDarkDeathMountain()) return true;
			if (hasFoundRegion([
				"Superbunny Cave (Bottom)", "Dark Death Mountain Shop", "Turtle Rock Isolated Ledge Entrance",
			])) return true;
		};

		return false;
	};

	function canReachInvertedLowerEastDarkDeathMountain() {
		if (hasFoundRegion([
			"Superbunny Cave (Bottom)", "Dark Death Mountain Shop", "Turtle Rock Isolated Ledge Entrance",
		])) return true;
		if (canReachInvertedDarkDeathMountain()) return true;
		if (items.mirror && canReachInvertedLowerWestDeathMountain()) return true;
	};

	function canReachInvertedHyruleCastleBalcony() {
		if (hasFoundRegion([
			"Hyrule Castle Entrance (West)", "Hyrule Castle Entrance (East)", "Agahnims Tower"
		])) return true;
		if (items.agahnim && items.mirror) return true;
		return false;
	};

	// #endregion

	const dungeonCheckMap = [
		{
			"id": 0,
			"dungeon": "Eastern Palace",
			"regions": ["Eastern Palace"],
			"mapTrackerNames": ["ep"]
		},
		{
			"id": 1,
			"dungeon": "Desert Palace",
			"regions": ["Desert Palace - Main", "Desert Palace - North"],
			"mapTrackerNames": ["dp_m","dp_w","dp_e","dp_n"]
		},
		{
			"id": 2,
			"dungeon": "Tower of Hera",
			"regions": ["Tower of Hera"],
			"mapTrackerNames": ["toh"]
		},
		{
			"id": 3,
			"dungeon": "Palace of Darkness",
			"regions": ["Palace of Darkness"],
			"mapTrackerNames": ["pod"]
		},
		{
			"id": 4,
			"dungeon": "Swamp Palace",
			"regions": ["Swamp Palace"],
			"mapTrackerNames": ["sp"]
		},
		{
			"id": 5,
			"dungeon": "Skull Woods",
			"regions": ["Skull Woods - Main", "Skull Woods - Middle", "Skull Woods - Back", "Skull Woods - Drops"],
			"mapTrackerNames": ["sw","sw_m","sw_w","sw_e"]
		},
		{
			"id": 6,
			"dungeon": "Thieves Town",
			"regions": ["Thieves Town"],
			"mapTrackerNames": ["tt"]
		},
		{
			"id": 7,
			"dungeon": "Ice Palace",
			"regions": ["Ice Palace"],
			"mapTrackerNames": ["ip"]
		},
		{
			"id": 8,
			"dungeon": "Misery Mire",
			"regions": ["Misery Mire"],
			"mapTrackerNames": ["mm"]
		},
		{
			"id": 9,
			"dungeon": "Turtle Rock",
			"regions": ["Turtle Rock - Main", "Turtle Rock - West", "Turtle Rock - East", "Turtle Rock - Back"],
			"mapTrackerNames": ["tr_m","tr_w","tr_e","tr_b"]
		},
		{
			"id": 10,
			"dungeon": "Ganons Tower",
			"regions": ["Ganons Tower"],
			"mapTrackerNames": ["gt"]
		},
		{
			"id": 11,
			"dungeon": "Hyrule Castle",
			"regions": ["Hyrule Castle - Main", "Hyrule Castle - Sewers Dropdown", "Sanctuary"],
			"mapTrackerNames": ["hc_m","hc_w","hc_e", "sanc"]
		},
		{
			"id": 12,
			"dungeon": "Castle Tower",
			"regions": ["Castle Tower"],
			"mapTrackerNames": ["ct"]
		}
	]

	function checkAvailabilityEntrance(location) {
		const category = flags.gametype === 'I' ? 'Inverted' : 'Open';
		const requirements = window.checkLogic[location][category];
		return stateOfAllEntrance(requirements) ? 'available' : 'unavailable';
	};

	function checkEntranceAvailability(entrance) {
		if (hasFoundEntranceName(entrance)) return 'available';
		const category = flags.gametype === 'I' ? 'Inverted' : 'Open';
		const requirements = window.entranceLogic[entrance][category];
		return stateOfAllEntrance(requirements) ? 'available' : 'unavailable';
	}

	function stateOfAllEntrance(requirements) {
		if (requirements.allOf) {
			for (const requirement of requirements.allOf) {
				if (!stateOfEntrance(requirement)) return false;
			}
		}
		if (requirements.anyOf) {
			for (const requirement of requirements.anyOf) {
				if (stateOfEntrance(requirement)) return true;
			}
			return false;
		}
		return true;
	};

	function stateOfEntrance(requirement) {
		// If requirement is not a string call inLogic recursively
		if (typeof requirement === 'object') return stateOfAllEntrance(requirement);

		if (requirement.startsWith("canReach|")) {
			const region = requirement.split("|")[1];
			switch (region) {
				case "South Dark World": return canReachSouthDarkWorld();
				case "East Dark World": return canReachEastDarkWorld();
				case "West Dark World": return canReachWestDarkWorld();
				case "North East Dark World": return canReachNorthEastDarkWorld();
				case "South West Dark World": return canReachSouthWestDarkWorld();
				case "South East Dark World": return canReachSouthEastDarkWorld();
				case "Hyrule Castle Balcony": return canReachHyruleCastleBalcony();
				case "Lower West Death Mountain": return canReachLowerWestDeathMountain();
				case "Lower East Death Mountain": return canReachLowerEastDeathMountain();
				case "Upper West Death Mountain": return canReachUpperWestDeathMountain();
				case "Upper East Death Mountain": return canReachUpperEastDeathMountain();
				case "Lower East Dark Death Mountain": return canReachLowerEastDarkDeathMountain();
				case "Lower West Dark Death Mountain": return canReachLowerWestDarkDeathMountain();
				case "Upper Dark Death Mountain": return canReachUpperDarkDeathMountain();

				case "Inverted South Dark World": return canReachInvertedSouthDW();
				case "Inverted East Dark World": return canReachInvertedEastDW();
				case "Inverted West Dark World": return canReachInvertedWestDW();
				case "Inverted North East Dark World": return canReachInvertedNorthEastDW();
				case "Inverted South West Dark World": return canReachInvertedSouthWestDW();
				case "Inverted South East Dark World": return canReachInvertedSouthEastDW();
				case "Inverted Light World": return canReachInvertedLightWorld();
				case "Inverted Light World Bunny": return canReachInvertedLightWorldBunny();				
				case "Inverted Dark Death Mountain": return canReachInvertedDarkDeathMountain();
				case "Inverted Lower East Dark Death Mountain": return canReachInvertedLowerEastDarkDeathMountain();
				case "Inverted Upper West Death Mountain": return canReachInvertedUpperWestDeathMountain();
				case "Inverted Upper East Death Mountain": return canReachInvertedUpperEastDeathMountain();
				case "Inverted Lower East Death Mountain": return canReachInvertedLowerEastDeathMountain();
				case "Inverted Lower West Death Mountain": return canReachInvertedLowerWestDeathMountain();
				case "Inverted Hyrule Castle Balcony": return canReachInvertedHyruleCastleBalcony();

				default: throw new Error("Unknown region: " + region);
			};
		};

		if (requirement.startsWith("hasFoundEntrance|")) {
			const entrance = requirement.split("|")[1];
			return hasFoundEntranceName(entrance);
		};

		if (requirement.startsWith("hasFoundMapEntry|")) {
			const mapTrackerName = requirement.split("|")[1];
			return hasFoundLocation(mapTrackerName);
		}

		switch (requirement) {
			case "moonpearl": return items.moonpearl;
			case "agahnim": return items.agahnim;
			case "boots": return items.boots;
			case "bombs": return items.bomb;
			case "book": return items.book;
			case "mitts": return items.glove > 1;
			case "mirror": return items.mirror;
			case "glove": return items.glove;
			case "flippers": return items.flippers;
			case "flute": return items.flute || (flags.gametype === 'I' && activeFluteInvertedEntrance());
			case "firerod": return items.firerod;
			case "shovel": return items.shovel;
			case "agahnim": return items.agahnim;
			case "hammer": return items.hammer;
			case "agahnim2": return items.agahnim2;

			case "canBreakTablets": return items.book && (items.sword >= 2 || (flags.swordmode === 'S' && items.hammer));
			case "canGetBonkableItem": return items.boots || (items.sword && items.quake);
			case "canCrossEnergyBarrier": return items.sword > 1 || (flags.swordmode === 'S' && items.hammer) || items.cape;
			case "canOpenGT": return crystalCheck() >= flags.opentowercount;
			case "canBuyBigBomb": {
				var crystal_count = 0;
				for (var k = 0; k < 10; k++) {
					if (prizes[k] === 4 && items['boss'+k])
						crystal_count += 1;
				}
				return crystal_count >= 2;
			};
			case "canPullPedestal": {
				var pendant_count = 0;
				for (var k = 0; k < 10; k++) {
					if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k]) {
						if (++pendant_count === 3) return true;
					}
				}
				return false;
			};

			case "never": return false;

			default: throw new Error("Unknown requirement: " + requirement);
		};
	};
	// #endregion

	// #region Dungeon Check Logic
	// Location object contains "anyOf" or "allOf" arrays of conditions that need to be met
	function inLogic(dungeonId, requirements) {
		if (requirements.allOf) {
			for (const requirement of requirements.allOf) {
				if (!logicSwitch(dungeonId, requirement)) return false;
			}
		}
		if (requirements.anyOf) {
			for (const requirement of requirements.anyOf) {
				if (logicSwitch(dungeonId, requirement)) return true;
			}
			return false;
		}
		return true;
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

		if (requirement.startsWith('canReach|')) {
			const region = requirement.split('|')[1];
			return canReachRegion(region) === 'available';
		};

		if (requirement.startsWith('canBreach|')) {
			const region = requirement.split('|')[1];
			let state = canReachRegion(region);
			return state != 'unavailable' && state != 'possible';
		};

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
			case 'canBombOrBonkCameraUnlock': return items.bomb || items.boots;
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
			case 'canRushRightSidePod': return (items.bomb || items.boots) && (true || items.bow > 1 || items.bottle);

			case "canExitTurtleRockWestAndEnterEast": return (items.bomb || flags.gametype === 'I') && flags.entrancemode === 'N';
			case "canExitTurtleRockBack": return items.bomb || (flags.gametype != 'O' || flags.entrancemode != 'N');

			case 'canReachTurtleRockMiddle': return canReachRegion("Turtle Rock - West") === 'available' || (canReachRegion("Turtle Rock - East") === 'available' && (items.hookshot || items.somaria));

			case 'canBreachMiseryMireMaybe': return canReachRegion('Misery Mire') != 'unavailable';
			case 'canBreachTurtleRockMainMaybe': return canReachRegion("Turtle Rock - Main") != 'unavailable';
			case 'canBreachTurtleRockMiddle': return canReachRegion("Turtle Rock - West") != 'unavailable' || (canReachRegion("Turtle Rock - East") != 'unavailable' && (items.hookshot || items.somaria || items.bomb || items.boots));
			case 'canOnlyReachTurtleRockMain': return flags.gametype != 'I' && flags.entrancemode === 'N';

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
		var checksAlways = 0;
		var checksRequired = 0;
		var checksLogical = 0;
		var checksSuperLogic = 0;
		const hasNoBossItem = (dungeonName === 'Ganons Tower' || dungeonName === 'Castle Tower')
		for (const [location, requirements] of Object.entries(dungeonLogic[dungeonName])) {
			if (location.includes(' - Boss') && hasNoBossItem) {
				continue;
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

		const maxChecks = Object.keys(window.dungeonLogic[dungeonName]).length - hasNoBossItem;
		const collected = maxChecks - items['chest' + dungeonId];

		if (checksLogical >= maxChecks) return 'available';
		if ((checksLogical - collected) > 0) return 'partialavailable';
		if ((checksRequired - collected) > 0) return 'darkpossible';
		if ((checksAlways - collected) > 0) return 'possible';

		return 'unavailable';
	};

	function bossAvailability(dungeonId, dungeonName) {
		const requirements = window.dungeonLogic[dungeonName][dungeonName + ' - Boss'];
		if (!("always" in requirements) || inLogic(dungeonId, requirements["always"])) {
			if (!("logical" in requirements) || inLogic(dungeonId, requirements["logical"])) return 'available';
			if (!("required" in requirements) || (inLogic(dungeonId, requirements["required"]))) return 'darkpossible';
			return 'possible';
		};
		return 'unavailable';
	};
	// #endregion

	window.loadChestFlagsItem = function() {
		window.dungeonChecks = [];
		for (var i = 0; i < dungeonCheckMap.length; i++) {
			const dungeon = dungeonCheckMap[i];
			dungeonChecks.push({
				can_get_chest: function() {
					const reachability = bestAvailability(dungeon.regions.map(canReachRegion));
					const chestAvailabilityState = dungeonAvailability(dungeon.id, dungeon.dungeon);
					let bossAvailabilityState = 'unavailable';
					if (dungeon.id < 10) {
						bossAvailabilityState = bossAvailability(dungeon.id, dungeon.dungeon);
					};
					colorDungeonSquares(dungeon.id, reachability, chestAvailabilityState, bossAvailabilityState);
				}
			});
		};

		window.dungeons = [{ // [0]
			caption: "Eastern Palace",
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.EPBoss();
				return dungeonBoss(0,[hasFoundLocation('ep') ? 'available' : 'unavailable'],[false]);
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.EPChests();
				return dungeonChests(0,[hasFoundLocation('ep') ? 'available' : 'unavailable'],[false]);
			}
		}, { // [1]
			caption: 'Desert Palace',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.DPBoss();
				return dungeonBoss(1,[hasFoundLocation('dp_m') ? 'available' : 'unavailable',hasFoundLocation('dp_w') ? 'available' : 'unavailable',hasFoundLocation('dp_e') ? 'available' : 'unavailable',hasFoundLocation('dp_n') ? 'available' : 'unavailable'],[false,false,false,false]);
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.DPChests();
				return dungeonChests(1,[hasFoundLocation('dp_m') ? 'available' : 'unavailable',hasFoundLocation('dp_w') ? 'available' : 'unavailable',hasFoundLocation('dp_e') ? 'available' : 'unavailable',hasFoundLocation('dp_n') ? 'available' : 'unavailable'],[false,false,false,false]);
			}
		}, { // [2]
			caption: 'Tower of Hera',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.HeraBoss();
				return dungeonBoss(2,[hasFoundLocation('toh') ? 'available' : 'unavailable'],[false]);
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.HeraChests();
				return dungeonChests(2,[hasFoundLocation('toh') ? 'available' : 'unavailable'],[false]);
			}
		}, { // [3]
			caption: 'Palace of Darkness',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.PoDBoss();
				if (!canReachEDW()) return 'unavailable';
				if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
				return window.PoDBoss();
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.PoDChests();
				if (!canReachEDW()) return 'unavailable';
				if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
				return window.PoDChests();
			}
		}, { // [4]
			caption: 'Swamp Palace',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.SPBoss();
				if (!canReachSDW() || !items.mirror || !items.flippers) return 'unavailable';
				if (!items.glove && !items.agahnim) return 'unavailable';
				return window.SPBoss();
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.SPChests();
				if (!canReachSDW() || !items.mirror || !items.flippers) return 'unavailable';
				if (!items.glove && !items.agahnim) return 'unavailable';
				return window.SPChests();
			}
		}, { // [5]
			caption: 'Skull Woods',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.SWBoss();
				if (!canReachWestDarkWorld() || !canReachWDW()) return 'unavailable';
				return window.SWBoss();
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.SWChests();
				if (!canReachWestDarkWorld() || !canReachWDW()) return 'unavailable';
				return window.SWChests();				
			}
		}, { // [6]
			caption: 'Thieves Town',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.TTBoss();
				if (!canReachWestDarkWorld() || !canReachWDW()) return 'unavailable';
				return window.TTBoss();
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.TTChests();
				if (!canReachWestDarkWorld() || !canReachWDW()) return 'unavailable';
				return window.TTChests();			}
		}, { // [7]
			caption: 'Ice Palace',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.IPBoss();
				if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
				if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
				return window.IPBoss();
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.IPChests();
				if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
				if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
				return window.IPChests();
			}
		}, { // [8]
			caption: 'Misery Mire',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.MMBoss(medallionCheck(0));
				if (!items.moonpearl || items.flute === 0 || items.glove !== 2) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				if (!items.bigkey8) return 'unavailable';
				var state = medallionCheck(0);
				if (state) return state;
				return window.MMBoss();
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.MMChests(medallionCheck(0));
				if (!items.moonpearl || items.flute === 0 || items.glove !== 2) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				var state = medallionCheck(0);
				if (state) return state;
				return window.MMChests();
			}
		}, { // [9]
			caption: 'Turtle Rock',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.TRBoss(medallionCheck(1));
				if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !canReachDDM()) return 'unavailable';
				if (!items.hookshot && !items.mirror) return 'unavailable';
				if (!items.bigkey9) return 'unavailable';
				var state = medallionCheck(1);
				if (state) return state;
				return window.TRBoss();
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.TRChests(medallionCheck(1));
				if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !canReachDDM()) return 'unavailable';
				if (!items.hookshot && !items.mirror) return 'unavailable';
				if (!items.somaria) return 'unavailable';
				var state = medallionCheck(1);
				if (state) return state;				
				return window.TRChests();
			}
		}, { // [10]
			caption: 'Ganons Tower',
			is_beaten: false,
			is_beatable: function() {
				if (flags.entrancemode === 'N') return window.GTBoss();
				if (crystalCheck() < flags.ganonvulncount || !canReachDDM()) return 'unavailable';
				//Fast Ganon
				if (flags.goals === 'F' && (items.sword > 1 || flags.swordmode === 'S' && (items.hammer || items.net)) && (items.lantern || items.firerod)) return 'available';
				return window.GTBoss();
			},
			can_get_chest: function() {
				if (flags.entrancemode === 'N') return window.GTChests();
				if (crystalCheck() < flags.opentowercount || items.glove < 2 || !items.hammer || !canReachDDM()) return 'unavailable';
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
				if (isNewLogic() || flags.entrancemode != 'N') return window.CTBoss();
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

		if (flags.entrancemode != 'N') {
			window.entrances = [{ // [0]
				caption: 'Link\'s House',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() { 
					return checkEntranceAvailability("Links House");
				}
			}, { // [1]
				caption: 'Bonk Fairy (Light)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Bonk Fairy (Light)");
				}
			}, { // [2]
				caption: 'Dam',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dam");
				}
			}, { // [3]
				caption: 'Cave 45',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() { return checkEntranceAvailability("Cave 45") }
			}, { // [4]
				caption: 'Potion Shop',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() { return checkEntranceAvailability("Potion Shop") }
			}, { // [5]
				caption: 'Waterfall of Wishing',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() { return checkEntranceAvailability("Waterfall of Wishing") }
			}, { // [6]
				caption: 'Light Hype Fairy',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() { return checkEntranceAvailability("Light Hype Fairy") }
			}, { // [7]
				caption: 'Hyrule Castle Entrance (South)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hyrule Castle Entrance (South)");
				}
			}, { // [8]
				caption: 'Hyrule Castle Entrance (West)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hyrule Castle Entrance (West)");
				}
			}, { // [9]
				caption: 'Hyrule Castle Entrance (East)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hyrule Castle Entrance (East)");
				}
			}, { // [10]
				caption: 'Agahnims Tower',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Agahnims Tower");
				}
			}, { // [11]
				caption: 'Hyrule Castle Secret Entrance Stairs',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hyrule Castle Secret Entrance Stairs");
				}
			}, { // [12]
				caption: 'Hyrule Castle Secret Entrance Drop',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hyrule Castle Secret Entrance Drop");
				}
			}, { // [13]
				caption: 'Sanctuary',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Sanctuary");
				}
			}, { // [14]
				caption: 'Bonk Rock Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Bonk Rock Cave");
				}
			}, { // [15]
				caption: 'Sanctuary Grave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Sanctuary Grave");
				}
			}, { // [16]
				caption: 'Graveyard Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Graveyard Cave");
				}
			}, { // [17]
				caption: 'Kings Grave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Kings Grave");
				}
			}, { // [18]
				caption: 'North Fairy Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("North Fairy Cave");
				}
			}, { // [19]
				caption: 'North Fairy Cave Drop',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("North Fairy Cave Drop");
				}
			}, { // [20]
				caption: 'Lost Woods Gamble',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Lost Woods Gamble");
				}
			}, { // [21]
				caption: 'Lost Woods Hideout Drop',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Lost Woods Hideout Drop");
				}
			}, { // [22]
				caption: 'Lost Woods Hideout Stump',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Lost Woods Hideout Stump");
				}
			}, { // [23]
				caption: 'Lumberjack House',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Lumberjack House");
				}
			}, { // [24]
				caption: 'Lumberjack Tree Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Lumberjack Tree Cave");
				}
			}, { // [25]
				caption: 'Lumberjack Tree Tree',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Lumberjack Tree Tree");
				}
			}, { // [26]
				caption: 'Old Man Cave (West)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Old Man Cave (West)");
				}
			}, { // [27]
				caption: 'Fortune Teller (Light)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Fortune Teller (Light)");
				}
			}, { // [28]
				caption: 'Kakariko Well Drop',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Kakariko Well Drop");
				}
			}, { // [29]
				caption: 'Kakariko Well Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Kakariko Well Cave");
				}
			}, { // [30]
				caption: 'Blinds Hideout',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Blinds Hideout");
				}
			}, { // [31]
				caption: 'Elder House (West)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Elder House (West)");
				}
			}, { // [32]
				caption: 'Elder House (East)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Elder House (East)");
				}
			}, { // [33]
				caption: 'Snitch Lady (West)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Snitch Lady (West)");
				}
			}, { // [34]
				caption: 'Snitch Lady (East)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Snitch Lady (East)");
				}
			}, { // [35]
				caption: 'Chicken House',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Chicken House");
				}
			}, { // [36]
				caption: 'Muffin Kid House',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Sick Kids House");
				}
			}, { // [37]
				caption: 'Bush Covered House',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Bush Covered House");				
				}
			}, { // [38]
				caption: 'Light World Bomb Hut',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Light World Bomb Hut");
				}
			}, { // [39]
				caption: 'Kakariko Shop',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Kakariko Shop");
				}
			}, { // [40]
				caption: 'Tavern North',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Tavern North");
				}
			}, { // [41]
				caption: 'Tavern (Front)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Tavern (Front)");
				}
			}, { // [42]
				caption: 'Blacksmiths Hut',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Blacksmiths Hut");
				}
			}, { // [43]
				caption: 'Bat Cave Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Bat Cave Cave");
				}
			}, { // [44]
				caption: 'Bat Cave Drop',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Bat Cave Drop");
				}
			}, { // [45]
				caption: 'Library',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Library");
				}
			}, { // [46]
				caption: 'Two Brothers House (West)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Two Brothers House (West)");
				}
			}, { // [47]
				caption: 'Two Brothers House (East)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Two Brothers House (East)");
				}
			}, { // [48]
				caption: 'Kakariko Gamble Game',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Kakariko Gamble Game");
				}
			}, { // [49]
				caption: 'Eastern Palace',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Eastern Palace");
				}
			}, { // [50]
				caption: 'Sahasrahlas Hut',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Sahasrahlas Hut");
				}
			}, { // [51]
				caption: 'Lake Hylia Fairy',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Lake Hylia Fairy");
				}
			}, { // [52]
				caption: 'Long Fairy Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Long Fairy Cave");
				}
			}, { // [53]
				caption: 'Desert Palace Entrance (South)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Desert Palace Entrance (South)");
				}
			}, { // [54]
				caption: 'Desert Palace Entrance (West)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Desert Palace Entrance (West)");
				}
			}, { // [55]
				caption: 'Desert Palace Entrance (East)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Desert Palace Entrance (East)");
				}
			}, { // [56]
				caption: 'Desert Palace Entrance (North)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Desert Palace Entrance (North)");
				}
			}, { // [57]
				caption: 'Checkerboard Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Checkerboard Cave");
				}
			}, { // [58]
				caption: 'Aginahs Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Aginahs Cave");
				}
			}, { // [59]
				caption: 'Desert Fairy',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Desert Fairy");
				}
			}, { // [60]
				caption: '50 Rupee Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("50 Rupee Cave");
				}
			}, { // [61]
				caption: 'Lake Hylia Shop',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Lake Hylia Shop");
				}
			}, { // [62]
				caption: 'Lake Hylia Fortune Teller',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Lake Hylia Fortune Teller");
				}
			}, { // [63]
				caption: 'Mini Moldorm Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Mini Moldorm Cave");
				}
			}, { // [64]
				caption: 'Capacity Upgrade',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Capacity Upgrade");
				}
			}, { // [65]
				caption: 'Ice Rod Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Ice Rod Cave");
				}
			}, { // [66]
				caption: 'Good Bee Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Good Bee Cave");
				}
			}, { // [67]
				caption: '20 Rupee Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("20 Rupee Cave");
				}
			}, { // [68]
				caption: 'Tower of Hera',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Tower of Hera");
				}
			}, { // [69]
				caption: 'Spectacle Rock Cave Peak',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Spectacle Rock Cave Peak");
				}
			}, { // [70]
				caption: 'Spectacle Rock Cave (Bottom)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Spectacle Rock Cave (Bottom)");
				}
			}, { // [71]
				caption: 'Spectacle Rock Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Spectacle Rock Cave");
				}
			}, { // [72]
				caption: 'Old Man Cave (East)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Old Man Cave (East)");
				}
			}, { // [73]
				caption: 'Death Mountain Return Cave (East)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Death Mountain Return Cave (East)");
				}
			}, { // [74]
				caption: 'Death Mountain Return Cave (West)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Death Mountain Return Cave (West)");
				}
			}, { // [75]
				caption: 'Old Man House (Bottom)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Old Man House (Bottom)");
				}
			}, { // [76]
				caption: 'Old Man House (Top)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Old Man House (Top)");
				}
			}, { // [77]
				caption: 'Paradox Cave (Top)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Paradox Cave (Top)");
				}
			}, { // [78]
				caption: 'Paradox Cave (Middle)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Paradox Cave (Middle)");
				}
			}, { // [79]
				caption: 'Paradox Cave (Bottom)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Paradox Cave (Bottom)");
				}
			}, { // [80]
				caption: 'Spiral Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Spiral Cave");
				}
			}, { // [81]
				caption: 'Spiral Cave (Bottom)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Spiral Cave (Bottom)");
				}
			}, { // [82]
				caption: 'Hookshot Fairy',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hookshot Fairy");
				}
			}, { // [83]
				caption: 'Fairy Ascension Cave (Top)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Fairy Ascension Cave (Top)");
				}
			}, { // [84]
				caption: 'Fairy Ascension Cave (Bottom)',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Fairy Ascension Cave (Bottom)");
				}
			}, { // [85]
				caption: 'Mimic Cave',
				world: "light",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Mimic Cave");
				}
			}, { // [86]
				caption: 'Big Bomb Shop',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Big Bomb Shop");
				}
			}, { // [87]
				caption: 'Bonk Fairy (Dark)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Bonk Fairy (Dark)");				
				}
			}, { // [88]
				caption: 'Hype Cave',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hype Cave");
				}
			}, { // [89]
				caption: 'Swamp Palace',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Swamp Palace");
				}
			}, { // [90]
				caption: 'Dark Sanctuary Hint',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Sanctuary Hint");
				}
			}, { // [91]
				caption: 'Red Shield Shop',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Red Shield Shop");
				}
			}, { // [92]
				caption: 'Dark Potion Shop',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Potion Shop");
				}
			}, { // [93]
				caption: 'Pyramid Hole',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Pyramid Hole");
				}
			}, { // [94]
				caption: 'Pyramid Fairy',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Pyramid Fairy");
				}
			}, { // [95]
				caption: 'Pyramid Exit',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Pyramid Exit");
				}
			}, { // [96]
				caption: 'Skull Woods Final Section',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Skull Woods Final Section");
				}
			}, { // [97]
				caption: 'Skull Woods Second Section Door (West)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Skull Woods Second Section Door (West)");
				}
			}, { // [98]
				caption: 'Skull Woods Second Section Hole',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Skull Woods Second Section Hole");
				}
			}, { // [99]
				caption: 'Skull Woods Second Section Door (East)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Skull Woods Second Section Door (East)");
				}
			}, { // [100]
				caption: 'Skull Woods First Section Hole (West)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Skull Woods First Section Hole (West)");
				}
			}, { // [101]
				caption: 'Skull Woods First Section Hole (North)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Skull Woods First Section Hole (North)");
				}
			}, { // [102]
				caption: 'Skull Woods First Section Door',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Skull Woods First Section Door");
				}
			}, { // [103]
				caption: 'Skull Woods First Section Hole (East)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Skull Woods First Section Hole (East)");
				}
			}, { // [104]
				caption: 'Dark Lumberjack Shop',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Lumberjack Shop");
				}
			}, { // [105]
				caption: 'Bumper Cave (Bottom)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Bumper Cave (Bottom)");
				}
			}, { // [106]
				caption: 'Fortune Teller (Dark)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Fortune Teller (Dark)");
				}
			}, { // [107]
				caption: 'Chest Game',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Chest Game");
				}
			}, { // [108]
				caption: 'Thieves Town',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Thieves Town");
				}
			}, { // [109]
				caption: 'C-Shaped House',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("C-Shaped House");
				}
			}, { // [110]
				caption: 'Dark World Shop',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark World Shop");
				}
			}, { // [111]
				caption: 'Brewery',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Brewery");
				}
			}, { // [112]
				caption: 'Hammer Peg Cave',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hammer Peg Cave");
				}
			}, { // [113]
				caption: 'Archery Game',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Archery Game");
				}
			}, { // [114]
				caption: 'Palace of Darkness',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Palace of Darkness");
				}
			}, { // [115]
				caption: 'Palace of Darkness Hint',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Palace of Darkness Hint");
				}
			}, { // [116]
				caption: 'Dark Lake Hylia Fairy',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Lake Hylia Fairy");
				}
			}, { // [117]
				caption: 'East Dark World Hint',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("East Dark World Hint");
				}
			}, { // [118]
				caption: 'Ice Palace',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Ice Palace");
				}
			}, { // [119]
				caption: 'Dark Lake Hylia Shop',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Lake Hylia Shop");
				}
			}, { // [120]
				caption: 'Dark Lake Hylia Ledge Fairy',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Lake Hylia Ledge Fairy");
				}
			}, { // [121]
				caption: 'Dark Lake Hylia Ledge Hint',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Lake Hylia Ledge Hint");
				}
			}, { // [122]
				caption: 'Dark Lake Hylia Ledge Spike Cave',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Lake Hylia Ledge Spike Cave");
				}
			}, { // [123]
				caption: 'Misery Mire',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (checkEntranceAvailability("Misery Mire") != 'unavailable') {
						return medallionCheck(0);
					};
					return 'unavailable';
				}
			}, { // [124]
				caption: 'Mire Shed',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Mire Shed");
				}
			}, { // [125]
				caption: 'Mire Fairy',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Mire Fairy");
				}
			}, { // [126]
				caption: 'Mire Hint',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Mire Hint");
				}
			}, { // [127]
				caption: 'Ganons Tower',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Ganons Tower");
				}
			}, { // [128]
				caption: 'Spike Cave',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Spike Cave");
				}
			}, { // [129]
				caption: 'Bumper Cave (Top)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Bumper Cave (Top)");
				}
			}, { // [130]
				caption: 'Dark Death Mountain Fairy',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Death Mountain Fairy");
				}
			}, { // [131]
				caption: 'Hookshot Cave Back Entrance',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hookshot Cave Back Entrance");
				}
			}, { // [132]
				caption: 'Hookshot Cave',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Hookshot Cave");
				}
			}, { // [133]
				caption: 'Superbunny Cave (Top)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Superbunny Cave (Top)");
				}
			}, { // [134]
				caption: 'Superbunny Cave (Bottom)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Superbunny Cave (Bottom)");
				}
			}, { // [135]
				caption: 'Dark Death Mountain Shop',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Death Mountain Shop");
				}
			}, { // [136]
				caption: 'Turtle Rock',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (checkEntranceAvailability("Turtle Rock") != 'unavailable') {
						return medallionCheck(1);
					};
					return 'unavailable';
				}
			}, { // [137]
				caption: 'Turtle Rock Isolated Ledge Entrance',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Turtle Rock Isolated Ledge Entrance");
				}
			}, { // [138]
				caption: 'Dark Death Mountain Ledge (West)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Death Mountain Ledge (West)");
				}
			}, { // [139]
				caption: 'Dark Death Mountain Ledge (East)',
				world: "dark",
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return checkEntranceAvailability("Dark Death Mountain Ledge (East)");
				}
			}];
			window.chests = [{ // [0]
				caption: 'Sunken Treasure',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Sunken Treasure");
				}
			}, { // [1]
				caption: "Link's House",
				is_opened: true,
				is_available: always
			}, { // [2]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Bottle Vendor");
				}
			}, { // [3]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Stumpy");
				}
			}, { // [4]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Purple Chest")
				}
			}, { // [5]
				caption: 'Admin under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Hobo")
				}
			}, { // [6]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Ether Tablet")
				}
			}, { // [7]
				caption: 'Bombos Tablet {mirror}{sword2}{book}',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Bombos Tablet")
				}
			}, { // [8]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Catfish")
				}
			}, { // [9]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("King Zora")
				}
			}, { // [10]
				caption: 'Old Man House (Bottom)',
				is_opened: true,
				is_available: always
			}, { // [11]
				caption: 'Mushroom',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Mushroom")
				}
			}, { // [12]
				caption: 'Spectacle Rock {mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Spectacle Rock")
				}
			}, { // [13]
				caption: 'Floating Island {mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Floating Island")
				}
			}, { // [14]
				caption: 'Race Minigame',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Maze Race")
				}
			}, { // [15]
				caption: 'Desert West Ledge',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Desert Ledge")
				}
			}, { // [16]
				caption: 'Lake Hylia Island {mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Lake Hylia Island")
				}
			}, { // [17]
				caption: 'Bumper Cave {cape}',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Bumper Cave Ledge")
				}
			}, { // [18]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Pyramid")
				}
			}, { // [19]
				caption: 'Digging Game: Pay 80 rupees',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Digging Game")
				}
			}, { // [20]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Zora's Ledge")
				}
			}, { // [21]
				caption: 'Buried Itam {shovel}',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Flute Spot")
				}
			}, { // [22]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Master Sword Pedestal")
				}
			}, { // [23]
				caption: 'Lost Woods Hideout Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Lost Woods Hideout Tree");
				}
			}, { // [24]
				caption: 'Death Mountain Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Death Mountain Bonk Rocks");
				}
			}, { // [25]
				caption: 'Mountain Entry Pull Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Mountain Entry Pull Tree");
				}
			}, { // [26]
				caption: 'Mountain Entry Southeast Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Mountain Entry Southeast Tree");
				}
			}, { // [27]
				caption: 'Lost Woods Pass West Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Lost Woods Pass West Tree");
				}
			}, { // [28]
				caption: 'Kakariko Portal Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Kakariko Portal Tree");
				}
			}, { // [29]
				caption: 'Fortune Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Fortune Bonk Rocks");
				}
			}, { // [30]
				caption: 'Kakariko Pond Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Kakariko Pond Tree");
				}
			}, { // [31]
				caption: 'Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Bonk Rocks Tree");
				}
			}, { // [32]
				caption: 'Sanctuary Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Sanctuary Tree");
				}
			}, { // [33]
				caption: 'River Bend West Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("River Bend West Tree");
				}
			}, { // [34]
				caption: 'River Bend East Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("River Bend East Tree");
				}
			}, { // [35]
				caption: 'Blinds Hideout Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Blinds Hideout Tree");
				}
			}, { // [36]
				caption: 'Kakariko Welcome Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Kakariko Welcome Tree");
				}
			}, { // [37]
				caption: 'Forgotten Forest Southwest Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Forgotten Forest Southwest Tree");
				}
			}, { // [38]
				caption: 'Forgotten Forest Central Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Forgotten Forest Central Tree");
				}
			}, { // [39]
				caption: 'Hyrule Castle Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Hyrule Castle Tree");
				}
			}, { // [40]
				caption: 'Wooden Bridge Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Wooden Bridge Tree");
				}
			}, { // [41]
				caption: 'Eastern Palace Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Eastern Palace Tree");
				}
			}, { // [42]
				caption: 'Flute Boy South Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Flute Boy South Tree");
				}
			}, { // [43]
				caption: 'Flute Boy East Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Flute Boy East Tree");
				}
			}, { // [44]
				caption: 'Central Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Central Bonk Rocks Tree");
				}
			}, { // [45]
				caption: 'Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Tree Line Tree 2");
				}
			}, { // [46]
				caption: 'Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Tree Line Tree 4");
				}
			}, { // [47]
				caption: 'Flute Boy Approach South Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Flute Boy Approach South Tree")
				}
			}, { // [48]
				caption: 'Flute Boy Approach North Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Flute Boy Approach North Tree")
				}
			}, { // [49]
				caption: 'Dark Lumberjack Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Dark Lumberjack Tree")
				}
			}, { // [50]
				caption: 'Dark Fortune Bonk Rocks (2)',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Dark Fortune Bonk Rocks (2)")
				}
			}, { // [51]
				caption: 'Dark Graveyard West Bonk Rock',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Dark Graveyard West Bonk Rocks")
				}
			}, { // [52]
				caption: 'Dark Graveyard North Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Dark Graveyard North Bonk Rocks")
				}
			}, { // [53]
				caption: 'Dark Graveyard Tomb Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Dark Graveyard Tomb Bonk Rocks")
				}
			}, { // [54]
				caption: 'Qirn Jump West Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Qirn Jump West Tree")
				}
			}, { // [55]
				caption: 'Qirn Jump East Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Qirn Jump East Tree")
				}
			}, { // [56]
				caption: 'Dark Witch Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Dark Witch Tree")
				}
			}, { // [57]
				caption: 'Pyramid Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Pyramid Tree")
				}
			}, { // [58]
				caption: 'Palace of Darkness Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Palace of Darkness Tree")
				}
			}, { // [59]
				caption: 'Dark Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Dark Tree Line Tree 2")
				}
			}, { // [60]
				caption: 'Dark Tree Line Tree 3',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Dark Tree Line Tree 3")
				}
			}, { // [61]
				caption: 'Dark Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Dark Tree Line Tree 4")
				}
			}, { // [62]
				caption: 'Hype Cave Statue',
				is_opened: false,
				is_available: function() {
					return checkAvailabilityEntrance("Hype Cave Statue")
				}
			}];
		} else {
			window.chests = [{ // [0]
				caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["King's Tomb"]);
				}
			}, { // [1]
				caption: 'Light World Swamp (2)',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Sunken Treasure", "Floodgate Chest"]);
				}
			}, { // [2]
				caption: 'Link\'s House',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Link's House"]);
				}
			}, { // [3]
				caption: 'Spiral Cave',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Spiral Cave"]);
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
				is_available: function() {
					return checkAvailability(["Kakariko Tavern"]);
				}
			}, { // [6]
				caption: 'Chicken House {bomb}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Chicken House"]);
				}
			}, { // [7]
				caption: 'Brewery {bomb}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Brewery"]);
				}
			}, { // [8]
				caption: 'C-Shaped House',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["C-Shaped House"]);
				}
			}, { // [9]
				caption: 'Aginah\'s Cave {bomb}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Aginah's Cave"]);
				}
			}, { // [10]
				caption: 'Mire Shed (2)',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Mire Shed - Left","Mire Shed - Right"]);
				}
			}, { // [11]
				caption: 'Super Bunny Chests (2)',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Superbunny Cave - Bottom", "Superbunny Cave - Top"]);
				}
			}, { // [12]
				caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Sahasrahla's Hut - Left", "Sahasrahla's Hut - Middle", "Sahasrahla's Hut - Right"]);
				}
			}, { // [13]
				caption: 'Spike Cave',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Spike Cave"]);
				}
			}, { // [14]
				caption: 'Kakariko Well (4 + {bomb})',
				is_opened: false,
				is_available: function() {
					return checkAvailability([
						"Kakariko Well - Bottom",
						"Kakariko Well - Left",
						"Kakariko Well - Middle",
						"Kakariko Well - Right",
						"Kakariko Well - Top"
					]);
				}
			}, { // [15]
				caption: 'Thieve\'s Hut (4 + {bomb})',
				is_opened: false,
				is_available: function() {
					return checkAvailability([
						"Blind's Hideout - Far Left",
						"Blind's Hideout - Left",
						"Blind's Hideout - Right",
						"Blind's Hideout - Far Right",
						"Blind's Hideout - Top"
					])
				}
			}, { // [16]
				caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
				is_opened: false,
				is_available: function() {
					return checkAvailability([
						"Hype Cave - Generous Guy",
						"Hype Cave - Bottom",
						"Hype Cave - Middle Right",
						"Hype Cave - Middle Left",
						"Hype Cave - Top"
					]);
				}
			}, { // [17]
				caption: 'Paradox Cave (5 + 2 {bomb})',
				is_opened: false,
				is_available: function() {
					return checkAvailability([
						"Paradox Cave Lower - Far Left",
						"Paradox Cave Lower - Left",
						"Paradox Cave Lower - Middle",
						"Paradox Cave Lower - Right",
						"Paradox Cave Lower - Far Right",
						"Paradox Cave Upper - Left",
						"Paradox Cave Upper - Right"
					]);
				}
			}, { // [18]
				caption: 'Bonk Rock Cave {boots}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Bonk Rock Cave"]);
				}
			}, { // [19]
				caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
				is_opened: false,
				is_available: function() {
					return checkAvailability([
						"Mini Moldorm Cave - Far Left",
						"Mini Moldorm Cave - Left",
						"Mini Moldorm Cave - Generous Guy",
						"Mini Moldorm Cave - Right",
						"Mini Moldorm Cave - Far Right"
					]);
				}
			}, { // [20]
				caption: 'Ice Rod Cave {bomb}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Ice Rod Cave"]);
				}
			}, { // [21]
				caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Hookshot Cave - Bottom Right"]);
				}
			}, { // [22]
				caption: 'Hookshot Cave (3) {hookshot}',
				is_opened: false,
				is_available: function() {
					return checkAvailability([
						"Hookshot Cave - Top Right",
						"Hookshot Cave - Top Left",
						"Hookshot Cave - Bottom Left"
					]);
				}
			}, { // [23]
				caption: 'Lost Woods Hideout Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Lost Woods Hideout Tree"]);
				}
			}, { // [24]
				caption: 'Death Mountain Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Death Mountain Bonk Rocks"]);
				}
			}, { // [25]
				caption: 'Mountain Entry Pull Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Mountain Entry Pull Tree"]);
				}
			}, { // [26]
				caption: 'Mountain Entry Southeast Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Mountain Entry Southeast Tree"]);
				}
			}, { // [27]
				caption: 'Lost Woods Pass West Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Lost Woods Pass West Tree"]);
				}
			}, { // [28]
				caption: 'Kakariko Portal Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Kakariko Portal Tree"]);
				}
			}, { // [29]
				caption: 'Fortune Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Fortune Bonk Rocks"]);
				}
			}, { // [30]
				caption: 'Kakariko Pond Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Kakariko Pond Tree"]);
				}
			}, { // [31]
				caption: 'Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Bonk Rocks Tree"]);
				}
			}, { // [32]
				caption: 'Sanctuary Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Sanctuary Tree"]);
				}
			}, { // [33]
				caption: 'River Bend West Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["River Bend West Tree"]);
				}
			}, { // [34]
				caption: 'River Bend East Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["River Bend East Tree"]);
				}
			}, { // [35]
				caption: 'Blinds Hideout Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Blinds Hideout Tree"]);
				}
			}, { // [36]
				caption: 'Kakariko Welcome Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Kakariko Welcome Tree"]);
				}
			}, { // [37]
				caption: 'Forgotten Forest Southwest Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Forgotten Forest Southwest Tree"]);
				}
			}, { // [38]
				caption: 'Forgotten Forest Central Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Forgotten Forest Central Tree"]);
				}
			}, { // [39]
				caption: 'Hyrule Castle Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Hyrule Castle Tree"]);
				}
			}, { // [40]
				caption: 'Wooden Bridge Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Wooden Bridge Tree"]);
				}
			}, { // [41]
				caption: 'Eastern Palace Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Eastern Palace Tree"]);
				}
			}, { // [42]
				caption: 'Flute Boy South Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Flute Boy South Tree"]);
				}
			}, { // [43]
				caption: 'Flute Boy East Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Flute Boy East Tree"]);
				}
			}, { // [44]
				caption: 'Central Bonk Rocks Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Central Bonk Rocks Tree"]);
				}
			}, { // [45]
				caption: 'Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Tree Line Tree 2"]);
				}
			}, { // [46]
				caption: 'Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Tree Line Tree 4"]);
				}
			}, { // [47]
				caption: 'Flute Boy Approach South Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Flute Boy Approach South Tree"]);
				}
			}, { // [48]
				caption: 'Flute Boy Approach North Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Flute Boy Approach North Tree"]);
				}
			}, { // [49]
				caption: 'Dark Lumberjack Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Dark Lumberjack Tree"]);
				}
			}, { // [50]
				caption: 'Dark Fortune Bonk Rocks (2)',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Dark Fortune Bonk Rocks (2)"]);
				}
			}, { // [51]
				caption: 'Dark Graveyard West Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Dark Graveyard West Bonk Rocks"]);
				}
			}, { // [52]
				caption: 'Dark Graveyard North Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Dark Graveyard North Bonk Rocks"]);
				}
			}, { // [53]
				caption: 'Dark Graveyard Tomb Bonk Rocks',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Dark Graveyard Tomb Bonk Rocks"]);
				}
			}, { // [54]
				caption: 'Qirn Jump West Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Qirn Jump West Tree"]);
				}
			}, { // [55]
				caption: 'Qirn Jump East Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Qirn Jump East Tree"]);
				}
			}, { // [56]
				caption: 'Dark Witch Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Dark Witch Tree"]);
				}
			}, { // [57]
				caption: 'Pyramid Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Pyramid Tree"]);
				}
			}, { // [58]
				caption: 'Palace of Darkness Tree',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Palace of Darkness Tree"]);
				}
			}, { // [59]
				caption: 'Dark Tree Line Tree 2',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Dark Tree Line Tree 2"]);
				}
			}, { // [60]
				caption: 'Dark Tree Line Tree 3',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Dark Tree Line Tree 3"]);
				}
			}, { // [61]
				caption: 'Dark Tree Line Tree 4',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Dark Tree Line Tree 4"]);
				}
			}, { // [62]
				caption: 'Hype Cave Statue',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Hype Cave Statue"]);
				}
			}, { // [63]
				caption: 'Cold Fairy Statue',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Cold Fairy Statue"]);
				}
			}, { // [64]
				caption: 'Treasure Chest Minigame: Pay 30 rupees',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Chest Game"]);
				}
			}, { // [65]
				caption: 'Bottle Merchant: 100 rupees',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Bottle Merchant"]);
				}
			}, { // [66]
				caption: 'Sahasrahla {pendant0}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Sahasrahla"]);
				}
			}, { // [67]
				caption: 'Stumpy',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Stumpy"]);
				}
			}, { // [68]
				caption: 'Muffins Kid: Distract him with {bottle}!',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Sick Kid"]);
				}
			}, { // [69]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Purple Chest"]);
				}
			}, { // [70]
				caption: 'Admin under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Hobo"]);
				}
			}, { // [71]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Ether Tablet"]);
				}
			}, { // [72]
				caption: 'Bombos Tablet {mirror}{sword2}{book}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Bombos Tablet"]);
				}
			}, { // [73]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Catfish"]);
				}
			}, { // [74]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["King Zora"]);
				}
			}, { // [75]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Old Man"]);
				}
			}, { // [76]
				caption: 'Witch: Give her {mushroom}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Potion Shop"]);
				}
			}, { // [77]
				caption: 'Forest Hideout',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Lost Woods Hideout"]);
				}
			}, { // [78]
				caption: 'Lumberjack Tree {agahnim}{boots}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Lumberjack Tree"]);
				}
			}, { // [79]
				caption: 'Spectacle Rock Cave',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Spectacle Rock Cave"]);
				}
			}, { // [80]
				caption: 'South of Grove {mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Cave 45"]);
				}
			}, { // [81]
				caption: 'Graveyard Cliff Cave {mirror} {bomb}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Graveyard Cave"]);
				}
			}, { // [82]
				caption: 'Checkerboard Cave {mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Checkerboard Cave"]);
				}
			}, { // [83]
				caption: 'Hammerpegs {hammer}!',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Peg Cave"]);
				}
			}, { // [84]
				caption: 'Library {boots}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Library"]);
				}
			}, { // [85]
				caption: 'Mushroom',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Mushroom"]);
				}
			}, { // [86]
				caption: 'Spectacle Rock {mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Spectacle Rock"]);
				}
			}, { // [87]
				caption: 'Floating Island {bomb} {mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Floating Island"]);
				}
			}, { // [88]
				caption: 'Race Minigame {bomb}/{boots}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Maze Race"]);
				}
			}, { // [89]
				caption: 'Desert West Ledge {book}/{mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Desert Ledge"]);
				}
			}, { // [90]
				caption: 'Lake Hylia Island {mirror}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Lake Hylia Island"]);
				}
			}, { // [91]
				caption: 'Bumper Cave {cape}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Bumper Cave Ledge"]);
				}
			}, { // [92]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Pyramid"]);
				}
			}, { // [93]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Digging Game"]);
				}
			}, { // [94]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Zora's Ledge"]);
				}
			}, { // [95]
				caption: 'Buried Itam {shovel}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Flute Spot"]);
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
				is_available: function() {
					return checkAvailability(["Link's Uncle", "Secret Passage"]);
				}
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
				is_available: function() {
					return checkAvailability(["Sanctuary"]);
				}
			}, { // [100]
				caption: 'Mad Batter {hammer}/{mirror} + {powder}',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Magic Bat"]);
				}
			}, { // [101]
				caption: 'Take the frog home {mirror} / Save+Quit',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Blacksmith"]);
				}
			}, { // [102]
				caption: 'Pyramid Fairy: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Pyramid Fairy - Left", "Pyramid Fairy - Right"]);
				}
			}, { // [103]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					return checkAvailability(["Master Sword Pedestal"]);
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
					return checkAvailability(["Waterfall Fairy - Left", "Waterfall Fairy - Right"]);
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
				is_available: function () {
					return checkAvailability(["Lake Hylia Shop - Left", "Lake Hylia Shop - Middle", "Lake Hylia Shop - Right"]);
				}
			}, { // [109]
				caption: 'Kakariko Shop (3)',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Kakariko Shop - Left", "Kakariko Shop - Middle", "Kakariko Shop - Right"]);
				}
			}, { // [110]
				caption: 'Paradox Shop (3) {bomb}',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Paradox Shop - Left", "Paradox Shop - Middle", "Paradox Shop - Right"]);
				}
			}, { // [111]
				caption: 'Dark Lake Hylia Shop (3)',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Dark Lake Hylia Shop - Left", "Dark Lake Hylia Shop - Middle", "Dark Lake Hylia Shop - Right"]);
				}
			}, { // [112]
				caption: 'Village of Outcasts Shop (3) {hammer}',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Village of Outcasts Shop - Left", "Village of Outcasts Shop - Middle", "Village of Outcasts Shop - Right"]);
				}
			}, { // [113]
				caption: 'Dark Death Mountain Shop (3)',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Dark Death Mountain Shop - Left", "Dark Death Mountain Shop - Middle", "Dark Death Mountain Shop - Right"]);
				}
			}, { // [114]
				caption: 'Dark Potion Shop (3)',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Dark Potion Shop - Left", "Dark Potion Shop - Middle", "Dark Potion Shop - Right"]);
				}
			}, { // [115]
				caption: 'Dark Lumberjack Shop (3)',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Dark Lumberjack Shop - Left", "Dark Lumberjack Shop - Middle", "Dark Lumberjack Shop - Right"]);
				}
			}, { // [116]
				caption: 'Red Shield Shop (3)',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Red Shield Shop - Left", "Red Shield Shop - Middle", "Red Shield Shop - Right"]);
				}
			}, { // [117]
				caption: 'Potion Shop (3)',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Potion Shop - Left", "Potion Shop - Middle", "Potion Shop - Right"]);
				}
			}, { // [118]
				caption: 'Capacity Upgrade Fairy (2)',
				is_opened: false,
				is_available: function () {
					return checkAvailability(["Capacity Upgrade - Left", "Capacity Upgrade - Right"]);
				}
			}, { // [119]
				caption: 'Bomb Shop (2)',
				is_opened: false,
				is_available: function () {
					return 'available';
				}
			}];
		};
	};

	// #region Dungeon Bosses
	window.EPBoss = function () {
		if (isNewLogic()) return bossAvailability(0, 'Eastern Palace');

		const reachability = canReachRegion('Eastern Palace');
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

		const reachability_main = canReachRegion('Desert Palace - Main');
		const reachability = canReachRegion('Desert Palace - North');
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

		const reachability = canReachRegion('Tower of Hera');
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
		const reachability = canReachRegion('Palace of Darkness');
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
		const reachability = canReachRegion('Swamp Palace');
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
		var front = canReachRegion('Skull Woods - Main');
		var middle = canReachRegion('Skull Woods - Middle');
		var back = canReachRegion('Skull Woods - Back');
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

		const reachability = canReachRegion('Thieves Town');
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

		const reachability = canReachRegion('Misery Mire');
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

		front = canReachRegion('Turtle Rock - Main');
		middle = canReachRegion('Turtle Rock - West');
		bigchest = canReachRegion('Turtle Rock - East');
		back = canReachRegion('Turtle Rock - Back');
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

	window.GTBoss = function () {
		if (isNewLogic()) {
			return bossAvailability(10, 'Ganons Tower');
		};

		const reachability = canReachRegion('Ganons Tower');
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

		const reachability = canReachRegion('Castle Tower');
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

		const reachability = canReachRegion('Eastern Palace');
		if (reachability === 'unavailable') return 'unavailable';

		var dungeonState = window.doorCheck(0,false,true,true,['hookshot','bow'],'item');
		if (!dungeonState) { // Old logic
				
			var dungeoncheck = enemizer_check(0);
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

		const reachability_front = canReachRegion('Desert Palace - Main');
		const reachability_north = canReachRegion('Desert Palace - North');
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

		const reachability = canReachRegion('Tower of Hera');
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

		const reachability = canReachRegion('Palace of Darkness');
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

		var reachability = canReachRegion('Swamp Palace');

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
			const reachability = canReachRegion('Skull Woods - Main');
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
		const reachability = canReachRegion('Thieves Town');
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

		const reachability = canReachRegion('Ice Palace');
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

		const reachability = canReachRegion('Misery Mire');
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

		front = canReachRegion('Turtle Rock - Main');
		middle = canReachRegion('Turtle Rock - West');
		bigchest = canReachRegion('Turtle Rock - East');
		back = canReachRegion('Turtle Rock - Back');

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

		const reachability = canReachRegion('Ganons Tower');
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

		var front = canReachRegion('Hyrule Castle - Main');
		var back = canReachRegion('Hyrule Castle - Sewers Dropdown');
		var sanc = canReachRegion('Sanctuary');
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

		const reachability = canReachRegion('Castle Tower');
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

	// #region Old reach logic
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


	function locationRequiresMoonpearl(mapTrackerName) {
		const moonpearlWorld = flags.gametype === 'I' ? 'light' : 'dark';
		for (var i = 0; i < entrances.length; i++) {
			if (entrances[i].known_location === mapTrackerName) {
				if ("world" in entrances[i]) {
					return entrances[i].world === moonpearlWorld;
				} else {
					return false;
				};
			};
		};
	};
	// #endregion

	// #region Old door Chest Logic
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

}(window));
