import React, { useEffect, useState } from 'react';

import { useParams} from 'react-router-dom';
import { Link } from 'react-router-dom';
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

import '../styles/lote.scss';

const db= firebase.firestore(firebase);


export default function Lote() {

    const { id : loteId } = useParams();
    const [lote, setLote] = useState(null);
    
   
    useEffect(() => {
        let examenes=[];
        let lote;
        var refLote = db.collection('lotes').doc(loteId);
        refLote.get().then(doc=>{
            lote=(doc.data());
            lote.id=doc.id;
            setLote(lote);
            
            

        })
        return () => {
        
        }
    }, [])
    
    

    
    return (
       
            <>
                <div className="content-lote">
                    {lote&&<h2>Estudios del lote {lote.numLote}</h2>}
                    
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam1}`}  >Estudio 1</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam2}`}  >Estudio 2</a></p>}

                    {lote.url!==""&&<p><strong>Resultado url: </strong><a target="_blank" href={lote.url}>ver resultado</a> <strong>Fecha del resultado: </strong><i>{lote.fechaResultado}</i>  <strong>Realizado por: </strong><i>{lote.userResultado}</i></p>}
                    
                    
                </div>
            </>
        
    )
}
