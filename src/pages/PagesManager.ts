import fs from "fs";
import NotionMarkdownGenerator from "../notion/NotionMarkdownGenerator";
import NotionPage from "../notion/blocks/NotionPage";
import DataSource from "../datasource/DataSource";
import Page from "../model/Page";
import DataSourceProps from "../datasource/DataSourceProps";
import createDataSource from "../datasource/createDataSource";
import TextFormatter from "../notion/TextFormatter";
import toMap from "../utils/toMap";

export default class PagesManager {
  private readonly dataSources: DataSource[];

  public readonly localPages: Page[] = [];
  public readonly notionPages: NotionPage[] = [];

  constructor(sources: DataSourceProps[]) {
    let cacheByDataSourceId: { [key: string]: Page[] };
    if (fs.existsSync("notion_cache.json")) {
      cacheByDataSourceId = JSON.parse(fs.readFileSync("notion_cache.json", "utf-8"));
    } else {
      cacheByDataSourceId = {};
    }
    this.dataSources = sources.map(source => createDataSource(source, cacheByDataSourceId[source.id] || []));
  }

  public async fetchPages() {
    await Promise.all(this.dataSources.map(dataSource => dataSource.fetchPages()));

    const localPages = this.dataSources.map(dataSource => dataSource.cachedPages).flat()
        .filter(page => fs.existsSync(page.source.outputDir + "/" + page.slug + "/index.md"));

    const notionPages = this.dataSources.map(dataSource => dataSource.pages).flat();
    this.localPages.push(...localPages);
    this.notionPages.push(...notionPages);
  }

  public hasUpdate(localPage: Page, remotePage: NotionPage) {
    return localPage.last_edited_time !== remotePage.last_edited_time;
  }

  public async generatePage(page: NotionPage) {
    await page.fetchChildrenBlocks();
    await new NotionMarkdownGenerator(page).generate(new TextFormatter(this.notionPages));
  }

  public deletePage(page: Page) {
    const path = page.source.outputDir + "/" + page.slug + "/";
    return new Promise(resolve => fs.rm(path, {recursive: true, force: true}, resolve));
  }

  public saveCache() {
    const save: any = {};
    for(const dataSource of this.dataSources) {
      save[dataSource.id] = dataSource.pages.map(page => page.toJSON());
    }
    fs.writeFileSync("notion_cache.json", JSON.stringify(save, null, 2));
  }
}