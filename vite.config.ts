import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { writeFileSync, readFileSync } from "node:fs";

export default defineConfig({
  server: {
    cors: true,
  },
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
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  plugins: [preBuildPlugin(), postBuildPlugin()],
});

// Get material symbols
function preBuildPlugin() {
  return {
    name: "pre-build-plugin",
    async buildStart() {
      // Nur in GitHub Actions ausführen
      if (process.env.GITHUB_ACTIONS === "true") {
        let rawCSS = await (
          await fetch(
            "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0",
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
        let fontFileBuffer = Buffer.from(
          await (await fetch(fontURL)).arrayBuffer()
        );
        let fontBase64 = `data:font/woff2;base64,${fontFileBuffer.toString("base64")}`;
        let resultCSS = rawCSS.replace(/url\((.*?)\)/, `url(${fontBase64})`);
        writeFileSync(
          resolve(import.meta.dirname, "src/css/material-symbols.css"),
          resultCSS
        );
      } else {
        // 在本地开发环境中，跳过字体下载步骤
        writeFileSync(
          resolve(import.meta.dirname, "src/css/material-symbols.css"),
          ""
        );
      }
    },
  };
}

// Generate result.txt
function postBuildPlugin() {
  return {
    name: "post-build-plugin",
    writeBundle() {
      // Nur in GitHub Actions ausführen
      if (process.env.GITHUB_ACTIONS !== "true") {
        return; // Überspringen außerhalb von CI
      }
      const resultJS = readFileSync(
        resolve(import.meta.dirname, "dist/common.js"),
        "utf-8"
      );
      const result = `/* =====================================================

    请勿在此处修改代码！请勿在此处修改代码！请勿在此处修改代码！

    - 源代码储存在GitHub上：https://github.com/${process.env.GITHUB_REPOSITORY}
    - 请在GitHub上修改代码
    - GitHub上的代码会自动同步到此处
    
===================================================== */
eval(${JSON.stringify(resultJS)})`;
      writeFileSync(resolve(import.meta.dirname, "dist/result.txt"), result);
    },
  };
}
