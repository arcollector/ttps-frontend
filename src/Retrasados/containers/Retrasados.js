import React, {useEffect, useState} from 'react';
import { db } from "../../shared/utils/Firebase";

export default function Retrasados() {

    
    
    const [estadosConMuestra, setEstadosConMuestra] = useState(null);
    const [conjuntoFinalizados, setConjuntoFinalizados] = useState(null);
    const [conjuntoIdsMuestra, setConjuntoConjuntoIdsMuestra] = useState(null);


    let conjunto = new Set(conjuntoFinalizados);
    let conjuntoConMuestra = new Set(estadosConMuestra);
   
    useEffect(() => {
        const states=db.collection('states').where('name', '==', 'esperandoRetiroDeMuestra');
        states.get().then(conMuestra=>{
            let arregloMuestra=[];
            let arregloIds=[];
            let estadoEsperando;
            conMuestra.docs.map(doc=>{
                estadoEsperando=doc.data();
                estadoEsperando.id=doc.id;
                arregloMuestra.push(estadoEsperando);
                arregloIds.push(doc.id);
            })
            setEstadosConMuestra(arregloMuestra);
            setConjuntoConjuntoIdsMuestra(arregloIds)
        })
        const states2=db.collection('states').where('name', '==', 'finalizado');
        states2.get().then(finalizados=>{
            let arregloConjunto=[]
            finalizados.docs.map(estado=>{
               
                arregloConjunto.push(estado.id);
            })
            setConjuntoFinalizados(arregloConjunto);
           
        })
        return () => {
           
        }
    }, [])
   
    
    
    console.log(conjuntoIdsMuestra);
    console.log(conjuntoFinalizados);



    return (
        <div>
        {conjuntoFinalizados&&<h1>{conjuntoFinalizados[0]}</h1>}
    </div>
    )


    

}

