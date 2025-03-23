import { debounce } from "lodash-es";
import basex from "base-x";

// ====================
// Helper Functions
// ====================
function genFileNameBase62(file_name: string) {
  const base62 = basex(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  );
  const fileExt = file_name.split(".").pop();
  if (!fileExt) throw new Error("File name has no extension");
  const fileName = file_name.slice(0, -(1 + fileExt.length));

  // Use TextEncoder to encode the fileName to a Uint8Array
  const encoder = new TextEncoder();
  const encodedFileName = encoder.encode(fileName);

  const fileNameBase62 = base62.encode(encodedFileName) + "." + fileExt;
  return fileNameBase62;
}
function genRawFileUrl(file_name: string) {
  const fileNameBase62 = genFileNameBase62(file_name);
  return `https://github.com/XYY-huijiwiki/files/releases/download/eOsizdoz/${fileNameBase62}`;
}
function genThumbUrl(file_name: string) {
  const fileNameBase62 = genFileNameBase62(file_name);
  const fileType = getFileType(file_name);
  return fileType === "image" || fileType === "video" || fileType === "model"
    ? `https://karsten-zhou.gumlet.io/https://github.com/XYY-huijiwiki/files/releases/download/thumb/${fileNameBase62}`
    : "";
}
function getFileType(
  fileName: string
): "video" | "audio" | "image" | "model" | "zip" | "pdf" | "other" {
  const ext = fileName.split(".").pop();
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext!)) {
    return "image";
  } else if (["mp4", "webm"].includes(ext!)) {
    return "video";
  } else if (["mp3", "wav", "ogg", "aac"].includes(ext!)) {
    return "audio";
  } else if (["glb", "gltf"].includes(ext!)) {
    return "model";
  } else if (["zip", "rar", "7z"].includes(ext!)) {
    return "zip";
  } else if (["pdf"].includes(ext!)) {
    return "pdf";
  } else {
    return "other";
  }
}
function genFileDetailsUrl(file_name: string) {
  return `https://xyy.huijiwiki.com/wiki/Project:控制中心#/file-preview/${file_name}`;
}

// create a media element like:
// <a href="..."><img alt="..." src="..." loading="lazy" title="..."></a>
// or
// <a href="..."><video controls src="..." poster="..." preload="metadata" title="..."></a>
// or for models
// <a href="..." class="relative inline-block">
//   <img alt="..." src="..." loading="lazy" title="..." />
//   <div class="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/20">
//     <span class="material-symbols-outlined"> view_in_ar </span>
//   </div>
// </a>
function createMediaElement(
  file_name: string,
  width: string = "auto",
  height: string = "auto"
) {
  let file_type = getFileType(file_name);
  let a = document.createElement("a");
  a.href = genFileDetailsUrl(file_name);
  a.title = file_name;
  a.target = "_blank";
  let mediaElement: HTMLImageElement | HTMLVideoElement | HTMLSpanElement;
  if (file_type === "image") {
    let mediaImg = document.createElement("img");
    mediaImg.alt = file_name;
    mediaImg.src = genThumbUrl(file_name);
    mediaImg.loading = "lazy";
    mediaImg.style.width = width;
    mediaImg.style.height = height;
    mediaElement = mediaImg;
  } else if (file_type === "video") {
    let mediaVideo = document.createElement("video");
    mediaVideo.controls = true;
    mediaVideo.style.width = width;
    mediaVideo.style.height = height;
    mediaVideo.style.borderRadius = "4px";
    mediaVideo.src = genRawFileUrl(file_name);
    mediaVideo.poster = genThumbUrl(file_name);
    mediaVideo.preload = "metadata";
    mediaElement = mediaVideo;
  } else if (file_type === "model") {
    a.className = "relative inline-block";
    let mediaImg = document.createElement("img");
    mediaImg.alt = file_name;
    mediaImg.src = genThumbUrl(file_name);
    mediaImg.loading = "lazy";
    mediaImg.style.width = width;
    mediaImg.style.height = height;
    mediaElement = mediaImg;
    let div = document.createElement("div");
    div.className =
      "absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/20";
    let span = document.createElement("span");
    span.className = "material-symbols-outlined";
    span.innerText = "view_in_ar";
    div.appendChild(span);
    a.appendChild(div);
  } else {
    let mediaImg = document.createElement("img");
    mediaImg.alt = file_name;
    mediaImg.src =
      file_type === "audio"
        ? "https://huiji-public.huijistatic.com/xyy/uploads/d/d1/File-type-audio.png"
        : file_type === "zip"
          ? "https://huiji-public.huijistatic.com/xyy/uploads/e/ec/File-type-zip.png"
          : file_type === "pdf"
            ? "https://huiji-public.huijistatic.com/xyy/uploads/4/43/File-type-doc.png"
            : "https://huiji-public.huijistatic.com/xyy/uploads/6/6d/File-type-default.png";
    mediaImg.loading = "lazy";
    mediaImg.style.width = width;
    mediaImg.style.height = height;
    mediaElement = mediaImg;
  }
  a.appendChild(mediaElement);
  return a;
}

function checkAndModifyGithubFiles() {
  // [[:文件:GitHub:file_name]]
  // => <a href="/index.php?title=文件:GitHub:file_name&action=edit" class="new">...</a>
  // => <a href="..." target="_blank" title="file_name">...</a>
  let linkElements = document.querySelectorAll(
    `a.new[href^="/index.php?title=${encodeURI("文件:GitHub:")}"]`
  ) as NodeListOf<HTMLAnchorElement>;
  linkElements.forEach((linkElement) => {
    let url = new URL(linkElement.href, window.location.origin);
    let file_name =
      url.searchParams.get("title")?.slice(10).trim().replaceAll(" ", "_") ||
      "";
    // TO DO provide a web page to display the file details
    linkElement.href = genFileDetailsUrl(file_name);
    linkElement.target = "_blank";
    linkElement.title = file_name;
    linkElement.classList.remove("new");
  });

  // [[文件:GitHub:file_name|缩略图]]
  // => <div class="thumbinner" style="width:182px;">
  //        <a href="/index.php?title=特殊:上传文件&wpDestFile=GitHub:file_name" class="new">file_name</a>
  //        <div class="thumbcaption">...</div>
  //    </div>
  // => <div class="thumbinner">
  //        <a href="..." target="_blank" title="...">
  //            <img alt="..." src="..." loading="lazy" style="width: 300px; height: auto;">
  //        </a>
  //        <div class="thumbcaption">...</div>
  //    </div>
  let thumbElements = document.querySelectorAll(
    `div.thumbinner:has(>a.new[href^="/index.php?title=${encodeURI("特殊:上传文件&wpDestFile=GitHub:")}"])`
  ) as NodeListOf<HTMLDivElement>;
  thumbElements.forEach((thumbElement) => {
    thumbElement.style.removeProperty("width");
    let linkElement = thumbElement.querySelector("a.new") as HTMLAnchorElement;
    let url = new URL(linkElement.href, window.location.origin);
    let file_name =
      url.searchParams
        .get("wpDestFile")
        ?.slice(7)
        .trim()
        .replaceAll(" ", "_") || "";
    thumbElement.innerHTML = createMediaElement(
      file_name,
      "300px",
      "auto"
    ).outerHTML;
  });

  // [[文件:GitHub:file_name]]
  // => <a href="/index.php?title=特殊:上传文件&wpDestFile=GitHub:file_name" class="new">...</a>
  // => <a href="..." target="_blank" title="...">
  //        <img alt="..." src="..." loading="lazy" style="width: 100%; height: auto;">
  //    </a>
  let imageElements = document.querySelectorAll(
    `a.new[href^="/index.php?title=${encodeURI("特殊:上传文件&wpDestFile=GitHub:")}"]`
  ) as NodeListOf<HTMLAnchorElement>;
  imageElements.forEach((imageElement) => {
    let url = new URL(imageElement.href, window.location.origin);
    let file_name =
      url.searchParams
        .get("wpDestFile")
        ?.slice(7)
        .trim()
        .replaceAll(" ", "_") || "";
    imageElement.outerHTML = createMediaElement(
      file_name,
      "100%",
      "auto"
    ).outerHTML;
  });

  // <gallery>
  // GitHub:file_name
  // </gallery>
  // => <div style="width: 122px"><div class="thumb" style="height: 120px;">GitHub:file_name</div></div>
  // => <div><div class="thumb"><a><img/></a></div></div>
  let galleryElements = document.querySelectorAll(
    `div.thumb:not(:has(img))`
  ) as NodeListOf<HTMLDivElement>;
  galleryElements.forEach((galleryElement) => {
    if (galleryElement.textContent?.startsWith("GitHub:")) {
      let file_name = galleryElement.textContent
        .slice(7)
        .trim()
        .replaceAll(" ", "_");
      let height = galleryElement.style.height;
      galleryElement.innerHTML = createMediaElement(
        file_name,
        "autp",
        height
      ).outerHTML;
      // remover useless width and height
      let parentElement = galleryElement.parentElement as HTMLDivElement;
      let grandparentElement = parentElement.parentElement as HTMLDivElement;
      parentElement.style.removeProperty("width");
      grandparentElement.style.removeProperty("width");
      galleryElement.style.removeProperty("height");
    }
  });
}

// Initial check on page load
checkAndModifyGithubFiles();

// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList) => {
  // Check each mutation
  mutationsList.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      observer.disconnect();
      debounce(checkAndModifyGithubFiles, 500)();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  });
});

// Start observing the container for added nodes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
