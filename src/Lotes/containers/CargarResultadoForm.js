import React, { useState } from 'react'
import {Form, Input, Button} from 'semantic-ui-react';
import { toast } from 'react-toastify';
import * as actions from '../actions';

export default function CargarResultadoForm(props) {
    const{lote, user, setShowModal, setReloading}=props;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({url:""})

    const onSubmit= async ()=>{
        setIsLoading(true);
        if(formData.url===""){
            toast.warning("Debe ingresar una url");
        }else{
		try {
			await actions.updateLotes(
				lote,
				formData.url,
				user.displayName,
			);
		} catch (e) {
		} finally {
                	setIsLoading(false);
	                setReloading((v) => !v);
	                setShowModal(false);
		}
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

