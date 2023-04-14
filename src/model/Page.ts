import NotionSource from "../notion/source/NotionSource";

export default interface Page {
  id: string;
  slug: string;
  last_edited_time: string;
  source: NotionSource;
}