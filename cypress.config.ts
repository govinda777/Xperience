import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      
    },
    supportFile: 'cypress/support/e2e.js',
  },
});
