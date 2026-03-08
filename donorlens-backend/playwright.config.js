import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test",
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5000/api/",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
    },
  },
});