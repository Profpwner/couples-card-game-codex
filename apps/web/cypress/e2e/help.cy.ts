describe('Help overlay opens via keyboard and buttons', () => {
  it('opens via "?" key', () => {
    cy.visit('/');
    cy.get('body').type('?');
    cy.contains('Keyboard Shortcuts').should('exist');
    cy.get('body').type('{esc}');
    cy.contains('Keyboard Shortcuts').should('not.exist');
  });

  it('opens via nav Help button', () => {
    cy.visit('/');
    cy.contains('button', /help/i).click();
    cy.contains('Keyboard Shortcuts').should('exist');
    cy.contains('button', '✕').click();
    cy.contains('Keyboard Shortcuts').should('not.exist');
  });

  it('opens via footer link', () => {
    cy.visit('/');
    cy.contains('a', /keyboard shortcuts/i).click();
    cy.contains('Keyboard Shortcuts').should('exist');
  });
});
