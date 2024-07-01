import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodePolyfills from "vite-plugin-node-stdlib-browser";

export default defineConfig(() => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [nodePolyfills(), react()],
  esbuild: {
    loader: "jsx",
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
}));
