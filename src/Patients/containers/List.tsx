import React from "react";
import { Icon, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { Patient } from "../interfaces/types";
import * as actions from "../actions";

export function List() {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  React.useEffect(() => {
    (async () => {
      setPatients(await actions.getAllPatients());
    })();
  }, []);

  return (
    <div>
      <h1>Listado de pacientes</h1>
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Nombre completo</th>
            <th>DNI</th>
            <th>Telefono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, i) => (
            <tr key={i}>
              <td data-label="nombre completo">
                {patient.nombre} {patient.apellido}
              </td>
              <td data-label="dni">{patient.dni}</td>
              <td data-label="telefono">{patient.telefono}</td>
              <td data-label="email">{patient.email}</td>
              <td data-label="acciones">
                <Button
                  as={Link}
                  primary
                  size="mini"
                  to={`/pacientes/${patient.id}`}
                >
                  <Icon name="eye" />
                  Ver ficha
                </Button>

                {patient.idTutor && (
                  <Button
                    as={Link}
                    info
                    size="mini"
                    to={`/tutores/${patient.idTutor}`}
                  >
                    <Icon name="eye" />
                    Ver tutor
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
