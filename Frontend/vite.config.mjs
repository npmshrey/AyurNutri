import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },

  plugins: [tsconfigPaths(), react()],

  // Some socket/PDF dependencies expect Node's `global` in the browser.
  define: {
    global: "globalThis",
  },

  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    proxy: {
      "/api": { target: "http://localhost:9000", changeOrigin: true },
    },
  },
});
