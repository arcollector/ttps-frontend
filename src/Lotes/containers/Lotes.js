import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import '../styles/lotes.scss';
import CargarResultado from './CargarResultado';

const db= firebase.firestore(firebase);

export function Lotes(props) {

    const {user}=props;
    const [lotes, setLotes] = useState(null);
    const [reloading, setReloading] = useState(false);

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
    }, [reloading])

 

    return  ( 
            <>
                    
                 <div className="estudios-content">

                     
                            
                        
                            
                            {lotes?.map((lote, id)=>{
                                        


                                                return(
                                                    
                                                <div key={id} className="section-state">
                                                    
                                                    <div className="contenedor-tarjeta">
                                                        <div className="ui card">
                                                                
                                                                    <div className="header">{`Lote ${lote.numLote}`}
                                                                    
                                                                    <Button
                                                                        as={Link}
                                                                        primary
                                                                        size="mini"
                                                                        to={`/lote/${lote.id}`}
                                                                    >
                                                                        <Icon name="eye" />
                                                                        Ver Detalles
                                                                    </Button>
                                                                    
                                                                    </div>
                                                                
                                                                
                                                                <div className="content">
                                                                    <h4 className="ui sub header"></h4>
                                                                   
                                                                    <h4 className="ui sub header">Examenes medicos:</h4>
                                                                    <ol className="ui list">
                                                                        <li key={lote.idMedicExam1} ><a href={`/exam/${lote?.idMedicExam1}`}>Estudio 1</a></li>
                                                                        <li key={lote.idMedicExam2} ><a href={`/exam/${lote?.idMedicExam2}`}>Estudio 2</a></li>
                                                                        <li key={lote.idMedicExam3} ><a href={`/exam/${lote?.idMedicExam3}`}>Estudio 3</a></li>
                                                                        <li key={lote.idMedicExam4} ><a href={`/exam/${lote?.idMedicExam4}`}>Estudio 4</a></li>
                                                                        <li key={lote.idMedicExam5} ><a href={`/exam/${lote?.idMedicExam5}`}>Estudio 5</a></li>
                                                                        <li key={lote.idMedicExam6} ><a href={`/exam/${lote?.idMedicExam6}`}>Estudio 6</a></li>
                                                                        <li key={lote.idMedicExam7} ><a href={`/exam/${lote?.idMedicExam7}`}>Estudio 7</a></li>
                                                                        <li key={lote.idMedicExam8} ><a href={`/exam/${lote?.idMedicExam8}`}>Estudio 8</a></li>
                                                                        <li key={lote.idMedicExam9} ><a href={`/exam/${lote?.idMedicExam9}`}>Estudio 9</a></li>
                                                                        <li key={lote.idMedicExam10} ><a href={`/exam/${lote?.idMedicExam10}`}>Estudio 10</a></li>
                                                                    </ol>
                                                                </div>

                                                                {lote.state==="esperandoResultado" && <CargarResultado lote={lote} user={user} setReloading={setReloading}/>}
                                                                {lote.state==="finalizado" && <h3 class="end">FINALIZADO</h3>}
                                                                
                                                        </div>
                                                        
                                                        
                                                </div>
                                            </div>)

                                        
                                                
                                        

                        })}
                    
                </div>
             </>
)
}
