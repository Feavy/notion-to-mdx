import DataSourceProps from "./datasource/DataSourceProps";
import PagesManager from "./sync/PagesManager";
import notionPages = PagesManager.notionPages;
import localPages = PagesManager.localPages;
import generatePage = PagesManager.generatePage;
import deletePage = PagesManager.deletePage;
import hasUpdate = PagesManager.hasUpdate;
import saveCache = PagesManager.saveCache;
import loadNotionSources = PagesManager.loadNotionSources;

export default function synchronizeNotionPages(sources: DataSourceProps[]) {
    (async () => {
        await loadNotionSources(sources);

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