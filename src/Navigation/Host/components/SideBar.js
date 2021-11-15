import React, {useState, useEffect} from 'react';
import '../styles/SideBar.scss';
import {Menu, Icon} from 'semantic-ui-react';
import {Link, withRouter, Router} from 'react-router-dom';

//import {isUserAdmin} from '../../utils/Api';
import { Modal } from '../../../shared/components/Modal';
import { MedicalExamNewForm } from '../../../MedicalExams';
import { Patients } from '../../../Patients';

export function SideBarImpl(props) {

    const {user, location}= props;
    const [activeMenu, setActiveMenu] = useState(location.pathname);
   // const [userAdmin, setUserAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState(null);
    const [contentModal, setContentModal] = useState(null);


    // useEffect(() => {
        
    //     isUserAdmin(user.uid).then((response)=>{
    //         setUserAdmin(response);
    //     }).catch(err=>{
    //         console.log(err);
    //     });
    //     return () => {
            
    //     }
    // }, [user.uid])

    useEffect(() => {
        setActiveMenu(location.pathname);
        return () => {
            
        }
    }, [location])
   


    const handlerMenu=(event,menu)=>{
        
        setActiveMenu(menu.to);
    }

    const handlerModal= (type)=>{
        switch (type) {
            case "paciente":
                setTitleModal("Nuevo Paciente");
                setContentModal(<Patients.NewForm  user={user} setShowModal={setShowModal}/>);
                setShowModal(true);
                break;
            case "estudio":
                setTitleModal("Nuevo Estudio");
                setContentModal(<MedicalExamNewForm user={user} setShowModal={setShowModal}/>);
                setShowModal(true);
                break;
            
        
            default:
                setTitleModal(null);
                setShowModal(false);
                setContentModal(null);
                break;
        }
    }

    return (
        <>
            <Menu className="menu-left" vertical>
                <div className="top">
                    <Menu.Item 
                        as={Link} 
                        to="/"
                        active={activeMenu==="/"} 
                        onClick={handlerMenu}
                    >
                        <Icon name="home"/> Inicio
                    </Menu.Item>

                    <Menu.Item 
                        as={Link} 
                        to={{
                            pathname: "/estudios",
                            data: [user] // your data array of objects
                          }}
                        active={activeMenu==="/estudios"} 
                        onClick={handlerMenu}
                    >
                        
                        <Icon name="file outline"/> Estudios
                    </Menu.Item>
                    <Menu.Item 
                        as={Link} 
                        to={{
                            pathname: "/lotes",
                            data: [user] // your data array of objects
                          }}
                        active={activeMenu==="/lotes"} 
                        onClick={handlerMenu}
                    >
                        
                        <Icon name="archive"/> Lotes
                    </Menu.Item>

                    <Menu.Item 
                        as={Link} 
                        to="/turnos"
                        active={activeMenu==="/turnos"} 
                        onClick={handlerMenu}
                    >
                        <Icon name="calendar alternate outline"/> Turnos
                    </Menu.Item>

                    <Menu.Item 
                        as={Link} 
                        to="/pacientes"
                        active={activeMenu==="/pacientes"} 
                        onClick={handlerMenu}
                    >
                        <Icon name="user outline"/>
                        Pacientes
                    </Menu.Item>

                    <Menu.Item
                        as={Link}
                        to="/crearestudio"
                        onClick={()=>handlerModal("estudio")}
                    >
                        <Icon name="plus square outline"/>
                        Crear Nuevo Estudio
                    </Menu.Item>

                    <Menu.Item
                        as={Link}
                        to="/pacientes/crear"
                    >
                        <Icon name="plus square outline"/>
                        Agregar Nuevo Paciente
                    </Menu.Item>

                    <Menu.Item
                        as={Link}
                        to="/obra-sociales"
                    >
                        <Icon name="database"/>
                        Obra sociales  
                    </Menu.Item>

                    <Menu.Item as={Link} to="/reportes">
                        <Icon name="chart bar" />
                        Reportes
                    </Menu.Item>
                </div>
            </Menu>

            <Modal
                show={showModal}
                setShow={setShowModal}
                title={titleModal}
            >
                {contentModal}
            </Modal>
        </>
    );
}

export const SideBar = withRouter(SideBarImpl);
