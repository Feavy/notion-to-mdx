import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../TextFormatter";

export default class DefaultBlock extends AbstractBlock {
  constructor(private readonly block: NotionBlock, children: AbstractBlock[]) {
    super(block, children)
  }

  public toMarkdown(): string {
    if (this.block[this.block.type].rich_text) {
      return texts(this.block[this.block.type].rich_text) + "\n";
    } else if (this.block[this.block.type].url) {
      return `[${this.block[this.block.type].url}](${this.block[this.block.type].url})\n`;
    }
    return this.childrenToMarkdown();
  }
}