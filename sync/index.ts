import puppeteer, { KnownDevices } from "puppeteer";
import fs from "fs";
import mustache from "mustache";

// #region Main process

try {
  // init browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(KnownDevices["iPhone X"]);
  await page.goto(
    "https://xyy.huijiwiki.com/api.php?action=query&meta=tokens&type=login"
  );

  // run function in browser
  let gh_repository = process.env.GITHUB_REPOSITORY as string;
  let gh_actor = process.env.GITHUB_ACTOR as string;
  let gh_sha = process.env.GITHUB_SHA as string;
  let contentPrefix = mustache.render(
    fs.readFileSync("sync/warning.txt", "utf-8"),
    { gh_repository }
  );
  let code = fs.readFileSync("dist/common.js", "utf-8").trim();
  let codeEscaped = JSON.stringify(code).slice(1, -1);
  let content = `eval("${codeEscaped}")`;
  let text = contentPrefix + content;
  let summary = `同步 GitHub 代码。编辑者为[https://github.com/${gh_actor} ${gh_actor}]，详见[https://github.com/${gh_repository}/commit/${gh_sha} GitHub页面]。`;
  let lgname = process.env.WIKI_USERNAME;
  let lgpassword = process.env.WIKI_PASSWORD;
  if (!lgname || !lgpassword) throw new Error("No wiki username or password.");
  let result = await page.evaluate(
    inBrowserFunc,
    lgname,
    lgpassword,
    text,
    summary
  );
  if (result === true) {
    console.log("Edit success.");
  } else {
    throw new Error(JSON.stringify(result));
  }
  // end task
  await browser.close();
} catch (e) {
  console.error(e);
} finally {
}

// #endregion

// #region Helper functions
async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// #endregion

// #region In-Browser function

async function inBrowserFunc(
  lgname: string,
  lgpassword: string,
  text: string,
  summary: string
): Promise<boolean | string> {
  // get login token
  let preEle = document.querySelector("pre");
  if (!preEle)
    throw new Error(`No pre element found. (${document.body.innerHTML})`);
  if (!preEle.innerText)
    throw new Error(`No content in pre element. (${document.body.innerHTML})`);
  let data = JSON.parse(preEle.innerText);
  let loginToken = data.query.tokens.logintoken;

  // login
  const lgFormData = new FormData();
  lgFormData.append("action", "login");
  lgFormData.append("lgname", lgname);
  lgFormData.append("lgpassword", lgpassword);
  lgFormData.append("lgtoken", loginToken);
  lgFormData.append("format", "json");
  const requestOptions = {
    method: "POST",
    body: lgFormData,
  };
  let loginResult = await (
    await fetch("https://xyy.huijiwiki.com/api.php", requestOptions)
  ).json();
  if (loginResult.login.result !== "Success")
    throw new Error(`Login failed. (${JSON.stringify(loginResult)})`);

  // edit
  // @ts-ignore
  let editResult = await new window.mw.Api().postWithToken("csrf", {
    action: "edit",
    title: `MediaWiki:Common.js`,
    text: text,
    bot: true,
    summary: summary,
  });
  if (editResult.edit.result !== "Success")
    throw new Error(`Edit failed. (${JSON.stringify(editResult)})`);

  // if success, return true
  return true;
}

// #endregion
