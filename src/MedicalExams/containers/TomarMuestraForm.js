import React, { useState } from 'react'

import {Form, Input, Button} from 'semantic-ui-react';

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { toast } from 'react-toastify';
import saveState from '../../shared/helpers/saveState';




const db= firebase.firestore(firebase);

export default function TomarMuestraForm(props) {

    const {user, setShowModal, exam, setReloading}= props;
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialValues());
    const [error, setError] = useState(false);

    const onChange=(e)=>{


        

        if(!isNaN(e.target.value)){
            
            
                
                setFormData({...formData, [e.target.name]:parseFloat(e.target.value)});

                if(e.target.name==="cantml"){
                    const valor=parseFloat(e.target.value);
                    if(valor>12.5 || valor<7.5){
                        setError(true);
                    }
                    else{
                        setError(false);
                        
                    }
                }
            
            
        }else{
            setError(true);
        }
        
        
        
    }

    const onSubmit=()=>{
        
        if(formData.cantml!== 0 && formData.freezer!== 0 && !error){
            setIsLoading(true);
            db.collection("medicalSamples").add({
                idMedicExam:exam.id,
                cantMl:formData.cantml,
                freezer:formData.freezer,
            }).then(()=>{

                saveState("esperandoRetiroDeMuestra", user.displayName, exam.id).then(idState=>{
                    console.log(exam.id);
                    var refMedicExam = db.collection('medicExams').doc(exam.id);
                    refMedicExam.update({
                        idState:idState,
                        extraccion:true
                    }).then(() => {
                        setReloading((v) => !v);
                        setIsLoading(false);
                        setShowModal(false);
                    });
                });

            })
        }else{
            toast.success('Los datos ingresados son invalidos');
        }

    }

    return (
        <Form className="add-medic-exam-form" onSubmit={onSubmit}>

            
                <Form.Field>
                    <div>Cantidad de mililitros:</div> 
                    <Input name="cantml" error={error} type="text" placerholder="cantidad de ml" onChange={onChange} />
                    {error&&(
                        <span className="error-text" style={{color:'red'}}>
                            Debe introducir un numero valido entre 7.5 y 12.5
                        </span>
                    )}

                </Form.Field>

                <Form.Field>
                    <div>N° Freezer:</div> 
                    <Input name="freezer" type="number" placerholder="freezer donde se almaceno" onChange={onChange} />

                </Form.Field>
            

            <Button type="submit" loading={isLoading}>Guardar Muestra</Button>

        </Form>
    )
}


function initialValues(){
    return ({
        
        cantml:0,
        freezer:0
        
        
    })
}
