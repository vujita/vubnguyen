"use client";

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === "light";

  return <FontAwesomeIcon icon={isLightTheme ? faMoon : faSun} className="h-[32px] w-[32px] text-gray-400" onClick={() => setTheme(isLightTheme ? "dark" : "light")} />;
};

export default ThemeSwitcher;
