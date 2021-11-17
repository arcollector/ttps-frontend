import React, { useEffect, useState } from 'react';

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/firestore';
import { patient } from '../../Patients/__data__';
import { Icon, Button } from 'semantic-ui-react';


import '../styles/payment.scss';

const db= firebase.firestore(firebase);

export default function Payment() {


    const [exams, setExams] = useState(null);
    const [reloading, setReloading] = useState(false);
    const [patients, setPatients] = useState(null);


    useEffect(() => {
        const refMedicExams=db.collection('medicExams').where('extraccion','==',true);
        
        let examenes=[];
        
        
        refMedicExams.get().then(result=>{
            let exam;
            result.docs.map(doc=>{
                if(!doc.data().pago){
                    exam=doc.data();
                    exam.id=doc.id;
                    examenes.push(exam);
                    
                }
                return{}
            })
            console.log(examenes);
            setExams(examenes);

                
            
                
            
            
            
        })
        console.log(examenes);
        

        return () => {
            
        }
    }, [reloading])


    useEffect(() => {
        let pacientes=new Map();
        exams?.map(examAux=>{
            
            const refPatient=db.collection('patients').doc(examAux.idPatient);
            refPatient.get().then(doc=>{
                
                pacientes.set(doc.id,doc.data());
            })
            return {}
        })
        console.log(pacientes);
        console.log(pacientes.size); 
        setPatients(pacientes);
        
        return () => {
            
        }
    }, [exams])

    const onClick=(e)=>{
       
        const id=e.target.id;
        const refDoc=db.collection('medicExams').doc(id);
        refDoc.update({
            pago:true,
        }).then(e=>{
            setReloading((v) => !v);
        })
       
    }

    

    return (
        <div className="ui inverted segment">
                <h2>Extracciones Impagas</h2>
                <div className="ui inverted relaxed divided list">

                    { exams?.map((exam, i)=>{
                        return(
                        <div key={i} className="item">
                            <div className="content">
                                <div className="header">estudio {i+1} </div>
                                <div className="boton" id={exam.id} onClick={onClick}> Pagar </div>
                            </div>
                        </div>
                        )
                    })}
                   
                </div>
        </div>
    )
}
