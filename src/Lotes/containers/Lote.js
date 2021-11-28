import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import '../styles/lote.scss';
import * as actions from '../actions';


export default function Lote() {

    const { id : loteId } = useParams();
    const [lote, setLote] = useState(null);
    
   
    useEffect(() => {
	    (async () => {
	       setLote(await actions.getLote(loteId));
	    })();
    }, [])
    
    

    
    return (
       
            <>
                <div className="content-lote">
                    {lote&&<h2>Estudios del lote {lote.numLote}</h2>}
                    
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam1}`}  >Estudio 1</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam2}`}  >Estudio 2</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam3}`}  >Estudio 3</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam4}`}  >Estudio 4</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam5}`}  >Estudio 5</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam6}`}  >Estudio 6</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam7}`}  >Estudio 7</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam8}`}  >Estudio 8</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam9}`}  >Estudio 9</a></p>}
                    {lote&&<p><a  href={`/exam/${lote?.idMedicExam10}`}  >Estudio 10</a></p>}

                    {lote?.urlResultado!==""&&<p><strong>Resultado url: </strong><a target="_blank" href={lote?.urlResultado}>ver resultado</a> <strong>Fecha del resultado: </strong><i>{lote?.fechaResultado}</i>  <strong>Realizado por: </strong><i>{lote?.userResultado}</i></p>}
                    
                    
                </div>
            </>
        
    )
}
