import React, { useState, useEffect } from "react";
import "../styles/SideBar.scss";
import { Menu, Icon } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";

import { Modal } from "../../../shared/components/Modal";
import { MedicalExamNewForm } from "../../../MedicalExams";
import { User } from "../../../Auth";
import { FirebaseUser } from "../../../shared/firebase";

type Props = {
  user: FirebaseUser;
  userFromFirestore: User;
};

export function SideBar(props: Props) {
  const { user, userFromFirestore } = props;
  const userRole = userFromFirestore.role;
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState<string | null>(null);
  const [contentModal, setContentModal] = useState<React.ReactNode>(null);

  useEffect(() => {
    setActiveMenu(location.pathname);
    return () => {};
  }, [location]);

  const handlerMenu = (event: any, menu: any) => {
    setActiveMenu(menu.to);
  };

  const handlerModal = (type: string) => {
    switch (type) {
      case "estudio":
        setTitleModal("Nuevo Estudio");
        setContentModal(
          <MedicalExamNewForm user={user} setShowModal={setShowModal} />
        );
        setShowModal(true);
        break;

      default:
        setTitleModal(null);
        setShowModal(false);
        setContentModal(null);
        break;
    }
  };

  return (
    <>
      <Menu className="menu-left" vertical>
        <div className="top">
          <Menu.Item
            as={Link}
            to="/"
            active={activeMenu === "/"}
            onClick={handlerMenu}
          >
            <Icon name="home" /> Inicio
          </Menu.Item>

          <Menu.Item
            as={Link}
            to={{
              pathname: "/estudios",
              data: [user], // your data array of objects
            }}
            active={activeMenu === "/estudios"}
            onClick={handlerMenu}
          >
            <Icon name="file outline" /> Estudios
          </Menu.Item>
          {userRole === "admin" && (
            <>
              <Menu.Item
                as={Link}
                to={{
                  pathname: "/lotes",
                  data: [user], // your data array of objects
                }}
                active={activeMenu === "/lotes"}
                onClick={handlerMenu}
              >
                <Icon name="archive" /> Lotes
              </Menu.Item>

              <Menu.Item
                as={Link}
                to="/turnos"
                active={activeMenu === "/turnos"}
                onClick={handlerMenu}
              >
                <Icon name="calendar alternate outline" /> Turnos
              </Menu.Item>

              <Menu.Item
                as={Link}
                to="/pago"
                active={activeMenu === "/pago"}
                onClick={handlerMenu}
              >
                <Icon name="dollar sign" />
                Pago de extracciones
              </Menu.Item>

              <Menu.Item
                as={Link}
                to="/pacientes"
                active={activeMenu === "/pacientes"}
                onClick={handlerMenu}
              >
                <Icon name="user outline" />
                Pacientes
              </Menu.Item>

              <Menu.Item as={Link} to="/obra-sociales">
                <Icon name="database" />
                Obra sociales
              </Menu.Item>

              <Menu.Item
                as={Link}
                to="/"
                onClick={() => handlerModal("estudio")}
              >
                <Icon name="plus square outline" />
                Crear Nuevo Estudio
              </Menu.Item>

              <Menu.Item as={Link} to="/pacientes/crear">
                <Icon name="plus square outline" />
                Agregar Nuevo Paciente
              </Menu.Item>

              <Menu.Item as={Link} to="/reportes">
                <Icon name="chart bar" />
                Reportes
              </Menu.Item>

              <Menu.Item as={Link} to="/retrasados">
                <Icon name="window close" />
                Estudios retrasados
              </Menu.Item>
            </>
          )}
        </div>
      </Menu>

      <Modal show={showModal} setShow={setShowModal} title={titleModal}>
        {contentModal}
      </Modal>
    </>
  );
}