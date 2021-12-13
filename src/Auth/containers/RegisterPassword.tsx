import React from "react";
import { Segment, Message } from "semantic-ui-react";
import { useHistory, useLocation } from "react-router-dom";

import { Patient } from "../../Patients";
import { User } from "../interfaces";
import { Form } from "../components/Form";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import * as actions from "../actions";

export function RegisterPassword() {
  const [isLoading, setIsLoading] = React.useState(false);
  const history = useHistory();
  const { state: patient } = useLocation<Patient | undefined>();
  const user: User = {
    id: "",
    username: patient ? patient.dni : "",
    pass: "",
    role: "patient",
  };

  const [errors, setErrros] = React.useState<string[]>([]);
  const onSubmitError = (errors: string[]) => {
    setErrros(errors);
  };

  const onSubmit = React.useCallback(
    async (formData: User) => {
      setErrros([]);
      setIsLoading(true);
      const success = await actions.createUser(formData);
      if (success) {
        history.replace("/");
      }
      setIsLoading(false);
    },
    [history]
  );
  return (
    <Segment>
      <Message>
        <Message.Header size="huge">
          Ingrese lo que sera su clave de acceso para terminar el registro
        </Message.Header>
        <p>Sepa que su numero de dni sera su usuario de acceso</p>
      </Message>

      <ErrorMessage heading="No se pudo crear su usuario" errors={errors} />

      <Form
        values={user}
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}
        isLoading={isLoading}
        isRegisterMode
      />
    </Segment>
  );
}
