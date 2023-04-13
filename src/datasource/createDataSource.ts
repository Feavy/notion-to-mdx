import DataSourceProps from "./DataSourceProps";
import DatabaseSource from "./DatabaseSource";

export default function createDataSource(props: DataSourceProps) {
  switch (props.type) {
    case "database":
      return new DatabaseSource(props);
    case "page":
      return null;
  }
}
