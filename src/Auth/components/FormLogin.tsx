import React from "react";
import { Form as SemanticUiForm, Button } from "semantic-ui-react";
import * as yup from "yup";

import { FormInput } from "../../shared/components/FormInput";
import { User, emptyUser, schema, validators } from "../interfaces";

type Props = {
  values?: User;
  onSubmitError: (errors: string[]) => any;
  onSubmit: (user: User) => any;
  isLoading: boolean;
  isRegisterMode?: boolean;
};

export function FormLogin(props: Props) {
  const [formData, setFormData] = React.useState<User>(
    props.values
      ? {
          ...props.values,
          pass: "",
        }
      : emptyUser
  );
  const onChange = (name: string, value: string) => {
    setFormData((v) => ({ ...v, [name]: value }));
  };

  const { onSubmitError, onSubmit } = props;
  const onFormSubmit = React.useCallback(() => {
    if (props.isLoading) {
      return;
    }
    try {
      schema.validateSync(formData, { abortEarly: false });
      onSubmit(formData);
    } catch (e) {
      onSubmitError((e as yup.ValidationError).errors);
      return;
    }
  }, [props.isLoading, formData, onSubmitError, onSubmit]);

  return (
    <SemanticUiForm data-testid="form" onSubmit={onFormSubmit}>
      <FormInput
        label="Correo electronico"
        name="email"
        placeholder="Correo electronico"
        type="email"
        onChange={onChange}
        value={formData.email}
        validator={validators.email}
        required
      />

      <FormInput
        label="Usuario"
        name="username"
        placeholder="Usuario (su numero de dni)"
        type="text"
        onChange={onChange}
        value={formData.username}
        validator={validators.username}
        required
      />

      <FormInput
        label="Clave"
        name="pass"
        placeholder="Clave de acceso"
        type="password"
        onChange={onChange}
        value={formData.pass}
        validator={validators.pass}
        required
      />

      <Button className="primary" type="submit" loading={props.isLoading}>
        Terminar
      </Button>
    </SemanticUiForm>
  );
}
