import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import TextFormatter from "../TextFormatter";

export type NotionParagraph = Extract<NotionBlock, { type: 'bulleted_list_item' }>;

export default class BulletedListItem extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(formatter: TextFormatter): string {
    let result = `* ${formatter.texts(this.block.bulleted_list_item.rich_text)}\n`;
    for(let i = 0; i < this.children.length; i++) {
      result += `  `+this.children[i].toMarkdown(formatter);
    }
    return result;
  }
}