import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";
import LoadedPages from "../../../LoadedPages";
import notionPages = LoadedPages.notionPages;

export type NotionLinkToPage = Extract<NotionBlock, { type: 'link_to_page' }>;

export default class LinkToPage extends AbstractBlock {
  public readonly page_id;

  constructor(private readonly block: NotionLinkToPage, children: AbstractBlock[]) {
    super(block, children);
    if ("page_id" in block.link_to_page) {
      this.page_id = block.link_to_page.page_id;
    }
  }

  public toMarkdown(): string {
    if (!this.page_id) {
      return "";
    }

    const page = notionPages.get(this.page_id);

    if (page) {
      return `[${page.title}](${page.source.basePath}/${page.slug})\n`;
    } else {
      return `Page not found ${this.page_id}\n`;
    }
  }
}