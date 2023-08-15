"use client";

import { useEffect, useState } from "react";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light";
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (theme === "system") {
      setTheme("light");
    }
  }, [theme, setTheme]);
  // We won't be able to detect the users localStorage for theme
  if (!mounted) {
    return null;
  }

  return <FontAwesomeIcon className="h-[32px] w-[32px] text-gray-400" icon={isLightTheme ? faMoon : faSun} onClick={() => setTheme(isLightTheme ? "dark" : "light")} />;
};

export default ThemeSwitcher;
