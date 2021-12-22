import React from "react";
import { toast } from "react-toastify";
import * as actions from "../actions";
import { AuthContext } from "../../contexts";

export default function EnviarConsentimiento(props) {
  const { exam, user, setReloading } = props;
  const userFromFirestore =
    React.useContext(AuthContext).getUserFromFirestore();
  const userRole = userFromFirestore?.role;

  const enviarConsentimiento = async () => {
    try {
      await actions.enviarConsentimiento(exam.id, user.displayName);
    } catch (e) {
    } finally {
      setReloading((v) => !v);
      toast.success("El consentimiento informado fue enviado");
    }
  };

  if (userRole === "patient") {
    return null;
  }

  return (
    <button onClick={enviarConsentimiento} className="ui button">
      Enviar Consentimiento
    </button>
  );
}
