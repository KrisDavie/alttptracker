
interface SmallKeyTrackerProps {
  dungeon: string;
  size?: "1x1" | "1x2";
}

function SmallKeyTracker({ dungeon, size = "1x2" }: SmallKeyTrackerProps) {
  return (
    <div>SmallKeyTracker</div>
  )
}

export default SmallKeyTracker