import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    cssCodeSplit: false,
    modulePreload: { polyfill: false }, // Reduces main thread bootstrap JS
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Keep React runtime light
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("react-router-dom")) {
              return "vendor-router";
            }
            if (id.includes("redux") || id.includes("redux-persist")) {
              return "vendor-redux";
            }
            if (id.includes("@apollo")) {
              return "vendor-apollo";
            }
            if (id.includes("posthog-js")) {
              return "vendor-posthog";
            }
          }
        },
      },
    },
  },
});
