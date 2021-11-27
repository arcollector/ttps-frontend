import React from 'react';
import {toast} from 'react-toastify';
import * as actions from '../actions';

export default function EnviarResultado(props) {

    const {exam, user, setReloading}= props;

    const enviarResultado= async ()=>{
	try {
		await actions.enviarResultado(exam.id, user.displayName);
                toast.success("El resultado fue enviado exitosamente");
	} catch (e) {
	} finally {
                setReloading((v) => !v);
	}
    }



    return (
        <button className="ui button" onClick={enviarResultado}>Enviar Resultado</button>
    )
}
