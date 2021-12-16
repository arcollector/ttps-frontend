import React, { useState } from "react";
import { Modal } from "../../shared/components/Modal/Modal";
import ReservarTurnoForm from "../components/ReservarTurnoForm";

export default function ReservarTurno(props) {
  const { exam, user, setReloading } = props;

  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState(null);
  const [contentModal, setContentModal] = useState(null);

  const uploadModal = () => {
    setTitleModal("Reservar Turno");
    setContentModal(
      <ReservarTurnoForm
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
        Reservar Turno
      </button>
      <Modal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </Modal>
    </>
  );
}
