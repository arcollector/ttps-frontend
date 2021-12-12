import React from "react";
import { useParams, useHistory } from "react-router-dom";

import { Form } from "../components/Form";
import { FormDeletion } from "../../shared/components/FormDeletion";
import { ErrorMessage } from "../../shared/components/ErrorMessage";
import { Patient, emptyPatient } from "../interfaces/types";
import * as actions from "../actions";
import { Tutor, emptyTutor, actions as tutorActions } from "../../Tutors";

export function Single() {
  const history = useHistory();

  const { id: patientId } = useParams<{ id: string }>();
  const [patient, setPatient] = React.useState<Patient>(emptyPatient);
  const [patientTutor, setPatientTutor] = React.useState<Tutor>(emptyTutor);

  React.useEffect(() => {
    (async () => {
      setPatient(await actions.getPatient(patientId));
    })();
  }, [patientId]);

  React.useEffect(() => {
    (async () => {
      if (patient.idTutor) {
        setPatientTutor(await tutorActions.getTutor(patient.idTutor));
      }
    })();
  }, [patient.idTutor]);

  const [isLoadingForUpdate, setIsLoadingForUpdate] = React.useState(false);
  const [isLoadingForDelete, setIsLoadingForDelete] = React.useState(false);
  const [errors, setErrros] = React.useState<string[]>([]);

  const onUpdateError = (errors: string[]) => {
    setErrros(errors);
  };

  const onUpdate = async (values: Patient, tutorValues?: Tutor) => {
    setErrros([]);
    setIsLoadingForUpdate(true);
    await actions.updatePatient(patientId, values, tutorValues);
    setIsLoadingForUpdate(false);
  };

  const [isDeleteMode, setIsDeleteMode] = React.useState(false);
  const onPreDelete = () => {
    setIsDeleteMode(true);
  };

  const onConfirmDelete = React.useCallback(async () => {
    setIsLoadingForDelete(true);
    await actions.removePatient(patientId);
    history.replace("/pacientes");
    setIsLoadingForDelete(false);
  }, [patientId]);

  const onCancelDelete = () => {
    setIsDeleteMode(false);
  };

  return (
    <div className="ui segment">
      <h1>Datos del paciente</h1>

      <ErrorMessage
        heading="No se pudo editar los datos del paciente"
        errors={errors}
      />

      <Form
        values={patient}
        tutorValues={patientTutor}
        onSubmitError={onUpdateError}
        onSubmit={onUpdate}
        isLoading={isLoadingForUpdate}
        buttonText="Editar paciente"
        disableDni
      />

      <hr />

      <FormDeletion
        label="Borrar paciente"
        onPreDelete={onPreDelete}
        isDeleteMode={isDeleteMode}
        isLoading={isLoadingForDelete}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </div>
  );
}
