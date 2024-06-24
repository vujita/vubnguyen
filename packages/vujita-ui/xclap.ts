const xrun = require("@xarc/run");

xrun.load({
  "build:lib": xrun.serial("build:clean", "build:tsup"),
  "build:clean": xrun.exec("rimraf ./*.mjs ./*.js ./*.mts ./*.d.ts ./*.map storybook-static coverage ./*.css"),
  "build:tsup": xrun.exec("tsup"),
  "storybook:build": xrun.exec("storybook build"),
});
