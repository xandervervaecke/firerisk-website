<template>
  <RouterLink :to="`/news/${article.slug}`" class="news-card" :class="{ featured }">
    <div class="media">
      <SmartImage
        v-if="article.image"
        :src="article.image"
        :small="article.imageSmall"
        :alt="article.image_alt || ''"
        :sizes="featured ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 700px) 100vw, 33vw'"
      />
    </div>
    <div class="body">
      <p class="meta">
        <span v-if="article.category" class="cat">{{ article.category }}</span>
        <time :datetime="article.date">{{ formatDate(article.date) }}</time>
      </p>
      <component :is="featured ? 'h2' : 'h3'" class="title">{{ article.title }}</component>
      <p v-if="article.excerpt" class="excerpt">{{ article.excerpt }}</p>
      <span class="more">Read article <Icon name="arrow-up-right" :size="18" /></span>
    </div>
  </RouterLink>
</template>

<script setup>
import { formatDate } from '@/composables/utils'
import SmartImage from './SmartImage.vue'
import Icon from './Icon.vue'

defineProps({ article: { type: Object, required: true }, featured: Boolean })
</script>

<style scoped>
.news-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.media {
  aspect-ratio: 3 / 2;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--forest-deep);
}
.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s var(--ease);
}
.news-card:hover .media img {
  transform: scale(1.05);
}
.body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-top: 1.25rem;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.cat {
  color: var(--forest);
  font-weight: 500;
}
.cat::after {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  margin-left: 0.75rem;
  border-radius: 50%;
  background: currentColor;
  vertical-align: middle;
  opacity: 0.5;
}
.title {
  font-size: 1.35rem;
  letter-spacing: -0.025em;
  line-height: 1.2;
  transition: color 0.2s;
}
.news-card:hover .title {
  color: var(--fire-ink);
}
.excerpt {
  margin: 0.75rem 0 0;
  font-size: 0.95rem;
  color: var(--ink-muted);
  line-height: 1.55;
}
.more {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: auto;
  padding-top: 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--forest-deep);
}
.more .icon {
  transition: transform 0.35s var(--ease);
}
.news-card:hover .more .icon {
  transform: translate(3px, -3px);
}

/* Featured: large horizontal card */
.featured {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  align-items: center;
}
.featured .media {
  aspect-ratio: 16 / 10;
}
.featured .title {
  font-size: clamp(1.8rem, 3.4vw, 2.8rem);
  letter-spacing: -0.035em;
  line-height: 1.05;
}
.featured .excerpt {
  font-size: 1.1rem;
  max-width: 46ch;
}
.featured .more {
  margin-top: 1.75rem;
  padding-top: 0;
}
@media (min-width: 900px) {
  .featured {
    grid-template-columns: 1.35fr 1fr;
  }
  .featured .body {
    padding-top: 0;
  }
}
</style>
