import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../TextFormatter";

export type NotionHeading1 = Extract<NotionBlock, { type: 'heading_3' }>;

export default class Heading3 extends AbstractBlock {
  constructor(private readonly block: NotionHeading1, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `#### ${texts(this.block.heading_3.rich_text)}\n`;
  }
}