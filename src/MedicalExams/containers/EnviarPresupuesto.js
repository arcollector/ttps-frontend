import React from "react";
import { toast } from "react-toastify";
import * as actions from "../actions";
import { AuthContext } from "../../contexts";

export default function EnviarPresupuesto(props) {
  const { exam, user, patient, patientInsurer, setReloading } = props;
  const userFromFirestore =
    React.useContext(AuthContext).getUserFromFirestore();
  const userRole = userFromFirestore?.role;

  const handlerClick = async () => {
    const request1 = async () => {
      try {
        const targetEmail = patientInsurer
          ? patientInsurer.email
          : patient.email;
        if (targetEmail) {
          await actions.enviarPresupestoPdf(exam.id, targetEmail);
        } else {
          toast.error(
            "Obra social del paciente no tiene configurado el correo electronico"
          );
        }
      } catch (e) {
        console.error(e);
        toast.error(
          `Fallo el envio del pdf ${exam.id} al email del paciente ${patient.email}`
        );
      }
    };

    const request2 = async () => {
      try {
        await actions.enviarPrespuesto(exam.id, user.displayName);
        toast.success("El presupuesto fue enviado");
      } catch (e) {
        console.error(e);
      } finally {
        setReloading((v) => !v);
      }
    };

    request1();
    await request2();
  };

  if (userRole === "patient") {
    return null;
  }

  return (
    <button onClick={handlerClick} className="ui button">
      Enviar Presupuesto
    </button>
  );
}
