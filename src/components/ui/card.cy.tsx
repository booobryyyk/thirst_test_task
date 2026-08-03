import React from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

describe('<Card />', () => {
  it('renders each card section and accepts the compact size', () => {
    cy.mount(
      <Card size="sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Account details</CardDescription>
          <CardAction>Edit</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    cy.get('[data-slot="card"]').should('have.attr', 'data-size', 'sm');
    cy.get('[data-slot="card-title"]').should('have.text', 'Profile');
    cy.get('[data-slot="card-description"]').should(
      'have.text',
      'Account details'
    );
    cy.get('[data-slot="card-action"]').should('have.text', 'Edit');
    cy.get('[data-slot="card-content"]').should('have.text', 'Content');
    cy.get('[data-slot="card-footer"]').should('have.text', 'Footer');
  });
});
