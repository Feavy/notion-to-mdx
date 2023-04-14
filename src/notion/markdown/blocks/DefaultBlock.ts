import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";

export default class DefaultBlock extends AbstractBlock {
  constructor(private readonly block: NotionBlock, children: AbstractBlock[]) {
    super(block, children)
  }

  public toMarkdown(): string {
    if (this.block[this.block.type].rich_text) {
      return this.text + "\n";
    } else if (this.block[this.block.type].url) {
      return `[${this.block[this.block.type].url}](${this.block[this.block.type].url})\n`;
    }
    return this.childrenToMarkdown();
  }
}