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

    if (autotrackReconnectTimer !== null)
        clearTimeout(autotrackReconnectTimer);
    autotrackReconnectTimer = setTimeout(function () {
        autotrackReconnectTimer = null;
        autotrackCleanup();
        autotrackConnect(autotrackHost);
    }, autotrackTimeoutDelay);
    
    snesread(WRAM_START + 0x10, 1, function (event) {
        var gamemode = new Uint8Array(event.data)[0];
        if (![0x07, 0x09, 0x0b].includes(gamemode)) {
            autotrackStartTimer();
            return;
        }
        snesread(SAVEDATA_START, 0x280, function (event2) {
            snesread(SAVEDATA_START + 0x280, 0x280, function (event3) {
                var data = new Uint8Array([...new Uint8Array(event2.data), ...new Uint8Array(event3.data)]);
                autotrackDoTracking(data);
                autotrackPrevData = data;
                autotrackStartTimer();
            });
        });
    });
}

function autotrackDoTracking(data) {
    function changed(offset) {
        return autotrackPrevData === null || autotrackPrevData[offset] !== data[offset];
    };
    function disabledbit(offset, mask) {
        return (data[offset] & mask) === 0 && (autotrackPrevData === null || ((autotrackPrevData[offset] & mask) !== 0));
    };
    function newbit(offset, mask) {
        return (data[offset] & mask) !== 0 && (autotrackPrevData === null || ((autotrackPrevData[offset] & mask) !== (data[offset] & mask)));
    };
    function newbit_group(locations) {
        var activated = false;
        for (const location of locations) {
            if ((data[location[0]] & location[1]) === 0)
                return false;
            if (autotrackPrevData === null || ((autotrackPrevData[location[0]] & location[1]) === 0))
                activated = true;
        }
        return activated;
    };

    function updatechest(chest, offset, mask) {
        if (newbit(offset, mask) && !chests[chest].is_opened)
            toggle_chest(chest);
    };
    function updatechest_group(chest, locations) {
        if (newbit_group(locations) && !chests[chest].is_opened)
            toggle_chest(chest);
    };
    
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
		//updatechest_group(96, [[0x022, 0x10], [0x022, 0x20], [0x022, 0x40]]); // Sewers Left + Middle + Right
		updatechest_group(97, [[0x3C6, 0x01], [0x0AA, 0x10]]); // Uncle + Passage
		//updatechest_group(98, [[0x0E4, 0x10], [0x0E2, 0x10], [0x100, 0x10]]); // Hyrule Castle Map + Boomerang + Zelda
		//updatechest(99, 0x024, 0x10); // Sanctuary
		updatechest(100, 0x411, 0x80); // Magic Bat
		updatechest(101, 0x411, 0x04); // Blacksmith
		updatechest_group(102, [[0x22C, 0x10], [0x22C, 0x20]]); // Pyramid Fairy Left + Right
		updatechest(103, 0x300, 0x40); // Pedestal
		//updatechest(104, 0x064, 0x10); // Hyrule Castle - Dark Cross
		updatechest_group(105, [[0x228, 0x10], [0x228, 0x20]]); // Waterfall Fairy Left + Right
		//updatechest(106, 0x1C0, 0x10); // Castle Tower - Room 03
		//updatechest(107, 0x1A0, 0x10); // Castle Tower - Dark Maze

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
            var newkeys = autotrackPrevData === null ? data[offset] : (data[offset] - autotrackPrevData[offset] + items["smallkey" + dungeon]);
            if (newkeys > items["smallkey" + dungeon]) {
                document.getElementById("smallkey" + dungeon).innerHTML = newkeys;
                items["smallkey" + dungeon] = newkeys;
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
        while (items[item] != value)
            toggle(item);
    };

	if (changed(0x343)) // Bombs
        setitem("bomb", data[0x343] > 0);

    if (changed(0x3C5) && data[0x3C5] >= 3) // Agahnim Killed
        setitem("agahnim", true);

	if (newbit(0x38E, 0xC0)) {
        var bits = data[0x38E] & 0xC0;
        setitem("bow", bits == 0x40 && flags.nonprogressivebows ? 1 : (bits == 0x80 ? 2 : 3));
    }
	
    if (newbit(0x38C, 0xC0)) {
        var bits = data[0x38C] & 0xC0;
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
        setitem("glove", data[0x354]);

    if (changed(0x359))
        setitem("sword", (flags['swordmode'] === 'S' || data[0x359] == 0xFF) ? 0 : data[0x359]);

    if (changed(0x35A))
        setitem("shield", data[0x35A]);

    if (changed(0x35B))
        setitem("tunic", data[0x35B] + 1);

    if (changed(0x37B))
        setitem("magic", data[0x37B] > 0);
	
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
        prevbottles = (autotrackPrevData[0x35C] == 0 ? 0 : 1) + (autotrackPrevData[0x35D] == 0 ? 0 : 1) + (autotrackPrevData[0x35E] == 0 ? 0 : 1) + (autotrackPrevData[0x35F] == 0 ? 0 : 1);
    var bottles = (data[0x35C] == 0 ? 0 : 1) + (data[0x35D] == 0 ? 0 : 1) + (data[0x35E] == 0 ? 0 : 1) + (data[0x35F] == 0 ? 0 : 1);
    if (bottles != prevbottles)
        setitem("bottle", bottles);
}
