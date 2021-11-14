import React from 'react';
import DatePicker, { DatePickerProps } from "react-widgets/DatePicker";
import { Form } from 'semantic-ui-react';
import moment from 'moment';
moment.locale('es');

type Props = {
  label: string,
  name: string,
  placeholder: string,
  onChange: (name: string, value: string) => any,
  value: string,
  disabled?: boolean,
  required?: boolean,
};

export function FormDatePicker(props: Props) {
  const fromStringToDate = (value: string) => {
    const d = moment(value, 'DD/MM/YYYY');
    return d.isValid() ? d.toDate() : null;
  };
  const [ valueAsDate, setValueAsDate ] = React.useState(fromStringToDate(props.value));

  React.useEffect(() => {
    setValueAsDate(fromStringToDate(props.value));
  }, [props.value]);

  const handleDateChange: DatePickerProps['onChange'] = (e) => {
    if (e instanceof Date) {
      const dateFormatted = moment(e).format('DD/MM/YYYY');
      props.onChange(props.name, dateFormatted);
    }
  }

  return (
    <Form.Field
      data-testid={props.name}
      required={props.required}
      style={{ minHeight: 80 }}
    >
      <label htmlFor={props.name}>
        {props.label}
      </label>
      <DatePicker
        name={props.name}
        onChange={handleDateChange}
        value={valueAsDate}
        placeholder={props.placeholder}
        disabled={props.disabled}
      />
    </Form.Field>
  );
}
