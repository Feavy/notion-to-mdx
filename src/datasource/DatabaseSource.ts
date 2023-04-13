import DataSourceProps from "./DataSourceProps";
import DataSource from "./DataSource";
import NotionPage from "../notion/blocks/NotionPage";

export default class DatabaseSource extends DataSource {
  public readonly type = "database";

  constructor(private readonly props: DataSourceProps) {
    super(props);
  }

  public async fetchPages(): Promise<NotionPage[]> {
    const response = await this.notion.databases.query({database_id: this.id});
    return response.results.map(result => new NotionPage(result, this));
  }
}