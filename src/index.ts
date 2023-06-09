import PagesManager from "./PagesManager";
import generatePage = PagesManager.generatePage;
import deletePage = PagesManager.deletePage;
import hasUpdate = PagesManager.hasUpdate;
import saveCache = PagesManager.saveCache;
import loadPages = PagesManager.loadPages;

import LoadedPages from "./LoadedPages";
import notionPages = LoadedPages.notionPages;
import localPages = LoadedPages.localPages;

import NotionSourceProps from "./notion/source/NotionSourceProps";
import {PAGE_VERSION} from "./Config";

console.log(`notion-to-mdx page_version=${PAGE_VERSION}`);

export default function synchronizeNotionPages(sources: NotionSourceProps[]) {
    (async () => {
        await loadPages(sources);

        const promises: Promise<any>[] = [];

        for (const [_, notion] of notionPages) {
            if (!localPages.has(notion.id)) {
                const p = generatePage(notion);
                promises.push(p);
                console.log("CREATE page: " + notion.slug);
                continue;
            }

            const local = localPages.get(notion.id)!;

            if (hasUpdate(local, notion)) {
                console.log("UPDATE page: " + notion.slug);
                const p = deletePage(local)
                            .then(() => generatePage(notion));
                promises.push(p);
                continue;
            }
            console.log("UNCHANGED page: " + notion.slug);
        }

        for (const [id, local] of localPages) {
            if (!notionPages.has(id)) {
                console.log("DELETE page: " + local.slug);
                const p = deletePage(local);
                promises.push(p);
            }
        }

        await Promise.all(promises);

        saveCache();

        console.log("DONE");
    })();
};