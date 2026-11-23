<template>
  <img
    :src="asset(src)"
    :srcset="small ? `${asset(small)} 800w, ${asset(src)} 1600w` : undefined"
    :sizes="small ? sizes : undefined"
    :alt="alt"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : undefined"
    decoding="async"
  />
</template>

<script setup>
import { asset } from '@/composables/utils'

defineProps({
  src: { type: String, required: true },
  /** Optional 800px-wide variant, detected automatically for content images. */
  small: { type: String, default: '' },
  alt: { type: String, default: '' },
  sizes: { type: String, default: '(max-width: 800px) 100vw, 50vw' },
  eager: Boolean,
})
</script>
