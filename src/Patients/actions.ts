import {toast} from 'react-toastify';

import { PatientsService } from './services';
import { Patient, emptyPatient } from './interfaces';

export const createPatient = async (formData: Patient) => {
  let success = false;
  try {
    success = await PatientsService.create(formData);
    if (success) {
      toast.success('El paciente fue cargado correctamente');
    } else {
      toast.error('Ya existe un paciente con el mismo dni');
    }
  } catch (error) {
    toast.error('Error al crear el paciente');
  }
  return success;
};

export const getPatient = async (patientId: string) => {
  try {
    return await PatientsService.getAsItem(patientId);
  } catch (error) {
    toast.error(`no se pudo obtener los datos del paciente ${patientId}`);
    return emptyPatient;
  }
};

export const updatePatient = async (patientId: string, formData: Patient) => {
  try {
    // always true
    await PatientsService.update(patientId, formData);
    toast.success('Los datos han sido actualizados correctamente');
  } catch(error) {
    toast.error(`No se pudo actualizar el paciente ${patientId}`);
  }
};

export const removePatient = async (patientId: string) => {
  try {
    const success = await PatientsService.remove(patientId);
    if (success) {
      toast.success('Paciente eliminado con exito');
    } else {
      toast.error(`Fallo el borrado del paciente ${patientId}. Sera por que tiene examenes medicos asociados?`);
    }
  } catch(error) {
    toast.error(`No se pudo borrar el paciente ${patientId}`);
  }
};

export const getAllPatients = async () => {
  try {
    return await PatientsService.getAllAsItems();
  } catch(error) {
    toast.error('Error al obtener el listado pacientes');
    return [];
  }
};
