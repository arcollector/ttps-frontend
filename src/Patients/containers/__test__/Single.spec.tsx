import * as Testing from '@testing-library/react'
import * as RouterDom from 'react-router-dom';

import { patient } from '../../__data__';
import * as actions from '../../actions';
import { Single } from '../Single';

describe('<Single />', () => {
  let spyOnGetPatient: jest.SpyInstance<unknown, Parameters<typeof actions.getPatient>>;
  let spyOnUseParams: jest.SpyInstance<unknown, Parameters<typeof RouterDom.useParams>>;

  beforeEach(() => {
    spyOnGetPatient = jest.spyOn(actions, 'getPatient')
      .mockImplementation(() => Promise.resolve(patient));
    spyOnUseParams = jest.spyOn(RouterDom, 'useParams')
      .mockReturnValue({ id: patient.id });
  });

  afterEach(() => {
    spyOnGetPatient.mockRestore();
    spyOnUseParams.mockRestore();
  });

  function getComponentForTesting() {
    return (
      <Single />
    );
  }

  describe('should invoke updatePatient action when form is submitted', () => {
    let spyOnPatientUpdate: jest.SpyInstance<unknown, Parameters<typeof actions.updatePatient>>;

    beforeEach(() => {
      spyOnPatientUpdate = jest.spyOn(actions, 'updatePatient')
        .mockImplementation(() => Promise.resolve()); 
    });

    afterEach(() => {
      spyOnPatientUpdate.mockRestore();
    });

    test('update patient was successful', async () => {
      Testing.render(getComponentForTesting());
      await Testing.waitFor(() => {
        expect(spyOnGetPatient).toBeCalledTimes(1);
      });
      Testing.fireEvent.submit(Testing.screen.getByRole('button', { name: 'Editar paciente' }));
      await Testing.waitFor(() => {
        expect(spyOnPatientUpdate).toBeCalledWith(patient.id, patient);
      });
    });
  });

  describe('remove of the patient', () => {
    let spyOnPatientRemove: jest.SpyInstance<unknown, Parameters<typeof actions.removePatient>>;
    let historyReplace: jest.Mock;
    let spyOnUseHistory: jest.SpyInstance<unknown, Parameters<typeof RouterDom.useHistory>>;
    
    beforeEach(() => {
      spyOnPatientRemove = jest.spyOn(actions, 'removePatient')
        .mockImplementation(() => Promise.resolve());
      historyReplace = jest.fn();
      spyOnUseHistory = jest.spyOn(RouterDom, 'useHistory')
        .mockReturnValue({ replace: historyReplace }); 
    });

    afterEach(() => {
      spyOnPatientRemove.mockRestore();
      spyOnUseHistory.mockRestore();
    });

    test('should display remove dialog when pressingon on button', async () => {
      Testing.render(getComponentForTesting());
      await Testing.waitFor(() => {
        expect(spyOnGetPatient).toBeCalledTimes(1);
      });
      Testing.fireEvent.click(
        Testing.screen.getByRole('button', { name: 'Borrar paciente' })
      );
      expect(Testing.screen.getByRole('button', { name: 'Si' })).toBeInTheDocument();
    });

    test('should invoke removePatient action when pressing on button', async () => {
      Testing.render(getComponentForTesting());
      await Testing.waitFor(() => {
        expect(spyOnGetPatient).toBeCalledTimes(1);
      });
      Testing.fireEvent.click(
        Testing.screen.getByRole('button', { name: 'Borrar paciente' })
      );
      Testing.fireEvent.click(
        Testing.screen.getByRole('button', { name: 'Si' })
      );
      await Testing.waitFor(() => {
        expect(spyOnPatientRemove).toBeCalledWith(patient.id);
      });
      expect(historyReplace).toBeCalledWith('/pacientes');
    });
  });

  test('should dni field must be disable it cant be editted', async () => {
    Testing.render(getComponentForTesting());
    await Testing.waitFor(() => {
      expect(spyOnGetPatient).toBeCalledTimes(1);
    });
    expect(
      Testing.screen.getByRole('spinbutton', { name: 'DNI' })
    ).toBeDisabled();
  });
});
