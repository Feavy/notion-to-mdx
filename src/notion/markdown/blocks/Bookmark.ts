import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";
import {plaintext} from "../../utils/TextUtils";

export type NotionBookmark = Extract<NotionBlock, { type: 'bookmark' }>;

export default class Bookmark extends AbstractBlock {
  constructor(private readonly block: NotionBookmark, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `<LinkPreview caption="${plaintext(this.block.bookmark.caption)}" url="${this.block.bookmark.url}"/>\n`;
  }

}