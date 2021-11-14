import React, { useEffect, useState } from 'react'

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import '../styles/lotes.scss';

const db= firebase.firestore(firebase);

export function Lotes() {


    const [lotes, setLotes] = useState(null);

    useEffect(() => {
        const refLotes= db.collection("lotes");
        refLotes.get().then(doc=>{
            
            let arrayLotes=[]; 
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    data.id=docActual.id;
                    arrayLotes.push(data);
                    return {}
                    
                })
                setLotes(arrayLotes);
               
            }
        })
        return () => {
            
        }
    }, [])

    console.log(lotes);

console.log("hola");

    return  ( 
            <>
                    
                 <div className="estudios-content">

                     
                            
                        
                            
                            {lotes?.map((lote, id)=>{
                                        


                                                return(
                                                    
                                                <div className="section-state">
                                                    
                                                    <div className="contenedor-tarjeta">
                                                        <div className="ui card">
                                                                
                                                                    <div className="header">{`Lote ${id}`}</div>
                                                                
                                                                
                                                                <div className="content">
                                                                    <h4 className="ui sub header"></h4>
                                                                   
                                                                    <h4 className="ui sub header">Examenes medicos:</h4>
                                                                    <ol className="ui list">
                                                                        <li key={lote.idMedicExam1} >{lote.idMedicExam1}</li>
                                                                        <li key={lote.idMedicExam2} >{lote.idMedicExam2}</li>
                                                                    </ol>
                                                                </div>

                                                                {lote.state==="esperandoResultado" && <button  className="ui button" >Cargar resultado</button>}
                                                                
                                                        </div>
                                                        
                                                        
                                                </div>
                                            </div>)

                                        
                                                
                                        

                        })}
                    
                </div>
             </>
)
}
