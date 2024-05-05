# MediaWiki:Common.js

这里是羊羊百科的 js 仓库。羊羊百科的[MediaWiki:Common.js](https://xyy.huijiwiki.com/wiki/MediaWiki:Common.js)会自动读取本仓库的 js 文件。

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

### 简单版本
直接在网页上编辑[main.ts](src/main.ts)即可。保存后自动通过[GitHub Actions](https://github.com/XYY-huijiwiki/MediaWiki-Common.js/actions)进行语法检查等操作。如果通过了检查，你的代码会自动部署到羊羊百科。

为了防止恶意修改，你可能无法直接保存，但是可以根据提示提交一个 pull request。羊羊百科的管理员会定期处理这些 pull request。

### 复杂版本

要求：
- Node.js 版本：20.0.0+
- 浏览器插件：[篡改猴](https://www.tampermonkey.net)
- 篡改猴脚本：[Dev-Toggle-for-GitHub-Code](https://github.com/XYY-huijiwiki/Dev-Toggle-for-GitHub-Code)

> [!NOTE]
> 结束测试后记得关闭篡改猴脚本，否则默认js将无法加载。

克隆仓库到本地，然后使用 `npm` 安装依赖。

```bash
npm install
```

然后使用 `npm run dev` 启动开发服务器。

```bash
npm run dev
```

开发服务器会运行在 `http://localhost:5173`。

主要代码位于`src/main.ts`中，你可以在这里进行开发。