import React from 'react';
import {toast} from 'react-toastify';
import * as actions from '../actions';

export default function EnviarConsentimiento(props) {


    const {exam, user, setReloading}= props;

    const enviarConsentimiento= async ()=>{
	try {
		await actions.enviarConsentimiento(exam.id, user.displayName);
	} catch (e) {
	} finally {
                setReloading((v) => !v);
                toast.success("El consentimiento informado fue enviado");
	}
    }


    return (
        <button onClick={enviarConsentimiento}  className="ui button">Enviar Consentimiento</button>
    )
}
