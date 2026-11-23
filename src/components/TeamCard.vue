<template>
  <RouterLink :to="`/team/${person.slug}`" class="team-card">
    <div class="portrait" :class="{ empty: !person.photo }">
      <SmartImage v-if="person.photo" :src="person.photo" :small="person.photoSmall" :alt="`Portrait of ${person.name}`" sizes="(max-width: 700px) 50vw, 25vw" />
      <div v-else class="placeholder" aria-hidden="true">
        <span v-if="person.name" class="initials">{{ initials(person.name) }}</span>
        <Icon v-else name="user" :size="44" :stroke="1.2" />
      </div>
      <span class="inst mono">{{ partner?.short || person.partner }}</span>
    </div>
    <div class="body">
      <h3 class="name">{{ person.name || 'Name to be announced' }}</h3>
      <p class="position">{{ person.position }}</p>
      <ul v-if="person.work_packages.length" class="wps" aria-label="Work packages">
        <li v-for="wp in person.work_packages" :key="wp" class="mono">{{ wp }}</li>
      </ul>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { getPartner } from '@/content'
import { initials } from '@/composables/utils'
import SmartImage from './SmartImage.vue'
import Icon from './Icon.vue'

const props = defineProps({ person: { type: Object, required: true } })
const partner = computed(() => getPartner(props.person.partner))
</script>

<style scoped>
.team-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.portrait {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--forest-deep);
}
.portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9);
  transition: transform 1s var(--ease), filter 0.6s;
}
.team-card:hover .portrait img {
  transform: scale(1.04);
  filter: saturate(1.05);
}
.placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(244, 242, 236, 0.4);
  background:
    radial-gradient(120% 80% at 80% 0%, rgba(233, 172, 85, 0.22), transparent 60%),
    repeating-radial-gradient(circle at 20% 110%, transparent 0 22px, rgba(244, 242, 236, 0.05) 22px 23px),
    var(--forest-deep);
  transition: color 0.4s;
}
.team-card:hover .placeholder {
  color: var(--gold);
}
.initials {
  font-size: 3rem;
  font-weight: 600;
  letter-spacing: -0.04em;
}
.inst {
  position: absolute;
  left: 0.75rem;
  bottom: 0.75rem;
  padding: 0.3rem 0.55rem;
  border-radius: 3px;
  background: rgba(23, 27, 25, 0.78);
  backdrop-filter: blur(6px);
  color: var(--on-dark);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.body {
  padding-top: 1rem;
}
.name {
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  transition: color 0.2s;
}
.team-card:hover .name {
  color: var(--fire-ink);
}
.position {
  margin: 0.3rem 0 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--ink-muted);
}
.wps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  list-style: none;
  margin: 0.8rem 0 0;
  padding: 0;
}
.wps li {
  padding: 0.15rem 0.45rem;
  border: 1px solid var(--line);
  border-radius: 3px;
  font-size: 0.68rem;
  color: var(--ink-muted);
}
</style>
