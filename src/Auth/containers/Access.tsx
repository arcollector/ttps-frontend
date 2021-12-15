import React from "react";
import { Segment, Message } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

import { User, emptyUser } from "../interfaces";
import { FormLogin } from "../components/FormLogin";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import * as actions from "../actions";
import { AuthContext } from "../../contexts";

export function Access() {
  const [isLoading, setIsLoading] = React.useState(false);
  const history = useHistory();

  const [errors, setErrros] = React.useState<string[]>([]);
  const onSubmitError = (errors: string[]) => {
    setErrros(errors);
  };

  const authContext = React.useContext(AuthContext);
  const onSubmit = React.useCallback(
    async (formData: User) => {
      setErrros([]);
      setIsLoading(true);
      const success = await actions.loginFirebaseAuth(
        formData.email,
        formData.pass
      );
      if (success) {
        const user = await actions.getUserByUsername(formData.username);
        if (user) {
          authContext.setUserFromFirestore(user);
        }
      } else {
        setErrros(["Fallo el autenticado estripetosamente"]);
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

      <FormLogin
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}
        isLoading={isLoading}
      />
    </Segment>
  );
}
