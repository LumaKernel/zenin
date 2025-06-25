import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  jest: {
    testEnvironment: 'jsdom',
    modulePathIgnorePatterns: [
      '<rootDir>/pkg/.*/dist/',
      '<rootDir>/dist/',
      '<rootDir>/.next/',
      '<rootDir>/node_modules/',
    ],
    transformIgnorePatterns: [
      'node_modules/(?!(.*\\.(mjs|esm|tsx?|jsx?)$))',
    ],
    testPathIgnorePatterns: [
      '/node_modules/',
      '/_unsafe_trashed/',
      '/\\.trash/',
    ],
  },
  async postVisit(page, context) {
    // the #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    const elementHandler = await page.$('#storybook-root');
    const innerHTML = await elementHandler?.innerHTML();
    expect(innerHTML).toMatchSnapshot();
  },
};

export default config;