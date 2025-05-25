/* 如果列表的开头是一个图标，将其视为图标列表，加一个class */
function setIconList() {
  document
    .querySelectorAll("li:has(span.material-symbols-outlined)")
    .forEach((element) => {
      console.log(`Found potential icon list item: ${element}`);
      const firstChild = element.firstChild;
      if (firstChild && firstChild.nodeType === Node.ELEMENT_NODE) {
        console.log(`- Found first child: ${firstChild}`);
        const firstElement = firstChild as HTMLElement;
        if (
          firstElement.tagName === "SPAN" &&
          firstElement.classList.contains("material-symbols-outlined")
        ) {
          console.log(`-- Found icon list item: ${element}`);
          element.classList.add("icon-list-item");
        }
      }
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setIconList);
} else {
  setIconList();
}

export {};
