import { useEffect, useState } from "react";
import "./App.css";
import CommunityLayoutItems from "./components/layouts/CommunityTracker/CommunityLayoutItems";
import OWMap from "./components/layouts/Map/OWMap";

function App() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // TODO: Adjust these base dimensions if the layout changes
      // The base width of the tracker (3 panels of 448px each)
      // 1344px width
      const baseWidth = 448 * 3;
      const baseHeight = 448;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate scale for both width and height to ensure it fits
      const scaleW = windowWidth / baseWidth;
      const scaleH = windowHeight / baseHeight;
      
      // Use the smaller scale factor to ensure it fits in both dimensions
      // but don't scale up beyond 1.0 unless desired
      setScale(Math.min(scaleW, scaleH, 1));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen bg-neutral-900 flex items-start justify-start overflow-hidden fixed inset-0">
      <div 
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${448 * 3}px`,
          height: `448px`,
          flexShrink: 0
        }}
        className="flex flex-row items-start shadow-2xl"
      >
        <CommunityLayoutItems />
        <OWMap world="lw"/>
        <OWMap world="dw"/>
      </div>
    </div>
  );
}

export default App;
