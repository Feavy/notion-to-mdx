import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../../types/NotionTypes";

export type NotionParagraph = Extract<NotionBlock, { type: 'code' }>;

export default class Code extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return "```" + this.block.code.language.replace("plain text", "") + "\n"
      + this.text + "\n"
    + "\n```";
    return `\`\`\`${this.block.code.language.replace("plain text", "")}
      ${this.text}
    \`\`\``.replace(/^ {4}/gm, '');
  }
}