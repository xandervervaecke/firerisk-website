<template>
  <section class="page-hero on-dark" :class="{ 'has-image': image, compact }">
    <div v-if="image" class="bg" aria-hidden="true">
      <SmartImage :src="image" :small="imageSmall" alt="" sizes="100vw" eager />
    </div>
    <svg class="contours" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
      <path v-for="i in 7" :key="i" :d="contour(i)" />
    </svg>
    <div class="container inner">
      <nav v-if="crumbs?.length" class="crumbs" aria-label="Breadcrumb">
        <template v-for="(c, i) in crumbs" :key="i">
          <RouterLink v-if="c.to" :to="c.to">{{ c.label }}</RouterLink>
          <span v-else aria-current="page">{{ c.label }}</span>
          <span v-if="i < crumbs.length - 1" class="sep" aria-hidden="true">/</span>
        </template>
      </nav>
      <p v-if="eyebrow" class="eyebrow on-dark hero-in">{{ eyebrow }}</p>
      <h1 class="h1 hero-in" style="--d: 0.08s"><slot name="title">{{ title }}</slot></h1>
      <p v-if="lead" class="lead hero-in" style="--d: 0.16s">{{ lead }}</p>
      <div v-if="$slots.default" class="extra hero-in" style="--d: 0.24s"><slot /></div>
    </div>
  </section>
</template>

<script setup>
import SmartImage from './SmartImage.vue'

defineProps({
  eyebrow: String,
  title: String,
  lead: String,
  image: String,
  imageSmall: String,
  compact: Boolean,
  crumbs: Array,
})

// Decorative topographic contour lines.
function contour(i) {
  const y = 40 + i * 48
  const a = 18 + i * 4
  return `M0 ${y} C 160 ${y - a}, 260 ${y + a}, 420 ${y} S 680 ${y - a * 1.4}, 800 ${y + 6}`
}
</script>

<style scoped>
.page-hero {
  position: relative;
  padding: calc(var(--header-h) + clamp(4rem, 10vw, 7.5rem)) 0 clamp(3.5rem, 7vw, 5.5rem);
  background: var(--charcoal);
  overflow: hidden;
  isolation: isolate;
}
.page-hero.compact {
  padding-bottom: clamp(2.5rem, 5vw, 4rem);
}
.page-hero.has-image {
  min-height: min(78vh, 720px);
  display: flex;
  align-items: flex-end;
}
.bg {
  position: absolute;
  inset: 0;
  z-index: -2;
}
.bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: settle 1.8s var(--ease) both;
}
.has-image::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(0deg, rgba(23, 27, 25, 0.95) 0%, rgba(23, 27, 25, 0.35) 65%, rgba(23, 27, 25, 0.55) 100%),
    linear-gradient(90deg, rgba(23, 27, 25, 0.7) 0%, rgba(23, 27, 25, 0) 70%);
}
.contours {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  fill: none;
  stroke: rgba(233, 172, 85, 0.09);
  stroke-width: 1;
}
.has-image .contours {
  display: none;
}
.inner {
  width: 100%;
}
.crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--on-dark-muted);
}
.crumbs a:hover {
  color: var(--gold);
}
.crumbs .sep {
  opacity: 0.4;
}
.eyebrow {
  margin-bottom: 1.5rem;
}
h1 {
  max-width: 18ch;
}
.lead {
  margin-top: 1.5rem;
  margin-bottom: 0;
}
.extra {
  margin-top: 2rem;
}
.hero-in {
  animation: rise 1s var(--ease) both;
  animation-delay: var(--d, 0s);
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
}
@keyframes settle {
  from {
    transform: scale(1.06);
  }
}
</style>
