import { promises as fsPromises } from "fs";

interface DataEntry {
  title: string;
  url: string;
  hatebu: number;
}

const convertAndSaveMarkdown = async () => {
  const data = await fsPromises.readFile("2023-12-29.json", "utf-8");
  const jsonData: DataEntry[] = JSON.parse(data);
  const sortedData = jsonData.sort((a, b) => b.hatebu - a.hatebu).slice(0, 100);

  const markdownContent = sortedData.map((entry) => `- [${entry.title}](${entry.url}) B! ${entry.hatebu}`).join("\n");

  await fsPromises.writeFile("top100.md", markdownContent);
};

// Call the function
convertAndSaveMarkdown();
