import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';
import firebase from '../../shared/utils/Firebase';

import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import '../styles/MedicalExams.scss';
import EnviarPresupuesto from './EnviarPresupuesto';
import SubirComprobante from './SubirComprobante';
import EnviarConsentimiento from './EnviarConsentimiento';
import SubirConsentimiento from './SubirConsentimiento';
import ReservarTurno from './ReservarTurno';
import TomarMuestra from './TomarMuestra';
import RetirarMuestra from './RetirarMuestra';


const db= firebase.firestore(firebase);


export function MedicalExams(props) {

    
    const {user}= props;
    
    const [exams, setExams] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [patients, setPatients] = useState(null);
    const [states, setStates] = useState([]);
    const [filterStates, setFilterStates] = useState(null);
    const [reloading, setReloading] = useState(false);
    const [viewFilter, setViewFilter] = useState({estado:"todos"})



    useEffect(() => {
        const refDocStates= db.collection("states");
        let filters=[];
        let arrayStates=[]; 
        refDocStates.get().then(doc=>{
            
            
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    data.id=docActual.id;
                    arrayStates[data.id]=data.name;
                    if(!filters.includes(data.name)){
                        filters.push(data.name);
                        filters[data.name]=[];
                       
                    }
                    return {}
                    
                })
                
                setStates(arrayStates);
                
               
            }
        })

        const refMedicExams= db.collection("medicExams");
        refMedicExams.get().then(doc=>{
            let arrayExams=[]; 
            
            if(!doc.empty ){

                
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    data.id=docActual.id;
                    arrayExams.push(data);
                    
                    filters[arrayStates[data.idState]]?.push(data);
                    
                    
                    return{}
                }) 

                
               
                setExams(arrayExams);
                setFilterStates(filters);
                
                   
               
            }
        })

        return () => {
            
        }
    }, [reloading])
    


   


    useEffect(() => {
        const refDocMedic= db.collection("doctors");
        refDocMedic.get().then(doc=>{
            
            let arrayDoctors=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    data.id=docActual.id;
                    arrayDoctors[data.id]=`${data.nombre} ${data.apellido}`;
                    return {}
                    
                })
                setDoctors(arrayDoctors);
               
            }
        })
        return () => {
            
        }
    }, [])



    useEffect(() => {
        const refDocMedic= db.collection("patients");
        refDocMedic.get().then(doc=>{
            
            let arrayPatients=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    data.id=docActual.id;
                    data.nombreCompleto=`${data.nombre} ${data.apellido}`;
                    arrayPatients[data.id]=data;
                    return {}
                    
                })
                setPatients(arrayPatients);
               
            }
        })
        return () => {
            
        }
    }, [])

    
    const viewOnChange=(e)=>{
        
        setViewFilter({ estado:e.target.value});
        console.log(viewFilter);
        
    }


 
    
    return (


        <div className="estudios-content">

                <select name="estado" onChange={viewOnChange} multiple="" className="ui fluid dropdown">
                <option value="todos">Todos</option>
                <option value="enviarPresupuesto">Estudios sin presupuesto enviado</option>
                <option value="esperandoComprobante">Estudios sin recibir comprobante de pago</option>
                <option value="enviarConsentimiento">Estudios sin enviar consentimiento</option>
                <option value="esperandoConsentimiento">Estudios sin recibir consentimiento informado</option>
                <option value="esperandoTurno">Estudios sin turno</option>
                <option value="esperandoTomaDeMuestra">Estudios sin toma de muestra</option>
                <option value="esperandoRetiroDeMuestra">Estudios con muestra sin retirar</option>
                <option value="esperandoLote">Estudios esperando lote</option>
                
                
            </select>



            {filterStates&& filterStates?.map((exams, data)=>{
                
                return( 
                    <>
                    
                      {exams==="enviarPresupuesto" && filterStates[exams].length>0 && (viewFilter.estado==="enviarPresupuesto"||viewFilter.estado==="todos") && <h3>Estudios que requieren enviar presupuesto</h3>}
                      {exams==="enviarConsentimiento" &&  filterStates[exams].length>0 && (viewFilter.estado==="enviarConsentimiento"||viewFilter.estado==="todos") &&<h3>Estudios que requieren enviar consentimiento para su firma</h3>}
                      {exams==="esperandoComprobante" &&  filterStates[exams].length>0 && (viewFilter.estado==="esperandoComprobante"||viewFilter.estado==="todos") && <h3>Estudios impagos</h3>}
                      {exams==="esperandoConsentimiento" &&  filterStates[exams].length>0 && (viewFilter.estado==="esperandoConsentimiento"||viewFilter.estado==="todos") && <h3>Estudios que esperan recibir consentimiento firmado </h3>}
                      {exams==="esperandoTurno" &&  filterStates[exams].length>0 && (viewFilter.estado==="esperandoTurno"||viewFilter.estado==="todos") &&<h3>Estudios sin turno </h3>}
                      {exams==="esperandoTomaDeMuestra" &&  filterStates[exams].length>0 && (viewFilter.estado==="esperandoTomaDeMuestra"||viewFilter.estado==="todos") &&<h3>Estudios a la espera de la toma de muestra </h3>}
                      {exams==="esperandoRetiroDeMuestra" &&  filterStates[exams].length>0 && (viewFilter.estado==="esperandoRetiroDeMuestra"||viewFilter.estado==="todos") && <h3>Estudios a la espera del retiro de muestra </h3>}
                      {exams==="esperandoLote" &&  filterStates[exams].length>0 && (viewFilter.estado==="esperandoLote"||viewFilter.estado==="todos") && <h3>Estudios a la espera de lote de muestras </h3>}

                    <div className="section-state">

                            
                        
                            
                            {filterStates[exams].map(exam=>{
                            
                                        return( 
                                            <>
                                            {(viewFilter.estado===exams||viewFilter.estado==="todos") && <div className="contenedor-tarjeta">
                                                <div className="ui card">
                                                        
                                                            {patients &&<div className="header">{patients[exam.idPatient].nombreCompleto}  
                                                            
                                                                    <Button
                                                                        as={Link}
                                                                        primary
                                                                        size="mini"
                                                                        to={`/exam/${exam.id}`}
                                                                    >
                                                                        <Icon name="eye" />
                                                                        Ver Detalles
                                                                    </Button>
                                                            
                                                            
                                                            
                                                            </div>}
                                                        
                                                        
                                                        <div className="content">
                                                            <h4 className="ui sub header">Estudios</h4>
                                                            <ol className="ui list">
                                                            {exam.arraySelected==="true"&&( <li value="*" key="array">Array</li>)}
                                                            {exam.genomaSelected==="true"&&( <li value="*"key="genoma">Genoma</li>)}
                                                            {exam.cariotipoSelected==="true"&&( <li value="*" key="cariotipo">Cariotipo</li>)}
                                                            {exam.exomaSelected==="true"&&( <li value="*" key="exoma">Exoma</li>)}
                                                            {exam.carrierSelected==="true"&&( <li value="*" key="carrier">Carrier</li>)}
                                                                
                                                            </ol>
                                                            <h4 className="ui sub header">Medico Derivante:</h4>
                                                            <ol className="ui list">
                                                                {doctors && <li key="medic" value="*">{doctors[exam.idMedic]}</li>}
                                                            </ol>
                                                            
                                                            
                                                        </div>
            
                                                        {exams==="enviarPresupuesto" && <EnviarPresupuesto user={user} exam={exam} setReloading={setReloading}/>}
                                                        {exams==="enviarConsentimiento" && <EnviarConsentimiento  user={user} exam={exam} setReloading={setReloading} />}
                                                        {exams==="esperandoComprobante" && <SubirComprobante user={user} exam={exam} setReloading={setReloading}/>}
                                                        {exams==="esperandoConsentimiento" && <SubirConsentimiento user={user} exam={exam} setReloading={setReloading}/>}
                                                        {exams==="esperandoTurno" && <ReservarTurno user={user} exam={exam} setReloading={setReloading}/>}
                                                        {exams==="esperandoTomaDeMuestra" && <TomarMuestra user={user} exam={exam} setReloading={setReloading}/>}
                                                        {exams==="esperandoRetiroDeMuestra" && <RetirarMuestra user={user} exam={exam} setReloading={setReloading}/>}
                                                        
                                                </div>
                                                
                                        </div>}
                                        </>
                                        );

                        })}
                </div>
                </>
            )
            })}
            
             
        </div>
    )
}


