import React, { useState } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../shared/utils/Validations";
import firebase from "../../../shared/utils/Firebase";
import "firebase/compat/auth";

import "../styles/LoginForm.scss";

export default function LoginForm(props) {
  const { setSelectedForm } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultValueForm());
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [user, setUser] = useState(null);

  const onSubmit = () => {
    setFormError({});
    let errors = {};
    let formOk = {};

    if (!validateEmail(formData.email)) {
      errors.email = true;
      formOk = false;
    }

    if (formData.password < 6) {
      errors.password = true;
      formOk = false;
    }

    setFormError(errors);

    if (formOk) {
      setIsLoading(true);

      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then((response) => {
          setUser(response.user);
          setUserActive(response.user.emailVerified);
          if (!response.user.emailVerified) {
            toast.warning("Debes verificar la cuenta");
          }
        })
        .catch((err) => {
          handlerErrors(err.code);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      <h1>Iniciar Session</h1>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placerholder="correo electronico"
            icon="mail outline"
            error={formError.email}
          />

          {formError.email && (
            <span className="error-text">
              Por favor, introduce un correo electronico valido
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placerholder="Contraseña"
            icon={
              showPassword ? (
                <Icon
                  name="eye slash outline"
                  link
                  onClick={handlerShowPassword}
                />
              ) : (
                <Icon name="eye" link onClick={handlerShowPassword} />
              )
            }
            error={formError.password}
          />
          {formError.password && (
            <span className="error-text">
              La contraseña debe tener al menos 6 caracteres.
            </span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Iniciar Sesión
        </Button>

        <div className="login-form__options">
          <p
            onClick={() => {
              setSelectedForm("auth");
            }}
          >
            Volver
          </p>
        </div>
      </Form>

      {!userActive && (
        <ButtonResetSendEmailVerification
          user={user}
          setIsLoading={setIsLoading}
          setUserActive={setUserActive}
        />
      )}
    </div>
  );
}

function ButtonResetSendEmailVerification(props) {
  const { user, setIsLoading, setUserActive } = props;

  const resendVerificationEmail = () => {
    user
      .sendEmailVerification()
      .then(() => {
        toast.success("Se ha enviado el email de verificacion");
      })
      .catch((err) => {
        handlerErrors(err.code);
      })
      .finally(() => {
        setIsLoading(false);
        setUserActive(true);
      });
  };

  return (
    <div className="resend-verification-email">
      <p>
        Si no has recibido el email de verificación puedes volver a enviarlo
        haciendo click <span onClick={resendVerificationEmail}>aqui</span>
      </p>
    </div>
  );
}

function handlerErrors(code) {
  switch (code) {
    case "auth/wrong-password":
      toast.warning("El usuario o la contraseña son incorrectos");
      break;
    case "auth/too-many-requests":
      toast.warning(
        "Has enviado demasiadas solicitudes de reenvio de email. Vuelve a intentarlo en unos minutos"
      );
      break;
    case "auth/user-not-found":
      toast.warning("El usuario o la contraseña son incorrectos");
      break;
    default:
      break;
  }
}

function defaultValueForm() {
  return {
    username: "",
    password: "",
  };
}
