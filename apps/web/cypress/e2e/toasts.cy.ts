describe('Toasts for PackBuilder and Onboarding', () => {
  it('shows PackBuilder save toast (autosave)', () => {
    cy.intercept('GET', 'http://localhost:4000/api/auth/me', { statusCode: 200, body: { userId: 'u1', isCreator: true } });
    cy.intercept('GET', '/api/creator/packs/*/cards', { statusCode: 200, body: { cards: [] } });
    cy.intercept('PUT', '/api/creator/packs/*/cards', { statusCode: 200, body: { ok: true } }).as('putCards');

    cy.visit('/dashboard');
    cy.get('input[aria-label="Pack ID"]').clear().type('p-e2e');
    cy.wait('@putCards');
    cy.contains('Saved').should('exist');
  });

  it('shows onboarding success and failure toasts', () => {
    cy.intercept('GET', 'http://localhost:4000/api/auth/me', { statusCode: 200, body: { userId: 'u1', isCreator: false } });
    cy.intercept('GET', '/api/creator/status*', { statusCode: 200, body: { isCreator: false } });
    cy.visit('/onboard');

    // Success path
    cy.intercept('POST', '/api/creator/onboard', { statusCode: 200, body: { message: 'Onboarding successful', userId: 'u1' } }).as('onboardPost');
    cy.get('input[placeholder="Your creator name"]').type('Cypress User');
    cy.get('input[type="checkbox"]').first().check({ force: true });
    cy.contains('button', 'Complete Onboarding').click();
    cy.wait('@onboardPost');
    cy.contains('Onboarding successful').should('exist');

    // Failure path
    cy.intercept('POST', '/api/creator/onboard', { statusCode: 500, body: { error: 'boom' } }).as('onboardFail');
    cy.contains('button', 'Complete Onboarding').click();
    cy.wait('@onboardFail');
    cy.contains(/Onboarding failed/i).should('exist');
  });
});
