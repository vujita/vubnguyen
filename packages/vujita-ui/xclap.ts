/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const xrun = require("@xarc/run");

xrun.load({
  "build:clean": xrun.exec("rimraf coverage dist"),
  "build:lib": xrun.serial(xrun.exec("tsdown"), xrun.exec("tailwind -i src/index.css -o dist/index.css")),
  "build:watch": ["build:lib", xrun.exec("tsdown --watch")],
});
