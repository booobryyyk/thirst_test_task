import React from 'react';
import { Label } from './label';

describe('<Label />', () => {
  it('focuses its associated control when clicked', () => {
    cy.mount(<><Label htmlFor="name">Name</Label><input id="name" /></>);

    cy.contains('label', 'Name').click();
    cy.get('#name').should('be.focused');
  });
});
