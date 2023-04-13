import DataSourceProps from "./DataSourceProps";
import DatabaseSource from "./DatabaseSource";
import Page from "../model/Page";

export default function createDataSource(props: DataSourceProps, cache: Page[]) {
  switch (props.type) {
    case "database":
      return new DatabaseSource(props, cache);
    case "page":
      return null;
  }
}
