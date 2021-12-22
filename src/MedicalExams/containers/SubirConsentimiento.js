import React, { useState } from "react";
import { Button } from "semantic-ui-react";

import { Modal } from "../../shared/components/Modal/Modal";
import SubirConsentimientoForm from "../components/SubirConsentimientoForm";
import * as actions from "../actions";
import { AuthContext } from "../../contexts";

export default function SubirComprobante(props) {
  const { exam, user, setReloading } = props;

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userFromFirestore =
    React.useContext(AuthContext).getUserFromFirestore();
  const userRole = userFromFirestore?.role;

  const uploadModal = () => {
    setTitleModal("Cargar consentimiento firmado");
    setContentModal(
      <SubirConsentimientoForm
        user={user}
        setShowModal={setShowModal}
        exam={exam}
        setReloading={setReloading}
      />
    );
    setShowModal(true);
  };

  const goBackEsperandoComprobante = async () => {
    try {
      setIsLoading(true);
      await actions.enviarPrespuesto(exam.id, user.displayName);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setReloading((v) => !v);
    }
  };

  return (
    <>
      {userRole !== "patient" && (
        <Button loading={isLoading} onClick={goBackEsperandoComprobante}>
          Regresar a esperando comprobante de pago
        </Button>
      )}
      <button className="ui button" onClick={uploadModal}>
        Subir consentimiento
      </button>
      <Modal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </Modal>
    </>
  );
}
