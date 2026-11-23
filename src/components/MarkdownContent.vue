<template>
  <div class="prose" v-html="html" @click="onClick" />
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({ html: { type: String, default: '' } })
const router = useRouter()
const base = import.meta.env.BASE_URL.replace(/\/$/, '')

// Internal links inside Markdown navigate with the router (no full page reload).
function onClick(event) {
  const link = event.target.closest('a[data-internal]')
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
  event.preventDefault()
  const href = link.getAttribute('href')
  router.push(base && href.startsWith(base) ? href.slice(base.length) || '/' : href)
}
</script>
