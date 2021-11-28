import React, { useCallback, useState } from 'react';
import {Form, Button, Image} from 'semantic-ui-react';
import {useDropzone} from "react-dropzone";
import NoImage from "../assets/no-image.png";
import {toast} from 'react-toastify';
import '../styles/SubirComprobanteForm.scss';
import * as actions from '../actions';

export default function SubirComprobanteForm(props) {
    const {user, setShowModal, exam, setReloading} = props;

    const [banner, setBanner] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    
    const onDrop= useCallback(acceptedFile=>{
        const file= acceptedFile[0];
        setFile(file);
        setBanner(URL.createObjectURL(file));
    });

    const {getRootProps, getInputProps}=useDropzone({
        accept:"image/jpeg, image/png",
        noKeyboard:true,
        onDrop
    });

    const onSubmit = async ()=>{
        if(!file){
            toast.warning('Debe añadir la imagen del comprobante de pago');
        }else{
            setIsLoading(true);
            try {
              const fileName=exam.id;
              await actions.uploadComprobanteImage(file, fileName);
          Image(file, fileName);
              await actions.setStateEnviarConsentimiento(
                 exam.id,
                 user.displayName,
              );
              toast.success('El comprobante se subio correctamente');
          } catch (e) {
              console.error(e);
          } finally {
              setIsLoading(false);
              setShowModal(false);
              setReloading((v) => !v);
          }
      }
    }

    return (
        <Form className="comprobante-form" onSubmit={onSubmit}>
            <Form.Field className="comprobante-banner">
                <div 
                {...getRootProps()} 
                className="banner"
                style={{ backgroundImage:`url('${banner}')`}}
                />
                <input {...getInputProps()}/>
                {!banner && <Image src={NoImage}/>}

            </Form.Field>
        
            
            <Form.Field>
                <Button type="submit" loading={isLoading}>
                    Guardar comprobante
                </Button>
            </Form.Field>
    </Form>
    )
}
