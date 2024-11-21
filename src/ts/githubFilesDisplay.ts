// quick config
let gh_proxy = "https://ghproxy.net/";
let gh_media_baseURL =
  "https://github.com/XYY-huijiwiki/files/releases/download/";
let gh_page_baseURL = "https://github.com/XYY-huijiwiki/files/releases/tag/";

// basic html media structure
// <div style="margin:0px auto;">
// <a href="...">
// <img alt="..." src="..." loading="lazy" decoding="async"> or <video> or <audio> or <iframe>
// </a>
// </div>
// <div class="gallerytext">...</div>
function createMediaElement(file_name: string, desc: string, height?: number) {
  let file_ext = file_name.split(".").pop() || "";
  let file_type: "image" | "video" | "audio" | "other" = (() => {
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(file_ext)) {
      return "image";
    } else if (["mp4", "webm", "ogg"].includes(file_ext)) {
      return "video";
    } else if (["mp3", "wav", "ogg"].includes(file_ext)) {
      return "audio";
    } else {
      return "other";
    }
  })();
  let mediaDiv = document.createElement("div");
  mediaDiv.style.margin = "0px auto";
  let mediaLink = document.createElement("a");
  mediaLink.href = gh_page_baseURL + file_name;
  mediaLink.target = "_blank";
  let mediaElement:
    | HTMLImageElement
    | HTMLVideoElement
    | HTMLAudioElement
    | HTMLSpanElement;
  if (file_type === "image") {
    let mediaImg = document.createElement("img");
    mediaImg.alt = file_name;
    mediaImg.src =
      gh_proxy + gh_media_baseURL + file_name + "/default." + file_ext;
    mediaImg.decoding = "async";
    mediaImg.loading = "lazy";
    mediaImg.style.width = "auto";
    mediaImg.style.height = height ? height.toString() + "px" : "auto";
    mediaElement = mediaImg;
  } else if (file_type === "video") {
    let mediaVideo = document.createElement("video");
    mediaVideo.controls = true;
    mediaVideo.style.width = "auto";
    mediaVideo.style.height = height ? height.toString() + "px" : "auto";
    mediaVideo.src =
      gh_proxy + gh_media_baseURL + file_name + "/default." + file_ext;
    mediaElement = mediaVideo;
  } else if (file_type === "audio") {
    let mediaAudio = document.createElement("audio");
    mediaAudio.controls = true;
    mediaAudio.src =
      gh_proxy + gh_media_baseURL + file_name + "/default." + file_ext;
    mediaElement = mediaAudio;
  } else {
    let mediaSpan = document.createElement("span");
    mediaSpan.textContent = "Unsupported file type: " + file_ext;
    mediaElement = mediaSpan;
  }
  mediaLink.appendChild(mediaElement);
  mediaDiv.appendChild(mediaLink);
  let textDiv = document.createElement("div");
  textDiv.className = "gallerytext";
  textDiv.textContent = desc;
  mediaDiv.appendChild(textDiv);
  return mediaDiv;
}

function checkAndModifyThumbs() {
  const thumbs = document.querySelectorAll("div.thumb:not(:has(img))");
  thumbs.forEach((thumb) => {
    let orign_text = thumb.textContent?.trim() || "";
    if (orign_text.startsWith("GitHub:")) {
      // possible text structure:
      // GitHub: file_name | description
      // or
      // GitHub: file_name
      let pipe_index = orign_text.indexOf("|");
      let file_name =
        pipe_index === -1
          ? orign_text.slice(7).trim().replaceAll(" ", "_")
          : orign_text.slice(7, pipe_index).trim().replaceAll(" ", "_");
      let desc =
        pipe_index === -1 ? "" : orign_text.slice(pipe_index + 1).trim();
      let thumb_style = thumb.getAttribute("style");
      let thumb_height = parseInt(
        thumb_style?.match(/height:\s*(\d+)px/)?.[1] || "0"
      );
      thumb.innerHTML = createMediaElement(
        file_name,
        desc,
        thumb_height
      ).outerHTML;
      // remove thumb's parent and grand parent element's style.width
      let thumb_parent = thumb.parentElement;
      let thumb_grandparent = thumb_parent?.parentElement;
      thumb_parent?.style.removeProperty("width");
      thumb_grandparent?.style.removeProperty("width");
    }
  });
}

// Initial check on page load
checkAndModifyThumbs();

// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList) => {
  // Start timing
  const start = performance.now();

  // Check each mutation
  mutationsList.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      observer.disconnect();
      checkAndModifyThumbs();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  });

  // End timing
  const end = performance.now();
  dev &&
    console.log(`Execution time for githubFilesDisplay.ts: ${end - start} ms`);
});

// Start observing the container for added nodes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
