(async () => {
  let elements = $(
    'ul.gallery li.gallerybox div.thumb a[href$=".mp4.png"]>img[src="/resources/assets/file-type-icons/fileicon.png"]'
  );
  console.log(elements);
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    let fileName = decodeURI($(element).parent().attr("href")).match(
      /:(.*)\.png/
    )![1];
    console.log(fileName);
    let link = encodeURI(
      `//xyy.huijiwiki.com/wiki/Project:上传特殊文件#/preview/${fileName}`
    );
    $(element).parent().attr("href", link);
    $(element).parent().attr("target", "_blank");
    let posterURL;
    try {
      posterURL = mw.huijiApi.getImageThumb(
        `${fileName}.poster.png`,
        "xyy",
        214
      );
      let posterStream = await fetch(posterURL);
      if (!posterStream.ok) {
        throw new Error("Thumb not found");
      }
      let posterBlob = await posterStream.blob();
      posterURL = URL.createObjectURL(posterBlob);
      $(element).attr("src", posterURL);
      console.log("use thumb");
    } catch (error) {
      posterURL = mw.huijiApi.getImageUrl(`${fileName}.poster.png`, "xyy");
      $(element).attr("src", posterURL);
      console.log("use url");
    }
    $(element).attr("height", "120");
    $(element).attr("width", "214");
    $(element).parent().parent().attr("style", "");
    $(element).parent().parent().parent().attr("style", "text-align: initial;");
    $(element).parent().parent().parent().parent().attr("style", "");
    $(element).parent().parent().parent().parent().parent().attr("style", "");
  }
  // add an play icon
  $(elements).parent().attr("style", "position: relative;");
  $(elements).parent().append('<div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,.4);color:#fff;font-size:2em;border-radius:4px">▶</div>')
})();
