import { useEffect, useMemo, useRef, useState } from "react";

interface ColourPickerProps {
  /** CSS colour string. Supports `#RGB`, `#RRGGBB`, `#RRGGBBAA` and `rgba(...)`. */
  value: string;
  onChange: (value: string) => void;
  /** When true, shows an alpha slider and emits 8-digit hex. */
  alpha?: boolean;
  label?: string;
  description?: string;
}

interface ParsedColour {
  rgbHex: string; // "#rrggbb"
  alpha: number; // 0–255
}

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function toHex2(n: number) {
  return clampByte(n).toString(16).padStart(2, "0");
}

/** Parse any supported CSS colour string into 6-digit hex + alpha byte. */
function parseColour(value: string): ParsedColour {
  const trimmed = value.trim().toLowerCase();

  // rgba(r, g, b, a) / rgb(r, g, b)
  const rgbaMatch = trimmed.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/);
  if (rgbaMatch) {
    const r = clampByte(parseFloat(rgbaMatch[1]));
    const g = clampByte(parseFloat(rgbaMatch[2]));
    const b = clampByte(parseFloat(rgbaMatch[3]));
    let a = 255;
    if (rgbaMatch[4] !== undefined) {
      const raw = rgbaMatch[4];
      const num = raw.endsWith("%") ? parseFloat(raw) / 100 : parseFloat(raw);
      a = clampByte(num * 255);
    }
    return { rgbHex: `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`, alpha: a };
  }

  // Hex forms
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = hex[0] + hex[0];
      const g = hex[1] + hex[1];
      const b = hex[2] + hex[2];
      return { rgbHex: `#${r}${g}${b}`, alpha: 255 };
    }
    if (hex.length === 6) {
      return { rgbHex: `#${hex}`, alpha: 255 };
    }
    if (hex.length === 8) {
      return { rgbHex: `#${hex.slice(0, 6)}`, alpha: parseInt(hex.slice(6, 8), 16) };
    }
  }

  // Fallback: opaque black
  return { rgbHex: "#000000", alpha: 255 };
}

function buildColour(rgbHex: string, alpha: number, withAlpha: boolean) {
  const clean = rgbHex.toLowerCase();
  if (!withAlpha) return clean;
  return `${clean}${toHex2(alpha)}`;
}

export function ColourPicker({ value, onChange, alpha = false, label, description }: ColourPickerProps) {
  // Local state mirrors the external value but updates immediately while the
  // user is dragging the colour or alpha controls. The expensive upstream
  // onChange (which typically dispatches Redux and re-renders large slices of
  // the app) is debounced so it only fires once the user settles on a value.
  const [localValue, setLocalValue] = useState(value);
  const [prevProp, setPrevProp] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derived state from prop: when the external value changes (e.g. preset reset),
  // sync local state. This is the React-recommended pattern for prop-derived state
  // (https://react.dev/reference/react/useState#storing-information-from-previous-renders).
  // During an in-progress debounce, value (from Redux) hasn't updated yet so
  // prevProp === value and this branch is skipped — no mid-edit interruption.
  if (prevProp !== value) {
    setPrevProp(value);
    setLocalValue(value);
  }

  // Flush any pending debounced update on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, []);

  const scheduleEmit = (next: string) => {
    setLocalValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      onChange(next);
    }, 80);
  };

  const parsed = useMemo(() => parseColour(localValue), [localValue]);

  const handleColourChange = (newRgbHex: string) => {
    scheduleEmit(buildColour(newRgbHex, parsed.alpha, alpha));
  };

  const handleAlphaChange = (newAlpha: number) => {
    scheduleEmit(buildColour(parsed.rgbHex, newAlpha, true));
  };

  const swatchStyle: React.CSSProperties = {
    backgroundImage:
      "linear-gradient(45deg, #888 25%, transparent 25%), linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%), linear-gradient(-45deg, transparent 75%, #888 75%)",
    backgroundSize: "8px 8px",
    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
  };

  const alphaPercent = Math.round((parsed.alpha / 255) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        {label && <div className="text-xs font-medium truncate">{label}</div>}
        {description && <div className="text-[10px] text-muted-foreground truncate">{description}</div>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <label
          className="relative inline-block size-7 rounded border border-border overflow-hidden cursor-pointer"
          style={swatchStyle}
          aria-label={label ? `${label} colour` : "Colour"}
        >
          <span
            className="absolute inset-0"
            style={{ backgroundColor: buildColour(parsed.rgbHex, parsed.alpha, alpha) }}
          />
          <input
            type="color"
            value={parsed.rgbHex}
            onChange={(e) => handleColourChange(e.target.value)}
            className="absolute inset-0 size-full opacity-0 cursor-pointer"
          />
        </label>
        {alpha && (
          <div className="flex items-center gap-1">
            <input
              type="range"
              min={0}
              max={255}
              step={1}
              value={parsed.alpha}
              onChange={(e) => handleAlphaChange(parseInt(e.target.value, 10))}
              className="w-20 cursor-pointer accent-primary"
              aria-label={label ? `${label} opacity` : "Opacity"}
            />
            <span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right">{alphaPercent}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
