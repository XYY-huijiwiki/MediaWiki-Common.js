// vite.config.js
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/entry.ts"),
      name: "Common",
      // the proper extensions will be added
      fileName: () => "common.js",
      formats: ["umd"],
    },
    minify: "terser",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
