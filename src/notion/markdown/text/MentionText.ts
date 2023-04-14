import {NotionRichText} from "../../types/NotionTypes";
import {icon} from "../../utils/TextUtils";
import LoadedPages from "../../../LoadedPages";
import notionPages = LoadedPages.notionPages;

export type NotionMention = Extract<NotionRichText, { type: 'mention' }>;

export default class MentionText {
  private readonly mention: NotionMention["mention"];
  constructor(private readonly block: NotionMention) {
    this.mention = block.mention;
  }

  public toMarkdown(): string {
    switch (this.block.mention.type) {
      case "page":
        return this.pageMentionToMarkdown();
      default:
        return "";
    }
  }

  private pageMentionToMarkdown() {
    const mention = this.block.mention as Extract<NotionMention["mention"], { type: "page" }>;

    const page = notionPages.get(mention.page.id)
    if (!page) {
      return "";
    }

    let text: string;

    if (page.icon.type === "emoji" && page.icon.emoji) {
      text = `${icon(page.icon)} ${page.title}`;
    } else {
      text = page.title;
    }

    return `<PageMention caption="${escape(text)}" url="${page.source.basePath}/${page.slug}"/>`;
  }
}
