import React from 'react';
import * as SemanticUi from 'semantic-ui-react';
import * as yup from 'yup';

import { FormInput } from '../../shared/components/FormInput';
import { FormTextArea } from '../../shared/components/FormTextArea';
import { FormDropdown, Item } from '../../shared/components/FormDropdown';
import { FormDatePicker } from '../../shared/components/FormDatePicker';
import { Patient, emptyPatient } from '../interfaces/types';
import { validators, schema } from '../interfaces';
import { actions as actionsInsurers } from '../../Insurers';

type Props = {
  values?: Patient,
  onSubmitError: (errors: string[]) => any,
  onSubmit: (values: Patient) => any,
  isLoading: boolean,
  buttonText: string,
  disableDni?: boolean,
};

export function Form(props: Props) {
  const [ formData, setFormData ] = React.useState<Patient>(props.values || emptyPatient);

  React.useEffect(() => {
    if (props.values) {
      setFormData(props.values);
    }
  }, [props.values]);

  const onChange = (name: string, value: string) => {
    setFormData((v) => ({ ...v, [name]: value }));
  };

  const [ insurersAsItems, setInsurersAsItems ] = React.useState<Item[]>([]);
  React.useEffect(() => {
    (async () => {
      const insurers = await actionsInsurers.getAllInsurers();
      setInsurersAsItems(
        insurers.map((insurer) => ({
          text: insurer.nombre,
          key: insurer.id,
          value: insurer.id,
        }))
      );
    })();
  }, []);

  const [ numSocDisabled, setNumSocDisabled ] = React.useState(
    props.values?.idInsurer === ''
  );

  const onChangeInsurer = (_: string, item: Item | null) => {
    if (!item) {
      setFormData((v) => ({
        ...v,
        idInsurer: '',
        numsoc: '',
      }));
      setNumSocDisabled(true);
    } else {
      setFormData((v) => ({
        ...v,
        idInsurer: item.value,
      }));
      setNumSocDisabled(false);
    }
  };

  const onSubmit = React.useCallback(() => {
    if (props.isLoading) {
      return;
    }
    try {
      schema.validateSync(formData, { abortEarly: false });
      props.onSubmit(formData);
    } catch (e) {
      props.onSubmitError((e as yup.ValidationError).errors);
      return;
    }
  }, [
    formData,
    props.onSubmitError,
    props.onSubmit
  ]);

  return (
    <SemanticUi.Form
      data-testid="form"
      onSubmit={onSubmit}
    >
      <FormInput
        label="Nombre"
        name="nombre"
        placeholder="Nombre del paciente"
        type="text"
        onChange={onChange}
        value={formData.nombre}
        validator={validators.nombre}
        required
      />

      <FormInput
        label="Apellido"
        name="apellido"
        placeholder="Apellido del paciente"
        type="text"
        onChange={onChange}
        value={formData.apellido}
        validator={validators.apellido}
        required
      />

      <FormInput
        label="DNI"
        name="dni"
        placeholder="DNI del paciente"
        type="number"
        onChange={onChange}
        value={formData.dni}
        disabled={props.disableDni}
        validator={validators.dni}
        required
      />

      <FormDatePicker
        label="Fecha de nacimiento"
        name="fecnac"
        placeholder="Fecha de nacimiento del paciente en formato DD/MM/YYYY"
        onChange={onChange}
        value={formData.fecnac}
        required
      />

      <FormInput
        label="Telefono"
        name="telefono"
        placeholder="Telefono del paciente"
        type="number"
        onChange={onChange}
        value={formData.telefono}
        validator={validators.telefono}
        required
      />

      <FormInput
        label="Correo Electronico"
        name="email"
        placeholder="Correo Electronico del paciente"
        type="email"
        onChange={onChange}
        value={formData.email}
        validator={validators.email}
        required
      />

      <FormDropdown
        label="Obra social"
        name="idInsurer"
        placeholder="Obra social del paciente"
        onChange={onChangeInsurer}
        value={formData.idInsurer}
        values={insurersAsItems}
        validator={validators.idInsurer}
        nullyfiedText="No tiene obra social"
      />

      <FormInput
        label="Numero de la obra social"
        name="numsoc"
        placeholder="Numero de la obra social del paciente"
        type="text"
        onChange={onChange}
        value={formData.numsoc}
        validator={validators.numsoc}
        disabled={numSocDisabled}
      />

      <FormTextArea
        label="Historia clinica"
        name="historial"
        placeholder="Historia clinica del paciente"
        onChange={onChange}
        value={formData.historial}
        validator={validators.historial}
        required
      />

      <SemanticUi.Button
        className="primary"
        type="submit"
        loading={props.isLoading}
      >
        {props.buttonText}
      </SemanticUi.Button>
    </SemanticUi.Form>
  );
}
