if (import.meta.env.PROD && dev === "MediaWiki-Common.js") {
  // 此处代码只在生产环境且发现`dev`值为`MediaWiki-Common.js`时执行
  // 此时停止继续加载代码即可，剩下的交给篡改猴脚本
  throw new Error("检测到dev环境，停止加载prod代码");
  // 虽然并不推荐throw new Error，但是这是最简单的方法
}

/* 强制所有页面内容显示为“中文（中国大陆）”，即zh-CN */
$("#mw-content-text").attr("lang", "zh-CN");

/* 如果列表的开头是一个图标，将其视为图标列表，加一个class */
$("li:has(span.material-symbols-outlined)").each(function (
  _index: number,
  element: HTMLLIElement,
) {
  if (
    $(element).html().slice(0, 39) === '<span class="material-symbols-outlined"'
  ) {
    $(element).addClass("icon-list-item");
  }
});

// 显示<gallery>中的特殊文件
(async () => {
  // wait huiji api to be ready
  await CHP;
  // search for fileicon.png
  let elements = $(
    'ul.gallery li.gallerybox div.thumb a[href$=".png"]>img[src="/resources/assets/file-type-icons/fileicon.png"]',
  );
  // log the result in dev mode
  if (import.meta.env.DEV) console.log(elements);
  // iterate through the result
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    // get the file name, and know the file type
    let fileName = decodeURI($(element).parent().attr("href")).match(
      /:(.*)\.png/,
    )![1];
    let fileExt = fileName.split(".").pop();
    let isVideo = ["mp4"].includes(fileExt!);
    let isAudio = ["mp3", "wav", "mid"].includes(fileExt!);
    let isModel = ["glb"].includes(fileExt!);
    // log the file name in dev mode
    if (import.meta.env.DEV) console.log(fileName);
    // other style changes
    $(element).parent().parent().parent().attr("style", "text-align: initial;");
    // add an icons
    let icon_name = isVideo
      ? "videocam"
      : isAudio
        ? "music_note"
        : isModel
          ? "view_in_ar"
          : "note";
    $(element).parent().attr("style", "position: relative;");
    $(element)
      .parent()
      .append(
        `<div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;border-radius:4px">
              <span class="material-symbols-outlined" style="vertical-align: sub; font-size: 2em;">
                ${icon_name} 
              </span>
            </div>`,
      );
  }
})();
