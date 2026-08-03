import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

describe('<Sheet />', () => {
  it('opens on the requested side and closes with its close button', () => {
    cy.mount(<Sheet><SheetTrigger>Open navigation</SheetTrigger><SheetContent side="left"><SheetHeader><SheetTitle>Navigation</SheetTitle><SheetDescription>Choose a destination.</SheetDescription></SheetHeader><SheetFooter>Footer</SheetFooter></SheetContent></Sheet>);

    cy.contains('button', 'Open navigation').click();
    cy.get('[data-slot="sheet-content"]').should('have.attr', 'data-side', 'left');
    cy.get('[data-slot="sheet-title"]').should('have.text', 'Navigation');
    cy.get('[data-slot="sheet-description"]').should('contain', 'destination');
    cy.get('[data-slot="sheet-close"]').click({ force: true });
    cy.get('[data-slot="sheet-content"]').should('not.exist');
  });
});
