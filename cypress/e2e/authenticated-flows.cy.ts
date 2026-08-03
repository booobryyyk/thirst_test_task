type TestCredentials = { email: string; password: string };

function configuredCredentials(): Cypress.Chainable<TestCredentials> {
  return cy.env(['testUserEmail', 'testUserPassword']).then((env) => {
    if (!env.testUserEmail || !env.testUserPassword) {
      throw new Error(
        'Set CYPRESS_testUserEmail and CYPRESS_testUserPassword before running authenticated Cypress tests.'
      );
    }

    return {
      email: String(env.testUserEmail),
      password: String(env.testUserPassword),
    };
  });
}

function createPost(content: string) {
  cy.visit('/');
  cy.get('#new-post').type(content);
  cy.contains('button', 'Publish').click();
  cy.contains('article', content).should('be.visible');
}

describe('sign in', () => {
  let credentials: TestCredentials;

  before(() => {
    configuredCredentials().then((value) => {
      credentials = value;
    });
  });

  it('signs in through the Cognito form', () => {
    cy.visit(
      `/sign-in?email=${encodeURIComponent(credentials.email)}&returnTo=/`
    );
    cy.get('#email').should('have.value', credentials.email);
    cy.get('#password').type(credentials.password, { log: false });
    cy.contains('button', 'Sign in').click();

    cy.location('pathname', { timeout: 20_000 }).should('eq', '/');
    cy.get('#new-post', { timeout: 20_000 }).should('be.visible');
  });
});

describe('authenticated post flows', () => {
  let credentials: TestCredentials;

  before(() => {
    configuredCredentials().then((value) => {
      credentials = value;
    });
  });

  beforeEach(() => cy.signIn(credentials.email, credentials.password));

  it('creates a post', () => {
    const post = `Cypress created post ${Date.now()}`;
    createPost(post);
    cy.contains('article', post).find('time').should('be.visible');
  });

  it('visits the author page from a post', () => {
    const post = `Cypress author post ${Date.now()}`;
    createPost(post);

    cy.contains('article', post).find('a[href^="/users/"]').first().click();
    cy.location('pathname').should('match', /^\/users\/.+/);
    cy.contains('h2', 'Posts').should('be.visible');
    cy.contains('article', post).should('be.visible');
  });

  it('likes a post', () => {
    const post = `Cypress liked post ${Date.now()}`;
    createPost(post);

    cy.contains('article', post).find('button[aria-label="Like post"]').click();
    cy.contains('article', post)
      .find('button[aria-label="Unlike post"]')
      .should('have.attr', 'aria-pressed', 'true');
  });

  it('signs out', () => {
    cy.visit('/');
    cy.contains('button:visible', 'Sign out').click();

    cy.contains('a:visible', 'Sign in').should('be.visible');
    cy.get('#new-post').should('not.exist');
  });
});
