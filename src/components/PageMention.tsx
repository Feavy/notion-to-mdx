import * as React from "react"

// markup
const PageMention: React.FC<{caption: string, url: string}> = ({caption, url}) => {
  return (
      <span className={"page-mention"}>
        <a href={url}>{caption}</a>
      </span>
  );
}

export default PageMention;
