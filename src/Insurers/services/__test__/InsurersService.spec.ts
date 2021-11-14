import { InsurersService } from '../InsurersService';
import { Crud } from '../../../shared/firebase';
import { insurer, insurers } from '../../__data__';

describe('InsurersService', () => {

  test('should return all insurers as plain objects', async () => {
    jest.spyOn(Crud, 'getAllAsItems')
      .mockImplementationOnce(() => Promise.resolve(insurers));

    expect(await InsurersService.getAllAsItems()).toStrictEqual(insurers);
  });

  test('should create always', async () => {
    jest.spyOn(Crud, 'create')
      .mockImplementationOnce(() => Promise.resolve());

    expect(await InsurersService.create(insurer)).toStrictEqual(true);
  });

  test('should update always', async () => {
    jest.spyOn(Crud, 'getAsDoc')
      .mockImplementationOnce(() => Promise.resolve({} as any));
    jest.spyOn(Crud, 'update')
      .mockImplementationOnce(() => Promise.resolve(true));

    expect(await InsurersService.update(insurer.id, insurer)).toStrictEqual(true);
  });

  test('should get a insurer as plain object', async () => {
    jest.spyOn(Crud, 'getAsItem')
      .mockImplementationOnce(() => Promise.resolve(insurer));

    expect(await InsurersService.getAsItem(insurer.id)).toStrictEqual(insurer);
  });

  test('should remove because insurer has not patients associated', async () => {
    jest.spyOn(Crud, 'getAllBy')
      .mockImplementationOnce(() => Promise.resolve([]));
    jest.spyOn(Crud, 'getAsDoc')
      .mockImplementationOnce(() => Promise.resolve({ ref: { delete: () => Promise.resolve() } } as any));

    expect(await InsurersService.remove(insurer.id)).toStrictEqual(true);
  });

  test('should not remove because insurer has patients associated', async () => {
    jest.spyOn(Crud, 'getAllBy')
      .mockImplementationOnce(() => Promise.resolve(insurers));

    expect(await InsurersService.remove(insurer.id)).toStrictEqual(false);
  });

});
