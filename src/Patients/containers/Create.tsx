import React from "react";
import { Form } from "../components/Form";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import { useHistory } from "react-router-dom";

import { Patient } from "../interfaces";
import { Tutor } from "../../Tutors";
import * as actions from "../actions";
import { actions as authActions } from "../../Auth";

type Props = {
  isGuestMode: boolean;
};

export function Create(props: Props) {
  const history = useHistory();

  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrros] = React.useState<string[]>([]);
  const title = props.isGuestMode ? "Formulario de registro" : "Crear paciente";

  const onSubmitError = (errors: string[]) => {
    setErrros(errors);
  };

  const onSubmit = React.useCallback(
    async (formData: Patient, formDataTutor?: Tutor) => {
      setErrros([]);
      setIsLoading(true);
      const idPatient = await actions.createPatient(formData, formDataTutor);
      if (idPatient) {
        if (props.isGuestMode) {
          history.replace("/registro-clave", { ...formData, id: idPatient });
        } else {
          let success = await authActions.registerFirebaseAuth(
            formData.email,
            "123456",
            "Se ha enviado un correo a la cuenta de email especificada para este paciente, para que active su cuenta con password 123456"
          );
          if (success) {
            success = await authActions.createUser({
              id: "",
              email: formData.email,
              username: formData.dni,
              pass: "123456",
              role: "patient",
              idPatient,
            });
            if (success) {
              history.replace("/pacientes");
            }
          }
        }
      }
      setIsLoading(false);
    },
    [history, props.isGuestMode]
  );

  return (
    <div className="ui segment">
      <h1>{title}</h1>

      <ErrorMessage heading="No se pudo crear el paciente" errors={errors} />

      <Form
        onSubmitError={onSubmitError}
        onSubmit={onSubmit}
        isLoading={isLoading}
        buttonText={title}
        isGuestMode={props.isGuestMode}
      />
    </div>
  );
}
