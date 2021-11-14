import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom';

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import '../styles/Exam.scss';

const db= firebase.firestore(firebase);




export default function Exam() {

    const { id : examId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [exam, setExam] = useState(null);
    const [patient, setPatient] = useState(null);
    const [state, setState] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [sample, setSample] = useState([]);
    const [shift, setShift] = useState([])
    
    useEffect(() => {

        let examen;
        let medico;
        let paciente;
        let estado;
        let estados=[];
        let muestra;
        let turno;
        var refMedicExam = db.collection('medicExams').doc(examId);
        refMedicExam.get().then(doc=>{
            examen=(doc.data());
            examen.id=doc.id;
            setExam(examen);
            var refMedic= db.collection('doctors').doc(examen.idMedic);
            refMedic.get().then(doc=>{
                medico=(doc.data());
                setDoctor(medico);
            });
            var refPatient= db.collection('patients').doc(examen.idPatient);
            refPatient.get().then(doc=>{
                paciente=(doc.data());
                setPatient(paciente);
            });
            var refState= db.collection('states').doc(examen.idState);
            refState.get().then(doc=>{
                estado=(doc.data());
                setState(estado);
            });
            const refDocs= db.collection('states').where("idMedicExam","==",examen.id);
            refDocs.get().then(result=>{
                
                result.docs.map(doc=>{
                    estados[doc.data().name]=(doc.data());
                    estados[doc.data().name].id=doc.id
                    
                    return{}
                })
                
                setHistorial(estados);
                if(estados["esperandoLote"]!==undefined){
                    var refSamples= db.collection('medicalSamples').where("idMedicExam", "==",  examen.id);
                    refSamples.get().then(doc=>{
                     muestra=(doc.docs[0].data());
                     setSample(muestra);
                    
                    });
                }
                if(estados["esperandoTomaDeMuestra"]!==undefined){
                    var refShifts= db.collection('shifts').where("idMedicExam", "==",  examen.id);
                    refShifts.get().then(doc=>{
                     turno=(doc.docs[0].data());
                     setShift(turno);
                    
                    });
                }
            });
            var refState= db.collection('states').doc(examen.idState);
            refState.get().then(doc=>{
                estado=(doc.data());
                setState(estado);
            });
            
        });
        
        

        return () => {
            
        }
    }, [])


console.log(sample);


    return (
        <div className="content-exam">
        {exam && historial["enviarPresupuesto"]!=="" &&
                
                    <><h2>Datos del Paciente</h2>
                        
                        <p><strong>Nombre y Apellido:</strong><i> {patient?.nombre} {patient?.apellido} </i></p>
                        <p><strong>Dni:</strong><i> {patient?.dni} </i></p>
                        <p><strong>Telefono:</strong><i> {patient?.telefono} </i></p>
                        <p><strong>Email:</strong><i> {patient?.email} </i></p>
                        
                     <h2>Datos del estudio:</h2>
                        <p><strong>Medico derivante: </strong><i> {doctor?.nombre} {doctor?.apellido} </i></p>
                        <p><strong>Examen medico a realizar: </strong><i>{exam?.examSelected} </i></p>
                        <p><strong>Estado actual del estudio: </strong><i>{state?.name} </i></p>

                    <h2>Historial:</h2> 
                    {historial["enviarPresupuesto"]!==undefined&&<><h5>Creacion del estudio medico</h5><p><strong>Realizado por:</strong> {historial["enviarPresupuesto"]?.employee} <strong>  fecha: </strong>{historial["enviarPresupuesto"]?.day}-{historial["enviarPresupuesto"]?.month}-{historial["enviarPresupuesto"]?.year}</p></>}
                    {historial["esperandoComprobante"]!==undefined&&<><h5>Envio de presupuesto</h5><p><strong>Realizado por:</strong> {historial["esperandoComprobante"]?.employee} <strong>  fecha: </strong>{historial["esperandoComprobante"]?.day}-{historial["esperandoComprobante"]?.month}-{historial["esperandoComprobante"]?.year}</p><p><strong>Precio: <i>{exam.price}</i></strong></p></>}
                    {historial["enviarConsentimiento"]!==undefined&&<><h5>Carga de comprobante de pago</h5><p><strong>Realizado por:</strong> {historial["enviarConsentimiento"]?.employee} <strong>  fecha: </strong>{historial["enviarConsentimiento"]?.day}-{historial["enviarConsentimiento"]?.month}-{historial["enviarConsentimiento"]?.year}</p></>}
                    {historial["esperandoConsentimiento"]!==undefined&&<><h5>Envio de consentimiento informado</h5><p><strong>Realizado por:</strong> {historial["esperandoConsentimiento"]?.employee} <strong>  fecha: </strong>{historial["esperandoConsentimiento"]?.day}-{historial["esperandoConsentimiento"]?.month}-{historial["esperandoConsentimiento"]?.year}</p></>}
                    {historial["esperandoTurno"]!==undefined&&<><h5>Carga de consentimiento informado</h5><p><strong>Realizado por:</strong> {historial["esperandoTurno"]?.employee} <strong>  fecha: </strong>{historial["esperandoTurno"]?.day}-{historial["esperandoTurno"]?.month}-{historial["esperandoTurno"]?.year}</p></>}
                    {historial["esperandoTomaDeMuestra"]!==undefined&&<><h5>Reserva de un turno</h5><p><strong>Realizado por:</strong> {historial["esperandoTomaDeMuestra"]?.employee} <strong>  fecha: </strong>{historial["esperandoTomaDeMuestra"]?.day}-{historial["esperandoTomaDeMuestra"]?.month}-{historial["esperandoTomaDeMuestra"]?.year}</p><p><strong>Fecha del turno: </strong> <i>{shift?.date}</i>   <strong>  Hora: </strong><i>{shift?.hour}</i></p></>}
                    {historial["esperandoLote"]!==undefined&&<><h5>Extraccion de la muestra</h5><p><strong>Realizado por:</strong> {historial["esperandoLote"]?.employee} <strong>  fecha: </strong>{historial["esperandoLote"]?.day}-{historial["esperandoLote"]?.month}-{historial["esperandoLote"]?.year}</p><p><strong>Cantidad de ml: </strong> <i>{sample?.cantMl}</i>   <strong>  Freezer: </strong><i>{sample?.freezer}</i></p></>}
                    {historial["esperandoRetiroDeMuestra"]!==undefined&&<><h5>Conformacion del lote de muestras</h5><p><strong>Realizado por:</strong> {historial["esperandoRetiroDeMuestra"]?.employee} <strong>  fecha: </strong>{historial["esperandoRetiroDeMuestra"]?.day}-{historial["esperandoRetiroDeMuestra"]?.month}-{historial["esperandoRetiroDeMuestra"]?.year}</p></>}
                    
                      
                    </>
                
               
        }
        </div>
    )
}


function initialValues(){
    return {
            
            ["enviarPresupuesto"]:"",
            ["esperandoComprobante"]:"",
            ["enviarConsentimiento"]:"",
            ["enviarPresupuesto"]:"",
            ["esperandoConsentimiento"]:"",
            ["esperandoTurno"]:"",
            ["esperandoTomaDeMuestra"]:"",
            ["esperandoLote"]:"",
            ["esperandoRetiroDeMuestra"]:"",
            
            }
}
