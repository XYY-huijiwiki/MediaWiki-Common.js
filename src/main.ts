// 根据灰机的文档（https://www.huijiwiki.com/wiki/帮助:使用cockpit组件）
// 在CHP加载完成后再执行其他代码，确保所有灰机组件都已加载
CHP.then(() => {
  import("./ts/setIconList");
  import("./ts/setLanguage");
  import("./ts/tailwindConfig");
  import("./ts/ghFilesDisplay");
});
