/* 强制所有页面内容显示为“中文（中国大陆）”，即zh-CN */
const content = document.getElementById("mw-content-text");
if (content) {
  content.setAttribute("lang", "zh-CN");
}

export {};
