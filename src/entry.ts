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
  // if in dev mode and hasn't been redirected yet, redirect to target url with `?dev-server`
  else if (dev && location.hostname !== "xyy.huijiwiki.com") {
    let targetUrl = new URL("https://xyy.huijiwiki.com/wiki/首页");
    targetUrl.searchParams.set("dev-server", import.meta.url);
    location.href = targetUrl.href;
    return;
  }
  // ===== prod mode =====
  else import("./main");
})();
