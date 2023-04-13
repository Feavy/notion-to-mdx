import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import Image from "./Image";

export type NotionColumnList = Extract<NotionBlock, { type: 'column_list' }>;

export default class ColumnList extends AbstractBlock {
  constructor(private readonly block: NotionColumnList, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    let ret = "<div class=\"columns\">\n";
    for (const column of this.children) {
      const isIcon = column.children.length === 1 && column.children[0] instanceof Image && column.children[0].image.width <= 200;
      if (isIcon) {
        ret += `<div class="column column-icon">\n\n${column.toMarkdown()}\n</div>\n`;
      } else {
        ret += `<div class="column">\n\n${column.toMarkdown()}\n</div>\n`;
      }
    }
    ret += "</div>\n";
    return ret;
  }
}