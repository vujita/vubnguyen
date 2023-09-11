import type { Config } from "tailwindcss";

import tailwindPlugin from "./src/tailwind.preset";

// TODO: Create a plugin that will handle much of this config to be more reproducible
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  preset: [tailwindPlugin],
};

export default config;
