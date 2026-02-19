import withBundleAnalyzer from "@next/bundle-analyzer";

/**
 * @type {string[]}
 */

/** @type {import("next").NextConfig} */
const config = {
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  experimental: {},
  // this includes files from the monorepo base two directories up
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@vujita/api", "@vujita/auth", "@vujita/db", "vujita-ui"],
  typescript: { ignoreBuildErrors: true },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(config);
