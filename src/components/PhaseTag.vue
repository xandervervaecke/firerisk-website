<template>
  <span class="phase-tag" :class="`phase-${phase}`">
    <span class="dot" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { getPhase } from '@/content'

const props = defineProps({ phase: { type: String, required: true }, long: Boolean })
const label = computed(() => {
  const p = getPhase(props.phase)
  if (!p) return props.phase
  if (props.phase === 'cross-cutting') return props.long ? 'Cross-cutting' : 'Cross-cutting'
  return props.long ? `${p.label} · ${p.name}` : p.label
})
</script>

<style scoped>
.phase-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: inherit;
  opacity: 0.85;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 25%, transparent);
}
.phase-before { --c: var(--phase-before); }
.phase-during { --c: var(--phase-during); }
.phase-after { --c: var(--phase-after); }
.phase-cross-cutting { --c: var(--phase-cross-cutting); }
</style>
