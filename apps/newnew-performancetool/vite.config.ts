import path from "path";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import manifest from "./manifest.json";

export default defineConfig(({ command, mode }) => {
  console.log({ command, mode });
  const isDev = mode === "development" && command === "serve";
  return {
    build: {
      emptyOutDir: !isDev,
      watch: isDev ? {} : undefined,
    },
    plugins: [react(), crx({ manifest })],
    resolve: {
      alias: {
        "newnew-performancetool": path.resolve(__dirname),
      },
    },
    server: {
      hmr: {
        port: 5173,
      },
      port: 5173,
      strictPort: true,
    },
  };
});
