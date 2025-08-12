describe('Keyboard DnD reorder toast', () => {
  it('reorders a card with keyboard and shows toast', () => {
    cy.intercept('GET', 'http://localhost:4000/api/auth/me', { statusCode: 200, body: { userId: 'u1', isCreator: true } });
    cy.intercept('PATCH', '/api/creator/packs/*/cards/reorder', { statusCode: 200, body: { ok: true } }).as('reorder');

    cy.visit('/dashboard');
    cy.get('input[aria-label="Pack ID"]').clear().type('p-e2e');

    // Focus the first draggable item and perform keyboard DnD: space, arrow down, space
    cy.get('[data-rbd-drag-handle-context-id]').first().focus().type(' ').type('{downarrow}').type(' ');
    cy.wait('@reorder');
    cy.contains('Order saved').should('exist');
  });
});
