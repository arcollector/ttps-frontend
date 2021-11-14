import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { Insurer } from '../interfaces';
import * as actions from '../actions';

export function List() {
  const [ insurers, setInsurers ] = React.useState<Insurer[]>([]);
  React.useEffect(() => {
    (async () => {
      setInsurers(await actions.getAllInsurers());
    })();
  }, []);

  return (
    <div>
      <h1>Listado de obra sociales</h1>
      <table className="ui celled table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insurers.map((insurer, i) =>
          <tr key={i}>
            <td data-label="nombre completo">
              {insurer.nombre}
            </td>
            <td data-label="acciones">
              <Button
                as={Link}
                primary
                size="mini"
                to={`/obra-sociales/${insurer.id}`}
              >
                <Icon name="eye" />
                Ver ficha
              </Button>
            </td>
          </tr>
          )}
        </tbody>
      </table>

      <hr />

      <Button
        as={Link}
        primary
        size="large"
        to={`/obra-sociales/crear`}
      >
        <Icon name="plus square outline" />
        Crear nueva obra social
      </Button>
    </div>
  );
}
