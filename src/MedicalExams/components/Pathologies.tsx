import React from "react";
import { FormDropdown, Item } from "../../shared/components/FormDropdown";

import pathologies from "../assets/pathologies.json";
const items: Item[] = pathologies.map((pathology, i) => ({
  key: i.toString(),
  value: pathology,
  text: pathology,
}));

type Props = {
  onChange: (pathology: string) => any;
};

export function Pathologies(props: Props) {
  const [pathology, setPathology] = React.useState("");
  const onChangePathalogy = (_: string, item: Item | null) => {
    item && setPathology(item.value);
  };

  React.useEffect(() => {
    props.onChange(pathology);
  }, [pathology]);

  return (
    <FormDropdown
      label=""
      name="idInsurer"
      placeholder="Obra social del paciente"
      onChange={onChangePathalogy}
      value={pathology}
      values={items}
    />
  );
}
