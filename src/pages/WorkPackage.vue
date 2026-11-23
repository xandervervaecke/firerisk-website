<template>
  <NotFound v-if="!wp" />
  <div v-else>
    <PageHero
      :image="wp.image"
      :image-small="wp.imageSmall"
      :crumbs="[{ label: 'Research', to: '/research' }, { label: wp.code }]"
    >
      <template #title>
        <span class="wp-code mono">{{ wp.code }}</span>
        {{ wp.title }}
      </template>
      <div class="hero-meta">
        <PhaseTag :phase="wp.phase" long />
        <span v-if="wp.theme" class="theme">{{ wp.theme }}</span>
      </div>
    </PageHero>

    <div class="section wp-body">
      <div class="container layout">
        <article class="main">
          <p class="summary">{{ wp.summary }}</p>
          <MarkdownContent :html="wp.html" />

          <section v-if="wp.deliverables?.length" class="deliverables" aria-labelledby="deliverables">
            <h2 id="deliverables">Expected outcomes &amp; deliverables</h2>
            <ul>
              <li v-for="d in wp.deliverables" :key="d.id">
                <span class="d-id mono">{{ d.id }}</span>
                <span>{{ d.title }}</span>
              </li>
            </ul>
          </section>

          <section v-if="contributions.length" class="contrib" aria-labelledby="contrib">
            <h2 id="contrib">Partner expertise</h2>
            <dl>
              <div v-for="c in contributions" :key="c.id">
                <dt>{{ c.name }}</dt>
                <dd>{{ c.text }}</dd>
              </div>
            </dl>
          </section>
        </article>

        <aside class="aside" aria-label="Work package details">
          <div class="card">
            <h2 class="aside-title">Lead partner</h2>
            <PartnerLinks :ids="[wp.lead]" long />

            <h2 class="aside-title">Participating partners</h2>
            <p v-if="wp.allPartners" class="all">All consortium partners</p>
            <PartnerLinks v-else :ids="wp.partners" long />

            <template v-if="people.length">
              <h2 class="aside-title">People</h2>
              <ul class="people">
                <li v-for="p in people" :key="p.slug">
                  <RouterLink :to="`/team/${p.slug}`">
                    <span class="p-name">{{ p.name || p.position }}</span>
                    <span v-if="p.name" class="p-pos">{{ p.position }}</span>
                  </RouterLink>
                </li>
              </ul>
            </template>

            <template v-if="related.length">
              <h2 class="aside-title">Connected work packages</h2>
              <ul class="related">
                <li v-for="r in related" :key="r.slug">
                  <RouterLink :to="`/research/${r.slug}`">
                    <span class="mono">{{ r.code }}</span> {{ r.short_title }}
                  </RouterLink>
                </li>
              </ul>
            </template>
          </div>
        </aside>
      </div>
    </div>

    <nav class="pager" aria-label="Other work packages">
      <div class="container pager-grid">
        <RouterLink v-if="prev" :to="`/research/${prev.slug}`" class="pager-link">
          <span class="dir mono"><Icon name="arrow-left" :size="16" /> Previous</span>
          <span class="pager-title"><span class="mono">{{ prev.code }}</span> {{ prev.short_title }}</span>
        </RouterLink>
        <span v-else />
        <RouterLink v-if="next" :to="`/research/${next.slug}`" class="pager-link next">
          <span class="dir mono">Next <Icon name="arrow-right" :size="16" /></span>
          <span class="pager-title"><span class="mono">{{ next.code }}</span> {{ next.short_title }}</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getWorkPackage, getWorkPackageByCode, workPackages, teamForWorkPackage, getPartner } from '@/content'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/PageHero.vue'
import PhaseTag from '@/components/PhaseTag.vue'
import PartnerLinks from '@/components/PartnerLinks.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import Icon from '@/components/Icon.vue'
import NotFound from './NotFound.vue'

const route = useRoute()
const wp = computed(() => getWorkPackage(route.params.slug))
const index = computed(() => workPackages.indexOf(wp.value))
const prev = computed(() => workPackages[index.value - 1])
const next = computed(() => workPackages[index.value + 1])
const related = computed(() => (wp.value?.related || []).map(getWorkPackageByCode).filter(Boolean))
const people = computed(() => (wp.value ? teamForWorkPackage(wp.value.code) : []))
const contributions = computed(() =>
  Object.entries(wp.value?.contributions || {}).map(([id, text]) => ({ id, text, name: getPartner(id)?.name || id })),
)

usePageMeta(() =>
  wp.value
    ? { title: `${wp.value.code}: ${wp.value.short_title || wp.value.title}`, description: wp.value.summary, image: wp.value.image }
    : { title: 'Page not found', noindex: true },
)
</script>

<style scoped>
.wp-code {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  color: var(--gold);
}
.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.5rem;
  color: var(--on-dark);
}
.theme {
  font-size: 0.95rem;
  color: var(--on-dark-muted);
}
.layout {
  display: grid;
  gap: clamp(3rem, 6vw, 6rem);
}
.main {
  min-width: 0;
  max-width: 72ch;
}
.summary {
  margin-bottom: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--line);
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  line-height: 1.45;
  letter-spacing: -0.015em;
  color: var(--ink);
}
.main :deep(.prose h2:first-child) {
  margin-top: 0;
}
.deliverables h2,
.contrib h2 {
  margin: 3.5rem 0 1.25rem;
  font-size: clamp(1.6rem, 2.6vw, 2.1rem);
  letter-spacing: -0.03em;
}
.deliverables ul {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
}
.deliverables li {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--line);
}
.d-id {
  font-size: 0.82rem;
  color: var(--fire-ink);
  padding-top: 0.15em;
}
.contrib dl {
  display: grid;
  gap: 1px;
  margin: 0;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.contrib div {
  padding: 1.1rem 1.25rem;
  background: var(--white);
}
.contrib dt {
  font-weight: 600;
  font-size: 0.95rem;
}
.contrib dd {
  margin: 0.25rem 0 0;
  color: var(--ink-muted);
  font-size: 0.95rem;
}
.aside .card {
  position: sticky;
  top: calc(var(--header-h) + 1.5rem);
  padding: 1.75rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--white);
}
.aside-title {
  margin: 1.75rem 0 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.aside-title:first-child {
  margin-top: 0;
}
.all {
  margin: 0;
  font-weight: 500;
}
.people,
.related {
  list-style: none;
  margin: 0;
  padding: 0;
}
.people li + li,
.related li + li {
  border-top: 1px solid var(--line);
}
.people a,
.related a {
  display: block;
  padding: 0.6rem 0;
  font-size: 0.93rem;
  font-weight: 500;
  transition: color 0.2s;
}
.people a:hover,
.related a:hover {
  color: var(--fire-ink);
}
.p-pos {
  display: block;
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--ink-muted);
}
.related .mono {
  font-size: 0.78rem;
  color: var(--forest);
  margin-right: 0.35rem;
}
.pager {
  border-top: 1px solid var(--line);
}
.pager-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.pager-link {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 2.25rem 0;
  transition: color 0.2s;
}
.pager-link.next {
  align-items: flex-end;
  text-align: right;
  padding-left: 1rem;
  border-left: 1px solid var(--line);
}
.pager-link:hover {
  color: var(--fire-ink);
}
.dir {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.pager-title {
  font-size: clamp(1.05rem, 2vw, 1.4rem);
  font-weight: 600;
  letter-spacing: -0.02em;
}
.pager-title .mono {
  font-size: 0.75em;
  color: var(--forest);
}
@media (min-width: 1000px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) 340px;
  }
}
</style>
