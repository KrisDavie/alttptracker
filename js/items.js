(function (window) {
  "use strict";

  var query = uri_query();

  window.flags = {
    gametype: query.f.charAt(0),
    entrancemode: query.f.charAt(1),
    doorshuffle: query.f.charAt(2),
    overworldshuffle: query.f.charAt(3),
    bossshuffle: query.f.charAt(4),
    enemyshuffle: query.f.charAt(5),
    pseudoboots: query.f.charAt(6),
    unknown: query.f.charAt(7),
    glitches: query.f.charAt(8),
    wildmaps: query.f.charAt(9) === "1" ? true : false,
    wildcompasses: query.f.charAt(10) === "1" ? true : false,
    wildkeys: query.f.charAt(11) === "1" ? true : false,
    wildbigkeys: query.f.charAt(12) === "1" ? true : false,
    shopsanity: query.f.charAt(13),
    ambrosia: query.f.charAt(14),
    nonprogressivebows: query.f.charAt(15) === "Y" ? true : false,
    activatedflute: query.f.charAt(16) === "Y" ? true : false,
    bonkshuffle: query.f.charAt(17),
    goals: query.f.charAt(18),
    opentower: query.f.charAt(19),
    opentowercount: query.f.charAt(20),
    ganonvuln: query.f.charAt(21),
    ganonvulncount: query.f.charAt(22),
    swordmode: query.f.charAt(23),
    prizeshuffle: query.f.charAt(24),
    mirrorscroll: query.f.charAt(25),
    mapmode: query.d.charAt(0),
    chestcolormode: query.d.charAt(1),
    spoilermode: query.d.charAt(2),
    spheresmode: query.d.charAt(3),
    mapstyle: query.d.charAt(4),
    scale: query.d.charAt(5),
    showcompasses: query.d.charAt(6) === "1" ? true : false,
    showmaps: query.d.charAt(7) === "1" ? true : false,
    showsmallkeys: query.d.charAt(8) === "1" ? true : false,
    showbigkeys: query.d.charAt(9) === "1" ? true : false,
    showhcctcounts: query.d.charAt(10) === "1" ? true : false,
    autotracking: query.a.charAt(0),
    trackingport: query.a.charAt(1) + query.a.charAt(2) + query.a.charAt(3) + query.a.charAt(4) + query.a.charAt(5),
    trackinghost: query.a.slice(6, 100),
    startingitems: query.s,
    sprite: query.p.replace("#", "").replace("!", ""),
  };

  window.flags.trackingport = parseInt(flags.trackingport);
  window.flags.trackinghost = flags.trackinghost || "localhost";

  window.maptype = query.map;

  window.startingitems = query.starting;

  // Function to calculate chest and key counts for dungeons based on current flags
  window.calculateDungeonCounts = function(flagsOverride = null) {
    const currentFlags = flagsOverride || flags;
    let chestCounts = {};
    let keyCounts = {};
    
    for (const dungeon of window.bigDungeonData) {
      const dungeonInfo = dungeon.totalLocations;
      var count = dungeonInfo.default;
      var keys = dungeonInfo.keys;
      if (currentFlags.doorshuffle === "C") {
        count = 100;
        keys = 29;
      } else {
        if (currentFlags.doorshuffle === "P") {
          const x = dungeonInfo.keypot + dungeonInfo.keydrop;
          count += x + (dungeonInfo.bigkeydrop ? 1 : 0);
          keys += x;
        }
        if (!currentFlags.wildmaps && dungeonInfo.map) {
          count--;
        }
        if (!currentFlags.wildcompasses && dungeonInfo.compass) {
          count--;
        }
        if (!currentFlags.wildbigkeys && dungeonInfo.bigkey) {
          count--;
        }
        if (!currentFlags.wildbigkeys && currentFlags.doorshuffle === "P" && dungeonInfo.bigkeydrop) {
          count--;
        }
        if (!currentFlags.wildkeys && !(currentFlags.gametype === "R")) {
          count -= dungeonInfo.keys;
          if (currentFlags.doorshuffle === "P") {
            count -= dungeonInfo.keypot;
          }
        }
        if (currentFlags.prizeshuffle === "W") {
          count += dungeonInfo.prize;
        }
      }
      chestCounts[dungeon.id] = count;
      keyCounts[dungeon.id] = keys;
    }
    
    return { chestCounts, keyCounts };
  };

  let { chestCounts, keyCounts } = window.calculateDungeonCounts();

  var range = {
    tunic: { min: 1, max: 3 },
    sword: { min: 0, max: 4 },
    shield: { min: 0, max: 3 },
    bottle: { min: 0, max: 4 },
    bow: { min: 0, max: 3 },
    boomerang: { min: 0, max: 3 },
    glove: { min: 0, max: 2 },
    bottle1: { min: 0, max: 7 },
    bottle2: { min: 0, max: 7 },
    bottle3: { min: 0, max: 7 },
    bottle4: { min: 0, max: 7 },
    heartpiece: { min: 0, max: 3 },
    mushroom: { min: 0, max: 2 },
    flute: { min: 0, max: 2 },
  };

  for (let i = 0; i < 13; i++) {
    range["smallkey" + i] = { min: 0, max: keyCounts[i] };
    range["chest" + i] = { min: 0, max: chestCounts[i] };
  }

  window.items = {
    tunic: 1,
    sword: 0,
    shield: 0,
    moonpearl: false,

    bow: 0,
    boomerang: 0,
    hookshot: false,
    mushroom: 0,
    powder: false,

    firerod: false,
    icerod: false,
    bombos: false,
    ether: false,
    quake: false,

    lantern: false,
    hammer: false,
    shovel: false,
    net: false,
    book: false,

    // Bottle is still used for logic
    bottle: 0,
    bottle1: 0,
    bottle2: 0,
    bottle3: 0,
    bottle4: 0,

    heartpiece: 0,

    somaria: false,
    byrna: false,
    cape: false,
    mirror: false,

    boots: false,
    glove: 0,
    flippers: false,
    flute: 0,
    agahnim: false,
    agahnim2: false,
    bomb: false,
    magic: false,
    bombfloor: false,

    range: range,
    inc: limit(1, range),
    dec: limit(-1, range),
  };

  for (let i = 0; i < 13; i++) {
    if (i < 10) {
      items["boss" + i] = false;
    }
    items["chest" + i] = chestCounts[i];
    items["maxchest" + i] = chestCounts[i];
    items["chestknown" + i] = false;
    items["bigkey" + i] = !(flags.wildbigkeys || flags.showbigkeys);
    items["smallkey" + i] = flags.wildkeys || flags.showsmallkeys ? 0 : keyCounts[i];
    items["chestmanual" + i] = 0;
    items["keymanual" + i] = 0;
    items["maxkey" + i] = 99;
  }

  if (flags.doorshuffle !== "C") {
    let isPots = flags.doorshuffle === "P";
    for (const [dungeon, dungeonInfo] of Object.entries(window.dungeonTotalLocations)) {
      var value = dungeonInfo.default;
      if (isPots) {
        value += dungeonInfo.keypot;
        value += dungeonInfo.keydrop;
        value += dungeonInfo.bigkeydrop ? 1 : 0;
      }
      if (!flags.wildmaps && dungeonInfo.map) {
        value--;
      }
      if (!flags.wildcompasses && dungeonInfo.compass) {
        value--;
      }
      if (!flags.wildbigkeys) {
        value -= dungeonInfo.bigkey ? 1 : 0;
        value -= isPots && dungeonInfo.bigkeydrop ? 1 : 0;
      }
      if (!flags.wildkeys && !(flags.gametype === "R")) {
        value -= dungeonInfo.keys;
        value -= isPots ? dungeonInfo.keypot : 0;
      }
      if (flags.prizeshuffle === "W") {
        value += dungeonInfo.prize;
      }
      items[dungeonInfo.dungeonarrayname] = value;
      items["max" + dungeonInfo.dungeonarrayname] = value;
      range[dungeonInfo.dungeonarrayname] = { min: 0, max: value };
      items.dec = limit(-1, range);
      items.inc = limit(1, range);
    }
  }

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
})(window);
