import {Client} from "@notionhq/client";
import NotionSourceProps from "./NotionSourceProps";
import NotionPage from "../markdown/blocks/NotionPage";
import AbstractBlock from "../markdown/blocks/AbstractBlock";
import {NotionBlock} from "../types/NotionTypes";
import Blocks from "../markdown/blocks/Blocks";

export default abstract class NotionSource {
  protected readonly notion: Client;
  public readonly id: string;
  public readonly type: "database" | "page";
  public readonly outputDir: string;
  public readonly basePath: string;
  protected constructor(props: NotionSourceProps) {
    this.notion = new Client({ auth: props.notionToken });
    this.id = props.id;
    this.type = props.type;
    this.outputDir = props.outputDir;
    this.basePath = props.basePath;
  }

  public abstract fetchPages(): Promise<NotionPage[]>;

  public async fetchBlocks(parentBlockId: string): Promise<AbstractBlock[]> {
    let response = await this.notion.blocks.children.list({block_id: parentBlockId, page_size: 100});
    const blocks: NotionBlock[] = response.results.filter(block => "type" in block) as NotionBlock[];
    while(response.has_more) {
      response = await this.notion.blocks.children.list({block_id: parentBlockId, page_size: 100, start_cursor: response.next_cursor});
      blocks.push(...response.results.filter(block => "type" in block) as NotionBlock[]);
    }
    return Promise.all(
        blocks.map(
            async (block): Promise<AbstractBlock> => Blocks.create(block, block.has_children ? await this.fetchBlocks(block.id) : [])
        )
    );
  }
}