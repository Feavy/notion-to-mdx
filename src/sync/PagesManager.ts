import NotionPage from "../notion/blocks/NotionPage";
import DataSourceProps from "../datasource/DataSourceProps";
import Page from "../model/Page";
import fs from "fs";
import createDataSource from "../datasource/createDataSource";
import DataSource from "../datasource/DataSource";
import {toMultimap} from "../utils/toMap";
import NotionMarkdownGenerator from "../notion/NotionMarkdownGenerator";

namespace PagesManager {
  const CACHE_FILE = "notion_cache.json";

  let dataSources: DataSource[] = [];
  export const notionPages: Map<string, NotionPage> = new Map();
  export const localPages: Map<string, Page> = new Map();

  export async function loadPages(sources: DataSourceProps[]) {
    dataSources = sources.map(source => createDataSource(source));

    loadCachedPages();

    await loadNotionPages();
  }

  export function hasUpdate(localPage: Page, remotePage: NotionPage) {
    return localPage.last_edited_time !== remotePage.last_edited_time;
  }

  export async function generatePage(page: NotionPage) {
    await page.fetchChildrenBlocks();
    await new NotionMarkdownGenerator(page).generate();
  }

  export function deletePage(page: Page) {
    const path = page.source.outputDir + "/" + page.slug + "/";
    return new Promise(resolve => fs.rm(path, {recursive: true, force: true}, resolve));
  }

  export function saveCache() {
    const save: any = {};

    const pagesByDataSource = toMultimap([...notionPages.values()], "source");

    for (const [source, pages] of pagesByDataSource) {
      save[source.id] = pages.map(page => page.toJSON());
    }

    fs.writeFileSync("notion_cache.json", JSON.stringify(save, null, 2));
  }

  function loadCachedPages() {
    let cacheByDataSourceId: { [key: string]: Page[] } = {};

    if (fs.existsSync(CACHE_FILE)) {
      cacheByDataSourceId = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }

    for (const dataSource of dataSources) {
      if (!cacheByDataSourceId[dataSource.id]) continue;

      const cachedPages = cacheByDataSourceId[dataSource.id]
          .filter(page => fs.existsSync(page.source.outputDir + "/" + page.slug + "/index.md"));

      dataSource.cachedPages.push(...cachedPages);

      for (const page of cachedPages) {
        localPages.set(page.id, page);
      }
    }
  }

  async function loadNotionPages() {
    const pages = (await Promise.all(dataSources.map(dataSource => dataSource.fetchPages()))).flat();

    for (const page of pages) {
      notionPages.set(page.id, page);
    }
  }
}

export default PagesManager;