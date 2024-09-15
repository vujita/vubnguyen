const xrun = require("@xarc/run");

xrun.load({
  "build:clean": xrun.exec("rimraf storybook-static coverage dist"),
  "build:lib": xrun.serial("build:clean", xrun.exec("tsc -p tsconfig.build.json"), xrun.exec("tsc-alias -p tsconfig.build.json")),
  "build:watch": ["build:lib", xrun.concurrent(xrun.exec("tsc -p tsconfig.build.json --watch"), xrun.exec("tsc-alias -p tsconfig.build.json --watch"))],
  "storybook:build": xrun.serial(xrun.exec("storybook build"), xrun.exec("cp files/vercel.json storybook-static/")),
});
