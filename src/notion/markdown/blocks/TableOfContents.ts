import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";

export type NotionTableOfContents = Extract<NotionBlock, { type: 'table_of_contents' }>;

export default class TableOfContents extends AbstractBlock {
  constructor(private readonly block: NotionTableOfContents, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `<TableOfContents data={props}/>\n`;
  }
}