<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <Navbar />
  <main id="main" tabindex="-1">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
  <Footer />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<style>
main {
  display: block;
  min-height: 60vh;
  outline: none;
}
html.menu-open {
  overflow: hidden;
}
</style>
