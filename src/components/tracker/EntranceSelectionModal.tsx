import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setModalClose, setCurrentMode, setSelectedEntrance } from "../../store/trackerSlice";
import { setEntranceLink, setNote } from "../../store/entrancesSlice";
import { defaultEntranceLabels } from "@/data/entranceLabels";
import { Button } from "../ui/button";
import type { JSX } from "react";
import { Input } from "../ui/input";

function EntranceSelectionModal() {
  const dispatch = useDispatch();
  const selectedEntrance = useSelector((state: RootState) => state.trackerState.selectedEntrance);
  const entranceModalOpen = useSelector((state: RootState) => state.trackerState.modalOpen) === "entrance";
  const mapMode = useSelector((state: RootState) => state.settings.mapMode);
  const note = useSelector((state: RootState) => {
    if (!selectedEntrance) return "";
    return state.entrances[selectedEntrance]?.note || "";
  });

  if (mapMode === "off" || !entranceModalOpen || !selectedEntrance) return null;

  const handleGenericLink = (to: string | null) => {
    dispatch(setEntranceLink({ entrance: selectedEntrance, to }));
    dispatch(setModalClose());
    dispatch(setSelectedEntrance([null, false]));
  };

  const handleSelectFromMap = () => {
    dispatch(setCurrentMode("connect"));
    dispatch(setModalClose());
  };

  const handleCancel = () => {
    dispatch(setModalClose());
    dispatch(setSelectedEntrance([null, false]));
  };

  const handleConnectButton = () => {
    dispatch(setCurrentMode("generic_connect"));
    dispatch(setModalClose());
  };

  function getEntranceButton(entrance: string): JSX.Element {
    const entranceInfo = defaultEntranceLabels[entrance];
    // TODO: Update with custom info added by player
    const label = entranceInfo ? entranceInfo.label : entrance;
    const color = entranceInfo ? entranceInfo.color : "#888888";

    return (
      <Button
        variant="outline"
        size={["compact"].includes(mapMode) ? "xs" : "sm"}
        className="uppercase"
        style={{
          backgroundColor: `${color}50`,
          borderColor: `${color}`,
        }}
        onClick={() => handleGenericLink(entrance)}
      >
        {label}
      </Button>
    );
  }

  return (
    <div
      className={`absolute inset-x-8 ${["compact"].includes(mapMode) ? "inset-y-0.5" : "inset-y-6"} bg-gray-900/95 border-2 border-gray-600 rounded-lg flex flex-col items-center text-white p-4 z-50 shadow-2xl overflow-hidden pointer-events-auto max-h-max`}
    >
      <div className="text-center w-full">
        <p className={`${["compact"].includes(mapMode) ? "text-2xs" : "text-xs"} font-semibold text-gray-400 uppercase tracking-wider mb-1`}>Linking Entrance: {selectedEntrance}</p>
        <p className={`${["compact"].includes(mapMode) ? "text-2xs" : "text-xs"} font-semibold text-gray-400 uppercase tracking-wider mb-1`}>Connected to: </p>
      </div>

      <div className={`grid ${["vertical", "compact", "popoutVertical"].includes(mapMode) ? "gap-2" : "grid-cols-[5fr_4fr_5fr] gap-4"} w-full`}>
        {/* LW */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-xs font-bold text-gray-400">Light World Dungeons:</span>
            <div className="grid grid-cols-5 gap-1 w-full">
              {getEntranceButton("Hyrule Castle Entrance (South)")}
              {getEntranceButton("Hyrule Castle Entrance (East)")}
              {getEntranceButton("Hyrule Castle Entrance (West)")}
              {getEntranceButton("Agahnims Tower")}
              {getEntranceButton("Eastern Palace")}
            </div>
            <div className="grid grid-cols-5 gap-1 w-full">
              {getEntranceButton("Desert Palace Entrance (South)")}
              {getEntranceButton("Desert Palace Entrance (West)")}
              {getEntranceButton("Desert Palace Entrance (East)")}
              {getEntranceButton("Desert Palace Entrance (North)")}
              {getEntranceButton("Tower of Hera")}
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <span className="text-xs font-bold text-gray-400">Light Key Locations:</span>
            <div className="grid grid-cols-5 gap-1 w-full">
              {getEntranceButton("Potion Shop")}
              {getEntranceButton("Sick Kids House")}
              {getEntranceButton("Blacksmiths Hut")}
              {getEntranceButton("Bat Cave Cave")}
              {getEntranceButton("Library")}
            </div>
            <div className="grid grid-cols-5 gap-1 w-full">
              {getEntranceButton("Sahasrahlas Hut")}
              {getEntranceButton("Mimic Cave")}
              {getEntranceButton("Dam")}
            </div>
          </div>
        </div>
        {/* General */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-xs font-bold text-gray-400">General Key Locations:</span>
            <div className="grid grid-cols-4 gap-1 w-full">
              {getEntranceButton("Generic Rupee Cave")}
              {getEntranceButton("Generic Shop")}
              {getEntranceButton("Generic Dark Cave")}
              {getEntranceButton("Unknown Connector")}
            </div>
            <div className="grid grid-cols-4 gap-1 w-full">{getEntranceButton("Generic Item Cave")}</div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <span className="text-xs font-bold text-gray-400">Starting Locations:</span>
            <div className="grid grid-cols-4 gap-1 w-full">
              {getEntranceButton("Links House")}
              {getEntranceButton("Sanctuary")}
              {getEntranceButton("Old Man House (Bottom)")}
            </div>
          </div>
        </div>
        {/* DW */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-xs font-bold text-gray-400">Dark World Dungeons:</span>
            <div className="grid grid-cols-5 gap-1 w-full">
              {getEntranceButton("Palace of Darkness")}
              {getEntranceButton("Swamp Palace")}
              {getEntranceButton("Skull Woods First Section Door")}
              {getEntranceButton("Skull Woods Second Section Door (East)")}
              {getEntranceButton("Skull Woods Second Section Door (West)")}
            </div>
            <div className="grid grid-cols-5 gap-1 w-full">
              {getEntranceButton("Skull Woods Final Section")}
              {getEntranceButton("Thieves Town")}
              {getEntranceButton("Ice Palace")}
              {getEntranceButton("Misery Mire")}
              {getEntranceButton("Turtle Rock")}
            </div>
            <div className="grid grid-cols-5 gap-1 w-full">
              {getEntranceButton("Dark Death Mountain Ledge (East)")}
              {getEntranceButton("Dark Death Mountain Ledge (West)")}
              {getEntranceButton("Turtle Rock Isolated Ledge Entrance")}
              {getEntranceButton("Ganons Tower")}
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <span className="text-xs font-bold text-gray-400">Dark World Key Locations:</span>
            <div className="grid grid-cols-5 gap-1 w-full">
              {getEntranceButton("Big Bomb Shop")}
              {getEntranceButton("Bumper Cave (Top)")}
              {getEntranceButton("Spike Cave")}
              {getEntranceButton("Hookshot Cave")}
              {getEntranceButton("Pyramid Hole")}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs mt-6">
        {/* Input for notes */}
        <div className="flex flex-col gap-1 w-full">
          <Input
            placeholder={"Optional note for this entrance"}
            onChange={(e) => dispatch(setNote({ entrance: selectedEntrance || "", note: e.target.value }))}
            value={note}
            onKeyDown={(e) => { if (e.key === "Enter"){ handleCancel() } }}
          />
            
        </div>

        <div className="flex justify-between gap-2 w-full">
          <Button variant="default" className="flex bg-indigo-600 hover:bg-indigo-500 font-bold" onClick={handleSelectFromMap}>
            Select Destination on Map
          </Button>
          <Button variant="default" className="w-35 flex font-bold bg-indigo-600 hover:bg-indigo-500" onClick={handleConnectButton}>
            Connect
          </Button>
        </div>

        <div className="flex justify-between gap-2 w-full">
          <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleGenericLink(null)}>
            Clear Link
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EntranceSelectionModal;
