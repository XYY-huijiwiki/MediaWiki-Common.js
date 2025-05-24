import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { writeFileSync } from "node:fs";
import { blobToBase64 } from "file64";

// Get material symbols
(async () => {
  let rawCSS = await (
    await fetch(
      "https://fonts.googleapis.cn/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0",
      {
        // 添加现代浏览器的User-Agent，以获取体积更小的现代字体文件格式
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0",
        },
      }
    )
  ).text();
  let fontURL = rawCSS.match(/url\((.*?)\)/)?.[1];
  if (!fontURL) {
    throw new Error("Font URL not found");
  }
  let fontFile = await (await fetch(fontURL)).blob();
  let fontBase64 = await blobToBase64(fontFile);
  let resultCSS = rawCSS.replace(/url\((.*?)\)/, `url(${fontBase64})`);
  writeFileSync(
    resolve(import.meta.dirname, "src/css/material-symbols.css"),
    resultCSS
  );
})();

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "Common",
      // the proper extensions will be added
      fileName: () => "common.js",
      formats: ["umd"],
    },
    minify: "terser",
  },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
