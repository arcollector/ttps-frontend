import * as Testing from '@testing-library/react'
import * as RouterDom from 'react-router-dom';

import { patientRecentlyCreated } from '../../__data__';
import * as actions from '../../actions';
import { actions as insurersActions } from '../../../Insurers';
import { insurer } from '../../../Insurers/__data__'

import { Create } from '../Create';

describe('<Create />', () => {
  let spyOnGetAllInsurers: jest.SpyInstance<unknown, Parameters<typeof insurersActions.getAllInsurers>>;
  let isFullyRendered = false;

  beforeEach(() => {
    spyOnGetAllInsurers = jest
      .spyOn(insurersActions, 'getAllInsurers')
      .mockImplementation(() => {
        isFullyRendered = true;
        return Promise.resolve([insurer]);
      });
  });

  afterEach(() => {
    spyOnGetAllInsurers.mockRestore();
  });

  function getComponentForTesting() {
    return (
      <Create />
    );
  }

  async function renderAndWait() {
    const { container } = Testing.render(getComponentForTesting());
    await Testing.waitFor(() => isFullyRendered);
    return container;
  }

  describe('should invoke createPacient action when form is submitted', () => {
    let spyOnPatientCreate: jest.SpyInstance<unknown, Parameters<typeof actions.createPatient>>;
    let historyReplace: jest.Mock;
    let spyOnUseHistory: jest.SpyInstance<unknown, Parameters<typeof RouterDom.useHistory>>;

    function fillForm(role: string, name: string, value: string) {
      Testing.fireEvent.change(
        Testing.screen.getByRole(role, { name }),
        { target: { value } }
      );
    }

    function triggerInsurerComboBoxChange() {
      const insuranceElem = Testing
        .screen
        .getAllByRole('option')
        .find(((elem) => elem.textContent === insurer.nombre))!;
      Testing.fireEvent.click(insuranceElem);
    }

    function triggerBirthOfDateChange(container: HTMLElement, value: string) {
      const elem = container
        .querySelector('input[name="fecnac"]') as HTMLInputElement;
      Testing.fireEvent.change(elem, { target: { value } });
      Testing.fireEvent.blur(elem);
    }

    beforeEach(() => {
      spyOnPatientCreate = jest.spyOn(actions, 'createPatient')
        .mockImplementation(() => Promise.resolve(true));
      historyReplace = jest.fn();
      spyOnUseHistory = jest.spyOn(RouterDom, 'useHistory')
        .mockReturnValue({ replace: historyReplace });  
    });

    afterEach(() => {
      spyOnPatientCreate.mockRestore();
      spyOnUseHistory.mockRestore();
    });

    test('creation of patient was successful', async () => {
      const container = await renderAndWait();
      fillForm('textbox', 'Nombre', patientRecentlyCreated.nombre);
      fillForm('textbox', 'Apellido', patientRecentlyCreated.apellido);
      fillForm('spinbutton', 'DNI', patientRecentlyCreated.dni);
      fillForm('spinbutton', 'Telefono', patientRecentlyCreated.telefono);
      triggerBirthOfDateChange(container, patientRecentlyCreated.fecnac);
      fillForm('textbox', 'Correo Electronico', patientRecentlyCreated.email);
      triggerInsurerComboBoxChange();
      fillForm('textbox', 'Numero de la obra social', patientRecentlyCreated.numsoc);
      fillForm('textbox', 'Historia clinica', patientRecentlyCreated.historial);
      Testing.fireEvent.submit(Testing.screen.getByRole('button', { name: 'Crear paciente' }));
      await Testing.waitFor(() => {
        expect(spyOnPatientCreate).toBeCalledWith(patientRecentlyCreated);
      });
      expect(historyReplace).toBeCalledWith('/pacientes');
    });
  });

});
