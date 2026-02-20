describe('移动端目录展开/收起', () => {
  it('375x812 视口下可展开与收起目录', () => {
    cy.viewport(375, 812)
    cy.visit('/posts/openclaw-feishu/')

    cy.get('#card-toc').should('exist').and('be.visible')

    // 触发移动端目录按钮（右侧工具条）
    cy.get('#mobile-toc-button').click({ force: true })
    cy.get('#card-toc').should('have.class', 'open')

    cy.get('#mobile-toc-button').click({ force: true })
    cy.get('#card-toc').should('not.have.class', 'open')
  })
})