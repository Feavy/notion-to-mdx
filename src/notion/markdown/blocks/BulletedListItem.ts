import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";

export type NotionBulletListItem = Extract<NotionBlock, { type: 'bulleted_list_item' }>;

export default class BulletedListItem extends AbstractBlock {
  constructor(private readonly block: NotionBulletListItem, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    let result = `* ${this.text}\n`;
    for (let i = 0; i < this.children.length; i++) {
      result += `  ` + this.children[i].toMarkdown();
    }
    return result;
  }
}