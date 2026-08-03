import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

describe('<Tooltip />', () => {
  it('shows its content when the trigger is hovered', () => {
    cy.mount(<TooltipProvider delay={0}><Tooltip><TooltipTrigger>More information</TooltipTrigger><TooltipContent>Helpful details</TooltipContent></Tooltip></TooltipProvider>);

    cy.contains('button', 'More information').trigger('mouseenter');
    cy.get('[data-slot="tooltip-content"]').should('be.visible').and('have.text', 'Helpful details');
  });
});
