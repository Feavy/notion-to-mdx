import NotionPage from "../notion/blocks/NotionPage";
import {Client} from "@notionhq/client";
import AbstractBlock from "../notion/blocks/AbstractBlock";
import {NotionBlock} from "../notion/NotionTypes";
import Blocks from "../notion/blocks/Blocks";
import DataSourceProps from "./DataSourceProps";
import Page from "../model/Page";

export default abstract class DataSource {
  protected readonly notion: Client;
  public readonly id: string;
  public readonly type: "database" | "page";
  public readonly outputDir: string;
  public readonly basePath: string;
  public readonly cachedPages: Page[] = [];
  protected constructor(props: DataSourceProps) {
    this.notion = new Client({ auth: props.notionToken });
    this.id = props.id;
    this.type = props.type;
    this.outputDir = props.outputDir;
    this.basePath = props.basePath;
  }

  public abstract fetchPages(): Promise<NotionPage[]>;

  public async fetchChildrenBlocks(block_id: string): Promise<AbstractBlock[]> {
    let response = await this.notion.blocks.children.list({block_id: block_id, page_size: 100});
    const blocks: NotionBlock[] = response.results.filter(block => "type" in block) as NotionBlock[];
    while(response.has_more) {
      response = await this.notion.blocks.children.list({block_id: block_id, page_size: 100, start_cursor: response.next_cursor});
      blocks.push(...response.results.filter(block => "type" in block) as NotionBlock[]);
    }
    return Promise.all(
        blocks.map(
            async (block): Promise<AbstractBlock> => Blocks.create(block, block.has_children ? await this.fetchChildrenBlocks(block.id) : [])
        )
    );
  }
}