import * as Testing from '@testing-library/react'
import * as RouterDom from 'react-router-dom';

import { insurer } from '../../__data__';
import * as actions from '../../actions';
import { Single } from '../Single';

describe('<Single />', () => {
  let spyOnGetInsurer: jest.SpyInstance<unknown, Parameters<typeof actions.getInsurer>>;
  let spyOnUseParams: jest.SpyInstance<unknown, Parameters<typeof RouterDom.useParams>>;

  beforeEach(() => {
    spyOnGetInsurer = jest.spyOn(actions, 'getInsurer')
      .mockImplementation(() => Promise.resolve(insurer));
    spyOnUseParams = jest.spyOn(RouterDom, 'useParams')
      .mockReturnValue({ id: insurer.id });
  });

  afterEach(() => {
    spyOnGetInsurer.mockRestore();
    spyOnUseParams.mockRestore();
  });

  function getComponentForTesting() {
    return (
      <Single />
    );
  }

  describe('should invoke updateInsurer action when form is submitted', () => {
    let spyOnInsurerUpdate: jest.SpyInstance<unknown, Parameters<typeof actions.updateInsurer>>;

    beforeEach(() => {
      spyOnInsurerUpdate = jest.spyOn(actions, 'updateInsurer')
        .mockImplementation(() => Promise.resolve()); 
    });

    afterEach(() => {
      spyOnInsurerUpdate.mockRestore();
    });

    test('update insurer was successful', async () => {
      Testing.render(getComponentForTesting());
      await Testing.waitFor(() => {
        expect(spyOnGetInsurer).toBeCalledTimes(1);
      });
      Testing.fireEvent.submit(Testing.screen.getByRole('button', { name: 'Editar obra social' }));
      await Testing.waitFor(() => {
        expect(spyOnInsurerUpdate).toBeCalledWith(insurer.id, insurer);
      });
    });
  });

  describe('remove of the insurer', () => {
    let spyOnInsurerRemove: jest.SpyInstance<unknown, Parameters<typeof actions.removeInsurer>>;
    let historyReplace: jest.Mock;
    let spyOnUseHistory: jest.SpyInstance<unknown, Parameters<typeof RouterDom.useHistory>>;
    
    beforeEach(() => {
      spyOnInsurerRemove = jest.spyOn(actions, 'removeInsurer')
        .mockImplementation(() => Promise.resolve());
      historyReplace = jest.fn();
      spyOnUseHistory = jest.spyOn(RouterDom, 'useHistory')
        .mockReturnValue({ replace: historyReplace }); 
    });

    afterEach(() => {
      spyOnInsurerRemove.mockRestore();
      spyOnUseHistory.mockRestore();
    });

    test('should display remove dialog when pressingon on button', async () => {
      Testing.render(getComponentForTesting());
      await Testing.waitFor(() => {
        expect(spyOnGetInsurer).toBeCalledTimes(1);
      });
      Testing.fireEvent.click(
        Testing.screen.getByRole('button', { name: 'Borrar obra social' })
      );
      expect(Testing.screen.getByRole('button', { name: 'Si' })).toBeInTheDocument();
    });

    test('should invoke removeInsurer action when pressing on button', async () => {
      Testing.render(getComponentForTesting());
      await Testing.waitFor(() => {
        expect(spyOnGetInsurer).toBeCalledTimes(1);
      });
      Testing.fireEvent.click(
        Testing.screen.getByRole('button', { name: 'Borrar obra social' })
      );
      Testing.fireEvent.click(
        Testing.screen.getByRole('button', { name: 'Si' })
      );
      await Testing.waitFor(() => {
        expect(spyOnInsurerRemove).toBeCalledWith(insurer.id);
      });
      expect(historyReplace).toBeCalledWith('/obra-sociales');
    });
  });

});
