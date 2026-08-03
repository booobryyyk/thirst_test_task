import React from 'react';
import { FormError } from './formError';

describe('<FormError />', () => {
  it('only renders an alert when a message is supplied', () => {
    cy.mount(<FormError />);
    cy.get('[role="alert"]').should('not.exist');

    cy.mount(<FormError message="Unable to save your changes" />);
    cy.get('[role="alert"]').should('have.text', 'Unable to save your changes');
  });
});
