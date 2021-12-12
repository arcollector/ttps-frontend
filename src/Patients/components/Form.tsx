import React from "react";
import * as SemanticUi from "semantic-ui-react";
import * as yup from "yup";
import moment from "moment";

import { FormInput } from "../../shared/components/FormInput";
import { FormTextArea } from "../../shared/components/FormTextArea";
import { FormDropdown, Item } from "../../shared/components/FormDropdown";
import { FormDatePicker } from "../../shared/components/FormDatePicker";
import { Patient, emptyPatient } from "../interfaces/types";
import {
  Tutor,
  emptyTutor,
  validators as tutorValidators,
  schema as tutorSchema,
} from "../../Tutors";
import { validators, schema } from "../interfaces";
import { actions as actionsInsurers } from "../../Insurers";

type Props = {
  values?: Patient;
  tutorValues?: Tutor;
  onSubmitError: (errors: string[]) => any;
  onSubmit: (values: Patient, tutorValues?: Tutor) => any;
  isLoading: boolean;
  buttonText: string;
  disableDni?: boolean;
};

export function Form(props: Props) {
  const [formData, setFormData] = React.useState<Patient>(
    props.values || emptyPatient
  );
  const [formTutorData, setFormTutorData] = React.useState<Tutor>(
    props.tutorValues || emptyTutor
  );

  React.useEffect(() => {
    if (props.values) {
      setFormData(props.values);
    }
  }, [props.values]);
  React.useEffect(() => {
    if (props.tutorValues) {
      setFormTutorData(props.tutorValues);
    }
  }, [props.tutorValues]);

  const onChange = (name: string, value: string) => {
    setFormData((v) => ({ ...v, [name]: value }));
  };
  const onChangeTutor = (name: string, value: string) => {
    setFormTutorData((v) => ({ ...v, [name.replace("tutor_", "")]: value }));
  };

  const [insurersAsItems, setInsurersAsItems] = React.useState<Item[]>([]);
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

  const [isUnderAge, setIsUnderAge] = React.useState(false);
  React.useEffect(() => {
    const d = moment(formData.fecnac, "DD/MM/YYYY");
    if (d.isValid()) {
      const now = moment();
      setIsUnderAge(now.diff(d, "years") < 18);
    }
  }, [formData.fecnac]);

  const [numSocDisabled, setNumSocDisabled] = React.useState(
    props.values?.idInsurer === ""
  );
  React.useEffect(() => {
    setNumSocDisabled(props.values?.idInsurer === "");
  }, [props.values?.idInsurer]);

  const onChangeInsurer = (_: string, item: Item | null) => {
    if (!item) {
      setFormData((v) => ({
        ...v,
        idInsurer: "",
        numsoc: "",
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

  const [isScrollToTop, setIsScrollToTop] = React.useState(false);
  const { onSubmitError, onSubmit, isLoading, values } = props;
  const onFormSubmit = React.useCallback(() => {
    if (isLoading) {
      return;
    }
    try {
      schema.validateSync(formData, { abortEarly: false });
      // set this values because is not present formData
      const idTutor = values?.idTutor || null;
      const formDataWithIdTutor = { ...formData, idTutor };
      if (isUnderAge) {
        tutorSchema.validateSync(formTutorData, { abortEarly: false });
        onSubmit(formDataWithIdTutor, formTutorData);
      } else {
        onSubmit(formDataWithIdTutor);
      }
    } catch (e) {
      setIsScrollToTop(true);
      onSubmitError((e as yup.ValidationError).errors);
      return;
    }
  }, [
    isLoading,
    formData,
    formTutorData,
    values,
    isUnderAge,
    onSubmitError,
    onSubmit,
  ]);
  React.useEffect(() => {
    if (isScrollToTop) {
      window.scrollTo({ top: 0, left: 0 });
      setIsScrollToTop(false);
    }
  }, [isScrollToTop]);

  return (
    <SemanticUi.Form data-testid="form" onSubmit={onFormSubmit}>
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

      {isUnderAge && (
        <div className="ui segment">
          <h3>Datos del tutor</h3>

          <FormInput
            label="Nombre"
            name="tutor_nombre"
            placeholder="Nombre del tutor"
            type="text"
            onChange={onChangeTutor}
            value={formTutorData.nombre}
            validator={tutorValidators.nombre}
            required
          />

          <FormInput
            label="Apellido"
            name="tutor_apellido"
            placeholder="Apellido del tutor"
            type="text"
            onChange={onChangeTutor}
            value={formTutorData.apellido}
            validator={tutorValidators.apellido}
            required
          />

          <FormInput
            label="Telefono"
            name="tutor_telefono"
            placeholder="Telefono del tutor"
            type="number"
            onChange={onChangeTutor}
            value={formTutorData.telefono}
            validator={tutorValidators.telefono}
            required
          />

          <FormInput
            label="Correo Electronico"
            name="tutor_email"
            placeholder="Correo Electronico del tutor"
            type="email"
            onChange={onChangeTutor}
            value={formTutorData.email}
            validator={tutorValidators.email}
            required
          />

          <FormInput
            label="Direccion"
            name="tutor_direccion"
            placeholder="Direccion del tutor"
            type="text"
            onChange={onChangeTutor}
            value={formTutorData.direccion}
            validator={tutorValidators.direccion}
            required
          />
        </div>
      )}

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
