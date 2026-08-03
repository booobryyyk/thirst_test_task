import React from 'react';
import { Separator } from './separator';
import { Skeleton } from './skeleton';
import { Textarea } from './textarea';

describe('simple UI primitives', () => {
  it('renders textarea, skeleton, and both separator orientations', () => {
    cy.mount(<><Textarea aria-label="Bio" defaultValue="Hello" /><Skeleton data-testid="loading" /><Separator /><Separator orientation="vertical" /></>);

    cy.get('textarea[aria-label="Bio"]').should('have.value', 'Hello');
    cy.get('[data-testid="loading"]').should('have.attr', 'data-slot', 'skeleton');
    cy.get('[data-slot="separator"]').eq(0).should('have.attr', 'data-orientation', 'horizontal');
    cy.get('[data-slot="separator"]').eq(1).should('have.attr', 'data-orientation', 'vertical');
  });
});
