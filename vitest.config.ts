import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./app/test/setup.ts"],
    globals: true,
    // The heavy framer-motion/three route modules cost several seconds to
    // transform on first import; under parallel workers that can blow the
    // default 5s per-test timeout on otherwise-trivial loader tests.
    testTimeout: 20000,
    exclude: ["**/node_modules/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["app/components/**", "app/services/**", "app/lib/**"],
      exclude: ["app/components/ui/**"],
    },
  },
});
