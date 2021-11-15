
//LIBRERIAS
import React, { useState, useEffect } from 'react';
import {Form, Button, } from 'semantic-ui-react';
import {toast} from 'react-toastify';
import DatePicker from "react-widgets/DatePicker";
import DropdownList from "react-widgets/DropdownList";
import moment from 'moment';

//BASE DE DATOS
import { db } from '../../shared/utils/Firebase';

//SCSS
import '../styles/AppointmentNewForm.scss'
import "react-widgets/scss/styles.scss";

import {  actions as insurersActions } from '../../Insurers';
import * as actions from '../actions'
import { Patients, helpers as patientsHelpers } from '../../Patients'

//INICIALIZACIONES

moment.locale('es');

const now= moment().minutes(0).seconds(0).add(1,'hours');
// const nowPlus1=now.clone().add(1,'hours');
// const nowPlus7=now.clone().add(7,'hours');


export function AppointmentNewForm(props) {

    const {reserved, setReserved, setShowModal, setReloading}= props;
    const [dateStart, setDateStart] = useState(now.toDate());
    const [formData, setFormData] = useState(initialValues());
    const [paciente, setPaciente] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [exams, setExams] = useState(null);
    const [examSelected, setExamSelected] = useState("");
    const [ insurers, setInsurers ] = React.useState([]);
    const [ patientInsurer, setPatientInsurer ] = React.useState(null);

    React.useEffect(() => {
      (async () => {
        setInsurers(await insurersActions.getAllInsurers());
      })();
    }, []);

    const onSearchPatient = (patient) => {
        setPaciente(patient);
    };

    useEffect(() => {
        if(!paciente) {
            return;
        }
        (async () => {
            try {
                const arrayExams = await actions.getPatientMedixExams(paciente.id.toString());
                setExams(arrayExams);
                setExamSelected(arrayExams[0].id);
            } catch(e) {
            }
        })();
    }, [paciente])

    useEffect(() => {
        setPatientInsurer(
            patientsHelpers.getPatientInsurer(paciente, insurers)
        );
    }, [paciente, insurers]);
    
    const onSubmit=()=>{
        if(reserved[formData.hour+formData.date]){
            
            toast.warning('El turno elegido no esta disponible')
        }else{

            if(!paciente){
                toast.warning('Debe ingresar el dni de un paciente');
            }
            else{
                    if(!examSelected){
                        toast.warning('Debe seleccionar un estudio')
                    }else{
                        setIsLoading(true);
                        
                        db.collection("shifts").add({
                            idMedicExam:examSelected,
                            date:formData.date,
                            hour:formData.hour,
                            idPatient:paciente.id
    
                        }).then(()=>{
                            toast.success("El turno fue reservado")
                            let arrayReserved=reserved;
                            arrayReserved[formData.hour+formData.date]=true;
                            setReserved(arrayReserved);
                        }).catch(()=>{
                            toast.error("Hubo un error en la reserva del turno. Vuelva a intentarlo")
                        }).finally(()=>{
                            setIsLoading(false);
                            setShowModal(false);
                            setReloading((v) => !v);
                        })
                    }
            }
        }
            
    }
        
    


    const getTimeList=()=>{
        const temp = now.hours(8).minutes(0);
        // this is because test broken with twix
        if (temp.twix) {
            const horario= temp.twix(now.clone().add(7,'hours'));
            horario.format({hourFormat: "hh"})
            let iter=horario.iterate(15, 'minutes');
            let turnos=[];
            
            while(iter.hasNext()){
                
                turnos.push(iter.next().format('HH:mm'));
            }
            
            
            
            
            return turnos; 
        }
    }

    const handleDateChange=(e)=>{
        
        setDateStart(e);
        setFormData({
            ...formData,
            date:e.toLocaleDateString()
        })
    }

    const handlerMedicExamSelected=(e)=>{
        
        setExamSelected(e.target.value);
        
    }

    const handleHourChange=(e)=>{
        setFormData({
            ...formData,
            hour:e
        })
    }

    


    return (
        <Form className="add-medic-exam-form" onSubmit={onSubmit}>

            <Patients.SearchForm
                onSearch={onSearchPatient}
            />

            <div className="header-section">
                <h4>Datos del paciente</h4>
            </div>

            <div className="two-columns">
                <Form.Field>
                    <div>
                        Nombre y apellido: {paciente?.nombre} {paciente?.apellido}
                    </div> 
                </Form.Field>

                <Form.Field>
                    <div>
                        Obra social: {patientInsurer ? patientInsurer.nombre : ''}
                    </div> 
                </Form.Field>
            </div>
            
            <div className="three-columns">
                <Form.Field>
                    <div>Dni: {paciente?.dni}</div> 
                  

                </Form.Field>
                <Form.Field>
                    <div>Cod Area: {paciente?.code}</div> 
                   

                </Form.Field>
                <Form.Field>
                    <div>Telefono: {paciente?.telefono}</div> 
                   

                </Form.Field>
            </div>

            <div className="header-section">
                <h4>Estudios sin turno</h4>

                <Form.Field>

                        


                            <select multiple={false} onChange={handlerMedicExamSelected} name="exam" className="ui fluid normal dropdown">
                            {exams?.map(exam=>{
                                return <option  key={exam?.id} value={exam?.id}>{`${exam?.fechaCompleta} ${exam?.patology}`}</option>
                            })}
                            
                            
                            </select>
                </Form.Field>



            </div>

            <div className="header-section">
                <h4>Datos del turno</h4>
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
        search:"",
        date:"",
        hour:""
        
        
    })
}
