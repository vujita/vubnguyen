/* eslint-disable import/no-extraneous-dependencies */
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import { defineConfig } from "tsup";

export default defineConfig({
  dts: false,
  entry: ["src/*"],
  format: ["cjs", "esm"],
  outDir: "dist",
  outExtension({ format }) {
    switch (format) {
      case "cjs":
        return {
          js: ".cjs",
        };
      case "esm":
      default:
        return {
          js: ".js",
        };
    }
  },
  plugins: [tailwind, autoprefixer],
  sourcemap: false,
  splitting: false,
});
