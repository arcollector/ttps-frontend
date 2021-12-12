import React from "react";
import { Form } from "../components/Form";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import { useHistory } from "react-router-dom";

import { Patient } from "../interfaces";
import { Tutor } from "../../Tutors";
import * as actions from "../actions";

export function Create() {
  const history = useHistory();

  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrros] = React.useState<string[]>([]);

  const onSubmitError = (errors: string[]) => {
    setErrros(errors);
  };

  const onSubmit = React.useCallback(
    async (formData: Patient, formDataTutor?: Tutor) => {
      setErrros([]);
      setIsLoading(true);
      const success = await actions.createPatient(formData, formDataTutor);
      if (success) {
        history.replace("/pacientes");
      }
      setIsLoading(false);
    },
    [history]
  );

  return (
    <div className="ui segment">
      <h1>Crear paciente</h1>

      <ErrorMessage heading="No se pudo crear el paciente" errors={errors} />

      <Form
        onSubmitError={onSubmitError}
        onSubmit={onSubmit}
        isLoading={isLoading}
        buttonText="Crear paciente"
      />
    </div>
  );
}
