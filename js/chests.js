(function(window) {
    'use strict';

	if (flags.doorshuffle === 'P') {
        window.dungeonLogic = window.logic_dungeon_keydrop
    } else {
        window.dungeonLogic = window.logic_dungeon
    };

    if (flags.entrancemode === 'N') {
        window.checkLogic = window.logic_nondungeon_checks
    } else {
        window.checkLogic = window.logic_nondungeon_checks_entrance
    }

	window.regionReachLogic = window.logic_regions
	window.entranceLogic = window.logic_entrances
	window.entranceMap = window.entrance_to_array_id

	const userLogicSettings = JSON.parse(localStorage.getItem("logicSettings"));

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
		'darkavailable': 'purple',
		'darkpossible': 'purple',
		'unavailable': 'red'
	};

	function ConvertBossToColor(availability) {
		return bossToColorMap[availability];
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
		for (var k = 0; k < 14; k++) {
			if ((prizes[k] === 3 || prizes[k] === 4) && items['prize'+k]) {
				crystal_count++;
			}
		}
		return crystal_count;
	};

	function allDungeonCheck() {
		for (var k = 0; k < 14; k++) {
			if (!items['prize'+k]) {
				return false;
			}
		}
		return true;
	};

	function enemizer_check(i) {
		switch (enemizer[i]) {
			// Armos
			case 1: return (melee_bow() || items.boomerang > 0 || cane() || rod()) ? 'available' : 'unavailable';
			// Lanmolas
			case 2: return (melee_bow() || cane() || rod() || items.hammer) ? 'available' : 'unavailable';
			// Moldorm
			case 3: return (melee()) ? 'available' : 'unavailable';
			// Helmasaur
			case 4: return (melee_bow() && (items.hammer || items.bomb)) ? 'available': 'unavailable';
			// Arrghus
			case 5: return (items.hookshot && ((melee() || (items.bow > 1 && rod())) || (items.bomb && rod() && (items.bottle > 1 || (items.bottle > 0 && items.magic))))) ? 'available': 'unavailable';
			// Mothula
			case 6: return (melee() || items.firerod || cane()) ? 'available': 'unavailable';
			// Blind
			case 7: return (melee() || cane()) ? 'available': 'unavailable';
			// Kholdstare
			case 8: return (items.firerod || (items.bombos && (items.sword > 0 || (flags.swordmode === 'S' && items.hammer)))) ? 'available': 'unavailable';
			// Vitreous
			case 9: return (melee_bow()) ? 'available': 'unavailable';
			// Trinexx
			case 10: return (items.firerod && items.icerod && (items.hammer || items.sword > 1)) ? 'available': 'unavailable';
			// Ganon's Tower
			case 11: return (flags.bossshuffle != 'N') ? 'possible' : (melee() ? 'available': 'unavailable');
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
		for (var k = 0; k < 14; k++) {
			if ((prizes[k] === 1 || prizes[k] === 2) && items['prize'+k]) {
				pendant_count++;
			};
			if (prizes[k] === 1 && items['prize'+k]) {
				green_pendant = true;
			};
		};
		if (type === 'green') return green_pendant;
		if (type === 'all') return pendant_count === 3;
	};

	function bigRequirementSwitch(requirement, dungeonId = -1) {
	// #endregion
		switch (requirement) {
			case "agahnim": return items.agahnim;
			case "agahnim2": return items.agahnim2;
			case "boots": return items.boots;
			case 'bigkey': return items['bigkey' + dungeonId];
			case 'boots': return items.boots;
			case 'bow': return items.bow > 1;
			case "bombs": return items.bomb;
			case "book": return items.book;
			case "bottle": return items.bottle;
			case 'byrna': return items.byrna;
			case 'cape': return items.cape;
			case "flippers": return items.flippers;
			case "flute": return activeFlute() || (flags.gametype === 'I' && activeFluteInvertedEntrance());
			case "firerod": return items.firerod;
			case "glove": return items.glove;
			case "hammer": return items.hammer;
			case "halfmagic": return items.magic;
			case 'hookshot': return items.hookshot;
			case "lantern": return items.lantern;
			case 'melee': return items.sword > 0 || items.hammer;
			case 'melee_bow': return items.sword > 0 || items.hammer || items.bow > 1;
			case "moonpearl": return items.moonpearl;
			case "mushroom": return items.mushroom;
			case 'net': return items.net;
			case "mitts": return items.glove > 1;
			case "mirror": return items.mirror;
			case "shovel": return items.shovel;
			case 'icerod': return items.icerod;
			case 'mirrorshield': return items.shield > 2;
			case "powder": return items.powder;
			case 'somaria': return items.somaria;
			case 'sword': return items.sword > 0;
			case "swordbeams": return items.sword > 1;
			case "greenpendant": return pendantCheck('green');

			case 'canKillBoss': return enemizer_check(dungeonId) === 'available';
			case 'canKillArmos': return enemizer_check(0) === 'available';
			case 'canKillMostEnemies': return items.sword > 0 || items.hammer || items.bow > 1 || items.somaria || items.byrna || items.firerod;
			case 'canKillOrExplodeMostEnemies': return items.sword > 0 || items.hammer || items.bow > 1 || items.somaria || items.byrna || items.firerod || items.bomb;
			case 'canFightAgahnim': return items.sword > 0 || items.hammer || items.net;
			case 'canLightFires': return items.lantern || items.firerod;
			case 'canDarkRoomNavigate': return items.lantern;
			case 'canTorchRoomNavigate': return items.lantern || (items.firerod && !isDoorsBranch() && flags.entrancemode === 'N');
			case 'canDefeatCurtains': return items.sword > 0 || flags.swordmode === 'S';
			case 'canKillWizzrobes': return items.sword > 0 || items.hammer || items.bow > 1 || items.byrna || items.somaria || (items.icerod && (items.bomb || items.hookshot)) || items.firerod;
			case 'canCrossMireGap': return items.boots || items.hookshot;
			case 'canBurnThings': return items.firerod || (items.bombos && items.sword > 0);
			case "canHitSwitch": return canHitSwitch();
			case "canDestroyEnergyBarrier": return items.sword > 1 || (flags.swordmode === 'S' && items.hammer);
			case "canBreakTablets": return items.sword > 1 || (flags.swordmode === 'S' && items.hammer);
			case "canPullPedestal": return pendantCheck('all');
			case "canOpenBonkWalls": return items.boots || items.bomb;
			case "canHitRangedSwitch": return canHitRangedSwitch();
			case 'canKillOrExplodeMostEnemies': return items.sword > 0 || items.hammer || items.bow > 1 || items.somaria || items.byrna || items.firerod || items.bomb;
			case "canGetBonkableItem": return items.boots || (items.sword && items.quake);
			case 'gtleft': return items.hammer && items.hookshot && canHitRangedSwitch();
			case 'gtright': return items.somaria && items.firerod;
			case 'zeroKeyPodders': return items.bow > 1 && items.hammer && (items.bomb || items.boots);
			case 'canRushRightSidePod': return (items.bomb || items.boots) && (true || items.bow > 1 || items.bottle);

			case 'canDarkRoomNavigateBlind': return userLogicSettings[requirement] || bigRequirementSwitch('canDarkRoomNavigate');
			case 'canTorchRoomNavigateBlind': return userLogicSettings[requirement] || bigRequirementSwitch('canTorchRoomNavigate');
			case "canFairyReviveHover": return userLogicSettings[requirement] && (items.boots && items.bottle && items.net);
			case "canOWFairyRevive": return userLogicSettings[requirement] && (items.bottle && items.net);
			case "canQirnJump": return userLogicSettings[requirement] && (items.bomb);
			case "canMirrorSuperBunny": return userLogicSettings[requirement] && (items.mirror);
			case "canDungeonBunnyRevive": return userLogicSettings[requirement] && (true);
			case "canFakeFlipper": return userLogicSettings[requirement] && (true);
			case "canFakePowder": return userLogicSettings[requirement] && (items.somaria && items.mushroom);
			case "canWaterWalk": return userLogicSettings[requirement] && (items.boots && items.bomb);
			case "canZoraSplashDelete": return userLogicSettings[requirement] && ((items.bomb && items.bow > 0) || (items.somaria && items.bomb && items.boomerang > 1) || (items.bomb && items.icerod) || (items.bottle && items.net && items.bomb));
			case "canBunnyPocket": return userLogicSettings[requirement] && (items.boots && (items.mirror || items.bottle));
			case "canSpinSpeedClip": return false;
			case "canMirrorWrap": return false;
			case "canTombRaider": return userLogicSettings[requirement] && (items.hookshot && (items.bomb || items.sword > 1));
			case "canFairyBarrierRevive": return userLogicSettings[requirement] && (items.bottle && items.net && items.mirror);
			case "canShockBlock": return userLogicSettings[requirement] && (items.somaria);
			case "canHover": return userLogicSettings[requirement] && (items.boots);
			case 'canIceBreak': return userLogicSettings[requirement] && (items.somaria);
			case 'canHookClip': return userLogicSettings[requirement] && (items.hookshot);
			case 'canBombJump': return userLogicSettings[requirement] && (items.bomb);
			case 'canBombOrBonkCameraUnlock': return userLogicSettings[requirement] && (items.bomb || items.boots);
			case 'canHoverAlot': return userLogicSettings[requirement] && (items.boots);
			case 'canSpeckyClip': return userLogicSettings[requirement] && (items.bomb && items.hookshot);
			case 'canBombSpooky': return userLogicSettings[requirement] && (items.bomb);
			case 'canHeraPot': return userLogicSettings[requirement] && (items.hookshot && (items.boots || items.bomb));
			case 'canFireSpooky': return userLogicSettings[requirement] && (items.firerod && items.somaria);
			case 'canMimicClip': return userLogicSettings[requirement] && (true);
			case 'canPotionCameraUnlock': return userLogicSettings[requirement] && (items.bottle > 0);
			case 'canMoldormBounce': return userLogicSettings[requirement] && (items.bomb && items.sword > 0);

			case "canCrossEnergyBarrier": return items.sword > 1 || (flags.swordmode === 'S' && items.hammer) || items.cape;			
			case "charge": return items.charge;
			case "grapple": return items.grapple;
			case "gravity": return items.gravity;
			case "hijump": return items.hijump;
			case "ice": return items.ice;
			case "missile": return items.missile > 0;
			case "morph": return items.morph;
			case "morphbombs": return items.morphbombs;
			case "plasma": return items.plasma;
			case "powerbomb": return items.powerbomb > 0;
			case "screw": return items.screw;
			case "space": return items.space;
			case "spazer": return items.spazer;
			case "speed": return items.speed;
			case "spring": return items.spring;
			case "super": return items.super > 0;
			case "varia": return items.varia;
			case "wave": return items.wave;
			case "xray": return items.xray;

			case "canIBJ": return userLogicSettings[requirement] && (items.morph && items.morphbombs);
			case "canGravityJump": return userLogicSettings[requirement] && (items.gravity);
			case "canGateGlitch": return userLogicSettings[requirement] && (items.super >= 1);
			case "canSpringBallJump": return userLogicSettings[requirement] && (items.morph && items.spring);
			case "canMochtroidIceClip": return userLogicSettings[requirement] && (items.ice);
			case "canHellRun": return userLogicSettings[requirement] && (true);
			case "canLavaDive": return userLogicSettings[requirement] && (items.varia && items.hijump);
			case "canSuitlessMaridia": return userLogicSettings[requirement] && (true);
			case "canGrappleJump": return userLogicSettings[requirement] && (items.morph && items.grapple);
			case "canSnailClimb": return userLogicSettings[requirement] && (true);
			case "canDoubleSpringBallJump": return userLogicSettings[requirement] && (items.morph && items.hijump && items.spring);
			case "canBombCrystalFlashClip": return userLogicSettings[requirement] && (items.morph && items.morphbombs && items.missile >= 2 && items.super >= 2 && items.powerbomb >= 3);
			case "canSuitlessCrystalFlashClip": return userLogicSettings[requirement] && (items.morph && items.missile >= 2 && items.super >= 2 && items.powerbomb >= 3);
			case "canBootlessLavaDive": return userLogicSettings[requirement] && (items.varia && (items.etank > 0 && (items.etank + items.rtank) >= 2));
			case "canSuitlessLavaDive": return userLogicSettings[requirement] && (items.hijump && (items.etank + items.rtank) >= 8 && items.missile >= 2 && items.super >= 2 && items.powerbomb >= 3);
			case "canUnderwaterWallJump": return userLogicSettings[requirement] && (items.hijump);
			case "canNovaBoost": return userLogicSettings[requirement] && (items.morph && items.varia);


			case "canOpenGT": return crystalCheck() >= flags.opentowercount;

			case "canBuyBigBombMaybe": {
				// If has at least 2 prizes, can reach bomb shop, and red crystals arent marked as other non-beaten dungeons
				var beaten_red_crystals = 0;
				var unbeaten_red_crystals = 0;
				var beaten_crystals = 0;
				var unbeaten_crystals = 0;
				for (var k = 0; k < 14; k++) {
					if (prizes[k] === 4 && items['prize'+k]) {
						beaten_red_crystals += 1;
						continue;
					}
					if (prizes[k] === 4 && !items['prize'+k]) {
						unbeaten_red_crystals += 1;
						continue;
					}
					if (prizes[k] === 3 && items['prize'+k]) {
						beaten_crystals += 1;
						continue;
					}
					if (prizes[k] === 3 && !items['prize'+k]) {
						unbeaten_crystals += 1;
						continue;
					}
				}
				if (beaten_red_crystals >= 2) return true;
				if (unbeaten_red_crystals > 0) return false;
				if (beaten_crystals >= 2) return true;
			}

			case "canBuyBigBomb": {
				// TODO: Change this to track prizes not bosses
				var beaten_red_crystals = 0;
				var beaten_crystals = 0;
				for (var k = 0; k < 14; k++) {
					if (prizes[k] === 4 && items['prize'+k]) {
						beaten_red_crystals += 1;
						beaten_crystals += 1;
					}
					if (prizes[k] === 3 && items['prize'+k]) {
						beaten_crystals += 1;
					}
				}
				return beaten_red_crystals >= 2 || beaten_crystals >= 7;
			};
			
			case "canPullPedestal": {
				var pendant_count = 0;
				for (var k = 0; k < 10; k++) {
					if ((prizes[k] === 1 || prizes[k] === 2) && items['prize'+k]) {
						if (++pendant_count === 3) return true;
					}
				}
				return false;
			};

			case "canExitTurtleRockWestAndEnterEast": return (items.bomb || flags.gametype === 'I') && flags.entrancemode === 'N';
			case "canExitTurtleRockBack": return items.bomb || (flags.gametype != 'O' || flags.entrancemode != 'N');
			case 'canReachTurtleRockMiddle': return canReachRegion("Turtle Rock - West") === 'available' || (canReachRegion("Turtle Rock - East") === 'available' && (items.hookshot || items.somaria));
			case 'canBreachMiseryMireMaybe': return canReachRegion('Misery Mire') != 'unavailable';
			case 'canBreachTurtleRockMainMaybe': return canReachRegion("Turtle Rock - Main") != 'unavailable';
			case 'canBreachTurtleRockMiddle': return canReachRegion("Turtle Rock - West") != 'unavailable' || (canReachRegion("Turtle Rock - East") != 'unavailable' && (items.hookshot || items.somaria || items.bomb || items.boots));
			case 'canOnlyReachTurtleRockMain': return flags.gametype != 'I' && flags.entrancemode === 'N';

			case "never": return false;

			default: throw new Error("Unknown requirement: " + requirement);

		};
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

		if (requirement.includes('|')) {
			const _item = requirement.split("|")[0];
			const _count = parseInt(requirement.split("|")[1]);
			if (_item === "tanks") return items.etank + items.rtank >= _count;
			return items[_item] >= _count / 5;
		}

		return bigRequirementSwitch(requirement);
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
						case "swdrops": {
							if (!flags.gametype != 'I') {
								return canReachWestDarkWorld() ? (items.moonpearl ? 'available' : 'darkavailable') : 'unavailable';
							} else {
								return canReachInvertedWestDW() ? 'available' : 'unavailable';
							}
						}
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
		let information = 0;
		for (var i = 0; i < locations.length; i++) {
			const location = locations[i];
			let availability = 'unavailable';
			if (!(location in window.checkLogic)) return 'available';
			const requirements = window.checkLogic[location][category];
			if (!("always" in requirements) || stateOfAll(requirements["always"])) {
				availability = 'possible';
				if (!("logical" in requirements) || stateOfAll(requirements["logical"])) {
					availability = 'available';
				} else if (!("required" in requirements) || stateOfAll(requirements["required"])) {
					availability = 'darkavailable';
				};
			} else {
				if ("scout" in requirements && stateOfAll(requirements["scout"])) {
					availability = 'information';
				};
			};
			switch (availability) {
				case 'available': available++; break;
				case 'darkavailable': required++; break;
				case 'possible': possible++; break;
				case 'information': information++; break;
				default: unavailable++;
			};
		};
		if (available > 0 && unavailable === 0) return 'available';
		if (available > 0 && unavailable > 0) return 'partialavailable';
		if (required > 0) return 'darkavailable';
		if (possible > 0) return 'possible';
		if (information > 0) return 'information';
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
				"Death Mountain Return Cave (East)", "Old Man House (Bottom)", "Old Man House (Top)", "Tower of Hera"
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
		if (hasFoundEntranceName("Paradox Cave (Top)")) return true;
		if (hasFoundEntranceName("Tower of Hera") && items.hammer && items.moonpearl) return true;
		if (canReachInvertedDarkDeathMountain() && items.glove > 1 && items.hammer && items.moonpearl) return true;
		return false;
	};

	function canReachInvertedUpperWestDeathMountain() {
		if (hasFoundEntranceName("Tower of Hera")) return true;
		if (items.moonpearl && items.hammer && hasFoundEntranceName("Paradox Cave (Top)")) return true;
		if (canReachInvertedDarkDeathMountain() && items.glove > 1 && items.hammer && items.moonpearl) return true;
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
			"mapTrackerNames": ["ep"],
			"abbreviation": "ep"
		},
		{
			"id": 1,
			"dungeon": "Desert Palace",
			"regions": ["Desert Palace - Main", "Desert Palace - North"],
			"mapTrackerNames": ["dp_m","dp_w","dp_e","dp_n"],
			"abbreviation": "dp"
		},
		{
			"id": 2,
			"dungeon": "Tower of Hera",
			"regions": ["Tower of Hera"],
			"mapTrackerNames": ["toh"],
			"abbreviation": "toh"
		},
		{
			"id": 3,
			"dungeon": "Palace of Darkness",
			"regions": ["Palace of Darkness"],
			"mapTrackerNames": ["pod"],
			"abbreviation": "pod"
		},
		{
			"id": 4,
			"dungeon": "Swamp Palace",
			"regions": ["Swamp Palace"],
			"mapTrackerNames": ["sp"],
			"abbreviation": "sp"
		},
		{
			"id": 5,
			"dungeon": "Skull Woods",
			"regions": ["Skull Woods - Main", "Skull Woods - Middle", "Skull Woods - Back", "Skull Woods - Drops"],
			"mapTrackerNames": ["sw","sw_m","sw_w","sw_e"],
			"abbreviation": "sw"
		},
		{
			"id": 6,
			"dungeon": "Thieves Town",
			"regions": ["Thieves Town"],
			"mapTrackerNames": ["tt"],
			"abbreviation": "tt"
		},
		{
			"id": 7,
			"dungeon": "Ice Palace",
			"regions": ["Ice Palace"],
			"mapTrackerNames": ["ip"],
			"abbreviation": "ip"
		},
		{
			"id": 8,
			"dungeon": "Misery Mire",
			"regions": ["Misery Mire"],
			"mapTrackerNames": ["mm"],
			"abbreviation": "mm"
		},
		{
			"id": 9,
			"dungeon": "Turtle Rock",
			"regions": ["Turtle Rock - Main", "Turtle Rock - West", "Turtle Rock - East", "Turtle Rock - Back"],
			"mapTrackerNames": ["tr_m","tr_w","tr_e","tr_b"],
			"abbreviation": "tr"
		},
		{
			"id": 10,
			"dungeon": "Ganons Tower",
			"regions": ["Ganons Tower"],
			"mapTrackerNames": ["gt"],
			"abbreviation": "gt"
		},
		{
			"id": 11,
			"dungeon": "Hyrule Castle",
			"regions": ["Hyrule Castle - Main", "Hyrule Castle - Sewers Dropdown", "Sanctuary"],
			"mapTrackerNames": ["hc_m","hc_w","hc_e", "sanc"],
			"abbreviation": "hc"
		},
		{
			"id": 12,
			"dungeon": "Castle Tower",
			"regions": ["Castle Tower"],
			"mapTrackerNames": ["ct"],
			"abbreviation": "at"
		}
	]

	function checkAvailabilityEntrance(location) {
		const category = flags.gametype === 'I' ? 'Inverted' : 'Open';
		const requirements = window.checkLogic[location][category];
		let state = stateOfAllEntrance(requirements) ? 'available' : 'unavailable';
		if (state ==='unavailable' && requirements.scout) {
			state = stateOfAllEntrance(requirements.scout) ? 'information' : 'unavailable';
		}
		return state;
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

		return bigRequirementSwitch(requirement);
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
		
		if (requirement === 'bigkey' && !flags.wildbigkeys) return true;

		if (requirement.startsWith('keys')) {
			if (flags.gametype === 'R' || !flags.wildkeys) return true;
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

		return bigRequirementSwitch(requirement, dungeonId);
	};

	function dungeonAvailability(dungeonId, dungeonName) {
		const dungeonAbbreviation = dungeonCheckMap[dungeonId].abbreviation;
		var checksAlways = 0;
		var checksRequired = 0;
		var checksLogical = 0;
		var checksSuperLogic = 0;
		const hasNoBossItem = (dungeonName === 'Ganons Tower' || dungeonName === 'Castle Tower')

		// Stupid exceptions
		if (dungeonName === 'Swamp Palace') {
			if (flags.entrancemode != 'N' && !hasFoundLocation('dam')) return 'unavailable';
			if (flags.entrancemode === 'N' && !items.mirror) return 'unavailable';
		};

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

		var maxChecks = Object.keys(window.dungeonLogic[dungeonName]).length - hasNoBossItem;
		var collected = maxChecks - items['chest' + dungeonId];

		if (!flags.wildkeys) collected -= window.dungeonTotalLocations[dungeonAbbreviation]['keys'];
		if (!flags.wildbigkeys) collected -= window.dungeonTotalLocations[dungeonAbbreviation]['bigkey'];
		if (!flags.wildcompasses) collected -= window.dungeonTotalLocations[dungeonAbbreviation]['compass'];
		if (!flags.wildmaps) collected -= window.dungeonTotalLocations[dungeonAbbreviation]['map'];

		if ( 
			(!flags.wildkeys && window.dungeonTotalLocations[dungeonAbbreviation]['keys'] > 0 ) || 
			(!flags.wildbigkeys && window.dungeonTotalLocations[dungeonAbbreviation]['bigkey'])
		) { if (checksRequired > 0 && checksRequired < maxChecks) return 'possible'; }


		if (checksLogical >= maxChecks) return 'available';
		if ((checksLogical - collected) > 0) return 'partialavailable';
		if ((checksRequired - collected) > 0) return 'darkavailable';
		if ((checksAlways - collected) > 0) return 'possible';

		return 'unavailable';
	};

	function minimumAvailability(a, b) {
		var availabilities = [a, b];
		if (availabilities.includes('unavailable')) return 'unavailable';
		if (availabilities.includes('possible')) return 'possible';
		if (availabilities.includes('darkpossible')) return 'darkpossible';
		if (availabilities.includes('darkavailable')) return 'darkavailable';
		if (availabilities.includes('partialavailable')) return 'partialavailable';
		return 'available';
	}

	function bossAvailability(dungeonId, dungeonName) {
		const requirements = window.dungeonLogic[dungeonName][dungeonName + ' - Boss'];
		var availability = 'unavailable';

		if (!("always" in requirements) || inLogic(dungeonId, requirements["always"])) {
			availability = 'possible';
			if (!("required" in requirements) || (inLogic(dungeonId, requirements["required"]))) availability = 'darkavailable';
			if (!("logical" in requirements) || inLogic(dungeonId, requirements["logical"])) availability = 'available';
		};

		if (!flags.keyshuffle || !flags.bigkeyshuffle) {
			var dunAvailability = dungeonAvailability(dungeonId, dungeonName);
			return minimumAvailability(availability, dunAvailability);
		}
		return availability
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

		window.dungeons = []
		for (var i = 0; i < dungeonCheckMap.length; i++) {
			const dungeon = dungeonCheckMap[i];
			dungeons.push({
				caption: dungeon.dungeon,
				is_beaten: false,
				is_beatable: function() {
					return bossAvailability(dungeon.id, dungeon.dungeon);
				},
				can_get_chest: function() {
					return dungeonAvailability(dungeon.id, dungeon.dungeon);
				}
			});
		};

		window.dungeons[11].is_beatable = function() {
			return items.chest11 ? window.dungeons[11].can_get_chest() : 'opened';
		};

		window.agahnim = {
			caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
			is_available: function() {
				return bossAvailability(12, 'Castle Tower');
			}
		};

		var chests_idx = flags.entrancemode != 'N' ? 'entrance_idx' : 'open_idx';

		window.chests_data = window.chests_data.filter((chest) => chests_idx in chest);
		window.chests = Array(window.chests_data.length)

		window.chests_data.map((chest, index) => {
			window.chests[chest[chests_idx]] = {
				caption: chest.caption,
				is_opened: false,
				is_available: function() {
					return flags.entrancemode != 'N' ? checkAvailabilityEntrance(chest.checks) : checkAvailability(chest.checks);
				}
			}
		})

		if (flags.entrancemode != 'N') {
			// Links house
			window.chests[1].is_available = always

			window.entrances = []
			Object.keys(window.entrances_data).forEach(function(key, index) {
				window.entrances.push(
					{
						caption: key,
						world: window.entrances_data[key].world,
						is_opened: false,
						note: '',
						known_location: '',
						is_connector: false,
						is_available: function() { 
							return checkEntranceAvailability(key);
						}
					}
				)
			})

			// Mire
			window.entrances[123]["is_available"] = function() {
				return minimumAvailability(medallionCheck(0), checkEntranceAvailability("Misery Mire"));
			}
			// TR
			window.entrances[136]["is_available"] = function() {
				return minimumAvailability(medallionCheck(1), checkEntranceAvailability("Turtle Rock"));
			}

		} else {
			// Link's House
			window.chests[2].is_available = always
			
			// Mimic Cave
			window.chests[4].is_available = function() {
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
			// Back of Escape
			window.chests[96].is_available = function() {
				if (!(items.bomb || items.boots)) return 'unavailable';
				if (flags.doorshuffle === 'P' || flags.doorshuffle === 'N') {
					const dungeonId = 11;
					const requirements = dungeonLogic['Hyrule Castle']['Sewers - Secret Room - Middle'];
					if (inLogic(dungeonId, requirements["always"])) {
						if (!("logical" in requirements) || inLogic(dungeonId, requirements["logical"])) {
							return 'available';
						} else if (!("required" in requirements) || inLogic(dungeonId, requirements["required"])) {
							return 'darkavailable';
						};
						return 'possible';
					};
					return 'unavailable';		
				};
				return window.doorCheck(11,false,false,flags.gametype != 'S',['glove','killbomb','bombdash'],'item');
			};
			// HC
			window.chests[98].is_available = function() {
				if (flags.doorshuffle === 'N') {
					const subdungeon = ['Hyrule Castle - Boomerang Chest','Hyrule Castle - Map Chest','Hyrule Castle - Zelda\'s Chest'];
					const dungeonId = 11;
					var checksAlways = 0;
					var checksRequired = 0;
					var checksLogical = 0;
					for (const [location, requirements] of Object.entries(dungeonLogic['Hyrule Castle'])) {
						if (!(subdungeon.includes(location))) continue;
						if (inLogic(dungeonId, requirements["always"])) {
							checksAlways++;
							if (!("logical" in requirements) || inLogic(dungeonId, requirements["logical"])) {
								checksLogical++;
								checksRequired++;
							} else if (!("required" in requirements) || inLogic(dungeonId, requirements["required"])) {
								checksRequired++;
							};
						};
					};

					if (checksLogical >= subdungeon.length) return 'available';
					if (checksLogical > 0) return 'partialavailable';
					if (checksRequired > 0) return 'darkavailable';
					if (checksAlways > 0) return 'possible';
			
					return 'unavailable';
				}
				return window.doorCheck(11,false,false,flags.gametype != 'S',['glove','killbomb','bombdash'],'item');
			}
			// Dark Cross
			window.chests[104].is_available = function() {
				if (flags.doorshuffle === 'N') {
					const dungeonId = 11;
					const requirements = dungeonLogic['Hyrule Castle']['Sewers - Dark Cross'];
					if (inLogic(dungeonId, requirements["always"])) {
						if (!("logical" in requirements) || inLogic(dungeonId, requirements["logical"])) {
							return 'available';
						} else if (!("required" in requirements) || inLogic(dungeonId, requirements["required"])) {
							return 'darkavailable';
						};
						return 'possible';
					};
					return 'unavailable';		
				};
				return window.doorCheck(11,false,false,flags.gametype != 'S',['glove','killbomb','bombdash'],'item');
			}
			// CT1
			window.chests[106].is_available = function() {
				if (flags.doorshuffle === 'N') {
					const dungeonId = 12;
					const requirements = dungeonLogic['Castle Tower']['Castle Tower - Room 03'];
					if (inLogic(dungeonId, requirements["always"])) {
						if (!("logical" in requirements) || inLogic(dungeonId, requirements["logical"])) {
							return 'available';
						} else if (!("required" in requirements) || inLogic(dungeonId, requirements["required"])) {
							return 'darkavailable';
						};
						return 'possible';
					};
					return 'unavailable';		
				};
				if(items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape && !items.agahnim)
					return 'unavailable';
				if(items.mirror && (items.agahnim || (items.glove && items.hammer && items.moonpearl) || (items.glove === 2 && items.moonpearl && items.flippers)))
					return window.doorCheck(12,false,true,true,['kill','swordorswordless'],'item');
				return 'possible';
			}
			// CT2
			window.chests[107].is_available = function() {
				if (flags.doorshuffle === 'N') {
					const dungeonId = 12;
					const requirements = dungeonLogic['Castle Tower']['Castle Tower - Dark Maze'];
					if (inLogic(dungeonId, requirements["always"])) {
						if (!("logical" in requirements) || inLogic(dungeonId, requirements["logical"])) {
							return 'available';
						} else if (!("required" in requirements) || inLogic(dungeonId, requirements["required"])) {
							return 'darkavailable';
						};
						return 'possible';
					};
					return 'unavailable';		
				};
				if(items.sword < 2 && (flags.swordmode != 'S' || !items.hammer) && !items.cape && !items.agahnim)
					return 'unavailable';
				if(items.mirror && (items.agahnim || (items.glove && items.hammer && items.moonpearl) || (items.glove === 2 && items.moonpearl && items.flippers)))
					return window.doorCheck(12,false,true,true,['kill','swordorswordless'],'item');
				return 'possible';
			}

			// Bomb Shop
			window.chests[119].is_available = always
		}
	}

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
		state = window.dungeons[dungeonID].is_beatable();

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
		state = window.dungeons[dungeonID].can_get_chest();

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
