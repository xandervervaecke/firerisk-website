<template>
  <svg class="logo-mark" viewBox="0 0 32 32" :width="size" :height="size" aria-hidden="true">
    <defs>
      <linearGradient :id="id" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#e66b35" />
        <stop offset="1" stop-color="#e9ac55" />
      </linearGradient>
    </defs>
    <path
      :fill="`url(#${id})`"
      d="M16.4 2.5c.7 4.1-1.6 6.4-3.6 8.6-2 2.2-3.9 4.3-3.9 8 0 4.4 3.3 8 7.3 8s7.3-3.4 7.3-7.7c0-3-1.4-5.2-3-7.1-.3 1.8-1.1 3.1-2.3 3.8.5-4.5-.5-9.5-1.8-13.6Zm-.3 15.1c.2 1.7 1.8 2.7 1.8 4.7 0 1.5-1 2.6-2.4 2.6s-2.4-1.1-2.4-2.6c0-1.9 1.8-2.7 3-4.7Z"
    />
  </svg>
</template>

<script setup>
defineProps({ size: { type: Number, default: 26 } })
const id = `flame-${Math.random().toString(36).slice(2, 8)}`
</script>
