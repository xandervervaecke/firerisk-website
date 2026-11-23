<template>
  <div>
    <PageHero
      eyebrow="News"
      title="News & updates."
      lead="Field campaigns, publications, events and milestones from the FireRisk consortium."
      compact
    />

    <section class="section">
      <div class="container">
        <div v-if="featured && !filtering" class="featured-wrap" v-reveal>
          <NewsCard :article="featured" featured />
        </div>

        <div class="toolbar">
          <div class="filters" role="group" aria-label="Filter by category">
            <button type="button" class="filter-btn" :aria-pressed="!category" @click="category = null">
              All <span class="count">{{ news.length }}</span>
            </button>
            <button
              v-for="c in newsCategories"
              :key="c"
              type="button"
              class="filter-btn"
              :aria-pressed="category === c"
              @click="category = c"
            >
              {{ c }}
            </button>
          </div>
          <label class="search">
            <Icon name="search" :size="18" />
            <span class="visually-hidden">Search news</span>
            <input v-model="query" type="search" placeholder="Search news" />
          </label>
        </div>

        <p class="visually-hidden" aria-live="polite">{{ results.length }} articles shown</p>

        <TransitionGroup v-if="results.length" name="list" tag="div" class="grid-3">
          <NewsCard v-for="a in results" :key="a.slug" :article="a" />
        </TransitionGroup>
        <div v-else class="empty">
          <p v-if="news.length">No articles match your search.</p>
          <p v-else>No news yet. Check back soon.</p>
          <button v-if="filtering" type="button" class="btn btn-outline btn-small" @click="reset">Clear filters</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { news, newsCategories } from '@/content'
import { usePageMeta } from '@/composables/usePageMeta'
import PageHero from '@/components/PageHero.vue'
import NewsCard from '@/components/NewsCard.vue'
import Icon from '@/components/Icon.vue'

usePageMeta({ title: 'News', description: 'News and updates from the FireRisk research project.' })

const category = ref(null)
const query = ref('')
const filtering = computed(() => !!category.value || !!query.value.trim())
const featured = news[0]

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = news.filter(
    (a) =>
      (!category.value || a.category === category.value) &&
      (!q || [a.title, a.excerpt, a.category, a.author].join(' ').toLowerCase().includes(q)),
  )
  // The featured article is shown above the grid when not filtering.
  return filtering.value ? list : list.filter((a) => a !== featured)
})

function reset() {
  category.value = null
  query.value = ''
}
</script>

<style scoped>
.featured-wrap {
  padding-bottom: clamp(3rem, 6vw, 5rem);
  margin-bottom: clamp(3rem, 6vw, 4.5rem);
  border-bottom: 1px solid var(--line);
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: clamp(2rem, 4vw, 3rem);
}
.search {
  position: relative;
  display: flex;
  align-items: center;
  width: min(100%, 300px);
}
.search .icon {
  position: absolute;
  left: 1rem;
  color: var(--ink-soft);
  pointer-events: none;
}
.search input {
  width: 100%;
  padding: 0.7rem 1rem 0.7rem 2.75rem;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--white);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}
.search input:focus {
  outline: none;
  border-color: var(--charcoal);
}
.empty {
  padding: 4rem 0;
  text-align: center;
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
