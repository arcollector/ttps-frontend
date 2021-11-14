import React, { useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import {toast} from 'react-toastify';
import {Form, Input, Button, } from 'semantic-ui-react';
import DatePicker from "react-widgets/DatePicker";
import DropdownList from "react-widgets/DropdownList";
import twix from 'twix';




const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  Modal.setAppElement('#root');

  moment.locale('es');

  const now= moment().minutes(0).seconds(0).add(1,'hours');
  const nowPlus1=now.clone().add(1,'hours');
  const nowPlus7=now.clone().add(7,'hours');



  const horariodeatencion =now.twix(nowPlus7.add(7,'hours'));

export default function CalendarModal() {


    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateFinal, setDateFinal] = useState(nowPlus1.toDate());
    const [isLoad, setIsLoad] = useState(true);
    const [formValues, setFormValues] = useState({
        title:'',
        notes:'',
        start: now.toDate(),
        final:nowPlus1.toDate(),
    })

    const {title, notes, start, final}=formValues;

    const closeModal= ()=>{
        console.log('cerrando modal');
    }
    
    const handleStartDateChange=(e)=>{
        setDateStart(e);
        setFormValues({
            ...formValues,
            final:e
        })
    }

    const handleFinalDateChange=(e)=>{
        setDateFinal(e);
        setFormValues({
            ...formValues,
            start:e
        })
    }

    const handleInputChange=({target})=>{
        setFormValues({
            ...formValues,
            [target.name]:target.value
        });
    }

    const handleSubmitForm=(e)=>{
        e.preventDefault();

        const momentStart=moment(start);
        const momentFinal=moment(final);

        if(momentStart.isSameOrAfter(momentFinal)){
            toast.warning('La fecha fin debe ser mayor a la fecha de inicio');
        }

        if(title.trim().length<2){
            toast.warning('Debe ingresar un titulo');
        }

        closeModal();
        


    }

    const getTimeList=()=>{
        const horario= now.hours(8).twix(now.clone().add(7,'hours'));
        let iter=horario.iterate(30, 'minutes');
        let turnos=[];
        console.log(iter);
        while(iter.hasNext()){
            console.log('entre!')
            turnos.push(iter.next().format('LT'));
        }
        
        
        console.log(turnos)
        return turnos; 
    
    }

    return (
        <div>
            <Modal
                isOpen={isLoad}
                // onAfterOpen={afterOpenModal}
                // onRequestClose={closeModal}
                style={customStyles}
                closeTimeoutMS={200}
                contentLabel="Example Modal"
                className="modal"
                overlayClassName="modal-fondo"
            >    

                    <h1> Nuevo evento </h1>
                    <hr />
                    <Form className="add-medic-exam-form" onSubmit={handleSubmitForm}>
                        <div className="two-colums">

                            <label>Fecha y hora inicio</label>
                            
                            <Form.Field>
                                <DatePicker
                                    onChange={handleStartDateChange}
                                    defaultValue={dateStart}
                                    
                                />
                            </Form.Field>
                            <Form.Field>
                                <DropdownList
                                    data={getTimeList()}
                                    
                                    className="w-2/5 mt-0"
                                />
                            </Form.Field>
                            
                        </div>
                        <div className="flex space-x-2 w-full">
                            <label>Fecha y hora fin</label>
                            <DatePicker
                                onChange={handleFinalDateChange}
                                defaultValue={dateFinal}
                                min={dateStart}
                            />
                            <DropdownList
                                data={getTimeList()}
                               
                                className="w-2/5 mt-0"
                            />
                        </div>
                        

                        <hr />
                        <Form.Field>
                            <label>Titulo y notas</label>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Título del evento"
                                name="title"
                                value={title}
                                onChange={handleInputChange}
                                autoComplete="off"
                            />
                            <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                            </Form.Field>

                            <Form.Field>
                            <textarea 
                                type="text" 
                                className="form-control"
                                placeholder="Notas"
                                rows="5"
                                name="notes"
                                value={notes}
                                onChange={handleInputChange}
                            ></textarea>
                            <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                            </Form.Field>

                        <Button
                            type="submit"
                            className="btn btn-outline-primary btn-block"
                        >
                            <i className="far fa-save"></i>
                            <span> Guardar</span>
                        </Button>

                    </Form>



            </Modal>
        </div>
    )
}
