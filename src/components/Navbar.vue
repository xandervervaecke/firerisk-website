<template>
  <header class="site-header" :class="{ solid: scrolled || open, open }">
    <div class="container bar">
      <RouterLink to="/" class="brand" aria-label="FireRisk home">
        <LogoMark :size="26" />
        <span>FireRisk</span>
      </RouterLink>

      <nav class="nav" aria-label="Main navigation">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ active: isActive(link.to) }"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="mobile-menu"
        @click="open = !open"
      >
        <span class="visually-hidden">{{ open ? 'Close menu' : 'Open menu' }}</span>
        <Icon :name="open ? 'close' : 'menu'" :size="24" />
      </button>
    </div>

    <Transition name="menu">
      <nav v-if="open" id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation">
        <div class="container">
          <RouterLink
            v-for="(link, i) in links"
            :key="link.to"
            :to="link.to"
            class="mobile-link"
            :class="{ active: isActive(link.to) }"
            :style="{ '--i': i }"
          >
            <span class="mono">0{{ i + 1 }}</span>
            {{ link.label }}
          </RouterLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import LogoMark from './LogoMark.vue'
import Icon from './Icon.vue'

const links = [
  { to: '/', label: 'Home' },
  { to: '/research', label: 'Research' },
  { to: '/team', label: 'Team' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
]

const route = useRoute()
const open = ref(false)
const scrolled = ref(false)

const isActive = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
const onScroll = () => (scrolled.value = window.scrollY > 24)
const onKey = (e) => e.key === 'Escape' && (open.value = false)

watch(() => route.fullPath, () => (open.value = false))
watch(open, (value) => document.documentElement.classList.toggle('menu-open', value))

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  color: var(--on-dark);
  transition: background-color 0.4s var(--ease), box-shadow 0.4s var(--ease), backdrop-filter 0.4s;
}
.site-header.solid {
  background: rgba(23, 27, 25, 0.86);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  box-shadow: 0 1px 0 var(--line-dark);
}
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-h);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  font-weight: 650;
  letter-spacing: -0.035em;
}
.nav {
  display: none;
  gap: 0.25rem;
}
.nav-link {
  position: relative;
  padding: 0.55rem 0.9rem;
  font-size: 0.93rem;
  font-weight: 500;
  color: var(--on-dark-muted);
  transition: color 0.25s;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 0.9rem;
  right: 0.9rem;
  bottom: 0.25rem;
  height: 1.5px;
  background: var(--fire);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--ease);
}
.nav-link:hover,
.nav-link.active {
  color: var(--on-dark);
}
.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
}
.menu-toggle {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-right: -0.5rem;
  border: 0;
  background: transparent;
  color: inherit;
}
.mobile-menu {
  position: fixed;
  inset: var(--header-h) 0 0;
  background: var(--charcoal);
  padding-top: 2rem;
  overflow-y: auto;
}
.mobile-link {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--line-dark);
  font-size: clamp(2rem, 9vw, 2.8rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  color: var(--on-dark-muted);
  animation: slide-in 0.5s var(--ease) both;
  animation-delay: calc(var(--i) * 45ms);
}
.mobile-link .mono {
  font-size: 0.8rem;
  color: var(--gold);
  letter-spacing: 0.1em;
}
.mobile-link.active,
.mobile-link:hover {
  color: var(--on-dark);
}
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s var(--ease);
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
@media (min-width: 820px) {
  .nav {
    display: flex;
  }
  .menu-toggle,
  .mobile-menu {
    display: none;
  }
}
</style>
