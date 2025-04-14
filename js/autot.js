var autotrackHost = null;
var autotrackSocket = null;
var autotrackDeviceName = "";

var autotrackReconnectTimer = null;
var autotrackTimer = null;

var autotrackPrevData = null;

var autotrackRefreshInterval = 1000;
var autotrackTimeoutDelay = 10000;

var currentGame = null;

var GAME_CHECK_LOC = 0xe033fe;

var WRAM_START = 0xf50000;
var WRAM_SIZE = 0x20000;

var NATIVE_LTTP_SRAM = 0xf5f000;
var FOREIGN_LTTP_SRAM = 0xe03b40;

var NATIVE_SM_SRAM = 0xf509a4;
var FOREIGN_SM_SRAM = 0xe03902;

var NATIVE_SM_BOSSES_KEYS = 0xf5d828;
var FOREIGN_SM_BOSSES_KEYS = 0xe03968;
// 0xa17970

var NATIVE_SM_MOTHERBRAIN = 0xe03402;
//0xa17402

var NATIVE_LTTP_GANON = 0xe03506;
// 0xa17506

var NATIVE_SM_AMMO = 0xf509c0; // 0xF509C2
var FOREIGN_SM_AMMO = 0xe0391e;
// 0xa17920

var NATIVE_SM_ROOMS = 0xf5d870;
var FOREIGN_SM_ROOMS = 0xe107ce; // Likely very wrong

var LTTP_GAME_MODE = 0xf50010;
var SM_GAME_MODE = 0xf50998;

var SAVEDATA_START = WRAM_START + 0xf000;
var SAVEDATA_SIZE = 0x500;
var POTDATA_START = SAVEDATA_START + 0x7018;
var SPRITEDATA_START = SAVEDATA_START + 0x7268;
var PSEUDOBOOTS_LOC = 0x18008e;
var RANDOVERSION_LOC = 0x7fc0; // Actually ROM name
var ORVERSION_LOC = 0x150010;
var DRFLAGS_LOC = 0x138004; // Actually DRFlags

var PRIZES_LOC = 0x42a09b; // Pendant/Crystal number data
var PRIZES2_LOC = 0x400050; // Pendant/Crystal data
var KEYSANITY_LOC = 0x18016a; // Keysanity flags

var SM_PRIZES_LOC = 0x326000;

var CONFIGURING = false;

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
  token: {
    0x1: "t1",
    0x2: "t2",
    0x4: "t3",
    0x8: "t4",
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

function autotrackSetStatus(text) {
  document.getElementById("autotrackingstatus").textContent = "Autotracking Status: " + text;
}

function autotrackTrackerConfigure() {
  const port = document.getElementById("autotrackingport").value;
  autotrackConnect("ws://localhost:" + port, true);
  CONFIGURING = true;
}

function autotrackConnect(host = "ws://localhost:" + flags.trackingport) {
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
  if (config_data["mainflags"][0x175] == 0x01) {
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

function parseDoorShuffle(config_data) {
  if ((config_data["drflags"][0x01] & 0x02) === 0) {
    if (config_data["potflags"][0x00] === 1) {
      return "pots";
    }
    return "none";
  } else {
    if ((config_data["drflags"][0x01] & 0x04) === 0) {
      return "basic";
    } else {
      return "crossed";
    }
  }
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
    } else if (["DR", "OD"].includes(hashChars.slice(0, 2) && (config_data["drflags"][1] & 0x1) === 1)) {
      MYSTERY_SEED = true;
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
    snesreadsave(0x28aa56, 0x1, config_data, "potflags", readEnemizerFlags);
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

    if (MYSTERY_SEED) {
      loadmysterypreset();
      autotrackSetStatus("Mystery seed detected. Mystery preset loaded and starting items configured.");
      return;
    }

    // Gameplay
    if (parseWorldState(config_data)) {
      document.getElementById("gametype" + parseWorldState(config_data)).checked = true;
    }

    if ((config_data["mainflags"][0x211] & 0x02) !== 0) {
      document.getElementById("entrancesimple").checked = true;
    } else {
      document.getElementById("entrancenone").checked = true;
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
  data["lttp_rooms_inv"] = new Uint8Array(0x280 * 2);

  snesreadsave(GAME_CHECK_LOC, 1, data, "currentgame", handleCurrentGame);

  function handleCurrentGame() {
    if (data["currentgame"][0] == 0x00) {
      autotrackSetStatus("[ALTTP] Connected to " + autotrackDeviceName);
      currentGame = "alttp";
    } else if (data["currentgame"][0] == 0xff) {
      autotrackSetStatus("[SM] Connected to " + autotrackDeviceName);
      currentGame = "sm";
    } else {
      autotrackSetStatus("[No Game] Connected to " + autotrackDeviceName);
      currentGame = null;
      autotrackStartTimer();
      return;
    }
    addGamemode(data["currentgame"][0]);
  }

  function addGamemode() {
    gamemodeAddr = currentGame === "alttp" ? LTTP_GAME_MODE : SM_GAME_MODE;
    snesreadsave(gamemodeAddr, 1, data, "gamemode", handleGameMode);
  }

  function handleGameMode() {
    var gamemode = data["gamemode"][0];
    if ((currentGame === "alttp" && ![0x07, 0x09, 0x0b].includes(gamemode)) || (currentGame === "sm" && gamemode !== 0x08)) {
      autotrackStartTimer();
      return;
    }
    if (currentGame === "alttp") {
      addMainAutoTrackData1();
    } else {
      addMainAutoTrackDataMinimal();
    }
  }

  function addMainAutoTrackDataMinimal() {
    snesreadsave(FOREIGN_LTTP_SRAM, 0x50, data, "lttp_rooms_inv_sm", handleMinimalAutoTrackData);
  }

  function handleMinimalAutoTrackData() {
    for (var i = 0; i < 0x50; i++) {
      data["lttp_rooms_inv"][i + 0x340] = data["lttp_rooms_inv_sm"][i];
    }
    addSMRoomData();
  }

  function addMainAutoTrackData1() {
    snesreadsave(NATIVE_LTTP_SRAM, 0x280, data, "lttp_rooms_inv", addMainAutoTrackData2);
  }

  function addMainAutoTrackData2() {
    snesreadsave(NATIVE_LTTP_SRAM + 0x280, 0x280, data, "lttp_rooms_inv", addSMRoomData, (merge = true));
  }

  function addSMRoomData() {
    if (currentGame === "sm") {
      snesreadsave(NATIVE_SM_ROOMS, 0x16, data, "sm_rooms", addSMItemData);
    } else {
      data["sm_rooms"] = new Uint8Array(0x16);
      addSMItemData();
    }
  }

  function addSMItemData() {
    snesreadsave(currentGame === "sm" ? NATIVE_SM_SRAM : FOREIGN_SM_SRAM, 0x10, data, "sm_items", addSMKeyData);
  }

  function addSMKeyData() {
    snesreadsave(currentGame === "sm" ? NATIVE_SM_BOSSES_KEYS : FOREIGN_SM_BOSSES_KEYS, 0x10, data, "sm_bosses_keys", addSMAmmoData);
  }

  function addSMAmmoData() {
    snesreadsave(currentGame === "sm" ? NATIVE_SM_AMMO : FOREIGN_SM_AMMO, 0x16, data, "sm_ammo", addBossData);
  }

  function addBossData() {
    if (currentGame === "sm") {
      snesreadsave(NATIVE_SM_MOTHERBRAIN, 0x01, data, "sm_motherbrain", addPrizeData);
    } else {
      snesreadsave(NATIVE_LTTP_GANON, 0x01, data, "lttp_ganon", addPrizeData);
    }
  }

  function addPrizeData() {
    snesreadsave(PRIZES_LOC, 0xd, data, "prizes", addPrize2Data);
  }

  function addPrize2Data() {
    snesreadsave(PRIZES2_LOC, 0xd, data, "prizes", addSMPrizeData, (merge = true));
  }

  function addSMPrizeData() {
    snesreadsave(SM_PRIZES_LOC, 0x20, data, "sm_prizes", handleSMPrizeData);
  }

  function handleSMPrizeData() {
    let _sm = data["sm_prizes"];
    let _new = new Uint8Array(8);
    _new[0] = _sm[0x02];
    _new[1] = _sm[0x0a];
    _new[2] = _sm[0x12];
    _new[3] = _sm[0x1a];
    _new[4] = _sm[0x00];
    _new[5] = _sm[0x08];
    _new[6] = _sm[0x10];
    _new[7] = _sm[0x18];
    data["sm_prizes"] = _new;
    handleAutoTrackData();
  }

  function handleAutoTrackData() {
    // If autotracking is set to "Old", we get the second half of lttp_rooms_inv data, else we're getting the pseudoboots flag
    autotrackDoTracking(data);
    autotrackPrevData = data;
    autotrackStartTimer();
  }
}

let mushroom_collected = false;

function autotrackDoTracking(data) {
  function changed(offset, data_loc = "lttp_rooms_inv") {
    return autotrackPrevData === null || autotrackPrevData[data_loc][offset] !== data[data_loc][offset];
  }

  function changed_twobits(offset, data_loc = "sm_ammo") {
    return autotrackPrevData === null || autotrackPrevData[data_loc][offset] !== data[data_loc][offset] || autotrackPrevData[data_loc][offset + 1] !== data[data_loc][offset + 1];
  }

  function disabledbit(offset, mask, data_loc = "lttp_rooms_inv") {
    return (data[data_loc][offset] & mask) === 0 && (autotrackPrevData === null || (autotrackPrevData[data_loc][offset] & mask) !== 0);
  }

  function newbit(offset, mask, data_loc = "lttp_rooms_inv") {
    return (data[data_loc][offset] & mask) !== 0 && (autotrackPrevData === null || autotrackPrevData[data_loc] === undefined || (autotrackPrevData[data_loc][offset] & mask) !== (data[data_loc][offset] & mask));
  }

  function newbit_group(locations, data_loc = "lttp_rooms_inv") {
    var activated = false;
    for (const location of locations) {
      if ((data[data_loc][location[0]] & location[1]) === 0) return false;
      if (autotrackPrevData === null || (autotrackPrevData[data_loc][location[0]] & location[1]) === 0) activated = true;
    }
    return activated;
  }

  function updatechest(chest, offset, mask, data_loc = "lttp_rooms_inv") {
    if (flags.autotracking !== "Y") return;
    if (newbit(offset, mask, data_loc) && !chests[chest].is_opened) toggle_chest(chest);
  }
  function updatechest_group(chest, locations, data_loc = "lttp_rooms_inv") {
    if (flags.autotracking !== "Y") return;
    if (newbit_group(locations, data_loc) && !chests[chest].is_opened) toggle_chest(chest);
  }

  function checkItem(data, item, data_loc = "lttp_rooms_inv") {
    return (data[data_loc][item[0]] & item[1]) !== 0;
  }

  // Decrement dungeon count unless a non-wild dungeon item is found
  if (flags.doorshuffle === "N" || flags.doorshuffle === "P") {
    Object.entries(window.dungeonDataMem).forEach(([dungeon, dungeondata]) => {
      if (items[dungeondata["dungeonarrayname"]] > 0) {
        let newCheckedLocationCount = dungeondata.locations.filter((location) => checkItem(data, location)).length;
        if (flags.doorshuffle === "P") {
          newCheckedLocationCount += dungeondata.keypots.filter((location) => checkItem(data, location, "potdata")).length;
          newCheckedLocationCount += dungeondata.keydrops.filter((location) => checkItem(data, location, "spritedata")).length;
        }
        let newDungeonItemCount = 0;

        if (!flags.wildcompasses && checkItem(data, dungeondata.compass)) {
          newDungeonItemCount++;
        }
        if (!flags.wildbigkeys && checkItem(data, dungeondata.bigkey)) {
          newDungeonItemCount++;
        }
        if (!flags.wildmaps && checkItem(data, dungeondata.map)) {
          newDungeonItemCount++;
        }
        if (!flags.wildkeys) {
          let keyCount = data["lttp_rooms_inv"][dungeondata.smallkeys];
          if (dungeon === "toh") {
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

  dungeonPrizes = {};
  if (currentGame === "alttp") {
    Object.entries(window.dungeonDataMem).forEach(([dungeon, dungeondata]) => {
      if ("prize" in dungeondata) {
        let prizeTypeValue;
        if (["ri", "ph", "dr", "kr"].includes(dungeon)) {
          prizeTypeValue = data["sm_prizes"][dungeondata.prize + 4];
        } else {
          prizeTypeValue = data["prizes"][dungeondata.prize + 0xd];
        }
        var prizeType;
        switch (prizeTypeValue) {
          case 0x00:
            prizeType = "pendant";
            break;
          case 0x40:
            prizeType = "crystal";
            break;
          case 0x80:
            prizeType = "token";
            break;
          default:
            prizeType = "unknown";
            break;
        }
        let prize;
        if (["ri", "ph", "dr", "kr"].includes(dungeon)) {
          prize = prizemap[prizeType][data["sm_prizes"][dungeondata.prize]];
        } else {
          prize = prizemap[prizeType][data["prizes"][dungeondata.prize]];
        }
        dungeonPrizes[`${prizeType}${prize}`] = dungeondata.dungeonprize;
      }
    });
    Object.entries(prizemap).forEach(([prizeType, prizes]) => {
      Object.entries(prizes).forEach(([mask, prize]) => {
        switch (prizeType) {
          case "pendant":
            data_loc = "lttp_rooms_inv";
            mem_loc = 0x374;
            break;
          case "crystal":
            data_loc = "lttp_rooms_inv";
            mem_loc = 0x37a;
            break;
          case "token":
            data_loc = "sm_bosses_keys";
            mem_loc = 0x0a;
            break;
        }

        if (newbit(mem_loc, mask, data_loc)) {
          const dungeonNum = dungeonPrizes[`${prizeType}${prize}`];
          if (dungeonNum === undefined) {
            return;
          }
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
            case "prize-5":
              if (prizeType === "token") {
                return;
              }
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
            case "t1":
            case "t2":
            case "t3":
            case "t4":
              set_prize(dungeonNum, 5);
              break;
            default:
              set_prize(dungeonNum, 6);
              break;
          }
        }
      });
    });
  }

  if (flags.entrancemode === "N") {
    // Z3 location
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

    // SM locations
    updatechest(120, 0x0, 0x20, (data_loc = "sm_rooms")); // Gauntlet E-Tank
    updatechest(121, 0x1, 0x04, (data_loc = "sm_rooms")); // Back of Gauntlet - Left
    updatechest(122, 0x1, 0x02, (data_loc = "sm_rooms")); // Back of Gauntlet - Right
    updatechest(123, 0x1, 0x01, (data_loc = "sm_rooms")); // Terminator E-Tank
    updatechest(124, 0x0, 0x01, (data_loc = "sm_rooms")); // Crateria Power Bomb
    updatechest(125, 0x0, 0x80, (data_loc = "sm_rooms")); // Bomb Torizo
    updatechest(126, 0x1, 0x10, (data_loc = "sm_rooms")); // 230 Missile
    updatechest(127, 0x1, 0x08, (data_loc = "sm_rooms")); // Climb Super
    updatechest(128, 0x0, 0x40, (data_loc = "sm_rooms")); // Old Mother Brain Missile
    updatechest(129, 0x0, 0x10, (data_loc = "sm_rooms")); // Moat Missile
    updatechest(130, 0x0, 0x04, (data_loc = "sm_rooms")); // Sky Missile
    updatechest(131, 0x0, 0x08, (data_loc = "sm_rooms")); // Maze Missile
    updatechest(132, 0x0, 0x02, (data_loc = "sm_rooms")); // Ocean Missile
    updatechest(133, 0x1, 0x80, (data_loc = "sm_rooms")); // Early Super Bridge Missile
    updatechest(134, 0x2, 0x02, (data_loc = "sm_rooms")); // Brinstar Reserve
    updatechest(135, 0x2, 0x08, (data_loc = "sm_rooms")); // Brinstar Reserve Front Missile
    updatechest(136, 0x2, 0x04, (data_loc = "sm_rooms")); // Brinstar Reserve Back Missile
    updatechest(137, 0x2, 0x01, (data_loc = "sm_rooms")); // Early Super
    updatechest(138, 0x3, 0x40, (data_loc = "sm_rooms")); // Etecoons E-Tank
    updatechest(139, 0x3, 0x80, (data_loc = "sm_rooms")); // Etecoons Super
    updatechest(140, 0x1, 0x20, (data_loc = "sm_rooms")); // Etecoons Power Bomb
    updatechest(141, 0x2, 0x20, (data_loc = "sm_rooms")); // Mission Impossible Missile
    updatechest(142, 0x3, 0x01, (data_loc = "sm_rooms")); // Mission Impossible Power Bomb
    updatechest(143, 0x4, 0x08, (data_loc = "sm_rooms")); // Wave Gate E-Tank
    updatechest(144, 0x1, 0x40, (data_loc = "sm_rooms")); // Spore Spawn Super
    updatechest(145, 0x2, 0x40, (data_loc = "sm_rooms")); // Charge Missile
    updatechest(146, 0x2, 0x80, (data_loc = "sm_rooms")); // Charge Beam
    updatechest(147, 0x4, 0x02, (data_loc = "sm_rooms")); // Waterway E-Tank
    updatechest(148, 0x3, 0x02, (data_loc = "sm_rooms")); // Pipe Missile
    updatechest(149, 0x3, 0x08, (data_loc = "sm_rooms")); // Behind Morph Power Bomb
    updatechest(150, 0x3, 0x04, (data_loc = "sm_rooms")); // Morph Ball Pedestal
    updatechest(151, 0x4, 0x04, (data_loc = "sm_rooms")); // Alpha Missile
    updatechest(152, 0x3, 0x20, (data_loc = "sm_rooms")); // Blue Brinstar Ceiling E-Tank
    updatechest(153, 0x3, 0x10, (data_loc = "sm_rooms")); // Beta Missile
    updatechest_group(
      154,
      [
        [0x4, 0x10],
        [0x4, 0x20],
      ],
      (data_loc = "sm_rooms")
    ); // Billy Mays Front Missile
    updatechest(155, 0x5, 0x01, (data_loc = "sm_rooms")); // Alpha Power Bomb
    updatechest(156, 0x5, 0x02, (data_loc = "sm_rooms")); // Alpha Power Bomb Missile
    updatechest(157, 0x4, 0x80, (data_loc = "sm_rooms")); // Beta Power Bomb
    updatechest(158, 0x4, 0x40, (data_loc = "sm_rooms")); // X-Ray Scope
    updatechest(159, 0x5, 0x04, (data_loc = "sm_rooms")); // Spazer
    updatechest(160, 0x5, 0x10, (data_loc = "sm_rooms")); // Kraid Missile
    updatechest(161, 0x6, 0x01, (data_loc = "sm_rooms")); // Varia Suit
    updatechest(162, 0x5, 0x08, (data_loc = "sm_rooms")); // Kraid E-Tank
    updatechest(163, 0x10, 0x01, (data_loc = "sm_rooms")); // Spooky Missile
    updatechest(164, 0x10, 0x20, (data_loc = "sm_rooms")); // Wrecked Ship Left Super
    updatechest(165, 0x10, 0x40, (data_loc = "sm_rooms")); // Wrecked Ship Right Super
    updatechest(166, 0x10, 0x10, (data_loc = "sm_rooms")); // Wrecked Ship E-Tank
    updatechest(167, 0x10, 0x08, (data_loc = "sm_rooms")); // Attic Missile
    updatechest(168, 0x10, 0x04, (data_loc = "sm_rooms")); // Bowling Missile
    updatechest(169, 0x10, 0x02, (data_loc = "sm_rooms")); // Wrecked Ship Reserve
    updatechest(170, 0x10, 0x80, (data_loc = "sm_rooms")); // Gravity Suit
    updatechest(171, 0x11, 0x01, (data_loc = "sm_rooms")); // Main Street Missile
    updatechest(172, 0x11, 0x02, (data_loc = "sm_rooms")); // Crab Super
    updatechest(173, 0x11, 0x04, (data_loc = "sm_rooms")); // Mama Turtle E-Tank
    updatechest(174, 0x11, 0x08, (data_loc = "sm_rooms")); // Mama Turtle Missile
    updatechest(175, 0x11, 0x40, (data_loc = "sm_rooms")); // Beach Missile
    updatechest_group(
      176,
      [
        [0x11, 0x10],
        [0x11, 0x20],
      ],
      (data_loc = "sm_rooms")
    ); // Watering Hole - Left
    updatechest_group(
      177,
      [
        [0x12, 0x01],
        [0x12, 0x02],
      ],
      (data_loc = "sm_rooms")
    ); // Left Sand Pit Missile
    updatechest(178, 0x12, 0x04, (data_loc = "sm_rooms")); // Right Sand Pit Missile
    updatechest(179, 0x12, 0x08, (data_loc = "sm_rooms")); // Right Sand Pit Power Bomb
    updatechest(180, 0x12, 0x10, (data_loc = "sm_rooms")); // Aqueduct Missile
    updatechest(181, 0x12, 0x20, (data_loc = "sm_rooms")); // Aqueduct Super
    updatechest(182, 0x13, 0x01, (data_loc = "sm_rooms")); // Botwoon E-Tank
    updatechest(183, 0x12, 0x80, (data_loc = "sm_rooms")); // Precious Missile
    updatechest(184, 0x13, 0x04, (data_loc = "sm_rooms")); // Space Jump
    updatechest(185, 0x11, 0x80, (data_loc = "sm_rooms")); // Plasma Beam
    updatechest(186, 0x12, 0x40, (data_loc = "sm_rooms")); // Spring Ball
    updatechest(187, 0x7, 0x01, (data_loc = "sm_rooms")); // Hi-Jump Boots E-Tank
    updatechest(188, 0x6, 0x20, (data_loc = "sm_rooms")); // Hi-Jump Boots
    updatechest(189, 0x6, 0x80, (data_loc = "sm_rooms")); // Hi-Jump Boots Missile
    updatechest(190, 0x6, 0x04, (data_loc = "sm_rooms")); // Ice Beam
    updatechest(191, 0x6, 0x08, (data_loc = "sm_rooms")); // Crumble Shaft Missile
    updatechest(192, 0x6, 0x02, (data_loc = "sm_rooms")); // Cathedral Missile
    updatechest(193, 0x8, 0x01, (data_loc = "sm_rooms")); // Bubble Mountain Corner Missile
    updatechest(194, 0x7, 0x80, (data_loc = "sm_rooms")); // Norfair Reserve Front Missile
    updatechest(195, 0x7, 0x40, (data_loc = "sm_rooms")); // Norfair Reserve Hidden Missile
    updatechest(196, 0x7, 0x20, (data_loc = "sm_rooms")); // Norfair Reserve
    updatechest(197, 0x8, 0x02, (data_loc = "sm_rooms")); // Speed Missile
    updatechest(198, 0x8, 0x04, (data_loc = "sm_rooms")); // Speed Booster
    updatechest(199, 0x8, 0x08, (data_loc = "sm_rooms")); // Wave Missile
    updatechest(200, 0x8, 0x10, (data_loc = "sm_rooms")); // Wave Beam
    updatechest(201, 0x6, 0x10, (data_loc = "sm_rooms")); // Crocomire E-Tank
    updatechest(202, 0x7, 0x02, (data_loc = "sm_rooms")); // Croc Power Bomb
    updatechest(203, 0x7, 0x04, (data_loc = "sm_rooms")); // Cosine Missile
    updatechest(204, 0x7, 0x08, (data_loc = "sm_rooms")); // Indiana Jones Missile
    updatechest(205, 0x7, 0x10, (data_loc = "sm_rooms")); // Grapple Beam
    updatechest(206, 0x6, 0x40, (data_loc = "sm_rooms")); // Croc Escape Missile
    updatechest(207, 0x8, 0x40, (data_loc = "sm_rooms")); // Gold Torizo Missile
    updatechest(208, 0x8, 0x80, (data_loc = "sm_rooms")); // Gold Torizo Super
    updatechest(209, 0x9, 0x80, (data_loc = "sm_rooms")); // Screw Attack
    updatechest(210, 0x9, 0x02, (data_loc = "sm_rooms")); // Mickey Mouse Missile
    updatechest(211, 0xa, 0x01, (data_loc = "sm_rooms")); // Firefleas E-Tank
    updatechest(212, 0x9, 0x04, (data_loc = "sm_rooms")); // Hotarubi Missile
    updatechest(213, 0x9, 0x08, (data_loc = "sm_rooms")); // Jail Power Bomb
    updatechest(214, 0x9, 0x20, (data_loc = "sm_rooms")); // FrankerZ Missile
    updatechest(215, 0x9, 0x10, (data_loc = "sm_rooms")); // Power Bombs of Shame
    updatechest(216, 0x9, 0x40, (data_loc = "sm_rooms")); // Ridley E-Tank
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

  if ("pseudoboots" in data && flags.pseudoboots === "N" && data["pseudoboots"][0] === 0x01) {
    flags.pseudoboots = "Y";
    document.getElementById("pseudoboots").style.display = "block";
    document.getElementById("pseudoboots").style.visibility = "visible";
  }

  function update_boss(boss, offset) {
    if (newbit(offset, 0x08) && !items[boss]) {
      click_map();
      toggle(boss);
      if (boss !== "agahnim2") {
        collect_prize(boss[4]);
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
    if (changed(offset)) {
      var label = "smallkey" + dungeon;
      var newkeys = autotrackPrevData === null ? data["lttp_rooms_inv"][offset] : data["lttp_rooms_inv"][offset] - autotrackPrevData["lttp_rooms_inv"][offset] + items[label];
      if (newkeys > items[label]) {
        document.getElementById(label).style.color = newkeys === items.range[label].max ? "green" : "white";
        document.getElementById(label).innerHTML = newkeys;
        items[label] = newkeys;
        updateMapTracker();
      }
    }
  }
  updatesmallkeys("0", 0x4e2);
  updatesmallkeys("1", 0x4e3);
  updatesmallkeys("2", 0x4ea);
  updatesmallkeys("3", 0x4e6);
  updatesmallkeys("4", 0x4e5);
  updatesmallkeys("5", 0x4e8);
  updatesmallkeys("6", 0x4eb);
  updatesmallkeys("7", 0x4e9);
  updatesmallkeys("8", 0x4e7);
  updatesmallkeys("9", 0x4ec);
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
    click_map();
    while (items[item] != value) {
      toggle(item);
    }
  }

  if (changed(0x343))
    // Bombs
    setitem("bomb", data["lttp_rooms_inv"][0x343] > 0);

  if (changed(0x3c5) && data["lttp_rooms_inv"][0x3c5] >= 3)
    // Agahnim Killed
    setitem("agahnim", true);

  if (changed(0x340) || changed(0x38e)) {
    var bow = data["lttp_rooms_inv"][0x340] > 0;
    var silvers = data["lttp_rooms_inv"][0x38e] & 0x40;
    if (bow && silvers) setitem("bow", 3);
    else if (bow) setitem("bow", 2);
    else if (silvers) setitem("bow", 1);
  }

  if (newbit(0x38c, 0xc0)) {
    var bits = data["lttp_rooms_inv"][0x38c] & 0xc0;
    setitem("boomerang", bits == 0x80 ? 1 : bits == 0x40 ? 2 : 3);
  }

  if (changed(0x38c)) {
    if ((data["lttp_rooms_inv"][0x38c] & 0x20) == 0x20 && !mushroom_collected) {
      mushroom_collected = true;
    }
    setitem("mushroom", mushroom_collected && (data["lttp_rooms_inv"][0x38c] & 0x20) == 0x0 ? 2 : mushroom_collected ? 1 : 0);
    var fluteState = data["lttp_rooms_inv"][0x38c] & 0x03;
    setitem("flute", fluteState == 0x01 || fluteState == 0x03 ? 2 : fluteState == 0x02 ? 1 : 0);
  }
  if (newbit(0x38c, 0x10)) setitem("powder", true);
  if (newbit(0x38c, 0x04)) setitem("shovel", true);
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

  if (changed(0x354)) setitem("glove", data["lttp_rooms_inv"][0x354]);
  if (changed(0x359)) setitem("sword", flags["swordmode"] === "S" || data["lttp_rooms_inv"][0x359] == 0xff ? 0 : data["lttp_rooms_inv"][0x359]);
  if (changed(0x35a)) setitem("shield", data["lttp_rooms_inv"][0x35a]);
  if (changed(0x35b)) setitem("tunic", data["lttp_rooms_inv"][0x35b] + 1);
  if (changed(0x36b)) setitem("heartpiece", data["lttp_rooms_inv"][0x36b]);
  if (changed(0x37b)) setitem("magic", data["lttp_rooms_inv"][0x37b] > 0);

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

  var ammo_checks = {
    etank: 0x04,
    missile: 0x08,
    super: 0x0c,
    powerbomb: 0x10,
    rtank: 0x14,
  };

  for (var ammo in ammo_checks) {
    if (changed_twobits(ammo_checks[ammo])) {
      var newval = data["sm_ammo"][ammo_checks[ammo] + 1] * 0x100 + data["sm_ammo"][ammo_checks[ammo]];
      switch (ammo) {
        case "etank":
          newval -= 99;
          if (newval >= 100) {
            newval /= 100;
          }
          break;
        case "rtank":
          if (newval >= 100) {
            newval /= 100;
          }
          break;
        case "missile":
        case "super":
        case "powerbomb":
          newval /= 5;
          break;
      }
      setItemValue(ammo, newval);
    }
  }

  if (newbit(0x00, 0x01, "sm_items")) {
    setitem("varia", true);
  }

  if (newbit(0x00, 0x02, "sm_items")) {
    setitem("spring", true);
  }

  if (newbit(0x00, 0x04, "sm_items")) {
    setitem("morph", true);
  }

  if (newbit(0x00, 0x08, "sm_items")) {
    setitem("screw", true);
  }

  if (newbit(0x00, 0x20, "sm_items")) {
    setitem("gravity", true);
  }

  if (newbit(0x01, 0x01, "sm_items")) {
    setitem("hijump", true);
  }

  if (newbit(0x01, 0x02, "sm_items")) {
    setitem("space", true);
  }

  if (newbit(0x01, 0x10, "sm_items")) {
    setitem("morphbombs", true);
  }

  if (newbit(0x01, 0x20, "sm_items")) {
    setitem("speed", true);
  }

  if (newbit(0x01, 0x40, "sm_items")) {
    setitem("grapple", true);
  }

  if (newbit(0x01, 0x80, "sm_items")) {
    setitem("xray", true);
  }

  if (newbit(0x04, 0x01, "sm_items")) {
    setitem("wave", true);
  }

  if (newbit(0x04, 0x02, "sm_items")) {
    setitem("ice", true);
  }

  if (newbit(0x04, 0x04, "sm_items")) {
    setitem("spazer", true);
  }

  if (newbit(0x04, 0x08, "sm_items")) {
    setitem("plasma", true);
  }

  if (newbit(0x05, 0x10, "sm_items")) {
    setitem("charge", true);
  }


  if (newbit(0x08, 0x01, "sm_bosses_keys")) {
    setitem("Crateria1", true)
  }
  if (newbit(0x08, 0x02, "sm_bosses_keys")) {
    setitem("Crateria2", true)
  }
  if (newbit(0x08, 0x04, "sm_bosses_keys")) {
    setitem("CrateriaB", true)
  }
  if (newbit(0x08, 0x08, "sm_bosses_keys")) {
    setitem("Brinstar1", true)
  }
  if (newbit(0x08, 0x10, "sm_bosses_keys")) {
    setitem("Brinstar2", true)
  }
  if (newbit(0x08, 0x20, "sm_bosses_keys")) {
    setitem("BrinstarB", true)
  }
  if (newbit(0x08, 0x40, "sm_bosses_keys")) {
    setitem("Norfair1", true)
  }
  if (newbit(0x08, 0x80, "sm_bosses_keys")) {
    setitem("Norfair2", true)
  }
  if (newbit(0x09, 0x01, "sm_bosses_keys")) {
    setitem("NorfairB", true)
  }
  if (newbit(0x09, 0x02, "sm_bosses_keys")) {
    setitem("Maridia1", true)
  }
  if (newbit(0x09, 0x04, "sm_bosses_keys")) {
    setitem("Maridia2", true)
  }
  if (newbit(0x09, 0x08, "sm_bosses_keys")) {
    setitem("MaridiaB", true)
  }
  if (newbit(0x09, 0x10, "sm_bosses_keys")) {
    setitem("WreckedShip1", true)
  }
  if (newbit(0x09, 0x20, "sm_bosses_keys")) {
    setitem("WreckedShipB", true)
  }
  if (newbit(0x09, 0x40, "sm_bosses_keys")) {
    setitem("LowerNorfair1", true)
  }
  if (newbit(0x09, 0x80, "sm_bosses_keys")) {
    setitem("LowerNorfairB", true)
  }


  if (newbit(0x01, 0x01, "sm_bosses_keys")) {
    setitem("kraid", false);
    collect_prize(11);
    toggle_chest(217);
  }

  if (newbit(0x02, 0x01, "sm_bosses_keys")) {
    setitem("ridley", false);
    collect_prize(10);
    toggle_chest(220);
  }

  if (newbit(0x03, 0x01, "sm_bosses_keys")) {
    setitem("phantoon", false);
    collect_prize(12);
    toggle_chest(218);
  }

  if (newbit(0x04, 0x01, "sm_bosses_keys")) {
    setitem("draygon", false);
    collect_prize(13);
    toggle_chest(219);
  }

  if (currentGame === "sm" && newbit(0x00, 0x01, "sm_motherbrain")) {
    setitem("motherbrain", false);
  }

  if (currentGame === "alttp" && newbit(0x00, 0x01, "lttp_ganon")) {
    setitem("ganon", true);
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
      setitem(`bottle${i}`, Math.max(0, data["lttp_rooms_inv"][bottleLoc] - 1));
    }
  }
}
