const { getJestConfig } = require("@storybook/test-runner");

// The default Jest configuration comes from @storybook/test-runner
const testRunnerConfig = getJestConfig();

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  ...testRunnerConfig,
  testPathIgnorePatterns: [
    ...(testRunnerConfig.testPathIgnorePatterns || []),
    "/node_modules/",
    "/_unsafe_trashed/",
    "/\\.trash/",
    "\\.trashed",
  ],
  /** Add your own overrides below, and make sure
   *  to merge testRunnerConfig properties with your own
   * @see https://jestjs.io/docs/configuration
   */
};
