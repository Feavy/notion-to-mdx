export default interface DataSourceProps {
  notionToken: string;
  id: string;
  type: "database" | "page";
  outputDir: string;
  basePath: string;
}
