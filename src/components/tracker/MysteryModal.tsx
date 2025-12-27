import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { useState } from "react";
import { Button } from "../ui/button";
import { setSettings } from "../../store/settingsSlice";
import { setModalClose } from "../../store/trackerSlice";

function MysteryModal() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const trackerSettings = useSelector((state: RootState) => state.settings);
  const [localSettings, setLocalSettings] = useState(trackerSettings);
  const [prevTrackerSettings, setPrevTrackerSettings] = useState(trackerSettings);

  if (trackerSettings !== prevTrackerSettings) {
    setPrevTrackerSettings(trackerSettings);
    setLocalSettings(trackerSettings);
  }

  type SettingsKey = keyof typeof trackerSettings;
  type SettingsValue = string | boolean;

  const handleInputChange = (key: SettingsKey, value: SettingsValue) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    dispatch(setSettings(localSettings));
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
          <div className={`font-roboto text-sm border-black ${page === 2 ? "border-b-2 pb-1 cursor-pointer" : "text-gray-500 cursor-pointer"}`} onClick={() => setPage(2)}>
            Extra settings
          </div>
        </div>
      </div>
      {/* Page 1 */}
      { page === 1 && (
      <div className={`row-span-5 px-4 pt-1 overflow-y-auto`}>
        <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 items-center text-sm font-roboto">
          <label className="font-medium">World State:</label>
          <select
            className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" disabled
            value={localSettings.worldState}
            onChange={(e) => handleInputChange("worldState", e.target.value)}
          >
            <option value="open">Open</option>
            <option value="standard">Standard</option>
            <option value="inverted">Inverted</option>
          </select>

          <label className="font-medium">Entrance Shuffle:</label>
          <select
            className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" disabled
            value={localSettings.entranceMode}
            onChange={(e) => handleInputChange("entranceMode", e.target.value)}
          >
            <option value="none">None</option>
            <option value="simple">Simple</option>
            <option value="restricted">Restricted</option>
            <option value="full">Full</option>
            <option value="crossed">Crossed</option>
            <option value="insanity">Insanity</option>
          </select>

          <label className="font-medium">Boss Shuffle:</label>
          <select
            className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" disabled
            value={localSettings.bossShuffle}
            onChange={(e) => handleInputChange("bossShuffle", e.target.value)}
          >
            <option value="none">None</option>
            <option value="simple">Simple</option>
            <option value="full">Full</option>
            <option value="random">Random</option>
          </select>

          <label className="font-medium">Enemy Shuffle:</label>
          <select
            className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" disabled
            value={localSettings.enemyShuffle}
            onChange={(e) => handleInputChange("enemyShuffle", e.target.value)}
          >
            <option value="none">None</option>
            <option value="shuffled">Shuffled</option>
            <option value="random">Random</option>
          </select>

          <label className="font-medium self-start pt-1">Dungeon Items:</label>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-600"
                checked={localSettings.wildMaps}
                onChange={(e) => handleInputChange("wildMaps", e.target.checked)}
              />
              <span>Maps</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-600"
                checked={localSettings.wildCompasses}
                onChange={(e) => handleInputChange("wildCompasses", e.target.checked)}
              />
              <span>Compasses</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-600"
                checked={localSettings.wildSmallKeys === "wild"}
                onChange={(e) => handleInputChange("wildSmallKeys", e.target.checked ? "wild" : "inDungeon")}
              />
              <span>Small Keys</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                className="accent-red-600"
                checked={localSettings.wildBigKeys}
                onChange={(e) => handleInputChange("wildBigKeys", e.target.checked)}
              />
              <span>Big Keys</span>
            </label>
          </div>

          <label className="font-medium">Goal:</label>
          <select
            className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" disabled
            value={localSettings.goal}
            onChange={(e) => handleInputChange("goal", e.target.value)}
          >
            <option value="fast_ganon">Fast Ganon</option>
            <option value="ganon">Defeat Ganon</option>
            <option value="dungeons">All Dungeons</option>
            <option value="pedestal">Pedestal</option>
            <option value="triforce_hunt">Triforce Hunt</option>
          </select>

          <label className="font-medium">Swords:</label>
          <select
            className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" disabled
            value={localSettings.swords}
            onChange={(e) => handleInputChange("swords", e.target.value)}
          >
            <option value="randomized">Randomized</option>
            <option value="assured">Assured</option>
            <option value="vanilla">Vanilla</option>
            <option value="swordless">Swordless</option>
          </select>

          <label className="font-medium">Item Pool:</label>
          <select
            className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400" disabled
            value={localSettings.itemPool}
            onChange={(e) => handleInputChange("itemPool", e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>

          <label className="font-medium self-start pt-1">Misc:</label>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.activatedFlute}
                className="disabled:bg-gray-400" disabled
                onChange={(e) => handleInputChange("activatedFlute", e.target.checked)}
              />
              <span>Activated Flute</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.bonkShuffle}
                onChange={(e) => handleInputChange("bonkShuffle", e.target.checked)}
              />
              <span>Bonk Shuffle</span>
            </label>
          </div>
        </div>
      </div>
      )}
      { page === 2 && (
        <div className={`row-span-5 p-4 overflow-y-auto`}>
          <p>One day there will be more settings here.</p>
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
