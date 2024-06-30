const xrun = require("@xarc/run");

xrun.load({
  "build:clean": xrun.exec("rimraf ./*.mjs ./*.js ./*.mts ./*.d.ts ./*.map storybook-static coverage ./*.css dist"),
  "build:declarationMap": xrun.exec("tsc --emitDeclarationOnly -p tsconfig.types.json"),
  "build:lib": xrun.serial("build:clean", "build:tsup", "build:declarationMap"),
  "build:tsup": xrun.exec("tsup"),
  "storybook:build": xrun.serial(xrun.exec("storybook build"), xrun.exec("cp files/vercel.json storybook-static/")),
});
