import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../TextFormatter";

export type NotionParagraph = Extract<NotionBlock, { type: 'toggle' }>;

export default class Toggle extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `${texts(this.block.toggle.rich_text)}\n`;
  }
}