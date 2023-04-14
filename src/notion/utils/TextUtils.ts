import {NotionIcon, NotionImageFile, NotionRichText} from "../types/NotionTypes";

export function escape(str: string) {
  return str.replaceAll(/"/g, '\\"');
}

export function imageUrl(image: NotionImageFile) {
  if (!image) return null;
  return image.type === "external" ? image.external.url : image.file.url;
}

export function icon(icon: NotionIcon) {
  if (!icon) return null;
  return icon.type === "emoji" ? icon.emoji : imageUrl({...icon, caption: null});
}

export function plaintext(blocks: NotionRichText[]): string {
  return `${blocks.map(block => block.plain_text).join("")}`;
}