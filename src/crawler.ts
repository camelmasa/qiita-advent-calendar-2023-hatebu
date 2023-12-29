import * as puppeteer from "puppeteer";
import { Category, createCategory } from "./category";
import { abortStaticFileRequests } from "./util";

type Crawl = {
  categories: Category[];
};

const QIITA_ADVENT_CALENDAR_URL = "https://qiita.com/advent-calendar/2023/categories";

export const createCrawler = () => {
  const crawl: () => Promise<Crawl> = async () => {
    const browser = await puppeteer.launch({ headless: "new" });

    const page = await browser.newPage();
    await abortStaticFileRequests(page);
    await page.goto(QIITA_ADVENT_CALENDAR_URL);
    const categoryLists = await page.$$("section > ul > li");

    const categories = [];
    for (const categoryList of categoryLists) {
      const title = await categoryList.$eval("a > p > span:last-child", (e) => e.textContent);
      const url = await categoryList.$eval("a", (e) => e.href);

      const category = await createCategory({ page, title, url });
      categories.push(category);
    }

    await browser.close();

    return { categories };
  };

  return { crawl };
};
