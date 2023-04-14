import downloadImage from '../../utils/downloadImage';
import NotionPage from './blocks/NotionPage';
import fs from "fs";
import Image from "./blocks/Image";
import {NotionImageFile} from "../types/NotionTypes";
import {escape, icon, imageUrl} from "../utils/TextUtils";

export default class NotionMarkdownGenerator {
  public constructor(private page: NotionPage) { }

  private generateFrontMatter() {
    let frontMatter = "---\n";
    frontMatter += `title: "${escape(this.page.title)}"\n`;
    frontMatter += `created_time: ${this.page.created_time}\n`;
    frontMatter += `last_edited_time: ${this.page.last_edited_time}\n`;

    if (this.page.cover)
      frontMatter += `cover: ${imageUrl(this.page.cover) || ""}\n`;

    if (this.page.icon) {
      const type = this.page.icon.type === "emoji" ? "emoji" : "image";
      frontMatter += `icon_${type}: ${icon(this.page.icon)}\n`;
    }

    // TODO : generate frontmatter for every user properties
    // Needs a property type -> string conversion
    frontMatter += `slug: ${this.page.slug}\n`;
    frontMatter += `tags: ${JSON.stringify(this.page.tags)}\n`;

    frontMatter += "---\n";
    return frontMatter;
  }

  private generateContent() {
    return this.page.toMarkdown();
  }

  private async downloadImages() {
    const images: Promise<void>[] = [];
    this.page.visitDeep(block => {
      if (block instanceof Image) {
        images.push(this.downloadImage(block.id, block.image));
      }
    });
    await Promise.all(images);
  }

  private async downloadImage(name: string, block: NotionImageFile): Promise<void> {
    const image = block.type === "file" ? block.file : block.external;
    await downloadImage(image.url, `${this.page.filepath}/images`, name).then(data => {
      image.url = `./images/${data.path}`;
      block.width = data.width;
      block.height = data.height;
    });
  }

  public async generate() {
    await fs.promises.mkdir(`${this.page.filepath}/images`, {recursive: true});

    await this.downloadImages();
    if (this.page.cover) {
      await this.downloadImage("cover", this.page.cover);
    }
    if (this.page.icon && this.page.icon.type !== "emoji") {
      await this.downloadImage("icon", {...this.page.icon, caption: null});
    }

    const content = this.generateFrontMatter() + this.generateContent();

    await fs.promises.writeFile(`${this.page.filepath}/index.md`, content);
  }

}