import { defineConfig } from "tsdown";

export default defineConfig(({
  watch
})=>({
  entry: [
    "./src/**/*.tsx",
    "./src/**/*.ts",
    "!./src/**/*.stories.tsx",
    "!./src/**/*.test.tsx",
  ],
  exports: {
    customExports: (pkg)=>{
      pkg['./src/index.css'] = './src/index.css';
      pkg['./postcss.config.cjs'] = './postcss.config.cjs';
      pkg['./tailwind.preset'] = './src/tailwind.preset.ts';
      return pkg
    }
  },
  format: ["esm", "cjs"],
  dts: {
    tsconfig: "tsconfig.build.json",
  },
    treeshake: false,
  outDir: "dist",
  clean: !watch,
}));
