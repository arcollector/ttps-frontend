import React, { useState } from 'react'
import {Modal} from '../../shared/components/Modal/Modal';
import CargarResultadoForm from './CargarResultadoForm';

export default function CargarResultado(props) {

    const {lote, user, setReloading}= props;

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);


    const uploadModal=()=>{
        setTitleModal("Cargar resultados del lote");
        setContentModal(<CargarResultadoForm user={user} setShowModal={setShowModal} lote={lote} setReloading={setReloading}/>);
        setShowModal(true);
    }


    return (
        <>
            <button  className="ui button" onClick={uploadModal}>Cargar resultado</button>
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
