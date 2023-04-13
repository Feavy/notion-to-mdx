import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";

export default class DefaultBlock extends AbstractBlock {
  constructor(private readonly block: NotionBlock, children: AbstractBlock[]) {
    super(block, children)
  }

  public toMarkdown(formatter): string {
    if (this.block[this.block.type].rich_text) {
      return formatter.texts(this.block[this.block.type].rich_text) + "\n";
    } else if (this.block[this.block.type].url) {
      return `[${this.block[this.block.type].url}](${this.block[this.block.type].url})\n`;
    }
    return this.childrenToMarkdown(formatter);
  }
}