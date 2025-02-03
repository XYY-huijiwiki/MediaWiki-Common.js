/* 如果列表的开头是一个图标，将其视为图标列表，加一个class */
$(document).ready(function () {
  $("li:has(span.material-symbols-outlined)").each(function (
    _index: number,
    element: HTMLLIElement
  ) {
    if (
      $(element).html().slice(0, 39) ===
      '<span class="material-symbols-outlined"'
    ) {
      $(element).addClass("icon-list-item");
    }
  });
});
