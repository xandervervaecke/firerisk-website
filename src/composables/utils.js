const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Resolve a root-relative public asset path ("/images/x.webp") against the deploy base. */
export function asset(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return BASE + (path.startsWith('/') ? path : `/${path}`)
}

export function formatDate(iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return ''
  const date = new Date(`${String(iso).slice(0, 10)}T12:00:00`)
  return Number.isNaN(date.getTime()) ? String(iso) : date.toLocaleDateString('en-GB', opts)
}

export function initials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
