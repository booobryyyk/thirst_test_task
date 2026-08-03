describe('sign up', () => {
  it('creates and confirms a Cognito account through the UI', function () {
    cy.env(['enableSignUpTests']).then(({ enableSignUpTests: enabled }) => {
      if (enabled !== true && enabled !== 'true') this.skip();

      const email = `cypress-${Date.now()}@example.test`;
      const password = 'Cypress1!';
      cy.visit('/sign-up');
      cy.get('#display-name').type('Cypress User');
      cy.get('#email').type(email);
      cy.get('#password').type(password, { log: false });
      cy.get('#confirm-password').type(password, { log: false });
      cy.contains('button', 'Create account').click();
      cy.location('pathname').should('eq', '/confirm-sign-up');
      cy.task('confirmCognitoUser', email);

      cy.visit(`/sign-in?email=${encodeURIComponent(email)}&returnTo=/`);
      cy.get('#password').type(password, { log: false });
      cy.contains('button', 'Sign in').click();
      cy.location('pathname').should('eq', '/');
      cy.contains('button:visible', 'Sign out').should('be.visible');
    });
  });
});
