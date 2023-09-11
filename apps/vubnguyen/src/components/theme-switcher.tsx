"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const className = "h-[32px] w-[32px] text-gray-400";
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light";
  const [mounted, setMounted] = useState(false);
  const onToggle = useCallback(() => {
    setTheme(isLightTheme ? "dark" : "light");
  }, [isLightTheme, setTheme]);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (theme === "system") {
      setTheme("light");
    }
  }, [theme, setTheme]);
  // We won't be able to detect the users localStorage for theme, by default assume light theme
  if (!mounted || isLightTheme) {
    return (
      <Moon
        className={className}
        onClick={onToggle}
      />
    );
  }
  return (
    <Sun
      className={className}
      onClick={onToggle}
    />
  );
};

export default ThemeSwitcher;
