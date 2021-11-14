import * as Testing from '@testing-library/react'
import * as RouterDom from 'react-router-dom';

import { insurerRecentlyCreated } from '../../__data__';
import * as actions from '../../actions';
import { Create } from '../Create';

describe('<Create />', () => {

  function getComponentForTesting() {
    return (
      <Create />
    );
  }

  describe('should invoke createInsurer action when form is submitted', () => {
    let spyOnInsurerCreate: jest.SpyInstance<unknown, Parameters<typeof actions.createInsurer>>;
    let historyReplace: jest.Mock;
    let spyOnUseHistory: jest.SpyInstance<unknown, Parameters<typeof RouterDom.useHistory>>;

    function fillForm(role: string, name: string, value: string) {
      Testing.fireEvent.change(
        Testing.screen.getByRole(role, { name }),
        { target: { value } }
      );
    }

    beforeEach(() => {
      spyOnInsurerCreate = jest.spyOn(actions, 'createInsurer')
        .mockImplementation(() => Promise.resolve(true));
      historyReplace = jest.fn();
      spyOnUseHistory = jest.spyOn(RouterDom, 'useHistory')
        .mockReturnValue({ replace: historyReplace });  
    });

    afterEach(() => {
      spyOnInsurerCreate.mockRestore();
      spyOnUseHistory.mockRestore();
    });

    test('creation of patient was successful', async () => {
      Testing.render(getComponentForTesting());
      fillForm('textbox', 'Nombre de la obra social', insurerRecentlyCreated.nombre);
      Testing.fireEvent.submit(Testing.screen.getByRole('button', { name: 'Crear obra social' }));
      await Testing.waitFor(() => {
        expect(spyOnInsurerCreate).toBeCalledWith(insurerRecentlyCreated);
      });
      expect(historyReplace).toBeCalledWith('/obra-sociales');
    });
  });

});
