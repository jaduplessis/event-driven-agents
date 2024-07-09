import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export const getCookie = async () => {
  let browser = null;

  try {
    process.env.TMPDIR = "/tmp";
    
    // Launch a headless browser
    const executablePath = await chromium.executablePath;
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.goto("https://www.tesco.com/");

    // Get all cookies
    const cookies = await page.cookies();

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        cookies,
      }),
    };

    return response;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve the cookie" }),
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
