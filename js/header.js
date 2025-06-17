var header = `
  <div style="flex: auto"> 
    <span class="default-white-text" 
      >Build 2.2.003 20250617<br />DR, OR, VT (v31.x.x) and Prachack (>=14.4.0) supported<br />Report any issues via 
      <a href="https://discord.gg/VpqbrHjPCu" target="_blank">Muffins' discord server <img src="./images/discord.png" style="width: 20px; vertical-align: middle" /></a><br /> 
      Check Known Issues for current known outstanding issues 
    </span> 
  </div> 
  <div id="headerTextElement" style="flex: auto; display: flex; flex-direction: column; align-items: end; margin-top: 0px; margin-bottom: 0px">
    <div class="kofi-button" style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px;"></div> 
    <div id="versionTextElement" style="color: #fff; text-align: right; margin-right: 5px; margin-top: 0px; margin-bottom: 0px">
      <a href="https://legacy.alttprtracker.mfns.dev/" target="_blank">Legacy version</a> || <a href="https://dev.alttprtracker.mfns.dev/" target="_blank">Development version</a>
    </div>
  </div>
`;
// <b> **DEVELOPMENT VERSION** </b> - <a href="https://alttprtracker.mfns.dev/" target="_blank">Stable version here</a>

function insertHeader() {
  var headerElement = document.getElementById("headerTextElement");
  if (headerElement) {
    headerElement.innerHTML = header;
    if (typeof kofiwidget2 !== "undefined") {
      kofiwidget2.init("Support Muffins on Ko-fi", "#31801d", "Q5Q1VMWWD");
      headerElement.querySelector(".kofi-button").innerHTML = kofiwidget2.getHTML();
    }
  }
}
