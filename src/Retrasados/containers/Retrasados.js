import React, {useEffect, useState} from 'react';
import { db } from "../../shared/utils/Firebase";

import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);


export default function Retrasados() {

    
    
    const [estadosConMuestra, setEstadosConMuestra] = useState(null);
    const [conjuntoFinalizados, setConjuntoFinalizados] = useState(null);
    const [conjuntoIdsMuestra, setConjuntoConjuntoIdsMuestra] = useState(null);
    const [idsPotenciales2, setIdsPotenciales2] = useState(null);
    const [exam, setExam] = useState(null);

    let idsPotenciales;
    let conjunto = new Set(conjuntoFinalizados);
    let conjuntoConMuestra = new Set(conjuntoIdsMuestra);
   
    useEffect(() => {
        const states=db.collection('states').where('name', '==', 'esperandoRetiroDeMuestra');
        states.get().then(conMuestra=>{
            let arregloMuestra=[];
            let arregloIds=[];
            let estadoEsperando;
            conMuestra.docs.map(doc=>{
                estadoEsperando=doc.data();
                estadoEsperando.id=doc.id;
                arregloMuestra[doc.data().idMedicExam]=estadoEsperando;
                arregloIds.push(doc.data().idMedicExam);
            })
            setEstadosConMuestra(arregloMuestra);
            setConjuntoConjuntoIdsMuestra(arregloIds)
        })
        const states2=db.collection('states').where('name', '==', 'finalizado');
        states2.get().then(finalizados=>{
            let arregloConjunto=[]
            finalizados.docs.map(estado=>{
               
                arregloConjunto.push(estado.data().idMedicExam);
            })
            setConjuntoFinalizados(arregloConjunto);
           
        })

        // la diferencia puede ser simulada con
       
           
        return () => {
           
        }
    }, [])
   
    for (var elem of conjunto) {
        conjuntoConMuestra.delete(elem);
    }
    
    

    return (
        <div>
        {conjuntoIdsMuestra?.map((elem,i)=>{
           if(conjuntoConMuestra.has(elem)){
               let day=estadosConMuestra[elem].day;
               let month=estadosConMuestra[elem].month;
               let year=estadosConMuestra[elem].year;
               const start = new Date(year, month-1, day);
               const end=new Date();

               
               
               const range = moment.range(start, end);
                if(range.diff('days')>30 ){

                    
                        return (
                            <ul>
                                <li><ExamenRetrasado id={elem}/></li>
                            </ul>
                        )
                    

                    
               }
                
           }
        })}
    </div>
    )


    

}

export  function ExamenRetrasado(props) {

    const {id}=props;

    
    const [examen, setExamen] = useState(null);
    useEffect(() => {
        
        const doc=db.collection('medicExams').doc(id);
        doc.get().then(exam=>{
            setExamen(exam.data());
        })
       
           
        return () => {
           
        }
    }, [])

    return (
        <>
        {examen!=null &&
            <div>
                 <h4>Fecha de toma de muestra: {examen?.fechaCompleta}</h4>
                 <h4>Tipo de examen: {examen?.examSelected}</h4>
                <a href={`/exam/${id}`}> ir al estudio</a>
            </div>
        
        }
       
        </>
    )

}


