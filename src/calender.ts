import { Page } from "puppeteer";
import { Article, createArticle } from "./article";
import { abortStaticFileRequests } from "./util";

export type Calender = {
  title: string;
  url: string;
  articles: Article[];
};

export const createCalender = async ({
  page: categoryPage,
  title,
  url,
}: { page: Page; title: string; url: string }) => {
  const page = await categoryPage.browser().newPage();
  await abortStaticFileRequests(page);
  await page.goto(url);
  const calenderLists = await page.$$("main > div > div > div > div:first-child");

  const articles = [];
  for (const calenderList of calenderLists) {
    if (!(await calenderList.$$("table > tbody > tr > td"))) continue; // カレンダーが存在しない場合次のカレンダーへ

    const articleLists = await calenderList.$$("table > tbody > tr > td");

    for (const articleList of articleLists) {
      if (!(await articleList.$("div > div:last-child > a"))) continue; // 記事が存在しない場合次の記事へ

      const title = await articleList.$eval("div > div:last-child > a", (e) => e.textContent);
      const url = await articleList.$eval("div > div:last-child > a", (e) => e.href);

      const article = await createArticle({ title, url });
      console.log(article);
      articles.push(article);
    }
  }
  await page.close();

  return { title, url, articles };
};
