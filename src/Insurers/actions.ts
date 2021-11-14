import {toast} from 'react-toastify';

import { InsurersService } from './services';
import { Insurer, emptyInsurer } from './interfaces';

export const createInsurer = async (formData: Insurer) => {
  let success = false;
  try {
    success = await InsurersService.create(formData);
    if (success) {
      toast.success('La obra social fue cargada correctamente');
    }
  } catch (error) {
    toast.error('Error al crear la obra social');
  }
  return success;
};

export const getInsurer = async (id: string) => {
  try {
    return await InsurersService.getAsItem(id);
  } catch (error) {
    toast.error(`no se pudo obtener los datos de la obra social ${id}`);
    return emptyInsurer;
  }
};

export const updateInsurer = async (id: string, formData: Insurer) => {
  try {
    // always true
    await InsurersService.update(id, formData);
    toast.success('Los datos han sido actualizados correctamente');
  } catch(error) {
    toast.error(`No se pudo actualizar la obra social ${id}`);
  }
};

export const removeInsurer = async (id: string) => {
  try {
    const success = await InsurersService.remove(id);
    if (success) {
      toast.success('Obra social eliminada con exito');
    } else {
      toast.error(`Fallo el borrado de la obra social ${id}. Sera por que tiene pacientes asociados?`);
    }
  } catch(error) {
    toast.error(`No se pudo borrar la obra social ${id}`);
  }
};

export const getAllInsurers = async () => {
  try {
    return await InsurersService.getAllAsItems();
  } catch(error) {
    toast.error('Error al obtener el listado de obra sociales');
    return [];
  }
};
