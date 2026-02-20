describe('Article page', () => {
  it('renders title and toc', () => {
    cy.visit('/index.html')
    cy.contains('Tutu\'s Blog')
  })
})
