import React, { useState } from 'react'
import {Modal} from '../../shared/components/Modal/Modal';
import SubirConsentimientoForm from './SubirConsentimientoForm';

export default function SubirComprobante(props) {

    const {exam, user, setReloading}= props;

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);

    const uploadModal=()=>{
        setTitleModal("Cargar consentimiento firmado");
        setContentModal(<SubirConsentimientoForm user={user} setShowModal={setShowModal} exam={exam} setReloading={setReloading}/>);
        setShowModal(true);
    }

    return (
        <>
            <button  className="ui button" onClick={uploadModal}>Subir consentimiento</button>
            <Modal
                show={showModal}
                setShow={setShowModal}
                title={titleModal}
            >
                {contentModal}
            </Modal>
        </>
    )


}