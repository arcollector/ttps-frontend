import * as Testing from '@testing-library/react'

import * as actions from '../../actions';
import { insurer, insurers } from '../../__data__';
import { List } from '../List';

describe('<List />', () => {
  let spyOnGetAllInsurers: jest.SpyInstance<unknown, Parameters<typeof actions.getAllInsurers>>;

  beforeEach(() => {
    spyOnGetAllInsurers = jest.spyOn(actions, 'getAllInsurers')
      .mockImplementation(() => Promise.resolve(insurers));
  });

  afterEach(() => {
    spyOnGetAllInsurers.mockRestore();
  });

  function getComponentForTesting() {
    return (
      <List />
    );
  }

  test('should display patient data correctly', async () => {
    Testing.render(getComponentForTesting());
    await Testing.waitFor(() => {
      expect(spyOnGetAllInsurers).toBeCalled();
    });
    const row = Testing.screen.getAllByRole('row')[1];
    expect(
      Testing.within(row).getByText(insurer.nombre)
    ).toBeInTheDocument();
  });

  test('should to attribute of details button correct', async () => {
    const dom = Testing.render(getComponentForTesting());
    await Testing.waitFor(() => {
      expect(spyOnGetAllInsurers).toBeCalled();
    });
    const getByTo = Testing.queryByAttribute.bind(null, 'to');
    getByTo(dom.container, `/obra-sociales/${insurer.id}`);
  });

});
