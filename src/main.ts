(async () => {
  // wait huiji api to be ready
  await CHP;
  // search for fileicon.png
  let elements = $(
    'ul.gallery li.gallerybox div.thumb a[href$=".png"]>img[src="/resources/assets/file-type-icons/fileicon.png"]'
  );
  // log the result in dev mode
  if (import.meta.env.DEV) console.log(elements);
  // iterate through the result
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    // get the file name, and know the file type
    let fileName = decodeURI($(element).parent().attr("href")).match(
      /:(.*)\.png/
    )![1];
    let fileExt = fileName.split(".").pop();
    let isVideo = ["mp4"].includes(fileExt!);
    let isAudio = ["mp3", "wav", "mid"].includes(fileExt!);
    let isModel = ["glb"].includes(fileExt!);
    // log the file name in dev mode
    if (import.meta.env.DEV) console.log(fileName);
    // change the link to the preview page
    let link = encodeURI(
      `//xyy.huijiwiki.com/wiki/Project:迷你控制中心#/preview/${fileName}`
    );
    $(element).parent().attr("href", link);
    $(element).parent().attr("target", "_blank");
    // change the image to the poster (for video and model files)
    // change the default poster to mid poster (for audio files)
    if (isVideo || isModel) {
      let posterURL = mw.huijiApi.getImageThumb(
        `${fileName}.poster.png`,
        "xyy",
        214
      );
      $(element).attr("src", posterURL);
    } else if (isAudio) {
      let posterURL = $(element)
        .attr("src")
        .replace("fileicon", "fileicon-mid");
      $(element).attr("src", posterURL);
    }
    // other style changes
    $(element).attr("style", "max-height: 120px; width: auto;");
    $(element).parent().parent().attr("style", "");
    $(element).parent().parent().parent().attr("style", "text-align: initial;");
    $(element)
      .parent()
      .parent()
      .parent()
      .parent()
      .attr("style", `max-width: ${isVideo ? 214 : 120}px;`);
    $(element).parent().parent().parent().parent().parent().attr("style", "");
    // add an play icon (for video files)
    if (isVideo) {
      $(element).parent().attr("style", "position: relative;");
      $(element)
        .parent()
        .append(
          '<div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,.4);color:#fff;font-size:2em;border-radius:4px">▶</div>'
        );
    }
  }
})();
