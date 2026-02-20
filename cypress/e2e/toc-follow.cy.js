describe('目录高亮跟随', () => {
  it('滚动时目录高亮与 hash 同步', () => {
    cy.visit('/posts/openclaw-feishu/')
    cy.get('#card-toc .toc-content .toc .toc-link').should('exist')

    // 滚动到正文起始
    cy.get('#article-text-body').then($el => {
      const top = $el[0].getBoundingClientRect().top + window.scrollY
      cy.window().then(win => win.scrollTo(0, top + 10))
    })

    // 断言存在 active 且 URL hash 更新
    cy.get('#card-toc .toc-content .toc .toc-link.active').should('exist').then($a => {
      const href = $a.attr('href')
      cy.url().should('include', href)
    })
  })
})