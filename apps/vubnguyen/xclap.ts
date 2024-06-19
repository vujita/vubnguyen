/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const xrun = require("@xarc/run");
const rimraf = require("rimraf");

xrun.load("vubnguyen", {
  build: process.env.CI ? xrun.exec("next build") : xrun.serial("clean", xrun.exec("touch ../../.env"), xrun.exec("dotenv -e ../../.env -- next build")),
  clean: () => rimraf.sync(".next"),
});
