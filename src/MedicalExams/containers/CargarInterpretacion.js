import React, { useState } from 'react'
import {Modal} from '../../shared/components/Modal/Modal';
import CargarInterpretacionForm from './CargarInterpretacionForm';


export default function CargarInterpretacion(props) {

    const {exam, user, setReloading}= props;

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);


    const uploadModal=()=>{
        setTitleModal("Cargar interpretacion de resultado");
        setContentModal(<CargarInterpretacionForm user={user} setShowModal={setShowModal} exam={exam} setReloading={setReloading}/>);
        setShowModal(true);
    }



    return (
        <>
            <button className="ui button" onClick={uploadModal}>Cargar Resultado</button>
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
