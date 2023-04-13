import PagesManager from "./pages/PagesManager";
import DataSourceProps from "./datasource/DataSourceProps";
import toMap from "./utils/toMap";

export default function generateNotionPages(sources: DataSourceProps[]) {
    const pages = new PagesManager(sources);

    (async () => {
        await pages.fetchPages();
        const {notionPages, localPages} = pages;

        const promises: Promise<any>[] = [];

        const localPagesById = toMap(localPages, "id");
        const notionPagesById = toMap(notionPages, "id");

        for (const [_, notion] of notionPagesById) {
            if (!localPagesById.has(notion.id)) {
                const p = pages.generatePage(notion);
                promises.push(p);
                console.log("CREATE page: " + notion.slug);
                continue;
            }

            const local = localPagesById.get(notion.id)!;

            if (pages.hasUpdate(local, notion)) {
                console.log("UPDATE page: " + notion.slug);
                const p = pages.deletePage(local)
                            .then(() => pages.generatePage(notion));
                promises.push(p);
                continue;
            }
            console.log("UNCHANGED page: " + notion.slug);
        }

        for (const [id, local] of localPagesById) {
            if (!notionPagesById.has(id)) {
                console.log("DELETE page: " + local.slug);
                const p = pages.deletePage(local);
                promises.push(p);
            }
        }

        await Promise.all(promises);

        pages.saveCache();

        console.log("DONE");
    })();
};