import NotionSourceProps from "./NotionSourceProps";
import NotionSource from "./NotionSource";
import NotionPage from "../markdown/blocks/NotionPage";

export default class DatabaseSource extends NotionSource {
  public readonly type = "database";

  constructor(private readonly props: NotionSourceProps) {
    super(props);
  }

  public async fetchPages(): Promise<NotionPage[]> {
    const response = await this.notion.databases.query({database_id: this.id});
    return response.results.map(result => new NotionPage(result, this));
  }
}