import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entry: ["src/*"],
  format: ["cjs", "esm"],
  outDir: ".",
  plugins: [tailwind, autoprefixer],
  sourcemap: true,
  splitting: false,
});
