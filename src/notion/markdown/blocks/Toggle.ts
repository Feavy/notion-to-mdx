import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";

export type NotionParagraph = Extract<NotionBlock, { type: 'toggle' }>;

export default class Toggle extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `${this.text}\n`;
  }
}