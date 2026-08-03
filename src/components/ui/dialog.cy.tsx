import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

describe('<Dialog />', () => {
  it('opens from its trigger and closes from the footer action', () => {
    cy.mount(<Dialog><DialogTrigger>Open profile</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Update your public information.</DialogDescription></DialogHeader><DialogFooter showCloseButton>Save</DialogFooter></DialogContent></Dialog>);

    cy.contains('button', 'Open profile').click();
    cy.get('[data-slot="dialog-content"]').should('be.visible');
    cy.get('[data-slot="dialog-title"]').should('have.text', 'Edit profile');
    cy.get('[data-slot="dialog-description"]').should('contain', 'public information');
    cy.contains('button', 'Close').click({ force: true });
    cy.get('[data-slot="dialog-content"]').should('not.exist');
  });
});
