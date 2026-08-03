import React from 'react';
import { FormField } from './formField';
import { Input } from './input';

describe('<FormField />', () => {
  it('associates the label with its field', () => {
    cy.mount(<FormField id="email" label="Email address"><Input id="email" type="email" /></FormField>);

    cy.get('#email').should('have.attr', 'type', 'email');
  });
});
