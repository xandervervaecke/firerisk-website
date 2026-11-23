<template>
  <footer class="site-footer on-dark">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <RouterLink to="/" class="brand" aria-label="FireRisk home">
            <LogoMark :size="28" /> <span>FireRisk</span>
          </RouterLink>
          <p class="footer-claim">Science for <span class="accent">fire-resilient</span> landscapes in Flanders.</p>
        </div>

        <nav aria-label="Footer: explore">
          <h2 class="footer-title">Explore</h2>
          <ul>
            <li><RouterLink to="/research">Research</RouterLink></li>
            <li><RouterLink to="/team">Team</RouterLink></li>
            <li><RouterLink to="/news">News</RouterLink></li>
            <li><RouterLink to="/contact">Contact</RouterLink></li>
          </ul>
        </nav>

        <nav aria-label="Footer: research">
          <h2 class="footer-title">Research</h2>
          <ul>
            <li v-for="phase in phases" :key="phase.id">
              <RouterLink :to="{ path: '/research', query: { phase: phase.id } }">
                {{ phase.id === 'cross-cutting' ? 'Cross-cutting' : `${phase.label}: ${phase.name}` }}
              </RouterLink>
            </li>
          </ul>
        </nav>

        <nav aria-label="Footer: consortium">
          <h2 class="footer-title">Consortium</h2>
          <ul>
            <li v-for="inst in consortium" :key="inst.name">
              <a :href="inst.website" target="_blank" rel="noopener noreferrer">{{ inst.name }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="footer-bottom">
        <p>© {{ year }} FireRisk consortium.<template v-if="site.funding"> {{ site.funding }}</template></p>
        <div class="footer-social">
          <a v-if="site.email" :href="`mailto:${site.email}`">{{ site.email }}</a>
          <a v-for="s in socials" :key="s.key" :href="s.url" target="_blank" rel="noopener noreferrer">{{ s.label }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { site, phases, institutions, partners } from '@/content'
import LogoMark from './LogoMark.vue'

const year = new Date().getFullYear()
// One link per institution, to its main website.
const consortium = institutions.map((name) => ({
  name,
  website: partners.find((p) => p.institution === name)?.website,
}))
const labels = { linkedin: 'LinkedIn', bluesky: 'Bluesky', x: 'X', youtube: 'YouTube' }
const socials = Object.entries(site.social || {})
  .filter(([, url]) => url)
  .map(([key, url]) => ({ key, url, label: labels[key] || key }))
</script>

<style scoped>
.site-footer {
  background: var(--charcoal);
  padding-top: clamp(4rem, 8vw, 6rem);
  position: relative;
  overflow: hidden;
}
.site-footer::before {
  content: '';
  position: absolute;
  inset: auto -10% -60% 40%;
  height: 120%;
  background: radial-gradient(closest-side, rgba(230, 107, 53, 0.16), transparent);
  pointer-events: none;
}
.footer-claim {
  margin: 1.25rem 0 0;
  max-width: 18ch;
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.035em;
  color: var(--on-dark);
}
.footer-grid {
  display: grid;
  gap: 2.5rem;
  padding-block: clamp(3rem, 6vw, 4rem);
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.footer-brand {
  grid-column: 1 / -1;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.4rem;
  font-weight: 650;
  letter-spacing: -0.035em;
}
.footer-title {
  margin-bottom: 1rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li + li {
  margin-top: 0.55rem;
}
nav a {
  color: var(--on-dark-muted);
  font-size: 0.95rem;
  transition: color 0.2s;
}
nav a:hover {
  color: var(--on-dark);
}
.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1.75rem;
  border-top: 1px solid var(--line-dark);
  font-size: 0.85rem;
  color: rgba(244, 242, 236, 0.55);
}
.footer-bottom p {
  margin: 0;
}
.footer-social {
  display: flex;
  gap: 1.25rem;
}
.footer-social a:hover {
  color: var(--on-dark);
}
@media (min-width: 960px) {
  .footer-grid {
    grid-template-columns: 1.6fr 1fr 1fr 1.4fr;
  }
  .footer-brand {
    grid-column: auto;
  }
}
</style>
