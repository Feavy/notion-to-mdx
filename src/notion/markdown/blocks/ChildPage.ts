import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";

export type NotionParagraph = Extract<NotionBlock, { type: 'child_page' }>;

export default class ChildPage extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `${this.block.child_page.title}\n`;
  }
}