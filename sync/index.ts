import puppeteer, { KnownDevices } from "puppeteer";
import fs from "fs";
import mustache from "mustache";
import { env } from "process";
import { execSync } from "child_process";

// #region Main Process

async function main() {
  try {
    console.log("[Node.js] Initializing Puppeteer...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulate(KnownDevices["iPhone X"]);

    // Capture browser logs and forward them to Node.js
    page.on("console", (msg) => console.log("[Browser]", msg.text()));

    console.log("[Node.js] Navigating to login token endpoint...");
    await page.goto(
      "https://xyy.huijiwiki.com/api.php?action=query&meta=tokens&type=login"
    );

    const {
      GITHUB_REPOSITORY,
      GITHUB_ACTOR,
      GITHUB_SHA,
      WIKI_USERNAME,
      WIKI_PASSWORD,
    } = env;

    if (!GITHUB_REPOSITORY)
      throw new Error("Missing GITHUB_REPOSITORY in environment variables.");
    if (!GITHUB_ACTOR)
      throw new Error("Missing GITHUB_ACTOR in environment variables.");
    if (!GITHUB_SHA)
      throw new Error("Missing GITHUB_SHA in environment variables.");
    if (!WIKI_USERNAME)
      throw new Error("Missing WIKI_USERNAME in environment variables.");
    if (!WIKI_PASSWORD)
      throw new Error("Missing WIKI_PASSWORD in environment variables.");

    const contentPrefix = mustache.render(
      fs.readFileSync("sync/warning.mustache", "utf-8"),
      { GITHUB_REPOSITORY }
    );

    const code = fs.readFileSync("dist/common.js", "utf-8").trim();
    const codeEscaped = JSON.stringify(code).slice(1, -1);
    const text = contentPrefix + `eval("${codeEscaped}")`;

    // 获取最后一次提交的 message
    const lastCommitMsg = execSync("git log -1 --pretty=%B").toString().trim();

    const summary = `${lastCommitMsg} （编辑者为${GITHUB_ACTOR}，详见 https://github.com/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}）`;

    console.log("[Node.js] Executing in-browser function...");
    const result: boolean | string = await page.evaluate(
      inBrowserFunc,
      WIKI_USERNAME,
      WIKI_PASSWORD,
      text,
      summary
    );

    if (result === true) {
      console.log("[Node.js] Edit successful.");
    } else {
      throw new Error(`Edit failed: ${JSON.stringify(result)}`);
    }

    console.log("[Node.js] Closing browser...");
    await browser.close();
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

main();

// #endregion

// #region In-Browser Function

async function inBrowserFunc(
  lgname: string,
  lgpassword: string,
  text: string,
  summary: string
): Promise<boolean | string> {
  try {
    console.log("Fetching login token...");
    const preEle = document.querySelector("pre");
    if (!preEle || !preEle.innerText) {
      throw new Error(
        `No valid <pre> element found. (${document.body.innerHTML})`
      );
    }

    const data = JSON.parse(preEle.innerText);
    const loginToken = data.query.tokens.logintoken;

    console.log("Logging into wiki...");
    const formData = new FormData();
    formData.append("action", "login");
    formData.append("lgname", lgname);
    formData.append("lgpassword", lgpassword);
    formData.append("lgtoken", loginToken);
    formData.append("format", "json");

    const loginResponse = await fetch("https://xyy.huijiwiki.com/api.php", {
      method: "POST",
      body: formData,
    });
    const loginResult = await loginResponse.json();

    if (loginResult.login.result !== "Success") {
      throw new Error(`Login failed: ${JSON.stringify(loginResult)}`);
    }

    console.log("Submitting edit request...");
    // @ts-expect-error: mw.Api is available in the browser context
    const editResult = await new window.mw.Api().postWithToken("csrf", {
      action: "edit",
      title: "MediaWiki:Common.js",
      text,
      bot: true,
      summary,
    });

    if (editResult.edit.result !== "Success") {
      throw new Error(`Edit failed: ${JSON.stringify(editResult)}`);
    }

    return true;
  } catch (error) {
    console.error("Error in in-browser function:", error);
    return error.message;
  }
}

// #endregion
