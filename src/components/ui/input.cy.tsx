import React from 'react';
import { Input } from './input';

describe('<Input />', () => {
  it('forwards native input props', () => {
    cy.mount(<Input type="email" placeholder="you@example.com" aria-label="Email" />);

    cy.get('input[aria-label="Email"]').type('ada@example.com').should('have.value', 'ada@example.com');
  });
});
