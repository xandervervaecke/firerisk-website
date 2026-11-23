<template>
  <NotFound v-if="!person" />
  <div v-else>
    <section class="profile-hero on-dark">
      <div class="container hero-grid">
        <div class="portrait hero-in">
          <SmartImage
            v-if="person.photo"
            :src="person.photo"
            :small="person.photoSmall"
            :alt="`Portrait of ${person.name}`"
            sizes="(max-width: 800px) 60vw, 340px"
            eager
          />
          <div v-else class="placeholder" aria-hidden="true">
            <span v-if="person.name">{{ initials(person.name) }}</span>
            <Icon v-else name="user" :size="64" :stroke="1.1" />
          </div>
        </div>

        <div class="intro">
          <nav class="crumbs hero-in" aria-label="Breadcrumb">
            <RouterLink to="/team">Team</RouterLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{{ person.name || person.position }}</span>
          </nav>
          <h1 class="h1 hero-in" style="--d: 0.06s">{{ person.name || 'Name to be announced' }}</h1>
          <p class="position hero-in" style="--d: 0.12s">{{ person.position }}</p>
          <p v-if="partner" class="inst hero-in" style="--d: 0.16s">
            {{ partner.name }}
          </p>

          <ul v-if="links.length" class="links hero-in" style="--d: 0.22s">
            <li v-for="l in links" :key="l.label">
              <a :href="l.href" class="btn btn-ghost btn-small" v-bind="l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}">
                <Icon :name="l.icon" :size="17" /> {{ l.label }}
              </a>
            </li>
          </ul>
          <p v-if="person.placeholder" class="placeholder-note hero-in" style="--d: 0.26s">Profile details to be added</p>
        </div>
      </div>
    </section>

    <div class="section">
      <div class="container layout">
        <article class="main">
          <div v-if="person.intro" class="prose-wrap"><MarkdownContent :html="person.intro" /></div>
          <section v-for="s in person.sections" :key="s.id" class="block" :aria-labelledby="`s-${s.id}`">
            <h2 :id="`s-${s.id}`" class="block-title">{{ s.title }}</h2>
            <MarkdownContent :html="s.html" />
          </section>
        </article>

        <aside v-if="wps.length" class="aside" aria-labelledby="wp-involvement">
          <h2 id="wp-involvement" class="aside-title">Work package involvement</h2>
          <ul>
            <li v-for="wp in wps" :key="wp.slug">
              <RouterLink :to="`/research/${wp.slug}`" class="wp-link">
                <span class="code mono">{{ wp.code }}</span>
                <span class="t">{{ wp.short_title }}</span>
                <PhaseTag :phase="wp.phase" />
              </RouterLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPerson, getPartner, getWorkPackageByCode } from '@/content'
import { usePageMeta } from '@/composables/usePageMeta'
import { initials } from '@/composables/utils'
import SmartImage from '@/components/SmartImage.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import PhaseTag from '@/components/PhaseTag.vue'
import Icon from '@/components/Icon.vue'
import NotFound from './NotFound.vue'

const route = useRoute()
const person = computed(() => getPerson(route.params.slug))
const partner = computed(() => person.value && getPartner(person.value.partner))
const wps = computed(() => (person.value?.work_packages || []).map(getWorkPackageByCode).filter(Boolean))

const links = computed(() => {
  const p = person.value
  if (!p) return []
  return [
    p.email && { label: 'E-mail', icon: 'mail', href: `mailto:${p.email}` },
    p.website && { label: 'Website', icon: 'globe', href: p.website, external: true },
    p.linkedin && { label: 'LinkedIn', icon: 'linkedin', href: p.linkedin, external: true },
    p.orcid && { label: 'ORCID', icon: 'orcid', href: p.orcid.startsWith('http') ? p.orcid : `https://orcid.org/${p.orcid}`, external: true },
  ].filter(Boolean)
})

usePageMeta(() =>
  person.value
    ? {
        title: person.value.name || person.value.position,
        description: `${person.value.name ? `${person.value.name}, ` : ''}${person.value.position}${partner.value ? `, ${partner.value.name}` : ''}. FireRisk team.`,
        image: person.value.photo || undefined,
        type: 'profile',
      }
    : { title: 'Page not found', noindex: true },
)
</script>

<style scoped>
.profile-hero {
  padding: calc(var(--header-h) + clamp(3rem, 7vw, 5rem)) 0 clamp(3rem, 6vw, 4.5rem);
  background:
    radial-gradient(80% 120% at 100% 0%, rgba(66, 107, 80, 0.35), transparent 60%),
    var(--charcoal);
}
.hero-grid {
  display: grid;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: end;
}
.portrait {
  width: min(100%, 320px);
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--forest-deep);
}
.portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-size: 4rem;
  font-weight: 600;
  letter-spacing: -0.04em;
  color: rgba(244, 242, 236, 0.4);
  background:
    radial-gradient(120% 80% at 80% 0%, rgba(233, 172, 85, 0.22), transparent 60%),
    repeating-radial-gradient(circle at 20% 110%, transparent 0 22px, rgba(244, 242, 236, 0.05) 22px 23px),
    var(--forest-deep);
}
.crumbs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--on-dark-muted);
}
.crumbs a:hover {
  color: var(--gold);
}
.position {
  margin: 1rem 0 0;
  font-size: clamp(1.15rem, 1.8vw, 1.35rem);
  color: var(--on-dark);
}
.inst {
  margin: 0.4rem 0 0;
  color: var(--on-dark-muted);
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 1.75rem 0 0;
  padding: 0;
}
.placeholder-note {
  margin-top: 1.5rem;
}
.layout {
  display: grid;
  gap: clamp(3rem, 6vw, 5rem);
}
.main {
  max-width: 70ch;
}
.block + .block {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--line);
}
.block-title {
  margin-bottom: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--forest);
}
.aside-title {
  margin-bottom: 1rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.aside ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.wp-link {
  display: grid;
  gap: 0.35rem;
  padding: 1.1rem 1.25rem;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--white);
  transition: border-color 0.2s, transform 0.4s var(--ease);
}
.wp-link:hover {
  border-color: var(--forest);
  transform: translateX(4px);
}
.code {
  font-size: 0.75rem;
  color: var(--fire-ink);
}
.t {
  font-weight: 600;
  letter-spacing: -0.015em;
}
.hero-in {
  animation: rise 1s var(--ease) both;
  animation-delay: var(--d, 0s);
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
}
@media (min-width: 800px) {
  .hero-grid {
    grid-template-columns: 320px 1fr;
  }
}
@media (min-width: 1000px) {
  .layout {
    grid-template-columns: minmax(0, 1fr) 320px;
  }
}
</style>
