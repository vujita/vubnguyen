/** @type {import('eslint').Linter.Config} */
const config = {
  env: {
    browser: true,
  },
  extends: ["plugin:react/recommended", "plugin:react-hooks/recommended", "plugin:jsx-a11y/recommended"],
  globals: {
    React: "writable",
  },
  rules: {
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",
    "react/button-has-type": [
      "error",
      {
        button: true,
        submit: true,
        reset: true,
      },
    ],
    "react/forbid-dom-props": ["error", { forbid: ["style"] }],
    "react/iframe-missing-sandbox": "error",
    "react/jsx-handler-names": "error",
    "react/jsx-max-depth": ["error", { max: 5 }],
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-leaked-render": "error",
    "react/jsx-no-literals": "error",
    "react/jsx-no-useless-fragment": "error",
    "react/jsx-sort-props": "error",
    "react/no-array-index-key": "error",
    "react/no-arrow-function-lifecycle": "error",
    "react/no-danger": "error",
    "react/no-deprecated": "error",
    "react/no-this-in-sfc": "error",
    "react/no-typos": "error",
    "react/prefer-es6-class": ["error", "always"],
    "react/prop-types": "off",
    "react/self-closing-comp": "error",
    "react/sort-comp": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

module.exports = config;
