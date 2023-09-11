import type { Config } from "tailwindcss";
import vujitaUiPreset from "vujita-ui/tailwind.preset";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./stories/**/*.{ts,tsx}", "../../../packages/**/*.{ts,tsx}"],
  presets: [vujitaUiPreset],
};
export default config;
