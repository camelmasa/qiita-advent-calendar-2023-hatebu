export type Article = {
  title: string;
  url: string;
  hatebu: number;
};

const HATEBU_API_URL = "https://bookmark.hatenaapis.com/count/entry";

export const createArticle = async ({ title, url }: { title: string; url: string }) => {
  const response = await fetch(`${HATEBU_API_URL}?url=${encodeURIComponent(url)}`);
  const hatebu = Number(await response.text());

  return { title, url, hatebu };
};
