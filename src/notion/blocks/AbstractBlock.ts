import {NotionBlock} from "../NotionTypes";
import TextFormatter from "../TextFormatter";

export default abstract class AbstractBlock {
  public type: string;
  public id: string;
  public readonly internal: NotionBlock;

  protected constructor(block: NotionBlock, public readonly children: AbstractBlock[]) {
    Object.assign(this, block);
    this.internal = block;
  }

  public childrenToMarkdown(formatter: TextFormatter): string {
    return this.children.filter(block => block != null).map(block => block.toMarkdown(formatter)).join("\n");
  }

  public abstract toMarkdown(formatter: TextFormatter): string;

  public visitDeep(visitor: (block) => void) {
    visitor(this);
    this.children.forEach(child => child.visitDeep(visitor));
  }

}