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
        if(formData.name===""){
            toast.warning("Debe ingresar los datos de quien retira la muestra");
        }else{

            let idLote;
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
                    if(result.docs.length>=10){
                        const arrayStates=[];
                        result.docs.map((docActual,i)=>{
                            const data=docActual.data();
                            data.id=docActual.id;
                            arrayStates.push(data);
                            return{}
                        })
                        for (var id = 0; id <= 9; id++) {

                    
                            const refExam=db.collection('medicExams').doc(arrayStates[id].idMedicExam);
                            saveState("enLote", user.displayName, arrayStates[id].idMedicExam).then(idState=>{
                                refExam.update({
                                idState:idState
                                })
                            })
                            
                         }
                        console.log(arrayStates);
                        let refLotes=db.collection('lotes');
                        refLotes.get().then(result=>{
                            idLote=result.docs.length;
                            db.collection("lotes").add({
                                numLote:idLote+1,
                                idMedicExam1:arrayStates[0].idMedicExam,
                                idMedicExam2:arrayStates[1].idMedicExam,
                                idMedicExam3:arrayStates[2].idMedicExam,
                                idMedicExam4:arrayStates[3].idMedicExam,
                                idMedicExam5:arrayStates[4].idMedicExam,
                                idMedicExam6:arrayStates[5].idMedicExam,
                                idMedicExam7:arrayStates[6].idMedicExam,
                                idMedicExam8:arrayStates[7].idMedicExam,
                                idMedicExam9:arrayStates[8].idMedicExam,
                                idMedicExam10:arrayStates[9].idMedicExam,
                                state:"esperandoResultado",
                                urlResultado:""
                            }).then(e=>{
                                
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
                        })
                        
                    };
                }).finally(e=>{
                    setReloading((v) => !v);
                    setShowModal(false);
                })
    
    
            });
        }
       
        
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
