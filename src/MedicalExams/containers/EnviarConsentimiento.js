import React from 'react';
import {toast} from 'react-toastify';
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import saveState from '../../shared/helpers/saveState';

const db= firebase.firestore(firebase);

export default function EnviarConsentimiento(props) {


    const {exam, user, setReloading}= props;

    const enviarConsentimiento= ()=>{

        //sendEmail('grupo11unlp@gmail.com', 'Consentimiento informado', html);

        saveState("esperandoConsentimiento", user.displayName, exam.id).then(idState=>{
            console.log(exam.id);
            var refMedicExam = db.collection('medicExams').doc(exam.id);
            refMedicExam.update({
                idState:idState
            }).then(() => {
                setReloading((v) => !v);
                toast.success("El consentimiento informado fue enviado");
            });
        });


    }


    return (
        <button onClick={enviarConsentimiento}  className="ui button">Enviar Consentimiento</button>
    )
}
