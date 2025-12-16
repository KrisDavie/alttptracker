import "./App.css";
import CommunityLayoutItems from "./components/layouts/CommunityLayoutItems";
import { useDispatch, useSelector } from "react-redux";
import { toggleWildBigKeys, toggleWildSmallKeys } from "./store/trackerSlice";
import type { RootState } from "./store/store";
import { Button } from "./components/ui/button";

function App() {
  const dispatch = useDispatch();
  const { wildSmallKeys, wildBigKeys } = useSelector((state: RootState) => state.tracker.settings);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        <Button className="bg-white" variant={wildSmallKeys ? "default" : "outline"} onClick={() => dispatch(toggleWildSmallKeys())}>
          Wild Small Keys: {wildSmallKeys ? "ON" : "OFF"}
        </Button>
        <Button className="bg-white" variant={wildBigKeys ? "default" : "outline"} onClick={() => dispatch(toggleWildBigKeys())}>
          Wild Big Keys: {wildBigKeys ? "ON" : "OFF"}
        </Button>
      </div>
      <CommunityLayoutItems />
    </div>
  );
}

export default App;
