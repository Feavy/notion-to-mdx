import {Client} from "@notionhq/client";

export type NotionBlock = Extract<Awaited<ReturnType<Client['blocks']['retrieve']>>, { type: string }>;
export type NotionImageFile = Extract<NotionBlock, { type: 'image' }>["image"] & { width?: number, height?: number };
export type NotionImage = Extract<NotionBlock, { type: 'image' }> & { image: NotionImageFile };
export type NotionIcon = Extract<Awaited<ReturnType<Client['databases']['query']>>['results'][number], { properties }>['icon'];

export type NotionRichText = Extract<NotionBlock, { type: 'paragraph' }>['paragraph']['rich_text'][number];
