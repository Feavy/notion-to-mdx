import * as dotenv from "dotenv"
import synchronizeNotionPages from "../src";
dotenv.config()

synchronizeNotionPages([
  {
    notionToken: process.env.NOTION_TOKEN,
    type: "database",
    id: "80035349b4bb4c16b89af4f3db64f97e",
    outputDir: "./output/articles",
    basePath: "/articles"
  }
]);

export {}