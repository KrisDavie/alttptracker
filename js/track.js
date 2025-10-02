(function (window) {
  "use strict";

  var overrideEntranceCloseFlag = false;
  var connectStart = false;
  var connectFinish = false;
  var connectorid = 0;
  var swapTowers = false;
  var swapGanon = false;
  var trackingTimer = null;
  window.connectorIndex = [];
  window.connectorOne = [];
  window.connectorTwo = [];
  window.middleClickedEntrance = -1;
  window.owGraphLogic = false;
  window.dpFrontLogic = false;
  window.trFrontLogic = false;

  window.prizes = [];
  window.enemizer = [];
  window.medallions = [0, 0];
  window.lastItem = null;
  window.trashItems = [];
  window.mapsAreTrash = false;
  window.compassesAreTrash = false;
  window.dungeonContents = [];
  window.rightClickedLocation = -1;
  window.rightClickedType = null;

  window.dungeonNames = ["EP", "DP", "ToH", "PoD", "SP", "SW", "TT", "IP", "MM", "TR", "GT"];
  window.constantFunctions = {};
  window.constantFunctionsEDC = {};
  window.dungeonEntranceCounts = [1, 4, 1, 1, 1, 8, 1, 1, 1, 4, 1, 5, 1];
  window.dungeonEntrances = [];
  window.dungeonEntrancesBunny = [];
  window.bottlesObtained = [false, false, false, false];

  window.doorWindow = null;
  window.dungeonData = null;
  window.mixedow = false;

  window.rgbToLightness = function (rgb) {
    if (rgb.substring(0, 1) === "#") {
      rgb = rgb.substring(1);
    }
    var r = parseInt(rgb.substring(0, 2), 16) / 255;
    var g = parseInt(rgb.substring(2, 4), 16) / 255;
    var b = parseInt(rgb.substring(4, 6), 16) / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    return (max + min) / 2;
  };

  window.rgbToTextColour = function (rgb) {
    return rgbToLightness(rgb) >= 0.5 ? "#000000" : "#FFFFFF";
  };

  window.resetTrackerTimer = function () {
    clearTimeout(trackingTimer);
    trackingTimer = setTimeout(sendTrackerCommand, 2000);
  };

  window.resetClasses = function (label, value) {
    var nodes = Array.from(document.getElementsByClassName(label));
    var isboss = label.startsWith("boss");

    for (var i = 0; i < 10; i++) {
      document.getElementById("dungeonPrize" + i).classList = ["prize-" + prizes[i]];
    }

    for (var i = 0; i < 2; i++) {
      document.getElementById("medallion" + i).className = "medallion-" + medallions[i];
    }

    if (label.substring(0, 5) === "chest") {
      if (value === 0) {
        if (!flags.wildkeys && !flags.wildbigkeys && flags.gametype != "R" && flags.doorshuffle != "C" && label.length === 6 && !flags.showsmallkeys && !flags.showbigkeys) {
          document.getElementById(label).className = "chest-" + value + " large";
        } else {
          document.getElementById(label).className = "chest-" + value;
        }

        document.getElementById(label).innerHTML = "";
      } else {
        if (!flags.wildkeys && !flags.wildbigkeys && flags.gametype != "R" && flags.doorshuffle != "C" && label.length === 6 && !flags.showsmallkeys && !flags.showbigkeys) {
          document.getElementById(label).className = "chest large";
        } else {
          document.getElementById(label).className = "chest";
        }

        document.getElementById(label).innerHTML = flags.doorshuffle === "C" && !items["chestknown" + label.substring(5)] ? value - 1 + "+" : value;
      }
    }

    if (label.substring(0, 6) === "bigkey") {
      let prefix = "bigkey";
      if (label === "bigkey11" || label === "bigkey12") {
        prefix += "half";
      }
      if (items[label]) {
        document.getElementById(label).className = prefix + " collected";
      } else {
        document.getElementById(label).className = prefix;
      }
    }

    if (label.substring(0, 8) === "smallkey") {
      document.getElementById(label).innerHTML = items[label];
    }

    if (typeof value === "boolean") {
      nodes.forEach((node) => node.classList[items[label] ? "add" : "remove"](isboss ? "defeated" : "active"));
    } else {
      //var value = items.inc(label);
      nodes.forEach((node) => {
        node.className = node.className.replace(/ ?active-\w+/, "");
      });
      if (value) nodes.forEach((node) => node.classList.add("active-" + value));

      if (value) lastItem = label + " active-" + value;
      else lastItem = null;
    }

    if (label === "moonpearl" || label === "tunic") {
      document.getElementsByClassName("tunic")[0].classList[!items.moonpearl ? "add" : "remove"]("bunny");
    }
  };

  // Event of clicking on the item tracker
  window.toggle = function (label) {
    if (rightClickedLocation != -1) {
      var name = getNiceName(label);
      if (rightClickedType === "chest") {
        if (name.charAt(0) < "a" || name.charAt(0) > "z") {
          if (!chests[rightClickedLocation].content) chests[rightClickedLocation].content = name;
          else chests[rightClickedLocation].content += ", " + name;
          document.getElementById("caption").innerHTML = caption_to_html(name + " placed at " + chests[rightClickedLocation].caption);
          document.getElementById("locationMap" + rightClickedLocation).classList.add("scouted");
          document.getElementById("locationMap" + rightClickedLocation).classList.add(itemNameToCSSName(name));
        }
        document.getElementById("locationMap" + rightClickedLocation).classList.remove("rightclick");
      }
      if (rightClickedType === "dungeon") {
        if (name.charAt(0) < "a" || name.charAt(0) > "z") {
          if (!dungeons[rightClickedLocation].content) dungeons[rightClickedLocation].content = name;
          else dungeons[rightClickedLocation].content += ", " + name;
          document.getElementById("caption").innerHTML = caption_to_html(name + " placed in " + dungeons[rightClickedLocation].caption);
          document.getElementById("dungeon" + rightClickedLocation).classList.add("scouted");
        }
        document.getElementById("dungeon" + rightClickedLocation).classList.remove("rightclick");
      }
      rightClickedLocation = -1;

      return;
    }

    if (label === "mirror" && ((flags.doorshuffle != "N" && flags.doorshuffle != "P") || flags.mirrorscroll === "Y")) {
      document.getElementById("mirrorscroll").style.display = items.mirror ? "block" : "none";
    }

    if (label === "boots" && flags.pseudoboots === "Y") {
      document.getElementById("pseudoboots").style.display = items.boots ? "block" : "none";
    }

    // If left clicked on chest
    if (label.substring(0, 5) === "chest") {
      //do this when autotracking doors
      if (["Y", "E"].includes(flags.autotracking) && flags.doorshuffle === "C") {
        var curCount = Number(document.getElementById(label).innerHTML.replace("+", ""));
        if (curCount > 0) {
          items["chestmanual" + label.substring(5)]++;
        }
        curCount = Number(document.getElementById(label).innerHTML.replace("+", ""));
        setChestCount(curCount + Number(items["chestmanual" + label.substring(5)]) - 1, label);
        return;
      }
      var value = items.dec(label);
      if (value === 0) {
        if (!flags.wildkeys && !flags.wildbigkeys && flags.gametype != "R" && flags.doorshuffle != "C" && label.length === 6 && !flags.showsmallkeys && !flags.showbigkeys) {
          document.getElementById(label).className = "chest-" + value + " large";
        } else {
          document.getElementById(label).className = "chest-" + value;
        }

        document.getElementById(label).innerHTML = "";
      } else {
        if (!flags.wildkeys && !flags.wildbigkeys && flags.gametype != "R" && flags.doorshuffle != "C" && label.length === 6 && !flags.showsmallkeys && !flags.showbigkeys) {
          document.getElementById(label).className = "chest large";
        } else {
          document.getElementById(label).className = "chest";
        }

        document.getElementById(label).innerHTML = flags.doorshuffle === "C" && !items["chestknown" + label.substring(5)] ? value - 1 + "+" : value;
      }

      if (flags.mapmode != "N" && flags.entrancemode === "N") {
        var x = label.substring(5);
        document.getElementById("dungeon" + x).className = "dungeon " + (value ? dungeons[x].can_get_chest() : "opened") + (value && dungeons[x].content ? " scouted" : "");
        if (label == "chest11") {
          document.getElementById("bossMap11").className = "bossprize-" + prizes[11] + " boss " + dungeons[11].is_beatable();
        }
      }

      updateLocationAvailability();

      if (doorWindow && !doorWindow.closed) doorWindow.postMessage(cloneItems(), "*");

      return;
    }

    var isKey = label.includes("key");

    // If left clicked on a big key
    if (label.substring(0, 6) === "bigkey") {
      items[label] = !items[label];

      let prefix = "bigkey";
      if (label === "bigkey11" || label === "bigkey12") {
        prefix += "half";
      }

      if (items[label]) {
        document.getElementById(label).className = prefix + " collected";
      } else {
        document.getElementById(label).className = prefix;
      }
    }

    if (label.substring(0, 12) === "smallkeyhalf" || label.substring(0, 8) === "smallkey") {
      //do this if autotracking doors
      if (["Y", "E"].includes(flags.autotracking) && flags.doorshuffle === "C") {
        items["keymanual" + label.substring(8)]++;
        setKeyCount(Number(document.getElementById(label).innerHTML) - Number(items["keymanual" + label.substring(8)]) + 1, items["maxkey" + label.substring(8)], label);
        return;
      }

      if (flags.gametype != "R") {
        var value = items.inc(label);
      } else {
        var value = items.dec(label);
      }
      document.getElementById(label).style.color = value >= items.range[label].max ? "green" : "white";
      document.getElementById(label).innerHTML = value;
    }

    var is_boss = false;

    if (!isKey) {
      var nodes = Array.from(document.getElementsByClassName(label));
      is_boss = nodes[0].classList.contains("boss");
      if (typeof items[label] === "boolean") {
        items[label] = !items[label];

        if (items[label] == true) {
          lastItem = label;
        } else {
          lastItem = null;
        }
        nodes.forEach((node) => node.classList[items[label] ? "add" : "remove"](is_boss ? "defeated" : "active"));
      } else if (label != "sword" || flags.swordmode != "S") {
        var value = items.inc(label);
        if (label.startsWith("bottle")) {
          var bottleid = parseInt(label.substring(6)) - 1;
          if (value === 0) {
            if (window.bottlesObtained[bottleid] === true) {
              window.bottlesObtained[bottleid] = false;
              items.bottle -= 1;
            }
          } else {
            if (window.bottlesObtained[bottleid] === false) {
              window.bottlesObtained[bottleid] = true;
              items.bottle += 1;
            }
          }
        }
        if (label === "bow" && value === 1 && window.flags.nonprogressivebows === false) {
          value = items.inc(label);
        }
        nodes.forEach((node) => {
          node.className = node.className.replace(/ ?active-\w+/, "");
        });
        if (value) {
          nodes.forEach((node) => node.classList.add("active-" + value));
        }
        if (value) {
          lastItem = label + " active-" + value;
        } else {
          lastItem = null;
        }
      }
      // Initiate bunny graphics!
      if (label === "moonpearl" || label === "tunic") {
        document.getElementsByClassName("tunic")[0].classList[!items.moonpearl ? "add" : "remove"]("bunny");
      }
    }

    updateLocationAvailability();

    if (flags.mapmode != "N") {
      // Clicking a boss on the tracker will check it off on the map!
      if (is_boss) {
        toggle_boss(label.substring(4));
      }

      if (label === "agahnim") {
        toggle_boss("12");
      }
    }

    if (doorWindow && !doorWindow.closed) doorWindow.postMessage(cloneItems(), "*");
  };

  window.updateLocationAvailability = function () {
    if (flags.mapmode != "N") {
      for (k in chests) {
        if (!chests[k].is_opened) {
          document.getElementById("locationMap" + k).className = "location " + chests[k].is_available();
          if (chests[k].content) {
            document.getElementById("locationMap" + k).classList.add("scouted");
            document.getElementById("locationMap" + k).classList.add(itemNameToCSSName(chests[k].content));
          }
          if (23 <= k && k <= 63) {
            document.getElementById("locationMap" + k).classList.add("bonkloc");
          }
        }
      }

      if (flags.entrancemode != "N") {
        for (var k = 0; k < entrances.length; k++) {
          if (entrances[k].is_opened) {
            continue;
          }

          var entrancetype = "";
          if (entrances[k].is_available()) {
            var known_location = entrances[k].known_location;
            if (known_location) {
              switch (true) {
                case isCastleConnector(known_location) === true:
                  entrancetype = "castleconnector";
                  break;

                case isDesertConnector(known_location) === true:
                  entrancetype = "desertconnector";
                  break;

                case isTurtleConnector(known_location) === true:
                  entrancetype = "turtleconnector";
                  break;

                case isSkullConnector(known_location) === true:
                  entrancetype = "skullconnector";
                  break;

                case isSpawn(known_location) === true:
                case isDungeon(known_location) === true:
                case isDark(known_location) === true:
                case requireItem(known_location) === true:
                  entrancetype = known_location;
                  break;
                case isShop(known_location) === true:
                  entrancetype = "shop";
                  break;

                case isUnknownConnector(known_location) === true:
                  entrancetype = "unknownconnector";
                  break;

                default:
                  entrancetype = "other";
                  break;
              }
            } else if (entrances[k].is_connector) {
              entrancetype = "connector";
            }
          }
          var ent = document.getElementById("entranceMap" + k);
          ent.className = "entrance " + entrances[k].is_available() + entrancetype + (ent.classList.contains("highlight") ? " highlight" : "") + (entrances[k].remind_me ? " remindme" : "");
        }
      } else {
        for (var k = 0; k < dungeons.length; k++) {
          document.getElementById("bossMap" + k).className = "bossprize-" + prizes[k] + " boss " + (dungeons[k].is_beaten ? "opened" : dungeons[k].is_beatable());
          if (items["chest" + k]) document.getElementById("dungeon" + k).className = "dungeon " + dungeons[k].can_get_chest() + (dungeons[k].can_get_chest() != "opened" && dungeons[k].content ? " scouted" : "");
        }
      }

      toggle_agahnim();
    }

    // Update the dungeon chest colors
    for (var k = 0; k < dungeonChecks.length; k++) {
      dungeonChecks[k].can_get_chest();
    }
  };

  window.sendShuffleUpdate = function (tile, swapped) {
    if (doorWindow && !doorWindow.closed && window.mixedow) {
      doorWindow.postMessage({ type: "SHUFFLEUPDATE", tile: tile, swapped: swapped }, "*");
    }
  };

  function minimumAvailability(a, b) {
    var availabilities = [a, b];
    if (availabilities.includes("unavailable")) return "unavailable";
    if (availabilities.includes("possible")) return "possible";
    if (availabilities.includes("darkpossible")) return "darkpossible";
    if (availabilities.includes("darkavailable")) return "darkavailable";
    if (availabilities.includes("partialavailable")) return "partialavailable";
    return "available";
  }

  window.receiveMessage = function (event) {
    if (window.origin === event.origin) {
      if (event.data.mixedow !== undefined) {
        window.mixedow = event.data.mixedow;
      }
      if (event.data.logic && flags.overworldshuffle != "N") {
        owGraphLogic = true;
        var newSwapTowers = event.data.towerSwap === true;
        var newSwapGanon = event.data.ganonSwap === true;
        if (swapTowers !== newSwapTowers) {
          swapTowers = newSwapTowers;
          updateLayoutTowers();
        }
        if (swapGanon !== newSwapGanon) {
          swapGanon = newSwapGanon;
          updateLayoutGanon();
        }
        dpFrontLogic = event.data.dpFrontLogic === true;
        trFrontLogic = event.data.trFrontLogic === true;
        if (event.data.helpDesert && doorCheck(1, false, false, false, [(!flags.wildkeys && flags.gametype != "R") || !flags.wildbigkeys ? "boots" : "", "firesource", "killbomb"], "connector") === "available")
          event.data.items[48] = event.data.items[48] === "darkpossible" ? "darkavailable" : "available";
        if (event.data.helpMimic && doorCheck(9, false, true, false, ["somaria", "firerod", (!flags.wildkeys && flags.gametype != "R") || !flags.wildbigkeys ? "laserbridge" : "", "bomb"], "connector") === "available")
          event.data.items[4] = event.data.items[4] === "darkpossible" ? "darkavailable" : "available";
        for (var k = 0; k < chests.length; k++) chests[k].is_available = constantFunctions[event.data[flags.entrancemode === "N" ? "items" : "entranceitems"][k]];
        for (var k = 0; k < dungeons.length; k++) {
          var dungeonEntrances = new Array(dungeonEntranceCounts[k]),
            dungeonEntrancesBunny = new Array(dungeonEntranceCounts[k]);
          for (var l = 0; l < dungeonEntrances.length; l++) {
            dungeonEntrances[l] = event.data.dungeons[k * 8 + l];
            dungeonEntrancesBunny[l] = event.data.dungeonsBunny[k * 8 + l];
          }
          if (dungeons[k].is_beatable_orig === undefined) {
            dungeons[k].is_beatable_orig = dungeons[k].is_beatable;
          }
          if (dungeons[k].can_get_chest_orig === undefined) {
            dungeons[k].can_get_chest_orig = dungeons[k].can_get_chest;
          }
          const dungeonAvailable = window.OWDungeonAvailable(k, dungeonEntrances, dungeonEntrancesBunny);
          dungeons[k].is_beatable = (function(dungeonIndex) {
            return function () {
              return dungeonAvailable === 'unavailable' ? dungeonAvailable : dungeons[dungeonIndex].is_beatable_orig();
            };
          })(k);
          dungeons[k].can_get_chest = (function(dungeonIndex) {
            return function () {
              return dungeonAvailable === 'unavailable' ? dungeonAvailable : dungeons[dungeonIndex].can_get_chest_orig();
            };
          })(k);
          window.dungeonEntrances[k] = dungeonEntrances;
          window.dungeonEntrancesBunny[k] = dungeonEntrancesBunny;
        }

        agahnim.is_available = dungeons[12].is_beatable;
        if (flags.entrancemode != "N") {
          for (var k = 0; k < entrances.length; k++) {
            entrances[k].is_available = constantFunctions[event.data.entrances[k]];
          }
        }
        updateLocationAvailability();
      } else if (event.data == "PING" && doorWindow && !doorWindow.closed) {
        doorWindow.postMessage("PONG", "*");
      } else if (event.data == "UPDATE" && doorWindow && !doorWindow.closed) {
        doorWindow.postMessage(dungeonData, "*");
      } else if (event.data == "ITEMS" && doorWindow && !doorWindow.closed) {
        doorWindow.postMessage(cloneItems(), "*");
      } else if (event.data == "RESETLOGIC" && flags.overworldshuffle != "N" && doorWindow && !doorWindow.closed) {
        owGraphLogic = swapTowers = swapGanon = dpFrontLogic = trFrontLogic = false;
        resetChestsKeepTrackedData();
        updateLayout();
        updateMapTracker();
      } else if (("" + event.data).startsWith("TOGGLE ")) {
        var item = ("" + event.data).substring(7);
        if (items.hasOwnProperty(item)) {
          click_map();
          toggle(item);
        }
      } else if (event.data.dungeonPaths && event.data.dungeonPaths.length === 13) {
        dungeonData = event.data;
      } else if (event.data == "OPENSETTINGS" && document.getElementById("flagsModal").style.display === "none") {
        changeFlags();
      }
    }
  };

  window.showDoorWindow = function () {
    if (doorWindow && !doorWindow.closed) {
      doorWindow.focus();
    } else {
      var url = "dungeontracker.html?door_shuffle=" + flags.doorshuffle + "&overworld_shuffle=" + flags.overworldshuffle;
      url += "&wild_keys=" + flags.wildkeys + "&wild_big_keys=" + flags.wildbigkeys + "&world_state=" + flags.gametype;
      url += "&entrance_shuffle=" + flags.entrancemode + (dungeonData ? "&request_update=true" : flags.overworldshuffle === "N" ? "" : "&init_sync=true") + "&t=" + Date.now();
      doorWindow = window.open(url, "", "width=444,height=720,titlebar=0,menubar=0,toolbar=0,scrollbars=1,resizable=1");
    }
  };

  window.cloneItems = function () {
    var newItems = Object.assign({}, items);
    newItems.inc = newItems.dec = null;
    newItems.flags = flags;
    newItems.prizes = prizes;
    newItems.medallions = medallions;
    newItems.connectorOne = connectorOne;
    newItems.connectorTwo = connectorTwo;
    return newItems;
  };

  window.resetChestsKeepTrackedData = function () {
    var olddungeons = dungeons;
    var oldagahnim = agahnim;
    var oldchests = chests;
    var oldentrances = flags.entrancemode === "N" ? null : entrances;
    var olddungeonChecks = flags.entrancemode === "N" ? null : dungeonChecks;
    loadChestFlagsItem();

    for (var k = 0; k < dungeons.length; k++) {
      olddungeons[k].is_beatable = dungeons[k].is_beatable;
      olddungeons[k].can_get_chest = dungeons[k].can_get_chest;
    }

    oldagahnim.is_available = agahnim.is_available;

    for (var k = 0; k < chests.length; k++) {
      oldchests[k].is_available = chests[k].is_available;
    }

    dungeons = olddungeons;
    agahnim = oldagahnim;
    chests = oldchests;

    if (flags.entrancemode != "N") {
      for (var k = 0; k < entrances.length; k++) {
        oldentrances[k].is_available = entrances[k].is_available;
      }

      entrances = oldentrances;

      for (var k = 0; k < dungeons.length; k++) {
        olddungeonChecks[k].can_get_chest = dungeonChecks[k].can_get_chest;
      }

      dungeonChecks = olddungeonChecks;
    }
  };

  // event of clicking on a boss's pendant/crystal subsquare
  window.toggle_dungeon = function (n) {
    var maxdungeon = flags.wildmaps ? 6 : 5;
    document.getElementById("dungeonPrize" + n).classList.remove("prize-" + prizes[n]);
    prizes[n] += 1;
    if (prizes[n] === maxdungeon) prizes[n] = 0;
    document.getElementById("dungeonPrize" + n).classList.add("prize-" + prizes[n]);

    updateMapTracker();
  };

  window.set_prize = function (n, value) {
    const currentElement = document.getElementById("dungeonPrize" + n);
    if (currentElement.classList.contains("prize-" + value)) {
      return;
    }
    currentElement.classList.remove("prize-" + prizes[n]);
    prizes[n] = value;
    currentElement.classList.add("prize-" + value);
    updateMapTracker();
  };

  window.rightClickPrize = function (n) {
    var mindungeon = flags.wildmaps ? 5 : 4;
    document.getElementById("dungeonPrize" + n).classList.remove("prize-" + prizes[n]);
    prizes[n] -= 1;
    if (prizes[n] === -1) prizes[n] = mindungeon;

    document.getElementById("dungeonPrize" + n).classList.add("prize-" + prizes[n]);
    updateMapTracker();
  };

  window.collect_prize = function (n) {
    if (document.getElementById("dungeonPrize" + n).classList.contains("collected")) {
      return;
    } else {
      document.getElementById("dungeonPrize" + n).classList.add("collected");
    }
    updateMapTracker();
  };

  window.toggle_prize = function (n) {
    if (document.getElementById("dungeonPrize" + n).classList.contains("collected")) {
      document.getElementById("dungeonPrize" + n).classList.remove("collected");
    } else {
      document.getElementById("dungeonPrize" + n).classList.add("collected");
    }
    updateMapTracker();
  };

  // event of right clicking on a boss's enemizer portrait
  window.rightClickEnemy = function (n) {
    enemizer[n] -= 1;
    if (enemizer[n] === -1) enemizer[n] = flags.wildcompasses ? 11 : 10;
    document.getElementById("dungeonEnemy" + n).className = "enemizer-" + enemizer[n];
    dungeons[n].is_beatable();
    if (!dungeons[n].is_beaten)
      if (document.getElementById("bossMap" + n) != null) {
        document.getElementById("bossMap" + n).className = "bossprize-" + prizes[n] + " boss " + dungeons[n].is_beatable();
      }
    updateLocationAvailability();
  };

  // event of clicking on a boss's enemizer portrait
  window.toggle_enemy = function (n) {
    enemizer[n] += 1;
    if (enemizer[n] === (flags.wildcompasses ? 12 : 11)) enemizer[n] = 0;
    document.getElementById("dungeonEnemy" + n).className = "enemizer-" + enemizer[n];
    dungeons[n].is_beatable();
    if (!dungeons[n].is_beaten)
      if (document.getElementById("bossMap" + n) != null) {
        document.getElementById("bossMap" + n).className = "bossprize-" + prizes[n] + " boss " + dungeons[n].is_beatable();
      }
    updateLocationAvailability();
  };

  window.rightClickChest = function (label, reset=false) {
    //do this when autotracking doors
    if (["Y", "E"].includes(flags.autotracking) && flags.doorshuffle === "C" && !reset) {
      items["chestmanual" + label.substring(5)] = Math.max(items["chestmanual" + label.substring(5)] - 1, 0);
      var curCount = Number(document.getElementById(label).innerHTML.replace("+", ""));
      setChestCount(curCount + Number(items["chestmanual" + label.substring(5)]) + 1, label);
      return;
    }

    var value = reset? items[label] : items.inc(label);

    let className = "chest";
    let innerHTML = "";
    const isLarge = !flags.wildkeys && !flags.wildbigkeys && flags.gametype != "R" && flags.doorshuffle != "C" && label.length === 6 && !flags.showsmallkeys && !flags.showbigkeys;

    if (value === 0) {
      className += "-0";
    } else {
      innerHTML = flags.doorshuffle === "C" && !items["chestknown" + label.substring(5)] ? value - 1 + "+" : value;
    }
    if (isLarge) className += " large";
    document.getElementById(label).className = className;
    document.getElementById(label).innerHTML = innerHTML;

    if (flags.mapmode != "N") {
      let className = "dungeon ";
      var x = label.substring(5);
      if (document.getElementById("dungeon" + x) != null) className += (value ? dungeons[x].can_get_chest() : "opened") + (value && dungeons[x].content ? " scouted" : "");
      document.getElementById("dungeon" + x).className = className;
    }

    updateMapTracker();
  };

  window.setChestCount = function (value, dungeon) {
    value = value - items["chestmanual" + dungeon.substring(5)];
    if (value <= 0) {
      document.getElementById(dungeon).className = "chest-0";
      document.getElementById(dungeon).innerHTML = "";
    } else {
      document.getElementById(dungeon).className = "chest";
      document.getElementById(dungeon).innerHTML = value;
    }
  };

  window.setKeyCount = function (value, maxKeys, dungeon) {
    item["maxkey" + dungeon.substring(8)] = maxKeys;
    if (maxKeys - value - items["keymanual" + dungeon.substring(8)] < 0) {
      items["keymanual" + dungeon.substring(8)] = maxKeys - value;
    }
    value = value + items["keymanual" + dungeon.substring(8)];
    document.getElementById(dungeon).innerHTML = value;
    document.getElementById(dungeon).style.color = value >= maxKeys ? "green" : "white";
  };

  window.rightClickKey = function (label) {
    //do this if autotracking doors
    if (["Y", "E"].includes(flags.autotracking) && flags.doorshuffle === "C") {
      items["keymanual" + label.substring(8)] = Math.max(items["keymanual" + label.substring(8)] - 1, 0);
      setKeyCount(Number(document.getElementById(label).innerHTML) - Number(items["keymanual" + label.substring(8)]) - 1, items["maxkey" + label.substring(8)], label);
      return;
    }

    if (label.substring(0, 12) === "smallkeyhalf" || label.substring(0, 8) === "smallkey") {
      if (flags.gametype != "R") {
        var value = items.dec(label);
      } else {
        var value = items.inc(label);
      }
      document.getElementById(label).style.color = value === items.range[label].max ? "green" : "white";
      document.getElementById(label).innerHTML = value;
    }
    updateMapTracker();
  };

  window.clickCompass = function (dungeonid) {
    items["chestknown" + dungeonid] = !items["chestknown" + dungeonid];
    document.getElementById("chest" + dungeonid).innerHTML = items["chest" + dungeonid] == 0 ? "" : flags.doorshuffle === "C" && !items["chestknown" + dungeonid] ? items["chest" + dungeonid] - 1 + "+" : items["chest" + dungeonid];
    updateMapTracker();
  };

  window.toggle_bomb_floor = function () {
    if (rightClickedLocation != -1) {
      var name = "TT Bomb Floor";
      if (rightClickedType === "chest") {
        if (!chests[rightClickedLocation].content) chests[rightClickedLocation].content = name;
        else chests[rightClickedLocation].content += ", " + name;
        document.getElementById("caption").innerHTML = caption_to_html(name + " placed at " + chests[rightClickedLocation].caption);
        document.getElementById("locationMap" + rightClickedLocation).classList.remove("rightclick");
      }
      if (rightClickedType === "dungeon") {
        if (!dungeons[rightClickedLocation].content) dungeons[rightClickedLocation].content = name;
        else dungeons[rightClickedLocation].content += ", " + name;
        document.getElementById("caption").innerHTML = caption_to_html(name + " placed in " + dungeons[rightClickedLocation].caption);
        document.getElementById("dungeon" + rightClickedLocation).classList.remove("rightclick");
      }
      rightClickedLocation = -1;
      return;
    }

    items.bombfloor = !items.bombfloor;

    document.getElementById("bombfloor").className = "bombfloor-" + (items.bombfloor ? 1 : 0);

    updateMapTracker();
  };

  window.click_map = function () {
    if (rightClickedLocation != -1) {
      if (rightClickedType === "chest") document.getElementById("locationMap" + rightClickedLocation).classList.remove("rightclick");
      if (rightClickedType === "dungeon") document.getElementById("dungeon" + rightClickedLocation).classList.remove("rightclick");
      rightClickedLocation = -1;
    }
  };

  window.rightClickLocation = function (n) {
    if (rightClickedLocation === -1) {
      rightClickedLocation = n;
      rightClickedType = "chest";
      document.getElementById("locationMap" + n).classList.add("rightclick");
      document.getElementById("caption").innerHTML = caption_to_html("Select an item to place at " + chests[rightClickedLocation].caption);
    } else if (rightClickedType === "chest" && rightClickedLocation === n) {
      chests[n].content = "";
      document.getElementById("caption").innerHTML = caption_to_html("Content of " + chests[rightClickedLocation].caption + " cleared");
      document.getElementById("locationMap" + n).classList.remove("rightclick");
      rightClickedLocation = -1;
    } else {
      if (rightClickedType === "chest") document.getElementById("locationMap" + rightClickedLocation).classList.remove("rightclick");
      if (rightClickedType === "dungeon") document.getElementById("dungeon" + rightClickedLocation).classList.remove("rightclick");
      document.getElementById("locationMap" + n).classList.add("rightclick");
      rightClickedLocation = n;
      rightClickedType = "chest";
      document.getElementById("caption").innerHTML = caption_to_html("Select an item to place at " + chests[rightClickedLocation].caption);
    }
  };

  window.rightClickDungeon = function (n) {
    if (rightClickedLocation === -1) {
      rightClickedLocation = n;
      rightClickedType = "dungeon";
      document.getElementById("dungeon" + n).classList.add("rightclick");
      document.getElementById("caption").innerHTML = caption_to_html("Select an item to place in " + dungeons[rightClickedLocation].caption);
    } else if (rightClickedType === "dungeon" && rightClickedLocation === n) {
      dungeons[n].content = "";
      document.getElementById("caption").innerHTML = caption_to_html("Content of " + dungeons[rightClickedLocation].caption + " cleared");
      document.getElementById("dungeon" + n).classList.remove("rightclick");
      rightClickedLocation = -1;
    } else {
      if (rightClickedType === "chest") {
        document.getElementById("locationMap" + rightClickedLocation).classList.remove("rightclick");
      }
      if (rightClickedType === "dungeon") {
        document.getElementById("dungeon" + rightClickedLocation).classList.remove("rightclick");
      }
      document.getElementById("dungeon" + n).classList.add("rightclick");
      rightClickedLocation = n;
      rightClickedType = "dungeon";
      document.getElementById("caption").innerHTML = caption_to_html("Select an item to place in " + dungeons[rightClickedLocation].caption);
    }
  };

  window.rightClickEntrance = function (n) {
    $("#entranceModal").show();
    document.getElementById("entranceID").value = n;
    document.getElementById("entranceModalTitle").innerHTML = entrances[n].caption.replace(/\s?\{[^}]+\}/g, "");
    document.getElementById("entranceModalNote").value = entrances[n].note;
    document.getElementById("entranceRemindMe").checked = entrances[n].remind_me;
    document.getElementById("ConnectorListSpan").innerHTML = "";
    var entrancecount = 0;
    if (entrances[n].is_connector) {
      for (var i = 0; i < connectorIndex.length; i++) {
        if ((connectorOne[i] === n || connectorTwo[i] === n) && entrancecount < 3) {
          var spantemplate = document.getElementById("connectTemplateSpan");
          var spanclone = spantemplate.cloneNode(true);
          spanclone.id = "disconnectEntrance" + connectorIndex[i];
          spanclone.setAttribute("onClick", "entranceDisconnect(" + connectorIndex[i] + "," + n + ");");
          spanclone.style.visibility = "visible";
          if (connectorOne[i] === n) {
            spanclone.innerHTML = entrances[connectorTwo[i]].caption + '&nbsp;&nbsp;&nbsp;<img style="height: 15px;"src="./images/interface/cancel.png" />&nbsp;&nbsp;&nbsp;';
          } else {
            spanclone.innerHTML = entrances[connectorOne[i]].caption + '&nbsp;&nbsp;&nbsp;<img style="height: 15px;"src="./images/interface/cancel.png" />&nbsp;&nbsp;&nbsp;';
          }

          var spanlist = document.getElementById("ConnectorListSpan");
          spanlist.appendChild(spanclone);
          entrancecount++;
        }
      }
    }

    if (entrancecount > 2) {
      document.getElementById("addConnectorSpan").style.visibility = "collapse";
    } else {
      document.getElementById("addConnectorSpan").style.visibility = "visible";
    }

    document.getElementById("entranceModalNote").focus();
    const curStyle = window.getComputedStyle(document.documentElement);

    for (const [key, value] of Object.entries(window.customColours)) {
      for (const v of value) {
        document.getElementById(v).style.backgroundColor = curStyle.getPropertyValue(key);
        document.getElementById(v).style.color = rgbToTextColour(curStyle.getPropertyValue(key));
      }
    }

    if (entrances[n].known_location != "") {
      document.getElementById(entrances[n].known_location).style.borderColor = curStyle.getPropertyValue("--available-color");
    }
  };

  window.middleClickEntrance = function (n) {
    if (connectStart) {
      connectFinish = true;
    } else {
      connectStart = true;
      connectFinish = false;
      document.getElementById("entranceID").value = n; // Because we store the entrance ID in the modal for some reason
    }
    toggle_location(n);
  };

  window.checkReturn = function (n) {
    if (n.keyCode == 13) {
      hideEntranceModal();
    }
  };

  window.hideEntranceModal = function () {
    if (overrideEntranceCloseFlag === false && document.getElementById("entranceModal").style.display != "none") {
      entrances[document.getElementById("entranceID").value].remind_me = document.getElementById("entranceRemindMe").checked;
      entrances[document.getElementById("entranceID").value].note = document.getElementById("entranceModalNote").value;

      if (document.getElementById("entranceModalNote").value === "") {
        //Remove the note icon if it exists
        var divtoremove = document.getElementById("notediv" + document.getElementById("entranceID").value);
        if (divtoremove != null) {
          divtoremove.remove();
        }
      } else {
        //Add the note icon
        var divtoadd = document.createElement("div");
        divtoadd.id = "notediv" + document.getElementById("entranceID").value;
        var loc = document.getElementById("entranceMap" + document.getElementById("entranceID").value);

        var topOffset = 0;
        var leftOffset = 0;
        if (flags.mapmode === "C") {
          leftOffset = loc.parentElement.id === "mapEntranceDiv_dark" ? 221 : 0;
          topOffset += flags.spheresmode === "Y" ? 296 : 0;
        } else if (flags.mapmode === "M") {
          leftOffset = loc.parentElement.id === "mapEntranceDiv_dark" ? 442 : 0;
        } else if (flags.mapmode === "V") {
          leftOffset = loc.parentElement.id === "mapEntranceDiv_dark" ? -5 : 0;
          topOffset += loc.parentElement.id === "mapEntranceDiv_dark" ? 434 : 0;
        }

        divtoadd.style.left = loc.offsetLeft + 10 + leftOffset;
        divtoadd.style.top = loc.offsetTop - 10 + topOffset;

        divtoadd.className = "notediv";

        divtoadd.style.width = 10;
        divtoadd.style.height = 10;
        divtoadd.style.position = "absolute";

        divtoadd.innerHTML = "!";

        document.getElementById("informationDiv").appendChild(divtoadd);
      }
      $("#entranceModal").hide();
    }

    overrideEntranceCloseFlag = false;
    updateMapTracker();
  };

  window.overrideEntranceClose = function () {
    overrideEntranceCloseFlag = true;
  };

  window.entranceConnect = function (n) {
    prepareToConnect = true;
    $("#entranceModal").hide();
  };

  window.entranceDisconnect = function (n, l) {
    for (var i = 0; i < connectorIndex.length; i++) {
      var c1 = connectorOne[i];
      var c2 = connectorTwo[i];
      var c1count = 0;
      var c2count = 0;
      if (connectorIndex[i] === n) {
        connectorIndex.splice(i, 1);
        connectorOne.splice(i, 1);
        connectorTwo.splice(i, 1);
        for (var j = 0; j < connectorOne.length; j++) {
          if (connectorOne[j] === c1 || connectorTwo[j] === c1) {
            c1count++;
          }
          if (connectorOne[j] === c2 || connectorTwo[j] === c2) {
            c2count++;
          }

          if (c1count > 0 && c2count > 0) {
            j = 999;
          }
        }

        if (c1count === 0) {
          entrances[c1].is_connector = false;
        }
        if (c2count === 0) {
          entrances[c2].is_connector = false;
        }

        i = 999;
      }
    }

    var divtoremove = document.getElementById("connectordiv" + n);
    divtoremove.remove();
    updateMapTracker();

    hideEntranceModal();
  };

  window.StopAConnector = function () {
    document.getElementById("connectorStop").style.visibility = "hidden";
    connectStart = false;
    connectFinish = false;
  };

  window.StartAConnectorModal = function () {
    document.getElementById("connectorStop").style.visibility = "visible";
    connectStart = true;
    connectFinish = true;
    $("#entranceModal").hide();
  };

  window.HideConnectors = function () {
    if (document.getElementById("connectorLineDiv").style.visibility === "collapse") {
      document.getElementById("connectorLineDiv").style.visibility = "visible";
      document.getElementById("hideConnectorLinesImg").src = "./images/interface/hide.png";
    } else {
      document.getElementById("connectorLineDiv").style.visibility = "collapse";
      document.getElementById("hideConnectorLinesImg").src = "./images/interface/show.png";
    }
  };

  window.LoadEntranceSummary = function (index = -1) {
    $("#summaryModal").show();

    for (var i = 0; i < 2; i++) {
      if (index < 0 || i === index) {
        var includeCleared = document.getElementById("summaryCleared" + i).checked;

        switch (document.getElementById("summaryFilter" + i).value) {
          case "knownconnectors":
            var entrancesummary = "";

            for (var j = 0; j < connectorIndex.length; j++) {
              if (includeCleared || !entrances[connectorOne[j]].is_opened || !entrances[connectorTwo[j]].is_opened) {
                entrancesummary += "<div>" + entrances[connectorOne[j]].caption + " <--> " + entrances[connectorTwo[j]].caption + "</div>";
              }
            }

            document.getElementById("summaryDiv" + i).innerHTML = entrancesummary.replace(/\s?\{[^}]+\}/g, "");
            break;
          default:
            var locations = [];
            var locationsummary = "";
            var lastGroup = "";

            for (var j = 0; j < entrances.length; j++) {
              if ((entrances[j].known_location != "" || entrances[j].note != "") && (includeCleared || !entrances[j].is_opened)) {
                switch (document.getElementById("summaryFilter" + i).value) {
                  case "all":
                    pushLocationObject(locations, entrances[j]);
                    break;
                  case "dungeons":
                    if (isDungeon(entrances[j].known_location)) {
                      pushLocationObject(locations, entrances[j]);
                    }
                    break;
                  case "starts":
                    if (entranceNameToGroup[entrances[j].known_location] === "start") {
                      pushLocationObject(locations, entrances[j]);
                    }
                    break;
                  case "keylocations":
                    if (entranceNameToGroup[entrances[j].known_location].endsWith("key")) {
                      pushLocationObject(locations, entrances[j]);
                    }
                    break;
                  case "shopschests":
                    if (entrances[j].known_location === "magic" || entrances[j].known_location === "bomb" || entrances[j].known_location === "shop" || entrances[j].known_location === "chest") {
                      pushLocationObject(locations, entrances[j]);
                    }
                    break;
                  case "unknownconnectors":
                    if (entrances[j].known_location === "dark" || entrances[j].known_location === "connector") {
                      pushLocationObject(locations, entrances[j]);
                    }
                    break;
                  case "notes":
                    if (entrances[j].note != "") {
                      pushLocationObject(locations, entrances[j]);
                    }
                }
              }
            }

            locations.sort((a, b) => a.index - b.index);

            for (var j = 0; j < locations.length; j++) {
              locationsummary +=
                (lastGroup != "" && lastGroup != locations[j].group ? '<div class="separatortop">' : "<div>") +
                locations[j].friendly +
                ": " +
                locations[j].location +
                (locations[j].note == "" ? "" : " [" + locations[j].note + "]") +
                "</div>";
              lastGroup = locations[j].group;
            }

            document.getElementById("summaryDiv" + i).innerHTML = locationsummary.replace(/\s?\{[^}]+\}/g, "");
            document.getElementById("summaryDiv" + i).scrollTop = 0;
        }
      }
    }
  };

  window.pushLocationObject = function (locations, entrance) {
    locations.push({ index: entranceNameToIndex[entrance.known_location], friendly: getFriendlyName(entrance.known_location), group: entranceNameToGroup[entrance.known_location], location: entrance.caption, note: entrance.note });
  };

  window.hideSummaryModal = function () {
    $("#summaryModal").hide();
  };

  window.tagEntrance = function (n, t) {
    const curStyle = window.getComputedStyle(document.documentElement);

    for (const [tag, index] of Object.entries(entranceNameToIndex)) {
      if (tag.length > 0) document.getElementById(tag).style.backgroundColor = "#000";
    }

    let entranceID = document.getElementById("entranceID").value;
    if (entrances[entranceID].known_location === n) {
      entrances[entranceID].known_location = "";
      entrances[entranceID].remind_me = false;
      document.getElementById(n).style.borderColor = curStyle.getPropertyValue("#ffffff");
      entrances[entranceID].type = 0;
      var information = document.getElementById("informationdiv" + entranceID);
      if (information != null) {
        information.remove();
      }
    } else {
      entrances[entranceID].known_location = n;
      entrances[entranceID].type = t === true ? 2 : 3;
      document.getElementById(n).style.borderColor = curStyle.getPropertyValue("--available-color");
      entrances[entranceID].remind_me = document.getElementById("entranceRemindMe").checked;

      if (document.getElementById("informationdiv" + entranceID) != null) {
        document.getElementById("informationdiv" + entranceID).innerHTML = n.replace("_", "-").toUpperCase();
      } else {
        var divtoadd = document.createElement("div");
        divtoadd.id = "informationdiv" + entranceID;
        var loc = document.getElementById("entranceMap" + entranceID);

        var topOffset = 0;
        if (loc.offsetTop < 20) {
          topOffset = loc.offsetTop + 10;
        } else {
          topOffset = loc.offsetTop - 11;
        }

        var leftOffset = 0;
        if (flags.mapmode === "C") {
          leftOffset = loc.parentElement.id === "mapEntranceDiv_dark" ? 221 : 0;
          leftOffset += 1;
          topOffset += flags.spheresmode === "Y" ? 296 : 0;
        } else if (flags.mapmode === "M") {
          leftOffset = loc.parentElement.id === "mapEntranceDiv_dark" ? 442 : 0;
        } else if (flags.mapmode === "V") {
          leftOffset = loc.parentElement.id === "mapEntranceDiv_dark" ? -5 : 0;
          topOffset += loc.parentElement.id === "mapEntranceDiv_dark" ? 434 : 0;
        }

        divtoadd.style.left = loc.offsetLeft - 5.5 + leftOffset;
        divtoadd.style.top = topOffset;
        divtoadd.className = "informationdiv";

        divtoadd.style.width = 20;
        divtoadd.style.height = 10;
        divtoadd.style.position = "absolute";

        divtoadd.innerHTML = n.replace("_", "-").toUpperCase();

        // Only add text box for certain location tags
        if (n != "connector" && n != "item" && n != "dark" && n != "sanc" && n != "link" && n != "mount") {
          document.getElementById("informationDiv").appendChild(divtoadd);
        }
      }
    }

    hideEntranceModal();
  };

  // event of clicking on Mire/TRock's medallion subsquare
  window.toggle_medallion = function (n) {
    medallions[n] += 1;
    if (medallions[n] === 4) medallions[n] = 0;

    document.getElementById("medallion" + n).className = "medallion-" + medallions[n];

    if (flags.mapmode != "N") {
      // Change the mouseover text on the map
      dungeons[8 + n].caption = dungeons[8 + n].caption.replace(/\{medallion\d+\}/, "{medallion" + medallions[n] + "}");
      updateMapTracker();
    }
  };

  window.rightClickBottle = function (n) {
    var curValue = items["bottle" + n];
    var value = items.dec("bottle" + n);

    var el = document.getElementById("bottle" + n);

    if (value === items.range["bottle" + n].min) {
      el.className = el.className.replace("active-" + curValue, "");
      if (window.bottlesObtained[n - 1] == true) {
        window.bottlesObtained[n - 1] = false;
        items.bottle -= 1;
      }
    } else if (value === items.range["bottle" + n].max) {
      el.className = el.className + " active-" + value;
      if (window.bottlesObtained[n - 1] == false) {
        window.bottlesObtained[n - 1] = true;
        items.bottle += 1;
      }
    } else {
      el.className = el.className.replace("active-" + curValue, "active-" + value);
    }
    updateLocationAvailability();
  };

  // event of right clicking on a boss's enemizer portrait
  window.rightClickMedallion = function (n) {
    medallions[n] -= 1;
    if (medallions[n] === -1) medallions[n] = 3;

    document.getElementById("medallion" + n).className = "medallion-" + medallions[n];

    if (flags.mapmode != "N") {
      // Change the mouseover text on the map
      dungeons[8 + n].caption = dungeons[8 + n].caption.replace(/\{medallion\d+\}/, "{medallion" + medallions[n] + "}");
      updateMapTracker();
    }
  };

  // event of clicking on each dungeon's bigkey
  window.toggle_bigkey = function (n) {
    items["bigkey" + n] = !items["bigkey" + n];

    let prefix = "bigkey";
    if (n > 10) {
      prefix += "half";
    }

    if (items["bigkey" + n]) {
      document.getElementById("bigkey" + n).className = "prefix collected";
    } else {
      document.getElementById("bigkey" + n).className = "prefix";
    }

    if (flags.mapmode != "N") {
      // Update availability of dungeon boss AND chests
      dungeons[8 + n].is_beaten = !dungeons[8 + n].is_beaten;
      toggle_boss(8 + n);
      if (items["chest" + (8 + n)] > 0) document.getElementById("dungeon" + (8 + n)).className = "dungeon " + dungeons[8 + n].can_get_chest() + (dungeons[8 + n].can_get_chest() != "opened" && dungeons[8 + n].content ? " scouted" : "");
      // TRock medallion affects Mimic Cave
      if (n === 1) {
        chests[4].is_opened = !chests[4].is_opened;
        toggle_chest(4);
      }
      // Change the mouseover text on the map
      dungeons[8 + n].caption = dungeons[8 + n].caption.replace(/\{medallion\d+\}/, "{medallion" + medallions[n] + "}");
    }
  };

  // Event of clicking a chest on the map
  window.toggle_chest = function (x) {
    chests[x].is_opened = !chests[x].is_opened;
    var highlight = document.getElementById("locationMap" + x).classList.contains("highlight");
    var checkedType = x >= 23 && x <= 63 ? "bonked" : "opened";
    var scouted = chests[x].content;
    document.getElementById("locationMap" + x).className = "location " + (chests[x].is_opened ? checkedType : chests[x].is_available()) + (highlight ? " highlight" : "") + (scouted && !chests[x].is_opened ? " scouted" : "");
    if (!chests[x].is_opened && scouted) {
      document.getElementById("locationMap" + x).classList.add(itemNameToCSSName(chests[x].content));
    }
  };

  // Event of clicking on an entrance on the map
  window.toggle_location = function (x) {
    if (connectStart === false) {
      entrances[x].is_opened = !entrances[x].is_opened;
      var highlight = document.getElementById("entranceMap" + x).classList.contains("highlight");
      document.getElementById("entranceMap" + x).className = "entrance " + (entrances[x].is_opened ? "opened" : entrances[x].is_available()) + (highlight ? " highlight" : "");
      var information = document.getElementById("informationdiv" + x);
      if (information != null) {
        information.style.visibility = entrances[x].is_opened ? "collapse" : "visible";
      }
      // If we are connecting entrances
    } else if (connectFinish === true) {
      if (x != parseInt(document.getElementById("entranceID").value)) {
        entrances[x].is_connector = true;
        entrances[document.getElementById("entranceID").value].is_connector = true;

        connectorIndex.push(connectorid);
        connectorOne.push(parseInt(document.getElementById("entranceID").value));
        connectorTwo.push(x);

        var divtoadd = document.createElement("div");
        divtoadd.id = "connectordiv" + connectorid;
        var connector1 = document.getElementById("entranceMap" + x);
        var connector2 = document.getElementById("entranceMap" + document.getElementById("entranceID").value);

        var c1offsetleft = connector1.offsetLeft + (connector1.parentElement.id === "mapEntranceDiv_dark" && flags.mapmode != "V" ? connector1.parentElement.offsetWidth : 0);
        var c2offsetleft = connector2.offsetLeft + (connector2.parentElement.id === "mapEntranceDiv_dark" && flags.mapmode != "V" ? connector2.parentElement.offsetWidth : 0);

        if (flags.mapmode === "V" && connector1.parentElement.id != connector2.parentElement.id) {
          if (connector2.parentElement.id === "mapEntranceDiv_light") {
            divtoadd.style.top = connector2.offsetTop + 6;
          } else {
            divtoadd.style.top = connector1.offsetTop + 6;
          }

          if (c1offsetleft > c2offsetleft) {
            divtoadd.style.left = c2offsetleft + 4;
          } else {
            divtoadd.style.left = c1offsetleft + 6;
          }

          if (connector2.parentElement.id === "mapEntranceDiv_light") {
            if (c1offsetleft > c2offsetleft) {
              divtoadd.className = "crossedright";
            } else {
              divtoadd.className = "crossedleft";
            }
          } else {
            if (c1offsetleft < c2offsetleft) {
              divtoadd.className = "crossedright";
            } else {
              divtoadd.className = "crossedleft";
            }
          }

          if (connector2.parentElement.id === "mapEntranceDiv_light") {
            divtoadd.style.height = Math.abs(connector1.offsetTop + 434 - connector2.offsetTop);
            divtoadd.style.width = Math.abs(c1offsetleft - c2offsetleft - 2);
          } else {
            divtoadd.style.height = Math.abs(connector2.offsetTop + 434 - connector1.offsetTop);
            divtoadd.style.width = Math.abs(c1offsetleft - c2offsetleft + 2);
          }
        } else {
          if (connector1.offsetTop > connector2.offsetTop) {
            divtoadd.style.top = connector2.offsetTop + (flags.mapmode === "C" ? 4.5 : 6) + (flags.mapmode === "V" && connector1.parentElement.id === "mapEntranceDiv_dark" ? 434 : 0);
          } else {
            divtoadd.style.top = connector1.offsetTop + (flags.mapmode === "C" ? 4.5 : 6) + (flags.mapmode === "V" && connector1.parentElement.id === "mapEntranceDiv_dark" ? 434 : 0);
          }

          if (c1offsetleft > c2offsetleft) {
            divtoadd.style.left = c2offsetleft + (flags.mapmode === "C" ? 4.5 : 6);
          } else {
            divtoadd.style.left = c1offsetleft + (flags.mapmode === "C" ? 4.5 : 6);
          }

          if (c1offsetleft > c2offsetleft) {
            if (connector1.offsetTop > connector2.offsetTop) {
              divtoadd.className = "crossedright";
            } else {
              divtoadd.className = "crossedleft";
            }
          } else {
            if (connector1.offsetTop > connector2.offsetTop) {
              divtoadd.className = "crossedleft";
            } else {
              divtoadd.className = "crossedright";
            }
          }

          divtoadd.style.height = Math.abs(connector1.offsetTop - connector2.offsetTop);
          divtoadd.style.width = Math.abs(c1offsetleft - c2offsetleft);
        }

        divtoadd.style.position = "absolute";

        document.getElementById("connectorLineDiv").appendChild(divtoadd);
        connectorid++;
      } else {
        // Find all conectorIndex values corresponding to connectors involving this entrance
        while (window.connectorOne.indexOf(x) > -1 || window.connectorTwo.indexOf(x) > -1) {
          for (let i = 0; i < connectorIndex.length; i++) {
            if (window.connectorOne[i] === x || window.connectorTwo[i] === x) {
              entranceDisconnect(connectorIndex[i], x);
            }
          }
        }
      }

      document.getElementById("connectorStop").style.visibility = "hidden";
      connectStart = false;
      connectFinish = false;
    } else {
      document.getElementById("entranceID").value = x;
      connectFinish = true;
    }

    updateMapTracker();
  };

  // Event of clicking a dungeon location (not really)
  window.toggle_boss = function (x) {
    dungeons[x].is_beaten = !dungeons[x].is_beaten;
    if (document.getElementById("bossMap" + x) != null) {
      document.getElementById("bossMap" + x).className = "bossprize-" + prizes[x] + " boss " + (dungeons[x].is_beaten ? "opened" : dungeons[x].is_beatable());
      updateMapTracker();
    }
  };
  window.toggle_agahnim = function () {
    if (flags.entrancemode === "N") {
      document.getElementById("castle").className = "castle " + (items.agahnim ? "opened" : agahnim.is_available());
    }
  };

  // Highlights a chest location and shows the caption
  window.highlight = function (x) {
    document.getElementById("locationMap" + x).classList.add("highlight");
    document.getElementById("caption").innerHTML = caption_to_html(chests[x].content ? chests[x].content + " | " + chests[x].caption : chests[x].caption);
    document.getElementById("autotrackingstatus").style.display = "none";
  };
  window.unhighlight = function (x) {
    document.getElementById("locationMap" + x).classList.remove("highlight");
    document.getElementById("caption").innerHTML = "&nbsp;";
    document.getElementById("autotrackingstatus").style.display = "";
  };
  // Highlights a entrance location and shows the caption
  window.highlight_entrance = function (x) {
    document.getElementById("entranceMap" + x).classList.add("highlight");
    var displayCaption = entrances[x].caption;
    if (entrances[x].known_location != "") {
      displayCaption = displayCaption + " -- " + getFriendlyName(entrances[x].known_location);
    }
    if (entrances[x].is_connector) {
      for (var i = 0; i < connectorIndex.length; i++) {
        if (connectorOne[i] === x) {
          displayCaption = displayCaption + " ==> " + entrances[connectorTwo[i]].caption;
        }
        if (connectorTwo[i] === x) {
          displayCaption = displayCaption + " ==> " + entrances[connectorOne[i]].caption;
        }
      }
    }
    if (entrances[x].note != "") {
      displayCaption = displayCaption + " [" + entrances[x].note + "]";
    }
    document.getElementById("caption").innerHTML = caption_to_html(displayCaption);
    document.getElementById("autotrackingstatus").style.display = "none";
  };
  window.unhighlight_entrance = function (x) {
    document.getElementById("entranceMap" + x).classList.remove("highlight");
    document.getElementById("caption").innerHTML = "&nbsp;";
    document.getElementById("autotrackingstatus").style.display = "";
  };
  // Highlights a chest location and shows the caption (but for dungeons)
  window.highlight_dungeon = function (x) {
    document.getElementById("dungeon" + x).classList.add("highlight");
    document.getElementById("caption").innerHTML = caption_to_html((dungeons[x].content ? dungeons[x].content + " | " : "") + (dungeons[x].trashContent ? dungeons[x].trashContent + " | " : "") + dungeons[x].caption);
    document.getElementById("autotrackingstatus").style.display = "none";
  };
  window.unhighlight_dungeon = function (x) {
    document.getElementById("dungeon" + x).classList.remove("highlight");
    document.getElementById("caption").innerHTML = "&nbsp;";
    document.getElementById("autotrackingstatus").style.display = "";
  };
  window.highlight_agahnim = function () {
    document.getElementById("castle").classList.add("highlight");
    document.getElementById("caption").innerHTML = caption_to_html(agahnim.caption);
    document.getElementById("autotrackingstatus").style.display = "none";
  };
  window.unhighlight_agahnim = function () {
    document.getElementById("castle").classList.remove("highlight");
    document.getElementById("caption").innerHTML = "&nbsp;";
    document.getElementById("autotrackingstatus").style.display = "";
  };

  window.getFriendlyName = function (x) {
    return entranceNameToFriendlyName[x];
  };

  window.isDungeon = function (x) {
    return entranceNameToGroup[x].endsWith("dungeon");
  };

  window.isDungeonConnector = function (x) {
    return x != "dp_n" && (x.startsWith("hc") || x.startsWith("dp") || x.startsWith("tr"));
  };
  window.isCastleConnector = function (x) {
    return x.startsWith("hc");
  };
  window.isDesertConnector = function (x) {
    return x != "dp_n" && x.startsWith("dp");
  };
  window.isSkullConnector = function (x) {
    return x != "sw" && x.startsWith("sw");
  };
  window.isTurtleConnector = function (x) {
    return x.startsWith("tr");
  };
  window.isSpawn = function (x) {
    return x == "link" || x == "sanc" || x == "mount";
  };

  window.isDark = function (x) {
    switch (x) {
      case "dark":
        return true;
      default:
        return false;
    }
  };

  window.isShop = function (x) {
    return x === "shop";
  };

  window.requireItem = function (x) {
    switch (x) {
      case "magic":
      case "kid":
      case "smith":
      case "bat":
      case "lib":
      case "saha":
      case "mimc":
      case "dam":
      case "bomb":
      case "bump":
      case "spike":
      case "hook":
        return true;
      default:
        return false;
    }
  };

  window.isUnknownConnector = function (x) {
    switch (x) {
      case "connector":
        return true;
      default:
        return false;
    }
  };

  window.findItems = function (items) {
    if (/*spoilerLoaded && */ flags.mapmode != "N") {
      var results = "";
      for (i in chests) {
        if (chests[i].content) {
          var hasItem = false,
            itemsInLocation = chests[i].content.split(", ");
          for (var j = 0; j < items.length; j++)
            if (itemsInLocation.includes(items[j])) {
              hasItem = true;
              break;
            }
          if (hasItem) {
            if (flags.mapmode != "N") document.getElementById("locationMap" + i).classList.add("findhighlight");
            var locationName = chests[i].caption;
            results = results === "" ? locationName : results + ", " + locationName;
          }
        }
      }
      for (var i = 0; i < dungeons.length; i++) {
        if (dungeons[i].content) {
          var hasItem = false,
            itemsInLocation = dungeons[i].content.split(", ");
          for (var j = 0; j < items.length; j++)
            if (itemsInLocation.includes(items[j])) {
              hasItem = true;
              break;
            }
          if (hasItem) {
            if (flags.mapmode != "N") document.getElementById("dungeon" + i).classList.add("findhighlight");
            var locationName = dungeons[i].caption;
            results = results === "" ? locationName : results + ", " + locationName;
          }
        }
      }
      for (var i = 0; i < dungeonContents.length; i++) {
        var dungeonHasItem = false,
          itemMap = dungeonContents[i];
        for (var locationName in itemMap) {
          var hasItem = false,
            itemName = itemMap[locationName];
          for (var j = 0; j < items.length; j++)
            if (itemName === items[j]) {
              dungeonHasItem = hasItem = true;
              break;
            }
          if (hasItem) {
            results = results === "" ? dungeonNames[i] + " " + locationName : results + ", " + dungeonNames[i] + " " + locationName;
          }
        }
        if (dungeonHasItem) {
          if (flags.mapmode != "N") document.getElementById("dungeon" + i).classList.add("findhighlight");
        }
      }
      if (results !== "") document.getElementById("caption").innerHTML = caption_to_html(results);
    }
  };

  window.unhighlightAll = function () {
    if (flags.mapmode != "N") {
      for (var i = 0; i < chests.length; i++) {
        document.getElementById("locationMap" + i).classList.remove("findhighlight");
      }

      if (flags.entrancemode != "N") {
        for (var i = 0; i < entrances.length; i++) {
          document.getElementById("entranceMap" + i).classList.remove("findhighlight");
        }
      } else {
        for (var i = 0; i < dungeons.length; i++) {
          document.getElementById("dungeon" + i).classList.remove("findhighlight");
        }
      }
    }

    document.getElementById("caption").innerHTML = "&nbsp;";
  };

  window.showNiceItems = function (x) {
    if (flags.mapmode != "N") {
      if (spoilerLoaded) {
        document.getElementById("caption").innerHTML = caption_to_html(dungeons[x].niceContent);
      }
    }
  };

  window.clearCaption = function () {
    document.getElementById("caption").innerHTML = "&nbsp;";
  };

  window.setSphereItem = function (label) {
    if (lastItem === null) {
      document.getElementById(label).className = "sphere noitem";
    } else {
      if (lastItem.substring(0, 5) === "sword" || lastItem.substring(0, 5) === "shiel" || lastItem.substring(0, 5) === "moonp") {
        document.getElementById(label).className = "sphere sphere" + lastItem;
      } else document.getElementById(label).className = "sphere " + lastItem;
    }
    lastItem = null;
  };

  function caption_to_html(caption) {
    return caption.replace(/\{(\w+?)(\d+)?\}/g, function (__, name, n) {
      var dash = /medallion|pendant/.test(name);
      return '<div class="icon ' + (dash ? name + "-" + n : n ? name + " active-" + n : name) + '"></div>';
    });
  }

  window.crystalGoal = function () {
    if (flags.opentower === "R" || flags.unknown === "M") {
      document.getElementById("crystalsselectdiv").style.visibility = "inherit";
    }
  };

  window.ganonGoal = function () {
    if ((flags.ganonvuln === "R" && (flags.goals === "G" || flags.goals === "F")) || flags.unknown === "M") {
      document.getElementById("ganonselectdiv").style.visibility = "inherit";
    }
  };

  window.setCrystalGoal = function (x) {
    document.getElementById("crystalsdiv").classList.remove("crystals");
    document.getElementById("crystalsdiv").classList.remove("crystals0");
    document.getElementById("crystalsdiv").classList.remove("crystals1");
    document.getElementById("crystalsdiv").classList.remove("crystals2");
    document.getElementById("crystalsdiv").classList.remove("crystals3");
    document.getElementById("crystalsdiv").classList.remove("crystals4");
    document.getElementById("crystalsdiv").classList.remove("crystals5");
    document.getElementById("crystalsdiv").classList.remove("crystals6");
    document.getElementById("crystalsdiv").classList.remove("crystals7");
    document.getElementById("crystalsdiv").classList.add("crystals" + x);
    document.getElementById("crystalsselectdiv").style.visibility = "collapse";
    flags.opentowercount = x === "" ? 8 : x;
    updateMapTracker();
  };

  window.setGanonGoal = function (x) {
    document.getElementById("ganondiv").classList.remove("ganon");
    document.getElementById("ganondiv").classList.remove("ganon0");
    document.getElementById("ganondiv").classList.remove("ganon1");
    document.getElementById("ganondiv").classList.remove("ganon2");
    document.getElementById("ganondiv").classList.remove("ganon3");
    document.getElementById("ganondiv").classList.remove("ganon4");
    document.getElementById("ganondiv").classList.remove("ganon5");
    document.getElementById("ganondiv").classList.remove("ganon6");
    document.getElementById("ganondiv").classList.remove("ganon7");
    document.getElementById("ganondiv").classList.add("ganon" + x);
    document.getElementById("ganonselectdiv").style.visibility = "collapse";
    flags.ganonvulncount = x === "" ? 8 : x;
    updateMapTracker();
  };

  window.updateMapTracker = function () {
    click_map();
    items.moonpearl = !items.moonpearl;
    toggle("moonpearl");
  };

  window.changeFlags = function () {
    //Set flags
    document.getElementById("stateselect").value = flags.gametype;
    document.getElementById("entranceselect").value = flags.entrancemode;
    document.getElementById("bossselect").value = flags.bossshuffle;
    document.getElementById("enemyselect").value = flags.enemyshuffle;
    document.getElementById("shuffledmaps").checked = flags.wildmaps ? true : false;
    document.getElementById("shuffledcompasses").checked = flags.wildcompasses ? true : false;
    document.getElementById("shuffledkeys").checked = flags.wildkeys ? true : false;
    document.getElementById("shuffledbigkeys").checked = flags.wildbigkeys ? true : false;
    document.getElementById("goalselect").value = flags.goals;
    document.getElementById("swordselect").value = flags.swordmode;
    document.getElementById("activatedflute").checked = flags.activatedflute ? true : false;
    document.getElementById("bonkshuffle").checked = flags.bonkshuffle === "Y" ? true : false;
    document.getElementById("doorselect").value = flags.doorshuffle;
    document.getElementById("overworldbox").checked = flags.overworldshuffle != "N";
    document.getElementById("shopsanitybox").checked = flags.shopsanity != "N";
    document.getElementById("pseudobootsbox").checked = flags.pseudoboots != "N" ? true : false;
    document.getElementById("mirrorscrollbox").checked = flags.mirrorscroll != "N" ? true : false;

    openMainSettings();
    $("#flagsModal").show();
  };

  window.openMainSettings = function () {
    document.getElementById("flagsmaintab").classList.add("active");
    document.getElementById("flagsextratab").classList.remove("active");
    document.getElementById("flagsmain").style.display = "";
    document.getElementById("flagsextra").style.display = "none";
  };

  window.openExtraSettings = function () {
    document.getElementById("flagsmaintab").classList.remove("active");
    document.getElementById("flagsextratab").classList.add("active");
    document.getElementById("flagsmain").style.display = "none";
    document.getElementById("flagsextra").style.display = "";
  };

  window.closeFlagsModal = function () {
    $("#flagsModal").hide();
  };

  window.updateMysteryPointTotal = function () {
    var worldstate = 0;
    switch (document.getElementById("stateselect").value) {
      case "O":
      case "S":
        worldstate = 0;
        break;
      case "I":
      case "R":
        worldstate = 20;
        break;
    }

    var goal = 0;
    switch (document.getElementById("goalselect").value) {
      case "G":
      case "F":
        goal = 0;
        break;
      case "A":
      case "P":
        goal = 10;
        break;
      case "O":
        goal = 20;
        break;
    }

    var swords = 0;
    switch (document.getElementById("swordselect").value) {
      case "R":
      case "A":
        swords = 0;
        break;
      case "V":
        swords = 10;
        break;
      case "S":
        swords = 20;
        break;
    }

    var itempool = 0;
    switch (document.getElementById("itempoolselect").value) {
      case "N":
        itempool = 0;
        break;
      case "H":
        itempool = 20;
        break;
      case "E":
        itempool = 30;
        break;
    }

    var accessibility = 0;
    switch (document.getElementById("accessibilityselect").value) {
      case "100":
        accessibility = 0;
        break;
      case "B":
        accessibility = 10;
        break;
    }

    var opentower = 0;
    switch (flags.opentowercount) {
      case 0:
      case 1:
        opentower = 20;
        break;
      case 2:
      case 3:
      case 4:
        opentower = 10;
        break;
      default:
        opentower = 0;
        break;
    }

    var ganonvuln = 0;
    switch (flags.ganonvulncount) {
      case 3:
      case 4:
        ganonvuln = 10;
        break;
      default:
        ganonvuln = 0;
        break;
    }

    var hints = 0;
    switch (document.getElementById("hintselect").value) {
      case "Y":
        hints = 10;
        break;
      case "N":
        hints = 0;
        break;
    }

    var bossshuffle = 0;
    switch (document.getElementById("bossselect").value) {
      case "N":
        bossshuffle = 0;
        break;
      case "S":
        bossshuffle = 20;
        break;
      case "R":
        bossshuffle = 30;
        break;
    }

    var enemyshuffle = 0;
    switch (document.getElementById("enemyselect").value) {
      case "N":
        enemyshuffle = 0;
        break;
      case "S":
        enemyshuffle = 20;
        break;
    }

    var enemydamage = 0;
    switch (document.getElementById("enemydamageselect").value) {
      case "N":
        enemydamage = 0;
        break;
      case "S":
        enemydamage = 30;
        break;
    }

    var enemyhealth = 0;
    switch (document.getElementById("enemyhealthselect").value) {
      case "N":
        enemyhealth = 0;
        break;
      case "E":
        enemyhealth = 20;
        break;
      case "H":
        enemyhealth = 30;
        break;
    }

    var dungeonitems = 0;
    dungeonitems += document.getElementById("shuffledmaps").checked ? 10 : 0;
    dungeonitems += document.getElementById("shuffledcompasses").checked ? 10 : 0;
    dungeonitems += document.getElementById("shuffledkeys").checked ? 10 : 0;
    dungeonitems += document.getElementById("shuffledbigkeys").checked ? 10 : 0;

    var startingitems = 0;
    startingitems += document.getElementById("starthookshot").checked ? 20 : 0;
    startingitems += document.getElementById("startfirerod").checked ? 20 : 0;
    startingitems += document.getElementById("starticerod").checked ? 20 : 0;
    startingitems += document.getElementById("startflippers").checked ? 20 : 0;
    startingitems += document.getElementById("startflute").checked ? 20 : 0;
    startingitems += document.getElementById("startmirror").checked ? 20 : 0;
    startingitems += document.getElementById("startboots").checked ? 0 : 20;

    document.getElementById("mysterypointtotal").innerHTML = worldstate + goal + swords + itempool + accessibility + opentower + ganonvuln + hints + bossshuffle + enemyshuffle + enemydamage + enemyhealth + dungeonitems + startingitems;
  };

  window.adjustFlags = function () {
    //Clean up states and variables before we start
    click_map();
    overrideEntranceCloseFlag = false;
    if (flags.entrancemode != "N") {
      hideEntranceModal();
      hideSummaryModal();
      StopAConnector();
    }

    var adjustForRetro = false;
    var resetChestFlags = false;
    var resetLogic = false;

    //World State
    if (document.getElementById("stateselect").value != flags.gametype) {
      if (document.getElementById("stateselect").value === "R" || flags.gametype === "R") {
        adjustForRetro = true;
      }

      if (document.getElementById("stateselect").value === "I" || flags.gametype === "I") {
        resetChestFlags = true;
      }

      flags.gametype = document.getElementById("stateselect").value;
    }

    //Boss Shuffle
    if (document.getElementById("bossselect").value != flags.bossshuffle) {
      flags.bossshuffle = document.getElementById("bossselect").value;

      let visibility = flags.bossshuffle === "N" ? "hidden" : "inherit";

      for (var i = 0; i < 10; i++) {
        document.getElementById("dungeonEnemy" + i).style.visibility = visibility;
      }

      for (var k = 0; k < dungeons.length; k++) {
        let n = flags.bossshuffle === "N" ? k + 1 : 0;
        enemizer[k] = n;
        if (k < 10) {
          document.getElementById("dungeonEnemy" + k).className = "enemizer-" + n;
        }
      }
    }

    //Enemy Shuffle
    if (document.getElementById("enemyselect").value != flags.enemyshuffle) {
      flags.enemyshuffle = document.getElementById("enemyselect").value;
    }

    //Dungeon Items and Doors
    if (
      document.getElementById("shuffledmaps").checked != flags.wildmaps ||
      document.getElementById("shuffledcompasses").checked != flags.wildcompasses ||
      document.getElementById("shuffledkeys").checked != flags.wildkeys ||
      document.getElementById("shuffledbigkeys").checked != flags.wildbigkeys ||
      document.getElementById("doorselect").value != flags.doorshuffle ||
      adjustForRetro
    ) {
      var adjustForCrossed = (document.getElementById("doorselect").value === "C") != (flags.doorshuffle === "C");

      // Store how many chests have been checked
      var chestsChecked = [];
      for (var k = 0; k < 13; k++) {
        chestsChecked[k] = adjustForCrossed ? 0 : items["maxchest" + k] - items["chest" + k];
      }

      // Create new flags object
      var newFlags = {
        gametype: document.getElementById("stateselect").value,
        doorshuffle: document.getElementById("doorselect").value,
        wildmaps: document.getElementById("shuffledmaps").checked,
        wildcompasses: document.getElementById("shuffledcompasses").checked,
        wildkeys: document.getElementById("shuffledkeys").checked,
        wildbigkeys: document.getElementById("shuffledbigkeys").checked,
        prizeshuffle: flags.prizeshuffle
      };

      // Calculate new chest counts using the shared function
      var { chestCounts, keyCounts } = window.calculateDungeonCounts(newFlags);

      // Apply the new counts - preserve number of items already collected
      for (var k = 0; k < 13; k++) {
        var newMaxCount = chestCounts[k];
        var newCurrentCount = newMaxCount - chestsChecked[k];
        
        // Ensure current count doesn't go below 0 - shouldn't ever happen, but just in case
        newCurrentCount = newCurrentCount < 0 ? 0 : newCurrentCount;
        
        // Update the items object
        items["maxchest" + k] = newMaxCount;
        items["chest" + k] = newCurrentCount;

        items["chestknown" + k] = !adjustForCrossed;

        items.range["chest" + k] = { min: 0, max: chestCounts[k] };
        items.range["smallkey" + k] = { min: 0, max: keyCounts[k] };
      }


      items.inc = limit(1, items.range);
      items.dec = limit(-1, items.range);

      flags.doorshuffle = document.getElementById("doorselect").value;
      flags.wildmaps = document.getElementById("shuffledmaps").checked;
      flags.wildcompasses = document.getElementById("shuffledcompasses").checked;
      flags.wildkeys = document.getElementById("shuffledkeys").checked;
      flags.wildbigkeys = document.getElementById("shuffledbigkeys").checked;

      for (var k = 0; k < 13; k++) {
        rightClickChest("chest" + k, true);
      }

      if (!document.getElementById("shuffledmaps").checked) {
        for (var k = 0; k < 10; k++) {
          if (prizes[k] == 5) {
            prizes[k] = 0;
            document.getElementById("dungeonPrize" + k).classList = ["prize-0"];
          }
        }
      }

      if (!document.getElementById("shuffledcompasses").checked) {
        for (var k = 0; k < 10; k++) {
          if (enemizer[k] == 11) {
            enemizer[k] = 0;
            document.getElementById("dungeonEnemy" + k).className = "enemizer-0";
          }
        }
      }

      if (!document.getElementById("shuffledbigkeys").checked) {
        if (!items.bigkey0) toggle("bigkey0");
        if (!items.bigkey1) toggle("bigkey1");
        if (!items.bigkey2) toggle("bigkey2");
        if (!items.bigkey3) toggle("bigkey3");
        if (!items.bigkey4) toggle("bigkey4");
        if (!items.bigkey5) toggle("bigkey5");
        if (!items.bigkey6) toggle("bigkey6");
        if (!items.bigkey7) toggle("bigkey7");
        if (!items.bigkey8) toggle("bigkey8");
        if (!items.bigkey9) toggle("bigkey9");
        if (!items.bigkey10) toggle("bigkey10");
        if (!items.bigkey11) toggle("bigkey11");
        if (!items.bigkey12) toggle("bigkey12");
        document.getElementById("bigkey0").style.visibility = "hidden";
        document.getElementById("bigkey1").style.visibility = "hidden";
        document.getElementById("bigkey2").style.visibility = "hidden";
        document.getElementById("bigkey3").style.visibility = "hidden";
        document.getElementById("bigkey4").style.visibility = "hidden";
        document.getElementById("bigkey5").style.visibility = "hidden";
        document.getElementById("bigkey6").style.visibility = "hidden";
        document.getElementById("bigkey7").style.visibility = "hidden";
        document.getElementById("bigkey8").style.visibility = "hidden";
        document.getElementById("bigkey9").style.visibility = "hidden";
        document.getElementById("bigkey10").style.visibility = "hidden";
        document.getElementById("bigkey11").style.visibility = "hidden";
        document.getElementById("bigkey12").style.visibility = "hidden";
      } else if (document.getElementById("shuffledbigkeys").checked != flags.wildbigkeys) {
        if (items.bigkey0) toggle("bigkey0");
        if (items.bigkey1) toggle("bigkey1");
        if (items.bigkey2) toggle("bigkey2");
        if (items.bigkey3) toggle("bigkey3");
        if (items.bigkey4) toggle("bigkey4");
        if (items.bigkey5) toggle("bigkey5");
        if (items.bigkey6) toggle("bigkey6");
        if (items.bigkey7) toggle("bigkey7");
        if (items.bigkey8) toggle("bigkey8");
        if (items.bigkey9) toggle("bigkey9");
        if (items.bigkey10) toggle("bigkey10");
        if (items.bigkey11) toggle("bigkey11");
        if (items.bigkey12) toggle("bigkey12");
        document.getElementById("bigkey0").style.visibility = "visible";
        document.getElementById("bigkey1").style.visibility = "visible";
        document.getElementById("bigkey2").style.visibility = "visible";
        document.getElementById("bigkey3").style.visibility = "visible";
        document.getElementById("bigkey4").style.visibility = "visible";
        document.getElementById("bigkey5").style.visibility = "visible";
        document.getElementById("bigkey6").style.visibility = "visible";
        document.getElementById("bigkey7").style.visibility = "visible";
        document.getElementById("bigkey8").style.visibility = "visible";
        document.getElementById("bigkey9").style.visibility = "visible";
        document.getElementById("bigkey10").style.visibility = "visible";
        document.getElementById("bigkey11").style.visibility = document.getElementById("doorselect").value != "N" ? "visible" : "hidden";
        document.getElementById("bigkey12").style.visibility = document.getElementById("doorselect").value === "C" ? "visible" : "hidden";
      }

      if (newFlags.wildkeys || newFlags.gametype === "R") {
        for (var k = 0; k < 13; k++) {
          items["smallkey" + k] = 0;
        }
      } else {
        for (var k = 0; k < 13; k++) {
          items["smallkey" + k] = newFlags.doorshuffle === "C" ? 29 : keyCounts[k];
        }
      }

      if (adjustForCrossed && newFlags.doorshuffle != "C") {
        for (var k = 0; k < 13; k++) {
          items["smallkey" + k] = Math.min(items["smallkey" + k], keyCounts[k]);
        }
      }

      document.getElementById("smallkey0").innerHTML = items.smallkey0;
      document.getElementById("smallkey1").innerHTML = items.smallkey1;
      document.getElementById("smallkey2").innerHTML = items.smallkey2;
      document.getElementById("smallkey3").innerHTML = items.smallkey3;
      document.getElementById("smallkey4").innerHTML = items.smallkey4;
      document.getElementById("smallkey5").innerHTML = items.smallkey5;
      document.getElementById("smallkey6").innerHTML = items.smallkey6;
      document.getElementById("smallkey7").innerHTML = items.smallkey7;
      document.getElementById("smallkey8").innerHTML = items.smallkey8;
      document.getElementById("smallkey9").innerHTML = items.smallkey9;
      document.getElementById("smallkey10").innerHTML = items.smallkey10;
      document.getElementById("smallkey11").innerHTML = items.smallkey11;
      document.getElementById("smallkey12").innerHTML = items.smallkey12;

      //If small keys are not shuffled, hide the icons
      if (!document.getElementById("shuffledkeys").checked && flags.gametype != "R") {
        document.getElementById("smallkey0").style.visibility = "hidden";
        document.getElementById("smallkey1").style.visibility = "hidden";
        document.getElementById("smallkey2").style.visibility = "hidden";
        document.getElementById("smallkey3").style.visibility = "hidden";
        document.getElementById("smallkey4").style.visibility = "hidden";
        document.getElementById("smallkey5").style.visibility = "hidden";
        document.getElementById("smallkey6").style.visibility = "hidden";
        document.getElementById("smallkey7").style.visibility = "hidden";
        document.getElementById("smallkey8").style.visibility = "hidden";
        document.getElementById("smallkey9").style.visibility = "hidden";
        document.getElementById("smallkey10").style.visibility = "hidden";
        document.getElementById("smallhalfheader0").style.visibility = "hidden";
        document.getElementById("smallkey11").style.visibility = "hidden";
        document.getElementById("smallhalfheader1").style.visibility = "hidden";
        document.getElementById("smallkey12").style.visibility = "hidden";
      } else {
        document.getElementById("smallkey0").style.visibility = "visible";
        document.getElementById("smallkey1").style.visibility = "visible";
        document.getElementById("smallkey2").style.visibility = "visible";
        document.getElementById("smallkey3").style.visibility = "visible";
        document.getElementById("smallkey4").style.visibility = "visible";
        document.getElementById("smallkey5").style.visibility = "visible";
        document.getElementById("smallkey6").style.visibility = "visible";
        document.getElementById("smallkey7").style.visibility = "visible";
        document.getElementById("smallkey8").style.visibility = "visible";
        document.getElementById("smallkey9").style.visibility = "visible";
        document.getElementById("smallkey10").style.visibility = "visible";
        document.getElementById("smallhalfheader0").style.visibility = "visible";
        document.getElementById("smallkey11").style.visibility = "visible";
        document.getElementById("smallhalfheader1").style.visibility = "visible";
        document.getElementById("smallkey12").style.visibility = "visible";
      }

      if (!document.getElementById("shuffledkeys").checked && !document.getElementById("shuffledbigkeys").checked && flags.gametype != "R" && document.getElementById("doorselect").value != "C") {
        document.getElementById("chest0").classList.add("large");
        document.getElementById("c0bkdiv").classList.add("hidden");
        document.getElementById("c0skdiv").classList.add("hidden");
        document.getElementById("chest1").classList.add("large");
        document.getElementById("c1bkdiv").classList.add("hidden");
        document.getElementById("c1skdiv").classList.add("hidden");
        document.getElementById("chest2").classList.add("large");
        document.getElementById("c2bkdiv").classList.add("hidden");
        document.getElementById("c2skdiv").classList.add("hidden");
        document.getElementById("chest3").classList.add("large");
        document.getElementById("c3bkdiv").classList.add("hidden");
        document.getElementById("c3skdiv").classList.add("hidden");
        document.getElementById("chest4").classList.add("large");
        document.getElementById("c4bkdiv").classList.add("hidden");
        document.getElementById("c4skdiv").classList.add("hidden");
        document.getElementById("chest5").classList.add("large");
        document.getElementById("c5bkdiv").classList.add("hidden");
        document.getElementById("c5skdiv").classList.add("hidden");
        document.getElementById("chest6").classList.add("large");
        document.getElementById("c6bkdiv").classList.add("hidden");
        document.getElementById("c6skdiv").classList.add("hidden");
        document.getElementById("chest7").classList.add("large");
        document.getElementById("c7bkdiv").classList.add("hidden");
        document.getElementById("c7skdiv").classList.add("hidden");
        document.getElementById("chest8").classList.add("large");
        document.getElementById("c8bkdiv").classList.add("hidden");
        document.getElementById("c8skdiv").classList.add("hidden");
        document.getElementById("chest9").classList.add("large");
        document.getElementById("c9bkdiv").classList.add("hidden");
        document.getElementById("c9skdiv").classList.add("hidden");
      } else {
        document.getElementById("chest0").classList.remove("large");
        document.getElementById("c0bkdiv").classList.remove("hidden");
        document.getElementById("c0skdiv").classList.remove("hidden");
        document.getElementById("chest1").classList.remove("large");
        document.getElementById("c1bkdiv").classList.remove("hidden");
        document.getElementById("c1skdiv").classList.remove("hidden");
        document.getElementById("chest2").classList.remove("large");
        document.getElementById("c2bkdiv").classList.remove("hidden");
        document.getElementById("c2skdiv").classList.remove("hidden");
        document.getElementById("chest3").classList.remove("large");
        document.getElementById("c3bkdiv").classList.remove("hidden");
        document.getElementById("c3skdiv").classList.remove("hidden");
        document.getElementById("chest4").classList.remove("large");
        document.getElementById("c4bkdiv").classList.remove("hidden");
        document.getElementById("c4skdiv").classList.remove("hidden");
        document.getElementById("chest5").classList.remove("large");
        document.getElementById("c5bkdiv").classList.remove("hidden");
        document.getElementById("c5skdiv").classList.remove("hidden");
        document.getElementById("chest6").classList.remove("large");
        document.getElementById("c6bkdiv").classList.remove("hidden");
        document.getElementById("c6skdiv").classList.remove("hidden");
        document.getElementById("chest7").classList.remove("large");
        document.getElementById("c7bkdiv").classList.remove("hidden");
        document.getElementById("c7skdiv").classList.remove("hidden");
        document.getElementById("chest8").classList.remove("large");
        document.getElementById("c8bkdiv").classList.remove("hidden");
        document.getElementById("c8skdiv").classList.remove("hidden");
        document.getElementById("chest9").classList.remove("large");
        document.getElementById("c9bkdiv").classList.remove("hidden");
        document.getElementById("c9skdiv").classList.remove("hidden");
      }

      flags.wildmaps = document.getElementById("shuffledmaps").checked;
      flags.wildcompasses = document.getElementById("shuffledcompasses").checked;
      flags.wildkeys = document.getElementById("shuffledkeys").checked;
      flags.wildbigkeys = document.getElementById("shuffledbigkeys").checked;
    }

    //Goal
    if (document.getElementById("goalselect").value != flags.goals) {
      document.getElementById("ganondiv").classList.remove("ganon");
      document.getElementById("ganondiv").classList.remove("pendants");
      document.getElementById("ganondiv").classList.remove("other");
      document.getElementById("ganondiv").classList.remove("alldungeons");
      document.getElementById("ganondiv").classList.remove("ganonhunt");
      document.getElementById("ganondiv").classList.remove("triforcehunt");

      switch (document.getElementById("goalselect").value) {
        case "G":
        case "F":
          if (flags.ganonvulncount === 8 || flags.goals === "A") {
            document.getElementById("ganondiv").classList.add("ganon");
          } else {
            document.getElementById("ganondiv").classList.add("ganon" + flags.ganonvulncount);
          }
          break;
        case "A":
          document.getElementById("ganondiv").classList.add("alldungeons");
          flags.ganonvulncount = 7;
          break;
        case "P":
          document.getElementById("ganondiv").classList.add("pendants");
          flags.ganonvulncount = 8;
          break;
        case "T":
          document.getElementById("ganondiv").classList.add("triforcehunt");
          flags.ganonvulncount = 8;
          break;
        case "H":
          document.getElementById("ganondiv").classList.add("ganonhunt");
          flags.ganonvulncount = 8;
          break;
        case "O":
          document.getElementById("ganondiv").classList.add("other");
          break;
      }

      flags.goals = document.getElementById("goalselect").value;
    }

    //Swords
    if (document.getElementById("swordselect").value != flags.swordmode) {
      if (document.getElementById("swordselect").value === "S") {
        while (items.sword != 0) {
          toggle("sword");
        }
      }
      flags.swordmode = document.getElementById("swordselect").value;
    }

    //Activated Flute
    if (document.getElementById("activatedflute").checked != flags.activatedflute) {
      flags.activatedflute = document.getElementById("activatedflute").checked;
    }

    //Bonk Shuffle
    if (document.getElementById("bonkshuffle").checked != (flags.bonkshuffle === "Y")) {
      flags.bonkshuffle = document.getElementById("bonkshuffle").checked ? "Y" : "N";
    }

    //Overworld
    if (document.getElementById("overworldbox").checked != (flags.overworldshuffle != "N")) {
      flags.overworldshuffle = document.getElementById("overworldbox").checked ? "Y" : "N";
      resetLogic = flags.overworldshuffle === "N";
    }

    //Shopsanity
    if (document.getElementById("shopsanitybox").checked != (flags.shopsanity != "N")) {
      flags.shopsanity = document.getElementById("shopsanitybox").checked ? "Y" : "N";
    }

    // Pseudoboots
    if (document.getElementById("pseudobootsbox").checked != (flags.pseudoboots != "N")) {
      flags.pseudoboots = document.getElementById("pseudobootsbox").checked ? "Y" : "N";
    }

    // Mirror scroll
    if (document.getElementById("mirrorscrollbox").checked != (flags.mirrorscroll != "N")) {
      flags.mirrorscroll = document.getElementById("mirrorscrollbox").checked ? "Y" : "N";
    }


    //Entrance
    if (document.getElementById("entranceselect").value != flags.entrancemode) {
      connectorIndex = [];
      connectorOne = [];
      connectorTwo = [];
      document.getElementById("connectorLineDiv").innerHTML = "";
      document.getElementById("informationDiv").innerHTML = "";
      flags.entrancemode = document.getElementById("entranceselect").value;
      loadStyleAndChests();
      if (flags.entrancemode !== "N") {
        initializeEntranceEventHandlers(false);
      }
      resetChestFlags = resetLogic = false;
    }

    if (resetChestFlags) {
      connectorIndex = [];
      connectorOne = [];
      connectorTwo = [];
      document.getElementById("connectorLineDiv").innerHTML = "";
      document.getElementById("informationDiv").innerHTML = "";
      loadChestFlagsItem();
      resetLogic = false;
    }

    if (resetLogic) {
      owGraphLogic = swapTowers = swapGanon = dpFrontLogic = trFrontLogic = false;
      resetChestsKeepTrackedData();
    }

    updateLayout();
    updateMapTracker();

    if (flags.gametype === "S" && flags.entrancemode === "N") {
      document.getElementById("locationMap2").classList.remove("unavailable");
      document.getElementById("locationMap97").classList.remove("unavailable");
      document.getElementById("locationMap98").classList.remove("unavailable");
      document.getElementById("locationMap2").classList.add("opened");
      document.getElementById("locationMap97").classList.add("opened");
      document.getElementById("locationMap99").classList.add("opened");
      chests[2].is_opened = true;
      chests[97].is_opened = true;
      chests[99].is_opened = true;
      if (flags.doorshuffle === "N") {
        document.getElementById("locationMap98").classList.remove("unavailable");
        document.getElementById("locationMap104").classList.remove("unavailable");
        document.getElementById("locationMap98").classList.add("opened");
        document.getElementById("locationMap104").classList.add("opened");
        chests[98].is_opened = true;
        chests[104].is_opened = true;
      }
    }

    updateMysteryPointTotal();
    $("#flagsModal").hide();
  };

  function limit(delta, limits) {
    return function (item) {
      var value = items[item],
        max = limits[item].max,
        min = limits[item].min || 0;
      value += delta;
      if (value > max) value = min;
      if (value < min) value = max;
      return (items[item] = value);
    };
  }

  window.updateLayout = function () {
    let scaleClass = "scale100";
    switch (flags.scale) {
      case "D":
        scaleClass = "scale200";
        break;
      case "E":
        scaleClass = "scale150";
        break;
      case "F":
        break;
      case "T":
        scaleClass = "scale75";
        break;
      case "H":
        scaleClass = "scale50";
        break;
      case "Q":
        scaleClass = "scale25";
        break;
    }

    document.body.className = scaleClass;

    //Map layers
    switch (flags.mapmode) {
      case "N":
        break;
      case "M":
        //document.getElementById("map").style.width = "1340px";
        document.getElementById("map").style.width = "892px";
        document.getElementById("map").style.position = "absolute";
        document.getElementById("map").style.left = "448";
        document.getElementById("map").style.top = "0";
        break;
      case "C":
        document.getElementById("connectorLineDiv").style.height = "222px";
        document.getElementById("connectorLineDiv").style.left = "0";
        document.getElementById("connectorLineDiv").style.top = "448";
        document.getElementById("informationDiv").style.height = "222px";
        document.getElementById("informationDiv").style.left = "0";
        document.getElementById("informationDiv").style.top = flags.spheresmode === "N" ? "448" : "744";
        var ganonEntranceLabelDiv = document.getElementById("ganon");
        ganonEntranceLabelDiv.parentNode.removeChild(ganonEntranceLabelDiv);
        var ganonCompactEntranceLabelDiv = document.getElementById("compactganondiv");
        ganonCompactEntranceLabelDiv.appendChild(ganonEntranceLabelDiv);
        break;
      case "V":
        document.getElementById("map").style.width = "433px";
        document.getElementById("map").style.position = "absolute";
        document.getElementById("map").style.left = "0";
        document.getElementById("map").style.top = "448";
        document.getElementById("map_light").style.height = "433px";
				document.getElementById("map_dark").style.height = "433px";
        break;
    }

    document.getElementById("mapItemDiv_light").style.display = flags.entrancemode === "N" ? "block" : "none";
    document.getElementById("mapItemDiv_dark").style.display = flags.entrancemode === "N" ? "block" : "none";
    document.getElementById("mapEntranceDiv_light").style.display = flags.entrancemode === "N" ? "none" : "block";
    document.getElementById("mapEntranceDiv_dark").style.display = flags.entrancemode === "N" ? "none" : "block";

    //Hide HC and CT big keys if not needed
    document.getElementById("bigkey11").style.visibility = (flags.wildbigkeys || flags.showbigkeys) && flags.doorshuffle != "N" ? "visible" : "hidden";
    document.getElementById("bigkey12").style.visibility = (flags.wildbigkeys || flags.showbigkeys) && flags.doorshuffle === "C" ? "visible" : "hidden";

    //Hide HC and CT chests if neither Entrance nor Door Shuffle is on
    document.getElementById("agamagicsplitdiv").style.display = flags.entrancemode === "N" && flags.doorshuffle === "N" && !flags.showhcctcounts ? "none" : "block";
    document.getElementById("hcctchests").style.display = flags.entrancemode === "N" && flags.doorshuffle === "N" && !flags.showhcctcounts ? "none" : "block";
    document.getElementById("bighalfmagic").style.display = flags.entrancemode === "N" && flags.doorshuffle === "N" && !flags.showhcctcounts ? "block" : "none";
    document.getElementById("agasplitdiv").style.display = flags.entrancemode === "N" && flags.doorshuffle === "N" && !flags.showhcctcounts ? "block" : "none";
    if ((!(flags.entrancemode === "N" && flags.doorshuffle === "N") || flags.showhcctcounts) && items.maxchest12 === 0) {
      rightClickChest("chest12");
      toggle("chest12");
    }

    document.getElementById("connectorLineDiv").style.visibility = flags.entrancemode === "N" ? "hidden" : "visible";
    document.getElementById("informationDiv").style.visibility = flags.entrancemode === "N" ? "hidden" : "visible";

    //Show compasses for Crossed Door Shuffle
    if (flags.doorshuffle === "C") {
      for (var k = 0; k < 10; k++) document.getElementById("c" + k + "skdiv").classList.add("withcompass");
      document.getElementById("gtdiv").classList.add("withcompass");
      document.getElementById("hcctchests").classList.add("withcompass");
    } else {
      for (var k = 0; k < 10; k++) document.getElementById("c" + k + "skdiv").classList.remove("withcompass");
      document.getElementById("gtdiv").classList.remove("withcompass");
      document.getElementById("hcctchests").classList.remove("withcompass");
    }

    //Moved locations in Inverted
    if (flags.entrancemode === "N") {
      window.document.getElementById("locationMap1").style.visibility = "inherit";
      if (flags.gametype === "I" && flags.overworldshuffle === "N") {
        document.getElementById("locationMap2").style.left = "54.8%";
        jQuery("#locationMap2").detach().appendTo("#map_dark");

        document.getElementById("locationMap119").style.left = "27.4%";
      } else {
        document.getElementById("locationMap2").style.left = "54.8%";
        jQuery("#locationMap2").detach().appendTo("#map_light");

        document.getElementById("locationMap119").style.left = "77.4%";
      }

      jQuery("#locationMap1").detach().appendTo("#map_light");
      jQuery("#locationMap3").detach().appendTo("#map_light");
      jQuery("#locationMap4").detach().appendTo("#map_light");
      jQuery("#locationMap17").detach().appendTo("#map_light");
      jQuery("#locationMap18").detach().appendTo("#map_light");
      jQuery("#locationMap19").detach().appendTo("#map_light");

      jQuery("#locationMap7").detach().appendTo("#map_dark");
      jQuery("#locationMap8").detach().appendTo("#map_dark");
      jQuery("#locationMap10").detach().appendTo("#map_dark");
      jQuery("#locationMap11").detach().appendTo("#map_dark");
      jQuery("#locationMap13").detach().appendTo("#map_dark");
      jQuery("#locationMap16").detach().appendTo("#map_dark");
      jQuery("#locationMap21").detach().appendTo("#map_dark");
      jQuery("#locationMap22").detach().appendTo("#map_dark");
      updateLayoutTowers();
    } else {
      document.getElementById("locationMap2").style.left = "10%";

      //Move locations to correct half of map in entrance
      if (flags.gametype === "I") {
        jQuery("#locationMap1").detach().appendTo("#map_dark");
      } else {
        jQuery("#locationMap1").detach().appendTo("#map_light");
      }

      jQuery("#locationMap3").detach().appendTo("#map_dark");
      jQuery("#locationMap4").detach().appendTo("#map_dark");
      jQuery("#locationMap8").detach().appendTo("#map_dark");
      jQuery("#locationMap17").detach().appendTo("#map_dark");
      jQuery("#locationMap18").detach().appendTo("#map_dark");
      jQuery("#locationMap19").detach().appendTo("#map_dark");

      jQuery("#locationMap2").detach().appendTo("#map_light");
      jQuery("#locationMap7").detach().appendTo("#map_light");
      jQuery("#locationMap10").detach().appendTo("#map_light");
      jQuery("#locationMap11").detach().appendTo("#map_light");
      jQuery("#locationMap13").detach().appendTo("#map_light");
      jQuery("#locationMap16").detach().appendTo("#map_light");
      jQuery("#locationMap21").detach().appendTo("#map_light");
      jQuery("#locationMap22").detach().appendTo("#map_light");

      document.getElementById("entranceMap75").style.zIndex = "3";
      document.getElementById("entranceMap105").style.zIndex = "3";
      document.getElementById("entranceMap129").style.zIndex = "3";

      updateLayoutGanon();
    }

    //Replace HC and CT overworld locations by dungeons if Door Shuffle is on
    document.getElementById("locationMap96").style.visibility = flags.doorshuffle != "N" && flags.doorshuffle != "P" ? "hidden" : "visible";
    document.getElementById("locationMap98").style.visibility = flags.doorshuffle != "N" ? "hidden" : "visible";
    document.getElementById("locationMap104").style.visibility = flags.doorshuffle != "N" ? "hidden" : "visible";
    document.getElementById("locationMap106").style.visibility = flags.doorshuffle != "N" || (!flags.wildkeys && flags.gametype != "R") ? "hidden" : "visible";
    document.getElementById("locationMap107").style.visibility = flags.doorshuffle != "N" || (!flags.wildkeys && flags.gametype != "R") ? "hidden" : "visible";
    document.getElementById("bossMapAgahnim").style.visibility = flags.doorshuffle != "N" ? "hidden" : "visible";
    document.getElementById("castle").style.visibility = flags.doorshuffle != "N" ? "hidden" : "visible";
    document.getElementById("bossMap11").style.visibility = flags.doorshuffle != "N" ? "visible" : "hidden";
    document.getElementById("dungeon11").style.visibility = flags.doorshuffle != "N" ? "visible" : "hidden";
    document.getElementById("bossMap12").style.visibility = flags.doorshuffle != "N" ? "visible" : "hidden";
    document.getElementById("dungeon12").style.visibility = flags.doorshuffle != "N" ? "visible" : "hidden";

    //Hide bonk locations outside of Bonk Shuffle
    for (var k = 23; k < 64; k++) {
      document.getElementById("locationMap" + k).style.visibility = flags.bonkshuffle === "N" ? "hidden" : "visible";
    }

    //Hide shops outside of Shopsanity
    for (var k = 108; k < 120; k++) {
      document.getElementById("locationMap" + k).style.visibility = flags.shopsanity === "N" ? "hidden" : "visible";
    }
    document.getElementById("locationMap119").style.visibility = "hidden"; //Bomb Shop items not randomized yet

    document.getElementById("bombfloor").style.visibility = flags.doorshuffle != "C" ? "hidden" : "visible";

    document.getElementById("mirrorscroll").style.visibility = (flags.doorshuffle === "N" || flags.doorshuffle === "P") && flags.mirrorscroll === "N" ? "hidden" : "visible";

    document.getElementById("pseudoboots").style.visibility = flags.pseudoboots === "N" ? "hidden" : "visible";

    document.getElementById("showpathsdiv").style.visibility = flags.doorshuffle === "N" && flags.overworldshuffle === "N" ? "hidden" : "visible";
  };

  window.updateLayoutTowers = function () {
    //Moved locations in Inverted and Overworld Shuffle
    if (flags.entrancemode === "N") {
      if (flags.overworldshuffle === "N" ? flags.gametype === "I" : swapTowers) {
        document.getElementById("locationMap106").style.left = "49%";
        document.getElementById("locationMap106").style.top = "5%";
        jQuery("#locationMap106").detach().appendTo("#mapItemDiv_dark");

        document.getElementById("locationMap107").style.left = "63.2%";
        document.getElementById("locationMap107").style.top = "5%";
        jQuery("#locationMap107").detach().appendTo("#mapItemDiv_dark");

        document.getElementById("bossMapAgahnim").style.left = "56%";
        document.getElementById("bossMapAgahnim").style.top = flags.mapmode === "C" ? "5.5%" : "4.5%";
        document.getElementById("castle").style.left = "56%";
        document.getElementById("castle").style.top = flags.mapmode === "C" ? "5.5%" : "4.5%";
        jQuery("#bossMapAgahnim").detach().appendTo("#mapItemDiv_dark");
        jQuery("#castle").detach().appendTo("#mapItemDiv_dark");

        document.getElementById("bossMap10").style.left = "50%";
        document.getElementById("bossMap10").style.top = "52.5%";
        document.getElementById("dungeon10").style.left = "50%";
        document.getElementById("dungeon10").style.top = "52.5%";
        jQuery("#bossMap10").detach().appendTo("#mapItemDiv_light");
        jQuery("#dungeon10").detach().appendTo("#mapItemDiv_light");

        document.getElementById("bossMap12").style.left = "56.5%";
        document.getElementById("bossMap12").style.top = flags.mapmode === "C" ? "7.2%" : "5.5%";
        document.getElementById("dungeon12").style.left = "56.5%";
        document.getElementById("dungeon12").style.top = flags.mapmode === "C" ? "7.2%" : "5.5%";
        jQuery("#bossMap12").detach().appendTo("#mapItemDiv_dark");
        jQuery("#dungeon12").detach().appendTo("#mapItemDiv_dark");
      } else {
        document.getElementById("locationMap106").style.left = "42.0%";
        document.getElementById("locationMap106").style.top = "52.6%";
        jQuery("#locationMap106").detach().appendTo("#mapItemDiv_light");

        document.getElementById("locationMap107").style.left = "58.0%";
        document.getElementById("locationMap107").style.top = "52.6%";
        jQuery("#locationMap107").detach().appendTo("#mapItemDiv_light");

        document.getElementById("bossMapAgahnim").style.left = "50.0%";
        document.getElementById("bossMapAgahnim").style.top = "52.6%";
        document.getElementById("castle").style.left = "50.0%";
        document.getElementById("castle").style.top = "52.6%";
        jQuery("#bossMapAgahnim").detach().appendTo("#mapItemDiv_light");
        jQuery("#castle").detach().appendTo("#mapItemDiv_light");

        document.getElementById("bossMap10").style.left = "58.0%";
        document.getElementById("bossMap10").style.top = flags.mapmode === "C" ? "7.2%" : "5.5%";
        document.getElementById("dungeon10").style.left = "58.0%";
        document.getElementById("dungeon10").style.top = flags.mapmode === "C" ? "7.2%" : "5.5%";
        jQuery("#bossMap10").detach().appendTo("#mapItemDiv_dark");
        jQuery("#dungeon10").detach().appendTo("#mapItemDiv_dark");

        document.getElementById("bossMap12").style.left = "50%";
        document.getElementById("bossMap12").style.top = "52.5%";
        document.getElementById("dungeon12").style.left = "50%";
        document.getElementById("dungeon12").style.top = "52.5%";
        jQuery("#bossMap12").detach().appendTo("#mapItemDiv_light");
        jQuery("#dungeon12").detach().appendTo("#mapItemDiv_light");
      }
    }
  };

  window.updateLayoutGanon = function () {
    //Moved locations in Inverted and Overworld Shuffle
    if (flags.entrancemode != "N") {
      if (flags.overworldshuffle === "N" ? flags.gametype === "I" : swapGanon) {
        window.document.getElementById("entranceMap10").style.top = "39%";
        window.document.getElementById("entranceMap93").style.left = "51.4%";
        window.document.getElementById("entranceMap93").style.top = "42%";
        window.document.getElementById("entranceMap95").style.left = "47.8%";
        window.document.getElementById("entranceMap95").style.top = "45%";
        jQuery("#entranceMap93").detach().appendTo("#mapEntranceDiv_light");
        jQuery("#entranceMap95").detach().appendTo("#mapEntranceDiv_light");
      } else {
        window.document.getElementById("entranceMap10").style.top = "39%";
        window.document.getElementById("entranceMap93").style.left = "51.4%";
        window.document.getElementById("entranceMap93").style.top = "42%";
        window.document.getElementById("entranceMap95").style.left = "44.8%";
        window.document.getElementById("entranceMap95").style.top = "50%";
        jQuery("#entranceMap93").detach().appendTo("#mapEntranceDiv_dark");
        jQuery("#entranceMap95").detach().appendTo("#mapEntranceDiv_dark");
      }
    }
  };

  window.initializeEntranceEventHandlers = function (init) {
    function addListeners() {
      for (let i = 0; i < window.entrances.length; i++) {
        const entranceMap = document.getElementById("entranceMap" + i);
        entranceMap.addEventListener("click", function () {
          toggle_location(i);
        });

        entranceMap.addEventListener("mouseover", function () {
          highlight_entrance(i);
        });

        entranceMap.addEventListener("mouseout", function () {
          unhighlight_entrance(i);
        });

        entranceMap.addEventListener("contextmenu", function (event) {
          event.preventDefault();
          rightClickEntrance(i);
        });

        entranceMap.addEventListener("auxclick", function (event) {
          if (event.button === 1) {
            event.preventDefault();
            middleClickEntrance(i);
          }
        });
      }
    }
    if (flags.mapmode != "N" && flags.entrancemode != "N") {
      if (init) {
        document.addEventListener("DOMContentLoaded", addListeners);
      } else {
        addListeners();
      }
    }
  };

  window.loadStyleAndChests = function () {
    //Load stylesheet and logic depending on Entrance mode
    document.getElementById("mainstyle").href = "css/" + (flags.entrancemode === "N" ? "" : "entrance") + "style.css?v=" + buildString;
    if (flags.mapmode === "C") {
      document.getElementById("maincompactstyle").href = "css/" + (flags.entrancemode === "N" ? "" : "entrance") + "smallmap.css?v=" + buildString;
    } else if (flags.mapmode === "V") {
      window.document.getElementById("map_light").style.marginLeft = "6px";
      window.document.getElementById("map_dark").style.marginLeft = "2px";
    }
    loadChestFlagsItem();
  };

  window.start = function () {
    loadStyleAndChests();

    //If spoiler mode, first show the modal to load the spoiler log
    if (flags.spoilermode === "Y") {
      $("#spoilerModal").show();
    }

    defineEntranceTypes();
    document.getElementById("summaryFilter0").value = "all";
    document.getElementById("summaryFilter1").value = "knownconnectors";
    document.getElementById("summaryCleared0").checked = false;
    document.getElementById("summaryCleared1").checked = false;
    const curStyle = window.getComputedStyle(document.documentElement);
    for (const a of ["unavailable", "available", "possible", "information", "darkavailable", "darkpossible", "partialavailable", "opened"]) {
      constantFunctions[a] = () => a;
      constantFunctionsEDC[a] = [];
      for (var k = 0; k < 13; k++) {
        let chestName = "chest" + k;
        if (k === 11) {
          chestName = "smallhalfheader0";
        }
        if (k === 12) {
          chestName = "smallhalfheader1";
        }
        constantFunctionsEDC[a].push(function () {
          let bgColor = "";
          let color = "black";
          switch (a) {
            case "available":
              bgColor = "--available-color";
              break;
            case "darkavailable":
              bgColor = "--darkavailable-color";
              color = "white";
              break;
            case "possible":
              bgColor = "--possible-color";
              break;
            case "darkpossible":
              bgColor = "--darkpossible-color";
              color = "white";
              break;
            case "unavailable":
              bgColor = "--unavailable-color";
              color = "white";
              break;
            case "information":
              bgColor = "--information-color";
              break;
          }
          document.getElementById(chestName).style.backgroundColor = curStyle.getPropertyValue(bgColor);
          document.getElementById(chestName).style.color = color;
        });
      }
    }

    // Set up the event listeners for entrances
    initializeEntranceEventHandlers(true);
    initializeSettings();
  };

  window.setPrimer = function () {
    sendTrackerCommand();
    loadPrimer = true;
  };

  window.initializeSettings = function () {
    // Set crystal and ganon vulnerability divs
    let towervuln = "crystals";
    if (flags.opentower === "R") {
      flags.opentowercount = 8;
    } else {
      towervuln += flags.opentowercount;
    }
    document.getElementById("crystalsdiv").classList.add(towervuln);

    let ganonvuln = "";
    switch (flags.goals) {
      case "G":
      case "F":
        ganonvuln = "ganon";
        if (flags.ganonvuln === "R") {
          flags.ganonvulncount = 8;
        } else {
          ganonvuln += flags.ganonvulncount;
        }
        break;
      case "A":
        ganonvuln = "alldungeons";
        break;
      case "P":
        ganonvuln = "pendants";
        break;
      case "T":
        ganonvuln = "triforcehunt";
        break;
      case "H":
        ganonvuln = "ganonhunt";
        break;
      case "O":
        ganonvuln = "other";
        break;
    }
    document.getElementById("ganondiv").classList.add(ganonvuln);

    //Default the dungeon prizes and enemizer defaults
    for (var k = 0; k < dungeons.length; k++) {
      prizes[k] = 0;
      if (flags.bossshuffle === "N") {
        enemizer[k] = k + 1;
      } else {
        enemizer[k] = 0;
      }
    }

    //Set the starting number of treasures
    for (var k = 0; k < 13; k++) {
      const innerHTML = flags.doorshuffle === "C" ? items["chest" + k] - 1 + "+" : items["chest" + k];
      document.getElementById("chest" + k).innerHTML = innerHTML;
    }

    //If not enemizer, hide the enemizer switches
    let bossShuffleHidden = flags.bossshuffle === "N" ? "hidden" : "";
    for (var k = 0; k < 10; k++) {
      document.getElementById("dungeonEnemy" + k).style.visibility = bossShuffleHidden;
    }

    //Hide map if not using
    if (flags.mapmode != "N") {
      for (var k = 0; k < chests.length; k++) {
        document.getElementById("locationMap" + k).className = "location " + (k >= chests.length || chests[k].is_opened ? (k > 22 && k < 79 ? "bonked" : "opened") : chests[k].is_available());
      }

      if (flags.mapmode === "C" || flags.mapmode === "V") {
        var modal = document.getElementById("entranceModal"),
          modalMain = document.getElementById("entranceModalMain");
        modal.style.width = "448px";
        modal.style.left = "0px";
        modalMain.style.width = "408px";
        modalMain.style.height = flags.mapmode === "C" ? "600px" : "624px";
        modalMain.style.left = "20px";
        modalMain.style.top = flags.mapmode === "V" ? "484px" : "36px";
      }
    } else {
      document.getElementById("app").classList.add("mapless");
      document.getElementById("map").style.display = "none";
    }

    //If big keys are not shuffled, hide the icons
    let bigKeyHidden = flags.wildbigkeys || flags.showbigkeys ? "" : "hidden";
    for (var k = 0; k < 11; k++) {
      document.getElementById("bigkey" + k).style.visibility = bigKeyHidden;
    }

    //If small keys are not shuffled, hide the icons
    let smallKeyHidden = flags.wildkeys || flags.gametype === "R" || flags.showsmallkeys ? "" : "hidden";
    for (var k = 0; k < 13; k++) {
      document.getElementById("smallkey" + k).style.visibility = smallKeyHidden;
    }
    document.getElementById("smallhalfheader0").style.visibility = smallKeyHidden;
    document.getElementById("smallhalfheader1").style.visibility = smallKeyHidden;

    //If all keys are not shuffled, change the chest styles
    if (bigKeyHidden === "" || smallKeyHidden === "" || flags.gametype === "R" || flags.doorshuffle === "C") {
      for (var k = 0; k < 10; k++) {
        document.getElementById("chest" + k).classList.remove("large");
        document.getElementById("c" + k + "bkdiv").classList.remove("hidden");
        document.getElementById("c" + k + "skdiv").classList.remove("hidden");
      }
    } else {
      for (var k = 0; k < 10; k++) {
        document.getElementById("chest" + k).classList.add("large");
        document.getElementById("c" + k + "bkdiv").classList.add("hidden");
        document.getElementById("c" + k + "skdiv").classList.add("hidden");
      }
    }

    //If game type is Retro, default the keys to max and decrement
    if (flags.gametype === "R") {
      for (k = 0; k < 13; k++) {
        items["smallkey" + k] = items.range["smallkey" + k].max;
        document.getElementById("smallkey" + k).innerHTML = items["smallkey" + k];
      }
    }

    //If spheres are not used, hide the spheres
    if (flags.spheresmode == "N") {
      document.getElementById("spheres").style.visibility = "hidden";
      document.getElementById("spheres").style.display = "none";
      document.getElementById("app").classList.add("sphereless");
    } else {
      document.getElementById("spheres").style.visibility = "visible";
      if (flags.mapmode === "V") {
        document.getElementById("spheres").classList.remove("row");
        document.getElementById("spheres").classList.add("cell");
      }
    }

    document.getElementsByClassName("tunic")[0].classList.add(flags.sprite);

    // If mystery, add the settings flag to the tracker
    if (flags.unknown === "N") {
      document.getElementById("changeflagsdiv").style.visibility = "hidden";
    } else if (flags.unknown === "G") {
      document.getElementById("changeflagsdiv").style.visibility = "hidden";
    }

    window.addEventListener("message", receiveMessage, false);

    for (var i = 0; i < 10; i++) {
      document.getElementById("bossMap" + i).classList.add("bossprize-0");
    }

    if (flags.mapstyle === "O") {
      document.getElementById("map_light").style.backgroundImage = "url(images/overlay/map_lw_old.png)";
      document.getElementById("map_dark").style.backgroundImage = "url(images/overlay/map_dw_old.png)";
      var locations = document.getElementsByClassName("location");
      for (var i = 0; i < locations.length; i++) {
        locations[i].style.width = flags.entrancemode === "N" ? "20px !important" : "16px";
        locations[i].style.height = flags.entrancemode === "N" ? "20px !important" : "16px";
        locations[i].style.border = flags.entrancemode === "N" ? "3px solid" : "2px solid";
        locations[i].style.marginLeft = flags.entrancemode === "N" ? "-10px" : "-8px";
        locations[i].style.marginTop = flags.entrancemode === "N" ? "-10px" : "-8px";
      }

      for (var i = 0; i < dungeons.length; i++) {
        let dungeon = document.getElementById("dungeon" + i);
        dungeon.style.width = "38px";
        dungeon.style.height = "38px";
        dungeon.style.border = "4px solid";
        dungeon.style.marginLeft = "-20px";
        dungeon.style.marginTop = "-20px";
        if ([2, 8].includes(i)) {
          dungeon.style.marginLeft = "-17px";
          let boss = document.getElementById("bossMap" + i);
          boss.style.marginLeft = "-12px";
        }
      }

      let castle = document.getElementById("castle");
      castle.style.width = "40px";
      castle.style.height = "40px";
      castle.style.border = "4px solid";
      castle.style.marginLeft = "-20px";
      castle.style.marginTop = "-20px";
    }

    //Set starting items
    toggle("bomb");

    if (flags.swordmode === "A") {
      toggle("sword");
    }

    if (flags.activatedflute) {
      toggle("flute", 2);
    }

    if (window.flags.startingitems.charAt(0) === "1") {
      toggle("moonpearl");
    }

    if (window.flags.startingitems.charAt(1) != "0") {
      if (window.flags.nonprogressivebows) {
        toggle("bow");
      }

      if (window.flags.startingitems.charAt(1) === "2") {
        toggle("bow");
      } else if (window.flags.startingitems.charAt(1) === "3") {
        toggle("bow");
        toggle("bow");
      }
    }

    if (window.flags.startingitems.charAt(2) != "0") {
      toggle("boomerang");
      if (window.flags.startingitems.charAt(2) === "2") {
        toggle("boomerang");
      } else if (window.flags.startingitems.charAt(2) === "3") {
        toggle("boomerang");
        toggle("boomerang");
      }
    }
    if (window.flags.startingitems.charAt(3) === "1") {
      toggle("hookshot");
    }
    if (window.flags.startingitems.charAt(4) === "1") {
      toggle("mushroom");
    }
    if (window.flags.startingitems.charAt(5) === "1") {
      toggle("powder");
    }
    if (window.flags.startingitems.charAt(6) === "1") {
      toggle("firerod");
    }
    if (window.flags.startingitems.charAt(7) === "1") {
      toggle("icerod");
    }
    if (window.flags.startingitems.charAt(8) === "1") {
      toggle("bombos");
    }
    if (window.flags.startingitems.charAt(9) === "1") {
      toggle("ether");
    }
    if (window.flags.startingitems.charAt(10) === "1") {
      toggle("quake");
    }
    if (window.flags.startingitems.charAt(11) === "1") {
      toggle("lantern");
    }
    if (window.flags.startingitems.charAt(12) === "1") {
      toggle("hammer");
    }
    if (window.flags.startingitems.charAt(13) === "1") {
      toggle("shovel");
    }
    if (window.flags.startingitems.charAt(14) === "1") {
      toggle("flute");
    }
    if (window.flags.startingitems.charAt(15) === "1") {
      toggle("net");
    }
    if (window.flags.startingitems.charAt(16) === "1") {
      toggle("book");
    }
    if (window.flags.startingitems.charAt(17) === "1") {
      toggle("bottle1");
    }
    if (window.flags.startingitems.charAt(18) === "1") {
      toggle("somaria");
    }
    if (window.flags.startingitems.charAt(19) === "1") {
      toggle("byrna");
    }
    if (window.flags.startingitems.charAt(20) === "1") {
      toggle("cape");
    }
    if (window.flags.startingitems.charAt(21) === "1") {
      toggle("mirror");
    }
    if (window.flags.startingitems.charAt(22) === "1") {
      toggle("boots");
    }
    if (window.flags.startingitems.charAt(23) != "0") {
      toggle("glove");
      if (window.flags.startingitems.charAt(23) === "2") {
        toggle("glove");
      }
    }
    if (window.flags.startingitems.charAt(24) === "1") {
      toggle("flippers");
    }
    if (window.flags.startingitems.charAt(25) === "1") {
      toggle("magic");
    }

    if (flags.autotracking !== "N") {
      autotrackConnect();
    }

    updateLayout();
    updateMapTracker();
  };
})(window);

(function (global) {
  if (typeof global === "undefined") {
    throw new Error("window is undefined");
  }

  var _hash = "!";
  var noBackPlease = function () {
    global.location.href += "#";

    // Making sure we have the fruit available for juice (^__^)
    global.setTimeout(function () {
      global.location.href += "!";
    }, 50);
  };

  global.onhashchange = function () {
    if (global.location.hash !== _hash) {
      global.location.hash = _hash;
    }
  };

  global.onload = function () {
    noBackPlease();

    // Disables backspace on page except on input fields and textarea..
    document.body.onkeydown = function (e) {
      var elm = e.target.nodeName.toLowerCase();
      if (e.which === 8 && elm !== "input" && elm !== "textarea") {
        e.preventDefault();
      }
      // Stopping the event bubbling up the DOM tree...
      e.stopPropagation();
    };
    document.addEventListener('mousedown', function(e) {
    if (e.button === 1) {
      e.preventDefault(); // Prevents Autoscroll toggle
    }
});
  };
})(window);
