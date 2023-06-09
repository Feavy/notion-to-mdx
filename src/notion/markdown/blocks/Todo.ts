import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";

export type NotionParagraph = Extract<NotionBlock, { type: 'to_do' }>;

export default class Todo extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    const checked = this.block.to_do.checked ? "x" : " ";
    return (`- [${checked}] ${this.text}`);
  }
}