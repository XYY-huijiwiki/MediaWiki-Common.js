# MediaWiki:Common.js

这里是羊羊百科的 js 仓库。羊羊百科的[MediaWiki:Common.js](https://xyy-huijiwiki/wiki/MediaWiki:Common.js)会自动读取本仓库的 js 文件。

## faq

1. 为什么不直接在 MediaWiki:Common.js 中写代码？
   - Mediawiki 对于 js 代码的支持并不是很好，很多更加简洁的现代语法不能使用。
2. 为什么使用 ts？我只会 js 怎么办？
   - ts 的语法更加严格，可以减少一些错误。如果你只会 js，可以直接写 js 代码，并在你确定无误但是提示错误的代码上加上 `// @ts-ignore`。比如：
     ```ts
     let a = 1;
     // @ts-ignore
     a = "1"; // 这里会提示错误，但是我们知道这在js中是没问题的
     ```

## 开发

要求：Node.js 20+

克隆仓库到本地，然后使用 `npm` 安装依赖。

```bash
npm install
```

然后使用 `npm run dev` 启动开发服务器。

```bash
npm run dev
```

默认情况下，开发服务器会运行在 `http://localhost:5173`。在浏览器控制台中输入以下代码，即可加载代码。

```js
import(`http://localhost:5173/src/main.ts`);
```

很遗憾，目前代码无法自动加载，每次刷新页面或打开新页面都需要重新输入上述代码。

主要代码位于`src/main.ts`中，你可以在这里进行开发。