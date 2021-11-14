import React from 'react';
import * as SemanticUi from 'semantic-ui-react';
import * as yup from 'yup';

import { FormTextArea } from '../../shared/components/FormTextArea';
import { Insurer, emptyInsurer } from '../interfaces/types';
import { validators, schema } from '../interfaces';

type Props = {
  values?: Insurer,
  onSubmitError: (errors: string[]) => any,
  onSubmit: (values: Insurer) => any,
  isLoading: boolean,
  buttonText: string,
};

export function Form(props: Props) {
  const [ formData, setFormData ] = React.useState<Insurer>(props.values || emptyInsurer);

  React.useEffect(() => {
    if (props.values) {
      setFormData(props.values);
    }
  }, [props.values]);

  const onChange = (name: string, value: string) => {
    setFormData((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = React.useCallback(() => {
    if (props.isLoading) {
      return;
    }
    try {
      schema.validateSync(formData, { abortEarly: false });
      props.onSubmit(formData);
    } catch (e) {
      props.onSubmitError((e as yup.ValidationError).errors);
      return;
    }
  }, [
    formData,
    props.onSubmitError,
    props.onSubmit
  ]);

  return (
    <SemanticUi.Form
      data-testid="form"
      onSubmit={onSubmit}
    >
      <FormTextArea
        label="Nombre de la obra social"
        name="nombre"
        placeholder="Obra social nombre"
        onChange={onChange}
        value={formData.nombre}
        validator={validators.nombre}
        required
      />

      <SemanticUi.Button
        className="primary"
        type="submit"
        loading={props.isLoading}
      >
        {props.buttonText}
      </SemanticUi.Button>
    </SemanticUi.Form>
  );
}
