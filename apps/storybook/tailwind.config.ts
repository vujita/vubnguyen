import type { Config } from "tailwindcss";

import baseConfig from "@vujita/tailwind-config";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./stories/**/*.{ts,tsx}", "../../../packages/**/*.{ts,tsx}"],
  darkMode: "class",
  presets: [baseConfig],
};
export default config;
