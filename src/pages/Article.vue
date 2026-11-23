<template>
  <NotFound v-if="!article" />
  <div v-else>
    <article>
      <PageHero
        :image="article.image"
        :image-small="article.imageSmall"
        :crumbs="[{ label: 'News', to: '/news' }, { label: article.category || 'Article' }]"
        :title="article.title"
        :lead="article.excerpt"
      >
        <p class="meta mono">
          <time :datetime="article.date">{{ formatDate(article.date) }}</time>
          <span v-if="article.author">{{ article.author }}</span>
          <span><Icon name="clock" :size="14" /> {{ article.readingMinutes }} min read</span>
        </p>
      </PageHero>

      <div class="section">
        <div class="container narrow">
          <MarkdownContent :html="article.html" />
          <div class="back">
            <RouterLink to="/news" class="text-link"><Icon name="arrow-left" :size="16" /> All news</RouterLink>
          </div>
        </div>
      </div>
    </article>

    <section v-if="more.length" class="section more bg-paper-2" aria-labelledby="more-title">
      <div class="container">
        <h2 id="more-title" class="h3 more-title">More news</h2>
        <div class="grid-3">
          <NewsCard v-for="a in more" :key="a.slug" :article="a" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getArticle, news } from '@/content'
import { usePageMeta } from '@/composables/usePageMeta'
import { formatDate } from '@/composables/utils'
import PageHero from '@/components/PageHero.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import NewsCard from '@/components/NewsCard.vue'
import Icon from '@/components/Icon.vue'
import NotFound from './NotFound.vue'

const route = useRoute()
const article = computed(() => getArticle(route.params.slug))
const more = computed(() => news.filter((a) => a !== article.value).slice(0, 3))

usePageMeta(() =>
  article.value
    ? { title: article.value.title, description: article.value.excerpt, image: article.value.image, type: 'article' }
    : { title: 'Page not found', noindex: true },
)
</script>

<style scoped>
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--on-dark-muted);
}
.meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.back {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--line);
}
.more-title {
  margin-bottom: 2.5rem;
}
</style>
