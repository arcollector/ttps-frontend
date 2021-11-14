import React from 'react';
import * as Testing from '@testing-library/react'
import * as yup from 'yup';

import { FormInput } from '../FormInput';

describe('<FormInput />', () => {

  function getInitialProps(onChange = jest.fn()): React.ComponentProps<typeof FormInput> {
    return {
      label: 'label',
      name: 'name',
      placeholder: 'placeholder',
      type: 'text',
      onChange,
      value: 'value',
    };
  }

  function getComponentForTesting(props = getInitialProps()) {
    return (
      <FormInput {...props} />
    );
  }

  function triggerChangeEvent(name: string, value: string) {
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

});
