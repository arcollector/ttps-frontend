import * as actions from '../actions';
import { PatientsService } from '../services';
import { emptyPatient } from '../interfaces';
import {toast} from 'react-toastify';
import { patient, patients } from '../__data__';

describe('patients actions', () => {

  let spyOnToastSuccess: jest.SpyInstance<unknown, Parameters<typeof toast.success>>;
  let spyOnToastError: jest.SpyInstance<unknown, Parameters<typeof toast.error>>;

  beforeEach(() => {
    spyOnToastSuccess = jest.spyOn(toast, 'success');
    spyOnToastError = jest.spyOn(toast, 'error');
  });

  afterEach(() => {
    spyOnToastSuccess.mockRestore();
    spyOnToastError.mockRestore();
  });

  describe('get all', () => {
    test('success', async () => {
      jest.spyOn(PatientsService, 'getAllAsItems')
        .mockImplementation(() => Promise.resolve(patients));

      const res = await actions.getAllPatients();
      expect(res).toStrictEqual(patients);
    });

    test('failure', async () => {
      jest.spyOn(PatientsService, 'getAllAsItems')
        .mockImplementation(() => Promise.reject());

      const res = await actions.getAllPatients();
      expect(spyOnToastError).toBeCalledWith('Error al obtener el listado pacientes');
      expect(res).toStrictEqual([]);
    });
  });

  describe('get', () => {
    test('success', async () => {
      jest.spyOn(PatientsService, 'getAsItem')
        .mockImplementation(() => Promise.resolve(patient));

      const res = await actions.getPatient(patient.id);
      expect(res).toStrictEqual(patient);
    });

    test('failure', async () => {
      jest.spyOn(PatientsService, 'getAsItem')
        .mockImplementation(() => Promise.reject());

      const res = await actions.getPatient(patient.id);
      expect(spyOnToastError).toBeCalledWith(`no se pudo obtener los datos del paciente ${patient.id}`);
      expect(res).toStrictEqual(emptyPatient);
    });
  });

  describe('create', () => {
    test('success', async () => {
      jest.spyOn(PatientsService, 'create')
        .mockImplementation(() => Promise.resolve(true));

      const res = await actions.createPatient(patient);
      expect(spyOnToastSuccess).toBeCalledWith('El paciente fue cargado correctamente');
      expect(res).toStrictEqual(true);
    });

    test('cant create if already dni exists', async () => {
      jest.spyOn(PatientsService, 'create')
        .mockImplementation(() => Promise.resolve(false));
        
      const res = await actions.createPatient(patient);
      expect(spyOnToastError).toBeCalledWith('Ya existe un paciente con el mismo dni');
      expect(res).toStrictEqual(false);
    });

    test('failure', async () => {
      jest.spyOn(PatientsService, 'create')
        .mockImplementation(() => Promise.reject());

      const res = await actions.createPatient(patient);
      expect(spyOnToastError).toBeCalledWith('Error al crear el paciente');
      expect(res).toStrictEqual(false);
    });
  });

  describe('update', () => {
    test('success', async () => {
      jest.spyOn(PatientsService, 'update')
        .mockImplementation(() => Promise.resolve(true));

      const res = await actions.updatePatient(patient.id, patient);
      expect(spyOnToastSuccess).toBeCalledWith('Los datos han sido actualizados correctamente');
      expect(res).toBe(undefined);
    });

    test('failure', async () => {
      jest.spyOn(PatientsService, 'update')
        .mockImplementation(() => Promise.reject());

      const res = await actions.updatePatient(patient.id, patient);
      expect(spyOnToastError).toBeCalledWith(`No se pudo actualizar el paciente ${patient.id}`);
      expect(res).toBe(undefined);
    });
  });

  describe('remove', () => {
    test('success', async () => {
      jest.spyOn(PatientsService, 'remove')
        .mockImplementation(() => Promise.resolve(true));

      const res = await actions.removePatient(patient.id);
      expect(spyOnToastSuccess).toBeCalledWith('Paciente eliminado con exito');
      expect(res).toBe(undefined);
    });

    test('cant remove if patient has medic exams', async () => {
      jest.spyOn(PatientsService, 'remove')
        .mockImplementation(() => Promise.resolve(false));

      const res = await actions.removePatient(patient.id);
      expect(spyOnToastError).toBeCalledWith(`Fallo el borrado del paciente ${patient.id}. Sera por que tiene examenes medicos asociados?`);
      expect(res).toBe(undefined);
    });

    test('failure', async () => {
      jest.spyOn(PatientsService, 'remove')
        .mockImplementation(() => Promise.reject());

      const res = await actions.removePatient(patient.id);
      expect(spyOnToastError).toBeCalledWith(`No se pudo borrar el paciente ${patient.id}`);
      expect(res).toBe(undefined);
    });
  });

});