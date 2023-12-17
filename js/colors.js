const colorPickers = document.querySelectorAll("input.input-color-picker");
const opacitySliders = document.querySelectorAll("input.input-color-opacity-slider");

const mikeColors = {
  "available-color": "#00ff00",
  "unavailable-color": "#ff0000",
  "possible-color": "#ffff00",
  "information-color": "#ffa500",
  "darkavailable-color": "#2433ff",
  "darkpossible-color": "#800080",
  "partialavailable-color": "#17aaee",
  "opened-color": "#808080a6",
  "connector-color": "#ff00f9",
  "connector1-color": "#ff50f9",
  "connector3-color": "#bf00ff",
  "hc-color": "#14439a",
  "ct-color": "#00eaff",
  "ep-color": "#00eaff",
  "dp-color": "#cdca27",
  "dp_n-color": "#00eaff",
  "toh-color": "#00eaff",
  "pod-color": "#00eaff",
  "sp-color": "#00eaff",
  "sw-color": "#00eaff",
  "tt-color": "#00eaff",
  "ip-color": "#00eaff",
  "mm-color": "#00eaff",
  "tr-color": "#d44a00",
  "gt-color": "#00eaff",
  "ganon-color": "#00eaff",
};

const dunkaColors = {
  "available-color": "#00ff00",
  "unavailable-color": "#ff0000",
  "possible-color": "#ffff00",
  "information-color": "#ffa500",
  "darkavailable-color": "#2433ff",
  "darkpossible-color": "#800080",
  "partialavailable-color": "#17aaee",
  "opened-color": "#808080",
  "connector-color": "#ff00f9",
  "connector1-color": "#ff50f9",
  "connector3-color": "#bf00ff",
  "hc-color": "#00eaff",
  "ct-color": "#00eaff",
  "ep-color": "#00eaff",
  "dp-color": "#00eaff",
  "dp_n-color": "#00eaff",
  "toh-color": "#00eaff",
  "pod-color": "#00eaff",
  "sp-color": "#00eaff",
  "sw-color": "#00eaff",
  "tt-color": "#00eaff",
  "ip-color": "#00eaff",
  "mm-color": "#00eaff",
  "tr-color": "#00eaff",
  "gt-color": "#00eaff",
  "ganon-color": "#00eaff",
};

const altColors = {
  "available-color": "#055fe6",
  "unavailable-color": "#c46902",
  "possible-color": "#faf600",
  "information-color": "#d53ae6",
  "darkavailable-color": "#034f6d",
  "darkpossible-color": "#cdbd00",
  "partialavailable-color": "#fee090",
  "opened-color": "#858585",
  "connector-color": "#ff00f9",
  "connector1-color": "#ff50f9",
  "connector3-color": "#bf00ff",
  "hc-color": "#14439a",
  "ct-color": "#00eaff",
  "ep-color": "#00eaff",
  "dp-color": "#cdca27",
  "dp_n-color": "#00eaff",
  "toh-color": "#00eaff",
  "pod-color": "#00eaff",
  "sp-color": "#00eaff",
  "sw-color": "#00eaff",
  "tt-color": "#00eaff",
  "ip-color": "#00eaff",
  "mm-color": "#00eaff",
  "tr-color": "#d44a00",
  "gt-color": "#00eaff",
  "ganon-color": "#00eaff",
};

const colorSets = {
  mike: mikeColors,
  dunka: dunkaColors,
  alt: altColors,
};

const colorUpdate = (colors) => {
  const root = document.documentElement;
  Object.keys(colors).forEach((key) => {
    root.style.setProperty(key, colors[key]);
  });
};

colorPickers.forEach((item) => {
  item.addEventListener("input", (e) => {
    saveColorSettings();
  });
});

opacitySliders.forEach((item) => {
  item.addEventListener("input", (e) => {
    saveColorSettings();
  });
});

const handleColorClick = (e) => {
  const color = e.getAttribute("data-color");
  const colorPicker = document.querySelector(
    `input.input-color-picker[data-id="${e.getAttribute("data-id")}"]`
  );
  colorPicker.value = color;
  colorPicker.dispatchEvent(new Event("input"));
};

const setColorAndSlider = (item, colorSettings) => {
  const slider = document.querySelector("input.input-color-opacity-slider[data-id='" + item.getAttribute("data-id") + "']");
  if (!colorSettings[item.getAttribute("data-id")]) {
    colorSettings[item.getAttribute("data-id")] = mikeColors[item.getAttribute("data-id")];
  } 
  if (colorSettings[item.getAttribute("data-id")].length < 8) {
    colorSettings[item.getAttribute("data-id")] = colorSettings[item.getAttribute("data-id")] + "ff";
  }
  let sliderHex = colorSettings[item.getAttribute("data-id")].slice(-2);
  // padded to
  slider.value = parseInt(sliderHex, 16) / 255
  item.value = colorSettings[item.getAttribute("data-id")].slice(0, -2);
}

// Save color settings to local storage
const saveColorSettings = () => {
  const colorSettings = {};
  const colorPicker = document.querySelectorAll("input.input-color-picker");
  colorPicker.forEach((item) => {
    const slider = document.querySelector("input.input-color-opacity-slider[data-id='" + item.getAttribute("data-id") + "']");
    let sliderHex = Math.ceil(slider.value * 255).toString(16).padStart(2, "0");
    colorSettings[item.getAttribute("data-id")] = item.value + sliderHex;
  });
  localStorage.setItem("colorSettings", JSON.stringify(colorSettings));
};

const setAllColors = (preset) => {
  let colorSettings;
  switch (preset) {
    case "mike":
      colorSettings = mikeColors;
      break;
    case "dunka":
      colorSettings = dunkaColors;
      break;
    case "alt":
      colorSettings = altColors;
      break;
    default:
      colorSettings = mikeColors;
  }
  // Set color pickers
  colorPickers.forEach((item) => {
    setColorAndSlider(item, colorSettings);
    // const slider = document.querySelector("input.input-color-opacity-slider[data-id='" + item.getAttribute("data-id") + "']");
    // let sliderHex = colorSettings[item.getAttribute("data-id")].slice(-2);
    // slider.value = parseInt(sliderHex, 16);
    // item.value = colorSettings[item.getAttribute("data-id")].slice(0, -2);
  });
  saveColorSettings();
};

const saveToDownload = () => {
  const colorSettings = JSON.parse(localStorage.getItem("colorSettings"));
  if (!colorSettings) {
    colorSettings = mikeColors;
  };
  const data = JSON.stringify(colorSettings);
  const blob = new Blob([data], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "alttprtracker_colors.json";
  link.href = url;
  link.click();
}

const loadFromFile = (input) => {
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const colorSettings = JSON.parse(event.target.result);
    colorPickers.forEach((item) => {
      setColorAndSlider(item, colorSettings);
    })
      // const slider = document.querySelector("input.input-color-opacity-slider[data-id='" + item.getAttribute("data-id") + "']");
      // let sliderHex = colorSettings[item.getAttribute("data-id")].slice(-2);
      // slider.value = parseInt(sliderHex, 16);
      // item.value = colorSettings[item.getAttribute("data-id")].slice(0, -2);    });
    saveColorSettings();
  };
  reader.readAsText(file);
};

const loadedColorSettings = localStorage.getItem("colorSettings");
if (loadedColorSettings) {
  const colorSettings = JSON.parse(loadedColorSettings);
  colorPickers.forEach((item) => {
    setColorAndSlider(item, colorSettings);
    // const slider = document.querySelector("input.input-color-opacity-slider[data-id='" + item.getAttribute("data-id") + "']");
    // let sliderHex = colorSettings[item.getAttribute("data-id")].slice(-2);
    // slider.value = parseInt(sliderHex, 16);
    // item.value = colorSettings[item.getAttribute("data-id")].slice(0, -2);
  });
} else {
  setAllColors("mike");
}
