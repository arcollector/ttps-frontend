import * as actions from '../actions';
import { InsurersService } from '../services';
import { emptyInsurer } from '../interfaces';
import {toast} from 'react-toastify';
import { insurer, insurers } from '../__data__';

describe('insurers actions', () => {

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
      jest.spyOn(InsurersService, 'getAllAsItems')
        .mockImplementation(() => Promise.resolve(insurers));

      const res = await actions.getAllInsurers();
      expect(res).toStrictEqual(insurers);
    });

    test('failure', async () => {
      jest.spyOn(InsurersService, 'getAllAsItems')
        .mockImplementation(() => Promise.reject());

      const res = await actions.getAllInsurers();
      expect(spyOnToastError).toBeCalledWith('Error al obtener el listado de obra sociales');
      expect(res).toStrictEqual([]);
    });
  });

  describe('get', () => {
    test('success', async () => {
      jest.spyOn(InsurersService, 'getAsItem')
        .mockImplementation(() => Promise.resolve(insurer));

      const res = await actions.getInsurer(insurer.id);
      expect(res).toStrictEqual(insurer);
    });

    test('failure', async () => {
      jest.spyOn(InsurersService, 'getAsItem')
        .mockImplementation(() => Promise.reject());

      const res = await actions.getInsurer(insurer.id);
      expect(spyOnToastError).toBeCalledWith(`no se pudo obtener los datos de la obra social ${insurer.id}`);
      expect(res).toStrictEqual(emptyInsurer);
    });
  });

  describe('create', () => {
    test('success', async () => {
      jest.spyOn(InsurersService, 'create')
        .mockImplementation(() => Promise.resolve(true));

      const res = await actions.createInsurer(insurer);
      expect(spyOnToastSuccess).toBeCalledWith('La obra social fue cargada correctamente');
      expect(res).toStrictEqual(true);
    });

    test('failure', async () => {
      jest.spyOn(InsurersService, 'create')
        .mockImplementation(() => Promise.reject());

      const res = await actions.createInsurer(insurer);
      expect(spyOnToastError).toBeCalledWith('Error al crear la obra social');
      expect(res).toStrictEqual(false);
    });
  });

  describe('update', () => {
    test('success', async () => {
      jest.spyOn(InsurersService, 'update')
        .mockImplementation(() => Promise.resolve(true));

      const res = await actions.updateInsurer(insurer.id, insurer);
      expect(spyOnToastSuccess).toBeCalledWith('Los datos han sido actualizados correctamente');
      expect(res).toBe(undefined);
    });

    test('failure', async () => {
      jest.spyOn(InsurersService, 'update')
        .mockImplementation(() => Promise.reject());

      const res = await actions.updateInsurer(insurer.id, insurer);
      expect(spyOnToastError).toBeCalledWith(`No se pudo actualizar la obra social ${insurer.id}`);
      expect(res).toBe(undefined);
    });
  });

  describe('remove', () => {
    test('success', async () => {
      jest.spyOn(InsurersService, 'remove')
        .mockImplementation(() => Promise.resolve(true));

      const res = await actions.removeInsurer(insurer.id);
      expect(spyOnToastSuccess).toBeCalledWith('Obra social eliminada con exito');
      expect(res).toBe(undefined);
    });

    test('cant remove if insurer has patients assiocated', async () => {
      jest.spyOn(InsurersService, 'remove')
        .mockImplementation(() => Promise.resolve(false));

      const res = await actions.removeInsurer(insurer.id);
      expect(spyOnToastError).toBeCalledWith(`Fallo el borrado de la obra social ${insurer.id}. Sera por que tiene pacientes asociados?`);
      expect(res).toBe(undefined);
    });

    test('failure', async () => {
      jest.spyOn(InsurersService, 'remove')
        .mockImplementation(() => Promise.reject());

      const res = await actions.removeInsurer(insurer.id);
      expect(spyOnToastError).toBeCalledWith(`No se pudo borrar la obra social ${insurer.id}`);
      expect(res).toBe(undefined);
    });
  });

});