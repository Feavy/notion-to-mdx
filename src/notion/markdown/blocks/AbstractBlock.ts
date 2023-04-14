import Texts from "../text/Texts";
import {NotionBlock} from "../../types/NotionTypes";

export default abstract class AbstractBlock {
  public type: string;
  public id: string;
  public readonly internal: NotionBlock;

  protected constructor(block: NotionBlock, public readonly children: AbstractBlock[]) {
    Object.assign(this, block);
    this.internal = block;
  }

  public childrenToMarkdown(): string {
    return this.children.filter(block => block != null).map(block => block.toMarkdown()).join("\n");
  }

  public abstract toMarkdown(): string;

  public visitDeep(visitor: (block) => void) {
    visitor(this);
    this.children.forEach(child => child.visitDeep(visitor));
  }

  public get text() {
    const blocks = this.internal[this.internal.type].rich_text;
    return `${blocks.map(block => Texts.create(block).toMarkdown()).join("")}`
  }

}