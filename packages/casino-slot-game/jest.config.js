/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  // Map .js imports to .ts files (Jest doesn't handle ESM .js → .ts remapping)
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^phaser$": "<rootDir>/src/__mocks__/phaser.ts",
  },
};
