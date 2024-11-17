const logicCheckboxes = document.querySelectorAll("input.logiccheckbox");

const allLogic = {
  "canIceBreak": true,
  "canHookClip": true,
  "canBombJump": true,
  "canBombOrBonkCameraUnlock": true,
  "canHover": true,
  "canHoverAlot": true,
  "canSpeckyClip": true,
  "canFireSpooky": true,
  "canBombSpooky": true,
  "canHeraPot": true,
  "canMimicClip": true,
  "canPotionCameraUnlock": true,
  "canMoldormBounce": true,
  "canDarkRoomNavigateBlind": true,
  "canTorchRoomNavigateBlind": true,
  "canFairyReviveHover": true,
  "canFakeFlipper": true,
  "canOWFairyRevive": true,
  "canQirnJump": true,
  "canMirrorSuperBunny": true,
  "canDungeonBunnyRevive": true,
  "canFakePowder": true,
  "canWaterWalk": true,
  "canZoraSplashDelete": true,
  "canBunnyPocket": true,
  "canFairyBarrierRevive": true,
  "canShockBlock": true,
  "canTombRaider": true
};

const noStupid = {
  "canIceBreak": true,
  "canHookClip": true,
  "canBombJump": true,
  "canBombOrBonkCameraUnlock": true,
  "canHover": true,
  "canHoverAlot": false,
  "canSpeckyClip": true,
  "canFireSpooky": true,
  "canBombSpooky": true,
  "canHeraPot": true,
  "canMimicClip": true,
  "canPotionCameraUnlock": true,
  "canMoldormBounce": true,
  "canDarkRoomNavigateBlind": true,
  "canTorchRoomNavigateBlind": true,
  "canFairyReviveHover": false,
  "canFakeFlipper": true,
  "canOWFairyRevive": false,
  "canQirnJump": true,
  "canMirrorSuperBunny": true,
  "canDungeonBunnyRevive": true,
  "canFakePowder": true,
  "canWaterWalk": true,
  "canZoraSplashDelete": true,
  "canBunnyPocket": true,
  "canFairyBarrierRevive": false,
  "canShockBlock": false,
  "canTombRaider": true
};

const basicLogic = {
  "canIceBreak": true,
  "canHookClip": true,
  "canBombJump": true,
  "canBombOrBonkCameraUnlock": false,
  "canHover": false,
  "canHoverAlot": false,
  "canSpeckyClip": true,
  "canFireSpooky": true,
  "canBombSpooky": false,
  "canHeraPot": true,
  "canMimicClip": true,
  "canPotionCameraUnlock": true,
  "canMoldormBounce": false,
  "canDarkRoomNavigateBlind": true,
  "canTorchRoomNavigateBlind": true,
  "canFairyReviveHover": false,
  "canFakeFlipper": true,
  "canOWFairyRevive": false,
  "canQirnJump": true,
  "canMirrorSuperBunny": true,
  "canDungeonBunnyRevive": true,
  "canFakePowder": true,
  "canWaterWalk": true,
  "canZoraSplashDelete": true,
  "canBunnyPocket": false,
  "canFairyBarrierRevive": false,
  "canShockBlock": false,
  "canTombRaider": true
};

// Save logic settings to local storage
const savelogicSettings = () => {
  var logicSettings = {};
  const logicCheckboxes = document.querySelectorAll("input.logiccheckbox");
  if (logicCheckboxes.length !== 0) {
    logicCheckboxes.forEach((item) => {
      logicSettings[item.getAttribute("id")] = item.checked;
    });
  } else {
    logicSettings = basicLogic;
  }
  localStorage.setItem("logicSettings", JSON.stringify(logicSettings));
};

const setAlllogics = (preset) => {
  let logicSettings;
  switch (preset) {
    case "all":
      logicSettings = allLogic;
      break;
    case "nostupid":
      logicSettings = noStupid;
      break;
    case "basic":
      logicSettings = basicLogic;
      break;
    default:
      logicSettings = {};
      Object.keys(basicLogic).forEach((item) => {
        logicSettings[item] = false;
      });
  }
  logicCheckboxes.forEach((item) => {
    item.checked = logicSettings[item.getAttribute("id")];
  });
  savelogicSettings();
};

const loadedlogicSettings = localStorage.getItem("logicSettings");
if (loadedlogicSettings) {
  const logicSettings = JSON.parse(loadedlogicSettings);
  logicCheckboxes.forEach((item) => {
    item.checked = logicSettings[item.getAttribute("id")];
  });
} else {
  setAlllogics("basic");
}

const handleSaveBack = () => {
  savelogicSettings();
  window.location.href = "index.html";
}
