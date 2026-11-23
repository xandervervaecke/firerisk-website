<template>
  <section class="hero on-dark" aria-labelledby="hero-title">
    <div class="media" aria-hidden="true">
      <img class="poster" :src="asset('/videos/hero-poster.webp')" alt="" fetchpriority="high" />
      <video
        v-if="videoSrc"
        ref="video"
        class="video"
        :src="videoSrc"
        :poster="asset('/videos/hero-poster.webp')"
        muted
        loop
        playsinline
        preload="metadata"
        @playing="playing = true"
        @pause="playing = false"
      />
    </div>
    <div class="overlay" aria-hidden="true" />

    <div class="container content">
      <p class="eyebrow on-dark hero-in" style="--d: 0.1s">Wildfire science · Flanders</p>
      <h1 id="hero-title" class="display">
        <span class="line hero-in" style="--d: 0.2s">Understanding wildfire risk.</span>
        <span class="line hero-in accent-line" style="--d: 0.32s">Building fire-resilient landscapes.</span>
      </h1>
      <p class="lead on-dark hero-in" style="--d: 0.45s">
        FireRisk connects geodata, fire spread modelling, immersive visualisation and crisis
        governance to help Flanders prevent, fight and recover from wildfires.
      </p>
      <div class="actions hero-in" style="--d: 0.58s">
        <RouterLink to="/research" class="btn">
          Explore the research <Icon name="arrow-up-right" :size="18" />
        </RouterLink>
        <a href="#science-loop" class="btn btn-ghost">How it fits together</a>
      </div>
    </div>

    <div class="container hero-foot">
      <a href="#about" class="scroll-cue">
        <Icon name="arrow-down" :size="16" /> Discover the project
      </a>
      <button
        v-if="videoSrc"
        type="button"
        class="video-toggle"
        :aria-label="playing ? 'Pause background video' : 'Play background video'"
        @click="toggle"
      >
        <Icon :name="playing ? 'pause' : 'play'" :size="16" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { asset } from '@/composables/utils'
import Icon from './Icon.vue'

const video = ref(null)
const videoSrc = ref('')
const playing = ref(false)

onMounted(() => {
  // Respect reduced-motion and data-saver preferences: keep the still poster.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = navigator.connection?.saveData
  if (reduce || saveData) return
  const small = window.matchMedia('(max-width: 900px)').matches
  videoSrc.value = asset(small ? '/videos/hero-wildfire-720.mp4' : '/videos/hero-wildfire.mp4')
  requestAnimationFrame(() => video.value?.play().catch(() => {}))
})

function toggle() {
  const v = video.value
  if (!v) return
  v.paused ? v.play() : v.pause()
}
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100svh;
  min-height: max(560px, 100svh);
  padding-top: calc(var(--header-h) + 1rem);
  background: var(--charcoal);
  overflow: hidden;
  isolation: isolate;
}
.media,
.overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
}
.poster,
.video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 70% center;
}
.video {
  animation: fade 1.6s var(--ease) both;
}
.overlay {
  background:
    linear-gradient(90deg, rgba(23, 27, 25, 0.9) 0%, rgba(23, 27, 25, 0.62) 42%, rgba(23, 27, 25, 0.1) 78%),
    linear-gradient(0deg, rgba(23, 27, 25, 0.85) 0%, rgba(23, 27, 25, 0) 38%),
    linear-gradient(180deg, rgba(23, 27, 25, 0.55) 0%, rgba(23, 27, 25, 0) 22%);
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-block: clamp(2rem, 6vh, 4rem);
}
.eyebrow {
  margin-bottom: clamp(0.9rem, 2.4vh, 1.5rem);
}
h1 {
  max-width: 17ch;
  font-size: clamp(2.3rem, min(5.4vw, 8.2vh), 5rem);
}
.line {
  display: block;
}
.accent-line {
  background: linear-gradient(90deg, var(--gold), var(--fire) 70%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.lead {
  margin-top: clamp(1rem, 2.8vh, 1.75rem);
  max-width: 54ch;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: clamp(1.25rem, 3.6vh, 2.25rem);
}
.hero-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: clamp(0.75rem, 2vh, 1.25rem);
  border-top: 1px solid var(--line-dark);
}
.scroll-cue {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--on-dark-muted);
  transition: color 0.2s;
}
.scroll-cue:hover {
  color: var(--on-dark);
}
.scroll-cue .icon {
  animation: bob 2.2s var(--ease) infinite;
}
.video-toggle {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line-dark);
  border-radius: 50%;
  background: rgba(23, 27, 25, 0.4);
  color: var(--on-dark);
  transition: background 0.2s;
}
.video-toggle:hover {
  background: rgba(244, 242, 236, 0.12);
}
.hero-in {
  animation: rise 1.1s var(--ease) both;
  animation-delay: var(--d, 0s);
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
@keyframes bob {
  50% {
    transform: translateY(4px);
  }
}
@media (max-width: 700px) {
  .overlay {
    background:
      linear-gradient(0deg, rgba(23, 27, 25, 0.95) 10%, rgba(23, 27, 25, 0.55) 60%, rgba(23, 27, 25, 0.5) 100%);
  }
}
</style>
