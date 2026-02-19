  export default {
    extends: ["eslint-config-vujita/base",  "eslint-config-vujita/react"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    "extends": [
      "eslint-config-vujita/base",
      "eslint-config-vujita/react"
    ],
    settings: {
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
    "overrides": [
      {
        "files": [
          "*.test.js",
          "*.test.jsx",
          "*.test.ts",
          "*.test.tsx"
        ],
        "rules": {
          "@typescript-eslint/no-unsafe-call": 1
        }
      },
    ],
    "root": true
  }
