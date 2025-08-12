describe('Mouse DnD reorder toast', () => {
  it('reorders a card using mouse and shows toast', () => {
    cy.intercept('GET', 'http://localhost:4000/api/auth/me', { statusCode: 200, body: { userId: 'u1', isCreator: true } });
    cy.intercept('PATCH', '/api/creator/packs/*/cards/reorder', { statusCode: 200, body: { ok: true } }).as('reorder');

    cy.visit('/dashboard');
    cy.get('input[aria-label="Pack ID"]').clear().type('p-e2e');

    cy.get('[data-rbd-drag-handle-context-id]').then($handles => {
      const first = $handles.first();
      const second = $handles.eq(1);
      const r1 = first[0].getBoundingClientRect();
      const r2 = second[0].getBoundingClientRect();
      cy.wrap(first)
        .trigger('mousedown', { button: 0, clientX: r1.left + 5, clientY: r1.top + 5 })
        .trigger('mousemove', { clientX: r2.left + 5, clientY: r2.top + 10 })
        .trigger('mouseup', { force: true });
    });

    cy.wait('@reorder');
    cy.contains('Order saved').should('exist');
  });
});
