// @ts-check
import { defineConfig } from "@playwright/test";

/**
 * Playwright configuration for API testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: "./tests",

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests (0 for local, 2 for CI)
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration - HTML report for visual demo
  reporter: [
    ["list"], // Console output
    ["html", { open: "never" }], // HTML report (open with: npx playwright show-report)
  ],

  // Global timeout for each test
  timeout: 30000,

  // Use configuration for API testing
  use: {
    // Base URL for API requests
    baseURL: process.env.API_URL || "http://localhost:5000",

    // Include extra HTTP headers
    extraHTTPHeaders: {
      Accept: "application/json",
    },

    // Trace on first retry (useful for debugging)
    trace: "on-first-retry",
  },

  // No browser projects needed for API testing
  projects: [
    {
      name: "api-tests",
      testMatch: /.*\.spec\.js/,
    },
  ],
});
