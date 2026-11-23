<template>
  <section class="not-found on-dark">
    <div class="glow" aria-hidden="true" />
    <div class="container">
      <p class="code mono">404</p>
      <h1 class="h1">This trail has gone cold.</h1>
      <p class="lead">
        The page you are looking for does not exist or has moved. Try one of these instead:
      </p>
      <ul class="routes">
        <li><RouterLink to="/" class="btn">Home <Icon name="arrow-up-right" :size="18" /></RouterLink></li>
        <li><RouterLink to="/research" class="btn btn-ghost">Research</RouterLink></li>
        <li><RouterLink to="/team" class="btn btn-ghost">Team</RouterLink></li>
        <li><RouterLink to="/news" class="btn btn-ghost">News</RouterLink></li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { usePageMeta } from '@/composables/usePageMeta'
import Icon from '@/components/Icon.vue'

usePageMeta({ title: 'Page not found', noindex: true })
</script>

<style scoped>
.not-found {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 92vh;
  padding: calc(var(--header-h) + 4rem) 0 5rem;
  background: var(--charcoal);
  overflow: hidden;
  isolation: isolate;
}
.glow {
  position: absolute;
  inset: auto -20% -50% 30%;
  height: 100%;
  z-index: -1;
  background: radial-gradient(closest-side, rgba(230, 107, 53, 0.28), rgba(233, 172, 85, 0.06) 60%, transparent);
  animation: flicker 5s ease-in-out infinite;
}
.code {
  margin: 0 0 1rem;
  font-size: clamp(4rem, 14vw, 9rem);
  line-height: 1;
  letter-spacing: -0.04em;
  background: linear-gradient(180deg, var(--gold), var(--fire));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.lead {
  margin: 1.5rem 0 2.25rem;
}
.routes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
@keyframes flicker {
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}
</style>
