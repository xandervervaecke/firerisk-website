<template>
  <div class="loop">
    <!-- Tabs -->
    <div class="tabs" role="tablist" aria-label="Stages of the wildfire science loop">
      <button
        v-for="(p, i) in phases"
        :id="`tab-${p.id}`"
        :key="p.id"
        role="tab"
        type="button"
        class="tab"
        :class="`phase-${p.id}`"
        :aria-selected="active === p.id"
        :aria-controls="`panel-${p.id}`"
        :tabindex="active === p.id ? 0 : -1"
        @click="active = p.id"
        @keydown.right.prevent="move(i, 1)"
        @keydown.left.prevent="move(i, -1)"
      >
        <span class="tab-label mono">{{ p.label }}</span>
        <span class="tab-name">{{ p.name }}</span>
      </button>
    </div>

    <div class="stage">
      <!-- Diagram -->
      <svg class="diagram" viewBox="0 0 400 400" role="img" aria-label="The wildfire science loop: before, during and after a fire, connected by governance">
        <defs>
          <marker id="loop-arrow" viewBox="0 0 10 10" refX="4" refY="5" markerWidth="14" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="currentColor" />
          </marker>
        </defs>
        <circle cx="200" cy="200" r="150" class="track" />
        <path
          v-for="seg in segments"
          :key="seg.id"
          :d="seg.d"
          class="arc"
          :class="[`phase-${seg.id}`, { on: active === seg.id }]"
          marker-end="url(#loop-arrow)"
          @click="active = seg.id"
        />
        <g v-for="seg in segments" :key="`l-${seg.id}`" class="arc-label" :class="{ on: active === seg.id }" @click="active = seg.id">
          <text :x="seg.lx" :y="seg.ly" text-anchor="middle">{{ seg.label }}</text>
        </g>
        <circle cx="200" cy="200" r="86" class="core" :class="{ on: active === 'cross-cutting' }" @click="active = 'cross-cutting'" />
        <text x="200" y="192" text-anchor="middle" class="core-title">WP8–10</text>
        <text x="200" y="214" text-anchor="middle" class="core-sub">governance &amp; uptake</text>
      </svg>

      <!-- Panel -->
      <Transition name="swap" mode="out-in">
        <div
          :id="`panel-${current.id}`"
          :key="current.id"
          class="panel"
          role="tabpanel"
          :aria-labelledby="`tab-${current.id}`"
        >
          <p class="panel-kicker mono">{{ current.id === 'cross-cutting' ? 'Across the loop' : `${current.label} a fire` }}</p>
          <h3 class="h3">{{ current.name }}</h3>
          <p class="panel-text">{{ current.text }}</p>
          <ul class="wp-list">
            <li v-for="wp in wpsFor(current.id)" :key="wp.slug">
              <RouterLink :to="`/research/${wp.slug}`" class="wp-row">
                <span class="wp-code mono">{{ wp.code }}</span>
                <span class="wp-title">{{ wp.short_title }}</span>
                <span class="wp-lead mono">{{ partnerShort(wp.lead) }}</span>
                <Icon name="arrow-up-right" :size="18" />
              </RouterLink>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { phases, workPackages, getPartner } from '@/content'
import Icon from './Icon.vue'

const active = ref('before')
const current = computed(() => phases.find((p) => p.id === active.value))
const wpsFor = (id) => workPackages.filter((wp) => wp.phase === id)
const partnerShort = (id) => getPartner(id)?.short || id

function move(i, dir) {
  const next = phases[(i + dir + phases.length) % phases.length]
  active.value = next.id
  document.getElementById(`tab-${next.id}`)?.focus()
}

// Three arcs around the circle (before → during → after → before), with gaps.
const R = 150
const point = (deg, r = R) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [200 + r * Math.cos(rad), 200 + r * Math.sin(rad)]
}
const arc = (start, end) => {
  const [x1, y1] = point(start)
  const [x2, y2] = point(end)
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
}
const segments = [
  { id: 'before', label: 'BEFORE', from: -50, to: 58, mid: 4 },
  { id: 'during', label: 'DURING', from: 70, to: 178, mid: 124 },
  { id: 'after', label: 'AFTER', from: 190, to: 298, mid: 244 },
].map((s) => {
  const [lx, ly] = point(s.mid, R + 30)
  return { ...s, d: arc(s.from, s.to), lx, ly: ly + 4 }
})
</script>

<style scoped>
.tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--line-dark);
  border: 1px solid var(--line-dark);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 1.1rem 1.25rem;
  border: 0;
  background: var(--charcoal);
  text-align: left;
  color: var(--on-dark-muted);
  transition: background 0.3s, color 0.3s;
  position: relative;
}
.tab::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--c);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s var(--ease);
}
.tab[aria-selected='true'] {
  background: #222825;
  color: var(--on-dark);
}
.tab[aria-selected='true']::after,
.tab:hover::after {
  transform: scaleX(1);
}
.tab-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c);
}
.tab-name {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.phase-before { --c: var(--phase-before); }
.phase-during { --c: var(--phase-during); }
.phase-after { --c: var(--phase-after); }
.phase-cross-cutting { --c: var(--phase-cross-cutting); }

.stage {
  display: grid;
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: center;
  margin-top: clamp(2rem, 5vw, 3.5rem);
}
.diagram {
  width: 100%;
  max-width: 460px;
  margin-inline: auto;
  color: var(--on-dark-muted);
  overflow: visible;
}
.track {
  fill: none;
  stroke: var(--line-dark);
  stroke-dasharray: 2 6;
}
.arc {
  fill: none;
  stroke: var(--c);
  stroke-width: 3;
  opacity: 0.35;
  color: var(--c);
  cursor: pointer;
  transition: opacity 0.4s, stroke-width 0.4s var(--ease);
}
.arc.on {
  opacity: 1;
  stroke-width: 7;
}
.arc-label text {
  fill: var(--on-dark-muted);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  cursor: pointer;
  transition: fill 0.3s;
}
.arc-label.on text {
  fill: var(--on-dark);
}
.core {
  fill: rgba(244, 242, 236, 0.03);
  stroke: var(--line-dark);
  cursor: pointer;
  transition: fill 0.4s, stroke 0.4s;
}
.core.on {
  fill: rgba(185, 194, 188, 0.12);
  stroke: var(--phase-cross-cutting);
}
.core-title {
  fill: var(--on-dark);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  pointer-events: none;
}
.core-sub {
  fill: var(--on-dark-muted);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  pointer-events: none;
}
.panel-kicker {
  margin: 0 0 0.75rem;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}
.h3 {
  font-size: clamp(2rem, 3.6vw, 2.8rem);
  letter-spacing: -0.035em;
}
.panel-text {
  margin: 1rem 0 1.75rem;
  max-width: 44ch;
  font-size: 1.1rem;
  color: var(--on-dark-muted);
}
.wp-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line-dark);
}
.wp-row {
  display: grid;
  grid-template-columns: 3.2rem 1fr auto auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0.25rem;
  border-bottom: 1px solid var(--line-dark);
  transition: background 0.25s, padding 0.35s var(--ease);
}
.wp-row:hover {
  background: rgba(244, 242, 236, 0.04);
  padding-left: 0.75rem;
}
.wp-code {
  font-size: 0.8rem;
  color: var(--gold);
}
.wp-title {
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: -0.015em;
}
.wp-lead {
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--on-dark-muted);
}
.wp-row .icon {
  color: var(--on-dark-muted);
  transition: transform 0.35s var(--ease), color 0.2s;
}
.wp-row:hover .icon {
  color: var(--gold);
  transform: translate(3px, -3px);
}
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
}
.swap-enter-from {
  opacity: 0;
  transform: translateX(16px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
@media (min-width: 700px) {
  .tabs {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 960px) {
  .stage {
    grid-template-columns: 0.9fr 1fr;
  }
}
@media (max-width: 700px) {
  .diagram {
    max-width: 260px;
  }
}
@media (max-width: 520px) {
  .wp-lead {
    display: none;
  }
  .wp-row {
    grid-template-columns: 3rem 1fr auto;
  }
}
</style>
