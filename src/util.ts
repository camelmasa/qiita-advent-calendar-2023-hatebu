import { Page } from "puppeteer";

const STATIC_FILE_TYPES = ["script", "stylesheet", "font", "image", "media"];

export const abortStaticFileRequests = async (page: Page) => {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (STATIC_FILE_TYPES.includes(request.resourceType())) {
      request.abort();
      return;
    }
    request.continue();
  });
};
