import { useSelector, useDispatch, useStore } from "react-redux";
import type { RootState } from "../../store/store";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { buildStateSnapshot, parseSnapshotJson, importSnapshotToNewSession, snapshotToJsonDocument } from "@/lib/stateSnapshot";
import { collectClientMetadata } from "@/lib/clientMetadata";
import { resetSettings, setSettings, type SettingsState } from "../../store/settingsSlice";
import { setModalClose } from "../../store/trackerSlice";
import { resetBossesForShuffle, resetDungeons } from "@/store/dungeonsSlice";
import { setAutotrackingSettings } from "@/store/autotrackerSlice";
import { resetItems } from "@/store/itemsSlice";
import { resetChecks } from "@/store/checksSlice";
import { resetEntrances } from "@/store/entrancesSlice";
import { resetScouts } from "@/store/scoutsSlice";
import { resetOverworldState } from "@/store/overworldSlice";
import { resetEventLog } from "@/store/eventLogSlice";
import { getSession } from "@/lib/sessionManager";
import { getSessionInstanceId } from "@/lib/sessionHelper";
import { buildPresetIDBState } from "@/lib/launchHelpers";
import { getPresetById } from "@/data/launcherPresets";
import { cn } from "@/lib/utils";

function MysteryModal() {
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const [page, setPage] = useState(1);
  const [snapshotStatus, setSnapshotStatus] = useState<{ kind: "idle" | "ok" | "error"; message: string }>({ kind: "idle", message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
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

      // Use the settings the player launched with (stored on the session),
      // falling back to the preset defaults if no session settings are stored.
      const launchSettings = (session?.settings ?? preset?.settings) as SettingsState | undefined;

      const presetState = buildPresetIDBState(startingItems, preset, launchSettings);

      dispatch({ ...resetItems(presetState.items || undefined), meta: { skipEventLog: true } });
      dispatch(resetChecks(presetState.checks || undefined));
      dispatch(resetEntrances(presetState.entrances || undefined));
      dispatch({ ...resetDungeons(presetState.dungeons || undefined), meta: { skipEventLog: true } });
      dispatch(resetEventLog());
      if (launchSettings) {
        dispatch(resetSettings(launchSettings));
      }

      dispatch(resetOverworldState());
      dispatch(resetScouts());
      dispatch(setModalClose());
    }
  };

  const handleDownloadJson = async () => {
    try {
      const meta = await collectClientMetadata();
      const snapshot = buildStateSnapshot(store.getState(), import.meta.env.VITE_APP_VERSION, meta);
      const json = snapshotToJsonDocument(snapshot);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = `muffinstracker-state-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSnapshotStatus({ kind: "ok", message: "Downloaded state JSON." });
    } catch (err) {
      setSnapshotStatus({ kind: "error", message: `Download failed: ${err instanceof Error ? err.message : String(err)}` });
    }
  };

  // Import always loads into a NEW session, preserving the importer's current session.
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    if (!window.confirm("Load this state into a NEW session and switch to it? Your current session is kept.")) return;
    try {
      const text = await file.text();
      const snapshot = parseSnapshotJson(text);
      const id = await importSnapshotToNewSession(snapshot);
      setSnapshotStatus({ kind: "ok", message: "Imported — opening the new session…" });
      window.location.href = `/tracker?id=${id}`;
    } catch (err) {
      setSnapshotStatus({ kind: "error", message: `Import failed: ${err instanceof Error ? err.message : String(err)}` });
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
  const eventLogOptionsDisabled = localSettings.eventLogMode === "off";

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
            <label className="font-medium">Event Log:</label>

          <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 items-center text-sm font-roboto">
              <select
                className="border border-gray-400 rounded px-1 bg-white w-full max-w-50 disabled:text-gray-400"
                value={localSettings.eventLogMode}
                onChange={(e) => handleInputChange("eventLogMode", e.target.value)}
              >
                <option value="off">Off</option>
                <option value="attached">Attached</option>
              </select>
              <label
                className={cn(
                  "flex items-center space-x-1",
                  eventLogOptionsDisabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
                )}
                aria-disabled={eventLogOptionsDisabled}
              >
                <input
                  type="checkbox"
                  checked={localSettings.logTriforcePieces}
                  disabled={eventLogOptionsDisabled}
                  onChange={(e) => handleInputChange("logTriforcePieces", e.target.checked)}
                />
                <span>Log triforce pieces</span>
              </label>
            </div>

            <button className="bg-gray-300 font-roboto col-span-2" onClick={handleFullReset}>
              Reset Tracker State
            </button>

            <div className="col-span-2 mt-2 border-t border-gray-300 pt-2">
              <div className="font-medium mb-1">Bug Report</div>
              <p className="text-xs text-gray-600 mb-2">Save the complete tracker state to a file so a developer can reproduce a bug. Importing loads it into a new session and switches to it; your current session is kept.</p>
              <div className="flex flex-wrap gap-2 mb-1">
                <button className="bg-gray-300 font-roboto px-2 py-1" onClick={handleDownloadJson}>
                  Download State File
                </button>
                <button className="bg-gray-300 font-roboto px-2 py-1" onClick={() => fileInputRef.current?.click()}>
                  Import State File…
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFileSelected} />
              {snapshotStatus.kind !== "idle" && (
                <div className={cn("text-xs mt-1", snapshotStatus.kind === "error" ? "text-red-600" : "text-green-700")}>{snapshotStatus.message}</div>
              )}
            </div>

          </div>
        </div>
      )}
      {/* Footer */}
      <div className="row-span-1 relative flex flex-row justify-center items-center mx-3 space-x-3">
        <Button variant="outline" className="bg-gray-300 font-roboto" size="sm" onClick={() => dispatch(setModalClose())}>
          Close
        </Button>
        <Button variant="outline" className="bg-gray-300 font-roboto" size="sm" onClick={handleSubmit}>
          Submit
        </Button>
        <div className="absolute right-0 text-2xs text-gray-500 select-text" title="App build / git commit">
          Build {import.meta.env.VITE_APP_VERSION || "unknown"}
        </div>
      </div>
    </div>
  );
}

export default MysteryModal;
