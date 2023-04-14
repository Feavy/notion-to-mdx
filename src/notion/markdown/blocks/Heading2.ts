import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";

export type NotionHeading1 = Extract<NotionBlock, { type: 'heading_2' }>;

export default class Heading2 extends AbstractBlock {
  constructor(private readonly block: NotionHeading1, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `### ${this.text}\n`;
  }
}