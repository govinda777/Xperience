describe('Application Startup Test', () => {
  it('should load the homepage', () => {
    cy.visit('http://localhost:5173/'); // substitua pela URL do app
    cy.title().should('not.be.empty'); // Verifica se o título da página não está vazio
    cy.url().should('include', 'http://localhost:5173/'); // Confirma que a URL é a correta
  });
});
