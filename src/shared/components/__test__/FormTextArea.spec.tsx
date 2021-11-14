import React from 'react';
import * as Testing from '@testing-library/react'
import * as yup from 'yup';

import { FormTextArea } from '../FormTextArea';

describe('<FormTextArea />', () => {

  function getInitialProps(onChange = jest.fn()): React.ComponentProps<typeof FormTextArea> {
    return {
      label: 'label',
      name: 'name',
      placeholder: 'placeholder',
      onChange,
      value: 'value',
    };
  }

  function getComponentForTesting(props = getInitialProps()) {
    return (
      <FormTextArea {...props} />
    );
  }

  function triggerChangeEvent(name: string, value: any) {
    Testing.fireEvent.change(
      Testing.screen.getByRole('textbox', { name }),
      { target: { value } }
    );
  }

  test('should use props.validator if is defined', () => {
    const validator = { validateSync: jest.fn() };
    const props = { ...getInitialProps(), validator };
    Testing.render(getComponentForTesting(props));

    triggerChangeEvent(props.label, 'whatever');
    expect(validator.validateSync).toBeCalledTimes(1);
  });

  test('should display errors when ocurrs', () => {
    const validator = { validateSync() { throw new yup.ValidationError('this is an error') } };
    const props = { ...getInitialProps(), validator };
    Testing.render(getComponentForTesting(props));

    triggerChangeEvent(props.label, 'whatever');
    expect(Testing.screen.getByText('this is an error')).toBeInTheDocument();
  });

  test('should cast event target value to string whatver its value is', () => {
    const validator = { validateSync: jest.fn() };
    const props = { ...getInitialProps(), validator };

    Testing.render(getComponentForTesting(props));
    triggerChangeEvent(props.label, 'whatever');
    expect(props.onChange).toHaveBeenNthCalledWith(1, props.name, 'whatever');
    // dont know why textarea cant number or undefined
    triggerChangeEvent(props.label, 1);
    expect(props.onChange).toHaveBeenNthCalledWith(2, props.name, '1');
    // undefined but null to trigger the change event, i dont know why
    triggerChangeEvent(props.label, null);
    expect(props.onChange).toHaveBeenNthCalledWith(3, props.name, '');
  });

});
