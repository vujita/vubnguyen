/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const path = require("path");
const xrun = require("@xarc/run");
const rimraf = require("rimraf");

const fontMockPath = path.resolve(__dirname, "src/mocked-font-responses.json");

xrun.load("vubnguyen", {
  build: process.env.CI ? xrun.exec("next build") : xrun.serial("clean", xrun.exec("touch ../../.env"), xrun.exec(`SKIP_ENV_VALIDATION=1 NEXT_FONT_GOOGLE_MOCKED_RESPONSES=${fontMockPath} dotenv -e ../../.env -- next build --webpack`)),
  clean: () => rimraf.sync(".next"),
});
