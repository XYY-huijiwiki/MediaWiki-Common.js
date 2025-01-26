import { debounce } from "lodash-es";

(async () => {
  // ===== dev mode =====
  let dev = import.meta.env.DEV;
  let devServer = new URL(location.href).searchParams.get("dev-server");
  // if in prod mode and `?dev-server` is set, load dev server
  if (!dev && devServer) {
    await import(
      /* @vite-ignore */
      devServer
    );
    return;
  }
  // if in dev mode, add `?dev-server` to all links
  if (dev) {
    const observer = new MutationObserver(
      debounce(() => {
        const devServerValue = import.meta.url;
        document.querySelectorAll("a").forEach((a) => {
          const url = new URL(a.href);
          if (url.origin === location.origin) {
            url.searchParams.set("dev-server", devServerValue);
            a.href = url.href;
          }
        });
      }, 200)
    );
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ===== prod mode =====
  await import("./ts/setIconList.mts");
  await import("./ts/setLanguage.mts");
  await import("./ts/tailwindConfig.mts");
  await import("./ts/githubFilesDisplay.mts");
})();
