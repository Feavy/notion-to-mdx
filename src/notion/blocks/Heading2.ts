import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";

export type NotionHeading1 = Extract<NotionBlock, { type: 'heading_2' }>;

export default class Heading2 extends AbstractBlock {
  constructor(private readonly block: NotionHeading1, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(formatter): string {
    return `### ${formatter.texts(this.block.heading_2.rich_text)}\n`;
  }
}