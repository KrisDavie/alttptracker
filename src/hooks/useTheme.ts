import { useContext } from "react";
import { ThemeContext, type ThemeContextType } from "@/components/ThemeContext";

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
