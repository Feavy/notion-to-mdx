import DataSourceProps from "./DataSourceProps";
import DataSource from "./DataSource";
import NotionPage from "../notion/blocks/NotionPage";
import Page from "../model/Page";

export default class DatabaseSource extends DataSource {
  public readonly type = "database";

  constructor(private readonly props: DataSourceProps, public readonly cachedPages: Page[]) {
    super(props);

    for(const page of this.cachedPages)
      page.source = this;
  }

  public async fetchPages(): Promise<void> {
    const response = await this.notion.databases.query({database_id: this.id});
    const notionPages = response.results.map(result => new NotionPage(result, this))
        .filter(page => !page.slug.toLowerCase().startsWith("draft"));

    this.pages.push(...notionPages);
  }
}