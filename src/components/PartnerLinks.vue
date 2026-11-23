<template>
  <ul class="partner-links">
    <li v-for="id in ids" :key="id">
      <span class="chip">{{ (long ? getPartner(id)?.name : getPartner(id)?.short) || id }}</span>
    </li>
  </ul>
</template>

<script setup>
import { getPartner } from '@/content'

defineProps({ ids: { type: Array, default: () => [] }, long: Boolean })
</script>

<style scoped>
.partner-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chip {
  white-space: normal;
  border-radius: 6px;
  text-align: left;
}
</style>
