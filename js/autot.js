var autotrackHost = null;
var autotrackSocket = null;
var autotrackDeviceName = "";

var autotrackReconnectTimer = null;
var autotrackTimer = null;

var autotrackPrevData = null;

var autotrackRefreshInterval = 1000;
var autotrackTimeoutDelay = 10000;

var hasWarnedPracHackVersion = false;

var WRAM_START = 0xf50000;
var WRAM_SIZE = 0x20000;
var GAMEMODE_LOC = WRAM_START + 0x10;
var SAVEDATA_START = WRAM_START + 0xf000;
var SAVEDATA_SIZE = 0x500;
var POTDATA_START = SAVEDATA_START + 0x7018;
var SPRITEDATA_START = SAVEDATA_START + 0x7268;
var PSEUDOBOOTS_LOC = 0x18008e;
var RANDOVERSION_LOC = 0x7fc0; // Actually ROM name
var ORVERSION_LOC = 0x150010;
var DRMODE_LOC = 0x138002;
var DRFLAGS_LOC = 0x138004; // Actually DRFlags
var OWDATA_LOC = 0x1539b0; // Overworld data for autotracking
var SMITH_LOC = 0x18004c; // Smiths can go into eg2
var PRIZES_LOC = 0x1209b; // Pendant/Crystal number data
var PRIZES2_LOC = 0x180050; // Pendant/Crystal data
var KEYSANITY_LOC = 0x18016a; // Keysanity flags
var ENTRANCE_LOC = 0x180211; // Entrance shuffle flags
var COMPASSCOUNTSEEN_LOC = SAVEDATA_START + 0x403; //Compass count seen flags, for autotracking chest counts in doors
var MAPCOUNTSEEN_LOC = SAVEDATA_START + 0x474; //Map count seen flags, for autotracking key counts in doors
var COMPASSCOUNT_LOC = 0xf65410; //Max item counts for each dungeon
var MAPCOUNT_LOC = 0xf65430; //Max key counts for each dungeon
var CHECKS_LOC = SAVEDATA_START + 0x4b0; //Current checks in each dungeon
var KEYS_LOC = SAVEDATA_START + 0x4e0; //Current keys in each dungeon

var CONFIGURING = false;

var NO_ROM_READS = false;

const prizemap = {
  crystal: {
    0x2: "1",
    0x10: "2",
    0x40: "3",
    0x20: "4",
    0x4: "5",
    0x1: "6",
    0x8: "7",
    0x80: "8",
  },
  pendant: {
    0x4: "g",
    0x2: "b",
    0x1: "r",
  },
};

let dungeonautotrackCounts = {
  hc: 0,
  ep: 0,
  dp: 0,
  toh: 0,
  ct: 0,
  pod: 0,
  sp: 0,
  sw: 0,
  tt: 0,
  ip: 0,
  mm: 0,
  tr: 0,
  gt: 0,
};

function autotrackStartTimer() {
  autotrackTimer = setTimeout(autotrackReadMem, autotrackRefreshInterval);
}

function autotrackSetStatus(text, prachack=false) {
  document.getElementById("autotrackingstatus").textContent = (prachack ? "(Prachack) " : "") + (flags.autotracking === "E" ? "(Enhanced) " : "") + "Autotracking Status: " + text;
}

function autotrackTrackerConfigure() {
  const athost = document.getElementById("autotrackinghost").value;
  const port = document.getElementById("autotrackingport").value;
  autotrackConnect("ws://" + athost + ":" + port, true);
  CONFIGURING = true;
}

function autotrackConnect(host = "ws://" + flags.trackinghost + ":" + flags.trackingport) {
  if (autotrackSocket !== null || autotrackReconnectTimer !== null) {
    autotrackDisconnect();
    return;
  }

  autotrackHost = host;
  autotrackSocket = new WebSocket(host);
  autotrackSocket.binaryType = "arraybuffer";

  autotrackSocket.onclose = function (event) {
    autotrackCleanup();
    autotrackSetStatus("Disconnected: " + event.reason);
  };

  autotrackSocket.onerror = function (event) {
    autotrackCleanup();
    autotrackSetStatus("Error");
  };

  autotrackSocket.onopen = autotrackOnConnect;

  autotrackSetStatus("Connecting");
  //document.getElementById("autoTrackButton").textContent="Disconnect";

  autotrackReconnectTimer = setTimeout(function () {
    autotrackReconnectTimer = null;
    autotrackCleanup();
    autotrackConnect(autotrackHost);
  }, autotrackTimeoutDelay);
}

function autotrackDisconnect() {
  if (autotrackReconnectTimer !== null) {
    clearTimeout(autotrackReconnectTimer);
    autotrackReconnectTimer = null;
  }
  autotrackCleanup();
  //document.getElementById("autoTrackButton").textContent="Connect";
}

function autotrackCleanup() {
  if (autotrackTimer !== null) {
    clearTimeout(autotrackTimer);
    autotrackTimer = null;
  }
  if (autotrackSocket !== null) {
    autotrackSocket.onopen = function () {};
    autotrackSocket.onclose = function () {};
    autotrackSocket.onmessage = function () {};
    autotrackSocket.onerror = function () {};
    autotrackSocket.close();
    autotrackSocket = null;
  }

  autotrackPrevData = null;
  //autotrackSetStatus("Disconnected");
}

function autotrackOnConnect(event) {
  autotrackSetStatus("Connected, requesting devices list");

  autotrackSocket.send(
    JSON.stringify({
      Opcode: "DeviceList",
      Space: "SNES",
    })
  );
  autotrackSocket.onmessage = autotrackOnDeviceList;
}

function autotrackOnDeviceList(event) {
  var results = JSON.parse(event.data).Results;
  if (results.length < 1) {
    autotrackCleanup();
    autotrackSetStatus("No device found");
    return;
  }
  autotrackDeviceName = results[0];

  autotrackSocket.send(
    JSON.stringify({
      Opcode: "Attach",
      Space: "SNES",
      Operands: [autotrackDeviceName],
    })
  );

  autotrackSetStatus("Connected to " + autotrackDeviceName);

  autotrackSocket.send(
    JSON.stringify({
      Opcode: "Info",
      Space: "SNES",
      Operands: [autotrackDeviceName],
    })
  );
  autotrackSocket.onmessage = autotrackHandleInfoResponse;
}

function autotrackHandleInfoResponse(event) {
  var results = JSON.parse(event.data).Results;

  // This is qusb2snes connected to a retroarch core, we will need to skip certain reads
  // if (results.includes("NO_ROM_READ") || autotrackDeviceName.startsWith("RetroArch") || autotrackDeviceName.startsWith("ra://")) {
  if (autotrackDeviceName.startsWith("RetroArch") || autotrackDeviceName.startsWith("ra://")) {
    NO_ROM_READS = true;
  }

  if (!CONFIGURING) {
    autotrackStartTimer();
  } else {
    autotrackerConfigure();
  }
}

function snesread(address, size, callback) {
  autotrackSocket.send(
    JSON.stringify({
      Opcode: "GetAddress",
      Space: "SNES",
      Operands: [address.toString(16), size.toString(16)],
    })
  );
  autotrackSocket.onmessage = callback;
}

function snesreadsave(address, size, data, data_loc, nextCallback, merge = false) {
  snesread(address, size, function (event) {
    if (merge) {
      data[data_loc] = new Uint8Array([...data[data_loc], ...new Uint8Array(event.data)]);
    } else {
      data[data_loc] = new Uint8Array(event.data);
    }
    nextCallback();
  });
}

function parseWorldState(config_data) {
  if (config_data["mainflags"][0x175] == 0x01 && config_data["mainflags"][0x172] == 0x01) {
    return "retro";
  } else if (config_data["mainflags"][0x4a] == 0x01) {
    return "inverted";
  } else {
    switch (config_data["initsram"][0x3c5]) {
      case 0x00:
        return "standard";
      case 0x02:
        return "open";
    }
  }
  return false;
}

function parseEntranceShuffle(config_data) {
  // We use the smiths flag, it won't detect simple or dungeons entrance shuffles
  if (config_data["smiths"][0x00] === 0x01) {
    return "crossed";
  } else {
    return "none";
  }
}

function parseDoorShuffle(config_data) {
  if ((config_data["drflags"][0x01] & 0x02) === 0) {
    if (config_data["potflags"][0x00] === 1) {
      return "pots";
    }
    return "none";
  } else {
    if (config_data["drmode"][0x00] === 0x02) {
      return "crossed";
    } else if (config_data["drmode"][0x00] === 0x01) {
      return "basic";
    }
  }
  return "none";
}

function parseSwordSettings(config_data) {
  // CAVEAT: Cannot support vanilla placement
  if (config_data["mainflags"][0x3f] === 0x01) {
    return "swordless";
  } else if (config_data["initsram"][0x359] > 0x00) {
    return "assured";
  } else {
    return "randomized";
  }
}

function parseGlitches(config_data) {
  // Check to see if parsing the JSON set something other than None
  if (config_data["seed_type"] === "VT" && document.getElementById("glitchesnone").checked) {
    switch (config_data["mainflags"][0x210]) {
      case 0x00:
        return "none";
      case 0x02:
        return "overworld";
      case 0x01:
        return "hybrid";
      case 0xff:
        return "nologic";
    }
  } else if (config_data["seed_type"] === "DR") {
    if (config_data["mainflags"][0xa4] === 1) {
      return "none";
    } else if (config_data["mainflags"][0x45] & 0x10) {
      return "nologic";
    } else {
      return "overworld";
    }
  }
  return false;
}

function parseGoal(config_data) {
  if (config_data["mainflags"][0x167] > 0) {
    return "triforcehunt";
  } else {
    switch (config_data["mainflags"][0x1a8]) {
      case 0x01:
        return "pedestal";
      case 0x02:
        return "dungeons";
      case 0x03:
        return "ganon";
      case 0x04:
        if (config_data["initsram"][0x2db] === 0x20 || config_data["seed_type"] != "VT") {
          return "fast";
        } else {
          return "ganon";
        }
      case 0x05:
        return "ganonhunt";
      default:
        return "ganon";
    }
  }
}

function parseStartingInventory(config_data) {
  var itemlocs = {
    moonpearl: [0x357, 0],
    bow: [0x38e, 0],
    boomerang: [0x341, 0],
    hookshot: [0x342, 0],
    mushroom: [0x344, 0],
    powder: [0x344, 0],
    firerod: [0x345, 0],
    icerod: [0x346, 0],
    bombos: [0x347, 0],
    ether: [0x348, 0],
    quake: [0x349, 0],
    lantern: [0x34a, 0],
    hammer: [0x34b, 0],
    shovel: [0x34c, 0],
    flute: [0x34c, 0],
    net: [0x34d, 0],
    book: [0x34e, 0],
    bottle: [0x34f, 0],
    somaria: [0x350, 0],
    byrna: [0x351, 0],
    cape: [0x352, 0],
    mirror: [0x353, 0],
    boots: [0x355, 0],
    glove: [0x354, 0],
    flippers: [0x356, 0],
    magic: [0x37b, 0],
  };
  const invFlags = {
    0x01: ["flute", 1],
    0x02: ["flute", 1],
    0x04: ["shovel", 1],
    // 0x08: ['mushroom', 1],
    0x10: ["powder", 1],
    0x20: ["mushroom", 1],
    0x40: ["boomerang", 2],
    0x80: ["boomerang", 1],
  };

  Object.entries(invFlags).forEach((flag_data) => {
    if ((config_data["initsram"][0x38c] & parseInt(flag_data[0])) != 0) {
      itemlocs[flag_data[1][0]][1] += flag_data[1][1];
    }
  });

  const hasSilvers = (config_data["initsram"][0x38e] & 0x40) > 0 || ((config_data["initsram"][0x38e] & 0x80) > 0 && (config_data["initsram"][0x38e] & 0x20) > 0);
  const hasBow = (config_data["initsram"][0x38e] & 0x80) > 0 || (config_data["initsram"][0x38e] & 0x20) > 0;
  if (hasSilvers && !hasBow) {
    itemlocs["bow"][1] = 1;
  } else if (!hasSilvers && hasBow) {
    itemlocs["bow"][1] = 2;
  } else if (hasSilvers && hasBow) {
    itemlocs["bow"][1] = 3;
  }

  Object.entries(itemlocs).forEach((item_data, idx) => {
    var item = item_data[0];
    var loc = item_data[1];
    if (item === "bottle" && config_data["initsram"][loc[0]] > 0) {
      toggle(item, idx);
    } else if (config_data["initsram"][loc[0]] > 0) {
      if (["boomerang", "bow", "flute", "shovel", "powder", "mushroom"].includes(item)) {
        for (var i = 0; i < loc[1]; i++) {
          toggle(item, idx);
        }
      } else {
        toggle(item, idx);
      }
    }
  });
}

async function autotrackerConfigure() {
  var config_data = {};
  var MYSTERY_SEED = false;

  function readDRFlags() {
    snesreadsave(DRFLAGS_LOC, 0x2, config_data, "drflags", isMystery);
  }

  async function isMystery() {
    var hashChars = Array.from(config_data["hash"])
      .map((c) => String.fromCharCode(c))
      .join("");

    if (hashChars.slice(0, 2) === "VT") {
      config_data["seed_type"] = "VT";
      var hash = hashChars.slice(3, 21).trim();
      document.getElementById("importflag").value = hash;
      autotrackSetStatus("Detected VT seed. Loading data from alttpr.com and then ROM");
      const mystery = (await importflags((auto = true))) === "mystery";
      MYSTERY_SEED = mystery;
    } else if (["DR", "OR"].includes(hashChars.slice(0, 2)) && (config_data["drflags"][1] & 0x1) === 1) {
      // MYSTERY_SEED = true;
      config_data["seed_type"] = hashChars.slice(0, 2);
      autotrackSetStatus("Detected DR/OR seed. Loading data from ROM");
    }
    if (!MYSTERY_SEED) {
      readShopFlags();
    } else {
      handleAutoconfigData();
    }
  }

  function readShopFlags() {
    snesreadsave(0x142a51, 0x1, config_data, "shopsanity", readMainFlags);
  }

  function readMainFlags() {
    snesreadsave(0x180000, 0x220, config_data, "mainflags", readInitialSRAM);
  }

  function readInitialSRAM() {
    snesreadsave(0x183000, 0x200, config_data, "initsram", readInitialSRAM2);
  }

  function readInitialSRAM2() {
    snesreadsave(0x183200, 0x200, config_data, "initsram", readPotFlags, (merge = true));
  }

  function readPotFlags() {
    snesreadsave(0x28aa56, 0x1, config_data, "potflags", readDoorsModeFlags);
  }

  function readDoorsModeFlags() {
    snesreadsave(DRMODE_LOC, 0x1, config_data, "drmode", readSmithFlags);
  }

  function readSmithFlags() {
    snesreadsave(SMITH_LOC, 0x1, config_data, "smiths", readEnemizerFlags);
  }

  function readEnemizerFlags() {
    if (config_data["seed_type"] === "DR") {
      snesreadsave(0x368105, 0x5, config_data, "enemizerflags", handleAutoconfigData);
    } else {
      handleAutoconfigData();
    }
  }

  function handleAutoconfigData() {
    // For now, we always turn this on to allow people to correct any mistakes after the fact
    document.getElementById("unknownmystery").checked = true;

    // if (MYSTERY_SEED) {
    //   loadmysterypreset();
    //   autotrackSetStatus("Mystery seed detected. Mystery preset loaded and starting items configured.");
    //   CONFIGURING = false;
    //   autotrackDisconnect();
    //   return;
    // }

    // Gameplay
    if (parseWorldState(config_data)) {
      document.getElementById("gametype" + parseWorldState(config_data)).checked = true;
    }

    if (config_data["smiths"]) {
      document.getElementById("entrance" + parseEntranceShuffle(config_data)).checked = true;
    }

    if (config_data["seed_type"] === "DR") {
      document.getElementById("door" + parseDoorShuffle(config_data)).checked = true;
    }

    // TODO: Overworld

    if (config_data["enemizerflags"]) {
      if (config_data["enemizerflags"][0x02] === 0x01) {
        document.getElementById("bossshuffled").checked = true;
      } else {
        document.getElementById("bossnone").checked = true;
      }

      if (config_data["enemizerflags"][0x00] === 0x01) {
        document.getElementById("enemyshuffled").checked = true;
      } else {
        document.getElementById("enemynone").checked = true;
      }
    }

    if (config_data["mainflags"][0x8e] === 0x01) {
      document.getElementById("pseudobootsyes").checked = true;
    } else {
      document.getElementById("pseudobootsno").checked = true;
    }

    // Logic
    document.getElementById("swords" + parseSwordSettings(config_data)).checked = true;

    document.getElementById("shuffledmaps").checked = config_data["mainflags"][0x16a] & 0x04;
    document.getElementById("shuffledcompasses").checked = config_data["mainflags"][0x16a] & 0x02;
    document.getElementById("shuffledsmallkeys").checked = config_data["mainflags"][0x16a] & 0x01;
    document.getElementById("shuffledbigkeys").checked = config_data["mainflags"][0x16a] & 0x08;

    // Ambrosia - NA
    // Non-progressive Bows - NYI
    // Activated flute - NA
    // Bonk Shuffle - NYI

    if (config_data["shopsanity"][0x00] & 0x02) {
      document.getElementById("shopsanityyes").checked = true;
    } else {
      document.getElementById("shopsanityno").checked = true;
    }

    if (parseGlitches(config_data)) {
      document.getElementById("glitches" + parseGlitches(config_data)).checked = true;
    }

    document.getElementById("goal" + parseGoal(config_data)).checked = true;

    parseStartingInventory(config_data);

    CONFIGURING = false;
    autotrackSetStatus("Tracker auto-configured.");
    autotrackDisconnect();
  }
  if (NO_ROM_READS) {
    autotrackSetStatus("Autconfiguration is not supported in RetroArch. Please configure the settings manually.");
    alert("Autconfiguration is not supported in RetroArch. Please configure the settings manually.");
    autotrackDisconnect();
    return;
  }
  snesreadsave(0x7fc0, 21, config_data, "hash", readDRFlags);
}

function autotrackReadMem() {
  if (autotrackReconnectTimer !== null) clearTimeout(autotrackReconnectTimer);
  autotrackReconnectTimer = setTimeout(function () {
    autotrackReconnectTimer = null;
    autotrackCleanup();
    autotrackConnect(autotrackHost);
  }, autotrackTimeoutDelay);

  var data = {};

  if (!NO_ROM_READS) {
    addRomName();
  } else {
    // If we're using RetroArch, we skip the ROM name and go straight to the gamemode
    data["version"] = new Uint8Array(21);
    data["fork"] = "VT";
    data["orversion"] = [0, 0, 0, 0];
    data["mystery"] = new Uint8Array(2);
    data["keysanity"] = new Uint8Array(1);
    data["pseudoboots"] = new Uint8Array(1);
    data["entrances"] = new Uint8Array(1);
    data["prizes"] = new Uint8Array(0xd + 0xd);
    addGamemode();
  }

  function addRomName() {
    snesreadsave(RANDOVERSION_LOC, 0x21, data, "version", parseRomName);
  }

  function parseRomName() {
    const romName = Array.from(data["version"])
      .map((c) => String.fromCharCode(c))
      .join("");
    if (romName.startsWith("ALTTPRAC") || romName.startsWith("ZELDANODEN")) {
      data["fork"] = "PH";
      data["version"] = romName.slice(10, 18);
      const phMajorVersion = data["version"].split(".")[0];
      const phMinorVersion = data["version"].split(".")[1];
      if ((phMajorVersion == 14 && phMinorVersion < 4) || phMinorVersion === undefined) {
        if (!hasWarnedPracHackVersion) {
          alert("This version of Prachack is not supported by the autotracker. Please update to at least version 14.4.0");
          hasWarnedPracHackVersion = true;
        }
        return;
      }
      autotrackSetStatus("Connected to " + autotrackDeviceName, true);

      GAMEMODE_LOC = 0xe07c04;

      addGamemode();
      return;
    } else {
      data["fork"] = Array.from(data["version"])
        .slice(0, 2)
        .map((c) => String.fromCharCode(c))
        .join("");
    }
    if (data["fork"] !== "VT") {
      data["version"] = Array.from(data["version"])
        .slice(2, 5)
        .map((c) => String.fromCharCode(c))
        .join("");
    } else {
      data["version"] = "VT";
    }
    addORVersion();
  }

  function addORVersion() {
    if (data["fork"] === "OR") {
      snesreadsave(ORVERSION_LOC, 0x21, data, "orversion", parseORVersion);
    } else {
      data["orversion"] = [0, 0, 0, 0];
      addGamemode();
    }
  }

  function parseORVersion() {
    var orver = Array.from(data["orversion"])
      .map((c) => String.fromCharCode(c))
      .join("")
      .split("\x00")[0];
    data["orversion"] = orver.split("-")[0].split(".").map(Number);
    addGamemode();
  }

  function addGamemode() {
    snesreadsave(GAMEMODE_LOC, 1, data, "gamemode", addMainAutoTrackData1);
  }

  function addMainAutoTrackData1() {
    var gamemode = data["gamemode"][0];
    if (![0x07, 0x09, 0x0b].includes(gamemode)) {
      autotrackStartTimer();
      return;
    }
    if (data["fork"] === "PH") {
      data["rooms_inv"] = new Uint8Array(0x340);
      snesreadsave(0xe07c08, 0x28, data, "rooms_inv", handlePracHack, (merge = true));
    } else {
      snesreadsave(SAVEDATA_START, 0x280, data, "rooms_inv", addMainAutoTrackData2);
    }
  }

  function handlePracHack() {
    data["rooms_inv"] = [...data["rooms_inv"], ...new Uint8Array(0x188)];
    handleAutoTrackData();
  }

  function addMainAutoTrackData2() {
    snesreadsave(SAVEDATA_START + 0x280, 0x280, data, "rooms_inv", flags.autotracking !== "N" ? addPotData : handleAutoTrackData, (merge = true));
  }

  function addPotData() {
    snesreadsave(POTDATA_START, 0x250, data, "potdata", addSpriteDropData);
  }

  function addSpriteDropData() {
    snesreadsave(SPRITEDATA_START, 0x250, data, "spritedata", addCompassCountSeenData);
  }

  function addCompassCountSeenData() {
    snesreadsave(COMPASSCOUNTSEEN_LOC, 0x2, data, "compasscountseen", addMapCountSeenData);
  }

  function addMapCountSeenData() {
    snesreadsave(MAPCOUNTSEEN_LOC, 0x2, data, "mapcountseen", addCompassCount);
  }

  function addCompassCount() {
    snesreadsave(COMPASSCOUNT_LOC, 0x20, data, "compasscount", addMapCount);
  }

  function addMapCount() {
    snesreadsave(MAPCOUNT_LOC, 0x10, data, "mapcount", addDungeonChecks);
  }

  function addDungeonChecks() {
    snesreadsave(CHECKS_LOC, 0x20, data, "dungeonchecks", addDungeonKeys);
  }

  function addDungeonKeys() {
    snesreadsave(KEYS_LOC, 0x10, data, "dungeonkeys", NO_ROM_READS ? handleAutoTrackData : addMysteryFlag);
  }

  function addMysteryFlag() {
    snesreadsave(DRFLAGS_LOC, 0x2, data, "mystery", addKeysanityFlags);
  }

  // We pull out keysanity flags to see if prizeShuffle is wild. If so, we do not auto-assign prizes to dungeons
  function addKeysanityFlags() {
    snesreadsave(KEYSANITY_LOC, 0x1, data, "keysanity", addPseudobootsFlag);
  }

  function addPseudobootsFlag() {
    // Check if we're playing DR and that the mystery flag is not set, move on to item and key counts if DR
    if (["DR", "OR"].includes(data["fork"]) && (data["mystery"][1] & 0x1) === 0) {
      snesreadsave(PSEUDOBOOTS_LOC, 0x1, data, "pseudoboots", addEntranceData);
    } else {
      addEntranceData();
    }
  }

  function addEntranceData() {
    snesreadsave(ENTRANCE_LOC, 0x1, data, "entrances", addPrizeData);
  }

  function addPrizeData() {
    snesreadsave(PRIZES_LOC, 0xd, data, "prizes", addPrize2Data);
  }

  function addPrize2Data() {
    snesreadsave(PRIZES2_LOC, 0xd, data, "prizes", addOWShuffleData, (merge = true));
  }

  function addOWShuffleData() {
    if (data["fork"] === "OR" && flags.autotracking === "E") {
      snesreadsave(OWDATA_LOC, 0x40, data, "owshuffle", handleAutoTrackData);
    } else {
      handleAutoTrackData();
    }
  }

  function handleAutoTrackData() {
    autotrackDoTracking(data);
    autotrackPrevData = data;
    autotrackStartTimer();
  }
}

function autotrackDoTracking(data) {
  function changed(offset, data_loc = "rooms_inv") {
    return autotrackPrevData === null || autotrackPrevData[data_loc][offset] !== data[data_loc][offset];
  }
  function disabledbit(offset, mask, data_loc = "rooms_inv") {
    return (data[data_loc][offset] & mask) === 0 && (autotrackPrevData === null || (autotrackPrevData[data_loc][offset] & mask) !== 0);
  }
  function newbit(offset, mask, data_loc = "rooms_inv") {
    return (data[data_loc][offset] & mask) !== 0 && (autotrackPrevData === null || (autotrackPrevData[data_loc][offset] & mask) !== (data[data_loc][offset] & mask));
  }
  function newbit_group(locations, data_loc = "rooms_inv") {
    var activated = false;
    for (const location of locations) {
      if ((data[data_loc][location[0]] & location[1]) === 0) return false;
      if (autotrackPrevData === null || (autotrackPrevData[data_loc][location[0]] & location[1]) === 0) activated = true;
    }
    return activated;
  }

  function updatechest(chest, offset, mask, data_loc = "rooms_inv") {
    if (newbit(offset, mask, data_loc) && !chests[chest].is_opened) toggle_chest(chest);
  }
  function updatechest_group(chest, locations, data_loc = "rooms_inv") {
    if (newbit_group(locations, data_loc) && !chests[chest].is_opened) toggle_chest(chest);
  }

  function checkItem(data, item, data_loc = "rooms_inv") {
    return (data[data_loc][item[0]] & item[1]) !== 0;
  }
  function checkTwoBitMask(data, loc, mask, data_loc = "rooms_inv") {
    return ((data[data_loc][loc] | (data[data_loc][loc + 1] << 8)) & mask) !== 0;
  }

  if (data["fork"] === "OR" && flags.autotracking === "E") {
    for (let ilw = 0x280; ilw < 0x280 + 0x40; ilw++) {
      let lwv,
        dwv = false;
      let idw = ilw + 0x40;
      if (newbit(ilw, 0x80, "rooms_inv")) {
        lwv = true;
      }
      if (newbit(idw, 0x80, "rooms_inv")) {
        dwv = true;
      }

      if (lwv || dwv) {
        if (data["owshuffle"][ilw - 0x280] > 0) {
          window.sendShuffleUpdate(ilw - 0x280, true);
        } else {
          window.sendShuffleUpdate(ilw - 0x280, false);
        }
      }
    }
  }

  // TEMP FIX: Don't track red and blue on the following conditions:
  // VT and ER is enabled
  // DR and version is less than 142
  // OR and ORversion is less than 4.0
  const PENDANT_SWAP_BUG_PRESENT =
    (data["fork"] === "VT" && (data["entrances"][0] & 0x02) != 0) || (data["fork"] === "DR" && data["version"] < 142) || (data["fork"] === "OR" && data["orversion"][0] === 0 && data["orversion"][1] < 4) || NO_ROM_READS;

  // Decrement dungeon count unless a non-wild dungeon item is found
  if ((flags.doorshuffle === "N" || flags.doorshuffle === "P") && ["Y", "E"].includes(flags.autotracking)) {
    Object.entries(window.dungeonDataMem).forEach(([dungeon, dungeondata]) => {
      if (items[dungeondata["dungeonarrayname"]] > 0) {
        let newCheckedLocationCount = dungeondata.locations.filter((location) => checkItem(data, location)).length;
        if (flags.doorshuffle === "P") {
          newCheckedLocationCount += dungeondata.keypots.filter((location) => checkItem(data, location, "potdata")).length;
          newCheckedLocationCount += dungeondata.keydrops.filter((location) => checkItem(data, location, "spritedata")).length;
        }
        if (flags.prizeshuffle === "W") {
          newCheckedLocationCount += "prize" in dungeondata ? checkTwoBitMask(data, 0x472, dungeondata.prizemask) : 0;
        }
        let newDungeonItemCount = 0;

        if (!flags.wildcompasses && checkItem(data, dungeondata.compass)) {
          newDungeonItemCount++;
        }
        // HC is a keydrop, doesn't count in normal counts becaus it doesn't come from a chest.
        if (!flags.wildbigkeys && (dungeon != 'hc' && flags.doorshuffle == 'N') && checkItem(data, dungeondata.bigkey)) {
          newDungeonItemCount++;
        }
        if (!flags.wildmaps && checkItem(data, dungeondata.map)) {
          newDungeonItemCount++;
        }
        if (!flags.wildkeys && flags.doorshuffle === "N") {
          let keyCount = data["rooms_inv"][dungeondata.smallkeys];
          if (['dp', 'toh'].includes(dungeon)) {
            // Temporary fix for Tower of Hera small key being counted twice
            keyCount = Math.min(keyCount, 1);
          }
          newDungeonItemCount += keyCount;
        }
        newCheckedLocationCount -= newDungeonItemCount;
        while (newCheckedLocationCount > dungeonautotrackCounts[dungeon]) {
          dungeonautotrackCounts[dungeon]++;
          toggle(dungeondata["dungeonarrayname"]);
        }
      }
    });
  }

  // Autotrack dungeon key and chest counts if count has been seen by entering the dungeon (for keys, when map in inventory, for checks basically always since that setting is generally on)
  // If NO_ROM_READS is set, we _assume_ that it's the correct fork
  if (flags.doorshuffle === "C" && ["Y", "E"].includes(flags.autotracking) && (data["fork"] !== "VT" || NO_ROM_READS)) {
    var dungeon_masks = {
      11: [0x00c0, 2],
      0: [0x0020, 4],
      1: [0x0010, 6],
      2: [0x2000, 20],
      12: [0x0008, 8],
      3: [0x0002, 12],
      4: [0x0004, 10],
      5: [0x8000, 16],
      6: [0x1000, 22],
      7: [0x4000, 18],
      8: [0x0001, 14],
      9: [0x0800, 24],
      10: [0x0400, 26],
    };

    var dungeon_item_count_seen = (data["compasscountseen"][0] << 8) + data["compasscountseen"][1];
    var dungeon_key_count_seen = (data["mapcountseen"][0] << 8) + data["mapcountseen"][1];

    for (let dun = 0; dun < 13; dun++) {
      var mask_data = dungeon_masks[dun];
      if (dungeon_item_count_seen & mask_data[0]) {
        var maxChecks = data["compasscount"][mask_data[1]] + (data["compasscount"][mask_data[1] - 1] << 8);
        var currentChecks = data["dungeonchecks"][mask_data[1]];
        if (!flags.wildkeys && dungeon_key_count_seen & mask_data[0]) {
          maxChecks -= data["mapcount"][mask_data[1] / 2];
          currentChecks -= data["dungeonkeys"][mask_data[1] / 2];
        }
        if (maxChecks - currentChecks - items["chestmanual" + dun] < 0) {
          items["chestmanual" + dun] = maxChecks - currentChecks;
        }
        if (["Y", "E"].includes(flags.autotracking)) {
          setChestCount(maxChecks - currentChecks, "chest" + dun);
        } else {
          setChestCount(maxChecks, "chest" + dun);
        }
      }

      if (dungeon_key_count_seen & mask_data[0]) {
        setKeyCount(data["dungeonkeys"][mask_data[1] / 2], data["mapcount"][mask_data[1] / 2], "smallkey" + dun);
      } else {
        setKeyCount(data["dungeonkeys"][mask_data[1] / 2], 99, "smallkey" + dun);
      }
    }
  }

  dungeonPrizes = {};
  if (data["prizes"] && !NO_ROM_READS && flags.autotracking !== "N" && !(data["fork"] === "OR" && (data["keysanity"][0] & 0x20) === 0x20)) {
    Object.entries(window.dungeonDataMem).forEach(([dungeon, dungeondata]) => {
      if ("prize" in dungeondata && dungeondata.prize > 0) {
        const prizeType = data["prizes"][dungeondata.prize + 0xd] == 0x40 ? "crystal" : "pendant";
        const prize = prizemap[prizeType][data["prizes"][dungeondata.prize]];
        dungeonPrizes[`${prizeType}${prize}`] = dungeondata.dungeonprize;
      }
    });
    Object.entries(prizemap).forEach(([prizeType, prizes]) => {
      Object.entries(prizes).forEach(([mask, prize]) => {
        if (!(["r", "b"].includes(prize) && PENDANT_SWAP_BUG_PRESENT)) {
          if (newbit(prizeType === "pendant" ? 0x374 : 0x37a, mask, "rooms_inv")) {
            const dungeonNum = dungeonPrizes[`${prizeType}${prize}`];
            collect_prize(dungeonNum);
            let currentPrize = Array.from(document.getElementById(`dungeonPrize${dungeonNum}`).classList).filter((c) => c.startsWith("prize-"))[0];
            // Is the prize set correctly already?
            switch (currentPrize) {
              case "prize-1":
                if (prize === "g") {
                  return;
                }
                break;
              case "prize-2":
                if (prize === "b" || prize === "r") {
                  return;
                }
                break;
              // Not allowed to distiquish between normal and 4/5 crystals so we don't correct mistakes
              case "prize-3":
              case "prize-4":
                if (prizeType === "crystal") {
                  return;
                }
                break;
              default:
                break;
            }
            switch (prize) {
              case "g":
                set_prize(dungeonNum, 1);
                break;
              case "b":
              case "r":
                set_prize(dungeonNum, 2);
                break;
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
              case "7":
                set_prize(dungeonNum, 3);
                break;
              default:
                set_prize(dungeonNum, 4);
                break;
            }
          }
        }
      });
    });
  }

  if (flags.entrancemode === "N") {
    updatechest(0, 0x226, 0x10); // King's Tomb
    updatechest_group(1, [
      [0x2bb, 0x40],
      [0x216, 0x10],
    ]); // Sunken Treasure + Flooded Chest
    updatechest(2, 0x208, 0x10); // Link's House
    updatechest(3, 0x1fc, 0x10); // Spiral Cave
    updatechest(4, 0x218, 0x10); // Mimic Cave
    updatechest(5, 0x206, 0x10); // T A V E R N
    updatechest(6, 0x210, 0x10); // Chicken House
    updatechest(7, 0x20c, 0x10); // Brewery
    updatechest(8, 0x238, 0x10); // C House
    updatechest(9, 0x214, 0x10); // Aginah's Cave
    updatechest_group(10, [
      [0x21a, 0x10],
      [0x21a, 0x20],
    ]); // Mire Shed Left + Right
    updatechest_group(11, [
      [0x1f0, 0x10],
      [0x1f0, 0x20],
    ]); // Superbunny Cave Top + Bottom
    updatechest_group(12, [
      [0x20a, 0x10],
      [0x20a, 0x20],
      [0x20a, 0x40],
    ]); // Sahasrahla's Hut Left + Middle + Right
    updatechest(13, 0x22e, 0x10); // Spike Cave
    updatechest_group(14, [
      [0x05e, 0x10],
      [0x05e, 0x20],
      [0x05e, 0x40],
      [0x05e, 0x80],
      [0x05f, 0x01],
    ]); // Kakariko Well Top + Left + Middle + Right + Bottom
    updatechest_group(15, [
      [0x23a, 0x10],
      [0x23a, 0x20],
      [0x23a, 0x40],
      [0x23a, 0x80],
      [0x23b, 0x01],
    ]); // Blind's Hut Top + Left + Right + Far Left + Far Right
    updatechest_group(16, [
      [0x23c, 0x10],
      [0x23c, 0x20],
      [0x23c, 0x40],
      [0x23c, 0x80],
      [0x23d, 0x04],
    ]); // Hype Cave Top + Left + Right + Bottom + NPC
    updatechest_group(17, [
      [0x1de, 0x10],
      [0x1de, 0x20],
      [0x1de, 0x40],
      [0x1de, 0x80],
      [0x1df, 0x01],
      [0x1fe, 0x10],
      [0x1fe, 0x20],
    ]); // Paradox Lower (Far Left + Left + Right + Far Right + Middle) + Upper (Left + Right)
    updatechest(18, 0x248, 0x10); // Bonk Rock
    updatechest_group(19, [
      [0x246, 0x10],
      [0x246, 0x20],
      [0x246, 0x40],
      [0x246, 0x80],
      [0x247, 0x04],
    ]); // Mini Moldorms Cave Far Left + Left + Right + Far Right + NPC
    updatechest(20, 0x240, 0x10); // Ice Rod Cave
    updatechest(21, 0x078, 0x80); // Hookshot Cave Bottom Right
    updatechest_group(22, [
      [0x078, 0x10],
      [0x078, 0x20],
      [0x078, 0x40],
    ]); // Hookshot Cave Top Right + Top Left + Bottom Left
    updatechest(23, 0x280, 0x10); // Lost Woods Hideout Tree
    updatechest(24, 0x285, 0x10); // Death Mountain Bonk Rocks
    updatechest(25, 0x28a, 0x10); // Mountain Entry Pull Tree
    updatechest(26, 0x28a, 0x08); // Mountain Entry Southeast Tree
    updatechest(27, 0x290, 0x10); // Lost Woods Pass West Tree
    updatechest(28, 0x290, 0x08); // Kakariko Portal Tree
    updatechest(29, 0x291, 0x10); // Fortune Bonk Rocks
    updatechest(30, 0x292, 0x10); // Kakariko Pond Tree
    updatechest(31, 0x293, 0x10); // Bonk Rocks Tree
    updatechest(32, 0x293, 0x08); // Sanctuary Tree
    updatechest(33, 0x295, 0x10); // River Bend West Tree
    updatechest(34, 0x295, 0x08); // River Bend East Tree
    updatechest(35, 0x298, 0x10); // Blinds Hideout Tree
    updatechest(36, 0x298, 0x08); // Kakariko Welcome Tree
    updatechest(37, 0x29a, 0x10); // Forgotten Forest Southwest Tree
    updatechest(38, 0x29a, 0x08); // Forgotten Forest Central Tree
    updatechest(39, 0x29b, 0x10); // Hyrule Castle Tree
    updatechest(40, 0x29d, 0x10); // Wooden Bridge Tree
    updatechest(41, 0x29e, 0x10); // Eastern Palace Tree
    updatechest(42, 0x2aa, 0x10); // Flute Boy South Tree
    updatechest(43, 0x2aa, 0x08); // Flute Boy East Tree
    updatechest(44, 0x2ab, 0x10); // Central Bonk Rocks Tree
    updatechest(45, 0x2ae, 0x14); // Tree Line Tree 2
    updatechest(46, 0x2ae, 0x08); // Tree Line Tree 4
    updatechest(47, 0x2b2, 0x10); // Flute Boy Approach South Tree
    updatechest(48, 0x2b2, 0x08); // Flute Boy Approach North Tree
    updatechest(49, 0x2c2, 0x10); // Dark Lumberjack Tree
    updatechest(50, 0x2d1, 0x18); // Dark Fortune Bonk Rocks (2)
    updatechest(51, 0x2d4, 0x10); // Dark Graveyard West Bonk Rocks
    updatechest(52, 0x2d4, 0x08); // Dark Graveyard North Bonk Rocks
    updatechest(53, 0x2d4, 0x04); // Dark Graveyard Tomb Bonk Rocks
    updatechest(54, 0x2d5, 0x10); // Qirn Jump West Tree
    updatechest(55, 0x2d5, 0x08); // Qirn Jump East Tree
    updatechest(56, 0x2d6, 0x10); // Dark Witch Tree
    updatechest(57, 0x2db, 0x10); // Pyramid Area
    updatechest(58, 0x2de, 0x10); // Palace of Darkness Area
    updatechest(59, 0x2ee, 0x10); // Dark Tree Line Tree 2
    updatechest(60, 0x2ee, 0x08); // Dark Tree Line Tree 3
    updatechest(61, 0x2ee, 0x04); // Dark Tree Line Tree 4
    updatechest(62, 0x2f4, 0x10); // Hype Cave Area
    updatechest(63, 0x241, 0x02); // Cold Fairy Statue
    updatechest(64, 0x20d, 0x04); // Chest Game
    updatechest(65, 0x3c9, 0x02); // Bottle Vendor
    updatechest(66, 0x410, 0x10); // Sahasrahla (GP)
    updatechest(67, 0x410, 0x08); // Stump Kid
    updatechest(68, 0x410, 0x04); // Sick Kid
    updatechest(69, 0x3c9, 0x10); // Purple Chest
    updatechest(70, 0x3c9, 0x01); // Hobo
    updatechest(71, 0x411, 0x01); // Ether Tablet
    updatechest(72, 0x411, 0x02); // Bombos Tablet
    updatechest(73, 0x410, 0x20); // Catfish
    updatechest(74, 0x410, 0x02); // King Zora
    updatechest(75, 0x410, 0x01); // Lost Old Man
    updatechest(76, 0x411, 0x20); // Potion Shop
    updatechest(77, 0x1c3, 0x02); // Lost Wood Hideout
    updatechest(78, 0x1c5, 0x02); // Lumberjack
    updatechest(79, 0x1d5, 0x04); // Spectacle Rock Cave
    updatechest(80, 0x237, 0x04); // Cave 45
    updatechest(81, 0x237, 0x02); // Graveyard Ledge
    updatechest(82, 0x24d, 0x02); // Checkerboard Cave
    updatechest(83, 0x24f, 0x04); // Hammer Pegs
    updatechest(84, 0x410, 0x80); // Library
    updatechest(85, 0x411, 0x10); // Mushroom
    updatechest(86, 0x283, 0x40); // Spectacle Rock
    updatechest(87, 0x285, 0x40); // Floating Island
    updatechest(88, 0x2a8, 0x40); // Race Game
    updatechest(89, 0x2b0, 0x40); // Desert Ledge
    updatechest(90, 0x2b5, 0x40); // Lake Hylia Island
    updatechest(91, 0x2ca, 0x40); // Bumper Cave
    updatechest(92, 0x2db, 0x40); // Pyramid
    updatechest(93, 0x2e8, 0x40); // Dig Game
    updatechest(94, 0x301, 0x40); // Zora's Ledge
    updatechest(95, 0x2aa, 0x40); // Dig/Flute Spot
    updatechest(100, 0x411, 0x80); // Magic Bat
    updatechest(101, 0x411, 0x04); // Blacksmith
    updatechest_group(102, [
      [0x22c, 0x10],
      [0x22c, 0x20],
    ]); // Pyramid Fairy Left + Right
    updatechest(103, 0x300, 0x40); // Pedestal
    updatechest_group(105, [
      [0x228, 0x10],
      [0x228, 0x20],
    ]); // Waterfall Fairy Left + Right
    updatechest_group(97, [
      [0x3c6, 0x01],
      [0x0aa, 0x10],
    ]); // Uncle + Passage

    if (flags.autotracking !== "N") {
      updatechest_group(96, [
        [0x022, 0x10],
        [0x022, 0x20],
        [0x022, 0x40],
      ]); // Sewers Left + Middle + Right
      updatechest_group(98, [
        [0x0e4, 0x10],
        [0x0e2, 0x10],
        [0x100, 0x10],
      ]); // Hyrule Castle Map + Boomerang + Zelda
      updatechest(99, 0x024, 0x10); // Sanctuary
      updatechest(104, 0x064, 0x10); // Hyrule Castle - Dark Cross
      updatechest(106, 0x1c0, 0x10); // Castle Tower - Room 03
      updatechest(107, 0x1a0, 0x10); // Castle Tower - Dark Maze
    }
  } else {
    updatechest(0, 0x2bb, 0x40); // Sunken Treasure
    updatechest(1, 0x208, 0x10); // Link's House
    updatechest(2, 0x3c9, 0x02); // Bottle Vendor
    updatechest(3, 0x410, 0x08); // Stump Kid
    updatechest(4, 0x3c9, 0x10); // Purple Chest
    updatechest(5, 0x3c9, 0x01); // Hobo
    updatechest(6, 0x411, 0x01); // Ether Tablet
    updatechest(7, 0x411, 0x02); // Bombos Tablet
    updatechest(8, 0x410, 0x20); // Catfish
    updatechest(9, 0x410, 0x02); // King Zora
    updatechest(10, 0x410, 0x01); // Lost Old Man
    updatechest(11, 0x411, 0x10); // Mushroom
    updatechest(12, 0x283, 0x40); // Spectacle Rock
    updatechest(13, 0x285, 0x40); // Floating Island
    updatechest(14, 0x2a8, 0x40); // Race Game
    updatechest(15, 0x2b0, 0x40); // Desert Ledge
    updatechest(16, 0x2b5, 0x40); // Lake Hylia Island
    updatechest(17, 0x2ca, 0x40); // Bumper Cave
    updatechest(18, 0x2db, 0x40); // Pyramid
    updatechest(19, 0x2e8, 0x40); // Dig Game
    updatechest(20, 0x301, 0x40); // Zora's Ledge
    updatechest(21, 0x2aa, 0x40); // Dig/Flute Spot
    updatechest(22, 0x300, 0x40); // Pedestal
    updatechest(23, 0x280, 0x10); // Lost Woods Hideout Tree
    updatechest(24, 0x285, 0x10); // Death Mountain Bonk Rocks
    updatechest(25, 0x28a, 0x10); // Mountain Entry Pull Tree
    updatechest(26, 0x28a, 0x08); // Mountain Entry Southeast Tree
    updatechest(27, 0x290, 0x10); // Lost Woods Pass West Tree
    updatechest(28, 0x290, 0x08); // Kakariko Portal Tree
    updatechest(29, 0x291, 0x10); // Fortune Bonk Rocks
    updatechest(30, 0x292, 0x10); // Kakariko Pond Tree
    updatechest(31, 0x293, 0x10); // Bonk Rocks Tree
    updatechest(32, 0x293, 0x08); // Sanctuary Tree
    updatechest(33, 0x295, 0x10); // River Bend West Tree
    updatechest(34, 0x295, 0x08); // River Bend East Tree
    updatechest(35, 0x298, 0x10); // Blinds Hideout Tree
    updatechest(36, 0x298, 0x08); // Kakariko Welcome Tree
    updatechest(37, 0x29a, 0x10); // Forgotten Forest Southwest Tree
    updatechest(38, 0x29a, 0x08); // Forgotten Forest Central Tree
    updatechest(39, 0x29b, 0x10); // Hyrule Castle Tree
    updatechest(40, 0x29d, 0x10); // Wooden Bridge Tree
    updatechest(41, 0x29e, 0x10); // Eastern Palace Tree
    updatechest(42, 0x2aa, 0x10); // Flute Boy South Tree
    updatechest(43, 0x2aa, 0x08); // Flute Boy East Tree
    updatechest(44, 0x2ab, 0x10); // Central Bonk Rocks Tree
    updatechest(45, 0x2ae, 0x14); // Tree Line Tree 2
    updatechest(46, 0x2ae, 0x08); // Tree Line Tree 4
    updatechest(47, 0x2b2, 0x10); // Flute Boy Approach South Tree
    updatechest(48, 0x2b2, 0x08); // Flute Boy Approach North Tree
    updatechest(49, 0x2c2, 0x10); // Dark Lumberjack Tree
    updatechest(50, 0x2d1, 0x18); // Dark Fortune Bonk Rocks (2)
    updatechest(51, 0x2d4, 0x10); // Dark Graveyard West Bonk Rocks
    updatechest(52, 0x2d4, 0x08); // Dark Graveyard North Bonk Rocks
    updatechest(53, 0x2d4, 0x04); // Dark Graveyard Tomb Bonk Rocks
    updatechest(54, 0x2d5, 0x10); // Qirn Jump West Tree
    updatechest(55, 0x2d5, 0x08); // Qirn Jump East Tree
    updatechest(56, 0x2d6, 0x10); // Dark Witch Tree
    updatechest(57, 0x2db, 0x10); // Pyramid Area
    updatechest(58, 0x2de, 0x10); // Palace of Darkness Area
    updatechest(59, 0x2ee, 0x10); // Dark Tree Line Tree 2
    updatechest(60, 0x2ee, 0x08); // Dark Tree Line Tree 3
    updatechest(61, 0x2ee, 0x04); // Dark Tree Line Tree 4
    updatechest(62, 0x2f4, 0x10); // Hype Cave Area
  }

  if ("pseudoboots" in data && flags.pseudoboots === "N" && data["pseudoboots"][0] === 0x01 && !items.boots) {
    flags.pseudoboots = "Y";
    document.getElementById("pseudoboots").style.display = "block";
    document.getElementById("pseudoboots").style.visibility = "visible";
  }

  function update_boss(boss, offset) {
    if (newbit(offset, 0x08) && !items[boss]) {
      click_map();
      toggle(boss);
      if ((NO_ROM_READS || PENDANT_SWAP_BUG_PRESENT) && ["N", "O"].includes(flags.glitches)) {
        collect_prize(boss.slice(-1));
      }
    }
  }
  update_boss("boss0", 0x191); // Eastern Palace
  update_boss("boss1", 0x067); // Desert Palace
  update_boss("boss2", 0x00f); // Hera
  update_boss("boss3", 0x0b5); // Palace of Darkness
  update_boss("boss4", 0x00d); // Swamp Palace
  update_boss("boss5", 0x053); // Skull Woods
  update_boss("boss6", 0x159); // Thieves Town
  update_boss("boss7", 0x1bd); // Ice Palace
  update_boss("boss8", 0x121); // Misery Mire
  update_boss("boss9", 0x149); // Turtle Rock
  update_boss("agahnim2", 0x01b); // Ganons Tower

  function updatesmallkeys(dungeon, offset) {
    if (changed(offset) && flags.doorshuffle !== "C") {
      var label = "smallkey" + dungeon;
      var newkeys = autotrackPrevData === null ? data["rooms_inv"][offset] : data["rooms_inv"][offset] - autotrackPrevData["rooms_inv"][offset] + items[label];
      if (newkeys > items[label]) {
        document.getElementById(label).style.color = newkeys === items.range[label].max ? "green" : "white";
        document.getElementById(label).innerHTML = newkeys;
        items[label] = newkeys;
        updateMapTracker();
      }
    }
  }
  updatesmallkeys("0", 0x4e2); // Eastern Palace
  updatesmallkeys("1", 0x4e3); // Desert Palace
  updatesmallkeys("2", 0x4ea); // Tower of Hera
  updatesmallkeys("3", 0x4e6); // Palace of Darkness
  updatesmallkeys("4", 0x4e5); // Swamp Palace
  updatesmallkeys("5", 0x4e8); // Skull Woods
  updatesmallkeys("6", 0x4eb); // Thieves Town
  updatesmallkeys("7", 0x4e9); // Ice Palace
  updatesmallkeys("8", 0x4e7); // Misery Mire
  updatesmallkeys("9", 0x4ec); // Turtle Rock
  updatesmallkeys("10", 0x4ed); // GT
  updatesmallkeys("11", 0x4e1); // Sewers and Hyrule Castle
  updatesmallkeys("12", 0x4e4); // Castle Tower

  function updatebigkey(dungeon, offset, mask) {
    if (newbit(offset, mask) && !items["bigkey" + dungeon]) {
      click_map();
      toggle("bigkey" + dungeon);
    }
  }
  updatebigkey("0", 0x367, 0x20);
  updatebigkey("1", 0x367, 0x10);
  updatebigkey("2", 0x366, 0x20);
  updatebigkey("3", 0x367, 0x02);
  updatebigkey("4", 0x367, 0x04);
  updatebigkey("5", 0x366, 0x80);
  updatebigkey("6", 0x366, 0x10);
  updatebigkey("7", 0x366, 0x40);
  updatebigkey("8", 0x367, 0x01);
  updatebigkey("9", 0x366, 0x08);
  updatebigkey("10", 0x366, 0x04);
  updatebigkey("11", 0x367, 0xc0);
  updatebigkey("12", 0x367, 0x08);

  function setitem(item, value) {
    let maxLoop = 100; // Prevent infinite loop
    click_map();
    while (items[item] != value && maxLoop > 0) {
      toggle(item);
      maxLoop--;
    }
    if (maxLoop <= 0) {
      console.error(`Infinite loop detected while setting item ${item} to ${value}`);
    }
  }

  if (changed(0x343))
    // Bombs
    setitem("bomb", data["rooms_inv"][0x343] > 0);

  if (changed(0x3c5) && data["rooms_inv"][0x3c5] >= 3)
    // Agahnim Killed
    setitem("agahnim", true);

  if (data["fork"] == "PH") {
    // PRACHACK/VANILLA
    if (changed(0x340)) setitem("bow", data["rooms_inv"][0x340] == 0x02 ? 2 : data["rooms_inv"][0x340] == 0x04 ? 3 : 0);
    if (changed(0x341)) setitem("boomerang", data["rooms_inv"][0x341]);
    if (changed(0x344)) {
      if (data["rooms_inv"][0x344] == 0x01) {
        setitem("mushroom", 1);
      } else if (data["rooms_inv"][0x344] == 0x02) {
        setitem("powder", true);
        setitem("mushroom", 2);
      }
    }

    if (changed(0x34c)) {
      if (data["rooms_inv"][0x34c] == 0x01) {
        setitem("shovel", true);
      } else if (data["rooms_inv"][0x34c] == 0x02) {
        setitem("flute", 1);
        setitem("shovel", false);
      } else if (data["rooms_inv"][0x34c] == 0x03) {
        setitem("flute", 2);
        setitem("shovel", false);
      }
    }
  } else {
    // RANDO
    if (newbit(0x38e, 0xc0)) {
      var bits = data["rooms_inv"][0x38e] & 0xc0;
      setitem("bow", bits == 0x40 && flags.nonprogressivebows ? 1 : bits == 0x80 ? 2 : 3);
    }

    if (newbit(0x38c, 0xc0)) {
      var bits = data["rooms_inv"][0x38c] & 0xc0;
      setitem("boomerang", bits == 0x80 ? 1 : bits == 0x40 ? 2 : 3);
    }

    if (changed(0x38c)) {
      setitem("mushroom", (data["rooms_inv"][0x38c] & 0x28) == 0x28 ? 1 : (data["rooms_inv"][0x38c] & 0x28) == 0x08 ? 2 : 0);
      var fluteState = data["rooms_inv"][0x38c] & 0x03;
      setitem("flute", fluteState == 0x01 || fluteState == 0x03 ? 2 : fluteState == 0x02 ? 1 : 0);
      if (fluteState == 0x01 && window.doorWindow && !window.doorWindow.closed) {
        window.doorWindow.postMessage("FLUTEACTIVATED", "*");
      }
    }

    if (newbit(0x38c, 0x10)) setitem("powder", true);
    if (newbit(0x38c, 0x04)) setitem("shovel", true);
  }

  if (newbit(0x342, 0x01)) setitem("hookshot", true);
  if (newbit(0x345, 0x01)) setitem("firerod", true);
  if (newbit(0x346, 0x01)) setitem("icerod", true);
  if (newbit(0x347, 0x01)) setitem("bombos", true);
  if (newbit(0x348, 0x01)) setitem("ether", true);
  if (newbit(0x349, 0x01)) setitem("quake", true);
  if (newbit(0x34a, 0x01)) setitem("lantern", true);
  if (newbit(0x34b, 0x01)) setitem("hammer", true);
  if (newbit(0x34d, 0x01)) setitem("net", true);
  if (newbit(0x34e, 0x01)) setitem("book", true);
  if (newbit(0x350, 0x01)) setitem("somaria", true);
  if (newbit(0x351, 0x01)) setitem("byrna", true);
  if (newbit(0x352, 0x01)) setitem("cape", true);
  if (newbit(0x353, 0x02)) setitem("mirror", true);
  if (newbit(0x355, 0x01)) setitem("boots", true);
  if (newbit(0x356, 0x01)) setitem("flippers", true);
  if (newbit(0x357, 0x01)) setitem("moonpearl", true);
  if (changed(0x354)) setitem("glove", data["rooms_inv"][0x354]);
  if (changed(0x359)) setitem("sword", flags["swordmode"] === "S" || data["rooms_inv"][0x359] == 0xff ? 0 : data["rooms_inv"][0x359]);
  if (changed(0x35a)) setitem("shield", data["rooms_inv"][0x35a]);
  if (changed(0x35b)) setitem("tunic", data["rooms_inv"][0x35b] + 1);
  if (changed(0x36b)) setitem("heartpiece", data["rooms_inv"][0x36b]);
  if (changed(0x37b)) setitem("magic", data["rooms_inv"][0x37b] > 0);

  if (flags.wildmaps) {
    if (newbit(0x369, 0x20) && prizes[0] === 0) setmap(0, 5);
    if (newbit(0x369, 0x10) && prizes[1] === 0) setmap(1, 5);
    if (newbit(0x368, 0x20) && prizes[2] === 0) setmap(2, 5);
    if (newbit(0x369, 0x02) && prizes[3] === 0) setmap(3, 5);
    if (newbit(0x369, 0x04) && prizes[4] === 0) setmap(4, 5);
    if (newbit(0x368, 0x80) && prizes[5] === 0) setmap(5, 5);
    if (newbit(0x368, 0x10) && prizes[6] === 0) setmap(6, 5);
    if (newbit(0x368, 0x40) && prizes[7] === 0) setmap(7, 5);
    if (newbit(0x369, 0x01) && prizes[8] === 0) setmap(8, 5);
    if (newbit(0x368, 0x08) && prizes[9] === 0) setmap(9, 5);
  }

  if (flags.wildcompasses) {
    if (newbit(0x365, 0x20) && enemizer[0] === 0) setcompass(0, 11);
    if (newbit(0x365, 0x10) && enemizer[1] === 0) setcompass(1, 11);
    if (newbit(0x364, 0x20) && enemizer[2] === 0) setcompass(2, 11);
    if (newbit(0x365, 0x02) && enemizer[3] === 0) setcompass(3, 11);
    if (newbit(0x365, 0x04) && enemizer[4] === 0) setcompass(4, 11);
    if (newbit(0x364, 0x80) && enemizer[5] === 0) setcompass(5, 11);
    if (newbit(0x364, 0x10) && enemizer[6] === 0) setcompass(6, 11);
    if (newbit(0x364, 0x40) && enemizer[7] === 0) setcompass(7, 11);
    if (newbit(0x365, 0x01) && enemizer[8] === 0) setcompass(8, 11);
    if (newbit(0x364, 0x08) && enemizer[9] === 0) setcompass(9, 11);
  }

  function setmap(dungeon, value) {
    rightClickPrize(dungeon);
  }

  function setcompass(dungeon, value) {
    rightClickEnemy(dungeon);
  }

  for (let i = 1; i <= 4; i++) {
    const bottleLoc = 0x35c + i - 1;
    if (changed(bottleLoc)) {
      setitem(`bottle${i}`, Math.max(0, data["rooms_inv"][bottleLoc] - 1));
    }
  }
}
