import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
    server: {
      hmr: {
        port: 5173,
      },
      port: 5173,
      strictPort: true,
    },
  };
});
