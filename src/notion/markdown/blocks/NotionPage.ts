import AbstractBlock from "./AbstractBlock";
import {plaintext} from "../../utils/TextUtils";
import Page from "../../../model/Page";
import {NotionIcon, NotionImageFile} from "../../types/NotionTypes";
import toSlug from "../../../utils/toSlug";
import NotionSource from "../../source/NotionSource";
import {PAGE_VERSION} from "../../../Config";

export default class NotionPage extends AbstractBlock implements Page {
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  properties: { [key: string]: any };
  slug: string;
  title: string;
  tags: string[];
  icon?: NotionIcon;
  cover?: NotionImageFile;
  filepath: string;

  public constructor(page: any, public readonly source: NotionSource) {
    super(page, [])
    Object.assign(this, page);

    this.title = plaintext(this.properties.Name.title);
    if (this.properties.slug?.rich_text.length > 0) {
      this.slug = plaintext(this.properties.slug.rich_text);
    } else {
      this.slug = toSlug(this.title);
    }
    if (this.properties.tags?.multi_select) {
      this.tags = this.properties.tags.multi_select.map(select => select.name);
    } else {
      this.tags = [];
    }

    if (this.properties.created_date.date) {
      this.created_time = this.properties.created_date.date.start;
    }

    this.filepath = `${this.source.outputDir}/${this.slug}`;
  }

  public set blocks(blocks: AbstractBlock[]) {
    this.children.push(...blocks);
  }

  public get blocks() {
    return this.children;
  }

  public toMarkdown() {
    return this.childrenToMarkdown();
  }

  public async fetchBlocks() {
    this.blocks = await this.source.fetchBlocks(this.id);
  }

  public toJSON(): Omit<Page, "source"> {
    return {
      id: this.id,
      last_edited_time: this.last_edited_time,
      slug: this.slug,
      version: PAGE_VERSION,
    }
  }
};