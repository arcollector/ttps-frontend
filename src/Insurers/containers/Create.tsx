import React from 'react';
import { Form } from '../components/Form';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { useHistory } from 'react-router-dom';

import { Insurer } from '../interfaces';
import * as actions from '../actions'

export function Create() {
  const history = useHistory();

  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ errors, setErrros ] = React.useState<string[]>([]);

  const onSubmitError = (errors: string[]) => {
    setErrros(errors);
  };

  const onSubmit = React.useCallback(async (formData: Insurer) => {
    setErrros([]);
    setIsLoading(true);
    const success = await actions.createInsurer(formData);
    if (success) {
      history.replace('/obra-sociales');
    }
    setIsLoading(false); 
  }, [history]);

  return (
    <div className="ui segment">
      <h1>
        Crear obra social
      </h1>

      <ErrorMessage
        heading="No se pudo crear la obra social"
        errors={errors}
      />

      <Form
        onSubmitError={onSubmitError}
        onSubmit={onSubmit}
        isLoading={isLoading}
        buttonText="Crear obra social"
      />
    </div>
  );
}
