/**
 * Content API
 * -----------
 * Discovers every Markdown / YAML file in this folder at build time.
 * Adding, editing or removing a file is enough, no Vue component changes.
 * Files whose name starts with "_" (templates) and entries with
 * `draft: true` are skipped.
 */
import site from './site.yaml'
import partnerList from './partners.yaml'

const teamFiles = import.meta.glob('./team/*.md', { eager: true, import: 'default' })
const newsFiles = import.meta.glob('./news/*.md', { eager: true, import: 'default' })
const wpFiles = import.meta.glob('./work-packages/*.md', { eager: true, import: 'default' })

function collect(files) {
  return Object.entries(files)
    .map(([path, mod]) => {
      const slug = path.split('/').pop().replace(/\.md$/, '')
      return { slug, ...mod.attributes, html: mod.html, intro: mod.intro, sections: mod.sections, words: mod.words }
    })
    .filter((item) => !item.slug.startsWith('_') && !item.draft)
}

export { site }

/* ---------- Partners ---------- */
export const partners = partnerList
const partnerById = Object.fromEntries(partners.map((p) => [p.id, p]))
export const getPartner = (id) => partnerById[id]
/** Unique institutions (UHasselt has two research units in the consortium). */
export const institutions = [...new Set(partners.map((p) => p.institution))]
export const institutionShort = (name) => partners.find((p) => p.institution === name)?.institution_short || name

/* ---------- Phases of the wildfire science loop ---------- */
export const phases = [
  { id: 'before', label: 'Before', name: 'Prevention', text: 'Map exposure and vulnerability, measure fuel and microclimate, and model how fires spread.' },
  { id: 'during', label: 'During', name: 'Response', text: 'Bring data and predictions into the command post, and train responders in realistic simulations.' },
  { id: 'after', label: 'After', name: 'Recovery', text: 'Monitor how landscapes recover and design fire-resilient management and restoration.' },
  { id: 'cross-cutting', label: 'Across', name: 'Governance & uptake', text: 'Connect the loop through crisis governance, stakeholder uptake and coordination.' },
]
export const getPhase = (id) => phases.find((p) => p.id === id)

/* ---------- Work packages ---------- */
export const workPackages = collect(wpFiles)
  .map((wp) => {
    const allPartners = Array.isArray(wp.partners) && wp.partners.includes('all')
    return {
      ...wp,
      code: `WP${wp.number}`,
      allPartners,
      partners: allPartners ? partners.map((p) => p.id).filter((id) => id !== wp.lead) : wp.partners || [],
    }
  })
  .sort((a, b) => a.number - b.number)
const wpByCode = Object.fromEntries(workPackages.map((wp) => [wp.code, wp]))
export const getWorkPackage = (slug) => workPackages.find((wp) => wp.slug === slug)
export const getWorkPackageByCode = (code) => wpByCode[String(code).toUpperCase().replace(/\s/g, '')]

/* ---------- Team ---------- */
export const team = collect(teamFiles)
  .map((p) => ({ ...p, work_packages: p.work_packages || [] }))
  .sort((a, b) => (a.order ?? 50) - (b.order ?? 50) || (a.name || '').localeCompare(b.name || ''))
export const getPerson = (slug) => team.find((p) => p.slug === slug)
export const teamForWorkPackage = (code) => team.filter((p) => p.work_packages.includes(code))

/* ---------- News ---------- */
export const news = collect(newsFiles)
  .map((a) => ({ ...a, date: String(a.date || ''), readingMinutes: Math.max(1, Math.round(a.words / 220)) }))
  .sort((a, b) => b.date.localeCompare(a.date) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.title.localeCompare(b.title))
export const getArticle = (slug) => news.find((a) => a.slug === slug)
export const newsCategories = [...new Set(news.map((a) => a.category).filter(Boolean))].sort()
