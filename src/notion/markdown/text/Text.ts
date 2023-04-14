import {NotionRichText} from "../../types/NotionTypes";
import LoadedPages from "../../../LoadedPages";
import notionPages = LoadedPages.notionPages;

export default class Text {
  constructor(private readonly block: NotionRichText) {
  }

  public toMarkdown(text: string = this.block.plain_text): string {
    const block = this.block;

    if (block.href) {
      text = this.hrefToMarkdown(text);
    }

    if (block.annotations.bold)
      text = `**${text}**`;
    if (block.annotations.italic)
      text = `*${text}*`;
    if (block.annotations.code)
      text = `\`${text}\``;
    if (block.annotations.strikethrough)
      text = `~~${text}~~`;
    if (block.type === "equation")
      text = `$${text}$`;

    return text;
  }

  private hrefToMarkdown(text: string) {
    const block = this.block;

    if (block.href.startsWith("https://www.notion.so/") || block.href.startsWith("/")) {
      const id = block.href.substring(block.href.length - 32, block.href.length);
      const page = notionPages.get(id);
      text = page ? `[${text}](${page.source.basePath}/${page.slug})` : `[${text}](${block.href})`;
    } else {
      text = `[${text}](${block.href})`;
    }

    return text;
  }
}