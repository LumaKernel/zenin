import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.stories.@(js|jsx|ts|tsx)",
  use: {
    baseURL: "http://localhost:6006",
  },
  webServer: {
    command: "npm run storybook",
    port: 6006,
    reuseExistingServer: !process.env.CI,
  },
});
