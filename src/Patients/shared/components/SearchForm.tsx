import React from 'react';
import {Button} from 'semantic-ui-react';
import { Patient } from '../../interfaces'
import * as actions from '../actions'

type Props = {
  onSearch: (patient: Patient | null) => any,
};

export function SearchForm(props: Props) {
  const [ dni, setDni ] = React.useState('');

  const searchPatient = async () => {
    try {
      props.onSearch(await actions.searchPatientByDni(dni));
    } catch (e) {
    }
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDni(e.target.value);
  }

  return (
    <div className="ui search">
      <div className="ui icon input">
          <input
            className="prompt"
            name="search"
            type="text"
            onChange={onChange}
            placeholder="Dni del paciente..."
            value={dni}
          />
          <i
            className="search icon"
            onClick={searchPatient}
          ></i>
      </div>
      <Button
        type="button"
        onClick={searchPatient}
      >
        Buscar
      </Button>
    </div>
  );
}
