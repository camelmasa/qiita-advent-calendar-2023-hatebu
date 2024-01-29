import { promises as fsPromises } from "fs";

interface DataEntry {
  title: string;
  url: string;
  hatebu: number;
}

const convertAndSaveMarkdown = async () => {
  const data = await fsPromises.readFile("2024-01-29.json", "utf-8");
  const jsonData: DataEntry[] = JSON.parse(data);
  const sortedData = jsonData.sort((a, b) => b.hatebu - a.hatebu)

  const markdownContent = sortedData.map((entry) => `- [${entry.title}](${entry.url}) B! ${entry.hatebu}`).join("\n");

  await fsPromises.writeFile("all.md", markdownContent);
};

// Call the function
convertAndSaveMarkdown();
