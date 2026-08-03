describe('viewing posts as a guest', () => {
  it('shows the public feed without exposing post creation', () => {
    cy.visit('/');

    cy.contains('h1', 'Feed').should('be.visible');
    cy.contains('a:visible', 'Sign in').should('be.visible');
    cy.contains('a:visible', 'Sign up').should('be.visible');

    // The public IAM request can take longer than Cypress's default timeout.
    // Do not treat the loading skeleton as a rendered feed.
    cy.get('main', { timeout: 20_000 }).should(($main) => {
      expect($main.find('.animate-pulse').length).to.equal(0);

      const hasPosts = $main.find('article').length > 0;
      const hasEmptyFeedMessage = $main.text().includes('The feed is quiet');

      expect(hasPosts || hasEmptyFeedMessage).to.equal(true);
    });

    cy.get('#new-post').should('not.exist');
  });
});
