import { type Config } from "tailwindcss";
import vujitaUiPreset from "vujita-ui/tailwind.preset";

export default {
  content: ["./src/**/*.{ts,tsx,css}", "../../packages/vujita-ui/src/**/*.{ts,tsx}"],
  presets: [vujitaUiPreset],
} satisfies Config;
