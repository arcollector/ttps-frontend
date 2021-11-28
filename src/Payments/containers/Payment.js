import React, { useEffect, useState } from 'react';
import '../styles/payment.scss';
import * as actions from '../actions';

export default function Payment() {
    const [exams, setExams] = useState(null);
    const [reloading, setReloading] = useState(false);

    useEffect(() => {
        (async () => {
            setExams(await actions.getExamsWithExtractions());
        })();
    }, [reloading])

    const onClick = async (e) => {
        try {
            const id=e.target.id;
            await actions.confirmPayment(id);
        } catch (e) {
            console.error(e);
        } finally {
            setReloading((v) => !v);
        }
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
