import type { Config } from "tailwindcss";
import baseConfig from "vujita-ui/tailwind.config";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  presets: [baseConfig],
} satisfies Config;
