import React, { useEffect, useState } from 'react'
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import { Button } from 'semantic-ui-react';

import {messagesSPA} from '../../shared/helpers/calendar-lang-es';
import { Modal } from '../../shared/components/Modal';
import { AppointmentNewForm } from './AppointmentNewForm';


//BASE DE DATOS
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';





import 'moment/locale/es';

import '../styles/AppointmentsSchedule.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-widgets/scss/styles.scss";



moment.locale('es');

const db= firebase.firestore(firebase);

// const events=[{
//     title:'Paciente: yabran',
//     start:moment().toDate(),
//     end:moment().add(30,'minutes').toDate(),
//     bgcolor:'#fafafa',
//     user:{
//         name:'Fer'
//     }
// }];

const localizer= momentLocalizer(moment);


export function AppointmentsSchedule() {

    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [patients, setPatients] = useState(null);
    const [events, setEvents] = useState([]);
    const [reserved, setReserved] = useState([]);
    const [reloading, setReloading] = useState(false);


    const [lastView, setLastView] = useState( localStorage.getItem('lastView')|| 'month');

    //const startDate= moment().minutes(0).seconds(0).add(1,'hours');
    
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
    
    useEffect(() => {
        const refMedicExams= db.collection("shifts");
        refMedicExams.get().then(doc=>{
            let arrayEvents=[]; 
            let shiftReserved=[];
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    data.id=docActual.id;
                    arrayEvents.push(data);
                    
                    shiftReserved[data.hour+data.date]=true;
                    return {}
                })
               
                setEventos(arrayEvents);
                
                setReserved(shiftReserved);
                
               
            }
        })
        return () => {
            
        }
    }, [reloading])

    useEffect(() => {
        let arrayEvents=[];
        
        let hora;
        let minutos;
        
        eventos.map(eventoActual=>{
            let evento={};
            hora=parseInt(eventoActual.hour.substr(0,2));
            minutos=parseInt(eventoActual.hour.substr(3,5))
            
            
            evento.title=patients[eventoActual.idPatient].nombreCompleto;
            evento.start=moment(eventoActual.date, "L").hour(hora).minutes(minutos).toDate();
            evento.end=moment(eventoActual.date, "L").hour(hora).minutes(minutos+15).toDate();
            evento.bgcolor='#fafafa';
            evento.user={ name:'Fer' }
            
            arrayEvents.push(evento);

            return{}
        })
        setEvents(arrayEvents);
        return () => {
            
        }
    }, [eventos,patients])

    

    const onDoubleClick=(event)=>{
        console.log("doble click");
        console.log(event);
    }

    const onSelectEvent=(event)=>{
        console.log("evento seleccionado");
    }

    const onViewChange=(event)=>{
        setLastView(event);
        localStorage.setItem('lastView', event);
    }


    const handlerModal=(event)=>{
        
        setTitleModal("Nuevo Turno");
        setContentModal(<AppointmentNewForm reserved={reserved} setReserved={setReserved} setShowModal={setShowModal} setReloading={setReloading}/>);
        setShowModal(true);
    }

    


    return (
        <div className="calendar-screen">
            <Calendar
                localizer={localizer}
                messages={messagesSPA}
                events={events}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                view={lastView}
                startAccessor="start"
                endAccessor="end"
                onDoubleClick={onDoubleClick}
                
            
            />
            <Modal
                show={showModal}
                setShow={setShowModal}
                title={titleModal}
            >
                {contentModal}
            </Modal>
            <Button onClick={handlerModal}>Agregar Turno</Button>

        </div>
    )
}
