import React from "react";
import * as yup from "yup";
import { Form, Dropdown, DropdownProps, Checkbox } from "semantic-ui-react";

export type Item = {
  key: string;
  value: string;
  text: string;
};

type Props = {
  label: string;
  name: string;
  placeholder: string;
  onChange: (name: string, item: Item | null) => any;
  value: string;
  values: Item[];
  disabled?: boolean;
  validator?: yup.AnySchema;
  required?: boolean;
  nullyfiedText: string;
};

export function FormDropdown(props: Props) {
  const [isError, setIsError] = React.useState(false);
  const [errorsMessage, setErrorsMessage] = React.useState<string[]>([]);

  const { onChange, validator, name, values } = props;
  const onFormDropdownChange = React.useCallback(
    (_, data: DropdownProps) => {
      if (validator) {
        try {
          validator.validateSync(data.value);
          setIsError(false);
          setErrorsMessage([]);
        } catch (e) {
          setIsError(true);
          setErrorsMessage((e as yup.ValidationError).errors);
        }
      }
      const found = values.find(({ value }) => value === data.value);
      setIsNullified(false);
      if (found) {
        onChange(name, found);
      }
    },
    [onChange, validator, values, name]
  );

  const [isNullified, setIsNullified] = React.useState(false);
  const onNullifyValue = () => {
    setIsNullified(true);
    props.onChange(props.name, null);
  };

  return (
    <Form.Field
      error={isError}
      required={props.required}
      style={{ minHeight: 100 }}
    >
      <label htmlFor={props.name}>{props.label}</label>
      <Dropdown
        data-testid={props.name}
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        onChange={onFormDropdownChange}
        disabled={props.disabled}
        options={props.values}
        value={props.value}
        fluid
        search
        selection
      />
      <Checkbox
        label={props.nullyfiedText}
        onClick={onNullifyValue}
        checked={isNullified}
      />
      {errorsMessage.map((errorMessage, i) => (
        <small key={i}>
          <strong>{errorMessage}</strong>
        </small>
      ))}
    </Form.Field>
  );
}
