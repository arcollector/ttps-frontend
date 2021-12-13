import React from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";

import "../styles/AuthOptions.scss";

export default function AuthOptions(props) {
  const { setSelectedForm } = props;
  return (
    <div className="auth-options">
      <h2>Registrate para consultar tus estudios</h2>
      {/*<Button className="register" onClick={() => setSelectedForm("register")}>
        Registrate
  </Button>*/}
      <Button className="register" as={Link} primary size="mini" to="/registro">
        Registrate
      </Button>
      <Button className="login" as={Link} primary size="mini" to="/ingresar">
        Ingresar
      </Button>

      <Button className="login" onClick={() => setSelectedForm("login")}>
        Iniciar Sesion (Admin)
      </Button>
    </div>
  );
}
