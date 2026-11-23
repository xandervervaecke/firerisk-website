/**
 * FireRisk content pipeline
 * -------------------------
 * Turns Markdown (+ YAML frontmatter) and YAML files in `src/content/` into
 * plain JavaScript modules at build time. Pages then discover content with
 * `import.meta.glob`, so adding a file is all it takes to publish it.
 *
 *   *.md   -> { attributes, html, intro, sections: [{ id, title, html }], words }
 *   *.yaml -> parsed YAML object
 *
 * The same `parseMarkdown` function is reused by scripts/postbuild.mjs to
 * generate per-route SEO metadata and the sitemap.
 */
import fs from 'node:fs'
import path from 'node:path'
import MarkdownIt from 'markdown-it'
import { load as loadYaml } from 'js-yaml'

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function createRenderer(base) {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true })
  const withBase = (url) =>
    url && url.startsWith('/') && !url.startsWith('//') && base !== '/'
      ? base.replace(/\/$/, '') + url
      : url

  // External links open in a new tab; root-relative URLs get the deploy base.
  const defaultLinkOpen =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const href = token.attrGet('href') || ''
    if (/^https?:\/\//.test(href)) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
    } else if (href.startsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(href)) {
      token.attrSet('data-internal', '')
    }
    if (href.startsWith('/')) token.attrSet('href', withBase(href))
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  // Images are lazy-loaded and resolved against the deploy base.
  const defaultImage = md.renderer.rules.image
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    token.attrSet('src', withBase(token.attrGet('src')))
    token.attrSet('loading', 'lazy')
    token.attrSet('decoding', 'async')
    return defaultImage(tokens, idx, options, env, self)
  }

  // Headings get stable ids so they can be linked to.
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const title = tokens[idx + 1]?.content || ''
    tokens[idx].attrSet('id', slugify(title))
    return self.renderToken(tokens, idx, options)
  }
  return md
}

/** Remove HTML comments and whitespace to decide whether a section is "empty". */
function hasContent(markdown) {
  return markdown.replace(/<!--[\s\S]*?-->/g, '').trim().length > 0
}

/**
 * Split a Markdown body on level-2 headings ("## Title").
 * Text before the first heading becomes the `intro`.
 */
function splitSections(body) {
  const lines = body.split(/\r?\n/)
  const sections = []
  let intro = []
  let current = null
  let inFence = false
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    const match = !inFence && /^##\s+(.+?)\s*#*\s*$/.exec(line)
    if (match) {
      current = { title: match[1].trim(), lines: [] }
      sections.push(current)
    } else if (current) {
      current.lines.push(line)
    } else {
      intro.push(line)
    }
  }
  return { intro: intro.join('\n'), sections }
}

/** Optional responsive variant: /images/x.webp -> /images/x-800.webp if that file exists. */
function smallVariant(publicDir, url) {
  if (typeof url !== 'string' || !url.startsWith('/')) return undefined
  const small = url.replace(/(\.[a-z0-9]+)$/i, '-800$1')
  return fs.existsSync(path.join(publicDir, small)) ? small : undefined
}

export function parseMarkdown(raw, { base = '/', publicDir = 'public' } = {}) {
  const md = createRenderer(base)
  const fm = FRONTMATTER.exec(raw)
  const attributes = (fm && loadYaml(fm[1])) || {}
  const body = fm ? raw.slice(fm[0].length) : raw

  for (const key of ['image', 'photo']) {
    const small = smallVariant(publicDir, attributes[key])
    if (small) attributes[`${key}Small`] = small
  }

  const { intro, sections } = splitSections(body)
  return {
    attributes,
    html: hasContent(body) ? md.render(body) : '',
    intro: hasContent(intro) ? md.render(intro) : '',
    sections: sections
      .filter((s) => hasContent(s.lines.join('\n')))
      .map((s) => ({ id: slugify(s.title), title: s.title, html: md.render(s.lines.join('\n')) })),
    words: body.replace(/<!--[\s\S]*?-->/g, '').split(/\s+/).filter(Boolean).length,
  }
}

export default function contentPlugin() {
  let base = '/'
  let publicDir = 'public'
  return {
    name: 'firerisk-content',
    enforce: 'pre',
    configResolved(config) {
      base = config.base
      publicDir = config.publicDir
    },
    transform(code, id) {
      const file = id.split('?')[0]
      if (file.endsWith('.md')) {
        const data = parseMarkdown(code, { base, publicDir })
        return { code: `export default ${JSON.stringify(data)}`, map: null }
      }
      if (/\.ya?ml$/.test(file)) {
        return { code: `export default ${JSON.stringify(loadYaml(code))}`, map: null }
      }
    },
  }
}
