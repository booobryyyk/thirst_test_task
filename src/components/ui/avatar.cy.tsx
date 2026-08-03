import React from 'react';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './avatar';

describe('<Avatar />', () => {
  it('renders image, fallback, badge, and group variants', () => {
    cy.mount(
      <AvatarGroup>
        <Avatar size="sm"><AvatarImage src="/avatar.png" alt="Ada Lovelace" /><AvatarFallback>AL</AvatarFallback><AvatarBadge>1</AvatarBadge></Avatar>
        <Avatar size="lg"><AvatarFallback>GH</AvatarFallback></Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    );

    cy.get('[data-slot="avatar-group"]').should('exist');
    cy.get('[data-slot="avatar"]').should('have.length', 2);
    cy.get('[data-slot="avatar"]').first().should('have.attr', 'data-size', 'sm');
    cy.get('[data-slot="avatar-fallback"]').first().should('have.text', 'AL');
    cy.get('[data-slot="avatar-badge"]').should('contain', '1');
    cy.get('[data-slot="avatar-group-count"]').should('contain', '+2');
  });
});
