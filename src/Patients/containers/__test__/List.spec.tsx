import * as Testing from '@testing-library/react'

import * as actions from '../../actions';
import { patient, patients } from '../../__data__';
import { List } from '../List';

describe('<List />', () => {
  let spyOnGetAllPatients: jest.SpyInstance<unknown, Parameters<typeof actions.getAllPatients>>;

  beforeEach(() => {
    spyOnGetAllPatients = jest.spyOn(actions, 'getAllPatients')
      .mockImplementation(() => Promise.resolve(patients));
  });

  afterEach(() => {
    spyOnGetAllPatients.mockRestore();
  });

  function getComponentForTesting() {
    return (
      <List />
    );
  }

  test('should display patient data correctly', async () => {
    Testing.render(getComponentForTesting());
    await Testing.waitFor(() => {
      expect(spyOnGetAllPatients).toBeCalled();
    });
    const row = Testing.screen.getAllByRole('row')[1];
    expect(
      Testing.within(row).getByText(`${patient.nombre} ${patient.apellido}`)
    ).toBeInTheDocument();
    expect(
      Testing.within(row).getByText(patient.dni)
    ).toBeInTheDocument();
    expect(
      Testing.within(row).getByText(patient.telefono)
    ).toBeInTheDocument();
    expect(
      Testing.within(row).getByText(patient.email)
    ).toBeInTheDocument();
  });

  test('should to attribute of details button correct', async () => {
    const dom = Testing.render(getComponentForTesting());
    await Testing.waitFor(() => {
      expect(spyOnGetAllPatients).toBeCalled();
    });
    const getByTo = Testing.queryByAttribute.bind(null, 'to');
    getByTo(dom.container, `/pacientes/${patient.id}`);
  });

});
