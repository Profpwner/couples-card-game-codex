describe('Toasts for PackBuilder and Onboarding', () => {
  it('shows PackBuilder save toast (autosave) and auto-dismiss', () => {
    cy.intercept('GET', 'http://localhost:4000/api/auth/me', { statusCode: 200, body: { userId: 'u1', isCreator: true } });
    cy.intercept('GET', '/api/creator/packs/*/cards', { statusCode: 200, body: { cards: [] } });
    cy.intercept('PUT', '/api/creator/packs/*/cards', { statusCode: 200, body: { ok: true }, delayMs: 300 }).as('putCards');
    cy.clock();

    cy.visit('/dashboard');
    cy.get('input[aria-label="Pack ID"]').clear().type('p-e2e');
    cy.wait('@putCards');
    cy.contains('Saved').should('exist');
    cy.tick(5000);
    cy.contains('Saved').should('not.exist');
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

  it('shows PATCH and DELETE toasts in PackBuilder', () => {
    cy.intercept('GET', 'http://localhost:4000/api/auth/me', { statusCode: 200, body: { userId: 'u1', isCreator: true } });
    cy.intercept('PATCH', '/api/creator/packs/*/cards', { statusCode: 200, body: { ok: true } }).as('patchCard');
    cy.intercept('DELETE', '/api/creator/packs/*/cards*', { statusCode: 200, body: { ok: true } }).as('deleteCard');

    cy.visit('/dashboard');
    // Ensure pack id present for server interactions
    cy.get('input[aria-label="Pack ID"]').clear().type('p-e2e');

    // Edit first card to trigger PATCH
    cy.contains('button', 'Edit').first().click();
    cy.contains('input[aria-label="Edit card text"]').clear().type('Edited via Cypress');
    cy.contains('button', 'Apply').click();
    cy.wait('@patchCard');
    cy.contains('Card updated').should('exist');

    // Delete first card to trigger DELETE
    cy.contains('button', 'Delete').first().click();
    cy.wait('@deleteCard');
    cy.contains('Card deleted').should('exist');
  });
