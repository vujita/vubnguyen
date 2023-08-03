import type { Config } from "tailwindcss";
import daisyui from "daisyui";


const config: Config = {
  content: [""],
  theme: {
    extend: {},
    plugins: [daisyui],
  },
  daisyui: {
  }
}

export default config
