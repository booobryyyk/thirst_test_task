import React from 'react';
import { Button, buttonVariants } from './button';

describe('<Button />', () => {
  it('renders its content and forwards click events', () => {
    const onClick = cy.stub().as('onClick');

    cy.mount(<Button onClick={onClick}>Save changes</Button>);

    cy.contains('button', 'Save changes').click();
    cy.get('@onClick').should('have.been.calledOnce');
  });

  it('applies the selected variants and disables interaction', () => {
    cy.mount(
      <Button variant="destructive" size="icon-sm" disabled aria-label="Delete" />
    );

    cy.get('button[aria-label="Delete"]').should('be.disabled');
    expect(buttonVariants({ variant: 'destructive', size: 'icon-sm' })).to.contain(
      'text-destructive'
    );
  });
});
