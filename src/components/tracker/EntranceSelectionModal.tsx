import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setModalClose, setCurrentMode, setSelectedEntrance } from "../../store/trackerSlice";
import { setEntranceLink } from "../../store/entrancesSlice";
import { Button } from "../ui/button";

function EntranceSelectionModal() {
  const dispatch = useDispatch();
  const selectedEntrance = useSelector((state: RootState) => state.trackerState.selectedEntrance);

  if (!selectedEntrance) return null;

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

  return (
    <div className="absolute inset-x-8 inset-y-12 bg-gray-900/95 border-2 border-gray-600 rounded-lg flex flex-col items-center justify-between text-white p-6 z-50 shadow-2xl overflow-hidden">
      <div className="text-center w-full">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Linking Entrance</h3>
        <p className="text-xl font-bold border-b border-gray-700 pb-2">{selectedEntrance}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs my-4">
        <Button variant="outline" size="sm" className="bg-amber-900/20 hover:bg-amber-900/40 border-amber-800/50" onClick={() => handleGenericLink("Generic Shop")}>
          Shop
        </Button>
        <Button variant="outline" size="sm" className="bg-blue-900/20 hover:bg-blue-900/40 border-blue-800/50" onClick={() => handleGenericLink("Generic Rupee Cave")}>
          Rupee
        </Button>
        <Button variant="outline" size="sm" className="bg-green-900/20 hover:bg-green-900/40 border-green-800/50" onClick={() => handleGenericLink("Generic Item NPC")}>
          Item
        </Button>
        <Button variant="outline" size="sm" className="bg-purple-900/40 hover:bg-purple-900/60 border-purple-800/50" onClick={() => handleGenericLink("Generic Dark Cave")}>
          Dark
        </Button>
        <Button variant="outline" size="sm" className="bg-purple-900/40 hover:bg-purple-900/60 border-purple-800/50" onClick={() => handleGenericLink("Unknown Connector")}>
          Unknown Connector
        </Button>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Button variant="default" className="bg-indigo-600 hover:bg-indigo-500 font-bold" onClick={handleSelectFromMap}>
          Select Destination on Map
        </Button>
        <div className="flex gap-2 w-full">
            <Button variant="destructive" size="sm" className="flex-1 opacity-80 hover:opacity-100" onClick={() => handleGenericLink(null)}>
              Clear
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
