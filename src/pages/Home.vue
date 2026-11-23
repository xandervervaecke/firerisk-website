<template>
  <div>
    <Hero />

    <!-- 01 · About -->
    <section id="about" class="section about">
      <div class="container">
        <div class="about-grid">
          <div class="about-text">
            <p class="eyebrow" v-reveal><span>01 /</span> The project</p>
            <h2 class="h2" v-reveal="60">One integrated view of wildfire risk.</h2>
            <p class="lead" v-reveal="120">
              FireRisk is an interdisciplinary research project that strengthens wildfire risk assessment,
              prevention and response in Flanders.
            </p>
            <p v-reveal="160">
              It brings together the three dimensions of risk (<strong>danger</strong>, <strong>exposure</strong> and
              <strong>vulnerability</strong>) and follows a fire through its whole life cycle, from prevention to
              recovery. Researchers in remote sensing, ecology, modelling, visual computing and crisis management work
              side by side with land managers, fire services and policy-makers.
            </p>
          </div>
          <figure class="about-figure" v-reveal="100">
            <SmartImage
              src="/images/site/forest-aerial.webp"
              small="/images/site/forest-aerial-800.webp"
              alt="Aerial view of a conifer forest in warm evening light"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
            <figcaption class="mono">High-resolution data, from canopy to landscape</figcaption>
          </figure>
        </div>

        <ol class="objectives">
          <li v-for="(o, i) in objectives" :key="o.code" v-reveal="i * 80">
            <span class="obj-code mono">{{ o.code }}</span>
            <Icon :name="o.icon" :size="26" class="obj-icon" />
            <h3>{{ o.title }}</h3>
            <p>{{ o.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 02 · Why it matters -->
    <section class="section why on-dark" aria-labelledby="why-title">
      <div class="why-bg" aria-hidden="true">
        <SmartImage src="/images/site/heathland.webp" small="/images/site/heathland-800.webp" alt="" sizes="100vw" />
      </div>
      <div class="container">
        <div class="why-grid">
          <div>
            <p class="eyebrow on-dark" v-reveal><span>02 /</span> Why it matters</p>
            <h2 id="why-title" class="h2" v-reveal="60">Wildfire is no longer a southern European problem.</h2>
            <p class="lead" v-reveal="120">
              Climate change is pushing high-risk zones northward, from the Mediterranean into central Europe. And in
              a densely built landscape, even comparatively small fires can have considerable consequences.
            </p>
          </div>
          <div v-reveal="160">
            <WuiChart />
          </div>
        </div>

        <div class="facts">
          <div class="fact" v-reveal>
            <p class="fact-num">63 <span>→</span> 68–78<small>million</small></p>
            <p>Europeans exposed to wildfire today, and projected under 1.5 °C to 3 °C of global warming.</p>
          </div>
          <div class="fact" v-reveal="80">
            <p class="fact-num">+30<small>°C</small></p>
            <p>How much hotter the air in open ecosystems can be than the weather forecast on hot, sunny days.</p>
          </div>
          <div class="fact" v-reveal="160">
            <p class="fact-num">10 × 10<small>m</small></p>
            <p>
              Resolution of FireRisk's wildland–urban interface maps. Pan-European systems are too coarse for local
              decisions and tend to underestimate wildfire events.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 03 · Science loop -->
    <section id="science-loop" class="section loop-section on-dark" aria-labelledby="loop-title">
      <div class="container">
        <SectionHeader index="03" label="The wildfire science loop" lead="Ten work packages follow a fire from prevention through response to recovery. Select a stage to see who works on what.">
          <template #title><span id="loop-title">Before, during and after a fire.</span></template>
          <template #aside>
            <RouterLink to="/research" class="btn btn-ghost">
              All work packages <Icon name="arrow-up-right" :size="18" />
            </RouterLink>
          </template>
        </SectionHeader>
        <div v-reveal="100">
          <ScienceLoop />
        </div>
      </div>
    </section>

    <!-- 04 · Consortium -->
    <section class="section tight consortium" aria-labelledby="consortium-title">
      <div class="container">
        <div class="consortium-head">
          <p class="eyebrow" v-reveal><span>04 /</span> Consortium</p>
          <h2 id="consortium-title" class="h3" v-reveal="60">
            Five Flemish institutions, coordinated by {{ coordinator?.institution }}.
          </h2>
        </div>
        <ul class="wordmarks">
          <li v-for="(name, i) in institutions" :key="name" v-reveal="i * 60">
            <span>{{ name }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 05 · News -->
    <section v-if="latest.length" class="section news-section bg-paper-2" aria-labelledby="news-title">
      <div class="container">
        <SectionHeader index="05" label="From the project">
          <template #title><span id="news-title">Latest news</span></template>
          <template #aside>
            <RouterLink to="/news" class="btn btn-outline">
              All news <Icon name="arrow-up-right" :size="18" />
            </RouterLink>
          </template>
        </SectionHeader>
        <div class="grid-3">
          <div v-for="(a, i) in latest" :key="a.slug" v-reveal="i * 90">
            <NewsCard :article="a" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta on-dark" aria-labelledby="cta-title">
      <div class="cta-bg" aria-hidden="true">
        <SmartImage src="/images/research/firefighter-smoke.webp" small="/images/research/firefighter-smoke-800.webp" alt="" sizes="100vw" />
      </div>
      <div class="container cta-inner">
        <p class="eyebrow on-dark" v-reveal>Co-created research</p>
        <h2 id="cta-title" class="h2" v-reveal="60">Shaped with the people who manage landscapes and respond to fires.</h2>
        <p class="lead" v-reveal="120">
          Land and nature managers, emergency planners, fire services and policy-makers help define FireRisk's study
          sites, indicators and tools through co-creation workshops and a dedicated end-user committee.
        </p>
        <div v-reveal="160">
          <RouterLink :to="{ path: '/contact', hash: '#get-involved' }" class="btn">
            Get involved <Icon name="arrow-up-right" :size="18" />
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { news, institutions, site, getPartner } from '@/content'
import { usePageMeta } from '@/composables/usePageMeta'
import Hero from '@/components/Hero.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import ScienceLoop from '@/components/ScienceLoop.vue'
import WuiChart from '@/components/WuiChart.vue'
import NewsCard from '@/components/NewsCard.vue'
import SmartImage from '@/components/SmartImage.vue'
import Icon from '@/components/Icon.vue'

usePageMeta({})

const latest = computed(() => news.slice(0, 3))
const coordinator = getPartner(site.coordinator)

// Specific objectives (SO1–SO4) from the project description.
const objectives = [
  { code: 'SO1', icon: 'map', title: 'Map the risk', text: 'Spatially explicit geodatasets of indicators for wildfire danger, exposure and vulnerability.' },
  { code: 'SO2', icon: 'flame', title: 'Model the fire', text: 'A locally calibrated fire spread model that can simulate the effects of land management and design.' },
  { code: 'SO3', icon: 'layers', title: 'Train for the moment', text: 'Better training for first responders through high-fidelity 3D visualisation.' },
  { code: 'SO4', icon: 'check', title: 'Govern together', text: 'Frameworks that turn these results into operational decisions and strategic wildfire governance.' },
]
</script>

<style scoped>
/* ---------- About ---------- */
.about .eyebrow span,
.why .eyebrow span,
.consortium .eyebrow span {
  margin-right: 0.35em;
}
.about-grid {
  display: grid;
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: center;
}
.about-text .eyebrow {
  margin-bottom: 1.25rem;
}
.about-text .lead {
  margin-top: 1.5rem;
  color: var(--ink);
}
.about-text p:last-child {
  color: var(--ink-muted);
  max-width: 58ch;
}
.about-figure {
  position: relative;
  margin: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4 / 5;
  max-height: 640px;
}
.about-figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.about-figure figcaption {
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  padding: 0.45rem 0.7rem;
  border-radius: 3px;
  background: rgba(23, 27, 25, 0.75);
  backdrop-filter: blur(6px);
  color: var(--on-dark);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.objectives {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 1px;
  margin: clamp(3.5rem, 7vw, 6rem) 0 0;
  padding: 0;
  list-style: none;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.objectives li {
  position: relative;
  padding: 1.75rem 1.5rem 2rem;
  background: var(--paper);
  transition: background 0.3s;
}
.objectives li:hover {
  background: var(--white);
}
.obj-code {
  position: absolute;
  top: 1.75rem;
  right: 1.5rem;
  font-size: 0.75rem;
  color: var(--ink-soft);
}
.obj-icon {
  color: var(--fire-ink);
  margin-bottom: 2.5rem;
}
.objectives h3 {
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}
.objectives p {
  margin: 0.6rem 0 0;
  font-size: 0.95rem;
  color: var(--ink-muted);
  line-height: 1.55;
}

/* ---------- Why ---------- */
.why {
  position: relative;
  background: var(--forest-deep);
  overflow: hidden;
  isolation: isolate;
}
.why-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.18;
  mix-blend-mode: luminosity;
}
.why-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.why::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(32, 58, 50, 0.4), var(--forest-deep) 85%);
}
.why-grid {
  display: grid;
  gap: clamp(2.5rem, 5vw, 5rem);
  align-items: end;
}
.why .eyebrow {
  margin-bottom: 1.25rem;
}
.why .lead {
  margin-top: 1.5rem;
  margin-bottom: 0;
}
.facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: clamp(1.5rem, 3vw, 3rem);
  margin-top: clamp(3.5rem, 7vw, 5.5rem);
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--line-dark);
}
.fact-num {
  margin: 0 0 0.75rem;
  font-size: clamp(2.4rem, 4.4vw, 3.4rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1;
  color: var(--gold);
}
.fact-num span {
  color: var(--on-dark-muted);
  font-weight: 400;
}
.fact-num small {
  margin-left: 0.3rem;
  font-size: 0.4em;
  letter-spacing: 0;
  font-weight: 500;
  color: var(--on-dark-muted);
}
.fact p:last-child {
  margin: 0;
  max-width: 34ch;
  color: var(--on-dark-muted);
  font-size: 0.98rem;
}

/* ---------- Loop ---------- */
.loop-section {
  background: var(--charcoal);
}

/* ---------- Consortium ---------- */
.consortium-head {
  display: grid;
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.consortium-head .h3 {
  max-width: 30ch;
}
.wordmarks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}
.wordmarks li {
  border-bottom: 1px solid var(--line);
}
.wordmarks span {
  display: flex;
  align-items: center;
  min-height: 112px;
  padding: 1.25rem 1.25rem 1.25rem 0;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: var(--ink-muted);
}
@media (min-width: 900px) {
  .wordmarks li + li span {
    padding-left: 1.25rem;
    border-left: 1px solid var(--line);
  }
}

/* ---------- CTA ---------- */
.cta {
  position: relative;
  padding-block: clamp(6rem, 14vw, 11rem);
  background: var(--charcoal);
  overflow: hidden;
  isolation: isolate;
}
.cta-bg {
  position: absolute;
  inset: 0;
  z-index: -2;
}
.cta-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 60% 30%;
}
.cta::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, rgba(23, 27, 25, 0.92) 0%, rgba(23, 27, 25, 0.7) 50%, rgba(23, 27, 25, 0.25) 100%);
}
.cta-inner .eyebrow {
  margin-bottom: 1.25rem;
}
.cta-inner .h2 {
  max-width: 20ch;
}
.cta-inner .lead {
  margin: 1.5rem 0 2.25rem;
}

@media (min-width: 900px) {
  .about-grid {
    grid-template-columns: 1.05fr 0.95fr;
  }
  .why-grid {
    grid-template-columns: 1fr 1fr;
  }
  .consortium-head {
    grid-template-columns: 1fr 2fr;
    align-items: start;
  }
}
</style>
