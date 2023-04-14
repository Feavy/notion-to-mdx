import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";
import Image from "./Image";

export type NotionColumnList = Extract<NotionBlock, { type: 'column_list' }>;

export default class ColumnList extends AbstractBlock {
  constructor(private readonly block: NotionColumnList, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    let ret = "<div class=\"columns\">\n";
    for (const column of this.children) {
      ret += `<div class="column">\n\n${column.toMarkdown()}\n</div>\n`;
    }
    ret += "</div>\n";
    return ret;
  }
}