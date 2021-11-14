import React from 'react';
import * as Testing from '@testing-library/react';

import { actions as insurersActions } from '../../../Insurers';
import { insurer } from '../../../Insurers/__data__';
import { patient } from '../../../Patients/__data__';
import { Patients } from '../../../Patients';
import { AppointmentNewForm } from '../AppointmentNewForm';

describe('', () => {
  let getAllInsurersResolved: boolean;
  let spyOnGetAllInsurers: jest.SpyInstance<unknown, Parameters<typeof insurersActions.getAllInsurers>>;
  let mockPatientsSearchForm: jest.SpyInstance<unknown, Parameters<typeof Patients.SearchForm>>;

  beforeEach(() => {
    getAllInsurersResolved = false;
    spyOnGetAllInsurers = jest.spyOn(insurersActions, 'getAllInsurers')
      .mockImplementation(() => {
        getAllInsurersResolved = true;
        return Promise.resolve([insurer]);
      });
    mockPatientsSearchForm = jest.spyOn(Patients, 'SearchForm')
      .mockImplementation((props) => {
        const onClick = () => {
          props.onSearch(patient);
        };
        return (
          <button onClick={onClick}>Buscar</button>
      );
    });
  });

  afterEach(() => {
    spyOnGetAllInsurers.mockRestore();
    mockPatientsSearchForm.mockRestore();
  });

  function getComponentForTesting() {
    return (
      <AppointmentNewForm reserved={[]} />
    );
  }

  async function renderAndWait() {
    Testing.render(getComponentForTesting());
    await Testing.waitFor(() => getAllInsurersResolved);
  }

  test('should derive patients insurer name correctly', async () => {
    await renderAndWait();
    Testing.fireEvent.click(
      Testing.screen.getByRole('button', { name: 'Buscar' })
    );
    expect(
      Testing.screen.getByText('Obra social: IOMA')
    ).toBeInTheDocument()
  });
});
