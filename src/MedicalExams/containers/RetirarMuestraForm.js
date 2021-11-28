import React, { useState } from 'react'
import {Form, Input, Button} from 'semantic-ui-react';
import { toast } from 'react-toastify';
import * as actions from '../actions';

export default function RetirarMuestraForm(props) {

    const {user, setShowModal, exam, setReloading}= props;
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialValues());
   
    const onChange=(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value});

    }

    const onSubmit= async () => {
        if(formData.name===""){
            toast.warning("Debe ingresar los datos de quien retira la muestra");
        }else{
            setIsLoading(true);
            try {
              const medicalSample = await actions.getMedicalSample(exam.id);
              await actions.updateMedicalSample(medicalSample.id, { retiradoPor: formData.name });
              await actions.setStateEsperandoLote(exam.id, user.displayName);
              await actions.setStateEnLote(user.displayName);
            } catch (e) {
              console.error(e);
            } finally {
              setReloading((v) => !v);
              setIsLoading(false);
              setShowModal(false);
            }
        }
    };

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
