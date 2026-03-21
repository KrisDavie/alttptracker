import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LaunchPage: React.FC = () => {
  const navigate = useNavigate();

  const openTracker = () => {
    // Current window navigation
    navigate("/tracker");
  };

  const openTrackerNewWindow = () => {
    // Open in a new window/tab
    window.open("/tracker", "_blank", "width=1344,height=449");
  };

  return (
    <div className="min-h-screen w-full bg-neutral-900 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          ALttP Randomizer Tracker
        </h1>
        <p className="text-xl text-neutral-400">
          A powerful logic-based item and location tracker for A Link to the Past Randomizer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
          <Button 
            onClick={openTracker}
            className="h-16 text-lg cursor-pointer"
            variant="default"
          >
            Launch Tracker
          </Button>
          <Button 
            onClick={openTrackerNewWindow}
            className="h-16 text-lg cursor-pointer"
            variant="outline"
          >
            Open in New Window
          </Button>
        </div>

        <div className="pt-12 border-t border-neutral-800 mt-12 text-left">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-300">
            <li>Graph-based logic engine</li>
            <li>Support for standard, inverted, and custom world states</li>
            <li>Autotracking support (via SNI)</li>
            <li>Multiple layout modes (Normal, Compact, Vertical)</li>
            <li>Entrance shuffle support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LaunchPage;
