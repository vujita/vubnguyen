/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const xrun = require("@xarc/run");

xrun.load({
  "build:clean": xrun.exec("rimraf storybook-static coverage dist"),
  "build:lib": xrun.serial(xrun.exec("tsc -p tsconfig.build.json"), xrun.exec("tsc-alias -p tsconfig.build.json"), xrun.exec("tailwind -i src/index.css -o dist/index.css")),
  "build:watch": ["build:lib", xrun.concurrent(xrun.exec("tsc -p tsconfig.build.json --watch"), xrun.exec("tsc-alias -p tsconfig.build.json --watch"))],
  "storybook:build": xrun.serial("build:lib", xrun.exec("storybook build")),
});
