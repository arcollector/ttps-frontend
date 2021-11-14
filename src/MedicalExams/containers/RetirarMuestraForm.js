import React, { useState } from 'react'

import {Form, Input, Button} from 'semantic-ui-react';

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { toast } from 'react-toastify';
import saveState from '../../shared/helpers/saveState';




const db= firebase.firestore(firebase);



export default function RetirarMuestraForm(props) {


    const {user, setShowModal, exam, setReloading}= props;
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialValues());
    




    const onChange=(e)=>{

        setFormData({...formData, [e.target.name]:e.target.value});

    }

    const onSubmit=()=>{
        
        const refDoc= db.collection('medicalSamples').where("idMedicExam","==",exam.id);
        refDoc.get().then(res=>{
            const id=res.docs[0].id;
            db.collection('medicalSamples').doc(id).update({
                retiradoPor:formData.name
            })
            saveState("esperandoLote", user.displayName, exam.id).then(idState=>{
                
                var refMedicExam = db.collection('medicExams').doc(exam.id);
                refMedicExam.update({
                    idState:idState
                })
            });
            const refDocs= db.collection('states').where("name","==","esperandoLote");
            refDocs.get().then(result=>{
                if(result.docs.length===2){
                    const arrayStates=[];
                    result.docs.map((docActual,i)=>{
                        const data=docActual.data();
                        data.id=docActual.id;
                        arrayStates.push(data);
                        return{}
                    })
                    console.log(arrayStates);
                    db.collection("lotes").add({
                        idMedicExam1:arrayStates[0].idMedicExam,
                        idMedicExam2:arrayStates[1].idMedicExam,
                        state:"esperandoResultado"
                    }).then(e=>{
                        setShowModal(false);
                        setReloading((v) => !v);
                        Promise.all(
                            arrayStates.map(state=>{
                                return db
                                    .collection('medicExams')
                                    .doc(state.idMedicExam)
                                    .update({
                                        idLote:e.id
                                    })
                            })
                        )
                    })
                };
            })


        });
        setShowModal(false);
        setReloading((v) => !v);
    }




    return (
       <Form onSubmit={onSubmit}>
           <Form.Field >
                    <div>Nombre de quien retira la muestra:</div> 
                    <Input name="name" type="text" placerholder="nombre de quien retiro la muestra" onChange={onChange} />

                </Form.Field>
            

            <Button type="submit" loading={isLoading}>Guardar Datos</Button>
       </Form>
    )
}

function initialValues(){
    return ({
        
        name:'',
        
        
        
    })
}
