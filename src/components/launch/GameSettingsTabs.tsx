import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SettingsState } from "@/store/settingsSlice";
import { RandomizerTab } from "./settings/RandomizerTab";
import { AdvancedTab } from "./settings/AdvancedTab";
import { LogicBreaksTab } from "./settings/LogicBreaksTab";
import { TrackerSettingsTab } from "./settings/TrackerSettingsTab";
import { ColoursTab } from "./settings/ColoursTab";

interface GameSettingsTabsProps {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  startingItems: Record<string, number>;
  setStartingItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  toggleStartingItem: (item: string) => void;
  autotrackProtocol: "sni" | "qusb2snes";
  setAutotrackProtocol: (protocol: "sni" | "qusb2snes") => void;
  autotrackHost: string;
  setAutotrackHost: (host: string) => void;
  autotrackPort: number;
  setAutotrackPort: (port: number) => void;
}

export function GameSettingsTabs({
  settings,
  updateSetting,
  startingItems,
  setStartingItems,
  toggleStartingItem,
  autotrackProtocol,
  setAutotrackProtocol,
  autotrackHost,
  setAutotrackHost,
  autotrackPort,
  setAutotrackPort,
}: GameSettingsTabsProps) {
  return (
    <TooltipProvider>
      <Tabs defaultValue="randomizer" className="flex flex-col h-full">
        <TabsList className="w-full justify-between shrink-0">
          <div className="flex flex-row w-full justify-between">
            <div>
              <TabsTrigger value="randomizer">Randomizer</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="logicbreaks">Logic Breaks</TabsTrigger>
            </div>
            <div>
              <TabsTrigger value="tracker">Tracker Settings</TabsTrigger>
              <TabsTrigger value="colours">Colours</TabsTrigger>
            </div>
          </div>
        </TabsList>

        <RandomizerTab
          settings={settings}
          updateSetting={updateSetting}
          startingItems={startingItems}
          setStartingItems={setStartingItems}
          toggleStartingItem={toggleStartingItem}
        />
        <AdvancedTab settings={settings} updateSetting={updateSetting} />
        <LogicBreaksTab settings={settings} updateSetting={updateSetting} />
        <TrackerSettingsTab
          settings={settings}
          updateSetting={updateSetting}
          autotrackProtocol={autotrackProtocol}
          setAutotrackProtocol={setAutotrackProtocol}
          autotrackHost={autotrackHost}
          setAutotrackHost={setAutotrackHost}
          autotrackPort={autotrackPort}
          setAutotrackPort={setAutotrackPort}
        />
        <ColoursTab settings={settings} updateSetting={updateSetting} />
      </Tabs>
    </TooltipProvider>
  );
}
