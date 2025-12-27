import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { incrementMedallionCount } from "@/store/entrancesSlice";
import { cn } from "@/lib/utils";

interface MedallionSelectorProps {
  entrance: "mm" | "tr"
  className?: string;
}

function MedallionSelector({ entrance, className }: MedallionSelectorProps) {
  const dispatch = useDispatch();
  const medallion = useSelector((state: RootState) => {
    const entranceName = entrance === "mm" ? "Misery Mire" : "Turtle Rock";
    return state.entrances.entrances[entranceName]?.medallion || "unknown";
  });

  const medallionImages: Record<string, string> = {
    unknown: "/items/medallion_unknown.png",
    bombos: "/items/bombos.png",
    ether: "/items/ether.png",
    quake: "/items/quake.png",
  };

  return (
    <div 
    key={`${entrance}-medallion`}
    className={cn(className)}
    onClick={() => dispatch(incrementMedallionCount({ entrance: entrance === "mm" ? "Misery Mire" : "Turtle Rock", decrement: false }))}
    onContextMenu={(e) => {
      e.preventDefault();
      dispatch(incrementMedallionCount({ entrance: entrance === "mm" ? "Misery Mire" : "Turtle Rock", decrement: true }));
    }}
    >
      <img src={medallionImages[medallion]} alt={`${medallion} medallion`} className="w-full h-full object-contain" />
    </div>
  )
}

export default MedallionSelector