  export default {
    extends: ["eslint-config-vujita/base",  "eslint-config-vujita/react"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    "extends": [
      "eslint-config-vujita/base",
      "eslint-config-vujita/react",
      "plugin:storybook/recommended"
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
      {
        "files": [
          "*.stories.ts",
          "*.stories.tsx"
        ],
        "rules": {
          "@typescript-eslint/await-thenable": "off"
        }
      }
    ],
    "root": true
  }
