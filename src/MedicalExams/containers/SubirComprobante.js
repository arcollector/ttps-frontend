import React, { useState } from "react";
import { Modal } from "../../shared/components/Modal/Modal";
import SubirComprobanteForm from "../components/SubirComprobanteForm";

export default function SubirComprobante(props) {
  const { exam, user, setReloading } = props;

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  const uploadModal = () => {
    setTitleModal("Cargar comprobante de pago");
    setContentModal(
      <SubirComprobanteForm
        user={user}
        setShowModal={setShowModal}
        exam={exam}
        setReloading={setReloading}
      />
    );
    setShowModal(true);
  };

  return (
    <>
      <button className="ui button" onClick={uploadModal}>
        Subir comprobante
      </button>
      <Modal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </Modal>
    </>
  );
}
