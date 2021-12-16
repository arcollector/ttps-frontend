import React, { useState } from 'react'
import {Form, Input, Button} from 'semantic-ui-react';
import { toast } from 'react-toastify';
import * as actions from '../actions';

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

    const onSubmit= async () =>{
        if(formData.cantml!== 0 && formData.freezer!== 0 && !error){
            setIsLoading(true);
            try {
              await actions.createMedicalSample({
                idMedicExam:exam.id,
                cantMl:formData.cantml,
                freezer:formData.freezer,
              });
              await actions.setStateEsperandoRetiroDeMuestra(exam.id, user.displayName);
            } catch (e) {
              console.error(e);
            } finally {
              setReloading((v) => !v);
              setIsLoading(false);
              setShowModal(false);
            }
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
