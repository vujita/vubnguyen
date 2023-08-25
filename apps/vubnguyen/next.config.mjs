// Importing env files here to validate on build
import "./src/env.mjs";
import "@vujita/auth/env.mjs";

/**
 * @type {string[]}
 */

/** @type {import("next").NextConfig} */
const config = {
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@vujita/api", "@vujita/auth", "@vujita/db"],
  typescript: { ignoreBuildErrors: true },
};

export default config;
