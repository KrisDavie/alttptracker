import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SettingSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SettingSelect({ label, value, onChange, options }: SettingSelectProps) {
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Select value={value} onValueChange={(v) => { if (v !== null) onChange(v); }}>
        <SelectTrigger className="w-full h-8 text-xs">
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface SettingSwitchProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function SettingSwitch({ label, checked, onChange }: SettingSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs cursor-pointer" onClick={() => onChange(!checked)}>{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
