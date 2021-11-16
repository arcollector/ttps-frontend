import React, { useState } from 'react'

import {Form, Input, Button} from 'semantic-ui-react';

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { toast } from 'react-toastify';
import saveState from '../../shared/helpers/saveState';


const db= firebase.firestore(firebase);


export default function CargarResultadoForm(props) {


    const{lote, user, setShowModal, setReloading}=props;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({url:""})

    let  today = new Date();


    const onSubmit=()=>{
        setIsLoading(true);
        if(formData.url===""){
            toast.warning("Debe ingresar una url");
        }else{
            let day=today.getDate();
            let month=today.getMonth()+1;
            let year=today.getFullYear();
            let fechaCompleta=`${day}-${month}-${year}`;
            const refLote=db.collection('lotes').doc(lote.id);
            console.log(formData);
            refLote.update({
                state:"finalizado",
                urlResultado:formData.url,
                fechaResultado:fechaCompleta,
                userResultado:user.displayName,
            }).then(e=>{
                for (var id = 1; id <= 2; id++) {

                    
                    const refExam=db.collection('medicExams').doc(lote[`idMedicExam${id}`]);
                    saveState("esperandoInterpretacion", user.displayName, lote[`idMedicExam${id}`]).then(idState=>{
                        refExam.update({
                        idState:idState
                        })
                    })
                    
                 }
            }).finally(e=>{
                setIsLoading(false);
                setReloading((v) => !v);
                setShowModal(false);
            })
        }
    }

    const onChange=(e)=>{
        setFormData({[e.target.name]:e.target.value});
        
    }

    return (
        <Form className="add-medic-exam-form" onSubmit={onSubmit}>
            
            <Form.Field>
                <div>Url del resultado:</div> 
                <Input name="url" type="text" placerholder="url" onChange={onChange} />

            </Form.Field>

            <Button type="submit" loading={isLoading}>Guardar Resultado</Button>

        </Form>
    )
}

