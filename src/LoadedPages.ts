import NotionPage from "./notion/markdown/blocks/NotionPage";
import Page from "./model/Page";

namespace LoadedPages {
  export const notionPages: Map<string, NotionPage> = new Map();
  export const localPages: Map<string, Page> = new Map();
}

export default LoadedPages;