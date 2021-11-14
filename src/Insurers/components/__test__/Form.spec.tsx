import React from 'react';
import * as Testing from '@testing-library/react'

import { Insurer, emptyInsurer } from '../../interfaces';
import { insurer } from '../../__data__';
import { Form } from '../Form';

describe('<Form />', () => {

  function getInitialProps(
    onSubmit = jest.fn(),
    onSubmitError = jest.fn()
  ): React.ComponentProps<typeof Form> {
    return {
      values: emptyInsurer,
      onSubmitError,
      onSubmit,
      isLoading: false,
      buttonText: 'Submit',
    };
  }

  function getComponentForTesting(props = getInitialProps()) {
    return (
      <Form {...props} />
    );
  }

  function triggerChange(role: string, accebilityName: string, value: string) {
    Testing.fireEvent.change(
      Testing.screen.getByRole(role, { name: accebilityName }),
      { target: { value } }
    );
  }

  function fillFormFields(fields: Partial<Insurer>) {
    typeof fields.nombre !== 'undefined' && triggerChange('textbox', 'Nombre de la obra social', fields.nombre);
  }

  describe('should mount initially using props.values as values for each form field', () => {
    function testFormFields(values: {role: string, name: string, value: string}[]) {
      Object.values(values).forEach(({role, name, value}) => {
        expect(
          (Testing.screen.getByRole(role, { name }) as HTMLInputElement).value
        ).toBe(value);
      });
    }

    test('when props.values is undefined all fields must be blank', () => {
      const props = getInitialProps();
      Testing.render(getComponentForTesting({ ...props, values: undefined }));
      testFormFields([
        { role: 'textbox', name: 'Nombre de la obra social', value: '' },
      ]);
    });

    test('when props.values is defined all fields must be fill up', () => {
      const props = getInitialProps();
      Testing.render(getComponentForTesting({ ...props, values: insurer }));
      testFormFields([
        { role: 'textbox', name: 'Nombre de la obra social', value: insurer.nombre },
      ]);
    });
  });

  test('should dont submit if all fields are empty', () => {
    const props = getInitialProps();
    const { getByTestId } = Testing.render(getComponentForTesting(props));
    const formElem = getByTestId('form');
    Testing.fireEvent.submit(formElem);
    expect(props.onSubmitError).toBeCalledTimes(1);
    expect(props.onSubmit).toBeCalledTimes(0);
  });

  test('should submit if all fields are valid', () => {
    const props = getInitialProps();
    const { getByTestId } = Testing.render(getComponentForTesting(props));
    const formElem = getByTestId('form');
    fillFormFields(insurer);
    Testing.fireEvent.submit(formElem);
    expect(props.onSubmitError).toBeCalledTimes(0);
    expect(props.onSubmit).toBeCalledTimes(1);
  });

  describe('single field validation', () => {
    function testFieldValidation(field: keyof Insurer, badCases: string[], goodCases: string[]) {
      function doTest(cases: string[], toBe: boolean) {
        cases.forEach((value) => {
          fillFormFields({ [field]: value });
          expect(
            Testing.screen.getByTestId(field).classList.contains('error')
          ).toBe(toBe);
        });
      }
      doTest(badCases, true);
      doTest(goodCases, false);
    }

    beforeEach(() => {
      Testing.render(getComponentForTesting());
    });

    test('should validate nombre value', () => {
      testFieldValidation(
        'nombre',
        [],
        ['ioma']
      );
    });
  });

  test('should ignore successive submit events if props.isLoading is true', () => {
    const props = { ...getInitialProps(), isLoading: true };
    Testing.render(getComponentForTesting(props));
    Testing.fireEvent.submit(Testing.screen.getByTestId('form'));
    expect(props.onSubmit).toBeCalledTimes(0);
  });

});
