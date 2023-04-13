import AbstractBlock from "./AbstractBlock";
import {NotionImage} from "../NotionTypes";
import {imageUrl, plaintexts} from "../TextFormatter";

export default class Image extends AbstractBlock {
  public declare image: NotionImage["image"];

  constructor(private readonly block: NotionImage, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    let caption: string = undefined;
    if (this.block.image.caption) {
      caption = plaintexts(this.block.image.caption);
    }

    const width = this.image.width;
    const height = this.image.height;

    if(width < 200) {
      let content = `<div class="notion-image" style="width: ${width}px; height: ${height}px;">\n\n`;
      content += `![${caption || "image"}](${imageUrl(this.block.image)}${caption ? ` "${caption}"` : ""})\n`;
      content += "</div>\n";
      return content;
    }else{
      return `![${caption || "image"}](${imageUrl(this.block.image)}${caption ? ` "${caption}"` : ""})\n`;
    }
  }
}