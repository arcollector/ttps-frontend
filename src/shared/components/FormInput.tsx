import React from "react";
import * as yup from "yup";
import { Form, Input, InputOnChangeData } from "semantic-ui-react";

type Props = {
  label: string;
  name: string;
  placeholder: string;
  type: string;
  onChange: (name: string, value: string) => any;
  value: string;
  disabled?: boolean;
  validator?: yup.AnySchema;
  required?: boolean;
};

export function FormInput(props: Props) {
  const [isError, setIsError] = React.useState(false);
  const [errorsMessage, setErrorsMessage] = React.useState<string[]>([]);

  const { onChange, validator } = props;
  const onFormInputChange = React.useCallback(
    (_, data: InputOnChangeData) => {
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
      onChange(props.name, data.value);
    },
    [onChange, validator, props.name]
  );

  return (
    <Form.Field
      data-testid={props.name}
      error={isError}
      required={props.required}
      style={{ minHeight: 80 }}
    >
      <label htmlFor={props.name}>{props.label}</label>
      <Input
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        onChange={onFormInputChange}
        type={props.type}
        value={props.value}
        disabled={props.disabled}
      />
      {errorsMessage.map((errorMessage, i) => (
        <small key={i}>
          <strong>{errorMessage}</strong>
        </small>
      ))}
    </Form.Field>
  );
}
