import {NotionIcon, NotionImageFile, NotionRichText} from "./NotionTypes";
import NotionSynchronizer from "../sync/NotionSynchronizer";
import notionPages = NotionSynchronizer.notionPages;

function escape(str: string) {
  return str.replaceAll(/"/g, '\\"');
}

function text(block: NotionRichText): string {
  let text = block.plain_text;
  if (block.type === "equation")
    text = block.equation.expression;

  if (block.type === "mention" && block.mention.type === "page") {
    const page = notionPages.get(block.mention.page.id)
    if (page) {
      if (page.icon.type === "emoji" && page.icon.emoji) {
        text = `${icon(page.icon)} ${page.title}`;
      } else {
        text = page.title;
      }
      return `<PageMention caption="${escape(text)}" url="${page.source.basePath}/${page.slug}"/>`;
    }
  }

  if (block.href) {
    if (block.href.startsWith("https://www.notion.so/") || block.href.startsWith("/")) {
      const id = block.href.substring(block.href.length - 32, block.href.length);
      const page = notionPages.get(id);
      text = page ? `[${text}](${page.source.basePath}/${page.slug})` : `[${text}](${block.href})`;
    } else {
      text = `[${text}](${block.href})`;
    }
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

export function texts(blocks: NotionRichText[]): string {
  return `${blocks.map(block => text(block)).join("")}`;
}

export function linkToPage(page_id: string) {
  const page = notionPages.get(page_id);
  if (page) {
    return `[${page.title}](${page.source.basePath}/${page.slug})\n`;
  } else {
    return `Page not found ${page_id}\n`;
  }
}

export function imageUrl(image: NotionImageFile) {
  if (!image) return null;
  return image.type === "external" ? image.external.url : image.file.url;
}

export function icon(icon: NotionIcon) {
  if (!icon) return null;
  return icon.type === "emoji" ? icon.emoji : imageUrl({...icon, caption: null});
}

function plaintext(block: NotionRichText): string {
  return block.plain_text;
}

export function plaintexts(blocks: NotionRichText[], indent = ""): string {
  return `${indent}${blocks.map(plaintext).join("")}`;
}