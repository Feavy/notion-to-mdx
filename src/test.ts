import * as dotenv from "dotenv"
dotenv.config()

import generateNotionPages from "./index";

generateNotionPages([
  {
    notionToken: process.env.NOTION_TOKEN,
    type: "database",
    id: "80035349b4bb4c16b89af4f3db64f97e",
    outputDir: "./output/articles",
    basePath: "/articles"
  }
]);

export {}