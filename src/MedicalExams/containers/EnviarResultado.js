import React from 'react';

import {toast} from 'react-toastify';
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import saveState from '../../shared/helpers/saveState';

const db= firebase.firestore(firebase);

export default function EnviarResultado(props) {

    const {exam, user, setReloading}= props;

    const enviarResultado= ()=>{

        //sendEmail('grupo11unlp@gmail.com', 'Resultado del estudio', html);

        saveState("finalizado", user.displayName, exam.id).then(idState=>{
            console.log(exam.id);
            var refMedicExam = db.collection('medicExams').doc(exam.id);
            refMedicExam.update({
                idState:idState
            }).then(() => {
                setReloading((v) => !v);
                toast.success("El resultado fue enviado exitosamente");
            });
        });


    }



    return (
        <button className="ui button" onClick={enviarResultado}>Enviar Resultado</button>
    )
}
