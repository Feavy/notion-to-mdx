import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";

export type NotionParagraph = Extract<NotionBlock, { type: 'code' }>;

export default class Code extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(formatter): string {
    return `\`\`\`${this.block.code.language.replace("plain text", "")}
    ${formatter.texts(this.block.code.rich_text)}
    \`\`\`
    `;
  }
}