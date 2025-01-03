import puppeteer from "puppeteer";

export const getTescoApiToken = async () => {
  let browser;
  let headersWithToken;
  try {
    const url =
      "https://www.tesco.com/groceries/en-GB/search?query=granola&inputType=free+text";
    browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();
    page.setDefaultTimeout(5000);

    await page.goto(url);
    console.log("Navigated to:", url);
    await page.setViewport({ width: 1400, height: 960 });

    headersWithToken = await new Promise((resolve) => {
      page.on("response", async (response) => {
        console.log("Response URL:", response.url());
        if (
          response.url().includes("https://api.tesco.com/shoppingexperience")
        ) {
          console.log("Url:", response.url());
          const headers = response.headers();
          console.log("Response Headers:", headers);
          if (headers["x-apikey"]) {
            console.log("API Token found:", headers["x-apikey"]);
            resolve(headers);
          }
        }
      });
    });
  } catch (err) {
    console.error("Error during script execution:", err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return headersWithToken;
};

getTescoApiToken().then((headers) => {
  console.log("API Token:", headers);
});
