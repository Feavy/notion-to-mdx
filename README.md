# notion-to-mdx [WIP]

Generate MarkdownX articles from Notion pages.

This project aims to synchronize remote pages on Notion with local MarkdownX files:

- Each page found in a Notion database is converted into a MarkdownX file.
- Images are downloaded and stored locally.
- Links to Notion pages are replaced with links to the generated MarkdownX files.

It was mainly designed so that the generated files can be processed by the [mdx](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/) plugin of [Gatsby](https://www.gatsbyjs.com/) to generate blog content. Of course, it can be used for any other purpose.

## Roadmap

- [x] Synchronize pages from a Notion database with MarkdownX files.
- [x] Download images and store them locally.
- [x] Replace links to Notion pages with links to the generated MarkdownX files.
- [ ] Default implementation for `TableOfContents`, `PageMention`, `LinkPreview`, etc.
- [ ] Notion source: wiki.
- [ ] Source: page.
- [ ] Support the `child_page` block.
- [ ] Documentation.
- [ ] Getting started.

## Usage

```js
import synchronizeNotionPages from "notion-to-mdx";

synchronizeNotionPages([
  {
    notionToken: "<your-notion-token>",
    type: "database",
    id: "<database-id>",
    outputDir: "./output/pages",
    basePath: "/pages"
  }
]);
```

## API

### `synchronizeNotionPages(sources: NotionSource[])`

Synchronizes Notion pages with MarkdownX files.

### `NotionSource`

```ts
interface NotionSource {
  notionToken: string;
  type: "database" | "page" | "wiki";
  id: string;
  outputDir: string;
  basePath: string;
}
```