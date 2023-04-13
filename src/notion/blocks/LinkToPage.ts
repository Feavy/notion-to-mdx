import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";

export type NotionLinkToPage = Extract<NotionBlock, { type: 'link_to_page' }>;

export default class LinkToPage extends AbstractBlock {
  public readonly page_id;

  constructor(private readonly block: NotionLinkToPage, children: AbstractBlock[]) {
    super(block, children);
    if ("page_id" in block.link_to_page) {
      this.page_id = block.link_to_page.page_id;
    }
  }

  public toMarkdown(formatter): string {
    if (this.page_id) {
      return formatter.linkToPage(this.page_id);
    }
  }
}