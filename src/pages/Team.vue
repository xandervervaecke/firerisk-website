<template>
  <div>
    <PageHero
      eyebrow="Team"
      title="The people behind FireRisk."
      lead="Doctoral researchers, scientific staff and coordinators across five institutions, working on every stage of the wildfire science loop."
    />

    <section class="section">
      <div class="container">
        <div class="toolbar">
          <div class="filters" role="group" aria-label="Filter by institution">
            <button type="button" class="filter-btn" :aria-pressed="!inst" @click="inst = null">
              Everyone <span class="count">{{ team.length }}</span>
            </button>
            <button
              v-for="i in usedInstitutions"
              :key="i"
              type="button"
              class="filter-btn"
              :aria-pressed="inst === i"
              :title="i"
              @click="inst = i"
            >
              {{ institutionShort(i) }} <span class="count">{{ countFor(i) }}</span>
            </button>
          </div>
          <p v-if="hasPlaceholders" class="placeholder-note">Names &amp; photos to be added</p>
        </div>

        <TransitionGroup v-if="filtered.length" name="list" tag="div" class="team-grid">
          <TeamCard v-for="p in filtered" :key="p.slug" :person="p" />
        </TransitionGroup>
        <p v-else class="empty">No profiles yet.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { team, getPartner, institutions, institutionShort } from '@/content'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/PageHero.vue'
import TeamCard from '@/components/TeamCard.vue'

usePageMeta({
  title: 'Team',
  description: 'Meet the researchers and staff of the FireRisk consortium.',
})

const inst = ref(null)
const institutionOf = (p) => getPartner(p.partner)?.institution || p.institution || ''
const usedInstitutions = institutions.filter((i) => team.some((p) => institutionOf(p) === i))
const countFor = (i) => team.filter((p) => institutionOf(p) === i).length
const filtered = computed(() => (inst.value ? team.filter((p) => institutionOf(p) === inst.value) : team))
const hasPlaceholders = team.some((p) => p.placeholder || !p.name)
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: clamp(2rem, 4vw, 3.5rem);
}
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr));
  gap: clamp(2rem, 3vw, 2.75rem) clamp(1rem, 2vw, 1.5rem);
}
@media (max-width: 520px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.empty {
  color: var(--ink-muted);
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
</style>
