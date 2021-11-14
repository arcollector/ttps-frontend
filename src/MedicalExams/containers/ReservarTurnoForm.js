//LIBRERIAS
import React, { useState, useEffect } from 'react';
import {Form, Button, } from 'semantic-ui-react';
import {toast} from 'react-toastify';
import DatePicker from "react-widgets/DatePicker";
import DropdownList from "react-widgets/DropdownList";
import twix from 'twix';
import moment from 'moment';
import saveState from '../../shared/helpers/saveState';

//BASE DE DATOS
import { db } from '../../shared/utils/Firebase';

//SCSS
import '../../Appointments/styles/AppointmentNewForm.scss'
import "react-widgets/scss/styles.scss";


//INICIALIZACIONES

moment.locale('es');

const now= moment().minutes(0).seconds(0).add(1,'hours');
// const nowPlus1=now.clone().add(1,'hours');
// const nowPlus7=now.clone().add(7,'hours');

export default function ReservarTurnoForm(props) {

    const {user, setShowModal, exam, setReloading}= props;
    const [dateStart, setDateStart] = useState(now.toDate());
    const [formData, setFormData] = useState(initialValues());
    const [isLoading, setIsLoading] = useState(false);
    const [reserved, setReserved] = useState([]);
    const [reloadingShifts, setReloadingShifts] = useState(true);





    useEffect(() => {
        const refMedicExams= db.collection("shifts");
        refMedicExams.get().then(doc=>{
             
            let shiftReserved=[];
            if(!doc.empty){
                
                doc.docs.map((docActual)=>{
                    const data=docActual.data();
                    
                    
                    shiftReserved[data.hour+data.date]=true;
                    return {}
                })
               
                
                
                setReserved(shiftReserved);
                
               
            }
        })
        return () => {
            
        }
    }, [reloadingShifts])
    


    const getTimeList=()=>{
        const horario= now.hours(8).minutes(0).twix(now.clone().add(7,'hours'));
        horario.format({hourFormat: "hh"})
        let iter=horario.iterate(15, 'minutes');
        let turnos=[];
        
        while(iter.hasNext()){
            
            turnos.push(iter.next().format('HH:mm'));
        }
        
        
        
        
        return turnos; 
    
    }

    const handleDateChange=(e)=>{
        
        setDateStart(e);
        setFormData({
            ...formData,
            date:e.toLocaleDateString()
        })
    }

    const handleHourChange=(e)=>{
        setFormData({
            ...formData,
            hour:e
        })
    }


    const onSubmit=()=>{
        
        
        if(reserved[formData.hour+formData.date]){
            
            toast.warning('El turno elegido no esta disponible')
        }else{
                        
            setIsLoading(true);
                        
            db.collection("shifts").add({
                idMedicExam:exam.id,
                date:formData.date,
                hour:formData.hour,
                idPatient:exam.idPatient,

            }).then(()=>{

                return saveState("esperandoTomaDeMuestra", user.displayName, exam.id)
            
            }).then(idState=>{
                console.log(exam.id);
                var refMedicExam = db.collection('medicExams').doc(exam.id);
                return refMedicExam.update({
                    idState:idState
                });
                    
            }).then(() => {
                toast.success("El turno fue reservado")
                let arrayReserved=reserved;
                arrayReserved[formData.hour+formData.date]=true;
                setReserved(arrayReserved);
                setReloading((v) => !v);

            }).catch(()=>{
                toast.error("Hubo un error en la reserva del turno. Vuelva a intentarlo")
            }).finally(() => {
                setIsLoading(false);
                setShowModal(false);
                setReloadingShifts((v) => !v);
            });
        }
            
        
            
    }



   

    return (
        <Form className="add-medic-exam-form" onSubmit={onSubmit}>

           

           

            <div className="header-section">
                
                <label>Fecha y hora del turno</label>
                            
                            <Form.Field>
                                <DatePicker
                                    onChange={handleDateChange}
                                    defaultValue={dateStart}
                                    
                                    
                                />
                            </Form.Field>
                            <Form.Field>
                                <DropdownList
                                    data={getTimeList()}
                                    onChange={handleHourChange}
                                    className="w-2/5 mt-0"
                                />
                            </Form.Field>
            </div>
            <Button type="submit" loading={isLoading}>Reservar Turno</Button>
        </Form>
    )
}


function initialValues(){
    return ({
        
        patologia:"",
        date:"",
        hour:""
        
        
    })
}
