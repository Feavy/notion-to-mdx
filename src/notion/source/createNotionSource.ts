import NotionSourceProps from "./NotionSourceProps";
import DatabaseSource from "./DatabaseSource";

export default function createNotionSource(props: NotionSourceProps) {
  switch (props.type) {
    case "database":
      return new DatabaseSource(props);
    case "page":
      return null;
  }
}
