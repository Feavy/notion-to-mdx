import type DataSource from "../datasource/DataSource";

export default interface Page {
  id: string;
  slug: string;
  last_edited_time: string;
  source: DataSource;
}