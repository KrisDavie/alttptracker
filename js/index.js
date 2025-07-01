var startingitemstring = "00000000000000000000000000";
var upcomingRaceSlug = "";

function load_cookie() {
  var allCookies = document.cookie;

  if (allCookies.indexOf("settings") > -1) {
    document.getElementById("remembersettings").checked = true;
    let settingsCookie = allCookies.substring(allCookies.indexOf("settings"));
    settingsCookie = settingsCookie.indexOf(";") > -1 ? settingsCookie.substring(0, settingsCookie.indexOf(";")) : settingsCookie;
    let settings = settingsCookie
      .split("=")[1]
      .split("|")
      .map((x) => x.split("-"));

    settings.forEach((setting) => {
      switch (setting[0]) {
        case "m":
          switch (setting[1]) {
            case "M":
              document.getElementById("mapyes").checked = true;
              break;
            case "C":
              document.getElementById("mapsmall").checked = true;
              break;
            case "V":
              document.getElementById("mapvertical").checked = true;
              break;
            case "N":
              document.getElementById("mapno").checked = true;
              break;
          }
          break;
        case "cc":
          switch (setting[1]) {
            case "N":
              document.getElementById("chestcolorno").checked = true;
              break;
            case "Y":
              document.getElementById("chestcoloryes").checked = true;
              break;
          }
          break;
        case "s":
          if (setting[1] === "Y") {
            document.getElementById("sphereyes").checked = true;
          }
          break;
        case "a":
          const autotrackingSetting = setting[1][0];
          const autotrackingPort = setting[1].substring(1);
          switch (autotrackingSetting) {
            case "Y":
              document.getElementById("autotrackingyes").checked = true;
              break;
            case "D":
              document.getElementById("autotrackingnodungeon").checked = true;
              break;
            case "N":
              document.getElementById("autotrackingno").checked = true;
              break;
          }
          if (autotrackingPort) {
            document.getElementById("autotrackingport").value = autotrackingPort;
          }
          break;
        case "p":
          document.getElementById("spriteselect").value = setting[1];
          break;
        case "ms":
          if (setting[1] === "O") {
            document.getElementById("oldmapstyles").checked = true;
          }
          break;
        case "sc":
          switch (setting[1]) {
            case "F":
              document.getElementById("scale100").checked = true;
              break;
            case "T":
              document.getElementById("scale75").checked = true;
              break;
            case "H":
              document.getElementById("scale50").checked = true;
              break;
            case "Q":
              document.getElementById("scale25").checked = true;
              break;
          }
          break;
        case "ad":
          const alwaysDisplay = setting[1];
          document.getElementById("alwaysshowmaps").checked = alwaysDisplay[0] === "1";
          document.getElementById("alwaysshowcompasses").checked = alwaysDisplay[1] === "1";
          document.getElementById("alwaysshowsmallkeys").checked = alwaysDisplay[2] === "1";
          document.getElementById("alwaysshowbigkeys").checked = alwaysDisplay[3] === "1";
          break;
      }
    });
  }
}

function toggle(x, y) {
  document.getElementById("starting" + x).classList.remove(x + startingitemstring.charAt(y));
  switch (y) {
    case 1:
    case 2:
      startingitemstring =
        startingitemstring.substring(0, y) + (startingitemstring.charAt(y) === "0" ? "1" : startingitemstring.charAt(y) === "1" ? "2" : startingitemstring.charAt(y) === "2" ? "3" : "0") + startingitemstring.substring(y + 1);
      break;
    case 23:
      startingitemstring = startingitemstring.substring(0, y) + (startingitemstring.charAt(y) === "0" ? "1" : startingitemstring.charAt(y) === "1" ? "2" : "0") + startingitemstring.substring(y + 1);
      break;
    default:
      startingitemstring = startingitemstring.substring(0, y) + (startingitemstring.charAt(y) === "0" ? "1" : "0") + startingitemstring.substring(y + 1);
      break;
  }
  document.getElementById("starting" + x).classList.add(x + startingitemstring.charAt(y));
  document.getElementById("starting" + x).style.opacity = startingitemstring.charAt(y) === "0" ? "0.25" : "1.0";
}

function setstartingitem(x, y, z) {
  document.getElementById("starting" + x).classList.remove(x + startingitemstring.charAt(y));
  startingitemstring = startingitemstring.substring(0, y) + z + startingitemstring.substring(y + 1);
  document.getElementById("starting" + x).classList.add(x + startingitemstring.charAt(y));
  document.getElementById("starting" + x).style.opacity = startingitemstring.charAt(y) === "0" ? "0.25" : "1.0";
}

function resetallstartingitems() {
  setstartingitem("moonpearl", 0, "0");
  setstartingitem("bow", 1, "0");
  setstartingitem("boomerang", 2, "0");
  setstartingitem("hookshot", 3, "0");
  setstartingitem("mushroom", 4, "0");
  setstartingitem("powder", 5, "0");
  setstartingitem("firerod", 6, "0");
  setstartingitem("icerod", 7, "0");
  setstartingitem("bombos", 8, "0");
  setstartingitem("ether", 9, "0");
  setstartingitem("quake", 10, "0");
  setstartingitem("lantern", 11, "0");
  setstartingitem("hammer", 12, "0");
  setstartingitem("shovel", 13, "0");
  setstartingitem("flute", 14, "0");
  setstartingitem("net", 15, "0");
  setstartingitem("book", 16, "0");
  setstartingitem("bottle", 17, "0");
  setstartingitem("somaria", 18, "0");
  setstartingitem("byrna", 19, "0");
  setstartingitem("cape", 20, "0");
  setstartingitem("mirror", 21, "0");
  setstartingitem("boots", 22, "0");
  setstartingitem("glove", 23, "0");
  setstartingitem("flippers", 24, "0");
  setstartingitem("magic", 25, "0");
}

async function getNextLadderRace() {
  const response = await fetch("https://alttpr.racing/api/v1/upcoming");
  const data = await response.json();
  const nextRace = data[0];
  if (nextRace) {
    const response = await fetch(`https://alttpr.racing/api/v1/modes/${nextRace.mode}`);
    const modeData = await response.json();
    const upcomingTime = new Date(parseInt(nextRace.time) * 1000);
    const currentTime = new Date();
    // Display date if more than 24 hours away
    if (upcomingTime.getDate() === currentTime.getDate() && upcomingTime.getMonth() === currentTime.getMonth() && upcomingTime.getFullYear() === currentTime.getFullYear()) {
      document.getElementById("upcomingTime").innerHTML = upcomingTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      document.getElementById("upcomingTime").innerHTML = upcomingTime.toLocaleString([], { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    }
    document.getElementById("upcomingSpan").style.visibility = "visible";
    document.getElementById("upcomingStartsAt").style.visibility = "visible";
    const upcomingButton = document.getElementById("upcomingButton");
    upcomingRaceSlug = modeData.slug;
    upcomingButton.disabled = false;
    upcomingButton.value = `${modeData.name.toUpperCase()}`;
  }
}

function loadnextladderpreset() {
  if (upcomingRaceSlug) {
    loadnamedpreset(upcomingRaceSlug);
  }
}

function resetallsettings() {
  var settings = {
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    prizeshuffleno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    mirrorscrollno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  };
  for (const [key, value] of Object.entries(settings)) {
    if (typeof value === "boolean") {
      document.getElementById(key).checked = value;
    } else {
      document.getElementById(key).value = value;
    }
  }
}

function launch_tracker() {
  var world = document.querySelector('input[name="gametypegroup"]:checked').value;
  var entrance = document.querySelector('input[name="entrancegroup"]:checked').value;
  var door = document.querySelector('input[name="doorgroup"]:checked').value;
  var overworld = document.querySelector('input[name="overworldgroup"]:checked').value;
  var prizeshuffle = document.querySelector('input[name="prizeshufflegroup"]:checked').value;
  var boss = document.querySelector('input[name="bossgroup"]:checked').value;
  var enemy = document.querySelector('input[name="enemygroup"]:checked').value;
  var pseudoboots = document.querySelector('input[name="pseudobootsgroup"]:checked').value;
  var mirrorscroll = document.querySelector('input[name="mirrorscrollgroup"]:checked').value;
  var unknown = document.querySelector('input[name="unknowngroup"]:checked').value;
  var glitches = document.querySelector('input[name="glitchesgroup"]:checked').value;
  var shuffledmaps = document.getElementById("shuffledmaps").checked === true ? "1" : "0";
  var shuffledcompasses = document.getElementById("shuffledcompasses").checked === true ? "1" : "0";
  var shuffledsmallkeys = document.getElementById("shuffledsmallkeys").checked === true ? "1" : "0";
  var shuffledbigkeys = document.getElementById("shuffledbigkeys").checked === true ? "1" : "0";
  var shopsanity = document.querySelector('input[name="shopsanitygroup"]:checked').value;
  var ambrosia = document.querySelector('input[name="ambrosiagroup"]:checked').value;
  var nonprogressivebows = document.querySelector('input[name="nonprogressivebowsgroup"]:checked').value;
  var activatedflute = document.querySelector('input[name="activatedflutegroup"]:checked').value;
  var bonkshuffle = document.querySelector('input[name="bonkshufflegroup"]:checked').value;
  var goal = document.querySelector('input[name="goalgroup"]:checked').value;
  var tower = document.querySelector('input[name="towergroup"]:checked').value;
  var towersel = document.getElementById("towerselect");
  var towercrystals = towersel.options[towersel.selectedIndex].value;
  var ganon = document.querySelector('input[name="ganongroup"]:checked').value;
  var ganonsel = document.getElementById("ganonselect");
  var ganoncrystals = ganonsel.options[ganonsel.selectedIndex].value;
  var swords = document.querySelector('input[name="swordsgroup"]:checked').value;
  var map = document.querySelector('input[name="mapgroup"]:checked').value;
  var chestcolor = document.querySelector('input[name="chestcolorgroup"]:checked').value;
  var spoiler = document.querySelector('input[name="spoilergroup"]:checked').value;
  var sphere = document.querySelector('input[name="spheregroup"]:checked').value;
  var autotracking = document.querySelector('input[name="autotrackinggroup"]:checked').value;
  var trackingport = document.getElementById("autotrackingport").value;
  var spritesel = document.getElementById("spriteselect");
  var sprite = spritesel.options[spritesel.selectedIndex].value;
  var mapStyle = document.querySelector('input[name="oldmapstyles"]:checked') === null ? "N" : "O";
  var scale = document.querySelector('input[name="scalegroup"]:checked').value;
  var showmaps = document.getElementById("alwaysshowmaps").checked;
  var showcompasses = document.getElementById("alwaysshowcompasses").checked;
  var showsmallkeys = document.getElementById("alwaysshowsmallkeys").checked;
  var showbigkeys = document.getElementById("alwaysshowbigkeys").checked;
  var alwaysdisplay = (showmaps ? "1" : "0") + (showcompasses ? "1" : "0") + (showsmallkeys ? "1" : "0") + (showbigkeys ? "1" : "0");

  var width = map === "M" ? 1340 : 448;

  var height;
  if (map === "V") {
    height = 1330;
    if (sphere === "Y") {
      width = 892;
    }
  } else if (map === "C") {
    if (sphere === "Y") {
      height = 988;
    } else {
      height = 692;
    }
  } else {
    if (sphere === "Y") {
      height = 744;
    } else {
      height = 448;
    }
  }

  switch (scale) {
    case "F":
      break;
    case "T":
      width = width * 0.75;
      height = height * 0.75;
      break;
    case "H":
      width = width * 0.5;
      height = height * 0.5;
      break;
    case "Q":
      width = width * 0.25;
      height = height * 0.25;
      break;
  }

  if (document.getElementById("remembersettings").checked == true) {
    var settings = "m-" + map + "|cc-" + chestcolor + "|s-" + sphere + "|a-" + autotracking + trackingport + "|p-" + sprite + "|ms-" + mapStyle + "|sc-" + scale + "|ad-" + alwaysdisplay;
    document.cookie = "settings=" + settings + "; expires=Sat, 3 Jan 2026 12:00:00 UTC";
  } else {
    document.cookie = "settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  }

  var trackerWindow = window.open(
    "tracker.html?f={world}{entrance}{door}{overworld}{boss}{enemy}{pseudoboots}{unknown}{glitches}{shuffledmaps}{shuffledcompasses}{shuffledsmallkeys}{shuffledbigkeys}{shopsanity}{ambrosia}{nonprogressivebows}{activatedflute}{bonkshuffle}{goal}{tower}{towercrystals}{ganon}{ganoncrystals}{swords}{prizeshuffle}{mirrorscroll}&d={map}{chestcolor}{spoiler}{sphere}{autotracking}{trackingport}{mapstyle}{scale}{alwaysdisplay}&s={startingitemstring}&p={sprite}&r={epoch}"
      .replace("{world}", world)
      .replace("{entrance}", entrance)
      .replace("{door}", door)
      .replace("{overworld}", overworld)
      .replace("{boss}", boss)
      .replace("{enemy}", enemy)
      .replace("{pseudoboots}", pseudoboots)
      .replace("{unknown}", unknown)
      .replace("{glitches}", glitches)
      .replace("{shuffledmaps}", shuffledmaps)
      .replace("{shuffledcompasses}", shuffledcompasses)
      .replace("{shuffledsmallkeys}", shuffledsmallkeys)
      .replace("{shuffledbigkeys}", shuffledbigkeys)
      .replace("{shopsanity}", shopsanity)
      .replace("{ambrosia}", ambrosia)
      .replace("{nonprogressivebows}", nonprogressivebows)
      .replace("{activatedflute}", activatedflute)
      .replace("{bonkshuffle}", bonkshuffle)
      .replace("{goal}", goal)
      .replace("{tower}", tower)
      .replace("{towercrystals}", towercrystals)
      .replace("{ganon}", ganon)
      .replace("{ganoncrystals}", ganoncrystals)
      .replace("{swords}", swords)
      .replace("{prizeshuffle}", prizeshuffle)
      .replace("{mirrorscroll}", mirrorscroll)
      .replace("{map}", map)
      .replace("{chestcolor}", chestcolor)
      .replace("{spoiler}", spoiler)
      .replace("{sphere}", sphere)
      .replace("{autotracking}", autotracking)
      .replace("{trackingport}", trackingport.padStart(5, "0"))
      .replace("{mapstyle}", mapStyle)
      .replace("{scale}", scale)
      .replace("{alwaysdisplay}", alwaysdisplay)
      .replace("{startingitemstring}", startingitemstring)
      .replace("{sprite}", sprite)
      .replace("{epoch}", Date.now()),
    //.replace('{compact}', (map === "C" ? '&map=C' : '')),
    "",
    "width={width},height={height},titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0".replace("{width}", width).replace("{height}", height)
  );
}

function loadarchivepreset() {
  var archiveselect = document.getElementById("archivepresetselect");
  loadnamedpreset(archiveselect.options[archiveselect.selectedIndex].value.toLowerCase());
}

function loadnamedpreset(name) {
  switch (name) {
    case "ad":
      loadadpreset();
      break;
    case "adenemizer":
      loadadenemizerpreset();
      break;
    case "adkdb":
    case "adkeydrop":
      loadadkeydroppreset();
      break;
    case "adkeydropshop":
      loadadkeydropshoppreset();
      break;
    case "adkeys":
    case "adkeysanity":
    case "fadkeysanity":
      loadadkeyspreset();
      break;
    case "ambrosia":
      loadambrosiapreset();
      break;
    case "ambroz1a":
      loadambroz1apreset();
      break;
    case "bosshunt":
      loadbosshuntpreset();
      break;
    case "cabookey":
    case "kaesden/cabookey":
      loadcabookeypreset();
      break;
    case "casualboots":
      loadcasualbootspreset();
      break;
    case "championshunt":
      loadchuntpreset();
      break;
    case "championsswordless":
      loadcswordlesspreset();
      break;
    case "crisscross":
    case "jem041/crisscross_zw":
      loadcrisscrosspreset();
      break;
    case "crosshunt":
      loadcrosshuntpreset();
      break;
    case "crosskeys":
      loadcrosskeyspreset();
      break;
    case "crosskeys2024":
      loadcrosskeys2024preset();
      break;
    case "mfns./crosskeys_flute_ms_pb":
      loadcrosskeysflute_ms_pbpreset();
      break;
    case "mfns./crosskeys_kd_flute_inv_pb_zw":
      loadcrosskeys_kd_flute_inv_pb_zwpreset();
      break;
    case "mfns./crosskeys_kd_ms_pb_zw":
      loadcrosskeys_kd_ms_pb_zwpreset();
      break;
    case "mfns./crosskeys_ms_pb_zw":
      loadcrosskeys_ms_pb_zwpreset();
      break;
    case "mfns./crosskeys_kd_ad":
      loadcrosskeys_kd_adpreset();
      break;
    case "beginnerdoors":
      loaddoorsbeginnerpreset();
      break;
    case "intermediatedoors":
      loaddoorsintermediatepreset();
      break;
    case "doubledown":
      loaddoubledownpreset();
      break;
    case "duality":
      loaddualitypreset();
      break;
    case "enemizer":
      loadenemizerpreset();
      break;
    case "enemizerboots":
      loadenemizerbootspreset();
      break;
    case "ganonhunt":
      loadganonhuntpreset();
      break;
    case "goldrush":
      loadgoldrushpreset();
      break;
    case "hardopenplus":
      loadhardopenpluspreset();
      break;
    case "hmg":
      loadhmgpreset();
      break;
    case "influkeys":
    case "alttprleague/influkeys":
      loadinflukeyspreset();
      break;
    case "inverted":
    case "invc2023":
      loadinvertedpreset();
      break;
    case "invertedadkeysanity":
    case "inverted_adkeys":
      loadinvertedadkeyspreset();
      break;
    case "invertedcrosskeys":
      loadinvertedcrosskeyspreset();
      break;
    case "invertedkeysanity":
      loadinvertedkeyspreset();
      break;
    case "invrosia":
      loadinvrosiapreset();
      break;
    case "ludicrousspeed":
      loadludicrouspreset();
      break;
    case "mcboss":
      loadmcbosspreset();
      break;
    case "mcshuffle":
      loadmcshufflepreset();
      break;
    case "mystery":
    case "mmmmavid23":
      loadmysterypreset();
      break;
    case "nologic":
    case "nologic_rods":
      loadnologicpreset();
      break;
    case "open":
      loadopenpreset();
      break;
    case "open76":
      loadopen76preset();
      break;
    case "openboots":
      loadopenbootspreset();
      break;
    case "openkeysanity":
      loadopenkeyspreset();
      break;
    case "owg":
      loadowgpreset();
      break;
    case "owg_assured":
      loadowgassuredpreset();
      break;
    case "patronparty":
      loadpatronpartypreset();
      break;
    case "potpourri":
      loadpotpourripreset();
      break;
    case "pots&bones":
    case "pab":
      loadpotsandbonespreset();
      break;
    case "reducedcrystals":
      loadreducedpreset();
      break;
    case "retrance":
    case "retrance_bow":
      loadretrancepreset();
      break;
    case "shoptillyoudrop":
      loadshoptillyoudroppreset();
      break;
    case "standard":
      loadstandardpreset();
      break;
    case "standardboots":
      loadstandardbootspreset();
      break;
    case "supercrosskeys":
      loadsupercrosskeyspreset();
      break;
    case "truepothunt":
    case "tph2023":
      loadtruepothuntpreset();
      break;
    case "xdhunt":
    case "jem041/xkeydrophunt":
      loadxdhuntpreset();
      break;
  }
}

function loadPreset(settings) {
  resetallstartingitems();
  resetallsettings();

  for (const [key, value] of Object.entries(settings)) {
    if (typeof value === "boolean") {
      document.getElementById(key).checked = value;
    } else {
      document.getElementById(key).value = value;
    }
  }

  window.scrollTo(0, document.body.scrollHeight);
  showToast();
}

function loadadpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadadenemizerpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossshuffled: true,
    enemyshuffled: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadadkdbpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doorpots: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadadkeydroppreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doorpots: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadadkeydropshoppreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doorpots: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityyes: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadadkeyspreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadambrosiapreset() {
  loadPreset({
    gametypestandard: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiayes: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadambroz1apreset() {
  loadPreset({
    gametyperetro: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganonhunt: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiayes: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsyes: true,
    activatedfluteyes: true,
    bonkshuffleno: true,
  });
}

function loadbosshuntpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganonhunt: true,
    goalcrystal: true,
    towerselect: 0,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadcabookeypreset() {
  loadPreset({
    gametypestandard: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadcasualbootspreset() {
  loadPreset({
    gametypestandard: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadchuntpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganonhunt: true,
    goalcrystal: true,
    towerselect: 5,
    ganoncrystal: true,
    ganonselect: 7,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadcrisscrosspreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doorcrossed: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalrandom: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityyes: true,
    ambrosiano: true,
    pseudobootsyes: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadcrosshuntpreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganonhunt: true,
    goalcrystal: true,
    towerselect: 0,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadcrosskeyspreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadcrosskeysflute_ms_pbpreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    mirrorscrollyes: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteyes: true,
    bonkshuffleno: true,
  });
  setstartingitem("flute", 14, "0");

}

function loadcrosskeys_kd_flute_inv_pb_zwpreset() {
  loadPreset({
    gametypeinverted: true,
    entrancesimple: true,
    doorpots: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsyes: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteyes: true,
    bonkshuffleno: true,
  });
  setstartingitem("flute", 14, "0");
}

function loadcrosskeys_kd_ms_pb_zwpreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doorpots: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsyes: true,
    mirrorscrollyes: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadcrosskeys_ms_pb_zwpreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsyes: true,
    mirrorscrollyes: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadcrosskeys_kd_adpreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doorpots: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadcrosskeys2024preset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsyes: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadcswordlesspreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsswordless: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loaddoorsbeginnerpreset() {
  loadPreset({
    gametypestandard: true,
    entrancenone: true,
    doorcrossed: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsyes: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loaddoorsintermediatepreset() {
  loadPreset({
    gametypestandard: true,
    entrancenone: true,
    doorcrossed: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsyes: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loaddoubledownpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loaddualitypreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 1,
    ganoncrystal: true,
    ganonselect: 5,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadenemizerpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossshuffled: true,
    enemyshuffled: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadenemizerbootspreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossshuffled: true,
    enemyshuffled: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadganonhuntpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganonhunt: true,
    goalcrystal: true,
    towerselect: 5,
    ganoncrystal: true,
    ganonselect: 2,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadgoldrushpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaltriforcehunt: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadhardopenpluspreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsyes: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadhmgpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitcheshybrid: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadinflukeyspreset() {
  loadPreset({
    gametypeinverted: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteyes: true,
    bonkshuffleno: true,
  });
  setstartingitem("flute", 14, "1");
}

function loadinvertedpreset() {
  loadPreset({
    gametypeinverted: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadinvertedadkeyspreset() {
  loadPreset({
    gametypeinverted: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadinvertedcrosskeyspreset() {
  loadPreset({
    gametypeinverted: true,
    entrancesimple: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadinvertedkeyspreset() {
  loadPreset({
    gametypeinverted: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadinvrosiapreset() {
  loadPreset({
    gametypeinverted: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiayes: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadludicrouspreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: true,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadmcbosspreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossshuffled: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadmcshufflepreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadmysterypreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossshuffled: true,
    enemyshuffled: true,
    glitchesnone: true,
    goalganon: true,
    goalrandom: true,
    towerselect: 7,
    ganonrandom: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownmystery: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadnologicpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnologic: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadopenpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    prizeshuffleno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadopen76preset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 6,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadopenbootspreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadopenkeyspreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadowgpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesoverworld: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadowgassuredpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesoverworld: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadpatronpartypreset() {
  loadPreset({
    gametypeinverted: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossshuffled: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 0,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsyes: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteyes: true,
  });
  setstartingitem("hookshot", 3, "1");
  setstartingitem("glove", 23, "1");
  setstartingitem("flute", 14, "1");
}

function loadpotpourripreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossshuffled: true,
    enemynone: true,
    glitchesnone: true,
    goaldungeons: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteyes: true,
    bonkshuffleno: true,
  });
  setstartingitem("hookshot", 3, "1");
  setstartingitem("icerod", 7, "1");
  setstartingitem("flute", 14, "1");
}

function loadpotsandbonespreset() {
  loadPreset({
    gametypestandard: true,
    entrancesimple: true,
    doorpots: true,
    overworldno: true,
    prizeshuffleno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaltriforcehunt: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
  setstartingitem("lantern", 11, "1");
  setstartingitem("boomerang", 2, "2");
}

function loadreducedpreset() {
  loadPreset({
    gametypeopen: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 6,
    ganoncrystal: true,
    ganonselect: 6,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadretrancepreset() {
  loadPreset({
    gametyperetro: true,
    entrancesimple: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsassured: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadshoptillyoudroppreset() {
  loadPreset({
    gametyperetro: true,
    entrancesimple: true,
    doorpots: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityyes: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadstandardpreset() {
  loadPreset({
    gametypestandard: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

function loadstandardbootspreset() {
  loadPreset({
    gametypestandard: true,
    entrancenone: true,
    doornone: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganon: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: false,
    shuffledcompasses: false,
    shuffledsmallkeys: false,
    shuffledbigkeys: false,
    nonprogressivebowsno: true,
    activatedfluteno: true,
  });
  setstartingitem("boots", 22, "1");
}

function loadsupercrosskeyspreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doorpots: true,
    overworldno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalfast: true,
    goalcrystal: true,
    towerselect: 4,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsyes: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleyes: true,
  });
}

function loadtruepothuntpreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doorpots: true,
    overworldno: true,
    prizeshuffleno: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goaltriforcehunt: true,
    goalcrystal: true,
    towerselect: 7,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityyes: true,
    ambrosiano: true,
    pseudobootsno: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
  setstartingitem("boots", 22, "1");
  setstartingitem("lantern", 11, "1");
}

function loadxdhuntpreset() {
  loadPreset({
    gametypeopen: true,
    entrancesimple: true,
    doorpots: true,
    overworldno: true,
    prizeshufflewild: true,
    bossnone: true,
    enemynone: true,
    glitchesnone: true,
    goalganonhunt: true,
    goalcrystal: true,
    towerselect: 4,
    ganoncrystal: true,
    ganonselect: 7,
    swordsrandomized: true,
    unknownnone: true,
    shopsanityno: true,
    ambrosiano: true,
    pseudobootsyes: true,
    shuffledmaps: true,
    shuffledcompasses: true,
    shuffledsmallkeys: true,
    shuffledbigkeys: true,
    nonprogressivebowsno: true,
    activatedfluteno: true,
    bonkshuffleno: true,
  });
}

async function importflags(auto = false) {
  return new Promise((resolve) => {
    var i = document.getElementById("importflag").value;
    var hash;

    if (i.indexOf("/") > 1) {
      hash = i.substr(i.lastIndexOf("/") + 1);
    }
    if (i.indexOf("#") > 1) {
      hash = i.substr(0, i.indexOf("#"));
    }

    var finalURL = "https://alttpr-patch-data.s3.us-east-2.amazonaws.com/" + hash + ".json";

    if (i.indexOf("beeta") > 1) {
      finalURL = "https://alttpr-patch-data-beta.s3.us-east-2.amazonaws.com/" + hash + ".json";
    } else if (i.indexOf("gwaa.kiwi") > 1) {
      alert("Auto-config from gwaa.kiwi is not supported.");
    }

    $.getJSON(finalURL, function (data) {
      var d = data.spoiler;

      // Gameplay
      if (d.meta.spoilers === "mystery") {
        loadmysterypreset(false);
        resolve("mystery");
      } else {
        document.getElementById("gametype" + d.meta.mode).checked = true;

        //Entrance flag
        if (d.meta.shuffle != null) {
          document.getElementById("entrancesimple").checked = true;
        } else {
          document.getElementById("entrancenone").checked = true;
        }

        document.getElementById("doornone").checked = true;
        document.getElementById("overworldno").checked = true;

        if (d.meta["enemizer.boss_shuffle"] === "none") {
          document.getElementById("bossnone").checked = true;
        } else {
          document.getElementById("bossshuffled").checked = true;
        }

        if (d.meta["enemizer.enemy_shuffle"] === "none") {
          document.getElementById("enemynone").checked = true;
        } else {
          document.getElementById("enemyshuffled").checked = true;
        }

        if (d.meta.pseudoboots) {
          document.getElementById("pseudobootsyes").checked = true;
        } else {
          document.getElementById("pseudobootsno").checked = true;
        }

        if ("mirrorscroll" in d.meta && d.meta.mirrorscroll) {
          document.getElementById("mirrorscrollyes").checked = true;
        } else {
          document.getElementById("mirrorscrollno").checked = true;
        }

        // Logic
        document.getElementById("swords" + d.meta.weapons).checked = true;

        switch (d.meta.dungeon_items) {
          case "standard":
            document.getElementById("shuffledmaps").checked = false;
            document.getElementById("shuffledcompasses").checked = false;
            document.getElementById("shuffledsmallkeys").checked = false;
            document.getElementById("shuffledbigkeys").checked = false;
            break;
          case "mc":
            document.getElementById("shuffledmaps").checked = true;
            document.getElementById("shuffledcompasses").checked = true;
            document.getElementById("shuffledsmallkeys").checked = false;
            document.getElementById("shuffledbigkeys").checked = false;
            break;
          case "mcs":
            document.getElementById("shuffledmaps").checked = true;
            document.getElementById("shuffledcompasses").checked = true;
            document.getElementById("shuffledsmallkeys").checked = true;
            document.getElementById("shuffledbigkeys").checked = false;
            break;
          case "full":
            document.getElementById("shuffledmaps").checked = true;
            document.getElementById("shuffledcompasses").checked = true;
            document.getElementById("shuffledsmallkeys").checked = true;
            document.getElementById("shuffledbigkeys").checked = true;
            break;
        }

        document.getElementById("ambrosiano").checked = true;
        // bows
        // flute
        // bonk
        document.getElementById("shopsanityno").checked = true;

        switch (d.meta.logic) {
          case "NoLogic":
            document.getElementById("glitchesnologic").checked = true;
            break;
          case "NoGlitches":
            document.getElementById("glitchesnone").checked = true;
            break;
          case "OverworldGlitches":
            document.getElementById("glitchesoverworld").checked = true;
            break;
          case "MajorGlitches":
            document.getElementById("glitchesmajor").checked = true;
            break;
          case "HybridMajorGlitches":
            document.getElementById("glitcheshybrid").checked = true;
            break;
        }

        // Goal

        switch (d.meta.goal) {
          case "ganon":
            document.getElementById("goalganon").checked = true;
            break;
          case "fast_ganon":
            document.getElementById("goalfast").checked = true;
            break;
          case "dungeons":
            document.getElementById("goaldungeons").checked = true;
            break;
          case "pedestal":
            document.getElementById("goalpedestal").checked = true;
            break;
          case "triforce_hunt":
            document.getElementById("goaltriforcehunt").checked = true;
            break;
          case "ganonhunt":
            document.getElementById("goalganonhunt").checked = true;
            break;
          default:
            document.getElementById("goalother").checked = true;
            break;
        }

        if (d.meta.entry_crystals_tower === "random") {
          document.getElementById("goalrandom").checked = true;
          document.getElementById("towerselect").value = 7;
        } else {
          document.getElementById("goalcrystal").checked = true;
          document.getElementById("towerselect").value = d.meta.entry_crystals_tower;
        }

        if (d.meta.entry_crystals_ganon === "random") {
          document.getElementById("ganonrandom").checked = true;
          document.getElementById("ganonselect").value = 7;
        } else {
          document.getElementById("ganoncrystal").checked = true;
          document.getElementById("ganonselect").value = d.meta.entry_crystals_ganon;
        }
      }
      if (!auto) {
        window.scrollTo(0, document.body.scrollHeight);
        showToast();
      }
      resolve("normal");
    });
  });
}

function showToast() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

function togglediv(x) {
  var d = document.getElementById(x + "div");
  var a = document.getElementById(x + "arrow");

  if (d.style.display === "block") {
    d.style.display = "none";
    a.innerHTML = "&#9660;";
  } else {
    d.style.display = "block";
    a.innerHTML = "&#9650;";
  }
}

function togglereleasediv(x) {
  var d = document.getElementById("release" + x);
  var a = document.getElementById("arrow" + x);

  if (d.style.display === "block") {
    d.style.display = "none";
    a.innerHTML = "&#9660;";
  } else {
    d.style.display = "block";
    a.innerHTML = "&#9650;";
  }
}

$(document).ready(function () {
  // Find dropdownand apply select2
  const dropdowns = document.querySelectorAll(".sprite-dropdown");
  if (dropdowns.length > 0) {
    $(".sprite-dropdown").select2();
  }
});
