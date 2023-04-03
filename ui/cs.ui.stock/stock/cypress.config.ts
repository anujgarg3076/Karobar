import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1400,
  viewportHeight: 1000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config
    },
  },
});
