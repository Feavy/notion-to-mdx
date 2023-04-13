import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {plaintexts} from "../TextFormatter";

export type NotionBookmark = Extract<NotionBlock, { type: 'bookmark' }>;

export default class Bookmark extends AbstractBlock {
  constructor(private readonly block: NotionBookmark, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `<LinkPreview caption="${plaintexts(this.block.bookmark.caption)}" url="${this.block.bookmark.url}"/>\n`;
  }

}