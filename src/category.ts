import { Page } from "puppeteer";
import { Calender, createCalender } from "./calender";
import { abortStaticFileRequests } from "./util";

export type Category = {
  title: string;
  url: string;
  calenders: Calender[];
};

export const createCategory = async ({ page: topPage, title, url }: { page: Page; title: string; url: string }) => {
  const page = await topPage.browser().newPage();
  await abortStaticFileRequests(page);

  const calenders = [];
  let pageCount = 1;
  do {
    await page.goto(`${url}?page=${pageCount}`);

    const calenderLists = await page.$$("section > div > div");
    if (calenderLists.length <= 1) break; // カレンダーが1つも存在しない場合終了

    for (const calenderList of calenderLists) {
      if (!(await calenderList.$("div > div > div > div > div > p"))) continue; // カレンダーが存在しない場合次のカレンダーへ

      const title = await calenderList.$eval("div > div > div > div > div > p", (e) => e.textContent);
      const url = await calenderList.$eval("div > div > div > a", (e) => e.href);

      const calender = await createCalender({ page, title, url });
      calenders.push(calender);
    }
    pageCount = pageCount + 1;
  } while (true);

  await page.close();

  return { title, url, calenders };
};
