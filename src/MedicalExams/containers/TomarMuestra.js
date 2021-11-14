import React, { useState } from 'react'
import {Modal} from '../../shared/components/Modal/Modal';

import TomarMuestraForm from './TomarMuestraForm';


export default function TomarMuestra(props) {

    const {exam, user, setReloading}= props;

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);

    const uploadModal=()=>{
        setTitleModal("Cargar datos de la muestra");
        setContentModal(<TomarMuestraForm user={user} setShowModal={setShowModal} exam={exam} setReloading={setReloading}/>);
        setShowModal(true);
    }






    return (
        <>
        <button  className="ui button" onClick={uploadModal}>Cargar Muestra</button>
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
