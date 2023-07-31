import daisyui from "daisyui";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [""],
  theme: {
    extend: {},
    plugins: [daisyui],
  },
  daisyui: {},
};

export default config;
