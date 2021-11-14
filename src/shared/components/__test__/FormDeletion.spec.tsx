import React from 'react';
import * as Testing from '@testing-library/react'

import { FormDeletion } from '../FormDeletion';

describe('<FormDeletion />', () => {

  function getInitialProps(): React.ComponentProps<typeof FormDeletion> {
    return {
      label: 'label',
      onPreDelete: jest.fn(),
      isDeleteMode: false,
      isLoading: false,
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
    };
  }

  function getComponentForTesting(props = getInitialProps()) {
    return (
      <FormDeletion {...props} />
    );
  }

  test('should render pre delete form if props.isDeleteMode is false', () => {
    const props = { ...getInitialProps(), isDeleteMode: false };
    const { rerender } = Testing.render(getComponentForTesting(props));
    expect(Testing.screen.getByTestId('predelete-form')).toBeInTheDocument();
    const reProps = { ...props, isDeleteMode: true };
    rerender(getComponentForTesting(reProps));
    expect(() => Testing.screen.getByTestId('predelete-form')).toThrow();
  });

  test('should render confirmation from if props.isDeleteMode is true', () => {
    const props = { ...getInitialProps(), isDeleteMode: true };
    const { rerender } = Testing.render(getComponentForTesting(props));
    expect(Testing.screen.getByTestId('delete-form')).toBeInTheDocument();
    const reProps = { ...props, isDeleteMode: false };
    rerender(getComponentForTesting(reProps));
    expect(() => Testing.screen.getByTestId('delete-form')).toThrow();
  });

});
