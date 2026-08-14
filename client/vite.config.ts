import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true, // Enables global testing functions like describe, it, etc.
    setupFiles: "./src/setupTests.ts", // Path to the setup file
    environment: "jsdom",
    css: true,
    // moduleDirectories: ["./node_modules", "./src"],
  },
});
