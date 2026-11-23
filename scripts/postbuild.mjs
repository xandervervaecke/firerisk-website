/**
 * Post-build step (runs after `vite build`)
 * ----------------------------------------
 * 1. Writes a copy of index.html for every route (dist/research/index.html,
 *    dist/news/<slug>/index.html, …) with the right <title>, description and
 *    social meta tags. Crawlers and link previews see correct metadata, and
 *    deep links work on any static host without rewrite rules.
 * 2. Writes 404.html (GitHub Pages / Netlify / most hosts serve it for
 *    unknown URLs; the Vue app then shows its own 404 page).
 * 3. Writes sitemap.xml and robots.txt (sitemap only if `url` is set in site.yaml).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { load as loadYaml } from 'js-yaml'
import { parseMarkdown } from '../plugins/content.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const contentDir = path.join(root, 'src/content')
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/')

const site = loadYaml(fs.readFileSync(path.join(contentDir, 'site.yaml'), 'utf8'))
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

function readCollection(dir) {
  const folder = path.join(contentDir, dir)
  return fs
    .readdirSync(folder)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => ({ slug: f.replace(/\.md$/, ''), ...parseMarkdown(fs.readFileSync(path.join(folder, f), 'utf8')).attributes }))
    .filter((item) => !item.draft)
}

const escape = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/\s+/g, ' ').trim()

const routes = [
  { path: '/', title: `${site.name} | ${site.tagline}`, description: site.description },
  { path: '/research', title: `Research | ${site.name}`, description: 'The ten FireRisk work packages, organised along the wildfire science loop: before, during and after a fire.', image: '/images/site/misty-forest.webp' },
  { path: '/team', title: `Team | ${site.name}`, description: 'Meet the researchers and staff of the FireRisk consortium.' },
  { path: '/news', title: `News | ${site.name}`, description: 'News and updates from the FireRisk research project.' },
  { path: '/contact', title: `Contact | ${site.name}`, description: 'Contact the FireRisk consortium and learn about the partner institutions.' },
  ...readCollection('work-packages').map((wp) => ({
    path: `/research/${wp.slug}`,
    title: `WP${wp.number}: ${wp.short_title || wp.title} | ${site.name}`,
    description: wp.summary,
    image: wp.image,
  })),
  ...readCollection('team').map((p) => ({
    path: `/team/${p.slug}`,
    title: `${p.name || p.position} | ${site.name}`,
    description: `${p.name ? `${p.name}, ` : ''}${p.position}. FireRisk team.`,
    image: p.photo || undefined,
  })),
  ...readCollection('news').map((a) => ({
    path: `/news/${a.slug}`,
    title: `${a.title} | ${site.name}`,
    description: a.excerpt,
    image: a.image,
    type: 'article',
  })),
]

const abs = (p) => (site.url ? site.url.replace(/\/$/, '') : '') + base.replace(/\/$/, '') + p

function render(route) {
  const image = abs(route.image || '/videos/hero-poster.webp')
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(route.description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(route.title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${escape(route.description)}`)
    .replace(/(<meta property="og:image" content=")[^"]*/, `$1${escape(image)}`)
    .replace(/(<meta property="og:type" content=")[^"]*/, `$1${route.type || 'website'}`)
  if (site.url) html = html.replace('</head>', `    <link rel="canonical" href="${abs(route.path === '/' ? '/' : `${route.path}/`)}" />\n  </head>`)
  return html
}

for (const route of routes) {
  const dir = path.join(dist, route.path)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), render(route))
}

fs.writeFileSync(
  path.join(dist, '404.html'),
  render({ path: '/404', title: `Page not found | ${site.name}`, description: site.description }).replace(
    '</head>',
    '    <meta name="robots" content="noindex" />\n  </head>',
  ),
)

let robots = 'User-agent: *\nAllow: /\n'
if (site.url) {
  const urls = routes.map((r) => `  <url><loc>${abs(r.path === '/' ? '/' : `${r.path}/`)}</loc></url>`).join('\n')
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
  robots += `Sitemap: ${abs('/sitemap.xml')}\n`
}
fs.writeFileSync(path.join(dist, 'robots.txt'), robots)

console.log(`postbuild: wrote ${routes.length} route pages, 404.html${site.url ? ', sitemap.xml' : ''} and robots.txt`)
