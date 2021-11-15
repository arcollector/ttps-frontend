import React from 'react';
import {toast} from 'react-toastify';
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import saveState from '../../shared/helpers/saveState';
import pdfService from '../../pdfservice';

const db= firebase.firestore(firebase);

export default function EnviarPresupuesto(props) {
    const {
        exam,
        user,
        patient,
        patientInsurer,
        setReloading,
    } = props;

    var storage = firebase.storage();
    


    const handlerClick = () => {
        const targetEmail = patientInsurer ? patientInsurer.email : patient.email;
        if (targetEmail) {
            storage
                .ref(`presupuestosPdf/${exam.id}.pdf`)
                .getDownloadURL()
                .then((url) => {
                    const html = `<p>Acceda a esta direccion para descargar el presupuesto de su estudio medico ${url}</p>`;
                    return pdfService.sendUsingSendgrid(
                        targetEmail,
                        'Presupuesto del estudio medico',
                        html
                    );
                })
                .catch((e) => {
                    console.error(e);
                    toast.error(`Fallo el envio del pdf ${exam.id} al email del paciente ${patient.email}`);
                });
        } else {
            toast.error('Obra social del paciente no tiene configurado el correo electronico');
        }

        saveState("esperandoComprobante", user.displayName, exam.id).then(idState=>{
            console.log(exam.id);
            var refMedicExam = db.collection('medicExams').doc(exam.id);
            refMedicExam.update({
                idState:idState
            }).then(() => {
                setReloading((v) => !v);
                toast.success("El presupuesto fue enviado");
            });
        });
    };


    return (
        <button onClick={handlerClick} className="ui button">Enviar Presupuesto</button>
    )
}
