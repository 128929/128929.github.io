import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import container from 'markdown-it-container'
import footnote from 'markdown-it-footnote'
import { getHighlighter } from 'shiki'

export function createMarkdownRenderer() {
  const md = new MarkdownIt({ html: true, linkify: true, breaks: false })
  md.use(anchor, { permalink: anchor.permalink.headerLink() })
  md.use(container, 'note')
  md.use(footnote)

  let highlighter
  const highlight = async (code, lang) => {
    if (!highlighter) highlighter = await getHighlighter({ themes: ['github-light', 'github-dark'] })
    const html = highlighter.codeToHtml(code, { lang: lang || 'text', theme: 'github-light' })
    return `<div class="code-block">${html}</div>`
  }

  md.options.highlight = (str, lang) => {
    return str ? `<pre class="code-block"><code>${str}</code></pre>` : ''
  }

  async function render(src) {
    const mermaidBlocks = []
    const replaced = src.replace(/```mermaid([\s\S]*?)```/g, (_, g1) => {
      const id = 'mermaid-'+mermaidBlocks.length
      mermaidBlocks.push({ id, def: g1 })
      return `<div class="mermaid" id="${id}">${g1}</div>`
    })
    const html = md.render(replaced)
    if (mermaidBlocks.length) {
      const m = await import('mermaid')
      await m.default.run({ querySelector: '.mermaid' })
    }
    return html
  }

  return { render }
}
