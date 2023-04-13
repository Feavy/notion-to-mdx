import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../TextFormatter";

export type NotionParagraph = Extract<NotionBlock, { type: 'numbered_list_item' }>;

export default class NumberedListItem extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    let result = `1. ${texts(this.block.numbered_list_item.rich_text)}\n`;
    for (let i = 0; i < this.children.length; i++) {
      result += `  ` + this.children[i].toMarkdown();
    }
    return result;
  }
}