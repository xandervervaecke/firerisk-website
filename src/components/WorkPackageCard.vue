<template>
  <RouterLink :to="`/research/${wp.slug}`" class="wp-card">
    <div class="media">
      <SmartImage v-if="wp.image" :src="wp.image" :small="wp.imageSmall" :alt="''" sizes="(max-width: 700px) 100vw, 33vw" />
      <span class="code mono">{{ wp.code }}</span>
    </div>
    <div class="body">
      <PhaseTag :phase="wp.phase" />
      <h3 class="title">{{ wp.short_title || wp.title }}</h3>
      <p class="full-title">{{ wp.title }}</p>
      <p class="summary">{{ wp.summary }}</p>
      <dl class="meta">
        <div>
          <dt>Lead</dt>
          <dd>{{ partnerShort(wp.lead) }}</dd>
        </div>
        <div>
          <dt>Partners</dt>
          <dd>{{ wp.allPartners ? 'All consortium partners' : wp.partners.map(partnerShort).join(' · ') }}</dd>
        </div>
        <div v-if="wp.theme">
          <dt>Theme</dt>
          <dd>{{ wp.theme }}</dd>
        </div>
      </dl>
      <span class="more">
        Read more <Icon name="arrow-up-right" :size="18" />
      </span>
    </div>
  </RouterLink>
</template>

<script setup>
import { getPartner } from '@/content'
import SmartImage from './SmartImage.vue'
import PhaseTag from './PhaseTag.vue'
import Icon from './Icon.vue'

defineProps({ wp: { type: Object, required: true } })
const partnerShort = (id) => getPartner(id)?.short || id
</script>

<style scoped>
.wp-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease), border-color 0.3s;
}
.wp-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: transparent;
}
.media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--forest-deep);
}
.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s var(--ease);
}
.wp-card:hover .media img {
  transform: scale(1.05);
}
.media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(23, 27, 25, 0.45), transparent 50%);
}
.code {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  background: var(--charcoal);
  color: var(--gold);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.08em;
}
.body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem 1.5rem 1.4rem;
}
.title {
  margin-top: 0.9rem;
  font-size: 1.45rem;
  letter-spacing: -0.025em;
}
.full-title {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: var(--ink-soft);
  line-height: 1.4;
}
.summary {
  margin: 1rem 0 1.25rem;
  font-size: 0.95rem;
  color: var(--ink-muted);
  line-height: 1.55;
}
.meta {
  display: grid;
  gap: 0.45rem;
  margin: auto 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
  font-size: 0.82rem;
}
.meta div {
  display: grid;
  grid-template-columns: 5.2rem 1fr;
  gap: 0.75rem;
}
.meta dt {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
  padding-top: 0.15em;
}
.meta dd {
  margin: 0;
  color: var(--ink);
  font-weight: 500;
}
.more {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--forest-deep);
}
.more .icon {
  transition: transform 0.35s var(--ease);
}
.wp-card:hover .more {
  color: var(--fire-ink);
}
.wp-card:hover .more .icon {
  transform: translate(3px, -3px);
}
</style>
