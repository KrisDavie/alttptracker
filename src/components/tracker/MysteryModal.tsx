import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { useState } from "react";
import { Button } from "../ui/button";
import { resetSettings, setSettings } from "../../store/settingsSlice";
import { setModalClose } from "../../store/trackerSlice";
import { resetBossesForShuffle, resetDungeons } from "@/store/dungeonsSlice";
import { setAutotrackingSettings } from "@/store/autotrackerSlice";
import { resetItems } from "@/store/itemsSlice";
import { resetChecks } from "@/store/checksSlice";
import { resetEntrances } from "@/store/entrancesSlice";
import { resetScouts } from "@/store/scoutsSlice";
import { resetOverworldState } from "@/store/overworldSlice";
import { getSession } from "@/lib/sessionManager";
import { getSessionInstanceId } from "@/lib/sessionHelper";
import { buildPresetIDBState } from "@/lib/launchHelpers";
import { getPresetById } from "@/data/launcherPresets";

function MysteryModal() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const trackerSettings = useSelector((state: RootState) => state.settings);
  const [localSettings, setLocalSettings] = useState(trackerSettings);
  const [prevTrackerSettings, setPrevTrackerSettings] = useState(trackerSettings);

  const autotrackerSettings = useSelector((state: RootState) => state.autotracker);
  const [localAutotrackerSettings, setLocalAutotrackerSettings] = useState(autotrackerSettings);
  const [prevAutotrackerSettings, setPrevAutotrackerSettings] = useState(autotrackerSettings);


  if (trackerSettings !== prevTrackerSettings) {
    setPrevTrackerSettings(trackerSettings);
    setLocalSettings(trackerSettings);
  }

  if (autotrackerSettings !== prevAutotrackerSettings) {
    setPrevAutotrackerSettings(autotrackerSettings);
    setLocalAutotrackerSettings(autotrackerSettings);
  }

  type SettingsKey = keyof typeof trackerSettings;
  type SettingsValue = string | boolean;

  const handleInputChange = (key: SettingsKey, value: SettingsValue) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleFullReset = async () => {
    if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      const sessionId = getSessionInstanceId();
      const session = await getSession(sessionId);
      
      const presetId = session?.presetId;
      const preset = presetId ? getPresetById(presetId) : undefined;
      const startingItems = session?.startingItems || preset?.startingItems || {};
      
      const presetState = buildPresetIDBState(startingItems, preset);

      dispatch(resetItems(presetState.items || undefined));
      dispatch(resetChecks(presetState.checks || undefined));
      dispatch(resetEntrances(presetState.entrances || undefined));
      dispatch(resetDungeons(presetState.dungeons || undefined));
      console.log(preset?.settings)
      if (preset?.settings) {
        dispatch(resetSettings(preset.settings));
      }
      
      dispatch(resetOverworldState());
      dispatch(resetScouts());
      dispatch(setModalClose());
    }
  };

  const handleSubmit = () => {
    dispatch(setSettings(localSettings));
    if (localSettings.bossShuffle !== trackerSettings.bossShuffle) {
      dispatch(resetBossesForShuffle({ bossShuffle: localSettings.bossShuffle }));
    }
    dispatch(setAutotrackingSettings(localAutotrackerSettings));
    dispatch(setModalClose());
  };

  return (
    <div className="w-100 h-100 bg-white m-6 border-gray-800 border-4 text-black grid grid-rows-7">
      <div className="row-span-1 flex flex-row justify-between items-center mx-3">
        <h2 className="font-bold font-roboto">Change Flags</h2>
        <div className="flex flex-row">
          <div className={`font-roboto text-sm border-black ${page === 1 ? "border-b-2 pb-1 mr-4 cursor-pointer" : "text-gray-500 mr-4 cursor-pointer"}`} onClick={() => setPage(1)}>
            Main flags
          </div>
          <div className={`font-roboto text-sm border-black ${page === 2 ? "border-b-2 pb-1 mr-4 cursor-pointer" : "text-gray-500 mr-4 cursor-pointer"}`} onClick={() => setPage(2)}>
            Extra settings
          </div>
          <div className={`font-roboto text-sm border-black ${page === 3 ? "border-b-2 pb-1 cursor-pointer" : "text-gray-500 cursor-pointer"}`} onClick={() => setPage(3)}>
            UI & Reset
          </div>
        </div>
      </div>
      {/* Page 1 */}
      {page === 1 && (
        <div className={`row-span-5 px-4 pt-1 overflow-y-auto`}>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 items-center text-sm font-roboto">
            <label className="font-medium">World State:</label>
            <select className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" value={localSettings.worldState} onChange={(e) => handleInputChange("worldState", e.target.value)}>
              <option value="standard">Standard</option>
              <option value="open">Open</option>
              <option value="standverted">Standverted</option>
              <option value="inverted_1">Inverted 1.0</option>
              <option value="inverted">Inverted 2.0</option>
            </select>

            <label className="font-medium">Entrance Shuffle:</label>
            <select className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" value={localSettings.entranceMode} onChange={(e) => handleInputChange("entranceMode", e.target.value)}>
              <option value="none">None</option>
              <option value="crossed">Crossed</option>
              <option value="lean">Lean</option>
              <option value="lite">Lite</option>
              <option value="dungeonssimple">Dungeons Simple</option>
              <option value="dungeonsfull">Dungeons Full</option>
              <option value="simple">Simple</option>
              <option value="restricted">Restricted</option>
              <option value="full">Full</option>
              <option value="district">District</option>
              <option value="swapped">Swapped</option>
              {/* <option value="insanity">Insanity</option> */}
            </select>

            <label className="font-medium">Boss Shuffle:</label>
            <select className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" value={localSettings.bossShuffle} onChange={(e) => handleInputChange("bossShuffle", e.target.value)}>
              <option value="none">None</option>
              {/* <option value="simple">Simple</option>
              <option value="full">Full</option> */}
              <option value="random">Random</option>
            </select>

            <label className="font-medium">Enemy Shuffle:</label>
            <select className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" value={localSettings.enemyShuffle} onChange={(e) => handleInputChange("enemyShuffle", e.target.value)}>
              <option value="none">None</option>
              {/* <option value="shuffled">Shuffled</option> */}
              <option value="random">Random</option>
            </select>

            <label className="font-medium self-start pt-1">Dungeon Items:</label>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="checkbox" className="accent-red-600" checked={localSettings.wildMaps} onChange={(e) => handleInputChange("wildMaps", e.target.checked)} />
                <span>Maps</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="checkbox" className="accent-red-600" checked={localSettings.wildCompasses} onChange={(e) => handleInputChange("wildCompasses", e.target.checked)} />
                <span>Compasses</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="checkbox" className="accent-red-600" checked={localSettings.wildSmallKeys === "wild"} onChange={(e) => handleInputChange("wildSmallKeys", e.target.checked ? "wild" : "inDungeon")} />
                <span>Small Keys</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="checkbox" className="accent-red-600" checked={localSettings.wildBigKeys} onChange={(e) => handleInputChange("wildBigKeys", e.target.checked)} />
                <span>Big Keys</span>
              </label>
            </div>

            {/* <label className="font-medium">Item Pool:</label>
            <select className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" disabled value={localSettings.itemPool} onChange={(e) => handleInputChange("itemPool", e.target.value)}>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select> */}

            <label className="font-medium self-start pt-1">Misc:</label>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="checkbox" checked={localSettings.shopsanity} className="disabled:bg-gray-400" onChange={(e) => handleInputChange("shopsanity", e.target.checked)} />
                <span>Shopsanity</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="checkbox" checked={localSettings.activatedFlute} className="disabled:bg-gray-400" onChange={(e) => handleInputChange("activatedFlute", e.target.checked)} />
                <span>Activated Flute</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="checkbox" checked={localSettings.bonkShuffle} onChange={(e) => handleInputChange("bonkShuffle", e.target.checked)} />
                <span>Bonk Shuffle</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="checkbox" checked={localSettings.zelgaWoods} onChange={(e) => handleInputChange("zelgaWoods", e.target.checked)} />
                <span>Zelga Woods</span>
              </label>

            </div>
          </div>
        </div>
      )}

      {page === 2 && (
        <div className={`row-span-5 px-4 pt-1 overflow-y-auto`}>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 items-center text-sm font-roboto">
            <label className="font-medium">Swords:</label>
            <select className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" value={localSettings.swords} onChange={(e) => handleInputChange("swords", e.target.value)}>
              <option value="randomized">Randomized</option>
              <option value="assured">Assured</option>
              <option value="vanilla">Vanilla</option>
              <option value="swordless">Swordless</option>
            </select>
            <label className="font-medium">Pottery:</label>
            <select className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" value={localSettings.pottery} onChange={(e) => handleInputChange("pottery", e.target.value)}>
              <option value="none">None</option>
              <option value="keys">Keys</option>
              <option value="cave">Cave</option>
              <option value="cavekeys">Cavekeys</option>
              <option value="dungeon">Dungeon</option>
              <option value="lottery">Lottery</option>
            </select>
            <label className="font-medium">Enemy Drop:</label>
            <select className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" value={localSettings.enemyDrop} onChange={(e) => handleInputChange("enemyDrop", e.target.value)}>
              <option value="none">None</option>
              <option value="keys">Keys</option>
              <option value="underworld">Underworld</option>
            </select>
          </div>
        </div>
      )}
      {page === 3 && (
        <div className={`row-span-5 px-4 pt-1 overflow-y-auto`}>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 items-center text-sm font-roboto">
            <label className="font-medium">Map Mode:</label>
            <select className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" value={localSettings.mapMode} onChange={(e) => handleInputChange("mapMode", e.target.value)}>
              <option value="off">None</option>
              <option value="normal">Normal</option>
              <option value="compact">Compact</option>
              <option value="vertical">Vertical</option>
            </select>

            <button className="bg-gray-300 font-roboto col-span-2" onClick={handleFullReset}>
              Reset Tracker State
            </button>
            
          </div>
        </div>
      )}
      {/* Footer */}
      <div className="row-span-1 flex flex-row justify-center items-center mx-3 space-x-3">
        <Button variant="outline" className="bg-gray-300 font-roboto" size="sm" onClick={() => dispatch(setModalClose())}>
          Close
        </Button>
        <Button variant="outline" className="bg-gray-300 font-roboto" size="sm" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default MysteryModal;
