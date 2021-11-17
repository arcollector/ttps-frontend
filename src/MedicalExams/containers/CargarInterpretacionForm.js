import React, { useEffect, useState } from 'react';
import {Form, Input, Button, Image, List, Icon, TextArea} from 'semantic-ui-react';
import {toast} from 'react-toastify';

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import saveState from '../../shared/helpers/saveState';


const db= firebase.firestore(firebase);

export default function CargarInterpretacionForm(props) {

    const {exam, user, setReloading, setShowModal}= props;

    const [doctorSelected, setDoctorSelected] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [resultSelected, setResultSelected] = useState("positivo");
    const [formData, setFormData] = useState({descripcion:""});
    


    useEffect(() => {
        const refDocMedic= db.collection("medicosInformantes");
        refDocMedic.get().then(doc=>{
            setDoctorSelected(doc.docs[0].id);
            let arrayDoctors=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    data.id=docActual.id;
                    arrayDoctors.push(data);
                    return {}
                })
                setDoctors(arrayDoctors);
               
            }
        })
        return () => {
            
        }
    }, [])





    const handlerDoctorSelected=(e)=>{
        setDoctorSelected(e.target.value);
    }
    const handlerResultSelected=(e)=>{
        setResultSelected(e.target.value);
    }

    const onChange=(e)=>{
        setFormData({[e.target.name]:e.target.value});
    }

    const onSubmit=()=>{
        setIsLoading(true);
        if(formData.descripcion===""){
            toast.warning("Debe ingresar la descripcion del resultado");
        }else{

            let  today = new Date();
            let fechaCompleta = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
           
            console.log(exam.id);
            const refExam=db.collection("medicExams").doc(exam.id);
            saveState("resultadoEntregado", user.displayName, exam.id).then(idState=>{
                refExam.update({
                    dateResult:fechaCompleta,
                    idDoctorInf:doctorSelected,
                    result:resultSelected,
                    idState:idState,
                    descripcion:formData.descripcion,
                }).finally(e=>{
                    setIsLoading(false);
                    setReloading((v) => !v);
                    setShowModal(false);
                })
            })
        }
        
        
    
    }

    return (
        
        <Form onSubmit={onSubmit}>
            <Form.Field >

                <div>Medico Informante:</div>

                
                    <select multiple={false} onChange={handlerDoctorSelected} name="medicoInf" className="ui fluid normal dropdown">
                    {doctors?.map(doc=>{
                        return <option  key={doc?.id} value={doc?.id}>{`${doc?.nombre} ${doc?.apellido}`}</option>
                    })}
                    
                    
                    </select>
            </Form.Field>
            <Form.Field>
                <div>Resultado:</div>
                    <select multiple={false} onChange={handlerResultSelected} name="resultado" className="ui fluid normal dropdown">
                        <option  value="positivo">Positivo</option>
                        <option  value="negativo">Negativo</option>
                    </select>
            </Form.Field>
            <Form.Field>
                <div>Descripcion del resultado:</div> 
                <TextArea name="descripcion" placerholder="descripcion" onChange={onChange}/>

            </Form.Field>
            <Button type="submit" loading={isLoading} >Guardar Interpretacion</Button>
        </Form>
    )
}
