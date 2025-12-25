import "./App.css";
import CommunityLayoutItems from "./components/layouts/CommunityTracker/CommunityLayoutItems";
import { useDispatch, useSelector } from "react-redux";
import { toggleWildBigKeys, setWildSmallKeys } from "./store/settingsSlice";
import type { RootState } from "./store/store";
import { Button } from "./components/ui/button";
import OWMap from "./components/layouts/Map/OWMap";

function App() {
  const dispatch = useDispatch();
  const { wildSmallKeys, wildBigKeys } = useSelector((state: RootState) => state.settings);

  function toggleWildSmallKeys() {
    console.log("Toggling wild small keys from:", wildSmallKeys);
    if (wildSmallKeys === "inDungeon") {
      dispatch(setWildSmallKeys("wild"));
    } else if (wildSmallKeys === "wild") {
      dispatch(setWildSmallKeys("inDungeon"));
    }
  }


  return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Button className="bg-white" variant={wildSmallKeys ? "default" : "outline"} onClick={() => toggleWildSmallKeys()}>
            Wild Small Keys: {wildSmallKeys ? "ON" : "OFF"}
          </Button>
          <Button className="bg-white" variant={wildBigKeys ? "default" : "outline"} onClick={() => dispatch(toggleWildBigKeys())}>
            Wild Big Keys: {wildBigKeys ? "ON" : "OFF"}
          </Button>
        </div>
        <div className="flex flex-row">
          <CommunityLayoutItems />
          <OWMap world="lw"/>
          <OWMap world="dw"/>
        </div>
      </div>
  );
}

export default App;
