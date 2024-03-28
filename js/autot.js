var autotrackHost = null;
var autotrackSocket = null;
var autotrackDeviceName = "";

var autotrackReconnectTimer = null;
var autotrackTimer = null;

var autotrackPrevData = null;

var autotrackRefreshInterval = 1000;
var autotrackTimeoutDelay = 10000;

var WRAM_START = 0xF50000;
var WRAM_SIZE = 0x20000;
var SAVEDATA_START = WRAM_START + 0xF000;
var SAVEDATA_SIZE = 0x500;
var POTDATA_START = SAVEDATA_START + 0x7018;
var SPRITEDATA_START = SAVEDATA_START + 0x7268;
var PSEUDOBOOTS_LOC = 0x18008E;
var RANDOVERSION_LOC = 0x138000; // Actually DR
var MYSTERY_LOC = 0x138004; // Actually DRFlags
var PRIZES_LOC = 0x1209B; // Pendant/Crystal number data
var PRIZES2_LOC = 0x180050; // Pendant/Crystal data


const dungeondatamem = {
    "hc": {
        "dungeonarrayname": "chest11",
        "locations": [[0xe4, 0x10], [0xe2, 0x10], [0x100, 0x10], [0x64, 0x10], [0x22, 0x10], [0x22, 0x20], [0x22, 0x40], [0x24, 0x10]],
        "keydrops": [[0xe5, 0x80], [0xe3, 0x40], [0x101, 0x20], [0x43, 0x80]],
        "keypots": [],
        "compass": [0x365, 0x40],
        "bigkey": [0x367, 0x40],
        "map": [0x369, 0x40],
        "smallkeys": 0x4E0
    },
    "ep": {
        "dungeonarrayname": "chest0",
        "locations": [[0x172, 0x10], [0x154, 0x10], [0x150, 0x10], [0x152, 0x10], [0x170, 0x10], [0x191, 0x08]],
        "keydrops": [[0x133, 0x10]],
        "keypots": [[0x175, 0x8]],
        "compass": [0x365, 0x20],
        "bigkey": [0x367, 0x20],
        "map": [0x369, 0x20],
        "smallkeys": 0x4E2,
        "prize": 0x2,
        "dungeonprize": 0
    },
    "dp": {
        "dungeonarrayname": "chest1",
        "locations": [[0xe6, 0x10], [0xe7, 0x04], [0xe8, 0x10], [0x10a, 0x10], [0xea, 0x10], [0x67, 0x08]],
        "keydrops": [],
        "keypots": [[0xc7, 0x4], [0xa7, 0x20], [0x87, 0x1]],
        "compass": [0x365, 0x10],
        "bigkey": [0x367, 0x10],
        "map": [0x369, 0x10],
        "smallkeys": 0x4E3,
        "prize": 0x3,
        "dungeonprize": 1
    },
    "toh": {
        "dungeonarrayname": "chest2",
        "locations": [[0x10f, 0x04], [0xee, 0x10], [0x10e, 0x10], [0x4e, 0x10], [0x4e, 0x20], [0xf, 0x08]],
        "keydrops": [],
        "keypots": [],
        "compass": [0x364, 0x20],
        "bigkey": [0x366, 0x20],
        "map": [0x368, 0x20],
        "smallkeys": 0x4EA,
        "prize": 0xA,
        "dungeonprize": 2
    },
    "at": {
        "dungeonarrayname": "chest12",
        "locations": [[0x1c0, 0x10], [0x1a0, 0x10]],
        "keydrops": [[0x181, 0x10], [0x160, 0x20]],
        "keypots": [],
        "compass": [0x365, 0x08],
        "bigkey": [0x367, 0x08],
        "map": [0x369, 0x08],
        "smallkeys": 0x4E4
    },
    "pod": {
        "dungeonarrayname": "chest3",
        "locations": [[0x12, 0x10], [0x56, 0x10], [0x54, 0x10], [0x54, 0x20], [0x74, 0x10], [0x14, 0x10], [0x34, 0x10], [0x34, 0x20], [0x34, 0x40], [0x32, 0x10], [0x32, 0x20], [0xd4, 0x10], [0xd4, 0x20], [0xb5, 0x08]],
        "keydrops": [],
        "keypots": [],
        "compass": [0x365, 0x02],
        "bigkey": [0x367, 0x02],
        "map": [0x369, 0x02],
        "smallkeys": 0x4E6,
        "prize": 0x6,
        "dungeonprize": 3
    },
    "sp": {
        "dungeonarrayname": "chest4",
        "locations": [[0x50, 0x10], [0x6e, 0x10], [0x6c, 0x10], [0x6a, 0x10], [0x68, 0x10], [0x8c, 0x10], [0xec, 0x10], [0xec, 0x20], [0xcc, 0x10], [0xd, 0x08]],
        "keydrops": [],
        "keypots":[[0x71, 0x10], [0x6f, 0x80], [0x6d, 0x8], [0x6b, 0x80], [0x2c, 0x80]],
        "compass": [0x365, 0x04],
        "bigkey": [0x367, 0x04],
        "map": [0x369, 0x04],
        "smallkeys": 0x4E5,
        "prize": 0x5,
        "dungeonprize": 4
    },
    "sw": {
        "dungeonarrayname": "chest5",
        "locations": [[0xce, 0x10], [0xd0, 0x10], [0xae, 0x10], [0xae, 0x20], [0xb0, 0x10], [0xb0, 0x20], [0xb2, 0x10], [0x53, 0x08]],
        "keydrops": [[0x73, 0x40]],
        "keypots": [[0xac, 0x4]],
        "compass": [0x364, 0x80],
        "bigkey": [0x366, 0x80],
        "map": [0x368, 0x80],
        "smallkeys": 0x4E8,
        "prize": 0x8,
        "dungeonprize": 5
    },
    "tt": {
        "dungeonarrayname": "chest6",
        "locations": [[0x1b6, 0x10], [0x1b6, 0x20], [0x196, 0x10], [0x1b8, 0x10], [0xca, 0x10], [0x8a, 0x10], [0x88, 0x10], [0x159, 0x08]],
        "keydrops": [],
        "keypots": [[0x179, 0x40], [0x157, 0x80]],
        "compass": [0x364, 0x10],
        "bigkey": [0x366, 0x10],
        "map": [0x368, 0x10],
        "smallkeys": 0x4EB,
        "prize": 0xB,
        "dungeonprize": 6
    },
    "ip": {
        "dungeonarrayname": "chest7",
        "locations": [[0x5c, 0x10], [0x7e, 0x10], [0x3e, 0x10], [0xbe, 0x10], [0xfc, 0x10], [0x15c, 0x10], [0x13c, 0x10], [0x1bd, 0x08]],
        "keydrops": [[0x1d, 0x10], [0x7c, 0x80]],
        "keypots": [[0x7f, 0x2], [0x13f, 0x8]],
        "compass": [0x364, 0x40],
        "bigkey": [0x366, 0x40],
        "map": [0x368, 0x40],
        "smallkeys": 0x4E9,
        "prize": 0x9,
        "dungeonprize": 7
    },
    "mm": {
        "dungeonarrayname": "chest8",
        "locations": [[0x144, 0x10], [0x166, 0x10], [0x184, 0x10], [0x182, 0x10], [0x1a2, 0x10], [0x186, 0x10], [0x186, 0x20], [0x121, 0x08]],
        "keydrops": [[0x182, 0x40]],
        "keypots": [[0x167, 0x80], [0x143, 0x80]],
        "compass": [0x365, 0x01],
        "bigkey": [0x367, 0x01],
        "map": [0x369, 0x01],
        "smallkeys": 0x4E7,
        "prize": 0x7,
        "dungeonprize": 8
    },
    "tr": {
        "dungeonarrayname": "chest9",
        "locations": [[0x1ac, 0x10], [0x16e, 0x10], [0x16e, 0x20], [0x16c, 0x10], [0x28, 0x10], [0x48, 0x10], [0x8, 0x10], [0x1aa, 0x10], [0x1aa, 0x20], [0x1aa, 0x40], [0x1aa, 0x80], [0x149, 0x08]],
        "keydrops": [[0x16d, 0x4], [0x27, 0x2]],
        "keypots": [],
        "compass": [0x364, 0x08],
        "bigkey": [0x366, 0x08],
        "map": [0x368, 0x08],
        "smallkeys": 0x4EC,
        "prize": 0xC,
        "dungeonprize": 9
    },
    "gt": {
        "dungeonarrayname": "chest10",
        "locations": [[0x119, 0x04], [0xf6, 0x10], [0xf6, 0x20], [0xf6, 0x40], [0xf6, 0x80], [0x116, 0x10], [0xfa, 0x10], [0xf8, 0x10], [0xf8, 0x20], [0xf8, 0x40], [0xf8, 0x80], [0x118, 0x10], [0x118, 0x20], [0x118, 0x40], [0x118, 0x80], [0x38, 0x10], [0x38, 0x20], [0x38, 0x40], [0x11a, 0x10], [0x13a, 0x10], [0x13a, 0x20], [0x13a, 0x40], [0x13a, 0x80], [0x7a, 0x10], [0x7a, 0x20], [0x7a, 0x40], [0x9a, 0x10]],
        "keydrops": [[0x7b, 0x20]],
        "keypots": [[0x117, 0x40], [0x137, 0x40], [0xf7, 0x8]],
        "compass": [0x364, 0x04],
        "bigkey": [0x366, 0x04],
        "map": [0x368, 0x04],
        "smallkeys": 0x4ED
    }
};

const prizemap = {
    'crystal': {
        0x2: '1',
        0x10: '2',
        0x40: '3',
        0x20: '4',
        0x4: '5',
        0x1: '6',
        0x8: '7',
        0x80: '8'
    },
    'pendant': {
        0x4: 'g',
        0x2: 'b',
        0x1: 'r'
    }
}

let dungeonautotrackCounts = {
    "hc": 0,
    "ep": 0,
    "dp": 0,
    "toh": 0,
    "at": 0,
    "pod": 0,
    "sp": 0,
    "sw": 0,
    "tt": 0,
    "ip": 0,
    "mm": 0,
    "tr": 0,
    "gt": 0
};

function autotrackStartTimer() {
    autotrackTimer = setTimeout(autotrackReadMem, autotrackRefreshInterval);
}

function autotrackSetStatus(text) {
    document.getElementById("autotrackingstatus").textContent = "Autotracking Status: " + text;
}

function autotrackConnect(host="ws://localhost:" + flags.trackingport) {
    if (autotrackSocket !== null || autotrackReconnectTimer !== null) {
        autotrackDisconnect();
        return;
    }

    autotrackHost = host;
    autotrackSocket = new WebSocket(host);
    autotrackSocket.binaryType = 'arraybuffer';

    autotrackSocket.onclose = function(event) {
        autotrackCleanup();
        autotrackSetStatus("Disconnected: " + event.reason);
    }

    autotrackSocket.onerror = function(event) {
        autotrackCleanup();
        autotrackSetStatus("Error");
    }
    
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

    autotrackSocket.send(JSON.stringify({
        Opcode: "DeviceList",
        Space: "SNES"
    }));
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

    autotrackSocket.send(JSON.stringify({
        Opcode : "Attach",
        Space : "SNES",
        Operands : [autotrackDeviceName]
    }));
    autotrackSetStatus("Connected to " + autotrackDeviceName);

    autotrackStartTimer();
}

function autotrackReadMem() {
    function snesread(address, size, callback) {
        autotrackSocket.send(JSON.stringify({
            Opcode : "GetAddress",
            Space : "SNES",
            Operands : [address.toString(16), size.toString(16)]
        }));
        autotrackSocket.onmessage = callback;
    };

    function snesreadsave(address, size, data_loc, nextCallback, merge=false) {
        snesread(address, size, function(event) {
            if (merge) {
                data[data_loc] = new Uint8Array([...data[data_loc], ...new Uint8Array(event.data)]);
            } else {
                data[data_loc] = new Uint8Array(event.data);
            }
            nextCallback();
        })
    }

    if (autotrackReconnectTimer !== null)
        clearTimeout(autotrackReconnectTimer);
    autotrackReconnectTimer = setTimeout(function () {
        autotrackReconnectTimer = null;
        autotrackCleanup();
        autotrackConnect(autotrackHost);
    }, autotrackTimeoutDelay);
    
    snesreadsave(WRAM_START + 0x10, 1, 'gamemode', addMainAutoTrackData1);
    var data = {};

    function addMainAutoTrackData1() {
        var gamemode = data["gamemode"][0];
        if (![0x07, 0x09, 0x0b].includes(gamemode)) {
            autotrackStartTimer();
            return;
        }
        snesreadsave(SAVEDATA_START, 0x280, 'rooms_inv', addMainAutoTrackData2);
    }

    function addMainAutoTrackData2() {
        snesreadsave(SAVEDATA_START + 0x280, 0x280, 
            'rooms_inv',
            flags.autotracking === 'Y' ? addPotData : handleAutoTrackData,
            merge=true);
    }

    function addPotData() {
        snesreadsave(POTDATA_START, 0x250, 'potdata', addSpriteDropData);
    }

    function addSpriteDropData() {
        snesreadsave(SPRITEDATA_START, 0x250, 'spritedata', addPrizeData);
    }

    function addPrizeData() {
        snesreadsave(PRIZES_LOC, 0xD, 'prizes', addPrize2Data);
    }

    function addPrize2Data() {
        snesreadsave(PRIZES2_LOC, 0xD, 'prizes', addRandoVersion, merge=true);
    }

    function addRandoVersion() {
        snesreadsave(RANDOVERSION_LOC, 0x2, 'version', addMysteryFlag);
    }

    function addMysteryFlag() {
        snesreadsave(MYSTERY_LOC, 0x2, 'mystery', addPseudobootsFlag);
    }

    function addPseudobootsFlag() {
        // Check if we're playing DR and that the mystery flag is not set
        if ((data['version'][0] === 68 && data['version'][1] === 82) && (data['mystery'][1] & 0x1) === 0) {
            snesreadsave(PSEUDOBOOTS_LOC, 0x1, 'pseudoboots', handleAutoTrackData);
        } else {
            handleAutoTrackData();
        }
    }

    function handleAutoTrackData() {
        // If autotracking is set to "Old", we get the second half of rooms_inv data, else we're getting the pseudoboots flag
        autotrackDoTracking(data);
        autotrackPrevData = data;
        autotrackStartTimer();
    }
}


function autotrackDoTracking(data) {
    function changed(offset, data_loc = 'rooms_inv') {
        return autotrackPrevData === null || autotrackPrevData[data_loc][offset] !== data[data_loc][offset];
    };
    function disabledbit(offset, mask, data_loc = 'rooms_inv') {
        return (data[data_loc][offset] & mask) === 0 && (autotrackPrevData === null || ((autotrackPrevData[data_loc][offset] & mask) !== 0));
    };
    function newbit(offset, mask, data_loc = 'rooms_inv') {
        return (data[data_loc][offset] & mask) !== 0 && (autotrackPrevData === null || ((autotrackPrevData[data_loc][offset] & mask) !== (data[data_loc][offset] & mask)));
    };
    function newbit_group(locations, data_loc = 'rooms_inv') {
        var activated = false;
        for (const location of locations) {
            if ((data[data_loc][location[0]] & location[1]) === 0)
                return false;
            if (autotrackPrevData === null || ((autotrackPrevData[data_loc][location[0]] & location[1]) === 0))
                activated = true;
        }
        return activated
    };

    function updatechest(chest, offset, mask, data_loc = 'rooms_inv') {
        if (newbit(offset, mask, data_loc) && !chests[chest].is_opened)
            toggle_chest(chest);
    };
    function updatechest_group(chest, locations, data_loc = 'rooms_inv') {
        if (newbit_group(locations, data_loc) && !chests[chest].is_opened)
            toggle_chest(chest);
    };

    function checkItem(data, item, data_loc = 'rooms_inv') {
        return (data[data_loc][item[0]] & item[1]) !== 0;
    }


    // Decrement dungeon count unless a non-wild dungeon item is found 
    if ((flags.doorshuffle === 'N' || flags.doorshuffle === 'P') && flags.autotracking === 'Y') {
        Object.entries(dungeondatamem).forEach(([dungeon, dungeondata]) => {
            if (items[dungeondata["dungeonarrayname"]] > 0) {
                let newCheckedLocationCount = dungeondata.locations.filter(location => checkItem(data, location)).length;
                if (flags.doorshuffle === 'P') {
                    newCheckedLocationCount += dungeondata.keypots.filter(location => checkItem(data, location, 'potdata')).length;
                    newCheckedLocationCount += dungeondata.keydrops.filter(location => checkItem(data, location, 'spritedata')).length;
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
                    newDungeonItemCount += data['rooms_inv'][dungeondata.smallkeys];
                }

                newCheckedLocationCount -= newDungeonItemCount;
                while (newCheckedLocationCount > dungeonautotrackCounts[dungeon]) {
                    dungeonautotrackCounts[dungeon] ++;
                    toggle(dungeondata["dungeonarrayname"]);
                }
            }
        });
    }

    dungeonPrizes = {}
    if (flags.autotracking === 'Y') {
        Object.entries(dungeondatamem).forEach(([dungeon, dungeondata]) => {
            if ('prize' in dungeondata && dungeondata.prize > 0) {
                const prizeType = data['prizes'][dungeondata.prize + 0xD] == 0x40 ? 'crystal' : 'pendant';
                const prize = prizemap[prizeType][data['prizes'][dungeondata.prize]];
                dungeonPrizes[`${prizeType}${prize}`] = dungeondata.dungeonprize;
            }
        })
        Object.entries(prizemap).forEach(([prizeType, prizes]) => {
            Object.entries(prizes).forEach(([mask, prize]) => {
                if (newbit(prizeType === 'pendant' ? 0x374 : 0x37A, mask, 'rooms_inv')) {
                    toggle_prize(dungeonPrizes[`${prizeType}${prize}`]);
                }
            });
        });
    }

    if (flags.entrancemode === 'N') {
		updatechest(0, 0x226, 0x10); // King's Tomb
		updatechest_group(1, [[0x2BB, 0x40], [0x216, 0x10]]); // Sunken Treasure + Flooded Chest
		updatechest(2, 0x208, 0x10); // Link's House
		updatechest(3, 0x1FC, 0x10); // Spiral Cave
		updatechest(4, 0x218, 0x10); // Mimic Cave
		updatechest(5, 0x206, 0x10); // T A V E R N
		updatechest(6, 0x210, 0x10); // Chicken House
		updatechest(7, 0x20C, 0x10); // Brewery
		updatechest(8, 0x238, 0x10); // C House
		updatechest(9, 0x214, 0x10); // Aginah's Cave
		updatechest_group(10, [[0x21A, 0x10], [0x21A, 0x20]]); // Mire Shed Left + Right
		updatechest_group(11, [[0x1F0, 0x10], [0x1F0, 0x20]]); // Superbunny Cave Top + Bottom
		updatechest_group(12, [[0x20A, 0x10], [0x20A, 0x20], [0x20A, 0x40]]); // Sahasrahla's Hut Left + Middle + Right
		updatechest(13, 0x22E, 0x10); // Spike Cave
		updatechest_group(14, [[0x05E, 0x10], [0x05E, 0x20], [0x05E, 0x40], [0x05E, 0x80], [0x05F, 0x01]]); // Kakariko Well Top + Left + Middle + Right + Bottom
		updatechest_group(15, [[0x23A, 0x10], [0x23A, 0x20], [0x23A, 0x40], [0x23A, 0x80], [0x23B, 0x01]]); // Blind's Hut Top + Left + Right + Far Left + Far Right
		updatechest_group(16, [[0x23C, 0x10], [0x23C, 0x20], [0x23C, 0x40], [0x23C, 0x80], [0x23D, 0x04]]); // Hype Cave Top + Left + Right + Bottom + NPC
		updatechest_group(17, [[0x1DE, 0x10], [0x1DE, 0x20], [0x1DE, 0x40], [0x1DE, 0x80], [0x1DF, 0x01], [0x1FE, 0x10], [0x1FE, 0x20]]); // Paradox Lower (Far Left + Left + Right + Far Right + Middle) + Upper (Left + Right)
		updatechest(18, 0x248, 0x10); // Bonk Rock
		updatechest_group(19, [[0x246, 0x10], [0x246, 0x20], [0x246, 0x40], [0x246, 0x80], [0x247, 0x04]]); // Mini Moldorms Cave Far Left + Left + Right + Far Right + NPC
		updatechest(20, 0x240, 0x10); // Ice Rod Cave
		updatechest(21, 0x078, 0x80); // Hookshot Cave Bottom Right
		updatechest_group(22, [[0x078, 0x10], [0x078, 0x20], [0x078, 0x40]]); // Hookshot Cave Top Right + Top Left + Bottom Left
        updatechest(23, 0x280, 0x10); // Lost Woods Hideout Tree
        updatechest(24, 0x285, 0x10); // Death Mountain Bonk Rocks
        updatechest(25, 0x28A, 0x10); // Mountain Entry Pull Tree
        updatechest(26, 0x28A, 0x08); // Mountain Entry Southeast Tree
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
        updatechest(37, 0x29A, 0x10); // Forgotten Forest Southwest Tree
        updatechest(38, 0x29A, 0x08); // Forgotten Forest Central Tree
        updatechest(39, 0x29B, 0x10); // Hyrule Castle Tree
        updatechest(40, 0x29D, 0x10); // Wooden Bridge Tree
        updatechest(41, 0x29E, 0x10); // Eastern Palace Tree
        updatechest(42, 0x2AA, 0x10); // Flute Boy South Tree
        updatechest(43, 0x2AA, 0x08); // Flute Boy East Tree
        updatechest(44, 0x2AB, 0x10); // Central Bonk Rocks Tree
        updatechest(45, 0x2AE, 0x14); // Tree Line Tree 2
        updatechest(46, 0x2AE, 0x08); // Tree Line Tree 4
        updatechest(47, 0x2B2, 0x10); // Flute Boy Approach South Tree
        updatechest(48, 0x2B2, 0x08); // Flute Boy Approach North Tree
        updatechest(49, 0x2C2, 0x10); // Dark Lumberjack Tree
        updatechest(50, 0x2D1, 0x18); // Dark Fortune Bonk Rocks (2)
        updatechest(51, 0x2D4, 0x10); // Dark Graveyard West Bonk Rocks
        updatechest(52, 0x2D4, 0x08); // Dark Graveyard North Bonk Rocks
        updatechest(53, 0x2D4, 0x04); // Dark Graveyard Tomb Bonk Rocks
        updatechest(54, 0x2D5, 0x10); // Qirn Jump West Tree
        updatechest(55, 0x2D5, 0x08); // Qirn Jump East Tree
        updatechest(56, 0x2D6, 0x10); // Dark Witch Tree
        updatechest(57, 0x2DB, 0x10); // Pyramid Area
        updatechest(58, 0x2DE, 0x10); // Palace of Darkness Area
        updatechest(59, 0x2EE, 0x10); // Dark Tree Line Tree 2
        updatechest(60, 0x2EE, 0x08); // Dark Tree Line Tree 3
        updatechest(61, 0x2EE, 0x04); // Dark Tree Line Tree 4
        updatechest(62, 0x2F4, 0x10); // Hype Cave Area
        updatechest(63, 0x241, 0x02); // Cold Fairy Statue
        updatechest(64, 0x20D, 0x04); // Chest Game
		updatechest(65, 0x3C9, 0x02); // Bottle Vendor
		updatechest(66, 0x410, 0x10); // Sahasrahla (GP)
		updatechest(67, 0x410, 0x08); // Stump Kid
		updatechest(68, 0x410, 0x04); // Sick Kid
		updatechest(69, 0x3C9, 0x10); // Purple Chest
		updatechest(70, 0x3C9, 0x01); // Hobo
		updatechest(71, 0x411, 0x01); // Ether Tablet
		updatechest(72, 0x411, 0x02); // Bombos Tablet
		updatechest(73, 0x410, 0x20); // Catfish
		updatechest(74, 0x410, 0x02); // King Zora
		updatechest(75, 0x410, 0x01); // Lost Old Man
		updatechest(76, 0x411, 0x20); // Potion Shop
		updatechest(77, 0x1C3, 0x02); // Lost Wood Hideout
		updatechest(78, 0x1C5, 0x02); // Lumberjack
		updatechest(79, 0x1D5, 0x04); // Spectacle Rock Cave
		updatechest(80, 0x237, 0x04); // Cave 45
		updatechest(81, 0x237, 0x02); // Graveyard Ledge
		updatechest(82, 0x24D, 0x02); // Checkerboard Cave
		updatechest(83, 0x24F, 0x04); // Hammer Pegs
		updatechest(84, 0x410, 0x80); // Library
		updatechest(85, 0x411, 0x10); // Mushroom
		updatechest(86, 0x283, 0x40); // Spectacle Rock
		updatechest(87, 0x285, 0x40); // Floating Island
		updatechest(88, 0x2A8, 0x40); // Race Game
		updatechest(89, 0x2B0, 0x40); // Desert Ledge
		updatechest(90, 0x2B5, 0x40); // Lake Hylia Island
		updatechest(91, 0x2CA, 0x40); // Bumper Cave
		updatechest(92, 0x2DB, 0x40); // Pyramid
		updatechest(93, 0x2E8, 0x40); // Dig Game
		updatechest(94, 0x301, 0x40); // Zora's Ledge
		updatechest(95, 0x2AA, 0x40); // Dig/Flute Spot
		updatechest(100, 0x411, 0x80); // Magic Bat
		updatechest(101, 0x411, 0x04); // Blacksmith
		updatechest_group(102, [[0x22C, 0x10], [0x22C, 0x20]]); // Pyramid Fairy Left + Right
		updatechest(103, 0x300, 0x40); // Pedestal
		updatechest_group(105, [[0x228, 0x10], [0x228, 0x20]]); // Waterfall Fairy Left + Right
        updatechest_group(97, [[0x3C6, 0x01], [0x0AA, 0x10]]); // Uncle + Passage

        if (flags.autotracking === 'Y' ) {
            updatechest_group(96, [[0x022, 0x10], [0x022, 0x20], [0x022, 0x40]]); // Sewers Left + Middle + Right
            updatechest_group(98, [[0x0E4, 0x10], [0x0E2, 0x10], [0x100, 0x10]]); // Hyrule Castle Map + Boomerang + Zelda
            updatechest(99, 0x024, 0x10); // Sanctuary
            updatechest(104, 0x064, 0x10); // Hyrule Castle - Dark Cross
            updatechest(106, 0x1C0, 0x10); // Castle Tower - Room 03
            updatechest(107, 0x1A0, 0x10); // Castle Tower - Dark Maze
        }

    } else {
		updatechest(0, 0x2BB, 0x40); // Sunken Treasure
		updatechest(1, 0x208, 0x10); // Link's House
		updatechest(2, 0x3C9, 0x02); // Bottle Vendor
		updatechest(3, 0x410, 0x08); // Stump Kid
		updatechest(4, 0x3C9, 0x10); // Purple Chest
		updatechest(5, 0x3C9, 0x01); // Hobo
		updatechest(6, 0x411, 0x01); // Ether Tablet
		updatechest(7, 0x411, 0x02); // Bombos Tablet
		updatechest(8, 0x410, 0x20); // Catfish
		updatechest(9, 0x410, 0x02); // King Zora
		updatechest(10, 0x410, 0x01); // Lost Old Man
		updatechest(11, 0x411, 0x10); // Mushroom
		updatechest(12, 0x283, 0x40); // Spectacle Rock
		updatechest(13, 0x285, 0x40); // Floating Island
		updatechest(14, 0x2A8, 0x40); // Race Game
		updatechest(15, 0x2B0, 0x40); // Desert Ledge
		updatechest(16, 0x2B5, 0x40); // Lake Hylia Island
		updatechest(17, 0x2CA, 0x40); // Bumper Cave
		updatechest(18, 0x2DB, 0x40); // Pyramid
		updatechest(19, 0x2E8, 0x40); // Dig Game
		updatechest(20, 0x301, 0x40); // Zora's Ledge
		updatechest(21, 0x2AA, 0x40); // Dig/Flute Spot
		updatechest(22, 0x300, 0x40); // Pedestal
        updatechest(23, 0x280, 0x10); // Lost Woods Hideout Tree
        updatechest(24, 0x285, 0x10); // Death Mountain Bonk Rocks
        updatechest(25, 0x28A, 0x10); // Mountain Entry Pull Tree
        updatechest(26, 0x28A, 0x08); // Mountain Entry Southeast Tree
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
        updatechest(37, 0x29A, 0x10); // Forgotten Forest Southwest Tree
        updatechest(38, 0x29A, 0x08); // Forgotten Forest Central Tree
        updatechest(39, 0x29B, 0x10); // Hyrule Castle Tree
        updatechest(40, 0x29D, 0x10); // Wooden Bridge Tree
        updatechest(41, 0x29E, 0x10); // Eastern Palace Tree
        updatechest(42, 0x2AA, 0x10); // Flute Boy South Tree
        updatechest(43, 0x2AA, 0x08); // Flute Boy East Tree
        updatechest(44, 0x2AB, 0x10); // Central Bonk Rocks Tree
        updatechest(45, 0x2AE, 0x14); // Tree Line Tree 2
        updatechest(46, 0x2AE, 0x08); // Tree Line Tree 4
        updatechest(47, 0x2B2, 0x10); // Flute Boy Approach South Tree
        updatechest(48, 0x2B2, 0x08); // Flute Boy Approach North Tree
        updatechest(49, 0x2C2, 0x10); // Dark Lumberjack Tree
        updatechest(50, 0x2D1, 0x18); // Dark Fortune Bonk Rocks (2)
        updatechest(51, 0x2D4, 0x10); // Dark Graveyard West Bonk Rocks
        updatechest(52, 0x2D4, 0x08); // Dark Graveyard North Bonk Rocks
        updatechest(53, 0x2D4, 0x04); // Dark Graveyard Tomb Bonk Rocks
        updatechest(54, 0x2D5, 0x10); // Qirn Jump West Tree
        updatechest(55, 0x2D5, 0x08); // Qirn Jump East Tree
        updatechest(56, 0x2D6, 0x10); // Dark Witch Tree
        updatechest(57, 0x2DB, 0x10); // Pyramid Area
        updatechest(58, 0x2DE, 0x10); // Palace of Darkness Area
        updatechest(59, 0x2EE, 0x10); // Dark Tree Line Tree 2
        updatechest(60, 0x2EE, 0x08); // Dark Tree Line Tree 3
        updatechest(61, 0x2EE, 0x04); // Dark Tree Line Tree 4
        updatechest(62, 0x2F4, 0x10); // Hype Cave Area
    };

   if ('pseudoboots' in data && flags.pseudoboots === 'N' && data['pseudoboots'][0] === 0x01) {
       flags.pseudoboots = 'Y';
       document.getElementById('pseudoboots').style.display = 'block';
       document.getElementById('pseudoboots').style.visibility = 'visible';
   }
	
    function update_boss(boss, offset) {
        if (newbit(offset, 0x08) && !items[boss]) {
            click_map();
            toggle(boss);
        }
    };
    update_boss("boss0", 0x191); // Eastern Palace
    update_boss("boss1", 0x067); // Desert Palace
    update_boss("boss2", 0x00F); // Hera
    update_boss("boss3", 0x0B5); // Palace of Darkness
    update_boss("boss4", 0x00D); // Swamp Palace
    update_boss("boss5", 0x053); // Skull Woods
    update_boss("boss6", 0x159); // Thieves Town
    update_boss("boss7", 0x1BD); // Ice Palace
    update_boss("boss8", 0x121); // Misery Mire
    update_boss("boss9", 0x149); // Turtle Rock
    update_boss("agahnim2", 0x01B); // Ganons Tower

    function updatesmallkeys(dungeon, offset) {
        if (changed(offset)) {
            var label = "smallkey" + dungeon;
            var newkeys = autotrackPrevData === null ? data['rooms_inv'][offset] : (data['rooms_inv'][offset] - autotrackPrevData['rooms_inv'][offset] + items[label]);
            if (newkeys > items[label]) {
                document.getElementById(label).style.color = (newkeys === items.range[label].max) ? "green" : "white";
                document.getElementById(label).innerHTML = newkeys;
                items[label] = newkeys;
                updateMapTracker();
            }
        }
    };
    /*updatesmallkeys("0", 0x37E);
    updatesmallkeys("1", 0x37F);
    updatesmallkeys("2", 0x386);
    updatesmallkeys("3", 0x382);
    updatesmallkeys("4", 0x381);
    updatesmallkeys("5", 0x384);
    updatesmallkeys("6", 0x387);
    updatesmallkeys("7", 0x385);
    updatesmallkeys("8", 0x383);
    updatesmallkeys("9", 0x388);
    updatesmallkeys("10", 0x389); // GT
    updatesmallkeys("half0", 0x37C); // Hyrule Castle
    updatesmallkeys("half0", 0x37D); // Sewers
    updatesmallkeys("half1", 0x380); // Castle Tower*/
    updatesmallkeys("0", 0x4E2);
    updatesmallkeys("1", 0x4E3);
    updatesmallkeys("2", 0x4EA);
    updatesmallkeys("3", 0x4E6);
    updatesmallkeys("4", 0x4E5);
    updatesmallkeys("5", 0x4E8);
    updatesmallkeys("6", 0x4EB);
    updatesmallkeys("7", 0x4E9);
    updatesmallkeys("8", 0x4E7);
    updatesmallkeys("9", 0x4EC);
    updatesmallkeys("10", 0x4ED); // GT
    updatesmallkeys("half0", 0x4E1); // Sewers and Hyrule Castle
    updatesmallkeys("half1", 0x4E4); // Castle Tower

    function updatebigkey(dungeon, offset, mask) {
        if (newbit(offset, mask) && !items["bigkey" + dungeon]) {
            click_map();
            toggle("bigkey" + dungeon);
        }
    };
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
    updatebigkey("half0", 0x367, 0xC0);
    updatebigkey("half1", 0x367, 0x08);

    function setitem(item, value) {
        click_map();
        if (item != 'mushroom') {
			while (items[item] != value)
				toggle(item);
		} else {
			if (!window.mushroomfound) {
				while (items[item] != value)
					toggle(item);
			}
		}
    };

	if (changed(0x343)) // Bombs
        setitem("bomb", data['rooms_inv'][0x343] > 0);

    if (changed(0x3C5) && data['rooms_inv'][0x3C5] >= 3) // Agahnim Killed
        setitem("agahnim", true);

	if (newbit(0x38E, 0xC0)) {
        var bits = data['rooms_inv'][0x38E] & 0xC0;
        setitem("bow", bits == 0x40 && flags.nonprogressivebows ? 1 : (bits == 0x80 ? 2 : 3));
    }
	
    if (newbit(0x38C, 0xC0)) {
        var bits = data['rooms_inv'][0x38C] & 0xC0;
        setitem("boomerang", bits == 0x80 ? 1 : (bits == 0x40 ? 2 : 3));
    }

    if (disabledbit(0x38C, 0x20))
        setitem("mushroom", false);
    if (newbit(0x38C, 0x20))
        setitem("mushroom", true);
    if (newbit(0x38C, 0x10))
        setitem("powder", true);

    if (newbit(0x38C, 0x04))
        setitem("shovel", true);
    if (newbit(0x38C, 0x03))
        setitem("flute", true);

    if (newbit(0x342, 0x01))
        setitem("hookshot", true);

    if (newbit(0x345, 0x01))
        setitem("firerod", true);

    if (newbit(0x346, 0x01))
        setitem("icerod", true);

    if (newbit(0x347, 0x01))
        setitem("bombos", true);

    if (newbit(0x348, 0x01))
        setitem("ether", true);

    if (newbit(0x349, 0x01))
        setitem("quake", true);

    if (newbit(0x34A, 0x01))
        setitem("lantern", true);

    if (newbit(0x34B, 0x01))
        setitem("hammer", true);

    if (newbit(0x34D, 0x01))
        setitem("net", true);

    if (newbit(0x34E, 0x01))
        setitem("book", true);

    if (newbit(0x350, 0x01))
        setitem("somaria", true);

    if (newbit(0x351, 0x01))
        setitem("byrna", true);

    if (newbit(0x352, 0x01))
        setitem("cape", true);

    if (newbit(0x353, 0x02))
        setitem("mirror", true);

    if (newbit(0x355, 0x01))
        setitem("boots", true);

    if (newbit(0x356, 0x01))
        setitem("flippers", true);

    if (newbit(0x357, 0x01))
        setitem("moonpearl", true);

    if (changed(0x354))
        setitem("glove", data['rooms_inv'][0x354]);

    if (changed(0x359))
        setitem("sword", (flags['swordmode'] === 'S' || data['rooms_inv'][0x359] == 0xFF) ? 0 : data['rooms_inv'][0x359]);

    if (changed(0x35A))
        setitem("shield", data['rooms_inv'][0x35A]);

    if (changed(0x35B))
        setitem("tunic", data['rooms_inv'][0x35B] + 1);

    if (changed(0x37B))
        setitem("magic", data['rooms_inv'][0x37B] > 0);
	
	if (flags.wildmaps) {
		if (newbit(0x369, 0x20) && prizes[0] === 0)
			setmap(0, 5);
		
		if (newbit(0x369, 0x10) && prizes[1] === 0)
			setmap(1, 5);
		
		if (newbit(0x368, 0x20) && prizes[2] === 0)
			setmap(2, 5);
		
		if (newbit(0x369, 0x02) && prizes[3] === 0)
			setmap(3, 5);
		
		if (newbit(0x369, 0x04) && prizes[4] === 0)
			setmap(4, 5);
		
		if (newbit(0x368, 0x80) && prizes[5] === 0)
			setmap(5, 5);
		
		if (newbit(0x368, 0x10) && prizes[6] === 0)
			setmap(6, 5);
		
		if (newbit(0x368, 0x40) && prizes[7] === 0)
			setmap(7, 5);
		
		if (newbit(0x369, 0x01) && prizes[8] === 0)
			setmap(8, 5);
		
		if (newbit(0x368, 0x08) && prizes[9] === 0)
			setmap(9, 5);
	}
	
	if (flags.wildcompasses) {
		if (newbit(0x365, 0x20) && enemizer[0] === 0)
			setcompass(0, 11);
		
		if (newbit(0x365, 0x10) && enemizer[1] === 0)
			setcompass(1, 11);
		
		if (newbit(0x364, 0x20) && enemizer[2] === 0)
			setcompass(2, 11);
		
		if (newbit(0x365, 0x02) && enemizer[3] === 0)
			setcompass(3, 11);
		
		if (newbit(0x365, 0x04) && enemizer[4] === 0)
			setcompass(4, 11);
		
		if (newbit(0x364, 0x80) && enemizer[5] === 0)
			setcompass(5, 11);
		
		if (newbit(0x364, 0x10) && enemizer[6] === 0)
			setcompass(6, 11);
		
		if (newbit(0x364, 0x40) && enemizer[7] === 0)
			setcompass(7, 11);
		
		if (newbit(0x365, 0x01) && enemizer[8] === 0)
			setcompass(8, 11);
		
		if (newbit(0x364, 0x08) && enemizer[9] === 0)
			setcompass(9, 11);
	}
	
	function setmap(dungeon, value) {
		rightClickPrize(dungeon);
    };
	
	function setcompass(dungeon, value) {
		rightClickEnemy(dungeon);
    };
	
    var prevbottles = -1;
    if (autotrackPrevData !== null)
        prevbottles = (autotrackPrevData['rooms_inv'][0x35C] == 0 ? 0 : 1) + (autotrackPrevData['rooms_inv'][0x35D] == 0 ? 0 : 1) + (autotrackPrevData['rooms_inv'][0x35E] == 0 ? 0 : 1) + (autotrackPrevData['rooms_inv'][0x35F] == 0 ? 0 : 1);
    var bottles = (data['rooms_inv'][0x35C] == 0 ? 0 : 1) + (data['rooms_inv'][0x35D] == 0 ? 0 : 1) + (data['rooms_inv'][0x35E] == 0 ? 0 : 1) + (data['rooms_inv'][0x35F] == 0 ? 0 : 1);
    if (bottles != prevbottles)
        setitem("bottle", bottles);
}
