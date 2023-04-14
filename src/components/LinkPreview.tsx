import * as React from "react"

// markup
const LinkPreview: React.FC<{caption: string, url: string}> = ({caption, url}) => {
  return (
      <div className={"link-preview"}>
        <a href={url}>{url}</a>
      </div>
  );
}

export default LinkPreview;
