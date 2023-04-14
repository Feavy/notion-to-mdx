import * as React from "react"

interface TOC {
  title?: string;
  url?: string;
  items: TOC[];
}

function generateTOC(toc: TOC, prefix: string = "") {
  if(!toc.items) {
    return undefined;
  }
  return (
      <ol>
        {toc.items.map((item, i) => (
            <li key={item.title}>
              <a href={item.url}><span className="index">{prefix+(i+1)}</span> {item.title}</a>
              {generateTOC(item, prefix+(i+1)+".")}
            </li>
        ))}
      </ol>
  );
}

const TableOfContents: React.FC<{ data: { tableOfContents: any } }> & {title: string} = (({data: {tableOfContents}}) => {
  return (
      <div className="table-of-contents">
        <p>{TableOfContents.title}</p>
        {generateTOC(tableOfContents)}
      </div>
  );
}) as any;

TableOfContents.title = "Table of contents";

export default TableOfContents;
