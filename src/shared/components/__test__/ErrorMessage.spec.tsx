import React from 'react';
import * as Testing from '@testing-library/react'

import { ErrorMessage } from '../ErrorMessage';

describe('<ErrorMessage />', () => {

  function getInitialProps(errors: string[] = []): React.ComponentProps<typeof ErrorMessage> {
    return {
      heading: 'heading',
      errors,
    };
  }

  function getComponentForTesting(props = getInitialProps()) {
    return (
      <ErrorMessage {...props} />
    );
  }

  test('should render itself as null if props.errors is empty array', () => {
    Testing.render(getComponentForTesting());
    expect(() => Testing.screen.getByTestId('errormessage')).toThrow();
  });

  test('should render itset if props.error has contents', () => {
    const props = getInitialProps(['this is an error']);
    Testing.render(getComponentForTesting(props));
    expect(Testing.screen.getByTestId('errormessage')).toBeInTheDocument();
    expect(Testing.screen.getByText('this is an error')).toBeInTheDocument();
  });

});
