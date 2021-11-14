import { PatientsService } from '../PatientsService';
import { Crud } from '../../../shared/firebase';
import { patient, patients } from '../../__data__';

describe('PatientsService', () => {

  test('should return all patients as plain objects', async () => {
    jest.spyOn(Crud, 'getAllAsItems')
      .mockImplementationOnce(() => Promise.resolve(patients));

    expect(await PatientsService.getAllAsItems()).toStrictEqual(patients);
  });

  test('should existsDni', async () => {
    jest.spyOn(Crud, 'getAllBy')
      .mockImplementationOnce(() => Promise.resolve(patients));

    expect(await PatientsService.existsDni(patient.dni)).toStrictEqual(true);
  });

  test('should not existsDni', async () => {
    jest.spyOn(Crud, 'getAllBy')
      .mockImplementationOnce(() => Promise.resolve([]));

    expect(await PatientsService.existsDni(patient.dni)).toStrictEqual(false);
  });

  test('should create because dni is new one', async () => {
    jest.spyOn(Crud, 'create')
      .mockImplementationOnce(() => Promise.resolve());
    jest.spyOn(PatientsService, 'existsDni')
      .mockImplementationOnce(() => Promise.resolve(false));

    expect(await PatientsService.create(patient)).toStrictEqual(true);
  });

  test('should not create because dni is in use', async () => {
    jest.spyOn(Crud, 'create')
      .mockImplementationOnce(() => Promise.resolve());
    jest.spyOn(PatientsService, 'existsDni')
      .mockImplementationOnce(() => Promise.resolve(true));

    expect(await PatientsService.create(patient)).toStrictEqual(false);
  });

  test('should update always', async () => {
    jest.spyOn(Crud, 'getAsDoc')
      .mockImplementationOnce(() => Promise.resolve({} as any));
    jest.spyOn(Crud, 'update')
      .mockImplementationOnce(() => Promise.resolve(true));

    expect(await PatientsService.update(patient.id, patient)).toStrictEqual(true);
  });

  test('should get a patient as plain object', async () => {
    jest.spyOn(Crud, 'getAsItem')
      .mockImplementationOnce(() => Promise.resolve(patient));

    expect(await PatientsService.getAsItem(patient.id)).toStrictEqual(patient);
  });

  test('should remove because patient has not medic exams associated', async () => {
    jest.spyOn(Crud, 'getAllBy')
      .mockImplementationOnce(() => Promise.resolve([]));
    jest.spyOn(Crud, 'getAsDoc')
      .mockImplementationOnce(() => Promise.resolve({ ref: { delete: () => Promise.resolve() } } as any));

    expect(await PatientsService.remove(patient.id)).toStrictEqual(true);
  });

  test('should not remove because patient has medic exams associated', async () => {
    jest.spyOn(Crud, 'getAllBy')
      .mockImplementationOnce(() => Promise.resolve(patients));

    expect(await PatientsService.remove(patient.id)).toStrictEqual(false);
  });

});
