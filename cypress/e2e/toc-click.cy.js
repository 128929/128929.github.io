describe('点击目录平滑滚动', () => {
  it('点击目录项平滑滚动到目标标题并更新 hash', () => {
    cy.visit('/posts/openclaw-feishu/')
    cy.get('#card-toc .toc-content .toc .toc-link').first().click()

    // 检查滚动接近目标位置与 hash
    cy.get('#card-toc .toc-content .toc .toc-link').first().then($a => {
      const href = $a.attr('href')
      const id = href.replace('#','')
      cy.get(`#${id}`).then($h => {
        const top = $h[0].getBoundingClientRect().top
        expect(Math.abs(top)).to.be.lessThan(100)
      })
      cy.url().should('include', href)
    })
  })
})