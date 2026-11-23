<template>
  <div>
    <PageHero
      eyebrow="Research"
      title="Ten work packages, one wildfire science loop."
      lead="From landscape-scale mapping to crisis governance: how FireRisk's research is organised, who leads each part, and how the pieces feed into each other."
      image="/images/site/misty-forest.webp"
      image-small="/images/site/misty-forest-800.webp"
    />

    <!-- How it connects -->
    <section class="section tight flow">
      <div class="container flow-grid">
        <div>
          <p class="eyebrow" v-reveal>Work plan</p>
          <h2 class="h3" v-reveal="60">Each stage builds on the last.</h2>
        </div>
        <div class="flow-text" v-reveal="100">
          <p>
            <RouterLink :to="wpTo('WP1')">WP1</RouterLink> maps wildfire exposure and vulnerability, while
            <RouterLink :to="wpTo('WP2')">WP2</RouterLink> and
            <RouterLink :to="wpTo('WP3')">WP3</RouterLink> provide fuel, microclimate and land
            management inputs to the fire spread model of
            <RouterLink :to="wpTo('WP4')">WP4</RouterLink>. That knowledge is translated into
            operational decision-making (<RouterLink :to="wpTo('WP5')">WP5</RouterLink>) and
            AI-based visualisation (<RouterLink :to="wpTo('WP6')">WP6</RouterLink>) for the
            response, and <RouterLink :to="wpTo('WP7')">WP7</RouterLink> addresses recovery.
          </p>
          <p>
            <RouterLink :to="wpTo('WP8')">WP8</RouterLink> integrates all three stages into strategic
            governance, <RouterLink :to="wpTo('WP9')">WP9</RouterLink> involves stakeholders
            throughout, and <RouterLink :to="wpTo('WP10')">WP10</RouterLink> coordinates the project.
          </p>
        </div>
      </div>
    </section>

    <!-- Work packages -->
    <section class="section wp-section" aria-labelledby="wp-title">
      <div class="container">
        <div class="toolbar">
          <h2 id="wp-title" class="h2">Work packages</h2>
          <div class="filters" role="group" aria-label="Filter by stage">
            <button type="button" class="filter-btn" :aria-pressed="!phase" @click="setPhase(null)">
              All <span class="count">{{ workPackages.length }}</span>
            </button>
            <button
              v-for="p in phases"
              :key="p.id"
              type="button"
              class="filter-btn"
              :aria-pressed="phase === p.id"
              @click="setPhase(p.id)"
            >
              {{ p.id === 'cross-cutting' ? 'Cross-cutting' : `${p.label} · ${p.name}` }}
              <span class="count">{{ countFor(p.id) }}</span>
            </button>
          </div>
        </div>

        <TransitionGroup name="list" tag="div" class="grid-3 wp-grid">
          <WorkPackageCard v-for="wp in filtered" :key="wp.slug" :wp="wp" />
        </TransitionGroup>
      </div>
    </section>

    <!-- Shared foundations -->
    <section class="section foundations on-dark" aria-labelledby="foundations-title">
      <div class="container">
        <SectionHeader label="Shared foundations" lead="Common study areas, data and open science practices tie the work packages together.">
          <template #title><span id="foundations-title">Built on shared ground.</span></template>
        </SectionHeader>
        <div class="found-grid">
          <article class="found" v-reveal>
            <Icon name="map" :size="28" />
            <h3>Ten case study areas</h3>
            <p>
              Selected at the start of the project for the work in WP1–4 and WP7, based on:
            </p>
            <ul>
              <li>fuel type composition</li>
              <li>abiotic site conditions</li>
              <li>management regime</li>
              <li>fire history</li>
              <li>data collection constraints, including airspace restrictions for UAV flights</li>
            </ul>
          </article>
          <article class="found" v-reveal="80">
            <Icon name="database" :size="28" />
            <h3>A central geospatial repository</h3>
            <p>
              Pre-processed and continuously updated geospatial datasets, together with the scripts generated in WP1–4,
              are shared across all project researchers to support collaboration and data exchange.
            </p>
          </article>
          <article class="found" v-reveal="160">
            <Icon name="open" :size="28" />
            <h3>Open science</h3>
            <p>
              Datasets will be published in public repositories such as UHasselt Research Storage and KU Leuven RDR, and
              software scripts will be shared through publications and/or GitHub.
            </p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { workPackages, phases, getWorkPackageByCode } from '@/content'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/PageHero.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import WorkPackageCard from '@/components/WorkPackageCard.vue'
import Icon from '@/components/Icon.vue'

usePageMeta({
  title: 'Research',
  description: 'The ten FireRisk work packages, organised along the wildfire science loop: before, during and after a fire.',
  image: '/images/site/misty-forest.webp',
})

const route = useRoute()
const router = useRouter()
const phase = computed(() => (phases.some((p) => p.id === route.query.phase) ? route.query.phase : null))
const filtered = computed(() => (phase.value ? workPackages.filter((wp) => wp.phase === phase.value) : workPackages))
const countFor = (id) => workPackages.filter((wp) => wp.phase === id).length
const setPhase = (id) => router.replace({ query: id ? { phase: id } : {} })
const wpTo = (code) => `/research/${getWorkPackageByCode(code)?.slug || ''}`
</script>

<style scoped>
.flow {
  border-bottom: 1px solid var(--line);
}
.flow-grid {
  display: grid;
  gap: 1.5rem 4rem;
}
.flow .eyebrow {
  margin-bottom: 1rem;
}
.flow-text p {
  font-size: 1.1rem;
  color: var(--ink-muted);
  max-width: 64ch;
}
.flow-text a {
  font-weight: 600;
  color: var(--forest-deep);
  border-bottom: 1px solid rgba(66, 107, 80, 0.35);
  transition: color 0.2s, border-color 0.2s;
}
.flow-text a:hover {
  color: var(--fire-ink);
  border-color: currentColor;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: clamp(2rem, 4vw, 3rem);
}
.wp-grid {
  align-items: stretch;
}
.list-enter-active,
.list-leave-active {
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.list-leave-active {
  position: absolute;
  visibility: hidden;
}
.foundations {
  background: var(--forest-deep);
}
.found-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 1.5rem;
}
.found {
  padding: 2rem;
  border: 1px solid var(--line-dark);
  border-radius: var(--radius-lg);
  background: rgba(23, 27, 25, 0.25);
}
.found .icon {
  color: var(--gold);
  margin-bottom: 2rem;
}
.found h3 {
  font-size: 1.3rem;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
}
.found p,
.found li {
  color: var(--on-dark-muted);
  font-size: 0.97rem;
}
.found ul {
  margin: 0;
  padding-left: 1.1rem;
}
.found li + li {
  margin-top: 0.3rem;
}
.found li::marker {
  color: var(--gold);
}
@media (min-width: 900px) {
  .flow-grid {
    grid-template-columns: 1fr 2fr;
  }
}
</style>
