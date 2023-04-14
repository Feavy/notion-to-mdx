import fs from "fs";
import Page from "./model/Page";
import {toMultimap} from "./utils/toMap";
import NotionPage from "./notion/markdown/blocks/NotionPage";
import NotionMarkdownGenerator from "./notion/markdown/NotionMarkdownGenerator";
import NotionSource from "./notion/source/NotionSource";
import NotionSourceProps from "./notion/source/NotionSourceProps";
import createNotionSource from "./notion/source/createNotionSource";
import LoadedPages from "./LoadedPages";

namespace PagesManager {
  import notionPages = LoadedPages.notionPages;
  import localPages = LoadedPages.localPages;

  const CACHE_FILE = "notion_cache.json";

  let notionSources: NotionSource[] = [];
  export async function loadPages(sources: NotionSourceProps[]) {
    notionSources = sources.map(source => createNotionSource(source));

    const cachedPagePromise = loadCachedPages();

    const notionPagePromise = loadNotionPages();

    await Promise.all([cachedPagePromise, notionPagePromise]);
  }

  export function hasUpdate(localPage: Page, remotePage: NotionPage) {
    return localPage.last_edited_time !== remotePage.last_edited_time;
  }

  export async function generatePage(page: NotionPage) {
    await page.fetchBlocks();
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

  async function loadCachedPages() {
    let cacheByDataSourceId: { [key: string]: Page[] } = {};

    if (fs.existsSync(CACHE_FILE)) {
      cacheByDataSourceId = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    }

    const promises: Promise<any>[] = [];
    const cachedPages: Page[] = [];

    for (const dataSource of notionSources) {
      if (!cacheByDataSourceId[dataSource.id]) continue;

      const cachedPagesInDataSource = cacheByDataSourceId[dataSource.id];

      // Ensure the markdown page is still present in the file system
      for (const page of cachedPagesInDataSource) {
        page.source = dataSource;
        promises.push(checkFileExists(page.source.outputDir + "/" + page.slug + "/index.md").then(exists => {
          if (exists) {
            cachedPages.push(page);
          }
        }));
      }
    }

    await Promise.all(promises);

    for (const page of cachedPages) {
      localPages.set(page.id, page);
    }
  }

  async function loadNotionPages() {
    const pages = (await Promise.all(notionSources.map(dataSource => dataSource.fetchPages()))).flat()
        .filter(page => !page.slug.toLowerCase().startsWith("draft"));

    for (const page of pages) {
      notionPages.set(page.id, page);
    }
  }

  function checkFileExists(file) {
    return fs.promises.access(file, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)
  }
}

export default PagesManager;