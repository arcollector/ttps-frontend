import React from "react";
import { Segment, Message } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

import { User } from "../interfaces";
import { Form } from "../components/Form";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import * as actions from "../actions";

export function Access() {
  const [isLoading, setIsLoading] = React.useState(false);
  const history = useHistory();

  const [errors, setErrros] = React.useState<string[]>([]);
  const onSubmitError = (errors: string[]) => {
    setErrros(errors);
  };

  const onSubmit = React.useCallback(
    async (formData: User) => {
      setErrros([]);
      setIsLoading(true);
      const user = await actions.getUserByUsername(formData.username);
      const success = user.pass === formData.pass;
      if (success) {
        history.replace("/");
      } else {
        setErrros([
          "Credenciales ingresadas no corresponde a un usuario registrado",
        ]);
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

      <ErrorMessage
        heading="Verifique que el usuario y la clave sean correctos"
        errors={errors}
      />

      <Form
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}
        isLoading={isLoading}
      />
    </Segment>
  );
}
