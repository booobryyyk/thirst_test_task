/// <reference types="cypress" />
export {};
declare global {
  // Cypress custom commands are declared through its global namespace.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      signIn(email: string, password: string): Chainable;
    }
  }
}

Cypress.Commands.add('signIn', (email, password) => {
  const encodedEmail = encodeURIComponent(String(email));
  const typedPassword = String(password);

  cy.session(['cognito', email], () => {
    cy.visit(`/sign-in?email=${encodedEmail}&returnTo=/`);
    cy.get('#password').type(typedPassword, { log: false });
    cy.contains('button', 'Sign in').click();
    cy.location('pathname', { timeout: 20_000 }).should('eq', '/');
    cy.get('#new-post', { timeout: 20_000 }).should('be.visible');
  });
});
