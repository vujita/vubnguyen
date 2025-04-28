export default {
  extends: ["eslint-config-vujita/base", "eslint-config-vujita/nextjs", "eslint-config-vujita/react"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  root: true,
  settings: {
    "import/internal-regex": "^@vujita/",
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.json"],
      },
    },
  },
};
