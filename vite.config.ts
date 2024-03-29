// vite.config.js
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "specialFileDisplay",
      // the proper extensions will be added
      fileName: "special-file-display",
      formats: ["es", "cjs", "umd", "iife"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
