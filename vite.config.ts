// vite.config.js
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
// import { getBabelOutputPlugin } from "@rollup/plugin-babel";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "MyLib",
      // the proper extensions will be added
      fileName: "my-lib",
      formats: ["es"],
    },
    // rollupOptions: {
    //   plugins: [
    //     getBabelOutputPlugin({
    //       // babelHelpers: "bundled",
    //       presets: [
    //         [
    //           "@babel/preset-env",
    //           {
    //             targets: {
    //               ie: "11",
    //             },
    //           },
    //         ],
    //       ],
    //     }),
    //   ],
    // },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
