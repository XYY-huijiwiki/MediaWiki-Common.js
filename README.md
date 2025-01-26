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

要求：

- Node.js 版本：20.0.0+

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

根据提示打开网页，会跳转到羊羊百科的首页，且网址末尾有类似`?dev-server=http%3A%2F%2Flocalhost%3A5173%2Fsrc%2Fentry.ts%3Ft%3D1737883108907`的Param，这个Param表示正在使用开发服务器。

> [!NOTE]
>
> - 如果跳转页面后Param消失，需要手动添加到网址中。
> - 理论上修改文件后，网页内容会自动更新，但实际上还是得手动刷新页面。
