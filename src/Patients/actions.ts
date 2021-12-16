import { toast } from "react-toastify";

import { PatientsService } from "./services";
import { Patient, emptyPatient } from "./interfaces";
import { Tutor, TutorsService } from "../Tutors";

export const createPatient = async (
  formData: Patient,
  formDataTutor?: Tutor
) => {
  let idPatient: string | null = null;
  let idTutor: string | null = null;
  try {
    if (formDataTutor) {
      idTutor = await TutorsService.create(formDataTutor);
    }
    idPatient = await PatientsService.create({
      ...formData,
      idTutor,
    });
    toast.success("El paciente fue cargado correctamente");
  } catch (error) {
    console.error(error);
    const e = error as any;
    if (e && e.message === "DNI_NOT_AVAILABLE") {
      toast.error("Ya existe un paciente con el mismo dni");
    } else {
      toast.error("Error al crear el paciente");
    }
  }
  return idPatient;
};

export const getPatient = async (patientId: string) => {
  try {
    return await PatientsService.getAsItem(patientId);
  } catch (error) {
    console.error(error);
    toast.error(`no se pudo obtener los datos del paciente ${patientId}`);
    return emptyPatient;
  }
};

export const updatePatient = async (
  patientId: string,
  formData: Patient,
  formDataTutor?: Tutor
) => {
  let idTutor: Patient["idTutor"] = null;
  try {
    if (formData.idTutor && formDataTutor) {
      idTutor = formData.idTutor;
      await TutorsService.update(idTutor, formDataTutor);
    } else if (formData.idTutor && !formDataTutor) {
      idTutor = null;
      await TutorsService.remove(formData.idTutor);
    } else if (formDataTutor) {
      idTutor = await TutorsService.create(formDataTutor);
    }
    await PatientsService.update(patientId, {
      ...formData,
      idTutor,
    });
    toast.success("Los datos han sido actualizados correctamente");
  } catch (error) {
    console.error(error);
    toast.error(`No se pudo actualizar el paciente ${patientId}`);
  }
};

export const removePatient = async (patientId: string) => {
  try {
    const success = await PatientsService.remove(patientId);
    if (success) {
      toast.success("Paciente eliminado con exito");
    } else {
      toast.error(
        `Fallo el borrado del paciente ${patientId}. Sera por que tiene examenes medicos asociados?`
      );
    }
  } catch (error) {
    toast.error(`No se pudo borrar el paciente ${patientId}`);
  }
};

export const getAllPatients = async () => {
  try {
    return await PatientsService.getAllAsItems();
  } catch (error) {
    toast.error("Error al obtener el listado pacientes");
    return [];
  }
};
