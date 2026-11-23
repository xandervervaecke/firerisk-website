<template>
  <figure class="wui-chart" ref="root" :class="{ on: visible }">
    <figcaption class="cap mono">Share of territory in the wildland–urban interface</figcaption>
    <ul>
      <li v-for="(row, i) in rows" :key="row.country" :class="{ highlight: row.highlight }" :style="{ '--w': `${(row.value / max) * 100}%`, '--i': i }">
        <span class="country">{{ row.country }}</span>
        <span class="bar" aria-hidden="true"><span /></span>
        <span class="value">{{ row.value.toFixed(1) }}%</span>
      </li>
    </ul>
    <p class="source">Source: Bar-Massada et al. (2023), as cited in the FireRisk project description.</p>
  </figure>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const rows = [
  { country: 'Belgium', value: 14.8, highlight: true },
  { country: 'Greece', value: 6.9 },
  { country: 'Spain', value: 4.5 },
]
const max = 16
const root = ref(null)
const visible = ref(false)
let io

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') return (visible.value = true)
  io = new IntersectionObserver(([e]) => e.isIntersecting && ((visible.value = true), io.disconnect()), { threshold: 0.4 })
  io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style scoped>
.wui-chart {
  margin: 0;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  border: 1px solid var(--line-dark);
  border-radius: var(--radius-lg);
  background: rgba(23, 27, 25, 0.35);
}
.cap {
  margin-bottom: 1.5rem;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--on-dark-muted);
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.1rem;
}
li {
  display: grid;
  grid-template-columns: 5.5rem 1fr 3.6rem;
  align-items: center;
  gap: 1rem;
}
.country {
  font-weight: 500;
  color: var(--on-dark-muted);
}
.bar {
  height: 12px;
  border-radius: 99px;
  background: rgba(244, 242, 236, 0.07);
  overflow: hidden;
}
.bar span {
  display: block;
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: rgba(244, 242, 236, 0.45);
  transition: width 1.4s var(--ease);
  transition-delay: calc(var(--i) * 0.15s + 0.1s);
}
.on .bar span {
  width: var(--w);
}
.value {
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--on-dark-muted);
}
.highlight .country,
.highlight .value {
  color: var(--on-dark);
  font-weight: 600;
}
.highlight .bar span {
  background: linear-gradient(90deg, var(--fire), var(--gold));
}
.source {
  margin: 1.5rem 0 0;
  font-size: 0.78rem;
  color: rgba(244, 242, 236, 0.5);
}
</style>
