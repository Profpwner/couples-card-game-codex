describe('Accessibility flows', () => {
  it('Skip links work and main receives focus', () => {
    cy.visit('/');
    cy.get('a[href="#main-content"]').focus().type('{enter}');
    cy.get('#main-content').should('be.focused');
  });

  it('Announces route changes and marks nav with aria-current', () => {
    cy.visit('/');
    cy.get('a[href="/analytics"]').click();
    cy.location('pathname').should('eq', '/analytics');
    cy.get('nav a[aria-current="page"]').should('have.attr', 'href', '/analytics');
    cy.get('.sr-only[aria-live="polite"]').contains('Navigated');
  });
});

