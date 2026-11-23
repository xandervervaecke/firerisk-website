<template>
  <div>
    <PageHero
      eyebrow="Contact"
      title="Let's talk about wildfire risk."
      lead="Questions about the research, interested in collaborating, or working in land management or emergency response? We would like to hear from you."
      image="/images/site/countryside-dusk.webp"
      image-small="/images/site/countryside-dusk-800.webp"
    />

    <section class="section tight contact-top">
      <div class="container contact-grid">
        <div class="contact-card">
          <h2 class="label">General enquiries</h2>
          <a v-if="site.email" :href="`mailto:${site.email}`" class="email">
            <Icon name="mail" :size="22" /> {{ site.email }}
          </a>
          <template v-else>
            <p class="email muted">Project e-mail address</p>
            <p class="placeholder-note">To be announced</p>
          </template>

          <h2 class="label">Project coordination</h2>
          <p class="coord">
            {{ coordinator?.name }}
            <a v-if="coordinator?.website" :href="coordinator.website" target="_blank" rel="noopener noreferrer" class="text-link">
              {{ host(coordinator.website) }} <Icon name="external" :size="14" />
            </a>
          </p>

          <template v-if="socials.length">
            <h2 class="label">Follow FireRisk</h2>
            <ul class="socials">
              <li v-for="s in socials" :key="s.key">
                <a :href="s.url" target="_blank" rel="noopener noreferrer" class="chip">{{ s.label }}</a>
              </li>
            </ul>
          </template>
        </div>

        <div id="get-involved" class="involve">
          <p class="eyebrow">Get involved</p>
          <h2 class="h3">Research co-created with end users.</h2>
          <p>
            FireRisk works closely with the organisations that will use its results. End users help select study sites
            and indicators, validate definitions and test tools through co-creation workshops, pilot projects and
            usability testing.
          </p>
          <ul class="groups">
            <li v-for="g in groups" :key="g.title">
              <Icon :name="g.icon" :size="22" />
              <div>
                <h3>{{ g.title }}</h3>
                <p>{{ g.text }}</p>
              </div>
            </li>
          </ul>
          <p class="small">
            A Project Advisory Board with one representative per end-user category and two end-user committee meetings
            per year keep the research connected to practice.
          </p>
        </div>
      </div>
    </section>

    <section id="partners" class="section tight partners bg-paper-2" aria-labelledby="partners-title">
      <div class="container">
        <header class="partners-head">
          <div>
            <p class="eyebrow">Consortium partners</p>
            <h2 id="partners-title" class="h3">Who we are</h2>
          </div>
          <p class="partners-lead">
            Five institutions, including two research units of Hasselt University, bring complementary expertise to
            every work package.
          </p>
        </header>

        <ul class="partner-list">
          <li v-for="(p, i) in partnerCards" :id="`partner-${p.slug}`" :key="p.id" class="partner" v-reveal="i * 50">
            <div class="p-id">
              <p class="p-short mono">{{ p.short }}</p>
              <h3>{{ p.name }}</h3>
              <p v-if="p.role" class="role">{{ p.role }}</p>
            </div>

            <p v-if="p.expertise?.length" class="expertise">{{ p.expertise.join(' · ') }}</p>

            <div class="wps">
              <p v-if="p.leads.length">
                <span class="wps-label mono">Leads</span>
                <span class="chips"><RouterLink v-for="wp in p.leads" :key="wp.slug" :to="`/research/${wp.slug}`" class="wp-chip lead mono">{{ wp.code }}</RouterLink></span>
              </p>
              <p v-if="p.joins.length">
                <span class="wps-label mono">Contributes</span>
                <span class="chips"><RouterLink v-for="wp in p.joins" :key="wp.slug" :to="`/research/${wp.slug}`" class="wp-chip mono">{{ wp.code }}</RouterLink></span>
              </p>
            </div>

            <a v-if="p.website" :href="p.website" target="_blank" rel="noopener noreferrer" class="site-link">
              {{ host(p.website) }} <Icon name="external" :size="14" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { site, partners, workPackages, getPartner } from '@/content'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/PageHero.vue'
import Icon from '@/components/Icon.vue'

usePageMeta({
  title: 'Contact',
  description: 'Contact the FireRisk consortium and learn about the partner institutions: PXL, Hasselt University, KU Leuven, INBO and the University of Antwerp.',
})

const coordinator = getPartner(site.coordinator)
const host = (url) => new URL(url).hostname.replace(/^www\./, '')
const labels = { linkedin: 'LinkedIn', bluesky: 'Bluesky', x: 'X', youtube: 'YouTube' }
const socials = Object.entries(site.social || {})
  .filter(([, url]) => url)
  .map(([key, url]) => ({ key, url, label: labels[key] || key }))

const partnerCards = partners.map((p) => ({
  ...p,
  slug: p.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  leads: workPackages.filter((wp) => wp.lead === p.id),
  joins: workPackages.filter((wp) => wp.lead !== p.id && wp.partners.includes(p.id)),
}))

// End-user groups named in the project description.
const groups = [
  { icon: 'map', title: 'Land and nature managers', text: 'Study sites, management scenarios and the decision support tool for fire-resilient management.' },
  { icon: 'flame', title: 'Fire services and emergency planners', text: 'WUI definitions, operational decision support and simulation-based training.' },
  { icon: 'user', title: 'Policy-makers', text: 'Crisis governance frameworks and policy guidelines for wildfire governance.' },
]
</script>

<style scoped>
.contact-grid {
  display: grid;
  gap: clamp(2rem, 5vw, 5rem);
}
.contact-card {
  align-self: start;
  padding: clamp(1.75rem, 3vw, 2.5rem);
  border-radius: var(--radius-lg);
  background: var(--charcoal);
  color: var(--on-dark);
}
.label {
  margin: 2rem 0 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}
.label:first-child {
  margin-top: 0;
}
.email {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 0.75rem;
  font-size: clamp(1.25rem, 2.4vw, 1.6rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  word-break: break-word;
}
a.email:hover {
  color: var(--gold);
}
.email.muted {
  color: var(--on-dark-muted);
}
.contact-card .placeholder-note {
  color: var(--gold);
  border-color: var(--gold);
}
.coord {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.05rem;
}
.coord .text-link {
  font-size: 0.9rem;
  color: var(--on-dark-muted);
}
.coord .text-link:hover {
  color: var(--gold);
}
.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.socials .chip {
  color: var(--on-dark);
  border-color: var(--line-dark);
}
.involve .eyebrow {
  margin-bottom: 1rem;
}
.involve .h3 {
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  letter-spacing: -0.035em;
  margin-bottom: 1.25rem;
}
.involve > p {
  color: var(--ink-muted);
  max-width: 60ch;
}
.groups {
  list-style: none;
  margin: 2rem 0;
  padding: 0;
  border-top: 1px solid var(--line);
}
.groups li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--line);
}
.groups .icon {
  color: var(--fire-ink);
  margin-top: 0.15rem;
}
.groups h3 {
  font-size: 1.05rem;
  letter-spacing: -0.015em;
}
.groups p {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  color: var(--ink-muted);
}
.small {
  font-size: 0.9rem;
  color: var(--ink-soft) !important;
}
.partners-head {
  display: grid;
  gap: 1rem 3rem;
  align-items: end;
  margin-bottom: 2rem;
}
.partners-head .eyebrow {
  margin-bottom: 0.75rem;
}
.partners-head .h3 {
  font-size: clamp(1.6rem, 2.6vw, 2.1rem);
  letter-spacing: -0.03em;
}
.partners-lead {
  margin: 0;
  max-width: 52ch;
  color: var(--ink-muted);
}
.partner-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--white);
  overflow: hidden;
}
.partner {
  display: grid;
  gap: 0.75rem 2rem;
  padding: 1.35rem 1.5rem;
  scroll-margin-top: calc(var(--header-h) + 1.5rem);
  transition: background 0.25s;
}
.partner + .partner {
  border-top: 1px solid var(--line);
}
.partner:hover {
  background: rgba(244, 242, 236, 0.5);
}
.p-short {
  margin: 0 0 0.3rem;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--forest);
}
.partner h3 {
  font-size: 1.02rem;
  letter-spacing: -0.015em;
  line-height: 1.3;
}
.role {
  display: inline-block;
  margin: 0.5rem 0 0;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  background: var(--charcoal);
  color: var(--gold);
  font-size: 0.72rem;
  font-weight: 500;
}
.expertise {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--ink-muted);
}
.wps {
  display: grid;
  gap: 0.4rem;
  align-content: start;
}
.wps p {
  display: grid;
  grid-template-columns: 5.6rem 1fr;
  align-items: start;
  margin: 0;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.wps-label {
  padding-top: 0.2rem;
  font-size: 0.64rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.wp-chip {
  padding: 0.12rem 0.4rem;
  border: 1px solid var(--line);
  border-radius: 3px;
  font-size: 0.68rem;
  color: var(--ink-muted);
  transition: border-color 0.2s, color 0.2s;
}
.wp-chip:hover {
  border-color: var(--forest);
  color: var(--forest-deep);
}
.wp-chip.lead {
  background: var(--charcoal);
  border-color: var(--charcoal);
  color: var(--gold);
}
.site-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  align-self: start;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--forest-deep);
  white-space: nowrap;
}
.site-link:hover {
  color: var(--fire-ink);
}
@media (min-width: 1000px) {
  .partner {
    grid-template-columns: 15rem minmax(0, 1fr) 15.5rem 7.5rem;
    align-items: start;
  }
  .site-link {
    justify-self: end;
  }
}
@media (min-width: 900px) {
  .partners-head {
    grid-template-columns: auto 1fr;
    justify-items: end;
  }
  .partners-lead {
    text-align: right;
  }
  .contact-grid {
    grid-template-columns: 0.85fr 1.15fr;
  }
}
</style>
