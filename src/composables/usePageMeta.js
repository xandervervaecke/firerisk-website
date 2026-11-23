import { watchEffect, onBeforeUnmount } from 'vue'
import { site } from '@/content'
import { asset } from './utils'

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/**
 * Sets the document title and SEO / social meta tags for the current page.
 * Pass a function so the values stay reactive (e.g. on dynamic routes).
 */
export function usePageMeta(getMeta) {
  const stop = watchEffect(() => {
    const meta = typeof getMeta === 'function' ? getMeta() : getMeta
    const title = meta.title ? `${meta.title} | ${site.name}` : `${site.name} | ${site.tagline}`
    const description = (meta.description || site.description || '').replace(/\s+/g, ' ').trim()
    const image = meta.image || '/videos/hero-poster.webp'
    const absoluteImage = site.url ? site.url + asset(image) : asset(image)

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', absoluteImage)
    setMeta('property', 'og:type', meta.type || 'website')
    setMeta('name', 'robots', meta.noindex ? 'noindex' : 'index, follow')
  })
  onBeforeUnmount(stop)
}
