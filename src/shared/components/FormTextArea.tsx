import React from "react";
import * as yup from "yup";
import { Form, TextArea, TextAreaProps } from "semantic-ui-react";

type Props = {
  label: string;
  name: string;
  placeholder: string;
  onChange: (name: string, value: string) => any;
  value: string;
  disabled?: boolean;
  validator?: yup.AnySchema;
  required?: boolean;
};

export function FormTextArea(props: Props) {
  const [isError, setIsError] = React.useState(false);
  const [errorsMessage, setErrorsMessage] = React.useState<string[]>([]);

  const { onChange, validator, name } = props;
  const onFormTextAreaChange = React.useCallback(
    (_, data: TextAreaProps) => {
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
      onChange(name, typeof data.value === "string" ? data.value : "");
    },
    [onChange, validator, name]
  );

  return (
    <Form.Field
      data-testid={props.name}
      error={isError}
      required={props.required}
      style={{ minHeight: 150 }}
    >
      <label htmlFor={props.name}>{props.label}</label>
      <TextArea
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        onChange={onFormTextAreaChange}
        value={props.value}
        disabled={props.disabled}
        rows={5}
      />
      {errorsMessage.map((errorMessage, i) => (
        <small key={i}>
          <strong>{errorMessage}</strong>
        </small>
      ))}
    </Form.Field>
  );
}
