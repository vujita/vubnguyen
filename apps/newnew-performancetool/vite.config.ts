import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import manifest from "./manifest.json";

export default defineConfig(({ command, mode }) => {
  console.log({ command, mode });
  const isDev = mode === "development" && command === "serve";
  return {
    build: {
      watch: isDev ? {} : undefined,
      emptyOutDir: !isDev,
    },
    plugins: [react(), crx({ manifest })],
    server: {
      port: 5173,
      strictPort: true,
      hmr: {
        port: 5173,
      },
    },
  };
});
