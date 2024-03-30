// ==UserScript==
// @name         githubCodeTesting
// @version      2024-03-30
// @description  inject a global variable to enable code testing on xyy.huijiwiki
// @author       Anonymous
// @match        https://xyy.huijiwiki.com/*
// @match        http://xyy.huijiwiki.com/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

// 创建全局变量githubCodeTesting，普通代码会自动停止加载
unsafeWindow.githubCodeTesting = true;
// 加载本地测试代码（续等待页面加载完成）
await new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', resolve);
});
await unsafeWindow.CHP;
import('http://localhost:5173/src/main.ts');