
import React, { useState, useEffect } from 'react';
import {Form, Input, Button, Image, List, Icon, TextArea} from 'semantic-ui-react';
import {toast} from 'react-toastify';
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import pdfService from '../../pdfservice';
import { BACKEND_URL } from '../../httpservices'

import examen from '../assets/virus1.jpg'
import examen2 from '../assets/virus2.jpg'
import examen3 from '../assets/virus3.jpg'
import examen4 from '../assets/virus4.jpg'
import examen5 from '../assets/virus5.jpg'


import saveState from '../../shared/helpers/saveState';
import { Patients, helpers as patientsHelpers } from '../../Patients'
import { actions as insurersActions } from '../../Insurers';

import '../styles/MedicalExamNewForm.scss';

const db= firebase.firestore(firebase);

export function MedicalExamNewForm(props) {
    const {setShowModal, user}= props;

    const [presupuesto, setPresupuesto] = useState(0);
    const [formData, setFormData] = useState(initialValues());
    const [seleccionado, setSeleccionado] = useState(initialState());
    const [isLoading, setIsLoading] = useState(false);
    const [paciente, setPaciente] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [prices, setPrices] = useState(null);
    const [doctorSelected, setDoctorSelected] = useState("");
    const [ insurers, setInsurers ] = React.useState([]);
    const [ patientInsurer, setPatientInsurer ] = React.useState(null);
    const [selected, setSelected] = useState("exoma");

    React.useEffect(() => {
        (async () => {
          setInsurers(await insurersActions.getAllInsurers());
        })();
    }, []);

    useEffect(() => {
        const refDocPrices= db.collection("pricesMedicExams");
        refDocPrices.get().then(doc=>{
            let arrayPrices=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    data.id=docActual.id;
                    arrayPrices[data.exam]=data.price;
                    return {}
                })
               
                setPrices(arrayPrices);
                
               
            }
        })
        return () => {
            
        }
    }, [])


    useEffect(() => {
        const refDocMedic= db.collection("doctors");
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
    

    const onSubmit=async()=>{
        
        if(!paciente){
            toast.warning("El examen debe incluir los datos del paciente");
        }else{
            if(!formData.patologia){
                toast.warning("El examen debe incluir una patologia");
            }else{
                if(seleccionado["exoma"]==="false" && seleccionado["genoma"]==="false" && seleccionado["carrier"]==="false" && seleccionado["cariotipo"]==="false"&& seleccionado["array"]==="false"){
                    toast.warning("Se debe seleccionar un examen medico");
                }else{
                    setIsLoading(true);
                    
                        
                        
                        let  today = new Date(),
                        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        let day=today.getDate();
                        let month=today.getUTCMonth()+1;
                        let year=today.getFullYear();
                            
                            db.collection("medicExams").add({
                                
                                idPatient:paciente.id,
                                idEmployee:user.uid,
                                idMedic:doctorSelected,
                                patology:formData.patologia,
                                exomaSelected:seleccionado["exoma"],
                                genomaSelected:seleccionado["genoma"],
                                carrierSelected:seleccionado["carrier"],
                                cariotipoSelected:seleccionado["cariotipo"],
                                arraySelected:seleccionado["array"],
                                price:prices[selected],
                                examSelected:selected,
                                fechaCompleta:date,
                                day:day,
                                month:month,
                                year:year,
                                idState:"",

    
    
                            }).then((e)=>{
                                let idMedicExam=e.id;
                                console.log('por que no anda esto');
                                MyDocument(idMedicExam);
                                saveState("enviarPresupuesto", user.displayName, idMedicExam).then(idState=>{
                                    
                                    var refMedicExam = db.collection('medicExams').doc(idMedicExam);
                                    refMedicExam.update({
                                        idState:idState
                                    })
                                });
                                toast.success("El estudio fue cargado correctamente");
                            }).catch((error)=>{
                                toast.error("Error al guardar el estudio");
                                console.log(error);
                            }).finally(()=>{
                                
                                setIsLoading(false);
                                setFormData(initialValues());
                                setShowModal(false);
                            })
    



                      
                        


                        
                    
                }
            }
        } 
    }

    // const uploadPdf=async(fileName)=>{
    //     const metadata = {
    //         contentType: 'application/pdf',
    //       };
    //     const ref= firebase.storage().ref().child(`estudiospdf/${fileName}`);
    //     return await ref.put(file, metadata);
    // }

    const MyDocument=async(idMedicExam)=>{
        try{
            pdfService.downloadPDF(
                `${BACKEND_URL}/pdf/informe?usuario=${paciente.nombre}`,
                paciente
            ).then((res)=>{

                //var file = new File([myBlob], "name");
                console.log(res);
                const file= new Blob([res.data], {type:'application/pdf'});
                //var file2 = new File([file], "holaname");

                const metadata = {
                    contentType: 'application/pdf',
                  };
                console.log(1, idMedicExam);
                const ref = firebase
                    .storage()
                    .ref()
                    .child(`presupuestosPdf/${idMedicExam}.pdf`);
                  
                console.log(2, ref);
                ref.put(file, metadata);
                
                console.log(file);
                const anchorLink= document.createElement('a');
                anchorLink.href=window.URL.createObjectURL(file);
                anchorLink.setAttribute('download','prueba5.pdf');
                anchorLink.click();
                let fd= new FormData();
                fd.set('a', file);


                


                return fd.get('a');
                //return file;
            })
        }catch(error){

            console.log(error);
        }
    }


    const calucularPresupuesto= (e)=>{
        setSelected(e.target.name);
        switch (e.target.name) {
            
            case "exoma":
                if(seleccionado[e.target.name]==="false"){
                    
                    setPresupuesto(presupuesto+ prices[e.target.name]);
                    setSeleccionado({...seleccionado, exoma:"true"});
                    
                }else{
                    setPresupuesto(presupuesto-prices[e.target.name]);
                    setSeleccionado({...seleccionado, exoma:"false"});
                    
                }
                
                break;
            case "genoma":
                if(seleccionado[e.target.name]==="false"){
                    
                    setPresupuesto(presupuesto+prices[e.target.name]);
                    setSeleccionado({...seleccionado, genoma:"true"});
                    
                }else{
                    setPresupuesto(presupuesto-prices[e.target.name]);
                    setSeleccionado({...seleccionado, genoma:"false"});
                    
                }
                break;
            case "carrier":
                if(seleccionado[e.target.name]==="false"){
                    
                    setPresupuesto(presupuesto+prices[e.target.name]);
                    setSeleccionado({...seleccionado, carrier:"true"});
                    
                }else{
                    setPresupuesto(presupuesto-prices[e.target.name]);
                    setSeleccionado({...seleccionado, carrier:"false"});
                    
                }
                break;
                case "cariotipo":
                    if(seleccionado[e.target.name]==="false"){
                        
                        setPresupuesto(presupuesto+prices[e.target.name]);
                        setSeleccionado({...seleccionado, cariotipo:"true"});
                        
                    }else{
                        setPresupuesto(presupuesto-prices[e.target.name]);
                        setSeleccionado({...seleccionado, cariotipo:"false"});
                        
                    }
                    break;
                case "array":
                       if(seleccionado[e.target.name]==="false"){
                           
                        setPresupuesto(presupuesto+prices[e.target.name]);
                        setSeleccionado({...seleccionado, array:"true"});
                            
                      }else{
                         setPresupuesto(presupuesto-prices[e.target.name]);
                         setSeleccionado({...seleccionado, array:"false"});
                            
                      }
                      break;
            default:
                break;
        }
    }

    const onChange=(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value});
        
    }
    
    const onSearchPatient = (patient) => {
        setPaciente(patient);
    };

    useEffect(() => {
        setPatientInsurer(
            patientsHelpers.getPatientInsurer(paciente, insurers)
        );
    }, [paciente, insurers]);

    const handlerDoctorSelected=(e)=>{
        setDoctorSelected(e.target.value);
    }

    return (
        <Form className="add-medic-exam-form" onSubmit={onSubmit}>
            <Patients.SearchForm
                onSearch={onSearchPatient}
            />

            <div className="header-section">
                <h4>Datos del paciente</h4>
            </div>
            <div className="two-columns">
            <Form.Field>
                <div>Nombre del paciente:</div> 
                <Input name="nompaciente" disabled={true} value={paciente?.nombre} placerholder="nombre del paciente" />

            </Form.Field>

            <Form.Field>
                <div>Apellido:</div> 
                <Input name="apellido" disabled={true} value={paciente?.apellido} placerholder="nombre del paciente" />

            </Form.Field>
            </div>
            
            <div className="three-columns">
                <Form.Field>
                    <div>Dni:</div> 
                    <Input name="dni" disabled={true} value={paciente?.dni} placerholder="dni" />

                </Form.Field>
                <Form.Field>
                    <div>Cod Area:</div> 
                    <Input name="code" disabled={true} value={paciente?.code} placerholder="code" />

                </Form.Field>
                <Form.Field>
                    <div>Telefono:</div> 
                    <Input name="telefono" disabled={true} value={paciente?.telefono} placerholder="telefono" />

                </Form.Field>
            </div>


            <Form.Field>
                <div>Correo Electronico:</div> 
                <Input name="email" disabled={true} value={paciente?.email} placerholder="email" />

            </Form.Field>

            {patientInsurer ?
            <>
                <Form.Field>
                    <div>Nombre de la obra social:</div> 
                    <Input
                        name="nomsoc"
                        disabled={true}
                        value={patientInsurer ? patientInsurer.nombre : ''}
                        placerholder="nomsoc"
                    />
                </Form.Field>
                
                <Form.Field>
                    <div>Numero de la obra social:</div> 
                    <Input
                        name="numsoc" 
                        disabled={true}
                        value={paciente?.numsoc} placerholder="numsoc"
                    />
                </Form.Field>
            </>
            :
            <div style={{textAlign: 'center'}}>
                <strong>Este paciente no tiene obra social</strong>
            </div>
            }

            <div className="header-section">
                <h4>Datos del estudio</h4>
            </div>

            <Form.Field>

                <div>Medico Derivante:</div>

                
                    <select multiple={false} onChange={handlerDoctorSelected} name="medicodev" className="ui fluid normal dropdown">
                    {doctors?.map(doc=>{
                        return <option  key={doc?.id} value={doc?.id}>{`${doc?.nombre} ${doc?.apellido}`}</option>
                    })}
                    
                    
                    </select>
            </Form.Field>


            <Form.Field>
                <div>Patologia (diagnostico presuntivo):</div> 
                <TextArea name="patologia" placerholder="patologia" onChange={onChange}/>

            </Form.Field>
            
            Seleccionar Examen Medico
            <List className="patology">
                
                <List.Item>
                    <Image avatar src={examen} />
                    <List.Content>
                        <List.Header as='a' name="exoma" onClick={calucularPresupuesto}>Exoma</List.Header>
                        {selected==="exoma"&&(<Icon name="chevron circle up"/>)}    
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={examen2} />
                    <List.Content>
                        <List.Header as='a' name="genoma" onClick={calucularPresupuesto}>Genoma Mitocondrial Completo</List.Header>
                        {selected==="genoma"&&(<Icon name="chevron circle up"/>)} 
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={examen3} />
                    <List.Content>
                        <List.Header as='a' name="carrier" onClick={calucularPresupuesto}>Carrier de Enfermedades Monogenicas</List.Header>
                        {selected==="carrier"&&(<Icon name="chevron circle up"/>)} 
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={examen4} />
                    <List.Content>
                        <List.Header as='a' name="cariotipo" onClick={calucularPresupuesto}>Cariotipo</List.Header>
                        {selected==="cariotipo"&&(<Icon name="chevron circle up"/>)} 
                    </List.Content>
                </List.Item>
                <List.Item>
                    <Image avatar src={examen5} />
                    <List.Content>
                        <List.Header as='a' name="array" onClick={calucularPresupuesto}>Array CGH</List.Header>
                        {selected==="array"&&(<Icon name="chevron circle up"/>)} 
                    </List.Content>
                </List.Item>
            </List>
            <h2>Presupuesto: {prices?prices[selected]:null}</h2>
            <Button type="submit" loading={isLoading}>Crear Estudio Medico</Button>
            
        </Form>
    )
}

function initialValues(){
    return ({
        
        patologia:"",
        search:""
        
        
    })
}

function initialState(){
    return({
    exoma:"false",
    genoma:"false",
    carrier:"false",
    cariotipo:"false",
    array:"false",
    })
}

// function initialValuesPrices(){
//     const prices={};
//     return prices;
// }

