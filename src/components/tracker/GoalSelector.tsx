import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import type { RootState } from "../../store/store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { setSettings, type ganonVulnerableTypes, type SettingsState } from "@/store/settingsSlice";

interface GoalSelectorProps {
  type: "goal" | "gtOpen";
}

function GoalSelector({ type }: GoalSelectorProps) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const goal = useSelector((state: RootState) => state.settings.goal);
  const gtOpen = useSelector((state: RootState) => state.settings.gtOpen);
  const ganonVulnerable = useSelector((state: RootState) => state.settings.ganonVulnerable);

  const ganonVulns: ganonVulnerableTypes[] = ["random", "0", "1", "2", "3", "4", "5", "6", "7", "ad", "triforce", "completionist"];

  const options: Record<string, { img: string; settings: Partial<SettingsState> }> = {};
  let curOption = "";
  if (type === "goal") {
    for (const i of ganonVulns) {
      options[`ganon_${i}`] = { img: `/dungeons/ganon_${i}.png`, settings: { goal: "ganon", ganonVulnerable: `${i}`} };
    }
    for (const i of ganonVulns) {
      options[`fast_ganon_${i}`] = { img: `/dungeons/fast_ganon_${i}.png`, settings: { goal: "fast_ganon", ganonVulnerable: `${i}`} };
    }
    options["trinity"] = { img: "/dungeons/trinity.png", settings: { goal: "trinity" } };
    options["pedestal"] = { img: "/dungeons/pedestal.png", settings: { goal: "pedestal" } };
    options["triforce_hunt"] = { img: "/dungeons/triforce_hunt.png", settings: { goal: "triforce_hunt" } };
    curOption = goal === "ganon" || goal === "fast_ganon" ? `${goal}_${ganonVulnerable}` : goal;

  } else if (type === "gtOpen") {
    options["random"] = { img: "/dungeons/crystal_random.png", settings: { gtOpen: "random" } };
    options["0"] = { img: "/dungeons/crystal_0.png", settings: { gtOpen: "0" } };
    options["1"] = { img: "/dungeons/crystal_1.png", settings: { gtOpen: "1" } };
    options["2"] = { img: "/dungeons/crystal_2.png", settings: { gtOpen: "2" } };
    options["3"] = { img: "/dungeons/crystal_3.png", settings: { gtOpen: "3" } };
    options["4"] = { img: "/dungeons/crystal_4.png", settings: { gtOpen: "4" } };
    options["5"] = { img: "/dungeons/crystal_5.png", settings: { gtOpen: "5" } };
    options["6"] = { img: "/dungeons/crystal_6.png", settings: { gtOpen: "6" } };
    options["7"] = { img: "/dungeons/crystal_7.png", settings: { gtOpen: "7" } };
    options["locksmith"] = { img: "/dungeons/locksmith.png", settings: { gtOpen: "locksmith" } };
    curOption = gtOpen;
  }

  console.log(goal, gtOpen, ganonVulnerable, curOption);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="h-full w-full flex items-center justify-center">
          <img src={options[curOption].img} className="rounded-md"/>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black" side="right" align="start" sideOffset={4} alignOffset={0} collisionAvoidance={{ side: "none", align: "none" }}>
        <div
          className={
            type === "goal"
              ? "grid grid-cols-12 gap-1 p-1"
              : "flex flex-row items-start p-0 space-x-1"
          }
        >
          {Object.entries(options).map(([value, data]) => (
            <div
              key={value}
              className={`h-6 w-6 cursor-pointer ${(type === "goal" && curOption === value) || (type === "gtOpen" && curOption === value) ? "border-2 border-yellow-500" : ""}`}
              onClick={() => {
                dispatch(setSettings(data.settings));
                setOpen(false);
              }}
            >
              {data.img && <img src={data.img} alt={value} className="h-full w-full object-contain" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default GoalSelector;
