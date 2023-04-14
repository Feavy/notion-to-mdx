export default interface NotionSourceProps {
  notionToken: string;
  id: string;
  type: "database" | "page";
  outputDir: string;
  basePath: string;
}
