import React, { useState } from 'react'
import {Modal} from '../../shared/components/Modal/Modal';

import RetirarMuestraForm from './RetirarMuestraForm';
export default function RetirarMuestra(props) {
    

    const {exam, user, setReloading}= props;

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);

    const uploadModal=()=>{
        setTitleModal("Datos de quien retira la muestra");
        setContentModal(<RetirarMuestraForm user={user} setShowModal={setShowModal} exam={exam} setReloading={setReloading}/>);
        setShowModal(true);
    }






    return (
        <>
        <button  className="ui button" onClick={uploadModal}>Retirar Muestra</button>
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
