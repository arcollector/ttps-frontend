import React, { useCallback, useState } from 'react';
import {Form, Button, Image} from 'semantic-ui-react';
import {useDropzone} from "react-dropzone";
import NoImage from "../assets/no-image.png";
import {toast} from 'react-toastify';



import '../styles/SubirComprobanteForm.scss';

import firebase from '../../shared/utils/Firebase';

import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import saveState from '../../shared/helpers/saveState';

const db= firebase.firestore(firebase);

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



    const uploadImage= (fileName)=>{
        const ref=firebase
        .storage()
        .ref()
        .child(`comprobante/${fileName}`)

        return ref.put(file);

    }


    const onSubmit=()=>{
        if(!file){
            toast.warning('Debe añadir la imagen del comprobante de pago');
        }else{
            setIsLoading(true);
            const fileName=exam.id;
            uploadImage(fileName).then(()=>{
                toast.success('El comprobante se subio correctamente');
                saveState("enviarConsentimiento", user.displayName, exam.id).then(idState=>{
                    console.log(exam.id);
                    var refMedicExam = db.collection('medicExams').doc(exam.id);
                    refMedicExam.update({
                        idState:idState
                    }).then(() => {
                        setIsLoading(false);
                        setShowModal(false);
                        setReloading((v) => !v);
                    });
                });
            })
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
