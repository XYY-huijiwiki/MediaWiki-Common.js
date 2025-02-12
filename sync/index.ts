import puppeteer, { KnownDevices } from "puppeteer";
import fs from "fs";
import mustache from "mustache";

// open browser
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.emulate(KnownDevices["iPhone X"]);
await page.goto(
  "https://xyy.huijiwiki.com/index.php?title=%E7%89%B9%E6%AE%8A:%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95"
);

// login
await page.type("#wpName1", process.env.WIKI_USERNAME as string);
await page.type("#wpPassword1", process.env.WIKI_PASSWORD as string);
await page.waitForSelector("#wpLoginAttempt");
await page.click("#wpLoginAttempt");
await page.waitForSelector("#mw-input-skipReset");
// remove .htmlform-tip from the page to avoid it blocking the button
await page.evaluate(() => {
  document.querySelector(".htmlform-tip")?.remove();
});
await page.click("#mw-input-skipReset");

// edit
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
await page.waitForNavigation();
await page.evaluate(
  async (gh_repository, gh_actor, gh_sha, contentPrefix, content) => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      new mw.Api()
        .postWithToken("csrf", {
          action: "edit",
          title: `MediaWiki:Common.js`,
          text: contentPrefix + content,
          bot: true,
          summary: `同步 GitHub 代码。编辑者为[https://github.com/${gh_actor} ${gh_actor}]，详见[https://github.com/${gh_repository}/commit/${gh_sha} GitHub页面]。`,
        })
        .then(resolve)
        .catch(reject);
    });
  },
  gh_repository,
  gh_actor,
  gh_sha,
  contentPrefix,
  content
);

// end
await browser.close();
