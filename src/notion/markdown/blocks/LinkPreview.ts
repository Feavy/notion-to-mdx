import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";

export type NotionLinkPreview = Extract<NotionBlock, { type: 'link_preview' }>;

export default class LinkPreview extends AbstractBlock {
  constructor(private readonly block: NotionLinkPreview, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `<LinkPreview url="${this.block.link_preview.url}"/>\n`;
  }

}